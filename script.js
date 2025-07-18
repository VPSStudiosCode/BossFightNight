let queue = [];
const maxPlayers = 2;

let queue = [];
const maxPlayers = 2;
const userTimers = {}; // Track inactivity

function joinQueue(username) {
  if (!queue.includes(username) && queue.length < maxPlayers) {
    queue.push(username);
    updateQueueDisplay();
    
    // Set 10-minute timeout to auto-remove
    if (userTimers[username]) clearTimeout(userTimers[username]);
    userTimers[username] = setTimeout(() => {
      leaveQueue(username);
      alert(`${username} was removed from the queue due to inactivity.`);
    }, 10 * 60 * 1000); // 10 minutes
  } else {
    alert("Queue is full or you're already in!");
  }
}

function leaveQueue(username) {
  queue = queue.filter(player => player !== username);
  clearTimeout(userTimers[username]); // Clear timeout if they leave manually
  delete userTimers[username];
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
function boostFirstPlayer() {
  if (queue.length > 0) {
    const first = queue[0];
    queue = queue.filter(player => player !== first); // remove from current position
    queue.unshift(first); // re-add to front
    updateQueueDisplay();
    alert(`${first} skipped the line!`);
  } else {
    alert("No one to boost! The queue is empty.");
  }
}
