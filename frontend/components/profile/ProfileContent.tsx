"use client"

import { ProfilePosts } from "./ProfilePosts"
import { currentUser, posts } from "@/lib/mock-data"

export function ProfileContent() {
  return (
    <section aria-label="Profile content">
      <ProfilePosts posts={posts} display="grid" author={{ username: currentUser.username, avatarUrl: currentUser.avatarUrl }} />
    </section>
  )
}