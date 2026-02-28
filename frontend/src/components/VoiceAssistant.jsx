import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Brain, Activity } from 'lucide-react';
import Vapi from '@vapi-ai/web';

const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '59fdf62a-b4ee-474b-85ac-d9a897e31054';
const vapi = new Vapi(vapiPublicKey);

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeCall, setActiveCall] = useState(null);

    useEffect(() => {
        vapi.on('call-start', () => {
            setIsListening(true);
            setLoading(false);
        });

        vapi.on('call-end', () => {
            setIsListening(false);
            setLoading(false);
            setActiveCall(null);
        });

        vapi.on('error', (e) => {
            console.error('Vapi Error:', e);
            setIsListening(false);
            setLoading(false);
        });

        return () => {
            vapi.stop();
        };
    }, []);

    const toggleCall = async () => {
        if (isListening) {
            vapi.stop();
        } else {
            setLoading(true);
            try {
                // Starting a call with the specified Org ID if needed, 
                // but usually Public Key is enough if an assistant is configured.
                // Since no assistant ID was provided, we'll try to start a default.
                const call = await vapi.start({
                    model: {
                        provider: 'openai',
                        model: 'gpt-4o',
                        messages: [
                            { role: 'system', content: "You are a helpful AI study twin. Explain concepts clearly and concisely." }
                        ]
                    },
                    voice: {
                        provider: '11labs',
                        voiceId: 'paula'
                    },
                    firstMessage: "Hello! I'm your AI study twin. How can I help you learn today?",
                    transcriber: { // Corrected from 'transcription' to 'transcriber'
                        provider: 'deepgram',
                        model: 'nova-2', // Added model as per new structure
                        language: 'en-US'
                    }
                });
                setActiveCall(call);
            } catch (err) {
                console.error("Vapi Start Error:", err);
                if (err.context) console.error("Error Context:", JSON.stringify(err.context, null, 2));
                setError("Failed to start voice session. Check console for details.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="card text-center p-12">
                <div className="flex justify-center mb-8">
                    <div className={`p-8 rounded-full transition-all duration-500 ${isListening ? 'bg-indigo-500 animate-pulse text-white scale-110 shadow-lg shadow-indigo-500/50' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {isListening ? <Activity size={48} /> : <Brain size={48} />}
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">Voice AI Tutor</h1>
                <p className="text-slate-400 mb-12 max-w-lg mx-auto">
                    Engage in a real-time conversation with your AI twin using Vapi AI. Ask questions, get explanations, and learn faster.
                </p>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={toggleCall}
                        disabled={loading}
                        className={`px-12 py-5 rounded-2xl flex items-center gap-3 text-xl font-bold transition-all ${isListening ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20 shadow-xl' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (isListening ? <MicOff size={24} /> : <Mic size={24} />)}
                        {loading ? 'Initializing...' : (isListening ? 'Stop Conversation' : 'Start Talking')}
                    </button>

                    {isListening && (
                        <div className="flex items-center gap-2 text-indigo-400 animate-bounce">
                            <span>Assistant is active...</span>
                        </div>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <FeatureBox
                        icon={<Volume2 className="text-indigo-400" />}
                        title="Natural Voice"
                        desc="Low latency real-time interaction powered by Vapi."
                    />
                    <FeatureBox
                        icon={<Brain className="text-emerald-400" />}
                        title="Deep Insights"
                        desc="The AI twin understands your learning context."
                    />
                    <FeatureBox
                        icon={<Activity className="text-amber-400" />}
                        title="Adaptive"
                        desc="Adjusts explanations based on your questions."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureBox = ({ icon, title, desc }) => (
    <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default VoiceAssistant;
