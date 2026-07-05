'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/partials/Button';
import { Input } from '@/components/partials/Input';
import { Avatar } from '@/components/partials/Avatar';
import { Send, Search, MessageSquare, ShieldAlert, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'tenant';
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const mockContacts: Contact[] = [
  { id: 'c1', name: 'Dr. Adebayo Johnson', role: 'admin', online: true, lastMessage: 'Please make sure all complaints are submitted with photos.', unreadCount: 1 },
  { id: 'c2', name: 'Mrs. Janet Alabi', role: 'manager', online: true, lastMessage: 'I will send the plumber by 10:00 AM tomorrow.' },
  { id: 'c3', name: 'Stephen King', role: 'tenant', online: false, lastMessage: 'Thank you, the rent receipt is correct.' },
  { id: 'c4', name: 'Esther Davies', role: 'tenant', online: true, lastMessage: 'Is the internet service restored in Zone C?' },
  { id: 'c5', name: 'Admin Helpdesk', role: 'admin', online: true, lastMessage: 'Your issue ticket #3094 has been closed.' },
];

export function ChatView() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    c1: [
      { id: 'm1', senderId: 'c1', senderName: 'Dr. Adebayo Johnson', text: 'Welcome to the EMS Chat Portal. You can reach out for any administrative questions here.', timestamp: '10:00 AM', status: 'read' },
      { id: 'm2', senderId: user?._id || 'me', senderName: 'Me', text: 'Thank you. I have a question about the parking policy.', timestamp: '10:05 AM', status: 'read' },
      { id: 'm3', senderId: 'c1', senderName: 'Dr. Adebayo Johnson', text: 'Please make sure all complaints are submitted with photos.', timestamp: '10:15 AM', status: 'read' },
    ],
    c2: [
      { id: 'm4', senderId: 'c2', senderName: 'Mrs. Janet Alabi', text: 'Hello, regarding the plumbing complaint you filed.', timestamp: 'Yesterday', status: 'read' },
      { id: 'm5', senderId: user?._id || 'me', senderName: 'Me', text: 'Yes, the leak in the kitchen sink is getting worse.', timestamp: 'Yesterday', status: 'read' },
      { id: 'm6', senderId: 'c2', senderName: 'Mrs. Janet Alabi', text: 'I will send the plumber by 10:00 AM tomorrow.', timestamp: 'Yesterday', status: 'read' },
    ],
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on user role
  useEffect(() => {
    if (!user) return;
    let filtered = [...mockContacts];
    if (user.role === 'tenant') {
      // Tenants only see managers (landlords) and admins
      filtered = mockContacts.filter(c => c.role === 'manager' || c.role === 'admin');
    } else if (user.role === 'manager') {
      // Managers see tenants and admins
      filtered = mockContacts.filter(c => c.role === 'tenant' || c.role === 'admin');
    } else {
      // Admins see all
      filtered = [...mockContacts];
    }
    setContacts(filtered);
    if (filtered.length > 0) {
      setActiveContact(filtered[0]!);
    }
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);

  const handleSend = () => {
    if (!inputText.trim() || !activeContact || !user) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: user._id,
      senderName: `${user.firstName} ${user.lastName}`,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    const contactId = activeContact.id;
    setMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }));

    setInputText('');

    // Simulate reply after 1.5 seconds
    setTimeout(() => {
      // Mark original message as read
      setMessages(prev => {
        const list = prev[contactId] || [];
        return {
          ...prev,
          [contactId]: list.map(m => m.id === newMessage.id ? { ...m, status: 'read' as const } : m),
        };
      });

      const reply: Message = {
        id: Math.random().toString(),
        senderId: contactId,
        senderName: activeContact.name,
        text: `Thanks for messaging! This is an automated response from ${activeContact.name} regarding your message: "${newMessage.text}". We will review it shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      setMessages(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), reply],
      }));
    }, 1500);
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8.5rem)] rounded-[var(--radius-xl)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
      {/* Contact List Sidebar */}
      <div className="w-80 border-r border-[var(--color-border)] flex flex-col bg-white">
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)]/50">
          {filteredContacts.map((contact) => {
            const isActive = activeContact?.id === contact.id;
            const chatMessages = messages[contact.id] || [];
            const lastMsg = chatMessages[chatMessages.length - 1]?.text || contact.lastMessage || 'No messages yet';

            return (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveContact(contact);
                  // clear unread count mock
                  setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unreadCount: 0 } : c));
                }}
                className={[
                  'w-full text-left p-4 flex items-start gap-3 transition-colors',
                  isActive ? 'bg-[var(--color-primary-light)]/40 border-l-4 border-[var(--color-primary)]' : 'hover:bg-[var(--color-surface-sunken)]',
                ].join(' ')}
              >
                <div className="relative shrink-0">
                  <Avatar name={contact.name} size="md" />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-success)] border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-[var(--color-foreground)] truncate">{contact.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] tracking-wider">{contact.role}</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] truncate">{lastMsg}</p>
                </div>
                {contact.unreadCount && contact.unreadCount > 0 ? (
                  <span className="shrink-0 ml-1 px-2 py-0.5 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full">
                    {contact.unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}

          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-[var(--color-muted)] text-sm">
              No contacts found.
            </div>
          )}
        </div>
      </div>

      {/* Active Conversation Area */}
      <div className="flex-1 flex flex-col bg-[var(--color-surface-sunken)]/20">
        {activeContact ? (
          <>
            {/* Active Header */}
            <div className="h-16 px-6 bg-white border-b border-[var(--color-border)] flex items-center justify-between shadow-sm shrink-0 z-10">
              <div className="flex items-center gap-3">
                <Avatar name={activeContact.name} size="sm" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-foreground)] leading-tight">{activeContact.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={['w-1.5 h-1.5 rounded-full', activeContact.online ? 'bg-[var(--color-success)]' : 'bg-gray-400'].join(' ')} />
                    <span className="text-xs text-[var(--color-muted)] capitalize">
                      {activeContact.online ? 'Active now' : 'Offline'} • {activeContact.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-xs text-[var(--color-muted)]">
                  <ShieldAlert size={12} className="text-[var(--color-primary)]" />
                  Messages are secure and end-to-end encrypted
                </div>
              </div>

              {(messages[activeContact.id] || []).map((msg) => {
                const isMe = msg.senderId === user?._id || msg.senderId === 'me';
                return (
                  <div
                    key={msg.id}
                    className={['flex', isMe ? 'justify-end' : 'justify-start'].join(' ')}
                  >
                    <div
                      className={[
                        'max-w-[70%] rounded-[var(--radius-lg)] p-3.5 shadow-sm relative',
                        isMe
                          ? 'bg-[var(--color-primary)] text-white rounded-tr-none'
                          : 'bg-white text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border)]',
                      ].join(' ')}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80">
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <CheckCheck
                            size={12}
                            className={msg.status === 'read' ? 'text-blue-300' : 'text-gray-300'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-[var(--color-border)] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeContact.name.split(' ')[1] || 'them'}...`}
                  className="flex-1 px-4 py-3 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                />
                <Button type="submit" variant="primary" className="h-[42px] px-5" disabled={!inputText.trim()}>
                  <Send size={16} className="shrink-0" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <span className="text-5xl mb-4">💬</span>
            <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-1">No Active Chat</h3>
            <p className="text-sm text-[var(--color-muted)] max-w-xs">
              Select a conversation from the sidebar list to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
