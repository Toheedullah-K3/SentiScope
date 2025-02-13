import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AuthLayout = ({
    children,
    authentication = true
}) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if(authentication && authStatus === false) {
            navigate('/login')
        } else {
            setLoading(false)
        }
    },[authStatus,authentication, navigate])

  return loading ? <p>Loading...</p> : <>{children}</>
    
}

export default AuthLayout