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

const Navigate = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const userName = userInfo ? userInfo.name : null;
  const [showNotifications, setShowNotifications] = useState(false); // 알림 드롭다운을 열고 닫는 상태
  const [notifications, setNotifications] = useState([]); // 초기 알림 데이터는 빈 배열

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

  const getnotification = () => {
    axios.get(`http://localhost:8080/api/team-join`, {
      headers: {
        'Access_Token': localStorage.getItem('Access_Token')
      }
    })
    .then((res) => {
      setNotifications(res.data.joinNotifications);
      console.log(res.data)
    }).catch((err) => {
      console.log(err);
    })
  };

  useEffect(() => {
    getnotification();
  },[]);

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
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="/mypage">내정보</NavDropdown.Item>
                <NavDropdown.Item href="/teampage">팀정보</NavDropdown.Item>
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
                          <NotiItem key={noti.notificationId}>
                            {noti.memberName}님이 {noti.teamName}에 지원하였습니다.
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
`;

export default Navigate;
