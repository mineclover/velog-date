const puppeteer = require('puppeteer')
const XLSX = require('xlsx')

async function scrapeVelogData(browser, url) {
  console.time(url)

  const page = await browser.newPage()
  await page.goto(url)

  // Get the post creation date
  const postDateSelector = 'div.information > span:nth-child(3)'
  const postDate = await page.$eval(postDateSelector, (el) => el.textContent)

  storeArray.push([url, postDate])

  console.timeEnd(url)
}

let storeArray = [['url', 'postDate']]

async function saveDataToExcel(data, fileName) {
  // 2D array로 저장되는 것을 알 수 있다

  const ws = XLSX.utils.aoa_to_sheet(storeArray)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, fileName)
}
const dataSet = [
  { url: 'https://velog.io/@softer/storybook-01', num: 1 },
  { url: 'https://velog.io/@softer/storybook-02', num: 2 },
  {},
]

function excelRead() {
  const workbook = XLSX.readFile('input.xlsx')
  // 첫 번째 시트 이름
  const sheetName = workbook.SheetNames[0]
  // 시트 이름에 따른 정보
  const sheet = workbook.Sheets[sheetName]
  console.log(sheet)
  const headerRow = {
    A: 'Post Date',
    B: 'name',
    C: 'url',
    D: 'team',
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: headerRow, skipHeader: true })
  return data
}

async function main() {
  const browser = await puppeteer.launch()
  console.log(excelRead())

  const value = dataSet.map(async (data) => {
    await scrapeVelogData(browser, data.url)
  })

  console.log(value)
  await Promise.allSettled(value)
  console.log(value)
  await saveDataToExcel(storeArray, `post-date-00.xlsx`)
  await browser.close()
}

main()
