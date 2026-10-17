// 効果音キャッシュ
const SE = {
  shot: new Audio("src/sounds/shot.mp3"),
  bossAppear: new Audio("src/sounds/bossAppear.mp3"),
  charge: new Audio("src/sounds/charge.mp3"),
  bossShot: new Audio("src/sounds/bossShot.mp3"),
  bgm: new Audio("src/sounds/bgm.mp3")
};

// 連続再生できるように設定
Object.values(SE).forEach(audio => {
  audio.preload = "auto";
  audio.volume = 1.0; // 好みで調整
});

const bgm = SE["bgm"];
bgm.volume = 0.5;

export function playSE(type) {
  const se = SE[type];
  if (!se) return;

  // 同時再生のために複製
  const clone = se.cloneNode();
  clone.volume = se.volume;
  clone.play();
}

export function playBGM() {
  bgm.currentTime = 0;
  bgm.loop = true;
  bgm.play();
  console.log("start BGM");
}

export function stopBGM() {
  bgm.pause();
}