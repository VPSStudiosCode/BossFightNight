
let queue = [];

function joinQueue() {
  const username = "Viewer" + Math.floor(Math.random() * 1000); // placeholder for Twitch auth
  if (!queue.includes(username) && queue.length < 2) {
    queue.push(username);
    updateQueueDisplay();
  } else {
    alert("Queue full or you're already in!");
  }
}

function leaveQueue() {
  const username = queue[0]; // placeholder for viewer's name
  queue = queue.filter(name => name !== username);
  updateQueueDisplay();
}

function updateQueueDisplay() {
  const queueStatus = document.getElementById("queueStatus");
  queueStatus.textContent = "Queue: " + (queue.length ? queue.join(", ") : "[empty]");
}
