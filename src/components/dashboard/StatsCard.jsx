import React from 'react';

export default function StatsCard({ label, value, icon: Icon, color, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border text-left w-full transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-primary/15 border-primary/40 ring-1 ring-primary/30'
          : 'bg-card border-border hover:border-primary/30 hover:bg-card/80'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </button>
  );
}