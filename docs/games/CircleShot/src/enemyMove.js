import { spawnEnemyBullet } from "./update.js";

export function movePattern1(e, dt) {
  if (e.phase === "enter") {
    e.phase = "move";
  }
  else if (e.phase === "move") {
    e.x += e.sideSpeed * dt; // +120 or -120 など固定値
    if (e.x < -50 || e.x > 530) e.phase = "exit";
  }
  else if (e.phase === "exit") {
    e.y -= e.speed * dt;
  }
}

export function movePattern2(e, dt) {
  e.x += e.diagX * dt; // 固定値（例：+100）
  e.y += e.diagY * dt; // 固定値（例：+80）

  if (e.x < -50 || e.x > 530 || e.y < -50 || e.y > 600) {
    e.phase = "exit";
  }
}

const centerX = 240;
const centerY = 480;

export function movePattern3(e, dt) {
  if (!e.reflected) {
    // 中央へ向かう（固定値）
    e.x += e.diagX * dt; // 固定値（例：+100）
    e.y += e.diagY * dt; // 固定値（例：+80）

    if (Math.abs(e.x - centerX) < 5 && Math.abs(e.y - (centerY + e.yOffset)) < 5) {
      e.reflected = true;
    }
  } else {
    // 反対角へ向かう（固定 exitX, exitY）
    e.x += e.diagX * dt; // 固定値（例：+100）
    e.y -= e.diagY * dt; // 固定値（例：+80）

    if (e.x < -50 || e.x > 530 || e.y < -50 || e.y > 600) {
      e.phase = "exit";
    }
  }
}

export function movePattern4(e, dt) {
  if (e.phase === "enter") {
    e.y += e.speed * 1.8 * dt;
    e.x = e.startX + e.dir * e.xOffset + Math.sin(e.time * 3) * 80; // 固定振幅40
    if (e.y >= 350 + e.yOffset) e.phase = "wave";
  }
  else if (e.phase === "wave") {
    e.x = e.startX + e.dir * e.xOffset + Math.sin(e.time * 3) * 80;
    e.y -= e.speed * 1.8 * dt;

    if (e.y <= 50 + e.yOffset && e.speed > 0) {
      e.speed *= -1;
      e.count++;
    }
    else if (e.y >= 350 + e.yOffset && e.speed < 0) {
      e.speed *= -1;
      e.count++;
    }

    if (e.count > 4) { // 3往復（2π × 3）
      e.phase = "exit";
    }
  }
  else if (e.phase === "exit") {
    e.x = e.startX + e.dir * e.xOffset + Math.sin(e.time * 3) * 80;
    e.y += e.speed * 1.8 * dt;
  }
}

export function movePattern5(e, dt) {
  const centerX = 240;
  const centerY = 220 + e.yOffset;

  if (e.phase === "enter") {
    e.x += e.dir * e.speed * dt;

    if (Math.abs(e.x - centerX) < 5 ) {
      e.phase = "circle";
    }
  }
  else if (e.phase === "circle") {
    e.angle += dt * 1.3; // 固定速度
    e.x = centerX + e.dir * Math.sin(e.angle) * 120; // 固定半径120
    e.y = centerY - Math.cos(e.angle) * 120;

    if (e.angle >= Math.PI * 4) { // 2周
      e.phase = "exit";
    }
  }
  else if (e.phase === "exit") {
    e.x += e.dir * e.speed * dt; // exitDir = +1 or -1
  }
}

export function movePatternBoss(e, dt) {
  // ===============================
  // 出現フェーズ（上から降りてくる）
  // ===============================
  if (e.phase === 0) {
    e.y += 50 * dt;   // ゆっくり降りる（50px/sec）

    if (e.y >= 60) {  // 目標位置に到達したらフェーズ1へ
      e.y = 60;
      e.phase = 1;
    }
    return; // 他の処理はしない
  }

  // ===============================
  // フェーズ判定（HPで切り替え）
  // ===============================
  e.phase = (e.hp > 50) ? 1 : 2;

  if (e.phase === 1) {
    bossPhase1(e, dt);
  } else {
    bossPhase2(e, dt);
  }
}

function bossPhase1(e, dt) {
  // ===============================
  // 左右にゆっくり揺れる（威圧感＋避け方の学習）
  // ===============================
  // 振れ幅：±20px、周期：ゆっくり
  e.x += e.speed * dt;

  if (e.x < 50 || 430 < e.x) e.speed *= -1;
}

const bossPoints = [
  { x: 80, y: 80 },
  { x: 400, y: 80 },
  { x: 240, y: 260 }, // 中央
  { x: 80, y: 440 },
  { x: 400, y: 440 }
];

function bossPhase2(e, dt) {
  if (e.state === "charging") {
    const k = e.chargeTimer;
    e.alpha = k / 10 + (Math.exp(4 * k) - 1) / 30000; // 徐々に光る
    return; // 移動処理を止める
  }

  if (e.state === "firing") {
    e.alpha = 1.2; // 発射瞬間だけ強く光る

    // 時間差発射
    e.shotDelay += dt;
    if (e.shotDelay > 0.06) {   // 60msごとに1発
      e.shotDelay = 0;

      const angle = e.shotQueue[e.shotIndex];
      spawnEnemyBullet(e.x, e.y, Math.cos(angle), Math.sin(angle), 170);

      e.shotIndex++;

      // 全弾撃ち終わったら move に戻る
      if (e.shotIndex >= e.shotQueue.length) {
        e.state = "move";
        e.alpha = 0;      // 発光を消す
      }
    }

    return; // 移動処理を止める
  }
  
  // ターゲットが無ければ設定
  if (!e.target) {
    e.target = bossPoints[Math.floor(Math.random() * bossPoints.length)];
  }

  // 移動処理
  const dx = (e.target.x - e.x);
  const dy = (e.target.y - e.y);
  const dist = Math.hypot(dx, dy);

  if (dist < 8) {
    // 中央なら円形弾の溜め開始
    if (e.target === bossPoints[2]) {
      bossStartCharge(e);
    }

    // 次のポイントへ
    let next;
    do {
      next = bossPoints[Math.floor(Math.random() * bossPoints.length)];
    } while (next === e.target);

    e.target = next;
  } else {
    // 方向ベクトルの正規化
  const nx = dx / dist;
  const ny = dy / dist;

  // イージング速度（距離に応じて少し変化するが止まりすぎない）
  const t = Math.min(dist / 100, 1);
  const ease = t * t;
  const speed = 100 * ease + 50;

  e.x += nx * speed * dt;
  e.y += ny * speed * dt;
  }
}

function bossStartCharge(e) {
  e.state = "charging";
  e.chargeTimer = 0;
}
