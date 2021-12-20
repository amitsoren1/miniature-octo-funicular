import {useState} from "react"
import { Login, Register } from "./Login"

const Authentication = () => {
  const [login, setLogin] = useState(true)
  if(login)
    return <Login setLogin={setLogin}/>
  return <Register setLogin={setLogin}/>
}

export default Authentication
