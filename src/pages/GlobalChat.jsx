import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';


const GlobalChat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
     
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

     
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
      </div>

      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default GlobalChat;
