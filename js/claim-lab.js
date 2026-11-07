// YouTube Claim Verification Lab Controller
// Embeds videos, displays side-by-side empirical audit, and renders detailed trade logs

let activeClaimId = "claim_001";

function initClaimsLab() {
  renderClaimCards();
  renderActiveClaim(activeClaimId);
}

function renderClaimCards() {
  const container = document.getElementById('claims-card-grid');
  if (!container) return;
  container.innerHTML = '';

  TRADING_DATA.youtube_claims.forEach(claim => {
    const isSelected = claim.id === activeClaimId;
    const card = document.createElement('div');
    card.className = `p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
      isSelected ? 'bg-[#121a2b] border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-[#0d131f] border-[#1e293b] hover:border-slate-700'
    }`;
    card.onclick = () => {
      activeClaimId = claim.id;
      renderClaimCards();
      renderActiveClaim(claim.id);
    };

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <span class="text-slate-400 font-bold">${claim.influencer_name}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${claim.verdict.badge_class}">
            ${claim.verdict.badge}
          </span>
        </div>
        <h3 class="text-xs font-bold text-white leading-snug line-clamp-2">
          ${claim.claim_title}
        </h3>
      </div>

      <div class="grid grid-cols-2 gap-2 bg-[#080c14] p-2 rounded-lg border border-[#1e293b] text-center font-mono text-[11px]">
        <div>
          <span class="text-slate-500 block text-[9px] uppercase">Claimed WR</span>
          <span class="text-amber-400 font-bold">${claim.claimed_metrics.win_rate}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[9px] uppercase">Real 5Y WR</span>
          <span class="text-emerald-400 font-bold">${claim.empirical_metrics.win_rate}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderActiveClaim(claimId) {
  const container = document.getElementById('active-claim-container');
  const claim = TRADING_DATA.youtube_claims.find(c => c.id === claimId);
  if (!container || !claim) return;

  container.innerHTML = `
    <!-- Top Bar with Verdict -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${claim.verdict.badge_class}">
            ${claim.verdict.badge}
          </span>
          <span class="text-xs text-slate-400 font-mono">Channel: <strong class="text-white">${claim.influencer_name}</strong></span>
        </div>
        <h2 class="text-base font-bold text-white mt-1">${claim.claim_title}</h2>
      </div>

      <div class="flex items-center gap-2">
        <a href="${claim.youtube_url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-mono font-bold hover:bg-red-600/30 transition flex items-center gap-1.5">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          <span>Watch Original Video</span>
        </a>
      </div>
    </div>

    <!-- Video Preview & Side-by-Side Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      <!-- Video Player (360p Review Video) -->
      <div class="bg-black rounded-xl overflow-hidden border border-[#1e293b] shadow-xl flex flex-col justify-between aspect-video">
        <video controls class="w-full h-full object-cover">
          <source src="${claim.video_src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- Side-by-Side Discrepancy Card -->
      <div class="bg-[#080c14] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Discrepancy Matrix (Claimed vs. Empirical 5Y Reality)
          </h3>
          
          <div class="grid grid-cols-2 gap-3 text-xs font-mono">
            <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span class="text-amber-400 font-bold block text-[11px]">CLAIMED IN VIDEO</span>
              <p class="text-slate-300">Win Rate: <strong class="text-white">${claim.claimed_metrics.win_rate}</strong></p>
              <p class="text-slate-300">Profit Factor: <strong class="text-white">${claim.claimed_metrics.profit_factor}</strong></p>
              <p class="text-slate-300">Drawdown: <strong class="text-white">${claim.claimed_metrics.max_drawdown}</strong></p>
              <p class="text-[10px] text-slate-500 pt-1">Sample: ${claim.claimed_sample}</p>
            </div>

            <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span class="text-emerald-400 font-bold block text-[11px]">5-YEAR EMPIRICAL TEST</span>
              <p class="text-slate-300">Win Rate: <strong class="text-emerald-400 font-bold">${claim.empirical_metrics.win_rate}</strong></p>
              <p class="text-slate-300">Profit Factor: <strong class="text-white">${claim.empirical_metrics.profit_factor}</strong></p>
              <p class="text-slate-300">Drawdown: <strong class="text-rose-400">${claim.empirical_metrics.max_drawdown}</strong></p>
              <p class="text-[10px] text-slate-400 pt-1">Trades: ${claim.empirical_metrics.total_trades} (${claim.empirical_metrics.total_return})</p>
            </div>
          </div>
        </div>

        <div class="p-3 bg-[#0d131f] rounded-lg border border-[#1e293b] text-xs">
          <span class="text-blue-400 font-mono font-bold text-[11px] block mb-1">OBJECTIVE QUANT AUDIT VERDICT:</span>
          <p class="text-slate-300 leading-relaxed text-xs">
            ${claim.verdict.summary}
          </p>
        </div>
      </div>

    </div>

    <!-- Trade Execution Log Table for this Claim -->
    <div class="space-y-2 pt-2">
      <div class="flex items-center justify-between text-xs font-mono">
        <h3 class="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <i data-lucide="list" class="w-3.5 h-3.5 text-blue-400"></i>
          Sample Trade Execution Tape (Recent Validated Setups)
        </h3>
        <span class="text-slate-500">1:2 R:R Model • Zero Discretion</span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-[#1e293b]">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-[#080c14] text-slate-400 text-[10px] uppercase border-b border-[#1e293b]">
            <tr>
              <th class="p-2.5">Trade ID</th>
              <th class="p-2.5">Date</th>
              <th class="p-2.5">Asset</th>
              <th class="p-2.5">Side</th>
              <th class="p-2.5">Entry ($)</th>
              <th class="p-2.5">Stop Loss ($)</th>
              <th class="p-2.5">Take Profit ($)</th>
              <th class="p-2.5">Exit ($)</th>
              <th class="p-2.5 text-center">Result</th>
              <th class="p-2.5 text-right">Paper PnL</th>
              <th class="p-2.5 text-right">Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1e293b] bg-[#0d131f]">
            ${claim.sample_trades.map(t => `
              <tr class="hover:bg-[#121a2b]">
                <td class="p-2.5 text-slate-400">${t.id}</td>
                <td class="p-2.5 text-slate-300">${t.date}</td>
                <td class="p-2.5 font-bold text-white">${t.asset}</td>
                <td class="p-2.5 font-bold ${t.type.includes('LONG') || t.type.includes('OVER') || t.type.includes('YES') ? 'text-emerald-400' : 'text-amber-400'}">${t.type}</td>
                <td class="p-2.5">${t.entry}</td>
                <td class="p-2.5 text-rose-400">${t.sl}</td>
                <td class="p-2.5 text-emerald-400">${t.tp}</td>
                <td class="p-2.5">${t.exit}</td>
                <td class="p-2.5 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                    ${t.status}
                  </span>
                </td>
                <td class="p-2.5 text-right font-bold ${t.pnl.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${t.pnl}</td>
                <td class="p-2.5 text-right text-slate-200 font-bold">${t.balance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}
