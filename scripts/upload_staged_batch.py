#!/usr/bin/env python3
"""
Uploads staged videos to the @influenzian YouTube channel.
Reads credentials from YOUTUBE_TOKEN_JSON environment variable or client_secrets.json.
Respects YouTube Data API v3 daily quota (10,000 units / day, ~6 uploads/day default quota, up to 10 with quota extension).
"""

import os
import sys
import json
from pathlib import Path
from youtube_uploader import get_authenticated_service, upload_video

def upload_staged():
    print("Checking for staged deliverables...")
    video_path = "/home/antigravity/shishyan/Trading-Strategizer/videos/influenzian_fvg_remix_60s_1080p.mp4"
    if not os.path.exists(video_path):
        video_path = "videos/influenzian_fvg_remix_60s_1080p.mp4"

    if not os.path.exists(video_path):
        print("No staged video found to upload.")
        return

    title = "Empirical Test: ICT Fair Value Gap Trading Strategy (3.9M Views Video Audit) | @influenzian"
    desc = """We put YouTube's most viewed trading strategy explanation (Data Trader's Fair Value Gap breakdown from https://www.youtube.com/watch?v=ZX-Tp4zgJYc) through a rigorous empirical backtest across 7 distinct asset classes using $10,000 simulated test capital per instrument ($70,000 total).

Original Video Attribution:
- Creator: Data Trader
- Video: Every Trading Strategy Explained in 12 Minutes (https://www.youtube.com/watch?v=ZX-Tp4zgJYc)

Empirical Backtest Findings:
- Claimed Scalp Edge: 80%+ Win Rate (Selective setups)
- Real 1-Year Multi-Asset Win Rate: 39.2% (79 total trades)
- Net Return: +$1,466.82 (driven purely by 1:2 Risk-to-Reward ratio, not high win rate)
- Asset Performance: Gold (46.2%), Oil (38.5%), SPY (30.8%), BTC (50.0%), EUR/USD (30.8%), GBP/JPY (28.6%), US10Y (50.0%)

Explore full tick logs, leaderboard rankings, and 108 quantitative models:
https://trading.shishyan.in

Simulated Paper Capital Notice:
All results generated using $10,000 simulated test capital per instrument. This is strictly an objective quantitative verification study with zero financial advice or endorsements.
Total Tested: $70,000 Paper Money."""

    tags = ["trading", "fair value gap", "ict trading", "backtest", "algorithmic trading", "influenzian", "trading strategizer"]

    try:
        yt = get_authenticated_service("client_secrets.json", "youtube_token.json")
        upload_video(yt, video_path, title, desc, tags, privacy="unlisted")
    except Exception as e:
        print(f"Upload error: {e}")
        print("Note: Ensure YOUTUBE_TOKEN_JSON secret is added to the GitHub repository to enable automatic pushing.")

if __name__ == "__main__":
    upload_staged()
