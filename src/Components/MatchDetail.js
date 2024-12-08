import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

const MatchDetail = () => {
    const name = String(JSON.parse(sessionStorage.getItem('userInfo')).name); 
    const [myTeams, setMyTeams] = useState([]); // 소속팀
    const [selectedTeam, setSelectedTeam] = useState(''); // 선택된 팀
    const [editedMatch, setEditedMatch] = useState({
        matchDate: '',
        location: ''
    });
    const [isEditModal, setIsEditModal] = useState(false);
    const [isLeader, setIsLeader] = useState(false); // 리더 여부 상태
    const navigate = useNavigate();
    const location = useLocation();
    const match = location.state?.match;
    const token = localStorage.getItem('Access_Token');
    const decodedToken = jwtDecode(token);
    const memberId = decodedToken?.member_id;       // JWT에서 추출한 memberId
    const [isApplyModal, setIsApplyModal] = useState(false);
    console.log(memberId)

    useEffect(() => {
        if (!match) return; // match가 없는 경우 useEffect 종료
        axios.get(`http://localhost:8080/team/info`, {
            params: {
                teamName: match.teamName
            }
        }).then((res) => {
            const teamMembers = res.data.teamMemberListDTO.teamMemberDTOList;
            console.log(teamMembers); // 팀원 정보 확인용
            const leader = teamMembers.find(member => member.role === "Leader");
            if (leader && leader.memberId === memberId) {
                setIsLeader(true);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, [match, memberId]);

    if (!match) {
        return <p>매치 정보를 불러오는 중입니다...</p>;
    }

    const handleDeleteClick = () => {
        axios.delete(`http://localhost:8080/api/match-post`, {
            params: {
                matchPostId: match.matchPostId
            },
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            console.log(res.data);
            alert("성공적으로 삭제되었습니다.");
            navigate("/match");
        }).catch((err) => {
            console.log(err);
        });
    };
    
    const editButton = () => {
        setIsEditModal(true);
        setEditedMatch({
            matchDate: new Date(match.matchDate).toISOString(),
            location: match.location
        }); 
    };

    //수정사항 저장
    const saveChanges = () => {
        // 시간대를 고려하여 날짜 변환 처리
        const localDate = new Date(editedMatch.matchDate);
        const matchDateWithOffset = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
  
        axios.put(`http://localhost:8080/api/match-post`, {
                matchPostId: match.matchPostId,
                matchDate: matchDateWithOffset, // 시간대가 적용된 날짜
                location: editedMatch.location
            }, 
            {
                headers: {
                    'Access_Token': localStorage.getItem('Access_Token')
                }
            }).then((res) => {
                alert("수정사항이 저장되었습니다.");
                console.log(res.data);
                navigate("/match");
            }).catch((err) => {
                console.log(err);
            });
    };
    
    //소속팀 불러오는 버튼
    const applyButton = () => {
        setIsApplyModal(true);
        axios.get("http://localhost:8080/api/team-member", {
            headers: { 'Access_Token': localStorage.getItem('Access_Token') }
        }).then((res) => {
            if (res.status === 204) {
                setMyTeams([]);
            } else {
                setMyTeams(res.data.teamMemberDTOList || []);
            }
        }).catch((err) => console.log(err));
    };  

    //소속팀 선택 후 신청 버튼
    const submitApplication = () => {
        axios.post(`http://localhost:8080/api/match/notification`, {
                matchPostId: match.matchPostId,
                teamName: selectedTeam
        }, {
            headers: { 'Access_Token': localStorage.getItem('Access_Token') }
        }).then((res) => {
            console.log(res.data);
            setIsApplyModal(false);
            alert("매치 신청이 완료되었습니다.");
        }).catch((err) => {
            alert("이미 종료된 매치입니다.")
            navigate("/match")
        }
        );
    };

    const contactButton = () => {
        console.log("contact");
    }

    return (
        <div>
            <h2>{match.teamName}</h2>
            <p>티어: {match.tierName}</p>
            <p>구장명: {match.location}</p>
            <p>시간: {new Date(match.matchDate).toLocaleString()}</p>

            {isLeader ? (
                <>
                    <button onClick={editButton}>수정</button>
                    <button onClick={handleDeleteClick}>삭제</button>
                </>
            ) : (
                <>
                    <button onClick={applyButton}>매치 신청</button>
                    <button onClick={contactButton}>연락 하기</button>
                </>
            )}

            {isEditModal && (
                <ModalContainer>
                    <ModalContent>
                        <h3>매치 정보 수정</h3>
                        <label>
                            시간:
                            <input
                                type="datetime-local"
                                value={editedMatch.matchDate}
                                onChange={(e) => setEditedMatch({ ...editedMatch, matchDate: e.target.value })}
                            />
                        </label>
                        <label>
                            위치:
                            <input
                                type="text"
                                value={editedMatch.location}
                                onChange={(e) => setEditedMatch({ ...editedMatch, location: e.target.value })}
                            />
                        </label>
                        <button onClick={saveChanges}>저장</button>
                        <button onClick={() => setIsEditModal(false)}>취소</button>
                    </ModalContent>
                </ModalContainer>
            )}
            {isApplyModal && (
                <ModalContainer>
                    <ModalContent>
                        <h3>매치 신청 - 팀 선택</h3>
                        {myTeams.length > 0 ? (
                            <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam}>
                                <option value="">팀 선택</option>
                                {myTeams.map((team) => (
                                    <option key={team.teamId} value={team.teamName}>
                                        {team.teamName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>소속된 팀이 없습니다.</p>
                        )}
                        <button onClick={submitApplication} disabled={!selectedTeam}>신청하기</button>
                        <button onClick={() => setIsApplyModal(false)}>취소</button>
                    </ModalContent>
                </ModalContainer>
            )}      
        </div>
    );
};

export default MatchDetail;

// 스타일 컴포넌트

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;