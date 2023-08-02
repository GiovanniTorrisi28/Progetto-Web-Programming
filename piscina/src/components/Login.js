import '../App.css';
import React from 'react';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup,Button } from 'react-bootstrap';


function Login() {
   
   const navigate = useNavigate();

   async function sendData(event){
      event.preventDefault();
      const formData = new FormData(event.target);

      const response =  await fetch("http://localhost:3001/login",{
           method: "post",
           credentials: 'include',
           body: JSON.stringify(Object.fromEntries(formData.entries())),
           headers: {
               'Content-type': "application/json",    
           }
       })
       
       if(response.status === 200){
           navigate('/personalArea');
       }
       else if(response.status === 201){
           navigate('/adminArea');
       }
       else
         alert("Login failed");
   }

   const backgroundStyle = {
      backgroundImage: "url('http://localhost:3000/images/background2.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: "100vh"
    };

   return (
      <div style = {backgroundStyle}>
         <TopNavbar/>
         <Container style = {{width: "500px"}} className = 'mt-5' >
         <form onSubmit={sendData}>
         <Card  style = {{borderRadius: "15px",background: "rgba(var(--bs-primary-rgb),0.6)"}}>
         <Card.Body >
           <Card.Title> <h2 style = {{color: "white"}}>Login Form</h2></Card.Title>
           <Card.Text style = {{color: "white"}}>Please enter your useraname and password</Card.Text>
             <Row className = "mt-4">
                 <Col xs = {12} md = {12}>
                 <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                    <Form.Control
                      name = "username"
                      placeholder="Enter Username" 
                      aria-describedby="basic-addon1"
                />
                </InputGroup>
                 </Col>
              </Row> 
              <Row className='mt-2'>
              <Col  xs = {12} md = {12}>
                 <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon2">Password</InputGroup.Text>
                    <Form.Control
                      type = "password"
                      name = "password"
                      placeholder="Enter Password"
                      aria-describedby="basic-addon2"
                />
                </InputGroup>
                 </Col>
              </Row>    
        </Card.Body>
        <Card.Footer style={{textAlign: "center",border: "none"}}>
        <Button type= "submit" variant = "light" style={{textAlign: "center"}}>Login</Button>
            
        </Card.Footer>
       </Card>    
       </form> 
       </Container> 


      {/*   <Container style = {{width: "300px",border: "1px solid black"}}>
            <form id = "loginForm" onSubmit={sendData}>
            <h2>Login</h2>
            <p>Please enter your email and password</p>
               <div className='form-row'>
                     <div class = "col-md-12 mb-3" >
                        <label for = "email">Username</label>
                        <input type = "text" className='form-control' name = "username" placeholder='Username'></input> 
                     </div>
                  </div>
                  <div className='form-row'>
                     <div class = "col-md-12 mb-3" >
                        <label for = "password">Password</label>
                        <input type = "password" className='form-control' name = "password" placeholder='Password'></input> 
                     </div>
                  </div>
                  <div className='form-row' style={{display: "flex", justifyContent: "center"}}>
                  <div class = "col-md-3 mb-3">
                     <button class="btn btn-outline-light" type="submit" name = "btnLogin">Submit</button>
                  </div>
               </div> 
            </form>
         </Container>
   */}
         <Footer/> 

      </div>
   );
}



export default Login;