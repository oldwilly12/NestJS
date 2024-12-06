import './style.css'
//import { charmander } from './bases/03-classes.ts'
import { charmander } from './bases/04-injection.ts'

charmander

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>HoLa mundo con Typescript</h1>
    <h1>${charmander.name}</h1>
  </div>
`

