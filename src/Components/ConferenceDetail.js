import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ConferenceDetail = () => {

    const location = useLocation();
    const conference = location.state?.conference;  //선택된 대회 정보
    const formattedDate = new Date(conference.conferenceDate).toISOString().split("T")[0];
    const formattedTime = new Date(conference.conferenceDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, 
        timeZone: 'UTC'});

    console.log(conference.conferenceDate);
    useEffect(() => {
    console.log(conference.conferenceDate)
    }, [])
    return (
        <MainContainer>
            <TopContainer>
                <NameContainer>
                    <NameLeft>대회명</NameLeft>
                    <NameRight>{conference.conferenceName}</NameRight>
                </NameContainer>
                <DateContainer>
                    <DateLeft>대회 날짜</DateLeft>
                    <DateRight>{formattedDate}{formattedTime}</DateRight>
                </DateContainer>
                <WinnerContainer>우승팀: 나다</WinnerContainer>
                <ContentContainer>대회 내용: 123</ContentContainer>
            </TopContainer>
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
  background-color: gray;
`

const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.5;
    width: 60%;
    background-color: black;
    border-radius: 1rem;
    border: 1px solid;
`

const NameContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 2;
    width: 100%;
    background-color: red;
`

const NameLeft = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 30%;
    background-color: pink;
    font-size: 28px;
    font-weight: 600;
`

const NameRight = styled.div`
    display: flex;
    width: 70%;
    background-color: blue;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: 600;
`

const DateContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    background-color: orange;
`

const DateLeft = styled.div`

`

const DateRight = styled.div`

`
const WinnerContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    background-color: green;
`
const ContentContainer = styled.div`
    display: flex;
    flex: 4;
    width: 100%;
    background-color: yellow;
`
export default ConferenceDetail;