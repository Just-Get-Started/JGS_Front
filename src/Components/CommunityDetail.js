import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CommunityDetail = () => {
    const { communityId } = useParams();
    const [communityDetail, setCommunityDetail] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [recruit, setRecruit] = useState(false); // 초기값 false로 설정
    const [recruitDate, setRecruitDate] = useState(null);
    const navigate = useNavigate();

    // 공지사항 상세 정보
    useEffect(() => {
        axios.get(`http://localhost:8080/community`, {
            params: { communityId }
        }).then((res) => {
            console.log(res.data);
            setCommunityDetail(res.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [communityId]);

    // 로딩창
    if (!communityDetail) {
        return <div>Loading...</div>;
    }

    // 수정 버튼
    const modifyButton = () => {
        setTitle(communityDetail.title);  // 기존 제목 설정
        setContent(communityDetail.content);  // 기존 내용 설정
        setRecruit(communityDetail.recruit);  // recruit 값 설정
        setRecruitDate(communityDetail.recruitDate ? new Date(communityDetail.recruitDate) : null); // 기존 모집 날짜 설정
        setIsOpenModal(true);
    };

    // 글 목록으로 돌아가기
    const communityList = () => {
        navigate("/community");
    };

    // 수정사항 저장버튼
    const saveChanges = () => {
        axios.put(`http://localhost:8080/api/community`, {
            communityId: communityId,
            title: title,
            content: content,
            recruit: recruit,  
            recruitDate: recruitDate ? recruitDate.toISOString() : null,
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            setIsOpenModal(false);
            setCommunityDetail((prevDetail) => ({
                ...prevDetail,
                title: title,
                content: content,
                recruit: recruit,
                recruitDate: recruitDate ? recruitDate.toISOString() : null,
            }));
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    };

    // 삭제 버튼
    const deleteButton = () => {
        axios.delete(`http://localhost:8080/api/community`, {
            params: {
                communityId: communityId
            },
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            alert("성공적으로 삭제되었습니다.");
            navigate("/community");
        }).catch((err) => {
            alert("삭제에 실패하였습니다.");
        })
    };

    //가입버튼
    const joinButton = () => {
      axios.post(`http://localhost:8080/api/team-join?communityId=${communityId}`, 
        {}, // 빈 본문
        {
          headers: {
            'Access_Token': localStorage.getItem('Access_Token')
          }
        }
      ).then((res) => {
          alert("가입 신청이 성공적으로 처리되었습니다.");
        }
      ).catch((err) => {
        alert("본인 팀에 가입할 수 없습니다.");
      });
    }

    
    return (
        <Container>
            <Title>{communityDetail.title}</Title>
            <TeamName>팀 이름: {communityDetail.teamName}</TeamName>
            <Content>{communityDetail.content}</Content>
            <WriteDate>
                작성일: {new Date(communityDetail.writeDate).toLocaleDateString()}
            </WriteDate>
            <ModifyButton onClick={modifyButton}>수정</ModifyButton>
            {isOpenModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>제목 수정</h3>
                        <TitleInput
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 수정하세요"
                        />
                        <ContentInput
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 수정하세요"
                        />
                        {recruit && (
                            <DatePickerContainer>
                                <label>마감 날짜:</label>
                                <DatePicker
                                    selected={recruitDate}
                                    onChange={(date) => setRecruitDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="마감 날짜를 선택하세요"
                                    isClearable
                                />
                            </DatePickerContainer>
                        )}
                        <ButtonContainer>
                            <SaveButton onClick={saveChanges}>저장</SaveButton>
                            <CancelButton onClick={() => setIsOpenModal(false)}>취소</CancelButton>
                        </ButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
            <CommunityList onClick={communityList}>목록</CommunityList>
            <DeleteButton onClick={deleteButton}>삭제</DeleteButton>
            <JoinButton onClick={joinButton}>가입</JoinButton>
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
    
    const ModifyButton = styled.button`
      /* 스타일 추가 */
    `;
    
    const ButtonContainer = styled.div`
      display: flex;
      justify-content: space-between;
    `;
    
    const SaveButton = styled.button`
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    
      &:hover {
        background-color: #0056b3;
      }
    `;
    
    const CancelButton = styled.button`
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    
      &:hover {
        background-color: #c82333;
      }
    `;
    
    const TitleInput = styled.input`
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border-radius: 4px;
      border: 1px solid #ccc;
    `;
    
    const ContentInput = styled.input`
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border-radius: 4px;
      border: 1px solid #ccc;
    `;
    
    const DatePickerContainer = styled.div`
      margin-top: 15px;
    
      label {
        font-size: 16px;
        margin-right: 10px;
      }
    `;
    
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
      width: 400px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;
    
    const CommunityList = styled.button`
      /* 스타일 추가 */
    `;
    
    const DeleteButton = styled.button`
      /* 스타일 추가 */
    `;

    const JoinButton = styled.button`
    `
    
    export default CommunityDetail;