import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Markerdata } from "../Components/MarkerData";

const {kakao} = window;

const MatchRegisterPage = () => {
    useEffect(() => {
        mapscript();
    }, []);

    const mapscript = () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.624915253753194, 127.15122688059974),
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
        });
    };

    const handleRegisterClick = () => {
        axios.post(`http://localhost:8080/api/match-post`, {
            data: {
                teamName: 'ㄴㅇ'
            }
        });
    };

    return (
        <div>
            <div id="map" style={{
                width: '1200px',
                height: '600px'
            }}></div>
        </div>
    );
};

export default MatchRegisterPage;
