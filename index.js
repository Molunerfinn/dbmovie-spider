const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const program = require('commander')
const pjson = require('./package.json')

const url = 'http://movie.douban.com/subject/25724855/'

let IMDBLink = ''
let file = 'dbmovie.md'
let writeFlag = false

program
  .version(pjson.version)
  .allowUnknownOption()
  .option('-w, --write [file]', 'write')
  .parse(process.argv)

console.log(program.write)

const main = async () => {
  const html = await axios.get(url)
  handleDB(html.data)
  const IMDBData = await axios.get(IMDBLink)
  handleIMDB(IMDBData.data)
}

main()

// 获取豆瓣电影里的大部分所需内容
function handleDB (html) {
  let $ = cheerio.load(html)
  // 获取电影名
  let movieName = $('#content>h1>span').filter(function (i, el) {
    return $(this).attr('property') === 'v:itemreviewed'
  }).text()
  // 获取影片导演名
  let directories = '- 导演：' + $('#info span a').filter(function (i, el) {
    return $(this).attr('rel') === 'v:directedBy'
  }).text()
  // 获取影片演员
  let starsName = '- 主演：'
  $('.actor .attrs a').each(function (i, elem) {
    starsName += $(this).text() + '/'
  })

  starsName = starsName.substring(0, starsName.length)
  // 获取片长
  var runTime = '- 片长：' + $('#info span').filter(function (i, el) {
    return $(this).attr('property') === 'v:runtime'
  }).text()
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
  // 获取电影评分和电影评分人数
  // 豆瓣
  var DBScore = $('.ll.rating_num').text()
  var DBVotes = $('a.rating_people>span').text().replace(/\B(?=(\d{3})+$)/g, ',')
  var DB = '- 豆  瓣评分：' + DBScore + '/10' + '(' + 'from' + DBVotes + 'users' + ')'
  // IMDBLink
  IMDBLink = $('#info').children().last().prev().attr('href')

  var data = movieName + '\r\n' + directories + '\r\n' + starsName + '\r\n' + runTime + '\r\n' + kinds + '\r\n' + DB + '\r\n'

  if (writeFlag) {
    fs.appendFile(file, data, 'utf-8', function (err) {
      if (err) throw err
      else console.log('大体信息写入成功' + '\r\n' + data)
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
  if (writeFlag) {
    fs.appendFile(file, IMDB, 'utf-8', function (err) {
      if (err) throw err
      else console.log('IMDB信息写入成功' + '\r\n' + IMDB)
    })
  }
}
