import * as puppeteer from 'puppeteer'
import { sleep } from '../utils/common'

const run = async () => {
  console.log('launch trailer-list')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  await sleep(3000)
  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    const $ = (window as any).$
    const wrap = $('.list-wp')
    const list = wrap.find('.item')
    return Array.from(list).map((l) => {
      const it = $(l)
      return {
        doubanId: it.find('.cover-wp').data('id'),
        poster: it.find('img').attr('src').replace('s_ratio', 'l_ratio'),
        title: it.find('.title').text(),
        rate: Number(it.find('.rate').text())
      }
    })
  })
  browser.close()
  
  process.send({result})
  process.exit(0)
}

run()