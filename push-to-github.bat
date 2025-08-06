@echo off
echo GitHubリポジトリにプッシュします
echo.
echo 使用方法:
echo 1. GitHubで新しいリポジトリを作成
echo 2. このバッチファイルを編集して、YOUR_REPO_URLを実際のURLに置き換える
echo 3. このファイルを実行
echo.
echo 例: https://github.com/murakamiyoshiyuki/kojiki-sound-novel.git
echo.
pause

REM ここのURLを実際のリポジトリURLに変更してください
set REPO_URL=YOUR_REPO_URL

if "%REPO_URL%"=="YOUR_REPO_URL" (
    echo エラー: リポジトリURLを設定してください
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo 完了しました！
pause