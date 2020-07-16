interface Lib {
  (message: string): void
}

export const lib: Lib = (message) => {
  console.log('Build something awesome: ' + message)
}
