"use strict";

const localStorageKey$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))

const savedPatterns$ = localStorageKey$
    .filter((x) => /pattern.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((patterns, x) => {
              patterns.push(x);
              return patterns
            }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const persistPatternAction$ = new Rx.Subject()

persistPatternAction$.subscribe((pattern) => {
  pattern.timestamp = (new Date()).getTime()
  pattern.tonality  = currentTonality$.getValue()
  pattern.name      = `pattern-${pattern.timestamp}`
  localStorage.setItem(pattern.name, JSON.stringify(pattern))
})

// Currently saved patterns
const persistedPatternsState$ = Rx.Observable.combineLatest(
    savedPatterns$,
    persistPatternAction$.startWith(null),
    (savedPatterns, newPattern) => {
      if (newPattern) savedPatterns.unshift(newPattern)
      return savedPatterns
    })

const persistedPatternsBus$ = newCmdBus$(persistedPatternsState$)

//persistedPatternsBus$.on('add', function(state, cmd) {
//  const newPattern = cmd.pattern
//  if (newPattern) state.unshift(newPattern)
//  return state
//})




// VIEWS
const patternListElem = document.getElementsByTagName('ol')[0]

const renderPatterns = (patterns) => {
  patternListElem.innerHTML = ''

  patterns.forEach((pattern) => {
    const link         = document.createElement('A')
    link.className     = 'pattern'
    link.style.height  = '100px'
    link.style.width   = '100px'
    link.style.display = 'block'
    link.innerHTML     = pattern.svg
    link.setAttribute('data-pegs', JSON.stringify(pattern.pegs))

    const li = document.createElement('LI')
    li.setAttribute('data-name', pattern.name)
    li.appendChild(link)

    const del     = document.createElement('A')
    del.innerHTML = '<svg viewBox="0 0 100 100" style=""><line x1="0px" y1="0px" x2="100px" y2="100px" style="stroke:mediumpurple;stroke-width:15"></line><line x1="0px" y1="100px" x2="100px" y2="0px" style="stroke:mediumpurple;stroke-width:15"></line></svg>'
    del.className = 'delete'
    li.appendChild(del)

    patternListElem.appendChild(li)
  })
}

persistedPatternsState$.subscribe(renderPatterns)


// INTENTIONS
const patternsClicks$ = Rx.Observable.fromEvent(patternListElem, 'click')

const loadPatternClick$ = patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className != 'delete')

loadPatternClick$.subscribe(log('click'))
const loadPatternCmd$ = loadPatternClick$
    .map(link => link.getAttribute('data-pegs'))
    .map(log('load'))
    .map(pegData => JSON.parse(pegData))

loadPatternCmd$
    .map('clear')
    .subscribe(editorPegsCmdBus$)

loadPatternCmd$
    .map((pegs) => {
           return {pegs, name: 'add pegs'}
         }).subscribe(editorPegsCmdBus$)


// INTENTIONS: DELETE
const delPatternLi$ = patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className == 'delete')
    .map((link) => link.closest('li'))

const delPatternAction$ = delPatternLi$
    .map((li) => li.getAttribute('data-name'))
delPatternAction$.subscribe((name) => localStorage.removeItem(name))
delPatternLi$.subscribe((li) => li.parentNode.removeChild(li))





