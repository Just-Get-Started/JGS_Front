import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigate from './Components/Navigate';
import MainPage from './Pages/MainPage';
import Community from './Pages/Community';
import Match from './Pages/Match';
import MyPage from './Pages/MyPage';
import TeamInformation from './Pages/TeamInformation';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navigate/>
      <Routes>
        <Route path="/" element={<MainPage/>}></Route>
        <Route path="/community" element={<Community/>}></Route>
        <Route path="/match" element={<Match/>}></Route>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/teampage" element={<TeamInformation/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
