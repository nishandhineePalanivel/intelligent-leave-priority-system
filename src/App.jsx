import React, { useState } from 'react';
import { LeaveProvider, useLeave } from './context/LeaveContext';
import Navbar from './components/Navbar';
import QueueList from './components/QueueList';
import RequestDetailModal from './components/RequestDetailModal';
import StudentApplyModal from './components/StudentApplyModal';
import AdminConfigModal from './components/AdminConfigModal';
import FairnessPolicyModal from './components/FairnessPolicyModal';
import AnalyticsView from './components/AnalyticsView';
import { LayoutGrid, BarChart2, ShieldCheck, Sparkles, PlusCircle } from 'lucide-react';

function DashboardContent() {
  const { activeRole } = useLeave();
  const [activeTab, setActiveTab] = useState('QUEUE'); // 'QUEUE', 'ANALYTICS'

  // Modals
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navbar with Role Switcher & Modal Triggers */}
      <Navbar
        onOpenApply={() => setIsApplyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFairness={() => setIsFairnessOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'QUEUE'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Prioritized Leave Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'ANALYTICS'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>System Analytics & Trends</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 5-Factor Scoring Active
            </span>
          </div>
        </div>

        {/* View Switcher Content */}
        {activeTab === 'QUEUE' && (
          <QueueList onInspectRequest={(req) => setSelectedRequest(req)} />
        )}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <p>© 2026 Intelligent Leave Priority System — Queue Prioritization for Educational Institutions.</p>
          <p className="text-slate-400 italic">"Priority determines review order, not approval outcome."</p>
        </div>
      </footer>

      {/* Modals */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {isApplyOpen && (
        <StudentApplyModal
          onClose={() => setIsApplyOpen(false)}
        />
      )}

      {isAdminOpen && (
        <AdminConfigModal
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {isFairnessOpen && (
        <FairnessPolicyModal
          onClose={() => setIsFairnessOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LeaveProvider>
      <DashboardContent />
    </LeaveProvider>
  );
}
