document.getElementById('search-button').addEventListener('click', fetchProfile);

async function fetchProfile() {
  const username = document.getElementById('username').value.trim(); // Trim any extra spaces
  if (username === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Please enter a GitHub username!'
    });
    return;
  }

  const apiUrl = `https://api.github.com/users/${username}`;
  try {
    // Fetching GitHub profile data
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // If response is not ok (404 or other errors), handle it
      if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'The GitHub username you entered does not exist!'
        });
      } else if (response.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'API Rate Limit Exceeded',
          text: 'You have exceeded the GitHub API rate limit. Please try again later.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again later.'
        });
      }
      return;
    }

    const data = await response.json();

    // Display profile data
    document.getElementById('profile').style.display = 'block';
    document.getElementById('avatar').src = data.avatar_url;
    document.getElementById('name').textContent = data.name ? data.name : 'No Name Available';
    document.getElementById('repo-count').textContent = `${data.public_repos} Repos`;
    document.getElementById('follower-count').textContent = data.followers;

    // Clear input field after fetching the data
    document.getElementById('username').value = '';

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Profile Fetched',
      text: `Profile for ${data.name || username} has been successfully fetched!`,
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Failed to fetch profile. Please check your internet connection.'
    });
  }
}
