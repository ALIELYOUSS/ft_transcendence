import Link from "next/link"

const links = ["Privacy", "Terms", "Guidelines", "Support"]

export function Footer() {
  return (
    <footer className="flex min-h-12 flex-col items-center justify-between gap-3 px-6 py-4 font-medium text-sm text-muted sm:flex-row sm:px-12">
      <p>© 2025 WeMeet. Built for meaningful connection.</p>
      <nav aria-label="Legal" className="flex items-center gap-4">
        {links.map((name, i) => (
          <span key={name} className="contents">
            {i > 0 && <span aria-hidden className="text-[#d5c4ac]">·</span>}
            <Link href={`/${name.toLowerCase()}`}>{name}</Link>
          </span>
        ))}
      </nav>
    </footer>
  )
}
