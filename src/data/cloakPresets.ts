import { CloakPreset } from '../types/game';

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'default',
    name: 'Owen Watermelon V3 (Default)',
    title: 'Owen Watermelon V3',
    icon: '🍉',
    faviconUrl: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍉</text></svg>'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Home',
    icon: '🏫',
    faviconUrl: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: '📁',
    faviconUrl: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: '📄',
    faviconUrl: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    icon: '🎓',
    faviconUrl: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: '🌐',
    faviconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    title: 'Dashboard | Khan Academy',
    icon: '🍃',
    faviconUrl: 'https://www.khanacademy.org/favicon.ico'
  }
];

export function applyCloak(preset: CloakPreset) {
  document.title = preset.title;
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.faviconUrl;
  localStorage.setItem('owen_active_cloak', preset.id);
}

export function triggerPanic() {
  const panicUrl = localStorage.getItem('owen_panic_url') || 'https://classroom.google.com';
  // Fast emergency redirect
  window.location.replace(panicUrl);
}
