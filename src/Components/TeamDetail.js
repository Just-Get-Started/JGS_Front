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
    const [isInviteModal, setIsInviteModal] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isProfileModal, setIsProfileModal] = useState(false);

    // 팀 상세 정보 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8080/team/info`, {
            params: { teamName }
        }).then((res) => {
            console.log(res.data);
            setTeamDetail(res.data);
            setIntroduce(res.data.introduce || ""); // 팀 소개 초기화
            const leader = res.data.teamMemberListDTO.teamMemberDTOList.find(
                (member) => member.role === "Leader"
            );
            if (leader) {
                setLeader(leader.teamMemberName);
            }
  
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

    // 팀원 초대 모달
    const inviteModal = () => {
        axios.get(`http://localhost:8080/member`, {
            params: {
                page: 0,
                keyword: ''
            }
        }).then((res) => {
            console.log(res.data);
            setMemberList(res.data.memberDTOList);
            setIsInviteModal(true);
        }).catch((err) => {
            console.log(err);
        })
    }

    // 선택한 멤버의 상세 프로필
    const showMemberProfile = (member) => {
        setSelectedMember(member);
        setIsProfileModal(true);
    }

    // 팀원 초대 버튼
    const inviteButton = () => {
        if (selectedMember) {
            axios.post(`http://localhost:8080/api/team-invite`, {
                to: selectedMember.memberId, // 초대할 멤버의 이메일
                teamName: teamName
            }, {
                headers: {
                    'Access_Token': localStorage.getItem("Access_Token")
                }
            }).then((res) => {
                console.log(res.data);
                if(res.status === 201) {
                    alert("초대 요청을 보냈습니다.");
                }
                setIsProfileModal(false); // 상세 프로필 모달 닫기
                setIsInviteModal(false); // 초대 모달 닫기
            }).catch((err) => {
                if (err.response && err.response.data) {
                    alert(err.response.data.errorMessage);
                } else {
                    alert("오류가 발생했습니다. 다시 시도해 주세요.");
                }
            });
        }
    };

    return (
        <MainContainer>
        <Container>
            <TeamName>팀명: {teamDetail.teamName}</TeamName>
            <InfoText><strong>티어:</strong> {teamDetail.tier.tierName}</InfoText>
            <InfoText><strong>창단일:</strong> {new Date(teamDetail.createDate).toLocaleDateString()}</InfoText>
            <InfoText><strong>최근 매치 날짜:</strong> {teamDetail.lastMatchDate ? new Date(teamDetail.lastMatchDate).toLocaleDateString() : '최근 경기가 없습니다.'}</InfoText>
            <InfoText><strong>팀 소개:</strong> {teamDetail.introduce}</InfoText>
            <InfoText><strong>팀장:</strong> {leader}</InfoText>
            <MemberList>
                <strong>팀원:</strong>
                {teamDetail.teamMemberListDTO.teamMemberDTOList.map((member, index) => (
                    <span key={index}>{member.teamMemberName}{index < teamDetail.teamMemberListDTO.teamMemberDTOList.length - 1 ? ', ' : ''}</span>
                ))}
            </MemberList>
            <ButtonContainer onClick={modifyButton}>수정</ButtonContainer>
            <InviteContainer onClick={inviteModal}>팀원 초대</InviteContainer>
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
            {isInviteModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>팀원 초대</h3>
                        <MemberListContainer>
                            {memberList.map((member) => (
                                <MemberItem key={member.memberId} onClick={() => showMemberProfile(member)}>
                                    {member.profileImage && <img src={member.profileImage} alt={`${member.name}'s profile`} />}
                                    {member.name} ({member.email})
                                </MemberItem>
                            ))}
                        </MemberListContainer>
                        <ScrollButton onClick={() => setIsInviteModal(false)}>취소</ScrollButton>
                    </ModalContent>
                </ModalOverlay>
            )}

        {/* 선택한 멤버의 상세 프로필 모달 */}
        {isProfileModal && selectedMember && (
            <ModalOverlay>
                <ModalContent>
                    <h3>{selectedMember.name}의 프로필</h3>
                    <p>이메일: {selectedMember.email}</p>
                    <ButtonContainer onClick={inviteButton}>초대</ButtonContainer>
                    <ButtonContainer onClick={() => setIsProfileModal(false)}>취소</ButtonContainer>
                </ModalContent>
            </ModalOverlay>
        )}
        </Container>
        </MainContainer>
    );
};

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;

`
const Container = styled.div`
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const IntroduceInput = styled.input`
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 16px;
    background-color: #fafafa;
    transition: border 0.3s;

    &:focus {
        border: 1px solid #007bff;
        outline: none;
        background-color: #fff;
    }
`;

const ButtonContainer = styled.button`
    padding: 12px 30px;
    margin-top: 30px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 123, 255, 0.3);
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
        background-color: #0056b3;
        box-shadow: 0px 6px 12px rgba(0, 123, 255, 0.4);
    }
`;

const InviteContainer = styled.div`
    padding: 12px 30px;
    margin-top: 30px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 123, 255, 0.3);
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
        background-color: #0056b3;
        box-shadow: 0px 6px 12px rgba(0, 123, 255, 0.4);
    }
`
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    width: 500px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    z-index: 1001;
`;

const TeamName = styled.h2`
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
`;

const InfoText = styled.p`
    font-size: 18px;
    color: #555;
    margin-bottom: 8px;
    strong {
        color: #333;
        font-weight: bold;
    }
`;

const MemberList = styled.p`
    font-size: 18px;
    color: #555;
    margin-top: 15px;

    span {
        color: #007bff;
        font-weight: bold;
    }
`;

const MemberItem = styled.div`
    padding: 12px;
    margin: 10px 0;
    background-color: #f1f1f1;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0e0e0;
    }

    // 프로필 이미지 스타일 (필요시)
    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
`;

const MemberListContainer = styled.div`
    max-height: 300px; /* 최대 높이 설정 */
    overflow-y: auto; /* 세로 스크롤 가능 */
    padding: 10px;
    border: 1px solid #ddd; /* 선택 사항: 테두리 추가 */
    border-radius: 8px; /* 선택 사항: 모서리 둥글게 */
`;

const ScrollButton = styled.button`
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;
export default TeamDetail;
