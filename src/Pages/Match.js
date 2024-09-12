import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Match = () => {
    const [searchType, setSearchType] = useState('keyword'); // 검색 기준 (팀명 또는 티어)
    const [searchValue, setSearchValue] = useState('');
    const [matchInfoList, setMatchInfoList] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [last, setLast] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/match-post`, {
            params: {
                [searchType]: searchValue, // 검색 기준에 따라 keyword 또는 tier를 쿼리 파라미터로 사용
                page: page-1
            }
        }).then((res) => {

            setMatchInfoList(res.data.matchPostDTOList);
            setTotalPages(res.data.totalPages);
            setLast(res.data.last);
            console.log(res.data.matchPostDTOList);
        }).catch((err) => {
            console.log(err);
        });
    }, [searchType, searchValue, page]);

    const handleMatchClick = (match) => {
        setSelectedMatch(match);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearchValueChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (!last) {
            setPage(page + 1);
        }
    };

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
                    {matchInfoList.length > 0 ? (
                        matchInfoList.map((match) => (
                            <MatchLineContainer key={match.matchPostId} onClick={() => handleMatchClick(match)}>
                                <MatchTeamName>팀명: {match.teamName}</MatchTeamName>
                                <MatchTier>티어: {match.tier || '정보 없음'}</MatchTier>
                                <MatchLocation>구장명: {match.location}</MatchLocation>
                                <MatchDate>시간: {new Date(match.matchDate).toLocaleString()}</MatchDate>
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
        </MainContainer>
    );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 115vh;
  align-items: center;
  justify-content: center;
`;

const SearchContainer = styled.div`
    display: flex;
    margin-top: 1rem;
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
  cursor: pointer;
`;

const MatchTeamName = styled.div`
  font-size: 30px;
  font-weight: bold;
`;

const MatchTier = styled.div`
  font-size: 20px;
  color: #333;
`;

const MatchLocation = styled.div`
  font-size: 20px;
  color: #333;
`;

const MatchDate = styled.p`
  font-size: 16px;
  color: #333;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
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

export default Match;
