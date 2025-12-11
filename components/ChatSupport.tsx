'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Image, Video, Download } from 'lucide-react';
import { getChat, sendMessage, uploadChatFile, saveUser, updateUser, type Chat, type ChatMessage } from '@/lib/api';

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneEntered, setPhoneEntered] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Load saved phone number from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('chatPhoneNumber');
      if (savedPhone && savedPhone.trim()) {
        const cleanPhone = savedPhone.trim().replace(/\D/g, '');
        if (cleanPhone.length === 10) {
          setPhoneNumber(cleanPhone);
          setPhoneEntered(true);
        }
      }
    }
  }, []);

  // Listen for open chat event from navbar
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('openChat', handleOpenChat);
    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, []);

  // Auto-scroll to bottom when messages change (only if user is near bottom)
  useEffect(() => {
    if (messagesEndRef.current && chat?.messages) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        const isNearBottom = 
          messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;
        
        // Only auto-scroll if user is already near bottom (not if they scrolled up)
        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.messages?.length]); // Only trigger on message count change, not on every render

  const loadChat = useCallback(async (isInitialLoad: boolean = false) => {
    if (!phoneNumber) return;

    try {
      const chatData = await getChat(phoneNumber);
      
      // Only update state if messages actually changed (prevent unnecessary re-renders)
      setChat(prevChat => {
        const prevMessageCount = prevChat?.messages?.length || 0;
        const newMessageCount = chatData.messages?.length || 0;
        
        // Only update if messages changed or it's initial load
        if (isInitialLoad || prevMessageCount !== newMessageCount) {
          return chatData;
        }
        return prevChat;
      });
      
      if (isInitialLoad) {
        setError(null);
        
        // Update user's last active time only on initial load (not on every poll)
        if (chatData.messages && chatData.messages.length > 0) {
          // Don't await - run in background to not block UI
          updateUser(phoneNumber, {
            messageCount: chatData.messages.length,
            lastActiveAt: new Date(),
          }).catch(err => {
            console.error('Error updating user:', err);
            // Don't show error to user
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading chat:', err);
      // Only show error on initial load, not on polling
      if (isInitialLoad) {
        setError(err.message || 'Failed to load chat');
      }
    }
  }, [phoneNumber]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (isOpen && phoneEntered && phoneNumber) {
      // Initial load
      loadChat(true);

      // Poll every 5 seconds for new messages (reduced from 2s for better performance)
      const interval = setInterval(() => {
        loadChat(false); // false = don't update user on polling
      }, 5000);

      setPollingInterval(interval);

      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    }
  }, [isOpen, phoneEntered, phoneNumber, loadChat]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    
    // Validate phone number (Indian format: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Save phone number to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatPhoneNumber', cleanPhone);
      }

      // Save user to MongoDB database
      await saveUser(cleanPhone);

      setPhoneNumber(cleanPhone);
      setPhoneEntered(true);
      await loadChat();
    } catch (err: any) {
      console.error('Error saving user:', err);
      // Still allow chat even if user save fails
      setPhoneNumber(cleanPhone);
      setPhoneEntered(true);
      await loadChat();
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !phoneNumber || loading) return;

    const messageText = message.trim();
    setMessage(''); // Clear input immediately for better UX
    setLoading(true);
    setError(null);

    try {
      await sendMessage(phoneNumber, 'customer', messageText, 'text');
      // Reload chat immediately after sending
      await loadChat(true);
      
      // Update user in background (don't await to keep UI responsive)
      updateUser(phoneNumber, {
        lastActiveAt: new Date(),
      }).catch(err => {
        console.error('Error updating user:', err);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
      // Restore message if send failed
      setMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !phoneNumber || loading) return;

    // Check file type
    const fileName = file.name.toLowerCase();
    const isValidFile = 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type === 'application/pdf' || 
      fileName.endsWith('.pdf');
    
    if (!isValidFile) {
      setError('Please select an image, video, or PDF file');
      return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Clear input immediately
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      await uploadChatFile(file, phoneNumber, 'customer');
      // Reload chat immediately after upload
      await loadChat(true);
      
      // Update user in background
      updateUser(phoneNumber, {
        lastActiveAt: new Date(),
      }).catch(err => {
        console.error('Error updating user:', err);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      // Handle data URLs (base64)
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `chat-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      // Handle regular URLs
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Function to clear saved phone number (for changing number)
  const handleClearPhone = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatPhoneNumber');
    }
    setPhoneNumber('');
    setPhoneEntered(false);
    setChat(null);
    setError(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Open chat support"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4" style={{ overflow: 'hidden' }}>
          <div className="bg-white rounded-none sm:rounded-lg shadow-2xl w-full h-full sm:h-[600px] sm:max-w-md flex flex-col" style={{ maxHeight: '100dvh', height: '100%' }}>
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-none sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold">Chat Support</h2>
                {phoneEntered && phoneNumber && (
                  <span className="text-xs sm:text-sm text-blue-100 bg-blue-700/50 px-2 py-0.5 rounded-full">
                    {phoneNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {phoneEntered && phoneNumber && (
                  <button
                    onClick={handleClearPhone}
                    className="text-xs sm:text-sm text-blue-100 hover:text-white hover:bg-blue-700 px-2 py-1 rounded transition-colors active:bg-blue-800"
                    aria-label="Change number"
                    title="Change phone number"
                  >
                    Change
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="hover:bg-blue-700 rounded-full p-1.5 sm:p-1 transition-colors active:bg-blue-800"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {!phoneEntered ? (
                // Phone Number Form
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                  <form onSubmit={handlePhoneSubmit} className="w-full max-w-sm">
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Enter Your Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setError(null);
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-base sm:text-base"
                      maxLength={10}
                      required
                    />
                    {error && (
                      <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                // Chat Interface
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {chat?.messages && chat.messages.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {chat.messages.map((msg: ChatMessage, index: number) => {
                          const isCustomer = msg.sender === 'customer';
                          return (
                            <div
                              key={index}
                              className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-2.5 sm:p-3 ${
                                  isCustomer
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                              >
                                {msg.type === 'text' ? (
                                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                ) : msg.type === 'image' ? (
                                  <div className="relative group">
                                    <img
                                      src={msg.content}
                                      alt="Shared image"
                                      className="max-w-full h-auto rounded"
                                      loading="lazy"
                                      onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        // Prevent infinite loop - if already a data URI or placeholder, hide the image
                                        if (img.src.startsWith('data:') || img.dataset.errorHandled === 'true') {
                                          img.style.display = 'none';
                                          return;
                                        }
                                        // Mark as handled to prevent multiple retries
                                        img.dataset.errorHandled = 'true';
                                        // Set placeholder data URI
                                        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                                      }}
                                    />
                                    <button
                                      onClick={() => handleDownloadImage(msg.content)}
                                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black/70 hover:bg-black/90 active:bg-black text-white p-1.5 sm:p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
                                      aria-label="Download image"
                                      title="Download image"
                                    >
                                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                ) : msg.type === 'video' ? (
                                  <video
                                    src={msg.content}
                                    controls
                                    className="max-w-full h-auto rounded"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                ) : msg.type === 'pdf' ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                      </svg>
                                      <span>PDF Document</span>
                                    </div>
                                    <a
                                      href={msg.content}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm transition-colors"
                                    >
                                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      View/Download PDF
                                    </a>
                                  </div>
                                ) : null}
                                <p
                                  className={`text-[10px] sm:text-xs mt-1 ${
                                    isCustomer ? 'text-blue-100' : 'text-gray-500'
                                  }`}
                                >
                                  {formatTime(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p className="text-xs sm:text-sm text-center px-4">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 text-xs sm:text-sm flex-shrink-0">
                      {error}
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t border-gray-200 p-2.5 sm:p-4 bg-white flex-shrink-0" style={{ position: 'sticky', bottom: 0 }}>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/*,application/pdf,.pdf"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 active:text-blue-700 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                        aria-label="Upload image, video, or PDF"
                        disabled={loading}
                      >
                        <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
                        disabled={loading}
                        onFocus={(e) => {
                          // Prevent page scroll on mobile when keyboard opens
                          if (window.innerWidth < 640) {
                            setTimeout(() => {
                              const inputRect = e.target.getBoundingClientRect();
                              const viewportHeight = window.innerHeight;
                              // Only scroll if input is near bottom (keyboard area)
                              if (inputRect.bottom > viewportHeight * 0.7) {
                                e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                              }
                            }, 100);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!message.trim() || loading}
                        className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

