import { useCallback, useRef, useState } from 'react'

function snapshot(refs) {
  return { canUndo: refs.past.length > 0, canRedo: refs.future.length > 0 }
}

export function useHistory(initialState) {
  const [state, setState] = useState(initialState)
  const pastRef = useRef([])
  const futureRef = useRef([])
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false })

  const syncHistory = useCallback(() => {
    setHistoryState(snapshot({ past: pastRef.current, future: futureRef.current }))
  }, [])

  const setWithHistory = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      pastRef.current.push(prev)
      futureRef.current = []
      setHistoryState(snapshot({ past: pastRef.current, future: futureRef.current }))
      return next
    })
  }, [])

  const replace = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return
    setState((current) => {
      futureRef.current.push(current)
      const prev = pastRef.current.pop()
      setHistoryState(snapshot({ past: pastRef.current, future: futureRef.current }))
      return prev
    })
  }, [])

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return
    setState((current) => {
      pastRef.current.push(current)
      const next = futureRef.current.pop()
      setHistoryState(snapshot({ past: pastRef.current, future: futureRef.current }))
      return next
    })
  }, [])

  const reset = useCallback((newState) => {
    pastRef.current = []
    futureRef.current = []
    setState(newState)
    setHistoryState({ canUndo: false, canRedo: false })
  }, [])

  return {
    state,
    setWithHistory,
    replace,
    undo,
    redo,
    reset,
    canUndo: historyState.canUndo,
    canRedo: historyState.canRedo,
  }
}
