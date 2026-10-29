import React, { useState } from 'react';
import { InterviewQuestion, InterviewFeedback, UserProfile } from '../types';
import { sampleInterviewQuestions } from '../data/initialData';
import { 
  getStoredLastInterviewFeedback, 
  saveStoredLastInterviewFeedback 
} from '../lib/storage';
import { 
  MessageSquareCode, Sparkles, HelpCircle, Send, CheckCircle2, 
  Lightbulb, RefreshCw, Trophy, Star, ArrowRight, BookOpen, AlertTriangle 
} from 'lucide-react';

interface InterviewPracticeProps {
  userProfile: UserProfile;
}

export const InterviewPractice: React.FC<InterviewPracticeProps> = ({ userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'HR' | 'Coding' | 'Behavioral'>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(getStoredLastInterviewFeedback());

  const filteredQuestions = selectedCategory === 'All'
    ? sampleInterviewQuestions
    : sampleInterviewQuestions.filter(q => q.category === selectedCategory);

  const activeQuestion: InterviewQuestion = filteredQuestions[currentQuestionIndex] || sampleInterviewQuestions[0];

  const handleNextQuestion = () => {
    setFeedback(null);
    setEvalError(null);
    setUserAnswer('');
    setShowHint(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setEvalError(null);

    try {
      const res = await fetch('/api/ai/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          answer: userAnswer.trim(),
          category: activeQuestion.category
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${res.status}`);
      }

      const data = await res.json();
      if (data && typeof data.score === 'number') {
        setFeedback(data);
        saveStoredLastInterviewFeedback(data);
      } else {
        throw new Error('Received unexpected response format from interview evaluator.');
      }
    } catch (err: any) {
      console.warn('Interview feedback evaluation failed:', err?.message || err);
      setEvalError(err?.message || 'Live AI evaluation is currently unavailable. Please verify your connection or Gemini API configuration.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <MessageSquareCode className="w-3.5 h-3.5 text-pink-400" />
          <span>Interactive AI Mock Interview Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          AI Practice Interview Room
        </h1>
        <p className="text-slate-300 text-sm">
          Select a category, record your response, and receive real-time Gemini AI scoring, STAR feedback, and model answer suggestions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {(['All', 'Technical', 'HR', 'Coding', 'Behavioral'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentQuestionIndex(0);
              setFeedback(null);
              setUserAnswer('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {cat} Questions
          </button>
        ))}
      </div>

      {/* Main Practice Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Question & Answer Box */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0d121f] border border-pink-500/30 shadow-2xl space-y-6">
            
            {/* Question Header Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {activeQuestion.category}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                  {activeQuestion.difficulty}
                </span>
              </div>

              <button
                onClick={handleNextQuestion}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Skip / Next Question <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interviewer Prompt</span>
              <h3 className="text-xl font-bold text-white font-['Syne'] leading-snug">
                "{activeQuestion.question}"
              </h3>
            </div>

            {/* Toggleable Hint */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? "Hide Answer Strategy Hint" : "Show Answer Strategy Hint"}</span>
                </button>
              </div>
              {showHint && (
                <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-2 italic">
                  💡 {activeQuestion.hint}
                </p>
              )}
            </div>

            {/* User Response Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Your Answer (Text Response)
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={7}
                placeholder="Type your response here using the STAR method (Situation, Task, Action, Result)..."
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !userAnswer.trim()}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-pink-200" />
                    <span>Gemini AI Evaluating STAR Answer...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Answer for AI Score</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* AI Feedback & Evaluation Output */}
        <div className="lg:col-span-5 space-y-6">
          {feedback ? (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6 animate-in fade-in duration-300">
              
              {/* Score Meter */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400">AI Interview Performance</span>
                  <h4 className="text-lg font-bold text-white font-['Syne']">STAR Framework Audit</h4>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xl font-extrabold font-['Syne']">
                  {feedback.score}/100
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> What You Did Well
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {feedback.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Areas for Improvement
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sample Model Answer */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <h5 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Model STAR Answer Structure
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{feedback.sampleBetterAnswer}"
                </p>
              </div>

            </div>
          ) : evalError ? (
            <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Evaluation Notice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {evalError}
              </p>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                <span className="font-semibold text-white">Self-Check Guidelines (STAR Framework):</span>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  <li>• <strong>Situation & Task:</strong> Did you clearly establish the background problem?</li>
                  <li>• <strong>Action:</strong> Did you name the exact tools, architectures, or methods you used?</li>
                  <li>• <strong>Result:</strong> Did you quantify the outcome (latency, accuracy, percentage)?</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>Retry AI Evaluation</span>
              </button>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <MessageSquareCode className="w-12 h-12 text-pink-400 mx-auto opacity-60" />
              <h3 className="font-bold text-lg text-white">Ready for Mock Interview</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Type your answer to the prompt on the left and click "Submit Answer for AI Score" to receive instant feedback.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
