const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const program = require('commander')
const pjson = require('./package.json')
const ProgressBar = require('progress')

let url = ''
let IMDBLink = ''
let file = 'dbmovie.md'
let writeFlag = false
let info = ''
let consoleFlag = false
const bar = new ProgressBar('进度 [:bar] :percent :info', {
  complete: '=',
  incomplete: ' ',
  total: 80
})

const main = async () => {
  bar.tick(8, {
    info: '开始获取数据...'
  })
  const html = await axios.get(url)
  bar.tick(8, {
    info: '网页获取成功'
  })
  handleDB(html.data)
  bar.tick(8, {
    info: '正在获取IMDB信息'
  })
  const IMDBData = await axios.get(IMDBLink)
  handleIMDB(IMDBData.data)
}

program
  .version(pjson.version)
  .allowUnknownOption()
  .option('-w, --write [file]', 'write info to file')
  .option('-c, --console', 'console the result')

program
  .command('*', 'Set the db-movie url')
  .action((input) => {
    url = input
    if (input !== '') {
      if (program.write) {
        writeFlag = true
        program.write !== true ? file = program.write : program.write = true
        console.log(`信息将会写入 ${file}`)
      }
      consoleFlag = program.console
      main()
    }
  })

program.parse(process.argv)

// main()

// 获取豆瓣电影里的大部分所需内容
function handleDB (html) {
  let $ = cheerio.load(html)
  // 获取电影名
  let movieName = $('#content>h1>span').filter(function (i, el) {
    return $(this).attr('property') === 'v:itemreviewed'
  }).text()
  bar.tick(8)
  // 获取影片导演名
  let directories = '- 导演：'
  $('#info span a[rel="v:directedBy"]').each(function (i, el) {
    directories += $(this).text() + '/'
  })

  directories = directories.substring(0, directories.length - 1)

  bar.tick(8)
  // 获取影片演员
  let starsName = '- 主演：'
  $('.actor .attrs a').each(function (i, elem) {
    starsName += $(this).text() + '/'
  })

  starsName = starsName.substring(0, starsName.length - 1)
  bar.tick(8)
  // 获取片长
  var runTime = '- 片长：' + $('#info span').filter(function (i, el) {
    return $(this).attr('property') === 'v:runtime'
  }).text()
  bar.tick(8)
  // 获取影片类型  
  var kind = $('#info span').filter(function (i, el) {
    return $(this).attr('property') === 'v:genre'
  }).text()
  // 处理影片类型数据
  var kLength = kind.length
  var kinds = '- 影  片类型：'
  for (let i = 0; i < kLength; i += 2) {
    kinds += kind.slice(i, i + 2) + '/'
  }

  kinds = kinds.substring(0, kinds.length - 1)
  bar.tick(8)

  // 获取电影评分和电影评分人数
  // 豆瓣
  var DBScore = $('.ll.rating_num').text()
  var DBVotes = $('a.rating_people>span').text().replace(/\B(?=(\d{3})+$)/g, ',')
  var DB = '- 豆  瓣评分：' + DBScore + '/10' + '(' + 'from' + DBVotes + 'users' + ')'
  // IMDBLink
  IMDBLink = $('#info .pl:contains("IMDb")').next('[rel="nofollow"]').attr('href')

  var data = movieName + '\r\n' + directories + '\r\n' + starsName + '\r\n' + runTime + '\r\n' + kinds + '\r\n' + DB + '\r\n'

  info = data

  if (consoleFlag) console.log('目前获取的信息如下：' + '\r\n' + info)

  if (writeFlag) {
    fs.appendFile(file, data, 'utf-8', function (err) {
      if (err) throw err
      else {
        bar.tick(8, {
          info: '大体信息写入成功'
        })
      }
    })
  } else {
    bar.tick(8, {
      info: '大体信息写入成功'
    })
  }
}

// 获取IMDB相关评分和评分人数
function handleIMDB (Link) {
  var $ = cheerio.load(Link)
  var IMDBScore = $('.ratingValue span').filter(function (i, el) {
    return $(this).attr('itemprop') === 'ratingValue'
  }).text()
  var IMDBVotes = $('.small').filter(function (i, el) {
    return $(this).attr('itemprop') === 'ratingCount'
  }).text()
  var IMDB = '- IMDB评分：' + IMDBScore + '/10' + '(' + 'from' + IMDBVotes + 'users' + ')' + '\r\n'
  info += IMDB
  if (writeFlag) {
    fs.appendFile(file, IMDB, 'utf-8', function (err) {
      if (err) throw err
      else {
        bar.tick(8, {
          info: '完成'
        })
      }
      console.log('获取信息如下：' + '\r\n' + info)
    })
  } else {
    bar.tick(8, {
      info: '完成'
    })
    console.log('获取信息如下：' + '\r\n' + info)
  }
}
