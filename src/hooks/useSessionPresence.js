import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'lrv_browser_sessions'
const HEARTBEAT_MS = 3000
const SESSION_TTL_MS = 12000
const USER_POOL = [
  { id: 'cn', initials: 'CN', name: 'Chris', color: '#7c3aed', ringColor: '#a855f7' },
  { id: 'lh', initials: 'LH', name: 'Laura', color: '#9333ea', ringColor: '#c084fc' },
  { id: 'ak', initials: 'AK', name: 'Alex', color: '#2563eb', ringColor: '#60a5fa' },
  { id: 'mj', initials: 'MJ', name: 'Maya', color: '#ea580c', ringColor: '#fb923c' },
  { id: 'rs', initials: 'RS', name: 'Ravi', color: '#db2777', ringColor: '#f472b6' },
]

function getTabId() {
  let tabId = sessionStorage.getItem('lrv_tab_id')
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('lrv_tab_id', tabId)
  }
  return tabId
}

function readSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

function pruneSessions(sessions, now) {
  return sessions.filter((s) => now - s.lastSeen < SESSION_TTL_MS)
}

function assignUser(tabId) {
  const hash = [...tabId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return USER_POOL[hash % USER_POOL.length]
}

export function useSessionPresence() {
  const tabId = getTabId()
  const [sessions, setSessions] = useState([])
  const currentUser = assignUser(tabId)

  const refresh = useCallback(() => {
    const now = Date.now()
    let all = pruneSessions(readSessions(), now)
    const existing = all.findIndex((s) => s.tabId === tabId)
    const entry = {
      tabId,
      userId: currentUser.id,
      initials: currentUser.initials,
      name: currentUser.name,
      color: currentUser.color,
      lastSeen: now,
      startedAt: existing >= 0 ? all[existing].startedAt : now,
    }
    if (existing >= 0) all[existing] = entry
    else all.push(entry)
    writeSessions(all)
    setSessions(all)
  }, [tabId, currentUser])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, HEARTBEAT_MS)
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    const onUnload = () => {
      const now = Date.now()
      const all = pruneSessions(readSessions(), now).filter((s) => s.tabId !== tabId)
      writeSessions(all)
    }
    window.addEventListener('beforeunload', onUnload)
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('beforeunload', onUnload)
      onUnload()
    }
  }, [refresh, tabId])

  const activeUsers = sessions.map((s) => {
    const poolUser = USER_POOL.find((u) => u.id === s.userId) ?? currentUser
    return { ...poolUser, tabId: s.tabId, isCurrent: s.tabId === tabId }
  })

  return {
    tabId,
    currentUser,
    activeUsers,
    activeSessionCount: sessions.length,
    allUsers: USER_POOL,
  }
}

export { USER_POOL }
