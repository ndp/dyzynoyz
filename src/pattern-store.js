/*eslint-env browser */

import { BehaviorSubject } from 'rxjs'

import { newCmdBus$ } from 'pilota'
import { localStorageKeys } from './ndp-software/util.js'
import { ownPropertiesIter } from './ndp-software/generators.js'
import { tonalities } from './tonality.js'

// hashmap of key => stored value
export const patternStore$ = new
    BehaviorSubject(localStorageKeys()
                        .filter(x => /^(pattern|template).*/.exec(x))
                        .reduce((acc, x) => {
                                  const item = localStorage.getItem(x)
                                  try {
                                    acc[x] = JSON.parse(item)
                                  } catch (x) {
                                    console.log(`Unable to load or parse [${x}]: ${ item}`)
                                  }
                                  return acc
                                }, {}))


export const patternStoreBus$ = newCmdBus$(patternStore$, {

  insert: function(state, cmd) {
    const pattern      = cmd.pattern
    pattern.timestamp  = (new Date()).getTime()
    pattern.key        = pattern.key || `pattern-${pattern.timestamp}`
    pattern.name       = pattern.name || `Pattern ${pattern.timestamp}`

    localStorage.setItem(pattern.key, JSON.stringify(pattern))
    state[pattern.key] = pattern

    return state
  },

  delete: function(state, cmd) {
    const key = cmd.key

    localStorage.removeItem(key)
    delete state[key]

    return state
  },

  'delete all': function() {

    localStorageKeys().forEach(key => {
      if (!/pattern-/.exec(key)) return
      localStorage.removeItem(key)
    })

    return {}
  },

  'create template': function(state, cmd) {
    const tonality = cmd.tonality
    const key      = `template-${tonality}`
    if (!localStorage[key]) {

      const template = {
        key:      key,
        name:     tonality,
        tonality: tonality,
        periodMs: 2000,
        pegs:     [],
        svg:      `<svg viewBox="0 0 1200 1200"><g class="wheel ${tonality}">
        <circle class="bg" cx="50%" cy="50%" r="49%"></circle></g></svg>`
      }

      patternStoreBus$.next({name: 'insert', pattern: template})
    }
    return state
  },

  'create missing templates': function(state) {
    for (const name of ownPropertiesIter(tonalities)()) {
      patternStoreBus$.next({name: 'create template', tonality: name})
    }
    return state
  }

})

setTimeout(() => patternStoreBus$.next('create missing templates'), 3000)

