type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-role-base)] px-6 py-10 text-[var(--color-role-white)] sm:px-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex items-center justify-between gap-4">
          <a href="/auth/login" className="flex items-center gap-2 text-sm">
            <span className="h-7 w-7 overflow-hidden rounded-lg border border-[var(--color-role-border)] bg-[var(--color-role-black)]">
              <img src="/logo.png" alt="WeMeet logo" width={28} height={28} />
            </span>
            <span>WeMeet</span>
          </a>
          <a
            href="/auth/login"
            className="text-sm text-[var(--color-role-subtext)] hover:text-[var(--color-role-white)]"
          >
            Back to sign in
          </a>
        </header>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-role-amber)]">
          WeMeet
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-role-subtext)]">
          {intro}
        </p>
        <p className="mt-3 text-xs text-[var(--color-role-subtext)]">
          Last updated: October 2, 2026
        </p>

        <div className="mt-12 space-y-9 border-t border-[var(--color-role-border)] pt-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-medium text-[var(--color-role-white)]">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm leading-7 text-[var(--color-role-subtext)]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>  
      </div>
    </main>
  );
}
