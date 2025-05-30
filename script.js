document.addEventListener('DOMContentLoaded', () => {
  const disk = document.querySelector('.disk');
  let lastScrollTop = 0;
  let speed = 0.10;
  let angle = 0;

  function animate() {
    const scrollTop = window.scrollY;
    const scrollDiff = Math.abs(scrollTop - lastScrollTop);
    speed = 0.05 + scrollDiff * 0.1;
    angle += speed;
    disk.style.transform = `rotate(${angle}deg)`;
    lastScrollTop = scrollTop;
    requestAnimationFrame(animate);
  }

  if (disk) animate();
});

document.addEventListener('mousemove', (e) => {
  const backgrounds = document.querySelectorAll('.parallax-background');
  
  backgrounds.forEach(bg => {
    const rect = bg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const moveX = (mouseX / centerX) * 20;
    const moveY = (mouseY / centerY) * 20;
    
    bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});
