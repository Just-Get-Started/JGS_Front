import React from "react";
import axios from "axios";
import { useEffect,useState } from "react";
import { Markerdata } from "../Components/MarkerData";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Navigate, useNavigate } from "react-router-dom";

const {kakao} = window;

const MatchRegisterPage = () => {
    const [myTeams, setMyTeams] = useState([]); // 소속팀
    const [matchDate, setMatchDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');   // 선택한 팀
    const [matchTime, setMatchTime] = useState("12:00:00");
    const navigate = useNavigate();

    useEffect(() => {
        mapscript();
    }, []);

    const mapscript = () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(36.795756853807326, 127.12316356363061),
            level: 5,
        };

        // 지도 생성
        const map = new kakao.maps.Map(container, options);

        Markerdata.forEach((el) => {
            const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 원하는 이미지 URL로 변경
            const imageSize = new kakao.maps.Size(24, 35); // 이미지 크기

            // 마커 이미지 객체 생성
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            // 마커 생성
            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(el.lat, el.lng),
                title: el.title,
                image: markerImage, // 커스텀 마커 이미지 적용
            });

            // 정보 창 생성
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${el.title}</div>`,
                removable: true
            });

            // 마커 클릭 시 정보 창 표시
            kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
            });
                  // 정보 창을 자동으로 마커 위에 표시
            infowindow.open(map, marker);
        });
    };

    //내 소속팀 불러오기
    useEffect(() => {
        axios.get("http://localhost:8080/api/team-member", {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token') // 헤더에 Access_Token 추가
            }
        })
        .then((res) => {
            if (res.status === 204) {
                setMyTeams([]);
            } else {
                // 팀 정보가 있는 경우
                if (res.data.teamMemberDTOList) {
                    setMyTeams(res.data.teamMemberDTOList);
                } else {
                    // 팀 정보가 없거나 잘못된 경우
                    setMyTeams([]);
                }
            }
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
            setMyTeams([]);
        });
    }, []);

    // 매치 등록 버튼
    const handleRegisterClick = () => {
        const matchDateTime = `${matchDate.toISOString().split('T')[0]}T${matchTime}`;
        console.log({matchDate: matchDateTime, teamname: selectedTeam, location: location});
        axios.post(`http://localhost:8080/api/match-post`, {
                teamName: selectedTeam,
                matchDate: matchDateTime,
                location: location
        }, {
            headers: {
                'Access_Token': localStorage.getItem('Access_Token')
            }
        }).then((res) => {
            if(res.status === 201) {
                alert("매치 등록 성공");
                navigate("/match");
            } else {
                console.log(res);
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    return (
        <MainContainer>
            <CalenderContainer>
                <label>매치 날짜</label>
                <StyledCalendar
                    onChange={setMatchDate}
                    value={matchDate}
                />
            </CalenderContainer>
            <TimeContainer>
                <label>경기 시간</label>
                <TimeInput
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                />
            </TimeContainer>
            <MapContainer>
            <div id="map" style={{
                width: '800px',
                height: '400px'
            }}></div>
            </MapContainer> 
            <MiddleContainer>
                <label>팀명 </label>
                  <SelectTeam onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value ="">팀을 선택하세요</option>
                    {myTeams.map((team) => (
                        <option key={team.teamMemberId} value={team.teamName}>
                        {team.teamName}
                        </option>
                    ))}
                    </SelectTeam> 
                    <label>구장 위치</label>
                  <LocationInput
                  type='text'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}/>
            </MiddleContainer>
            <ButtonContainer>
            <StyledButton onClick={handleRegisterClick}>매치 등록</StyledButton>
            </ButtonContainer>
        </MainContainer>
    );
};

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 700px;
  font-size: 1.5rem;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 115vh;
  align-items: center;
`
const MapContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 50vh;
    width: 80%;
    margin-top: 3rem;
`

const SelectTeam = styled.select`
    margin-bottom: 20px;
    padding: 10px;
    font-size: 1.2rem;
`;

const LocationInput = styled.input`
    margin-bottom: 20px;
    padding: 10px;
    font-size: 1.2rem;
`;
const CalenderContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
`;

const MiddleContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 80%;
    margin-top: 2rem;
    font-size: 30px;
`

const TimeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
`;

const TimeInput = styled.input`
  margin-top: 10px;
  padding: 10px;
  font-size: 1.2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049; /* Darker Green on hover */
  }

  &:active {
    background-color: #3e8e41; /* Even darker green on click */
    transform: translateY(2px); /* Small click effect */
  }
`;
export default MatchRegisterPage;
