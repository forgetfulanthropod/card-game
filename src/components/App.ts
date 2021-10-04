// import CharacterManager from 'features/battle/components/CharacterManager'
// import { Toaster } from 'react-hot-toast'
import AppWrap from './AppWrap'


export default function App(): HTMLElement {
    const hw = document.createElement('span')
    hw.innerText = 'hello world'
    hw.style.color = 'white'
    return AppWrap({ children: [hw] })
}
