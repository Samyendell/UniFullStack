const getQuestions = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`)
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'something went wrong'
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const askQuestion = (itemId, questionData) => {
    const token = localStorage.getItem('session_token')
    
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(questionData)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'something went wrong'
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const answerQuestion = (questionId, answerData) => {
    const token = localStorage.getItem('session_token')
    
    return fetch(`http://localhost:3333/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(answerData)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'something went wrong'
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

export const questionService = { 
    getQuestions, 
    askQuestion, 
    answerQuestion 
}