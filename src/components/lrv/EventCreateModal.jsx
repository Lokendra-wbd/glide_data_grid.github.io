import { useEffect, useState } from 'react'
import {
  fetchAirDates,
  fetchFormOptions,
  fetchNetworks,
  fetchProgramDefaults,
  fetchProgramNames,
} from '../../api/mockApi'

function TabBar({ active, onChange }) {
  return (
    <div className="flex border-b border-gray-600">
      {['Program', 'Miscellaneous'].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm ${active === tab ? 'border-b-2 border-white bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs text-gray-400">
        {label}{required && '*'}
      </label>
      {children}
    </div>
  )
}

function ProgramPanel({ form, setForm, programNames, formOptions }) {
  const used = form.exhibitionsUsed
  const allowed = form.exhibitionsAllowed
  const balance = allowed - used

  return (
    <div className="space-y-1">
      <div className="mb-4 flex gap-2">
        {['Series', 'Returning'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((f) => ({ ...f, programType: type }))}
            className={`rounded-full px-4 py-1 text-sm ${form.programType === type ? 'bg-gray-600 text-white' : 'border border-gray-500 text-gray-300'}`}
          >
            {type}
          </button>
        ))}
        <button type="button" className="rounded-full border border-gray-500 px-3 text-gray-300">+</button>
      </div>

      <Field label="Program Name" required>
        <input
          type="text"
          list="program-name-options"
          value={form.programName}
          onChange={(e) => setForm((f) => ({ ...f, programName: e.target.value }))}
          placeholder="Enter or select program name"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
        />
        <datalist id="program-name-options">
          {programNames.map((n) => <option key={n} value={n} />)}
        </datalist>
      </Field>

      <div className="flex gap-4">
        <Field label="Season">
          <div className="flex items-center gap-2">
            <select
              value={form.season}
              onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
              className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
            >
              {[1, 2, 3, 4, 5].map((s) => <option key={s} value={String(s)}>{s}</option>)}
            </select>
            <span className="rounded border border-purple-400 px-2 py-0.5 text-[10px] text-purple-300">New season</span>
          </div>
        </Field>
        <Field label="No. of Episodes">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.episodes}
              onChange={(e) => setForm((f) => ({ ...f, episodes: e.target.value }))}
              className="w-20 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
            />
            <span className="rounded border border-purple-400 px-2 py-0.5 text-[10px] text-purple-300">New Epsiodes</span>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Telecast Start Date">
          <input type="date" value={form.telecastStart} onChange={(e) => setForm((f) => ({ ...f, telecastStart: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" />
        </Field>
        <Field label="Telecast End Date">
          <input type="date" value={form.telecastEnd} onChange={(e) => setForm((f) => ({ ...f, telecastEnd: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" />
        </Field>
        <Field label="Start Time">
          <select value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white">
            {formOptions.startTimes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Duration">
          <select value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white">
            {formOptions.durations.map((d) => <option key={d} value={d}>{d} mins</option>)}
          </select>
        </Field>
      </div>

      <div className="mb-3">
        <span className="text-xs text-gray-400">Exhibitions</span>
        <div className="mt-1 flex gap-4 text-sm text-gray-300">
          <span>Allowed <strong className="text-white">{allowed}</strong></span>
          <span>Used <strong className="text-white">{used}</strong></span>
          <span>Balance <strong className="text-white">{balance}</strong></span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700">
          <div className="h-full rounded-full bg-green-500" style={{ width: `${(used / allowed) * 100}%` }} />
        </div>
      </div>

      <div className="mb-3">
        <span className="text-xs text-gray-400">Flags</span>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-300">
          {[
            ['doNotAir', 'Do Not Air'],
            ['doNotPublish', 'Do Not Publish'],
            ['runOrderConfirmed', 'Run Order Confirmed'],
            ['publishCustomerSeason', 'Publish Customer Season No.'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.flags[key]}
                onChange={(e) => setForm((f) => ({ ...f, flags: { ...f.flags, [key]: e.target.checked } }))}
                className="rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Field label="Title">
        <div className="mb-2 flex gap-4 text-sm">
          <label className="flex items-center gap-1 text-gray-300">
            <input type="radio" checked={form.titleType === 'working'} onChange={() => setForm((f) => ({ ...f, titleType: 'working' }))} />
            Working Title
          </label>
          <label className="flex items-center gap-1 text-gray-300">
            <input type="radio" checked={form.titleType === 'confirmed'} onChange={() => setForm((f) => ({ ...f, titleType: 'confirmed' }))} />
            Confirmed Title
          </label>
        </div>
        <input
          type="text"
          placeholder="Show name"
          value={form.workingTitle}
          onChange={(e) => setForm((f) => ({ ...f, workingTitle: e.target.value }))}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
        />
      </Field>
    </div>
  )
}

function MiscPanel({ form, setForm, networks, airDates }) {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-3">
        <Field label="LP Start">
          <input type="date" value={form.lpStart} onChange={(e) => setForm((f) => ({ ...f, lpStart: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" />
        </Field>
        <Field label="LP End">
          <input type="date" value={form.lpEnd} onChange={(e) => setForm((f) => ({ ...f, lpEnd: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" />
        </Field>
        <Field label="Primary Network">
          <select value={form.primaryNetwork} onChange={(e) => setForm((f) => ({ ...f, primaryNetwork: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white">
            {networks.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Authorized Networks">
          <select value={form.authorizedNetworks} onChange={(e) => setForm((f) => ({ ...f, authorizedNetworks: e.target.value }))} className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white">
            <option value="">Select</option>
            {networks.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Delivery Date" required>
        <div className="flex items-center gap-3">
          <input type="date" value={form.deliveryDate} onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))} className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white" />
          <label className="flex items-center gap-1 text-sm text-gray-300">
            <input type="checkbox" checked={form.deliveryNotConfirmed} onChange={(e) => setForm((f) => ({ ...f, deliveryNotConfirmed: e.target.checked }))} />
            Not Confirmed
          </label>
        </div>
      </Field>

      <div className="mb-3">
        <span className="text-xs text-gray-400">Air date</span>
        <div className="mt-1 max-h-36 overflow-y-auto rounded border border-gray-600">
          <table className="w-full text-xs text-gray-300">
            <thead className="sticky top-0 bg-gray-800 text-gray-400">
              <tr>
                <th className="px-2 py-1 text-left">Episodes</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Time</th>
                <th className="px-2 py-1 text-left">Network</th>
                <th className="px-2 py-1 text-left">Total Airings</th>
              </tr>
            </thead>
            <tbody>
              {airDates.map((row) => (
                <tr key={row.episode} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="px-2 py-1">{row.episode}</td>
                  <td className="px-2 py-1">{row.date}</td>
                  <td className="px-2 py-1">{row.time}</td>
                  <td className="px-2 py-1">{row.network}</td>
                  <td className="px-2 py-1">{row.totalAirings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white"
        />
      </Field>

      <Field label="Tagging">
        <div className="mb-2 flex gap-4 text-sm">
          <label className="flex items-center gap-1 text-gray-300">
            <input type="radio" checked={form.tagType === 'episode'} onChange={() => setForm((f) => ({ ...f, tagType: 'episode' }))} />
            Tag to Episode
          </label>
          <label className="flex items-center gap-1 text-gray-300">
            <input type="radio" checked={form.tagType === 'series'} onChange={() => setForm((f) => ({ ...f, tagType: 'series' }))} />
            Tag to Series
          </label>
        </div>
        <input
          type="text"
          placeholder="Ep no."
          value={form.tagEpisode}
          onChange={(e) => setForm((f) => ({ ...f, tagEpisode: e.target.value }))}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
        />
      </Field>
    </div>
  )
}

export default function EventCreateModal({ open, event, onClose, onCommit }) {
  const [activeTab, setActiveTab] = useState('Program')
  const [form, setForm] = useState(null)
  const [programNames, setProgramNames] = useState([])
  const [networks, setNetworks] = useState([])
  const [airDates, setAirDates] = useState([])
  const [formOptions, setFormOptions] = useState({ durations: [], startTimes: [] })

  useEffect(() => {
    if (!open) return
    Promise.all([
      fetchProgramDefaults(event),
      fetchProgramNames(),
      fetchNetworks(),
      fetchAirDates(),
      fetchFormOptions(),
    ]).then(([defaults, names, nets, airs, opts]) => {
      setForm({
        ...defaults,
        episodes: event?.weekCount ? String(event.weekCount) : defaults.episodes,
        telecastStart: event?.startDate ?? defaults.telecastStart,
        telecastEnd: event?.endDate ?? defaults.telecastEnd,
        startTime: event?.startTime ?? defaults.startTime,
      })
      setProgramNames(names)
      setNetworks(nets)
      setAirDates(airs)
      setFormOptions(opts)
    })
  }, [open, event])

  if (!open || !form) return null

  const handleCommit = () => {
    const startMins = Number(form.startTime?.split(':')[0] ?? 8) * 60 + Number(form.startTime?.split(':')[1] ?? 0)
    const endMins = startMins + Number(form.duration)
    const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`
    const episodeCount = Number(form.episodes) || event?.weekCount || 1
    const baseSegment = Number(form.season) * 100 || 101
    const segments = event?.segments?.length
      ? event.segments
      : Array.from({ length: episodeCount }, (_, i) => baseSegment + i)

    onCommit({
      id: event?.id ?? `evt_${Date.now()}`,
      title: form.programName.trim() || 'Untitled Program',
      dayName: event?.dayName ?? 'Monday',
      startDate: form.telecastStart,
      endDate: form.telecastEnd,
      startTime: form.startTime,
      endTime,
      color: event?.color ?? '#f5a623',
      segments,
      programId: event?.programId ?? 'custom',
      formData: form,
      weekCount: episodeCount,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border-2 border-purple-500 bg-[#2a2a2a] shadow-2xl">
        <TabBar active={activeTab} onChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'Program'
            ? <ProgramPanel form={form} setForm={setForm} programNames={programNames} formOptions={formOptions} />
            : <MiscPanel form={form} setForm={setForm} networks={networks} airDates={airDates} />}
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-600 p-4">
          <button type="button" onClick={onClose} className="rounded border border-gray-500 px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400">Close</button>
          <button type="button" onClick={handleCommit} className="rounded bg-purple-600 px-6 py-2 text-sm text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300">Commit</button>
        </div>
      </div>
    </div>
  )
}
