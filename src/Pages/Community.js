import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Community = () => {

    const [comList, setComList] = useState([]);
    const [searchtitle, setSearchTitle] = useState(''); // 글명으로 검색
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/community/all", {
            params: {
              page: 0,
              keyword: ''
            }
        }).then((res => {
            setComList(res.data.communityDTOList); // 데이터에서 communityDTOList를 가져옴
            console.log(res.data);
        })).catch((err) => {
            console.log(err);
        });
    }, []);

    //모집 날짜 비교 함수
    const isRecruiting = (community) => {
        const currentDate = new Date();
        const recruitEndDate = new Date(community.recruitDate);
        return community.recruit && currentDate <= recruitEndDate;
    }

    //공지사항 해당 글 정보
    const handleTeamClick = (communityId) => {
        navigate(`/community/${communityId}`)
    }

    //글 작성
    const writingButton = () => {

    }

    return (
        <MainContainer>
            <InquiryContainer>
                <InquiryBottomContainer>
                    <LeftContainer>커뮤니티</LeftContainer>
                    <RightContainer>
                        <SearchInput 
                            type="text" 
                            placeholder="글명을 입력하세요..." 
                            value={searchtitle} 
                            onChange={(e) => setSearchTitle(e.target.value)} 
                        />
                    </RightContainer>
                </InquiryBottomContainer>
            </InquiryContainer>
            <CenterContainer>
                <SubContainer>
                    {comList.map((community, index) => (
                        <SubLineContainer key={community.communityId} onClick={() => handleTeamClick(community.communityId)}>
                           {community.recruit ? (
                                <>
                            <CommunityType>[팀원 모집 글]</CommunityType>
                            <Title>{community.title}</Title>
                            <TeamName>팀 이름: {community.teamName}</TeamName>
                            <Recruit>{isRecruiting(community) ? '모집 중' : '모집 완료'}</Recruit>
                            <RecruitDate>마감 날짜: {community.recruitDate}</RecruitDate>
                                </>
                           ) : (
                                <>
                            <CommunityType>[일반 글]</CommunityType>
                            <Title>{community.title}</Title>                          
                            <TeamName>팀 이름: {community.teamName}</TeamName>
                                </>
                           )}
                        </SubLineContainer>
                    ))}
                </SubContainer>
            </CenterContainer>
            <WritingContainer>
                <WritingButton onClick={writingButton}>글 작성</WritingButton>
            </WritingContainer>
        </MainContainer>
    );
}

const MainContainer = styled.div`
display: flex;
flex: 1;
height: 1650px;
flex-direction: column;
align-items: center;
`;

const InquiryContainer = styled.div`
display: flex;
margin-top: 1rem;
width: 100%;
height: 120px;
justify-content: center;
align-items: flex-end;
`;

const InquiryBottomContainer = styled.div`
display: flex;
width: 80%;
height: 50px;
`;

const LeftContainer = styled.div`
display: flex;
width: 30%;
font-size: 30px;
font-weight: 600;
align-items: center;
justify-content: center;
`;

const RightContainer = styled.div`
display: flex;
width: 60%;
justify-content: flex-end;
`;

const SearchInput = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const CenterContainer = styled.div`
display: flex;
flex-direction: column;
height: 950px;
width: 100%;
align-items: center;
margin-top: 1rem;
`;

const SubContainer = styled.div`
display: flex;
flex-direction: column;
width: 60%;
height: 950px;
border: 1px solid;
border-radius: 1rem;

`;

const SubLineContainer = styled.div`
display: flex;
flex-direction: column;
padding: 1rem;
border-bottom: 1px solid #ccc;
background-color: none;
cursor: pointer;
`;

const CommunityType = styled.div`
font-size: 20px;
font-weight: bold;
`
const Title = styled.div`
font-size: 20px;
font-weight: bold;
`;

const TeamName = styled.div`
margin-top: 5px;
`;

const Recruit = styled.div`
margin-top: 5px;
color: ${props => (props.recruit ? 'green' : 'red')};
`;

const RecruitDate = styled.div`
margin-top: 5px;
`;

const WritingContainer = styled.div`
display: flex;
width: 60%;
height: 50px;
align-items: center;
justify-content: right;
margin-top: 1rem;
`

const WritingButton = styled.button`
display: flex;
font-size: 20px;
border-radius: 10px;
background-color: white;
    &:hover {
        background-color: gray;
    }
`
export default Community;
