import React, { useState, useEffect } from 'react';
import { EyeOff, ShieldAlert, Sparkles, Check, Copy, Bookmark, ExternalLink } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak, triggerPanic } from '../data/cloakPresets';
import { CloakPreset } from '../types/game';

export const TabCloaker: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem('owen_active_cloak') || 'default';
  });
  const [customTitle, setCustomTitle] = useState('');
  const [customFavicon, setCustomFavicon] = useState('');
  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem('owen_panic_url') || 'https://classroom.google.com';
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSelectPreset = (preset: CloakPreset) => {
    applyCloak(preset);
    setActiveId(preset.id);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const customPreset: CloakPreset = {
      id: 'custom',
      name: 'Custom Cloak',
      title: customTitle,
      icon: '🎭',
      faviconUrl: customFavicon.trim() || 'https://www.google.com/favicon.ico'
    };
    applyCloak(customPreset);
    setActiveId('custom');
  };

  const handleSavePanicUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('owen_panic_url', panicUrl);
    alert('Panic redirect URL updated to: ' + panicUrl);
  };

  const bookmarklets = [
    {
      name: 'Stealth Tab Cloaker',
      desc: 'Instantly changes current tab title to Google Classroom and sets the icon.',
      code: "javascript:(function(){document.title='Home';var link=document.querySelector(\"link[rel*='icon']\")||document.createElement('link');link.type='image/x-icon';link.rel='shortcut icon';link.href='https://ssl.gstatic.com/classroom/favicon.png';document.head.appendChild(link);})();"
    },
    {
      name: 'about:blank Game Shield',
      desc: 'Launches the current web page embedded in an about:blank stealth window.',
      code: "javascript:(function(){var url=window.location.href;var win=window.open('about:blank','_blank');win.document.write('<style>body{margin:0;overflow:hidden;background:#000;}</style><iframe src=\"'+url+'\" style=\"width:100%;height:100vh;border:none;\"></iframe>');win.document.close();})();"
    },
    {
      name: 'Instant Panic Button',
      desc: 'Immediately replaces the current browser tab with Google Classroom.',
      code: "javascript:(function(){window.location.replace('https://classroom.google.com');})();"
    },
    {
      name: 'Quick Dark Mode Inverter',
      desc: 'Inverts high-contrast dark theme on any webpage without extensions.',
      code: "javascript:(function(){var el=document.documentElement;el.style.filter=el.style.filter==='invert(1) hue-rotate(180deg)'?'':'invert(1) hue-rotate(180deg)';})();"
    }
  ];

  const copyBookmarklet = (name: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(name);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <EyeOff className="w-6 h-6 text-[#10b981]" />
          Tab Cloaker & Stealth Camouflage
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Disguise the Owen Watermelon tab with authentic titles and icons like Google Classroom, Google Drive, or Canvas.
        </p>
      </div>

      {/* Simulated Tab Bar Preview */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Live Browser Tab Simulation
        </span>
        <div className="bg-[#08160f] border border-[#16402a] rounded-lg p-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <div className="flex items-center gap-2 bg-[#0c2016] px-3 py-1.5 rounded-md border border-[#16402a] max-w-xs shadow-inner">
            <span className="text-base">
              {CLOAK_PRESETS.find(p => p.id === activeId)?.icon || '🍉'}
            </span>
            <span className="text-xs font-medium text-white truncate">
              {document.title}
            </span>
          </div>
          <span className="text-[11px] text-[#10b981] ml-auto font-medium hidden sm:inline">
            Active Disguise Applied ✓
          </span>
        </div>
      </div>

      {/* Preset Cloaks Grid */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          One-Click Cloak Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CLOAK_PRESETS.map(preset => {
            const isActive = activeId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#10b981]/15 border-[#10b981] text-white shadow-md shadow-[#10b981]/10'
                    : 'bg-[#0c2016] border-[#16402a] hover:border-[#10b981]/50 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-2xl">{preset.icon}</span>
                <div className="flex flex-col overflow-hidden flex-1">
                  <span className="text-xs font-bold truncate">{preset.name}</span>
                  <span className="text-[11px] text-slate-400 truncate">Title: "{preset.title}"</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-[#10b981] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Title & Favicon */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Custom Disguise Configuration
        </h3>
        <form onSubmit={handleApplyCustom} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Tab Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g. Science Homework - Period 4"
              className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Favicon URL (Optional)</label>
            <input
              type="text"
              value={customFavicon}
              onChange={e => setCustomFavicon(e.target.value)}
              placeholder="https://example.com/favicon.ico"
              className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Apply Custom Disguise
            </button>
          </div>
        </form>
      </div>

      {/* Emergency Panic Key Configuration */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ff2d55]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Emergency Panic Button & Esc Key
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Pressing the <kbd className="px-1.5 py-0.5 bg-[#16402a] rounded text-emerald-300 font-mono">Esc</kbd> key or clicking the top Panic Button immediately redirects your active tab to this safety URL with zero trace.
        </p>
        <form onSubmit={handleSavePanicUrl} className="flex gap-2">
          <input
            type="text"
            value={panicUrl}
            onChange={e => setPanicUrl(e.target.value)}
            placeholder="https://classroom.google.com"
            className="flex-1 px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#ff2d55] rounded-lg text-sm text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#ff2d55] hover:bg-[#e11d48] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Update URL
          </button>
        </form>
      </div>

      {/* Bookmarklets Hub */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#10b981]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Stealth Bookmarklets (Copy & Paste to Bookmarks)
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Create a new bookmark in your browser, set the name, and paste the code below into the URL field. Click it anytime to activate!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {bookmarklets.map(b => (
            <div
              key={b.name}
              className="p-3.5 bg-[#08160f] border border-[#16402a] rounded-xl flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-xs font-bold text-white block">{b.name}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block leading-normal">{b.desc}</span>
              </div>
              <button
                onClick={() => copyBookmarklet(b.name, b.code)}
                className="self-end flex items-center gap-1.5 px-3 py-1 bg-[#16402a] hover:bg-[#255238] text-emerald-300 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                {copiedKey === b.name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === b.name ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
