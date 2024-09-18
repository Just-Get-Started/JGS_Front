import React from "react";
import styled from "styled-components";
import ConferenceImage from '../imgs/대회.png';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConferenceDetail from "../Components/ConferenceDetail";

const Conference = () => {

    const [keyword, setKeyword] = useState('');
    const [conferenceInfoList, setConferenceInfoList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [last, setLast] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/conference`,{
            params: {
                page: page-1,
                keyword: keyword
            }
        }).then((res) => {
            console.log(res.data);
            setConferenceInfoList(res.data.conferenceDTOList);
            setTotalPages(res.data.totalPages);
            setLast(res.data.last);
        }).catch((err) => {
            console.log(err);
        })
    }, [page, keyword]);

    const handleConferenceClick = (conference) => {
        setSelectedConference(conference);
        navigate(`/conferencedetail/${conference.conferenceName}`, {state: {conference}});
    }

       //이전 페이지로 이동
    const handlePrevPage = () => {
        if (page >1 ) {
            setPage(page -1);
        }
    }

    //다음 페이지로 이동
    const handleNextPage = () => {
        if (!last) {
            setPage(page + 1);
        }
    }

    return (
        <MainContainer>
            <TopContainer>
                <img className="ConferenceImage" alt="Conference" src={ConferenceImage} style={{width: '100%', height: '60vh'}}/>
            </TopContainer>
            <CenterContainer>
                <SearchContainer>
                    <SearchLeftContainer>대회 검색</SearchLeftContainer>
                    <SearchRightContainer>
                        <SearchInput
                        type="text"
                        placeholder="대회 이름을 검색하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}/>
                    </SearchRightContainer>
                </SearchContainer>
                <ConferenceListContainer>
                    <ConferenceContainer>
                        <ConferenceList>
                    {conferenceInfoList.length > 0 ? (
                        conferenceInfoList.map((conference, index) => (
                            <ConferenceLineContainer key = {conference.conferenceName + index} onClick={() => handleConferenceClick(conference)}>
                                <ConferenceName>대회명: {conference.conferenceName}</ConferenceName>
                                <WinnerTeam>우승팀: {conference.winnerTeam}</WinnerTeam>
                            </ConferenceLineContainer>
                        ))
                    ) : (
                        <p>대회가 없습니다.</p>
                    )}            
                    </ConferenceList>    
                </ConferenceContainer>
                </ConferenceListContainer>
                <PaginationContainer>
                    <PaginationButton onClick={handlePrevPage} disabled={page === 1}>
                        이전
                    </PaginationButton>
                    <PaginationText>{page} / {totalPages}</PaginationText>
                    <PaginationButton onClick={handleNextPage} disabled={last}>
                        다음
                    </PaginationButton>
                </PaginationContainer>
                {selectedConference &&
                <ConferenceDetail conference={selectedConference} />}
            </CenterContainer>
        </MainContainer>
    )
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 130vh;
  align-items: center;
`;

const TopContainer = styled.div`
    height: 60vh;
    width: 100%;
`

const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 75vh;
    width: 100%;
    align-items: center;

`

const SearchContainer = styled.div`
    display: flex;
    height: 10vh;
    width: 80%;
    align-items: center;
`

const SearchLeftContainer = styled.div`
    display: flex;
    height: 100%;
    width: 30%;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-weight: 700;
`

const SearchRightContainer = styled.div`
    display: flex;
    height: 100%;
    width: 70%;
    justify-content: center;
    align-items: center;
`
const SearchInput = styled.input`
  width: 70%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  height: 65%;
`

const ConferenceListContainer = styled.div`
    display: flex;
    height: 55vh;
    width: 70%;
    justify-content: center;
    border: 0.5px solid gray;
    margin-top: 1rem;
    border-radius: 1rem;
`
const ConferenceContainer = styled.div`
    display: flex;
    width: 90%;
    flex-direction: column;
    justify-content: center;       
`

const ConferenceList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const ConferenceLineContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    justify-content: flex-start;  /* 모든 요소를 왼쪽 정렬 */
    padding: 10px;
    border-radius: 10px;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

const ConferenceName = styled.p`
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    margin-right: 20px; /* 이름과 역할 사이에 간격 */
`;

const WinnerTeam = styled.p`
    font-size: 16px;
    color: #666;
    margin: 0;
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
export default Conference;