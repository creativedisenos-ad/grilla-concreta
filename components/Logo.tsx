export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const h = { sm: 28, md: 40, lg: 64 }[size];
  return (
    <img
      src="/logo.svg"
      alt="CONKRETA GROUP"
      style={{ height: h, width: 'auto' }}
      className="select-none"
    />
  );
}
