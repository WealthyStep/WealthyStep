import React, { useState } from 'react';
import { LeadData, LeadFlowStep, LeadServiceOption } from '@/lib/chatbot/types';
import { leadDataSchema } from '@/lib/chatbot/validators';
import { z } from 'zod';
import { CheckCircle2, User, Phone, Mail, FileText, CheckCircle, TrendingUp, ShieldCheck, Globe, MoreHorizontal, Edit2, AlertCircle } from 'lucide-react';

interface LeadFormFlowProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const STEP_ORDER = ['ASK_NAME', 'ASK_PHONE', 'ASK_EMAIL', 'ASK_SERVICE', 'REVIEW', 'SUBMITTING', 'SUCCESS'];

export const LeadFormFlow: React.FC<LeadFormFlowProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<LeadFlowStep>('ASK_NAME');
  const [data, setData] = useState<LeadData>({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '' // We'll let them add a message on the review screen optionally
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agree, setAgree] = useState(true);

  const getStepIndex = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx >= 4) return 5;
    return idx + 1;
  };

  const validateField = (field: keyof LeadData, value: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schema = leadDataSchema.pick({ [field]: true } as any);
      schema.parse({ [field]: value });
      return true;
    } catch (e: unknown) {
      if (e instanceof Error && 'issues' in e && Array.isArray((e as any).issues)) {
        setError((e as any).issues[0]?.message || "Invalid input");
      } else {
        setError("Invalid input");
      }
      return false;
    }
  };

  const handleNext = (field: keyof LeadData, nextStep: LeadFlowStep) => {
    if (!validateField(field, data[field])) return;
    setError('');
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!agree) {
      setError("Please agree to the terms.");
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      leadDataSchema.parse(data);

      const res = await fetch('/api/chatbot/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: '', source: 'Chatbot' })
      });

      if (!res.ok) throw new Error('Failed to submit enquiry');

      setStep('SUCCESS');
      setTimeout(onSuccess, 1500);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError('Please check your details and try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      setStep('REVIEW');
      setIsSubmitting(false);
    }
  };

  const currentIdx = getStepIndex();

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Progress Bar Header */}
      {step !== 'SUCCESS' && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          {[1, 2, 3, 4, 5].map((s, idx) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentIdx === s ? 'bg-[#82C341] text-white' : currentIdx > s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {s}
                </div>
                <span className={`text-[9px] font-medium uppercase tracking-wider ${currentIdx >= s ? 'text-gray-800' : 'text-gray-400'}`}>
                  {['Name', 'Phone', 'Email', 'Service', 'Review'][s-1]}
                </span>
              </div>
              {s < 5 && (
                <div className={`flex-1 h-[2px] mx-2 ${currentIdx > s ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
        
        {step === 'ASK_NAME' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-14 h-14 bg-green-50 text-[#82C341] rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={28} />
            </div>
            <h3 className="font-bold text-navy text-[16px] mb-6">Please enter your<br/>full name</h3>
            <input 
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleNext('name', 'ASK_PHONE')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-[#82C341] focus:ring-1 focus:ring-[#82C341] mb-2 text-[14px] shadow-sm transition-all placeholder:text-gray-400"
              placeholder="Enter your full name"
              autoFocus
            />
            {error && <p className="text-red-500 text-[12px] mb-4 font-medium">{error}</p>}
            <button onClick={() => handleNext('name', 'ASK_PHONE')} className="w-full bg-[#82C341] text-white py-3 rounded-xl font-bold hover:bg-[#72ad39] transition-colors mt-2 shadow-sm flex items-center justify-center gap-2">
              Continue <span className="text-lg leading-none">→</span>
            </button>
          </div>
        )}

        {step === 'ASK_PHONE' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-14 h-14 bg-green-50 text-[#82C341] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={28} />
            </div>
            <h3 className="font-bold text-navy text-[16px] mb-6">Please enter your<br/>mobile number</h3>
            <div className="flex gap-2 w-full mb-2">
              <div className="border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 text-gray-500 font-medium text-[14px] flex items-center justify-center w-16 shrink-0">
                +91 
              </div>
              <input 
                type="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleNext('phone', 'ASK_EMAIL')}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-[#82C341] focus:ring-1 focus:ring-[#82C341] text-[14px] shadow-sm transition-all placeholder:text-gray-400"
                placeholder="98765 43210"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-[12px] mb-4 font-medium">{error}</p>}
            <button onClick={() => handleNext('phone', 'ASK_EMAIL')} className="w-full bg-[#82C341] text-white py-3 rounded-xl font-bold hover:bg-[#72ad39] transition-colors mt-2 shadow-sm flex items-center justify-center gap-2">
              Continue <span className="text-lg leading-none">→</span>
            </button>
          </div>
        )}

        {step === 'ASK_EMAIL' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-14 h-14 bg-green-50 text-[#82C341] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={28} />
            </div>
            <h3 className="font-bold text-navy text-[16px] mb-6">Please enter your<br/>email address</h3>
            <input 
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleNext('email', 'ASK_SERVICE')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-[#82C341] focus:ring-1 focus:ring-[#82C341] mb-2 text-[14px] shadow-sm transition-all placeholder:text-gray-400"
              placeholder="youremail@example.com"
              autoFocus
            />
            {error && <p className="text-red-500 text-[12px] mb-4 font-medium">{error}</p>}
            <button onClick={() => handleNext('email', 'ASK_SERVICE')} className="w-full bg-[#82C341] text-white py-3 rounded-xl font-bold hover:bg-[#72ad39] transition-colors mt-2 shadow-sm flex items-center justify-center gap-2">
              Continue <span className="text-lg leading-none">→</span>
            </button>
          </div>
        )}

        {step === 'ASK_SERVICE' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-navy text-[16px] mb-6 mt-2">What can we help<br/>you with?</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => { setData({ ...data, service: 'Mutual Fund Distribution' }); setStep('REVIEW'); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#82C341] hover:shadow-md shadow-sm transition-all">
                <TrendingUp size={24} className="text-[#82C341]" />
                <span className="text-[12px] font-bold text-navy">Mutual Funds</span>
              </button>
              <button onClick={() => { setData({ ...data, service: 'Insurance' }); setStep('REVIEW'); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#82C341] hover:shadow-md shadow-sm transition-all">
                <ShieldCheck size={24} className="text-[#3b82f6]" />
                <span className="text-[12px] font-bold text-navy">Insurance</span>
              </button>
              <button onClick={() => { setData({ ...data, service: 'NRI Services' }); setStep('REVIEW'); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#82C341] hover:shadow-md shadow-sm transition-all">
                <Globe size={24} className="text-[#8b5cf6]" />
                <span className="text-[12px] font-bold text-navy">NRI Services</span>
              </button>
              <button onClick={() => { setData({ ...data, service: 'Other' }); setStep('REVIEW'); }} className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#82C341] hover:shadow-md shadow-sm transition-all">
                <MoreHorizontal size={24} className="text-gray-400" />
                <span className="text-[12px] font-bold text-navy">Other</span>
              </button>
            </div>
          </div>
        )}

        {(step === 'REVIEW' || step === 'SUBMITTING') && (
          <div className={`w-full text-left animate-in fade-in duration-300 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
            <h4 className="font-bold text-navy text-[16px] mb-4 text-center">Confirm Details</h4>

            <div className="space-y-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 text-[12px]">Service:</span>
                <span className="font-medium text-navy text-[12px]">{data.service}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 text-[12px]">Name:</span>
                <span className="font-medium text-navy text-[12px]">{data.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 text-[12px]">Phone:</span>
                <span className="font-medium text-navy text-[12px]">+91 {data.phone}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 text-[12px]">Email:</span>
                <span className="font-medium text-navy text-[12px]">{data.email}</span>
              </div>
              <div className="flex gap-2 items-start pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-400 w-16 text-[12px] shrink-0">Note:</span>
                <textarea 
                  className="flex-1 text-[12px] border border-gray-200 rounded p-2 focus:border-[#82C341] focus:ring-1 focus:ring-[#82C341] focus:outline-none resize-none bg-white" 
                  rows={2} 
                  placeholder="I would like more information..."
                  value={data.message}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-[11px] text-gray-500 mb-4 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 rounded text-[#82C341] focus:ring-[#82C341]" />
              <span>I agree to be contacted regarding my request.</span>
            </label>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 text-[12px] rounded-lg flex gap-2 items-center mb-4">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-[#82C341] text-white py-3 rounded-xl font-bold hover:bg-[#72ad39] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : 'Send Request'}
            </button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-50 text-[#82C341] rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="font-bold text-navy text-[18px] mb-2">Enquiry Submitted!</h4>
            <p className="text-gray-500 text-[13px] max-w-[200px] leading-relaxed">
              Our specialists will get back to you at the earliest.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
