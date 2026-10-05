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
    <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* header part*/}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-semibold text-gray-800">Discover People</h2>
        </div>
        <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition">
          See All
        </button>
      </div>

      {/* users grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fake_people.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition"
          >
            {/* user Avatar */}
         <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-amber-600" />
        </div>

            {/* username */}
            <span className="text-xs text-gray-600 font-medium truncate w-full text-center mb-2">
              {user.username}
            </span>
            
            {/* add button */}
            <button className="text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-100 hover:border-gray-300 transition w-full">
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};