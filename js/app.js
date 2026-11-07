// Main Application Router & Orchestrator

function switchMainTab(tab) {
  document.getElementById('view-leaderboard').classList.add('hidden');
  document.getElementById('view-claims').classList.add('hidden');
  document.getElementById('view-rulebook').classList.add('hidden');

  const tabs = ['leaderboard', 'claims', 'rulebook'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab-btn-' + t);
    if (!btn) return;
    if (t === tab) {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-[#0d131f] text-white font-bold border border-blue-500/40 shadow-sm flex items-center gap-1.5 transition";
    } else {
      btn.className = "px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 transition";
    }
  });

  const activeView = document.getElementById('view-' + tab);
  if (activeView) activeView.classList.remove('hidden');

  if (tab === 'leaderboard') {
    if (!equityChartInstance) {
      setTimeout(initEquityChart, 50);
    }
  } else if (tab === 'claims') {
    initClaimsLab();
  } else if (tab === 'rulebook') {
    initRulebook();
  }

  if (window.lucide) lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', () => {
  renderLeaderboardTable();
  initEquityChart();
  initClaimsLab();
  initRulebook();
  if (window.lucide) lucide.createIcons();
});
