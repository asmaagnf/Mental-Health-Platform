"use client"

import { useState, useEffect } from "react"
import { Brain, Heart, Zap } from "lucide-react"
import DashboardSummary from "../../components/layout/health-tracker/dashboard-summary"
import MoodTracker from "../../components/layout/health-tracker/mood-tracker"
import SymptomTracker from "../../components/layout/health-tracker/symptom-tracker"
import { jwtDecode } from 'jwt-decode'



export default function HealthTrackerPage() {
  const [activeTab, setActiveTab] = useState("mood")
  const [loading, setLoading] = useState(true)
  const [patientId, setPatientId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No JWT token found")
      setLoading(false)
      return
    }

    try {
      const decoded = jwtDecode<{ userId: string }>(token)
       console.log("Decoded JWT:", decoded)
      if (decoded.userId) {
        setPatientId(decoded.userId)
      } else {
        console.error("Patient ID not found in token payload")
      }
    } catch (error) {
      console.error("Failed to decode JWT", error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <span className="ml-3 text-slate-600">Loading...</span>
      </div>
    )
  }

  if (!patientId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">Unable to retrieve patient information. Please log in again.</p>
      </div>
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <style jsx>{`
        .card {
          background-color: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          text-decoration: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
          color: #fff;
          border: none;
          box-shadow: 0 4px 14px 0 rgba(20, 184, 166, 0.39);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
          box-shadow: 0 6px 20px rgba(20, 184, 166, 0.4);
          transform: translateY(-2px);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .btn-outline {
          background-color: #fff;
          color: #475569;
          border: 2px solid #e2e8f0;
        }
        .btn-outline:hover {
          background-color: #f8fafc;
          border-color: #14b8a6;
          color: #14b8a6;
        }
        .form-input,
        .form-select,
        .form-textarea {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          line-height: 1.5;
          color: #1e293b;
          background-color: #fff;
          transition: all 0.15s ease-in-out;
        }
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }
        .gradient-bg {
          background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
        }
        .mood-bubble {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .mood-bubble:hover {
          transform: scale(1.1);
        }
        .mood-bubble.selected {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
        }
        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* Enhanced Header with Gradient */}
      <div className="mb-8">
        <div className="gradient-bg rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center">
                  <Brain className="mr-3 h-10 w-10" />
                  Health Tracker
                </h1>
                <p className="text-xl text-teal-100 max-w-2xl">
                  Monitor your mental health journey with our comprehensive tracking tools
                </p>
              </div>
              <div className="float-animation">
                <Heart className="h-16 w-16 text-teal-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <DashboardSummary />

      {/* Enhanced Tabs */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-8 font-semibold text-sm border-b-3 transition-all duration-200 ${
                activeTab === "mood"
                  ? "border-teal-500 text-teal-600 bg-teal-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
              onClick={() => setActiveTab("mood")}
            >
              <Heart className="inline-block w-4 h-4 mr-2" />
              Mood Tracker
            </button>
            <button
              className={`py-4 px-8 font-semibold text-sm border-b-3 transition-all duration-200 ${
                activeTab === "symptoms"
                  ? "border-teal-500 text-teal-600 bg-teal-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
              onClick={() => setActiveTab("symptoms")}
            >
              <Zap className="inline-block w-4 h-4 mr-2" />
              Symptoms
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === "mood" && <MoodTracker  />}
        {activeTab === "symptoms" && <SymptomTracker  />}
      </div>
    </div>
  )
}