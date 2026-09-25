import React, { useState } from 'react';
import { 
  FileCode2, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Plus, 
  RotateCcw, 
  X,
  Code
} from 'lucide-react';
import { Game } from '../types/game';

interface JsonManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onImportJson: (jsonString: string) => boolean;
  onDownloadJson: () => void;
  onResetToDefault: () => void;
  onAddGame: (game: Omit<Game, 'id' | 'plays' | 'rating'>) => void;
}

export const JsonManagerModal: React.FC<JsonManagerModalProps> = ({
  isOpen,
  onClose,
  games,
  onImportJson,
  onDownloadJson,
  onResetToDefault,
  onAddGame
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'import'>('view');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // New Game Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Game['category']>('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('Unblocked, Arcade');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    const ok = onImportJson(importText);
    if (ok) {
      alert('Games JSON successfully imported!');
      onClose();
    } else {
      setImportError('Invalid JSON format. Please ensure it is a valid JSON array of game objects.');
    }
  };

  const handleAddNewGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !iframeInput.trim()) return;

    let src = iframeInput.trim();
    let iframeCode = iframeInput.trim();

    // Check if user pasted an actual <iframe> tag
    if (iframeInput.includes('<iframe') && iframeInput.includes('src=')) {
      const match = iframeInput.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        src = match[1];
      }
    } else {
      // User pasted just a URL
      iframeCode = `<iframe src="${src}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    onAddGame({
      title: title.trim(),
      description: description.trim() || 'Custom unblocked game embedded via iframe.',
      category,
      thumbnail: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23092015'/><text x='50' y='60' font-size='40' text-anchor='middle'>🎮</text></svg>",
      tags: tags.length ? tags : ['Arcade'],
      author: author.trim() || 'Owen Watermelon User',
      iframeSrc: src,
      iframeCode: iframeCode,
      controls: [{ key: 'Mouse / Keys', action: 'Play Game' }]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c2016] border border-[#16402a] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Topbar */}
        <div className="bg-[#08160f] border-b border-[#16402a] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-5 h-5 text-[#10b981]" />
            <h3 className="text-base font-bold text-white">
              JSON Catalog & Iframe Storage Manager
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#16402a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="bg-[#08160f]/60 px-6 py-2 border-b border-[#16402a] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'view' ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-slate-400 hover:text-white'
            }`}
          >
            View games.json ({games.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'add' ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-slate-400 hover:text-white'
            }`}
          >
            + Add Game via Iframe
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'import' ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Import JSON
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'view' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-400">
                  Each game entry is stored with its iframe embed configuration in JSON format.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16402a] hover:bg-[#255238] text-emerald-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={onDownloadJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download games.json</span>
                  </button>
                  <button
                    onClick={onResetToDefault}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-lg border border-red-800/40 transition-colors cursor-pointer"
                    title="Restore default game list"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-[#16402a] bg-[#06110b] overflow-hidden">
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[420px] leading-relaxed">
                  {jsonString}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleAddNewGame} className="flex flex-col gap-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Game Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Slope Unblocked"
                    className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Action">Action</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Casual">Casual</option>
                    <option value="Sports">Sports</option>
                    <option value="Retro">Retro</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">
                  Iframe Embed Code or Game URL *
                </label>
                <textarea
                  required
                  value={iframeInput}
                  onChange={e => setIframeInput(e.target.value)}
                  placeholder={`Paste either an <iframe> tag or a direct game link, e.g.:\n<iframe src="https://..." width="100%" height="100%" frameborder="0"></iframe>`}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-xs font-mono text-emerald-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Author / Studio</label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="e.g. Community"
                    className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Speed, 3D, Reflex"
                    className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the game objectives and gameplay..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#16402a]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save to games.json
                </button>
              </div>
            </form>
          )}

          {activeTab === 'import' && (
            <form onSubmit={handleImportSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto">
              <p className="text-xs text-slate-300">
                Paste your custom <code className="font-mono text-emerald-400">games.json</code> content below to update the game library catalog.
              </p>

              {importError && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
                  {importError}
                </div>
              )}

              <textarea
                required
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Paste JSON array here..."
                rows={10}
                className="w-full p-4 bg-[#08160f] border border-[#16402a] focus:border-[#10b981] rounded-xl text-xs font-mono text-emerald-300 focus:outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Load and Replace Catalog
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
