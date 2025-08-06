@echo off
echo Chromeをセキュリティ無効モードで起動します（テスト専用）
echo.
echo 警告: このモードは開発テスト専用です。
echo 通常のブラウジングには使用しないでください。
echo.
start chrome.exe --allow-file-access-from-files --disable-web-security --user-data-dir="%TEMP%\chrome_test" "file:///%~dp0index.html"
echo.
pause