import React from 'react';
import '../App.css';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';

function Registration() {

  const backgroundStyle = {
    backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh"
  };

  return (
    <div style={backgroundStyle}>
      <TopNavbar />
      <Container style={{ width: "500px" }} className='mt-5' >
        <form onSubmit={sendData}>
          <Card style={{ borderRadius: "15px", background: "rgba(var(--bs-primary-rgb),0.6)" }}>
            <Card.Body >
              <Card.Title> <h2 style={{ color: "white" }}>Registration Form</h2></Card.Title>
              <Card.Text style={{ color: "white" }}>Please enter your data</Card.Text>
              <Row className="mt-4">
                <Col xs={12} md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">name</InputGroup.Text>
                    <Form.Control
                      name="name"
                      placeholder="Enter Username"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col xs={12} md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Surname</InputGroup.Text>
                    <Form.Control
                      name="surname"
                      placeholder="Enter Surname"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col xs={12} md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                    <Form.Control
                      name="username"
                      placeholder="Enter Username"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col xs={12} md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col xs={12} md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer style={{ textAlign: "center", border: "none" }}>
              <Button type="submit" variant="light" style={{ textAlign: "center" }}>Submit</Button>

            </Card.Footer>
          </Card>
        </form>
      </Container>
      <Footer />
    </div>
  );
}

async function sendData(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const response = await fetch("http://localhost:3001/registration", {
    method: "post",
    body: JSON.stringify(Object.fromEntries(formData.entries())),
    headers: {
      'Content-type': "application/json"
    }
  });

  if (response.ok) {
    alert("Registration Successful");
  }
  else if (response.status == 409) {
    alert("Username already exists");
  }
  else
    alert("Registration failed");
}



export default Registration;