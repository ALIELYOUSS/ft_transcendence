export function LeftPanel() {
  return (
    <div className="relative h-[420px] w-full shrink-0 overflow-hidden bg-[var(--color-role-base)] md:h-screen md:w-[565.44px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 90% 0%, var(--color-role-amber-glow) 15%, var(--color-role-amber-soft) 45%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 50% 50%, var(--color-role-cream-glow) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 40% at 0% 100%, var(--color-role-cool-glow) 0%, transparent 70%)",
          ].join(","),
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="flex items-center gap-2">
          <div className="h-[48px] w-[48px] overflow-hidden rounded-lg border border-[var(--color-role-border)] bg-[var(--color-role-black)]">
            
                <img    src="/logo.png"
                        alt="WeMeet logo" 
                        width={48} 
                        height={48} />
            </div>

            <span className="text-sm">We<span className="text-[var(--color-role-amber)]">Meet</span></span>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-role-amber)]">
            Make time for what matters
          </p>

          <h1 className="mt-3 text-4xl font-medium tracking-tight text-[var(--color-role-white)]">
            Find people for real-life moments.
          </h1>

          <p className="mt-4 max-w-xs text-sm text-[var(--color-role-subtext)]">
            Create a slot, invite your circle, and turn shared interests into plans.
          </p>

        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--color-role-subtext)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-role-white)]" />
        
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-role-border)]" />
        
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-role-border)]" />
        </div>
      
        </div>

    </div>
  );
}

export { LeftPanel as left_panel };
