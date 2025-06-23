
export function generateModernJavaScript(): string {
  return `
    // Modern Template - Hover Dropdown Behavior
    const modernWidget = document.querySelector('.hiclient-widget-container');
    const modernButton = document.querySelector('.hiclient-widget-button');
    const modernModal = document.querySelector('.hiclient-modal-backdrop');
    const modernClose = document.querySelector('.hiclient-modal-close');
    let isModalOpen = false;
    
    // Modern template uses CLICK to open modal (different from elegant)
    if (modernButton && modernModal) {
      modernButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isModalOpen = true;
        modernModal.style.display = 'flex';
        modernModal.style.opacity = '0';
        modernModal.style.transform = 'scale(0.9)';
        
        // Animate in
        requestAnimationFrame(() => {
          modernModal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          modernModal.style.opacity = '1';
          modernModal.style.transform = 'scale(1)';
        });
        
        console.log('Modern widget modal opened');
      });
    }
    
    // Close modal
    if (modernClose && modernModal) {
      modernClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModernModal();
      });
    }
    
    // Close on backdrop click
    if (modernModal) {
      modernModal.addEventListener('click', function(e) {
        if (e.target === modernModal) {
          closeModernModal();
        }
      });
    }
    
    function closeModernModal() {
      if (modernModal && isModalOpen) {
        modernModal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        modernModal.style.opacity = '0';
        modernModal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          modernModal.style.display = 'none';
          isModalOpen = false;
        }, 300);
        
        console.log('Modern widget modal closed');
      }
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isModalOpen) {
        closeModernModal();
      }
    });
    
    // Channel hover effects for modern template
    const modernChannels = document.querySelectorAll('.hiclient-channel-item');
    modernChannels.forEach(channel => {
      const btn = channel.querySelector('.hiclient-channel-btn');
      if (btn) {
        btn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px) scale(1.05)';
          this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        btn.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
          this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
      }
    });
    
    console.log('Modern template JavaScript loaded with click-to-open modal');
  `;
}
