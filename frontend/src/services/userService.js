const { _ } = require("vue-router/dist/router-CWoNjPRp.mjs")

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
            return repsonse.json()
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

const logout = () => {
    return fetch("http://localhost:3333/logout",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": localStorage.getItem("session_token")
            }
        })
        .then((repsonse) => {
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

export const userService = { login, logout }
