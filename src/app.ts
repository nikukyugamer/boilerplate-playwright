import { Main } from './Main'

const main = new Main()

// ファイルダウンロード
;(async () => {
  await main.downloadFile()
})()
