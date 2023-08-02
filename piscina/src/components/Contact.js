import '../App.css';
import TopNavbar from './TopNavbar';
import React, { useEffect, useState } from "react";
import { Container, Form, Button, InputGroup, Card, CardGroup } from 'react-bootstrap';
import { BsFillPinMapFill, BsFillTelephoneFill, BsFillEnvelopeFill, BsInstagram } from "react-icons/bs";
import Footer from './Footer';

function Contact() {
  const iconsStyle = {
    marginRight: "15px",
    marginBottom: "20px",
    color: "black"
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://formsubmit.co/ajax/5fdb148008d12e54bcecc5d2411c2e0e", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok)
      alert("Email inviata con successo");
  };

  const [companyData, setCompanyData] = useState({});
  const getCompanyData = async () => {
    const response = await fetch("http://localhost:3001/getCompanyData");
    const data = await response.json();
    if (response.ok)
      setCompanyData(data[0]);
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  const backgroundStyle = {
    backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh"
  };

  return (
    <div style={backgroundStyle}>
      <TopNavbar />
      <Container className='mt-4'>
        <CardGroup>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} border={"dark"}>
            <Card.Body>
              <Card.Title className="mb-4">
                Our Contacts
              </Card.Title>
              <BsFillPinMapFill size="5vh" style={iconsStyle} /> <b>{companyData.address}</b>
              <br />
              <BsFillTelephoneFill size="5vh" style={iconsStyle} /> {companyData.telephone}
              <br />
              <BsFillEnvelopeFill size="5vh" style={iconsStyle} /> {companyData.email}
              <br />
              <BsInstagram size="5vh" style={iconsStyle} /> {companyData.instagram}
            </Card.Body>
          </Card>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} border={"dark"}>
            <form onSubmit={handleSubmit}>
              <Card.Body>
                <Card.Title>
                  Contact us now !!!
                </Card.Title>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1"> FullName </InputGroup.Text>
                  <Form.Control id="newEventName" name="name" value={formData.name} placeholder="Enter your fullname" aria-describedby="basic-addon1" onChange={(e) => handleChange(e)} />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon2"> Email </InputGroup.Text>
                  <Form.Control type="email" name="email" id="newEventName" value={formData.email} placeholder="Enter your email" aria-describedby="basic-addon2" onChange={(e) => handleChange(e)} />
                </InputGroup>
                <InputGroup className='mb-3'>
                  <Form.Control as="textarea" placeholder="Leave a comment here" name="message" value={formData.message} style={{ height: '100px' }} onChange={(e) => handleChange(e)} />
                </InputGroup>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" type="submit">Send</Button>
              </Card.Footer>
            </form>
          </Card>
        </CardGroup>
      </Container>
      <Footer />
    </div>
  );

};

export default Contact;
