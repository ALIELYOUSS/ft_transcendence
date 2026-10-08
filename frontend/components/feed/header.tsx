import React from 'react';
import { Search, Bell, Plus, User } from 'lucide-react';

export const FeedHeader: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative flex items-center">
          <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search people, circles, topics..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#F8F7F4] border border-stone-200/50 text-[#54483B] placeholder-[#A09383] rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition"
          />
        </div>
        {/* notification button */}
        <div className="flex items-center gap-3">
          
          <button className="p-2 text-stone-600 hover:text-black transition rounded-full hover:bg-stone-100 relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="w-2 h-2 bg-amber-500 border border-white rounded-full absolute top-1.5 right-1.5"></span>
          </button>

          {/* Propose Slot*/}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#F5A524] hover:bg-[#E0941B] active:scale-[0.98] transition shadow-sm">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Propose Slot</span>
          </button>

          {/* Profile */}
          <div className="w-8 h-8 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition">
            <User className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
        </div>

      </div>
    </header>
  );
};
