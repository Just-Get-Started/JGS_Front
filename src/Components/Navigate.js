import React from "react";
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

const Navigate = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const userName = userInfo ? userInfo.name : null;
  const handleLoginClick = () => {
    setLoginModal(true);
  }
  const handleCloseModal = () => {
    setLoginModal(false);
  }

  //로그아웃
  const onLogout = () => {
    axios
      .post("http://localhost:8080/logout", {}, { withCredentials: true })
      .then((response) => {
        alert("로그아웃에 성공했습니다.");
        localStorage.removeItem("Access_Token");
        sessionStorage.removeItem("userInfo")
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
      <Login/>
    </Modal.Body>
  </Modal>
  </>
  );
}

const Name = styled.div`
display: flex;
align-items: center;
justify-content: right;
width: 900px;
`

const LoginButton = styled.button`
  background-color: transparent;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
`

export default Navigate;