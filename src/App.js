import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigate from './Components/Navigate';
import MainPage from './Pages/MainPage';
import Community from './Pages/Community';
import CommunityDetail from './Components/CommunityDetail';
import Match from './Pages/Match';
import MyPage from './Pages/MyPage';
import TeamInformation from './Pages/TeamInformation';
import TeamDetail from './Components/TeamDetail';
import WritingCommunity from './Pages/WritingCommunity';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navigate/>
      <Routes>
        <Route path="/" element={<MainPage/>}></Route>
        <Route path="/community" element={<Community/>}></Route>
        <Route path="/community/:communityId" element={<CommunityDetail/>}></Route>
        <Route path="/match" element={<Match/>}></Route>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/teampage" element={<TeamInformation/>}></Route>
        <Route path="/team/:teamName" element={<TeamDetail/>} />
        <Route path="/writingcommunity" element={<WritingCommunity/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
