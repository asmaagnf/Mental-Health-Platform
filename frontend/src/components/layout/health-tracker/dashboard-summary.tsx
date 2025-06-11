"use client"

import { useState, useEffect } from "react"
import {jwtDecode} from 'jwt-decode'

import { BarChart2, Activity, Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { api, MoodEntry } from "../../../lib/api"

interface JwtPayload {
  userId: string
}

interface Seance {
  seanceId: string
  therapeuteId: string
  patientId: string
  dateHeure: string
  dureeMinutes: number
  typeSeance: string
  statutSeance: string
  lienVisio: string | null
  urlEnregistrement: string | null
  noteTherapeute: string | null
  createdAt: string
  updatedAt: string
}

interface Therapist {
  id: string
  name: string
  
}

export default function DashboardSummary() {
  const [patientId, setPatientId] = useState<string | null>(null)
  const [moodAverage, setMoodAverage] = useState<string>("N/A")
  const [moodTrend, setMoodTrend] = useState<"up" | "down" | "neutral">("neutral")
  const [loading, setLoading] = useState(true)

  const [nextSession, setNextSession] = useState<Seance | null>(null)
  const [therapistName, setTherapistName] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No JWT token found in localStorage")
      setPatientId(null)
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      setPatientId(decoded.userId)
    } catch (error) {
      console.error("Failed to decode JWT token:", error)
      setPatientId(null)
    }
  }, [])

  useEffect(() => {
    if (!patientId) return
    fetchMoodData()
    fetchNextSession(patientId)
  }, [patientId])

  const fetchMoodData = async () => {
    try {
      setLoading(true)
      if (!patientId) return

      const average = await api.getMoodAverage(patientId, 7)
      setMoodAverage(average.toFixed(1))

      const entries: MoodEntry[] = await api.getMoodEntries(patientId)
      const last7Entries = entries.slice(Math.max(0, entries.length - 7))

      if (last7Entries.length >= 2) {
        const lastTwo = [last7Entries[last7Entries.length - 1], last7Entries[last7Entries.length - 2]]
        const lastNote = parseFloat(lastTwo[0].note)
        const prevNote = parseFloat(lastTwo[1].note)

        if (lastNote > prevNote) setMoodTrend("up")
        else if (lastNote < prevNote) setMoodTrend("down")
        else setMoodTrend("neutral")
      } else {
        setMoodTrend("neutral")
      }
    } catch (error) {
      console.error("Error fetching mood data:", error)
      setMoodAverage("N/A")
      setMoodTrend("neutral")
    } finally {
      setLoading(false)
    }
  }

  const fetchNextSession = async (patientId: string) => {
    try {
      const response = await fetch(`http://localhost:8070/api/seances/patient/${patientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }
      const sessions: Seance[] = await response.json()

      // Filter only future sessions and non-cancelled ones
      const now = new Date()
      const upcomingSessions = sessions
        .filter(s => new Date(s.dateHeure) > now && s.statutSeance !== "ANNULEE")
        .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime())

      if (upcomingSessions.length === 0) {
        setNextSession(null)
        setTherapistName("")
        return
      }

      const next = upcomingSessions[0]
      setNextSession(next)

      // Fetch therapist info
      const therapistResp = await fetch(`http://localhost:8090/api/user/${next.therapeuteId}`)
      if (!therapistResp.ok) {
        throw new Error("Failed to fetch therapist info")
      }
      const therapist: Therapist = await therapistResp.json()
      setTherapistName(`${therapist.name}`)
    } catch (error) {
      console.error("Error fetching next session:", error)
      setNextSession(null)
      setTherapistName("")
    }
  }

  if (!patientId) {
    return <div className="text-center p-6 text-red-500">No valid user session found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Mood Average */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Mood Average</h3>
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex items-end">
          {loading ? (
            <div className="animate-pulse bg-slate-200 h-10 w-16 rounded"></div>
          ) : (
            <>
              <span className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {moodAverage}
              </span>
              <span className="ml-2 text-slate-500 mb-1">/ 5</span>
              {moodTrend === "up" && <TrendingUp className="ml-4 h-6 w-6 text-green-500 pulse-animation" />}
              {moodTrend === "down" && <TrendingDown className="ml-4 h-6 w-6 text-red-500 pulse-animation" />}
            </>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-2">Based on your last 7 entries</p>
      </div>

      {/* Symptom Trend */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Symptom Trend</h3>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-4xl font-bold text-slate-900">
          <span className="text-slate-500">↔</span> 0%
        </div>
        <p className="text-sm text-slate-500 mt-2">Symptoms overall stable</p>
      </div>

      {/* Next Session */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Next Session</h3>
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
        {nextSession ? (
          <>
            <div className="text-xl font-medium text-slate-900">
              {new Date(nextSession.dateHeure).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-slate-400 mr-1" />
              <span className="text-slate-600">
                {new Date(nextSession.dateHeure).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                with {therapistName || "Therapist"}
              </span>
            </div>
            <button className="btn btn-outline text-sm mt-3 w-full">View Details</button>
          </>
        ) : (
          <div className="text-slate-500">No upcoming sessions</div>
        )}
      </div>
    </div>
  )
}
