import React from "react";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
const CommunityDetail = () => {

    const {communityId} = useParams();
    const [communityDetail, setCommunityDetail] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    //팀 상세 정보
    useEffect(()=> {
        axios.get(`http://localhost:8080/community`, {
            params: {communityId}
        }).then((res) => {
            console.log(res.data);
            setCommunityDetail(res.data);
        }).catch((err) => {
            console.log(err)
        })
    },[communityId]);

    if (!communityDetail) {
        return <div>Loading...</div>;
    }

    const modifyButton = () => {
        
    }
    
    return (
        <Container>
            <Title>{communityDetail.title}</Title>
            <TeamName>팀 이름: {communityDetail.teamName}</TeamName>
            <Content>{communityDetail.content}</Content>
            <WriteDate>작성일: {new Date(communityDetail.writeDate).toLocaleDateString()}</WriteDate>
        </Container>
    );
};

const Container = styled.div`
    padding: 20px;
    margin-top: 1rem;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    margin-top: 1rem;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const TeamName = styled.p`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
`;

const Content = styled.div`
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
`;

const WriteDate = styled.p`
    font-size: 14px;
    color: #555;
    text-align: right;
`;


export default CommunityDetail;