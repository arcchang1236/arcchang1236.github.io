# -*- coding: utf-8 -*-

# Schedule to generate "{Date}.html" of news at 22:55 every day
# Schedule to git push the html to update the website at 23:00 every day

import os
import re
import json
import requests

from bs4 import BeautifulSoup
from datetime import date
from jinja2 import Template
from pathlib import Path
from urllib.parse import quote

TODAY = str(date.today())
FILENAME = TODAY.replace('-', '')

## Highlight the News with Custom Keywords (Good/Bad)
### Open TXT
keywords = {}
with open('src/keywords_good.txt', encoding='utf-8') as f:
  keywords['good'] = f.read().splitlines()

with open('src/keywords_bad.txt', encoding='utf-8') as f:
  keywords['bad'] = f.read().splitlines()

### Open JSON
stock_id_name_dict = json.load(open('./src/stock_id_name.json', 'r', encoding='utf-8'))

def mark_ghen_txt(data, txt, keywords):
  ### Strong the normal string
  data['keywords_stock'], data['keywords_good'], data['keywords_bad'] = [], [], []
  RE_STR = ['\d\d\d\d-TW'] # [TODO] ID 對應股名 (read excel?)
  for re_str in RE_STR:
    for substr in re.findall(re_str, txt):
      name = stock_id_name_dict.get(substr[:4], "???")
      substr = substr.replace('-TW', f' {name}')
      if substr not in data['keywords_stock']:
        data['keywords_stock'].append(substr)
      txt = txt.replace(substr, f'<strong class="keywords_stock">{substr}</strong>')
  ### Replace Good string with one class
  for substr in keywords['good']:
    if substr in txt:
      if substr not in data['keywords_good']:
        data['keywords_good'].append(substr)
      txt = txt.replace(substr, f'<strong class="keywords_good">{substr}</strong>')
  for substr in keywords['bad']:
    if substr in txt:
      if substr not in data['keywords_bad']:
        data['keywords_bad'].append(substr)
      txt = txt.replace(substr, f'<strong class="keywords_bad">{substr}</strong>')
  ### Replace Bad string with another class
  return data, txt

## Crawl the News and Change into Dictionary Format
data = {}
### Yahoo
url = 'https://tw.stock.yahoo.com/tw-market/'
### G-Hen
url = 'https://news.cnyes.com/news/cat/tw_stock_news'
req = requests.get(url)
req.encoding = 'utf-8'
soup = BeautifulSoup(req.content, "html.parser")
for idx, news in enumerate(soup.find_all('a', {'class', '_1Zdp'})):
  link = url.replace('/news/cat/tw_stock_news', news['href'])
  req2 = requests.get(link)
  req2.encoding = 'utf-8'
  soup2 = BeautifulSoup(req2.content, "html.parser")
  txt = ''
  for line in soup2.find_all('p',  attrs={'class': None, 'data-reactid': None}):
    txt += (line.text).replace('\n', '')
  
  data_news = {}
  data_news, txt = mark_ghen_txt(data_news, txt, keywords)
  data_news['title'] = u'%s' % (news['title'])
  data_news['link'] = link
  data_news['time'] = news.find('time')['datetime']
  data_news['content'] = u'%s' % (txt)
  
  data[idx+1] = data_news

total_idx = idx+1

print('\n', TODAY)
print(f"[Total]: {total_idx} 則新聞\n")


## Generate Daily HTML
template_path = 'src/template_daily.html'
output_path = f'daily/{FILENAME}.html'

with open(template_path, encoding='utf-8') as f:
  template = Template(f.read())

result = template.render(
    title=f'{TODAY}', total_idx=total_idx, bundles=data)
with open(output_path, 'wb') as f:
  f.write(result.encode('utf-8'))

## Re-Generate Main HTML including Newest Daily HTML
template_path = 'src/template_main.html'
output_path = 'main.html'
bundles = {}
for i in Path('./daily').glob('*.html'):
  bundles[i.stem] = str(i)

bundles = dict(sorted(bundles.items(), reverse=True))

with open(template_path, encoding='utf-8') as f:
  template = Template(f.read())

result = template.render(bundles=bundles)
with open(output_path, 'wb') as f:
  f.write(result.encode('utf-8'))
