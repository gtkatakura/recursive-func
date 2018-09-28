const base = (f, g) => (...args) => f(g(...args))

const compose = (funcs) => funcs.reduce(base)

export default compose
