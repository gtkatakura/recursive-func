import expect, { createSpy } from 'expect'

import { recursive, withMiddlewares } from 'src/index'

describe('recursive', () => {
  let id
  let constant

  beforeEach(() => {
    id = createSpy().andCall(value => value)
    constant = createSpy().andCall(value => _ => value)
  })

  it('should be a function', () => {
    expect(recursive).toBeA(Function)
  })

  describe('recursive(id)("one", "two")', () => {
    let rec

    beforeEach(() => {
      rec = recursive(self => id)
    })

    const subject = () => rec('one', 'two')

    it('should be called with ("one", "two")', () => {
      subject()

      expect(id).toHaveBeenCalledWith('one', 'two')
    })

    it('should be called 1 time', () => {
      subject()

      expect(id.calls.length).toEqual(1)
    })

    it('should return "one"', () => {
      expect(subject()).toEqual('one')
    })
  })

  describe('recursive(id, [() => const("three")])("one", "two")', () => {
    let subject
    let middleware

    beforeEach(() => {
      middleware = createSpy().andCall(() => constant('three'))
      subject = recursive(self => id, [
        middleware,
      ])
    })

    it('should not call λ(id)', () => {
      subject()

      expect(id).toNotHaveBeenCalled()
    })

    it('should call λ(middleware) with λ(id)', () => {
      subject()

      expect(middleware).toHaveBeenCalled(id)
    })

    it('should call λ(const) with λ(three)', () => {
      subject()

      expect(constant).toHaveBeenCalled('three')
    })

    it('should return "three"', () => {
      expect(subject('one', 'two')).toEqual('three')
    })
  })

  describe('withMiddlewares([M2], recursive(F, [M1])) == recursive(F, [M1, M2])', () => {
    let internal
    let cacheMiddleware
    let sum1
    let sum2

    beforeEach(() => {
      cacheMiddleware = createSpy().andCall(next => {
        const cache = {}

        return (...args) => {
          const key = JSON.stringify(args)

          if (!cache[key]) {
            cache[key] = next(...args)
          }

          return cache[key]
        }
      })


      internal = createSpy().andCall((self, [head, ...tail]) => {
        if (tail.length === 0) return head
        return head + self(tail)
      })

      sum1 = withMiddlewares(
        [cacheMiddleware],
        recursive(self => (...args) => {
          return internal(self, ...args)
        }),
      )

      sum2 = withMiddlewares([], sum1)
    })

    it('should replay middleware when call withMiddlewares', () => {
      sum1([1, 2, 3])
      sum2([1, 2, 3])

      expect(internal.calls.length).toEqual(6)
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
