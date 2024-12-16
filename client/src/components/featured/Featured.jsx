import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import newRequest from "../../utils/newRequest";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("currentUser"))?._id;


  const handleSubmit = async () => {
   await newRequest.post(`/gigs/saveHistory`, {
      keyword: input,
      userId: userId
    })
    navigate(`/gigs?search=${input}`);
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
              className="search-input"
                type="text"
                placeholder='Try "building mobile app"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
    
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
