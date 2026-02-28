import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Timer as TimerIcon, Trophy } from 'lucide-react';
import { studyService } from '../services/api';

const StudyTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [sessionSaved, setSessionSaved] = useState(false);
    const startTimeRef = useRef(null);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = () => {
        if (!subject || !topic) return alert('Please enter subject and topic');
        setIsActive(true);
        setSessionSaved(false);
        startTimeRef.current = new Date();
    };

    const stopSession = async () => {
        setIsActive(false);
        const endTime = new Date();
        try {
            await studyService.createSession({
                subject,
                topic,
                start_time: startTimeRef.current.toISOString(),
                end_time: endTime.toISOString(),
                time_spent: Math.floor(seconds / 60),
                productivity_rating: 5,
                focus_score: 85
            });
            setSessionSaved(true);
        } catch (err) {
            console.error('Failed to save session to backend', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="card text-center py-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-600/20 p-4 rounded-full text-indigo-400">
                        <TimerIcon size={48} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Subject (e.g. Physics)"
                        className="input-field"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isActive}
                    />
                    <input
                        type="text"
                        placeholder="Topic (e.g. Quantum)"
                        className="input-field"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={isActive}
                    />
                </div>

                <div className="text-8xl font-mono mb-12 font-bold text-white tracking-tighter">
                    {formatTime(seconds)}
                </div>

                <div className="flex justify-center gap-4">
                    {!isActive ? (
                        <button
                            onClick={startSession}
                            className="btn-primary px-10 py-4 flex items-center gap-2 text-lg shadow-indigo-500/20 shadow-xl"
                        >
                            <Play size={24} />
                            Start Study Session
                        </button>
                    ) : (
                        <button
                            onClick={stopSession}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-lg flex items-center gap-2 text-lg transition-all"
                        >
                            <Square size={24} />
                            End Session
                        </button>
                    )}
                </div>

                {sessionSaved && (
                    <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex items-center justify-center gap-2 max-w-md mx-auto">
                        <Trophy size={20} />
                        Session saved successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyTimer;
