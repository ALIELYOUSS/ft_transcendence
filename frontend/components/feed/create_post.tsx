
import React from 'react';
import { Camera, Calendar, Play, User } from 'lucide-react';

export const CreatePost: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3">
      {/* share a photo, text, or propose a meetup area and avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <input
          type="text"
          placeholder="Share a photo, text, or propose a meetup..."
          className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium bg-[#F8F7F4] border border-stone-200/50 text-[#54483B] placeholder-[#A09383] rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition"
        />
      </div>

      <hr className="border-gray-100" />

      {/* photo, meet slot, post button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
        {/* photo button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition">
            <Camera className="w-3.5 h-3.5 text-stone-600" />
            <span>Photo</span>
          </button>

          {/* meet slot button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-[#F5F3EE] hover:bg-stone-200/60 transition">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>Meet Slot</span>
          </button>
        </div>

        {/* post button */}
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition shadow-xs">
          <span>Post</span>
          <Play className="w-3 h-3 fill-current" />
        </button>
      </div>
    </div>
  );
};
// export function CreatePost()
// {
//     return(
//         <div>
//             <h2>Create a Post</h2>

//             <textarea placeholder="Share a photo, text, or propose a meetup..." />

//             <div>
//                 <button>Photo</button>
//                 <button>Meet Slot</button>
//                 <button>Post</button>
//             </div>
//         </div>
//     );
// }