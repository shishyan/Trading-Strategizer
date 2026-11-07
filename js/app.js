// Main Application Router & Orchestrator
// Home-Manager Left Sidebar Navigation integration

function switchMainTab(tab) {
  document.getElementById('view-leaderboard').classList.add('hidden');
  document.getElementById('view-claims').classList.add('hidden');
  document.getElementById('view-rulebook').classList.add('hidden');

  const tabs = ['leaderboard', 'claims', 'rulebook'];
  tabs.forEach(t => {
    const btn = document.getElementById('nav-item-' + t);
    if (!btn) return;
    if (t === tab) {
      btn.className = "nav-item active";
    } else {
      btn.className = "nav-item";
    }
  });

  // Update page header title & breadcrumb
  const pageTitle = document.getElementById('topbar-page-title');
  const breadcrumb = document.getElementById('topbar-breadcrumb');
  if (tab === 'leaderboard') {
    if (pageTitle) pageTitle.textContent = "5-Year Quant Leaderboard";
    if (breadcrumb) breadcrumb.textContent = "Leaderboard / Performance Matrix";
    if (!equityChartInstance) {
      setTimeout(initEquityChart, 50);
    }
  } else if (tab === 'claims') {
    if (pageTitle) pageTitle.textContent = "YouTube Claim Verification Lab";
    if (breadcrumb) breadcrumb.textContent = "Audits / YouTube Remix Verification";
    initClaimsLab();
  } else if (tab === 'rulebook') {
    if (pageTitle) pageTitle.textContent = "Quantitative Strategy Rulebook";
    if (breadcrumb) breadcrumb.textContent = "Models / Mathematical Specifications";
    initRulebook();
  }

  const activeView = document.getElementById('view-' + tab);
  if (activeView) activeView.classList.remove('hidden');

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }

  if (window.lucide) lucide.createIcons();
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderLeaderboardTable();
  initEquityChart();
  initClaimsLab();
  initRulebook();
  if (window.lucide) lucide.createIcons();
});
