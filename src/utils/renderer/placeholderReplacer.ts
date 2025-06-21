
import { TemplateConfig } from './types';
import { ChannelUtils } from './channelUtils';

export class PlaceholderReplacer {
  constructor(private config: TemplateConfig) {}

  replacePlaceholders(template: string): string {
    const hasVideo = this.config.videoUrl && this.config.videoUrl.trim() !== '';
    
    let result = template
      .replace(/\{\{position\}\}/g, this.config.position)
      .replace(/\{\{button_color\}\}/g, this.config.buttonColor)
      .replace(/\{\{button_size\}\}/g, this.config.buttonSize.toString())
      .replace(/\{\{tooltip_text\}\}/g, this.config.tooltip);

    // Replace tooltip classes and styles
    if (this.config.tooltipDisplay === 'never') {
      result = result.replace(/\{\{tooltip_class\}\}/g, 'hide');
    } else if (this.config.tooltipDisplay === 'always') {
      result = result.replace(/\{\{tooltip_class\}\}/g, 'show');
    } else {
      result = result.replace(/\{\{tooltip_class\}\}/g, 'hide');
    }

    const tooltipPosition = this.config.position === 'left' ? 'right: 70px;' : 'left: 70px;';
    result = result.replace(/\{\{tooltip_style\}\}/g, tooltipPosition);

    // Replace button style
    const buttonStyle = `width: ${this.config.buttonSize}px; height: ${this.config.buttonSize}px; background: ${this.config.buttonColor};`;
    result = result.replace(/\{\{button_style\}\}/g, buttonStyle);

    // Replace button icon
    const buttonIcon = this.config.customIconUrl 
      ? `<img src="${this.config.customIconUrl}" alt="Custom icon" style="width:24px;height:24px;object-fit:cover;">`
      : '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    result = result.replace(/\{\{button_icon\}\}/g, buttonIcon);

    // Replace video section
    result = this.replaceVideoSection(result, hasVideo);
    
    // Replace channels section
    result = this.replaceChannelsSection(result);
    
    // Replace empty state
    result = this.replaceEmptyState(result, hasVideo);

    return result;
  }

  private replaceVideoSection(result: string, hasVideo: boolean): string {
    if (hasVideo) {
      const videoSection = `
        <div class="hiclient-video-container">
          <video class="hiclient-video-player" style="height:${this.config.videoHeight}px;object-position:${this.getVideoObjectPosition()};" controls autoplay>
            <source src="${this.config.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>`;
      return result.replace(/\{\{video_section\}\}/g, videoSection);
    } else {
      return result.replace(/\{\{video_section\}\}/g, '');
    }
  }

  private replaceChannelsSection(result: string): string {
    if (this.config.channels && this.config.channels.length > 0) {
      const channelsHtml = this.config.channels.map(channel => {
        const channelUrl = ChannelUtils.getChannelUrl(channel);
        const channelIcon = ChannelUtils.getChannelIcon(channel.type);
        const channelColor = ChannelUtils.getChannelColor(channel.type);
        
        return `
          <div class="hiclient-channel-item" onclick="openChannel('${channelUrl}');">
            <div class="hiclient-channel-icon" style="background-color:${channelColor};">${channelIcon}</div>
            <div class="hiclient-channel-info">
              <div class="hiclient-channel-label">${channel.label}</div>
              <div class="hiclient-channel-value">${channel.value}</div>
            </div>
            <svg class="hiclient-external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </div>`;
      }).join('');
      
      return result.replace(/\{\{channels_section\}\}/g, `<div class="hiclient-channels-container">${channelsHtml}</div>`);
    } else {
      return result.replace(/\{\{channels_section\}\}/g, '');
    }
  }

  private replaceEmptyState(result: string, hasVideo: boolean): string {
    if ((!this.config.channels || this.config.channels.length === 0) && !hasVideo) {
      const emptyState = `
        <div class="hiclient-empty-state">
          <svg class="hiclient-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <p style="margin:0;font-size:14px;">No contact channels available</p>
        </div>`;
      return result.replace(/\{\{empty_state\}\}/g, emptyState);
    } else {
      return result.replace(/\{\{empty_state\}\}/g, '');
    }
  }

  private getVideoObjectPosition(): string {
    switch (this.config.videoAlignment) {
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      case 'center':
      default:
        return 'center';
    }
  }
}
