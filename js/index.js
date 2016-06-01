"use strict";

const savedPatterns$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))
    .filter((x) => /pattern.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((acc, x) => {
      acc.push(x)
      return acc
    }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const newPatterns$ = new Rx.Subject()

newPatterns$.subscribe((pattern) => {
  pattern.timestamp = (new Date()).getTime()
  pattern.name = `pattern-${pattern.timestamp}`
  localStorage.setItem(pattern.name, JSON.stringify(pattern))
})

const allPatterns$ = Rx.Observable.combineLatest(savedPatterns$, newPatterns$.startWith(null), (savedPatterns, newPattern) => {
  if (newPattern) savedPatterns.unshift(newPattern)
  return savedPatterns
})

const patternList = document.getElementsByTagName('ol')[0]

const renderPattern = (e) => {

  const link = e.target.closest('a')
  if (!link) return;

  clearPattern()

  const pegData = link.getAttribute('data-pegs')
  const pegs = JSON.parse(pegData)
  pegs.forEach((pegModel) => {
    pegModel.pt = vectorToPt(pegModel.normalized.angle, pegModel.normalized.distScore * radius)
    pegModel.size = pegModel.normalized.sizeScore * maxPegSize(radius)
    newPeg(radius, pegModel.pt, pegModel.size)
    renderPeg(pegModel)
  })
}


const patternClicks$ = Rx.Observable.fromEvent(patternList, 'click')
patternClicks$.subscribe(renderPattern)


const delPatternClicks$ = Rx.Observable.fromEvent(patternList, 'click', '.delete')
delPatternClicks$.subscribe((e) => console.log(e))



const drawPatterns = (patterns) => {
  patternList.innerHTML = ''

  patterns.forEach((pattern) => {
    const link = document.createElement('A')
    link.className = 'pattern'
    link.style.height = '100px'
    link.style.width = '100px'
    link.style.display = 'block'
    link.innerHTML = pattern.svg
    link.setAttribute('data-pegs', JSON.stringify(pattern.pegs))

    const li = document.createElement('LI')
    li.appendChild(link)

    const del = document.createElement('A')
    del.innerHTML = '<svg viewBox="0 0 100 100" style=""><line x1="0px" y1="0px" x2="100px" y2="100px" style="stroke:white;stroke-width:6"></line><line x1="0px" y1="100px" x2="100px" y2="0px" style="stroke:white;stroke-width:6"></line></svg>'
    del.className = 'delete'
    li.appendChild(del)

    patternList.appendChild(li)
  })
}

allPatterns$.subscribe((x) => {
  drawPatterns(x)
})

