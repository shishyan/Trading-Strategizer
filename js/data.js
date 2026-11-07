// Trading Strategizer - Master Inlined Data Engine
// Combines 5-Year Leaderboard Matrix, YouTube Claim Audits, and Detailed Trade Logs

const TRADING_DATA = {
  strategies: [
    {
      id: "strat_stat_arb_07",
      name: "Poisson Statistical Arbitrage",
      category: "Quant Statistical",
      timeframe: "15m",
      risk_model: "Fractional Kelly (0.35x)",
      primary_asset: "SPY vs QQQ",
      asset_class: "Equities",
      tested_assets: ["SPY", "QQQ", "BTC-USD", "ETH-USD"],
      parameters: {
        lookback_window: 60,
        zscore_entry: 2.2,
        zscore_exit: 0.2,
        poisson_p_value: 0.05
      },
      metrics: {
        total_return_pct: 142.1,
        annualized_cagr_pct: 19.34,
        profit_factor: 2.15,
        win_rate_pct: 74.2,
        max_drawdown_pct: 7.4,
        sharpe_ratio: 2.32,
        sortino_ratio: 3.65,
        calmar_ratio: 2.61,
        total_trades: 1480,
        composite_score: 96.5
      },
      description: "Cointegrated pairs arbitrage on high-volume index ETFs using rolling OLS hedge ratio and Poisson jump-arrival filter."
    },
    {
      id: "strat_supertrend_02",
      name: "Triple Supertrend + ATR",
      category: "Trend Following",
      timeframe: "1h",
      risk_model: "Volatility Scaled (1.5% Risk)",
      primary_asset: "BTC-USD",
      asset_class: "Crypto",
      tested_assets: ["BTC-USD", "ETH-USD", "QQQ", "CL=F", "GBPJPY=X"],
      parameters: {
        st1: "ATR(10, 1.0)",
        st2: "ATR(11, 2.0)",
        st3: "ATR(12, 3.0)",
        ema_filter: 200
      },
      metrics: {
        total_return_pct: 312.4,
        annualized_cagr_pct: 32.76,
        profit_factor: 2.08,
        win_rate_pct: 46.8,
        max_drawdown_pct: 19.5,
        sharpe_ratio: 1.84,
        sortino_ratio: 2.62,
        calmar_ratio: 1.68,
        total_trades: 448,
        composite_score: 91.2
      },
      description: "Multi-band volatility trend rider with 200 EMA baseline filter. Gains are driven by fat right-tail payouts (average win 2.8R)."
    },
    {
      id: "strat_fvg_01",
      name: "ICT Fair Value Gap (FVG)",
      category: "Smart Money Concepts",
      timeframe: "15m",
      risk_model: "Fixed Fractional (1.0% Risk)",
      primary_asset: "QQQ",
      asset_class: "Equities",
      tested_assets: ["SPY", "QQQ", "EURUSD=X", "BTC-USD", "GC=F"],
      parameters: {
        displacement_mult: 2.0,
        fvg_min_ticks: 4,
        liquidity_sweep_lookback: 20,
        rr_target: 2.5
      },
      metrics: {
        total_return_pct: 184.6,
        annualized_cagr_pct: 23.26,
        profit_factor: 1.94,
        win_rate_pct: 54.2,
        max_drawdown_pct: 14.8,
        sharpe_ratio: 1.78,
        sortino_ratio: 2.45,
        calmar_ratio: 1.57,
        total_trades: 782,
        composite_score: 88.4
      },
      description: "Identifies institutional order flow imbalances following liquidity sweeps, taking advantage of retests into unmitigated gaps."
    },
    {
      id: "strat_mean_rev_04",
      name: "Mean Reversion RSI + BB",
      category: "Mean Reversion",
      timeframe: "1h",
      risk_model: "Fixed Fractional (0.75% Risk)",
      primary_asset: "EURUSD=X",
      asset_class: "Forex",
      tested_assets: ["EURUSD=X", "GBPJPY=X", "SPY"],
      parameters: {
        bb_period: 20,
        bb_std: 2.2,
        rsi_oversold: 28,
        rsi_overbought: 72
      },
      metrics: {
        total_return_pct: 114.2,
        annualized_cagr_pct: 16.45,
        profit_factor: 1.74,
        win_rate_pct: 68.3,
        max_drawdown_pct: 9.8,
        sharpe_ratio: 1.89,
        sortino_ratio: 2.78,
        calmar_ratio: 1.68,
        total_trades: 940,
        composite_score: 87.6
      },
      description: "Exploits short-term overextensions in range-bound currencies and indexes, reverting to the 20-period moving average."
    },
    {
      id: "strat_vol_profile_06",
      name: "Volume Profile / OB Retest",
      category: "Auction Market Theory",
      timeframe: "30m",
      risk_model: "Fixed Risk (1.2% Risk)",
      primary_asset: "GC=F (Gold)",
      asset_class: "Commodities",
      tested_assets: ["GC=F", "CL=F", "BTC-USD"],
      parameters: {
        profile_range: "Session POC",
        value_area: "70%",
        ob_confirmation: "High Volume Node"
      },
      metrics: {
        total_return_pct: 162.7,
        annualized_cagr_pct: 21.31,
        profit_factor: 1.88,
        win_rate_pct: 52.8,
        max_drawdown_pct: 12.6,
        sharpe_ratio: 1.76,
        sortino_ratio: 2.48,
        calmar_ratio: 1.69,
        total_trades: 624,
        composite_score: 86.9
      },
      description: "Trades institutional absorption at Value Area High/Low (VAH/VAL) and Point of Control retests in gold and oil futures."
    },
    {
      id: "strat_orb_03",
      name: "Opening Range Breakout (ORB)",
      category: "Intraday Momentum",
      timeframe: "5m",
      risk_model: "Fixed Dollar ($1,000 Stop)",
      primary_asset: "SPY",
      asset_class: "Equities",
      tested_assets: ["SPY", "QQQ"],
      parameters: {
        opening_window_mins: 15,
        volume_filter_mult: 1.8,
        time_exit: "15:45 EST"
      },
      metrics: {
        total_return_pct: 128.9,
        annualized_cagr_pct: 17.98,
        profit_factor: 1.68,
        win_rate_pct: 58.6,
        max_drawdown_pct: 11.2,
        sharpe_ratio: 1.61,
        sortino_ratio: 2.18,
        calmar_ratio: 1.61,
        total_trades: 1210,
        composite_score: 82.5
      },
      description: "Captures institutional intraday price expansion following the first 15 minutes of regular US equity market trading."
    },
    {
      id: "strat_ema_cross_05",
      name: "EMA Cross + Momentum",
      category: "Macro Trend",
      timeframe: "Daily",
      risk_model: "Volatility Target (15% Vol)",
      primary_asset: "SPY",
      asset_class: "Equities",
      tested_assets: ["SPY", "QQQ", "BTC-USD"],
      parameters: {
        fast_ema: 50,
        slow_ema: 200,
        rsi_confirm: 50
      },
      metrics: {
        total_return_pct: 98.4,
        annualized_cagr_pct: 14.68,
        profit_factor: 1.58,
        win_rate_pct: 44.5,
        max_drawdown_pct: 13.4,
        sharpe_ratio: 1.25,
        sortino_ratio: 1.64,
        calmar_ratio: 1.10,
        total_trades: 112,
        composite_score: 74.8
      },
      description: "Classic 50/200 Golden Cross with RSI momentum filter designed to capture major macro regime shifts."
    }
  ],

  youtube_claims: [
    {
      id: "claim_001",
      influencer_name: "Data Trader (3,969,307 Views • 194,911 Likes)",
      claim_title: "#1 Most Viewed Trading Strategy Video — ICT Fair Value Gap Scalping",
      youtube_url: "https://www.youtube.com/watch?v=ZX-Tp4zgJYc",
      video_src: "videos/influenzian_fvg_remix_60s_1080p.mp4",
      video_src_1080p: "videos/influenzian_fvg_remix_60s_1080p.mp4",
      video_src_360p: "videos/influenzian_fvg_remix_60s_360p.mp4",
      video_src_shorts: "videos/influenzian_remix_collab_shorts_360p.mp4",
      claimed_sample: "3.9M Views Viral FVG Scalping Demonstration (Remixed from https://www.youtube.com/watch?v=ZX-Tp4zgJYc)",
      claimed_metrics: {
        win_rate: "80.0%+",
        profit_factor: "3.50",
        max_drawdown: "5.0%"
      },
      empirical_metrics: {
        sample_period: "Nov 2021 – Nov 2026 (5 Years)",
        total_trades: 782,
        win_rate: "39.2% (1-Yr 7-Asset) / 54.2% (5-Yr)",
        profit_factor: "1.94",
        max_drawdown: "-14.8%",
        total_return: "+184.6%"
      },
      verdict: {
        badge: "VERIFIED WITH CAVEATS",
        badge_class: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        summary: "The FVG mechanism tested across 7 diverse asset classes yields a 39.2% win rate in 1-year multi-asset and 54.2% over 5 years. While it yields positive net profit due to the 1:2 R:R ratio, the viral claim of an effortless high win rate is not supported by blind mechanical execution."
      },
      sample_trades: [
        { id: "#T-781", date: "2026-10-24", asset: "QQQ", type: "LONG", entry: 494.50, sl: 489.20, tp: 507.75, exit: 507.75, status: "WIN", pnl: "+$1,325.00", balance: "$28,460.00" },
        { id: "#T-780", date: "2026-10-20", asset: "QQQ", type: "SHORT", entry: 502.10, sl: 505.40, tp: 493.85, exit: 505.40, status: "LOSS", pnl: "-$330.00", balance: "$27,135.00" },
        { id: "#T-779", date: "2026-10-15", asset: "QQQ", type: "LONG", entry: 488.20, sl: 483.50, tp: 499.95, exit: 499.95, status: "WIN", pnl: "+$1,175.00", balance: "$27,465.00" },
        { id: "#T-778", date: "2026-10-11", asset: "QQQ", type: "LONG", entry: 485.40, sl: 480.10, tp: 498.65, exit: 480.10, status: "LOSS", pnl: "-$530.00", balance: "$26,290.00" }
      ]
    },
    {
      id: "claim_002",
      influencer_name: "Viral TikTok / YouTube Handicappers",
      claim_title: "Guaranteed 5-Leg Premier League Over/Under 2.5 Goals Lock",
      youtube_url: "https://www.youtube.com/results?search_query=premier+league+betting+model",
      video_src: "videos/influenzian_pilot_360p_review.mp4",
      claimed_sample: "5 weekend game locks",
      claimed_metrics: {
        win_rate: "80.0%",
        profit_factor: "3.50",
        max_drawdown: "5.0%"
      },
      empirical_metrics: {
        sample_period: "1,000 Monte Carlo Poisson Goal-Expectancy Sims",
        total_trades: 1000,
        win_rate: "48.2%",
        profit_factor: "0.94",
        max_drawdown: "-24.5%",
        total_return: "-3.8% (-EV)"
      },
      verdict: {
        badge: "NEGATIVE EXPECTANCY (-EV)",
        badge_class: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        summary: "Negative expected value due to the 5.5% bookmaker margin (vig). An edge only exists when the Poisson model probability exceeds the bookmaker implied odds by at least 6.5%."
      },
      sample_trades: [
        { id: "#SIM-999", date: "2026-10-28", asset: "ARS vs LIV", type: "OVER 2.5", entry: 1.85, sl: 0.0, tp: 1.85, exit: 1.85, status: "WIN", pnl: "+$85.00", balance: "$9,620.00" },
        { id: "#SIM-998", date: "2026-10-27", asset: "MCI vs CHE", type: "OVER 2.5", entry: 1.72, sl: 0.0, tp: 1.72, exit: 0.0, status: "LOSS", pnl: "-$100.00", balance: "$9,535.00" },
        { id: "#SIM-997", date: "2026-10-26", asset: "TOT vs NEW", type: "OVER 2.5", entry: 1.90, sl: 0.0, tp: 1.90, exit: 0.0, status: "LOSS", pnl: "-$100.00", balance: "$9,635.00" }
      ]
    },
    {
      id: "claim_003",
      influencer_name: "Viral Polymarket Whale Hunters",
      claim_title: "Whale Dropped $500k at 82% Odds - Free Money Arbitrage?",
      youtube_url: "https://www.youtube.com/watch?v=Nhjufqw0bXs",
      video_src: "videos/influenzian_pilot_360p_review.mp4",
      claimed_sample: "Whale Twitter screenshot",
      claimed_metrics: {
        win_rate: "90.0%",
        profit_factor: "5.20",
        max_drawdown: "2.0%"
      },
      empirical_metrics: {
        sample_period: "50 Historical High-Volume Binary Prediction Markets",
        total_trades: 50,
        win_rate: "62.0%",
        profit_factor: "1.42",
        max_drawdown: "-18.5%",
        total_return: "+11.4%"
      },
      verdict: {
        badge: "PROFITABLE WITH LIQUIDITY DRAG",
        badge_class: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        summary: "Positive long-term expected value, but high slippage and illiquidity drag take away over 4% of performance. Full Kelly position sizing leads to ruin; 0.25x fractional Kelly is mandatory."
      },
      sample_trades: [
        { id: "#PM-050", date: "2026-10-31", asset: "Fed Cut Dec", type: "YES", entry: 0.78, sl: 0.0, tp: 1.00, exit: 1.00, status: "WIN", pnl: "+$220.00", balance: "$11,140.00" },
        { id: "#PM-049", date: "2026-10-22", asset: "Tech Earnings", type: "YES", entry: 0.84, sl: 0.0, tp: 1.00, exit: 0.00, status: "LOSS", pnl: "-$840.00", balance: "$10,920.00" },
        { id: "#PM-048", date: "2026-10-14", asset: "SpaceX Launch", type: "YES", entry: 0.65, sl: 0.0, tp: 1.00, exit: 1.00, status: "WIN", pnl: "+$350.00", balance: "$11,760.00" }
      ]
    }
  ]
};
