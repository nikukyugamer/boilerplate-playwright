import * as dotenv from 'dotenv'
dotenv.config()
import { chromium, firefox, webkit } from 'playwright'

export class FetchX68000Z {
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
    console.log('X68000Z.exec()!')

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
          name: 'x68000z',
          url: 'https://kibidango.com/2285',
        },
      ]

      for (const baseUrl of baseUrls) {
        await page.goto(baseUrl.url)
        await page.waitForTimeout(1000)
        await page.screenshot({
          path: `tmp/${baseUrl.name}_${browserName}.png`,
          fullPage: true,
        })

        const pledgeLocators: any = page.locator('#rewardAnchor .contents_box1')
        const mainPledgeLocator = await pledgeLocators.nth(1)
        const mainPledgePresentSupportElement =
          mainPledgeLocator.locator('.presentSupport')

        const targetText = await mainPledgePresentSupportElement.innerText()
        console.log({ targetText })
      }

      await browser.close()
    }
  }
}
