
-- Fix the default template with proper JavaScript functionality
UPDATE public.widget_templates 
SET html_template = '<!-- Default HTML Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Bizimlə əlaqə saxlayın</div>
    <div class="hiclient-modal-close">×</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>',

js_template = '/* Default JS Template - Fixed JavaScript functionality */
console.log("Widget JavaScript loaded");

function initializeWidget() {
  console.log("Initializing widget...");
  
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  
  console.log("Found elements:", { button: !!button, modal: !!modal, tooltip: !!tooltip, closeBtn: !!closeBtn });
  
  if (button && modal) {
    // Button click handler
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Widget button clicked, showing modal");
      modal.classList.add("show");
    });
    
    // Close button handler
    if (closeBtn) {
      closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Close button clicked");
        modal.classList.remove("show");
      });
    }
    
    // Backdrop click handler
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        console.log("Backdrop clicked, closing modal");
        modal.classList.remove("show");
      }
    });
    
    // ESC key handler
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        console.log("ESC pressed, closing modal");
        modal.classList.remove("show");
      }
    });
  }
  
  // Tooltip hover effects
  if (tooltip && button) {
    button.addEventListener("mouseenter", function() {
      console.log("Button hover - showing tooltip");
      tooltip.classList.remove("hide");
      tooltip.classList.add("show");
    });
    
    button.addEventListener("mouseleave", function() {
      console.log("Button leave - hiding tooltip");
      tooltip.classList.remove("show");
      tooltip.classList.add("hide");
    });
  }
  
  // Global channel opener
  window.openChannel = function(url) {
    console.log("Opening channel:", url);
    window.open(url, "_blank");
  };
  
  console.log("Widget initialization complete");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}'

WHERE name = 'Default Template' AND is_default = true;
