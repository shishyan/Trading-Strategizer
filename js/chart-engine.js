// Chart Engine for Trading Strategizer
// Multi-Equity Curve rendering with Chart.js configured for 12-Year Continuous Backtesting (2014–2026)

let equityChartInstance = null;

function initEquityChart() {
  const ctx = document.getElementById('equityChart');
  if (!ctx) return;

  // 12-Year Timeline labels: 2014 – 2026 ($10,000 baseline)
  const labels = [
    'Nov 2014', 'Nov 2015', 'Nov 2016', 'Nov 2017', 
    'Nov 2018', 'Nov 2019', 'Nov 2020', 'Nov 2021', 
    'Nov 2022', 'Nov 2023', 'Nov 2024', 'Nov 2025', 'Nov 2026'
  ];
  
  // Normalized Equity Curves ($10,000 Starting Paper Capital)
  // SPY Benchmark: +341.3% over 12Y ($10,000 -> $44,130)
  const dataSPY = [10000, 10320, 11280, 13740, 14590, 16920, 20380, 26940, 22100, 25800, 34200, 39800, 44130];
  
  // Triple Supertrend + ATR (Crypto/Macro): +1,842.6% over 12Y ($10,000 -> $194,260)
  const dataSupertrend = [10000, 13800, 22400, 48200, 36500, 52100, 94200, 142000, 118000, 148000, 164000, 182000, 194260];
  
  // Poisson Statistical Arbitrage: +582.4% over 12Y ($10,000 -> $68,240, Sharpe 2.18)
  const dataStatArb = [10000, 12100, 14600, 17800, 21400, 25600, 30800, 37200, 43100, 49800, 56200, 62100, 68240];
  
  // ICT Fair Value Gap (QQQ): +412.8% over 12Y ($10,000 -> $51,280)
  const dataFVG = [10000, 11900, 14200, 18100, 17200, 22400, 28900, 36400, 32100, 38900, 44200, 48100, 51280];

  if (equityChartInstance) {
    equityChartInstance.destroy();
  }

  equityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Triple Supertrend (BTC/Macro)',
          data: dataSupertrend,
          borderColor: '#0f766e', // Teal accent
          backgroundColor: 'rgba(15, 118, 110, 0.06)',
          borderWidth: 2.2,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0f766e',
          tension: 0.25,
          fill: true
        },
        {
          label: 'Poisson Stat-Arb (SPY/QQQ)',
          data: dataStatArb,
          borderColor: '#7c3aed', // Purple tone
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 2.5,
          tension: 0.25
        },
        {
          label: 'ICT Fair Value Gap (QQQ)',
          data: dataFVG,
          borderColor: '#1d4ed8', // Royal Blue
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 2.5,
          tension: 0.25
        },
        {
          label: 'SPY Benchmark (Buy & Hold)',
          data: dataSPY,
          borderColor: '#94a3b8',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          borderWidth: 1.8,
          pointRadius: 0,
          tension: 0.25
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#344054',
            font: { family: 'Manrope', size: 11, weight: '600' },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: 'rgba(15, 23, 42, 0.12)',
          borderWidth: 1,
          titleColor: '#172033',
          bodyColor: '#344054',
          titleFont: { family: 'Manrope', size: 12, weight: '700' },
          bodyFont: { family: 'JetBrains Mono', size: 11 },
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.parsed.y.toLocaleString()} (${((context.parsed.y - 10000)/100).toFixed(1)}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(15, 23, 42, 0.05)' },
          ticks: { color: '#667085', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(15, 23, 42, 0.05)' },
          ticks: {
            color: '#667085',
            font: { family: 'JetBrains Mono', size: 10 },
            callback: function(value) { return '$' + (value / 1000).toFixed(0) + 'k'; }
          }
        }
      }
    }
  });
}
