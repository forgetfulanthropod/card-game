type buttonType = 'primary' | 'secondary' | 'default' | 'white'
type buttonSize = 'small' | 'medium' | 'large'
import { TailSpin } from 'react-loading-icons'

export const PrimaryButton = (props: {
    text: string
    type: buttonType
    size: buttonSize
    onClick?: (...args: any) => unknown
    isLoading?: boolean
}) => {
    const colorClass =
        props.type === 'primary'
            ? 'from-[#F2B518] to-[#EB4511] border-[#762200] bg-gradient-to-l '
            : props.type === 'secondary'
            ? 'from-stone-900 to-stone-800 border-black bg-gradient-to-r'
            : props.type === 'default'
            ? 'from-[#272756] to-[#603a71] bg-gradient-to-r '
            : props.type === 'white'
            ? 'from-stone-100/40 via-stone-400/40 to-stone-600/40 border-[#E0E0E0] bg-gradient-to-l backdrop-blur-md'
            : ''

    const sizeClass =
        props.size === 'large'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-lg sm:py-3 sm:px-3 sm:text-3xl lg:py-5 lg:text-5xl xl:py-7 xl:text-6xl'
            : props.size === 'medium'
            ? 'px-3 text-sm sm:py-1 sm:px-5 sm:text-xl xl:py-3 xl:px-10 xl:text-3xl 2xl:text-5xl'
            : props.size === 'small'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-base sm:py-3 sm:px-3 sm:text-md  xl:text-xl  2xl:text-4xl'
            : ''

    return <button
        onClick={props.onClick}
        className={`w-full text-white shadow-3xl hover:scale-105 transition rounded-3xl whitespace-nowrap ${colorClass} ${sizeClass} filter hover:brightness-95 flex justify-center`}
    >
        {props.isLoading ? (
            <TailSpin speed={2} strokeWidth={2.5} />
        ) : (
            <p className='uppercase'>{props.text}</p>
        )}
    </button>
}
