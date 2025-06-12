// Blog functionality
async function loadBlogPosts() {
  try {
    const response = await fetch('blog/posts');
    const files = await response.json();
    const blogPostsContainer = document.getElementById('blog-posts');
    
    // Sort files by name (which includes date) in descending order
    const sortedFiles = files.sort().reverse();
    
    for (const file of sortedFiles) {
      if (!file.endsWith('.json')) continue;
      
      const postResponse = await fetch(`blog/posts/${file}`);
      const post = await postResponse.json();
      
      // Extract date from filename (YYYY-MM-DD)
      const date = file.split('-').slice(0, 3).join('-');
      
      const postElement = document.createElement('div');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <div class="blog-post-brief" onclick="togglePost('${file}')">
          <div class="blog-post-header">
            <h3>${post.title}</h3>
            <span class="blog-date">${formatDate(date)}</span>
          </div>
          <div class="blog-post-image">
            <img src="${post.image}" alt="${post.title}">
          </div>
          <p class="blog-brief">${post.brief}</p>
        </div>
        <div class="blog-post-content" id="post-${file}" style="display: none;">
          <p>${post.content}</p>
          <div class="blog-tags">
            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
      blogPostsContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function togglePost(fileId) {
  const content = document.getElementById(`post-${fileId}`);
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

// Load blog posts when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts); 