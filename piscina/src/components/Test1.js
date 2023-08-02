import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Row, Col, Card, Button, Modal, Table, Form } from 'react-bootstrap';


function AdminEvents() {

  useEffect(() => {
    fetchFutureEvents();
  }, []);

  const insertEvent = async () => {
    const response = await fetch("http://localhost:3001/insertEvent", {
      method: "post",
      body: JSON.stringify({
        name: document.getElementById("newEventName").value,
        location: document.getElementById("newEventLocation").value,
        startDate: document.getElementById("newEventStartDate").value,
        endDate: document.getElementById("newEventEndDate").value
      }),
      headers: {
        'Content-type': "application/json"
      }
    });
    const data = response.json();
    if (response.ok) {
      fetchFutureEvents();
      document.getElementById("newEventName").value = "";
      document.getElementById("newEventLocation").value = "";
      document.getElementById("newEventStartDate").value = "";
      document.getElementById("newEventEndDate").value = "";
      alert("Insert Successfully");
    }
    else if (response.status == 400)
      alert("Tutti i campi devono essere compilati");
    else if (response.status == 500)
      alert("La data di fine deve essere successiva a quella di inizio");
  }

  //eventi futuri

  const [futureEvents, setFutureEvents] = useState([]);

  const fetchFutureEvents = async () => {
    const response = await fetch("http://localhost:3001/getFutureEvents");
    const data = await response.json();
    if (response.ok) {
      const mappedData = data.map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
        startDate: incrementDateByOneDay(item.startDate),
        endDate: incrementDateByOneDay(item.endDate)
      }));
      setFutureEvents(mappedData);
    }
  };

  const incrementDateByOneDay = (dateString) => {
    const endDate = new Date(dateString);
    endDate.setDate(endDate.getDate() + 1);
    return endDate.toISOString().slice(0, 10);
  };

  const handleChange = (e, index) => {
    const updateFutureEvents = [...futureEvents];
    updateFutureEvents[index][e.target.name] = e.target.value;
    setFutureEvents(updateFutureEvents);
  };

  const deleteEvent = async (e, index) => {
    const response = await fetch("http://localhost:3001/deleteEvent", {
      method: "post",
      body: JSON.stringify({
        id: futureEvents[index].id
      }),
      headers: {
        'Content-type': "application/json",
      }
    });
    if (response.ok)
      fetchFutureEvents();
  };

  const editEvent = async (e, index) => {
    const response = await fetch("http://localhost:3001/editEvent", {
      method: "post",
      body: JSON.stringify({
        id: futureEvents[index].id,
        name: futureEvents[index].name,
        location: futureEvents[index].location,
        startDate: futureEvents[index].startDate,
        endDate: futureEvents[index].endDate
      }),
      headers: {
        'Content-type': "application/json"
      }
    });
    if (response.ok)
      alert("Update Successfully");
  };

  //per il modal
  const [selectedItem, setSelectedItem] = useState({}); //per poter usare l'item dentro il modal
  const [eventUserChallenges, setEventUserChallenges] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setSelectedItem(item);
    fetchUserChallenges(item.id);
    setShow(true);
  }

  //per ogni utente prende le sue gare a quell'evento
  const fetchUserChallenges = async (eventId) => {
    const response = await fetch("http://localhost:3001/getUsersAtEvent?id=" + eventId);
    const data = await response.json();
    const userChallengesPromises = data.map(async (item) => {
      const response2 = await fetch("http://localhost:3001/getUserChallenges?" + "eventId=" + eventId + "&userId=" + item.id);
      const data2 = await response2.json();
      return {
        name: item.name,
        surname: item.surname,
        challenges: data2
      }
    });
    const userChallenges = await Promise.all(userChallengesPromises);

    setEventUserChallenges(userChallenges);
  }

  //fine eventi futuri

  return (
    <>
      <div className='container-fluid bg-dark min-vh-100'>
        <Row>
          <Col xs={12} md={2} className='bg-white min-vh-100'>
            <AdminSidebar />
          </Col>
          <Col xs={12} md={10}>
            <h1 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>Gestione Eventi</h1>
            <Card>
              <Card.Body>
                <Card.Title>Nuovo Evento</Card.Title>
                <Table responsive>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Location</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type='text' id="newEventName" /></td>
                      <td><input type='text' id="newEventLocation" /></td>
                      <td><input type='date' id="newEventStartDate" /></td>
                      <td><input type='date' id="newEventEndDate" /></td>
                      <td>
                        <Button variant="primary" onClick={insertEvent}>Aggiungi</Button> {' '}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <div className='mt-5'></div>
            <Card>
              <Card.Body>
                <Card.Title>Eventi Futuri</Card.Title>
                <Table responsive>
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Location</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {futureEvents.map((item, index) => (
                      <tr key={index}>
                        <td><input type='text' value={item.name} name="name" onChange={(e) => handleChange(e, index)} /></td>
                        <td><input type='text' value={item.location} name="location" onChange={(e) => handleChange(e, index)} /></td>
                        <td><input type='date' value={item.startDate} name="startDate" onChange={(e) => handleChange(e, index)} /></td>
                        <td><input type='date' value={item.endDate} name="endDate" onChange={(e) => handleChange(e, index)} /></td>
                        <td>
                          <Button variant="primary" onClick={(e) => editEvent(e, index)}>Modifica</Button> {' '}
                          <Button variant='danger' onClick={(e) => deleteEvent(e, index)}>Elimina</Button> {' '}
                          <Button variant="dark" onClick={() => handleShow(item)}>Iscrizioni</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>


            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedItem.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Atleta</th>
                      <th>Gare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventUserChallenges.map(item => (
                      <tr>
                        <td>{item.name} {item.surname}</td>
                        <td>{item.challenges.map(item2 => (
                          <p>{item2.distance + " " + item2.style}</p>
                        ))}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleClose}>Save Changes </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </div>

    </>
  );
}

export default AdminEvents;