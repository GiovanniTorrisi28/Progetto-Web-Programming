import React,{useState,useEffect} from 'react';
import {Card,ListGroup,Button,Modal,Form} from 'react-bootstrap';

function FutureEventsCard () {
    
    const [futureEvents,setFutureEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [challenges, setChallenges] = useState([]);
    
    useEffect(() => {
        fetchFutureEvents();
    },[]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleOpen = async () => {
        const response1 = await fetch('http://localhost:3001/getActiveChallenges?event_id=' + selectedRecord.id,{
            credentials: 'include'
        });
        const data1 = await response1.json();
       
        if (response1.ok) {
            var updatedChallenges1 = data1.map(item => ({
              id: item.id,
              label: item.distance + ' ' + item.style,
              checked: true
            }));
        }

        const response2 = await fetch('http://localhost:3001/getOtherChallenges?event_id=' + selectedRecord.id,{
            credentials: 'include'
        });
        const data2 = await response2.json();
        if (response2.ok) {
            var updatedChallenges2 = data2.map(item => ({
              id: item.id,
              label: item.distance + ' ' + item.style,
              checked: false
            }));
        }
        const combinedData = [...updatedChallenges1,...updatedChallenges2];
        setChallenges(combinedData);
        
    };

    const handleButtonClick = async (record) => {
        setSelectedRecord(record); 
        handleShow(); 
    };

    const handleCheckboxChange = (event, items, setItems) => {
        const { id, checked } = event.target;
        setItems(items.map(item => item.id === parseInt(id) ? { ...item, checked } : item));
      };

    const fetchFutureEvents = async () => {
        const response = await fetch('http://localhost:3001/getFutureEvents');
        const data = await response.json();
        if(response.ok){
            setFutureEvents(data);
        }
        else alert("errore nel getFutureEvents");
     };
 

    const saveChallenges = async (event) => {
        event.preventDefault();
        const selectedItems = challenges.filter(item => item.checked);
        const response = await fetch("http://localhost:3001/saveUserChallenges",{
             method: "post",
             credentials: 'include',
             body: JSON.stringify({selectedItems, event_id: selectedRecord.id}),
             headers: {
                 'Content-type': "application/json"
             }
        });
        if(!response.ok)
           alert("Update Failed");
    }

    return (
        <>
        <Card style={{background: "rgba(var(--bs-dark-rgb),0.7)"}}>
            <Card.Body>
                <Card.Title>
                   <p class="mb-4"><span class="text-light font-italic me-1">Le mie prossime gare</span></p>
                </Card.Title>
                <ListGroup>
                {futureEvents.map(event => (
                    <ListGroup.Item key = {event.id} >{event.name}  
                    <Button variant = 'primary' style = {{float: "right"}} onClick = {() => handleButtonClick(event)}>Seleziona</Button>
                </ListGroup.Item>
                ))}
               </ListGroup>
            </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleClose} onShow = {handleOpen}>
            <Modal.Header closeButton className = "bg-primary text-white">
            <Modal.Title>Dettagli evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* <p>{selectedRecord.name + ", " + selectedRecord.location + ", " + new Date(selectedRecord.startDate).toLocaleDateString()}</p> */}
             {challenges.map(challenge => (
                <Form.Check
                id = {challenge.id}
                label= {challenge.label}
                name="challenges"
                type= "checkbox"
                checked = {challenge.checked}
                onChange={event => handleCheckboxChange(event, challenges, setChallenges)}
                key = {challenge.id}
              />
             ))}
            </Modal.Body>
            <Modal.Footer className = "border-secondary">
              <Button variant="dark" onClick={handleClose}>
                 Close
              </Button>
            <Button variant="primary" onClick={saveChallenges}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    ); 
}

export default FutureEventsCard;
