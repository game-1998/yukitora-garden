let ctx = null;
let canvas = null;
let player = null;
let enemies = null;
let bullets = null;
let enemyBullets = null;
let items = null;
let score = 0;
let gameStateGetter = null;

// ===============================
// 初期化（gameCore.js から呼ばれる）
// ===============================
export function setupDraw(context, canvasRef, playerRef, enemiesRef, bulletsRef, enemyBulletsRef, itemsRef, scoreRef, getGameState) {
  ctx = context;
  canvas = canvasRef;
  player = playerRef;
  enemies = enemiesRef;
  bullets = bulletsRef;
  enemyBullets = enemyBulletsRef;
  items = itemsRef;
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
    drawItems();
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
  ctx.fillStyle = "#ffff00";

  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ===============================
// アイテム
// ===============================
export function drawItems() {
  for (const it of items) {
    const glow = 5 + Math.sin(it.t * 4) * 4;   // blurの大きさを周期的に変化
    const color = getItemColor(it.type);

    ctx.save();    

    // 影用の枠線（stroke）
    ctx.shadowBlur = glow;
    ctx.shadowColor = color;
    ctx.lineWidth = 2;
    drawDiamondStroke(it.x, it.y, it.size, color);

    // 本体（ひし形）
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    drawDiamond(it.x, it.y, it.size, color);
    drawItemIcon(it);

    ctx.restore();
  }
}

function drawDiamondStroke(x, y, size, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.stroke();
}

function drawDiamond(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
}

function drawItemIcon(it) {
  ctx.fillStyle = "#fff";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (it.type) {
    case "rapidUp":
      ctx.fillText("UP", it.x, it.y);
      break;

    case "rapidDown":
      ctx.fillText("DOWN", it.x, it.y);
      break;

    case "scoreUp":
      ctx.fillText("×2", it.x, it.y);
      break;

    case "scoreDown":
      ctx.fillText("1/2", it.x, it.y);
      break;

    case "spread":
      ctx.beginPath();
      ctx.arc(it.x, it.y - 5.3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(it.x - 4.5, it.y + 2.5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(it.x + 4.5, it.y + 2.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "single":
      ctx.beginPath();
      ctx.arc(it.x, it.y, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

function getItemColor(type) {
  switch (type) {
    case "rapidUp":
    case "scoreUp":
    case "spread":
      return "#f1b500"; // ゴールド

    case "rapidDown":
    case "scoreDown":
    case "single":
      return "#7E57C2"; // 紫
  }
}
