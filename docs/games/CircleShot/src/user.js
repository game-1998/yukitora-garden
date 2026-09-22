export async function initUser() {
  const authUser = window.auth.currentUser;

  if (!authUser) {
    console.error("Auth がまだ初期化されていません");
    return;
  }

  const userId = authUser.uid; // ← これが本番用のユーザーID

  const userRef = window.doc(window.db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // 初回訪問
    await window.setDoc(userRef, {
      name: null,
      createdAt: Date.now(),
      lastVisit: Date.now(),
      userId
    });

    showNameModal(true);
  } else {
    // 再訪問
    const data = userSnap.data();
    updatePlayerNameDisplay(data.name);
    await window.updateDoc(userRef, { lastVisit: Date.now() });
  }
}

async function saveUserName() {
  const name = document.getElementById("userNameInput").value;
  if (!name) return alert("名前を入力してください");

  const userId = window.auth.currentUser.uid;
  const userRef = window.doc(window.db, "users", userId);

  await window.updateDoc(userRef, { name });

  hideNameModal()

  updatePlayerNameDisplay(name);
}

// 名前入力モーダルを表示
export function showNameModal(isFirstLogin = false) {
  const modal = document.getElementById("nameModal");
  const closeBtn = document.getElementById("closeNameModalBtn");

  modal.style.display = "flex";

  if (isFirstLogin) {
    // 初回ログイン → × を隠す
    closeBtn.style.display = "none";
  } else {
    // 名前変更 → × を表示
    closeBtn.style.display = "flex";
  }
}

// 名前入力モーダルを非表示
function hideNameModal() {
  const modal = document.getElementById("nameModal");
  modal.style.display = "none";
}

document.getElementById("saveUserNameBtn").addEventListener("click", saveUserName);

document.getElementById("changeNameButton").addEventListener("click", () => {
  showNameModal(false);
});

document.getElementById("closeNameModalBtn").onclick = () => {
  hideNameModal();
};

function updatePlayerNameDisplay(name) {
  const el = document.getElementById("playerNameDisplay");
  if (el) el.textContent = `プレイヤー名：${name}`;
  window.currentPlayerName = name;
}
