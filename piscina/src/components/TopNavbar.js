import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopNavbar = () => {

  const styleLink = {
    color: 'white'
  }

  const [companyData, setCompanyData] = useState({});
  const getCompanyData = async () => {
    const response = await fetch("http://localhost:3001/getCompanyData");
    const data = await response.json();
    if (response.ok)
      setCompanyData(data[0]);
  }

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" sticky="top" >
      <Container>
        <Navbar.Brand className = "text-light">
          <Image roundedCircle src={companyData.photo} width="40" height="40" className="d-inline-block align-top" />{' '}
          {companyData.name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link to="/">
              <Nav.Link href=" " style={styleLink}>Home</Nav.Link>
            </Link>
            <Link to="/about">
              <Nav.Link href=" " style={styleLink}>About</Nav.Link>
            </Link>
            <Link to="/contact">
              <Nav.Link href=" " style={styleLink}>Contact</Nav.Link>
            </Link>
            <Link to="/staff">
              <Nav.Link href=" " style={styleLink}>Staff</Nav.Link>
            </Link>
            <Link to="/activities">
              <Nav.Link href=" " style={styleLink}>Activities</Nav.Link>
            </Link>
            <Link to="/registration">
              <Nav.Link href=" " style={styleLink}>Registration</Nav.Link>
            </Link>
            <Link to="/login">
              <Nav.Link href=" " style={styleLink}>Login</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
