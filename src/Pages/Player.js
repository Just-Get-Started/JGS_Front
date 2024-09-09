import React from "react";
import {useState, useEffect} from 'react';
import axios from "axios";
import styled from "styled-components";
import PlayerImage from '../imgs/선수정보.png';

const Player = () => {

    const [keyword, setKeyWord] = useState('');
    const [playerInfoList, setPlayerInfoList] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);     //선수 클릭 정보

    useEffect(()=> {
        axios.get(`http://localhost:8080/member`, {
            params: {
                page: 0,
                keyword: keyword
            }
        }).then((res) => {
            console.log(res.data);
            setPlayerInfoList(res.data.memberDTOList);
        }).catch((err) => {
            console.log(err);
        })
    }, [keyword]);

    const handlePlayerClick = (player) => {
        setSelectedPlayer(player);
        setIsOpenModal(true);
    }

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedPlayer(null);
    }

    return (
        <MainContainer>
            <TopContainer>
                <img className="PlayerImage" alt="Player" src={PlayerImage} style={{width: '100%', height: '60vh'}}/>
            </TopContainer>
            <CenterContainer>
                <SearchContainer>
                    <SearchLeftContainer>선수 검색</SearchLeftContainer>
                    <SearchRightContainer>
                        <SearchInput 
                        type="text"
                        placeholder="선수 이름이나 이메일을 검색하세요"
                        value={keyword}
                        onChange={(e) => setKeyWord(e.target.value)}/>
                    </SearchRightContainer>
                </SearchContainer>
                <PlayerListContainer>
                    <PlayerContainer>
                        <PlayerList>
                            {playerInfoList.length > 0 ? (
                                playerInfoList.map((player, index) => (
                                    <PlayerLineContainer key ={player.memberId + index} onClick={() => handlePlayerClick(player)}>
                                        <PlayerEmage>
                                            <img
                                            src={player.profileImage}
                                            alt="user Profile"
                                            style={{width:'45px', height:'45px', borderRadius:'50%'}}
                                            />
                                        </PlayerEmage>
                                        <PlayerName>선수명: {player.name}</PlayerName>
                                        <PlayerRole>역할: {player.role}</PlayerRole>
                                    </PlayerLineContainer>
                                ))
                            ) : (
                                <p>선수가 없습니다.</p>
                            )}
                        </PlayerList>
                    </PlayerContainer>
                </PlayerListContainer>
            </CenterContainer>
            {isOpenModal && selectedPlayer && (
                <Modal>
                    <ModalContent>
                        <h2><strong>이름: </strong>{selectedPlayer.name}</h2>
                        <p><strong>이메일: </strong> {selectedPlayer.email}</p>
                        <p><strong>역할: </strong> {selectedPlayer.role}</p>
                        <p><strong>소개:</strong> {selectedPlayer.introduce || "아직 소개 정보가 없습니다."}</p>
                        <button onClick={closeModal}>닫기</button>
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
    height: 130vh;
    align-items: center;
    justify-content: center;
`

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
const PlayerListContainer = styled.div`
    display: flex;
    height: 55vh;
    width: 70%;
    justify-content: center;
    border: 0.5px solid gray;
    margin-top: 1rem;
    border-radius: 1rem;
`

const PlayerContainer = styled.div`
    display: flex;
    width: 90%;
    flex-direction: column;
    justify-content: center;       
`

const PlayerLineContainer = styled.div`
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

const PlayerEmage = styled.div`
    margin-right: 20px;  /* 사진과 이름 사이에 간격 */
    display: flex;
`;

const PlayerName = styled.p`
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    margin-right: 20px; /* 이름과 역할 사이에 간격 */
`;

const PlayerRole = styled.p`
    font-size: 16px;
    color: #666;
    margin: 0;
`;

const PlayerList = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
`;
export default Player;