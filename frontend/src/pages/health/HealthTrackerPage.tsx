import React, { useState } from 'react';
import { Calendar, BarChart2, Activity, Clock, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data for health tracking
const MOCK_MOOD_DATA = [
  { date: '2023-05-01', value: 4, note: 'Feeling good today. Therapy session was productive.' },
  { date: '2023-05-02', value: 3, note: 'Average day, some stress at work.' },
  { date: '2023-05-03', value: 2, note: 'Difficult day, anxiety was higher than usual.' },
  { date: '2023-05-04', value: 3, note: 'Better than yesterday, used breathing techniques.' },
  { date: '2023-05-05', value: 4, note: 'Good day overall, made progress on personal goals.' },
  { date: '2023-05-06', value: 5, note: 'Excellent day! Felt very positive and energetic.' },
  { date: '2023-05-07', value: 4, note: 'Good day, enjoyed time with friends.' },
];

const MOOD_LEVELS = [
  { value: 1, label: 'Very Low', color: 'bg-red-500' },
  { value: 2, label: 'Low', color: 'bg-orange-500' },
  { value: 3, label: 'Average', color: 'bg-yellow-500' },
  { value: 4, label: 'Good', color: 'bg-green-500' },
  { value: 5, label: 'Excellent', color: 'bg-teal-500' },
];

const MOCK_SYMPTOMS = [
  { id: 1, name: 'Anxiety', entries: [
    { date: '2023-05-01', severity: 2 },
    { date: '2023-05-02', severity: 3 },
    { date: '2023-05-03', severity: 4 },
    { date: '2023-05-04', severity: 3 },
    { date: '2023-05-05', severity: 2 },
    { date: '2023-05-06', severity: 1 },
    { date: '2023-05-07', severity: 2 },
  ]},
  { id: 2, name: 'Insomnia', entries: [
    { date: '2023-05-01', severity: 3 },
    { date: '2023-05-02', severity: 3 },
    { date: '2023-05-03', severity: 4 },
    { date: '2023-05-04', severity: 4 },
    { date: '2023-05-05', severity: 3 },
    { date: '2023-05-06', severity: 2 },
    { date: '2023-05-07', severity: 2 },
  ]},
  { id: 3, name: 'Fatigue', entries: [
    { date: '2023-05-01', severity: 2 },
    { date: '2023-05-02', severity: 3 },
    { date: '2023-05-03', severity: 4 },
    { date: '2023-05-04', severity: 3 },
    { date: '2023-05-05', severity: 3 },
    { date: '2023-05-06', severity: 2 },
    { date: '2023-05-07', severity: 1 },
  ]},
];

const HealthTrackerPage: React.FC = () => {
  const [moodValue, setMoodValue] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [activeTab, setActiveTab] = useState('mood');
  
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate averages and trends
  const calculateMoodAverage = () => {
    const sum = MOCK_MOOD_DATA.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / MOCK_MOOD_DATA.length).toFixed(1);
  };
  
  const getMoodTrend = () => {
    if (MOCK_MOOD_DATA.length < 2) return 'neutral';
    const lastTwoMoods = [MOCK_MOOD_DATA[MOCK_MOOD_DATA.length - 1], MOCK_MOOD_DATA[MOCK_MOOD_DATA.length - 2]];
    if (lastTwoMoods[0].value > lastTwoMoods[1].value) return 'up';
    if (lastTwoMoods[0].value < lastTwoMoods[1].value) return 'down';
    return 'neutral';
  };
  
  // Mock function to handle mood submission
  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mood logged: ${moodValue} - ${moodNote}`);
    setMoodNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Health Tracker</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Monitor your mental health journey with our comprehensive tracking tools.
        </p>
      </div>
      
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Mood Average</h3>
            <BarChart2 className="h-6 w-6 text-teal-500" />
          </div>
          <div className="flex items-end">
            <span className="text-4xl font-bold text-slate-900">{calculateMoodAverage()}</span>
            <span className="ml-2 text-slate-500 mb-1">/ 5</span>
            {getMoodTrend() === 'up' && <TrendingUp className="ml-4 h-6 w-6 text-green-500" />}
            {getMoodTrend() === 'down' && <TrendingDown className="ml-4 h-6 w-6 text-red-500" />}
          </div>
          <p className="text-sm text-slate-500 mt-2">Based on your last 7 entries</p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Symptom Trend</h3>
            <Activity className="h-6 w-6 text-teal-500" />
          </div>
          <div className="text-4xl font-bold text-slate-900">
            <span className="text-green-500">↓</span> 18%
          </div>
          <p className="text-sm text-slate-500 mt-2">Anxiety symptoms decreased</p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Next Session</h3>
            <Calendar className="h-6 w-6 text-teal-500" />
          </div>
          <div className="text-xl font-medium text-slate-900">May 15, 2023</div>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 text-slate-400 mr-1" />
            <span className="text-slate-600">10:00 AM with Dr. Johnson</span>
          </div>
          <button className="btn btn-outline text-sm mt-3">View Details</button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'mood'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('mood')}
            >
              Mood Tracker
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'symptoms'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('symptoms')}
            >
              Symptoms
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'goals'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('goals')}
            >
              Goals & Progress
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'mood' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mood Entry Form */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Log Today's Mood</h3>
                <form onSubmit={handleMoodSubmit}>
                  <div className="mb-6">
                    <label className="form-label">How are you feeling today?</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {MOOD_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          className={`py-2 rounded-md transition-all ${
                            moodValue === level.value
                              ? `${level.color} text-white`
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          onClick={() => setMoodValue(level.value)}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="moodNote" className="form-label">Notes (optional)</label>
                    <textarea
                      id="moodNote"
                      rows={3}
                      className="form-input"
                      placeholder="What's contributing to your mood today?"
                      value={moodNote}
                      onChange={(e) => setMoodNote(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="w-full btn btn-primary">
                    Save Mood Entry
                  </button>
                </form>
              </div>
              
              {/* Mood Visualization */}
              <div className="lg:col-span-2">
                <div className="card p-6 h-full">
                  <h3 className="text-lg font-medium text-slate-900 mb-6">Mood History</h3>
                  
                  <div className="relative h-60 mb-6">
                    <div className="absolute inset-0 flex items-end">
                      {MOCK_MOOD_DATA.map((entry, index) => (
                        <div 
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div 
                            className={`w-8 rounded-t-md ${MOOD_LEVELS.find(m => m.value === entry.value)?.color}`} 
                            style={{ height: `${entry.value * 20}%` }}
                          ></div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className="absolute inset-y-0 left-0 w-12 flex flex-col justify-between">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <div key={value} className="text-xs text-slate-400 -ml-8">
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h4 className="text-md font-medium text-slate-900 mb-3">Recent Entries</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {MOCK_MOOD_DATA.slice().reverse().map((entry, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-slate-50 rounded-md">
                        <div 
                          className={`w-4 h-4 rounded-full mr-3 ${MOOD_LEVELS.find(m => m.value === entry.value)?.color}`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">{entry.note}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'symptoms' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_SYMPTOMS.map((symptom) => (
                <div key={symptom.id} className="card p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">{symptom.name}</h3>
                  <div className="relative h-40 mb-4">
                    <div className="absolute inset-0 flex items-end">
                      {symptom.entries.map((entry, index) => (
                        <div 
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div 
                            className={`w-6 rounded-t-md ${
                              entry.severity <= 2 ? 'bg-green-500' : 
                              entry.severity === 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ height: `${entry.severity * 25}%` }}
                          ></div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(' ')[1]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500">Current severity:</p>
                      <p className="font-medium">{
                        symptom.entries[symptom.entries.length - 1].severity <= 2 ? 'Mild' : 
                        symptom.entries[symptom.entries.length - 1].severity === 3 ? 'Moderate' : 'Severe'
                      }</p>
                    </div>
                    <button className="btn btn-outline text-sm">Log Today</button>
                  </div>
                </div>
              ))}
              
              <div className="card p-6 border-dashed border-2 border-slate-300 flex flex-col items-center justify-center text-center">
                <div className="text-slate-400 mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Add New Symptom</h3>
                <p className="text-sm text-slate-500 mb-4">Track additional symptoms you want to monitor</p>
                <button className="btn btn-outline">Add Symptom</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div className="animate-fade-in">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Goals & Progress Tracking</h3>
              <p className="text-slate-600 mb-6">Set personal goals and track your progress over time.</p>
              <button className="btn btn-primary">Set Your First Goal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTrackerPage;