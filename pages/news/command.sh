#!/bin/sh
conda activate py37

# $ROOT = ''
cd $ROOT/arcchang1236.github.io
cd pages/news
python generate_news.py

cd $ROOT/arcchang1236.github.io
git add .
git commit -am "Generate news automately - $(date +"%Y.%m.%d")"
git push origin master
