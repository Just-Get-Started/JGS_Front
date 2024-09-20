import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ConferenceDetail = () => {
    const location = useLocation();
    const conference = location.state?.conference;  //선택된 대회 정보
    const navigate = useNavigate();
    const formattedDate = new Date(conference.conferenceDate).toISOString().split("T")[0];
    const formattedTime = new Date(conference.conferenceDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, 
        timeZone: 'UTC'});
        console.log(conference)
    console.log(conference.conferenceDate);
    const token = localStorage.getItem('Access_Token');
    const decodedToken = jwtDecode(token);
    const memberId = decodedToken?.member_id;
    console.log(memberId);
    const backButton = () => {
        navigate("/conference");
    }
    return (
        <MainContainer>
            <TopContainer>
                <NameContainer>
                    <NameLeft>대회명</NameLeft>
                    <NameRight>{conference.conferenceName}</NameRight>
                </NameContainer>
                <DateContainer>
                    <DateLeft>대회 날짜</DateLeft>
                    <DateRight>{formattedDate} {formattedTime}</DateRight>
                </DateContainer>
                <WinnerContainer>
                    <WinnerLeft>우승팀</WinnerLeft>
                    <WinnerRight>{conference.winnerTeam}</WinnerRight>
                </WinnerContainer>
                <ContentContainer>
                    <TopContent>대회 내용</TopContent>
                    <BottomContent>{conference.content}</BottomContent>
                </ContentContainer>
            </TopContainer>
            <BackContainer>
                <BackButton onClick={backButton}>뒤로 가기</BackButton>
            </BackContainer>
        </MainContainer>
    )
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.5;
    width: 60%;
    border-radius: 1rem;
    border: 1px solid;
`

const NameContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 2;
    width: 100%;
    border-bottom: 1px solid;
`

const NameLeft = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 30%;
    font-size: 28px;
    font-weight: 600;
    border-right: 1px solid;
`

const NameRight = styled.div`
    display: flex;
    width: 70%;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: 600;
`

const DateContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    border-bottom: 1px solid;
`

const DateLeft = styled.div`
    display: flex;
    width: 30%;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: 600;
    border-right: 1px solid;
`

const DateRight = styled.div`
    display: flex;
    width: 70%;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
`
const WinnerContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    border-bottom: 1px solid;
`

const WinnerLeft = styled.div`
    display: flex;
    width: 30%;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: 600;
    border-right: 1px solid;
`

const WinnerRight = styled.div`
    display: flex;
    width: 70%;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
`

const ContentContainer = styled.div`
    display: flex;
    flex: 4;
    width: 100%;
    flex-direction: column;
`

const TopContent = styled.div`
    display: flex;
    width: 100%;
    flex: 3;
    justify-content: center;
    font-size: 28px;
    align-items: center;
    font-weight: 500;
    border-bottom: 1px solid;
`

const BottomContent = styled.div`
    display: flex;
    width: 100%;
    flex: 7;
    font-size: 24px;
`

const BackContainer = styled.div`
    display: flex;
    width: 60%;
    height: 40px;
    justify-content: right;
    margin-top: 1rem;
`

const BackButton = styled.button`
    display: flex;
    width: 100px;
    height: 40px;
    border: 1px solid;
    border-radius: 1rem;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    font-weight: 600;
`
export default ConferenceDetail;