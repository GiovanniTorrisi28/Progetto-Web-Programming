import '../App.css';
import React from "react";
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import { Container, Row, Col } from 'react-bootstrap';
import photo from "../img/piscina.jpg";

function About() {

  const gradientStyle = {
    background: `-webkit-linear-gradient(rgba(135, 60, 255, 1), rgba(135, 60, 255, 0.0) 0%), 
                  -webkit-linear-gradient(-45deg, rgba(120, 155, 255, 0.9) 56%, rgba(55, 230, 235, 0.7) 0%)`,
    borderRadius: "15px"
  };

  const backgroundStyle = {
    backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh"
  };

  return (
    <div style={backgroundStyle} >
      <TopNavbar />
      <Container className="mt-5 about-page-content">
      <Row>
        <Col>
          <h1>About Us</h1>
          <img src = {photo} alt = "" width = "300px" style={{float: "right"}}></img>
          <p>
            Welcome to our website! We are a dedicated team of individuals
            passionate about delivering high-quality solutions to our clients.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non
            metus ut dui fringilla laoreet. Vivamus ut maximus lectus.
          </p>
          <p>
            Our mission is to provide innovative and reliable products that
            meet our clients' needs. We pride ourselves on our attention to
            detail and commitment to excellence. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nullam non metus ut dui fringilla
            laoreet. Vivamus ut maximus lectus.
          </p>
          <p>
            Feel free to explore our website and learn more about our services.
            If you have any questions or inquiries, please don't hesitate to
            contact us. We look forward to serving you!
          </p>
        </Col>
      </Row>
    </Container>
      <Footer />
    </div>
  );
}

export default About;
