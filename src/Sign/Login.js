import React, { useEffect, useState } from "react";
import axios from "axios";
import { setCookie } from "../utils/cookieUtils";

const Login = () => {
  const [eventSource, setEventSource] = useState(null);

  const onNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const onKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("Access_Token");
    const refreshToken = urlParams.get("Refresh_Token");
  
    if (accessToken) {
      try {
        const base64Url = accessToken.split('.')[1];
        if (!base64Url) {
          throw new Error("Invalid access token format");
        }
  
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
  
        const userInfo = JSON.parse(jsonPayload);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log(userInfo); // 디코딩된 사용자 정보 확인
      } catch (error) {
        console.error("Failed to decode access token:", error);
      }
      localStorage.setItem("Access_Token", accessToken);
    }
    if (refreshToken) {
      // 쿠키에 Refresh_Token 저장
      setCookie("Refresh_Token", refreshToken, {
        path: "/",
        secure: true,
        sameSite: "None",
      });
    }

    if (accessToken) {
      window.location.href = "/";
    }
  }, []);

  const onLogout = () => {
    axios
      .post("http://localhost:8080/logout", {}, { withCredentials: true })
      .then((response) => {
        alert("로그아웃에 성공했습니다.");
        localStorage.removeItem("Access_Token");
        sessionStorage.removeItem("userInfo")
        if (eventSource) {
          eventSource.close();
        }
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("로그아웃 실패", err);
        alert("로그아웃에 실패했습니다.");
      });
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={onNaverLogin}>Naver Login</button>
      <button onClick={onGoogleLogin}>Google Login</button>
      <button onClick={onKakaoLogin}>Kakao Login</button>
    </>
  );
};

export default Login;
