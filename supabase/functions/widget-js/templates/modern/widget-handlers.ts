
export function initializeTooltip(tooltip: HTMLElement, button: HTMLElement, config: any) {
  if (!tooltip || !button) return;
  
  if (config && config.tooltipDisplay === 'hover') {
    button.addEventListener("mouseenter", function() {
      tooltip.classList.add("show");
      tooltip.classList.remove("hide");
      tooltip.style.display = 'block';
    });
    button.addEventListener("mouseleave", function() {
      tooltip.classList.remove("show");
      tooltip.classList.add("hide");
    });
  } else if (config && config.tooltipDisplay === 'always') {
    tooltip.style.display = 'block';
    tooltip.classList.add("show");
  }
}

export function initializeModal(button: HTMLElement, modal: HTMLElement, closeBtn: HTMLElement, video: HTMLVideoElement | null) {
  if (!button || !modal) return;
  
  button.addEventListener("click", function(e) {
    e.preventDefault();
    modal.classList.add("show");
    document.body.style.overflow = 'hidden';
    
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(function(error) {
        console.log("Video autoplay blocked:", error);
      });
    }
  });
  
  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = '';
    if (video) {
      video.muted = true;
      video.pause();
    }
  }
  
  if (closeBtn) {
    closeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }
  
  modal.addEventListener("click", function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
}
