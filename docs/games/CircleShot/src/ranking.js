import { getFirestore, collection, query, orderBy, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// =====================================================
// ゲームオーバー画面のランキング表示
// =====================================================
export async function getMyRank(finalScore) {
  const db = getFirestore(window.firebaseApp);

  const rankingRef = collection(db, "circleShot", "ranking", "ranking");
  const q = query(rankingRef, orderBy("score", "desc"));
  const snapshot = await getDocs(q);

  const list = snapshot.docs.map(doc => doc.data());

  // 自分の順位を探す
  let rank = list.findIndex(r => finalScore >= r.score) + 1;

  if (rank === 0) {
    rank = list.length + 1;
  }

  return rank;
}

// =====================================================
// タイトル画面のランキング表示
// =====================================================
async function fetchRanking() {
  const ref = window.collection(window.db, "circleShot", "ranking", "ranking");
  const q = window.query(ref, window.orderBy("score", "desc"), window.limit(100));
  const snap = await window.getDocs(q);
  return snap.docs.map(doc => doc.data());
}

export async function showRankingModal() {
  const listEl = document.getElementById("rankingList");
  listEl.innerHTML = "";

  const ranking = await fetchRanking();
  const myId = window.auth.currentUser.uid;

  ranking.slice(0, 99).forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "rank-row";

    // 自分の順位をハイライト
    if (r.userId === myId) {
      row.classList.add("me");
    }

    // 1〜3位の特別色
    if (i === 0) row.classList.add("gold");
    if (i === 1) row.classList.add("silver");
    if (i === 2) row.classList.add("bronze");

    row.innerHTML = `
      <div>${i + 1}位</div>
      <div>${r.name ?? "名無し"}</div>
      <div>${Number(r.score).toLocaleString()}</div>
    `;

    listEl.appendChild(row);
  });

  document.getElementById("rankingModal").style.display = "flex";
}

