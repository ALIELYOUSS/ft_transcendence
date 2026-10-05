import React from 'react';
import { Search, Bell, Plus, User} from 'lucide-react';

export const FeedHeader: React.FC = () =>
{
  return (
    
    <header className="w-full bg-white border-b border-gray-100 py-3 px-4 flex items-center justify-between gap-4 sticky top-0 z-10">
      {/* search bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search people, circles, topics..."
          className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-amber-300 transition"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* notification button */}
        <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-full transition relative">
          <Bell className="w-4 h-4" />
          {/*  Dot for the new notification */}
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full absolute top-2 right-2"></span>
        </button>

        {/* slot button */}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Propose Slot</span>
        </button>

        {/* user profile avatar*/}
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
          <User className="w-4 h-4 text-gray-600" />
        </div>

      </div>

    </header>
  );
};