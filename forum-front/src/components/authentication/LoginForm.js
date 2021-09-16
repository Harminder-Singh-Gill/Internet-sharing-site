import TextField from "../form_components/TextField";
import {Link, useHistory} from "react-router-dom";
import './LoginForm.css';
import { useContext, useState } from "react";
import axiosInstance from "../../axios";
import { UserSetterContext } from "../../App";

const LoginForm = () => {

    const setUser = useContext(UserSetterContext);

    const history = useHistory();

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

    const getLoggedInUserFromAccessToken = (accessToken) => {
    
        const accessTokenData = JSON.parse(atob(accessToken.split('.')[1]));
        
        return {
            id: accessTokenData.user_id,
            username: accessTokenData.username,
            profile_pic: accessTokenData.profile_pic
        }
    }

    const logUserIn = (e) => {
        e.preventDefault();
        
        axiosInstance.post('account/token/', formData)
        .then(response => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            console.log(response);
            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
            
            const accessToken = localStorage.getItem('access_token');
            const loggedInUser = getLoggedInUserFromAccessToken(accessToken);
            
            setUser(loggedInUser);

            setAreCredentialsInvalid(false);
            history.push('/');
        })
        .catch(error => {
            setAreCredentialsInvalid(true);
        })
    }

    return ( 
        <div className="login">
            <form className="login-form" onSubmit={logUserIn}>
                {areCredentialsInvalid && <div className="invalid-credentials-message">The username or password is incorrect!</div>}
                
                <h2>Log In</h2>
                
                <TextField label="USERNAME" name="username" onChange={changeFormData} value={formData.username} required />
                
                <TextField type="password" name="password" onChange={changeFormData} value={formData.password} label="PASSWORD" required />

                <div className="btn-section">
                    <button type="submit" className="signup-btn">Log In</button>
                    <button type="button" onClick={() => history.goBack()} className="back-btn" >Back</button>
                </div>

                <div className="signup-div">
                    <Link className="signup-link" to='/signup/'>Don't have an account? Sign up</Link>
                </div>
            </form>
        </div>
     );
}
 
export default LoginForm;