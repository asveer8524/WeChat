import Routes from './Routes';
import axios from "axios";
import {UserContextProvider} from "./UserContext"

function App() {

  //setting up url
  axios.defaults.baseURL = 'http://localhost:3000'
  //set cookies from api
  axios.defaults.withCredentials=true;

  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  )
}

export default App
