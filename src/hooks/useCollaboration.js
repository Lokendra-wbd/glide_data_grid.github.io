import { useMemo } from 'react'

export const COLLAB_USERS = [
  { id: 'cn', initials: 'CN', name: 'Chris', color: '#7c3aed', ringColor: '#a855f7' },
  { id: 'lh', initials: 'LH', name: 'Laura', color: '#9333ea', ringColor: '#c084fc' },
  { id: 'ak', initials: 'AK', name: 'Alex', color: '#2563eb', ringColor: '#60a5fa' },
  { id: 'mj', initials: 'MJ', name: 'Maya', color: '#ea580c', ringColor: '#fb923c' },
  { id: 'rs', initials: 'RS', name: 'Ravi', color: '#db2777', ringColor: '#f472b6' },
]

const TIMES = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function stableIndex(seed, max) {
  const hash = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return hash % max
}

export function useCollaboration(weeks, activeUsers = [], currentUser) {
  const peerSelections = useMemo(() => {
    if (!weeks.length || !activeUsers.length) return []

    return activeUsers
      .filter((u) => !u.isCurrent)
      .map((user) => {
        const wi = stableIndex(user.tabId ?? user.id, Math.min(weeks.length, 30))
        const dayName = DAYS[stableIndex(user.tabId + 'd', DAYS.length)]
        const timeSlot = TIMES[stableIndex(user.tabId + 't', TIMES.length)]
        return {
          userId: user.id,
          dayName,
          weekIndex: wi,
          timeSlot,
          weekMonday: weeks[wi]?.monday,
          initials: user.initials,
          color: user.color,
          ringColor: user.ringColor ?? user.color,
        }
      })
  }, [weeks, activeUsers])

  return {
    currentUser: currentUser ?? COLLAB_USERS[0],
    peerSelections,
    allUsers: COLLAB_USERS,
  }
}

export function selectionKey(dayName, weekIndex, timeSlot) {
  return `${dayName}-${weekIndex}-${timeSlot}`
}
