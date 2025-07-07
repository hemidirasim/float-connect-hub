
export const defaultCssStyles = `
  #lovable-widget-button {
    border-radius: 50%;
    background-color: {{BUTTON_COLOR}};
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease, background 0.3s ease;
    color: white;
    {{BUTTON_OFFSET_STYLE}}
  }
  
  #lovable-widget-button:hover {
    box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    /* Remove transform on hover to prevent movement */
  }
  
  #lovable-widget-tooltip {
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
  
  #lovable-widget-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100000;
    display: flex;
    {{MODAL_ALIGNMENT}}
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  
  #lovable-modal-content {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: {{WIDGET_WIDTH}}px;
    height: {{WIDGET_HEIGHT}}px;
    {{MODAL_CONTENT_POSITION}}
    overflow-y: auto;
    position: relative;
    transition: transform 0.3s ease;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .hiclient-video-player {
    object-fit: {{VIDEO_OBJECT_FIT}};
  }
  
  #lovable-modal-header {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    text-align: center;
    line-height: 1.4;
    padding-right: 40px;
  }
  
  #lovable-widget-close {
    position: absolute;
    top: 16px;
    right: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    color: #9ca3af;
    border: none;
    background: transparent;
    border-radius: 50%;
    transition: all 0.2s ease;
    font-weight: 300;
  }
  
  #lovable-widget-close:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    transform: rotate(90deg);
  }
  
  #lovable-widget-channels {
    max-height: 300px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .channel-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 10px;
    border: 1px solid #e2e8f0;
    background: white;
    text-decoration: none;
    color: #334155;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    border-radius: 12px;
    cursor: pointer;
  }
  
  .channel-item:hover {
    border-color: #22c55e;
    background: #f0fdf4;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
  }
  
  .channel-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    color: white;
  }
  
  .channel-info {
    flex: 1;
    min-width: 0;
  }
  
  .channel-label {
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    margin: 0 0 4px 0;
    line-height: 1.3;
  }
  
  .channel-value {
    font-size: 14px;
    color: #64748b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    line-height: 1.3;
  }
  
  .channel-arrow {
    width: 20px;
    height: 20px;
    color: #94a3b8;
    flex-shrink: 0;
    transition: all 0.3s ease;
    font-size: 16px;
  }
  
  .channel-item:hover .channel-arrow {
    color: #22c55e;
    transform: translateX(4px);
  }

  /* Parent channel with dropdown */
  .parent-channel-wrapper {
    position: relative;
    margin-bottom: 12px;
  }
  
  .parent-channel {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 10px;
    border: 1px solid #e2e8f0;
    background: white;
    text-decoration: none;
    color: #334155;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
  }
  
  .parent-channel:hover {
    border-color: #22c55e;
    background: #f0fdf4;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
  }
  
  .dropdown-toggle {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin-left: auto;
  }
  
  .dropdown-toggle:hover {
    background: rgba(34, 197, 94, 0.1);
  }
  
  .dropdown-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    color: #64748b;
  }
  
  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .child-count {
    position: absolute;
    top: -8px;
    right: 8px;
    background: #3b82f6;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    line-height: 1.2;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    z-index: 10;
  }
  
  /* Dropdown */
  .dropdown {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 8px;
    border: 1px solid #e9ecef;
  }
  
  .dropdown.show {
    max-height: 300px;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s ease;
    border-bottom: 1px solid #e9ecef;
    font-size: 14px;
  }
  
  .dropdown-item:last-child {
    border-bottom: none;
  }
  
  .dropdown-item:hover {
    background: #e9ecef;
    color: #1f2937;
  }
  
  .dropdown-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 14px;
    flex-shrink: 0;
    color: white;
  }
  
  .dropdown-info {
    flex: 1;
    min-width: 0;
  }
  
  .dropdown-label {
    font-weight: 500;
    color: #1f2937;
    margin: 0 0 2px 0;
    line-height: 1.3;
  }
  
  .dropdown-value {
    font-size: 12px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    line-height: 1.3;
  }

  /* Desktop responsive */
  @media (min-width: 769px) {
    #lovable-modal-content {
      max-width: 420px;
      max-height: 650px;
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    #lovable-modal-content {
      width: 95%;
      height: 90%;
      max-width: 380px;
      max-height: 600px;
    }
    
    .dropdown {
      margin-top: 5px;
    }
  }
`;
