const capitalize = name => {
  return name[0].toLowerCase() + name.slice(1)
}

const getName = component => {
  if (typeof (component) === 'function') {
    return component.name
  } else {
    return component.constructor.name
  }
}

export {
  capitalize,
  getName
}
