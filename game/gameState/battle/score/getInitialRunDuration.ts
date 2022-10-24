export function getInitialRunDuration(): {
    startTime: string
    endTime: string | null
} {
    return {
        startTime: new Date().toUTCString(),
        endTime: null,
    }
}
