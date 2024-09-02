import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WritingCommunity = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [checked, setChecked] = useState(false);
    const [teamOptions, setTeamOptions] = useState([]); // 팀 목록
    const [selectedTeam, setSelectedTeam] = useState(''); // 선택된 팀
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 팀 목록을 가져오는 useEffect
    useEffect(() => {
        axios.get("http://localhost:8080/api/team-member", {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            if (res.status === 204) {
                setTeamOptions([]); // 팀이 없을 경우 빈 배열
            } else {
                const teams = res.data.teamMemberDTOList
                    .filter(team => team.teamMemberName === JSON.parse(sessionStorage.getItem('userInfo')).name)
                    .map(team => team.teamName);
                setTeamOptions(teams);
                setSelectedTeam(teams[0] || ''); // 기본적으로 첫 번째 팀을 선택
            }
            setLoading(false); // 데이터 로드 완료
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    // 제출 버튼 클릭 처리 함수
    const submitButton = () => {
        console.log("Selected Team:", selectedTeam);
        axios.post(`http://localhost:8080/api/community`, {
            title: title,
            content: content,
            recruit: checked,
            teamName: selectedTeam
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            navigate("/community");
        }).catch((err) => {
            console.error(err);
        });
    };

    if (loading) {
        return <div>Loading...</div>; // 데이터 로딩 중 표시
    }

    return (
        <Container>
            <CenterContainer>
                <Title>
                    <TitleContainer>글 제목</TitleContainer>
                    <TitleWritingContainer 
                        type="text"
                        placeholder="제목을 입력하세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Title>
                <RadioContainer>
                    <RadioLabel>
                        <RadioInput 
                            type="radio" 
                            value={0} 
                            checked={checked === false}
                            onChange={() => setChecked(false)}
                        />
                        일반 글
                    </RadioLabel>
                    <RadioLabel>
                        <RadioInput 
                            type="radio" 
                            value={1} 
                            checked={checked === true}
                            onChange={() => setChecked(true)}
                        />
                        모집 글
                    </RadioLabel>
                </RadioContainer>
                <TeamSelectionContainer>
                    <TeamLabel>소속 팀 선택:</TeamLabel>
                    <TeamSelect 
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        {teamOptions.map((team, index) => (
                            <option key={index} value={team}>
                                {team}
                            </option>
                        ))}
                    </TeamSelect>
                </TeamSelectionContainer>
                <MainContainer>
                    <WriteContainer
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </MainContainer>
                <ButtonContainer>
                    <WriteButtionCont onClick={submitButton}>
                        글작성
                    </WriteButtionCont>
                </ButtonContainer>
            </CenterContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 800px;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const CenterContainer = styled.div`
    display: flex;
    height: 550px;
    flex-direction: column;
    width: 70%;
    align-items: center;
`;

const Title = styled.div`
    display: flex;
    flex-direction: row;
    height: 80px;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const TitleContainer = styled.div`
    display: flex;
    height: 80px;
    width: 20%;
    font-size: 36px;
    font-weight: 700;
    align-items: center;
`;

const TitleWritingContainer = styled.input`
    display: flex;
    height: 40px;
    width: 60%;
    border-radius: 5px;
    border: 1px solid;
    background-color: white;
    justify-content: center;
    align-items: center;
`;

const MainContainer = styled.div`
    display: flex;
    height: 400px;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const WriteContainer = styled.textarea`
    display: flex;
    width: 80%;
    background-color: white;
    border: 1px solid;
    border-radius: 10px;
    height: 360px;
    padding: 10px;
    resize: none; /* 사용자가 크기를 조절하지 못하도록 */
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 80%;
    height: 60px;
    justify-content: right;
`;

const WriteButtionCont = styled.button`
    font-size: 20px;
    height: 40px;
    border-radius: 10px;
    background-color: #4CAF50; /* 버튼 배경 색상 */
    color: white; /* 버튼 글자 색상 */
    border: none; /* 버튼 테두리 없음 */
    cursor: pointer; /* 마우스 포인터가 손가락으로 변경 */
    transition: background-color 0.3s; /* 색상 전환 효과 */
    &:hover {
        background-color: #45a049; /* 마우스 오버 시 색상 변화 */
    }
`;

const RadioContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
`;

const RadioLabel = styled.label`
    margin: 0 20px;
    font-size: 18px;
`;

const RadioInput = styled.input`
    margin-right: 10px;
`;

const TeamSelectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0;
`;

const TeamLabel = styled.label`
    font-size: 18px;
    margin-right: 10px;
`;

const TeamSelect = styled.select`
    font-size: 16px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

export default WritingCommunity;
