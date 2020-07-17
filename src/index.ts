#!/usr/bin/env node
import fs from 'fs'
import parseArgs from 'yargs-parser'
import { untoken } from 'untoken'

const argv = parseArgs(process.argv.slice(2))

const printUsage = () => {
  const usage = `
Usage: untoken <source> <target> --name1=value1 --name2=value2 --name3=value3

where <source> is a text file containing tokens to be replaced and <target> will
be the resulting file. Any given arg as --name=value will be treat as a token.

untoken template.txt cal.txt --day=monday
untoken template.txt cal.txt --day=monday --month=january`
  console.log(usage)
}

enum ExitCodes {
  Ok = 0,
  Error = 1,
  NoFileSelected = 2,
  NoTokensSpecified = 3,
}

const printError = (message: string) => {
  console.error(`Error: ${message}`)
}

if ('help' in argv) {
  printUsage()
  process.exit(ExitCodes.Error)
}

const {
  _: [inputFile, outputFile],
  ...tokens
} = argv

if (!inputFile) {
  printError('no file specified')
  printUsage()
  process.exit(ExitCodes.NoFileSelected)
}

if (Object.keys(tokens).length === 0) {
  printError('no tokens specified')
  printUsage()
  process.exit(ExitCodes.NoTokensSpecified)
}

fs.readFile(inputFile, { encoding: 'utf-8' }, (error, data) => {
  if (error) {
    printError('could not read source file')
    console.error(error)
    process.exit(ExitCodes.Error)
  }

  const untokened = untoken(data, tokens)

  fs.writeFile(outputFile, untokened, { encoding: 'utf-8' }, (error) => {
    if (error) {
      printError('could not write to target file')
      console.error(error)
      process.exit(ExitCodes.Error)
    }
    process.exit(ExitCodes.Ok)
  })
})
