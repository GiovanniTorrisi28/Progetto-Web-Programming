import React, { useState, useEffect } from 'react';
import '../App.css';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import noPhoto from '../img/noPhoto.png';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';

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

   const [show, setShow] = useState(false);

   const [selectedItem, setSelectedItem] = useState({});

   const handleClose = () => setShow(false);
   const handleShow = (item) => {
      setSelectedItem(item);
      setShow(true);
   }

   return (
      <div style={backgroundStyle}>
         <TopNavbar />
         <h1 className='text-center mt-3'>Activities</h1>
         <Container className='mb-4'>
            <Row>
               {activities.map((item, index) => (
                  <Col md={3} xs={6}>
                     <Card bg="light" className=' mb-4 shadow-sm' border="primary" style={{ width: "30vh", height: "35vh", margin: "20px 20px 20px 0px" }}>
                        <Card.Img variant="top" src={item.photo ? item.photo : noPhoto} className='w-100 h-100' />
                        <Card.Body>
                           <Card.Title>{item.name}</Card.Title>
                           <Button variant="primary" onClick={() => handleShow(item)}>Scopri di più</Button>
                        </Card.Body>
                     </Card>
                  </Col>
               ))}
            </Row>
         </Container>
         <Footer />

         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-primary text-white">
               <Modal.Title>{selectedItem.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedItem.description}
            </Modal.Body>
            <Modal.Footer className="border-secondary">
               <Button variant="dark" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>

      </div>
   );
}
export default Activities;