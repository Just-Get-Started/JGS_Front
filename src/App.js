import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigate from './Components/Navigate';
import MainPage from './Pages/MainPage';
import Community from './Pages/Community';
import CommunityDetail from './Components/CommunityDetail';
import MyPage from './Pages/MyPage';
import TeamInformation from './Pages/TeamInformation';
import TeamDetail from './Components/TeamDetail';
import WritingCommunity from './Pages/WritingCommunity';
import Player from './Pages/Player';
import Conference from './Pages/Conference';
import Match from './Pages/Match';
import MatchRegisterPage from './Pages/MatchRegisterPage';
import { useEffect } from 'react';
import { EventSourcePolyfill } from "event-source-polyfill";
import MatchDetail from './Components/MatchDetail';

function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("Access_Token");

    // EventSource 객체 생성
    const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/sse/subscribe`, {
      headers: {
        Access_Token: accessToken
      }
    });

    // 연결 성공 이벤트
    eventSource.addEventListener('connection-success', (event) => {
      console.log('SSE 연결 성공:', event.data);
    });

    // 알림 이벤트
    eventSource.addEventListener('notification', (event) => {
      console.log('새로운 알림이 도착했습니다:', event.data);
      // 알림을 처리하는 로직 추가
    });

    // 새로운 채팅방 이벤트
    eventSource.addEventListener('newChatRoom', (event) => {
      console.log('새로운 채팅방이 추가되었습니다:', event.data);
      // 필요에 따라 채팅방으로 이동하거나 처리하는 로직 추가
    });

    // 새로운 채팅 메시지 이벤트
    eventSource.addEventListener('newChat', (event) => {
      console.log('새로운 메시지가 도착했습니다:', event.data);
      // 메시지 처리 로직 추가
    });
    eventSource.addEventListener('error', (event) => {
      console.error('SSE 연결 오류:', event);
    });

    // 컴포넌트 언마운트 시 이벤트 소스 종료
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Navigate/>
      <Routes>
        <Route path="/" element={<MainPage/>}></Route>
        <Route path="/community" element={<Community/>}></Route>
        <Route path="/community/:communityId" element={<CommunityDetail/>}></Route>
        <Route path="/match" element={<Match/>}></Route>
        <Route path="/matchregister" element={<MatchRegisterPage/>}></Route>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/teampage" element={<TeamInformation/>}></Route>
        <Route path="/team/:teamName" element={<TeamDetail/>} />
        <Route path="/writingcommunity" element={<WritingCommunity/>}></Route>
        <Route path="/player" element={<Player/>}></Route>
        <Route path="/conference" element={<Conference/>}></Route>
        <Route path="/matchdetail/:matchPostId" element={<MatchDetail/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
