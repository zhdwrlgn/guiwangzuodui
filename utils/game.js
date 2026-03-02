// utils/game.js
let isConnected = false;
let connectingPromise = null;
let messageCallbacks = [];

module.exports = {
  openid: null, roomId: null, myIndex: -1, onRoomUpdate: null, onVoice: null,

  reset() {
    this.roomId = null; this.myIndex = -1; this.onRoomUpdate = null; this.onVoice = null;
    isConnected = false; connectingPromise = null; messageCallbacks = [];
  },

  async login() {
    if (isConnected) return 'connected';
    if (connectingPromise) return connectingPromise;

    connectingPromise = new Promise((resolve, reject) => {
      const url = 'wss://xn--ihq8y051bo4fe8p58f8r5b.top';
      console.log('正在连接:', url);
      wx.connectSocket({ url });

      wx.onSocketOpen(() => {
        console.log('== 服务器连接成功 ==');
        isConnected = true;
        const p = connectingPromise;
        connectingPromise = null;
        resolve('connected');
      });

      wx.onSocketError((res) => {
        console.error('连接错误:', res);
        isConnected = false;
        connectingPromise = null;
        reject(res);
      });

      wx.onSocketClose(() => {
        console.log('连接已断开');
        isConnected = false;
        connectingPromise = null;
      });

      wx.onSocketMessage((res) => {
        try {
          const msg = JSON.parse(res.data);
          const event = msg.event;
          const data = msg.data;
          console.log('收到消息:', event, data);

          if (event === 'joined') {
            this.roomId = data.roomId;
            this.myIndex = data.myIndex;
            const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
            if (idx !== -1) { messageCallbacks[idx].resolve(data); messageCallbacks.splice(idx, 1); }
          }
          if (event === 'roomUpdate' && this.onRoomUpdate) {
            this.onRoomUpdate(data, this.myIndex);
          }
          if (event === 'voice' && this.onVoice) {
            this.onVoice(data, this.myIndex);
          }
        } catch (e) { console.error('解析失败', e); }
      });
    });

    return connectingPromise;
  },

  send(event, data) {
    const packet = JSON.stringify({ event: event, data: data });
    if (isConnected) {
      wx.sendSocketMessage({ data: packet });
      return;
    }
    this.login().then(() => {
      wx.sendSocketMessage({ data: packet });
    }).catch((e) => {
      console.error('重连失败，消息未发送:', event, e);
    });
  },

  async createBotRoom(userInfo) {
    if (!isConnected) await this.login();
    this.send('createBotRoom', { name: userInfo.nickName, avatarUrl: userInfo.avatarUrl });
    return new Promise((resolve) => {
      messageCallbacks.push({ event: 'joined', resolve: (res) => resolve(res.roomId) });
    });
  },

  async createRoom(userInfo) {
    if (!isConnected) await this.login();
    this.send('createRoom', { name: userInfo.nickName, avatarUrl: userInfo.avatarUrl });
    return new Promise((resolve) => {
      messageCallbacks.push({ event: 'joined', resolve: (res) => resolve(res.roomId) });
    });
  },

  async joinRoom(rid, userInfo) {
    if (!isConnected) await this.login();
    this.send('joinRoom', { roomId: rid, name: userInfo.nickName, avatarUrl: userInfo.avatarUrl });
    return new Promise((resolve) => {
      messageCallbacks.push({ event: 'joined', resolve: () => resolve() });
    });
  },

  async ready() { this.send('ready', this.roomId); },
  listen(cb) { this.onRoomUpdate = cb; },
  listenVoice(cb) { this.onVoice = cb; },
  async play(cards, handType) { this.send('play', { roomId: this.roomId, cards, handType }); },
  async pass() { this.send('pass', { roomId: this.roomId }); },
  // 🌟 新增：发送语音快捷语
  async sendChat(msgIndex) { this.send('chat', { roomId: this.roomId, msgIndex }); },
  async sendVoice(payload) { this.send('voice', { roomId: this.roomId, ...payload }); },
  async leaveRoom() { wx.closeSocket(); this.reset(); }
};