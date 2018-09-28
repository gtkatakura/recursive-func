import compose from './compose'

const METADATA = Symbol('recursive-func@METADATA')

const applyMiddlewares = (middlewares, func) => (
  middlewares.length !== 0
    ? compose(middlewares)(func)
    : func
)

const unwrapMetadata = func => func[METADATA]

export const recursive = (func, middlewares = []) => {
  const wrapper = applyMiddlewares(
    middlewares,
    func((...args) => wrapper(...args))
  )

  return Object.assign(wrapper, {
    [METADATA]: {
      func,
      middlewares,
    }
  })
}

export const withMiddlewares = (middlewares, wrapper) => {
  const metadata = unwrapMetadata(wrapper)

  return recursive(metadata.func, [
    ...metadata.middlewares,
    ...middlewares,
  ])
}
