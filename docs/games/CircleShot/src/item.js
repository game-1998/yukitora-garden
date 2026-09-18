let items = null;
let player = null;
let score = null;

// ===============================
// 初期化（gameCore.js から呼ばれる）
// ===============================
export function setupItem(itemsRef, playerRef, scoreRef) {
  items = itemsRef;
  player = playerRef;
  score = scoreRef;
}

export function spawnItem(type, x, y) {
  items.push({
    type,
    x,
    y,
    vy: 80,
    size: 14,
    radius: 14,
    t: 0,
    collected: false
  });
}

export function updateItems(dt) {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.y += it.vy * dt;
    it.t += dt;

    if (it.y > 800) {
      items.splice(i, 1);
    }
  }
}

export function collectItem(item) {
  switch (item.type) {
    case "rapidUp":
      if (player.rapid > 0.625) {
        player.rapid *= 0.625;
      }
      break;

    case "rapidDown":
      if (player.rapid < 1.6) {
        player.rapid *= 1.6;
      }
      break;

    case "scoreUp":
      if (score.multiplier < 2) {
        score.multiplier *= 2;
      }
      break;

    case "scoreDown":
      if (score.multiplier > 0.5) {
        score.multiplier *= 0.5;
      }
      break;

    case "spread":
      player.spread = true;
      break;

    case "single":
      player.spread = false;
      break;
  }
}
