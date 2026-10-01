/* =========================================================
   보스몹 & 재료 & 무기 SVG 스프라이트 모음
   - 전부 코드로 직접 그린 픽셀/벡터 그래픽
   - CSS 애니메이션(쿵쿵, 콧김, 눈 깜빡임, 둥둥)과 함께 동작
   ========================================================= */

/* 공통 픽셀 블록 헬퍼: viewBox 16x16 기준 사각형 그리드 그림을 쉽게 */
function px(x, y, c, w = 1, h = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
}

/* ---------- 보스몹 스프라이트 (viewBox 0 0 16 20 안에 그림) ---------- */
/* 각 보스는 몸통 그룹(.body)과 선택적 콧김/파티클을 가진다 */

const BOSS_SPRITES = {
  // 0단: 좀비
  zombie: () => `
    <g class="mob-body">
      ${px(5,1,'#1f7a3d',6,4)}            <!-- 머리 -->
      ${px(5,2,'#0a0a0a',1,1)}${px(10,2,'#0a0a0a',1,1)} <!-- 눈 -->
      ${px(6,2,'#143d1f',1,1)}${px(9,2,'#143d1f',1,1)}
      ${px(5,5,'#3b7fd4',6,6)}            <!-- 몸통(파란옷) -->
      ${px(5,6,'#2f66aa',6,1)}
      <g class="limb-l">${px(3,5,'#1f7a3d',2,5)}</g> <!-- 왼팔 앞으로 -->
      <g class="limb-r">${px(11,5,'#1f7a3d',2,5)}</g>
      ${px(5,11,'#2b2f6b',2,4)}${px(9,11,'#2b2f6b',2,4)} <!-- 다리 -->
    </g>`,

  // 1단: 거미
  spider: () => `
    <g class="mob-body">
      ${px(4,8,'#20120a',8,5)}            <!-- 몸통 -->
      ${px(5,6,'#2b1a0e',6,3)}            <!-- 머리 -->
      ${px(5,7,'#e23b3b',1,1)}${px(7,7,'#e23b3b',1,1)}${px(9,7,'#e23b3b',1,1)} <!-- 빨간 눈 -->
      <g class="spider-legs">
        ${px(1,7,'#20120a',3,1)}${px(1,10,'#20120a',3,1)}
        ${px(12,7,'#20120a',3,1)}${px(12,10,'#20120a',3,1)}
      </g>
    </g>`,

  // 2단: 스켈레톤
  skeleton: () => `
    <g class="mob-body">
      ${px(5,1,'#e8e8e8',6,4)}
      ${px(6,2,'#0a0a0a',1,2)}${px(9,2,'#0a0a0a',1,2)}
      ${px(6,5,'#cfcfcf',4,1)}
      ${px(7,5,'#dcdcdc',2,6)}            <!-- 척추 -->
      <g class="limb-l">${px(4,5,'#dcdcdc',2,5)}</g>
      <g class="limb-r">${px(10,5,'#dcdcdc',2,5)}</g>
      ${px(6,11,'#dcdcdc',1,4)}${px(9,11,'#dcdcdc',1,4)}
      ${px(10,3,'#8a5a2b',1,8)}           <!-- 활 -->
    </g>`,

  // 3단: 크리퍼
  creeper: () => `
    <g class="mob-body">
      ${px(5,1,'#4caf50',6,5)}
      ${px(6,2,'#0a0a0a',1,2)}${px(9,2,'#0a0a0a',1,2)}
      ${px(7,3,'#0a0a0a',2,3)}${px(6,5,'#0a0a0a',1,1)}${px(9,5,'#0a0a0a',1,1)}
      ${px(5,6,'#4caf50',6,8)}
      ${px(5,6,'#3f9243',6,1)}
      ${px(5,14,'#357a39',2,1)}${px(9,14,'#357a39',2,1)}
    </g>`,

  // 4단: 마녀
  witch: () => `
    <g class="mob-body">
      ${px(5,3,'#4a3f6b',6,1)}            <!-- 모자챙 -->
      ${px(6,0,'#4a3f6b',4,3)}            <!-- 모자 -->
      ${px(7,0,'#5e5188',2,1)}
      ${px(5,4,'#5fa36b',6,3)}            <!-- 얼굴 -->
      ${px(6,5,'#0a0a0a',1,1)}${px(9,5,'#0a0a0a',1,1)}
      ${px(7,6,'#8a3b6b',2,1)}            <!-- 코 -->
      ${px(5,7,'#6b3f8a',6,7)}            <!-- 로브 -->
      ${px(5,8,'#5a2f78',6,1)}
    </g>`,

  // 5단: 블레이즈
  blaze: () => `
    <g class="mob-body">
      <g class="blaze-rods">
        ${px(3,4,'#ffcf3f',1,8)}${px(12,4,'#ffcf3f',1,8)}
        ${px(5,2,'#ffb13f',1,12)}${px(10,2,'#ffb13f',1,12)}
      </g>
      ${px(6,5,'#ffe08a',4,6)}            <!-- 중심 -->
      ${px(6,6,'#2b2b2b',1,1)}${px(9,6,'#2b2b2b',1,1)}
      ${px(7,8,'#2b2b2b',2,1)}
    </g>`,

  // 6단: 위더 스켈레톤
  witherSkeleton: () => `
    <g class="mob-body">
      ${px(5,1,'#2b2b2b',6,4)}
      ${px(6,2,'#ff6b1f',1,2)}${px(9,2,'#ff6b1f',1,2)} <!-- 주황 눈 -->
      ${px(7,5,'#3a3a3a',2,6)}
      <g class="limb-l">${px(4,5,'#3a3a3a',2,5)}</g>
      <g class="limb-r">${px(10,5,'#3a3a3a',2,5)}</g>
      ${px(6,11,'#3a3a3a',1,4)}${px(9,11,'#3a3a3a',1,4)}
      ${px(11,3,'#777',1,9)}              <!-- 돌검 -->
    </g>`,

  // 7단: 가스트
  ghast: () => `
    <g class="mob-body">
      ${px(4,2,'#f2f2f2',8,8)}            <!-- 큰 머리 -->
      ${px(4,3,'#ffffff',8,1)}
      ${px(5,4,'#c62828',2,2)}${px(9,4,'#c62828',2,2)} <!-- 눈(쏠때 빨강) -->
      ${px(6,7,'#c62828',4,1)}            <!-- 입 -->
      <g class="ghast-tent">
        ${px(5,10,'#e0e0e0',1,4)}${px(7,10,'#e0e0e0',1,5)}${px(9,10,'#e0e0e0',1,4)}${px(11,10,'#e0e0e0',1,3)}${px(3,10,'#e0e0e0',1,3)}
      </g>
    </g>`,

  // 8단: 엔더맨
  enderman: () => `
    <g class="mob-body">
      ${px(6,0,'#0a0a0a',4,3)}            <!-- 작은 머리 -->
      ${px(6,1,'#c58bff',4,1)}            <!-- 보라 눈 -->
      ${px(6,3,'#0a0a0a',4,8)}            <!-- 긴 몸 -->
      <g class="limb-l">${px(4,3,'#141414',2,9)}</g>
      <g class="limb-r">${px(10,3,'#141414',2,9)}</g>
      ${px(6,11,'#0a0a0a',1,8)}${px(9,11,'#0a0a0a',1,8)} <!-- 긴 다리 -->
      <g class="ender-particles"></g>
    </g>`,

  // 9단: 위더 (3개 머리)
  wither: () => `
    <g class="mob-body">
      ${px(7,1,'#3a3a3a',2,5)}            <!-- 중앙머리 -->
      ${px(3,2,'#2b2b2b',3,3)}            <!-- 왼머리 -->
      ${px(10,2,'#2b2b2b',3,3)}           <!-- 오른머리 -->
      ${px(7,2,'#ff6b1f',1,1)}${px(8,2,'#ff6b1f',1,1)}
      ${px(4,3,'#ff6b1f',1,1)}${px(11,3,'#ff6b1f',1,1)}
      ${px(7,6,'#3a3a3a',2,2)}            <!-- 척추 상단 -->
      ${px(6,8,'#2b2b2b',4,2)}
      ${px(7,10,'#3a3a3a',2,5)}           <!-- 갈비뼈 꼬리 -->
    </g>`,

  // 랜덤단(최종): 엔더 드래곤
  dragon: () => `
    <g class="mob-body">
      ${px(5,2,'#2b2b2b',6,4)}            <!-- 머리 -->
      ${px(5,3,'#c58bff',1,1)}${px(10,3,'#c58bff',1,1)}
      ${px(6,5,'#4a2f6b',4,2)}            <!-- 주둥이 -->
      ${px(4,6,'#1a1a1a',8,4)}            <!-- 몸통 -->
      <g class="dragon-wing-l">${px(0,4,'#2b2b2b',4,6)}</g>
      <g class="dragon-wing-r">${px(12,4,'#2b2b2b',4,6)}</g>
      ${px(6,10,'#1a1a1a',4,5)}
      ${px(7,15,'#1a1a1a',2,4)}           <!-- 꼬리 -->
    </g>`,
};

/* ---------- 콧김/파티클 레이어 (일부 보스에 추가) ---------- */
const BOSS_FX = {
  zombie: '', spider: '',
  skeleton: '',
  creeper: '<div class="fx spark"></div>',
  witch: '<div class="fx bubble b1"></div><div class="fx bubble b2"></div>',
  blaze: '<div class="fx flame f1"></div><div class="fx flame f2"></div><div class="fx flame f3"></div>',
  witherSkeleton: '',
  ghast: '<div class="fx fire-ball"></div>',
  enderman: '<div class="fx ender e1"></div><div class="fx ender e2"></div><div class="fx ender e3"></div>',
  wither: '<div class="fx smoke s1"></div><div class="fx smoke s2"></div>',
  dragon: '<div class="fx breath"></div><div class="fx breath d2"></div>',
};

/* 코로 뿜는 콧김(모든 큰 보스 공통으로 쓸 수 있는 숨결) */
function breathPuff() {
  return '<div class="fx puff p1"></div><div class="fx puff p2"></div>';
}

/* 보스 전체 HTML(svg + fx) 생성 */
function renderBoss(key) {
  const draw = BOSS_SPRITES[key] || BOSS_SPRITES.zombie;
  const fx = BOSS_FX[key] || '';
  return `
    <div class="boss-fx-layer">${fx}${breathPuff()}</div>
    <svg class="mob-svg mob-${key}" viewBox="0 0 16 20" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      ${draw()}
    </svg>`;
}

/* ---------- 재료 아이콘 SVG (viewBox 0 0 16 16) ---------- */
const MAT_SPRITES = {
  wood: `${px(2,2,'#9c6b3f',12,12)}${px(2,2,'#b07d4a',12,2)}${px(4,4,'#7a5230',2,2)}${px(9,7,'#7a5230',2,3)}${px(4,10,'#8a5e38',3,2)}`,
  stone: `${px(2,2,'#8a8a8a',12,12)}${px(2,2,'#9c9c9c',12,2)}${px(4,5,'#6f6f6f',3,2)}${px(9,8,'#6f6f6f',3,3)}${px(5,10,'#777',2,2)}`,
  coal: `${px(2,2,'#8a8a8a',12,12)}${px(4,4,'#1a1a1a',3,3)}${px(9,5,'#2b2b2b',3,4)}${px(5,9,'#111',4,3)}`,
  copper: `${px(2,2,'#c87b4a',12,12)}${px(2,2,'#e08a52',12,2)}${px(4,5,'#a85f36',3,2)}${px(9,8,'#8fae7a',3,3)}`,
  iron: `${px(2,2,'#d8d8d8',12,12)}${px(2,2,'#efefef',12,2)}${px(4,5,'#b8b8b8',3,2)}${px(9,8,'#c4c4c4',3,3)}`,
  gold: `${px(2,2,'#ffcf3f',12,12)}${px(2,2,'#ffe17a',12,2)}${px(4,5,'#e0a800',3,2)}${px(9,8,'#e0a800',3,3)}`,
  diamond: `${px(5,2,'#8df5ef',6,2)}${px(3,4,'#5fe3dc',10,4)}${px(5,8,'#3ad6cf',6,4)}${px(7,12,'#2bb8b2',2,2)}${px(6,5,'#ffffff',2,1)}`,
  ancient_debris: `${px(2,2,'#5a3a2b',12,12)}${px(4,4,'#8a6b4a',3,3)}${px(9,6,'#7a5a3a',3,4)}${px(5,10,'#6b4a30',4,3)}`,
  netherite_scrap: `${px(3,3,'#4a3f3a',10,10)}${px(5,5,'#8a7a6b',3,2)}${px(9,8,'#6b5a4a',2,3)}${px(5,9,'#5a4a3f',3,2)}`,
  netherite: `${px(2,2,'#3a2f33',12,12)}${px(2,2,'#4a3f45',12,2)}${px(4,5,'#2b2225',3,2)}${px(9,8,'#2b2225',3,3)}${px(6,4,'#6b5f66',2,1)}`,
  stick: `${px(7,2,'#8a5e38',2,12)}${px(7,2,'#9c6b3f',2,2)}`,
  emerald: `${px(6,2,'#4caf50',4,2)}${px(4,4,'#5fc96b',8,8)}${px(6,12,'#3f9243',4,2)}${px(7,5,'#9affb0',1,2)}`,
};

function matSvg(key) {
  return `<svg class="mat-svg" viewBox="0 0 16 16" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${MAT_SPRITES[key] || ''}</svg>`;
}

/* ---------- 무기(검) 아이콘 SVG ---------- */
function swordSvg(bladeColor, hiltColor = '#8a5e38', guardColor = '#5a3f28') {
  return `<svg class="weap-svg" viewBox="0 0 16 16" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
    ${px(10,2,bladeColor,2,2)}${px(9,3,bladeColor,2,2)}${px(8,4,bladeColor,2,2)}
    ${px(7,5,bladeColor,2,2)}${px(6,6,bladeColor,2,2)}${px(5,7,bladeColor,2,2)}
    ${px(11,2,'#ffffff',1,1)}
    ${px(4,8,guardColor,4,1)}${px(5,7,guardColor,1,1)}
    ${px(3,9,hiltColor,3,3)}${px(2,10,hiltColor,1,1)}
  </svg>`;
}

const WEAPON_SPRITES = {
  fist: `<svg class="weap-svg" viewBox="0 0 16 16" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${px(5,5,'#f0c08a',6,6)}${px(5,5,'#ffd9a8',6,1)}${px(6,8,'#d6a070',4,1)}</svg>`,
  wood: swordSvg('#b07d4a'),
  stone: swordSvg('#9c9c9c'),
  copper: swordSvg('#e08a52'),
  iron: swordSvg('#e8e8e8'),
  gold: swordSvg('#ffcf3f'),
  diamond: swordSvg('#3ad6cf'),
  netherite: swordSvg('#4a3f45', '#2b2225', '#1a1416'),
};

function weaponSvg(key) {
  return WEAPON_SPRITES[key] || WEAPON_SPRITES.fist;
}
