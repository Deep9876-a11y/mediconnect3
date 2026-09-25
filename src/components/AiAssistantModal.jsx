import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from './Icons.jsx';
import { chatService } from '../api/apiService.js';

// ── Intent Engine ─────────────────────────────────────────────────────────────
function detectIntent(text) {
  const t = text.toLowerCase();
  if (/\b(hi|hello|hey|greet|good morning|good evening|namaste)\b/.test(t)) return 'greet';
  if (/\b(appointment|book|schedule|slot|visit|consult)\b/.test(t)) return 'appointment';
  if (/\b(doctor|physician|specialist|dr\.?)\b/.test(t)) return 'doctor';
  if (/\b(department|dept|section|wing|ward)\b/.test(t)) return 'department';
  if (/\b(prescription|medicine|drug|tablet|medication|rx)\b/.test(t)) return 'prescription';
  if (/\b(lab|report|test|blood|sample|result|diagnostic)\b/.test(t)) return 'lab';
  if (/\b(symptom|pain|fever|headache|chest|breathe|cough|vomit|nausea|dizzy|fatigue|weakness)\b/.test(t)) return 'symptom';
  if (/\b(emergency|urgent|911|ambulance|critical)\b/.test(t)) return 'emergency';
  if (/\b(hour|timing|open|time|opd|schedule)\b/.test(t)) return 'hours';
  if (/\b(location|address|where|direction|map|floor|block)\b/.test(t)) return 'location';
  if (/\b(bill|payment|fee|cost|price|charge|insurance)\b/.test(t)) return 'billing';
  if (/\b(cancel|reschedule|change appointment)\b/.test(t)) return 'cancel';
  if (/\b(thank|thanks|bye|goodbye|great|awesome|perfect)\b/.test(t)) return 'farewell';
  if (/\b(help|what can you|menu|option)\b/.test(t)) return 'help';
  return 'unknown';
}

function generateReply(intent, text, context) {
  const { patient, appointments, doctors, departments, prescriptions } = context;
  const name = patient?.name?.split(' ')[0] || 'there';
  const t = text.toLowerCase();

  switch (intent) {
    case 'greet':
      return `Hello **${name}**! 👋 I'm **MediConnect Assistant**, your AI-powered healthcare companion.\n\nI can help you with:\n- 📅 Your appointments\n- 👨‍⚕️ Finding doctors\n- 💊 Prescriptions\n- 🧪 Lab reports\n- 🏥 Departments & timings\n\nHow can I assist you today?`;

    case 'appointment': {
      const upcoming = appointments?.filter(a => a.status === 'Upcoming') || [];
      const completed = appointments?.filter(a => a.status === 'Completed') || [];
      if (upcoming.length === 0 && completed.length === 0)
        return `You have no appointments on record, **${name}**. Would you like to **book one**? Head to the Patient Portal → Book Appointment section.`;
      let reply = `📅 **Your Appointments, ${name}:**\n\n`;
      if (upcoming.length > 0) {
        reply += `**Upcoming (${upcoming.length}):**\n`;
        upcoming.forEach(a => { reply += `• **${a.doctorName}** — ${a.date} at ${a.time || a.slot || 'TBD'} *(${a.specialty})*\n  Token: ${a.tokenNumber || 'N/A'}\n`; });
      }
      if (completed.length > 0) {
        reply += `\n**Completed (${completed.length}):**\n`;
        completed.slice(0, 3).forEach(a => { reply += `• ${a.doctorName} — ${a.date} ✅\n`; });
      }
      reply += `\nTo book a new appointment, go to **Patient Portal → Book Appointment**.`;
      return reply;
    }

    case 'doctor': {
      const specialties = { cardio: 'Cardiology', heart: 'Cardiology', neuro: 'Neurology', brain: 'Neurology', ortho: 'Orthopedics', bone: 'Orthopedics', joint: 'Orthopedics', pediatric: 'Pediatrics', child: 'Pediatrics', skin: 'Dermatology', derm: 'Dermatology', general: 'General Medicine', radiol: 'Radiology', path: 'Pathology' };
      let filteredDoctors = doctors || [];
      for (const [key, dept] of Object.entries(specialties)) {
        if (t.includes(key)) { filteredDoctors = filteredDoctors.filter(d => d.specialty?.toLowerCase().includes(dept.toLowerCase())); break; }
      }
      if (filteredDoctors.length === 0) return `I couldn't find doctors matching that specialty. Available departments: ${departments?.map(d => d.name).join(', ')}.`;
      const top = filteredDoctors.slice(0, 4);
      let reply = `👨‍⚕️ **Doctors available:**\n\n`;
      top.forEach(d => { reply += `• **${d.name}** — ${d.specialty}\n  ${d.experience} exp | ⭐ ${d.rating} | Fee: ₹${d.fee}\n  ${d.availableToday ? '✅ Available Today' : '❌ Not Available Today'}\n\n`; });
      if (filteredDoctors.length > 4) reply += `...and ${filteredDoctors.length - 4} more. Visit **Patient Portal → Book Appointment** to see all.`;
      return reply;
    }

    case 'department': {
      const depts = departments || [];
      if (depts.length === 0) return `Department information is loading. Please try again shortly.`;
      let reply = `🏥 **Our Departments (${depts.length} total):**\n\n`;
      depts.slice(0, 6).forEach(d => { reply += `• **${d.name}** — ${d.description?.slice(0, 60)}...\n  Lead: ${d.leadDoctor} | ${d.room}\n`; });
      return reply;
    }

    case 'prescription': {
      const rxs = prescriptions || [];
      if (rxs.length === 0) return `No prescriptions found for your account, **${name}**. Prescriptions are added after your appointments.`;
      let reply = `💊 **Your Prescriptions (${rxs.length} total):**\n\n`;
      rxs.slice(0, 3).forEach(rx => {
        reply += `**${rx.id}** — *${rx.date}* by ${rx.doctorName}\n`;
        reply += `Diagnosis: ${rx.diagnosis}\n`;
        if (rx.medications?.length > 0) reply += `Medications: ${rx.medications.map(m => m.name || m).join(', ')}\n`;
        reply += `\n`;
      });
      reply += `View complete prescriptions in **Patient Portal → Medical Records**.`;
      return reply;
    }

    case 'lab': {
      return `🧪 **Lab Services at MediConnect:**\n\n• **Home Sample Collection** — Certified phlebotomist visits your doorstep\n• **Walk-in Lab** — Ground Floor, Central Lab\n• Reports delivered digitally within **4-8 hours**\n\nPopular tests: CBC, CMP, HbA1c, Thyroid, Lipid Profile\n\nBook a home sample via **Patient Portal → Lab & Home Sample** section.`;
    }

    case 'symptom': {
      const symptomMap = [
        { keywords: ['chest', 'heart', 'palpitation', 'breathe'], dept: 'Cardiology', urgency: '🔴 HIGH' },
        { keywords: ['headache', 'migraine', 'seizure', 'dizzy', 'stroke'], dept: 'Neurology', urgency: '🟡 MEDIUM' },
        { keywords: ['fever', 'cold', 'cough', 'fatigue', 'vomit', 'nausea'], dept: 'General Medicine', urgency: '🟢 LOW' },
        { keywords: ['bone', 'joint', 'knee', 'back', 'spine', 'fracture'], dept: 'Orthopedics', urgency: '🟡 MEDIUM' },
        { keywords: ['skin', 'rash', 'itch', 'hair', 'acne'], dept: 'Dermatology', urgency: '🟢 LOW' },
        { keywords: ['child', 'baby', 'infant', 'newborn', 'kid'], dept: 'Pediatrics', urgency: '🟡 MEDIUM' },
      ];
      let matched = null;
      for (const entry of symptomMap) {
        if (entry.keywords.some(k => t.includes(k))) { matched = entry; break; }
      }
      if (matched) {
        return `🩺 Based on your symptoms, I recommend consulting our **${matched.dept}** department.\n\nUrgency: ${matched.urgency}\n\n> ⚠️ *This is not a medical diagnosis. Please consult a doctor for proper evaluation.*\n\nWould you like to **book an appointment** with a ${matched.dept} specialist?`;
      }
      return `🩺 I'll help you find the right doctor for your symptoms. For accurate guidance, please describe your symptoms in more detail, or visit our **OPD Reception** at Block A - Ground Floor for a quick triage assessment.\n\n> ⚠️ *For emergencies, call: **1800-MED-CONNECT** or visit Emergency at Block E.*`;
    }

    case 'emergency':
      return `🚨 **EMERGENCY CONTACT:**\n\n📞 **Ambulance: 1800-MED-CONNECT** (24/7 Free)\n📞 **Emergency Ward: +91 11 4000 5000**\n🏥 **Emergency Block E** — Open 24 hours\n\nFor life-threatening situations, **please call 112 (National Emergency) immediately.**\n\n*MediConnect emergency team responds within 8 minutes.*`;

    case 'hours':
      return `🕐 **MediConnect Operating Hours:**\n\n• **OPD Timings:** Mon–Sat, 8:00 AM – 8:00 PM\n• **Emergency:** 24 × 7 (All days)\n• **Lab (Home Sample):** 6:00 AM – 10:00 AM (morning slots)\n• **Pharmacy:** 8:00 AM – 10:00 PM\n• **Radiology:** Mon–Sat, 9:00 AM – 6:00 PM\n\nFor appointments, call **+91 11 4000 5000** or book online.`;

    case 'location':
      return `📍 **MediConnect Hospital Locations:**\n\n• **Main Hospital:** Saket, New Delhi — *Block A (OPD), Block B, Block C, Block E (Emergency)*\n• **City Clinic:** Connaught Place, Central Delhi\n• **Child Care Centre:** Vasant Kunj, South-West Delhi\n• **Neuro Centre:** Dwarka, West Delhi\n• **Skin & Hair Clinic:** Lajpat Nagar, South Delhi\n\nAll locations accessible via Metro. Free parking available at Main Hospital.`;

    case 'billing':
      return `💳 **Billing & Payment Information:**\n\n• **Accepted:** Cash, All Credit/Debit Cards, UPI, Net Banking\n• **Insurance:** Empanelled with 40+ TPA & PSUs (Mediclaim, CGHS, ECHS)\n• **OPD Consultation Fee:** ₹700 – ₹1,100 (varies by specialist)\n• **Billing Desk:** Block A, Ground Floor\n\nFor insurance pre-authorisation, call **+91 11 4000 5001**.`;

    case 'cancel':
      return `📋 **Appointment Cancellation / Rescheduling:**\n\n• Cancellations allowed **up to 2 hours before** appointment time\n• Reschedule via **Patient Portal → My Appointments**\n• For same-day changes, call **+91 11 4000 5000**\n• Full refund within **3-5 business days** if cancelled 24h in advance\n\nIs there a specific appointment you'd like to cancel?`;

    case 'farewell':
      return `Thank you for visiting MediConnect, **${name}**! 😊\n\nStay healthy and take care! If you need anything, I'm always here.\n\n*Your health is our priority.* 🏥💚`;

    case 'help':
      return `🤖 **MediConnect Assistant — What I can help with:**\n\n1. 📅 **Appointments** — View upcoming, book new\n2. 👨‍⚕️ **Doctors** — Find specialists, check availability\n3. 🏥 **Departments** — Info on all 8 departments\n4. 💊 **Prescriptions** — View your medication history\n5. 🧪 **Lab Tests** — Book home sample, view reports\n6. 🩺 **Symptoms** — Get department recommendations\n7. 🚨 **Emergency** — Emergency contacts & location\n8. 🕐 **Hours & Location** — Timings, address, parking\n9. 💳 **Billing** — Payment, insurance info\n\nJust type your question naturally!`;

    default:
      return `I'm not sure I understand that completely, **${name}**. Could you rephrase?\n\nI can help with **appointments, doctors, prescriptions, lab reports, symptoms, emergencies, hospital timings,** and more.\n\nType **"help"** to see everything I can do! 😊`;
  }
}

export function AiAssistantModal({ isOpen, onClose, patient, appointments, doctors, departments, prescriptions }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const context = { patient, appointments, doctors, departments, prescriptions };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: `Hello **${patient?.name?.split(' ')[0] || 'there'}**! 👋 I'm your **MediConnect AI Assistant**.\n\nAsk me anything about your appointments, doctors, prescriptions, lab tests, or symptoms!\n\nType **"help"** to see all my capabilities.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || isTyping) return;
    setInput('');
    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    chatService.saveMessage('user', text, 'patient');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateReply(detectIntent(text), text, context);
      const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      chatService.saveMessage('bot', reply, 'assistant');
    }, 700 + Math.random() * 600);
  }, [input, isTyping, context]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const formatMessage = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>{line}{j < part.split('\n').length - 1 && <br />}</React.Fragment>
      ));
    });
  };

  if (!isOpen) return null;

  const quickReplies = [
    { label: '📅 Appointments', text: 'Show my appointments' },
    { label: '👨‍⚕️ Doctors', text: 'Show available doctors' },
    { label: '💊 Prescriptions', text: 'Show my prescriptions' },
    { label: '🚨 Emergency', text: 'What is the emergency number?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Icons.Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-none">MediConnect Assistant</h3>
              <p className="text-teal-100 text-[11px] mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                AI-Powered · SQLite Connected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}>
                  <Icons.Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'}`}
                style={msg.sender === 'user' ? { background: 'linear-gradient(135deg, #0d9488, #0284c7)' } : {}}>
                <p className="text-xs">{formatMessage(msg.text)}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-teal-100 text-right' : 'text-slate-400'}`}>{msg.time}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 ml-2 mt-1 bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                  {patient?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}>
                <Icons.Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2 flex-shrink-0">
            {quickReplies.map(qr => (
              <button key={qr.text} onClick={() => sendMessage(qr.text)} className="text-xs px-3 py-1.5 rounded-full border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors font-medium">
                {qr.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex gap-2 items-end flex-shrink-0">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your health..."
            rows={1}
            className="flex-1 resize-none text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-slate-700 placeholder-slate-400 bg-slate-50"
            style={{ minHeight: '42px', maxHeight: '80px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)' }}
          >
            <Icons.Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
