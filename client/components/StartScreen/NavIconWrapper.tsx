type Props = {
    children?: React.ReactNode
}

export const NavIconWrapper: React.FC<Props> = ({ children }) => {
    return <div className='flex h-6 sm:h-10 xl:h-16 w-full col-span-1 justify-center hover:scale-110 transition-all cursor-pointer'>
        {children}
    </div>
}
