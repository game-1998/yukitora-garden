export function showScreen(name) {
  const screens = ["titleScreen", "howToScreen", "gameScreen", "resultScreen"];

  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  document.getElementById(name).style.display = "block";
}
