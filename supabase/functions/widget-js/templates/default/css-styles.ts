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
  }
  
  /* Live Chat Button Section */
  .live-chat-section {
    margin: 16px 20px 20px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
    z-index: 10;
  }
  
  .live-chat-button {
    width: 100%;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    padding: 18px 28px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
    letter-spacing: -0.025em;
    position: relative;
    overflow: hidden;
  }
  
  .live-chat-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .live-chat-button:hover::before {
    left: 100%;
  }
  
  .live-chat-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }
  
  .live-chat-button:active {
    transform: translateY(-1px);
  }
  
  .live-chat-button svg {
    flex-shrink: 0;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  /* Live Chat Content */
  #lovable-livechat-content {
    display: none;
    padding: 0;
    height: 100%;
    background: white;
    border-radius: 0;
  }
  
  #lovable-livechat-header {
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    padding: 24px 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  #lovable-livechat-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  
  #lovable-livechat-back {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 10px 16px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  #lovable-livechat-back:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* Pre-chat Form */
  #lovable-prechat-form {
    padding: 32px 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    gap: 24px;
    min-height: 400px;
    justify-content: center;
  }
  
  .prechat-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    text-align: center;
    line-height: 1.4;
  }
  
  .prechat-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
  }
  
  .prechat-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .prechat-field label {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }
  
  .prechat-field input {
    padding: 16px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    font-weight: 400;
  }
  
  .prechat-field input:focus {
    outline: none;
    border-color: {{LIVE_CHAT_COLOR}};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  .prechat-field input::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  .prechat-submit-btn {
    padding: 18px 32px;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 16px;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    letter-spacing: -0.025em;
    position: relative;
    overflow: hidden;
  }
  
  .prechat-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }
  
  .prechat-submit-btn:active {
    transform: translateY(0);
  }

  /* Chat Messages */
  #lovable-livechat-messages {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 400px;
  }
  
  .chat-message {
    display: flex;
    margin-bottom: 16px;
    animation: fadeInUp 0.4s ease-out;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .agent-message {
    justify-content: flex-start;
  }
  
  .user-message {
    justify-content: flex-end;
  }
  
  .message-content {
    max-width: 75%;
    padding: 16px 20px;
    border-radius: 24px;
    font-size: 15px;
    line-height: 1.5;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    font-weight: 400;
    word-wrap: break-word;
  }
  
  .agent-message .message-content {
    background: white;
    color: #374151;
    border-bottom-left-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .user-message .message-content {
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border-bottom-right-radius: 8px;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
  }

  /* Chat Input */
  #lovable-livechat-input-area {
    padding: 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 16px;
    background: white;
    align-items: center;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  }
  
  #lovable-livechat-input {
    flex: 1;
    padding: 16px 24px;
    border: 2px solid #e2e8f0;
    border-radius: 50px;
    outline: none;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #f8fafc;
    font-weight: 400;
  }
  
  #lovable-livechat-input:focus {
    border-color: {{LIVE_CHAT_COLOR}};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    background: white;
  }
  
  #lovable-livechat-input::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  #lovable-livechat-send {
    padding: 16px 28px;
    background: linear-gradient(135deg, {{LIVE_CHAT_COLOR}} 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    letter-spacing: -0.025em;
  }
  
  #lovable-livechat-send:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  }
  
  #lovable-livechat-send:active {
    transform: translateY(0);
  }

  /* Main Modal */
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
    border-radius: 20px;
    padding: 0;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    {{MODAL_CONTENT_POSITION}}
  }
  
  #lovable-modal-header {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    white-space: pre-line;
    line-height: 1.5;
  }
  
  #lovable-widget-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }
  
  #lovable-widget-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  #lovable-widget-channels {
    padding: 20px;
    max-height: 50vh;
    overflow-y: auto;
  }
  
  .channel-item, .parent-channel {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    margin-bottom: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    text-decoration: none;
    color: #334155;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  
  .channel-item:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  .channel-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: #22c55e;
    color: white;
    flex-shrink: 0;
  }
  
  .channel-info {
    flex: 1;
    min-width: 0;
  }
  
  .channel-label {
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .channel-value {
    font-size: 14px;
    color: #64748b;
    word-break: break-all;
  }
  
  .channel-arrow {
    color: #22c55e;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .lovable-empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
  }
  
  .lovable-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .hiclient-video-player {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    border-radius: 12px;
    margin-bottom: 20px;
    z-index: 1;
    position: relative;
  }
  
  .hiclient-video-container {
    width: 100%;
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    position: relative;
    z-index: 1;
  }
  
  .hiclient-video-container iframe {
    width: 100% !important;
    height: 200px !important;
    border: none;
    border-radius: 12px;
  }
  
  @media (max-width: 768px) {
    #lovable-modal-content {
      width: 95%;
      max-height: 85vh;
    }
    
    .channel-item, .parent-channel {
      padding: 12px;
      gap: 10px;
    }
    
    .channel-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    
    .channel-label {
      font-size: 14px;
    }
    
    .channel-value {
      font-size: 12px;
    }
    
    #lovable-modal-header {
      padding: 16px;
      font-size: 16px;
    }
    
    #lovable-widget-channels {
      padding: 16px;
    }
    
    #lovable-prechat-form {
      padding: 24px 20px;
    }
    
    .prechat-fields {
      max-width: 100%;
    }
    
    #lovable-livechat-input-area {
      padding: 20px;
      gap: 12px;
    }
    
    #lovable-livechat-messages {
      padding: 20px;
    }
  }
`;