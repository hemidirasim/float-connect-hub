
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

export function generateVideoContent(config: TemplateConfig): string {
  console.log('generateVideoContent called with:', {
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment
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
      // Use iframe for YouTube videos - remove mute parameter for sound
      const videoHeight = config.videoHeight || 200
      const videoAlignment = config.videoAlignment || 'center'
      
      const youtubeHtml = `<div class="hiclient-video-container" style="text-align: ${videoAlignment}; margin-bottom: 20px;">
         <iframe class="hiclient-video-player" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}" 
                style="height: ${videoHeight}px; width: 100%; border-radius: 12px; border: none;" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
         </iframe>
       </div>`
      
      console.log('Generated YouTube iframe video content')
      return youtubeHtml
    }
  }
  
  // For direct video files (mp4, webm, etc.) - remove muted and controls attributes
  const videoHeight = config.videoHeight || 200
  const videoAlignment = config.videoAlignment || 'center'
  
  console.log('Generated video content with processed URL:', processedVideoUrl)
  
  const videoHtml = `<div class="hiclient-video-container" style="text-align: ${videoAlignment}; margin-bottom: 20px;">
     <video class="hiclient-video-player" src="${processedVideoUrl}" 
            style="height: ${videoHeight}px; width: 100%; border-radius: 12px;" 
            autoplay loop playsinline webkit-playsinline preload="metadata">
       Your browser does not support the video tag.
     </video>
   </div>`

  console.log('Final video HTML generated:', videoHtml)
  return videoHtml
}

export function generateButtonIcon(customIconUrl?: string): string {
  if (customIconUrl) {
    return `<img src="${customIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Contact">`
  }
  
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>`
}
