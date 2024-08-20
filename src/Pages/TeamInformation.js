import React, { useEffect, useState } from "react";
import TeamMain from '../imgs/팀페이지.jpeg';
import styled from "styled-components";
import axios from "axios";
const TeamInformation = () => {
    const [teamInfoList, setTeamInfoList] = useState([]);   //한팀 정보
    const [searchKeyword, setSearchKeyword] = useState(''); //팀명으로 검색
    const [createTeamModal, setCreateTeamModal] = useState(false);  //팀 생성 모달
    const [teamName, setTeamName] = useState('');   //팀 생성시 팀명
    const [teamIntroduce, setTeamIntroduce] = useState(''); //팀 생성시 소개
    const [selectedTeam, setSelectedTeam] = useState(null); // 선택한 팀 정보
    const [teamInfoModal, setTeamInfoModal] = useState(false);  //팀 정보 모달
    const [page, setPage] = useState(1); //현재 페이지
    const [totalPages, setTotalPages] = useState(1); //전체 페이지

    //전체 팀 목록
    const teamList = (keyword = '', page = 1) => {
        axios.get(`http://localhost:8080/team/all`, {
            params: {
                page: page-1,
                pageSize: 10,
                keyword: keyword,
                tier: ''
            }
        }).then((res) => {
            const sortedTeams = res.data.teamInfoList.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
            setTeamInfoList(sortedTeams);
            console.log(res.data);
            setTotalPages(res.data.totalPages);
        }).catch((err) => {
            console.error(err);
        });
    };

    // 페이지 변경시 팀 목록 가져오기
    useEffect(() => {
        teamList(searchKeyword, page);
    }, [searchKeyword, page]);

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // 팀 생성 모달
    const createTeamModalbtn = () => {
        setCreateTeamModal(true);
    }

    // 팀 상세 정보 모달
    const openTeamInfoModal = (team) => {
        setSelectedTeam(team);
        console.log(selectedTeam);
        setTeamInfoModal(true);
    }

    // 팀 생성 버튼
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
            teamList(searchKeyword, page);
        }).catch((err) => {
            if(err.response.status ===400) {
                alert("이미 존재하는 팀명입니다.");
            }
        });
    };

    return (
        <Container>
            <img className="TeamMain" alt="Main" src={TeamMain} style={{ width: '100%', height: '450px' }} />
            <InquiryContainer>
                <InquiryBottomContainer>
                    <LeftContainer>팀 조회</LeftContainer>
                    <RightContainer>
                        <SearchInput type="text" placeholder="팀 이름을 입력하세요..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                    </RightContainer>
                </InquiryBottomContainer>
            </InquiryContainer>
            <MainContainer>
                <SubContainer>
                    {teamInfoList.map((team, index) => (
                        <SubLineContainer key={team.teamName + index}>
                            <TeamName onClick={() => openTeamInfoModal(team)}>팀명: {team.teamName}</TeamName>
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
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)} />
                        <InputLabel>팀 소개: </InputLabel>
                        <InputField
                            type="text"
                            value={teamIntroduce}
                            onChange={(e) => setTeamIntroduce(e.target.value)} />
                        <CloseButton onClick={() => setCreateTeamModal(false)}>취소</CloseButton>
                        <SubmitButton onClick={createTeambtn}>생성</SubmitButton>
                    </ModalContent>
                </ModalOverlay>
            )}
            {teamInfoModal && selectedTeam && (
                <ModalOverlay>
                    <ModalTeamContent>
                        <h2>팀명: {selectedTeam.teamName}</h2>
                        <p><strong>티어:</strong> {selectedTeam.tier.tierName}</p>
                        <p><strong>창단일:</strong> {new Date(selectedTeam.createDate).toLocaleDateString()}</p>
                        <p><strong>최근 매치 날짜:</strong> {selectedTeam.lastMatchDate ? 
                        new Date(selectedTeam.lastMatchDate).toLocaleDateString() : '최근 경기가 없습니다.'}</p>
                        <p><strong>팀 소개:</strong> {selectedTeam.introduce}</p>
                        <CloseButton onClick={() => setTeamInfoModal(false)}>닫기</CloseButton>
                    </ModalTeamContent>
                </ModalOverlay>
            )}
                <PaginationContainer>
                <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</PaginationButton>
                <PageNumber>{page} / {totalPages}</PageNumber>
                <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</PaginationButton>
            </PaginationContainer>
        </Container>
    )
}

const Container = styled.div`
display: flex;
flex: 1;
height: 1650px;
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
height: 950px;
width: 100%;
align-items: center;
margin-top: 1rem;
`

const SubContainer = styled.div`
display: flex;
flex-direction: column;
width: 60%;
height: 950px;
border: 1px solid;
border-radius: 1rem;
`

const SubLineContainer = styled.div`
display: flex;
width: 100%;
height: 70px;
margin-top: 1rem;
margin-bottom: 0.5rem;
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
border: none;
background-color: white;
cursor: pointer;

}
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
    margin-top: 1rem;
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

const ModalTeamContent = styled.div`
    background-color: white;
    padding: 20px;
    border-raidus: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    height: 400px;
    text-align: left;
    border: 1px solid;
`
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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 1rem;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: ${props => props.disabled ? '#ccc' : '	#ffe4e1'};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    &:hover {
        background-color: ${props => !props.disabled && 'ffebcd'};
    }
`;

const PageNumber = styled.div`
    margin: 0 10px;
    font-size: 16px;
    align-self: center;
`;
export default TeamInformation;