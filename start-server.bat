@echo off
echo 簡易HTTPサーバーを起動します...
echo.
echo ブラウザで以下のURLを開いてください:
echo http://localhost:8000/
echo.
echo 終了するには Ctrl+C を押してください
echo.
python -m http.server 8000
pause