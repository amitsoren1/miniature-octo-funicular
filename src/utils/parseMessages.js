// "04/06/2021": [
//     {
//         content: getRandomSentence(),
//         sender: 1,
//         time: "08:11:26",
//         status: null,
//     },
//     {
//         content: getRandomSentence(),
//         sender: null,
//         time: "08:15:45",
//         status: "read",
//     },
//     {
//         content: getRandomSentence(),
//         sender: 1,
//         time: "09:11:26",
//         status: null,
//     },
//     {
//         content: getRandomSentence(),
//         sender: null,
//         time: "09:15:45",
//         status: "read",
//     },
// ]

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


const messages = [
    {
        "id": 6,
        "uid": "bf623dc0-df5d-4e61-809d-43ecf349a9d4",
        "content": "drytdy",
        "time": "22:41:25.814014",
        "date": "2021-12-18",
        "status": "sent",
        "sender": 2,
        "sent_for": 1
    },
    {
        "id": 6,
        "uid": "bf623dc0-df5d-4e61-809d-43ecf349a9d4",
        "content": "drytdy",
        "time": "22:41:25.814014",
        "date": "2021-12-18",
        "status": "sent",
        "sender": 2,
        "sent_for": 1
    }
]

// console.log(parseMessages(messages))

export default parseMessages
