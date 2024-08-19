import React, { useEffect, useState } from "react";
import TeamMain from '../imgs/팀페이지.jpeg';
import styled from "styled-components";
import axios from "axios";
const TeamInformation = () => {

    const [teamInfoList, setTeamInfoList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [createTeamModal, setCreateTeamModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamIntroduce, setTeamIntroduce] = useState('');
    
    const teamList = (keyword = '') => {
        axios.get(`http://localhost:8080/team/all`, {
            params: {
                page: 0,
                keyword: keyword, 
                tier: ''
            }
        }).then((res) => {
            setTeamInfoList(res.data.teamInfoList); 
        }).catch((err) => {
            console.error(err);
        });
    };

    // 팀 검색
    const searchbtn = () => {
        teamList(searchKeyword);
    };

    useEffect(() => {
        if (searchKeyword === '') {
            teamList();
        } else {
            searchbtn();
        }
    }, [searchKeyword]);
    
    //전체 팀 목록 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8080/team/all`,{
            params: {
                page: 0,
                keyword: '',
                tier:''
            }
        }).then((res) => {
            setTeamInfoList(res.data.teamInfoList);
        }).catch((err) => {
            console.error(err);
        })
    },[])

    //팀생성 모달 
    const createTeamModalbtn = () => {
        setCreateTeamModal(true);
    }

    //팀생성 버튼
    const createTeambtn = () => {    
        axios.post(`http://localhost:8080/api/team`, {
            teamName: teamName,
            introduce: teamIntroduce
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            setCreateTeamModal(false);
            console.log(res.data);
            teamList();
        }).catch((err) => {
            console.error("Error creating team:", err.response ? err.response.data : err.message);
        });
    };

    return (
        <Container>
            <img className="TeamMain" alt="Main" src={TeamMain} style={{width: '100%', height: '450px'}}/>
        <InquiryContainer>
            <InquiryBottomContainer>
                <LeftContainer>팀 조회</LeftContainer>
                <RightContainer>
                <SearchInput type="text" placeholder="팀 이름을 입력하세요..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
                </RightContainer>
            </InquiryBottomContainer>
            </InquiryContainer>
            <MainContainer>
                <SubContainer>
                    {teamInfoList.map((team, index) => (
                    <SubLineContainer key={team.teamName + index}>  
                        <TeamName>팀명: {team.teamName}</TeamName>
                        <TierName>티어: {team.tier.tierName}</TierName>
                        <CreateDate>창단일: {new Date(team.createDate).toLocaleDateString()}</CreateDate>    
                    </SubLineContainer>
                    ))}
                </SubContainer>
            </MainContainer>
            <CreateTeamContainer>
                <ButtonContainer>
                <CreateTeamButton onClick={createTeamModalbtn}>팀 생성</CreateTeamButton>
                </ButtonContainer>
            </CreateTeamContainer>
            {createTeamModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>팀 생성</h2>
                        <InputLabel>팀명: </InputLabel>
                        <InputField 
                            type= "text"
                            value= {teamName}
                            onChange={(e)=> setTeamName(e.target.value)}/>
                        <InputLabel>팀 소개: </InputLabel>
                        <InputField
                            type= "text"
                            value= {teamIntroduce}
                            onChange={(e)=> setTeamIntroduce(e.target.value)}/>
                        <CloseButton onClick={() => setCreateTeamModal(false)}>취소</CloseButton>
                        <SubmitButton onClick={createTeambtn}>생성</SubmitButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    )
}

const Container = styled.div`
display: flex;
flex: 1;
height: 1000px;
flex-direction: column;
align-items: center;
`

const InquiryContainer = styled.div`
display: flex;
margin-top: 1rem;
width: 100%;
height: 120px;
justify-content: center;
align-items: flex-end;

`

const InquiryBottomContainer = styled.div`
display: flex;
width: 80%;
height: 50px;
`

const LeftContainer = styled.div`
display: flex;
width: 30%;
font-size: 30px;
font-weight: 600;
align-items: center;
justify-content: center;

`

const RightContainer = styled.div`
display: flex;
width: 60%;
justify-content: flex-end;
`

const SearchInput = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
`

const MainContainer = styled.div`
display: flex;
flex-direction: column;
height: 650px;
width: 100%;
align-items: center;
margin-top: 1rem;
`

const SubContainer = styled.div`
display: flex;
flex-direction: column;
width: 60%;
height: 100%;
border: 1px solid;
border-radius: 1rem;
`

const SubLineContainer = styled.div`
display: flex;
width: 100%;
height: 18%;
margin-top: 1rem;
margin-bottom: 1rem;
align-items: center;
justify-content: row;
border-top: 1px solid;
border-bottom: 1px solid;
`
const TeamName = styled.div`
display: flex;
height: 100%;
width: 25%;
align-items: center;
justify-content: left;
font-size: 18px;
font-weight: bold;
margin-left: 1rem;
`

const TierName = styled.div`
display: flex;
height: 100%;
width: 35%;
align-items: center;
justify-content: left;
font-size: 16px;
`

const CreateDate = styled.div`
display: flex;
height: 100%;
width: 40%;
align-items: center;
justify-content: left;
font-size: 14px;
`
const CreateTeamContainer = styled.div`
display: flex;
width: 100%;
height: 80px;

justify-content: center;
`

const ButtonContainer = styled.div`
    display: flex;
    width: 60%;
    align-items: center;
    justify-content: right;
`
const CreateTeamButton = styled.button`
    border: 1px solid;
    border-radius: 0.5rem;
    font-size: 20px;
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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
`;

const InputLabel = styled.label`
    display: block;
    margin: 10px 0 5px;
    font-size: 16px;
    font-weight: bold;
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const CloseButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #ff0000;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #cc0000;
    }
`;

const SubmitButton = styled.button`
    margin-top: 20px;
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;
export default TeamInformation;