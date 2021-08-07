import React, { useState, useEffect, createContext } from 'react'
import { useHistory, useLocation } from "react-router-dom";

const TokenContext = createContext()

export const TokenProvider = ({ children }) => {

    const history = useHistory()
    const location = useLocation()
    const [loginToken, setLoginToken] = useState('')

    useEffect(()=>{
        setLoginToken(window.sessionStorage.getItem('access_token'))
        //console.log(location.pathname)
        if(location.pathname === '/auth' && window.sessionStorage.getItem('access_token')) {
          history.push('/home')
        }

        if(!window.sessionStorage.getItem('access_token')) {
          history.push('/auth')
        }
    }, [])

    window.addEventListener('storage', function(e) {
        if(window.localStorage.getItem('access_token') === null 
            || window.localStorage.getItem('access_token') === '' 
            || window.localStorage.getItem('access_token') === '""' 
            || window.localStorage.getItem('access_token') !== loginToken)
                history.push("/auth");
    })

  return (
    <TokenContext.Provider>
        {children}
    </TokenContext.Provider>
  )
}

export default TokenContext