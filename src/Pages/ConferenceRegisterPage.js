import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const ConferenceRegisterPage = () => {
    const [conferenceName, setConferenceName] = useState('');
    const [content, setContent] = useState('');
    const [conferenceDate, setConferenceDate] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState('');
    
    const handlePostConference = () => {
        if (!conferenceName) {
            alert("대회명을 입력해주세요.");
            return; // 유효하지 않으면 요청을 보내지 않음
        }
        
        // 날짜 형식 검사 (xxxx.yy.mm 형식)
        const dateRegex = /^\d{4}\.\d{2}\.\d{2}$/;
        if (!dateRegex.test(conferenceDate)) {
            alert("날짜 형식이 올바르지 않습니다. (예: 2024.09.08)");
            return; // 유효하지 않으면 요청을 보내지 않음
        }
        
        // 입력된 날짜 문자열을 Date 객체로 변환
        const formattedDate = new Date(conferenceDate.split('.').join('-'));
        
        axios.post(`http://localhost:8080/api/conference`, {
            conferenceName: conferenceName,
            conferenceDate: formattedDate,
            content: content
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            console.log(res.data);
            if(conferenceName == null) {
                alert("ㅇㄹㄴ");
            }
            navigate("/conference")
        }).catch((err) => {
            if (err.response && err.response.data.errorMessage) {
                setErrors(err.response.data.errorMessage);  // 에러 메시지 저장
                alert(errors);
            } else {
                console.log(err);
            }
        });
    };

    return (
        <MainContainer>
            <CenterContainer>
                <NameContainer>
                    <NameLeft>대회명</NameLeft>
                    <NameRight>
                        <NameInput
                            type="text"
                            placeholder="대회 명을 입력하세요"
                            value={conferenceName}
                            onChange={(e) => setConferenceName(e.target.value)}
                        />
                    </NameRight>
                </NameContainer>
                <DateContainer>
                    <DateLeft>대회 날짜</DateLeft>
                    <DateRight>
                        <DateInput
                            type="text"
                            placeholder="xxxx.yy.mm 형식으로 입력하세요"
                            value={conferenceDate}
                            onChange={(e) => setConferenceDate(e.target.value)}
                        />
                    </DateRight>
                </DateContainer>
                <ContentContainer>
                    <ContentLeft>대회 내용</ContentLeft>
                    <ContentRight>
                        <ContentInput
                            type="text"
                            placeholder="대회 내용을 입력하세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </ContentRight>
                </ContentContainer>
                <SubmitButton onClick={handlePostConference}>대회 등록</SubmitButton>
            </CenterContainer>
            
        </MainContainer>
    );
};

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  align-items: center;
  justify-content: center;
  flex-diretion: column;
`;

const CenterContainer = styled.div`
  display: flex;
  width: 60%;
  height: 40vh;
  flex-direction: column;
  border: 1px solid;
  border-radius: 1rem;
`;

const NameContainer = styled.div`
  display: flex;
  height: 10vh;
  width: 100%;
  border-bottom: 1px solid;
`;

const NameLeft = styled.div`
  display: flex;
  width: 30%;
  font-size: 28px;
  align-items: center;
  justify-content: center;
  border-right: 1px solid;
`;

const NameRight = styled.div`
  display: flex;
  width: 70%;
  align-items: center;
  justify-content: center;
`;

const NameInput = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  height: 65%;
`;

const DateContainer = styled.div`
  display: flex;
  height: 10vh;
  width: 100%;
  border-bottom: 1px solid;
`;

const DateLeft = styled.div`
  display: flex;
  width: 30%;
  font-size: 28px;
  align-items: center;
  justify-content: center;
  border-right: 1px solid;
`;

const DateRight = styled.div`
  display: flex;
  width: 70%;
  align-items: center;
  justify-content: center;
`;

const DateInput = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  height: 65%;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 20vh;
  width: 100%;
  border-bottom: 1px solid;
`;

const ContentLeft = styled.div`
  display: flex;
  width: 30%;
  font-size: 28px;
  align-items: center;
  justify-content: center;
  border-right: 1px solid;
`;

const ContentRight = styled.div`
  display: flex;
  width: 70%;
  align-items: center;
  justify-content: center;
`;

const ContentInput = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  height: 65%;
`;

const SubmitButton = styled.button`
height: 40px;
display: flex;
justify-content: center;
align-items: center;
  width: 15%;
  padding: 1rem;
  background-color: skyblue;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem auto;
`;

export default ConferenceRegisterPage;
