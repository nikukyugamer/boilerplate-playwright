import * as dotenv from 'dotenv'
dotenv.config()
import { firefox } from 'playwright'

export class FetchHatenaFotolife {
  hatenaUsername: string
  hatenaPassword: string

  constructor() {
    this.hatenaUsername = process.env.HATENA_USERNAME || ''
    this.hatenaPassword = process.env.HATENA_PASSWORD || ''
  }

  async exec() {
    const browser = await firefox.launch()
    const page = await browser.newPage({
      viewport: {
        width: 1280,
        height: 720,
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      javaScriptEnabled: true,
      isMobile: false,
    })

    const baseUrl = 'https://f.hatena.ne.jp'

    await page.goto(baseUrl)
    await page.screenshot({
      path: 'tmp/screenshot_hatena_fotolife_user_url.png',
      fullPage: true,
    })

    // https://www.hatena.ne.jp/login
    await page.click('text=ログイン')
    await page.fill('input[name="name"]', this.hatenaUsername)
    await page.fill('input[name="password"]', this.hatenaPassword)
    await page.click('#login-button')

    await page.waitForTimeout(5000)
    await page.goto(`${baseUrl}/${this.hatenaUsername}`)

    await page.screenshot({
      path: 'tmp/screenshot_hatena_fotolife_login_user_page.png',
      fullPage: true,
    })

    await browser.close()

    return
  }
}
