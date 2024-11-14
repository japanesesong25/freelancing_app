import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>Freelancer</h2>
            
          </div>
          <div className="right">
            <div className="social">
              <a href = "https://x.com/"><img src="/img/twitter.png" alt="" /></a>
              <a href = "https://www.facebook.com/"><img src="/img/facebook.png" alt="" /></a>
              <a href = "https://www.linkedin.com/"><img src="/img/linkedin.png" alt="" /></a> 
              <a href = "https://www.pinterest.com/"><img src="/img/pinterest.png" alt="" /></a>
              <a href = "https://www.instagram.com/"><img src="/img/instagram.png" alt="" /></a>
            </div>
     
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
