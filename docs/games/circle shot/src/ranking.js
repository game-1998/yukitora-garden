// ===============================
// ランキング管理モジュール
// ===============================

// 今は仮のランキング（後でサーバー or localStorage に変更可能）
let ranking = [];

// ランキング読み込み（後で実装）
export function loadRanking() {
  // TODO: localStorage or サーバーから読み込む
  // ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
}

// スコア保存（後でサーバー対応も可能）
export function saveScore(name, score) {
  ranking.push({ name, score });

  // スコア降順ソート
  ranking.sort((a, b) => b.score - a.score);

  // 上位100件だけ保持
  ranking = ranking.slice(0, 100);

  // TODO: localStorage 保存
  // localStorage.setItem("ranking", JSON.stringify(ranking));
}

// 100位以内かどうか判定
export function checkIsTop100(score) {
  if (ranking.length < 100) return true;
  return score > ranking[ranking.length - 1].score;
}

// ランキング取得
export function getRanking() {
  return ranking;
}
