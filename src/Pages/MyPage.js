import React from "react";
import styled from "styled-components";
import { useState,useEffect } from "react";
const MyPage = () => {

    const name = String(JSON.parse(sessionStorage.getItem('userInfo')).name); 
    const email = String(JSON.parse(sessionStorage.getItem('userInfo')).email);
    const imageUrl = String(JSON.parse(sessionStorage.getItem('userInfo')).profile_image);
    
    console.log(name);
    console.log(email);

    return (
        <Container>
            <MainContainer>
                <TopContainer>
                    <LeftContainer>
                        <ImageContainer>
                            <img src={imageUrl} alt="User Profile" style={{width:'180px', height:'180px', borderRadius:'50%', marginBottom:'1rem'}}/>
                            이름: {name}
                        </ImageContainer>
                    </LeftContainer>
                    <RightContainer>2</RightContainer>
                </TopContainer>
            </MainContainer>
        </Container>
    )
}

const Container = styled.div`
display: flex;
flex: 1;
height: 800px;
flex-direction: column;
align-items: center;
justify-content: center;
`

const MainContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
background-color: yellow;
width: 100%;
height: 600px;
`

const TopContainer = styled.div`
display: flex;
flex-direction: row;
background-color: gray;
height: 500px;
width: 60%;
`

const LeftContainer = styled.div`
display: flex;
flex-direction: column;
background-color: pink;
height: 500px;
flex: 1;
`

const RightContainer = styled.div`
display: flex;
flex-direction: column;
background-color: green;
height: 500px;
width: 60%;
`

const ImageContainer = styled.div`
display: flex;
flex: 7;
align-items: center;
justify-content: center;
background-color: gray;
flex-direction: column;
font-size: 30px;
font-weight: 600;
`

const NameContainer = styled.div`
display: flex;
flex: 3 ;
align-items: center;
justify-content: center;
`
export default MyPage;