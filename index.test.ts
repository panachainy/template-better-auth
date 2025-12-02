import { describe, expect, test } from 'bun:test'

describe('Application', () => {
  test('should pass basic test', () => {
    expect(true).toBe(true)
  })

  test('environment should be defined', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})
