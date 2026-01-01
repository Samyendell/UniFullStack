// const login = (email, password) => {
//     return fetch("http://localhost:3333/login",
//         {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 "email": email,
//                 "password": password
//             })
//         }
//     )
//     .then((response) => {
//         if (response.status === 200) {
//             return repsonse.json()
//         } else if (response.status === 400) {
//             throw 'Bad'
//         } else {
//             throw 'wrong'
//         }
//     })
//     .then((resJson) => {
//         localStorage.setItem("user_id", resJson.user_id)
//         localStorage.setItem("session_token", resJson.session_token)
//         return resJson
//     })
//     .catch((err) => {
//         console.log("Err", err)
//         return Promise.reject(err)
//     })
// }

// const logout = () => {
//     return fetch("http://localhost:3333/logout",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-Authorization": localStorage.getItem("session_token")
//             }
//         })
//         .then((repsonse) => {
//             if (response.status === 200) {
//                 localStorage.removeItem("user_id")
//                 localStorage.removeItem("session_token")
//                 return
//             } else if (response.status === 401) {
//                 throw "Not logged in"
//             } else {
//                 throw "something went wrong"
//             }
//         })
//         .catch((error) => {
//             console.log("Err", error)
//             return Promise.reject(error)
//         })
// }

// export const userService = { login, logout }

const login = (email, password) => {
    return fetch("http://localhost:3333/login",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }
    )
    .then((response) => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 400) {
            throw 'Bad'
        } else {
            throw 'wrong'
        }
    })
    .then((resJson) => {
        localStorage.setItem("user_id", resJson.user_id)
        localStorage.setItem("session_token", resJson.session_token)
        return resJson
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const register = (first_name, last_name, email, password) => {
    return fetch("http://localhost:3333/users",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": password
            })
        }
    )
    .then((response) => {
        if (response.status === 201) {
            return response.json()
        } else if (response.status === 400) {
            throw 'Bad'
        } else {
            throw 'wrong'
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

const logout = () => {
    return fetch("http://localhost:3333/logout",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": localStorage.getItem("session_token")
            }
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.removeItem("user_id")
                localStorage.removeItem("session_token")
                return
            } else if (response.status === 401) {
                throw "Not logged in"
            } else {
                throw "something went wrong"
            }
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}

const getUserProfile = (userId) => {
    return fetch(`http://localhost:3333/users/${userId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 404) {
                throw "Not Found"
            } else {
                throw "something went wrong"
            }
        })
        .then((resJson) => {
            return resJson
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}

export const userService = { login, register, logout, getUserProfile }