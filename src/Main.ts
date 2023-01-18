import fs from 'fs'
import { execSync } from 'child_process'
import { load } from 'js-yaml'
import * as dotenv from 'dotenv'
dotenv.config()

import { FetchHatenaFotolife } from './FetchHatenaFotolife'
import { FetchKakuninkunAndKakuninkunPlus } from './FetchKakuninkunAndKakuninkunPlus'
import { FetchX68000Z } from './FetchX68000Z'
import { DownloadFile } from './DownloadFile'

export class Main {
  HELLO: string

  constructor() {
    this.HELLO = process.env.HELLO || ''
  }

  byJsonConfig(jsonPath: string) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  }

  byYamlConfig(yamlPath: string) {
    return load(fs.readFileSync(yamlPath, 'utf8'))
  }

  async misterConfirm() {
    const kakuninkun = new FetchKakuninkunAndKakuninkunPlus()
    const currentBrowserText = await kakuninkun.exec()

    return currentBrowserText
  }

  async downloadFile() {
    const downloadFile = new DownloadFile()

    await downloadFile.exec()
  }

  async x68000z() {
    const x68000z = new FetchX68000Z()

    await x68000z.exec()
  }

  async hatenaFotolife() {
    const command = 'echo "Hello World!"'
    const result = execSync(command).toString()
    console.log({ result })

    const returnObjectData = {
      foo: 'bar',
      hoge: 'fuga',
    }

    const outputPath = './tmp/output.json'
    fs.writeFileSync(outputPath, JSON.stringify(returnObjectData, null, 2))

    const hatenaFotolife = new FetchHatenaFotolife()
    await hatenaFotolife.exec()
  }
}
