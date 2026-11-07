#!/usr/bin/env python3
"""
OAuth Token Exchange Helper for @influenzian
Supports pasting either the authorization code or the full redirect URL (http://localhost/?code=...)
"""
import sys
import json
import urllib.parse
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

def exchange(input_val, state, code_verifier):
    # Parse if full URL
    if input_val.startswith('http'):
        parsed = urllib.parse.urlparse(input_val)
        qs = urllib.parse.parse_qs(parsed.query)
        code = qs.get('code', [None])[0]
    else:
        code = input_val.strip()

    if not code:
        print("Error: Could not extract authorization code.")
        sys.exit(1)

    flow = InstalledAppFlow.from_client_secrets_file('client_secrets.json', scopes=SCOPES, state=state)
    flow.redirect_uri = 'http://localhost'
    flow.code_verifier = code_verifier
    flow.fetch_token(code=code)
    
    creds = flow.credentials
    with open('youtube_token.json', 'w') as f:
        f.write(creds.to_json())
    print("SUCCESS: Credentials successfully written to youtube_token.json!")
    print(f"Token JSON Preview (first 100 chars): {creds.to_json()[:100]}...")

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python3 scripts/exchange_oauth.py <input_code_or_url> <state> <code_verifier>")
        sys.exit(1)
    exchange(sys.argv[1], sys.argv[2], sys.argv[3])
