import React, { useState } from 'react'
import { Mail, Send, Archive, Trash2, Star, Search, Plus, Settings, Inbox, DraftingCompass, Send as SendIcon, Menu } from 'lucide-react'
import './App.css'

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
  starred: boolean
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'john@example.com',
    subject: 'Welcome to AI Mail',
    preview: 'Thank you for trying out our new AI-powered email client. Here are some tips to get started...',
    timestamp: '2 hours ago',
    read: false,
    starred: true
  },
  {
    id: '2',
    from: 'sarah@company.com',
    subject: 'Project Update',
    preview: 'Hi there! Just wanted to give you a quick update on the project status. Everything is progressing well...',
    timestamp: '4 hours ago',
    read: true,
    starred: false
  },
  {
    id: '3',
    from: 'notifications@service.com',
    subject: 'Monthly Report Available',
    preview: 'Your monthly analytics report is now ready for review. Click here to view your insights...',
    timestamp: '1 day ago',
    read: true,
    starred: false
  }
]

function App() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [activeFolder, setActiveFolder] = useState('inbox')

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    setIsComposing(false)
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ))
  }

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ))
  }

  return (
    <div className="email-client">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <Menu size={20} className="menu-icon" />
          <Mail size={24} className="logo" />
          <h1>AI Mail</h1>
        </div>
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="Search emails..." />
        </div>
        <div className="header-right">
          <Settings size={20} />
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <button 
            className="compose-btn"
            onClick={() => {
              setIsComposing(true)
              setSelectedEmail(null)
            }}
          >
            <Plus size={16} />
            Compose
          </button>
          
          <nav className="folder-nav">
            <button 
              className={`folder-item ${activeFolder === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveFolder('inbox')}
            >
              <Inbox size={16} />
              Inbox
              <span className="unread-count">3</span>
            </button>
            <button 
              className={`folder-item ${activeFolder === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveFolder('sent')}
            >
              <SendIcon size={16} />
              Sent
            </button>
            <button 
              className={`folder-item ${activeFolder === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveFolder('drafts')}
            >
              <DraftingCompass size={16} />
              Drafts
            </button>
            <button 
              className={`folder-item ${activeFolder === 'starred' ? 'active' : ''}`}
              onClick={() => setActiveFolder('starred')}
            >
              <Star size={16} />
              Starred
            </button>
            <button 
              className={`folder-item ${activeFolder === 'archive' ? 'active' : ''}`}
              onClick={() => setActiveFolder('archive')}
            >
              <Archive size={16} />
              Archive
            </button>
            <button 
              className={`folder-item ${activeFolder === 'trash' ? 'active' : ''}`}
              onClick={() => setActiveFolder('trash')}
            >
              <Trash2 size={16} />
              Trash
            </button>
          </nav>
        </aside>

        {/* Email List */}
        <div className="email-list">
          <div className="list-header">
            <h2>Inbox</h2>
            <div className="list-actions">
              <Archive size={16} />
              <Trash2 size={16} />
            </div>
          </div>
          <div className="emails">
            {emails.map(email => (
              <div 
                key={email.id} 
                className={`email-item ${!email.read ? 'unread' : ''} ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="email-item-left">
                  <button 
                    className={`star-btn ${email.starred ? 'starred' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(email.id)
                    }}
                  >
                    <Star size={16} fill={email.starred ? 'currentColor' : 'none'} />
                  </button>
                  <div className="email-content">
                    <div className="email-from">{email.from}</div>
                    <div className="email-subject">{email.subject}</div>
                    <div className="email-preview">{email.preview}</div>
                  </div>
                </div>
                <div className="email-timestamp">{email.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Email View / Compose */}
        <main className="email-view">
          {isComposing ? (
            <div className="compose-view">
              <div className="compose-header">
                <h2>New Message</h2>
                <div className="compose-actions">
                  <button className="send-btn">
                    <Send size={16} />
                    Send
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setIsComposing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="compose-fields">
                <div className="field">
                  <label>To:</label>
                  <input type="email" placeholder="recipient@example.com" />
                </div>
                <div className="field">
                  <label>Subject:</label>
                  <input type="text" placeholder="Enter subject" />
                </div>
              </div>
              <textarea 
                className="compose-body" 
                placeholder="Type your message here..."
              ></textarea>
            </div>
          ) : selectedEmail ? (
            <div className="email-detail">
              <div className="email-header">
                <h2>{selectedEmail.subject}</h2>
                <div className="email-actions">
                  <Archive size={16} />
                  <Trash2 size={16} />
                  <Star 
                    size={16} 
                    fill={selectedEmail.starred ? 'currentColor' : 'none'}
                    className={selectedEmail.starred ? 'starred' : ''}
                    onClick={() => toggleStar(selectedEmail.id)}
                  />
                </div>
              </div>
              <div className="email-meta">
                <div className="email-from-detail">
                  <strong>From:</strong> {selectedEmail.from}
                </div>
                <div className="email-timestamp-detail">
                  {selectedEmail.timestamp}
                </div>
              </div>
              <div className="email-body">
                <p>{selectedEmail.preview}</p>
                <p>This is where the full email content would be displayed. In a real email client, this would contain the complete message body with proper formatting, images, and attachments.</p>
              </div>
              <div className="reply-actions">
                <button className="reply-btn">Reply</button>
                <button className="reply-all-btn">Reply All</button>
                <button className="forward-btn">Forward</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Mail size={64} className="empty-icon" />
              <h2>Select an email to read</h2>
              <p>Choose an email from the list to view its contents</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
