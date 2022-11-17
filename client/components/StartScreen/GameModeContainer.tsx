export const GameModeContainer = ({
    text,
    imgSrc,
    isNew,
    isComingSoon,
}: {
    text: string
    imgSrc: string
    isNew?: true
    isComingSoon?: true
}) => {
    return <div className='game-mode-container drop-shadow-4xl hover:scale-105 cursor-pointer transition-all uppercase'>
        <div className='game-mode-header bg-gradient-to-r from-stone-900 via-stone-700 to-stone-700 rounded-t-xl flex justify-between items-center py-[2px] px-3 font-semibold text-[6px] md:text-[0.65rem] lg:text-lg xl:text-3xl 2xl:text-4xl xl:py-2'>
            <h1 className='game-mode-header-text text-white'>{text}</h1>
            {isNew && NewIcon}
        </div>
        <div className='game-mode-image-container relative'>
            <div className='game-mode-image flex w-full h-16 md:h-20 lg:h-32 xl:h-40 2xl:h-56'>
                <img
                    src={imgSrc}
                    className={`rounded-b-xl object-cover object-top w-full h-full  border-black ${
                        isComingSoon && ' grayscale brightness-50'
                    }`}
                ></img>
            </div>
            {isComingSoon && ComingSoonText}
        </div>
    </div>
}

const NewIcon =
    <div className='text-white bg-[#EC5555] font-bold rounded-xl lg:py-0  lg:px-2 flex items-center border-2 border-red-100 relative justify-center'>
        <p className='px-1'>
            New
        </p>
    </div>

const ComingSoonText =
    <div className='game-mode-image-placeholder-text text-white absolute left-0 right-0 top-1/3'>
        <h1 className='w-full h-full text-center text-sm md:text-2xl xl:text-4xl font-semibold opacity-60'>
            Coming Soon
        </h1>
    </div>
