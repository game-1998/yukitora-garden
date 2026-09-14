import { movePattern1, movePattern2, movePattern3, movePattern4, movePattern5, movePatternBoss } from "./enemyMove.js";
import { setupEnemySpawn } from "./enemySpawn.js";
import { setupWave, updateWave } from "./enemyWave.js";

let player = null;
let enemies = null;
let bullets = null;
let enemyBullets = null;
let gameOverCallback = null;
let score = null;
let killCounts = null;

// ===============================
// 初期化（gameCore.js から呼ばれる）
// ===============================
export function setupUpdate(playerRef, enemiesRef, bulletsRef, enemyBulletsRef, onGameOver, scoreRef, killCountsRef) {
  player = playerRef;
  enemies = enemiesRef;
  bullets = bulletsRef;
  enemyBullets = enemyBulletsRef;
  gameOverCallback = onGameOver;
  score = scoreRef;
  killCounts = killCountsRef;
  console.log("[SETUP] killCounts in update.js:", killCounts);
  setupEnemySpawn(enemiesRef);
  setupWave(enemies);
}

// ===============================
// メイン更新処理
// ===============================
export function updateGame(dt) {
  updateBullets(dt);
  updateEnemies(dt);
  updateEnemyBullets(dt);
  updateWave(dt);
  spawnEnemyBullets(dt);
  spawnPlayerBullets(dt);
  checkCollisions();
}

// ===============================
// 連射タイマーの初期化
// ===============================
export function initUpdateState() {
  playerShotTimer = 0;
}

// ===============================
// 自機弾の生成
// ===============================
let playerShotTimer = 0;

function spawnPlayerBullets(dt) {
  playerShotTimer += dt;

  if (playerShotTimer > 0.3) {  // 0.3秒ごとに発射（連射）
    playerShotTimer = 0;

    const bullet = {
      x: player.x,
      y: player.y - player.radius,
      radius: 6,
      speed: 300
    };

    bullets.push(bullet);
  }
}

// ===============================
// 自機弾の移動
// ===============================
function updateBullets(dt) {
  bullets.forEach(b => {
    b.y -= b.speed * dt;
  });

  // 画面外の弾を削除
  const alive = bullets.filter(b => !b.dead && b.y > -20);
  bullets.splice(0, bullets.length, ...alive);
}

// ===============================
// 敵の移動
// ===============================
function updateEnemies(dt) {
  enemies.forEach(e => {
    e.time += dt;

    if (e.isBoss) {
      movePatternBoss(e, dt);
      return;
    }

    switch (e.pattern) {
      case 0: movePattern1(e, dt); break;
      case 1: movePattern1(e, dt); break;
      case 2: movePattern2(e, dt); break;
      case 3: movePattern2(e, dt); break;
      case 4: movePattern3(e, dt); break;
      case 5: movePattern3(e, dt); break;
      case 6: movePattern4(e, dt); break;
      case 7: movePattern4(e, dt); break;
      case 8: movePattern5(e, dt); break;
      case 9: movePattern5(e, dt); break;
    }
  });

  // 画面外に抜けた敵を削除
  const alive = enemies.filter(e =>
    e.x > -100 && e.x < 580 &&
    e.y > -100 && e.y < 900
  );
  enemies.splice(0, enemies.length, ...alive);
}

// ===============================
// 敵弾の生成
// ===============================
function spawnEnemyBullets(dt) {
  enemies.forEach(e => {
    // ボス専用弾生成
    if (e.isBoss) {
      spawnBossBullets(e, dt);
      return;
    }

    // 通常専用弾生成
    // 弾発射タイマーを敵ごとに持たせる
    if (!e.shotTimer) e.shotTimer = 0;
    e.shotTimer += dt;

    if (e.shotTimer > 1.0) {  // 1秒ごとに発射
      e.shotTimer = 0;

      const bullet = {
        x: e.x,
        y: e.y + e.radius,
        dx: 0,
        dy: 1,
        radius: 6,
        speed: 150
      };

      enemyBullets.push(bullet);
    }
  });
}

// ボス弾の生成
function spawnBossBullets(e, dt) {
  // フェーズ1：低速3WAY
  if (e.phase === 1) {
    if (!e.shotTimer) e.shotTimer = 0;
    e.shotTimer += dt;

    if (e.shotTimer > 1.2) {
      e.shotTimer = 0;
      boss3WayShot(e, 130);
    }
  }

  // フェーズ2：高速3WAY＋円形弾
  if (e.phase === 2) {
    if (!e.shotTimer) e.shotTimer = 0;
    e.shotTimer += dt;

    if (e.shotTimer > 1.0) {
      e.shotTimer = 0;
      boss3WayShot(e, 170);
    }

    // 円形弾は別の charge ロジックで発射
    bossHandleCharge(e, dt);
  }
}

// 3Wayショット
function boss3WayShot(e, speed) {
  const angles = [Math.PI / 3, Math.PI / 2, Math.PI * 2 / 3];
  angles.forEach(a => {
    spawnEnemyBullet(e.x, e.y + e.radius, Math.cos(a), Math.sin(a), speed);
  });
}

// 円形弾予兆
function bossHandleCharge(e, dt) {
  // charging 中
  if (e.state === "charging") {
    e.chargeTimer += dt;

    if (e.chargeTimer > 2.5) {
      bossCircularShot(e);
      e.state = "firing";
    }
  }
}

// 円形弾
function bossCircularShot(e) {
  const bulletCount = 16;
  const baseAngle = (2 * Math.PI) / bulletCount;

  e.shotQueue = [];     // 新しいショットキュー
  e.shotIndex = 0;      // 何発目か
  e.shotDelay = 0;      // 時間差用

  for (let i = 0; i < bulletCount; i++) {
    const angle = baseAngle * i + Math.PI / 2;
    e.shotQueue.push(angle);
  }
}

export function spawnEnemyBullet(x, y, dx, dy, speed) {
  enemyBullets.push({
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    speed: speed,
    radius: 6
  });
}

// ===============================
// 敵弾の移動
// ===============================
function updateEnemyBullets(dt) {
  enemyBullets.forEach(b => {
    b.x += b.dx * b.speed * dt;
    b.y += b.dy * b.speed * dt;
  });

  // 画面外の弾を削除
  const alive = enemyBullets.filter(b =>
    b.x > -50 && b.x < 530 &&
    b.y > -50 && b.y < 850
  );
  enemyBullets.splice(0, enemyBullets.length, ...alive);
}


// ===============================
// 当たり判定
// ===============================
function checkCollisions() {
  // 自機 vs 敵弾
  enemyBullets.forEach(b => {
    if (hit(player, b)) {
      gameOverCallback();
    }
  });

  // 自機 vs 敵本体
  enemies.forEach(e => {
    if (hit(player, e)) {
      gameOverCallback();
    }
  });

  // 自機弾 vs 敵
  bullets.forEach(b => {
    enemies.forEach(e => {
      if (hit(b, e)) {
        score.value += 10;  // ショット命中時のスコア加点
        e.hp -= 1;   // ダメージ量
        b.dead = true; // 弾を消す

        if (e.hp <= 0) {
          e.dead = true;
          score.value += e.maxHp * 10;  // 撃破ボーナス（敵の最大HP × 10）

          // 種類別撃破数カウント
          if (e.isBoss) {
            killCounts.boss++;
            console.log("[KILL] boss:", killCounts.boss);
          } else if (e.type === "large") {
            killCounts.large++;
            console.log("[KILL] large:", killCounts.large);
          } else if (e.type === "medium") {
            killCounts.medium++;
            console.log("[KILL] medium:", killCounts.medium);
          } else {
            killCounts.small++;
            console.log("[KILL] small:", killCounts.small);
          }
        }
      }
    });
  });

  const alive = enemies.filter(e => !e.dead);
  enemies.splice(0, enemies.length, ...alive);
}

// ===============================
// 円同士の当たり判定
// ===============================
function hit(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  return dist < a.radius + b.radius;
}
