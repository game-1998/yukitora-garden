export let scale = 1;

export function showScreen(name) {
  const screens = ["titleScreen", "howToScreen", "gameScreen", "resultScreen"];

  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  document.getElementById(name).style.display = "block";
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

