import React,{useState,useEffect} from 'react';
import RecordDataCard from './RecordDataCard';
import { Card } from 'react-bootstrap';

function DataCard(){
   useEffect(() => {
      fetchData();
   },[]);
    
   const [userData,setUserData] = useState([]);

   const fetchData = async () => {
      const response = await fetch('http://localhost:3001/getUserData',{
        credentials: 'include'
      }); 
      const data = await response.json();
      if(response.ok)
         setUserData(data);
      else console.log("dati",data);
   }

   return (
      <Card className='mb-4 mt-2' style={{background: "rgba(var(--bs-dark-rgb),0.7)",color: "white"}}>
         <Card.Body>
             <RecordDataCard label = "Name" valueType = {'text'} value = {userData.name} isEditable = {false}/>
             <RecordDataCard label = "Surname" valueType = {'text'} value = {userData.surname} isEditable = {false}/>
             <RecordDataCard label = "Email" valueType = {'email'} value =  {userData.email} isEditable = {true} url = {"updateUserData"}/>
         </Card.Body>
      </Card>
   );
}

export default DataCard;