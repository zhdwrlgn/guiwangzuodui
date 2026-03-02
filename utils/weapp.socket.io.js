/**
 * weapp.socket.io.js
 * 适配微信小程序的 Socket.io 客户端
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      (global.io = factory());
}(this, (function() {
  'use strict';

  // 微信小程序 WebSocket 适配器
  const WxSocket = {
      connect: function(url) {
          return wx.connectSocket({ url: url, success: () => console.log('Connecting...') });
      },
      onOpen: function(cb) { wx.onSocketOpen(cb); },
      onMessage: function(cb) { wx.onSocketMessage(cb); },
      onClose: function(cb) { wx.onSocketClose(cb); },
      onError: function(cb) { wx.onSocketError(cb); },
      send: function(data) { wx.sendSocketMessage({ data: data }); },
      close: function() { wx.closeSocket(); }
  };

  // 简易版的 Socket.io 逻辑实现
  function Socket(url) {
      this.url = url.replace('https', 'wss').replace('http', 'ws');
      this.events = {};
      this.init();
  }

  Socket.prototype.init = function() {
      WxSocket.connect(this.url);
      WxSocket.onOpen(() => this.emit('connect'));
      WxSocket.onMessage((res) => {
          const msg = JSON.parse(res.data);
          if (this.events[msg.event]) {
              this.events[msg.event].forEach(cb => cb(msg.data));
          }
      });
      WxSocket.onClose(() => this.emit('disconnect'));
      WxSocket.onError((err) => this.emit('error', err));
  };

  Socket.prototype.on = function(event, cb) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(cb);
  };

  Socket.prototype.once = function(event, cb) {
      const wrapper = (data) => {
          cb(data);
          this.off(event, wrapper);
      };
      this.on(event, wrapper);
  };

  Socket.prototype.off = function(event, cb) {
      if (this.events[event]) {
          this.events[event] = this.events[event].filter(fn => fn !== cb);
      }
  };

  Socket.prototype.emit = function(event, data) {
      WxSocket.send(JSON.stringify({ event: event, data: data }));
  };

  Socket.prototype.disconnect = function() {
      WxSocket.close();
  };

  return function(url) {
      return new Socket(url);
  };
})));