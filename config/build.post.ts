#!/usr/bin/env ts-node
/* eslint-disable no-console */

/**
 * @file Postbuild script used for uncommenting HTML comments marked with [POSTBUILD] tag.
 */

import fs from 'fs'
import path from 'path'

const buildDir = path.join(process.cwd(), 'build')

let count = 0

function parseDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Parsing [POSTBUILD] comments in ${dirPath}...`, 'SKIPPED', 'Directory does not exist')
    return
  }

  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.lstatSync(filePath)

    if (stat.isDirectory()) {
      parseDir(filePath)
    }
    else if (path.extname(filePath) === '.html') {
      try {
        let readStr = fs.readFileSync(filePath, 'utf8')
        readStr = readStr.replace(/<!-- \[POSTBUILD\] /g, '')
        readStr = readStr.replace(/ \[POSTBUILD\] -->/g, '')

        fs.writeFileSync(filePath, readStr, 'utf8')

        count++

        console.log(filePath)
      }
      catch (err) {
        console.error(filePath)

        throw err
      }
    }
  }
}

console.log()
console.log(`Parsing [POSTBUILD] comments in ${buildDir}...`)
console.log()

parseDir(buildDir)

console.log()
console.log(`Successfully parsed ${count} file(s)`)
