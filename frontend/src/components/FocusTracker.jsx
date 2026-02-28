import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { focusService } from '../services/api';

const FocusTracker = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [focusScore, setFocusScore] = useState(100);
    const [isTracking, setIsTracking] = useState(false);
    const [status, setStatus] = useState('Off');

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsTracking(true);
                setStatus('Tracking');
            }
        } catch (err) {
            console.error("Camera access denied", err);
            alert("Camera access is required for focus tracking.");
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach(track => track.stop());
        setIsTracking(false);
        setStatus('Off');
    };

    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(async () => {
                if (videoRef.current && canvasRef.current) {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);

                    const frame = canvas.toDataURL('image/jpeg', 0.5);
                    try {
                        const { data } = await focusService.detectFocus(frame);
                        setFocusScore(data.focus_score);
                        if (data.focus_score < 40) setStatus('Distracted');
                        else setStatus('Focused');
                    } catch (err) {
                        console.error(err);
                    }
                }
            }, 3000); // Check every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isTracking]);

    return (
        <div className="max-w-4xl mx-auto py-8 text-center">
            <h1 className="text-3xl font-bold mb-8">Webcam Focus Detection</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="card overflow-hidden relative bg-black flex items-center justify-center min-h-[300px]">
                    <video
                        ref={videoRef}
                        autoPlay
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    {!isTracking && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
                            <Camera size={48} className="text-slate-600 mb-4" />
                            <button onClick={startCamera} className="btn-primary">Turn on Camera</button>
                        </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="card flex-1 flex flex-col items-center justify-center p-8">
                        <p className="text-slate-400 mb-2 uppercase text-xs tracking-widest">Real-time Focus Score</p>
                        <div className={`text-7xl font-bold ${focusScore > 70 ? 'text-emerald-400' : focusScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {focusScore}%
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full mt-6">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${focusScore > 70 ? 'bg-emerald-500' : focusScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${focusScore}%` }}
                            />
                        </div>
                    </div>

                    <div className="card flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="font-medium">Status: {status}</span>
                        </div>
                        {isTracking && (
                            <button onClick={stopCamera} className="text-slate-500 hover:text-white transition-colors">
                                Stop Tracking
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-indigo-300 flex items-start gap-4 text-left">
                <AlertCircle />
                <p className="text-sm">
                    Our AI model monitors your eye gaze and head pose to calculate your focus levels.
                    This data is processed in real-time to help you stay productive.
                    No video data is stored on our servers.
                </p>
            </div>
        </div>
    );
};

export default FocusTracker;
