import { Main } from './Main'

const main = new Main()

;(async () => {
  const currentBrowserName = await main.misterConfirm()

  console.log({ currentBrowserName })
})()

;(async () => {
  await main.hatenaFotolife()
})()
