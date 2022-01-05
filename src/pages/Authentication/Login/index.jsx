import "./styles/main.css"
import { useState, useContext } from "react"
import Axios from "axios";
import DispatchContext from "context/DispatchContext";

const Register = ({setLogin}) => {
    const appDispatch = useContext(DispatchContext)
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [phoneerror, setPhoneerror] = useState(null)
    const [passerror, setPasserror] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
          await Axios.post("/register", {phone, password})
          const response2 = await Axios.post("/login", {phone, password})
          appDispatch({type:"login", data: {token: response2.data.key}})
        } catch (error) {
            // console.error(error)
            if("phone" in error.response.data)
                setPhoneerror(error.response.data.phone[0])
            if("password" in error.response.data)
                setPasserror(error.response.data.password[0])
            console.log("There was a problem.")
        }
      }

    function handlePhoneChange(e) {
        setPhone(e.target.value)
        setPhoneerror(null)
    }
    function handlePassChange(e) {
        setPassword(e.target.value)
        setPasserror(null)
    }

    return(
        <div className="login-page">
            <div className="center">
                <h1>Whats App</h1>
            </div>
          <div className="form">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input__wrapper">
                <input className={phoneerror? "haserror": ""} type="text" value={phone} placeholder="Phone"
                        onChange={handlePhoneChange}/>
                {phoneerror&&<div className="error-message">{phoneerror}</div>}
              </div>
              <div className="input__wrapper">
                <input className={passerror? "haserror": ""} type="password" value={password} placeholder="Password"
                        onChange={handlePassChange}/>
                {passerror&&<div className="error-message">{passerror}</div>}
              </div>
              <button>Sign Up</button>
              <p className="message">Already registered?
                <a href="/#" onClick={e=>setLogin(true)}> Sign In</a></p>
            </form>
          </div>
        </div>
        )
}

const Login = ({setLogin}) => {
    const appDispatch = useContext(DispatchContext)

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [phoneerror, setPhoneerror] = useState(null)
    const [passerror, setPasserror] = useState(null)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
          const response = await Axios.post("/login", {phone, password})
        //   console.log(response.data)
          appDispatch({type:"login", data: {token: response.data.key}})
        } catch (error) {
            console.error(error.response.data)
            if("phone" in error.response.data)
                setPhoneerror(error.response.data.phone[0])
            if("password" in error.response.data)
                setPasserror(error.response.data.password[0])
            if("non_field_errors" in error.response.data)
                setError(error.response.data.non_field_errors[0])
            console.log("There was a problem.")
        }
      }

    function handlePhoneChange(e) {
        setPhone(e.target.value)
        setPhoneerror(null)
        setError(null)
    }
    function handlePassChange(e) {
        setPassword(e.target.value)
        setPasserror(null)
        setError(null)
    }

return(
    <div className="login-page">
        <div className="center">
                <h1>Whats App</h1>
            </div>
        <div className="form">
            <form className="login-form">
                <div className="input__wrapper">
                    <input className={phoneerror? "haserror": ""} type="text" value={phone}
                        placeholder="Phone" onChange={handlePhoneChange}/>
                        {phoneerror&&<div className="error-message">{phoneerror}</div>}
                </div>
                <div className="input__wrapper">
                    <input className={passerror? "haserror": ""} type="password" value={password}
                        placeholder="Password" onChange={handlePassChange}/>
                {passerror&&<div className="error-message">{passerror}</div>}
                </div>
                {error&&<p className="error-message">{error}</p>}
                <button onClick={handleSubmit}>login</button>
                <p className="message">Not registered?
                    <a href="/#" onClick={e=>setLogin(false)}> Create an account</a></p>
            </form>
        </div>
    </div>
    )
}

export {Login, Register}
