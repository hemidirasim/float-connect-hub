import type { WidgetTemplate } from '../template-types.ts'

const modernFloatingHtmlTemplate = `
<div id="modern-floating-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div id="modern-floating-widget-relative-container" style="position: relative;">
    <div id="modern-floating-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
    
    <!-- Channels container that appears on hover -->
    <div id="modern-floating-channels-container" style="position: absolute; {{POSITION_CHANNELS_STYLE}} bottom: {{CHANNEL_BOTTOM_OFFSET}}px; display: none; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
      <div id="modern-floating-channels"></div>
    </div>
    
    <!-- Video content for modern floating -->
    {{VIDEO_CONTENT}}
    
    <button id="modern-floating-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background-color: {{BUTTON_COLOR}}; {{BUTTON_OFFSET_STYLE}} {{VIDEO_BUTTON_STYLE}}">
      {{BUTTON_ICON}}
    </button>
  </div>
</div>
`;

const modernFloatingCssStyles = `
  #modern-floating-widget-button {
    border-radius: 50%;
    background-color: {{BUTTON_COLOR}};
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    color: white;
    {{BUTTON_OFFSET_STYLE}}
  }
  
  #modern-floating-widget-button:hover {
    box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
    transform: scale(1.1);
  }
  
  #modern-floating-widget-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 100000;
    transition: all 0.2s ease;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    {{TOOLTIP_POSITION_STYLE}}
  }
  
  #modern-floating-channels-container {
    pointer-events: none;
  }
  
  #modern-floating-channels-container.show {
    pointer-events: all;
  }
  
  #modern-floating-channels {
    display: flex;
    flex-direction: column;
    gap: {{CHANNEL_GAP}}px;
    align-items: center;
  }
  
  .modern-floating-channel-item {
    width: {{CHANNEL_ICON_SIZE}}px;
    height: {{CHANNEL_ICON_SIZE}}px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: all;
    font-size: {{CHANNEL_ICON_FONT_SIZE}}px;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .modern-floating-channel-item:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .modern-floating-channel-item.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Video styles for modern floating */
  .hiclient-video {
    position: absolute;
    bottom: {{CHANNEL_BOTTOM_OFFSET}}px;
    {{POSITION_CHANNELS_STYLE}}
    width: 300px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 16px;
    display: none;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 99998;
  }
  
  .hiclient-video.show {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }
  
  .hiclient-video video,
  .hiclient-video iframe {
    width: 100%;
    border-radius: 8px;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    #modern-floating-channels {
      gap: {{MOBILE_CHANNEL_GAP}}px;
    }
    
    .modern-floating-channel-item {
      width: {{MOBILE_CHANNEL_ICON_SIZE}}px;
      height: {{MOBILE_CHANNEL_ICON_SIZE}}px;
      font-size: {{MOBILE_CHANNEL_ICON_FONT_SIZE}}px;
    }
    
    .hiclient-video {
      width: 280px;
    }
  }
`;

const modernFloatingJavaScriptLogic = `
  // Utility functions
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
    // Check if channel has a custom icon first
    if (channel.customIcon) {
      return '<img src="' + channel.customIcon + '" alt="' + (channel.label || 'Custom') + '" style="width: 100%; height: 100%; object-fit: contain;" />';
    }
    
    var icons = {
      whatsapp: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/007-social.png" alt="Whatsapp" style="width: 100%; height: 100%; object-fit: contain;" />',
      telegram: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/006-telegram.png" alt="Telegram" style="width: 100%; height: 100%; object-fit: contain;" />',
      instagram: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/002-instagram.png" alt="Instagram" style="width: 100%; height: 100%; object-fit: contain;" />',
      messenger: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/018-messenger.png" alt="Messenger" style="width: 100%; height: 100%; object-fit: contain;" />',
      viber: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/011-viber.png" alt="Viber" style="width: 100%; height: 100%; object-fit: contain;" />',
      discord: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/017-discord.png" alt="Discord" style="width: 100%; height: 100%; object-fit: contain;" />',
      tiktok: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/004-tiktok.png" alt="Tiktok" style="width: 100%; height: 100%; object-fit: contain;" />',
      youtube: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/008-youtube.png" alt="Youtube" style="width: 100%; height: 100%; object-fit: contain;" />',
      facebook: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/003-facebook.png" alt="Facebook" style="width: 100%; height: 100%; object-fit: contain;" />',
      twitter: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/twitter.png" alt="X" style="width: 100%; height: 100%; object-fit: contain;" />',
      linkedin: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/005-linkedin.png" alt="Linkedin" style="width: 100%; height: 100%; object-fit: contain;" />',
      github: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/012-github.png" alt="Github" style="width: 100%; height: 100%; object-fit: contain;" />',
      behance: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/014-behance.png" alt="Behance" style="width: 100%; height: 100%; object-fit: contain;" />',
      dribble: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/013-dribble.png" alt="Dribble" style="width: 100%; height: 100%; object-fit: contain;" />',
      figma: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/016-figma.png" alt="Figma" style="width: 100%; height: 100%; object-fit: contain;" />',
      upwork: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/015-upwork.png" alt="Upwork" style="width: 100%; height: 100%; object-fit: contain;" />',
      website: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/internet.png" alt="Website" style="width: 100%; height: 100%; object-fit: contain;" />',
      email: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/019-mail.png" alt="Email" style="width: 100%; height: 100%; object-fit: contain;" />',
      phone: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/telephone.png" alt="Telephone" style="width: 100%; height: 100%; object-fit: contain;" />',
      custom: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/link.png" alt="Link" style="width: 100%; height: 100%; object-fit: contain;" />'
    };
    return icons[channel.type] || '🔗';
  }

  function getChannelColor(type) {
    var colors = {
      whatsapp: '#25D366',
      telegram: '#0088cc',
      instagram: '#E4405F',
      messenger: '#00B2FF',
      viber: '#665CAC',
      discord: '#5865F2',
      tiktok: '#000000',
      youtube: '#FF0000',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      github: '#333333',
      behance: '#1769FF',
      dribble: '#EA4C89',
      figma: '#F24E1E',
      upwork: '#14A800',
      website: '#6B7280',
      email: '#EA4335',
      phone: '#6B7280',
      custom: '#6B7280'
    };
    return colors[type] || '#6B7280';
  }
  
  console.log('Modern floating widget loading with channels:', {{CHANNELS_DATA}});
  
  var channelsData = {{CHANNELS_DATA}};
  var hoverTimeout;
  var isHoveringWidget = false;
  
  function generateChannelsHtml() {
    if (!channelsData || channelsData.length === 0) {
      return '';
    }
    
    var html = '';
    var allChannels = [];
    
    // Collect all individual channels and child channels
    for (var i = 0; i < channelsData.length; i++) {
      var channel = channelsData[i];
      
      if (channel.childChannels && channel.childChannels.length > 0) {
        // Add parent channel first
        allChannels.push(channel);
        // Add all child channels
        for (var j = 0; j < channel.childChannels.length; j++) {
          allChannels.push(channel.childChannels[j]);
        }
      } else if (!channel.parentId) {
        // Add individual channels (not child channels)
        allChannels.push(channel);
      }
    }
    
    for (var i = 0; i < allChannels.length; i++) {
      var channel = allChannels[i];
      var channelUrl = getChannelUrl(channel);
      var channelIcon = getChannelIcon(channel);
      var channelColor = getChannelColor(channel.type);
      
      html += '<a href="' + channelUrl + '" target="_blank" class="modern-floating-channel-item" style="background-color: ' + channelColor + ';" data-index="' + i + '">';
      html += channelIcon;
      html += '</a>';
    }
    
    return html;
  }
  
  function showChannels() {
    var channelsContainer = document.querySelector('#modern-floating-channels-container');
    if (channelsContainer) {
      clearTimeout(hoverTimeout);
      isHoveringWidget = true;
      
      channelsContainer.style.display = 'block';
      channelsContainer.classList.add('show');
      
      setTimeout(function() {
        channelsContainer.style.opacity = '1';
        channelsContainer.style.transform = 'translateY(0)';
        
        // Animate channels from bottom to top with delay
        var channels = document.querySelectorAll('.modern-floating-channel-item');
        for (var i = 0; i < channels.length; i++) {
          (function(index, channel) {
            setTimeout(function() {
              channel.classList.add('show');
            }, index * 100);
          })(i, channels[i]);
        }
      }, 50);
    }
  }
  
  function hideChannels() {
    if (!isHoveringWidget) return;
    
    var channelsContainer = document.querySelector('#modern-floating-channels-container');
    if (channelsContainer) {
      isHoveringWidget = false;
      
      var channels = document.querySelectorAll('.modern-floating-channel-item');
      for (var i = 0; i < channels.length; i++) {
        channels[i].classList.remove('show');
      }
      
      setTimeout(function() {
        channelsContainer.style.opacity = '0';
        channelsContainer.style.transform = 'translateY(20px)';
        channelsContainer.classList.remove('show');
        
        setTimeout(function() {
          if (!isHoveringWidget) {
            channelsContainer.style.display = 'none';
          }
        }, 300);
      }, 100);
    }
  }
  
  function showVideo() {
    var video = document.querySelector('.hiclient-video');
    if (video) {
      clearTimeout(hoverTimeout);
      isHoveringWidget = true;
      video.classList.add('show');
    }
  }
  
  function hideVideo() {
    if (!isHoveringWidget) return;
    
    var video = document.querySelector('.hiclient-video');
    if (video) {
      video.classList.remove('show');
    }
  }
  
  function showTooltip() {
    // Remove tooltip functionality - user requested to remove "tooltip" text
    return;
  }
  
  function hideTooltip() {
    // Remove tooltip functionality - user requested to remove "tooltip" text
    return;
  }
  
  function initWidget() {
    console.log('Initializing modern floating widget...');
    
    var channelsContainer = document.querySelector('#modern-floating-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Modern floating channels HTML generated and inserted');
    }
    
    var button = document.querySelector('#modern-floating-widget-button');
    var widgetContainer = document.querySelector('#modern-floating-widget-relative-container');
    var video = document.querySelector('.hiclient-video');
    
    if (!button || !widgetContainer) {
      console.error('Missing modern floating widget elements:', { button: !!button, widgetContainer: !!widgetContainer });
      return;
    }
    
    console.log('Modern floating widget elements found:', { button: !!button, widgetContainer: !!widgetContainer, video: !!video });
    
    // Show channels and video on button hover
    button.addEventListener('mouseenter', function() {
      showChannels();
      if (video) showVideo();
    });
    
    // Hide channels and video when leaving the entire widget area
    widgetContainer.addEventListener('mouseleave', function(e) {
      // Check if we're moving to a child element
      var channelsContainerEl = document.querySelector('#modern-floating-channels-container');
      if (channelsContainerEl && channelsContainerEl.contains(e.relatedTarget)) {
        return; // Don't hide if moving to channels container
      }
      if (video && video.contains(e.relatedTarget)) {
        return; // Don't hide if moving to video
      }
      
      hoverTimeout = setTimeout(function() {
        hideChannels();
        if (video) hideVideo();
      }, 200);
    });
    
    // Keep channels visible when hovering over them
    var channelsContainerEl = document.querySelector('#modern-floating-channels-container');
    if (channelsContainerEl) {
      channelsContainerEl.addEventListener('mouseenter', function() {
        clearTimeout(hoverTimeout);
        isHoveringWidget = true;
      });
      
      channelsContainerEl.addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(function() {
          hideChannels();
          if (video) hideVideo();
        }, 200);
      });
    }
    
    // Keep video visible when hovering over it
    if (video) {
      video.addEventListener('mouseenter', function() {
        clearTimeout(hoverTimeout);
        isHoveringWidget = true;
      });
      
      video.addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(function() {
          hideChannels();
          hideVideo();
        }, 200);
      });
    }
    
    console.log('Modern floating widget initialized successfully');
  }
  
  window.openChannel = function(url) {
    window.open(url, '_blank');
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    setTimeout(initWidget, 100);
  }
`;

export const modernFloatingTemplate: WidgetTemplate = {
  id: 'modern-floating',
  name: 'Modern Floating Template',
  description: 'Modern floating widget with icons appearing on hover from bottom to top',
  html: modernFloatingHtmlTemplate,
  css: modernFloatingCssStyles,
  js: modernFloatingJavaScriptLogic
};

export const getModernFloatingTemplate = () => modernFloatingTemplate;
