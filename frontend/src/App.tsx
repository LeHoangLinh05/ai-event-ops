import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { Dashboard, EventGenerator, EventList } from '@/pages'
import { ToastProvider } from '@/contexts/ToastContext'

function App() {
  return (
    <ToastProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generator" element={<EventGenerator />} />
            <Route path="/events" element={<EventList />} />
          </Routes>
        </MainLayout>
      </Router>
    </ToastProvider>
  )
}

export default App
