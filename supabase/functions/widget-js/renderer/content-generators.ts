export function generateVideoContent(config: any): string {
  console.log('Generating video content with config:', {
    videoUrl: config.videoUrl,
    videoEnabled: config.videoEnabled,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment,
    videoObjectFit: config.videoObjectFit
  });

  // Only generate video content if video is enabled and there's a video URL
  if (!config.videoEnabled || !config.videoUrl) {
    console.log('Video not enabled or no video URL provided');
    return '';
  }

  const videoHeight = config.videoHeight || 200;
  const videoAlignment = config.videoAlignment || 'center';
  const videoObjectFit = config.videoObjectFit || 'cover';

  // Detect if it's a YouTube URL and create appropriate embed
  if (config.videoUrl.includes('youtube.com') || config.videoUrl.includes('youtu.be')) {
    let videoId = '';
    
    if (config.videoUrl.includes('youtube.com/watch?v=')) {
      videoId = config.videoUrl.split('v=')[1]?.split('&')[0] || '';
    } else if (config.videoUrl.includes('youtu.be/')) {
      videoId = config.videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    }

    if (videoId) {
      console.log('Creating YouTube embed for video ID:', videoId);
      return `
        <div class="hiclient-video-container" style="text-align: ${videoAlignment};">
          <iframe 
            class="hiclient-video-player" 
            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&enablejsapi=1" 
            style="width: 100%; height: ${videoHeight}px; object-fit: ${videoObjectFit};" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    }
  }

  // For regular video files, create a video element that will be controlled by JS
  console.log('Creating video element for regular video file');
  return `
    <div class="hiclient-video-container" style="text-align: ${videoAlignment};">
      <video 
        class="hiclient-video-player" 
        src="${config.videoUrl}" 
        style="width: 100%; height: ${videoHeight}px; object-fit: ${videoObjectFit};" 
        preload="metadata"
        muted>
        Your browser does not support the video tag.
      </video>
    </div>
  `;
}

export function generateButtonIcon(customIconUrl: string, useVideoPreview: boolean, videoUrl: string, previewVideoHeight: number, buttonSize?: number): string {
  console.log('Generating button icon with params:', {
    customIconUrl,
    useVideoPreview,
    videoUrl,
    previewVideoHeight,
    buttonSize
  });

  // Calculate icon size based on button size - make it proportional  
  const iconSize = buttonSize ? Math.max(20, Math.min(50, Math.round(buttonSize * 0.65))) : 32;

  if (useVideoPreview && videoUrl) {
    console.log('Using video preview as button icon');
    const videoHeight = previewVideoHeight || 120;
    
    // Check if it's a YouTube URL
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
      }

      if (videoId) {
        return `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0" 
            style="width: 100%; height: ${videoHeight}px; border: none; border-radius: 8px; object-fit: cover;"
            allow="autoplay"
            frameborder="0">
          </iframe>
        `;
      }
    }
    
    // For regular video files
    return `
      <video 
        src="${videoUrl}" 
        style="width: 100%; height: ${videoHeight}px; border-radius: 8px; object-fit: cover;" 
        autoplay 
        muted 
        loop 
        playsinline>
      </video>
    `;
  }

  if (customIconUrl) {
    console.log('Using custom icon:', customIconUrl);
    return `<img src="${customIconUrl}" alt="Custom icon" style="width: ${iconSize}px; height: ${iconSize}px; object-fit: contain;" />`;
  }

  console.log('Using default message icon with size:', iconSize);
  return `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  `;
}
