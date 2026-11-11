export const currentUser = {
  firstname: "salah eddine",
  lastname: "bouaa",
  username: "sbouaa",
  phone: "+21275235100",
  email: "sbouaa@gmail.com",
  bio: "web dev d*ab sigv pfe 2027 zo3ama",
  location: "Sale,Rabat,MA",
  website: "sbouaa.me",
  avatarUrl: "/pucci.jpg",
  verified: true,
  online: true,
}

export const profileStats = { posts: 0, followers: 0, hosted: 0 }

export type Post = { id: number; alt: string; src: string | null; tone: string }
// Put real photos in public/posts/ and reference them with a URL such as "/posts/1.jpg".
export const posts: Post[] = [
  { id: 1, alt: "Post 1", src: "/posts/1.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 2, alt: "Post 2", src: "/posts/2.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 3, alt: "Post 3", src: "/posts/3.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 4, alt: "Post 4", src: "/posts/FB_IMG_16469145162357607.jpg", tone: "from-zinc-300 to-zinc-600" },
  { id: 5, alt: "Post 5", src: "/posts/IMG_0029.jpg", tone: "from-lime-200 to-emerald-600" },
  { id: 6, alt: "Post 6", src: "/posts/IMG_0046.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 7, alt: "Post 7", src: "/posts/IMG_0065.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 8, alt: "Post 8", src: "/posts/IMG_0068.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 9, alt: "Post 9", src: "/posts/IMG_0719.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 10, alt: "Post 10", src: "/posts/IMG_0860.jpg", tone: "from-amber-200 to-amber-600" },
  { id: 11, alt: "Post 11", src: "/posts/IMG_0948.jpg", tone: "from-amber-200 to-amber-600" },
]
