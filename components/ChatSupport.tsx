'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send, Image, Video, Download } from 'lucide-react';
import { getChat, sendMessage, uploadChatFile, type Chat, type ChatMessage } from '@/lib/api';

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (isOpen && phoneEntered && phoneNumber) {
      // Initial load
      loadChat();

      // Poll every 2 seconds for new messages
      const interval = setInterval(() => {
        loadChat();
      }, 2000);

      setPollingInterval(interval);

      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    }
  }, [isOpen, phoneEntered, phoneNumber]);

  const loadChat = async () => {
    if (!phoneNumber) return;

    try {
      const chatData = await getChat(phoneNumber);
      setChat(chatData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading chat:', err);
      // Don't show error on polling, only on initial load
      setError(err.message || 'Failed to load chat');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    
    // Validate phone number (Indian format: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setPhoneNumber(cleanPhone);
    setPhoneEntered(true);
    setError(null);
    await loadChat();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !phoneNumber || loading) return;

    setLoading(true);
    setError(null);

    try {
      await sendMessage(phoneNumber, 'customer', message.trim(), 'text');
      setMessage('');
      await loadChat();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !phoneNumber || loading) return;

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Please select an image or video file');
      return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await uploadChatFile(file, phoneNumber, 'customer');
      await loadChat();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Open chat support"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Support</h2>
              <button
                onClick={handleClose}
                className="hover:bg-blue-700 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {!phoneEntered ? (
                // Phone Number Form
                <div className="flex-1 flex items-center justify-center p-6">
                  <form onSubmit={handlePhoneSubmit} className="w-full max-w-sm">
                    <label className="block text-gray-700 font-medium mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      maxLength={10}
                      required
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                // Chat Interface
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {chat?.messages && chat.messages.length > 0 ? (
                      <div className="space-y-3">
                        {chat.messages.map((msg: ChatMessage, index: number) => {
                          const isCustomer = msg.sender === 'customer';
                          return (
                            <div
                              key={index}
                              className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-lg p-3 ${
                                  isCustomer
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                              >
                                {msg.type === 'text' ? (
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                ) : msg.type === 'image' ? (
                                  <div className="relative group">
                                    <img
                                      src={msg.content}
                                      alt="Shared image"
                                      className="max-w-full h-auto rounded"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                      }}
                                    />
                                    <button
                                      onClick={() => handleDownloadImage(msg.content)}
                                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                      aria-label="Download image"
                                      title="Download image"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <video
                                    src={msg.content}
                                    controls
                                    className="max-w-full h-auto rounded"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                <p
                                  className={`text-xs mt-1 ${
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
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="px-4 py-2 bg-red-100 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Upload image or video"
                        disabled={loading}
                      >
                        <Image className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={!message.trim() || loading}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
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

