import React, { useState } from 'react';
import { Mail, Send, Sparkles, ExternalLink, Copy, Check, Info } from 'lucide-react';

// Recipient email for user feedback and developer inquiries.
const RECIPIENT_EMAIL: string = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_CONTACT_EMAIL) || 
  'kirubakaran.in08@gmail.com';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [draftOpened, setDraftOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const getMailtoLink = () => {
    const emailSubject = encodeURIComponent(
      `[AI Career Mentor Feedback] ${subject.trim() || 'General Inquiry'} from ${name.trim() || 'User'}`
    );
    const emailBody = encodeURIComponent(
      `Hi Kirubakaran,\n\n${message.trim()}\n\n---\nFrom: ${name.trim() || 'Anonymous'}\nReply-To: ${email.trim() || 'Not provided'}\nPlatform: AI Career Mentor Web App`
    );
    return `mailto:${RECIPIENT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const link = getMailtoLink();
    window.location.href = link;
    setDraftOpened(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(RECIPIENT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl mx-auto">
      
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Contact & Feedback</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Syne']">
          Get in Touch
        </h1>
        <p className="text-slate-300 text-sm">
          Have suggestions for new career roadmaps, bug reports, or feature requests? Contact the developer directly.
        </p>
      </div>

      {/* Recipient Notice Box */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Developer Email: <strong className="text-white font-mono">{RECIPIENT_EMAIL}</strong></span>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Address</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-5">
        {draftOpened ? (
          <div className="p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            
            <h3 className="font-bold text-lg text-white">Email Draft Prepared</h3>
            
            <div className="text-xs text-slate-300 space-y-2 max-w-md mx-auto text-left bg-black/40 p-4 rounded-xl border border-white/10">
              <p className="flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Your email application should have opened with the drafted message. You must click <strong>Send</strong> in your email client to deliver it to <strong>{RECIPIENT_EMAIL}</strong>.
                </span>
              </p>
              <p className="text-slate-400 text-[11px] pt-1 border-t border-white/10">
                If your default email client did not open automatically, you can open your preferred mail provider manually and send your message directly to <strong className="text-slate-200">{RECIPIENT_EMAIL}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getMailtoLink()}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Re-open in Mail Client</span>
              </a>
              <button
                type="button"
                onClick={() => setDraftOpened(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all"
              >
                Edit Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Suggestion for AI Engineer Roadmap / Feedback"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Message <span className="text-cyan-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your feedback, questions, or roadmap suggestions here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none custom-scrollbar"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Clicking <strong>Open Email Draft</strong> will launch your default email client with your message pre-filled. You must send the message from your email application to complete delivery.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Open Email Draft in Mail App</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
