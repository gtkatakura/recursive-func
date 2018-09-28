import compose from './compose'

const applyMiddlewares = (middlewares, func) => (
  middlewares.length !== 0
    ? compose(middlewares)(func)
    : func
)

const recursive = (func, middlewares = []) => {
  const wrapper = applyMiddlewares(
    middlewares,
    func((...args) => wrapper(...args))
  )

  return wrapper
}

export default recursive
