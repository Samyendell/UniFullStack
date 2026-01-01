const searchItems = (query = '', filters = {}) => {
    const params = new URLSearchParams({
        ...(query && { q: query }),
        ...filters
    })
    const url = params.toString() ? `http://localhost:3333/search?${params}` : "http://localhost:3333/search"
    
    return fetch(url)
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

const getSingleItem = (id) => {
    return fetch(`http://localhost:3333/item/${id}`)
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

const createItem = (itemData) => {
    const token = localStorage.getItem('session_token')
    
    return fetch("http://localhost:3333/item", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(itemData)
    })
    .then((response) => {
        if(response.status === 201){
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

const placeBid = (itemId, bidData) => {
    const token = localStorage.getItem('session_token')
    
    return fetch(`http://localhost:3333/item/${itemId}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(bidData)
    })
    .then((response) => {
        if(response.status === 201){
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

const getBidHistory = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`)
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

export const coreService = { 
    searchItems, 
    getSingleItem, 
    createItem, 
    placeBid, 
    getBidHistory 
}