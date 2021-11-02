import { h, Fragment, JSX } from 'preact' // eslint-disable-line
// @ts-expect-error
import styled from 'styled-components'
import { parse } from 'marked'
import { useEffect, useRef } from 'preact/hooks'

const Modal = styled.div`
    pointer-events: auto;
    left: 0;
    top: 0;
    width: 100%;

    height: 100%;
    overflow: auto;
    //   background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);

    .content {
        background-color: #fefefe;
        position: relative;

        margin: 15% auto;

        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }

    .close {
        position: absolute;
        top: 5%;
        right: 2%;
        pointer-events: auto;
        color: #aaa;

        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`

export function FullScreenInfo(props: { title: string, body: string, onClose: Callback }): JSX.Element {
    const { title, body, onClose } = props
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current == null) return
        ref.current.innerHTML = parse(body)
    }, [body])


    return <Modal onClick={onClose}>
        <div className="content" onClick={e => e.preventDefault()}>
            <h1 className="title">{title}</h1>
            <div ref={ref}></div>
            <span className="close" onClick={onClose}>Ⅹ</span>
        </div>
    </Modal>
}
