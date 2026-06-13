import { cn } from '../utils'

describe('utils.ts - cn', () => {
  it('merges multiple class strings correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('resolves tailwind class conflicts correctly', () => {
    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500')
  })

  it('handles conditional classes', () => {
    const isTrue = true
    const isFalse = false

    expect(cn('base', isTrue && 'truthy', isFalse && 'falsy')).toBe('base truthy')
  })

  it('handles array and object inputs', () => {
    expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3')
  })
})
