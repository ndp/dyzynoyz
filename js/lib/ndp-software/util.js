const log = (x) => (y,z) => console.log(x, y, z) || y

function precondition(x, msg) {
  if (!x) throw msg
}

function Math_within(x, min, max) {
  return Math.min(max, Math.max(min, x))
}

const localStorageKeys = []
for (let i = 0; i < localStorage.length; i++)
  localStorageKeys[i] = localStorage.key(i)