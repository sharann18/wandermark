import { useRef, useState } from "react"
import "./Register.css"
import axios from "axios";

export default function Register() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newUser = {
            username : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value
        }

        try {
            const res = await axios.post(`${window.location.origin}/api/users/register`, newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setSuccess(false);
            setError(true);
        }
    }

    return(
        <div className="register-container">
            <div className="logo-div">
                <img alt="logo" src="title-icon.png"/>
            </div>
            <div className="logo-text">
                    WanderMark
                </div>
            <div>
                <form onSubmit={handleSubmit}>
                  <input type="text" placeholder="username" ref={nameRef}/>
                  <input type="email" placeholder="email" ref={emailRef}/>
                  <input type="password" placeholder="password" ref={passwordRef}/>
                  <button className="register-button">Register</button>
                    { success && <span className="success-msg">You can log in now!</span>}
                    { error && <span className="error-msg">Oops. something went wrong!</span>}
                </form>
              </div>
        </div>
    )
}
