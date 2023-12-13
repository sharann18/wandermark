import { useState, useRef } from "react"
import "./Login.css"
import axios from "axios";

export default function Login({ myStorage, setCurrentUser }) {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginUser = {
            username : nameRef.current.value,
            password : passwordRef.current.value
        }

        try {
          const res = await axios.post(`${window.location.origin}/api/users/login`, loginUser);
          myStorage.setItem("user", res.data.username);
          setCurrentUser(res.data.username);
          setError(false);
        } catch (err) {
         setError(true);
        }
      }

    return(
        <div className="login-container">
            <div className="logo-div">
                <img alt="logo" src="title-icon.png"/>
            </div>
            <div className="logo-text">
                    WanderMark
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                  <input type="text" placeholder="username" ref={nameRef}/>
                  <input type="password" placeholder="password" ref={passwordRef}/>
                  <button className="login-button">Login</button>
                  {error && <span className="error-msg">Wrong Credentials.</span>}
                </form>
              </div>
        </div>
    )
}
