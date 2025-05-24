function openWindow(title) {
  document.getElementById('window').classList.remove('hidden');
  document.getElementById('window-title').innerText = title;
}

function closeWindow() {
  document.getElementById('window').classList.add('hidden');
}
