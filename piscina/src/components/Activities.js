import React, { useState, useEffect } from 'react';
import '../App.css';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import noPhoto from '../img/noPhoto.png';
import { Card, Container, Row, Col } from 'react-bootstrap';

function Activities() {
   useEffect(() => {
      fetchData();
   }, []);

   const [activities, setActivities] = useState([]);

   const fetchData = async () => {
      const response = await fetch("http://localhost:3001/getActivitiesData");
      const data = await response.json();
      setActivities(data);
   };

   const backgroundStyle = {
      backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: "100vh"
   };

   return (
      <div style={backgroundStyle}>
         <TopNavbar />
         <h1 className='text-center mt-3'>Activities</h1>
         <Container className='mb-4'>
            <Row>
               {activities.map((item, index) => (
                  <Col md={3} xs={6}>
                     <Card bg="light" className=' mb-4 shadow-sm' border="primary" style={{ width: "30vh", height: "35vh", margin: "20px 20px 20px 0px" }}>
                        <Card.Img variant="top" src={item.photo ? item.photo : noPhoto} height={"150px"} className='w-100' />
                        <Card.Body >
                           <Card.Title>{item.name}</Card.Title>
                           <Card.Text>{item.description}</Card.Text>
                        </Card.Body>
                     </Card>
                  </Col>
               ))}
            </Row>
         </Container>
         <Footer />
      </div>
   );
}
export default Activities;