import fs from 'fs'
import path from 'path'

const baseDir = path.join(__dirname, '../build')
const html = fs.readFileSync(path.resolve(baseDir, 'index.html'))

describe('app', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString()
  })

  it('has #root', async () => {
    expect(document.getElementById('root')).toBeTruthy()
  })
})
