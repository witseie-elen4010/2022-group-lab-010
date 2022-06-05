/* istanbul ignore file */

const __hash = (s) => {
  let h = 0; const l = s.length; let i = 0
  if (l > 0) {
    while (i < l) { h = (h << 5) - h + s.charCodeAt(i++) | 0 }
  }
  return h
}

const objectArrayHash = (arrayObject) => {
  return __hash(JSON.stringify(arrayObject))
}

if (typeof module !== 'undefined') module.exports = { objectArrayHash }
