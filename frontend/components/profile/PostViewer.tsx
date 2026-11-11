"use client"

import { ChevronLeft, ChevronRight, Copy, Ellipsis, Heart, MessageCircle, Pencil, Share2, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"
import { useToast } from "@/components/ui/Toast"
import { getPostDetail, type PostComment } from "@/lib/mock-post-details"

export type ViewerAuthor = { username: string; avatarUrl?: string | null }
export type ViewerPost = { id: number | string; alt: string; src: string | null; tone: string }

type Props = {
  posts: ViewerPost[]
  index: number
  author: ViewerAuthor
  onClose: () => void
  onNavigate: (index: number) => void
  onDelete: (postId: number | string) => void
}

function Avatar({ name, src, className }: { name: string; src?: string | null; className: string }) {
  const initials = name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-active font-semibold ${className}`}>
      {/* unoptimized: avatars come from the backend (/api/...), which the Next image optimizer cannot reach */}
      {src ? <Image src={src} alt="" fill sizes="40px" unoptimized className="object-cover" /> : initials}
    </span>
  )
}

const roundButton =
  "absolute z-20 flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

export function PostViewer({ posts, index, author, onClose, onNavigate, onDelete }: Props) {
  const notify = useToast()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [shown, setShown] = useState(false) // for the small fade-in
  const [menuOpen, setMenuOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [loadedImage, setLoadedImage] = useState<{ src: string | null; ratio: number }>({ src: null, ratio: 1 })
  // What the user did in this session (front only for now): likes and new comments, per post.
  const [extras, setExtras] = useState<Record<string, { liked: boolean; added: PostComment[] }>>({})

  const post = posts[index]
  const detail = getPostDetail(post.id)
  const key = String(post.id)
  const extra = extras[key] ?? { liked: false, added: [] }
  const likes = detail.likes + (extra.liked ? 1 : 0)
  const comments = [...detail.comments, ...extra.added]

  const imageRatio = loadedImage.src === post.src ? loadedImage.ratio : 1

  function go(next: number) {
    setDraft("")
    setMenuOpen(false)
    onNavigate(next)
  }

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    rootRef.current?.focus()
    const frame = requestAnimationFrame(() => setShown(true))
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      opener?.focus()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        if (menuOpen) setMenuOpen(false)
        else onClose()
        return
      }
      const typing = e.target instanceof HTMLElement && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
      if (!typing && e.key === "ArrowLeft" && index > 0) go(index - 1)
      if (!typing && e.key === "ArrowRight" && index < posts.length - 1) go(index + 1)

      if (e.key === "Tab" && rootRef.current) {
        const items = rootRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])')
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || active === rootRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  })

  // Close the "..." menu when clicking anywhere outside it.
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [menuOpen])

  async function copyLink() {
    setMenuOpen(false)
    const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      notify("Link copied")
    } catch {
      notify("Could not copy the link")
    }
  }

  async function sharePost() {
    setMenuOpen(false)
    const url = `${window.location.origin}${window.location.pathname}?post=${post.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: "WeMeet post", url })
      } else {
        await navigator.clipboard.writeText(url)
        notify("Link copied")
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") notify("Could not share the post")
    }
  }

  function toggleLike() {
    setExtras((all) => ({ ...all, [key]: { ...extra, liked: !extra.liked } }))
  }

  function addComment(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const comment: PostComment = { id: Date.now(), user: author.username, text, ago: "Just now" }
    setExtras((all) => ({ ...all, [key]: { ...extra, added: [...extra.added, comment] } }))
    setDraft("")
  }

  return createPortal(
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Post viewer"
      className={`fixed inset-0 z-40 outline-none transition-opacity duration-150 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
    >
      {/*blur*/}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden />

      <button type="button" aria-label="Close" onClick={onClose} className={`${roundButton} top-4 right-4 bg-black/40 text-white hover:bg-black/60`}>
        <X className="size-5" aria-hidden />
      </button>
      {index > 0 && (
        <button type="button" aria-label="Previous post" onClick={() => go(index - 1)} className={`${roundButton} top-1/2 left-3 -translate-y-1/2 bg-white text-ink shadow-md hover:bg-canvas sm:left-6`}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      )}
      {index < posts.length - 1 && (
        <button type="button" aria-label="Next post" onClick={() => go(index + 1)} className={`${roundButton} top-1/2 right-3 -translate-y-1/2 bg-white text-ink shadow-md hover:bg-canvas sm:right-6`}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 py-4 sm:px-20">
        <article className="pointer-events-auto flex max-h-full w-full max-w-105 flex-col overflow-y-auto rounded-xl bg-white shadow-2xl md:h-[min(94vh,900px,calc(100vw_-_520px))] md:min-h-105 md:w-auto md:max-w-none md:flex-row md:overflow-hidden">
          {/* image side */}
          <div
            style={{ aspectRatio: imageRatio }}
            className={`relative w-full shrink-0 bg-linear-to-br ${post.tone} md:h-full md:w-auto`}
            role={post.src ? undefined : "img"}
            aria-label={post.src ? undefined : post.alt}
          >
            {post.src && (
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                priority
                unoptimized={post.src.startsWith("/api/")}
                onLoad={(event) => {
                  const image = event.currentTarget
                  if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                    setLoadedImage({ src: post.src, ratio: image.naturalWidth / image.naturalHeight })
                  }
                }}
                className="object-contain"
              />
            )}
          </div>

        
          <div className="flex min-h-0 shrink-0 flex-col bg-[#fffdf9] md:w-120">
            <header className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Avatar name={author.username} src={author.avatarUrl} className="size-8 text-[11px]" />
              <p className="min-w-0 flex-1 truncate text-sm font-semibold">{author.username}</p>
              <div ref={menuRef} className="relative">
                <button type="button" aria-label="More options" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="flex size-8 items-center justify-center rounded-full hover:bg-tint focus-visible:outline-2 focus-visible:outline-brand">
                  <Ellipsis className="size-5" aria-hidden />
                </button>
                {menuOpen && (
                  <div role="menu" className="absolute top-full right-0 z-10 mt-1 w-44 rounded-xl border border-line bg-white py-1 shadow-lg">
                    <button type="button" role="menuitem" autoFocus onClick={copyLink} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#fff3b0] focus-visible:bg-tint focus-visible:outline-none">
                      <Copy className="size-4" aria-hidden /> Copy link
                    </button>
                    <button type="button" role="menuitem" onClick={() => setMenuOpen(false)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#fff3b0] focus-visible:bg-tint focus-visible:outline-none">
                      <Pencil className="size-4" aria-hidden /> Edit post
                    </button>
                    <button type="button" role="menuitem" onClick={sharePost} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#fff3b0] focus-visible:bg-tint focus-visible:outline-none">
                      <Share2 className="size-4" aria-hidden /> Share post
                    </button>
                    <button type="button" role="menuitem" onClick={() => onDelete(post.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-danger hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none">
                      <Trash2 className="size-4" aria-hidden /> Delete post
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 md:min-h-30">
              {detail.caption && (
                <div className="flex gap-3">
                  <Avatar name={author.username} src={author.avatarUrl} className="size-8 text-[11px]" />
                  <div className="min-w-0 text-[13px] leading-5">
                    <p><span className="font-semibold">{author.username}</span> {detail.caption}</p>
                    <p className="mt-1 text-[11px] text-subtle">{detail.ago}</p>
                  </div>
                </div>
              )}
              <ul className="mt-4 border-t border-line pt-4 flex flex-col gap-3.5">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <Avatar name={c.user} className="size-8 text-[11px]" />
                    <div className="min-w-0 text-[13px] leading-5">
                      <p className="wrap-break-word"><span className="font-semibold">{c.user}</span> {c.text}</p>
                      <p className="mt-0.5 text-[11px] text-subtle">{c.ago}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {comments.length === 0 && <p className="mt-6 text-center text-xs text-muted">No comments yet. Start the conversation.</p>}
            </div>

            <footer className="border-t border-line">
              <div className="flex items-center gap-3 px-4 pt-3">
                <button type="button" aria-label={extra.liked ? "Unlike" : "Like"} aria-pressed={extra.liked} onClick={toggleLike} className="rounded focus-visible:outline-2 focus-visible:outline-brand">
                  <Heart className={`size-6 ${extra.liked ? "fill-amber-400 text-amber-500" : ""}`} aria-hidden />
                </button>
                <button type="button" aria-label="Write a comment" onClick={() => inputRef.current?.focus()} className="rounded focus-visible:outline-2 focus-visible:outline-brand">
                  <MessageCircle className="size-6" aria-hidden />
                </button>
              </div>
              <p className="px-4 pt-2 text-[13px] font-semibold">{likes.toLocaleString("en-US")} {likes === 1 ? "like" : "likes"}</p>
              <p className="px-4 pb-3 text-[11px] text-subtle uppercase">{detail.ago}</p>
              <form onSubmit={addComment} className="flex items-center gap-2 border-t border-line px-4 py-2">
                <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={300} aria-label="Add a comment" placeholder="Add a comment..." className="min-w-0 flex-1 bg-transparent py-2 text-[13px] outline-none placeholder:text-subtle" />
                <button type="submit" disabled={!draft.trim()} className="text-[13px] font-semibold text-gold disabled:opacity-40">Post</button>
              </form>
            </footer>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  )
}
