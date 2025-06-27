import type { WidgetTemplate } from './template-types.ts'
import { defaultHtmlTemplate } from './templates/default/html-template.ts'
import { defaultCssStyles } from './templates/default/css-styles.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from './templates/default/utility-functions.ts'

// JavaScript logic with proper utility injection
const defaultJavaScriptLogic = `
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
    var icons = {
      whatsapp: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>',
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
  
  console.log('Widget loading with channels:', {{CHANNELS_DATA}});
  
  var channelsData = {{CHANNELS_DATA}};
  
  function openChannel(url) {
    window.open(url, '_blank');
  }
  
  function toggleDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    var arrow = document.querySelector('[data-dropdown="' + dropdownId + '"]');
    
    if (!dropdown || !arrow) return;
    
    var allDropdowns = document.querySelectorAll('.dropdown');
    var allArrows = document.querySelectorAll('.dropdown-arrow');
    
    allDropdowns.forEach(function(d) {
      if (d.id !== dropdownId) {
        d.classList.remove('show');
      }
    });
    
    allArrows.forEach(function(a) {
      if (a !== arrow) {
        a.classList.remove('rotated');
      }
    });
    
    dropdown.classList.toggle('show');
    arrow.classList.toggle('rotated');
  }
  
  function generateChannelsHtml() {
    if (!channelsData || channelsData.length === 0) {
      var emptyState = document.querySelector('.lovable-empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      return '';
    }
    
    var html = '';
    
    for (var i = 0; i < channelsData.length; i++) {
      var channel = channelsData[i];
      var channelUrl = getChannelUrl(channel);
      var channelIcon = getChannelIcon(channel);
      var channelColor = getChannelColor(channel.type);
      
      if (channel.childChannels && channel.childChannels.length > 0) {
        var dropdownId = 'dropdown-' + channel.id;
        
        html += '<div class="parent-channel-wrapper">';
        html += '<div style="display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 12px; background: white; transition: all 0.3s ease;">';
        
        // Changed to a div instead of an anchor to prevent direct navigation
        html += '<div class="parent-channel" style="border: none; margin: 0; flex: 1; cursor: pointer;" onclick="toggleDropdown(\\'' + dropdownId + '\\')">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</div>';
        
        html += '<button class="dropdown-toggle" onclick="toggleDropdown(\\'' + dropdownId + '\\')">';
        html += '<svg class="dropdown-arrow" data-dropdown="' + dropdownId + '" viewBox="0 0 24 24" fill="currentColor">';
        html += '<path d="M7 10l5 5 5-5z"/>';
        html += '</svg>';
        html += '</button>';
        html += '<div class="child-count">' + (channel.childChannels.length + 1) + '</div>';
        html += '</div>';
        html += '<div class="dropdown" id="' + dropdownId + '">';
        
        // Add the parent channel as the first item in the dropdown
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="dropdown-item">';
        html += '<div class="dropdown-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="dropdown-info">';
        html += '<div class="dropdown-label">' + escapeHtml(channel.label) + ' (Primary)</div>';
        html += '<div class="dropdown-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</a>';
        
        for (var j = 0; j < channel.childChannels.length; j++) {
          var childChannel = channel.childChannels[j];
          var childUrl = getChannelUrl(childChannel);
          var childIcon = getChannelIcon(childChannel);
          var childColor = getChannelColor(childChannel.type);
          
          html += '<a href="' + escapeHtml(childUrl) + '" target="_blank" class="dropdown-item">';
          html += '<div class="dropdown-icon" style="background: ' + childColor + ';">' + childIcon + '</div>';
          html += '<div class="dropdown-info">';
          html += '<div class="dropdown-label">' + escapeHtml(childChannel.label) + '</div>';
          html += '<div class="dropdown-value">' + escapeHtml(childChannel.value) + '</div>';
          html += '</div>';
          html += '</a>';
        }
        
        html += '</div>';
        html += '</div>';
      } else {
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="channel-item">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '<div class="channel-arrow">→</div>';
        html += '</a>';
      }
    }
    
    return html;
  }
  
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  function initWidget() {
    console.log('Initializing widget...');
    
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Channels HTML generated and inserted');
    }
    
    var button = document.querySelector('#lovable-widget-button');
    var modal = document.querySelector('#lovable-widget-modal');
    var modalContent = document.querySelector('#lovable-modal-content');
    var tooltip = document.querySelector('#lovable-widget-tooltip');
    var closeBtn = document.querySelector('#lovable-widget-close');
    
    if (!button || !modal) {
      console.error('Missing widget elements:', { button: !!button, modal: !!modal });
      return;
    }
    
    console.log('Widget elements found:', { button: !!button, modal: !!modal, closeBtn: !!closeBtn });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked, showing modal');
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      
      if (modalContent) {
        setTimeout(function() {
          modalContent.style.transform = 'translateY(0)';
        }, 50);
      }
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        closeModal();
      });
    }
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        console.log('Modal backdrop clicked');
        closeModal();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        console.log('ESC key pressed');
        closeModal();
      }
    });
    
    function closeModal() {
      if (modalContent) {
        modalContent.style.transform = 'translateY(20px)';
      }
      
      setTimeout(function() {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        
        var allDropdowns = document.querySelectorAll('.dropdown');
        var allArrows = document.querySelectorAll('.dropdown-arrow');
        allDropdowns.forEach(function(dropdown) {
          dropdown.classList.remove('show');
        });
        allArrows.forEach(function(arrow) {
          arrow.classList.remove('rotated');
        });
      }, 100);
    }
    
    if (tooltip && button) {
      if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
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
      } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      }
    }
    
    console.log('Widget initialized successfully');
  }
  
  window.refreshWidget = function() {
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
    }
  };
  
  window.openChannel = openChannel;
  window.toggleDropdown = toggleDropdown;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    setTimeout(initWidget, 100);
  }
`;

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template', 
  description: 'Modern and clean floating widget with green accent',
  html: defaultHtmlTemplate,
  css: defaultCssStyles,
  js: defaultJavaScriptLogic
};

export const getDefaultTemplate = () => defaultTemplate;