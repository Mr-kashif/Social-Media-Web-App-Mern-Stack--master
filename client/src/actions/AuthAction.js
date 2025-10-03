import * as AuthApi from '../api/AuthRequest.js';

export const logIn = (formData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' })
    try {
        const { data } = await AuthApi.logIn(formData);
console.log("Login data:", data); // Check what data you get back from the API
dispatch({ type: 'AUTH_SUCCESS', data: data });

        
        dispatch({ type: 'AUTH_SUCCESS', data: data })
    } catch (error) {
        console.error('Login error:', error?.response || error.message || error);
        dispatch({ type: 'AUTH_FAIL' })
    }
}



export const signUp = (formData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' })
    try {
        const { data } = await AuthApi.signUp(formData);
        console.log('SignUp success response:', data);
        dispatch({ type: 'AUTH_SUCCESS', data: data })
    } catch (error) {
        console.error('SignUp error:', error?.response || error.message || error);
        dispatch({ type: 'AUTH_FAIL' })
    }
}


export const logOut = () => async (dispatch) => {
    dispatch({ type: "LOG_OUT" })
}