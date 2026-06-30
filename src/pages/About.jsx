import React from 'react';
import { Link } from 'react-router-dom';
import { Columns3, GraduationCap, Zap, Calendar, Tag } from 'lucide-react';

const features = [
  { icon: GraduationCap, title: 'Built for Students', desc: 'Designed specifically for academic workflows — syllabi, homework, exams, and deadlines.' },
  { icon: Zap, title: 'AI-Powered Import', desc: 'Upload a syllabus or homework sheet and let AI extract all your tasks and due dates automatically.' },
  { icon: Calendar, title: 'Visual Scheduling', desc: 'Kanban board and calendar views so you always know what\'s coming up.' },
  { icon: Tag, title: 'Class Tagging', desc: 'Color-code tasks by class or subject for instant clarity at a glance.' },
];

export default function About() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto text-slate-100">
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30">
          <Columns3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-slate-100">About Syncora</h1>
        
        {/* 📝 EDIT ME DOWN THE LINE: Customize this description whenever you're ready! */}
        <p className="text-slate-400 text-sm max-w-md">
          A smart task manager built to help students automate their schedules and stay organized — without the overwhelm.
        </p>
      </div>

      {/* Builder Credit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 text-center shadow-md">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Built by</p>
        <p className="text-2xl font-bold text-slate-100">Jesse Hartman</p>
        <p className="text-sm text-slate-300 mt-3 max-w-md mx-auto leading-relaxed">
          I created Syncora because I saw how many students struggle to keep track of assignments across multiple classes.
          Between syllabi PDFs, handwritten homework sheets, and scattered reminders, it's easy to miss deadlines.
          Syncora was designed to eliminate that chaos — one import at a time.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-semibold text-sm mb-1 text-slate-200">{title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-6">
        <p>Syncora &copy; {new Date().getFullYear()} · Built with ❤️ by Jesse Hartman</p>
        <div className="mt-2 space-x-2">
          <Link to="/settings" className="text-indigo-400 hover:text-indigo-300 hover:underline">Settings</Link>
          <span>·</span>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 hover:underline">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}