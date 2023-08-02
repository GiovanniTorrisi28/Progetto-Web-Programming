import '../App.css';
import React from "react";
import {Link} from 'react-router-dom';

function Navigation() {
  return (
    <div className ="Navigation bg-light">
        <p><strong>2. Navigation Menu</strong></p>
        <ul className="list-group">
            <Link to = "/about">
               <li className= "list-group-item list-group-item-primary"> About</li>
            </Link>
            <Link to = "/contact">
               <li className= "list-group-item list-group-item-primary">Contact</li>
            </Link>
            <Link to = "/activities">
               <li className= "list-group-item list-group-item-primary">Activities</li>
            </Link>
            <Link to =  "/staff">
               <li className= "list-group-item list-group-item-primary">Staff</li>
            </Link>
            <li className= "list-group-item list-group-item-primary">Orari</li>
            <Link to = "/tariffs">
               <li className= "list-group-item list-group-item-primary">Tariffs</li>
            </Link>
            <Link to = "/gallery">
               <li className= "list-group-item list-group-item-primary">Galleria</li>
            </Link>
            <Link to = "/test">
               <li className= "list-group-item list-group-item-primary">test</li>
            </Link>
        </ul>
    </div>
  );
}

export default Navigation;
