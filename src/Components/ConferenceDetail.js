import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ConferenceDetail = () => {
    const location = useLocation();
    const conference = location.state?.conference;  //선택된 대회 정보
    const conferenceName = conference.conferenceName;
    const navigate = useNavigate();
    const utcDate = new Date(conference.conferenceDate);
    const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().split("T")[0];
    const formattedTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false});
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    const [conferenceDate, setConferenceDate] = useState('');
    const [content, setContent] = useState('');
    console.log(conference);
    const [conferenceData, setConferenceData] = useState(conference);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isWinnerOpen, setIsWinnerOpen] = useState(false);
    const [winnerTeam, setWinnerTeam] = useState('');
    const token = localStorage.getItem('Access_Token');
    const decodedToken = jwtDecode(token);
    const memberId = decodedToken?.member_id;
    const backButton = () => {
        navigate("/conference");
    }

    const handleEditButton = () => {
        setIsEditOpen(true);
    }

    const handleCloseModal = () => {
        setIsEditOpen(false);
    }

    // 우승팀 수정 버튼
    const handleWinnerButton = () => {
        setIsWinnerOpen(true);
    }

    // 우승팀 수정 모달 닫기
    const handleCloseWinner = () => {
        setIsWinnerOpen(false);
    }

    //대회 내용 수정
    const editSave = () => {
        const selectedDate = new Date(conferenceDate);
        const utcDate = new Date(selectedDate.getTime() + (selectedDate.getTimezoneOffset() * 60000)); // 로컬 시간을 UTC로 변환
    
        axios.put(`http://localhost:8080/api/conference`, {
            conferenceName: conferenceName,
            conferenceDate: utcDate.toISOString(), // UTC로 변환된 값
            content: content
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            alert("수정되었습니다.");
            setConferenceData(prev => ({
                ...prev,
                conferenceDate: utcDate.toISOString(),
                content: content
            }));
            handleCloseModal();
        }).catch((err) => {
            console.log(err);
        });
    };

    //우승팀 수정
    const winnerEditSave = () => {
        axios.put(`http://localhost:8080/api/conference/winner`, {
            conferenceName: conferenceName,
            winnerTeam: winnerTeam
        }, {
            headers: {
                'Access_Token' : localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            alert("우승팀을 변경하였습니다.");
            setConferenceData(prev => ({
                ...prev,
                winnerTeam: winnerTeam
            }))
            handleCloseWinner();
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <MainContainer>
            <TopContainer>
                <NameContainer>
                    <NameLeft>대회명</NameLeft>
                    <NameRight>{conferenceData.conferenceName}</NameRight>
                </NameContainer>
                <DateContainer>
                    <DateLeft>대회 날짜</DateLeft>
                    <DateRight>{formattedDateTime}</DateRight>
                </DateContainer>
                <WinnerContainer>
                    <WinnerLeft>우승팀</WinnerLeft>
                    <WinnerRight>{conferenceData.winnerTeam}</WinnerRight>
                </WinnerContainer>
                <ContentContainer>
                    <TopContent>대회 내용</TopContent>
                    <BottomContent>{conferenceData  .content}</BottomContent>
                </ContentContainer>
            </TopContainer>
            <BackContainer>
                {memberId === conference.organizer && (
                <>
                <WinnerButton onClick={handleWinnerButton}>우승팀</WinnerButton>
                <EditButton onClick={handleEditButton}>대회 수정</EditButton>
                </>)}
                <BackButton onClick={backButton}>뒤로 가기</BackButton>
            </BackContainer>
            {isEditOpen && (
                <ModalOverlay>
                <ModalContainer>
                    <ModalHeader>
                        <h2>대회 수정</h2>
                    </ModalHeader>
                    <ModalBody>
                    <label>대회 날짜</label>
                    <input type ="datetime-local"
                    value={conferenceDate}
                    onChange={(e) => setConferenceDate(e.target.value)} />
                    <label>대회 내용</label>
                    <input type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}/>
                    </ModalBody>
                        <ModalFooter>
                            <SaveButton onClick={editSave}>저장</SaveButton>
                            <CancelButton onClick={handleCloseModal}>취소</CancelButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalOverlay>
            )}
            {isWinnerOpen && (
            <ModalOverlay>
                <ModalContainer>
                    <ModalHeader>
                        <h3>우승팀 수정</h3>
                    </ModalHeader>
                    <ModalBody>
                        <label>우승팀</label>
                        <input type="text"
                        value={winnerTeam}
                        onChange={(e) => setWinnerTeam(e.target.value)}/>
                    </ModalBody>
                    <ModalFooter>
                            <SaveButton onClick={winnerEditSave}>저장</SaveButton>
                            <CancelButton onClick={handleCloseWinner}>취소</CancelButton>
                        </ModalFooter>
                </ModalContainer>
            </ModalOverlay>
            )}
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

const WinnerButton = styled.button`
    display: flex;
    width: 100px;
    height: 40px;
    border: 1px solid;
    border-radius: 1rem;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 1rem;
`
const EditButton = styled.button`
    display: flex;
    width: 100px;
    height: 40px;
    border: 1px solid;
    border-radius: 1rem;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 1rem;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

export default ConferenceDetail;