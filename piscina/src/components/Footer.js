import '../App.css';
import React from "react";
import { Navbar } from 'react-bootstrap';

function Footer(){
   return (
      <Navbar expand="lg" bg = "dark" fixed = "bottom">
         <span className='text-light'>© 2023, All Rights Reserved</span>
      </Navbar>
   );
}

export default Footer;