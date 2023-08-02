import '../App.css';
import React from "react";
import TopNavbar from './TopNavbar';
import Footer from './Footer';

function Home() {
  
  const backgroundStyle = {
    backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh"
  };

  return (
    <div style = {backgroundStyle}>
      <TopNavbar />
        <div style={{textAlign: "center",marginTop: "40vh"}}>
        <h1 style = {{color: "white"}}>ALLENARSI, DIVERTIRSI, VINCERE</h1>
          <button className='btn btn-warning'>Get Started</button>
        </div>
        <Footer/>
    </div>
  );
}

export default Home;
