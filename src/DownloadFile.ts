import * as dotenv from 'dotenv'
dotenv.config()
import { chromium, firefox, webkit } from 'playwright'

export class DownloadFile {
  browserNames: string[]

  constructor() {
    this.browserNames = ['chromium']
  }

  async setBrowser(browser: string) {
    if (browser === 'chromium') {
      return await chromium.launch()
    } else if (browser === 'firefox') {
      return await firefox.launch()
    } else if (browser === 'webkit') {
      return await webkit.launch()
    } else {
      throw new Error('Invalid browser')
    }
  }

  async exec() {
    for (const browserName of this.browserNames) {
      const browser = await this.setBrowser(browserName)
      const context = await browser.newContext({
        viewport: {
          width: 1280,
          height: 720,
        },
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
        javaScriptEnabled: true,
        isMobile: false,
        proxy: { server: process.env.PROXY },
      })

      await context.addCookies([
        {
          name: 'foo',
          value: '12345',
          domain: '.example.com',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'None',
        },
      ])

      const page = await context.newPage()

      const baseUrls = [
        {
          name: 'PR TIMES',
          url: 'https://prtimes.jp/main/html/rd/p/000001382.000031382.html',
        },
      ]

      for (const baseUrl of baseUrls) {
        await page.goto(baseUrl.url)
        await page.screenshot({
          path: `tmp/${baseUrl.name}_${browserName}.png`,
          fullPage: true,
        })

        // 公式ドキュメントが充実している https://playwright.dev/docs/api/class-download
        const downloadPromise = page.waitForEvent('download')
        await page.getByText('プレスリリース素材ダウンロード').click()
        const download = await downloadPromise // デフォルトのタイムアウトは 30000ms

        const suggestedFilename = download.suggestedFilename()
        await download.saveAs(`tmp/${suggestedFilename}`)
      }

      await browser.close()
    }
  }
}
