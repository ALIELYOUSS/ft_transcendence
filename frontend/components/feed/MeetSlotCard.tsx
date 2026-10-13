"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Zap, User } from "lucide-react";

interface MeetSlotProps {
  hostName?: string;
  hostHandle?: string;
  hostAvatar?: string;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  goingCount?: number;
  totalSpots?: number;
  takenSpots?: number;
}

export function MeetSlotCard({
  hostName = "Art & Coffee Community Host",
  hostHandle = "@oum_oum",
  title = "Weekend Coffee & Sketching",
  date = "Saturday, Oct 24, 2025",
  time = "10:30 AM - 1:00 PM PST",
  location = "Bluestone Lane Café, Mission District",
  goingCount = 2,
  totalSpots = 5,
  takenSpots = 2,
}: MeetSlotProps) {
  const [requested, setRequested] = useState(false);
  const [currentTaken, setCurrentTaken] = useState(takenSpots);

  const handleJoin = () => {
    if (!requested && currentTaken < totalSpots) {
      setRequested(true);
      setCurrentTaken((prev) => prev + 1);
    }
  };

  const spotsLeft = totalSpots - currentTaken;

  return (
    <div className="relative w-full rounded-2xl p-5 bg-[#141414] text-white border border-neutral-800/80 shadow-xl overflow-hidden">
      {/* background golden glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] pointer-events-none rounded-full" />

      {/* proposed meet slot */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1B13] border border-amber-500/30 text-[#F5A524] text-[10px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Proposed Meet Slot</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500/90">
          <span>Verified Host</span>
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </div>

      {/* host info */}

      <div className="flex items-center gap-3 mb-4 relative z-10">

        {/* host avatar  */}

        <div className="w-10 h-10 rounded-full bg-[#6B3F00] flex items-center justify-center shrink-0 ring-2 ring-amber-500/30">
          <User className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-white">{hostHandle}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 stroke-[2.5]" />
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">
            {hostName}
          </span>
        </div>
      </div>

      {/* title */}

      <h3 className="text-base sm:text-lg font-bold text-white mb-4 relative z-10 tracking-wide">
        {title}
      </h3>

      {/* details box  */}

      <div className="bg-[#1C1C1C]/90 rounded-xl p-3.5 space-y-3 mb-5 border border-neutral-800/80 relative z-10">
        
        {/* date */}

        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">
              Date
            </span>
            <span className="text-xs font-semibold text-neutral-200">{date}</span>
          </div>
        </div>

        {/* time */}

        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">
              Time
            </span>
            <span className="text-xs font-semibold text-neutral-200">{time}</span>
          </div>
        </div>

        {/* location */}

        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">
              Location
            </span>
            <span className="text-xs font-semibold text-neutral-200">{location}</span>
          </div>
        </div>
      </div>

      {/* footer: going count & join button */}

      <div className="flex items-center justify-between relative z-10 pt-1">

        {/* how many peple are going */}

        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-stone-700 border-2 border-[#141414] flex items-center justify-center">
              <User className="w-3 h-3 text-stone-300" />
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-800 border-2 border-[#141414] flex items-center justify-center">
              <User className="w-3 h-3 text-amber-200" />
            </div>
            <div className="w-6 h-6 rounded-full bg-[#2A2318] border-2 border-[#141414] flex items-center justify-center text-[9px] font-bold text-amber-500">
              +2
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">
              {goingCount + (requested ? 1 : 0)} Going
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              Intimate Group
            </span>
          </div>
        </div>

        {/* Request to join buttom  */}
        <button
          onClick={handleJoin}
          disabled={requested || spotsLeft === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 ${
            requested
              ? "bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed"
              : "bg-[#F5A524] hover:bg-[#E0941B] text-black"
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-black stroke-none" />
          <span>
            {requested
              ? "Requested ✓"
              :  `Request to Join (${spotsLeft}/${totalSpots} spots left)`}
          </span>
        </button>
      </div>
    </div>
  );
}