#!/usr/bin/env python3
"""
Complete OAuth Token Exchange for @influenzian using .oauth_pending.json
"""
import sys
import json
import urllib.parse
from google_auth_oauthlib.flow import Flow

SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/complete_oauth.py '<code_or_full_redirect_url>'")
        sys.exit(1)

    input_val = sys.argv[1].strip()
    if input_val.startswith('http'):
        parsed = urllib.parse.urlparse(input_val)
        qs = urllib.parse.parse_qs(parsed.query)
        code = qs.get('code', [None])[0]
    else:
        code = input_val

    if not code:
        print("Error: Could not extract authorization code from input.")
        sys.exit(1)

    with open('.oauth_pending.json') as f:
        session = json.load(f)

    flow = Flow.from_client_secrets_file(
        'client_secrets.json',
        scopes=SCOPES,
        state=session['state']
    )
    flow.redirect_uri = 'http://localhost'
    flow.code_verifier = session['code_verifier']
    
    flow.fetch_token(code=code)
    creds = flow.credentials
    with open('youtube_token.json', 'w') as f:
        f.write(creds.to_json())

    print("\n✅ OAuth Success! Credentials saved to youtube_token.json")
    print(f"Token file created successfully. Ready for YouTube upload.")

if __name__ == '__main__':
    main()
