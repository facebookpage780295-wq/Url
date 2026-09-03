import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ShortLink } from '../types';

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomCode(length = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

export function normalizeUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

export async function checkCodeExists(code: string): Promise<boolean> {
  const docRef = doc(db, 'links', code);
  const snap = await getDoc(docRef);
  return snap.exists();
}

export async function createShortLink(
  rawUrl: string, 
  customAlias?: string
): Promise<ShortLink> {
  const normalizedUrl = normalizeUrl(rawUrl);
  
  // Basic URL validity check
  try {
    new URL(normalizedUrl);
  } catch {
    throw new Error('Please enter a valid web URL (e.g., https://example.com).');
  }

  let finalCode = '';

  if (customAlias && customAlias.trim()) {
    const cleaned = customAlias.trim();
    // Validate alias format (alphanumeric and hyphens/underscores, 3-30 chars)
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleaned)) {
      throw new Error('Custom alias must be 3-30 alphanumeric characters (hyphens and underscores allowed).');
    }
    const exists = await checkCodeExists(cleaned);
    if (exists) {
      throw new Error(`The alias "${cleaned}" is already taken. Please choose another.`);
    }
    finalCode = cleaned;
  } else {
    // Generate unique 6-char alphanumeric code
    let attempts = 0;
    while (attempts < 5) {
      const candidate = generateRandomCode(6);
      const exists = await checkCodeExists(candidate);
      if (!exists) {
        finalCode = candidate;
        break;
      }
      attempts++;
    }
    if (!finalCode) {
      throw new Error('Could not generate a unique code. Please try again.');
    }
  }

  const newDocRef = doc(db, 'links', finalCode);
  await setDoc(newDocRef, {
    shortCode: finalCode,
    originalUrl: normalizedUrl,
    createdAt: serverTimestamp(),
    clicks: 0,
  });

  const createdData: ShortLink = {
    shortCode: finalCode,
    originalUrl: normalizedUrl,
    createdAt: new Date(),
    clicks: 0,
  };

  saveLocalCode(finalCode);
  return createdData;
}

export async function fetchLink(shortCode: string): Promise<ShortLink | null> {
  try {
    const docRef = doc(db, 'links', shortCode);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    return {
      shortCode: data.shortCode || shortCode,
      originalUrl: data.originalUrl,
      createdAt: data.createdAt,
      clicks: typeof data.clicks === 'number' ? data.clicks : 0,
      lastClickedAt: data.lastClickedAt || null,
    };
  } catch (err) {
    console.error('Error fetching link:', err);
    return null;
  }
}

export async function incrementLinkClicks(shortCode: string): Promise<void> {
  try {
    const docRef = doc(db, 'links', shortCode);
    await updateDoc(docRef, {
      clicks: increment(1),
      lastClickedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error incrementing click count:', err);
  }
}

const LOCAL_STORAGE_KEY = 'url_shortener_recent_codes';

export function getLocalCodes(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalCode(code: string): void {
  try {
    const existing = getLocalCodes().filter((c) => c !== code);
    const updated = [code, ...existing].slice(0, 20);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchRecentLinks(): Promise<ShortLink[]> {
  const localCodes = getLocalCodes();
  const fetched: ShortLink[] = [];

  // Fetch local codes first to ensure user's created links are displayed
  if (localCodes.length > 0) {
    const promises = localCodes.slice(0, 10).map((code) => fetchLink(code));
    const results = await Promise.all(promises);
    for (const res of results) {
      if (res) fetched.push(res);
    }
  }

  // If local list is empty or short, fetch recent global links from Firestore
  if (fetched.length < 5) {
    try {
      const q = query(collection(db, 'links'), orderBy('createdAt', 'desc'), limit(10));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const data = d.data();
        if (!fetched.some((item) => item.shortCode === d.id)) {
          fetched.push({
            shortCode: data.shortCode || d.id,
            originalUrl: data.originalUrl,
            createdAt: data.createdAt,
            clicks: typeof data.clicks === 'number' ? data.clicks : 0,
            lastClickedAt: data.lastClickedAt || null,
          });
        }
      });
    } catch (err) {
      console.warn('Could not load global recent links:', err);
    }
  }

  return fetched;
}
