// Leaderboard Controller for Trading Strategizer
// Home-Manager Light Theme integration

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
      return sortDirection === 'asc' ? valB - valA : valA - valB;
    }

    return sortDirection === 'desc' ? valB - valA : valA - valB;
  });

  list.forEach((strat, index) => {
    const m = strat.metrics;
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 transition cursor-pointer border-b border-slate-100";
    tr.onclick = () => {
      selectStrategyForRulebook(strat.id);
      switchMainTab('rulebook');
    };

    const rankBadge = index === 0 ? 'bg-amber-100 text-amber-800 font-bold' : (index === 1 ? 'bg-slate-100 text-slate-700 font-bold' : (index === 2 ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-500'));
    const retColor = m.total_return_pct >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold';
    const pfColor = m.profit_factor >= 1.75 ? 'text-emerald-700 font-bold' : (m.profit_factor >= 1.0 ? 'text-blue-700' : 'text-rose-700');

    tr.innerHTML = `
      <td class="p-3 text-center">
        <span class="inline-block px-2 py-0.5 rounded text-[11px] font-mono ${rankBadge}">#${index + 1}</span>
      </td>
      <td class="p-3">
        <span class="font-bold text-slate-800 block text-xs hover:text-teal-700">${strat.name}</span>
        <span class="text-[11px] text-slate-400 font-mono">${strat.timeframe} • ${strat.risk_model}</span>
      </td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">${strat.category}</span>
      </td>
      <td class="p-3 font-semibold text-slate-700">${strat.primary_asset}</td>
      <td class="p-3 text-center ${retColor}">+${m.total_return_pct.toFixed(1)}%</td>
      <td class="p-3 text-center text-slate-600">${m.annualized_cagr_pct.toFixed(1)}%</td>
      <td class="p-3 text-center ${pfColor}">${m.profit_factor.toFixed(2)}</td>
      <td class="p-3 text-center text-slate-700">
        <span class="font-medium">${m.win_rate_pct.toFixed(1)}%</span>
        <div class="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
          <div class="h-full bg-teal-600" style="width: ${m.win_rate_pct}%"></div>
        </div>
      </td>
      <td class="p-3 text-center text-rose-600 font-medium">-${m.max_drawdown_pct.toFixed(1)}%</td>
      <td class="p-3 text-center font-bold text-blue-700">${m.sharpe_ratio.toFixed(2)}</td>
      <td class="p-3 text-center">
        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200">
          ${m.composite_score.toFixed(1)}
        </span>
      </td>
      <td class="p-3 text-right">
        <button class="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition flex items-center gap-1 ml-auto">
          <span>View Rules</span>
          <i data-lucide="chevron-right" class="w-3 h-3"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (window.lucide) lucide.createIcons();
}

function filterByAsset(assetClass) {
  currentAssetFilter = assetClass;
  const pills = ['ALL', 'Equities', 'Crypto', 'Commodities', 'Forex', 'Rates'];
  pills.forEach(p => {
    const btn = document.getElementById('filter-btn-' + p.toLowerCase());
    if (btn) {
      if (p.toLowerCase() === assetClass.toLowerCase()) {
        btn.className = "px-3 py-1 rounded-lg text-xs font-mono font-bold bg-teal-700 text-white shadow-sm";
      } else {
        btn.className = "px-3 py-1 rounded-lg text-xs font-mono text-slate-600 hover:bg-slate-100 transition";
      }
    }
  });

  renderLeaderboardTable();
}

function handleSortChange(field) {
  if (currentSortField === field) {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
  } else {
    currentSortField = field;
    sortDirection = (field === 'max_drawdown_pct') ? 'asc' : 'desc';
  }
  renderLeaderboardTable();
}
