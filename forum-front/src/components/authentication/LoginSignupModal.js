import { useEffect, useState } from "react";
import Modal from "../utils/modal/Modal";
import Login from './Login';
import Signup from "./Signup";

const FORM_TYPES = {
    login: 'login',
    signup: 'signup'
}

const LoginSignupModal = (props) => {
    const [formType, setFormType] = useState(FORM_TYPES.login);

    useEffect(() => {
        if (props.formType === FORM_TYPES.signup) {
            setFormType(FORM_TYPES.signup);
        }else {
            setFormType(FORM_TYPES.login);
        }
    }, [props.formType, setFormType]);

    const handleLogin = (user) =>  {
        if (props.onLogin) {
            props.onLogin(user);
        }

        onClose();
    }

    const handleSignup = (user) =>  {
        if (props.onSignup) {
            props.onSignup(user);
        }

        onClose();
    }

    const onClose = () => {
        if (props.handleClose) {
            // setFormType(FORM_TYPES.login);
            props.handleClose();
        }
    }

    return (
        <Modal visible={props.visible} handleClose={onClose}>
            {(formType === FORM_TYPES.login) && <Login onLogin={handleLogin} onCancel={onClose} onSignupLinkClick={(e) => setFormType(FORM_TYPES.signup)}/>}
            {(formType === FORM_TYPES.signup) && <Signup onSignup={handleSignup} onCancel={onClose} onLoginLinkClick={(e) => setFormType(FORM_TYPES.login)}/>}
        </Modal>
    );
}
 
export default LoginSignupModal;