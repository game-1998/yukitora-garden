export let scale = 1;

export function showScreen(name) {
  const screens = ["titleScreen", "howToScreen", "gameScreen", "resultScreen"];

  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const target = document.getElementById(name);

  // ゲーム画面だけ block、それ以外は CSS に任せる
  if (name === "gameScreen") {
    target.style.display = "block";
  } else {
    target.style.display = ""; // CSS の display を復活させる
  }
}

export function resizeGame() {
  const baseWidth = 480;
  const baseHeight = 720;

  scale = Math.min(
    window.innerWidth / baseWidth,
    window.innerHeight / baseHeight,
    1
  );

  document.getElementById("gameWrapper").style.transform = `scale(${scale})`;
}

