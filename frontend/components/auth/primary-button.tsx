type PrimaryButtonProps = {
  children: React.ReactNode;
};

export function PrimaryButton({ children }: PrimaryButtonProps) {

  
  return (
    <button
      type="submit"
      className="h-11 w-full rounded-lg border border-[#f8b50e] bg-linear-to-r from-[#f8b50e] to-[#ffd66b] text-sm font-semibold text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#f8b50e] focus:ring-offset-2"
    >
      {children}
    </button>
  );
}
