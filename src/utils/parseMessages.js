const parseMessages = (messages=[]) => {
    const dates = new Set()
    messages.forEach(msg => {
        dates.add(msg.date)
    })
    const res = {}
    dates.forEach(date=>{
        res[date] = []
    })
    messages.forEach(msg => {
        dates.add(msg.date)
        res[msg.date].push(msg)
    })
    return res
}

export default parseMessages
