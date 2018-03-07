const lowerCamelCase = name => {
  return name[0].toLowerCase() + name.slice(1)
}

const getName = component => {
  if (typeof (component) === 'function') {
    return component.name
  }
  return component.constructor.name
}

const deepCopy = data => {
  if (data === undefined) {
    return undefined
  }
  return JSON.parse(JSON.stringify(data))
}

export {
  lowerCamelCase,
  deepCopy,
  getName
}
