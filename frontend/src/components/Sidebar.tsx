import { Menu, X } from 'lucide-react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">AI Event Ops</h1>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Dashboard</span>
          </Link>
          <Link
            to="/generator"
            className={`nav-item ${isActive('/generator') ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Event Generator</span>
          </Link>
          <Link
            to="/events"
            className={`nav-item ${isActive('/events') ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>Events</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-version">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}

interface HeaderProps {
  onMenuClick: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="header">
      <button className="header-menu-btn" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div className="header-title">
        <h2>AI Event Operation Assistant</h2>
      </div>
      <div className="header-right">
        <span className="user-info">Operator</span>
      </div>
    </header>
  )
}
