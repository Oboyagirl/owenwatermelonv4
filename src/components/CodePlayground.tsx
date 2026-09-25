import React, { useState, useEffect, useRef } from 'react';
import { Code2, Play, PlusCircle, Check, Sparkles, RotateCcw } from 'lucide-react';
import { Game } from '../types/game';

interface CodePlaygroundProps {
  onAddGameToStore: (newGame: Omit<Game, 'id' | 'plays' | 'rating'>) => void;
}

const SAMPLE_TEMPLATES = [
  {
    name: 'Watermelon Clicker',
    html: `<div class="container">
  <h1>🍉 Melon Clicker</h1>
  <div id="melon" onclick="clickMelon()">🍉</div>
  <p>Melons Sliced: <span id="count">0</span></p>
  <button id="upgrade" onclick="buyUpgrade()">Upgrade Slicer (Cost: 10)</button>
</div>`,
    css: `body {
  background: #08160f;
  color: #fff;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  user-select: none;
}
.container { text-align: center; }
#melon {
  font-size: 80px;
  cursor: pointer;
  transition: transform 0.1s;
  margin: 20px 0;
}
#melon:active { transform: scale(1.2); }
#upgrade {
  background: #10b981;
  color: #064e3b;
  border: none;
  padding: 10px 18px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}`,
    js: `let count = 0;
let perClick = 1;
let cost = 10;

function clickMelon() {
  count += perClick;
  document.getElementById('count').textContent = count;
}

function buyUpgrade() {
  if (count >= cost) {
    count -= cost;
    perClick += 1;
    cost = Math.floor(cost * 1.5);
    document.getElementById('count').textContent = count;
    document.getElementById('upgrade').textContent = 'Upgrade Slicer (Cost: ' + cost + ')';
  }
}`
  },
  {
    name: 'Neon Particle Fountain',
    html: `<canvas id="canvas"></canvas>`,
    css: `body {
  margin: 0;
  overflow: hidden;
  background: #06110b;
}
canvas { display: block; }`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#ff2d55', '#10b981', '#34d399', '#facc15'];

function addParticle(x, y) {
  for(let i=0; i<5; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -6 - 2,
      r: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1
    });
  }
}

window.addEventListener('pointermove', e => addParticle(e.clientX, e.clientY));

function loop() {
  ctx.fillStyle = 'rgba(6, 17, 11, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= 0.02;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    if (p.life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(loop);
}
loop();`
  }
];

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ onAddGameToStore }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(SAMPLE_TEMPLATES[0].html);
  const [cssCode, setCssCode] = useState(SAMPLE_TEMPLATES[0].css);
  const [jsCode, setJsCode] = useState(SAMPLE_TEMPLATES[0].js);
  const [gameTitle, setGameTitle] = useState('Melon Clicker Game');
  const [gameCategory, setGameCategory] = useState<'Action' | 'Arcade' | 'Puzzle' | 'Casual' | 'Sports' | 'Retro' | 'Custom'>('Casual');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  const combinedSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            ${jsCode}
          } catch(err) {
            console.error(err);
          }
        <\/script>
      </body>
    </html>
  `;

  const handleRun = () => {
    setRenderKey(prev => prev + 1);
  };

  const handleLoadTemplate = (tpl: typeof SAMPLE_TEMPLATES[0]) => {
    setHtmlCode(tpl.html);
    setCssCode(tpl.css);
    setJsCode(tpl.js);
    setGameTitle(tpl.name);
    setRenderKey(prev => prev + 1);
  };

  const handleSaveAsGame = () => {
    if (!gameTitle.trim()) return;

    // Convert to standalone iframe srcdoc or data URL
    const fullHtml = combinedSrcDoc;
    const iframeCode = `<iframe srcdoc="${encodeURIComponent(fullHtml)}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

    onAddGameToStore({
      title: gameTitle.trim(),
      description: `Custom game built in Owen Watermelon V3 Code Sandbox with HTML, CSS, and JS.`,
      category: gameCategory,
      thumbnail: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2308160f'/><text x='50' y='65' font-size='45' text-anchor='middle'>🎮</text></svg>",
      tags: ["Custom", "HTML5", "CodeSandbox"],
      author: "Local Creator",
      iframeSrc: `data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`,
      iframeCode: iframeCode,
      customHtml: fullHtml,
      controls: [{ key: "Interactive", action: "Play" }]
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-[#10b981]" />
            HTML / CSS / JS Game Sandbox & Embedder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build and test custom web games in HTML, CSS, and JavaScript. Export directly into the games JSON catalog!
          </p>
        </div>

        {/* Templates */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Load Template:</span>
          {SAMPLE_TEMPLATES.map(t => (
            <button
              key={t.name}
              onClick={() => handleLoadTemplate(t)}
              className="px-2.5 py-1 text-xs font-medium bg-[#0c2016] hover:bg-[#16402a] text-slate-300 hover:text-white border border-[#16402a] rounded-lg transition-colors cursor-pointer"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Editor (Left) & Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Code Editor Panel */}
        <div className="bg-[#0c2016] border border-[#16402a] rounded-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Editor Header / Tabs */}
          <div className="bg-[#08160f] border-b border-[#16402a] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'html'
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'css'
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'js'
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JavaScript
              </button>
            </div>

            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-xs rounded-md transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </button>
          </div>

          {/* Textarea Code View */}
          <div className="flex-1 relative bg-[#06110b]">
            {activeTab === 'html' && (
              <textarea
                value={htmlCode}
                onChange={e => setHtmlCode(e.target.value)}
                placeholder="<!-- Enter HTML here -->"
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={cssCode}
                onChange={e => setCssCode(e.target.value)}
                placeholder="/* Enter CSS styles here */"
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-cyan-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            )}
            {activeTab === 'js' && (
              <textarea
                value={jsCode}
                onChange={e => setJsCode(e.target.value)}
                placeholder="// Enter JavaScript here"
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-amber-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            )}
          </div>
        </div>

        {/* Live Preview & Save Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0c2016] border border-[#16402a] rounded-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="bg-[#08160f] border-b border-[#16402a] px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                Live Sandboxed Iframe Preview
              </span>
              <button
                onClick={() => setRenderKey(prev => prev + 1)}
                className="text-xs text-slate-400 hover:text-white p-1"
                title="Restart Preview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <iframe
              key={renderKey}
              srcDoc={combinedSrcDoc}
              title="Playground Preview"
              className="w-full flex-1 border-0 bg-[#08160f]"
              sandbox="allow-scripts allow-forms"
            />
          </div>

          {/* Add to Games JSON form */}
          <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={gameTitle}
                onChange={e => setGameTitle(e.target.value)}
                placeholder="Game Title"
                className="px-3 py-1.5 bg-[#08160f] border border-[#16402a] rounded-lg text-xs text-white focus:outline-none flex-1 sm:w-48"
              />
              <select
                value={gameCategory}
                onChange={e => setGameCategory(e.target.value as any)}
                className="px-3 py-1.5 bg-[#08160f] border border-[#16402a] rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="Casual">Casual</option>
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <button
              onClick={handleSaveAsGame}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ff2d55] hover:bg-[#e11d48] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm shadow-[#ff2d55]/30"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              <span>{savedSuccess ? 'Added to Catalog!' : 'Save Game to Catalog'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
