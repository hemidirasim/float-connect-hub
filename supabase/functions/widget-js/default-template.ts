
import type { WidgetTemplate } from './template-types.ts'
import { defaultHtmlTemplate } from './templates/default/html-template.ts'
import { defaultCssStyles } from './templates/default/css-styles.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from './templates/default/utility-functions.ts'

// JavaScript logic with proper utility injection and fixed string escaping
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
      whatsapp: '<img src="/social-icons/007-social.png" alt="Whatsapp" className="w-8 h-8" />',
      telegram: '<img src="/social-icons/006-telegram.png" alt="Telegram" className="w-8 h-8" />',
      instagram: '<img src="/social-icons/002-instagram.png" alt="Instagram" className="w-8 h-8" />',
      messenger: '<img src="/social-icons/018-messenger.png" alt="Messenger" className="w-8 h-8" />',
      viber: '<img src="/social-icons/011-viber.png" alt="Viber" className="w-8 h-8" />',
      discord: '<img src="/social-icons/017-discord.png" alt="Discord" className="w-8 h-8" />',
      tiktok: '<img src="/social-icons/004-tiktok.png" alt="Tiktok" className="w-8 h-8" />',
      youtube: '<img src="/social-icons/008-youtube.png" alt="Youtube" className="w-8 h-8" />',
      facebook: '<img src="/social-icons/003-facebook.png" alt="Facebook" className="w-8 h-8" />',
      twitter: '<img src="/social-icons/twitter.png" alt="X" className="w-8 h-8" />',
      linkedin: '<img src="/social-icons/005-linkedin.png" alt="Linkedin" className="w-8 h-8" />',
      github: '<img src="/social-icons/012-github.png" alt="Github" className="w-8 h-8" />',
      behance: '<img src="/social-icons/014-behance.png" alt="Behance" className="w-8 h-8" />',
      dribble: '<img src="/social-icons/013-dribble.png" alt="Dribble" className="w-8 h-8" />',
      figma: '<img src="/social-icons/016-figma.png" alt="Figma" className="w-8 h-8" />',
      upwork: '<img src="/social-icons/015-upwork.png" alt="Upwork" className="w-8 h-8" />',
      website: '<img src="/social-icons/internet.png" alt="Website" className="w-8 h-8" />',
      email: '<img src="/social-icons/019-mail.png" alt="Email" className="w-8 h-8" />',
      phone: '<img src="/social-icons/telephone.png" alt="Telephone" className="w-8 h-8" />',
      custom: '<img src="/social-icons/link.png" alt="Link" className="w-8 h-8" />'
    };
    return icons[channel.type] || '🔗';
  }

  function getChannelColor(type) {
    var colors = {
      phone: '#ffffff',
      custom: '#ffffff'
    };
    return colors[type] || '#ffffff';
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
        html += '<div class="parent-channel" style="border: none; margin: 0; flex: 1; cursor: pointer;" onclick="toggleDropdown(' + "'" + dropdownId + "'" + ')">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</div>';
        
        html += '<button class="dropdown-toggle" onclick="toggleDropdown(' + "'" + dropdownId + "'" + ')">';
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
  
  function playVideo() {
    try {
      console.log('playVideo function called');
      var videos = document.querySelectorAll('.hiclient-video-player');
      console.log('Found videos:', videos.length);
      
      if (videos.length > 0) {
        videos.forEach(function(video, index) {
          console.log('Processing video', index, 'with src:', video.src);
          
          if (video.tagName === 'VIDEO') {
            // Handle HTML5 video elements
            if (video.src && video.src !== '') {
              video.currentTime = 0;
              // Enable sound for video playback
              
              var playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.then(function() {
                  console.log('Video', index, 'started playing successfully with sound');
                }).catch(function(error) {
                  console.log('Video', index, 'autoplay failed:', error);
                  // Force play after small delay
                  setTimeout(function() {
                    try {
                      video.play().then(function() {
                        console.log('Video', index, 'started on retry with sound');
                      }).catch(function(retryError) {
                        console.log('Video', index, 'retry failed:', retryError);
                      });
                    } catch (e) {
                      console.log('Video', index, 'retry exception:', e);
                    }
                  }, 500);
                });
              }
            } else {
              console.log('Video', index, 'has no valid src');
            }
          } else if (video.tagName === 'IFRAME') {
            // Handle YouTube iframe videos
            console.log('Processing YouTube iframe', index);
            var currentSrc = video.src;
            // Add autoplay parameter to YouTube iframe when modal opens
            if (currentSrc && !currentSrc.includes('autoplay=1')) {
              var separator = currentSrc.includes('?') ? '&' : '?';
              video.src = currentSrc + separator + 'autoplay=1';
              console.log('YouTube iframe', index, 'autoplay enabled');
            }
          }
        });
      } else {
        console.log('No video elements found with class hiclient-video-player');
      }
    } catch (error) {
      console.log('Error in playVideo function:', error);
    }
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
      
      // Start video playback when modal opens - with delay to ensure DOM is ready
      setTimeout(function() {
        console.log('Attempting to play video after modal open');
        playVideo();
      }, 300);
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
      // Pause all videos when modal closes and reset YouTube iframes
      try {
        var videos = document.querySelectorAll('.hiclient-video-player');
        videos.forEach(function(video) {
          if (video.tagName === 'VIDEO' && !video.paused) {
            video.pause();
            console.log('Video paused');
          } else if (video.tagName === 'IFRAME') {
            // Remove autoplay from YouTube iframe when modal closes
            var currentSrc = video.src;
            if (currentSrc && currentSrc.includes('autoplay=1')) {
              video.src = currentSrc.replace(/[?&]autoplay=1/, '').replace(/autoplay=1[&]?/, '');
              console.log('YouTube iframe autoplay disabled');
            }
          }
        });
      } catch (error) {
        console.log('Error pausing videos:', error);
      }
      
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
    
    // Only preload video metadata on widget init, do NOT start playing
    setTimeout(function() {
      var videos = document.querySelectorAll('.hiclient-video-player');
      if (videos.length > 0) {
        console.log('Preloading', videos.length, 'videos metadata');
        videos.forEach(function(video) {
          if (video.tagName === 'VIDEO') {
            video.preload = 'metadata'; // Only preload metadata, not full video
          }
        });
      }
    }, 100);
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
  window.playVideo = playVideo;
  
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
