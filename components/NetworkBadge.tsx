import type { Network } from '@/lib/types';

const COLORS: Record<Network, string> = {
  instagram: 'bg-gradient-to-br from-pink-500 to-orange-400',
  facebook: 'bg-blue-600',
  tiktok: 'bg-black',
  linkedin: 'bg-sky-700',
  x: 'bg-black',
  youtube: 'bg-red-600',
  threads: 'bg-black',
};

const LETTERS: Record<Network, string> = {
  instagram: 'IG',
  facebook: 'FB',
  tiktok: 'TT',
  linkedin: 'IN',
  x: 'X',
  youtube: 'YT',
  threads: 'TH',
};

export function NetworkBadge({ network, size = 'md' }: { network: Network; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'h-5 w-5 text-[9px]' : 'h-7 w-7 text-[11px]';
  return (
    <span className={`inline-flex items-center justify-center rounded-md font-black text-white ${COLORS[network]} ${sz}`}>
      {LETTERS[network]}
    </span>
  );
}
