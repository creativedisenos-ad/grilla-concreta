import { STATUS_COLOR, STATUS_DOT, STATUS_LABEL, type Status } from '@/lib/types';

export function StatusBadge({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  const isPublished = status === 'published';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${STATUS_COLOR[status]} ${sz}`}>
      {isPublished ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}
