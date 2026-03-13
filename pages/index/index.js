const game = require('../../utils/game.js');
const rules = require('../../utils/rules.js');

const C_POLAR_URL = 'https://xn--ihq8y051bo4fe8p58f8r5b.top/'; 

const AVATAR_FILES = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg',
  '5.jpg', '6.jpg', '7.jpg', '8.jpg'
];

const AVATAR_CHOICES = AVATAR_FILES.map(file => `${C_POLAR_URL}avatars/${file}`);

const CHAT_MSGS = [
  "我要验牌！", "牌没有问题！", "给我擦皮鞋！", "神经病！",
  "奥里给！", "你是来拉屎的吧！", "开炮！", "救我，救我！"
];

const SHOP_PRICE_MULTIPLIER = 50;

const SHOP_ITEMS = [
  { id: 'title_chip_master', name: '称号·筹码大师', desc: '展示为个人主页专属称号', price: 66, icon: '👑', category: 'title', rarity: 'rare', slot: 'title', value: '筹码大师' },
  { id: 'title_streak_lord', name: '称号·连胜领主', desc: '展示为个人主页专属称号', price: 96, icon: '🔥', category: 'title', rarity: 'epic', slot: 'title', value: '连胜领主' },
  { id: 'title_skybreaker', name: '称号·破空牌王', desc: '展示为个人主页专属称号', price: 86, icon: '⚡', category: 'title', rarity: 'rare', slot: 'title', value: '破空牌王' },
  { id: 'title_night_hunter', name: '称号·夜幕猎手', desc: '展示为个人主页专属称号', price: 108, icon: '🌙', category: 'title', rarity: 'epic', slot: 'title', value: '夜幕猎手' },
  { id: 'title_blaze_general', name: '称号·炎刃统帅', desc: '展示为个人主页专属称号', price: 118, icon: '🗡️', category: 'title', rarity: 'epic', slot: 'title', value: '炎刃统帅' },
  { id: 'title_fortune_king', name: '称号·鸿运牌皇', desc: '展示为个人主页专属称号', price: 76, icon: '🍀', category: 'title', rarity: 'rare', slot: 'title', value: '鸿运牌皇' },
  { id: 'title_supreme_ace', name: '称号·至尊王牌', desc: '展示为个人主页专属称号', price: 148, icon: '🏆', category: 'title', rarity: 'legend', slot: 'title', value: '至尊王牌' },

  { id: 'badge_lucky_cat', name: '徽章·招财猫', desc: '主页档案展示招财徽章', price: 28, icon: '🐱', category: 'badge', rarity: 'normal', slot: 'badge', value: '招财喵' },
  { id: 'badge_ace_star', name: '徽章·王牌星章', desc: '主页档案展示王牌星章', price: 52, icon: '⭐', category: 'badge', rarity: 'rare', slot: 'badge', value: '王牌星章' },
  { id: 'badge_iron_shield', name: '徽章·铁壁', desc: '主页档案展示防守徽章', price: 46, icon: '🛡️', category: 'badge', rarity: 'rare', slot: 'badge', value: '铁壁之印' },
  { id: 'badge_comet', name: '徽章·彗星', desc: '主页档案展示速度徽章', price: 62, icon: '☄️', category: 'badge', rarity: 'epic', slot: 'badge', value: '彗星突进' },
  { id: 'badge_royal_flower', name: '徽章·王庭花纹', desc: '主页档案展示尊贵徽章', price: 72, icon: '🌸', category: 'badge', rarity: 'epic', slot: 'badge', value: '王庭花纹' },
  { id: 'badge_lightning', name: '徽章·闪电印记', desc: '主页档案展示雷霆徽章', price: 58, icon: '⚡', category: 'badge', rarity: 'rare', slot: 'badge', value: '闪电印记' },
  { id: 'badge_crown_seal', name: '徽章·王冠封印', desc: '主页档案展示王冠徽章', price: 88, icon: '👑', category: 'badge', rarity: 'legend', slot: 'badge', value: '王冠封印' },

  { id: 'frame_gold_flash', name: '头像框·鎏金闪耀', desc: '个人主页头像框装饰', price: 88, icon: '✨', category: 'frame', rarity: 'epic', slot: 'frame', value: '鎏金闪耀' },
  { id: 'frame_neon_core', name: '头像框·霓虹核心', desc: '个人主页头像框装饰', price: 118, icon: '💠', category: 'frame', rarity: 'epic', slot: 'frame', value: '霓虹核心' },
  { id: 'frame_moon_ring', name: '头像框·月轮', desc: '个人主页头像框装饰', price: 96, icon: '🌕', category: 'frame', rarity: 'rare', slot: 'frame', value: '月轮流辉' },
  { id: 'frame_crystal_edge', name: '头像框·晶棱', desc: '个人主页头像框装饰', price: 106, icon: '🔷', category: 'frame', rarity: 'epic', slot: 'frame', value: '晶棱之界' },
  { id: 'frame_flame_border', name: '头像框·焰环', desc: '个人主页头像框装饰', price: 114, icon: '🔥', category: 'frame', rarity: 'epic', slot: 'frame', value: '焰环边界' },
  { id: 'frame_cloud_gold', name: '头像框·祥云金纹', desc: '个人主页头像框装饰', price: 124, icon: '☁️', category: 'frame', rarity: 'legend', slot: 'frame', value: '祥云金纹' },
  { id: 'frame_mecha_arc', name: '头像框·机甲弧光', desc: '个人主页头像框装饰', price: 136, icon: '🤖', category: 'frame', rarity: 'legend', slot: 'frame', value: '机甲弧光' },

  { id: 'effect_card_glow', name: '特效·星砂微光', desc: '牌手档案展示特效标签', price: 128, icon: '🌟', category: 'effect', rarity: 'legend', slot: 'effect', value: '星砂微光' },
  { id: 'effect_dragon_breath', name: '特效·龙焰轨迹', desc: '牌手档案展示特效标签', price: 168, icon: '🐉', category: 'effect', rarity: 'legend', slot: 'effect', value: '龙焰轨迹' },
  { id: 'effect_frost_trace', name: '特效·寒霜轨迹', desc: '牌手档案展示特效标签', price: 138, icon: '❄️', category: 'effect', rarity: 'epic', slot: 'effect', value: '寒霜轨迹' },
  { id: 'effect_thunder_ring', name: '特效·雷鸣光环', desc: '牌手档案展示特效标签', price: 148, icon: '⚡', category: 'effect', rarity: 'epic', slot: 'effect', value: '雷鸣光环' },
  { id: 'effect_blossom_rain', name: '特效·花雨流光', desc: '牌手档案展示特效标签', price: 132, icon: '🌸', category: 'effect', rarity: 'epic', slot: 'effect', value: '花雨流光' },
  { id: 'effect_void_wave', name: '特效·虚空波纹', desc: '牌手档案展示特效标签', price: 156, icon: '🌀', category: 'effect', rarity: 'legend', slot: 'effect', value: '虚空波纹' },
  { id: 'effect_solar_burst', name: '特效·曜日迸发', desc: '牌手档案展示特效标签', price: 176, icon: '☀️', category: 'effect', rarity: 'legend', slot: 'effect', value: '曜日迸发' }
];

const THEME_OPTIONS = [
  {
    id: 'classic_green',
    name: '鎏光牌桌',
    preview: 'radial-gradient(circle at center, #ffe28a 0%, #3f9962 18%, #1d5d3d 52%, #0c2618 100%)',
    bg: 'radial-gradient(circle at 50% 42%, rgba(255,228,138,0.16) 0%, rgba(255,228,138,0.05) 16%, rgba(255,228,138,0) 30%), radial-gradient(circle at center, #3f9962 0%, #1d5d3d 52%, #0c2618 100%)'
  },
  {
    id: 'scifi_blue',
    name: '星舰蓝域',
    preview: 'radial-gradient(circle at 50% 35%, #7fe7ff 0%, #174f86 30%, #0b1f3a 68%, #040b16 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(127,231,255,0.20) 0%, rgba(127,231,255,0.06) 18%, rgba(127,231,255,0) 34%), linear-gradient(135deg, #0f2a4d 0%, #174f86 38%, #0b1f3a 72%, #040b16 100%)'
  },
  {
    id: 'cute_pink',
    name: '蜜桃甜梦',
    preview: 'radial-gradient(circle at 50% 30%, #fff2b8 0%, #ffb7d8 22%, #d77dca 58%, #7b3f88 100%)',
    bg: 'radial-gradient(circle at 50% 36%, rgba(255,242,184,0.24) 0%, rgba(255,242,184,0.08) 16%, rgba(255,242,184,0) 32%), linear-gradient(135deg, #ffbfd7 0%, #ffa0d8 32%, #d77dca 64%, #7b3f88 100%)'
  },
  {
    id: 'minimal_light',
    name: '晨雾银光',
    preview: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #eef3f8 26%, #cfd9e6 62%, #95a6bb 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.20) 18%, rgba(255,255,255,0) 34%), linear-gradient(135deg, #f8fbff 0%, #edf2f8 36%, #d7e0ea 70%, #9cadbf 100%)'
  },
  {
    id: 'mono_bw',
    name: '黑金夜幕',
    preview: 'radial-gradient(circle at 50% 34%, #f4d37b 0%, #535353 18%, #181818 56%, #050505 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(244,211,123,0.16) 0%, rgba(244,211,123,0.05) 14%, rgba(244,211,123,0) 30%), linear-gradient(135deg, #4e4e4e 0%, #2b2b2b 28%, #121212 60%, #050505 100%)'
  },
  {
    id: 'sunset_orange',
    name: '赤霞流金',
    preview: 'radial-gradient(circle at 50% 32%, #ffe08b 0%, #ff8a3d 22%, #e7426d 58%, #581845 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(255,224,139,0.20) 0%, rgba(255,224,139,0.06) 16%, rgba(255,224,139,0) 32%), linear-gradient(135deg, #ff8a3d 0%, #f45b42 30%, #d7266c 62%, #581845 100%)'
  },
  {
    id: 'neon_purple',
    name: '霓虹幻境',
    preview: 'radial-gradient(circle at 50% 34%, #ff98f7 0%, #8f5bff 24%, #41106e 58%, #12001f 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(255,152,247,0.18) 0%, rgba(255,152,247,0.06) 16%, rgba(255,152,247,0) 32%), linear-gradient(135deg, #2c0a47 0%, #5f189e 36%, #8f5bff 64%, #12001f 100%)'
  },
  {
    id: 'forest_night',
    name: '秘林夜色',
    preview: 'radial-gradient(circle at 50% 32%, #b7f7c5 0%, #208b55 22%, #114b33 58%, #061b13 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(183,247,197,0.18) 0%, rgba(183,247,197,0.06) 16%, rgba(183,247,197,0) 32%), linear-gradient(135deg, #0e3c2c 0%, #17633f 34%, #208b55 60%, #061b13 100%)'
  },
  {
    id: 'ocean_cyan',
    name: '深海极光',
    preview: 'radial-gradient(circle at 50% 32%, #c6fff1 0%, #35c9c8 24%, #006b87 58%, #032033 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(198,255,241,0.18) 0%, rgba(198,255,241,0.06) 16%, rgba(198,255,241,0) 32%), linear-gradient(135deg, #003b5c 0%, #006b87 36%, #1ba7a8 64%, #032033 100%)'
  },
  {
    id: 'golden_lux',
    name: '皇室鎏金',
    preview: 'radial-gradient(circle at 50% 30%, #fff3bf 0%, #d7b35a 24%, #6f4e1f 58%, #261708 100%)',
    bg: 'radial-gradient(circle at 50% 38%, rgba(255,243,191,0.22) 0%, rgba(255,243,191,0.08) 16%, rgba(255,243,191,0) 32%), linear-gradient(135deg, #3e2b11 0%, #6f4e1f 34%, #b18834 62%, #261708 100%)'
  }
];

Page({
  data: {
    hasAuthorized: false,
    hasAccountLogin: false,
    authMode: 'login',
    authUsername: '',
    authPassword: '',
    authLoading: false,
    authError: '',
    accountToken: '',
    accountUserId: '',
    accountProfile: null,
    isInRoom: false, roomId: '', isBotRoom: false,
    myCards: [], playedCards: [], players: [],
    status: 'waiting', isMyTurn: false, 
    lastMove: null, isNewRound: false, 
    leftPlayer: null, rightPlayer: null, topPlayer: null,
    hasShownGameOver: false, countdown: 30, isShuffling: false,
    msg: '', roundNo: 1, // <- 新增的局数
    teams: {}, scores: {A:0, B:0}, pendingPoints: 0,
    myTeam: '', winnerTeam: null,
    teamsRevealed: false,
    myIndex: -1, isMyReady: false,
    turn: -1,
    myAvatar: '', myBase64Avatar: '', myName: '', myAction: '', myScore: 0,
    isBgmOn: true, isSfxOn: true, showSettings: false, cardCounter: [],
    chatMsgs: CHAT_MSGS, showChatMenu: false, activeChats: {}, myChatText: '',
    lastPlayPos: '',
    roundPlayed: { bottom: [], left: [], top: [], right: [] },
    passFlags: { bottom: false, left: false, top: false, right: false },
    passToastText: '',
 
    myBeans: 0, 
    showCreateModal: false,
    avatarChoices: AVATAR_CHOICES,
    roomConfig: { allowDouble: true, useCounter: true, bombNoDouble: false, turnTime: 99, maxCap: 'unlimited', rounds: 6 },
    roomSettings: null,
    currentMultiplier: 2,
    hasDoubled: false,
    myIsDouble: false,
    showCounter: true,
    themeOptions: THEME_OPTIONS,
    themeId: 'classic_green',
    themeStyle: 'background: radial-gradient(circle at center, #3c8d5a 0%, #1e5234 100%); background-size: cover; background-position: center;',
    showProfilePanel: false,
    showShopModal: false,
    shopItems: SHOP_ITEMS.map(item => ({
      ...item,
      price: Number(item.price || 0) * SHOP_PRICE_MULTIPLIER
    })),
    visibleShopItems: SHOP_ITEMS.map(item => ({
      ...item,
      price: Number(item.price || 0) * SHOP_PRICE_MULTIPLIER
    })),
    shopTab: 'all',
    shopTabs: [
      { id: 'all', name: '全部' },
      { id: 'title', name: '称号' },
      { id: 'badge', name: '徽章' },
      { id: 'frame', name: '头像框' },
      { id: 'effect', name: '特效' }
    ],
    ownedShopItems: [],
    equippedShopItems: {
      title: '',
      badge: '',
      frame: '',
      effect: ''
    },
    profileId: 'GWZD-0000',
    profileName: '未命名牌手',
    profileAvatar: '',
    profileBeans: 0,
    profileTitle: '见习牌王',
    profileSignature: '先把牌打明白，再把气势打出来。',
    profileStats: {
      totalGames: 0,
      wins: 0,
      winRate: '0%',
      highestScore: 0,
      highestBeans: 0,
      mvpCount: 0
    },
    profileBadges: ['初入牌局', '鬼王新秀', '气势拉满'],
    profileShowcase: [
      { label: '主打风格', value: '稳中带炸' },
      { label: '当前主题', value: '鎏光牌桌' },
      { label: '偏爱模式', value: '好友对战' }
    ]
  },

  timer: null, bgm: null, effectAudio: null,
  lastPlayedCardIds: '', lastPassCount: 0,
  passFlagTimers: {},
  swipeStartIdx: -1, cardRects: [], lastChatTime: 0, isLeaving: false,

  async onLoad() {
    this.resetData();
    game.reset();
    const auth = game.loadAuth();
    if (auth && auth.token) {
      this.setData({
        hasAccountLogin: true,
        accountToken: auth.token,
        accountUserId: auth.user && auth.user.userId ? auth.user.userId : '',
        accountProfile: auth.user && auth.user.profile ? auth.user.profile : null
      });
      try {
        const me = await game.fetchMe();
        if (me) {
          this.setData({
            hasAccountLogin: true,
            accountToken: game.getToken(),
            accountUserId: me.userId || '',
            accountProfile: me.profile || null
          });
        }
      } catch (e) {
        game.clearAuth();
        this.setData({ hasAccountLogin: false, accountToken: '', accountUserId: '', accountProfile: null });
      }
    }
    const savedInfo = wx.getStorageSync('myGameInfo');
    let savedBeans = wx.getStorageSync('myBeans');
    if (savedBeans === '' || savedBeans === undefined || savedBeans === null) {
      savedBeans = 0; 
    }

    if (savedInfo) {
      this.setData({
        hasAuthorized: !!this.data.hasAccountLogin,
        myAvatar: savedInfo.avatar,
        myBase64Avatar: savedInfo.base64,
        myName: savedInfo.name,
        myBeans: savedBeans
      });
    } else {
      wx.setStorageSync('myBeans', savedBeans);
      this.setData({
        myBeans: savedBeans,
        hasAuthorized: !!this.data.hasAccountLogin
      });
    }
    if (this.data.hasAccountLogin && this.data.accountProfile) {
      this.setData({
        myName: this.data.accountProfile.nickname || this.data.myName,
        myAvatar: this.data.accountProfile.avatarUrl || this.data.myAvatar,
        myBase64Avatar: this.data.accountProfile.avatarUrl || this.data.myBase64Avatar,
        myBeans: Number(this.data.accountProfile.beans || this.data.myBeans || 0)
      });
    }
    this.setData(this.buildProfileData());
    try {
        wx.setInnerAudioOption({ obeyMuteSwitch: false });
        this.initBGM(); 
        this.effectAudio = wx.createInnerAudioContext();
    } catch(e) {}

    const savedThemeId = wx.getStorageSync('themeId') || 'classic_green';
    const ownedShopItems = wx.getStorageSync('shopOwnedItems');
    const equippedShopItems = wx.getStorageSync('shopEquippedItems');
    this.applyTheme(savedThemeId, false);
    if (Array.isArray(ownedShopItems)) {
      this.setData({ ownedShopItems });
    }
    if (equippedShopItems && typeof equippedShopItems === 'object') {
      this.setData({
        equippedShopItems: {
          title: equippedShopItems.title || '',
          badge: equippedShopItems.badge || '',
          frame: equippedShopItems.frame || '',
          effect: equippedShopItems.effect || ''
        }
      });
    }
game.login().catch(e => console.log('连接中...'));
  },

  onUnload() {
    if (this.bgm) { this.bgm.stop(); this.bgm.destroy(); }
    if (this.effectAudio) { this.effectAudio.stop(); this.effectAudio.destroy(); }
this.isLeaving = true;
    
    // 清理遗留定时器
    if (this.timer) clearInterval(this.timer);
    if (this.passFlagTimers.center) clearTimeout(this.passFlagTimers.center);

    game.leaveRoom();
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
  backToAuthPage() {
    this.setData({ hasAuthorized: false, showCreateModal: false, showSettings: false, authError: '' });
  },
  openProfilePanel(e) {
    const dataset = e && e.currentTarget ? e.currentTarget.dataset || {} : {};
    let profileSeed = null;
    if (dataset.seat) {
      if (dataset.seat === 'left') profileSeed = this.data.leftPlayer || null;
      else if (dataset.seat === 'right') profileSeed = this.data.rightPlayer || null;
      else if (dataset.seat === 'top') profileSeed = this.data.topPlayer || null;
    }
    const profileData = this.buildProfileData(this.latestRoomSnapshot || null, this.data.myIndex, profileSeed);
    this.setData({ showProfilePanel: true, ...profileData });
  },
  closeProfilePanel() { this.setData({ showProfilePanel: false }); },

  buildProfileData(room = null, myIdx = -1, targetPlayer = null) {
    const storageBeans = Number(wx.getStorageSync('myBeans') || 0);
    const isSelfProfile = !targetPlayer;
    const myPlayer = room && myIdx > -1 && room.players && room.players[myIdx] ? room.players[myIdx] : null;
    const basePlayer = targetPlayer || myPlayer || null;
    const playerProfile = basePlayer && basePlayer.profile ? basePlayer.profile : null;
    const accountProfile = isSelfProfile ? (this.data.accountProfile || null) : null;
    const resolvedProfile = accountProfile || playerProfile || null;
    const currentBeans = resolvedProfile && resolvedProfile.beans !== undefined
      ? Number(resolvedProfile.beans)
      : (basePlayer && basePlayer.beans !== undefined ? Number(basePlayer.beans) : storageBeans);
    const totalGames = resolvedProfile && resolvedProfile.totalGames !== undefined
      ? Number(resolvedProfile.totalGames)
      : (isSelfProfile ? Number(wx.getStorageSync('profile_totalGames') || 0) : 0);
    const wins = resolvedProfile && resolvedProfile.wins !== undefined
      ? Number(resolvedProfile.wins)
      : (isSelfProfile ? Number(wx.getStorageSync('profile_wins') || 0) : 0);
    const highestScoreCache = resolvedProfile && resolvedProfile.highestScore !== undefined
      ? Number(resolvedProfile.highestScore)
      : (isSelfProfile ? Number(wx.getStorageSync('profile_highestScore') || 0) : Number(basePlayer && basePlayer.score ? basePlayer.score : 0));
    const highestBeansCache = resolvedProfile && resolvedProfile.highestBeans !== undefined
      ? Number(resolvedProfile.highestBeans)
      : currentBeans;
    const mvpCount = resolvedProfile && resolvedProfile.mvpCount !== undefined
      ? Number(resolvedProfile.mvpCount)
      : (isSelfProfile ? Number(wx.getStorageSync('profile_mvpCount') || 0) : 0);
    const highestScore = Math.max(highestScoreCache, basePlayer && basePlayer.score ? Number(basePlayer.score) : 0);
    const highestBeans = Math.max(highestBeansCache, currentBeans);
    const winRate = resolvedProfile && resolvedProfile.winRate ? resolvedProfile.winRate : (totalGames > 0 ? `${Math.round((wins / totalGames) * 100)}%` : '0%');
    const theme = THEME_OPTIONS.find(t => t.id === this.data.themeId) || THEME_OPTIONS[0];
    const playerName = (resolvedProfile && resolvedProfile.nickname) || (basePlayer && basePlayer.name) || this.data.myName || '神秘牌手';
    const avatar = (resolvedProfile && resolvedProfile.avatarUrl) || (basePlayer && basePlayer.avatarUrl) || this.data.myAvatar || 'https://xn--ihq8y051bo4fe8p58f8r5b.top/avatars/1.jpg';
    const signature = (resolvedProfile && resolvedProfile.signature) || (currentBeans >= 200 ? '今天状态在线，谁来都得接两炸。' : currentBeans >= 80 ? '手感正在升温，这把还是能打。' : '先把牌打明白，再把气势打出来。');
    const localOwned = this.data.ownedShopItems || [];
    const localEquipped = this.data.equippedShopItems || {};
    const profileOwned = resolvedProfile && Array.isArray(resolvedProfile.ownedShopItems) ? resolvedProfile.ownedShopItems : [];
    const profileEquipped = resolvedProfile && resolvedProfile.equippedShopItems && typeof resolvedProfile.equippedShopItems === 'object'
      ? resolvedProfile.equippedShopItems
      : {};
    const effectiveOwned = isSelfProfile ? Array.from(new Set([...(profileOwned || []), ...(localOwned || [])])) : (profileOwned || []);
    const effectiveEquipped = {
      title: isSelfProfile ? (localEquipped.title || profileEquipped.title || '') : (profileEquipped.title || ''),
      badge: isSelfProfile ? (localEquipped.badge || profileEquipped.badge || '') : (profileEquipped.badge || ''),
      frame: isSelfProfile ? (localEquipped.frame || profileEquipped.frame || '') : (profileEquipped.frame || ''),
      effect: isSelfProfile ? (localEquipped.effect || profileEquipped.effect || '') : (profileEquipped.effect || '')
    };
    const equippedTitleItem = SHOP_ITEMS.find(it => it.id === effectiveEquipped.title && it.slot === 'title');
    const equippedBadgeItem = SHOP_ITEMS.find(it => it.id === effectiveEquipped.badge && it.slot === 'badge');
    const equippedFrameItem = SHOP_ITEMS.find(it => it.id === effectiveEquipped.frame && it.slot === 'frame');
    const equippedEffectItem = SHOP_ITEMS.find(it => it.id === effectiveEquipped.effect && it.slot === 'effect');
    const title = (equippedTitleItem && equippedTitleItem.value) || (resolvedProfile && resolvedProfile.title) || (wins >= 30 ? '鬼王宗师' : wins >= 15 ? '牌桌高手' : wins >= 5 ? '牌桌新星' : '见习牌王');
    const shortName = playerName.replace(/\s+/g, '').slice(0, 2) || 'GW';
    const rawProfileId = resolvedProfile && resolvedProfile.userId ? resolvedProfile.userId : `GWZD-${String((playerName.length * 137 + totalGames * 17 + wins * 29) % 10000).padStart(4, '0')}`;
    const profileId = String(rawProfileId).toUpperCase();
    const badges = [
      (equippedBadgeItem && equippedBadgeItem.value) || (wins >= 10 ? '连胜达人' : '初入牌局'),
      currentBeans >= 150 ? '筹码富豪' : '鬼王新秀',
      isSelfProfile ? theme.name : '本局牌手'
    ];
    if (equippedFrameItem) badges.push(`头像框:${equippedFrameItem.value}`);
    const showcase = [
      { label: '主打风格', value: wins >= totalGames / 2 && totalGames > 0 ? '稳健压制' : '快乐乱杀' },
      { label: '当前主题', value: isSelfProfile ? theme.name : '房间观察' },
      { label: '昵称简称', value: shortName },
      { label: '已拥有装扮', value: `${effectiveOwned.length} 件` },
      { label: '已装备特效', value: (equippedEffectItem && equippedEffectItem.value) || '未装备' }
    ];

    return {
      profileId,
      profileName: playerName,
      profileAvatar: avatar,
      profileBeans: currentBeans,
      profileTitle: title,
      profileSignature: signature,
      profileStats: {
        totalGames,
        wins,
        winRate,
        highestScore,
        highestBeans,
        mvpCount
      },
      profileBadges: badges,
      profileShowcase: showcase
    };
  },

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
  onSelectPresetAvatar(e) {
    const avatarUrl = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.url : '';
    if (!avatarUrl) return;
    this.setData({ myAvatar: avatarUrl, myBase64Avatar: avatarUrl });
  },
  onAuthUsernameInput(e) { this.setData({ authUsername: e.detail.value, authError: '' }); },
  onAuthPasswordInput(e) { this.setData({ authPassword: e.detail.value, authError: '' }); },
  switchAuthMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (!mode || mode === this.data.authMode) return;
    this.setData({ authMode: mode, authError: '' });
  },

  async submitAuth() {
    const username = String(this.data.authUsername || '').trim();
    const password = String(this.data.authPassword || '').trim();
    const nickname = String(this.data.myName || '').trim() || username;
    const avatarUrl = this.data.myBase64Avatar || this.data.myAvatar || this.getRandomAvatar();

    if (!username || !password) {
      this.setData({ authError: '请输入账号和密码' });
      return;
    }

    this.setData({ authLoading: true, authError: '' });
    try {
      const res = this.data.authMode === 'register'
        ? await game.register({ username, password, nickname, avatarUrl })
        : await game.accountLogin({ username, password });
      if (!res || !res.success || !res.user) {
        this.setData({ authError: (res && res.message) || '登录失败' });
        return;
      }

      const profile = res.user.profile || null;
      this.setData({
        hasAccountLogin: true,
        accountToken: game.getToken(),
        accountUserId: res.user.userId || '',
        accountProfile: profile,
        myName: profile && profile.nickname ? profile.nickname : nickname,
        myAvatar: profile && profile.avatarUrl ? profile.avatarUrl : avatarUrl,
        myBase64Avatar: profile && profile.avatarUrl ? profile.avatarUrl : avatarUrl,
        myBeans: profile && profile.beans !== undefined ? Number(profile.beans) : this.data.myBeans,
        hasAuthorized: true,
        authPassword: ''
      }, () => {
        wx.setStorageSync('myGameInfo', {
          avatar: this.data.myAvatar,
          base64: this.data.myBase64Avatar,
          name: this.data.myName
        });
        wx.setStorageSync('myBeans', this.data.myBeans);
        this.setData(this.buildProfileData());
      });
      wx.showToast({ title: this.data.authMode === 'register' ? '注册成功' : '登录成功', icon: 'success' });
    } catch (e) {
      this.setData({ authError: e && e.message ? e.message : '请求失败' });
    } finally {
      this.setData({ authLoading: false });
    }
  },

  async enterGame() {
    if (!this.data.hasAccountLogin) {
      this.setData({ authError: '请先注册或登录账号' });
      wx.showToast({ title: '请先注册或登录', icon: 'none' });
      return;
    }

    const avatar = this.data.myBase64Avatar || this.getRandomAvatar();
    const name = this.data.myName || ('玩家' + Math.floor(Math.random()*100));
    wx.setStorageSync('myGameInfo', { avatar: this.data.myAvatar, base64: avatar, name: name });
    this.setData({ hasAuthorized: true, myBase64Avatar: avatar, myName: name, authError: '' }, () => {
      this.setData(this.buildProfileData());
    });

    if (this.data.hasAccountLogin) {
      try {
        const res = await game.updateProfile({ nickname: name, avatarUrl: avatar });
        if (res && res.success && res.user) {
          this.setData({
            accountUserId: res.user.userId || '',
            accountProfile: res.user.profile || null,
            myBeans: res.user.profile ? Number(res.user.profile.beans || 0) : this.data.myBeans
          }, () => {
            this.setData(this.buildProfileData());
          });
        }
      } catch (e) {}
    }
  },

  openCreateModal() { this.setData({ showCreateModal: true }); },
  closeCreateModal() { this.setData({ showCreateModal: false, showShopModal: false }); },
  openShop() {
    this.setData({
      showShopModal: true,
      showCreateModal: false,
      shopTab: 'all',
      visibleShopItems: this.data.shopItems || []
    });
  },
  closeShop() {
    this.setData({ showShopModal: false });
  },
  onShopTabChange(e) {
    const tab = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.tab : 'all';
    if (!tab || tab === this.data.shopTab) return;
    const list = this.data.shopItems || [];
    const visibleShopItems = tab === 'all' ? list : list.filter(it => it.category === tab);
    this.setData({ shopTab: tab, visibleShopItems });
  },
  async equipShopItem(e) {
    const itemId = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.id : '';
    const item = (this.data.shopItems || []).find(it => it.id === itemId);
    if (!item || !item.slot) return;
    const owned = this.data.ownedShopItems || [];
    if (!owned.includes(item.id)) {
      wx.showToast({ title: '请先购买该商品', icon: 'none' });
      return;
    }

    const nextEquipped = {
      ...(this.data.equippedShopItems || {}),
      [item.slot]: item.id
    };
    const nextProfile = {
      ...(this.data.accountProfile || {}),
      equippedShopItems: nextEquipped
    };

    this.setData({
      equippedShopItems: nextEquipped,
      accountProfile: nextProfile
    }, () => {
      this.setData(this.buildProfileData());
    });

    wx.setStorageSync('shopEquippedItems', nextEquipped);

    const token = game.getToken();
    const user = game.getCurrentUser();
    if (token && user) {
      const userProfile = { ...(user.profile || {}), equippedShopItems: nextEquipped };
      game.saveAuth({ token, user: { ...user, profile: userProfile } });
      try {
        await game.updateProfile({ equippedShopItems: nextEquipped });
      } catch (err) {}
    }

    wx.showToast({ title: '已装备', icon: 'success' });
  },
  async buyShopItem(e) {
    const itemId = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.id : '';
    const item = this.data.shopItems.find(it => it.id === itemId);
    if (!item) return;

    if ((this.data.ownedShopItems || []).includes(item.id)) {
      wx.showToast({ title: '已拥有该商品', icon: 'none' });
      return;
    }
    const currentBeans = Number(this.data.myBeans || 0);
    const finalPrice = Number(item.price || 0);
    if (currentBeans < finalPrice) {
      wx.showToast({ title: '筹码不足', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认购买',
      content: `使用 ${finalPrice} 筹码购买“${item.name}”？`,
      confirmText: '购买',
      cancelText: '再想想',
      success: async (res) => {
        if (!res.confirm) return;
        const nextBeans = currentBeans - finalPrice;
        const nextOwned = Array.from(new Set([...(this.data.ownedShopItems || []), item.id]));
        const nextEquipped = { ...(this.data.equippedShopItems || {}) };
        if (item.slot && !nextEquipped[item.slot]) {
          nextEquipped[item.slot] = item.id;
        }

        const nextProfile = {
          ...(this.data.accountProfile || {}),
          beans: nextBeans,
          ownedShopItems: nextOwned,
          equippedShopItems: nextEquipped
        };

        this.setData({
          myBeans: nextBeans,
          accountProfile: nextProfile,
          ownedShopItems: nextOwned,
          equippedShopItems: nextEquipped
        }, () => {
          this.setData(this.buildProfileData());
        });

        wx.setStorageSync('myBeans', nextBeans);
        wx.setStorageSync('shopOwnedItems', nextOwned);
        wx.setStorageSync('shopEquippedItems', nextEquipped);

        const token = game.getToken();
        const user = game.getCurrentUser();
        if (token && user) {
          const userProfile = {
            ...(user.profile || {}),
            beans: nextBeans,
            ownedShopItems: nextOwned,
            equippedShopItems: nextEquipped
          };
          game.saveAuth({ token, user: { ...user, profile: userProfile } });
          try {
            await game.updateProfile({
              beans: nextBeans,
              ownedShopItems: nextOwned,
              equippedShopItems: nextEquipped
            });
          } catch (err) {}
        }

        wx.showToast({ title: '购买成功', icon: 'success' });
      }
    });
  },
  onRuleChange(e) {
    const vals = e.detail.value;
    this.setData({ 'roomConfig.allowDouble': vals.includes('allowDouble'), 'roomConfig.useCounter': vals.includes('useCounter'), 'roomConfig.bombNoDouble': vals.includes('bombNoDouble') });
  },
  onTimeChange(e) { this.setData({ 'roomConfig.turnTime': parseInt(e.detail.value) }); },
  onCapChange(e) { this.setData({ 'roomConfig.maxCap': e.detail.value }); },
  onRoundChange(e) { this.setData({ 'roomConfig.rounds': parseInt(e.detail.value) }); },

  confirmCreateRoom() {
    if (!this.data.hasAccountLogin) {
      this.closeCreateModal();
      wx.showToast({ title: '请先注册或登录', icon: 'none' });
      return;
    }
    this.closeCreateModal();
    this.doCreateStep({ nickName: this.data.myName, avatarUrl: this.data.myBase64Avatar, beans: this.data.myBeans, settings: this.data.roomConfig });
  },

  createBot() {
    if (!this.data.hasAccountLogin) {
      wx.showToast({ title: '请先注册或登录', icon: 'none' });
      return;
    }
    this.doCreateBotStep({ nickName: this.data.myName, avatarUrl: this.data.myBase64Avatar, beans: this.data.myBeans, settings: this.data.roomConfig });
  },
  async doCreateBotStep(userInfo) {
    wx.showLoading({ title: '召唤AI中' });
    try { const rid = await game.createBotRoom(userInfo); this.enter(rid); } 
    catch(e) { wx.showToast({ title: e.message || '连接失败', icon:'none' }); } 
    wx.hideLoading();
  },

  create() {
    if (!this.data.hasAccountLogin) {
      wx.showToast({ title: '请先注册或登录', icon: 'none' });
      return;
    }
    this.openCreateModal();
  },
  async doCreateStep(userInfo) {
    wx.showLoading({ title: '创建中' });
    try { const rid = await game.createRoom(userInfo); this.enter(rid); } 
    catch(e) { wx.showToast({ title: e.message || '连接失败', icon:'none' }); }
    wx.hideLoading();
  },

  join() {
    if (!this.data.hasAccountLogin) {
      wx.showToast({ title: '请先注册或登录', icon: 'none' });
      return;
    }
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
     catch(e) { wx.hideLoading(); wx.showToast({ title: e.message || '加入失败', icon: 'none' }); } 
  },
  
  resetData() {
    if(this.timer) clearInterval(this.timer);
    this.lastPlayedCardIds = ''; this.lastPassCount = 0; this.swipeStartIdx = -1; this.cardRects = []; this.lastChatTime = 0;
    this.setData({
      isInRoom: false, roomId: '', isBotRoom: false, players: [], status: 'waiting', 
      myCards: [], playedCards: [], leftPlayer: null, rightPlayer: null, topPlayer: null,
      msg: '', isShuffling: false, teams: {}, scores: {A:0, B:0}, pendingPoints: 0, teamsRevealed: false,
      myIndex: -1, isMyReady: false, turn: -1, myAction: '', myScore: 0, roundNo: 1, // 重置局数
      showSettings: false, cardCounter: [], showChatMenu: false, activeChats: {}, myChatText: '', lastPlayPos: '',
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
    if (this.data.status !== 'doubling' || this.data.hasDoubled) return;
    this.setData({ hasDoubled: true, myIsDouble: true, msg: '已选择加倍，等待其他玩家...' });
    game.send('double', { roomId: this.data.roomId, isDouble: true });
  },
  
  doNotDouble() {
    if (this.data.status !== 'doubling' || this.data.hasDoubled) return;
    this.setData({ hasDoubled: true, myIsDouble: false, msg: '已选择不加倍，等待其他玩家...' });
    game.send('double', { roomId: this.data.roomId, isDouble: false });
  },

  async doLeave() {
    this.setData({ showSettings: false, showChatMenu: false });
    const inGame = this.data.isInRoom && (this.data.status === 'playing' || this.data.status === 'doubling' || this.data.status === 'shuffling');

    wx.showModal({
      title: '退出房间',
      content: inGame ? '确认退出后，本局将按逃跑处理，并进入系统托管自动代打。' : '确认退出当前房间，返回大厅（创建/加入房间）？',
      confirmText: '退出',
      cancelText: '点错了',
      success: async (res) => {
        if (!res.confirm) return;
        if (inGame) {
          try {
            await game.escapeRoom();
          } catch (e) {}
        }
        await game.leaveRoom();
        this.resetData();
        this.setData({ hasAuthorized: true, showSettings: false, showCreateModal: false, authError: '' });
        this.isLeaving = false;
        wx.showToast({ title: '已退出到大厅', icon: 'none' });
      }
    });
  },

  enter(rid) {
    this.setData({ isInRoom: true, roomId: rid, hasShownGameOver: false, hasAuthorized: true });
    let lastTurn = -1;
    let lastStatus = '';

    game.listen((room, myIdx) => {
      if (!room || myIdx === -1) {
        if (!this.isLeaving) {
          wx.showToast({ title: '连接中断，正在恢复', icon: 'none' });
          game.login().then(() => {
            if (this.data.roomId) {
              game.send('rejoin', { roomId: this.data.roomId, name: this.data.myName, avatarUrl: this.data.myBase64Avatar, token: game.getToken() });
            }
          }).catch(() => {});
          return;
        }
        wx.showToast({ title: '已退出', icon: 'none' });
        this.resetData();
        return;
      }

      // 如果后端发来房间强制解散的命令，这里直接退回大厅
      if (room.status === 'disbanded') {
        wx.showModal({
          title: '房间解散',
          content: '本房间已打完设定的总局数。',
          showCancel: false,
          success: () => {
            this.doLeave();
          }
        });
        return;
      }
      
      const myOpenid = room.players[myIdx] ? room.players[myIdx].openid : null;
      this.latestRoomSnapshot = room;
      const prevStatus = lastStatus;
      lastStatus = room.status;
      if (room.players[myIdx] && room.players[myIdx].beans !== undefined) {
         this.setData({ myBeans: room.players[myIdx].beans });
         wx.setStorageSync('myBeans', room.players[myIdx].beans);
       }
      if (room.players[myIdx] && room.players[myIdx].profile) {
        this.setData({
          accountProfile: room.players[myIdx].profile,
          accountUserId: room.players[myIdx].userId || this.data.accountUserId,
          hasAccountLogin: !!(room.players[myIdx].userId || this.data.accountUserId)
        });
      }
      if (room.players[myIdx] && room.players[myIdx].isTrustee) {
        this.setData({ msg: room.players[myIdx].isEscaped ? '你已退出主界面，本局由系统托管' : '当前为托管状态' });
      }
      const selfProfileData = this.buildProfileData(room, myIdx);
      if (!this.data.showProfilePanel) {
        this.setData(selfProfileData);
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
        if (prevStatus !== 'shuffling') {
          this.setData({
            isShuffling: true,
            msg: '洗牌中...',
            playedCards: [],
            cardCounter: [],
            roundPlayed: { bottom: [], left: [], top: [], right: [] },
            passFlags: { bottom: false, left: false, top: false, right: false },
            passToastText: ''
          });
        }
        return;
      } else { this.setData({ isShuffling: false }); }

      if (room.status === 'gameover' && !this.data.hasShownGameOver) {
        if (this.timer) clearInterval(this.timer); 
        this.setData({ hasShownGameOver: true });
        let teamAName = '有王队', teamBName = '无王队';
        if (room.teams) {
          let teamACount = Object.values(room.teams).filter(t => t === 'A').length;
          if (teamACount === 1) { teamAName = '双王队'; teamBName = '无王队'; }
          else if (teamACount === 3) { teamAName = '无王队'; teamBName = '双王队'; }
        }
        const myFinalTeam = room.teams ? room.teams[myOpenid] : null;
        const iWon = myFinalTeam === room.winnerTeam;
        let winText = room.winnerTeam === 'Draw' ? '平局！' : (iWon ? '🎉 你们赢了！' : '😭 你们输了...');
        winText += `\n比分 ${teamAName}:${room.scores.A}  ${teamBName}:${room.scores.B}`;
        
        let beanChange = 0;
        if(room.players[myIdx] && room.players[myIdx].beanChange !== undefined) {
           beanChange = room.players[myIdx].beanChange;
           winText += `\n${beanChange >= 0 ? '赢取' : '扣除'} 筹码: ${Math.abs(beanChange)}`;
        }

        if (room.payBonusInfo && room.payBonusInfo.amount) {
          const payOpenid = room.payBonusInfo.winnerOpenid;
          const payPlayer = (room.players || []).find(p => p && p.openid === payOpenid);
          const payName = payOpenid === myOpenid ? '你' : ((payPlayer && payPlayer.name) || '先出完玩家');
          winText += `\n付分奖励: ${payName} +${room.payBonusInfo.amount}`;
        }

        if (!this.data.hasAccountLogin) {
          const totalGames = Number(wx.getStorageSync('profile_totalGames') || 0) + 1;
          const wins = Number(wx.getStorageSync('profile_wins') || 0) + (iWon ? 1 : 0);
          const currentScore = room.players[myIdx] ? Number(room.players[myIdx].score || 0) : 0;
          const highestScore = Math.max(Number(wx.getStorageSync('profile_highestScore') || 0), currentScore);
          const highestBeans = Math.max(Number(wx.getStorageSync('profile_highestBeans') || 0), Number(room.players[myIdx] ? room.players[myIdx].beans || 0 : this.data.myBeans || 0));
          const roomPlayers = room.players || [];
          const myScore = room.players[myIdx] ? Number(room.players[myIdx].score || 0) : 0;
          const isMvp = roomPlayers.length > 0 && myScore >= Math.max(...roomPlayers.map(p => Number(p.score || 0)));
          const mvpCount = Number(wx.getStorageSync('profile_mvpCount') || 0) + (isMvp ? 1 : 0);
          wx.setStorageSync('profile_totalGames', totalGames);
          wx.setStorageSync('profile_wins', wins);
          wx.setStorageSync('profile_highestScore', highestScore);
          wx.setStorageSync('profile_highestBeans', highestBeans);
          wx.setStorageSync('profile_mvpCount', mvpCount);
        }
        const refreshProfileData = this.buildProfileData(room, myIdx);
        if (!this.data.showProfilePanel) {
          this.setData(refreshProfileData);
        }
        
        // 👇 这里判断是不是达到了最后一局，如果是最后一局则走最终结算逻辑
        let isFinal = room.settings && room.roundNo >= room.settings.rounds;
        if (isFinal) {
          let finalScoresText = (room.players || []).map(p => {
             let isMy = p.openid === myOpenid;
             return `${isMy?'【我】':''} ${p.name} | 得分: ${p.score||0} | 最终筹码: ${p.beans||0}`;
          }).join('\n');
          let finalMsg = `本局结果：\n${winText}\n\n=== 房间 ${room.settings.rounds} 局已结束 ===\n\n[最终战绩]\n${finalScoresText}`;
          
          wx.showModal({
            title: '🏆 最终结算 🏆',
            content: finalMsg,
            showCancel: false,
            confirmText: '解散并返回',
            success: () => {
              this.doLeave(); // 强制退回大厅
            }
          });
        } else {
          // 否则走正常的结束弹窗
          wx.showModal({ title: '游戏结束', content: winText, cancelText: '退出', confirmText: '继续', success: (res) => { if (res.confirm) this.doReady(); else this.doLeave(); } });
        }
        return;
      }

      if (room.status === 'playing' && room.turn !== lastTurn) {
        lastTurn = room.turn; 
        if (this.timer) clearInterval(this.timer); 
        const turnTime = room.settings ? room.settings.turnTime : 30;
        this.setData({ countdown: turnTime, roomSettings: room.settings }); 
        this.timer = setInterval(() => {
          let t = this.data.countdown;
          if (t > 0) this.setData({ countdown: t - 1 });
          else { 
            if (this.timer) clearInterval(this.timer); 
            if (room.turn === myIdx) this.handleTimeout(room.status, this.data.isNewRound); 
          }
        }, 1000);
      }

      if (room.status === 'playing') {
        const currentIds = (room.playedCards || []).map(c => c.id).join(',');
        let someonePassed = false;
        if (currentIds !== '' && currentIds !== this.lastPlayedCardIds) { this.playSound(room.lastMove); }
        else if (room.passCount > this.lastPassCount) { someonePassed = true; }
        else if (currentIds === '' && this.lastPlayedCardIds !== '') { someonePassed = true; }
        if (someonePassed) {
          this.playSoundByName('buyao.mp3');
          const passPlayerIndex = room.turn !== undefined && room.players && room.players.length
            ? (room.turn + room.players.length - 1) % room.players.length
            : -1;
          const passOpenid = passPlayerIndex > -1 && room.players[passPlayerIndex]
            ? room.players[passPlayerIndex].openid
            : '';
          let passName = '有人';
          if (passOpenid === myOpenid) passName = '你';
          else {
            const passPlayer = (room.players || []).find(player => player && player.openid === passOpenid);
            if (passPlayer && passPlayer.name) passName = passPlayer.name;
          }

          this.setData({ passToastText: `${passName}不要` });
          if (this.passFlagTimers.center) clearTimeout(this.passFlagTimers.center);
          this.passFlagTimers.center = setTimeout(() => {
            this.setData({ passToastText: '' });
          }, 1400);
        }
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
        if(!room.players[idx]) {
          return {
            name:'...', avatarUrl:'', count:0, score:0, action:'', chatText: '', beans: 0,
            isDouble: false, hasDoubled: false, isFriend: false, isDisconnected: false,
            titleText: '', badgeText: '', effectText: '', frameClass: '', effectClass: ''
          };
        }
        let p = room.players[idx];
        let name = p.name;
        if (room.status === 'waiting' && p.isReady) name += ' (已准备)';

        let isFriend = false;
        if (room.teamsRevealed && room.teams && myOpenid && p.openid !== myOpenid) {
            isFriend = room.teams[p.openid] === room.teams[myOpenid];
        }

        const eq = p && p.profile && p.profile.equippedShopItems ? p.profile.equippedShopItems : {};
        const titleItem = (this.data.shopItems || []).find(it => it.id === eq.title && it.slot === 'title');
        const badgeItem = (this.data.shopItems || []).find(it => it.id === eq.badge && it.slot === 'badge');
        const frameItem = (this.data.shopItems || []).find(it => it.id === eq.frame && it.slot === 'frame');
        const effectItem = (this.data.shopItems || []).find(it => it.id === eq.effect && it.slot === 'effect');

        const frameClass = frameItem ? `frame-${frameItem.rarity || 'normal'}` : '';
        const effectClass = effectItem ? `effect-${effectItem.rarity || 'normal'}` : '';

        return {
          ...p,
          name: name,
          count: room.hands?.[idx]?.length || 0,
          score: p.score || 0,
          beans: p.beans || 0,
          chatText: this.data.activeChats[p.openid] || '',
          isDouble: !!p.isDouble,
          hasDoubled: !!p.hasDoubled,
          isFriend: isFriend,
          isDisconnected: !!p.isEscaped,
          titleText: titleItem ? titleItem.value : (p.profile && p.profile.title ? p.profile.title : ''),
          badgeText: badgeItem ? badgeItem.value : '',
          effectText: effectItem ? effectItem.value : '',
          frameClass,
          effectClass
        };
      };

      const buildRoundPlayed = () => {
        const emptyPlayed = { bottom: [], left: [], top: [], right: [] };
        const lastMoveOpenid = lm && lm.openid ? lm.openid : '';
        const currentPlayed = (room.playedCards || []).map(card => ({ ...card }));

        if ((isNewRound && isTurn) || !lastMoveOpenid || currentPlayed.length === 0) {
          return emptyPlayed;
        }

        const byPos = {
          [myOpenid]: 'bottom',
          [room.players[(myIdx + 3) % 4]?.openid || '']: 'left',
          [room.players[(myIdx + 1) % 4]?.openid || '']: 'right',
          [room.players[(myIdx + 2) % 4]?.openid || '']: 'top'
        };

        const nextRoundPlayed = this.data.roundPlayed ? {
          bottom: Array.isArray(this.data.roundPlayed.bottom) ? this.data.roundPlayed.bottom : [],
          left: Array.isArray(this.data.roundPlayed.left) ? this.data.roundPlayed.left : [],
          right: Array.isArray(this.data.roundPlayed.right) ? this.data.roundPlayed.right : [],
          top: Array.isArray(this.data.roundPlayed.top) ? this.data.roundPlayed.top : []
        } : emptyPlayed;

        if (room.passCount === 0 && room.turn === myIdx && lastMoveOpenid === myOpenid) {
          return emptyPlayed;
        }

        const targetPos = byPos[lastMoveOpenid] || '';
        if (!targetPos) return nextRoundPlayed;

        nextRoundPlayed[targetPos] = currentPlayed;
        return nextRoundPlayed;
      };

      const me = room.players[myIdx];
      const roundPlayed = buildRoundPlayed();
 
      this.setData({
        isBotRoom: room.isBotRoom || false, players: room.players, myIndex: myIdx,
        isMyReady: me ? me.isReady : false,
        myAction: me ? (me.action || '') : '', 
        myCards: this.processCardsWith510K(this.data.myCards, room.hands?.[myIdx] || []),
        playedCards: (isNewRound && isTurn) ? [] : (room.playedCards || []),
        roundPlayed: roundPlayed,
        status: room.status, isMyTurn: isTurn, msg: tip, lastMove: lm, isNewRound: isNewRound,
        teams: room.teams || {}, scores: room.scores || {A:0, B:0}, pendingPoints: room.pendingPoints || 0,
        myTeam: room.teams ? room.teams[myOpenid] : '', teamsRevealed: room.teamsRevealed || false, turn: room.turn,
        leftPlayer: getP((myIdx + 3) % 4), rightPlayer: getP((myIdx + 1) % 4), topPlayer: getP((myIdx + 2) % 4),
        myScore: me ? (me.score || 0) : 0, cardCounter: counterData,
        currentMultiplier: room.multiplier || 2,
        hasDoubled: me ? !!me.hasDoubled : false,
        myIsDouble: me ? !!me.isDouble : false,
        roundNo: room.roundNo || 1, // <- 同步当前的轮数
        roomSettings: room.settings // <- 同步当前的设置
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
    wx.nextTick(() => { 
      wx.createSelectorQuery().selectAll('.my-card').boundingClientRect(rects => { 
        this.cardRects = rects || []; 
      }).exec(); 
    });
  },

  doHint() {
    const res = rules.findBeatCards(this.data.myCards, this.data.isNewRound ? null : this.data.lastMove, this.data.myCards.filter(c => c.selected));
    if (!res) {
      wx.showToast({ title: '要不起，自动过牌', icon: 'none' });
      setTimeout(() => {
        this.doPass();
      }, 600);
    } else { 
      this.setData({ 
        myCards: this.data.myCards.map(c => { c.selected = res.some(r => r.id === c.id); return c; }) 
      }, () => { this.updateCardRects(); }); 
    }
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