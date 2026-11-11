export type PostComment = { id: number; user: string; text: string; ago: string }
export type PostDetail = { caption: string; ago: string; likes: number; comments: PostComment[] }

export const postDetails: Record<string, PostDetail> = {
  "1": {
    caption: "7331",
    ago: "2 days ago",
    likes: 128,
    comments: [
    ],
  },
  "2": {
    caption: "msemen",
    ago: "4 days ago",
    likes: 0,
    comments: [],
  },
  "3": {
    caption: "Concrete, glass and golden hour.",
    ago: "5 days ago",
    likes: 0,
    comments: [
    ],
  },
  "4": { caption: "Old new roll.", ago: "1 week ago", likes: 0, comments: [] },
  
  "5": {
    caption: "Everything is growing.",
    ago: "day ago",
    likes: 76,
    comments: [{ id: 1, user: "sk.walks", text: "I need a plant like that one.", ago: "6d" }],
  },
  "6": {
    caption: "Nothing",
    ago: "",
    likes: 0,
    comments: [
    ],
  },
}

export function getPostDetail(id: number | string): PostDetail {
  return postDetails[String(id)] ?? { caption: "", ago: "Just now", likes: 0, comments: [] }
}
