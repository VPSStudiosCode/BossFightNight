let queue = [];
const maxPlayers = 2;

function joinQueue(username) {
  if (!queue.includes(username) && queue.length < maxPlayers) {
    queue.push(username);
    updateQueueDisplay();
  } else {
    alert("Queue is full or you're already in!");
  }
}

function leaveQueue(username) {
  queue = queue.filter(player => player !== username);
  updateQueueDisplay();
}

function kofiBoost(username) {
  queue = queue.filter(player => player !== username);
  queue.unshift(username);
  updateQueueDisplay();
}

function updateQueueDisplay() {
  const queueList = document.getElementById("queueList");
  if (queue.length === 0) {
    queueList.textContent = "Nobody yet. Be brave!";
  } else {
    queueList.textContent = queue.map((name, i) => `${i + 1}. ${name}`).join('\n');
  }
}
