import { getFunctions, httpsCallable }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";
import { getMyRank } from "./ranking.js";

const functions = getFunctions(window.firebaseApp);
const submitScore = httpsCallable(functions, "submitCircleShotScore");

export function submitScoreToServer(finalScore) {
  const playerName = window.currentPlayerName;

  submitScore({
    score: finalScore,
    name: playerName
  })
    .then(() => console.log("スコア送信成功"))
    .catch(err => console.error("スコア送信失敗:", err));
}

// ===============================
// ゲームオーバー画面の表示ロジック
// ===============================
export async function showGameOver(finalScore, killCounts) {
  const overlay = document.getElementById("gameOverOverlay");

  // スコア表示
  document.getElementById("finalScore").textContent = finalScore;

  // 敵種類ごとの撃破数
  document.getElementById("killSmall").textContent = killCounts.small;
  document.getElementById("killMedium").textContent = killCounts.medium;
  document.getElementById("killLarge").textContent = killCounts.large;
  document.getElementById("killBoss").textContent = killCounts.boss;

  // 今回の順位を取得して表示
  const rank = await getMyRank(finalScore);
  const rankDisplay = document.getElementById("gameOverRank");

  if (rank <= 100) {
    rankDisplay.textContent = `今回の順位：${rank}位`;
  } else {
    rankDisplay.textContent = `今回の順位：ランキング外`;
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

