type buttonType = 'primary' | 'secondary' | 'default'
type buttonSize = 'small' | 'large'

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
            : ''

    const sizeClass =
        props.size === 'large'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-sm sm:py-3 sm:px-3 sm:text-3xl xl:py-5 xl:text-5xl rounded-3xl'
            : props.size === 'small'
            ? 'px-1 text-sm sm:py-2 sm:px-4 sm:text-2xl rounded-xl'
            : ''

    return <button
        onClick={props.onClick}
        className={`border w-full text-white shadow-2xl hover:scale-105 transition ${colorClass} ${sizeClass}`}
    >
        <p className='uppercase font-bold'>{props.text}</p>
    </button>
}
