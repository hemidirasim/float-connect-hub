
import type { TemplateConfig } from './types.ts'
import type { Channel } from '../types.ts'
import { generateMinimalChannelsHtml, generateDefaultChannelsHtml } from './template-generators.ts'

export function generateChannelsHtml(config: TemplateConfig, templateId: string): string {
  if (templateId === 'minimal') {
    return generateMinimalChannelsHtml(config.channels)
  }
  
  // Default template logic
  return generateDefaultChannelsHtml(config.channels)
}

// Helper function to create protected video URL fetcher
function createVideoUrlFetcher(videoUrl: string, widgetId: string): string {
  if (!videoUrl || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    return videoUrl; // YouTube URLs don't need protection
  }

  // For Supabase storage URLs, create a function that fetches signed URL
  if (videoUrl.includes('supabase')) {
    return `
      (async function() {
        try {
          const videoPath = '${videoUrl.split('/videos/')[1] || videoUrl}';
          const response = await fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/get-video-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoPath, widgetId: '${widgetId}' })
          });
          const data = await response.json();
          return data.signedUrl || '${videoUrl}';
        } catch (e) {
          console.error('Failed to get signed URL:', e);
          return '${videoUrl}';
        }
      })()
    `;
  }

  return videoUrl;
}

export function generateVideoContent(config: TemplateConfig): string {
  console.log('generateVideoContent called with:', {
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment,
    videoObjectFit: config.videoObjectFit
  })

  // Check if video is enabled AND has a URL
  if (!config.videoEnabled || !config.videoUrl || config.videoUrl.trim() === '') {
    console.log('Video not enabled or no URL provided:', {
      videoEnabled: config.videoEnabled,
      hasVideoUrl: Boolean(config.videoUrl && config.videoUrl.trim() !== '')
    })
    return ''
  }
  
  // Process video URL to ensure it works properly
  let processedVideoUrl = config.videoUrl.trim()
  
  // Determine vertical alignment styles
  let alignmentStyle = '';
  switch (config.videoAlignment) {
    case 'top':
      alignmentStyle = 'align-items: flex-start;';
      break;
    case 'bottom':
      alignmentStyle = 'align-items: flex-end;';
      break;
    case 'center':
    default:
      alignmentStyle = 'align-items: center;';
      break;
  }
  
  // Handle different video types
  if (processedVideoUrl.includes('youtube.com') || processedVideoUrl.includes('youtu.be')) {
    // Convert YouTube URL to embed format
    let videoId = ''
    if (processedVideoUrl.includes('youtube.com/watch?v=')) {
      videoId = processedVideoUrl.split('v=')[1]?.split('&')[0]
    } else if (processedVideoUrl.includes('youtu.be/')) {
      videoId = processedVideoUrl.split('youtu.be/')[1]?.split('?')[0]
    }
    
    if (videoId) {
      // Use iframe for YouTube videos with vertical alignment
      const videoHeight = config.videoHeight || 200
      
      const youtubeHtml = `<div class="hiclient-video-container" style="display: flex; ${alignmentStyle} justify-content: center; margin-bottom: 20px;">
         <iframe class="hiclient-video-player" 
                src="https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1" 
                style="height: ${videoHeight}px; width: 100%; border-radius: 12px; border: none; object-fit: ${config.videoObjectFit || 'cover'};" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
         </iframe>
       </div>`
      
      console.log('Generated YouTube iframe video content with vertical alignment')
      return youtubeHtml
    }
  }
  
  // For direct video files with protection
  const videoHeight = config.videoHeight || 200
  const videoObjectFit = config.videoObjectFit || 'cover'
  
  // Generate protected video HTML with dynamic URL loading
  const videoHtml = `<div class="hiclient-video-container" style="display: flex; ${alignmentStyle} justify-content: center; margin-bottom: 20px;">
     <video class="hiclient-video-player protected-video" 
            style="height: ${videoHeight}px; width: 100%; border-radius: 12px; object-fit: ${videoObjectFit};" 
            loop playsinline webkit-playsinline preload="metadata"
            data-video-url="${processedVideoUrl}">
       Your browser does not support the video tag.
     </video>
   </div>
   <script>
     // Load protected video URL
     document.addEventListener('DOMContentLoaded', async function() {
       const videos = document.querySelectorAll('.protected-video');
       for (const video of videos) {
         const originalUrl = video.getAttribute('data-video-url');
         if (originalUrl && originalUrl.includes('supabase')) {
           try {
             const videoPath = originalUrl.split('/videos/')[1] || originalUrl;
             const response = await fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/get-video-url', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ videoPath, widgetId: window.currentWidgetId || 'unknown' })
             });
             const data = await response.json();
             if (data.signedUrl) {
               video.src = data.signedUrl;
             } else {
               video.src = originalUrl; // Fallback
             }
           } catch (e) {
             console.error('Failed to load protected video:', e);
             video.src = originalUrl; // Fallback
           }
         } else {
           video.src = originalUrl; // Direct URL for non-Supabase videos
         }
       }
     });
   </script>`

  console.log('Generated protected video content with dynamic URL loading')
  return videoHtml
}

export function generateButtonIcon(customIconUrl?: string, useVideoPreview?: boolean, videoUrl?: string, previewVideoHeight?: number): string {
  // If using video preview, generate video button instead of icon
  if (useVideoPreview && videoUrl) {
    const height = previewVideoHeight || 120;
    const width = height; // Keep it square for button
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // Handle YouTube videos for preview
      let videoId = ''
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0]
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
      }
      
      if (videoId) {
        return `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1" 
                       style="width: ${width}px; height: ${height}px; border-radius: 50%; border: none; object-fit: cover; pointer-events: none;" 
                       allow="autoplay; encrypted-media"></iframe>`
      }
    } else {
      // Handle direct video files for preview with protection
      return `<video class="protected-video-preview" 
                     style="width: ${width}px; height: ${height}px; border-radius: 50%; object-fit: cover; pointer-events: none;" 
                     autoplay muted loop playsinline webkit-playsinline preload="metadata"
                     data-video-url="${videoUrl}">
              </video>
              <script>
                // Load protected video URL for preview
                (async function() {
                  const video = document.querySelector('.protected-video-preview[data-video-url="${videoUrl}"]');
                  if (video && video.dataset.videoUrl.includes('supabase')) {
                    try {
                      const videoPath = video.dataset.videoUrl.split('/videos/')[1] || video.dataset.videoUrl;
                      const response = await fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/get-video-url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ videoPath, widgetId: window.currentWidgetId || 'unknown' })
                      });
                      const data = await response.json();
                      if (data.signedUrl) {
                        video.src = data.signedUrl;
                      } else {
                        video.src = video.dataset.videoUrl; 
                      }
                    } catch (e) {
                      console.error('Failed to load protected video preview:', e);
                      video.src = video.dataset.videoUrl; 
                    }
                  } else if (video) {
                    video.src = video.dataset.videoUrl; 
                  }
                })();
              </script>`
    }
  }
  
  // Standard icon logic
  if (customIconUrl) {
    return `<img src="${customIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Contact">`
  }
  
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>`
}
