import React, { useState } from 'react';
import { Globe, ArrowRight, RotateCcw, ExternalLink, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

const PRESET_URLS = [
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Random' },
  { name: 'Internet Archive', url: 'https://archive.org' },
  { name: 'Scratch Projects', url: 'https://scratch.mit.edu/explore/projects/all' },
  { name: 'HTML5 Spec', url: 'https://html.spec.whatwg.org' },
  { name: 'DuckDuckGo Lite', url: 'https://lite.duckduckgo.com' },
  { name: 'Project Gutenberg', url: 'https://www.gutenberg.org' }
];

export const WebSandboxViewer: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://en.wikipedia.org/wiki/Watermelon');
  const [currentUrl, setCurrentUrl] = useState('https://en.wikipedia.org/wiki/Watermelon');
  const [allowSameOrigin, setAllowSameOrigin] = useState(true);
  const [allowScripts, setAllowScripts] = useState(true);
  const [allowForms, setAllowForms] = useState(true);
  const [key, setKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setCurrentUrl(url);
    setKey(prev => prev + 1);
  };

  const loadPreset = (url: string) => {
    setInputUrl(url);
    setCurrentUrl(url);
    setKey(prev => prev + 1);
  };

  const sandboxFlags = [
    allowScripts ? 'allow-scripts' : '',
    allowSameOrigin ? 'allow-same-origin' : '',
    allowForms ? 'allow-forms' : '',
    'allow-popups',
    'allow-modals'
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#10b981]" />
            Web Sandbox & Frame Proxy Viewer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Safely embed and inspect external websites or test custom web games in an isolated sandbox frame.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 mr-1">Quick Links:</span>
          {PRESET_URLS.map(p => (
            <button
              key={p.name}
              onClick={() => loadPreset(p.url)}
              className="px-2.5 py-1 text-xs font-medium bg-[#0c2016] hover:bg-[#16402a] text-slate-300 hover:text-white border border-[#16402a] rounded-lg transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Address bar & Security Controls */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-4 flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Enter web address or iframe embed URL (e.g. https://...)"
              className="w-full pl-9 pr-4 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-sm rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span>Navigate</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setKey(prev => prev + 1)}
            className="p-2 bg-[#08160f] hover:bg-[#16402a] text-slate-300 hover:text-white border border-[#16402a] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Reload Sandbox"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-[#08160f] hover:bg-[#16402a] text-slate-300 hover:text-white border border-[#16402a] rounded-lg transition-colors cursor-pointer shrink-0"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </form>

        {/* Sandbox isolation toggles */}
        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 border-t border-[#16402a]/60">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Sandbox Permissions:
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={allowScripts}
              onChange={e => setAllowScripts(e.target.checked)}
              className="accent-[#10b981] rounded"
            />
            <span>allow-scripts</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={allowSameOrigin}
              onChange={e => setAllowSameOrigin(e.target.checked)}
              className="accent-[#10b981] rounded"
            />
            <span>allow-same-origin</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={allowForms}
              onChange={e => setAllowForms(e.target.checked)}
              className="accent-[#10b981] rounded"
            />
            <span>allow-forms</span>
          </label>
        </div>
      </div>

      {/* Frame Container */}
      <div className="w-full h-[650px] bg-[#050d09] border border-[#16402a] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* Frame Status Bar */}
        <div className="h-9 bg-[#08160f] border-b border-[#16402a] px-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate max-w-lg">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <span className="truncate font-mono">{currentUrl}</span>
          </div>
          <span className="hidden sm:inline text-slate-500">Iframe Sandbox Container</span>
        </div>

        <iframe
          key={key}
          src={currentUrl}
          title="Sandbox Web Viewer"
          className="w-full flex-1 border-0 bg-white"
          sandbox={sandboxFlags}
          allow="autoplay; fullscreen; camera; microphone"
        />
      </div>

      {/* Helpful note about CSP / X-Frame-Options */}
      <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong>Note on External Embeds:</strong> Some major websites (such as Google or YouTube) send <code className="text-amber-300 font-mono">X-Frame-Options: SAMEORIGIN</code> to prevent iframing. Sites configured for embedding or public unblocked educational sites (Wikipedia, Scratch, Internet Archive, HTML5 web games) render seamlessly!
        </div>
      </div>
    </div>
  );
};
