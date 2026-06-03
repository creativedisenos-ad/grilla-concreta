import { STATUS_COLOR, STATUS_DOT, STATUS_LABEL, type Status } from '@/lib/types';

export function StatusBadge({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${STATUS_COLOR[status]} ${sz}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
