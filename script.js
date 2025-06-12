document.addEventListener('DOMContentLoaded', () => {
const disk = document.querySelector('.disk');
let lastScrollTop = 0;
let speed = 0.05;
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
    
    const moveX = (mouseX / centerX) * 10;
    const moveY = (mouseY / centerY) * 5;
    
    const clampedX = Math.max(-15, Math.min(15, moveX));
    const clampedY = Math.max(-10, Math.min(10, moveY));
    
    bg.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
  });
});

// Load blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('blog/posts.json');
        const posts = await response.json();
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const blogPostsContainer = document.querySelector('.blog-posts');
        blogPostsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            postElement.innerHTML = `
                <div class="blog-post-brief">
                    <div class="blog-post-header">
                        <h3>${post.title}</h3>
                        <div class="blog-date">${formattedDate}</div>
                    </div>
                    <div class="blog-post-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    <p class="blog-brief">${post.brief}</p>
                </div>
            `;
            
            blogPostsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}
