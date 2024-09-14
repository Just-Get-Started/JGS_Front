import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MatchDetail = () => {
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
            navigate("/match");
        }).catch((err) => {
            console.log(err);
        });
    };
    
    const editButton = () => {
        setEditedMatch({
            matchDate: match.matchDate,
            location: match.location
        });
        setIsEditModal(true);
    };

    const saveChanges = () => {
        axios.put(`http://localhost:8080/api/match-post`, {
                matchPostId: match.matchPostId,
                matchDate: editedMatch.matchDate,
                location: editedMatch.location
            }, 
            {
                headers: {
                    'Access_Token': localStorage.getItem('Access_Token')
                }
            }).then((res) => {
                console.log(res.data);
                setIsEditModal(false);
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <h2>{match.teamName}</h2>
            <p>티어: {match.tierName}</p>
            <p>구장명: {match.location}</p>
            <p>시간: {new Date(match.matchDate).toLocaleString()}</p>
            {isLeader && (
                <>
                    <button onClick={editButton}>수정</button>
                    <button onClick={handleDeleteClick}>삭제</button>
                </>
            )}
        </div>
    );
};

export default MatchDetail;
