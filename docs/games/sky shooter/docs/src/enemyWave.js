import { spawnEnemyByMoveType } from "./enemySpawn.js";

// ===============================
// ウェーブ管理用変数
// ===============================
let waveTimer = 0;   // ウェーブ間隔
let waveIndex = 0;   // 現在のウェーブ番号
let waveStep = 0;    // ウェーブ内の何体目か
let stepTimer = 0;     // ウェーブ内の敵間隔タイマー
let comboCount = 2;     // 最初は2種類の組み合わせ
let unlockLevel = 1;    // 最初は弱い敵だけ解放
let currentCombo = null;  // 今のウェーブで使う combo（種類リスト）
let lastMoveType = null;
let enemies = null;

// ===============================
// 待ち時間テーブル
// ===============================
const waitTable = {
  0: 6,
  1: 6,
  2: 6,
  3: 6,
  4: 8,
  5: 8,
  6: 16,
  7: 16,
  8: 16,
  9: 16,
};

export function setupWave(enemiesRef) {
  enemies = enemiesRef;
}

// ===============================
// 初期化関数
// ===============================
export function initWave() {
  waveTimer = 0;
  waveIndex = 0;
  waveStep = 0;
  stepTimer = 0;

  comboCount = 2;
  unlockLevel = 1;
  currentCombo = null;
  lastMoveType = null;
  let enemies = null;
}

// ===============================
// メイン処理（update.js から呼ばれる）
// ===============================
export function updateWave(dt) {
  // 前回のウェーブの moveType に応じて待ち時間を決める
  const waitTime = (lastMoveType !== null) ? waitTable[lastMoveType] : 0;

  // ===============================
  // ボスウェーブ（1体だけ出す）
  // ===============================
  if (waveIndex === 30) {

    // 待ち時間処理
    if (waveStep === 0) {
      waveTimer += dt;
      if (waveTimer < waitTime) return;

      // ボス1体だけ
      spawnEnemyByMoveType(30);
      waveStep = 5;
    }

    // ボスがいる → 次のウェーブに行かない
    const bossAlive = enemies.some(e => e.isBoss);
    if (bossAlive) return;
    
    currentCombo = [waveIndex];
    comboCount = 2;
    unlockLevel = 10;
  }

  // ===============================
  // 通常ウェーブ（5体生成）
  // ===============================
  // ウェーブ開始前の待ち時間
  if (waveStep === 0) {
    waveTimer += dt;
    if (waveTimer < waitTime) return;

    // ここで1回だけ combo を決める
    if (waveIndex < 31) {
      // 固定ステージ
      currentCombo = [waveIndex];
    } else {
      // ランダムステージ
      currentCombo = generateRandomCombo(comboCount, unlockLevel);
    }
  }

  // ウェーブ内の敵間隔タイマー（1秒）
  stepTimer += dt;

  if (stepTimer >= 1) {
    if (currentCombo[0] === 30) {
      spawnEnemyByMoveType(30);
      waveStep = 5; // ボスは1体だけ
      stepTimer = 0;
      return;
    }

    currentCombo.forEach(type => {
      spawnEnemyByMoveType(type);
    });

    waveStep++;
    stepTimer = 0; // 次の敵のためにリセット
  }

  // 5体出し終わったら次のウェーブへ
  if (waveStep >= 5) {
    lastMoveType = currentCombo[0] % 10;  // 待ち時間用に先頭のタイプを記録
    waveIndex++;
    waveStep = 0;
    waveTimer = 0;

    // ランダムステージの成長
    if (waveIndex % 5 === 0) {
      unlockLevel = Math.min(unlockLevel + 10, 31);
    }

    if (waveIndex % 30 === 0) {
      if (comboCount !== 5) {
        unlockLevel = 10;
      }
      comboCount = Math.min(comboCount + 1, 5);
    }
  }
}

// ===============================
// 固定ウェーブ終了後のランダムウェーブ生成処理
// ===============================
function generateRandomCombo(comboCount, unlockLevel) {
  let selectLevel = unlockLevel;
  // ボス抽選（unlockLevel >= 31 のときのみ）
  if (selectLevel >= 31) {
    let bossRate = 0.1; // 例：10%

    // ボスが生存している間は確率を下げる
    const bossAlive = enemies.some(e => e.isBoss);
    if (bossAlive) {
      bossRate = 0.01; // 例：1%
    }

    // ボスが選ばれたらボスだけ返す
    if (Math.random() < bossRate) {
      return [30]; // ボス1体のみ
    }

    selectLevel -= 1;
  }

  // ここから通常の重複なしランダム抽選
  const pool = [...Array(selectLevel).keys()]; // 0〜unlockLevel-1
  const combo = [];

  for (let i = 0; i < comboCount; i++) {
    const index = Math.floor(Math.random() * pool.length);
    combo.push(pool[index]);
    pool.splice(index, 1); // 重複を防ぐ
  }

  return combo;
}

