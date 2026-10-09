import React from 'react';

export const TelegramSendIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Authentic Telegram paper airplane silhouette */}
      <path d="M21.6 3.6c-.3-.2-.7-.3-1.1-.1L2.8 10.4c-.6.2-.9.8-.8 1.4.1.6.6 1 1.2 1.1l4.8 1.1 1.9 5.8c.2.6.8 1 1.4 1 .3 0 .6-.1.8-.3l2.8-2.5 4.5 3.3c.4.3.9.3 1.3.1.4-.2.7-.6.8-1l3-15.5c.1-.5-.1-1-.6-1.4zM9.5 13.3l8.4-6.9-6.7 8.3-.4 2.8-1.3-4.2z" />
    </svg>
  );
};
