import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MapPin, MoreHorizontal, User } from 'lucide-react';

export const PostCard: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      
      {/*Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white stroke-[2.5]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900">oum_oum</span>
              <span className="text-[10px] text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-medium">2h ago</span>
            </div>
            
            {/* location */}
            <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
              <MapPin className="w-3 h-3 text-amber-700" />
              <span>Mount Tamalpais Trailhead</span>
            </div>
          </div>
        </div>

        {/* ... button */}
        <button className="text-stone-400 hover:text-stone-700 transition">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post image  */}
      <div className="relative w-full aspect-4/3 bg-stone-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000"
          alt="Post Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/*  Post Details */}
      <div className="p-4 flex flex-col gap-2.5">
        
        {/* post buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-stone-700">
            {/*like button */}
            <button className="hover:text-amber-600 transition">
              <Heart className="w-5 h-5" />
            </button>
            {/*comment button*/}
            <button className="flex items-center gap-1.5 hover:text-amber-600 transition">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-semibold text-stone-700">42</span>
            </button>
            {/*share button*/}
            <button className="hover:text-amber-600 transition">
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
          {/* save button*/}
          <button className="text-stone-700 hover:text-amber-600 transition">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* likes count */}
        <div className="text-xs font-bold text-stone-900">
          1,248 likes
        </div>

        {/* caption */}
        <div className="text-xs text-stone-800 leading-relaxed">
          <span className="font-bold text-stone-900 mr-2"></span>
          Golden hour ridge run. The fog cleared right at 6:45 PM. Who is down for sunset trail session this Thursday?
        </div>

        {/* footer info: comments link + group tag */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <button className="text-stone-400 hover:text-stone-600 font-medium transition">
            View all 42 comments
          </button>

          <span className="font-bold text-[#854D0E] hover:underline cursor-pointer">
            Bay Area Trail Club
          </span>
        </div>

      </div>

    </div>
  );
};