type buttonType = 'primary' | 'secondary'
type buttonSize = 'small' | 'large'

export const PrimaryButton = (props: {
    text: string
    type: buttonType
    size: buttonSize
    onClick?: (...args: any) => unknown
}) => {
    const colorClass =
        props.type === 'primary'
            ? 'bg-gradient-to-b from-[#F2B518] to-[#EB4511]'
            : props.type === 'secondary'
            ? 'bg-gradient-to-b from-[#2F5DFF] to-[#1E0094]'
            : ''

    const sizeClass =
        props.size === 'large'
            ? 'py-1 px-2 text-xs 2xs:py-2 2xs:px-4 2xs:text-sm sm:py-3 sm:px-3 sm:text-3xl'
            : props.size === 'small'
            ? 'px-1 text-sm sm:py-2 sm:px-4 sm:text-2xl'
            : ''

    return <button
        onClick={props.onClick}
        className={`w-full text-white rounded-xl shadow-2xl ${colorClass} ${sizeClass}`}
    >
        <p className='uppercase font-bold'>{props.text}</p>
    </button>
}
