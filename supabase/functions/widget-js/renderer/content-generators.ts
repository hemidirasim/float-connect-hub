
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
  if (!config.videoEnabled || !config.videoUrl) return ''
  
  // Process video URL to ensure it works properly
  let processedVideoUrl = config.videoUrl
  
  // Add autoplay parameters for YouTube videos
  if (processedVideoUrl.includes('youtube.com') || processedVideoUrl.includes('youtu.be')) {
    if (!processedVideoUrl.includes('autoplay=1')) {
      processedVideoUrl += processedVideoUrl.includes('?') ? '&autoplay=1&mute=1&loop=1' : '?autoplay=1&mute=1&loop=1'
    }
  }
  
  console.log('Generated video content with URL:', processedVideoUrl)
  
  return `<div class="hiclient-video-container" style="text-align: ${config.videoAlignment}; margin-bottom: 20px;">
     <video class="hiclient-video-player" src="${processedVideoUrl}" 
            style="height: ${config.videoHeight}px; width: 100%; border-radius: 12px;" 
            autoplay muted loop playsinline webkit-playsinline preload="auto">
       Your browser does not support the video tag.
     </video>
   </div>`
}

export function generateButtonIcon(customIconUrl?: string): string {
  if (customIconUrl) {
    return `<img src="${customIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Contact">`
  }
  
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>`
}
