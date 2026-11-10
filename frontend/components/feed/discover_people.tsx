import React from 'react';
import { Compass, User } from 'lucide-react';

interface Users {
  id: string;
  username: string;
}

const fake_people: Users[] = [
  { id: '1', username: '@clara_creative' },
  { id: '2', username: '@marcus_hikes' },
  { id: '3', username: '@elena_lens' },
  { id: '4', username: '@dev_alex' },
  { id: '5', username: '@sophia_art' },
];

export const DiscoverPeople: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-role-cream-glow)] rounded-2xl p-4 border border-[var(--color-role-border)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-[18px] h-[18px] text-[var(--color-role-amber)]" />
          <h2 className="text-sm font-bold text-gray-900">
            Discover People
          </h2>
        </div>

        <button className="text-xs font-bold text-[var(--color-role-amber)] hover:brightness-125 transition">
          See All
        </button>
      </div>

      {/* User grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fake_people.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center p-3 rounded-2xl border border-[var(--color-role-border)] bg-white hover:bg-[var(--color-role-amber-soft)] transition shadow-sm"
          >
            {/* Avatar */}
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full bg-[var(--color-role-amber-soft)] border border-[var(--color-role-amber-glow)] flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-[var(--color-role-amber)]" />
              </div>

              <span className="w-3 h-3 bg-[var(--color-role-amber)] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
            </div>

            <span className="text-[11px] text-gray-900 font-bold truncate w-full text-center mb-2">
              {user.username}
            </span>

            {/* Add button */}
            <button className="text-[11px] font-bold text-gray-800 bg-white border border-[var(--color-role-border)] rounded-xl px-2.5 py-1 hover:bg-[var(--color-role-amber-soft)] hover:text-amber-700 transition w-full shadow-2xs">
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

