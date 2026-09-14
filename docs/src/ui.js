export function showScreen(name) {
  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("skillScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "none";

  document.getElementById(name).style.display = "block";
}

// 描画処理（アプリごとに中身を変える）
function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Hello World</h1>
    <p>ここにアプリのUIを描画する</p>
  `;
}