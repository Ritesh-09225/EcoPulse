import { formatDistanceToNow } from '../time'

describe('time.ts - formatDistanceToNow', () => {
  beforeAll(() => {
    // Mock the system time so tests are deterministic
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-05T12:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns "Just now" for dates less than a minute ago', () => {
    const thirtySecondsAgo = new Date('2024-01-05T11:59:30Z').toISOString()
    expect(formatDistanceToNow(thirtySecondsAgo)).toBe('Just now')
  })

  it('returns minutes for dates less than an hour ago', () => {
    const tenMinutesAgo = new Date('2024-01-05T11:50:00Z').toISOString()
    expect(formatDistanceToNow(tenMinutesAgo)).toBe('10m ago')
  })

  it('returns hours for dates less than a day ago', () => {
    const fiveHoursAgo = new Date('2024-01-05T07:00:00Z').toISOString()
    expect(formatDistanceToNow(fiveHoursAgo)).toBe('5h ago')
  })

  it('returns "Yesterday" for dates exactly 1 day ago', () => {
    const yesterday = new Date('2024-01-04T12:00:00Z').toISOString()
    expect(formatDistanceToNow(yesterday)).toBe('Yesterday')
  })

  it('returns "X days ago" for dates less than a week ago', () => {
    const threeDaysAgo = new Date('2024-01-02T12:00:00Z').toISOString()
    expect(formatDistanceToNow(threeDaysAgo)).toBe('3 days ago')
  })

  it('returns formatted date for dates older than a week', () => {
    const oldDate = new Date('2023-12-01T12:00:00Z').toISOString()
    expect(formatDistanceToNow(oldDate)).toBe('Dec 1') // Assuming en-US locale
  })
})
