type GoogleButtonProps = {
  label: string;
};

export function GoogleButton({ label }: GoogleButtonProps) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E8E4D8] bg-white text-sm font-medium text-black transition hover:bg-[#f3f0e8] focus:outline-none focus:ring-2 focus:ring-[#f8b50e] focus:ring-offset-2"
    >
      <img src="/google_logo.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
      {label}
    </button>
  );
}
