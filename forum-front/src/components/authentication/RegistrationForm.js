import {useState} from 'react';
import './RegistrationForm.css';
import {Link, useHistory} from 'react-router-dom';
import TextField from '../form_components/TextField';
import axiosInstance from "axiosInstance";

const RegistrationForm = () => {
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

    const history = useHistory();

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
            setUsernameState('valid');
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
        if (usernameState !== 'available' || confirmationPasswordState !== 'equal') {
            return;
        }

        axiosInstance.post(`account/register/`, formData)
        .then(response => {
            history.push('/login/');
        })
    }

    return ( 
        <div className="registration">
            <form className="registration-form" onSubmit={registerUser}>
                
                <h2>Sign Up</h2>

                <TextField label='USERNAME' 
                error={usernameState !== 'initial' && usernameState !== 'available'} 
                valid={usernameState === 'available'}
                helperText={username_field_messages[usernameState]}
                value={formData.username}
                onChange={usernameChange} 
                required 
                name="username"/>

                <TextField label='PASSWORD' value={formData.password} onChange={passwordChange} type="password" required name="password"/>
                
                <TextField label='CONFIRM PASSWORD' 
                value={confirmationPassword} 
                onChange={passwordConfirmChange} 
                type="password" 
                required 
                disabled={formData.password === ''}
                valid = {confirmationPasswordState === 'equal'}
                error = {confirmationPasswordState === 'not_equal' || confirmationPasswordState === 'empty'}
                helperText = {password_confirmation_field_messages[confirmationPasswordState]}
                />

                <div className="btn-section">
                    <button type="submit" className="signup-btn">Sign Up</button>
                    <button type="button" className="back-btn" >Back</button>
                </div>

                <div className="login-div">
                    <Link className="login-link" to='/login/'>Already have an account? log in</Link>
                </div>
            </form>
        </div>
        
     );
}
 
export default RegistrationForm;