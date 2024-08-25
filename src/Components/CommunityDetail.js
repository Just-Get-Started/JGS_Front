import React from "react";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CommunityDetail = () => {

    const {communityId} = useParams();
    const [communityDetail, setCommunityDetail] = useState(null);

    //팀 상세 정보
    useEffect(()=> {
        axios.get(`http://localhost:8080/community`, {
            params: {communityId}
        }).then((res) => {
            console.log(res.data);
            setCommunityDetail(res.data);
        }).catch((err) => {
            console.log(err)
        })
    },[communityId]);

    return (
        <>
        </>
    )
}

export default CommunityDetail;