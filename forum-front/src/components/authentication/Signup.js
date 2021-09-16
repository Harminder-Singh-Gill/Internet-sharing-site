import { useState } from "react";
import axiosInstance from "axiosInstance";
import { login } from "../../logout";
import TextField from "../utils/form_components/TextField";
import './Signup.css';

const Signup = (props) => {
    const initialFormData = Object.freeze({
        username: '',
        password: ''
    });

    const username_field_messages = Object.freeze({
        initial: '',
        valid: '',
        invalid: 'Username must be between 8 and 20 characters long. Username may contain only alphanumeric, _, @, +, . and - characters',
        unavailable: 'Username is not available',
        available: 'Username is available',
    });

    const password_confirmation_field_messages = Object.freeze({
        normal: '',
        equal: 'It\'s a match!',
        empty: 'Password confirmation is required',
        not_equal: 'Password does not match'
    })

    const [formData, setFormData] = useState(initialFormData);
    const [usernameState, setUsernameState] = useState('initial');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [confirmationPasswordState, setConfirmationPasswordState] = useState('normal');

    const formDataChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    const usernameChange = (e) => {
        const username = e.target.value.trim();

        formDataChange(e.target.name, username);

        if (/(?=.{8,20}$)[a-zA-Z0-9._@+-]/.test(e.target.value)) {
            // setUsernameState('valid');
            checkIfUsernameAvailable(username);
        } else {
            setUsernameState('invalid');
        }
    }

    const passwordConfirmChange = (e) => {
        setConfirmationPassword(e.target.value);
        if (e.target.value === '') {
            setConfirmationPasswordState('empty');
        } else if (e.target.value === formData.password) {
            setConfirmationPasswordState('equal');
        } else {
            setConfirmationPasswordState('not_equal');
        }
    }

    const passwordChange = (e) => {
        setConfirmationPasswordState('normal');
        setConfirmationPassword('');
        formDataChange(e.target.name, e.target.value.trim());
    }

    const checkIfUsernameAvailable = (username) => {

        fetch('http://localhost:8000/account/username/available/?username=' + username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then(data => {
            if (data.is_username_available) {
                setUsernameState('available');
            } else {
                setUsernameState('unavailable');
            }
        })
    }

    const registerUser = (e) => {
        e.preventDefault();
        if (!isFormDataValid()) {
            return;
        }

        axiosInstance.post(`account/register/`, formData)
        .then(response => {
            login(formData, props.onSignup);
        })
    }

    const isFormDataValid = () => {
        return usernameState === 'available' && confirmationPasswordState === 'equal';
    }

    return ( 
        <div className="signup">
            <header className="signup-header">
                <div className="close-btn-div">
                    <button type="button" className="close-btn" onClick={props.onCancel || (() => {})}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                </div>
                <h1 className="site-name">topick</h1>
            </header>
            <form className="signup-form" onSubmit={registerUser}>
                <p className="signup-text">Create an account</p>
                <div className="input-section">
                    <div className="signup-input-div">
                        <TextField inputClassName="signup-input" className="signup-text-field"
                        error={usernameState !== 'initial' && usernameState !== 'available'}
                        valid={usernameState === 'available'}
                        helperText={username_field_messages[usernameState]}
                        value={formData.username}
                        onChange={usernameChange} 
                        required
                        name="username" 
                        placeholder = "Create a username" />
                    </div>
                    <div className="signup-input-div">
                        <TextField inputClassName="signup-input" className="signup-text-field" label='PASSWORD' value={formData.password} onChange={passwordChange} type="password" required name="password" placeholder="Create a password"/>
                    </div>
                    <div className="signup-input-div">
                        <TextField inputClassName="signup-input" className="signup-text-field" label='CONFIRM PASSWORD' 
                        value={confirmationPassword} 
                        onChange={passwordConfirmChange}
                        type="password" 
                        required 
                        disabled={formData.password === ''}
                        valid = {confirmationPasswordState === 'equal'}
                        error = {confirmationPasswordState === 'not_equal' || confirmationPasswordState === 'empty'}
                        helperText = {password_confirmation_field_messages[confirmationPasswordState]} 
                        placeholder = "Confirm Password" />
                    </div>
                </div>

                <div className="btn-section">
                    <button type="submit" className="signup-btn" disabled={!isFormDataValid()}>Sign Up</button>
                </div>

                <div className="login-link-section">
                    <div className="login-link-text">Already have an account?</div>
                    <button type="button" onClick={props.onLoginLinkClick || (() => {})} className="login-link-btn">Log In</button>
                </div>
            </form>
        </div>
        
     );
}
 
export default Signup;