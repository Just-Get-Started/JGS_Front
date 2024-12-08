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
    const [isOpenModal, setIsOpenModal] = useState(false);  //팀원 초대 모달

    useEffect(() => {
        axios.get("http://localhost:8080/api/team-member", {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token') // 헤더에 Access_Token 추가
            }
        }).then((res) => {
            if (res.status === 204) {
                setMyTeams([]);
            } else {
                if (res.data.teamMemberDTOList) {
                    const filteredTeams = res.data.teamMemberDTOList.filter(
                    (team) => team.teamMemberName === name);
                    console.log(filteredTeams)
                    setMyTeams(filteredTeams);
                } else {
                    setMyTeams([]);
                }}
            console.log(res.data);
        }).catch((err) => {
            console.error(err);
            setMyTeams([]);
        });
    }, [name]);

    // 상세 페이지로 이동
    const handleTeamClick = (teamName) => {
        navigate(`/team/${teamName}`); 
    };

    const handleOpenModal = () => {

    }

    const handleInviteTeam = (team) => {
        axios.post(`http://localhost:8080/api/team-invite`, {
                to: team.memberId,
                teamName: team.teamName
        }, {
                headers: {
                    'Access_Token': localStorage.getItem('Access_Token')
                }
        }).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
    padding: 20px;
`;

const MainContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const TopContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;

const LeftContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7;
    padding: 20px;
`;

const InviteButton = styled.button`
    font-size: 20px;
    border: 2px solid #007bff;
    border-radius: 10px;
`
const RightContainer = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
    padding: 20px;
    overflow-y: auto;
    max-height: 500px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 4px solid #007bff;
        margin-bottom: 15px;
    }

    span {
        font-size: 24px;
        font-weight: bold;
    }
`;

const TeamContainer = styled.div`
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: #f0f8ff;
    }

    h3 {
        margin: 0;
        font-size: 20px;
        color: #007bff;
    }

    p {
        margin: 5px 0 0;
        font-size: 16px;
        color: #333;
    }
`;


export default MyPage;
