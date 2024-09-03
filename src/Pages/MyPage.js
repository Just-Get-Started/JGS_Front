import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const name = String(JSON.parse(sessionStorage.getItem('userInfo')).name); 
    const email = String(JSON.parse(sessionStorage.getItem('userInfo')).email);
    const imageUrl = String(JSON.parse(sessionStorage.getItem('userInfo')).profile_image);
    const navigate = useNavigate();
    const [myTeams, setMyTeams] = useState([]); // 소속팀

    useEffect(() => {
        axios.get("http://localhost:8080/api/team-member", {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token') // 헤더에 Access_Token 추가
            }
        })
        .then((res) => {
            if (res.status === 204) {
                setMyTeams([]);
            } else {
                // 팀 정보가 있는 경우
                if (res.data.teamMemberDTOList) {
                    const filteredTeams = res.data.teamMemberDTOList.filter(
                        (team) => team.teamMemberName === name
                    );
                    console.log(filteredTeams)
                    setMyTeams(filteredTeams);
                } else {
                    // 팀 정보가 없거나 잘못된 경우
                    setMyTeams([]);
                }
            }
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
            setMyTeams([]);
        });
    }, [name]);

    const handleTeamClick = (teamName) => {
        navigate(`/team/${teamName}`); // 상세 페이지로 이동
    };
    return (
        <Container>
            <MainContainer>
                <TopContainer>
                    <LeftContainer>
                        <ImageContainer>
                            <img 
                                src={imageUrl} 
                                alt="User Profile" 
                                style={{width:'180px', height:'180px', borderRadius:'50%', marginBottom:'1rem'}}
                            />
                            이름: {name}
                        </ImageContainer>
                    </LeftContainer>
                    <RightContainer>
                        {myTeams.length > 0 ? (
                            myTeams.map((team) => (
                                <TeamContainer key={team.teamMemberId} onClick={() => handleTeamClick(team.teamName)}>
                                    <h3>팀명: {team.teamName}</h3>
                                    <p>역할: {team.role}</p>
                                </TeamContainer>
                            ))
                        ) : (
                            <p>소속된 팀이 없습니다.</p>
                        )}
                    </RightContainer>
                </TopContainer>
            </MainContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex: 1;
    height: 800px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: yellow;
    width: 100%;
    height: 600px;
`;

const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: gray;
    height: 500px;
    width: 60%;
`;

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: pink;
    height: 500px;
    flex: 1;
`;

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: green;
    height: 500px;
    width: 60%;
    overflow-y: auto; /* 스크롤 추가 */
`;

const ImageContainer = styled.div`
    display: flex;
    flex: 7;
    align-items: center;
    justify-content: center;
    background-color: gray;
    flex-direction: column;
    font-size: 30px;
    font-weight: 600;
`;

const TeamContainer = styled.div`
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
    cursor: pointer;
`;

export default MyPage;
