cd /c/Users/User/Desktop/code/arcchang1236.github.io/pages/news
python generate_news.py

cd /c/Users/User/Desktop/code/arcchang1236.github.io
git config --global credential.helper store
git add .
git commit -am "Generate news automately - $(date +"%Y.%m.%d")"
ping www.github.com && git push origin --all || echo "not connected"
