// Widget template system for generating embeddable JavaScript widgets
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  customIcon?: string;
  isGroup?: boolean;
  groupItems?: Channel[];
  displayMode?: 'individual' | 'grouped';
  childChannels?: Channel[];
  parentId?: string;
}

export interface WidgetConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition?: string;
  greetingMessage?: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  templateId?: string;
}

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

// Default template
const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template',
  description: 'Modern and clean floating widget with green accent',
  html: `
    <div id="lovable-widget-button" style="{{POSITION_STYLE}}">
      <div id="lovable-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}}">{{TOOLTIP_TEXT}}</div>
      {{BUTTON_ICON}}
    </div>
    <div id="lovable-widget-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: none; visibility: hidden; opacity: 0;">
      <div id="lovable-modal-content" style="position: absolute; bottom: 20px; right: 20px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 300px; max-height: 400px; overflow: hidden;">
        <div style="padding: 20px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a202c;">{{GREETING_MESSAGE}}</h3>
            <button id="lovable-widget-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #718096;">&times;</button>
          </div>
        </div>
        <div style="max-height: 280px; overflow-y: auto; padding: 10px;" id="lovable-widget-channels"></div>
      </div>
    </div>
  `,
  css: `
    #lovable-widget-button {
      position: fixed;
      z-index: 9999;
      width: {{BUTTON_SIZE}}px;
      height: {{BUTTON_SIZE}}px;
      background: {{BUTTON_COLOR}};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #lovable-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    .channel-item {
      display: flex;
      align-items: center;
      padding: 12px;
      text-decoration: none;
      color: #2d3748;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
      border: 1px solid #e2e8f0;
    }
    .channel-item:hover {
      background: #f7fafc;
      transform: translateX(4px);
    }
    .channel-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 16px;
    }
    .channel-info {
      flex: 1;
    }
    .channel-label {
      font-weight: 600;
      margin-bottom: 2px;
      font-size: 14px;
    }
    .channel-value {
      font-size: 12px;
      color: #718096;
    }
    #lovable-widget-tooltip {
      position: absolute;
      background: #2d3748;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      pointer-events: none;
      display: none;
      visibility: hidden;
      opacity: 0;
      transition: all 0.2s ease;
    }
  `,
  js: `
    function getChannelUrl(channel) {
      switch (channel.type) {
        case 'whatsapp':
          return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
        case 'telegram':
          return channel.value.startsWith('@') ? 'https://t.me/' + channel.value.slice(1) : 'https://t.me/' + channel.value;
        case 'email':
          return 'mailto:' + channel.value;
        case 'phone':
          return 'tel:' + channel.value;
        default:
          return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
      }
    }

    function getChannelIcon(channel) {
      var icons = {
        whatsapp: '📱',
        telegram: '✈️',
        instagram: '📷',
        messenger: '💬',
        viber: '📞',
        skype: '💻',
        discord: '🎮',
        tiktok: '🎵',
        youtube: '📺',
        facebook: '👥',
        twitter: '🐦',
        linkedin: '💼',
        github: '⚡',
        website: '🌐',
        chatbot: '🤖',
        email: '✉️',
        phone: '📞',
        custom: '🔗'
      };
      return icons[channel.type] || '🔗';
    }

    function getChannelColor(type) {
      var colors = {
        whatsapp: '#25d366',
        telegram: '#0088cc',
        instagram: '#e4405f',
        messenger: '#006aff',
        viber: '#665cac',
        skype: '#00aff0',
        discord: '#7289da',
        tiktok: '#000000',
        youtube: '#ff0000',
        facebook: '#1877f2',
        twitter: '#1da1f2',
        linkedin: '#0077b5',
        github: '#333333',
        website: '#6b7280',
        chatbot: '#3b82f6',
        email: '#ea4335',
        phone: '#34d399',
        custom: '#6b7280'
      };
      return colors[type] || '#6b7280';
    }

    var channelsData = {{CHANNELS_DATA}};

    function generateChannelsHtml() {
      if (!channelsData || channelsData.length === 0) {
        return '<div style="padding: 20px; text-align: center; color: #718096;">No channels configured</div>';
      }
      
      var html = '';
      for (var i = 0; i < channelsData.length; i++) {
        var channel = channelsData[i];
        var channelUrl = getChannelUrl(channel);
        var channelIcon = getChannelIcon(channel);
        var channelColor = getChannelColor(channel.type);
        
        html += '<a href="' + channelUrl + '" target="_blank" class="channel-item">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + channel.label + '</div>';
        html += '<div class="channel-value">' + channel.value + '</div>';
        html += '</div>';
        html += '</a>';
      }
      
      return html;
    }

    function initWidget() {
      var channelsContainer = document.querySelector('#lovable-widget-channels');
      if (channelsContainer) {
        channelsContainer.innerHTML = generateChannelsHtml();
      }
      
      var button = document.querySelector('#lovable-widget-button');
      var modal = document.querySelector('#lovable-widget-modal');
      var modalContent = document.querySelector('#lovable-modal-content');
      var tooltip = document.querySelector('#lovable-widget-tooltip');
      var closeBtn = document.querySelector('#lovable-widget-close');
      
      if (!button || !modal) return;
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
      });
      
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          modal.style.display = 'none';
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
        });
      }
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.style.visibility = 'hidden';
          modal.style.opacity = '0';
        }
      });
      
      if (tooltip && button && '{{TOOLTIP_DISPLAY}}' === 'hover') {
        button.addEventListener('mouseenter', function() {
          tooltip.style.display = 'block';
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', function() {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWidget);
    } else {
      initWidget();
    }
  `
};

// Template registry
export const TEMPLATE_REGISTRY = {
  'default': defaultTemplate,
  'dark': {
    ...defaultTemplate,
    id: 'dark',
    name: 'Dark Theme',
    description: 'Dark themed widget with modern styling'
  },
  'minimal': {
    ...defaultTemplate,
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal widget design'
  }
};

export function getTemplateById(templateId: string): WidgetTemplate {
  return TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] || TEMPLATE_REGISTRY['default'];
}

export function generateWidgetScript(widget: any): string {
  const config: WidgetConfig = {
    channels: widget.channels || [],
    buttonColor: widget.button_color || '#25d366',
    position: widget.position || 'right',
    tooltip: widget.tooltip || 'Contact us!',
    tooltipDisplay: widget.tooltip_display || 'hover',
    tooltipPosition: widget.tooltip_position || 'top',
    greetingMessage: widget.greeting_message || 'Hello! How can we help you today?',
    customIconUrl: widget.custom_icon_url || '',
    videoEnabled: widget.video_enabled || false,
    videoUrl: widget.video_url || '',
    videoHeight: widget.video_height || 200,
    videoAlignment: widget.video_alignment || 'center',
    useVideoPreview: widget.use_video_preview || false,
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: widget.template_id || 'default'
  };

  const template = getTemplateById(config.templateId || 'default');
  
  // Generate position styles
  const getPositionStyle = (position: string): string => {
    switch (position) {
      case 'left':
        return `bottom: 20px; left: 20px;`;
      case 'right':
      default:
        return `bottom: 20px; right: 20px;`;
    }
  };

  const getTooltipPositionStyle = (config: WidgetConfig): string => {
    const buttonSize = config.buttonSize;
    switch (config.position) {
      case 'left':
        return `bottom: ${buttonSize + 10}px; left: 0;`;
      case 'right':
      default:
        return `bottom: ${buttonSize + 10}px; right: 0;`;
    }
  };

  // Replace placeholders
  let html = template.html;
  let css = template.css;
  let js = template.js;

  const replacements = {
    '{{POSITION_STYLE}}': getPositionStyle(config.position),
    '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(config),
    '{{BUTTON_COLOR}}': config.buttonColor,
    '{{BUTTON_SIZE}}': config.buttonSize.toString(),
    '{{TOOLTIP_TEXT}}': config.tooltip,
    '{{TOOLTIP_DISPLAY}}': config.tooltipDisplay,
    '{{GREETING_MESSAGE}}': config.greetingMessage || 'Hello! How can we help you today?',
    '{{BUTTON_ICON}}': `<div style="color: white; font-size: 24px;">💬</div>`,
    '{{CHANNELS_DATA}}': JSON.stringify(config.channels)
  };

  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
    html = html.replace(regex, value || '');
    css = css.replace(regex, value || '');
    js = js.replace(regex, value || '');
  });

  // Generate complete script
  return `
(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = \`${css}\`;
  document.head.appendChild(style);

  // Inject HTML
  const widgetDiv = document.createElement('div');
  widgetDiv.innerHTML = \`${html}\`;
  document.body.appendChild(widgetDiv);

  // Execute JavaScript
  ${js}
})();
`;
}