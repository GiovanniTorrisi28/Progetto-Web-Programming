import React, { useState, useEffect } from 'react';
import '../App.css';
import TopNavbar from '../components/TopNavbar';
import Footer from './Footer';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import noPhoto from '../img/noPhoto.jpg';

function Staff() {
   useEffect(() => {
      fetchData();
   }, []);

   const [staff, setStaff] = useState([]);

   const fetchData = async () => {
      const response = await fetch("http://localhost:3001/getStaffData");
      const data = await response.json();

      setStaff(data);
   };

   const iconsStyle = {
      margin: "2vh 3vh",
      color: "black"
   }

   const backgroundStyle = {
      backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: "100vh"
   };

   return (
      <div style={backgroundStyle}>
         <TopNavbar />
         <h1 className='text-center mt-3'>Staff</h1>
         <Container className='mb-4'>
            <Row>
               {staff.map((item) => (
                  <Col xs={6} md={3}>
                     <Card bg="light" className=' mb-4 shadow-sm StaffCard' border="primary">
                        <Card.Img variant="top" src={item.photo ? item.photo : noPhoto} height={"150px"} />
                        <Card.Body>
                           <Card.Title>{item.name + " " + item.surname}</Card.Title>
                           <Card.Footer className='border-primary'>
                              <a href={item.instagram} target="blank"> <BsInstagram size="3vh" style={iconsStyle} /> </a>
                              <a href={item.linkedin} target="blank"> <BsLinkedin size="3vh" style={iconsStyle} /> </a>
                           </Card.Footer>
                        </Card.Body>
                     </Card>
                  </Col>
               ))}
            </Row>
         </Container>
         <Footer/>
      </div>
   );
}

export default Staff;
