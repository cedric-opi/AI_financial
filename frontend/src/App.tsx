import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import { AnalyticsPage } from './pages/AnalyticsPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App