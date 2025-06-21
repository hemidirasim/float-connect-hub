
import { TemplateConfig } from './types';
import { ChannelUtils } from './channelUtils';

export class PlaceholderReplacer {
  constructor(private config: TemplateConfig) {}

  replacePlaceholders(template: string): string {
    console.log('Starting placeholder replacement for template:', template.substring(0, 200));
    
    let result = template;

    // Position styling
    const getPositionStyle = () => {
      switch (this.config.position) {
        case 'left':
          return 'left: 20px;';
        case 'center':
          return 'left: 50%; transform: translateX(-50%);';
        case 'right':
        default:
          return 'right: 20px;';
      }
    };

    // Tooltip positioning
    const getTooltipPositionStyle = () => {
      const buttonSize = this.config.buttonSize || 60;
      const tooltipOffset = 8;
      
      switch (this.config.tooltipPosition || 'top') {
        case 'top':
          return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`;
        case 'bottom':
          return `top: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-top: 0;`;
        case 'left':
          return `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`;
        case 'right':
          return `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`;
        default:
          return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`;
      }
    };

    // Generate channels HTML
    const channelsHtml = this.config.channels.map(channel => {
      const iconSvg = ChannelUtils.getChannelIcon(channel.type);
      const channelUrl = ChannelUtils.getChannelUrl(channel);
      const channelColor = ChannelUtils.getChannelColor(channel.type);
      
      return `
        <a href="${channelUrl}" target="_blank" class="lovable-channel-button" style="border-color: ${channelColor};">
          <div class="lovable-channel-icon" style="color: ${channelColor};">${iconSvg}</div>
          <span>${channel.label}</span>
        </a>
      `;
    }).join('');

    // Generate video content
    const videoContent = this.config.videoEnabled && this.config.videoUrl
      ? `<div style="margin-bottom: 16px; text-align: ${this.config.videoAlignment};">
           <video src="${this.config.videoUrl}" 
                  style="width: 100%; max-width: 100%; height: ${this.config.videoHeight}px; border-radius: 8px;" 
                  controls muted>
           </video>
         </div>`
      : '';

    // Button icon
    const buttonIcon = this.config.customIconUrl 
      ? `<img src="${this.config.customIconUrl}" style="width: 24px; height: 24px;" alt="Contact">`
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>';

    // Define all replacements
    const replacements: Record<string, string> = {
      '{{POSITION_STYLE}}': getPositionStyle(),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': (this.config.buttonSize || 60).toString(),
      '{{TOOLTIP_TEXT}}': this.config.tooltip,
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{GREETING_MESSAGE}}': this.config.greetingMessage || 'Hello! How can we help you today?',
      '{{BUTTON_ICON}}': buttonIcon,
      '{{CHANNELS_HTML}}': channelsHtml,
      '{{VIDEO_CONTENT}}': videoContent,
      '{{CHANNELS_COUNT}}': this.config.channels.length.toString(),
      '{{POSITION}}': this.config.position,
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top'
    };

    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
      result = result.replace(regex, value);
      console.log(`Replaced ${placeholder} with: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    });

    // Handle empty states - if no channels, show a message
    if (this.config.channels.length === 0) {
      result = result.replace('{{CHANNELS_HTML}}', '<p style="text-align: center; color: #666; padding: 20px;">No channels configured</p>');
    }

    console.log('Placeholder replacement completed. Result length:', result.length);
    return result;
  }
}
