import './Login.css';
import {useState} from 'react';
import { login } from '../../logout';

const Login = (props) => {
    const initialFormData = Object.freeze({
        username: '',
        password: ''
    })
    
    const [formData, setFormData] = useState(initialFormData);
    const [areCredentialsInvalid, setAreCredentialsInvalid] = useState(false);

    const changeFormData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setAreCredentialsInvalid(false);
    }

    const isFormDataFilled = () => {
        return formData.username !== '' && formData.password !== '';
    }

    const logUserIn = (e) => {
        e.preventDefault();
        login(formData, (user) => {
            if (props.onLogin) {
                props.onLogin(user);
            }
            setAreCredentialsInvalid(false);
        }, (error) => {
            setAreCredentialsInvalid(true);
        })
    }

    return ( 
        <div className="login">
            <header className="login-header">
                <div className="close-btn-div">
                    <button type="button" className="close-btn" onClick={props.onCancel || (() => {})}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                </div>
                <h1 className="site-name">topick</h1>
            </header>
            <form className="login-form" onSubmit={logUserIn}>
                <p className="login-text">Login to your account</p>
                {areCredentialsInvalid && <div className="invalid-credentials-message">The username or password is incorrect!</div>}
                <div className="input-section">
                    <input className="login-input" name="username" onChange={changeFormData} value={formData.username} placeholder="Username" required />
                    <input type="password" className="login-input" name="password" onChange={changeFormData} value={formData.password} placeholder="Password" required />
                </div>
                <div className="btn-section">
                    <button type="submit" className={"login-btn"} disabled={!isFormDataFilled()}>Log In</button>
                </div>

                <div className="signup-link-section">
                    <div className="signup-link-text">Don't have an account?</div>
                    <button type="button" onClick={props.onSignupLinkClick || (() => {})} className="signup-link-btn">Sign up</button>
                </div>
            </form>
        </div>
     );
}
 
export default Login;