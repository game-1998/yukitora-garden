let ctx = null;
let canvas = null;

let player = null;
let enemies = null;
let bullets = null;
let enemyBullets = null;
let score = 0;
let gameStateGetter = null;

// ===============================
// 初期化（gameCore.js から呼ばれる）
// ===============================
export function setupDraw(context, canvasRef, playerRef, enemiesRef, bulletsRef, enemyBulletsRef, scoreRef, getGameState) {
  ctx = context;
  canvas = canvasRef;

  player = playerRef;
  enemies = enemiesRef;
  bullets = bulletsRef;
  enemyBullets = enemyBulletsRef;
  score = scoreRef;
  gameStateGetter = getGameState;
}

// ===============================
// メイン描画
// ===============================
export function drawGame() {
  const state = gameStateGetter();

  // 画面クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state === "gameReady") {
    drawTapToStart();
    drawBackground();
    drawPlayer();
  }

  if (state === "playing") {
    drawBackground();
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawEnemyBullets();
  }

  // スコア表示
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score： " + score.value, 20, 20);
}

// ===============================
// タップで開始（Canvas 上に描画）
// ===============================
function drawTapToStart() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("タップでゲーム開始", canvas.width / 2, canvas.height / 2);
}

// ===============================
// 背景
// ===============================
function drawBackground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ===============================
// 自機
// ===============================
function drawPlayer() {
  ctx.fillStyle = "#0066FF"; // 濃い青
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

// ===============================
// 敵
// ===============================
function drawEnemies() {
  enemies.forEach(e => {
    // ボスの発光（光が漏れ出す円）
    if (e.isBoss && e.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = e.alpha * 0.6;
      ctx.fillStyle = "rgba(255, 255, 200, 1)";

      const k = e.chargeTimer;
      const glowRadius = e.radius * (1.1 + e.alpha * k / 10) * (k / 8 + 1);

      ctx.beginPath();
      ctx.arc(e.x, e.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 敵の種類ごとに色を設定
    let enemyColor = "#1e8d22"; // small（緑）

    if (e.isBoss) {
      enemyColor = "#ff0400";   // boss（赤）
    } else if (e.type === "large") {
      enemyColor = "#fb5c00";   // large（オレンジ）
    } else if (e.type === "medium") {
      enemyColor = "#ff008c";   // medium（ピンク）
    }

    ctx.fillStyle = enemyColor;
  
    // 敵本体
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();

    // HPバー（上部に表示）
    const barWidth = 30;
    const barHeight = 4;
    const hpRatio = e.hp / e.maxHp;

    const barX = e.x - barWidth / 2;
    const barY = e.y - e.radius - 10;

    // 背景バー（黒）
    ctx.fillStyle = "black";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // HPバー（緑）
    ctx.fillStyle = "lime";
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);

    ctx.fillStyle = "red"; // 色を戻す
  });
}

// ===============================
// 自機弾
// ===============================
function drawBullets() {
  ctx.fillStyle = "#00FFFF"; // シアン
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ===============================
// 敵弾
// ===============================
function drawEnemyBullets() {
  ctx.fillStyle = "yellow";

  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}
