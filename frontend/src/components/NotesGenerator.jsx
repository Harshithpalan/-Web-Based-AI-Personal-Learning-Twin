import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, Loader2 } from 'lucide-react';
import { aiService } from '../services/api';

const NotesGenerator = () => {
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const { data } = await aiService.generateNotes(topic);
            setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="text-indigo-400" />
                    AI Notes Generator
                </h1>
                <p className="text-slate-400 mb-8">Enter a topic and let our AI twin create structured study material for you.</p>

                <div className="flex w-full max-w-xl gap-4">
                    <input
                        type="text"
                        placeholder="e.g. Thermodynamics, Photosynthesis, Organic Chemistry..."
                        className="input-field flex-1 text-lg py-3"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-primary whitespace-nowrap px-8 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>

            {notes && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-indigo-400">Summary</h2>
                        <p className="text-slate-300 leading-relaxed">{notes.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 text-emerald-400">Key Concepts</h2>
                            <ul className="list-disc list-inside space-y-2 text-slate-300">
                                {notes.key_concepts.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 text-amber-400">Formulas</h2>
                            <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
                                {notes.formulas.map((f, i) => <div key={i} className="mb-2 last:mb-0">{f}</div>)}
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-rose-400">Practice Problems</h2>
                        <div className="space-y-4">
                            {notes.examples.map((ex, i) => (
                                <div key={i} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <p className="text-slate-300">{ex}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesGenerator;
