## 这是一个豆瓣电影的小爬虫

这是个基于nodejs，cheerio和axios写的一个小小的爬虫。  
它主要是我写影评的一个副产品，为了更方便地获取所看电影的一些信息，例如导演，主演，评分等等。包括获取相应电影的IMDB评分和评分人数。

## 更新日志

### 2017.10.09

v2.0 支持命令行直接执行。

```bash
Usage: node index.js [options] [command]


Options:

  -V, --version       output the version number
  -w, --write [file]  write info to file
  -c, --console       console the result
  -h, --help          output usage information


Commands:

  <url>           Set the db-movie url
  help [cmd]  display help for [cmd]
```

### 2016.02.22

v1.1 这个爬虫现在能够在当前目录下输出文件了：  

将会生成一个叫做dbmovie.txt的文件，这个文件里包含如下信息：

片名

- 导演: 
- 主演: 
- 片长: *分钟
- 影  片类型：
- 豆  瓣评分：\*/10(from\*,\*users)
- IMDB评分：\*/10(from\*,\*users)

每次执行这个爬虫都会在这个文件里追加新的电影信息。同时控制台里会输出相应信息来让你明确是否正确输出。

------

### 2016.02.21

v1.0 这个爬虫现在能够通过控制台输出如下信息：  

- 导演: 
- 主演: 
- 片长: *分钟
- 影  片类型：
- 豆  瓣评分：\*/10(from\*,\*users)
- IMDB评分：\*/10(from\*,\*users)

例如：   

```
房间 Room
- 导演：伦尼·阿伯拉罕森
- 主演：布丽·拉尔森/雅各布·特伦布莱/威廉姆·H·梅西/琼·艾伦/梅根·帕克/阿曼达·布鲁盖尔/肖恩·布里吉格斯/卡斯·安瓦尔/乔·平格/兰道尔·爱德华/杰克·富尔顿/汤姆·麦卡穆斯/
- 片长：118分钟
- 影  片类型：剧情/家庭/
- 豆  瓣评分：8.7/10(from19,250users)
- IMDB评分：8.3/10(from52,727users)
```

------

## 使用方法

```bash
Usage: node index.js [options] [command]


Options:

  -V, --version       output the version number
  -w, --write [file]  write info to file
  -c, --console       console the result
  -h, --help          output usage information


Commands:

  <url>           Set the db-movie url
  help [cmd]  display help for [cmd]
```
直接输入`node index.js url` 然后将豆瓣电影的url放在后面就可以了。
