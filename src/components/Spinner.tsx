type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "h-8 w-8 border-2" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-slate-200 border-t-blue-600 ${className}`}
    />
  );
}
