const getQuestions = (itemId) => {
    const token = localStorage.getItem('session_token')
    
    const headers = {
        'Content-Type': 'application/json'
    }
    
    if (token) {
        headers['X-Authorization'] = token
    }
    
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'GET',
        headers: headers
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'Failed to load questions'
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
    
    if (!token) {
        return Promise.reject('Authentication required')
    }
    
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(questionData)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'Failed to ask question'
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
    
    if (!token) {
        return Promise.reject('Authentication required')
    }
    
    return fetch(`http://localhost:3333/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(answerData)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        } else {
            throw 'Failed to answer question'
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