import React,{useEffect, useState}  from 'react';   
import '../App.css';
import {Row,Col,Form} from 'react-bootstrap';

function RecordDataCard(props) {

   async function edit(e) {
      e.preventDefault();
      const response = await fetch("http://localhost:3001/" + props.url,{
         method: 'POST',
         credentials: 'include',
         body: JSON.stringify({
             field: props.label,
             value: e.target.elements[props.label].value
         }),
         headers: {
            'Content-type': "application/json",    
        }
      });
      console.log("stato: ",response.status);
      if(response.ok){
         alert("Update Successful");
      }
      else if(response.status === 501)
         alert("Username not available");
      else alert("Update Failed");
   }

   const [recordValue, setRecordValue] = useState(props.value);
   const handleChange = (event) => {
      if(!props.isEditable)
         return;
      setRecordValue(event.target.value);
      
   };

   useEffect(() => {
      setRecordValue(props.value);
   },[props.value]);

   return (
      <div className = "RecordDataCard">
        <form onSubmit = {edit}> 
          <Row>
            <Col md = {3}>
               <p class="mb-0">{props.label}</p>
            </Col>
            <Col md = {7}> 
               <Form.Control type = {props.valueType} size = "30" name = {props.label}
                className= {`mb-0 ${props.isEditable ? 'Editable' : 'Uneditable'}`} value = {recordValue} onChange={handleChange} />
          </Col>
          <Col md = {2}>
            { props.isEditable && (
                <button className = "btn btn-primary" type = "submit">Modifica</button>
            )}
          </Col>
         </Row>
        </form>
        <hr/>
      </div>
   );
}

export default RecordDataCard;