import { resizeGame, showScreen } from "./ui.js";
import { initGame, startGameLoop, getGameState, startPlaying } from "./gameCore.js";
import { setupHowToSlides } from "./howToSlides.js";
import { showRankingModal } from "./ranking.js";

// DOM取得
const startButton = document.getElementById("startButton");
const canvas = document.getElementById("gameCanvas");

// 遊び方画面の初期化設定
setupHowToSlides();

// 画面リサイズ
window.addEventListener("resize", resizeGame);

// ロード時初期化
window.addEventListener("load", () => {
  resizeGame();
  document.getElementById("gameWrapper").style.display = "block";
});

// タイトル → ゲーム画面
startButton.addEventListener("click", () => {
  showScreen("gameScreen");
  initGame();
  startGameLoop();
  document.getElementById("tapToStartText").style.display = "block";
});

// タイトル → 遊び方
document.getElementById("howToButton").addEventListener("click", () => {
  document.getElementById("howtoModal").style.display = "flex";
});

// ゲーム画面でタップしたらゲーム開始
canvas.addEventListener("pointerdown", () => {
  if (getGameState() === "gameReady") {
    document.getElementById("tapToStartText").style.display = "none";
    startPlaying();
  }
});

// タイトルへ戻る
document.getElementById("go-titleBtn").addEventListener("click", () => {
  // ゲームオーバー画面を消す
  document.getElementById("gameOverOverlay").style.display = "none";

  // タイトル画面に戻る
  showScreen("titleScreen");
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

// タイトル画面ランキングを閉じる
document.getElementById("rankingCloseBtn").onclick = () => {
  document.getElementById("rankingModal").style.display = "none";
};

// タイトル画面ランキングを開く
document.getElementById("rankingButton").onclick = () => {
  showRankingModal();
};

// 設定画面を開く
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
});

// クレジット表記を開く
const creditToggleBtn = document.getElementById("creditToggleBtn");
const creditModal = document.getElementById("creditModal");
const creditCloseBtn = document.getElementById("creditCloseBtn");

creditToggleBtn.addEventListener("click", () => {
  creditModal.style.display = "flex";
});

creditCloseBtn.addEventListener("click", () => {
  creditModal.style.display = "none";
});
