// ===============================
// ゲームオーバー画面の表示ロジック
// ===============================

export function showGameOver(finalScore, killCounts, isTop100) {
  const overlay = document.getElementById("gameOverOverlay");

  // スコア表示
  document.getElementById("finalScore").textContent = finalScore;

  // 敵種類ごとの撃破数
  document.getElementById("killSmall").textContent = killCounts.small;
  document.getElementById("killMedium").textContent = killCounts.medium;
  document.getElementById("killLarge").textContent = killCounts.large;
  document.getElementById("killBoss").textContent = killCounts.boss;

  // ランキング登録欄の表示・非表示
  const nameEntry = document.getElementById("nameEntry");
  if (isTop100) {
    nameEntry.classList.remove("hidden");
  } else {
    nameEntry.classList.add("hidden");
  }

  // オーバーレイ表示
  overlay.style.display = "flex";

  // ズームイン演出を付け直す（毎回アニメを再生するため）
  const frame = overlay.querySelector(".go-frame");
  const scoreBox = overlay.querySelector(".go-score");

  frame.classList.remove("zoom-in");
  scoreBox.classList.remove("zoom-in");

  // 再付与（強制再生）
  void frame.offsetWidth;
  void scoreBox.offsetWidth;

  frame.classList.add("zoom-in");
  scoreBox.classList.add("zoom-in");
}


// ===============================
// ボタンイベント設定
// ===============================

export function setupGameOverButtons(onRetry, onRanking, onSubmitName) {
  document.getElementById("retryBtn").onclick = () => {
    hideGameOver();
    onRetry();
  };

  document.getElementById("rankingBtn").onclick = () => {
    onRanking();
  };

  document.getElementById("submitNameBtn").onclick = () => {
    const name = document.getElementById("playerNameInput").value.trim();
    if (name.length === 0) {
      alert("名前を入力してください");
      return;
    }
    onSubmitName(name);
  };
}


// ===============================
// ゲームオーバー画面を閉じる
// ===============================

export function hideGameOver() {
  const overlay = document.getElementById("gameOverOverlay");
  overlay.style.display = "none";
}
