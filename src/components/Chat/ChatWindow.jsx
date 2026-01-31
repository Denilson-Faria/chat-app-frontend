import React from 'react';
import ChatLayout from './ChatLayout';

const ChatWindow = ({ onMenuClick }) => {
  return (
    <div className="w-full h-full">
      <ChatLayout onMenuClick={onMenuClick} />
    </div>
  );
};

export default ChatWindow;
