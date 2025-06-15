"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, BarChart2 } from "lucide-react"
import { api, type MoodEntry } from "../../../lib/api"
import { jwtDecode } from "jwt-decode"

const MOOD_LEVELS = [
  { value: 1, label: "Very Low", color: "bg-red-500", emoji: "😢", gradient: "from-red-500 to-red-400" },
  { value: 2, label: "Low", color: "bg-orange-500", emoji: "😔", gradient: "from-orange-500 to-orange-400" },
  { value: 3, label: "Average", color: "bg-yellow-500", emoji: "😐", gradient: "from-yellow-500 to-yellow-400" },
  { value: 4, label: "Good", color: "bg-green-500", emoji: "😊", gradient: "from-green-500 to-green-400" },
  { value: 5, label: "Excellent", color: "bg-teal-500", emoji: "😄", gradient: "from-teal-500 to-teal-400" },
]

interface DecodedToken {
  userId: string
}

export default function MoodTracker() {
  const [patientId, setPatientId] = useState<string | null>(null)
  const [moodValue, setMoodValue] = useState(3)
  const [moodNote, setMoodNote] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setPatientId(decoded.userId)
      } catch (err) {
        console.error("Failed to decode JWT:", err)
      }
    }
  }, [])

  useEffect(() => {
    if (patientId) {
      fetchMoodEntries()
    }
  }, [patientId])

  const fetchMoodEntries = async () => {
    try {
      setLoading(true)
      const entries = await api.getMoodEntries(patientId!)
      const sorted = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setMoodEntries(sorted)
    } catch (err) {
      console.error("Error fetching mood entries:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const todayMoodExists = moodEntries.some((entry) => entry.date === today)
    if (todayMoodExists) {
      alert("You have already logged your mood for today!")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const niveau = MOOD_LEVELS.find((m) => m.value === moodValue)?.label.toUpperCase() || "AVERAGE"

      const newEntry = await api.createMoodEntry({
        patientId,
        niveau,
        note: moodNote,
        date: today,
      })

      setMoodEntries((prev) =>
        [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
      setMoodNote("")
      setMoodValue(3)
    } catch (err) {
      setError("Failed to save mood entry")
      console.error("Error creating mood entry:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const getMoodValueFromNiveau = (niveau: string): number => {
    return MOOD_LEVELS.find((m) => m.label.toUpperCase() === niveau.toUpperCase())?.value ?? 3
  }

  const getMoodMeta = (niveau: string) => {
    return MOOD_LEVELS.find((m) => m.label.toUpperCase() === niveau.toUpperCase())
  }

  if (loading) {
    return (
      <div className="text-center text-slate-500 py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <p className="mt-2">Loading mood data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Entry Form */}
        <div className="card p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Heart className="mr-2 h-6 w-6 text-teal-500" />
            Log Today's Mood
          </h3>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleMoodSubmit}>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-4">How are you feeling today?</label>
              <div className="grid grid-cols-5 gap-3">
                {MOOD_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`mood-bubble p-4 rounded-2xl transition-all text-center ${
                      moodValue === level.value
                        ? `bg-gradient-to-br ${level.gradient} text-white shadow-lg`
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setMoodValue(level.value)}
                  >
                    <div className="text-2xl mb-1">{level.emoji}</div>
                    <div className="text-xs font-medium">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="moodNote" className="block text-sm font-semibold text-slate-700 mb-2">
                Notes 
              </label>
              <textarea
                id="moodNote"
                rows={4}
                className="form-textarea"
                placeholder="What's contributing to your mood today?"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="w-full btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Save Mood Entry
                </>
              )}
            </button>
          </form>
        </div>

        {/* Mood Visualization */}
        <div className="lg:col-span-2">
          <div className="card p-8 h-full">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <BarChart2 className="mr-2 h-6 w-6 text-teal-500" />
              Mood Journey (Last 7 Days)
            </h3>

            <div className="relative h-80 mb-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 overflow-hidden">
              {/* Decorative blur */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-teal-200/30 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-200/30 rounded-full blur-xl" />

              <div className="relative h-full flex items-end justify-between z-10">
                {[...moodEntries]
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(-7)
                  .map((entry, index) => {
                    const value = getMoodValueFromNiveau(entry.niveau)
                    const moodMeta = getMoodMeta(entry.niveau)
                    const height = `${value * 30}px` // scaled height

                    return (
                      <div key={index} className="flex flex-col items-center group cursor-pointer">
                        <div className="mb-2 text-2xl group-hover:scale-125 transition-transform">{moodMeta?.emoji}</div>
                        <div
                          className={`w-12 rounded-t-2xl bg-gradient-to-t ${moodMeta?.gradient} shadow-lg relative group-hover:shadow-xl transition-all`}
                          style={{ height }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm drop-shadow">{value}</span>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-slate-600 mt-3 group-hover:scale-110 transition-transform">
                          {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Y-axis */}
              <div className="absolute left-2 top-6 bottom-6 flex flex-col justify-between z-0">
                {[5, 4, 3, 2, 1].map((value) => (
                  <div key={value} className="flex items-center">
                    <span className="text-xs font-medium text-slate-500 mr-2">{value}</span>
                    <div className={`w-2 h-2 rounded-full ${MOOD_LEVELS.find((m) => m.value === value)?.color}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Entries</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {[...moodEntries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry, index) => {
                  const moodMeta = getMoodMeta(entry.niveau)
                  return (
                    <div key={index} className="flex items-start p-4 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex-shrink-0 mr-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodMeta?.gradient} flex items-center justify-center text-white text-lg shadow-md`}
                        >
                          {moodMeta?.emoji}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{moodMeta?.label}</span>
                          <span className="text-sm text-slate-500">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{entry.note}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
