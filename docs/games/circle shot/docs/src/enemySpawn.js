let enemiesRef = null;

export function setupEnemySpawn(enemies) {
  enemiesRef = enemies;
}

export function spawnEnemyByMoveType(moveType) {
  // ===============================
  // 敵カテゴリ判定（小・中・大・ボス）
  // ===============================
  let enemySize = "small";

  if (moveType >= 10 && moveType <= 19) {
    enemySize = "medium";
  } else if (moveType >= 20 && moveType <= 29) {
    enemySize = "large";
  } else if (moveType === 30) {
    enemySize = "boss";
  }

  // ===============================
  // 動きパターン番号（1〜10を使い回す）
  // ===============================
  const pattern = moveType % 10;

  // ===============================
  // 敵オブジェクト生成（ここが共通）
  // ===============================
  const e = {
    radius: 20,
    shotInterval: enemySize === "small" ? 1.2 : enemySize === "medium" ? 1 : 0.8,
    speed: enemySize === "small" ? 70 : enemySize === "medium" ? 85 : 100,
    time: 0,
    type: enemySize,
    hp: enemySize === "small" ? 3 : enemySize === "medium" ? 5 : 7,
    maxHp: enemySize === "small" ? 3 : enemySize === "medium" ? 5 : 7,
    xOffset: enemySize === "small" ? 0 : enemySize === "medium" ? 30 : 60,
    yOffset: enemySize === "small" ? 80 : enemySize === "medium" ? 40 : 0,
    dir: moveType % 2 === 0 ? 1 : -1,
    pattern,
    phase: "enter",
    reflected: false,
    angle: 0
  };

  // ===============================
  // ボス専用初期化
  // ===============================
  if (enemySize === "boss") {
    e.radius = 30;
    e.hp = 100;
    e.maxHp = 100;
    e.isBoss = true;

    // ボス専用の状態管理
    e.phase = 0;
    e.scale = 1.0;
    e.scaleTarget = 1.0;
    e.scaleSpeed = 0.1;
    e.state = "move";
    e.chargeTimer = 0;
    e.target = null;
    e.speed = 60
    e.shotQueue = [];
    e.shotIndex = 0;
    e.shotDelay = 0;

    // ボスの初期位置（画面上部中央）
    e.x = 240;
    e.y = -40;

    // pattern による初期位置設定をスキップするため return
    enemiesRef.push(e);
    return;
  }

  // ===============================
  // Move1：横移動（左右バージョン）
  // ===============================
  if (pattern === 0) {        // 左 → 右
    e.x = -40;
    e.y = 80 + e.yOffset;
    e.sideSpeed = 80;
  }
  if (pattern === 1) {        // 右 → 左
    e.x = 520;
    e.y = 80 + e.yOffset;
    e.sideSpeed = -80;
  }

  // ===============================
  // Move2：斜め移動（左右バージョン）
  // ===============================
  if (pattern === 2) {        // 左上 → 右下
    e.x = -40;
    e.y = -40 + e.yOffset;
    e.diagX = 80;
    e.diagY = 80;
  }
  if (pattern === 3) {        // 右上 → 左下
    e.x = 520;
    e.y = -40 + e.yOffset;
    e.diagX = -80;
    e.diagY = 80;
  }

  // ===============================
  // Move3：中央 → 反対角（左右バージョン）
  // ===============================
  if (pattern === 4) {        // 左 → 中央 → 右下
    e.x = -30;
    e.y = -60 + e.yOffset;
    e.diagX = 60;
    e.diagY = 120;
  }
  if (pattern === 5) {        // 右 → 中央 → 左下
    e.x = 510;
    e.y = -60 + e.yOffset;
    e.diagX = -60;
    e.diagY = 120;
  }

  // ===============================
  // Move4：波移動（左右バージョン）
  // ===============================
  if (pattern === 6) {        // 左寄り
    e.x = 120 + e.xOffset;
    e.y = -40;
    e.startX = 120;
  }
  if (pattern === 7) {        // 右寄り
    e.x = 360 - e.xOffset;
    e.y = -40;
    e.startX = 360;
  }

  // ===============================
  // Move5：円軌道（左右バージョン）
  // ===============================
  if (pattern === 8) {        // 左 → 中央 → 右へ抜ける
    e.x = -40;
    e.y = 100 + e.yOffset;
  }
  if (pattern === 9) {       // 右 → 中央 → 左へ抜ける
    e.x = 520;
    e.y = 100 + e.yOffset;
  }

  enemiesRef.push(e);
}
