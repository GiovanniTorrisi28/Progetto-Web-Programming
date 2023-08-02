import React, { useState, useEffect } from 'react';
import RecordDataCard from './RecordDataCard';
import { Container, Col, Row, Card, Form } from 'react-bootstrap';
import FileUpload from './FileUpload';
import AdminSidebar from './AdminSidebar';
import '../App.css';
function Dashboard() {
   
  const [companyData, setCompanyData] = useState([]);
  const [file, setFile] = useState([]); // file dell'immagine del logo

  useEffect(() => {
    getCompanyData();
  }, [file]); // rifai la query quando la foto cambia

  useEffect(() => {
    getUsersCount();
    getStaffCount();
    getActivitiesCount();
    getEventsCount();
  },[]);

  const getCompanyData = async () => {
    const response = await fetch("http://localhost:3001/getCompanyData");
    const data = await response.json();
    if (response.ok) setCompanyData(data[0]);
    else alert("errore nel getCompany");
  };

  const handleChangeState = (state) => {
    setFile(state); // fileupload cambia lo stato con questo
  };

  const [usersCounter, setUsersCounter] = useState(0);
  const getUsersCount = async () => {
    const response = await fetch("http://localhost:3001/getUsersCount");
    const data = await response.json();
    if(response.ok)
      setUsersCounter(data[0].count);
  };

  const [staffCounter, setStaffCounter] = useState(0);
  const getStaffCount = async () => {
    const response = await fetch("http://localhost:3001/getStaffCount");
    const data = await response.json();
    if(response.ok)
      setStaffCounter(data[0].count);
  };

  const [activitiesCounter,setActivitiesCounter] = useState(0);
  const getActivitiesCount = async () => {
    const response = await fetch("http://localhost:3001/getActivitiesCount");
    const data = await response.json();
    if(response.ok)
      setActivitiesCounter(data[0].count);
  }

  const [eventsCounter,setEventsCounter] = useState(0);
  const getEventsCount = async () => {
    const response = await fetch("http://localhost:3001/getEventsCount");
    const data = await response.json();
    if(response.ok)
      setEventsCounter(data[0].count);
  };

  return (
    <Container fluid className=" min-vh-100 bg-dark">
      <Row>
        <Col xs={12} md={2} className="bg-white min-vh-100">
          <AdminSidebar />
        </Col>
        <Col md={10}>
          <Row className="g-3 my-2 mx-2">
          <Col md={3}>
              <Card bg = 'dark' border = "primary" text= "light">
                <Card.Body>
                  <Card.Title> <h3 className='fs-2'>{usersCounter}</h3> </Card.Title>
                  <p className='fs-5'>Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg = 'dark' border = "primary" text= "light">
                <Card.Body>
                  <Card.Title> <h3 className='fs-2'>{staffCounter}</h3> </Card.Title>
                  <p className='fs-5'>Staff</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg = 'dark' border = "primary" text= "light">
                <Card.Body>
                  <Card.Title> <h3 className='fs-2'>{activitiesCounter}</h3> </Card.Title>
                  <p className='fs-5'>Activities</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg = 'dark' border = "primary" text= "light">
                <Card.Body>
                  <Card.Title> <h3 className='fs-2'>{eventsCounter}</h3> </Card.Title>
                  <p className='fs-5'>Events</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="g-3 my-2 mx-2">
            <Col>
              <Card className="mt-3"bg = 'dark' border = "primary" text= "light">
                <Card.Body>
                <RecordDataCard label="Name" valueType={'text'} value={companyData.name} isEditable={true} url={'updateCompanyData'} />
                  <RecordDataCard label="Email" valueType={'email'} value={companyData.email} isEditable={true} url={'updateCompanyData'} />
                  <RecordDataCard label="Telephone" valueType={'text'} value={companyData.telephone} isEditable={true} url={'updateCompanyData'} />
                  <RecordDataCard label="Instagram" valueType={'text'} value={companyData.instagram} isEditable={true} url={'updateCompanyData'} />
                  <RecordDataCard label="Address" valueType={'text'} value={companyData.address} isEditable={true} url={'updateCompanyData'} />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Photo</p>
                    </div>
                    <div className="col-sm-7">
                      <Form.Control
                        type={"text"}
                        size="30"
                        className={'Editable'}
                        value={companyData.photo}
                      />
                    </div>
                    <div className="col-sm-2">
                      <FileUpload cambiaStato={handleChangeState} url={"uploadPhotoLogo"} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
