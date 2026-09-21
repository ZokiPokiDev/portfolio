import { spawn } from 'node:child_process'

const children = new Set()
let shuttingDown = false

function stop(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true

  children.forEach((child) => {
    if (!child.killed) child.kill('SIGTERM')
  })

  setTimeout(() => process.exit(exitCode), 100).unref()
}

function start(command, args, label) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  })

  children.add(child)
  child.on('error', (error) => {
    console.error(`[${label}] ${error.message}`)
    stop(1)
  })
  child.on('exit', (code, signal) => {
    children.delete(child)
    if (!shuttingDown) {
      console.error(`[${label}] stopped (${signal || code || 0})`)
      stop(code || 1)
    }
  })

  return child
}

start('php', ['-S', '127.0.0.1:8787', '-t', 'public'], 'php')
start('vite', [], 'vite')

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
