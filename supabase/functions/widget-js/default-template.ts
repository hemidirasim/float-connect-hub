import type { WidgetTemplate } from './template-types.ts';
import { defaultHtmlTemplate } from './templates/default/html-template.ts';
import { defaultCssStyles } from './templates/default/css-styles.ts';
import { getChannelUrl, getChannelIcon, getChannelColor } from './templates/default/utility-functions.ts';

// Kanallar üçün interfeys
interface Channel {
  id: string;
  type: string;
  label: string;
  value: string;
  displayMode?: string;
  childChannels?: Channel[];
}

// JavaScript məntiqi
const defaultJavaScriptLogic = (channelsData: Channel[], tooltipBehavior: string = 'hover') => `
  // HTML təhlükəsizliyi üçün funksiya
  function escapeHtml(text) {
    if (!text) return '';
    const htmlEscaper = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '''
    };
    return String(text).replace(/[&<>"']/g, match => htmlEscaper[match]);
  }

  // Kanal məlumatları
  const channelsData = ${JSON.stringify(channelsData)};
  console.log('Widget loading with channels:', channelsData);

  // Kanal açma funksiyası
  function openChannel(url) {
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to open channel:', error);
    }
  }

  // Dropdown açma/bağlama funksiyası
  function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = document.querySelector('[data-dropdown="' + dropdownId + '"]');
    
    if (!dropdown || !arrow) {
      console.warn('Dropdown or arrow not found for ID:', dropdownId);
      return;
    }
    
    const allDropdowns = document.querySelectorAll('.dropdown');
    const allArrows = document.querySelectorAll('.dropdown-arrow');
    
    allDropdowns.forEach(d => {
      if (d.id !== dropdownId) {
        d.classList.remove('show');
      }
    });
    
    allArrows.forEach(a => {
      if (a !== arrow) {
        a.classList.remove('rotated');
      }
    });
    
    dropdown.classList.toggle('show');
    arrow.classList.toggle('rotated');
  }

  // Kanallar üçün HTML generasiyası
  function generateChannelsHtml() {
    if (!channelsData || channelsData.length === 0) {
      const emptyState = document.querySelector('.lovable-empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      return '';
    }
    
    let html = '';
    
    for (let i = 0; i < channelsData.length; i++) {
      const channel = channelsData[i];
      const channelUrl = getChannelUrl(channel);
      const channelIcon = getChannelIcon(channel);
      const channelColor = getChannelColor(channel.type);
      
      if (channel.childChannels && channel.childChannels.length > 0) {
        const dropdownId = 'dropdown-' + channel.id;
        
        html += '<div class="parent-channel-wrapper">';
        html += '<div style="display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 12px; background: white; transition: all 0.3s ease;">';
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
        
        // Ana kanal dropdown-da birinci element kimi
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="dropdown-item">';
        html += '<div class="dropdown-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="dropdown-info">';
        html += '<div class="dropdown-label">' + escapeHtml(channel.label) + ' (Primary)</div>';
        html += '<div class="dropdown-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</a>';
        
        for (let j = 0; j < channel.childChannels.length; j++) {
          const childChannel = channel.childChannels[j];
          const childUrl = getChannelUrl(childChannel);
          const childIcon = getChannelIcon(childChannel);
          const childColor = getChannelColor(childChannel.type);
          
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

  // Vidjetin ilkinləşdirilməsi
  function initWidget() {
    console.log('Initializing widget...');
    
    const channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      const generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Channels HTML generated and inserted');
    } else {
      console.warn('Channels container not found');
    }
    
    const button = document.querySelector('#lovable-widget-button');
    const modal = document.querySelector('#lovable-widget-modal');
    const modalContent = document.querySelector('#lovable-modal-content');
    const tooltip = document.querySelector('#lovable-widget-tooltip');
    const closeBtn = document.querySelector('#lovable-widget-close');
    
    if (!button || !modal) {
      console.error('Missing widget elements:', { button: !!button, modal: !!modal });
      return;
    }
    
    console.log('Widget elements found:', { button: !!button, modal: !!modal, closeBtn: !!closeBtn });
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked, showing modal');
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      
      if (modalContent) {
        setTimeout(() => {
          modalContent.style.transform = 'translateY(0)';
        }, 50);
      }
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        closeModal();
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        console.log('Modal backdrop clicked');
        closeModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        console.log('ESC key pressed');
        closeModal();
      }
    });
    
    function closeModal() {
      if (modalContent) {
        modalContent.style.transform = 'translateY(20px)';
      }
      
      setTimeout(() => {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        
        const allDropdowns = document.querySelectorAll('.dropdown');
        const allArrows = document.querySelectorAll('.dropdown-arrow');
        allDropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
        allArrows.forEach(arrow => {
          arrow.classList.remove('rotated');
        });
      }, 100);
    }
    
    if (tooltip && button) {
      if ('${tooltipBehavior}' === 'hover') {
        button.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      } else if ('${tooltipBehavior}' === 'always') {
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      }
    }
    
    console.log('Widget initialized successfully');
  }

  // Vidjeti yeniləmə funksiyası
  window.refreshWidget = function() {
    const channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      const generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Widget refreshed');
    }
  };

  // Qlobal funksiyalar
  window.openChannel = openChannel;
  window.toggleDropdown = toggleDropdown;

  // Səhifə yüklənməsini gözlə
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    setTimeout(initWidget, 100);
  }
`;

// Şablon obyekti
export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template',
  description: 'Modern and clean floating widget with green accent',
  html: defaultHtmlTemplate,
  css: defaultCssStyles,
  js: defaultJavaScriptLogic
};

export const getDefaultTemplate = () => defaultTemplate;