// ===============================
// モジュールインポート
// ===============================
import { setupInput } from "./input.js";
import { drawGame } from "./draw.js";
import { setupDraw } from "./draw.js";
import { initUpdateState, setupUpdate, updateGame } from "./update.js";
import { checkIsTop100 } from "./ranking.js";
import { showGameOver } from "./gameOver.js";
import { initWave } from "./enemyWave.js";
import { setupItem } from "./item.js";

// ===============================
// ゲーム状態
// ===============================
let gameState = "title";   // title, gameReady, playing, result
let lastTime = 0;          // 前フレームの時間
let deltaTime = 0;         // 経過時間（秒）
let isLoopRunning = false; // 二重ループ防止
let canvas = null;
let ctx = null;
let player = null;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let items = [];
let score = { value: 0, multiplier: 1};
let killCounts = {
  small: 0,
  medium: 0,
  large: 0,
  boss: 0
};

// ===============================
// ゲーム初期化
// ===============================
export function initGame() {
  // 自機・敵・弾などの初期化はここに追加していく
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  player = { x: 240, y: 600, radius: 12, rapid: 1, spread: false };
  score = {value: 0, multiplier: 1};
  enemies = [];
  bullets = [];
  enemyBullets = [];
  items = [];

  // 撃破数リセット
  killCounts.small = 0;
  killCounts.medium = 0;
  killCounts.large = 0;
  killCounts.boss = 0;

  // 他ファイルの変数初期化
  initWave();
  initUpdateState();

  setupInput(player, canvas, () => gameState);
  setupDraw(ctx, canvas, player, enemies, bullets, enemyBullets, items, score, () => gameState);
  setupUpdate(player, enemies, bullets, enemyBullets, items, gameOver, score, killCounts);
  setupItem(items, player, score);

  // 状態変更
  gameState = "gameReady";
}

// ===============================
// ゲームループ開始
// ===============================
export function startGameLoop() {
  if (isLoopRunning) return; // 二重起動防止
  isLoopRunning = true;

  lastTime = performance.now();
  requestAnimationFrame(loop);
}

// ===============================
// メインループ
// ===============================
function loop(time) {
  deltaTime = (time - lastTime) / 1000; // 秒に変換
  lastTime = time;

  if (gameState === "playing") {
    updateGame(deltaTime);
    
  }

  drawGame();
  
  requestAnimationFrame(loop);
}

// ===============================
// ゲームオーバー
// ===============================
export function gameOver() {
  gameState = "result";
  isLoopRunning = false;

  // ランキング100位以内かどうか（仮の関数）
  const isTop100 = checkIsTop100(score.value);

  // ゲームオーバーUIを表示
  showGameOver(score.value, killCounts, isTop100);
}

export function getGameState() {
  return gameState;
}

export function startPlaying() {
  if (gameState === "gameReady") {
    gameState = "playing";
  }
}