import { AtSign, Bell, Lock, ShieldCheck, User } from "lucide-react"

export const SETTINGS_SECTIONS = [
  { slug: "profile", label: "Profile", icon: User, description: "Introduce yourself to the people you’ll meet." },
  { slug: "account", label: "Account", icon: AtSign, description: "Keep your contact details and local preferences up to date." },
  { slug: "notifications", label: "Notifications", icon: Bell, description: "Stay in the loop, without the noise." },
  { slug: "privacy", label: "Privacy", icon: Lock, description: "Meaningful connection starts with feeling comfortable." },
  { slug: "security", label: "Security", icon: ShieldCheck, description: "A few simple steps to keep your account yours." },
] as const

export type SectionSlug = (typeof SETTINGS_SECTIONS)[number]["slug"]

export const getSection = (slug: SectionSlug) => SETTINGS_SECTIONS.find((s) => s.slug === slug)!
