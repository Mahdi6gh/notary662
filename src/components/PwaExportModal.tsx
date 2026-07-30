import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Copy, Check, Smartphone, Monitor, Code, ShieldCheck, Terminal, FileCode2, Layers } from 'lucide-react';

interface PwaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaExportModal: React.FC<PwaExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'tauri-windows' | 'tauri-android' | 'sw'>('manifest');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const manifestJsonContent = `{
  "name": "سامانه محاسبه هزینه اسناد و سهم‌الارث — دفتر اسناد رسمی ۶۶۲ تهران",
  "short_name": "دفترخانه ۶۶۲",
  "description": "سامانه محاسبه آنلاین تعرفه خدمات ثبتی، حق‌التحریر اسناد قطعی، رهنی، اجاره و محاسبه دقیق سهم‌الارث متوفی (دفتر اسناد رسمی ۶۶۲ تهران — سردفتر: خانم لیلا فرجزاده)",
  "start_url": "/",
  "id": "/",
  "display": "standalone",
  "background_color": "#001755",
  "theme_color": "#002279",
  "orientation": "any",
  "scope": "/",
  "lang": "fa-IR",
  "dir": "rtl",
  "categories": ["utilities", "business", "finance", "productivity"],
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ],
  "shortcuts": [
    {
      "name": "محاسبه ملک",
      "short_name": "املاک",
      "description": "محاسبه حق‌التحریر اسناد قطعی و انتقال ملک",
      "url": "/?tab=property"
    },
    {
      "name": "محاسبه سهم‌الارث",
      "short_name": "ارث",
      "description": "محاسبه دقیق تقسیم ارث متوفی بین ورثه",
      "url": "/?tab=inheritance"
    },
    {
      "name": "اسناد رهنی",
      "short_name": "رهن و وام",
      "description": "محاسبه هزینه اسناد رهنی و ترهین بانکی",
      "url": "/?tab=mortgage"
    }
  ]
}`;

  const tauriConfJsonContent = `{
  "$schema": "https://schema.tauri.app/config/2.0.0.json",
  "productName": "Notary662Tehran",
  "version": "1.0.0",
  "identifier": "ir.notary662th.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "دفتر اسناد رسمی ۶۶۲ تهران | محاسبه‌گر تعرفه اسناد و سهم‌الارث",
        "width": 1280,
        "height": 850,
        "resizable": true,
        "fullscreen": false,
        "transparent": false,
        "decorations": true,
        "theme": "Dark"
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "publisher": "دفتر اسناد رسمی ۶۶۲ تهران - لیلا فرجزاده",
    "copyright": "Copyright © 2026 Notary Office 662 Tehran. All rights reserved.",
    "category": "Office",
    "shortDescription": "سامانه محاسبه آنلاین تعرفه اسناد رسمی و سهم‌الارث قانونی متوفی",
    "longDescription": "سامانه محاسبه آنلاین تعرفه اسناد رسمی، بیع قطعی، اسناد رهنی، اجاره و سهم‌الارث قانونی متوفی مطابق بخشنامه ابلاغی سازمان ثبت اسناد و املاک کشور."
  }
}`;

  const serviceWorkerContent = `// Service Worker for Notary 662 Tehran PWA Offline & Caching
const CACHE_NAME = 'notary-662-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D3B574]/40 my-6 space-y-0"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] p-5 text-white flex items-center justify-between border-b border-[#D3B574]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-[#D3B574]/40">
                <Layers className="w-5 h-5 text-[#D3B574]" />
              </div>
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <span>خروجی اپلیکیشن (PWA / ویندوز / اندروید)</span>
                  <span className="text-[10px] bg-[#D3B574] text-[#001755] px-2 py-0.5 rounded-full font-bold">Tauri v2 + Web Manifest</span>
                </h3>
                <p className="text-xs text-blue-100/90 font-medium">پیکربندی رسمی، فایل Manifest.json و دستورات ساخت برای کلیه پلتفرم‌ها</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F5F0E6] p-2 border-b border-[#D3B574]/30 flex gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('manifest')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'manifest'
                  ? 'bg-[#002279] text-white shadow-xs border border-[#D3B574]/40'
                  : 'text-[#002279]/70 hover:text-[#002279] hover:bg-white/60'
              }`}
            >
              <FileCode2 className="w-4 h-4 text-[#D3B574]" />
              <span>فایل Web Manifest (manifest.json)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tauri-windows')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'tauri-windows'
                  ? 'bg-[#002279] text-white shadow-xs border border-[#D3B574]/40'
                  : 'text-[#002279]/70 hover:text-[#002279] hover:bg-white/60'
              }`}
            >
              <Monitor className="w-4 h-4 text-[#D3B574]" />
              <span>نسخه ویندوز (Tauri v2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tauri-android')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'tauri-android'
                  ? 'bg-[#002279] text-white shadow-xs border border-[#D3B574]/40'
                  : 'text-[#002279]/70 hover:text-[#002279] hover:bg-white/60'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#D3B574]" />
              <span>نسخه اندروید (APK / Tauri v2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sw')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'sw'
                  ? 'bg-[#002279] text-white shadow-xs border border-[#D3B574]/40'
                  : 'text-[#002279]/70 hover:text-[#002279] hover:bg-white/60'
              }`}
            >
              <Code className="w-4 h-4 text-[#D3B574]" />
              <span>Service Worker (sw.js)</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">

            {/* MANIFEST TAB */}
            {activeTab === 'manifest' && (
              <div className="space-y-4">
                <div className="bg-[#002279]/5 border border-[#002279]/15 rounded-2xl p-4 text-xs text-[#002279] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#D3B574]" />
                    <span>توضیحات Web App Manifest استاندارد</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    این فایل JSON در مسیر <code className="bg-white px-1.5 py-0.5 rounded border dir-ltr font-mono font-bold text-[#002279]">/public/manifest.json</code> قرار دارد و به تمام مرورگرها (کروم، سافاری، اج، فایرفاکس) اجازه می‌دهد تا سامانه دفترخانه ۶۶۲ را به عنوان اپلیکیشن مستقل PWA با رنگ‌های رسمی (<code className="font-mono text-[#002279]">#002279</code> و <code className="font-mono text-[#A88640]">#D3B574</code>) نصب کنند.
                  </p>
                </div>

                {/* Code display */}
                <div className="relative rounded-2xl bg-[#001755] text-blue-100 p-4 font-mono text-xs dir-ltr overflow-x-auto shadow-inner border border-[#D3B574]/30">
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(manifestJsonContent, 'manifest')}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-sans flex items-center gap-1 transition-colors border border-white/20"
                    >
                      {copiedKey === 'manifest' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#D3B574]" />}
                      <span>{copiedKey === 'manifest' ? 'کپی شد' : 'کپی کد'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile('manifest.json', manifestJsonContent, 'application/json')}
                      className="px-2.5 py-1 bg-[#D3B574] hover:bg-[#A88640] text-[#001755] rounded-lg text-[11px] font-sans font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود manifest.json</span>
                    </button>
                  </div>
                  <pre className="mt-8 text-[11px] leading-relaxed whitespace-pre-wrap">{manifestJsonContent}</pre>
                </div>
              </div>
            )}

            {/* TAURI WINDOWS TAB */}
            {activeTab === 'tauri-windows' && (
              <div className="space-y-4 text-xs text-[#002279]">
                <div className="bg-[#002279]/5 border border-[#002279]/15 rounded-2xl p-4 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm text-[#002279]">
                    <Monitor className="w-4 h-4 text-[#D3B574]" />
                    <span>راهنمای خروجی دسکتاپ ویندوز (Tauri v2 MSI / EXE)</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    پیکربندی زیر در مسیر <code className="bg-white px-1.5 py-0.5 rounded border dir-ltr font-mono font-bold">src-tauri/tauri.conf.json</code> ثبت شده است. با اجرای دستورات زیر در ترمینال، فایل خروجی نصبی ویندوز ساخته می‌شود.
                  </p>
                </div>

                {/* Commands */}
                <div className="bg-[#001755] text-white rounded-2xl p-4 space-y-2 font-mono text-xs dir-ltr border border-[#D3B574]/30">
                  <div className="flex items-center gap-1.5 text-[#D3B574] font-sans font-bold text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>دستورات ساخت خروجی ویندوز (Windows Build Commands):</span>
                  </div>
                  <pre className="bg-black/40 p-3 rounded-xl text-green-400 text-[11.5px] leading-relaxed overflow-x-auto">
{`# ۱. نصب افزونه CLI توری نسخه ۲
npm install -D @tauri-apps/cli@next

# ۲. اجرای برنامه در محیط توسعه ویندوز
npm run tauri dev

# ۳. ساخت فایل نصبی خروجی ویندوز (MSI & Portable EXE)
npm run tauri build`}
                  </pre>
                </div>

                {/* Code display */}
                <div className="relative rounded-2xl bg-[#001755] text-blue-100 p-4 font-mono text-xs dir-ltr overflow-x-auto shadow-inner border border-[#D3B574]/30">
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(tauriConfJsonContent, 'tauri-win')}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-sans flex items-center gap-1 transition-colors border border-white/20"
                    >
                      {copiedKey === 'tauri-win' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#D3B574]" />}
                      <span>{copiedKey === 'tauri-win' ? 'کپی شد' : 'کپی کد'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile('tauri.conf.json', tauriConfJsonContent, 'application/json')}
                      className="px-2.5 py-1 bg-[#D3B574] hover:bg-[#A88640] text-[#001755] rounded-lg text-[11px] font-sans font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود tauri.conf.json</span>
                    </button>
                  </div>
                  <pre className="mt-8 text-[11px] leading-relaxed whitespace-pre-wrap">{tauriConfJsonContent}</pre>
                </div>
              </div>
            )}

            {/* TAURI ANDROID TAB */}
            {activeTab === 'tauri-android' && (
              <div className="space-y-4 text-xs text-[#002279]">
                <div className="bg-[#002279]/5 border border-[#002279]/15 rounded-2xl p-4 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm text-[#002279]">
                    <Smartphone className="w-4 h-4 text-[#D3B574]" />
                    <span>راهنمای خروجی اپلیکیشن اندروید (Tauri v2 APK / AAB)</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    با استفاده از پلتفرم جدید Tauri v2، پروژه به صورت نیتیو برای Android Studio و دستگاه‌های موبایل کامپایل می‌شود.
                  </p>
                </div>

                {/* Commands */}
                <div className="bg-[#001755] text-white rounded-2xl p-4 space-y-2 font-mono text-xs dir-ltr border border-[#D3B574]/30">
                  <div className="flex items-center gap-1.5 text-[#D3B574] font-sans font-bold text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>دستورات ساخت فایل APK اندروید (Android Build Commands):</span>
                  </div>
                  <pre className="bg-black/40 p-3 rounded-xl text-amber-300 text-[11.5px] leading-relaxed overflow-x-auto">
{`# ۱. مقداردهی اولیه محیط اندروید توری۲
npm run tauri android init

# ۲. تست و ساخت پروژه روی شبیه‌ساز یا گوشی متصل
npm run tauri android dev

# ۳. تولید مستقیم فایل APK نهایی برای انتشار در بازار/مایکت/Google Play
npm run tauri android build -- --apk`}
                  </pre>
                </div>

                <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#D3B574]/40 space-y-1.5">
                  <span className="font-bold text-[#002279]">مزایای استفاده از Tauri v2 برای نسخه اندروید و ویندوز:</span>
                  <ul className="list-disc list-inside text-[11px] text-[#002279]/80 space-y-1 font-medium">
                    <li>حجم بسیار کم فایل خروجی (کمتر از ۱۵ مگابایت به دلیل استفاده از WebView نیتیو سیستم‌عامل)</li>
                    <li>سرعت بالا و مصرف بهینه حافظه RAM</li>
                    <li>عملکرد کاملا آفلاین و بدون نیاز به سرور مجزا</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SERVICE WORKER TAB */}
            {activeTab === 'sw' && (
              <div className="space-y-4">
                <div className="bg-[#002279]/5 border border-[#002279]/15 rounded-2xl p-4 text-xs text-[#002279] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <Code className="w-4 h-4 text-[#D3B574]" />
                    <span>کد Service Worker جهت عملکرد آفلاین (sw.js)</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    این کد در مسیر <code className="bg-white px-1.5 py-0.5 rounded border dir-ltr font-mono font-bold text-[#002279]">/public/sw.js</code> قرار گرفته و به کاربران اجازه می‌دهد سامانه را بدون اینترنت و به صورت آفلاین اجرا کنند.
                  </p>
                </div>

                {/* Code display */}
                <div className="relative rounded-2xl bg-[#001755] text-blue-100 p-4 font-mono text-xs dir-ltr overflow-x-auto shadow-inner border border-[#D3B574]/30">
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(serviceWorkerContent, 'sw')}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-sans flex items-center gap-1 transition-colors border border-white/20"
                    >
                      {copiedKey === 'sw' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#D3B574]" />}
                      <span>{copiedKey === 'sw' ? 'کپی شد' : 'کپی کد'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile('sw.js', serviceWorkerContent, 'text/javascript')}
                      className="px-2.5 py-1 bg-[#D3B574] hover:bg-[#A88640] text-[#001755] rounded-lg text-[11px] font-sans font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود sw.js</span>
                    </button>
                  </div>
                  <pre className="mt-8 text-[11px] leading-relaxed whitespace-pre-wrap">{serviceWorkerContent}</pre>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F5F0E6] border-t border-[#D3B574]/30 flex items-center justify-between">
            <span className="text-xs text-[#002279]/70 font-semibold">
              آماده کامپایل و نصب روی مرورگر، ویندوز و اندروید
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-[#001755] to-[#002279] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-white/20"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
