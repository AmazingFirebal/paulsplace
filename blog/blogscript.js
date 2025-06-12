// Blog functionality
async function loadBlogPosts() {
  try {
    const blogPostsContainer = document.getElementById('blog-posts');
    const postFiles = [
      '2025-06-12-welcome.json',
      '2025-06-11-gaming.json',
      '2025-06-10-tech.json'
    ];
    
    // Clear existing content
    blogPostsContainer.innerHTML = '';
    
    // Load all posts
    for (const postFile of postFiles) {
      const postResponse = await fetch(`blog/posts/${postFile}`);
      const post = await postResponse.json();
      
      // Extract date from filename (YYYY-MM-DD)
      const date = postFile.split('-').slice(0, 3).join('-');
      
      const postElement = document.createElement('div');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <div class="blog-post-brief" onclick="togglePost('${postFile}')">
          <div class="blog-post-header">
            <h3>${post.title}</h3>
            <span class="blog-date">${formatDate(date)}</span>
          </div>
          <div class="blog-post-image">
            <img src="${post.image}" alt="${post.title}">
          </div>
          <p class="blog-brief">${post.brief}</p>
        </div>
        <div class="blog-post-content" id="post-${postFile}">
          <p>${post.content}</p>
          <div class="blog-tags">
            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
      blogPostsContainer.appendChild(postElement);
    }

    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '↑ Scroll for more posts ↑';
    blogPostsContainer.parentElement.appendChild(scrollIndicator);

  } catch (error) {
    console.error('Error loading blog posts:', error);
    const blogPostsContainer = document.getElementById('blog-posts');
    blogPostsContainer.innerHTML = '<p class="error-message">Error loading blog posts. Please try again later.</p>';
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function togglePost(fileId) {
  const content = document.getElementById(`post-${fileId}`);
  content.classList.toggle('expanded');
  
  // Scroll the expanded post into view if it's not fully visible
  if (content.classList.contains('expanded')) {
    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Handle scroll behavior
let lastScrollTop = 0;
const rightPanel = document.querySelector('.right-panel');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
    rightPanel.classList.add('hidden');
  } else {
    rightPanel.classList.remove('hidden');
  }
  
  lastScrollTop = scrollTop;
});

// Load blog posts when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts); 