
import React from 'react';
import { Search, Bell, Plus, User } from 'lucide-react';

export const FeedHeader: React.FC = () => {
  return (
    <header className="w-full bg-[var(--color-role-base)] border-b border-[var(--color-role-border)] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* search bar */}
        <div className="flex-1 max-w-md relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#8E8678] pointer-events-none" />
          <input
            type="text"
            placeholder="Search people, circles, topics..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#E8E4D8] border border-[var(--color-role-border)] text-[var(--color-role-black)] placeholder:text-[#6B665C] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-role-amber)] transition"
          />
        </div>
        {/* notification button */}
        <div className="flex items-center gap-3">
          
          <button className="p-2 text-[var(--color-role-subtext)] hover:text-[var(--color-role-white)] transition rounded-full hover:bg-[var(--color-role-cream-glow)] relative">
            <Bell className="w-[18px] h-[18px]" />

            <span className="w-2 h-2 bg-[var(--color-role-amber)] border border-[var(--color-role-base)] rounded-full absolute top-1.5 right-1.5"></span>
          </button>

          {/* propose slot*/}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-role-black)] bg-[var(--color-role-amber)] hover:brightness-110  active:scale-[0.98] transition shadow-sm">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Propose Slot</span>
          </button>

          {/* Profile */}
          <div className="w-8 h-8 rounded-full bg-[var(--color-role-amber)] flex items-center justify-center shrink-0 cursor-pointer hover:brightness-110 transition">
            <User className="w-4 h-4 text-[var(--color-role-black)] stroke-[2.5]" />
          </div>
        </div>

      </div>
    </header>
  );
};
