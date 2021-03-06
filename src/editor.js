/*eslint-env browser */

import {BehaviorSubject} from 'rxjs'

import {newCmdBus$ } from 'pilota'

import {currentTonality$} from './tonality.js'
import {msPerPeriod$} from './tempo.js'
import {name$} from './name.js'
import {newSoundData} from './noise.js'

export const editorPegs$          = new BehaviorSubject([])
export const editorCmdBus$ = newCmdBus$(editorPegs$)


const newPeg = function(normalized) {
  return {
    id:         `peg-${(new Date()).getTime()}${Math.random()}`,
    normalized: normalized,
    sound:      newSoundData(normalized)
  }
}


// MODEL COMMANDS
editorCmdBus$.on('add peg', (state, cmd) => {
  state.push(newPeg(cmd.peg))
  return state
})

editorCmdBus$.on('clear', () => [])

editorCmdBus$.on('add pattern', (state, cmd) => {
  const pattern                              = cmd.pattern
  if (/^template.*/.exec(cmd.key)) {
    name$.next('My Dotz')
  } else {
    name$.next(pattern.name || 'My Dotz')
  }
  currentTonality$.next(pattern.tonality)
  msPerPeriod$.next(pattern.periodMs)
  document.getElementById('wheel').classList = `wheel ${pattern.tonality}`
  return pattern.pegs.map((pegModel) => {
    // if there is no sub-structure, then values assumed to be the normalized ones
    return newPeg(pegModel.normalized || pegModel)
  })
})

