
export const defaultCssStyles = `
  #lovable-widget-button {
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: white;
    backdrop-filter: blur(10px);
    {{BUTTON_OFFSET_STYLE}}
  }
  
  #lovable-widget-button:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  }
  
  #lovable-widget-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 100000;
    transition: all 0.3s ease;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    {{TOOLTIP_POSITION_STYLE}}
  }
  
  #lovable-widget-tooltip:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
  
  #lovable-widget-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    {{MODAL_ALIGNMENT}}
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: all 0.4s ease;
  }
  
  #lovable-modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 32px;
    border-radius: 24px;
    width: {{WIDGET_WIDTH}}px;
    height: {{WIDGET_HEIGHT}}px;
    {{MODAL_CONTENT_POSITION}}
    overflow-y: auto;
    position: relative;
    transition: all 0.4s ease;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .hiclient-video-player {
    width: 100%;
    border-radius: 16px;
    margin-bottom: 24px;
    object-fit: {{VIDEO_OBJECT_FIT}};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  #lovable-modal-header {
    margin: 0 0 24px 0;
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    text-align: center;
    line-height: 1.4;
    padding-right: 40px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  #lovable-widget-close {
    position: absolute;
    top: 20px;
    right: 24px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    color: #64748b;
    border: none;
    background: rgba(248, 250, 252, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    transition: all 0.3s ease;
    font-weight: 300;
  }
  
  #lovable-widget-close:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    transform: rotate(90deg) scale(1.1);
  }
  
  #lovable-widget-channels {
    max-height: 320px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .channel-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 16px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    text-decoration: none;
    color: #334155;
    font-weight: 600;
    transition: all 0.4s ease;
    position: relative;
    border-radius: 16px;
    cursor: pointer;
    overflow: hidden;
  }
  
  .channel-item:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .channel-item:hover:before {
    opacity: 1;
  }
  
  .channel-item:hover {
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2);
  }
  
  .channel-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
    color: white;
    position: relative;
    z-index: 2;
  }
  
  .channel-info {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 2;
  }
  
  .channel-label {
    font-weight: 700;
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
    font-weight: 500;
  }
  
  .channel-arrow {
    width: 24px;
    height: 24px;
    color: #94a3b8;
    flex-shrink: 0;
    transition: all 0.3s ease;
    font-size: 18px;
    position: relative;
    z-index: 2;
  }
  
  .channel-item:hover .channel-arrow {
    color: #3b82f6;
    transform: translateX(6px);
  }

  /* Parent channel with dropdown */
  .parent-channel-wrapper {
    position: relative;
    margin-bottom: 16px;
  }
  
  .parent-channel {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 16px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    text-decoration: none;
    color: #334155;
    font-weight: 600;
    transition: all 0.4s ease;
    border-radius: 16px;
    cursor: pointer;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .parent-channel:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .parent-channel:hover:before {
    opacity: 1;
  }
  
  .parent-channel:hover {
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2);
  }
  
  .dropdown-toggle {
    background: none;
    border: none;
    padding: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin-left: auto;
    position: relative;
    z-index: 2;
  }
  
  .dropdown-toggle:hover {
    background: rgba(59, 130, 246, 0.1);
  }
  
  .dropdown-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
    color: #64748b;
  }
  
  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .child-count {
    position: absolute;
    top: -10px;
    right: 12px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 12px;
    min-width: 20px;
    text-align: center;
    line-height: 1.2;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    z-index: 10;
  }
  
  /* Dropdown */
  .dropdown {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
    background: rgba(248, 250, 252, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    margin-top: 12px;
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  .dropdown.show {
    max-height: 320px;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    text-decoration: none;
    color: #374151;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(226, 232, 240, 0.3);
    font-size: 14px;
    font-weight: 500;
  }
  
  .dropdown-item:last-child {
    border-bottom: none;
  }
  
  .dropdown-item:hover {
    background: rgba(59, 130, 246, 0.05);
    color: #1f2937;
    transform: translateX(4px);
  }
  
  .dropdown-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 16px;
    flex-shrink: 0;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-info {
    flex: 1;
    min-width: 0;
  }
  
  .dropdown-label {
    font-weight: 600;
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
      max-width: 440px;
      max-height: 680px;
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    #lovable-modal-content {
      width: 95%;
      height: 90%;
      max-width: 400px;
      max-height: 620px;
      padding: 24px;
    }
    
    .dropdown {
      margin-top: 8px;
    }
    
    .channel-item {
      padding: 16px 12px;
    }
    
    .parent-channel {
      padding: 16px 12px;
    }
  }
  
  /* Powered by styles */
  #lovable-powered-by {
    text-align: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  #lovable-powered-by a {
    color: #94a3b8;
    font-size: 11px;
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  #lovable-powered-by a:hover {
    opacity: 1 !important;
    color: #64748b !important;
    transform: translateY(-1px);
  }
`;
