const cardValues = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; 
const suits = ['♠', '♥', '♣', '♦'];

function createDeck() {
  let deck = [];
  let idCounter = 0;
  // 造牌
  for (let v of cardValues) {
    for (let s of suits) {
      deck.push({
        value: v, display: getDisplay(v), suit: s,
        color: (s === '♥' || s === '♦') ? '#d32f2f' : '#1a1a1a',
        selected: false, id: `C_${idCounter++}`
      });
    }
  }
  // 大小王
  deck.push({ value: 16, display: '小王', suit: '', color: '#1a1a1a', isJoker: true, selected: false, id: `C_${idCounter++}` });
  deck.push({ value: 17, display: '大王', suit: '', color: '#d32f2f', isJoker: true, selected: false, id: `C_${idCounter++}` });
  return deck;
}

function getDisplay(v) {
  const map = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A', 15: '2' };
  return map[v] || v;
}

function getRandomInt(maxExclusive) {
  if (maxExclusive <= 0) return 0;

  // 1) 浏览器 / 新环境：crypto.getRandomValues
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    let x = 0;
    do {
      globalThis.crypto.getRandomValues(arr);
      x = arr[0];
    } while (x >= limit);
    return x % maxExclusive;
  }

  // 2) 微信小程序：wx.getRandomValues（若可用）
  if (typeof wx !== 'undefined' && typeof wx.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    let x = 0;
    do {
      wx.getRandomValues(arr);
      x = arr[0];
    } while (x >= limit);
    return x % maxExclusive;
  }

  // 3) Node 环境回退：crypto.randomInt
  try {
    if (typeof require === 'function') {
      const nodeCrypto = require('crypto');
      if (nodeCrypto && typeof nodeCrypto.randomInt === 'function') {
        return nodeCrypto.randomInt(0, maxExclusive);
      }
    }
  } catch (e) {}

  // 4) 兼容兜底
  return Math.floor(Math.random() * maxExclusive);
}

// Fisher-Yates + 安全随机源（优先）
function shuffle(deck) {
  let m = deck.length, t, i;
  while (m) {
    i = getRandomInt(m);
    m -= 1;
    t = deck[m];
    deck[m] = deck[i];
    deck[i] = t;
  }
  return deck;
}

module.exports = { createDeck, shuffle };