// import CharacterManager from 'features/battle/components/CharacterManager'
// import { Toaster } from 'react-hot-toast'
import { Canvas, start } from 'newbattle/newbattle'
import AppWrap from './AppWrap'


export default function App(): HTMLElement {
    const hw = document.createElement('span')
    hw.innerText = 'hello world'
    hw.style.color = 'white'
    const canvas = Canvas()
    setTimeout(() => start(canvas), 1000)
    return AppWrap({ children: [hw, canvas] })
}
