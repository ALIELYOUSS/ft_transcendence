import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MapPin, MoreHorizontal, User } from 'lucide-react';

export const PostCard: React.FC = () => {
  return (
     <div className="w-full bg-[var(--color-role-base)] text-[var(--color-role-white)] rounded-2xl border border-[var(--color-role-border)] overflow-hidden shadow-lg">
      {/*Header */}
       <div className="p-4 flex items-center justify-between border-b border-[var(--color-role-border)]">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
           <div className="w-10 h-10 rounded-full bg-[var(--color-role-amber)] text-[var(--color-role-black)] flex items-center justify-center shrink-0 font-bold shadow-[0_0_12px_var(--color-role-amber-glow)]">
            <User className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[var(--color-role-white)]">oum_oum</span>
              <span className="text-[10px] text-[var(--color-role-subtext)]">•</span>
              <span className="text-xs text-[var(--color-role-subtext)] font-medium">2h ago</span>
            </div>
            
            {/* location */}
            <div className="flex items-center gap-1 text-[11px] text-[var(--color-role-cool)] font-medium mt-0.5">
              <MapPin className="w-3 h-3 text-[var(--color-role-cool)]" />
              <span>Mount Tamalpais Trailhead</span>
            </div>
          </div>
        </div>

        {/* ... button */}
        <button  aria-label="More options" 
          className="text-[var(--color-role-subtext)] hover:text-[var(--color-role-amber)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-role-amber)] rounded">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post image  */}
      <div className="relative w-full aspect-4/3 bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000"
          alt="Post media content"
          className="w-full h-full object-cover"
        />
      </div>

      {/*  Post Details */}
      <div className="p-4 flex flex-col gap-3">
        
        {/* post buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-stone-700">
            {/*like button */}
            <button aria-label="Like post" 
              className="text-[var(--color-role-white)] hover:text-[var(--color-role-amber)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-role-amber)] rounded">
              <Heart className="w-5 h-5" />
            </button>
            {/*comment button*/}
            <button aria-label="View comments" 
              className="flex items-center gap-1.5 text-[var(--color-role-white)] hover:text-[var(--color-role-amber)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-role-amber)] rounded">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-semibold ">42</span>
            </button>
            {/*share button*/}
            <button aria-label="Share post" className="text-[var(--color-role-white)] hover:text-[var(--color-role-amber)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-role-amber)] rounded">
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
          {/* save button*/}
          <button aria-label="Save post" 
            className="text-[var(--color-role-white)] hover:text-[var(--color-role-amber)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-role-amber)] rounded">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* likes count */}
        <div className="text-xs font-bold text-[var(--color-role-amber)]">
          1,248 likes
        </div>

        {/* caption */}
        <div className="text-xs text-[var(--color-role-white)] leading-relaxed">
          <span className="font-bold mr-1.5 text-[var(--color-role-amber)]">oum_oum</span>
          Golden hour ridge run. The fog cleared right at 6:45 PM. Who is down for sunset trail session this Thursday?
        </div>

        {/* footer info: comments link + gr tag */}
        <div className="flex items-center justify-between pt-1 text-[11px] border-t border-[var(--color-role-border)] mt-1">
          <button className="text-[var(--color-role-subtext)] hover:text-[var(--color-role-white)] font-medium transition-colors">
            View all 42 comments
          </button>

           <span className="font-bold text-[var(--color-role-amber)] hover:text-[var(--color-role-amber-bright)] hover:underline cursor-pointer transition-colors">
            Bay Area Trail Club
          </span>
        </div>

      </div>

    </div>
  );
};