import type { h, JSX } from 'preact'
//@ts-ignore
import styled from 'styled-components'
export default function Table(props: { rows: string[][], header?: string }): JSX.Element {
    const contents = <>
        {props.header && <thead><tr><th colSpan={2}>{props.header}</th></tr></thead>}
        <tbody>
            {props.rows.map((r, i) =>
                <tr key={i}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                </tr>
            )}
        </tbody>
    </>
    return <StyledTable>
        {contents}
    </StyledTable>
}

const StyledTable = styled.table`
        width: 100%;
    thead th {
        text-align: center;
        text-decoration: underline;
        padding-bottom: 12px;
    }
    tr td:first-child {
        text-align: left;
    }
    tr td:last-child {
        text-align: right;
    }
`
