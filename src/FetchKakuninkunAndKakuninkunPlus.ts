import * as dotenv from 'dotenv'
dotenv.config()
import { chromium, firefox, webkit, devices } from 'playwright'

export class FetchKakuninkunAndKakuninkunPlus {
  browserNames: string[]

  constructor() {
    this.browserNames = ['chromium', 'firefox', 'webkit']
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
          name: 'kakuninkun',
          url: 'https://www.ugtop.com/spill.shtml',
        },
        {
          name: 'kakuninkun_plus',
          url: 'https://env.b4iine.net/',
        },
      ]

      for (const baseUrl of baseUrls) {
        await page.goto(baseUrl.url)
        await page.waitForTimeout(1000)
        await page.screenshot({
          path: `tmp/${baseUrl.name}_${browserName}.png`,
          fullPage: true,
        })
      }

      await browser.close()
    }

    return await this.currentBrowserTextOnKakuninKun()
  }

  async currentBrowserTextOnKakuninKun() {
    const browser = await this.setBrowser('webkit')
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

    const page = await context.newPage()

    await page.goto('https://www.ugtop.com/spill.shtml')

    const trTags: any = page.locator('tbody').locator('tr')
    const countTrTags = await trTags.count()
    console.log({ countTrTags })

    // 6番目 の trタグ が「現在のブラウザー」のテキスト
    const currentBrowserText = await trTags.nth(6).innerText()

    await browser.close()

    return currentBrowserText
  }
}
