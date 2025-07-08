
export const utilityFunctions = `
// Preload video metadata for better performance
function preloadVideoMetadata() {
  console.log('Preloading video metadata');
  const videos = document.querySelectorAll('.hiclient-video-player');
  console.log('Preloading ' + videos.length + ' videos metadata');
  videos.forEach(function(video) {
    if (video.tagName === 'VIDEO') {
      video.load();
    }
  });
}

// Play video with sound when modal opens
function playVideo() {
  console.log('playVideo function called');
  const videos = document.querySelectorAll('.hiclient-video-player');
  console.log('Found videos: ' + videos.length);
  
  videos.forEach(function(video, index) {
    console.log('Processing video ' + index + ' with src: ' + video.src);
    if (video.tagName === 'VIDEO') {
      // Unmute and play the video
      video.muted = false;
      video.currentTime = 0; // Start from beginning
      
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          console.log('Video ' + index + ' started playing successfully with sound');
        }).catch(function(error) {
          console.log('Video ' + index + ' autoplay failed, trying muted:', error);
          // If autoplay with sound fails, try muted
          video.muted = true;
          video.play().then(function() {
            console.log('Video ' + index + ' started playing muted');
          }).catch(function(mutedError) {
            console.log('Video ' + index + ' failed to play even muted:', mutedError);
          });
        });
      }
    }
  });
}

// Pause video when modal closes
function pauseVideo() {
  console.log('pauseVideo function called');
  const videos = document.querySelectorAll('.hiclient-video-player');
  videos.forEach(function(video) {
    if (video.tagName === 'VIDEO') {
      video.pause();
      console.log('Video paused');
    }
  });
}

// Show modal and play video
function showModal() {
  console.log('Button clicked, showing modal');
  const modal = document.getElementById('hiclient-modal');
  if (modal) {
    modal.style.display = 'flex';
    // Small delay to ensure modal is visible before playing video
    setTimeout(function() {
      console.log('Attempting to play video after modal open');
      playVideo();
    }, 100);
  }
}

// Hide modal and pause video
function hideModal() {
  console.log('Hiding modal');
  const modal = document.getElementById('hiclient-modal');
  if (modal) {
    modal.style.display = 'none';
    pauseVideo();
  }
}
`;
