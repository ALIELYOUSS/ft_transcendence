"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { PostViewer, type ViewerAuthor, type ViewerPost } from "./PostViewer"

type Props = { posts: ViewerPost[]; display: "grid" | "list"; author: ViewerAuthor }

export function ProfilePosts({ posts, display, author }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [visiblePosts, setVisiblePosts] = useState(posts)
  const linkHandled = useRef(false)

  useEffect(() => {
    if (linkHandled.current || visiblePosts.length === 0) return
    linkHandled.current = true
    const timer = setTimeout(() => {
      const id = new URLSearchParams(window.location.search).get("post")
      const found = visiblePosts.findIndex((p) => String(p.id) === id)
      if (found >= 0) setOpenIndex(found)
    }, 0)
    return () => clearTimeout(timer)
  }, [visiblePosts])

  function close() {
    setOpenIndex(null)
    if (window.location.search.includes("post=")) window.history.replaceState(null, "", window.location.pathname)
  }

  if (visiblePosts.length === 0) return <p className="py-12 text-center text-sm text-muted">No posts yet.</p>

  return (
    <>
      <ul className={`grid gap-3.5 ${display === "grid" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
        {visiblePosts.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              aria-label={`Open post ${i + 1}: ${p.alt}`}
              onClick={() => setOpenIndex(i)}
              className={`relative block w-full overflow-hidden rounded-2xl bg-linear-to-br ${p.tone} ${display === "grid" ? "aspect-square" : "aspect-video"} transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
            >
              {p.src && <Image src={p.src} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />}
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && visiblePosts[openIndex] && (
        <PostViewer
          posts={visiblePosts}
          index={openIndex}
          author={author}
          onClose={close}
          onNavigate={setOpenIndex}
          onDelete={(postId) => {
            setVisiblePosts((current) => current.filter((post) => post.id !== postId))
            close()
          }}
        />
      )}
    </>
  )
}
