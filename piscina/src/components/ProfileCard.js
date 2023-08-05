import React,{useState,useEffect} from 'react';
import FileUpload from './FileUpload';
import noPhoto from '../img/noPhoto.jpg';
import {Card,Image,Row,Col} from 'react-bootstrap';

function ProfileCard(props) {

    const [file, setFile] = useState();
    useEffect(() => {
       getUserPhoto();
    },[file]);  //in caso di blob nel db mettere la dipendenza con file

     const getUserPhoto = async () => {
        const response = await fetch("http://localhost:3001/getUserPhoto",{
            credentials: 'include'
        });

        const data = await response.json();
        if(response.ok)
           setFile(data.photo);
        else setFile("");
        console.log("ho ricevuto ",file);
     }

     const handleChangeState = (state) => {
        setFile(state);
      }
    
    return (
        <Card className = "mt-2" style={{background: "rgba(var(--bs-dark-rgb))",color: "white"}} border = "primary">
            <Card.Body className="text-center">
                 <Image src={file ? file: noPhoto} 
                   roundedCircle style = {{height: "125px",width: "125px"}}/>
                <h4 class="my-3">{ props.username }</h4>
                
                    <Row>
                        <Col md = {7}>
                           <FileUpload cambiaStato = {handleChangeState} url = {"upload"}/> {' '}
                        </Col>
                        <Col md = {1}>
                          <button type="button" class="btn btn-danger" onClick={props.logout}>Logout</button>
                        </Col>
                    </Row>
                
            </Card.Body>
        </Card>
    );
}

export default ProfileCard;