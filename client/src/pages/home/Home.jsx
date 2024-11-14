import React, { useEffect, useState, lazy, Suspense } from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import CatCard from "../../components/catCard/CatCard";
import newRequest from "../../utils/newRequest";
import GigCard from "../../components/gigCard/GigCard";


  
const Slide = lazy(() => import('../../components/slide/Slide'));
    


function Home() {

  const [gigs, setGigs] = useState([])
  const [gigLoaded, setGigLoaded] = useState(false)

  useEffect(() => {

    const fetchData = async() => {
      try{
        const res = await newRequest.get("/gigs/homePage")
        setGigs(res.data)
  
      }
      catch(e){
        console.log(err)
      }
    }

    fetchData();
  }, [])


  return (
    <div className="home">
      <Featured />
      {gigs.length > 0 ? (
        <Slide slidesToShow={3} arrowsScroll={1}>
          {gigs.map((gig) => (
            <GigCard item={gig} />
          ))}
        </Slide>
      ):  <p>Loading data...</p>
      }
     
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Quality work done quickly
            </div>
            <p>
              Find the right freelancer to begin working on your project within
              minutes.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Protected payments, every time
            </div>
            <p>
              Always know what you'll pay upfront. Your payment isn't released
              until you approve the work.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              24/7 support
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
          </div>
          
          <div className="item">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/10FCGiIIa_U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
