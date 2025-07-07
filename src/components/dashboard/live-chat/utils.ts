
export const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'İndi';
  if (diffInMinutes < 60) return `${diffInMinutes} dəqiqə əvvəl`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat əvvəl`;
  return `${Math.floor(diffInMinutes / 1440)} gün əvvəl`;
};
