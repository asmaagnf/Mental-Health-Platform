"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Zap, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { api, type SymptomEntry } from "../../../lib/api"
import { getTrackedSymptoms } from "../../../lib/api"
import {jwtDecode} from 'jwt-decode';

const SYMPTOM_SEVERITY_LABELS: { [key: number]: string } = {
  1: "Minimal",
  2: "Mild",
  3: "Moderate",
  4: "Severe",
  5: "Critical",
}

const SUGGESTED_SYMPTOMS = [
  { nom: "Anxiety", emoji: "😥" },
  { nom: "Insomnia", emoji: "😴" },
  { nom: "Fatigue", emoji: "😴" },
  { nom: "Headache", emoji: "🤕" },
  { nom: "Stress", emoji: "😩" },
  { nom: "Sadness", emoji: "😞" },
  { nom: "Irritability", emoji: "😠" },
  { nom: "Nausea", emoji: "🤢" },
  { nom: "Dizziness", emoji: "💫" },
  { nom: "Muscle Pain", emoji: "💪" },
  { nom: "Stomach Ache", emoji: "😖" },
]

type JwtPayload = {
  userId?: string
}

export default function SymptomTracker() {
  const [patientId, setPatientId] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [showAddSymptomForm, setShowAddSymptomForm] = useState(false)
  const [newSymptomName, setNewSymptomName] = useState("")
  const [newSymptomEmoji, setNewSymptomEmoji] = useState("")
  const [addSymptomLoading, setAddSymptomLoading] = useState(false)
  const [selectedSuggestedSymptom, setSelectedSuggestedSymptom] = useState<{ nom: string; emoji: string } | null>(null)

  const [showLogSymptomForm, setShowLogSymptomForm] = useState<number | null>(null)
  const [logSeverity, setLogSeverity] = useState(3)
  const [logSymptomLoading, setLogSymptomLoading] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  // Decode JWT from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No patient token found in localStorage")
      setLoading(false)
      return
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      if (decoded.userId) {
        setPatientId(decoded.userId)
      } else {
        setError("Patient ID not found in token")
      }
    } catch (err) {
      setError("Invalid patient token")
    }
  }, [])

  // Fetch symptoms once patientId is known
  useEffect(() => {
    const fetchTrackedSymptoms = async () => {
      if (!patientId) return
      setLoading(true)
      try {
      
     const tracked = await getTrackedSymptoms(patientId)
const symptomPromises = tracked.map(async (symptom: { nom: string }) => {
  const history = await api.getSymptomHistory(patientId, symptom.nom)
  return {
    id: Math.random(), // à remplacer par vrai ID si backend te le donne
    nom: symptom.nom,
    patientId,
    emoji: SUGGESTED_SYMPTOMS.find((s) => s.nom === symptom.nom)?.emoji || "🩺",
    entries: history.history.map((h) => ({ date: h.date, severity: h.intensite })),
  }
})

        const fetchedSymptoms = await Promise.all(symptomPromises)
        setSymptoms(fetchedSymptoms)
      } catch (err) {
        console.error("Failed to load symptoms:", err)
        setError("Failed to load symptoms.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrackedSymptoms()
  }, [patientId])

  const calculateIntensityTrend = (entries: { date: string; severity: number }[]) => {
    const relevantEntries = entries.slice(Math.max(0, entries.length - 7))
    if (relevantEntries.length < 2) return { status: "stable", change: 0, percentageChange: 0 }

    const recent = relevantEntries.slice(-3)
    const averageRecent = recent.reduce((sum, entry) => sum + entry.severity, 0) / recent.length

    const previousEntries = relevantEntries.slice(0, Math.max(0, relevantEntries.length - 3))
    const averagePrevious =
      previousEntries.length > 0
        ? previousEntries.reduce((sum, entry) => sum + entry.severity, 0) / previousEntries.length
        : averageRecent

    const change = averageRecent - averagePrevious
    const percentageChange = previousEntries.length > 0 && averagePrevious !== 0 ? (change / averagePrevious) * 100 : 0

    let status: "increasing" | "decreasing" | "stable" = "stable"
    if (change > 0.5) status = "increasing"
    if (change < -0.5) status = "decreasing"

    return { status, change, percentageChange: Math.abs(percentageChange) }
  }

  const handleAddSymptomClick = () => {
    setShowAddSymptomForm(true)
    setError(null)
    setNewSymptomName("")
    setNewSymptomEmoji("")
    setSelectedSuggestedSymptom(null)
  }

  const handleCancelAddSymptom = () => {
    setShowAddSymptomForm(false)
    setNewSymptomName("")
    setNewSymptomEmoji("")
    setError(null)
    setSelectedSuggestedSymptom(null)
  }

  const handleSelectSuggestedSymptom = (symptom: { nom: string; emoji: string }) => {
    setSelectedSuggestedSymptom(symptom)
    setNewSymptomName(symptom.nom)
    setNewSymptomEmoji(symptom.emoji)
  }

  const handleSubmitNewSymptom = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddSymptomLoading(true)
    setError(null)

    if (!newSymptomName.trim()) {
      setError("Please enter a symptom name.")
      setAddSymptomLoading(false)
      return
    }

    try {
      const newSymptom = await api.addSymptom(patientId!, newSymptomName)
      const symptomWithEmoji = {
        ...newSymptom,
        emoji: newSymptomEmoji || "🩺",
        entries: [],
      }
      setSymptoms((prev) => [...prev, symptomWithEmoji])
      setShowAddSymptomForm(false)
    } catch (err: any) {
      setError(err.message || "Failed to add symptom")
    } finally {
      setAddSymptomLoading(false)
    }
  }

  const handleLogSymptomClick = (symptomId: number) => {
    setShowLogSymptomForm(symptomId)
    setError(null)
    setLogSeverity(3)
  }

  const handleCancelLogSymptom = () => {
    setShowLogSymptomForm(null)
    setError(null)
  }

  const handleSubmitLogSymptom = async (e: React.FormEvent, symptomId: number) => {
    e.preventDefault()
    setLogSymptomLoading(true)
    setError(null)

    const symptomToLog = symptoms.find((s) => s.id === symptomId)
    if (!symptomToLog) {
      setError("Symptom not found.")
      setLogSymptomLoading(false)
      return
    }

    const todayEntryExists = symptomToLog.entries.some((entry) => entry.date === today)
    if (todayEntryExists) {
      setError("An intensity entry for today already exists for this symptom.")
      setLogSymptomLoading(false)
      return
    }

    try {
      await api.logSymptomObservation(patientId!, {
        nomSymptome: symptomToLog.nom,
        intensite: logSeverity,
        date: today,
      })

      setSymptoms((prev) =>
        prev.map((s) =>
          s.id === symptomId
            ? {
                ...s,
                entries: [...s.entries, { date: today, severity: logSeverity }],
              }
            : s
        )
      )

      setShowLogSymptomForm(null)
    } catch (err: any) {
      setError(err.message || "Failed to log symptom")
    } finally {
      setLogSymptomLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center text-slate-500 py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <p className="mt-2">Loading symptoms...</p>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {symptoms.map((symptom) => {
          const hasTodayEntry = symptom.entries.some((entry) => entry.date === today)
          const { status: individualTrendStatus } = calculateIntensityTrend(symptom.entries)
          const last7SymptomEntries = symptom.entries.slice(Math.max(0, symptom.entries.length - 7))

          return (
            <div key={symptom.id} className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-8 -mt-8"></div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  {symptom.emoji && (
                    <span className="mr-3 text-3xl p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
                      {symptom.emoji}
                    </span>
                  )}
                  <div>
                    <div>{symptom.nom}</div>
                    <div className="text-xs text-slate-500 font-normal">{last7SymptomEntries.length} entries</div>
                  </div>
                </h3>
              </div>

              {/* Symptom Graph */}
              <div className="relative h-56 mb-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-4 overflow-hidden">
                {/* Intensity visualization */}
                <div className="absolute inset-0 left-16 flex items-end justify-between px-2">
                  {last7SymptomEntries.map((entry, index) => {
                    const intensityColors = {
                      1: { bg: "from-emerald-400 to-emerald-500", dot: "bg-emerald-500" },
                      2: { bg: "from-lime-400 to-lime-500", dot: "bg-lime-500" },
                      3: { bg: "from-amber-400 to-amber-500", dot: "bg-amber-500" },
                      4: { bg: "from-orange-400 to-orange-500", dot: "bg-orange-500" },
                      5: { bg: "from-red-400 to-red-500", dot: "bg-red-500" },
                    }

                    const colorConfig = intensityColors[entry.severity as keyof typeof intensityColors]
                    const height = entry.severity * 16
                    const displayDate = new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })

                    return (
                      <div key={index} className="flex flex-col items-center group relative" style={{ flex: "1 1 0%" }}>
                        <div
                          className={`w-8 rounded-t-xl bg-gradient-to-t ${colorConfig.bg} shadow-lg relative overflow-hidden group-hover:scale-110 transition-all duration-500`}
                          style={{
                            height: `${height}%`,
                            minHeight: "16px",
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-xs drop-shadow-sm">{entry.severity}</span>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-slate-700 mt-3">{displayDate}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-4 bottom-4 w-16 flex flex-col justify-between">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="flex items-center justify-end pr-2">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700">{SYMPTOM_SEVERITY_LABELS[value]}</div>
                        <div className="text-xs text-slate-500">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend indicator */}
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-slate-600">
                  Last:{" "}
                  {symptom.entries.length > 0
                    ? SYMPTOM_SEVERITY_LABELS[symptom.entries[symptom.entries.length - 1].severity]
                    : "N/A"}
                </span>
                <span
                  className={`font-semibold flex items-center ${
                    individualTrendStatus === "increasing"
                      ? "text-red-500"
                      : individualTrendStatus === "decreasing"
                        ? "text-green-500"
                        : "text-slate-500"
                  }`}
                >
                  {individualTrendStatus === "increasing" && <TrendingUp className="w-4 h-4 mr-1" />}
                  {individualTrendStatus === "decreasing" && <TrendingDown className="w-4 h-4 mr-1" />}
                  {individualTrendStatus === "stable" && <Activity className="w-4 h-4 mr-1" />}
                  {individualTrendStatus.charAt(0).toUpperCase() + individualTrendStatus.slice(1)}
                </span>
              </div>

              {/* Action button */}
              {hasTodayEntry ? (
                <div className="text-center text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                  ✓ Intensity logged for today
                </div>
              ) : (
                <button onClick={() => handleLogSymptomClick(symptom.id!)} className="w-full btn btn-primary">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Today's Intensity
                </button>
              )}
            </div>
          )
        })}

        {/* Add New Symptom Card */}
        <div
          className="card p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-300 cursor-pointer group min-h-[400px]"
          onClick={handleAddSymptomClick}
        >
          <div className="p-6 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full group-hover:scale-110 transition-transform duration-300">
            <PlusCircle className="h-12 w-12 text-teal-600" />
          </div>
          <span className="text-lg font-semibold text-slate-700 mt-4 group-hover:text-teal-600 transition-colors duration-300">
            Add New Symptom
          </span>
          <span className="text-sm text-slate-500 mt-2 text-center">
            Track a new symptom to monitor your health journey
          </span>
        </div>
      </div>

      {/* Add Symptom Modal */}
      {showAddSymptomForm && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center">
              <PlusCircle className="mr-2 h-6 w-6 text-teal-500" />
              Add New Symptom
            </h3>
            <form onSubmit={handleSubmitNewSymptom}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Suggested Symptoms:</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
                  {SUGGESTED_SYMPTOMS.map((sugg) => (
                    <button
                      key={sugg.nom}
                      type="button"
                      className={`px-3 py-2 border rounded-full text-sm cursor-pointer transition-all duration-200 ${
                        selectedSuggestedSymptom?.nom === sugg.nom
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-500 shadow-lg"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-teal-300"
                      }`}
                      onClick={() => handleSelectSuggestedSymptom(sugg)}
                    >
                      {sugg.emoji} {sugg.nom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newSymptomName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Symptom Name
                </label>
                <input
                  type="text"
                  id="newSymptomName"
                  className="form-input"
                  placeholder="e.g., Back Pain, Dizziness"
                  value={newSymptomName}
                  onChange={(e) => setNewSymptomName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="newSymptomEmoji" className="block text-sm font-semibold text-slate-700 mb-2">
                  Emoji (optional)
                </label>
                <input
                  type="text"
                  id="newSymptomEmoji"
                  className="form-input"
                  placeholder="e.g., 🤕, 😵"
                  value={newSymptomEmoji}
                  onChange={(e) => setNewSymptomEmoji(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancelAddSymptom}
                  disabled={addSymptomLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={addSymptomLoading}>
                  {addSymptomLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Symptom
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Symptom Modal */}
      {showLogSymptomForm !== null && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Log Intensity for {symptoms.find((s) => s.id === showLogSymptomForm)?.nom}
            </h3>
            <form onSubmit={(e) => handleSubmitLogSymptom(e, showLogSymptomForm!)}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Intensity Level:</label>
                <select
                  className="form-select"
                  value={logSeverity}
                  onChange={(e) => setLogSeverity(Number.parseInt(e.target.value))}
                  required
                >
                  {Object.entries(SYMPTOM_SEVERITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label} ({value})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancelLogSymptom}
                  disabled={logSymptomLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={logSymptomLoading}>
                  {logSymptomLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Log Intensity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
