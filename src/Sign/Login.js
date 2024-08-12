import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect } from 'react';
const Login = () => {

    // const userInfo = sessionStorage.getItem(Access_Token);
    // console.log(userInfo);
    //네이버 로그인
    const onNaverLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    };
    //구글 로그인
    const onGoogleLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }

    useEffect(() => {
      axios.get('http://localhost:8080/oauth2/token')
      .then(res => {
          const accessToken = res.data.Access_Token;
          console.log(res);
          console.log(accessToken);
          sessionStorage.setItem('Access_Token', accessToken);
      }).catch(err => {
        console.log(err);
      })
},[]);


    //카카오 로그인
      const onKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
      };
    
    const onLogout = () => {
        axios.post("http://localhost:8080/logout", {},
            {withCredentials: true})
            .then((response) => {
                alert("로그아웃에 성공했습니다.");
                window.location.href="/";
            })
            .catch((err) => {
                console.error("로그아웃 실패", err);
                alert("로그아웃에 실패했습니다.");
            })
    }
    return (
        <>
          <h1>Login</h1>
          <button onClick={onNaverLogin}>Naver Login</button>
          <button onClick={onGoogleLogin}>Google Login</button>
          <button onClick={onKakaoLogin}>Kakao Login</button>
          <br />
          <button onClick={onLogout}>Logout</button>
        </>
      );
}
const LoginBtn = styled.button`
color: green;

`
export default Login;