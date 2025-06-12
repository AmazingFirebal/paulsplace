// Blog functionality
async function loadBlogPosts() {
  try {
    const blogPostsContainer = document.getElementById('blog-posts');
    
    // For now, we'll hardcode the post file since we only have one
    const postFile = '2025-06-12-welcome.json';
    const postResponse = await fetch(`blog/posts/${postFile}`);
    const post = await postResponse.json();
    
    const postElement = document.createElement('div');
    postElement.className = 'blog-post';
    postElement.innerHTML = `
      <div class="blog-post-brief" onclick="togglePost('${postFile}')">
        <div class="blog-post-header">
          <h3>${post.title}</h3>
          <span class="blog-date">${formatDate('2025-06-12')}</span>
        </div>
        <div class="blog-post-image">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <p class="blog-brief">${post.brief}</p>
      </div>
      <div class="blog-post-content" id="post-${postFile}" style="display: none;">
        <p>${post.content}</p>
        <div class="blog-tags">
          ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    blogPostsContainer.appendChild(postElement);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    // Add error message to the container
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
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

// Load blog posts when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts); 