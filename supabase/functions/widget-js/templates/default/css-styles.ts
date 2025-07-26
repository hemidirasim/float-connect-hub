
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
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 4px;
  }
  
  .channel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    text-decoration: none;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    border-radius: 25px;
    cursor: pointer;
    overflow: hidden;
    min-height: 50px;
    text-align: center;
    font-size: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .channel-item:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .channel-item.whatsapp {
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  }
  
  .channel-item.telegram {
    background: linear-gradient(135deg, #0088cc 0%, #005a9e 100%);
  }
  
  .channel-item.instagram {
    background: linear-gradient(135deg, #e4405f 0%, #833ab4 50%, #f56040 100%);
  }
  
  .channel-item.messenger {
    background: linear-gradient(135deg, #006aff 0%, #0084ff 100%);
  }
  
  .channel-item.viber {
    background: linear-gradient(135deg, #665cac 0%, #59519c 100%);
  }
  
  .channel-item.discord {
    background: linear-gradient(135deg, #7289da 0%, #5865f2 100%);
  }
  
  .channel-item.tiktok {
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
  }
  
  .channel-item.youtube {
    background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  }
  
  .channel-item.facebook {
    background: linear-gradient(135deg, #1877f2 0%, #166fe5 100%);
  }
  
  .channel-item.twitter {
    background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
  }
  
  .channel-item.linkedin {
    background: linear-gradient(135deg, #0077b5 0%, #005885 100%);
  }
  
  .channel-item.github {
    background: linear-gradient(135deg, #333333 0%, #24292e 100%);
  }
  
  .channel-item.website {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  .channel-item.email {
    background: linear-gradient(135deg, #ea4335 0%, #d33b2c 100%);
  }
  
  .channel-item.phone {
    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  }
  
  .channel-item.custom {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  .channel-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    color: white;
  }
  
  .channel-info {
    display: none;
  }
  
  .channel-label {
    font-weight: 600;
    font-size: 14px;
    color: white;
    margin: 0;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .channel-value {
    display: none;
  }
  
  .channel-arrow {
    display: none;
  }

  /* Parent channel with dropdown - also styled as buttons */
  .parent-channel-wrapper {
    position: relative;
    margin-bottom: 16px;
    grid-column: span 2;
  }
  
  .parent-channel {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    text-decoration: none;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 25px;
    cursor: pointer;
    width: 100%;
    position: relative;
    overflow: hidden;
    min-height: 50px;
    font-size: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .parent-channel:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
    margin-left: 8px;
  }
  
  .dropdown-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dropdown-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    color: white;
  }
  
  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .child-count {
    position: absolute;
    top: -8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    line-height: 1.2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
  
  /* Dropdown - keep similar but smaller buttons */
  .dropdown {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    margin-top: 12px;
    border: 1px solid rgba(226, 232, 240, 0.5);
    padding: 0 8px;
  }
  
  .dropdown.show {
    max-height: 320px;
    padding: 12px 8px;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 8px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
    min-height: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-item:last-child {
    margin-bottom: 0;
  }
  
  .dropdown-item:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dropdown-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    color: white;
  }
  
  .dropdown-info {
    display: none;
  }
  
  .dropdown-label {
    font-weight: 600;
    color: white;
    margin: 0;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-value {
    display: none;
  }

  /* Desktop responsive */
  @media (min-width: 769px) {
    #lovable-modal-content {
      max-width: 440px;
      max-height: 680px;
    }
    
    #lovable-widget-channels {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
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
    
    #lovable-widget-channels {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    
    .channel-item {
      padding: 14px 10px;
      min-height: 45px;
      font-size: 13px;
    }
    
    .parent-channel {
      padding: 14px 10px;
      min-height: 45px;
      font-size: 13px;
    }
    
    .dropdown {
      margin-top: 8px;
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
