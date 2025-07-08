export const darkUtilityFunctions = `/* Dark Theme JS */
console.log("Dark theme widget loaded with greeting:", '{{GREETING_MESSAGE}}');

function initializeWidget() {
  var button = document.getElementById("hiclient-widget-button");
  var modal = document.getElementById("hiclient-modal-backdrop");
  var tooltip = document.getElementById("hiclient-tooltip");
  var closeBtn = document.getElementById("hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsContainer = document.querySelector(".hiclient-channels-container");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
    video.currentTime = 0;
    // Preload video for better performance
    video.preload = 'auto';
  }
  
  // Show/hide empty state based on channels
  if (channelsContainer && emptyState) {
    var hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add("show");
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        // Ensure video is loaded before playing
        if (video.readyState >= 2) {
          video.play().catch(function(error) {
            console.log("Video play error:", error);
          });
        } else {
          video.addEventListener('canplay', function() {
            video.play().catch(function(error) {
              console.log("Video play error:", error);
            });
          }, { once: true });
        }
      }
    });
    
    function closeModal() {
      modal.classList.remove("show");
      if (video) {
        video.pause();
        video.muted = true;
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
  
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener("mouseenter", function() {
        tooltip.classList.remove("hide");
        tooltip.classList.add("show");
        tooltip.style.display = 'block';
      });
      
      button.addEventListener("mouseleave", function() {
        tooltip.classList.remove("show");
        tooltip.classList.add("hide");
        setTimeout(function() {
          if (tooltip.classList.contains("hide")) {
            tooltip.style.display = 'none';
          }
        }, 200);
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add("show");
    }
  }
  
  // Handle channel groups
  var groupTriggers = document.querySelectorAll('.hiclient-group-trigger');
  groupTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var dropdown = this.nextElementSibling;
      if (dropdown && dropdown.classList.contains('hiclient-group-dropdown')) {
        dropdown.classList.toggle('show');
      }
    });
  });
  
  window.openChannel = function(url) {
    window.open(url, "_blank");
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`;