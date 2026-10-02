export type InterestCategory = "Creative" | "Outdoors" | "Social";

export const INTEREST_CATEGORIES: InterestCategory[] = [
  "Creative",
  "Outdoors",
  "Social",
];

export const INTERESTS: Record<InterestCategory, string[]> = {
  Creative: ["Photography", "Art & Design", "Writing", "Music", "Film", "Cooking"],
  Outdoors: ["Hiking", "Cycling", "Camping", "Climbing", "Beach", "Surfing"],
  Social: ["Board Games", "Coffee & Food", "Book Club", "Volunteering", "Sports"],
};
