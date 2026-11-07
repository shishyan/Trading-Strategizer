// YouTube Claim Verification Lab Controller
// Home-Manager Light Theme integration

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
      isSelected ? 'bg-teal-50/70 border-teal-500 shadow-sm ring-1 ring-teal-500/30' : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
    }`;
    card.onclick = () => {
      activeClaimId = claim.id;
      renderClaimCards();
      renderActiveClaim(claim.id);
    };

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <span class="text-slate-500 font-bold truncate max-w-[170px]">${claim.influencer_name}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${claim.verdict.badge_class}">
            ${claim.verdict.badge}
          </span>
        </div>
        <h3 class="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
          ${claim.claim_title}
        </h3>
      </div>

      <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center font-mono text-[11px]">
        <div>
          <span class="text-slate-400 block text-[9px] uppercase font-semibold">Claimed WR</span>
          <span class="text-amber-700 font-bold">${claim.claimed_metrics.win_rate}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[9px] uppercase font-semibold">Real 5Y WR</span>
          <span class="text-teal-700 font-bold">${claim.empirical_metrics.win_rate}</span>
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
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${claim.verdict.badge_class}">
            ${claim.verdict.badge}
          </span>
          <span class="text-xs text-slate-500 font-mono">Source Channel: <strong class="text-slate-800">${claim.influencer_name}</strong></span>
        </div>
        <h2 class="text-base font-bold text-slate-900 mt-1">${claim.claim_title}</h2>
      </div>

      <div class="flex items-center gap-2">
        <a href="${claim.youtube_url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold hover:bg-red-100 transition flex items-center gap-1.5 shadow-sm">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          <span>Watch Original Video</span>
        </a>
      </div>
    </div>

    <!-- Video Preview & Side-by-Side Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      <!-- Video Player (1080p Master Remix Video with Switcher) -->
      <div class="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm p-3.5 flex flex-col space-y-3">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-slate-600 font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Original YouTube Remix Player
          </span>
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onclick="switchVideoFormat('hd', '${claim.video_src_1080p || claim.video_src}')" id="btn-format-hd" class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-700 text-white shadow-sm">1080p 60s Remix</button>
            <button onclick="switchVideoFormat('preview', '${claim.video_src_360p || claim.video_src}')" id="btn-format-preview" class="px-2 py-0.5 rounded text-[10px] text-slate-600 hover:text-slate-900">360p</button>
            <button onclick="switchVideoFormat('shorts', '${claim.video_src_shorts || claim.video_src}')" id="btn-format-shorts" class="px-2 py-0.5 rounded text-[10px] text-slate-600 hover:text-slate-900">9:16 Shorts</button>
          </div>
        </div>
        
        <div class="relative bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]" id="video-container-box">
          <video id="claim-active-video" controls class="max-h-[360px] w-auto mx-auto object-contain">
            <source src="${claim.video_src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <!-- Side-by-Side Discrepancy Card -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
        <div>
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            Discrepancy Matrix (Claimed vs. Empirical 5Y Reality)
          </h3>
          
          <div class="grid grid-cols-2 gap-3 text-xs font-mono">
            <div class="p-3 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1">
              <span class="text-amber-800 font-bold block text-[11px]">CLAIMED IN VIDEO</span>
              <p class="text-slate-700">Win Rate: <strong class="text-slate-900">${claim.claimed_metrics.win_rate}</strong></p>
              <p class="text-slate-700">Profit Factor: <strong class="text-slate-900">${claim.claimed_metrics.profit_factor}</strong></p>
              <p class="text-slate-700">Drawdown: <strong class="text-slate-900">${claim.claimed_metrics.max_drawdown}</strong></p>
              <p class="text-[10px] text-slate-500 pt-1">Sample: ${claim.claimed_sample}</p>
            </div>

            <div class="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 space-y-1">
              <span class="text-emerald-800 font-bold block text-[11px]">EMPIRICAL TEST</span>
              <p class="text-slate-700">Win Rate: <strong class="text-emerald-700 font-bold">${claim.empirical_metrics.win_rate}</strong></p>
              <p class="text-slate-700">Profit Factor: <strong class="text-slate-900">${claim.empirical_metrics.profit_factor}</strong></p>
              <p class="text-slate-700">Drawdown: <strong class="text-rose-700">${claim.empirical_metrics.max_drawdown}</strong></p>
              <p class="text-[10px] text-slate-500 pt-1">Trades: ${claim.empirical_metrics.total_trades} (${claim.empirical_metrics.total_return})</p>
            </div>
          </div>

          <div class="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
            <span class="text-slate-700 font-semibold block mb-1">Empirical Verdict & Analysis:</span>
            <p class="text-slate-600 leading-relaxed">${claim.verdict.summary}</p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Test Capital: $10,000 / instrument</span>
          <span class="text-teal-700 font-bold">100% Unbiased Quantitative Audit</span>
        </div>
      </div>
    </div>

    <!-- Live Trade Entries Tape -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 class="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
          <i data-lucide="list" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>Sample Trade Execution Log (Recent Trades from 7-Asset Test Run)</span>
        </h3>
        <span class="text-[11px] font-mono text-slate-400">Total Tested Trades: 79</span>
      </div>

      <div class="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] uppercase">
            <tr>
              <th class="p-2.5">Trade ID</th>
              <th class="p-2.5">Date</th>
              <th class="p-2.5">Asset</th>
              <th class="p-2.5">Side</th>
              <th class="p-2.5">Entry</th>
              <th class="p-2.5">Stop Loss</th>
              <th class="p-2.5">Target</th>
              <th class="p-2.5">Exit</th>
              <th class="p-2.5 text-center">Status</th>
              <th class="p-2.5 text-right">PnL</th>
              <th class="p-2.5 text-right">Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${claim.sample_trades.map(t => `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="p-2.5 font-bold text-slate-900">${t.id}</td>
                <td class="p-2.5 text-slate-500">${t.date}</td>
                <td class="p-2.5 font-semibold text-slate-800">${t.asset}</td>
                <td class="p-2.5 font-bold ${t.type === 'LONG' ? 'text-teal-700' : 'text-rose-700'}">${t.type}</td>
                <td class="p-2.5">${t.entry}</td>
                <td class="p-2.5 text-rose-600">${t.sl}</td>
                <td class="p-2.5 text-teal-600">${t.tp}</td>
                <td class="p-2.5">${t.exit}</td>
                <td class="p-2.5 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'WIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                    ${t.status}
                  </span>
                </td>
                <td class="p-2.5 text-right font-bold ${t.pnl.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'}">${t.pnl}</td>
                <td class="p-2.5 text-right text-slate-900 font-bold">${t.balance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function switchVideoFormat(format, src) {
  const vid = document.getElementById('claim-active-video');
  const btnHd = document.getElementById('btn-format-hd');
  const btnPreview = document.getElementById('btn-format-preview');
  const btnShorts = document.getElementById('btn-format-shorts');
  if (!vid) return;

  vid.src = src;
  vid.load();
  vid.play().catch(() => {});

  [btnHd, btnPreview, btnShorts].forEach(b => {
    if (b) b.className = "px-2.5 py-0.5 rounded text-[10px] text-slate-600 hover:text-slate-900";
  });

  if (format === 'hd' && btnHd) {
    btnHd.className = "px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-700 text-white shadow-sm";
  } else if (format === 'preview' && btnPreview) {
    btnPreview.className = "px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white shadow-sm";
  } else if (format === 'shorts' && btnShorts) {
    btnShorts.className = "px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-700 text-white shadow-sm";
  }
}
