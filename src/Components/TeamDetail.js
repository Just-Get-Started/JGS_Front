import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const TeamDetail = () => {
    const { teamName } = useParams();
    const [teamDetail, setTeamDetail] = useState(null);
    const [leader, setLeader] = useState("");
    const [introduce, setIntroduce] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);

    // 팀 상세 정보 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8080/team/info`, {
            params: { teamName }
        }).then((res) => {
            setTeamDetail(res.data); // 가져온 팀 정보로 상태 업데이트
            setIntroduce(res.data.introduce || ""); // 팀 소개 초기화
            const leader = res.data.teamMemberListDTO.teamMemberDTOList.find(
                (member) => member.role === "Leader"
            );
            if (leader) {
                setLeader(leader.teamMemberName);
            }
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, [teamName]);

    if (!teamDetail) {
        return <div>Loading...</div>;
    }

    // 수정 버튼 클릭 시 모달 열기
    const modifyButton = () => {
        setIsOpenModal(true);
    };

    // 변경 내용 저장 후 리렌더링
    const saveChanges = () => {
        axios.put(`http://localhost:8080/api/team`, {
            teamName: teamName,
            introduce: introduce
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            setIsOpenModal(false); // 모달 닫기
            setTeamDetail((prevDetail) => ({
                ...prevDetail,
                introduce: introduce // 팀 소개 업데이트
            }));
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    };

    //팀 가입 버튼
    const joinButton = () => {

    }

    return (
        <Container>
            <h2>팀명: {teamDetail.teamName}</h2>
            <p><strong>티어:</strong> {teamDetail.tier.tierName}</p>
            <p><strong>창단일:</strong> {new Date(teamDetail.createDate).toLocaleDateString()}</p>
            <p><strong>최근 매치 날짜:</strong> {teamDetail.lastMatchDate ? 
            new Date(teamDetail.lastMatchDate).toLocaleDateString() : '최근 경기가 없습니다.'}</p>
            <p><strong>팀 소개:</strong> {teamDetail.introduce}</p>
            <p><strong>팀장:</strong> {leader}</p>
            <p><strong>팀원:</strong> 
                {teamDetail.teamMemberListDTO.teamMemberDTOList.map((member, index) => (
                    <span key={index}>{member.teamMemberName}{index < teamDetail.teamMemberListDTO.teamMemberDTOList.length - 1 ? ', ' : ''}</span>
                ))}
            </p>
            <ButtonContainer onClick={modifyButton}>수정</ButtonContainer>
            <JoinContainer onClick={joinButton}>가입</JoinContainer>
            {isOpenModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>팀 소개 수정</h3>
                        <IntroduceInput
                            type="text"
                            value={introduce}
                            onChange={(e) => setIntroduce(e.target.value)}
                            placeholder="팀 소개를 입력하세요"
                        />
                        <ButtonContainer onClick={saveChanges}>저장</ButtonContainer>
                        <ButtonContainer onClick={() => setIsOpenModal(false)}>취소</ButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

const IntroduceInput = styled.input`
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const ButtonContainer = styled.button`
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const JoinContainer = styled.button`
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
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

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export default TeamDetail;
