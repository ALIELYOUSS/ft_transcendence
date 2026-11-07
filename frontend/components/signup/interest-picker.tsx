"use client";

import { useState } from "react";
import {
  INTEREST_CATEGORIES,
  INTERESTS,
  InterestCategory,
} from "./signup-interests";

type InterestPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export function InterestPicker({ value, onChange }: InterestPickerProps) {
  const [activeCategory, setActiveCategory] = useState<InterestCategory>("Creative");

  function toggleInterest(interest: string) {
    onChange(
      value.includes(interest)
        ? value.filter((item) => item !== interest)
        : [...value, interest],
    );
  }

  return (
    <section className="w-full rounded-xl border border-[#E8E4D8] bg-[#FBFAF6] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-black">Build your circle</h3>
          <p className="mt-1 text-xs leading-5 text-black/55">
            Pick interests to personalize your people and meetups.
          </p>
        </div>
        <span className="rounded-full bg-[#f8b50e]/20 px-2 py-1 text-[11px] text-black">
          {value.length} selected
        </span>
      </div>

      <div
        className="mt-4 flex gap-1 rounded-lg bg-black/5 p-1"
        role="tablist"
        aria-label="Interest categories"
      >
        {INTEREST_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`flex-1 rounded-md px-2 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#f8b50e] ${
              activeCategory === category
                ? "bg-[#f8b50e] text-black"
                : "text-black/55 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-[#E8E4D8] p-3">
        {INTERESTS[activeCategory].map((interest) => {
          const selected = value.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleInterest(interest)}
              className={`rounded-full border px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#f8b50e] ${
                selected
                  ? "border-[#f8b50e] bg-[#f8b50e] text-black"
                  : "border-[#E8E4D8] bg-white text-black/65 hover:border-[#f8b50e]"
              }`}
            >
              {selected ? "✓ " : "+ "}
              {interest}
            </button>
          );
        })}
      </div>
    </section>
  );
}
