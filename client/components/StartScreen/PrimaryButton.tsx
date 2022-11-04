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
            ? 'py-6 text-5xl px-6'
            : props.size === 'small'
            ? 'py-3 text-3xl px-8'
            : ''

    return <button
        onClick={props.onClick}
        className={`text-white rounded-xl shadow-2xl ${colorClass} ${sizeClass}`}
    >
        <p className='uppercase font-bold'>{props.text}</p>
    </button>
}
