import React, { useState } from 'react';
import { CertificateRecord } from '../types';
import { Award, Plus, Trash2, CheckCircle, ExternalLink, Clock } from 'lucide-react';

interface CertificateTrackerProps {
  certificates: CertificateRecord[];
  setCertificates: (certs: CertificateRecord[]) => void;
}

export const CertificateTracker: React.FC<CertificateTrackerProps> = ({ certificates, setCertificates }) => {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Planned'>('In Progress');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim()) return;

    const newCert: CertificateRecord = {
      id: Date.now().toString(),
      title,
      provider,
      category: category || 'Engineering',
      completionDate: new Date().toLocaleDateString(),
      status,
      progressPercentage: status === 'Completed' ? 100 : 50
    };

    setCertificates([newCert, ...certificates]);
    setTitle('');
    setProvider('');
    setCategory('');
  };

  const handleDelete = (id: string) => {
    setCertificates(certificates.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Credentials Vault</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Certificate & Skill Credential Tracker
        </h1>
        <p className="text-slate-300 text-sm">
          Log your cloud certifications, online degrees, and course completions to prove skill verification to prospective recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Add Certificate Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white">Add New Certification</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Solutions Architect"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Provider / Platform</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Amazon Web Services, Coursera"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Cloud, Frontend, AI"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Save Credential</span>
            </button>
          </form>
        </div>

        {/* Certificate List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-amber-500/40 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400">{cert.provider}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(cert.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cert.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {cert.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{cert.completionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
