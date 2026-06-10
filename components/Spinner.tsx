interface SpinnerProps {
  /** Diameter of the ring in pixels */
  size?: number;
  /** Optional text rendered below the ring (uppercase, tracked) */
  label?: string;
  className?: string;
}

export default function Spinner({ size = 48, label, className = '' }: SpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-busy="true"
    >
      <div className="relative" style={{ height: size, width: size }}>
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
      </div>
      {label ? (
        <p className="mt-4 text-slate-500 text-sm tracking-widest uppercase">{label}</p>
      ) : (
        <span className="sr-only">Loading…</span>
      )}
    </div>
  );
}
