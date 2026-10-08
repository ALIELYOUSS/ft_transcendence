import React from 'react';
import { Compass, User } from 'lucide-react';

interface Users {
  id: string;
  username: string;
}

const fake_people: Users[] = [
  { id: '1', username: '@oum_oum' },
  { id: '2', username: '@hajar_el' },
  { id: '3', username: '@salama_el' },
  { id: '4', username: '@khadija_el' },
  { id: '5', username: '@naima_el' },
];

export const DiscoverPeople: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-[#D97706]" />
          <h2 className="text-sm font-bold text-stone-900">Discover People</h2>
        </div>
        {/* See all */}
        <button className="text-xs font-bold text-[#854D0E] hover:text-[#713F12] transition">
          See All
        </button>
      </div>

      {/* user grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fake_people.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center p-3 rounded-2xl border border-stone-100 bg-[#FAF9F6]/80 hover:bg-[#F5F3EE] transition"
          >
            {/*Avatar*/}
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                <User className="w-5 h-5 text-[#8C7A6B]" />
              </div>
              <span className="w-3 h-3 bg-[#F5A524] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
            </div>

            <span className="text-[11px] text-stone-900 font-bold truncate w-full text-center mb-2">
              {user.username}
            </span>
            {/* add button */}
            <button className="text-[11px] font-bold text-stone-800 bg-white border border-stone-200 rounded-xl px-2.5 py-1 hover:bg-stone-50 transition w-full shadow-2xs">
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
