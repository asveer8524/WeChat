import React, {useContext, useState } from 'react';
import axios from "axios";
import {UserContext} from "./UserContext.jsx";

export default function RegisterAndLoginForm(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister,setisLoginOrRegister] = useState('register');

    const {setUsername:setLoggedInUsername,setId}=useContext(UserContext);

    async function handleSubmit(event)
    {
        event.preventDefault();

        const url = (isLoginOrRegister==='register') ? '/register' : '/login';

        const {data}=await axios.post(url,{username,password});
        setLoggedInUsername(username);
        setId(data.id);
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                    type="text" 
                    placeholder="username"  
                    className="block w-full rounded-md p-2 mb-2 border"
                />

                <input 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                    type="password" 
                    placeholder="password" 
                    className="block w-full rounded-md p-2 mb-2 border"
                />
                
                <button 
                    type="submit"
                    className="bg-blue-500 text-white block w-full rounded-md p-2"
                >
                    {isLoginOrRegister==='register' ? "Register" : "Login"}
                </button>
                {
                    (isLoginOrRegister==='register') && (<div className='text-center mt-2'>
                                                            Already a member?  
                                                            <button 
                                                                onClick={()=>{setisLoginOrRegister('login')}}
                                                            > 
                                                                Login Here
                                                            </button>
                                                        </div>)
                }
                {
                    (isLoginOrRegister==='login') && (<div className='text-center mt-2'>
                                                            Don't have an account?  
                                                            <button 
                                                                onClick={()=>{setisLoginOrRegister('register')}}
                                                            > 
                                                                Register
                                                            </button>
                                                        </div>)
                }
                
            </form>
        </div>
    );
}
