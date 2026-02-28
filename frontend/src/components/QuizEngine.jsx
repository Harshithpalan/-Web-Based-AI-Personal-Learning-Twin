import React, { useState } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { aiService, quizService } from '../services/api';

const QuizEngine = () => {
    const [topic, setTopic] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0: input, 1: quiz, 2: result
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);

    const generateQuiz = async (difficulty = 'Medium') => {
        if (!topic) return;
        setLoading(true);
        try {
            const { data } = await aiService.generateQuiz(topic, difficulty);
            setQuiz(data);
            setCurrentStep(1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        let sc = 0;
        quiz.mcqs.forEach((q, i) => {
            if (answers[i] === q.answer) sc++;
        });
        const finalScore = (sc / quiz.mcqs.length) * 100;
        setScore(finalScore);

        try {
            await quizService.saveResult({
                subject: topic || "General",
                topic,
                score: finalScore,
                total_questions: quiz.mcqs.length,
                difficulty: quiz.difficulty || 'Medium'
            });
        } catch (err) {
            console.error('Failed to save quiz result to backend', err);
        }

        setCurrentStep(2);
    };

    if (currentStep === 0) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="bg-indigo-600/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-400">
                    <Brain size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Adaptive AI Quiz</h1>
                <p className="text-slate-400 mb-10">Generate a personalized quiz to test your knowledge.</p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Topic (e.g. Calculus)"
                        className="input-field flex-1"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                        onClick={() => generateQuiz()}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                        Start
                    </button>
                </div>
            </div>
        );
    }

    if (currentStep === 1) {
        return (
            <div className="max-w-3xl mx-auto py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Quiz: {topic}</h2>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">Medium Difficulty</span>
                </div>

                <div className="space-y-8">
                    {quiz.mcqs.map((q, i) => (
                        <div key={i} className="card">
                            <p className="text-lg font-medium mb-4">{i + 1}. {q.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oi) => (
                                    <button
                                        key={oi}
                                        onClick={() => setAnswers({ ...answers, [i]: opt })}
                                        className={`p-4 rounded-xl border text-left transition-all ${answers[i] === opt ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-400'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="card">
                        <h3 className="text-lg font-bold mb-4">Descriptive Questions</h3>
                        <p className="text-slate-400 mb-6 text-sm italic">These won't be auto-graded, but use them for self-reflection.</p>
                        {quiz.descriptive.map((q, i) => (
                            <div key={i} className="mb-4 p-4 bg-slate-900 rounded-lg text-slate-300">
                                {q}
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSubmit} className="btn-primary w-full py-4 text-lg">Submit Quiz</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-20 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {score >= 70 ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            <h1 className="text-4xl font-bold mb-2">Your Score: {score.toFixed(0)}%</h1>
            <p className="text-slate-400 mb-10">
                {score >= 70 ? 'Great job! You have a solid understanding.' : 'Keep practicing! Focus on the key concepts.'}
            </p>
            <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentStep(0)} className="btn-primary">Try Another Topic</button>
                <button
                    onClick={() => generateQuiz(score < 50 ? 'Easy' : score > 80 ? 'Hard' : 'Medium')}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                >
                    Retake (Adaptive)
                </button>
            </div>
        </div>
    );
};

export default QuizEngine;
