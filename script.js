window.addEventListener("load", () => {
  const boot = document.getElementById("boot-screen");
  const desktop = document.getElementById("desktop");
  const win = document.getElementById("window");

  desktop.style.display = "none";
  win.classList.add("hidden");

  setTimeout(() => {
    boot.style.display = "none";
    desktop.style.display = "flex";
  }, 3000); // 3-second boot delay
});

let dragOffsetX = 0;
let dragOffsetY = 0;
let dragging = false;

function openWindow(title) {
  const win = document.getElementById('window');
  document.getElementById('window-title').innerText = title;
  win.classList.remove('hidden');
  win.style.zIndex = 1000;
}

function closeWindow() {
  document.getElementById('window').classList.add('hidden');
}

// Dragging logic
function startDrag(e) {
  dragging = true;
  const win = document.getElementById('window');
  dragOffsetX = e.clientX - win.offsetLeft;
  dragOffsetY = e.clientY - win.offsetTop;
  document.addEventListener('mousemove', dragWindow);
  document.addEventListener('mouseup', stopDrag);
}

function dragWindow(e) {
  if (!dragging) return;
  const win = document.getElementById('window');
  win.style.left = `${e.clientX - dragOffsetX}px`;
  win.style.top = `${e.clientY - dragOffsetY}px`;
}

function stopDrag() {
  dragging = false;
  document.removeEventListener('mousemove', dragWindow);
  document.removeEventListener('mouseup', stopDrag);
}
