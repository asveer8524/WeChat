//The createContext function is part of the React library and is used to create a Context object. 
//Context provides a way to pass data through the component tree without having to pass props down manually at every level.


import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext =  createContext({});

export function UserContextProvider({children})
{
    const [username,setUsername] =  useState(null);
    const [id,setId] = useState(null);

    useEffect(()=>{
        axios.get('/profile').then(response =>{
            setUsername(response.data.username);
            setId(response.data.userId)
        })
    },[])
  
    return (
        <UserContext.Provider value={{username,setUsername,id,setId}}>
            {children}
        </UserContext.Provider>
    )

}