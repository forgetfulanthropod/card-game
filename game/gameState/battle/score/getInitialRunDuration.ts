export function getInitialRunDuration(): {
    startTime: number
    endTime: number | null
} {
    return {
        startTime: new Date().getTime(),
        endTime: null,
    }
}
