
export const defaultCssStyles = `
  #lovable-widget-button:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  }
  
  #lovable-widget-close:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    transform: rotate(90deg);
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

  /* Parent channel wrapper - FIXED STRUCTURE */
  .parent-channel-wrapper {
    position: relative;
    display: block;
  }
  
  .parent-channel {
    position: relative;
    display: flex !important;
    text-decoration: none !important;
  }
  
  .parent-channel:hover {
    border-color: #22c55e !important;
    background: #f0fdf4 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15) !important;
  }
  
  .child-count {
    position: absolute;
    top: -8px;
    right: -8px;
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
  
  /* FIXED SUBMENU - Now works properly with hover */
  .submenu {
    position: absolute;
    right: 100%;
    top: 0;
    margin-right: 12px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    min-width: 280px;
    max-width: 320px;
    border: 1px solid #e5e7eb;
    z-index: 1000010;
    display: none !important;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateX(10px);
    transition: all 0.3s ease;
  }
  
  /* CRITICAL FIX: Show submenu on hover of parent wrapper */
  .parent-channel-wrapper:hover .submenu {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateX(0) !important;
  }
  
  /* Keep submenu visible when hovering over submenu itself */
  .submenu:hover {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .submenu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: #374151;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .submenu-item:last-child {
    border-bottom: none;
  }
  
  .submenu-item:hover {
    background: #f9fafb;
    color: #1f2937;
  }
  
  .submenu-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 16px;
    flex-shrink: 0;
    color: white;
  }
  
  .submenu-info {
    flex: 1;
    min-width: 0;
  }
  
  .submenu-label {
    font-weight: 500;
    font-size: 14px;
    color: #1f2937;
    margin: 0 0 2px 0;
    line-height: 1.3;
  }
  
  .submenu-value {
    font-size: 12px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
    line-height: 1.3;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .submenu {
      left: 100%;
      right: auto;
      margin-left: 12px;
      margin-right: 0;
    }
  }
`;
