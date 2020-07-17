import execa from 'execa'
import fs from 'fs'
import path from 'path'
import tmp from 'tmp'

const rootDir = path.join(__dirname, '..')
const binPath = path.join(rootDir, 'src', 'index.ts')

tmp.setGracefulCleanup()

describe('untoken-cli', () => {
  it('should process a file with tokens', async () => {
    const sourceFile = tmp.fileSync()
    const targetFile = tmp.fileSync()

    const tokenName = 'name'
    const tokenValue = 'this is a token value'

    fs.writeFileSync(sourceFile.name, `Hello {${tokenName}}!`)

    try {
      await expect(
        execa(
          'ts-node',
          [binPath, sourceFile.name, targetFile.name, `--${tokenName}`, tokenValue],
          { cwd: rootDir, preferLocal: true }
        )
      ).resolves.toHaveProperty('exitCode', 0)

      const targetContents = fs.readFileSync(targetFile.name).toString()
      expect(targetContents).toBe(`Hello ${tokenValue}!`)
    } catch (error) {
      fail(error)
    }
  })

  it("should process a file with tokens (when target file doesn't exist)", async () => {
    const sourceFile = tmp.fileSync()
    const targetFile = tmp.fileSync()

    const tokenName = 'name'
    const tokenValue = 'this is a token value'

    fs.writeFileSync(sourceFile.name, `Hello {${tokenName}}!`)
    fs.unlinkSync(targetFile.name)

    try {
      await expect(
        execa(
          'ts-node',
          [binPath, sourceFile.name, targetFile.name, `--${tokenName}`, tokenValue],
          { cwd: rootDir, preferLocal: true }
        )
      ).resolves.toHaveProperty('exitCode', 0)

      const targetContents = fs.readFileSync(targetFile.name).toString()
      expect(targetContents).toBe(`Hello ${tokenValue}!`)
    } catch (error) {
      fail(error)
    }
  })

  it('should error when no arguments', async () => {
    await expect(
      execa('ts-node', [binPath], { cwd: rootDir, preferLocal: true })
    ).rejects.toHaveProperty('exitCode', 2)
  })

  it('should error when missing target file', async () => {
    await expect(
      execa('ts-node', [binPath, 'source.txt'], { cwd: rootDir, preferLocal: true })
    ).rejects.toHaveProperty('exitCode', 3)
  })

  it('should error when no tokens', async () => {
    await expect(
      execa('ts-node', [binPath, 'source.txt', 'target.txt'], { cwd: rootDir, preferLocal: true })
    ).rejects.toHaveProperty('exitCode', 3)
  })
})
