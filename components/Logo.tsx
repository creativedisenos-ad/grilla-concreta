export function Logo({ size = 'md', invert = false }: { size?: 'sm' | 'md' | 'lg'; invert?: boolean }) {
  const dims = { sm: 'h-7', md: 'h-9', lg: 'h-12' }[size];
  const txt = invert ? 'text-white' : 'text-navy';
  const accent = invert ? 'bg-white text-navy' : 'bg-navy text-white';
  return (
    <div className={`inline-flex items-center gap-2 ${dims}`}>
      <div className={`flex h-full aspect-square items-center justify-center rounded-md ${accent} font-black`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-3/5 w-3/5">
          <rect x="3" y="6" width="6" height="14" fill="currentColor" />
          <rect x="11" y="3" width="6" height="17" fill="currentColor" opacity="0.85" />
          <rect x="5" y="9" width="2" height="2" fill={invert ? '#0A2452' : '#FFFFFF'} />
          <rect x="5" y="13" width="2" height="2" fill={invert ? '#0A2452' : '#FFFFFF'} />
          <rect x="13" y="6" width="2" height="2" fill={invert ? '#0A2452' : '#FFFFFF'} />
          <rect x="13" y="10" width="2" height="2" fill={invert ? '#0A2452' : '#FFFFFF'} />
          <rect x="13" y="14" width="2" height="2" fill={invert ? '#0A2452' : '#FFFFFF'} />
        </svg>
      </div>
      <div className={`flex flex-col leading-none ${txt}`}>
        <span className="text-base font-black tracking-tight">CONKRETA</span>
        <span className="text-[10px] font-semibold tracking-[0.25em] opacity-80">GROUP</span>
      </div>
    </div>
  );
}
