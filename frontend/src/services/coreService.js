const searchItems = (params = {}) => {
    const searchParams = new URLSearchParams()
    const token = localStorage.getItem('session_token')
    
    // Add query parameter if provided
    if (params.q) {
        searchParams.append('q', params.q)
    }
    
    // Add status filter if provided
    if (params.status) {
        searchParams.append('status', params.status)
    }
    
    // Add pagination if provided
    if (params.limit) {
        searchParams.append('limit', params.limit)
    }
    
    if (params.offset) {
        searchParams.append('offset', params.offset)
    }
    
    const url = searchParams.toString() 
        ? `http://localhost:3333/search?${searchParams.toString()}`
        : "http://localhost:3333/search"
    
    // Create headers object - add auth if we have a token
    const headers = {
        'Content-Type': 'application/json'
    }
    
    if (token) {
        headers['X-Authorization'] = token
    }
    
    return fetch(url, {
        method: 'GET',
        headers: headers
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

const getAllItems = () => {
    return fetch("http://localhost:3333/search")
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
            ...(token && { 'X-Authorization': token })
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
            ...(token && { 'X-Authorization': token })
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
    getAllItems,
    getSingleItem, 
    createItem, 
    placeBid, 
    getBidHistory 
}