
import type { WidgetTemplate } from '../template-types.ts'

const modernFloatingHtmlTemplate = `
<div id="modern-floating-widget-container" class="modern-floating-widget-container" data-position="{{POSITION}}" style="position: fixed; {{POSITION_STYLE}} bottom: 40px; z-index: 99999;">
  <div id="modern-floating-widget-relative-container" style="position: relative;">
    
    <!-- Powered by text -->
    <a href="https://hiclient.co" target="_blank" id="modern-floating-powered-by" style="position: absolute; right: calc(94% + 12px); top: 100%; transform: translateY(-50%); color: rgb(0, 0, 0); padding: 6px 10px; border-radius: 6px; font-size: 10px; white-space: nowrap; opacity: 0; visibility: hidden; transition: 0.3s; pointer-events: auto; display: none; text-decoration: none; cursor: pointer;">
      powered by hiclient.co
    </a>
    
    <!-- Channels container that appears on hover -->
    <div id="modern-floating-channels-container" style="position: absolute; {{POSITION_CHANNELS_STYLE}} bottom: {{CHANNEL_BOTTOM_OFFSET}}px; display: none; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
      <div id="modern-floating-channels"></div>
    </div>
    
    <button id="modern-floating-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background-color: {{BUTTON_COLOR}}; {{BUTTON_OFFSET_STYLE}}">
      <svg id="modern-floating-chat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      <svg id="modern-floating-close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: absolute; opacity: 0; transform: rotate(-90deg) scale(0.8);"><path d="m18 6-12 12M6 6l12 12"/></svg>
    </button>
  </div>
</div>
`;

const modernFloatingCssStyles = `
  #modern-floating-widget-button {
    border-radius: 50%;
    background: {{BUTTON_COLOR}};
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: white;
    {{BUTTON_OFFSET_STYLE}}
  }
  
  #modern-floating-widget-button:hover {
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
    transform: scale(1.1);
  }
  
  /* Button icons animation */
  #modern-floating-widget-button.channels-open #modern-floating-chat-icon {
    opacity: 0;
    transform: rotate(90deg) scale(0.8);
  }

  #modern-floating-widget-button.channels-open #modern-floating-close-icon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
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
    gap: 15px;
    align-items: center;
  }
  
  .modern-floating-channel-item {
    width: {{BUTTON_SIZE}}px;
    height: {{BUTTON_SIZE}}px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: all;
    opacity: 0;
    transform: translateY(20px);
    position: relative;
  }

  .modern-floating-channel-item .modern-floating-main-channel-tooltip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100002;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  /* Position main channel tooltips based on widget position */
  .modern-floating-widget-container[data-position="left"] .modern-floating-main-channel-tooltip {
    left: calc({{BUTTON_SIZE}}px + 15px);
  }

  .modern-floating-widget-container[data-position="left"] .modern-floating-main-channel-tooltip:before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.9);
  }

  .modern-floating-widget-container[data-position="right"] .modern-floating-main-channel-tooltip,
  .modern-floating-widget-container[data-position="center"] .modern-floating-main-channel-tooltip {
    right: calc({{BUTTON_SIZE}}px + 15px);
  }
  
  .modern-floating-widget-container[data-position="right"] .modern-floating-main-channel-tooltip:before,
  .modern-floating-widget-container[data-position="center"] .modern-floating-main-channel-tooltip:before {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.9);
  }

  .modern-floating-channel-item:hover .modern-floating-main-channel-tooltip {
    opacity: 1;
    visibility: visible;
  }
  
  .modern-floating-channel-item:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .modern-floating-channel-item.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .modern-floating-channel-item img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
  
  .modern-floating-channel-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    color: white;
    font-size: 12px;
    font-weight: bold;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .modern-floating-child-channels {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100001;
    pointer-events: none;
  }

  /* Position child channels based on widget position */
  .modern-floating-widget-container[data-position="left"] .modern-floating-child-channels {
    left: calc({{BUTTON_SIZE}}px + 15px);
  }

  .modern-floating-widget-container[data-position="right"] .modern-floating-child-channels,
  .modern-floating-widget-container[data-position="center"] .modern-floating-child-channels {
    right: calc({{BUTTON_SIZE}}px + 15px);
  }
  
  .modern-floating-child-channels.show {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }
  
  .modern-floating-child-channel-item {
    width: {{BUTTON_SIZE}}px;
    height: {{BUTTON_SIZE}}px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transform: translateY(20px);
  }
  
  .modern-floating-child-channel-item.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .modern-floating-child-channel-item:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .modern-floating-child-channel-item img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
  
  .modern-floating-child-channel-tooltip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100002;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  /* Position tooltips based on widget position */
  .modern-floating-widget-container[data-position="left"] .modern-floating-child-channel-tooltip {
    left: calc({{BUTTON_SIZE}}px + 15px);
  }

  .modern-floating-widget-container[data-position="left"] .modern-floating-child-channel-tooltip:before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.9);
  }

  .modern-floating-widget-container[data-position="right"] .modern-floating-child-channel-tooltip,
  .modern-floating-widget-container[data-position="center"] .modern-floating-child-channel-tooltip {
    right: calc({{BUTTON_SIZE}}px + 15px);
  }
  
  .modern-floating-widget-container[data-position="right"] .modern-floating-child-channel-tooltip:before,
  .modern-floating-widget-container[data-position="center"] .modern-floating-child-channel-tooltip:before {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.9);
  }
  
  .modern-floating-child-channel-item:hover .modern-floating-child-channel-tooltip {
    opacity: 1;
    visibility: visible;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    #modern-floating-channels {
      gap: 12px;
    }
    
    .modern-floating-widget-container[data-position="left"] .modern-floating-child-channels {
      left: calc({{BUTTON_SIZE}}px + 10px);
    }
    
    .modern-floating-widget-container[data-position="right"] .modern-floating-child-channels,
    .modern-floating-widget-container[data-position="center"] .modern-floating-child-channels {
      right: calc({{BUTTON_SIZE}}px + 10px);
    }
    
    .modern-floating-widget-container[data-position="left"] .modern-floating-child-channel-tooltip {
      left: calc({{BUTTON_SIZE}}px + 10px);
    }
    
    .modern-floating-widget-container[data-position="right"] .modern-floating-child-channel-tooltip,
    .modern-floating-widget-container[data-position="center"] .modern-floating-child-channel-tooltip {
      right: calc({{BUTTON_SIZE}}px + 10px);
    }
    
    .modern-floating-widget-container[data-position="left"] .modern-floating-main-channel-tooltip {
      left: calc({{BUTTON_SIZE}}px + 10px);
    }
    
    .modern-floating-widget-container[data-position="right"] .modern-floating-main-channel-tooltip,
    .modern-floating-widget-container[data-position="center"] .modern-floating-main-channel-tooltip {
      right: calc({{BUTTON_SIZE}}px + 10px);
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
      return '<img src="' + channel.customIcon + '" alt="' + (channel.label || 'Custom') + '" />';
    }
    
    var icons = {
      whatsapp: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/007-social.png" alt="Whatsapp" />',
      telegram: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/006-telegram.png" alt="Telegram" />',
      instagram: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/002-instagram.png" alt="Instagram" />',
      messenger: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/018-messenger.png" alt="Messenger" />',
      viber: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/011-viber.png" alt="Viber" />',
      discord: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/017-discord.png" alt="Discord" />',
      tiktok: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/004-tiktok.png" alt="Tiktok" />',
      youtube: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/008-youtube.png" alt="Youtube" />',
      facebook: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/003-facebook.png" alt="Facebook" />',
      twitter: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/twitter.png" alt="X" />',
      linkedin: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/005-linkedin.png" alt="Linkedin" />',
      github: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/012-github.png" alt="Github" />',
      behance: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/014-behance.png" alt="Behance" />',
      dribble: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/013-dribble.png" alt="Dribble" />',
      figma: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/016-figma.png" alt="Figma" />',
      upwork: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/015-upwork.png" alt="Upwork" />',
      website: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/internet.png" alt="Website" />',
      email: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/019-mail.png" alt="Email" />',
      phone: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/telephone.png" alt="Telephone" />',
      custom: '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/link.png" alt="Link" />'
    };
    return icons[channel.type] || '<img src="https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/link.png" alt="Link" />';
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
  var currentChildChannels = null;
  
  function generateChildChannelsHtml(channel, childChannels) {
    var html = '<div class="modern-floating-child-channels">';
    
    // Əvvəlcə əsas kanalı əlavə et
    var mainChannelUrl = getChannelUrl(channel);
    var mainChannelIcon = getChannelIcon(channel);
    var mainChannelColor = getChannelColor(channel.type);
    
    html += '<a href="' + mainChannelUrl + '" target="_blank" class="modern-floating-child-channel-item" style="background-color: ' + mainChannelColor + ';">';
    html += mainChannelIcon;
    html += '<div class="modern-floating-child-channel-tooltip">' + (channel.label || channel.type) + '</div>';
    html += '</a>';
    
    // Sonra alt kanalları əlavə et (tersine çevir ki, altdan yuxarı sıralansınlar)
    if (childChannels && childChannels.length > 0) {
      for (var i = childChannels.length - 1; i >= 0; i--) {
        var child = childChannels[i];
        var channelUrl = getChannelUrl(child);
        var channelIcon = getChannelIcon(child);
        var channelColor = getChannelColor(child.type);
        
        html += '<a href="' + channelUrl + '" target="_blank" class="modern-floating-child-channel-item" style="background-color: ' + channelColor + ';" data-index="' + i + '">';
        html += channelIcon;
        html += '<div class="modern-floating-child-channel-tooltip">' + (child.label || child.type) + '</div>';
        html += '</a>';
      }
    }
    
    html += '</div>';
    return html;
  }
  
  function generateChannelsHtml() {
    if (!channelsData || channelsData.length === 0) {
      return '';
    }
    
    var html = '';
    
    for (var i = 0; i < channelsData.length; i++) {
      var channel = channelsData[i];
      var channelColor = getChannelColor(channel.type);
      var channelIcon = getChannelIcon(channel);
      
      // If channel has child channels, make it clickable to show child channels
      if (channel.childChannels && channel.childChannels.length > 0) {
        var totalChannelCount = 1 + channel.childChannels.length; // əsas kanal + alt kanallar
        html += '<div class="modern-floating-channel-item" style="background-color: ' + channelColor + '; cursor: pointer;" data-index="' + i + '" data-has-children="true">';
        html += channelIcon;
        html += '<div class="modern-floating-channel-count">' + totalChannelCount + '</div>';
        html += generateChildChannelsHtml(channel, channel.childChannels);
        html += '</div>';
      } else {
        var channelUrl = getChannelUrl(channel);
        html += '<a href="' + channelUrl + '" target="_blank" class="modern-floating-channel-item" style="background-color: ' + channelColor + ';" data-index="' + i + '">';
        html += channelIcon;
        html += '<div class="modern-floating-main-channel-tooltip">' + (channel.label || channel.type) + '</div>';
        html += '</a>';
      }
    }
    
    return html;
  }
  
  function showChildChannels(channelElement) {
    var childChannelsContainer = channelElement.querySelector('.modern-floating-child-channels');
    if (childChannelsContainer) {
      hideAllChildChannels(); // Hide any other open child channels
      currentChildChannels = childChannelsContainer;
      
      childChannelsContainer.classList.add('show');
      
      var childChannels = childChannelsContainer.querySelectorAll('.modern-floating-child-channel-item');
      for (var i = 0; i < childChannels.length; i++) {
        (function(index, child) {
          setTimeout(function() {
            child.classList.add('show');
          }, index * 100);
        })(i, childChannels[i]);
      }
    }
  }
  
  function hideAllChildChannels() {
    var allChildChannels = document.querySelectorAll('.modern-floating-child-channels');
    for (var i = 0; i < allChildChannels.length; i++) {
      var container = allChildChannels[i];
      var children = container.querySelectorAll('.modern-floating-child-channel-item');
      for (var j = 0; j < children.length; j++) {
        children[j].classList.remove('show');
      }
      container.classList.remove('show');
    }
    currentChildChannels = null;
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
      hideAllChildChannels(); // Hide any open child channels
      
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
  
  function isHoveringChildChannels(target) {
    return target && (
      target.classList.contains('modern-floating-child-channels') ||
      target.classList.contains('modern-floating-child-channel-item') ||
      target.closest('.modern-floating-child-channels')
    );
  }
  
  function initWidget() {
    console.log('Initializing modern floating widget...');
    
    var channelsContainer = document.querySelector('#modern-floating-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Modern floating channels HTML generated and inserted');
      
      // Add click event listeners to channels with children
      var channelsWithChildren = channelsContainer.querySelectorAll('[data-has-children="true"]');
      for (var i = 0; i < channelsWithChildren.length; i++) {
        channelsWithChildren[i].addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Channel with children clicked');
          showChildChannels(this);
        });
      }
    }
    
    var button = document.querySelector('#modern-floating-widget-button');
    var widgetContainer = document.querySelector('#modern-floating-widget-relative-container');
    
    if (!button || !widgetContainer) {
      console.error('Missing modern floating widget elements:', { button: !!button, widgetContainer: !!widgetContainer });
      return;
    }
    
    console.log('Modern floating widget elements found:', { button: !!button, widgetContainer: !!widgetContainer });
    
    // Show channels on button click only
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var channelsContainer = document.querySelector('#modern-floating-channels-container');
      var poweredByText = document.querySelector('#modern-floating-powered-by');
      
      if (channelsContainer) {
        var isVisible = channelsContainer.classList.contains('show');
        
        if (isVisible) {
          hideChannels();
          // Toggle button icons back
          button.classList.remove('channels-open');
          
          // Hide powered by text
          if (poweredByText) {
            poweredByText.style.display = 'none';
            poweredByText.style.opacity = '0';
            poweredByText.style.visibility = 'hidden';
          }
        } else {
          showChannels();
          // Toggle button icons with animation
          button.classList.add('channels-open');
          
          // Show powered by text
          if (poweredByText) {
            poweredByText.style.display = 'block';
            poweredByText.style.opacity = '1';
            poweredByText.style.visibility = 'visible';
          }
        }
      }
    });
    
    // Hide channels when clicking elsewhere
    document.addEventListener('click', function(e) {
      var channelsContainer = document.querySelector('#modern-floating-channels-container');
      var widgetContainer = document.querySelector('#modern-floating-widget-container');
      var poweredByText = document.querySelector('#modern-floating-powered-by');
      
      if (channelsContainer && widgetContainer && 
          !widgetContainer.contains(e.target) && 
          !channelsContainer.contains(e.target)) {
        hideChannels();
        // Toggle button icons back
        var button = document.querySelector('#modern-floating-widget-button');
        if (button) {
          button.classList.remove('channels-open');
        }
        
        // Hide powered by text
        if (poweredByText) {
          poweredByText.style.display = 'none';
          poweredByText.style.opacity = '0';
          poweredByText.style.visibility = 'hidden';
        }
      }
      
      if (currentChildChannels && !currentChildChannels.contains(e.target)) {
        hideAllChildChannels();
      }
    });
    
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
