import {Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { useState, useEffect } from 'react'

function ProtectedRoute({children}){

    useEffect(()=>{
        auth().catch(() => setAuthorized(false))
    }, [])

    const [isAuthorized, setAuthorized] = useState(null)

    const refreshToken = async() =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post('/api/token/refresh/', {refresh: refreshToken});
            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.acess)
            } else{
                setAuthorized(false)
            }
        } catch(error){
            console.log(error)
            setAuthorized(false)
        }
    }

    const auth = async() =>{
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token){
            setAuthorized(false)
            return setAuthorized
        }

        const decoded = jwtDecode(token)

        const tokenExpiration = decoded.exp

        const now = Date.now() / 1000

        if(tokenExpiration < now ){
            await refreshToken()
        }else{
            setAuthorized(true)
        }
    }

    



    if (isAuthorized === null){
        return <div>
             Loading...
        </div>
    }
    return isAuthorized ? children : <Navigate to='/login'/>

}

export default ProtectedRoute