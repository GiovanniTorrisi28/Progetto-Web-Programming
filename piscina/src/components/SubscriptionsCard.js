import React,{useState,useEffect} from 'react';
import '../App.css';
import { Card, ListGroup } from 'react-bootstrap';

function SubscriptionsCard() {
   
   useEffect(() => {
      fetchData();
   },[]);

   const [subscriptions,setSubscriptions] = useState([]);

   const fetchData = async () => {
      const response = await fetch('http://localhost:3001/getUserSubscriptions',{
         credentials: 'include',
      });
      const data = await response.json();
      if(response.ok){
           setSubscriptions(data);
           console.log(data);
      }
      else if(response.status === 500)
         console.log("errore nella lettura degli abbonamenti");
      else alert();
   };

   return (
      <Card style={{background: "rgba(var(--bs-dark-rgb))"}} className = "mt-2" border = "primary">
          <Card.Body>
             <Card.Title>
                <p class="mb-4"><span class="text-light font-italic me-1">I tuoi abbonamenti</span></p>
             </Card.Title>
             <ListGroup >
             {subscriptions.map(subscription => (
                 <ListGroup.Item style={{ backgroundColor: subscription.state ? 'green' : 'red' }}> {subscription.name} {new Date(subscription.endDate).toLocaleDateString()} </ListGroup.Item> 
             ))}
             </ListGroup>
          </Card.Body>
      </Card>
   );
}

export default SubscriptionsCard;