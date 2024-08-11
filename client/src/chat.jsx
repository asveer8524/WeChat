import { useContext, useEffect, useRef, useState } from "react";
import Avater from './Avatar';
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

export default function Chat() {

    //we will create a state to store the websocket connecion that has been estatblised for a user
    const [ws,setWs] = useState(null);

    // this state will store online people
    const [onlinePeople,setOnlinePeople] = useState({});

    //selected userid for chat
    const [selectedUserId,setSelectedUserId] = useState(null);

    //access username of loffed in user we have used context to pass user name and id from the top class
    const {id}=useContext(UserContext);
    //using state to store message'
    const [newMessageText, setNewMessageText] = useState('')

    //setting messages array to store all sent messages
    const [messages,setMessages] = useState([]);

    //auto scrolling for new conversation adding react ref
    const divUnderMessages= useRef();

    //establishing websocket connection

    useEffect(()=>{
       const ws= new WebSocket('ws://localhost:3000');
       setWs(ws);
        // now as websocket conneetion is established and saved now we need to add things that will hppened when we recieved a message

        // The message event is triggered when the WebSocket receives a message from the server
        ws.addEventListener('message',handleMessage);

    },[]);    

    function toTitleCase(str) {
        return str
            .toLowerCase()                // Convert the entire string to lowercase
            .split(' ')                    // Split the string into an array of words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' ');                    // Join the array back into a string with spaces
    }

    function handleMessage(ev)  //e is event
    {
        const messageData= JSON.parse(ev.data);
        //console.log("New mesage",e);
        console.log({ev,messageData});
        if('online' in messageData)
        {
            showOnlinePeople(messageData.online)
        }
        else if('text' in messageData)
        {
         //  console.log({messageData});
            setMessages(prev => ([...prev,{
                                        ...messageData
                                    }]));
        }

    }

    function showOnlinePeople(peopleArray)
    {
        const people = {};

        peopleArray.forEach(({userId,username}) => {
                people[userId] = toTitleCase(username);
        });

        setOnlinePeople(people);
    }

    //deleting our self as we cannot chat we our self so deleting it
    const onlinePeopleExcludeOurUser = {...onlinePeople};
    delete onlinePeopleExcludeOurUser[id];
 
    
    function sendMessage(ev)
    {
        ev.preventDefault();
        ws.send(JSON.stringify({
                recipient : selectedUserId,
                text : newMessageText
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev,{text:newMessageText, 
                                        recipient : selectedUserId,
                                        sender : id,
                                        id:Date.now(),
                                        }]));

    }

    //auto scroll the conversation window
    useEffect(()=>{
        const div= divUnderMessages.current;

        //Purpose: It scrolls the web page or a specific part of it so that a particular div element becomes visible to the user.
        //Smooth Scrolling: The behavior: 'smooth' part means the scrolling will happen gradually, not instantly. This creates a smooth animation effect, making the scrolling less jarring and more pleasant to watch.
        if(div)
        {
            div.scrollIntoView({behavior:'smooth', block:'end'});
        }
    },[messages]);


    //fetch history messages for database
 

    useEffect(() => {
        if (selectedUserId) {
            console.log("Fetching messages for user ID:", selectedUserId);
            axios.get(`/messages/${selectedUserId}`);
        }
    }, [selectedUserId]);

    //reciver is getting same message twice so fixing that issue that is we will display only unique message 
    //lodash js library
    const messageWithoutDupes = uniqBy( messages,'id');

    return (
        <div className="flex h-screen">
            <div className="bg-blue-100 w-1/3 ">
                <Logo/>
                {Object.keys(onlinePeopleExcludeOurUser).map(userId => (
                    <div 
                        key={userId}
                        //onClick={selectContact(userId)} is waring way to call
                        //What happens: selectContact(userId) is called immediately when the component renders, and its return value (whatever selectContact returns) is assigned to onClick.
                        //{() => selectContact(userId)} in the onClick handler, you are creating an inline arrow function. This ensures that selectContact(userId) is not called immediately when the component renders but rather when the user actually clicks on the div.
                        onClick={()=>setSelectedUserId(userId)}
                        className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (selectedUserId === userId ? 'bg-white':'')}
                    >
                        {
                            selectedUserId === userId && <div className="w-2 bg-blue-400 h-12 rounded-r-md"></div>
                        }
                        <div className="flex items-center gap-2 py-2 pl-4">
                        <Avater
                            username = {onlinePeople[userId]}
                            userId = {userId}
                        />
                        <span className="text-gray-800">{onlinePeople[userId]}</span>
                        </div>
            
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-300 w-2/3 p-2">
            {!!selectedUserId && (
                <div className="relative h-full">
                    <div className="overflow-y-scroll absolute inset-0" >
                        {messageWithoutDupes.map(message => (
                            <div key={message.id}>
                                <div className={(message.sender===id ? 'text-right': 'text-left')}>
                                {/*if sender === my id then message should appear on left side as they are sent by me else on right side as sent by other */}
                                    <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? "bg-green-300" : "bg-teal-300")}>
                                        Sender: {message.sender} <br/>
                                        My ID: {id} <br/>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={divUnderMessages}></div>
                    </div>
                </div>
    
            )}

                <div className="flex-1 overflow-auto"></div>
                {
                    !!selectedUserId && 
                    (
                        <form className="flex gap-2 mt-auto" onSubmit={sendMessage}>
                            <input 
                                value={newMessageText}
                                onChange={ev => setNewMessageText(ev.target.value)}
                                type="text" 
                                placeholder="Type Your Message" 
                                className="bg-white border p-2 flex-grow rounded-md" 
                            />
                            <button type="submit" className="bg-blue-500 p-2 text-white rounded-md">
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
                        </form>
                    )
                }
                
            </div>
        </div>
    );
}
