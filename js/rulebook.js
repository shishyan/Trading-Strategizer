// Strategy Rulebook & Mathematical Definitions Controller

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
    btn.className = `w-full text-left p-3 rounded-lg border text-xs font-mono transition flex items-center justify-between ${
      isSelected ? 'bg-blue-600/20 border-blue-500 text-white font-bold' : 'bg-[#080c14] border-[#1e293b] text-slate-400 hover:text-white'
    }`;
    btn.onclick = () => selectStrategyForRulebook(s.id);
    btn.innerHTML = `
      <div>
        <span class="block text-slate-200 font-bold">${s.name}</span>
        <span class="text-[10px] text-slate-500">${s.category} • ${s.primary_asset}</span>
      </div>
      <span class="text-xs font-bold ${s.metrics.profit_factor >= 1.8 ? 'text-emerald-400' : 'text-blue-400'}">
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
    <div class="border-b border-[#1e293b] pb-3 flex items-center justify-between">
      <div>
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          ${s.category.toUpperCase()}
        </span>
        <h2 class="text-lg font-bold text-white mt-1">${s.name}</h2>
        <p class="text-xs text-slate-400">${s.description}</p>
      </div>
      <div class="text-right text-xs font-mono">
        <span class="text-slate-500 block">5Y SCORE</span>
        <span class="text-emerald-400 font-bold text-base">${s.metrics.composite_score} / 100</span>
      </div>
    </div>

    <!-- Parameter Matrix -->
    <div>
      <h3 class="text-xs font-mono font-bold uppercase text-slate-300 mb-2">Engine Parameters</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div class="p-2.5 rounded-lg bg-[#080c14] border border-[#1e293b]">
          <span class="text-slate-500 block text-[10px]">TIMEFRAME</span>
          <span class="text-white font-bold">${s.timeframe}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-[#080c14] border border-[#1e293b]">
          <span class="text-slate-500 block text-[10px]">RISK MODEL</span>
          <span class="text-amber-400 font-bold truncate block">${s.risk_model}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-[#080c14] border border-[#1e293b]">
          <span class="text-slate-500 block text-[10px]">PRIMARY ASSET</span>
          <span class="text-white font-bold">${s.primary_asset}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-[#080c14] border border-[#1e293b]">
          <span class="text-slate-500 block text-[10px]">TESTED UNIVERSE</span>
          <span class="text-slate-300 font-bold">${s.tested_assets.join(', ')}</span>
        </div>
      </div>
    </div>

    <!-- Mathematical Specification & Pseudocode -->
    <div>
      <h3 class="text-xs font-mono font-bold uppercase text-slate-300 mb-2">Algorithm Definition & Pseudocode</h3>
      <div class="bg-[#080c14] p-3 rounded-lg border border-[#1e293b] font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
        <p class="text-blue-400">// Signal Generation Engine for ${s.name}</p>
        <p><span class="text-purple-400">def</span> <span class="text-amber-300">evaluate_setup</span>(bar, previous_bars):</p>
        <p class="pl-4">atr = calculate_atr(period=14)</p>
        <p class="pl-4">ema_trend = calculate_ema(period=200)</p>
        <p class="pl-4 text-slate-500">// Check directional condition</p>
        <p class="pl-4"><span class="text-purple-400">if</span> bar.close &gt; ema_trend <span class="text-purple-400">and</span> identify_imbalance(bar, previous_bars):</p>
        <p class="pl-8">entry = bar.open</p>
        <p class="pl-8">stop_loss = calculate_sl(bar, type='STRUCTURAL')</p>
        <p class="pl-8">take_profit = entry + (entry - stop_loss) * 2.0</p>
        <p class="pl-8"><span class="text-purple-400">return</span> Order(side='LONG', entry=entry, sl=stop_loss, tp=take_profit)</p>
      </div>
    </div>
  `;
}
