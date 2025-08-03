// 🎧 Audio Setup
const sfx = {
  join: new Audio("https://www.dropbox.com/scl/fi/0rzu4j0qckr89tz1645xo/Player-Joined-Queue.MP3?rlkey=fcd1pnirup4nvmv4ifdwvmgp6&dl=1"),
  leave: new Audio("https://www.dropbox.com/scl/fi/hs7dj6xl2sxx9txwti62a/Player-Left-Queue-Manually.MP3?rlkey=5zlo2s0uyuxbo1oapodzk8vlt&dl=1"),
  boost: new Audio("https://www.dropbox.com/scl/fi/qzq52a0lq1borl5gx9iml/Player-Skipped-The-Queue.MP3?rlkey=m5vi9yxexswc8frv96liouhs2&dl=1"),
  warning: new Audio("https://www.dropbox.com/scl/fi/eyu22loysyoose3tpc2l4/2-Minute-Boot-Warning.MP3?rlkey=v8w1hdpkoth730vhnirxtbq71&dl=1"),
  kick: new Audio("https://www.dropbox.com/scl/fi/p26veslmrzurjhgq5iogl/Player-Kicked.MP3?rlkey=csu6b9g8isl4sr0ih6q6th2am&dl=1"),
  intro: new Audio("https://www.dropbox.com/scl/fi/2tel47qhhtfca3wf59hvg/Welcome-to-BFN.MP3?rlkey=vi94dhu8r1g3uul4jml6l7jj1&dl=1"),
  bgm: new Audio("https://www.dropbox.com/scl/fi/4im1rtlxctsa71u8bew1f/Final-Boss-Fight.Instrumetal.wav?rlkey=x7wnhh4y4r6nuh6kyo485465l&dl=1")
};

// Set volumes
sfx.join.volume = 1.0;
sfx.leave.volume = 1.0;
sfx.boost.volume = 1.0;
sfx.warning.volume = 1.0;
sfx.kick.volume = 1.0;
sfx.intro.volume = 1.0;
sfx.bgm.volume = 0.1; // softer background music

// Loop the background music
sfx.bgm.loop = true;

const volumeSlider = document.getElementById("bgm-volume");

// Set initial BGM volume (20%)
sfx.bgm.volume = 0.2;

// Update volume live when user adjusts slider
volumeSlider.addEventListener("input", () => {
  const volumeValue = volumeSlider.value / 100;
  sfx.bgm.volume = volumeValue;
});



Object.values(sfx).forEach(audio => audio.volume = 0.8);

let queue = [];
const maxPlayers = 2;
const playerTimers = {};
const warningTimeouts = {};
const removalTimeouts = {};

function joinQueue() {
  const username = prompt("Enter your name:");
  if (!username || queue.find(p => p.name === username) || queue.length >= maxPlayers) {
    alert("Invalid or duplicate name, or queue is full.");
    return;
  }

  queue.push({ name: username, role: "follower" });
  startTimers(username);
  updateQueueDisplay();
  sfx.join.play().catch(() => {});
}

function leaveQueue() {
  const username = prompt("Enter your name to leave:");
  queue = queue.filter(player => player.name !== username);
  clearTimeout(warningTimeouts[username]);
  clearTimeout(removalTimeouts[username]);
  delete playerTimers[username];
  updateQueueDisplay();
  sfx.leave.play().catch(() => {});
}

function boostQueue() {
  const username = prompt("Enter your name to skip the line:");
  if (!username) return;

  queue = queue.filter(player => player.name !== username);
  queue.unshift({ name: username, role: "booster" });
  startTimers(username);
  updateQueueDisplay();
  sfx.boost.play().catch(() => {});
}

function startTimers(username) {
  const warningMsg = document.getElementById("warningMessage");
  const warningTime = 8 * 60 * 1000;
  const kickTime = 10 * 60 * 1000;

  warningTimeouts[username] = setTimeout(() => {
    warningMsg.textContent = `${username}, you’ll be removed in 2 minutes for inactivity.`;
    sfx.warning.play().catch(() => {});
  }, warningTime);

  removalTimeouts[username] = setTimeout(() => {
    queue = queue.filter(p => p.name !== username);
    delete playerTimers[username];
    updateQueueDisplay();
    warningMsg.textContent = "";
    sfx.kick.play().catch(() => {});
  }, kickTime);

  playerTimers[username] = new Date();
}

function getBadgeIcon(role) {
  switch (role) {
    case "booster": return "https://i.imgur.com/28zqH83.gif";
    case "subscriber": return "https://i.imgur.com/puSv7Pw.gif";
    default: return "https://i.imgur.com/V13BHlb.gif";
  }
}

function updateQueueDisplay() {
  const queueList = document.getElementById("queueList");
  if (queue.length === 0) {
    queueList.innerHTML = "Nobody yet. Be brave!";
    return;
  }

  queueList.innerHTML = queue.map((player, index) => {
    const elapsed = ((Date.now() - playerTimers[player.name]) / 1000).toFixed(0);
    return `
      <div class="player-entry">
        <img src="${getBadgeIcon(player.role)}" alt="${player.role} badge" />
        <span>${index + 1}. ${player.name} – ${elapsed}s</span>
      </div>
    `;
  }).join("");
}

// Intro audio on first interaction
window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    sfx.intro.play().catch(() => {});
  }, { once: true });
});

// Matrix background
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixText = "1010101010101010";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(10, 10, 10, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffe0";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = matrixText[Math.floor(Math.random() * matrixText.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }

  if (Math.random() > 0.98) {
    ctx.fillStyle = "rgba(0,255,224,0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  setTimeout(drawMatrix, 75); // Higher = slower (try 80–120ms)

}

drawMatrix();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// Autoplay background music after any click
document.addEventListener("click", () => {
  if (sfx.bgm.paused) {
    sfx.bgm.play();
  }
}, { once: true }); // only trigger on the first click



