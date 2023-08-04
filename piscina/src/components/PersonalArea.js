import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import DataCard from './DataCard';
import PastEventsCard from './PastEventsCard';
import NotesCard from './NotesCard';
import SubscriptionsCard from './SubscriptionsCard';
import FutureEventsCard from './FutureEventsCard';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

function PersonalArea() {
  useEffect(() => {
    fetchData();
  }, []);

  const [userData, setUserData] = useState([]);
  const fetchData = async () => {
    const response = await fetch("http://localhost:3001/personalArea", {
      credentials: 'include',
    });
    const data = await response.json();
    setUserData(data);
  }

  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch("http://localhost:3001/logout", {
      credentials: 'include'
    });
    if (response.ok)
      navigate("/login");
    else
      alert("Logout failed");
  }

  const backgroundStyle = {
    backgroundImage: "url('http://localhost:3000/images/background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: "100vh"
  };

  const tabcontentdark  = {
    color: 'black', /* Imposta il colore del testo attivo su nero */
    backgroundColor: 'white' /* Imposta lo sfondo attivo su bianco */
  };

  return (
    <div style={backgroundStyle}>
      <Container className="py-5" style={{ height: "100vh" }}>
        <Row>
          <Col md={4} xs={12}>
            <ProfileCard username={userData.username} logout={logout} />
          </Col>
          <Col md={8} xs={12}>
            <DataCard />
          </Col>
        </Row>
        <Row>
          <Col md={4} xs={12}>
            <Tabs className="mb-3 mt-2">
              <Tab eventKey="gare passate" title={<span style={{ color: "black" }}>Gare Passate</span>}>
                <PastEventsCard></PastEventsCard>
              </Tab>
              <Tab eventKey="gare future" title={<span style={{ color: "black" }}>Gare Future</span>}>
                <FutureEventsCard></FutureEventsCard>
              </Tab>
            </Tabs>

          </Col>
          <Col md={4} xs={12}>
            <NotesCard />
          </Col>
          <Col md={4} xs={12}>
            <SubscriptionsCard />
          </Col>

        </Row>
      </Container>
    </div>

  );
}

export default PersonalArea;