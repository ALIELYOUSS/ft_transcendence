import { ProfileContent } from "@/components/profile/ProfileContent"
import { ProfileHeader } from "@/components/profile/ProfileHeader"

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <ProfileHeader />
      <ProfileContent />
    </div>
  )
}
