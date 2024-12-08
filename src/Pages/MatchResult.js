import React from "react";
import {useState, useEffect} from 'react';
import axios from "axios";
import styled from "styled-components";
import {jwtDecode} from "jwt-decode";

const MatchResult = () => {

    const [searchType, setSearchType] = useState('keyword');
    const [searchValue, setSearchValue] = useState('');
    const [matchResultList, setMatchResultList] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [last, setLast] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editScoreA, setEditScoreA] = useState(0);
    const [editScoreB, setEditScoreB] = useState(0);
    const token = localStorage.getItem('Access_Token');
    const decodedToken = jwtDecode(token);
    const memberId = decodedToken?.member_id;

    useEffect(() => {
        axios.get(`http://localhost:8080/match`, {
            params: {
                page: page-1,
                [searchType]: searchValue
            }
        }).then((res) => {
            setMatchResultList(res.data.matchListDTOList);
            setTotalPages(res.data.totalPages);
            setLast(res.data.last);
            console.log(res.data.matchListDTOList);
        }).catch((err) => {
            console.log(err);
        })
    }, [searchType, searchValue, page]);

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    }

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    }
    
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    const handleNextPage = () => {
        if (!last) {
            setPage(page + 1);
        }
    }

    // 수정 여는 모달
    const handleOpenModal = (match) => {
        if(memberId === match.referee) {
            setSelectedMatch(match);
            setEditScoreA(match.teamAScore);
            setEditScoreB(match.teamBScore);
            setIsOpenModal(true);
        }
    }

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSelectedMatch(null);
    }

    // 점수 수정
    const handleEditScore = () => {
        axios.put(`http://localhost:8080/api/match`, {
            matchId: selectedMatch.matchId,
            scoreA: editScoreA,
            scoreB: editScoreB
        }, {
            headers: {
                'Access_Token' : localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            console.log(res.data);
            alert("점수를 수정하였습니다");
            setMatchResultList((prevList) => 
            prevList.map(match => 
                match.matchId === selectedMatch.matchId ?
                {...match, 
                teamAScore: editScoreA,   
                teamBScore: editScoreB}
                : match
            ))
            setIsOpenModal(false);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <MainContainer>
            <SearchContainer>
                <Dropdown onChange={handleSearchTypeChange}>
                    <option value="keyword">팀명</option>
                    <option value="tier">티어</option>
                </Dropdown>
                <SearchInput
                type="text"
                placeholder={`검색할 ${searchType === 'keyword' ? '팀명' : '티어'} 입력`}
                value={searchValue}
                onChange={handleSearchValueChange}
                />
            </SearchContainer>
            <ContentContainer>
                <LeftContainer>
                    {matchResultList.length >0 ? (
                        matchResultList.map((match) => (
                            <MatchLineContainer key={match.matchId}>
                                <MatchContainer onClick={() => handleOpenModal(match)} style={{cursor:'pointer'}}>
                                <TeamNameContainer>
                                    <AteamName>{match.teamA} ({match.teamATier.tierName})</AteamName>
                                    <BteamName>{match.teamB} ({match.teamBTier.tierName})</BteamName>
                                </TeamNameContainer>
                                <ScoreContainer>
                                    <AteamScore>{match.teamAScore}</AteamScore>
                                    <BteamScore>{match.teamBScore}</BteamScore>
                                </ScoreContainer>
                                <DateContainer>
                                    {new Date(match.matchDate).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })}
                                </DateContainer>
                                </MatchContainer>
                            </MatchLineContainer>
                        ))
                    ) : (
                        <p>매치가 없습니다.</p>
                    )}
                </LeftContainer>
            </ContentContainer>
            <PaginationContainer>
                <PaginationButton onClick={handlePrevPage} disabled={page === 1}>
                    이전
                </PaginationButton>
                <PaginationText>{page} / {totalPages}</PaginationText>
                <PaginationButton onClick={handleNextPage} disabled={last}>
                    다음
                </PaginationButton>
            </PaginationContainer>
            {isOpenModal && (
                        <Modal>
                        <ModalContent>
                          <h2>점수 수정</h2>
                          <label>
                            팀 A 점수:
                            <input
                              type="number"
                              value={editScoreA}
                              onChange={(e) => setEditScoreA(Number(e.target.value))}
                            />
                          </label>
                          <label>
                            팀 B 점수:
                            <input
                              type="number"
                              value={editScoreB}
                              onChange={(e) => setEditScoreB(Number(e.target.value))}
                            />
                          </label>
                          <ButtonContainer>
                          <button onClick={handleEditScore} style={{marginRight: '1rem'}}>저장</button>
                          <button onClick={handleCloseModal}>닫기</button>
                          </ButtonContainer>
                        </ModalContent>
                      </Modal>
            )}
        </MainContainer>
    )
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 125vh;
  align-items: center;
  justify-content: center;
`

const SearchContainer = styled.div`
    display: flex;
    margin-top: 2rem;
    width: 35%;
    height: 15vh;
    justify-content: center;
    align-items: center;
`;

const Dropdown = styled.select`
    margin-right: 10px;
    padding: 0.5rem;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 5px;
`;

const SearchInput = styled.input`
    width: 60%;
    padding: 0.5rem;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 5px;
    outline: none;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 70%;
  height: 103vh;
  border-radius: 1rem;
  border: 1px solid;
  margin-top: 1rem;
`;

const LeftContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

const MatchLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d9e5ff;
  height: 18vh;
  margin: 10px;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid;
`

const MatchContainer = styled.div`
 display: flex;
 flex-direction: column;
 border: 1px solid; 
`
const TeamNameContainer = styled.div`
 display: flex;
 height: 8vh;
 border-bottom: 1px solid;
`

const AteamName = styled.div`
display: flex;
width: 50%;
justify-content: center;
align-items: center;
font-size: 24px;
font-weight: 600;
border-right: 1px solid;
`

const BteamName = styled.div`
display: flex;
width: 50%;
justify-content: center;
align-items: center;
font-size: 24px;
font-weight: 600
`

const ScoreContainer = styled.div`
 display: flex;
 height: 4vh;
 border-bottom: 1px solid;
`

const AteamScore = styled.div`
 display: flex;
 width: 50%;
 align-items: center;
 justify-content: center;
font-size: 20px;
font-weight: 500
border-right: 1px solid;
`

const BteamScore = styled.div`
 display: flex;
 width: 50%;
 align-items: center;
 justify-content: center;
font-size: 20px;
font-weight: 500
`
const DateContainer = styled.div`
 display: flex;
 height: 4vh;
 justify-content: center;
 font-weight: 500;
 font-size: 20px;
 `

 const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 1rem;
`;

const PaginationButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const PaginationText = styled.span`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0 15px;
`;

const Modal = styled.div`
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const ButtonContainer = styled.div`
    margin-top: 1rem;
`
export default MatchResult;