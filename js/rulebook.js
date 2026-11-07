// Strategy Rulebook & Mathematical Definitions Controller
// Home-Manager Light Theme integration

let activeRulebookStrategyId = "strat_fvg_01";

function initRulebook() {
  renderRulebookNav();
  renderRulebookDetail(activeRulebookStrategyId);
}

function selectStrategyForRulebook(id) {
  activeRulebookStrategyId = id;
  renderRulebookNav();
  renderRulebookDetail(id);
}

function renderRulebookNav() {
  const container = document.getElementById('rulebook-nav-list');
  if (!container) return;
  container.innerHTML = '';

  TRADING_DATA.strategies.forEach(s => {
    const isSelected = s.id === activeRulebookStrategyId;
    const btn = document.createElement('button');
    btn.className = `w-full text-left p-3 rounded-xl border text-xs font-mono transition flex items-center justify-between shadow-sm ${
      isSelected ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500/30' : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300'
    }`;
    btn.onclick = () => selectStrategyForRulebook(s.id);
    btn.innerHTML = `
      <div>
        <span class="block text-slate-800 font-bold">${s.name}</span>
        <span class="text-[10px] text-slate-400">${s.category} • ${s.primary_asset}</span>
      </div>
      <span class="text-xs font-bold ${s.metrics.profit_factor >= 1.8 ? 'text-teal-700' : 'text-blue-700'}">
        ${s.metrics.profit_factor} PF
      </span>
    `;
    container.appendChild(btn);
  });
}

function renderRulebookDetail(id) {
  const container = document.getElementById('rulebook-detail-panel');
  const s = TRADING_DATA.strategies.find(item => item.id === id);
  if (!container || !s) return;

  container.innerHTML = `
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
          ${s.category.toUpperCase()}
        </span>
        <h2 class="text-lg font-bold text-slate-900 mt-1">${s.name}</h2>
        <p class="text-xs text-slate-500">${s.description}</p>
      </div>
      <div class="text-right text-xs font-mono">
        <span class="text-slate-400 block text-[10px]">12Y COMPOSITE SCORE</span>
        <span class="text-teal-700 font-bold text-lg">${s.metrics.composite_score} / 100</span>
      </div>
    </div>

    <!-- Strategy Parameters & Core Mathematical Logic -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <span class="text-[11px] font-mono uppercase font-bold text-slate-700 flex items-center gap-1.5">
          <i data-lucide="sliders" class="w-3.5 h-3.5 text-teal-600"></i>
          Quantitative Parameters
        </span>
        <div class="space-y-1.5 text-xs font-mono">
          ${Object.entries(s.parameters).map(([k, v]) => `
            <div class="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span class="text-slate-500">${k}:</span>
              <span class="font-bold text-slate-800">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <span class="text-[11px] font-mono uppercase font-bold text-slate-700 flex items-center gap-1.5">
          <i data-lucide="shield" class="w-3.5 h-3.5 text-blue-600"></i>
          Risk Management Framework
        </span>
        <div class="space-y-1.5 text-xs font-mono">
          <div class="flex items-center justify-between py-1 border-b border-slate-200/50">
            <span class="text-slate-500">Risk Model:</span>
            <span class="font-bold text-slate-800">${s.risk_model}</span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200/50">
            <span class="text-slate-500">Primary Timeframe:</span>
            <span class="font-bold text-slate-800">${s.timeframe}</span>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-slate-200/50">
            <span class="text-slate-500">Tested Universe:</span>
            <span class="font-bold text-teal-700">${s.tested_assets.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Backtest Performance Summary Grid -->
    <div class="space-y-2 pt-1">
      <span class="text-[11px] font-mono uppercase font-bold text-slate-700">12-Year Continuous Tick Performance (2014–2026)</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <span class="text-slate-400 block text-[9px] uppercase">CAGR</span>
          <span class="text-slate-900 font-bold text-sm">+${s.metrics.annualized_cagr_pct.toFixed(1)}%</span>
        </div>
        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <span class="text-slate-400 block text-[9px] uppercase">Profit Factor</span>
          <span class="text-teal-700 font-bold text-sm">${s.metrics.profit_factor.toFixed(2)}</span>
        </div>
        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <span class="text-slate-400 block text-[9px] uppercase">Win Rate</span>
          <span class="text-slate-900 font-bold text-sm">${s.metrics.win_rate_pct.toFixed(1)}%</span>
        </div>
        <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
          <span class="text-slate-400 block text-[9px] uppercase">Max Drawdown</span>
          <span class="text-rose-600 font-bold text-sm">-${s.metrics.max_drawdown_pct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}
