import { Main } from './Main'

const main = new Main()

// X68000Z
;(async () => {
  await main.x68000z()
})()

// 確認くん
;(async () => {
  const currentBrowserName = await main.misterConfirm()
  console.log({ currentBrowserName })
})()

// はてなフォトライフ
;(async () => {
  await main.hatenaFotolife()
})()
