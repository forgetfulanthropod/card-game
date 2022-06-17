import toast from 'react-hot-toast'

export const tl = (x: string): void => {
    console.log(x)
    toast(x)
}

export function toastWarn(x: string): void {
    toast.error(x)
    console.warn(x)
}
