import '../App.css';
import React from "react";
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import { Container,Row,Col } from 'react-bootstrap';
import logo from "../img/dolphin.png";

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
    <TopNavbar/>
    <Container  style = {gradientStyle} className = "mt-4">
      <Row >
          <Col xs = {12} md = {6}>
                <h1>About us</h1>
                <h3>We are Aqua-fit</h3>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris egestas ligula ac dapibus blandit. Fusce venenatis justo quis neque aliquam sagittis. Nulla volutpat nisl nec neque fermentum suscipit. Aenean tincidunt velit et risus iaculis ornare. Sed cursus suscipit est vel interdum. Pellentesque vestibulum eleifend eros sit amet lacinia. Aliquam in tristique purus, a tristique dolor.
          </Col>
          <Col xs = {12} md = {6}>
            <img alt = "" src = {logo} width = "50%" height = "100%" style = {{float: "right"}}></img>
        </Col>         
      </Row>
    </Container>
    <Footer/>
    </div>
  );
}

export default About;
