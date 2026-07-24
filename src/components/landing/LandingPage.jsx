import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchGridCards, fetchQuickLinks, fetchUser } from '../../api/mockApi'
import LandingHeader from './LandingHeader'
import GridCard from './GridCard'
import QuickLinks from './QuickLinks'

export default function LandingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [cards, setCards] = useState([])
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchUser(), fetchGridCards(), fetchQuickLinks()]).then(
      ([userData, cardsData, linksData]) => {
        setUser(userData)
        setCards(cardsData)
        setLinks(linksData)
        setLoading(false)
      },
    )
  }, [])

  const handleCardClick = (card) => {
    if (card.id === 'lrv') navigate('/lrv')
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #e8eaf0 1px, transparent 1px), radial-gradient(circle at 80% 20%, #e8eaf0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <LandingHeader />

      <main className="relative mx-auto max-w-5xl px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-800">
                {user?.greeting}, {user?.name}
              </h1>
              <p className="mt-2 text-lg text-gray-500">Start, where you left off !</p>
              <span className="mt-3 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                Powered by Glide Data Grid
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {cards.map((card) => (
                <GridCard key={card.id} card={card} onClick={() => handleCardClick(card)} />
              ))}
            </div>

            <QuickLinks links={links} />
          </>
        )}
      </main>
    </div>
  )
}
