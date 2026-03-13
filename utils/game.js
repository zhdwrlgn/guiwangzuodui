// utils/game.js
const WS_URL = 'wss://xn--ihq8y051bo4fe8p58f8r5b.top';
const HTTP_BASE_URL = 'https://xn--ihq8y051bo4fe8p58f8r5b.top';
const AUTH_STORAGE_KEY = 'gwzdAuth';

let isConnected = false;
let connectingPromise = null;
let messageCallbacks = [];
let latestRoomData = null; // 🌟 缓存最新的房间数据防丢失

function request({ url, method = 'GET', data = null, header = {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url, method, data, header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data || {});
        else reject(res.data || { message: `请求失败(${res.statusCode})` });
      },
      fail: reject
    });
  });
}

module.exports = {
  openid: null, roomId: null, myIndex: -1, onRoomUpdate: null,
  auth: null,

  reset() {
    this.roomId = null; this.myIndex = -1; this.onRoomUpdate = null;
    isConnected = false; connectingPromise = null; messageCallbacks = [];
    latestRoomData = null;
  },

  loadAuth() {
    if (this.auth) return this.auth;
    const saved = wx.getStorageSync(AUTH_STORAGE_KEY);
    this.auth = saved || null;
    return this.auth;
  },

  saveAuth(authData) {
    this.auth = authData || null;
    if (authData) wx.setStorageSync(AUTH_STORAGE_KEY, authData);
    else wx.removeStorageSync(AUTH_STORAGE_KEY);
    return this.auth;
  },

  clearAuth() { this.saveAuth(null); },
  getToken() {
    const auth = this.loadAuth();
    return auth && auth.token ? auth.token : '';
  },
  getCurrentUser() {
    const auth = this.loadAuth();
    return auth && auth.user ? auth.user : null;
  },

  async register(payload) {
    const res = await request({ url: `${HTTP_BASE_URL}/api/auth/register`, method: 'POST', data: payload });
    if (res && res.success && res.token && res.user) this.saveAuth({ token: res.token, user: res.user });
    return res;
  },

  async accountLogin(payload) {
    const res = await request({ url: `${HTTP_BASE_URL}/api/auth/login`, method: 'POST', data: payload });
    if (res && res.success && res.token && res.user) this.saveAuth({ token: res.token, user: res.user });
    return res;
  },

  async fetchMe() {
    const token = this.getToken();
    if (!token) return null;
    const res = await request({ url: `${HTTP_BASE_URL}/api/auth/me?token=${encodeURIComponent(token)}` });
    if (res && res.success && res.user) { this.saveAuth({ token, user: res.user }); return res.user; }
    return null;
  },

  async fetchProfile(userId) {
    if (!userId) return null;
    const res = await request({ url: `${HTTP_BASE_URL}/api/profile/${encodeURIComponent(userId)}` });
    return res && res.success ? res.profile : null;
  },

  async updateProfile(payload) {
    const token = this.getToken();
    if (!token) throw new Error('未登录');
    const res = await request({ url: `${HTTP_BASE_URL}/api/profile/update`, method: 'POST', data: { ...payload, token } });
    if (res && res.success && res.user) this.saveAuth({ token, user: res.user });
    return res;
  },

  async login() {
    if (isConnected) return 'connected';
    if (connectingPromise) return connectingPromise;

    connectingPromise = new Promise((resolve, reject) => {
      const url = WS_URL;
      console.log('正在连接:', url);
      wx.connectSocket({ url });

      wx.onSocketOpen(() => {
        console.log('== 服务器连接成功 ==');
        isConnected = true;
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

          // 🌟 核心修复 1：拦截服务器错误，直接向前端抛出真实原因（不再傻等 5 秒）
          if (event === 'error') {
            const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
            if (idx !== -1) {
              if (messageCallbacks[idx].reject) messageCallbacks[idx].reject(new Error(String(data)));
              messageCallbacks.splice(idx, 1);
            } else {
              wx.showToast({ title: String(data), icon: 'none' });
            }
          }

          if (event === 'joined') {
            this.roomId = data.roomId;
            this.myIndex = data.myIndex;
            const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
            if (idx !== -1) { 
              messageCallbacks[idx].resolve(data); 
              messageCallbacks.splice(idx, 1); 
            }
          }
          
          // 🌟 核心修复 2：缓存房间数据防时序丢失
          if (event === 'roomUpdate') {
            latestRoomData = data;
            if (this.onRoomUpdate) {
              this.onRoomUpdate(data, this.myIndex);
            }
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
    this.send('createBotRoom', {
      name: userInfo.nickName, avatarUrl: userInfo.avatarUrl,
      beans: userInfo.beans, settings: userInfo.settings, token: this.getToken()
    });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
        if (idx !== -1) messageCallbacks.splice(idx, 1);
        reject(new Error('请求超时'));
      }, 5000);
      messageCallbacks.push({ 
        event: 'joined', 
        resolve: (res) => { clearTimeout(timer); resolve(res.roomId); },
        reject: (err) => { clearTimeout(timer); reject(err); } // 绑定打断机制
      });
    });
  },

  async createRoom(userInfo) {
    if (!isConnected) await this.login();
    this.send('createRoom', {
      name: userInfo.nickName, avatarUrl: userInfo.avatarUrl,
      beans: userInfo.beans, settings: userInfo.settings, token: this.getToken()
    });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
        if (idx !== -1) messageCallbacks.splice(idx, 1);
        reject(new Error('请求超时'));
      }, 5000);
      messageCallbacks.push({ 
        event: 'joined', 
        resolve: (res) => { clearTimeout(timer); resolve(res.roomId); },
        reject: (err) => { clearTimeout(timer); reject(err); }
      });
    });
  },

  async joinRoom(rid, userInfo) {
    if (!isConnected) await this.login();
    this.send('joinRoom', {
      roomId: rid, name: userInfo.nickName, avatarUrl: userInfo.avatarUrl,
      beans: userInfo.beans, token: this.getToken()
    });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = messageCallbacks.findIndex(cb => cb.event === 'joined');
        if (idx !== -1) messageCallbacks.splice(idx, 1);
        reject(new Error('请求超时'));
      }, 5000);
      messageCallbacks.push({ 
        event: 'joined', 
        resolve: () => { clearTimeout(timer); resolve(); },
        reject: (err) => { clearTimeout(timer); reject(err); } // 核心：捕获服务器驳回
      });
    });
  },

  async ready() { this.send('ready', this.roomId); },
  
  listen(cb) { 
    this.onRoomUpdate = cb; 
    // 🌟 取出缓存防界面卡白屏
    if (latestRoomData && cb) {
      cb(latestRoomData, this.myIndex);
    }
  },
  async play(cards, handType) { this.send('play', { roomId: this.roomId, cards, handType }); },
  async pass() { this.send('pass', { roomId: this.roomId }); },
  async escapeRoom() { this.send('escape', { roomId: this.roomId, token: this.getToken() }); },
  async sendChat(msgIndex) { this.send('chat', { roomId: this.roomId, msgIndex }); },
  async leaveRoom() {
    if (this.roomId) this.send('leaveRoom', { roomId: this.roomId, token: this.getToken() });
    setTimeout(() => {
      wx.closeSocket();
      this.reset();
    }, 60);
  }
};