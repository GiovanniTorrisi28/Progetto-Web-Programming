import React, { useEffect, useState } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { Card } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

function NotesCard() {

    const [userNotes, setUserNotes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null); //quale bottone ho premuto

    const handleButtonClick = (event) => {
        const selectedValue = (event.target.value);
        if (selectedValue == 'null') //primo option
        {
            return;
        }
        setSelectedRecord(userNotes[selectedValue]);
        setShowModal(true);
        event.target.selectedIndex = 0;
    };

    useEffect(() => {
        fetchData();
    }, [userNotes]);

    const fetchData = async () => {
        const response = await fetch('http://localhost:3001/getNotes', {
            credentials: 'include'
        });
        const data = await response.json();
        if (response.status === 500)
            alert("errore nel getNotes");
        else {
            setUserNotes(data);
        }
    };

    const [showInsertModal, setShowInsertModal] = useState(false);
    const openInsertModal = () => {
        setShowInsertModal(true);
    }



    async function updateData(event) {
        event.preventDefault();
        const form = document.getElementById("updateForm");
        const formData = new FormData(form);
        formData.append("id", selectedRecord.id);
        await fetch("http://localhost:3001/updateNote", {
            method: "post",
            credentials: 'include',
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            headers: {
                'Content-type': "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    alert("Update failed");
                }
                
            });
    }

    async function sendData(event) {
        event.preventDefault();
        const form = document.getElementById("insertForm");
        const formData = new FormData(form);

        await fetch("http://localhost:3001/test", {
            method: "post",
            credentials: 'include',
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            headers: {
                'Content-type': "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    alert("Send failed");
                }
            });
    }


    async function deleteData(event) {
        event.preventDefault();

        await fetch("http://localhost:3001/deleteNote", {
            method: "post",
            credentials: 'include',
            body: JSON.stringify({ id: selectedRecord.id }),
            headers: {
                'Content-type': "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    setShowModal(false);
                }
               
            });
    }

    return (

        <Card style={{ background: "rgba(var(--bs-dark-rgb),0.7)" }} className="mt-2">
            <Card.Body>
                <Card.Title>
                    <p class="mb-4"><span class="text-light font-italic me-1">Le tue note</span></p>
                </Card.Title>
                <div className="mb-2">
                    <Button onClick={() => openInsertModal()} >Aggiungi nota</Button>
                </div>
                <Form.Select onChange={(event) => handleButtonClick(event)} id="noteSelect">
                    <option value="null">Scegli una nota</option>
                    {userNotes.map((record, index) => (
                        <option key={record.id} size="lg" value={index}>
                            {record.title}
                        </option>
                    ))}
                </Form.Select>
            </Card.Body>

            {/* Modal per aggiornamento */}
            <Modal show={showModal} onHide={() => { setShowModal(false); }}>
                <Modal.Header closeButton className='bg-primary text-light'>
                    <Modal.Title>Dettagli nota</Modal.Title>
                </Modal.Header>
                <form id="updateForm" >
                    <Modal.Body>

                        <Container>
                            <Row>
                                <FloatingLabel controlId="floatingTextarea" className="mb-3" label="Title">
                                    <Form.Control as="textarea" name="title" className='border-primary' style={{ height: '100px', width: "100%" }}>
                                        {selectedRecord?.title}
                                    </Form.Control>
                                </FloatingLabel>
                            </Row>
                            <Row>
                                <FloatingLabel controlId="floatingTextarea2" label="Text">
                                    <Form.Control as="textarea" name="body" className="border-primary" style={{ height: '100px', width: "100%" }}>
                                        {selectedRecord?.body}
                                    </Form.Control>
                                </FloatingLabel>
                            </Row>
                        </Container>

                    </Modal.Body>
                    <Modal.Footer className="border-secondary">
                        <Button variant="primary" type="submit" onClick={updateData}>Modifica</Button>
                        <Button variant="danger" type="submit" onClick={deleteData} >Elimina</Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* Modal per inserimento */}
            <Modal show={showInsertModal} onHide={() => setShowInsertModal(false)}>
                <Modal.Header closeButton className='bg-primary text-light'>
                    <Modal.Title>Crea una nuova nota</Modal.Title>
                </Modal.Header>
                <form id="insertForm">
                    <Modal.Body>
                        <Container>
                            <Row>
                                <FloatingLabel controlId="floatingTextarea" label="Title" className="mb-3">
                                    <Form.Control as="textarea" name="title" className="border-primary" />
                                </FloatingLabel>

                            </Row>
                            <Row>
                                <FloatingLabel controlId="floatingTextarea2" label="Text">
                                    <Form.Control as="textarea" name="body" className='border-primary' style={{ height: '100px', width: "100%" }} />
                                </FloatingLabel>
                            </Row>
                        </Container>

                    </Modal.Body>
                    <Modal.Footer className="border-secondary">
                        <Button variant="primary" type="submit" onClick={sendData}>Send</Button>
                    </Modal.Footer>
                </form>
            </Modal>

        </Card>

    );
}

export default NotesCard;