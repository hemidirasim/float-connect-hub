
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

  /* DÜZƏLDILMIŞ: Ana kanal konteyner */
  .parent-channel-wrapper {
    position: relative !important;
    display: block !important;
  }
  
  .parent-channel {
    position: relative !important;
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
  
  /* DÜZƏLDILMIŞ: Alt menyu hover funksiyası */
  .submenu {
    position: absolute !important;
    right: 100% !important;
    top: 0 !important;
    margin-right: 12px !important;
    background: white !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
    min-width: 280px !important;
    max-width: 320px !important;
    border: 1px solid #e5e7eb !important;
    z-index: 1000010 !important;
    overflow: hidden !important;
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateX(10px) !important;
    transition: all 0.3s ease !important;
  }
  
  /* ƏSAS DÜZƏLIŞ: Hover zamanı alt menyu göstər */
  .parent-channel-wrapper:hover > .submenu {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateX(0) !important;
  }
  
  /* Alt menyu öz üzərində hover zamanı da görünən qalsın */
  .submenu:hover {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .submenu-item {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
    color: #374151 !important;
    transition: all 0.2s ease !important;
    border-bottom: 1px solid #f3f4f6 !important;
  }
  
  .submenu-item:last-child {
    border-bottom: none !important;
  }
  
  .submenu-item:hover {
    background: #f9fafb !important;
    color: #1f2937 !important;
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

  /* Mobil responsive */
  @media (max-width: 768px) {
    .submenu {
      left: 100% !important;
      right: auto !important;
      margin-left: 12px !important;
      margin-right: 0 !important;
    }
  }
`;
