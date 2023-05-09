import pandas as pd


### 讀 EXCEL
# a = input()
a = r'C:\Users\User\Desktop\code\foodie\foodie.xlsx'
df = pd.read_excel(a, engine='openpyxl')
# print(df)

for idx, r in df.iterrows():
    print(idx, r)

### 生成 HTML 檔
