import React, { useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import { useState } from "react";
import Login from "../Sign/Login";
import axios from "axios";
import NotiImg from '../imgs/알림.png'
import { useNavigate } from "react-router-dom";

const Navigate = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const userName = userInfo ? userInfo.name : null;
  const [showNotifications, setShowNotifications] = useState(false); // 알림 드롭다운을 열고 닫는 상태
  const [notifications, setNotifications] = useState([]); // 초기 알림 데이터는 빈 배열
  const [applyModal, setApplyModal] = useState(false); // 팀 지원자 정보 모달
  const [selectedMember, setSelectedMember] = useState(null); // 지원자 정보

  const navigate = useNavigate();

  const handleLoginClick = () => {
    setLoginModal(true);
  }
  const handleCloseModal = () => {
    setLoginModal(false);
  }

  // 알림 드롭다운 토글
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // 지원자 정보 토글
  const toggleApplyModal = (member) => {
    setSelectedMember(member);
    setApplyModal(true);
  }

  const handleCloseApplyModal = () => {
    setApplyModal(false);
    setSelectedMember(null); // 모달 닫을 때 선택된 지원자 정보 초기화
  }

  // 로그아웃
  const onLogout = () => {
    axios
      .post("http://localhost:8080/logout", {}, { withCredentials: true })
      .then((response) => {
        alert("로그아웃에 성공했습니다.");
        localStorage.removeItem("Access_Token");
        sessionStorage.removeItem("userInfo");
        if (eventSource) {
          eventSource.close();
        }
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("로그아웃 실패", err);
        alert("로그아웃에 실패했습니다.");
      });
  };

    // 팀 매치 알림
    const matchnotification = () => {
      axios.get(`http://localhost:8080/api/match/notification`, {
        headers: {
            'Access_Token' : localStorage.getItem('Access_Token')
        }
      }).then((res) => {
        const matchNotificationDTOList = Array.isArray(res.data.matchNotificationDTOList) ? res.data.matchNotificationDTOList : [];
        setNotifications((prevNotifications) => {
          const combined = [...prevNotifications, ...matchNotificationDTOList];
          // 중복 제거 (notificationId 또는 matchNotificationId 기준)
          const uniqueNotifications = combined.filter(
            (notification, index, self) =>
              index === self.findIndex((n) => n.matchNotificationId === notification.matchNotificationId)
          );
          return uniqueNotifications;
        });
        console.log("매치 신청 알림", matchNotificationDTOList);
      }).catch((err) => {
        console.log(err);
      });
    }

  // 팀원 초대 알림
  const invitenotification = () => {
    axios.get(`http://localhost:8080/api/team-invite`, {
      headers: {
        'Access_Token' : localStorage.getItem('Access_Token')
      }
    }).then((res) => {
      console.log("API응답: ", res.data);
      const teamInviteInfoDTOList = Array.isArray(res.data.teamInviteInfoDTOList) ? res.data.teamInviteInfoDTOList : [];
      console.log("배열", teamInviteInfoDTOList)
      setNotifications((prevNotifications) => {
        const combined = [...prevNotifications, ...teamInviteInfoDTOList];
          // 중복 제거 (notificationId 또는 matchNotificationId 기준)
          const uniqueNotifications = combined.filter(
            (notification, index, self) =>
              index === self.findIndex((n) => n.inviteId === notification.inviteId)
          );
          return uniqueNotifications;
      })
      console.log("팀원 초대 알림", teamInviteInfoDTOList);
    }).catch((err) => {
      console.log(err);
    })
  }

    // 팀 가입 알림
    const getnotification = () => {
      axios.get(`http://localhost:8080/api/team-join`, {
        headers: {
          'Access_Token': localStorage.getItem('Access_Token')
        }
      })
      .then((res) => {
        const joinNotifications = Array.isArray(res.data.joinNotifications) ? res.data.joinNotifications : [];
        setNotifications((prevNotifications) => {
          const combined = [...prevNotifications, ...joinNotifications];
          // 중복 제거 (notificationId 또는 matchNotificationId 기준)
          const uniqueNotifications = combined.filter(
            (notification, index, self) =>
              index === self.findIndex((n) => n.notificationId === notification.notificationId)
          );
          return uniqueNotifications;
      });
        console.log("팀가입알림 ", res.data.joinNotifications);
      }).catch((err) => {
        console.log(err);
      })
    };

    useEffect(() => {
      getnotification();
      matchnotification();
      invitenotification();
    },[]);

    
    // 멤버요청수락
    const handleAccept = (isJoin) => {
      axios.delete(`http://localhost:8080/api/team-join`, {
        data: {
          joinNotificationId: selectedMember.notificationId,
          isJoin: isJoin
        },
          headers: {
            'Access_Token': localStorage.getItem('Access_Token')
        }
      }).then((res) => {
        if(isJoin) {
          alert("지원자의 요청이 수락되었습니다.");
        }
      else {
          alert("지원자의 요청을 거절하였습니다.");
        }
        console.log()
        handleCloseApplyModal();
        getnotification(); 
      }).catch((err) => {
        if(isJoin) {
          alert("수락을 실패하였습니다.")
        } else {
          alert("거절을 실패하였습니다.")
        }
      })
    }

  // 매치 승인여부
  const handleMatch = (status) => {
    const matchNotificationId = selectedMember.matchNotificationId;
    console.log(matchNotificationId)
    axios.delete(`http://localhost:8080/api/match/notification`, {
      data: {
        matchNotificationId: matchNotificationId,
        status: status
      }, 
        headers: {
          'Access_Token': localStorage.getItem('Access_Token')
        }
    }).then((res) => {
        if(status) {
          alert("매치를 수락하였습니다.")
          navigate("/");
        } else {
          alert("매치를 거절하였습니다.");
        }
    }).catch((err) => {
         if(status) {
          alert("매치 승인을 실패하였습니다.")
         } else {
          alert("매치 거절을 실패하였습니다.");
         }
    })
  }

  // 팀원 초대 승인여부
  const handleInvite = (isJoin) => {
    const inviteId = selectedMember.inviteId;
    console.log(inviteId)
    axios.delete(`http://localhost:8080/api/team-invite`, {
      data: {
        inviteId: inviteId,
        isJoin: isJoin
      },
      headers: {
        'Access_Token': localStorage.getItem('Access_Token')
      }
    }).then((res) => {
      if(isJoin) {
        alert("팀 초대를 수락하였습니다.");
        navigate("/");
      } else {
        alert("팀 초대를 거절하였습니다.");
      }
    }).catch((err) => {
      console.log(err);
      if(isJoin) {
        alert("팀 초대 수락을 실패하였습니다.");
      } else {
        alert("팀 초대 거절을 실패하였습니다.");
      }
    })
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">⚽️ Just Start</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/match">Match</Nav.Link>
              <Nav.Link href="/community">Community</Nav.Link>
              <Nav.Link href="/conference">Conference</Nav.Link>              
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="/mypage">내정보</NavDropdown.Item>
                <NavDropdown.Item href="/teampage">팀정보</NavDropdown.Item>
                <NavDropdown.Item href="/player">선수정보</NavDropdown.Item>
                <NavDropdown.Item href="/matchresult">매치 결과</NavDropdown.Item>
                {userInfo && (
                  <NavDropdown.Item onClick={onLogout}>로그아웃</NavDropdown.Item>
                )}
              </NavDropdown>
              {userInfo && (
                <div style={{ position: 'relative' }}>
                  <NotiIcon onClick={toggleNotifications}>
                    <img src={NotiImg} alt="알림" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                  </NotiIcon>
                  {showNotifications && (
                    <NotiDropdown>
                  {notifications && notifications.length > 0 ? (
                    notifications.map((noti, index) => (
                      <NotiItem key={noti.notificationId || noti.matchNotificationId || noti.inviteId} onClick={() => toggleApplyModal(noti)}>
                      {noti.inviteId 
                        ? `${noti.teamName}팀에서 초대가 왔습니다.` // 초대 알림 처리
                        : noti.matchNotificationId 
                          ? `${noti.content}` // 매치 신청 알림 처리
                          : noti.notificationId // 팀 가입 알림 처리
                            ? `${noti.memberName}님이 ${noti.teamName}에 지원하였습니다.` 
                            : '알 수 없는 알림입니다.' // 예외 처리
                      }
                      </NotiItem>
                    ))
                  ) : (
                    <NotiItem>알림이 없습니다.</NotiItem>
                  )}      
                    </NotiDropdown>
                  )}
                </div>
              )}
              <Name>{userName ? (`${userName}님 환영합니다.`) : (<LoginButton onClick={handleLoginClick}>로그인</LoginButton>)}</Name>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={loginModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>
      <Modal show={applyModal} onHide={handleCloseApplyModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>지원자 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedMember ? (
  <>
    {/* 매치 신청 정보 */}
    {selectedMember.matchNotificationId && (
      <>
        <p><strong>매치 신청 팀:</strong> {selectedMember.teamName}</p>
        <p><strong>신청 날짜:</strong> {new Date(selectedMember.date).toLocaleDateString()}</p>
        <ButtonWrapper>
          <ActionButton onClick={() => handleMatch(true)}>수락</ActionButton>
          <ActionButton onClick={() => handleMatch(false)}>거절</ActionButton>
        </ButtonWrapper>
      </>
    )}
    
    {/* 지원자 정보 */}
    {selectedMember.notificationId && (
      <>
        <p><strong>지원자:</strong> {selectedMember.memberName}</p>
        <p><strong>지원자 아이디:</strong> {selectedMember.memberId}</p>
        <p><strong>지원 팀:</strong> {selectedMember.teamName}</p>
        <p><strong>지원 날짜:</strong> {new Date(selectedMember.date).toLocaleDateString()}</p>
        <ButtonWrapper>
          <ActionButton onClick={() => handleAccept(true)}>수락</ActionButton>
          <ActionButton onClick={() => handleAccept(false)}>거절</ActionButton>
        </ButtonWrapper>
      </>
    )}
    
    {/* 초대 수락/거절 버튼 */}
    {selectedMember.inviteId && (
      <>
      <p><strong>초대 팀:</strong> {selectedMember.teamName}</p>
      <ButtonWrapper>
        <ActionButton onClick={() => handleInvite(true)}>초대 수락</ActionButton>
        <ActionButton onClick={() => handleInvite(false)}>초대 거절</ActionButton>
      </ButtonWrapper>
      </>
    )}
  </>
) : (
  <p>지원자 정보를 불러오지 못했습니다.</p>
)}

</Modal.Body>
      </Modal>
    </>
  );
}

// 스타일링
const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 900px;
`;

const LoginButton = styled.button`
  background-color: transparent;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
`;

const NotiIcon = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const NotiDropdown = styled.div`
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  max-height: 150px; /* 최대 높이를 설정 */
  overflow-y: auto;  /* 스크롤 가능하도록 설정 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NotiItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f9f9f9;
  }
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:nth-child(2) {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

export default Navigate;
