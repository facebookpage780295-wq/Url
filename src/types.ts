import type { Timestamp } from 'firebase/firestore';

export interface ShortLink {
  shortCode: string;
  originalUrl: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | Date | null;
  clicks: number;
  lastClickedAt?: Timestamp | { seconds: number; nanoseconds: number } | Date | null;
}

export type AppRoute =
  | { view: 'home' }
  | { view: 'redirect'; shortCode: string }
  | { view: 'stats'; shortCode: string };
