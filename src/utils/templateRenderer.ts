
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export interface TemplateConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
}

export class TemplateRenderer {
  private template: WidgetTemplate;
  private config: TemplateConfig;

  constructor(template: WidgetTemplate, config: TemplateConfig) {
    this.template = template;
    this.config = config;
  }

  private getChannelIcon(type: string): string {
    const iconMap: Record<string, string> = {
      whatsapp: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>',
      telegram: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
      email: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
      phone: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
      instagram: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
      default: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
    };
    return iconMap[type] || iconMap.default;
  }

  private getChannelColor(type: string): string {
    const colorMap: Record<string, string> = {
      whatsapp: '#25d366',
      telegram: '#0088cc',
      email: '#ea4335',
      phone: '#22c55e',
      instagram: '#e4405f',
      default: '#6b7280'
    };
    return colorMap[type] || colorMap.default;
  }

  private getChannelUrl(channel: Channel): string {
    switch (channel.type) {
      case 'whatsapp':
        return `https://wa.me/${channel.value.replace(/[^0-9]/g, '')}`;
      case 'telegram':
        return `https://t.me/${channel.value.replace('@', '')}`;
      case 'email':
        return `mailto:${channel.value}`;
      case 'phone':
        return `tel:${channel.value}`;
      case 'instagram':
        return channel.value.startsWith('http') ? channel.value : `https://instagram.com/${channel.value.replace('@', '')}`;
      default:
        return channel.value;
    }
  }

  private replacePlaceholders(template: string): string {
    const hasVideo = this.config.videoUrl && this.config.videoUrl.trim() !== '';
    
    // Replace basic placeholders
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
    if (hasVideo) {
      const videoSection = `
        <div class="hiclient-video-container">
          <video class="hiclient-video-player" style="height:${this.config.videoHeight}px;object-position:${this.getVideoObjectPosition()};" controls autoplay>
            <source src="${this.config.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>`;
      result = result.replace(/\{\{video_section\}\}/g, videoSection);
    } else {
      result = result.replace(/\{\{video_section\}\}/g, '');
    }

    // Replace channels section
    if (this.config.channels && this.config.channels.length > 0) {
      const channelsHtml = this.config.channels.map(channel => {
        const channelUrl = this.getChannelUrl(channel);
        const channelIcon = this.getChannelIcon(channel.type);
        const channelColor = this.getChannelColor(channel.type);
        
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
      
      result = result.replace(/\{\{channels_section\}\}/g, `<div class="hiclient-channels-container">${channelsHtml}</div>`);
    } else {
      result = result.replace(/\{\{channels_section\}\}/g, '');
    }

    // Replace empty state
    if ((!this.config.channels || this.config.channels.length === 0) && !hasVideo) {
      const emptyState = `
        <div class="hiclient-empty-state">
          <svg class="hiclient-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <p style="margin:0;font-size:14px;">No contact channels available</p>
        </div>`;
      result = result.replace(/\{\{empty_state\}\}/g, emptyState);
    } else {
      result = result.replace(/\{\{empty_state\}\}/g, '');
    }

    return result;
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

  public renderHTML(): string {
    return this.replacePlaceholders(this.template.html);
  }

  public renderCSS(): string {
    return this.replacePlaceholders(this.template.css);
  }

  public renderJS(): string {
    // Always use the template's JS if available
    if (this.template.js && this.template.js.trim()) {
      console.log('Using template JavaScript');
      return this.replacePlaceholders(this.template.js);
    }
    
    console.log('Using fallback JavaScript');
    return this.getWidgetJavaScript();
  }

  private getWidgetJavaScript(): string {
    return `
      console.log('Widget JavaScript loaded (fallback)');
      
      // Function to handle widget initialization
      function initializeWidget() {
        console.log('Initializing widget (fallback)...');
        
        var button = document.querySelector('.hiclient-widget-button');
        var modal = document.querySelector('.hiclient-modal-backdrop');
        var tooltip = document.querySelector('.hiclient-tooltip');
        var closeBtn = document.querySelector('.hiclient-modal-close');
        
        console.log('Found elements:', { button: !!button, modal: !!modal, tooltip: !!tooltip, closeBtn: !!closeBtn });
        
        if (button && modal) {
          // Button click handler
          button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Widget button clicked (fallback), showing modal');
            modal.classList.add('show');
          });
          
          // Close button handler
          if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked (fallback)');
              modal.classList.remove('show');
            });
          }
          
          // Backdrop click handler
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              console.log('Backdrop clicked (fallback), closing modal');
              modal.classList.remove('show');
            }
          });
          
          // ESC key handler
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
              console.log('ESC pressed (fallback), closing modal');
              modal.classList.remove('show');
            }
          });
        }
        
        // Tooltip hover effects
        if (tooltip && button && '${this.config.tooltipDisplay}' === 'hover') {
          button.addEventListener('mouseenter', function() {
            console.log('Button hover (fallback) - showing tooltip');
            tooltip.classList.remove('hide');
            tooltip.classList.add('show');
          });
          
          button.addEventListener('mouseleave', function() {
            console.log('Button leave (fallback) - hiding tooltip');
            tooltip.classList.remove('show');
            tooltip.classList.add('hide');
          });
        }
        
        // Global channel opener
        window.openChannel = function(url) {
          console.log('Opening channel (fallback):', url);
          window.open(url, '_blank');
        };
        
        console.log('Widget initialization complete (fallback)');
      }
      
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
      } else {
        initializeWidget();
      }
    `;
  }

  public renderComplete(): string {
    const html = this.renderHTML();
    const css = this.renderCSS();
    const js = this.renderJS();

    console.log('Rendering complete widget with JS:', !!js);

    return `
      <style>${css}</style>
      ${html}
      <script>${js}</script>
    `;
  }
}

export const createWidgetFromTemplate = (template: WidgetTemplate, config: TemplateConfig): string => {
  const renderer = new TemplateRenderer(template, config);
  return renderer.renderComplete();
};
