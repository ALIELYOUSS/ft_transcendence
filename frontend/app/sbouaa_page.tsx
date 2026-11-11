import { redirect } from "next/navigation"

// "/" has no page of its own yet, so send visitors to the profile.
export default function Home() {
  redirect("/profile")
}
