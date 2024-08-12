import React from 'react';
import styled from 'styled-components';
import GoogleLogin from '../Sign/Login';

const MainPage = () => {

    const loginbutton = () => {
        console.log("click");
    }
    return(
        <GoogleLogin onClick={loginbutton}>로그인</GoogleLogin>
    )

    
}

export default MainPage;