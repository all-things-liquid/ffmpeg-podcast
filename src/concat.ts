import { writeFileSync } from 'fs'

export function createConcatTxtFile(
  podcastFileNames: string[],
  txtFileName: string
): void {
  let concatFiles = ''

  for (const podcastPart of podcastFileNames) {
    concatFiles += `file \'${podcastPart}\'\n`
  }

  writeFileSync(txtFileName, concatFiles)
}
