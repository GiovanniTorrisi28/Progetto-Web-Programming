import React, { useEffect,useState } from 'react';
import '../App.css';
import {Modal,Table,Card,Form} from 'react-bootstrap';

function PastEventsCard () {

    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleButtonClick = (event) => {
      const selectedValue = (event.target.value);
      if(selectedValue === 'null') //primo option
      {
        return;
      }
      setSelectedRecord(pastEvents[selectedValue]);
      setShowModal(true);
      event.target.selectedIndex = 0;
      };

    useEffect(() => {
        fetchData();
    },[]);
  
     const [pastEvents, setPastEvents] = useState([]);
     const [userDataChallenge,setUserDataChallenge] = useState([]);

     const fetchData = async () => {
         const response = await fetch('http://localhost:3001/getPastEvents',{
          credentials: 'include'
         });
         const data = await response.json();
         setPastEvents(data);
     }
     
     //prendo i dati dell'utente all'evento selezionato
     const handleModalOpen = async  () => {
        const response = await fetch('http://localhost:3001/getPastEvents/' + selectedRecord.id,{
            credentials: 'include'
          });
          const data = await response.json();
          setUserDataChallenge(data); 
     };

    return (
      <>
        <Card style={{background: "rgba(var(--bs-dark-rgb))"}} border = "primary">
           <Card.Body>
           <Card.Title>
              <p class="mb-4"><span class="text-light font-italic me-1">Le mie gare passate</span></p>
           </Card.Title>
           <Form.Select onChange={(event) => handleButtonClick(event)} id = "noteSelect">
             <option value = "null">Scegli un evento</option>
             {pastEvents.map((record,index) => (
                  <option key={record.id} size="lg" value = {index}>
                      {record.name}     
                  </option>
              ))}
           </Form.Select> 
           </Card.Body>
        </Card>

        <Modal show={showModal} onShow={handleModalOpen} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className = "bg-primary text-light">
                <Modal.Title>{selectedRecord?.name} {selectedRecord?.location} {new Date(selectedRecord?.startDate).toLocaleDateString()}{selectedRecord?.endData} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover variant="ligh" className='border-dark'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Distanza (m)</th>
                      <th>Stile</th>
                      <th>Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDataChallenge.map((challenge,index) => (
                          <tr>
                              <td>{index + 1}</td>  
                              <td>{challenge.distance}</td> 
                              <td>{challenge.style}</td>
                              <td>{challenge.time}</td>
                          </tr>
                    ))}
                  </tbody>
                </Table>      
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>

    </>
    );
}

export default PastEventsCard;