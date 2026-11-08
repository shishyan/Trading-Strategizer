#!/usr/bin/env python3
"""
YouTube Video Uploader for @influenzian Channel
Configured with environment CA / local proxy support.
"""

import os
import sys
import json
import argparse
import httplib2
import google_auth_httplib2
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def get_authenticated_service(client_secrets_file, token_file):
    creds = None
    
    # 1. Check environment variable for token json (GitHub Actions secret support)
    env_token = os.environ.get("YOUTUBE_TOKEN_JSON")
    if env_token:
        try:
            token_data = json.loads(env_token)
            creds = Credentials.from_authorized_user_info(token_data, SCOPES)
        except Exception as e:
            print(f"Warning: Could not parse YOUTUBE_TOKEN_JSON env var: {e}")

    # 2. Check local token file
    if not creds and os.path.exists(token_file):
        try:
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)
        except Exception as e:
            print(f"Error reading {token_file}: {e}")

    # 3. Refresh if expired
    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            if os.path.exists(token_file):
                with open(token_file, 'w') as f:
                    f.write(creds.to_json())
        except Exception as e:
            print(f"Token refresh failed: {e}")
            creds = None

    if not creds or not creds.valid:
        raise ValueError(
            "Valid YouTube credentials not found. In local environments, generate youtube_token.json. "
            "In GitHub Actions, populate the YOUTUBE_TOKEN_JSON repository secret."
        )

    # In environments routing through localhost proxy (e.g. agy-plugin-proxy), handle TLS certificate validation cleanly
    http = httplib2.Http(disable_ssl_certificate_validation=True)
    authorized_http = google_auth_httplib2.AuthorizedHttp(creds, http=http)
    return build("youtube", "v3", http=authorized_http)

def upload_video(youtube, video_path, title, description, tags, category_id="27", privacy="unlisted"):
    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": tags,
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(video_path, chunksize=-1, resumable=True)
    request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=media
    )

    print(f"Uploading {video_path} to @influenzian...")
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploaded {int(status.progress() * 100)}%")

    print(f"Successfully uploaded! Video ID: {response['id']}")
    print(f"Live URL: https://www.youtube.com/watch?v={response['id']}")
    return response

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--desc", required=True)
    parser.add_argument("--tags", default="trading,backtest,quant,influenzian,finance")
    parser.add_argument("--privacy", default="unlisted")
    parser.add_argument("--secrets", default="client_secrets.json")
    parser.add_argument("--token", default="youtube_token.json")
    args = parser.parse_args()

    tags_list = [t.strip() for t in args.tags.split(",") if t.strip()]
    yt = get_authenticated_service(args.secrets, args.token)
    upload_video(yt, args.video, args.title, args.desc, tags_list, privacy=args.privacy)
