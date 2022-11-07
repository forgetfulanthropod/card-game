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
    return <div className='game-mode-container shadow-2xl hover:scale-105 cursor-pointer transition-all uppercase'>
        <div className='game-mode-header bg-gradient-to-r from-black/90 via-[#858585]/90 to-[#AFAFAF]/80 rounded-t-xl border border-black flex justify-between items-center py-1 px-3 font-semibold text-[6px]  md:text-lg'>
            <h1 className='game-mode-header-text text-white'>{text}</h1>
            {isNew && NewIcon}
        </div>
        <div className='game-mode-image-container relative'>
            <div className='game-mode-image flex w-full h-16 md:h-40'>
                <img
                    src={imgSrc}
                    className={`rounded-b-xl object-cover object-top w-full h-full border-x border-b border-black ${
                        isComingSoon && ' grayscale brightness-50'
                    }`}
                ></img>
            </div>
            {isComingSoon && ComingSoonText}
        </div>
    </div>
}

const NewIcon =
    <div className='text-white bg-red-500 font-bold rounded-xl px-3 flex items-center border-2 border-red-200 '>
        <p>New</p>
    </div>

const ComingSoonText =
    <div className='game-mode-image-placeholder-text text-white absolute left-0 right-0 top-1/3'>
        <h1 className='w-full h-full text-center text-sm md:text-2xl xl:text-4xl font-semibold opacity-60'>Coming Soon</h1>
    </div>
