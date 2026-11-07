// Chart Engine for Trading Strategizer
// Multi-Equity Curve rendering with Chart.js

let equityChartInstance = null;

function initEquityChart() {
  const ctx = document.getElementById('equityChart');
  if (!ctx) return;

  // Normalized 5-Year timeline data points ($10,000 baseline)
  const labels = ['Nov 2021', 'May 2022', 'Nov 2022', 'May 2023', 'Nov 2023', 'May 2024', 'Nov 2024', 'May 2025', 'Nov 2025', 'May 2026', 'Nov 2026'];
  
  // Normalized Equity Curves
  const dataSupertrend = [10000, 14200, 11800, 16400, 21200, 19800, 27500, 31400, 28900, 36200, 41240];
  const dataStatArb = [10000, 11200, 12600, 14100, 15800, 17200, 18900, 20400, 21800, 23100, 24210];
  const dataFVG = [10000, 11800, 10900, 13400, 16200, 15100, 20400, 22100, 23800, 25900, 28460];
  const dataSPY = [10000, 8900, 8200, 9600, 10800, 12200, 13400, 14900, 16100, 17400, 18420];

  if (equityChartInstance) {
    equityChartInstance.destroy();
  }

  equityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Triple Supertrend (BTC)',
          data: dataSupertrend,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderWidth: 2.2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.25,
          fill: true
        },
        {
          label: 'ICT Fair Value Gap (QQQ)',
          data: dataFVG,
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.25
        },
        {
          label: 'Poisson Stat-Arb (SPY/QQQ)',
          data: dataStatArb,
          borderColor: '#a855f7',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.25
        },
        {
          label: 'SPY Benchmark (Buy & Hold)',
          data: dataSPY,
          borderColor: '#64748b',
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
            color: '#94a3b8',
            font: { family: 'JetBrains Mono', size: 10 },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: '#0d131f',
          borderColor: '#1e293b',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          titleFont: { family: 'JetBrains Mono', size: 11 },
          bodyFont: { family: 'JetBrains Mono', size: 11 },
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.parsed.y.toLocaleString()} (${((context.parsed.y - 10000)/100).toFixed(1)}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(30, 41, 59, 0.4)' },
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(30, 41, 59, 0.4)' },
          ticks: {
            color: '#64748b',
            font: { family: 'JetBrains Mono', size: 10 },
            callback: function(value) { return '$' + (value / 1000).toFixed(0) + 'k'; }
          }
        }
      }
    }
  });
}
