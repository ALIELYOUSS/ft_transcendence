const footerButtons = ["Privacy", "Terms", "Guidelines", "Support"];

export default function Footer() {
  return (
    <footer className="mt-auto flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[#e8e7e2] bg-white px-4 py-3 text-sm text-[#656b64] sm:px-6">
      <p className="m-0">© 2025 WeMeet. Built for meaningful connection.</p>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Footer actions">
        {footerButtons.map((label) => (
          <button
            key={label}
            className="rounded-md px-2.5 py-1.5 text-sm text-[#626960] transition-colors hover:bg-[#f2f3ef] hover:text-[#252b25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad28]"
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>
    </footer>
  );
}