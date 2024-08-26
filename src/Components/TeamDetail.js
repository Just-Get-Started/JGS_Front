import React from "react";
import { useParams } from "react-router-dom";
import {useState,useEffect} from 'react';
import axios from "axios";
import styled from "styled-components";

const TeamDetail = () => {

    const {teamName} = useParams();
    const [teamDetail, setTeamDetail] = useState(null);
    const [leader, setLeader] = useState("");

        // 팀 상세 정보 
        useEffect(() => {
            axios.get(`http://localhost:8080/team/info`, {
                params: { teamName }
            }).then((res) => {
                setTeamDetail(res.data); // 가져온 팀 정보로 상태 업데이트
                const leader = res.data.teamMemberListDTO.teamMemberDTOList.find(
                    (member) => member.role ==="Leader"
                );  
                if(leader) {
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
        
        return (
            <Container>
                <h2>팀명: {teamDetail.teamName}</h2>
                <p><strong>티어:</strong> {teamDetail.tier.tierName}</p>
                <p><strong>창단일:</strong> {new Date(teamDetail.createDate).toLocaleDateString()}</p>
                <p><strong>최근 매치 날짜:</strong> {teamDetail.lastMatchDate ? 
                new Date(teamDetail.lastMatchDate).toLocaleDateString() : '최근 경기가 없습니다.'}</p>
                <p><strong>팀 소개:</strong> {teamDetail.introduce}</p>
                <p><strong>팀장: {leader}</strong></p>
            </Container>
        );
    };
    
    const Container = styled.div`
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
    `;

export default TeamDetail;