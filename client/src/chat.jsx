import { useEffect, useState } from "react";

export default function Chat() {

    //we will create a state to store the websocket connecion that has been estatblised for a user
    const [ws,setWs] = useState(null);
 
    //establishing websocket connection

    useEffect(()=>{
       const ws= new WebSocket('ws://localhost:3000');
       setWs(ws);
        // now as websocket conneetion is established and saved now we need to add things that will hppened when we recieved a message

        ws.addEventListener('message',handleMessage);

    },[]);    

    function handleMessage(e)  //e is event
    {
        console.log(`New mesage ${e}`);
    }

    return (
        <div className="flex h-screen">
            <div className="bg-blue-100 w-1/3"></div>
            <div className="flex flex-col bg-blue-300 w-2/3 p-2">
                <div className="flex-1 overflow-auto">
                    {/* Content area where messages will be displayed */}
                </div>
                <div className="flex gap-2 mt-auto">
                    <input 
                        type="text" 
                        placeholder="Type Your Message" 
                        className="bg-white border p-2 flex-grow rounded-md" 
                    />
                    <button className="bg-blue-500 p-2 text-white rounded-md">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-6 h-6"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" 

                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
