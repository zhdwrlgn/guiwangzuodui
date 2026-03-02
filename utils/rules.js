// rules.js

const POWER = {
  'single': 1, 'pair': 1, 'trio': 1, 'trio_solo': 1, 'trio_two': 1, 'straight': 1, 'liandui': 1, 'plane': 1,
  '510k_mixed': 2, // 杂色510K（比炸弹小）
  'bomb': 3,       // 炸弹
  '510k_pure': 4,  // 同花510K（比炸弹大）
  'rocket': 5      // 王炸
};

function getHandType(cards) {
  if (!cards || cards.length === 0) return null;
  cards.sort((a, b) => a.value - b.value);
  const vals = cards.map(c => c.value);
  const len = cards.length;
  const counts = {};
  vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const unique = Object.keys(counts).map(Number).sort((a,b)=>a-b);
  const min = vals[0];
  const max = vals[len - 1];

  if (len === 1) return { type: 'single', val: min, display: '单张' };
  if (len === 2 && vals[0] === vals[1]) return { type: 'pair', val: min, display: '对子' };
  if (len === 2 && vals[0] === 16 && vals[1] === 17) return { type: 'rocket', val: 999, display: '王炸' };
  
  if (len === 3 && vals.includes(5) && vals.includes(10) && vals.includes(13)) {
     const suits = new Set(cards.map(c => c.suit));
     if (suits.size === 1) return { type: '510k_pure', val: 0, display: '同花五十K' };
     else return { type: '510k_mixed', val: 0, display: '杂色五十K' };
  }

  if (len === 3 && vals[0] === vals[2]) return { type: 'trio', val: min, display: '三张' };
  if (len === 4 && vals[0] === vals[3]) return { type: 'bomb', val: min, display: '炸弹' };
  
  if (len === 4) { 
    for (let v of unique) if (counts[v] === 3) return { type: 'trio_solo', val: v, display: '三带一' };
  }

  if (len === 5) { 
    for (let v of unique) {
      if (counts[v] === 3) return { type: 'trio_two', val: v, display: '三带二' };
    }
  }

  const planeInfo = detectPlane(unique, counts, len);
  if (planeInfo) return planeInfo;

  if (len >= 5 && unique.length === len) {
     let straightVal = checkStraight(vals);
     if (straightVal !== false) return { type: 'straight', val: straightVal, len: len, display: '顺子' };
  }

  if (len >= 4 && len % 2 === 0 && isLiandui(unique, counts)) return { type: 'liandui', val: max, len: len, display: '连对' };

  return null;
}

function detectPlane(uniqueVals, counts, len) {
  const tripVals = uniqueVals.filter(v => v < 15 && counts[v] >= 3).sort((a,b)=>a-b);
  if (tripVals.length < 2) return null;

  const segments = [];
  let seg = [tripVals[0]];
  for (let i = 1; i < tripVals.length; i++) {
    if (tripVals[i] === tripVals[i - 1] + 1) seg.push(tripVals[i]);
    else {
      segments.push(seg);
      seg = [tripVals[i]];
    }
  }
  segments.push(seg);

  for (const s of segments) {
    for (let runLen = s.length; runLen >= 2; runLen--) {
      for (let i = 0; i <= s.length - runLen; i++) {
        const run = s.slice(i, i + runLen);
        const baseLen = runLen * 3;
        if (len < baseLen || len > baseLen + runLen * 2) continue;

        // 主体三连张必须“纯三张”，带牌不能从主体点数里拆出来
        if (run.some(v => counts[v] !== 3)) continue;

        const runCount = run.reduce((acc, v) => acc + counts[v], 0);
        const wingLen = len - baseLen;
        if (len - runCount !== wingLen) continue;

        return {
          type: 'plane',
          val: run[run.length - 1],
          trioLen: runLen,
          wingLen,
          len,
          display: wingLen > 0 ? `飞机带${wingLen}` : '飞机'
        };
      }
    }
  }

  return null;
}

function buildPlaneHands(sortedCards, targetTrioLen = null, targetWingLen = null, minVal = 0) {
  const byVal = {};
  for (const c of sortedCards) {
    if (!byVal[c.value]) byVal[c.value] = [];
    byVal[c.value].push(c);
  }

  const uniqueVals = Object.keys(byVal).map(Number).sort((a,b)=>a-b);
  const tripVals = uniqueVals.filter(v => v < 15 && byVal[v].length >= 3);
  if (tripVals.length < 2) return [];

  const segments = [];
  let seg = [tripVals[0]];
  for (let i = 1; i < tripVals.length; i++) {
    if (tripVals[i] === tripVals[i - 1] + 1) seg.push(tripVals[i]);
    else {
      segments.push(seg);
      seg = [tripVals[i]];
    }
  }
  segments.push(seg);

  const result = [];

  for (const s of segments) {
    for (let runLen = 2; runLen <= s.length; runLen++) {
      if (targetTrioLen !== null && runLen !== targetTrioLen) continue;

      for (let i = 0; i <= s.length - runLen; i++) {
        const run = s.slice(i, i + runLen);
        const mainVal = run[run.length - 1];
        if (mainVal <= minVal) continue;

        const runSet = new Set(run);
        const mainCards = [];
        let pureMain = true;
        for (const v of run) {
          if (byVal[v].length !== 3) { pureMain = false; break; }
          mainCards.push(byVal[v][0], byVal[v][1], byVal[v][2]);
        }
        if (!pureMain) continue;

        const pool = sortedCards.filter(c => !runSet.has(c.value));
        const maxWing = Math.min(runLen * 2, pool.length);

        let wingList = [];
        if (targetWingLen !== null) {
          if (targetWingLen <= maxWing) wingList = [targetWingLen];
        } else {
          for (let w = 0; w <= maxWing; w++) wingList.push(w);
        }

        for (const wingLen of wingList) {
          if (wingLen === 0) result.push([...mainCards]);
          else result.push([...mainCards, ...pool.slice(0, wingLen)]);
        }
      }
    }
  }

  return result;
}

function checkStraight(vals) {
  if (vals.length < 5) return false;
  let isNormal = true;
  for (let i = 0; i < vals.length - 1; i++) {
     if (vals[i+1] - vals[i] !== 1) { isNormal = false; break; }
  }
  if (isNormal && vals[vals.length-1] < 15) return vals[vals.length-1]; 

  if (vals.length === 5) {
     const str = vals.join(',');
     if (str === '3,4,5,14,15') return 5; 
     if (str === '3,4,5,6,15') return 6;  
     if (str === '11,12,13,14,15') return 15; 
  }
  return false;
}

function isLiandui(uniqueVals, counts) {
  if (uniqueVals[uniqueVals.length-1] >= 15) return false;
  for (let v of uniqueVals) {
    if (counts[v] !== 2) return false;
  }
  let isNormal = true;
  for (let i = 0; i < uniqueVals.length - 1; i++) {
     if (uniqueVals[i+1] - uniqueVals[i] !== 1) isNormal = false;
  }
  return isNormal;
}

function canBeat(lastHand, currHand) {
  if (!lastHand || !lastHand.type) return true;
  
  const currP = POWER[currHand.type] || 0;
  const lastP = POWER[lastHand.type] || 0;

  if (currP > lastP) return true;
  if (currP < lastP) return false;

  if (currHand.type === lastHand.type) {
    if (['straight', 'liandui'].includes(currHand.type) && currHand.len !== lastHand.len) return false;
    if (currHand.type === 'plane') {
      if (currHand.trioLen !== lastHand.trioLen) return false;
      if (currHand.wingLen !== lastHand.wingLen) return false;
    }
    if (currHand.type === '510k_mixed' || currHand.type === '510k_pure') return false; 
    return currHand.val > lastHand.val;
  }
  return false;
}

function findBeatCards(myCards, lastMove, currentSelected = []) {
  if (lastMove && lastMove.type === 'rocket') return null;

  const sorted = [...myCards].sort((a,b)=>a.value - b.value);
  const vals = sorted.map(c => c.value);
  let possibleHands = []; 
  const lastP = lastMove ? (POWER[lastMove.type] || 0) : 0;

  if (!lastMove || lastP === 1) {
      if (!lastMove || lastMove.type === 'single') {
        const minVal = lastMove ? lastMove.val : 0;
        const seen = new Set();
        for (let c of sorted) {
          if (!seen.has(c.value) && c.value > minVal) {
            possibleHands.push([c]);
            seen.add(c.value);
          }
        }
      }

      if (lastMove && lastMove.type === 'pair') {
        for (let i = 0; i < vals.length - 1; i++) {
          if (vals[i] === vals[i+1] && vals[i] > lastMove.val) {
            if (possibleHands.length === 0 || possibleHands[possibleHands.length-1][0].value !== vals[i]) {
               possibleHands.push([sorted[i], sorted[i+1]]);
            }
          }
        }
      }

      if (lastMove && (lastMove.type === 'trio' || lastMove.type === 'trio_solo' || lastMove.type === 'trio_two')) {
        for (let i = 0; i < vals.length - 2; i++) {
          if (vals[i] === vals[i+2] && vals[i] > lastMove.val) {
            let trio = [sorted[i], sorted[i+1], sorted[i+2]];
            if (lastMove.type === 'trio') possibleHands.push(trio);
            else if (lastMove.type === 'trio_solo') {
               for(let c of sorted) {
                 if(c.value !== vals[i]) { possibleHands.push(trio.concat([c])); break; }
               }
            }
            else if (lastMove.type === 'trio_two') {
               let others = [];
               for(let c of sorted) {
                 if (c.value !== vals[i] && others.length < 2) others.push(c);
               }
               if (others.length === 2) possibleHands.push(trio.concat(others));
            }
          }
        }
      }

      if (lastMove && lastMove.type === 'plane') {
        possibleHands.push(...buildPlaneHands(sorted, lastMove.trioLen, lastMove.wingLen, lastMove.val));
      }

      if (lastMove && lastMove.type === 'straight') {
        const len = lastMove.len;
        const uniqueCards = [];
        const seen = new Set();
        for (let c of sorted) {
          if (!seen.has(c.value) && c.value < 15) { uniqueCards.push(c); seen.add(c.value); }
        }
        for (let i = 0; i <= uniqueCards.length - len; i++) {
          let isChain = true;
          for (let j = 0; j < len - 1; j++) if (uniqueCards[i+j+1].value - uniqueCards[i+j].value !== 1) { isChain = false; break; }
          if (isChain && uniqueCards[i+len-1].value > lastMove.val) {
             let hand = [];
             for(let k=0; k<len; k++) hand.push(sorted.find(c => c.value === uniqueCards[i+k].value));
             possibleHands.push(hand);
          }
        }
        if (len === 5) {
           const hasCards = (vList) => vList.every(v => sorted.find(c => c.value === v));
           const getCards = (vList) => vList.map(v => sorted.find(c => c.value === v));
           if (lastMove.val < 5 && hasCards([3,4,5,14,15])) possibleHands.push(getCards([3,4,5,14,15]));
           if (lastMove.val < 6 && hasCards([3,4,5,6,15])) possibleHands.push(getCards([3,4,5,6,15]));
           if (lastMove.val < 15 && hasCards([11,12,13,14,15])) possibleHands.push(getCards([11,12,13,14,15]));
        }
      }

      if (lastMove && lastMove.type === 'liandui') {
        const len = lastMove.len; 
        const pairCount = len / 2; 
        const validPairs = [];
        const uniqueVals = [...new Set(vals)].sort((a,b)=>a-b);
        for (let v of uniqueVals) {
           if (v < 15 && sorted.filter(c => c.value === v).length >= 2) validPairs.push(v);
        }
        for (let i = 0; i <= validPairs.length - pairCount; i++) {
           let isChain = true;
           for (let j = 0; j < pairCount - 1; j++) {
              if (validPairs[i+j+1] - validPairs[i+j] !== 1) { isChain = false; break; }
           }
           if (isChain && validPairs[i+pairCount-1] > lastMove.val) {
              let hand = [];
              for (let k = 0; k < pairCount; k++) {
                 const v = validPairs[i+k];
                 const pairCards = sorted.filter(c => c.value === v);
                 hand.push(pairCards[0], pairCards[1]);
              }
              possibleHands.push(hand);
           }
        }
      }
  }

  let has5 = sorted.filter(c => c.value === 5);
  let has10 = sorted.filter(c => c.value === 10);
  let hasK = sorted.filter(c => c.value === 13);
  let mixed510k = [];
  let pure510k = [];
  
  if (has5.length && has10.length && hasK.length) {
      for (let c5 of has5) {
          for (let c10 of has10) {
              for (let cK of hasK) {
                  if (c5.suit === c10.suit && c10.suit === cK.suit) pure510k.push([c5, c10, cK]);
                  else mixed510k.push([c5, c10, cK]);
              }
          }
      }
  }

  if (!lastMove || lastP < 2) possibleHands.push(...mixed510k);

  for (let i = 0; i < vals.length - 3; i++) {
    if (vals[i] === vals[i+3]) {
       const bombVal = vals[i];
       if (!lastMove || lastP < 3 || (lastMove.type === 'bomb' && bombVal > lastMove.val)) {
          possibleHands.push(sorted.slice(i, i+4));
       }
    }
  }

  if (!lastMove || lastP < 4) possibleHands.push(...pure510k);

  if (vals.includes(16) && vals.includes(17)) possibleHands.push(sorted.filter(c => c.value >= 16));

  // 🌟 终极防拆保护：如果手里有 510K，过滤掉所有会破坏它的普通牌提示
  if (has5.length > 0 && has10.length > 0 && hasK.length > 0) {
      possibleHands = possibleHands.filter(hand => {
          let isBomb = hand.length === 4 && hand[0].value === hand[3].value;
          let isRocket = hand.length === 2 && hand[0].value >= 16 && hand[1].value >= 16;
          let is510k = hand.length === 3 && hand.some(c=>c.value===5) && hand.some(c=>c.value===10) && hand.some(c=>c.value===13);
          
          // 如果要提示的牌本身就是五十K、炸弹、王炸，直接放行
          if (isBomb || isRocket || is510k) return true;

          // 预演：如果把这把牌打出去，剩下的牌里还能不能凑出 510K？
          let remaining = [...sorted];
          hand.forEach(hc => {
              let idx = remaining.findIndex(c => c.id === hc.id);
              if (idx > -1) remaining.splice(idx, 1);
          });
          
          let r5 = remaining.some(c => c.value === 5);
          let r10 = remaining.some(c => c.value === 10);
          let rK = remaining.some(c => c.value === 13);
          
          // 如果打出去之后 510K 被拆碎了，那就屏蔽这个提示
          return r5 && r10 && rK;
      });
  }

  if (possibleHands.length === 0) return null;
  if (!currentSelected || currentSelected.length === 0) return possibleHands[0];

  const currentVals = currentSelected.map(c=>c.id).sort().join(',');
  let currentIndex = -1;
  for(let i=0; i<possibleHands.length; i++) {
     if (possibleHands[i].map(c=>c.id).sort().join(',') === currentVals) { currentIndex = i; break; }
  }

  if (currentIndex !== -1) return possibleHands[(currentIndex + 1) % possibleHands.length];
  else return possibleHands[0];
}

function getScore(cards) {
  let score = 0;
  if(!cards) return 0;
  cards.forEach(c => {
    if (c.value === 5) score += 5;       
    else if (c.value === 10) score += 10; 
    else if (c.value === 13) score += 10; 
  });
  return score;
}

module.exports = { getHandType, canBeat, findBeatCards, getScore };
