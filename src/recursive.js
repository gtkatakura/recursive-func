const recursive = (func) => {
  const wrapper = func((...args) => wrapper(...args))
  return wrapper
}

export default recursive
