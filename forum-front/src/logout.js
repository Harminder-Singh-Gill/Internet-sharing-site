import axiosInstance from "axiosInstance";

let logoutAction = null;

export const setLogoutAction = (action) => logoutAction = action;

export const logout = () => {
    backendLogout();
    frontendLogout();
}

const backendLogout = () => {
    axiosInstance.post('account/logout/blacklist/', {
        refresh_token: localStorage.getItem('refresh_token')
    });
}

export const frontendLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    axiosInstance.defaults.headers['Authorization'] = null;
    if (logoutAction) {
        logoutAction();
    }
}

export const login = (loginData, onLogin, onError) => {
    axiosInstance
    .post('account/token/', loginData)
    .then(response => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
        
        const accessToken = localStorage.getItem('access_token');
        const loggedInUser = getLoggedInUserFromAccessToken(accessToken);

        if (onLogin) {
            onLogin(loggedInUser);
        }
    })
    .catch(error => {
        if (onError) {
            onError();
        }
    })
}

const getLoggedInUserFromAccessToken = (accessToken) => {
    const accessTokenData = JSON.parse(atob(accessToken.split('.')[1]));
    return {
        id: accessTokenData.user_id,
        username: accessTokenData.username,
        profile_pic: accessTokenData.profile_pic
    }
}