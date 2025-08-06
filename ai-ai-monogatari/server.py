#!/usr/bin/env python3
import http.server
import socketserver
import os

# ポート番号
PORT = 8000

# このスクリプトのディレクトリに移動
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# ハンドラーの設定
Handler = http.server.SimpleHTTPRequestHandler

# サーバーの起動
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"サーバーを起動しました: http://localhost:{PORT}/")
    print("終了するには Ctrl+C を押してください")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nサーバーを停止しました")