export type Network =
  | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x' | 'youtube' | 'threads';

export type Format =
  | 'post' | 'reel' | 'story' | 'carousel' | 'video' | 'live';

export type Status =
  | 'draft' | 'pending_approval' | 'approved' | 'changes_requested' | 'rejected' | 'published';

export type MediaType = 'image' | 'video' | 'carousel';

export interface Post {
  id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  network: Network;
  format: Format;
  title: string;
  caption: string | null;
  hashtags: string | null;
  media_url: string | null;
  media_type: MediaType | null;
  status: Status;
  created_by: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_role: string | null;
  body: string;
  resolved: boolean;
  created_at: string;
}

export interface ApprovalHistory {
  id: string;
  post_id: string;
  from_status: Status | null;
  to_status: Status;
  actor_name: string;
  reason: string | null;
  created_at: string;
}

export const STATUS_LABEL: Record<Status, string> = {
  draft: 'Borrador',
  pending_approval: 'Por aprobar',
  approved: 'Aprobado',
  changes_requested: 'Pide cambios',
  rejected: 'Rechazado',
  published: 'Publicado',
};

export const STATUS_COLOR: Record<Status, string> = {
  draft: 'bg-slate-200 text-slate-700',
  pending_approval: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  changes_requested: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-violet-100 text-violet-700',
};

export const STATUS_DOT: Record<Status, string> = {
  draft: 'bg-slate-400',
  pending_approval: 'bg-blue-500',
  approved: 'bg-green-500',
  changes_requested: 'bg-amber-500',
  rejected: 'bg-red-500',
  published: 'bg-violet-500',
};

export const NETWORK_LABEL: Record<Network, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  x: 'X / Twitter',
  youtube: 'YouTube',
  threads: 'Threads',
};
