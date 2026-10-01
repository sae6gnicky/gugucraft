/* =========================================================
   곱셈구구 광산 모험 - 게임 로직
   ========================================================= */

/* ---------- 재료 정의 (상점에서 코인으로 구매) ---------- */
const MATERIALS = {
  wood:    { name: '나무',       cost: 3,   desc: '가장 기본 재료예요.' },
  stone:   { name: '돌',         cost: 6,   desc: '단단한 돌멩이.' },
  coal:    { name: '석탄',       cost: 8,   desc: '불을 피우는 검은 돌.' },
  copper:  { name: '구리',       cost: 12,  desc: '반짝이는 주황 금속.' },
  iron:    { name: '철',         cost: 20,  desc: '튼튼한 금속이에요.' },
  gold:    { name: '금',         cost: 30,  desc: '반짝반짝 노란 금속!' },
  diamond: { name: '다이아몬드', cost: 60,  desc: '아주 귀한 보석이에요.' },
  emerald: { name: '에메랄드',   cost: 45,  desc: '초록빛 귀한 보석.' },
  ancient_debris: { name: '고대 잔해', cost: 90, desc: '네더에서 나는 희귀 광석!' },
};

/* 특수 조합 재료 (상점에서 못 사고, 제작대에서 만듦) */
// 고대 잔해 -> 네더라이트 조각 -> (조각4+금4) -> 네더라이트 주괴

/* ---------- 무기 정의 (제작대에서 재료로 제작, 등급순) ---------- */
/* dmg = 보스에게 주는 공격력. 재료는 {재료키: 개수} */
const WEAPONS = [
  { key: 'fist',    name: '맨손',          dmg: 10, tier: 0, recipe: null },
  { key: 'wood',    name: '나무검',        dmg: 18, tier: 1, recipe: { stick: 1, wood: 2 } },
  { key: 'stone',   name: '돌검',          dmg: 26, tier: 2, recipe: { stick: 1, stone: 2 } },
  { key: 'copper',  name: '구리검',        dmg: 34, tier: 3, recipe: { stick: 1, copper: 2 } },
  { key: 'iron',    name: '철검',          dmg: 45, tier: 4, recipe: { stick: 1, iron: 2 } },
  { key: 'gold',    name: '금검',          dmg: 55, tier: 5, recipe: { stick: 1, gold: 2 } },
  { key: 'diamond', name: '다이아몬드검',  dmg: 75, tier: 6, recipe: { stick: 1, diamond: 2 } },
  { key: 'netherite', name: '네더라이트검', dmg: 110, tier: 7, recipe: { diamond_sword_base: 1, netherite: 1 } },
];

/* 중간 조합물 (제작대 특별 레시피) */
const CRAFTABLES = [
  { key: 'stick',             name: '막대기',          out: 2, recipe: { wood: 1 },                      desc: '검 손잡이에 필요해요.' },
  { key: 'netherite_scrap',   name: '네더라이트 조각', out: 1, recipe: { ancient_debris: 1, coal: 1 },   desc: '고대 잔해를 녹여 만들어요.' },
  { key: 'netherite',         name: '네더라이트 주괴', out: 1, recipe: { netherite_scrap: 4, gold: 4 },  desc: '최강 재료! 조각4+금4.' },
];

/* ---------- 보스 정의 (단계별) ---------- */
/* hp 를 깎으려면 보스 문제를 맞혀서 무기 dmg 만큼 공격 */
const BOSSES = [
  { key: 'zombie',         name: '좀비',           hp: 40 },
  { key: 'spider',         name: '거미',           hp: 55 },
  { key: 'skeleton',       name: '스켈레톤',       hp: 70 },
  { key: 'creeper',        name: '크리퍼',         hp: 90 },
  { key: 'witch',          name: '마녀',           hp: 110 },
  { key: 'blaze',          name: '블레이즈',       hp: 140 },
  { key: 'witherSkeleton', name: '위더 스켈레톤',  hp: 170 },
  { key: 'ghast',          name: '가스트',         hp: 210 },
  { key: 'enderman',       name: '엔더맨',         hp: 260 },
  { key: 'wither',         name: '위더',           hp: 340 },
  { key: 'dragon',         name: '엔더 드래곤',    hp: 500 },  // 랜덤단 최종보스
];

/* ---------- 단계(스테이지) 정의 ---------- */
/* 0~9단 + 랜덤단(10). table=null 이면 모든 단 랜덤 */
const STAGES = [];
for (let i = 0; i <= 9; i++) {
  STAGES.push({ idx: i, table: i, name: i + '단', need: 5, boss: BOSSES[i], emoji: ['🧟','🕷️','💀','🟢','🧙','🔥','☠️','👻','🟣','🌑'][i] });
}
STAGES.push({ idx: 10, table: null, name: '랜덤단', need: 8, boss: BOSSES[10], emoji: '🐉' });

const COIN_PER_CORRECT = 5; // 문제 하나 맞힐 때 코인

/* ---------- 게임 상태 ---------- */
const DEFAULT_STATE = () => ({
  coins: 0,
  materials: {},        // {key: count}
  weaponKey: 'fist',    // 현재 장착 무기(가장 좋은 것)
  ownedWeapons: ['fist'],
  stageProgress: 0,     // 몇 단계까지 클리어했나 (0 = 아직 0단 보스 못깸)
  unlocked: 0,          // 열린 최고 단계 index
});

let S = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem('gugudan_mc_save');
    if (raw) return Object.assign(DEFAULT_STATE(), JSON.parse(raw));
  } catch (e) {}
  return DEFAULT_STATE();
}
function save() { localStorage.setItem('gugudan_mc_save', JSON.stringify(S)); }

/* ---------- 유틸 ---------- */
const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);

function matCount(key) { return S.materials[key] || 0; }
function addMat(key, n = 1) { S.materials[key] = matCount(key) + n; }
function hasMats(recipe) { return Object.entries(recipe).every(([k, n]) => matCount(k) >= n); }
function spendMats(recipe) { Object.entries(recipe).forEach(([k, n]) => { S.materials[k] -= n; }); }

function currentWeapon() { return WEAPONS.find(w => w.key === S.weaponKey) || WEAPONS[0]; }

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 1800);
}

function modal(icon, text, cb) {
  $('modalIcon').textContent = icon;
  $('modalText').innerHTML = text;
  $('modal').classList.add('show');
  $('modalBtn').onclick = () => { $('modal').classList.remove('show'); if (cb) cb(); };
}

/* 사운드 (간단한 비프음, 파일 없이 WebAudio로 생성) */
let audioCtx;
function beep(freq = 440, dur = 0.1, type = 'square', vol = 0.08) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
const sfxCorrect = () => { beep(660, .08); setTimeout(() => beep(880, .1), 80); };
const sfxWrong   = () => beep(160, .2, 'sawtooth');
const sfxCoin    = () => beep(1046, .06, 'triangle', .06);
const sfxHit     = () => { beep(220, .08, 'sawtooth', .12); };
const sfxWin     = () => { [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.12,'triangle'),i*110)); };

/* ---------- 화면 전환 ---------- */
function go(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(screen).classList.add('active');
  if (screen === 'map') renderMap();
  if (screen === 'shop') renderShop();
  if (screen === 'craft') renderCraft();
  if (screen === 'bag') renderBag();
}

/* ---------- HUD ---------- */
function renderHUD() {
  $('coinCount').textContent = S.coins;
  $('weaponLabel').textContent = currentWeapon().name;
  const cur = STAGES[Math.min(S.unlocked, STAGES.length - 1)];
  $('stageLabel').textContent = cur ? cur.name : '0단';
}

/* ---------- 지도 ---------- */
function renderMap() {
  const list = $('stageList');
  list.innerHTML = '';
  STAGES.forEach(st => {
    const locked = st.idx > S.unlocked;
    const cleared = st.idx < S.stageProgress;
    const card = document.createElement('div');
    card.className = 'stage-card' + (locked ? ' locked' : '') + (cleared ? ' cleared' : '');
    card.innerHTML = `
      ${cleared ? '<span class="star">⭐</span>' : ''}
      ${locked ? '<span class="lock">🔒</span>' : ''}
      <div class="st-emoji">${st.emoji}</div>
      <div class="st-name">${st.name}</div>
      <div class="st-sub">${locked ? '잠김' : (cleared ? '깼어요!' : '보스: ' + st.boss.name)}</div>`;
    if (!locked) card.onclick = () => startStage(st.idx);
    list.appendChild(card);
  });
}

/* =========================================================
   퀴즈 (문제 풀어 코인 모으기 + 보스전 동시 진행)
   한 화면에서: 보스몹이 보이고, 문제를 맞히면 코인 획득 +
   보스를 공격. need 만큼 맞히면 보스 처치 가능 상태 체크.
   -> 요구사항: 문제와 보스몹 동시 표시
   ========================================================= */

let Q = null; // 현재 퀴즈 상태

function startStage(idx) {
  const st = STAGES[idx];
  const boss = st.boss;
  Q = {
    stage: st,
    boss,
    bossMaxHp: boss.hp,
    bossHp: boss.hp,
    correct: 0,
    a: 0, b: 0,
  };
  go('quiz');
  buildQuizScreen();
  nextQuestion();
}

/* 퀴즈 화면을 보스몹 포함 레이아웃으로 재구성 */
function buildQuizScreen() {
  const st = Q.stage, boss = Q.boss;
  $('quiz').innerHTML = `
    <div class="quiz-top">
      <span class="chip">${st.emoji} ${st.name}</span>
      <span class="chip">맞힌 공격 <span id="quizProgress">0</span>/${st.need}</span>
    </div>

    <div class="battle-stage">
      <div class="boss-fx-mount" id="bossFxMount"></div>
      <div class="boss-sprite-mount" id="bossMount">${renderBoss(boss.key)}</div>
      <div class="boss-name-tag">${boss.name}</div>
      <div class="hp-bar"><div id="bossHpFill" style="width:100%"></div></div>
      <div id="bossHpText" class="hp-text">${boss.hp} / ${boss.hp}</div>
      <div class="player-weapon" id="playerWeapon">${weaponSvg(currentWeapon().key)}<span>${currentWeapon().name} (공격력 ${currentWeapon().dmg})</span></div>
    </div>

    <div id="questionBox" class="question">? × ? = ?</div>
    <input id="answerInput" class="answer-input" type="number" inputmode="numeric" placeholder="답을 입력!" />
    <button id="btnSubmit" class="big-btn green">⚔️ 공격!</button>
    <div id="quizFeedback" class="feedback"></div>
    <button class="back-btn" data-go="map">← 지도로</button>`;

  $('btnSubmit').onclick = submitAnswer;
  $('answerInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAnswer(); });
  $('quiz').querySelector('[data-go]').onclick = () => go('map');
}

function nextQuestion() {
  const st = Q.stage;
  const a = st.table === null ? rand(10) : st.table;  // 랜덤단이면 앞수도 랜덤
  const b = rand(10);
  Q.a = a; Q.b = b;
  $('questionBox').textContent = `${a} × ${b} = ?`;
  const inp = $('answerInput');
  inp.value = '';
  inp.focus();
}

function submitAnswer() {
  const inp = $('answerInput');
  const val = inp.value.trim();
  if (val === '') { toast('답을 입력하세요!'); return; }
  const answer = parseInt(val, 10);
  const correct = Q.a * Q.b;
  const fb = $('quizFeedback');

  if (answer === correct) {
    // 정답! 코인 + 보스 공격
    sfxCorrect();
    S.coins += COIN_PER_CORRECT;
    sfxCoin();
    Q.correct++;
    const dmg = currentWeapon().dmg;
    Q.bossHp = Math.max(0, Q.bossHp - dmg);
    fb.className = 'feedback ok';
    fb.textContent = `정답! 💰+${COIN_PER_CORRECT}  ⚔️ ${dmg} 피해!`;
    attackBoss(dmg);
    renderHUD(); save();

    $('quizProgress').textContent = Q.correct;
    updateBossHp();

    if (Q.bossHp <= 0) { bossDefeated(); return; }
    setTimeout(nextQuestion, 650);
  } else {
    sfxWrong();
    fb.className = 'feedback no';
    fb.textContent = `아쉬워요! ${Q.a} × ${Q.b} = ${correct} 랍니다. 다시!`;
    shakeInput(inp);
    nextQuestionDelayedSame();
  }
}

/* 틀리면 같은 문제 다시 (연습 효과) */
function nextQuestionDelayedSame() {
  const inp = $('answerInput');
  setTimeout(() => { inp.value = ''; inp.focus(); }, 400);
}

function shakeInput(inp) {
  inp.style.animation = 'none';
  // 강제 리플로우
  void inp.offsetWidth;
  inp.style.animation = 'inputShake .3s';
}

/* 보스 피격 연출 */
function attackBoss(dmg) {
  const mount = $('bossMount');
  const svg = mount.querySelector('.mob-svg');
  if (svg) {
    svg.classList.remove('hit'); void svg.offsetWidth; svg.classList.add('hit');
  }
  sfxHit();
  // 데미지 숫자 띄우기
  const d = document.createElement('div');
  d.className = 'dmg-float';
  d.textContent = '-' + dmg;
  mount.appendChild(d);
  setTimeout(() => d.remove(), 800);
}

function updateBossHp() {
  const pct = (Q.bossHp / Q.bossMaxHp) * 100;
  $('bossHpFill').style.width = pct + '%';
  $('bossHpText').textContent = `${Q.bossHp} / ${Q.bossMaxHp}`;
}

function bossDefeated() {
  const svg = $('bossMount').querySelector('.mob-svg');
  if (svg) svg.classList.add('dead');
  sfxWin();

  const idx = Q.stage.idx;
  const firstClear = idx >= S.stageProgress;
  const bonus = 20 + idx * 5;
  S.coins += bonus;

  if (firstClear) {
    S.stageProgress = idx + 1;
    S.unlocked = Math.min(STAGES.length - 1, Math.max(S.unlocked, idx + 1));
  }
  renderHUD(); save();

  const next = STAGES[idx + 1];
  let msg = `<b>${Q.boss.name}</b>를 물리쳤어요! 🎉<br>보너스 코인 💰+${bonus}`;
  if (idx === STAGES.length - 1) {
    msg = `🏆 축하해요! <b>엔더 드래곤</b>까지 물리쳤어요!<br>곱셈구구 마스터가 되었어요! 💎<br>보너스 💰+${bonus}`;
  } else if (next) {
    msg += `<br><b>${next.name}</b>이(가) 열렸어요!`;
  }

  setTimeout(() => {
    modal(idx === STAGES.length - 1 ? '🏆' : '🎉', msg, () => go('map'));
  }, 900);
}

/* =========================================================
   상점
   ========================================================= */
function renderShop() {
  $('shopCoin').textContent = S.coins;
  const list = $('shopList');
  list.innerHTML = '';
  Object.entries(MATERIALS).forEach(([key, m]) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    const canBuy = S.coins >= m.cost;
    row.innerHTML = `
      ${matSvg(key)}
      <div class="info">
        <div class="nm">${m.name} <span style="color:#888;font-size:12px">(보유 ${matCount(key)})</span></div>
        <div class="ds">${m.desc}</div>
      </div>
      <button class="buy-btn" ${canBuy ? '' : 'disabled'}>💰 ${m.cost}</button>`;
    row.querySelector('.buy-btn').onclick = () => {
      if (S.coins < m.cost) { toast('코인이 부족해요!'); return; }
      S.coins -= m.cost;
      addMat(key, 1);
      sfxCoin();
      toast(`${m.name} 구입! 🎒`);
      renderHUD(); renderShop(); save();
    };
    list.appendChild(row);
  });
}

/* =========================================================
   제작대 (중간 조합물 + 무기)
   ========================================================= */
function recipeText(recipe) {
  return Object.entries(recipe).map(([k, n]) => {
    const nm = (MATERIALS[k] && MATERIALS[k].name)
      || ({ stick: '막대기', netherite_scrap: '네더라이트 조각', netherite: '네더라이트 주괴', diamond_sword_base: '다이아몬드검' })[k]
      || k;
    return `${nm}×${n}`;
  }).join(' + ');
}

function renderCraft() {
  const list = $('craftList');
  list.innerHTML = '';

  // 섹션 1: 중간 조합물
  const h1 = document.createElement('div');
  h1.innerHTML = '<h3 style="margin:4px 0 2px">🧪 재료 가공</h3>';
  list.appendChild(h1);

  CRAFTABLES.forEach(c => {
    const can = hasMats(c.recipe);
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      ${matSvg(c.key)}
      <div class="info">
        <div class="nm">${c.name} <span style="color:#888;font-size:12px">(보유 ${matCount(c.key)})</span></div>
        <div class="ds">${c.desc} <br><small>필요: ${recipeText(c.recipe)}</small></div>
      </div>
      <button class="buy-btn" ${can ? '' : 'disabled'}>만들기</button>`;
    row.querySelector('.buy-btn').onclick = () => {
      if (!hasMats(c.recipe)) { toast('재료가 부족해요!'); return; }
      spendMats(c.recipe);
      addMat(c.key, c.out);
      beep(500, .1);
      toast(`${c.name} ${c.out}개 제작!`);
      renderCraft(); save();
    };
    list.appendChild(row);
  });

  // 섹션 2: 무기
  const h2 = document.createElement('div');
  h2.innerHTML = '<h3 style="margin:14px 0 2px">🗡️ 무기 제작</h3>';
  list.appendChild(h2);

  WEAPONS.filter(w => w.recipe).forEach(w => {
    const owned = S.ownedWeapons.includes(w.key);
    // 네더라이트검은 다이아몬드검 보유를 재료로 요구
    const recipe = { ...w.recipe };
    let needDiaSword = false;
    if ('diamond_sword_base' in recipe) {
      needDiaSword = true;
      delete recipe.diamond_sword_base;
    }
    const hasBase = !needDiaSword || S.ownedWeapons.includes('diamond');
    const can = !owned && hasMats(recipe) && hasBase;
    const equipped = S.weaponKey === w.key;

    const row = document.createElement('div');
    row.className = 'item-row' + (owned ? ' owned' : '');
    row.innerHTML = `
      ${weaponSvg(w.key)}
      <div class="info">
        <div class="nm">${w.name} <span class="badge" style="background:#555">공격력 ${w.dmg}</span></div>
        <div class="ds"><small>필요: ${recipeText(w.recipe)}</small></div>
      </div>
      ${owned
        ? (equipped ? '<span class="badge">장착중</span>' : '<button class="buy-btn" style="background:#4caf50">장착</button>')
        : `<button class="buy-btn" ${can ? '' : 'disabled'}>제작</button>`}`;

    const btn = row.querySelector('.buy-btn');
    if (btn) {
      btn.onclick = () => {
        if (owned) {
          S.weaponKey = w.key;
          toast(`${w.name} 장착!`);
          renderHUD(); renderCraft(); save();
          return;
        }
        if (!hasBase) { toast('먼저 다이아몬드검이 필요해요!'); return; }
        if (!hasMats(recipe)) { toast('재료가 부족해요!'); return; }
        spendMats(recipe);
        S.ownedWeapons.push(w.key);
        // 더 강하면 자동 장착
        if (w.dmg >= currentWeapon().dmg) S.weaponKey = w.key;
        sfxWin();
        modal('🗡️', `<b>${w.name}</b> 완성!<br>공격력 ${w.dmg}! 자동으로 장착했어요.`);
        renderHUD(); renderCraft(); save();
      };
    }
    list.appendChild(row);
  });
}

/* =========================================================
   가방
   ========================================================= */
function renderBag() {
  const list = $('bagList');
  list.innerHTML = '';
  const allKeys = [...Object.keys(MATERIALS), 'stick', 'netherite_scrap', 'netherite'];
  const owned = allKeys.filter(k => matCount(k) > 0);

  // 무기 섹션
  const wh = document.createElement('div');
  wh.innerHTML = '<h3 style="margin:4px 0 6px">🗡️ 가진 무기</h3>';
  list.appendChild(wh);
  S.ownedWeapons.forEach(wk => {
    const w = WEAPONS.find(x => x.key === wk);
    const row = document.createElement('div');
    row.className = 'item-row' + (S.weaponKey === wk ? ' owned' : '');
    row.innerHTML = `${weaponSvg(wk)}<div class="info"><div class="nm">${w.name}</div><div class="ds">공격력 ${w.dmg}</div></div>${S.weaponKey===wk?'<span class="badge">장착중</span>':'<button class="buy-btn" style="background:#4caf50">장착</button>'}`;
    const b = row.querySelector('.buy-btn');
    if (b) b.onclick = () => { S.weaponKey = wk; toast(`${w.name} 장착!`); renderHUD(); renderBag(); save(); };
    list.appendChild(row);
  });

  const mh = document.createElement('div');
  mh.innerHTML = '<h3 style="margin:14px 0 6px">🎒 가진 재료</h3>';
  list.appendChild(mh);

  if (owned.length === 0) {
    const e = document.createElement('div');
    e.className = 'empty-note';
    e.textContent = '아직 재료가 없어요. 문제를 풀어 코인을 모으고 상점에서 사보세요!';
    list.appendChild(e);
    return;
  }
  const nameOf = (k) => (MATERIALS[k] && MATERIALS[k].name) || ({ stick:'막대기', netherite_scrap:'네더라이트 조각', netherite:'네더라이트 주괴' })[k] || k;
  owned.forEach(k => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `${matSvg(k)}<div class="info"><div class="nm">${nameOf(k)}</div></div><span class="cnt">${matCount(k)}</span>`;
    list.appendChild(row);
  });
}

/* =========================================================
   초기화 / 이벤트 바인딩
   ========================================================= */
function bindNav() {
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => go(el.dataset.go));
  });
  $('btnReset').onclick = () => {
    modal('⚠️', '정말 처음부터 다시 시작할까요?<br>모은 코인과 재료가 모두 사라져요!', null);
    // 모달 버튼을 확인/취소로 바꾸기
    const box = $('modal').querySelector('.modal-box');
    const old = $('modalBtn');
    old.textContent = '네, 초기화';
    old.onclick = () => {
      S = DEFAULT_STATE(); save();
      $('modal').classList.remove('show');
      old.textContent = '좋아!';
      renderHUD(); go('home');
      toast('새로 시작합니다!');
    };
  };
}

function init() {
  bindNav();
  renderHUD();
  go('home');
}

document.addEventListener('DOMContentLoaded', init);
