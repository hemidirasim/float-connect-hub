
export const defaultJavaScriptLogic = `
  // Import utility functions at the top
  ${getChannelUrl.toString()}
  ${getChannelIcon.toString()}
  ${getChannelColor.toString()}
  
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
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="parent-channel" style="border: none; margin: 0; flex: 1;">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</a>';
        html += '<button class="dropdown-toggle" onclick="toggleDropdown(\'' + dropdownId + '\')">';
        html += '<svg class="dropdown-arrow" data-dropdown="' + dropdownId + '" viewBox="0 0 24 24" fill="currentColor">';
        html += '<path d="M7 10l5 5 5-5z"/>';
        html += '</svg>';
        html += '</button>';
        html += '<div class="child-count">' + (channel.childChannels.length + 1) + '</div>';
        html += '</div>';
        html += '<div class="dropdown" id="' + dropdownId + '">';
        
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
      .replace(/'/g, '&#x27;');
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
