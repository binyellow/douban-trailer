import * as cp from 'child_process'
import { resolve } from 'path'

const run = async () => {
  const script = resolve(__dirname, '../crawler/movie')
  const child = cp.fork(script, [])
  let invoke = false

  child.on('error', (err) => {
    if (invoke) {
      return
    }
    invoke = true
    console.log(err)
  })

  child.on('exit', (code) => {
    if (invoke) {
      return
    }
    invoke = true
    const err = code === 0 ? null : new Error('exit code' + code)
    console.log(err)
  })

  child.on('message', (data) => {
    console.log(data)
  })
}

run()