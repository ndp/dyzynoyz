# dizzidotz

__Source code for dizzidotz.com__

> There's this circle. 
> A bar goes around it like a clock hand and hits "pegs" that are placed in it. 
> It makes noise.

I saw a real one of these at the Exploritorium. Or at least I think I did. I remember it had twelve holes 
around in a circle, and you could place pegs in them. Then a bar went around and range a bell. 
So you could then make some music-like noise. This is kinda like one of those.

[![Node.js CI](https://github.com/ndp/dizzidotz/actions/workflows/node.js.yml/badge.svg)](https://github.com/ndp/dizzidotz/actions/workflows/node.js.yml)

### Thoughts and Mission

A few themes are driving this project:

  * to explore RxJS and _naked functional reactive programming_ (FRP without a framework). I'm evolving the codebase organically, and I rework the design as I figure out how to make it more reactive. I am using *cycle.js* as an inspiration, but adding pieces as I run across them to see if I end up at a different place.
  * improve my knowledge of specific technologies: SVG, HTML5 MIDI  sound, in-browser ES6, browser DOM api, CSS animations, Heroku pipelines.
  * let my kids be my "project owner" and drive feature implementation

### Development Logistics
  
See `package.json` for the most important script actions.
  
### Test Suite

  * `yarn test`
  * manual suite:
    * add peg: verify sound and highlight
    * restore old pegs: verify sound and highlight
    * save pegs
    * restore newly saved pegs: verify sound and highlight
    * scratch
  
### DevOps

  * [Heroku dashboard](https://dashboard.heroku.com/pipelines/68ffa886-6dea-4a15-ad6a-eed1aeb03cbb)
  * [Staging](https://dizzidotz-staging.herokuapp.com/)
  * [Prod](https://dizzidotz.com)

### Source Code Style Guide & Glossary

  * Use `eslint` and editconfig
  * **El**: Suffix added to variables denoting an HTML **element**.
  * **$**: Suffix added to variables denoting a stream. Can be read as "stream."
  * **Iter**: Iterator.
  
  
  
### Colors

TBD 

What would a set of colors be?
tonality sets theme
 * background to wheel
 * arm

Instruments
 * on screen
 * playing
 * growing


### References

  * http://tonejs.org/docs/, https://tonejs.github.io/
  * https://plus.maths.org/content/magical-mathematics-music
