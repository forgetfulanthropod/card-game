type buttonType = 'primary' | 'secondary' | 'default' | 'white'
type buttonSize = 'small' | 'medium' | 'large'

export const PrimaryButton = (props: {
    text: string
    type: buttonType
    size: buttonSize
    onClick?: (...args: any) => unknown
}) => {
    const colorClass =
        props.type === 'primary'
            ? 'from-[#F2B518] to-[#EB4511] border-[#762200] bg-gradient-to-l '
            : props.type === 'secondary'
            ? 'from-[#323232] to-[#101010] border-black bg-gradient-to-l '
            : props.type === 'default'
            ? 'from-[#4395FF] to-[#2F437D] border-[#172442] bg-gradient-to-l '
            : props.type === 'white'
            ? 'from-slate-100/30 via-slate-400/40 to-slate-600/30 border-[#E0E0E0] bg-gradient-to-l backdrop-blur-md'
            : ''

    const sizeClass =
        props.size === 'large'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-lg sm:py-3 sm:px-3 sm:text-3xl xl:py-5 xl:text-5xl 2xl:py-7 2xl:text-6xl'
            : props.size === 'medium'
            ? 'px-3 text-sm sm:py-1 sm:px-5 sm:text-xl xl:py-3 xl:px-10 xl:text-3xl'
            : props.size === 'small'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-base sm:py-3 sm:px-3 sm:text-md xl:py-5 xl:text-2xl 2xl:py-7 2xl:text-3xl'
            : ''

    return <button
        onClick={props.onClick}
        className={`w-full text-white font-bold shadow-3xl hover:scale-105 transition rounded-3xl ${colorClass} ${sizeClass}`}
    >
        <p className='uppercase'>{props.text}</p>
    </button>
}
