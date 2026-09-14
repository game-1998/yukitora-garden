let player = null;
let canvas = null;
let gameStateGetter = null; // gameState を参照する関数

// ===============================
// 初期化（gameCore.js から呼ばれる）
// ===============================
export function setupInput(playerRef, canvasRef, getGameState) {
  player = playerRef;
  canvas = canvasRef;
  gameStateGetter = getGameState;

  // PC用
  canvas.addEventListener("mousemove", onMove);

  // スマホ用
  canvas.addEventListener("touchmove", onMove);
}

// ===============================
// 動かしている間
// ===============================
function onMove(e) {
  if (gameStateGetter() !== "playing") return;

  movePlayer(e);
}

// ===============================
// 自機を動かす処理
// ===============================
function movePlayer(e) {
  const rect = canvas.getBoundingClientRect();

  let clientX, clientY;

  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  player.x = x;
  player.y = y;
}
