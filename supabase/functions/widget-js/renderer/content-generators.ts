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

  // Detect video platform and create appropriate embed
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
            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0&playsinline=1&disablekb=1" 
            style="width: 100%; height: ${videoHeight}px; pointer-events: none;" 
            frameborder="0" 
            allow="autoplay"
            allowfullscreen="false">
          </iframe>
        </div>
      `;
    }
  }

  // Vimeo support
  if (config.videoUrl.includes('vimeo.com')) {
    const vimeoMatch = config.videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      console.log('Creating Vimeo embed for video ID:', videoId);
      return `
        <div class="hiclient-video-container" style="text-align: ${videoAlignment};">
          <iframe 
            class="hiclient-video-player" 
            src="https://player.vimeo.com/video/${videoId}?background=1&autoplay=0&loop=0&byline=0&title=0&portrait=0&controls=0&transparent=0" 
            style="width: 100%; height: ${videoHeight}px; pointer-events: none;" 
            frameborder="0" 
            allow="autoplay"
            allowfullscreen="false">
          </iframe>
        </div>
      `;
    }
  }

  // Dailymotion support
  if (config.videoUrl.includes('dailymotion.com')) {
    const dailymotionMatch = config.videoUrl.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (dailymotionMatch && dailymotionMatch[1]) {
      const videoId = dailymotionMatch[1];
      console.log('Creating Dailymotion embed for video ID:', videoId);
      return `
        <div class="hiclient-video-container" style="text-align: ${videoAlignment};">
          <iframe 
            class="hiclient-video-player" 
            src="https://www.dailymotion.com/embed/video/${videoId}?autoplay=0&mute=0&controls=0&ui-logo=0&sharing-enable=0&ui-start-screen-info=0&ui-highlight=0" 
            style="width: 100%; height: ${videoHeight}px; pointer-events: none;" 
            frameborder="0" 
            allow="autoplay"
            allowfullscreen="false">
          </iframe>
        </div>
      `;
    }
  }

  // For regular video files, create a video element with no controls and 100% width
  console.log('Creating video element for regular video file');
  return `
    <div class="hiclient-video-container" style="text-align: ${videoAlignment};">
      <video 
        class="hiclient-video-player" 
        src="${config.videoUrl}" 
        style="width: 100%; height: ${videoHeight}px; object-fit: ${videoObjectFit};" 
        loop
        preload="auto">
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
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&fs=0&playsinline=1" 
            style="width: 100%; height: ${videoHeight}px; border: none; border-radius: 8px; object-fit: cover; pointer-events: none; position: relative; z-index: 1;"
            allow="autoplay"
            frameborder="0"
            allowfullscreen="false">
          </iframe>
        `;
      }
    }

    // Check if it's a Vimeo URL
    if (videoUrl.includes('vimeo.com')) {
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        const videoId = vimeoMatch[1];
        return `
          <iframe 
            src="https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&controls=0&portrait=0&transparent=0" 
            style="width: 100%; height: ${videoHeight}px; border: none; border-radius: 8px; object-fit: cover; pointer-events: none; position: relative; z-index: 1;"
            allow="autoplay; fullscreen"
            frameborder="0"
            allowfullscreen="false">
          </iframe>
        `;
      }
    }

    // Check if it's a Dailymotion URL
    if (videoUrl.includes('dailymotion.com')) {
      const dailymotionMatch = videoUrl.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
      if (dailymotionMatch && dailymotionMatch[1]) {
        const videoId = dailymotionMatch[1];
        return `
          <iframe 
            src="https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&mute=1&loop=1&controls=0&ui-logo=0&sharing-enable=0&ui-start-screen-info=0&ui-highlight=0" 
            style="width: 100%; height: ${videoHeight}px; border: none; border-radius: 8px; object-fit: cover; pointer-events: none; position: relative; z-index: 1;"
            allow="autoplay; fullscreen"
            frameborder="0"
            allowfullscreen="false">
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
