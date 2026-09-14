import { resizeGame, showScreen } from "./ui.js";
import { initGame, startGameLoop, getGameState, startPlaying } from "./gameCore.js";

// DOM取得
const startButton = document.getElementById("startButton");
const howToButton = document.getElementById("howToButton");
const backToTitle = document.getElementById("backToTitle");
const canvas = document.getElementById("gameCanvas");

// タイトル → ゲーム画面
startButton.addEventListener("click", () => {
  showScreen("gameScreen");
  initGame();
  startGameLoop();
  document.getElementById("tapToStartText").style.display = "block";
});

// タイトル → 遊び方
howToButton.addEventListener("click", () => {
  showScreen("howToScreen");
});

// 遊び方 → タイトル
backToTitle.addEventListener("click", () => {
  showScreen("titleScreen");
});

// ゲーム画面でタップしたらゲーム開始
canvas.addEventListener("pointerdown", () => {
  if (getGameState() === "gameReady") {
    document.getElementById("tapToStartText").style.display = "none";
    startPlaying();
  }
});

// もう一度プレイ
document.getElementById("retryBtn").addEventListener("click", () => {
  // ゲームオーバー画面を消す
  document.getElementById("gameOverOverlay").style.display = "none";

  // ゲーム画面に戻す（すでに表示されているが安全のため）
  showScreen("gameScreen");

  // ゲーム初期化
  initGame();

  // ゲームループ再開
  startGameLoop();

  // タップで開始を再表示
  document.getElementById("tapToStartText").style.display = "block";
});

// 画面リサイズ
window.addEventListener("resize", resizeGame);
window.addEventListener("load", resizeGame);