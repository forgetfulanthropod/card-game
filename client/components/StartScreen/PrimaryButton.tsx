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
            ? 'bg-gradient-to-b from-[#F2B518] to-[#EB4511] border-[#762200]'
            : props.type === 'secondary'
            ? 'bg-gradient-to-b from-[#323232] to-[#101010] border-black'
            : props.type === 'default'
            ? 'bg-gradient-to-b from-[#4395FF] to-[#2F437D] border-[#172442]'
            : props.type === 'white'
            ? 'bg-gradient-to-b from-[#FFFFFF]/50 to-[#D4D4D4]/40 border-[#E0E0E0]'
            : ''

    const sizeClass =
        props.size === 'large'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-sm sm:py-3 sm:px-3 sm:text-3xl xl:py-5 xl:text-5xl'
            : props.size === 'medium'
            ? 'px-1 text-sm sm:py-2 sm:px-4 sm:text-2xl xl:py-4 xl:px-12 xl:text-4xl'
            : props.size === 'small'
            ? 'px-1 text-sm sm:py-2 sm:px-4 sm:text-2xl xl:text-3xl'
            : ''

    return <button
        onClick={props.onClick}
        className={`border w-full text-white shadow-2xl hover:scale-105 transition rounded-3xl ${colorClass} ${sizeClass}`}
    >
        <p className='uppercase font-bold'>{props.text}</p>
    </button>
}
