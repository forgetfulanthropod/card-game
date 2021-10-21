const res = await fetch(`http://localhost:3002/square`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ n: 5 })
})
