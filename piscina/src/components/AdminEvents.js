import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Row, Col, Card, Button, Modal, Table, Form } from 'react-bootstrap';
import '../App.css';

function FutureEvents(props) {
    const [futureEvents, setFutureEvents] = useState([]);

    useEffect(() => {
        setFutureEvents(props.data);
    }, [props.data]);

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
            props.getFutureEvents();
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
    };

    return (
        <>
            <Card bg = "dark" border = "primary">
                <Card.Body>
                    <Card.Title className = "text-light">Eventi Futuri</Card.Title>
                    <Table responsive variant = "dark">
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
                                    <td><input type='text' value={item.name} name="name" className = "AdminInput" onChange={(e) => handleChange(e, index)} /></td>
                                    <td><input type='text' value={item.location} name="location" className='AdminInput' onChange={(e) => handleChange(e, index)} /></td>
                                    <td><input type='date' value={item.startDate} name="startDate" className='AdminInput' onChange={(e) => handleChange(e, index)} /></td>
                                    <td><input type='date' value={item.endDate} name="endDate" className='AdminInput' onChange={(e) => handleChange(e, index)} /></td>
                                    <td>
                                        <Button variant="primary" onClick={(e) => editEvent(e, index)}>Modifica</Button> {' '}
                                        <Button variant='danger' onClick={(e) => deleteEvent(e, index)}>Elimina</Button> {' '}
                                        <Button variant="light" onClick={() => handleShow(item)}>Iscrizioni</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='bg-primary text-light'>
                    <Modal.Title>{selectedItem.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table bordered responsive className='border-dark'>
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
                                    <td>
                                        <Form.Select>
                                          {item.challenges.map(item2 => (
                                            <option>{item2.distance + " " + item2.style}</option>
                                    ))}
                                    </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer className='border-secondary'>
                    <Button variant="dark" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleClose}>Save Changes </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function PastEvents(props) {

    const [pastEvents, setPastEvents] = useState([]);
    useEffect(() => {
        setPastEvents(props.data);
    }, [props.data]);


    const [eventUsersChallenges, setEventUserChallenges] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        if (e.target.value == 'null')
            return;
        setSelectedItem(pastEvents[e.target.value]);
        getEventUsersChallenges(pastEvents[e.target.value].id);
        getAllUsers();
        getAllChallenges();
        setShow(true);
        e.target.selectedIndex = 0;

    }

    //gare di ogni utente a quell'evento
    const getEventUsersChallenges = async (eventId) => {
        const response = await fetch("http://localhost:3001/getUsersAtEvent?id=" + eventId);
        const data = await response.json();
        const userChallengesPromises = data.map(async (item) => {
            const response2 = await fetch("http://localhost:3001/getUserChallenges?" + "eventId=" + eventId + "&userId=" + item.id);
            const data2 = await response2.json();
            return {
                id: item.id,
                name: item.name,
                surname: item.surname,
                challenges: data2,
                selectedChallenge: 0
            }
        });
        const userChallenges = await Promise.all(userChallengesPromises);

        setEventUserChallenges(userChallenges);
    }

    
    const handleChangeChallenge = (e,item) => {
        const updateEventUserChallenge = [...eventUsersChallenges];
        updateEventUserChallenge[item].selectedChallenge = e.target.value;
        setEventUserChallenges(updateEventUserChallenge);
    }

    const [selectedTime, setSelectedTime] = useState(0);
    const handleChangeTime = (e, indexUser) => {
        const updateEventUserChallenge = [...eventUsersChallenges];
        updateEventUserChallenge[indexUser].challenges[eventUsersChallenges[indexUser].selectedChallenge].time = e.target.value;
        setEventUserChallenges(updateEventUserChallenge);
    };

    const saveChanges = async (e, item) => {
        const response = await fetch("http://localhost:3001/updateChallengeTime", {
            method: 'POST',
            body: JSON.stringify({
                userId: item.id,
                eventId: selectedItem.id,
                challengeId: item.challenges[item.selectedChallenge].id,
                time: item.challenges[item.selectedChallenge].time
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok)
            alert("Update Successfully");
    }

    const [allUsers, setAllUsers] = useState([]);
    const getAllUsers = async () => {
        const response = await fetch("http://localhost:3001/getUsersData");
        const data = await response.json();
        if (response.ok)
            setAllUsers(data);
    }

    const [allChallenges, setAllChallenges] = useState([]);
    const getAllChallenges = async () => {
        const response = await fetch("http://localhost:3001/getChallenges");
        const data = await response.json();
        if (response.ok)
            setAllChallenges(data);
    }
    
        const addUserChallenge = async () => {
            const response = await fetch("http://localhost:3001/insertUserChallenge", {
                method: "post",
                body: JSON.stringify({
                    userId: document.getElementById("newUser").value,
                    challengeId: document.getElementById("newChallenge").value,
                    eventId: selectedItem.id,
                    time: document.getElementById("newTime").value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok) {
                document.getElementById("newUser").value = "";
                document.getElementById("newChallenge").value = "";
                document.getElementById("newTime").value = "";
                alert("Insert successfully");
                getEventUsersChallenges(selectedItem.id);
            }
        }
        
        const deleteEvent = async (e, index) => {
            const response = await fetch("http://localhost:3001/deleteEvent", {
                method: "post",
                body: JSON.stringify({
                    id: selectedItem.id
                }),
                headers: {
                    'Content-type': "application/json",
                }
            });
            if (response.ok){
                props.getPastEvents();  //dico al genitore di aggiornare i dati
                setShow(false);
            }
        };

        const deleteUserChallenge = async (item) => {
            const response = await fetch("http://localhost:3001/deleteUserChallenge",{
                method: "post",
                body: JSON.stringify({
                    userId: item.id,
                    eventId: selectedItem.id,
                    challengeId: item.challenges[item.selectedChallenge].id
                }),
                headers: {
                    'Content-type' : "application/json"
                }
            });
            if(response.ok)
                 getEventUsersChallenges(selectedItem.id);
        };

    return (
        <>
            <Card bg = "dark" border='primary'>
                <Card.Body>
                    <Card.Title className='text-light'>Eventi Passati</Card.Title>
                    <Form.Select size="lg"  onChange={(e) => handleShow(e)} >
                        <option value={'null'}>Open this select menu</option>
                        {pastEvents.map((item, index) => (
                            <>
                                <option value={index}>{item.name}</option>
                            </>
                        ))}

                    </Form.Select>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton className='bg-primary text-light'>
                    <Modal.Title>{selectedItem.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered responsive className='border-dark'> 
                        <thead>
                            <tr>
                                <th>Atleta</th>
                                <th>Gara</th>
                                <th>Tempo</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventUsersChallenges.map((item, index) => (
                                <tr>
                                    <td>{item.name} {item.surname}</td>
                                    <td>
                                        <Form.Select onChange={(e) => handleChangeChallenge(e,index)}>
                                            {item.challenges.map((item2, index2) => (
                                                <>
                                                    <option value={index2}>{item2.distance + " " + item2.style}</option>
                                                </>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <input value={item.challenges[item.selectedChallenge].time} onChange={(e) => handleChangeTime(e, index)} type="text" placeholder="Tempo in minuti" id="time" /> {' '}
                                        <button className='btn btn-primary' onClick={(e) => saveChanges(e, item)}>Modifica</button>
                                    </td>
                                    <td>
                                        <button className = "btn btn-danger" onClick={() => deleteUserChallenge(item)}>Elimina</button>
                                    </td>

                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <Form.Select id="newUser">
                                        <option></option>
                                        {allUsers.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name + " " + item.surname}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select id="newChallenge">
                                        <option></option>
                                        {allChallenges.map((item, index) => (
                                            <option key={index} value={item.id}>{item.distance + " " + item.style}</option>
                                        ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <input type="text" placeholder="Tempo in minuti" id="newTime" /> {' '}
                                    <button className='btn btn-dark' onClick = {addUserChallenge}>Aggiungi</button>
                                </td>

                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer className = "border-secondary">
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteEvent}>
                        Elimina
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}



function AdminEvents() {

    const incrementDateByOneDay = (dateString) => {
        const endDate = new Date(dateString);
        endDate.setDate(endDate.getDate() + 1);
        return endDate.toISOString().slice(0, 10);
    };


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
        if (response.ok) {
            getPastEvents();
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

    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

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

    const getPastEvents = async () => {
        const response = await fetch("http://localhost:3001/getAllPastEvents");
        const data = await response.json();
        if (response.ok)
            setPastEvents(data);
    };

    useEffect(() => {
        getPastEvents();
        fetchFutureEvents();
    }, []);


    return (
        <>
            <div className='container-fluid bg-dark min-vh-100'>
                <Row>
                    <Col xs={12} md={2} className='bg-white min-vh-100'>
                        <AdminSidebar />
                    </Col>
                    <Col xs={12} md={10}>
                        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>Gestione Eventi</h1>
                        <Card bg = "dark" border = "primary">
                            <Card.Body>
                                <Card.Title className = "text-light">Nuovo Evento</Card.Title>
                                <Table responsive variant='dark'>
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
                                            <td><input type='text' id="newEventName" placeholder = "Enter Name" className='AdminInput'/></td>
                                            <td><input type='text' id="newEventLocation" placeholder='Enter Location' className='AdminInput' /></td>
                                            <td><input type='date' id="newEventStartDate" className='AdminInput' /></td>
                                            <td><input type='date' id="newEventEndDate" className='AdminInput'/></td>
                                            <td>
                                                <Button variant="primary" onClick={insertEvent}>Aggiungi</Button> {' '}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        <div className='mt-5'></div>
                        <FutureEvents getFutureEvents={fetchFutureEvents} data={futureEvents} />
                        <div className='mt-5'></div>
                        <PastEvents getPastEvents={getPastEvents} data={pastEvents} />
                        <div className = "mb-5"></div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default AdminEvents;