import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import {
    BarChart3,
    Timer,
    BookOpen,
    Brain,
    Camera,
    Mic,
    LogOut
} from 'lucide-react';
import { studyService, quizService, mlService } from '../services/api';
import StudyTimer from '../components/StudyTimer';
import NotesGenerator from '../components/NotesGenerator';
import FocusTracker from '../components/FocusTracker';
import StudyBarChart from '../charts/StudyBarChart';
import VoiceAssistant from '../components/VoiceAssistant';
import QuizEngine from '../components/QuizEngine';

const Dashboard = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <BarChart3 size={20} />, label: 'Overview', path: '/dashboard' },
        { icon: <Timer size={20} />, label: 'Study Timer', path: '/dashboard/timer' },
        { icon: <BookOpen size={20} />, label: 'Notes Gen', path: '/dashboard/notes' },
        { icon: <Brain size={20} />, label: 'Quizzes', path: '/dashboard/quizzes' },
        { icon: <Camera size={20} />, label: 'Focus Tracker', path: '/dashboard/focus' },
        { icon: <Mic size={20} />, label: 'AI Assistant', path: '/dashboard/voice' },
    ];

    return (
        <div className="flex h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-700 bg-[#1e293b] flex flex-col">
                <div className="p-6 flex items-center gap-2 font-bold text-xl text-indigo-400">
                    <Brain size={28} />
                    <span>AI Twin</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/timer" element={<StudyTimer />} />
                    <Route path="/notes" element={<NotesGenerator />} />
                    <Route path="/focus" element={<FocusTracker />} />
                    <Route path="/quizzes" element={<QuizEngine />} />
                    <Route path="/voice" element={<VoiceAssistant />} />
                </Routes>
            </main>
        </div>
    );
};



const Overview = () => {
    const [stats, setStats] = useState({
        studyHours: 0,
        quizAccuracy: 0,
        focusScore: 92,
        learningIndex: 0
    });
    const [chartData, setChartData] = useState({ labels: [], values: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, quizzesRes, predictionRes] = await Promise.all([
                    studyService.getSessions(),
                    quizService.getResults(),
                    mlService.getWeaknessPrediction("General") // Mocking default subject
                ]);

                const sessions = sessionsRes.data;
                const quizzes = quizzesRes.data;
                const prediction = predictionRes.data;

                // Calculate Total Hours
                const totalMins = sessions.reduce((acc, s) => acc + (s.time_spent || 0), 0);
                const totalHours = (totalMins / 60).toFixed(1);

                // Calculate Avg Accuracy
                const avgAccuracy = quizzes.length > 0
                    ? (quizzes.reduce((acc, q) => acc + (q.score || 0), 0) / quizzes.length).toFixed(0)
                    : 0;

                // Group hours by subject for chart
                const subjectMap = {};
                sessions.forEach(s => {
                    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (s.time_spent / 60);
                });

                setStats({
                    studyHours: totalHours,
                    quizAccuracy: avgAccuracy,
                    focusScore: prediction.confidence_score * 100 || 92,
                    learningIndex: (totalHours * 1 + avgAccuracy * 0.1).toFixed(1)
                });

                setChartData({
                    labels: Object.keys(subjectMap).length > 0 ? Object.keys(subjectMap) : ["No Data"],
                    values: Object.values(subjectMap).length > 0 ? Object.values(subjectMap) : [0]
                });

            } catch (err) {
                console.error("Error fetching overview data", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold">Learning Overview</h1>
                <p className="text-slate-400">Welcome back, {localStorage.getItem('username') || 'Scientist'}!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Study Hours" value={`${stats.studyHours}h`} trend="+0.0h" />
                <StatCard label="Quiz Accuracy" value={`${stats.quizAccuracy}%`} trend="+0%" />
                <StatCard label="Focus Score" value={`${stats.focusScore}/100`} trend="0" />
                <StatCard label="Learning Index" value={stats.learningIndex} trend="+0.0" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">Study Habits by Subject</h3>
                    <StudyBarChart chartData={chartData} />
                </div>
                <div className="card flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-48 h-48 rounded-full border-8 border-indigo-500/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent animate-spin-slow text-indigo-400"></div>
                        <div className="text-4xl font-bold">{stats.quizAccuracy}%</div>
                    </div>
                    <h3 className="text-xl font-bold mt-8">AI Weakness Prediction</h3>
                    <p className="text-slate-400 mt-2">Based on your activity, we are analyzing your performance patterns.</p>
                    <div className="mt-6 flex gap-3">
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs">AI Twin Insight</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend }) => (
    <div className="card">
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend}
            </span>
        </div>
    </div>
);

export default Dashboard;
