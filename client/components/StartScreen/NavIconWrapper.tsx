type Props = {
    children?: React.ReactNode
    link: string
}

export const NavIconWrapper: React.FC<Props> = ({ children, link }) => {
    return <div className='flex h-6 sm:h-10 xl:h-16 w-full col-span-1 justify-center hover:scale-110 hover:cursor-pointer transition-all cursor-pointer'>
        <a href={link} target="_blank" rel='noreferrer'>
        {children}
        </a>
    </div>
}
