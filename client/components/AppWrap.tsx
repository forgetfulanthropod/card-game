import { styled } from '@/config'
import { FC } from 'react'

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 1.3vw;
`

type Props = {
    children?: React.ReactNode
  };

export const AppWrap: FC<Props> = ({children} ) => {
    return <Relative>{children}</Relative>
}
