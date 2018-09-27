import expect, { createSpy } from 'expect'

import { recursive } from 'src/index'

describe('recursive', () => {
  it('should be a function', () => {
    expect(recursive).toBeA(Function)
  })

  describe('recursive(identity)("one", "two")', () => {
    let internal
    let identity

    beforeEach(() => {
      internal = createSpy().andCall(value => value)
      identity = recursive(self => internal)
    })

    const subject = () => identity('one', 'two')

    it('should be called with ("one", "two")', () => {
      subject()

      expect(internal).toHaveBeenCalledWith('one', 'two')
    })

    it('should be called 1 time', () => {
      subject()

      expect(internal.calls.length).toEqual(1)
    })

    it('should return "one"', () => {
      expect(subject()).toEqual('one')
    })
  })

  describe('recursive(sum)([1, 2, 3])', () => {
    let internal
    let sum

    beforeEach(() => {
      sum = recursive(self => {
        internal = createSpy().andCall(([head, ...tail]) => {
          if (tail.length === 0) return head
          return head + self(tail)
        })

        return internal
      })
    })

    const subject = () => sum([1, 2, 3])

    it('should be called with ([1, 2, 3]), ([2, 3]) and ([3])', () => {
      subject()

      expect(internal).toHaveBeenCalledWith([1, 2, 3])
      expect(internal).toHaveBeenCalledWith([2, 3])
      expect(internal).toHaveBeenCalledWith([3])
    })

    it('should be called 3 times', () => {
      subject()

      expect(internal.calls.length).toEqual(3)
    })

    it('should return 6', () => {
      expect(subject()).toEqual(6)
    })
  })
})
