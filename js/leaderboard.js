// Leaderboard Controller for Trading Strategizer
// Handles sorting, filtering, and table rendering

let currentAssetFilter = 'ALL';
let currentSortField = 'composite_score';
let sortDirection = 'desc';

function renderLeaderboardTable() {
  const tbody = document.getElementById('leaderboard-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let list = [...TRADING_DATA.strategies];

  // Apply Asset Filter
  if (currentAssetFilter !== 'ALL') {
    list = list.filter(s => s.asset_class.toLowerCase() === currentAssetFilter.toLowerCase());
  }

  // Apply Sorting
  list.sort((a, b) => {
    let valA = a.metrics[currentSortField] !== undefined ? a.metrics[currentSortField] : a[currentSortField];
    let valB = b.metrics[currentSortField] !== undefined ? b.metrics[currentSortField] : b[currentSortField];

    if (currentSortField === 'max_drawdown_pct') {
      // For drawdown, lower absolute value is better
      return sortDirection === 'asc' ? valB - valA : valA - valB;
    }

    return sortDirection === 'desc' ? valB - valA : valA - valB;
  });

  list.forEach((strat, index) => {
    const m = strat.metrics;
    const tr = document.createElement('tr');
    tr.className = "hover:bg-[#121a2b] transition cursor-pointer";
    tr.onclick = () => {
      selectStrategyForRulebook(strat.id);
      switchMainTab('rulebook');
    };

    const rankColor = index === 0 ? 'text-amber-400 font-bold' : (index === 1 ? 'text-slate-300 font-bold' : (index === 2 ? 'text-amber-600 font-bold' : 'text-slate-400'));
    const retColor = m.total_return_pct >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold';
    const pfColor = m.profit_factor >= 1.75 ? 'text-emerald-400 font-bold' : (m.profit_factor >= 1.0 ? 'text-blue-400' : 'text-rose-400');

    tr.innerHTML = `
      <td class="p-3 text-center ${rankColor}">#${index + 1}</td>
      <td class="p-3">
        <span class="font-bold text-slate-100 block text-xs hover:text-blue-400">${strat.name}</span>
        <span class="text-[10px] text-slate-500 font-mono">${strat.timeframe} • ${strat.risk_model}</span>
      </td>
      <td class="p-3 text-slate-300">${strat.category}</td>
      <td class="p-3 font-semibold text-slate-200">${strat.primary_asset}</td>
      <td class="p-3 text-center ${retColor}">+${m.total_return_pct.toFixed(1)}%</td>
      <td class="p-3 text-center text-slate-300">${m.annualized_cagr_pct.toFixed(1)}%</td>
      <td class="p-3 text-center ${pfColor}">${m.profit_factor.toFixed(2)}</td>
      <td class="p-3 text-center text-slate-200">
        <span>${m.win_rate_pct.toFixed(1)}%</span>
        <div class="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
          <div class="h-full bg-emerald-500" style="width: ${m.win_rate_pct}%"></div>
        </div>
      </td>
      <td class="p-3 text-center text-rose-400">-${m.max_drawdown_pct.toFixed(1)}%</td>
      <td class="p-3 text-center text-blue-400 font-bold">${m.sharpe_ratio.toFixed(2)}</td>
      <td class="p-3 text-center">
        <span class="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
          ${m.composite_score.toFixed(1)}
        </span>
      </td>
      <td class="p-3 text-right">
        <button class="px-2 py-1 rounded bg-[#080c14] border border-[#1e293b] text-slate-300 hover:text-white hover:border-blue-500 transition text-[11px]">
          Rules &rarr;
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const countBadge = document.getElementById('stat-strat-count');
  if (countBadge) countBadge.innerText = `${list.length} Models`;
}

function filterAssetClass(cat) {
  currentAssetFilter = cat;
  
  const buttons = ['all', 'equities', 'crypto', 'commodities', 'forex'];
  buttons.forEach(b => {
    const el = document.getElementById('filter-' + b);
    if (!el) return;
    if (b === cat.toLowerCase()) {
      el.className = "px-2.5 py-1 rounded bg-blue-600 text-white font-bold transition";
    } else {
      el.className = "px-2.5 py-1 rounded bg-[#080c14] text-slate-300 hover:text-white border border-[#1e293b] transition";
    }
  });

  renderLeaderboardTable();
}

function applySorting(field) {
  currentSortField = field;
  renderLeaderboardTable();
}
