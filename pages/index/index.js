const game = require('../../utils/game.js');
const rules = require('../../utils/rules.js');

const C_POLAR_URL = 'https://xn--ihq8y051bo4fe8p58f8r5b.top/'; 

const AVATAR_FILES = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg',
  '5.jpg', '6.jpg', '7.jpg', '8.jpg'
];

const CHAT_MSGS = [
  "我要验牌！", "牌没有问题！", "给我擦皮鞋！", "神经病！",
  "奥里给！", "你是来拉屎的吧！", "开炮！", "救我，救我！"
];

const THEME_OPTIONS = [
  { id: 'classic_green', name: '经典牌桌', preview: 'radial-gradient(circle at center, #3c8d5a 0%, #1e5234 100%)', bg: 'radial-gradient(circle at center, #3c8d5a 0%, #1e5234 100%)' },
  { id: 'scifi_blue', name: '科幻风', preview: 'linear-gradient(135deg, #0b1f3a 0%, #103f6e 45%, #00acc1 100%)', bg: 'linear-gradient(135deg, #0b1f3a 0%, #103f6e 45%, #00acc1 100%)' },
  { id: 'cute_pink', name: '可爱风', preview: 'linear-gradient(135deg, #ffb6c1 0%, #ffa8f0 45%, #ffd6e8 100%)', bg: 'linear-gradient(135deg, #ffb6c1 0%, #ffa8f0 45%, #ffd6e8 100%)' },
  { id: 'minimal_light', name: '简约风', preview: 'linear-gradient(135deg, #f5f7fa 0%, #dfe9f3 100%)', bg: 'linear-gradient(135deg, #f5f7fa 0%, #dfe9f3 100%)' },
  { id: 'mono_bw', name: '黑白风', preview: 'linear-gradient(135deg, #111 0%, #555 45%, #e6e6e6 100%)', bg: 'linear-gradient(135deg, #111 0%, #555 45%, #e6e6e6 100%)' },
  { id: 'sunset_orange', name: '晚霞橙', preview: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)', bg: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)' },
  { id: 'neon_purple', name: '霓虹紫', preview: 'linear-gradient(135deg, #240046 0%, #5a189a 45%, #9d4edd 100%)', bg: 'linear-gradient(135deg, #240046 0%, #5a189a 45%, #9d4edd 100%)' },
  { id: 'forest_night', name: '森林夜色', preview: 'linear-gradient(135deg, #0b3d2e 0%, #145a32 50%, #1e8449 100%)', bg: 'linear-gradient(135deg, #0b3d2e 0%, #145a32 50%, #1e8449 100%)' },
  { id: 'ocean_cyan', name: '海洋青', preview: 'linear-gradient(135deg, #003973 0%, #007991 55%, #78ffd6 100%)', bg: 'linear-gradient(135deg, #003973 0%, #007991 55%, #78ffd6 100%)' },
  { id: 'golden_lux', name: '鎏金风', preview: 'linear-gradient(135deg, #2b1d0e 0%, #6f4e1f 45%, #d4af37 100%)', bg: 'linear-gradient(135deg, #2b1d0e 0%, #6f4e1f 45%, #d4af37 100%)' }
];

Page({
  data: {
    hasAuthorized: false, 
    isInRoom: false, roomId: '', isBotRoom: false,
    myCards: [], playedCards: [], players: [],
    status: 'waiting', isMyTurn: false, 
    lastMove: null, isNewRound: false, 
    leftPlayer: null, rightPlayer: null, topPlayer: null,
    hasShownGameOver: false, countdown: 30, isShuffling: false,
    msg: '',
    teams: {}, scores: {A:0, B:0}, pendingPoints: 0,
    myTeam: '', winnerTeam: null,
    teamsRevealed: false,
    myIndex: -1, isMyReady: false,
    turn: -1,
    myAvatar: '', myBase64Avatar: '', myName: '', myAction: '', myScore: 0,
    isBgmOn: true, isSfxOn: true, showSettings: false, cardCounter: [],
    chatMsgs: CHAT_MSGS, showChatMenu: false, activeChats: {}, myChatText: '',
    speakerOn: true, micOn: false, isRecordingVoice: false,
    lastPlayPos: '',

    myBeans: 0, // 👇 修改点：前端默认初始筹码改为0
    showCreateModal: false,
    roomConfig: { allowDouble: true, useCounter: true, bombNoDouble: false, turnTime: 99, maxCap: 'unlimited', rounds: 6 },
    roomSettings: null,
    currentMultiplier: 2,
    hasDoubled: false,
    myIsDouble: false,
    showCounter: true,
    themeOptions: THEME_OPTIONS,
    themeId: 'classic_green',
    themeStyle: 'background: radial-gradient(circle at center, #3c8d5a 0%, #1e5234 100%); background-size: cover; background-position: center;'
  },

  timer: null, bgm: null, effectAudio: null,
  recorderManager: null, voicePlayer: null,
  lastVoiceTime: 0, micLoopTimer: null, micLoopEnabled: false,
  lastPlayedCardIds: '', lastPassCount: 0,
  swipeStartIdx: -1, cardRects: [], lastChatTime: 0, isLeaving: false,

  onLoad() { 
    this.resetData(); 
    game.reset(); 
    const savedInfo = wx.getStorageSync('myGameInfo');
    let savedBeans = wx.getStorageSync('myBeans');
    // 👇 修改点：如果没有历史缓存，统统设为0
    if (savedBeans === '' || savedBeans === undefined || savedBeans === null) {
      savedBeans = 0; 
    }

    if (savedInfo) {
      this.setData({
        hasAuthorized: true, myAvatar: savedInfo.avatar,
        myBase64Avatar: savedInfo.base64, myName: savedInfo.name,
        myBeans: savedBeans
      });
    } else {
      wx.setStorageSync('myBeans', savedBeans);
      this.setData({ myBeans: savedBeans });
    }
    try {
        wx.setInnerAudioOption({ obeyMuteSwitch: false });
        this.initBGM(); 
        this.effectAudio = wx.createInnerAudioContext();
    } catch(e) {}

    const savedThemeId = wx.getStorageSync('themeId') || 'classic_green';
    this.applyTheme(savedThemeId, false);

    this.initVoice();
    game.listenVoice((voice) => this.handleVoiceMessage(voice));
    game.login().catch(e => console.log('连接中...'));
  },

  onUnload() {
    if (this.bgm) { this.bgm.stop(); this.bgm.destroy(); }
    if (this.effectAudio) { this.effectAudio.stop(); this.effectAudio.destroy(); }
    if (this.voicePlayer) { this.voicePlayer.stop(); this.voicePlayer.destroy(); }
    this.stopMicLoop();
    this.isLeaving = true;
    this.doLeave();
  },

  toggleCounter() {
    this.setData({ showCounter: !this.data.showCounter });
  },

  initBGM() {
    this.bgm = wx.createInnerAudioContext();
    this.bgm.src = C_POLAR_URL + 'bgm.mp3'; 
    this.bgm.loop = true; this.bgm.autoplay = true; 
    this.bgm.onCanplay(() => { if (this.data.isBgmOn) this.bgm.play(); });
  },

  openSettings() { this.setData({ showSettings: true }); },
  closeSettings() { this.setData({ showSettings: false }); },

  buildThemeStyle(themeId) {
    const theme = THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];
    return `background: ${theme.bg}; background-size: cover; background-position: center;`;
  },

  applyTheme(themeId, persist = true) {
    const theme = THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];
    this.setData({ themeId: theme.id, themeStyle: this.buildThemeStyle(theme.id) });
    if (persist) wx.setStorageSync('themeId', theme.id);
  },

  onSelectTheme(e) {
    const id = e.currentTarget.dataset.id;
    if (!id || id === this.data.themeId) return;
    this.applyTheme(id, true);
  },

  initVoice() {
    try {
      this.recorderManager = wx.getRecorderManager();
      this.voicePlayer = wx.createInnerAudioContext();
      this.recorderManager.onStop((res) => {
        this.setData({ isRecordingVoice: false });
        if (!res || !res.tempFilePath) {
          if (this.micLoopEnabled) this.scheduleMicRestart();
          return;
        }
        this.sendVoiceByFile(res.tempFilePath, res.duration || 0, false);
        if (this.micLoopEnabled) this.scheduleMicRestart();
      });
      this.recorderManager.onError(() => {
        this.setData({ isRecordingVoice: false, micOn: false });
        wx.showToast({ title: '录音失败', icon: 'none' });
      });
    } catch (e) {
      console.error('初始化语音失败', e);
    }
  },

  async ensureRecordPermission() {
    const auth = await new Promise((resolve) => {
      wx.getSetting({
        success: (s) => resolve(!!(s.authSetting && s.authSetting['scope.record'])),
        fail: () => resolve(false)
      });
    });
    if (auth) return true;
    return new Promise((resolve) => {
      wx.authorize({
        scope: 'scope.record',
        success: () => resolve(true),
        fail: () => resolve(false)
      });
    });
  },

  toggleSpeaker() {
    const next = !this.data.speakerOn;
    this.setData({ speakerOn: next });
    if (!next && this.voicePlayer) {
      try { this.voicePlayer.stop(); } catch (e) {}
    }
  },

  async toggleMic() {
    const next = !this.data.micOn;
    if (next) {
      const granted = await this.ensureRecordPermission();
      if (!granted) {
        wx.showToast({ title: '未开启麦克风权限', icon: 'none' });
        return;
      }
      this.micLoopEnabled = true;
      this.setData({ micOn: true });
      this.startMicLoop();
      return;
    }
    this.stopMicLoop();
  },

  scheduleMicRestart() {
    if (this.micLoopTimer) {
      clearTimeout(this.micLoopTimer);
      this.micLoopTimer = null;
    }
    this.micLoopTimer = setTimeout(() => this.startMicLoop(), 120);
  },

  startMicLoop() {
    if (!this.micLoopEnabled || !this.recorderManager || this.data.isRecordingVoice) return;
    this.setData({ isRecordingVoice: true });
    try {
      this.recorderManager.start({ format: 'mp3', duration: 3000, sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 48000 });
    } catch (e) {
      this.setData({ isRecordingVoice: false, micOn: false });
      wx.showToast({ title: '录音启动失败', icon: 'none' });
    }
  },

  stopMicLoop() {
    if (this.micLoopTimer) {
      clearTimeout(this.micLoopTimer);
      this.micLoopTimer = null;
    }
    this.micLoopEnabled = false;
    this.setData({ micOn: false });
    if (!this.data.isRecordingVoice || !this.recorderManager) return;
    try { this.recorderManager.stop(); } catch (e) { this.setData({ isRecordingVoice: false }); }
  },

  sendVoiceByFile(tempFilePath, duration, playLocal = false) {
    try {
      if ((duration || 0) < 300) return;
      const fs = wx.getFileSystemManager();
      const base64 = fs.readFileSync(tempFilePath, 'base64');
      game.sendVoice({ audioBase64: base64, duration: Math.round((duration || 0) / 1000), time: Date.now(), format: 'mp3' });
      if (playLocal && this.data.speakerOn) this.playVoice(tempFilePath);
    } catch (e) {
      wx.showToast({ title: '语音发送失败', icon: 'none' });
    }
  },

  handleVoiceMessage(voice) {
    if (!voice || !this.data.speakerOn) return;
    const voiceTime = voice.time || Date.now();
    if (voiceTime <= this.lastVoiceTime) return;
    this.lastVoiceTime = voiceTime;

    if (voice.audioUrl) {
      this.playVoice(voice.audioUrl);
      return;
    }

    if (voice.audioBase64) {
      try {
        const ext = voice.format === 'aac' ? 'aac' : 'mp3';
        const filePath = `${wx.env.USER_DATA_PATH}/voice_${Date.now()}.${ext}`;
        wx.getFileSystemManager().writeFile({
          filePath,
          data: voice.audioBase64,
          encoding: 'base64',
          success: () => this.playVoice(filePath)
        });
      } catch (e) {
        console.error('语音解码失败', e);
      }
    }
  },

  playVoice(path) {
    if (!path || !this.data.speakerOn) return;
    if (!this.voicePlayer) this.voicePlayer = wx.createInnerAudioContext();
    try {
      this.voicePlayer.stop();
      this.voicePlayer.src = path;
      this.voicePlayer.play();
    } catch (e) {
      console.error('播放语音失败', e);
    }
  },

  toggleBgm(e) {
    const nextState = e.detail.value;
    this.setData({ isBgmOn: nextState });
    if (this.bgm) { if (nextState) this.bgm.play(); else this.bgm.pause(); }
  },
  toggleSfx(e) { this.setData({ isSfxOn: e.detail.value }); },

  getRandomAvatar() {
    const idx = Math.floor(Math.random() * AVATAR_FILES.length);
    return C_POLAR_URL + 'avatars/' + AVATAR_FILES[idx];
  },

  onChooseAvatar(e) {
    const tempUrl = e.detail.avatarUrl;
    this.setData({ myAvatar: tempUrl });
    const fs = wx.getFileSystemManager();
    try {
      const base64 = fs.readFileSync(tempUrl, 'base64');
      this.setData({ myBase64Avatar: 'data:image/jpeg;base64,' + base64 });
    } catch (error) { console.error('头像转码失败', error); }
  },

  onInputName(e) { this.setData({ myName: e.detail.value }); },

  enterGame() {
    const avatar = this.data.myBase64Avatar || this.getRandomAvatar();
    const name = this.data.myName || ('玩家' + Math.floor(Math.random()*100));
    wx.setStorageSync('myGameInfo', { avatar: this.data.myAvatar, base64: avatar, name: name });
    this.setData({ hasAuthorized: true, myBase64Avatar: avatar, myName: name });
  },

  openCreateModal() { this.setData({ showCreateModal: true }); },
  closeCreateModal() { this.setData({ showCreateModal: false }); },
  onRuleChange(e) {
    const vals = e.detail.value;
    this.setData({ 'roomConfig.allowDouble': vals.includes('allowDouble'), 'roomConfig.useCounter': vals.includes('useCounter'), 'roomConfig.bombNoDouble': vals.includes('bombNoDouble') });
  },
  onTimeChange(e) { this.setData({ 'roomConfig.turnTime': parseInt(e.detail.value) }); },
  onCapChange(e) { this.setData({ 'roomConfig.maxCap': e.detail.value }); },
  onRoundChange(e) { this.setData({ 'roomConfig.rounds': parseInt(e.detail.value) }); },

  confirmCreateRoom() {
    this.closeCreateModal();
    this.doCreateStep({ nickName: this.data.myName, avatarUrl: this.data.myBase64Avatar, beans: this.data.myBeans, settings: this.data.roomConfig });
  },

  createBot() { this.doCreateBotStep({ nickName: this.data.myName, avatarUrl: this.data.myBase64Avatar, beans: this.data.myBeans, settings: this.data.roomConfig }); },
  async doCreateBotStep(userInfo) {
    wx.showLoading({ title: '召唤AI中' });
    try { const rid = await game.createBotRoom(userInfo); this.enter(rid); } 
    catch(e) { wx.showToast({ title: '连接失败', icon:'none' }); }
    wx.hideLoading();
  },

  create() { this.openCreateModal(); },
  async doCreateStep(userInfo) {
    wx.showLoading({ title: '创建中' });
    try { const rid = await game.createRoom(userInfo); this.enter(rid); } 
    catch(e) { wx.showToast({ title: '连接失败', icon:'none' }); }
    wx.hideLoading();
  },

  join() {
    wx.showModal({
      editable: true, title: '输入房号', placeholderText: '4位数字',
      success: (res) => { 
        if(res.confirm && res.content) { this.doJoinStep(res.content, { nickName: this.data.myName, avatarUrl: this.data.myBase64Avatar, beans: this.data.myBeans }); } 
      }
    })
  },
  async doJoinStep(rid, userInfo) {
     wx.showLoading({ title: '查找中' });
     try { await game.joinRoom(rid, userInfo); this.enter(rid); wx.hideLoading(); } 
     catch(e) { wx.hideLoading(); wx.showToast({ title: '加入失败', icon: 'none' }); }
  },
  
  resetData() {
    if(this.timer) clearInterval(this.timer);
    this.lastPlayedCardIds = ''; this.lastPassCount = 0; this.swipeStartIdx = -1; this.cardRects = []; this.lastChatTime = 0;
    this.setData({
      isInRoom: false, roomId: '', isBotRoom: false, players: [], status: 'waiting', 
      myCards: [], playedCards: [], leftPlayer: null, rightPlayer: null, topPlayer: null,
      msg: '', isShuffling: false, teams: {}, scores: {A:0, B:0}, pendingPoints: 0, teamsRevealed: false,
      myIndex: -1, isMyReady: false, turn: -1, myAction: '', myScore: 0,
      showSettings: false, cardCounter: [], showChatMenu: false, activeChats: {}, myChatText: '', speakerOn: true, micOn: false, isRecordingVoice: false, lastPlayPos: '',
      currentMultiplier: 2, hasDoubled: false, myIsDouble: false, showCounter: true
    });
  },

  playSoundByName(fileName) {
    if (!this.data.isSfxOn || !fileName) return;
    if (!this.effectAudio) this.effectAudio = wx.createInnerAudioContext();
    this.effectAudio.stop(); 
    this.effectAudio.src = C_POLAR_URL + fileName; 
    this.effectAudio.play(); 
  },

  playSound(lastMove) {
    if (!lastMove || !lastMove.type) return;
    let fileName = ''; const { type } = lastMove;
    if (type === 'single' || type === 'pair') fileName = 'chupai.mp3'; 
    else if (type === 'trio') fileName = 'sanzhang.mp3';
    else if (type === 'trio_solo') fileName = 'sandaiyi.mp3';
    else if (type === 'trio_two') fileName = 'sandaier.mp3';
    else if (type === 'straight') fileName = 'shunzi.mp3';
    else if (type === 'liandui') fileName = 'liandui.mp3';
    else if (type === 'bomb' || type === '510k_mixed' || type === '510k_pure') fileName = 'zhadan.mp3';
    else if (type === 'rocket') fileName = 'wangzha.mp3';
    this.playSoundByName(fileName);
  },

  toggleChatMenu() { this.setData({ showChatMenu: !this.data.showChatMenu }); },
  sendChat(e) {
    game.sendChat(e.currentTarget.dataset.idx);
    this.setData({ showChatMenu: false });
  },

  async doReady() {
    this.setData({ hasShownGameOver: false });
    wx.showLoading({ title: '准备中' });
    try { await game.ready(); } catch (e) { wx.showToast({ title: '失败', icon: 'none' }); }
    wx.hideLoading();
  },

  doDouble() {
    try {
      wx.sendSocketMessage({ data: JSON.stringify({ event: 'double', data: { roomId: this.data.roomId, isDouble: true } }) });
    } catch(e) {}
  },
  
  doNotDouble() {
    try {
      wx.sendSocketMessage({ data: JSON.stringify({ event: 'double', data: { roomId: this.data.roomId, isDouble: false } }) });
    } catch(e) {}
  },

  async doLeave() {
    this.setData({ showSettings: false, showChatMenu: false });
    await game.leaveRoom();
    this.resetData();
    this.isLeaving = false;
  },

  enter(rid) {
    this.setData({ isInRoom: true, roomId: rid, hasShownGameOver: false });
    let lastTurn = -1;

    game.listen((room, myIdx) => {
      if (!room || myIdx === -1) {
        if (!this.isLeaving) {
          wx.showToast({ title: '连接中断，正在恢复', icon: 'none' });
          game.login().then(() => {
            if (this.data.roomId) {
              game.send('rejoin', { roomId: this.data.roomId, name: this.data.myName, avatarUrl: this.data.myBase64Avatar });
            }
          }).catch(() => {});
          return;
        }
        wx.showToast({ title: '已退出', icon: 'none' });
        this.resetData();
        return;
      }
      
      const myOpenid = room.players[myIdx] ? room.players[myIdx].openid : null;
      if (room.players[myIdx] && room.players[myIdx].beans !== undefined) {
         this.setData({ myBeans: room.players[myIdx].beans });
         wx.setStorageSync('myBeans', room.players[myIdx].beans);
      }

      if (room.lastChat && room.lastChat.time > this.lastChatTime) {
          this.lastChatTime = room.lastChat.time;
          const msgIdx = room.lastChat.msgIndex;
          const speakerOpenid = room.lastChat.openid;
          const text = this.data.chatMsgs[msgIdx];
          this.playSoundByName(`chat${msgIdx + 1}.mp3`);
          if (speakerOpenid === myOpenid) {
              this.setData({ myChatText: text }); setTimeout(() => { this.setData({ myChatText: '' }); }, 3000);
          } else {
              this.setData({ [`activeChats.${speakerOpenid}`]: text }); setTimeout(() => { this.setData({ [`activeChats.${speakerOpenid}`]: '' }); }, 3000);
          }
      }

      if (room.status === 'shuffling') {
        this.setData({ isShuffling: true, msg: '洗牌中...', playedCards: [], cardCounter: [] }); return;
      } else { this.setData({ isShuffling: false }); }

      if (room.status === 'gameover' && !this.data.hasShownGameOver) {
        clearInterval(this.timer); this.setData({ hasShownGameOver: true });
        let teamAName = '有王队', teamBName = '无王队';
        if (room.teams) {
          let teamACount = Object.values(room.teams).filter(t => t === 'A').length;
          if (teamACount === 1) { teamAName = '双王队'; teamBName = '无王队'; }
          else if (teamACount === 3) { teamAName = '无王队'; teamBName = '双王队'; }
        }
        const myFinalTeam = room.teams ? room.teams[myOpenid] : null;
        let winText = room.winnerTeam === 'Draw' ? '平局！' : (myFinalTeam === room.winnerTeam ? '🎉 你们赢了！' : '😭 你们输了...');
        winText += `\n比分 ${teamAName}:${room.scores.A}  ${teamBName}:${room.scores.B}`;
        
        let beanChange = 0;
        if(room.players[myIdx] && room.players[myIdx].beanChange !== undefined) {
           beanChange = room.players[myIdx].beanChange;
           winText += `\n${beanChange >= 0 ? '赢取' : '扣除'} 筹码: ${Math.abs(beanChange)}`;
        }
        
        wx.showModal({ title: '游戏结束', content: winText, cancelText: '退出', confirmText: '继续', success: (res) => { if (res.confirm) this.doReady(); else this.doLeave(); } });
        return;
      }

      if (room.status === 'playing' && room.turn !== lastTurn) {
        lastTurn = room.turn; clearInterval(this.timer); 
        const turnTime = room.settings ? room.settings.turnTime : 30;
        this.setData({ countdown: turnTime, roomSettings: room.settings }); 
        this.timer = setInterval(() => {
          let t = this.data.countdown;
          if (t > 0) this.setData({ countdown: t - 1 });
          else { clearInterval(this.timer); if (room.turn === myIdx) this.handleTimeout(room.status, this.data.isNewRound); }
        }, 1000);
      }

      if (room.status === 'playing') {
        const currentIds = (room.playedCards || []).map(c => c.id).join(',');
        let someonePassed = false;
        if (currentIds !== '' && currentIds !== this.lastPlayedCardIds) { this.playSound(room.lastMove); } 
        else if (room.passCount > this.lastPassCount) { someonePassed = true; }
        else if (currentIds === '' && this.lastPlayedCardIds !== '') { someonePassed = true; }
        if (someonePassed) this.playSoundByName('buyao.mp3');
        this.lastPlayedCardIds = currentIds; this.lastPassCount = room.passCount || 0;
      }

      let counterData = [];
      if ((room.status === 'playing' || room.status === 'doubling') && room.hands && room.settings && room.settings.useCounter) {
          const counterObj = {
              '17': { disp: '大王', count: 0 }, '16': { disp: '小王', count: 0 },
              '15': { disp: '2', count: 0 }, '14': { disp: 'A', count: 0 },
              '13': { disp: 'K', count: 0 }, '12': { disp: 'Q', count: 0 },
              '11': { disp: 'J', count: 0 }, '10': { disp: '10', count: 0 },
              '9': { disp: '9', count: 0 }, '8': { disp: '8', count: 0 },
              '7': { disp: '7', count: 0 }, '6': { disp: '6', count: 0 },
              '5': { disp: '5', count: 0 }, '4': { disp: '4', count: 0 }, '3': { disp: '3', count: 0 }
          };
          for (let i = 0; i < 4; i++) {
              if (i !== myIdx && room.hands[i]) room.hands[i].forEach(c => { if (counterObj[c.value]) counterObj[c.value].count++; });
          }
          const order = [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3];
          counterData = order.map(v => counterObj[v]);
      }

      const isTurn = (room.turn === myIdx);
      const lm = room.lastMove || {};
      const isNewRound = (lm.openid === myOpenid) || !lm.type;
      
      let tip = '';
      if (room.status === 'waiting') tip = `等待中 (${room.players.length}/4)`;
      else if (room.status === 'doubling') tip = '请选择是否加倍...';
      else if (isTurn) tip = isNewRound ? '请出牌' : '管上!';

      const getP = (idx) => {
        if(!room.players[idx]) return { name:'...', avatarUrl:'', count:0, score:0, action:'', chatText: '', beans: 0, isDouble: false, hasDoubled: false, isFriend: false };
        let p = room.players[idx];
        let name = p.name; if (room.status === 'waiting' && p.isReady) name += ' (已准备)';
        
        let isFriend = false;
        if (room.teamsRevealed && room.teams && myOpenid && p.openid !== myOpenid) {
            isFriend = room.teams[p.openid] === room.teams[myOpenid];
        }

        return { ...p, name: name, count: room.hands?.[idx]?.length||0, score: p.score || 0, beans: p.beans || 0, chatText: this.data.activeChats[p.openid] || '', isDouble: !!p.isDouble, hasDoubled: !!p.hasDoubled, isFriend: isFriend };
      };

      let playPos = '';
      if (lm && lm.openid) {
          if (lm.openid === myOpenid) playPos = 'bottom';
          else if (lm.openid === room.players[(myIdx + 3) % 4]?.openid) playPos = 'left';
          else if (lm.openid === room.players[(myIdx + 1) % 4]?.openid) playPos = 'right';
          else if (lm.openid === room.players[(myIdx + 2) % 4]?.openid) playPos = 'top';
      }

      const me = room.players[myIdx];

      this.setData({
        isBotRoom: room.isBotRoom || false, players: room.players, myIndex: myIdx,
        isMyReady: me ? me.isReady : false,
        myAction: me ? (me.action || '') : '', 
        myCards: this.processCardsWith510K(this.data.myCards, room.hands?.[myIdx] || []),
        playedCards: (isNewRound && isTurn) ? [] : (room.playedCards || []),
        status: room.status, isMyTurn: isTurn, msg: tip, lastMove: lm, isNewRound: isNewRound,
        teams: room.teams || {}, scores: room.scores || {A:0, B:0}, pendingPoints: room.pendingPoints || 0,
        myTeam: room.teams ? room.teams[myOpenid] : '', teamsRevealed: room.teamsRevealed || false, turn: room.turn,
        leftPlayer: getP((myIdx + 3) % 4), rightPlayer: getP((myIdx + 1) % 4), topPlayer: getP((myIdx + 2) % 4),
        myScore: me ? (me.score || 0) : 0, cardCounter: counterData,
        lastPlayPos: playPos, currentMultiplier: room.multiplier || 2,
        hasDoubled: me ? !!me.hasDoubled : false,
        myIsDouble: me ? !!me.isDouble : false
      }, () => {
        this.updateCardRects();
      });
    });
  },

  handleTimeout(status, isNewRound) {
    if (status === 'playing') {
      if (isNewRound) {
        const cards = this.data.myCards;
        if(cards.length) game.play([cards[cards.length-1]], {type:'single', val:cards[cards.length-1].value});
      } else this.doPass();
    }
  },

  processCardsWith510K(oldCards, newCards) {
    if (!newCards || newCards.length === 0) return [];
    let merged = newCards.map(c => {
      const oldC = (oldCards || []).find(o => o.id === c.id);
      if (oldC && oldC.selected) c.selected = true; return c;
    });
    let has5 = merged.some(c => c.value === 5); let has10 = merged.some(c => c.value === 10); let hasK = merged.some(c => c.value === 13);
    const has510K = has5 && has10 && hasK;
    merged.forEach(c => { c.is510k = has510K && (c.value === 5 || c.value === 10 || c.value === 13); });
    merged.sort((a, b) => { if (a.is510k && !b.is510k) return -1; if (!a.is510k && b.is510k) return 1; return b.value - a.value; });
    return merged;
  },

  onHandTouchStart(e) {
    if (e.touches.length === 0 || !this.cardRects || !this.cardRects.length) return;
    const touch = e.touches[0]; let idx = this.findCardIndex(touch.clientX, touch.clientY); this.swipeStartIdx = idx;
    if (idx !== -1) this.updatePendingRange(idx, idx);
  },
  onHandTouchMove(e) {
    if (this.swipeStartIdx === -1 || e.touches.length === 0) return;
    const touch = e.touches[0]; let idx = this.findCardIndex(touch.clientX, touch.clientY);
    if (idx !== -1) this.updatePendingRange(this.swipeStartIdx, idx);
  },
  onHandTouchEnd(e) {
    if (this.swipeStartIdx === -1) return;
    const cards = this.data.myCards; let changed = false;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].isPending) { cards[i].selected = !cards[i].selected; cards[i].isPending = false; changed = true; }
    }
    this.swipeStartIdx = -1;
    if (changed) { this.setData({ myCards: cards }, () => { this.updateCardRects(); }); }
  },

  findCardIndex(x, y) {
    for (let i = this.cardRects.length - 1; i >= 0; i--) {
      let r = this.cardRects[i];
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return i;
    }
    return -1;
  },
  updatePendingRange(start, end) {
    let min = Math.min(start, end); let max = Math.max(start, end); let cards = this.data.myCards; let changed = false;
    for (let i = 0; i < cards.length; i++) {
      let pending = (i >= min && i <= max);
      if (cards[i].isPending !== pending) { cards[i].isPending = pending; changed = true; }
    }
    if (changed) this.setData({ myCards: cards });
  },
  updateCardRects() {
    setTimeout(() => { wx.createSelectorQuery().selectAll('.my-card').boundingClientRect(rects => { this.cardRects = rects || []; }).exec(); }, 150);
  },

  doHint() {
    const res = rules.findBeatCards(this.data.myCards, this.data.isNewRound ? null : this.data.lastMove, this.data.myCards.filter(c => c.selected));
    if (!res) wx.showToast({ title: '没有能管上的牌', icon: 'none' });
    else { this.setData({ myCards: this.data.myCards.map(c => { c.selected = res.some(r => r.id === c.id); return c; }) }, () => { this.updateCardRects(); }); }
  },

  async doPass() {
    if (this.data.isNewRound) return wx.showToast({ title: '必须出牌', icon: 'none' });
    await game.pass();
  },

  async doPlay() {
    const selected = this.data.myCards.filter(c => c.selected);
    if (selected.length === 0) return wx.showToast({title:'请选牌',icon:'none'});
    const handType = rules.getHandType(selected);
    if (!handType || (!this.data.isNewRound && !rules.canBeat(this.data.lastMove, handType))) 
      return wx.showToast({title:!handType?'牌型不对':'管不上',icon:'none'});
    
    wx.showLoading({mask:true}); await game.play(selected, handType); wx.hideLoading();
  }
});