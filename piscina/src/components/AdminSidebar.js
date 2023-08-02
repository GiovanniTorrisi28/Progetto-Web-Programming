import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'

function AdminSidebar() {
     const navigate = useNavigate();
     const logout = async () => {
          const response = await fetch("http://localhost:3001/logout", {
               credentials: 'include'
          });
          if (response.ok)
               navigate("/login");
          else
               alert("Logout failed");
     }

     return (
          <div className='bg-white sidebar p-2'>
               <div className='m-8'>
                    <span className='brand-name fs-4'>Admin Area</span>
               </div>
               <hr className='text-dark' />
               <ListGroup variant="flush">
                    <ListGroupItem>
                         <Link to="/adminArea" className='AdminListGroupItem'>Dashboard</Link>
                    </ListGroupItem>
                    <ListGroupItem>
                         <Link to="/adminArea/staff" className='AdminListGroupItem'>Staff</Link>
                    </ListGroupItem>
                    <ListGroup.Item>
                         <Link to="/adminArea/activities" className='AdminListGroupItem'>Activities</Link>
                    </ListGroup.Item>
                    <ListGroup.Item>
                         <Link to="/adminArea/subscriptions" className='AdminListGroupItem'>Subscriptions</Link>
                    </ListGroup.Item>
                    <ListGroup.Item>
                         <Link to="/adminArea/events" className='AdminListGroupItem'>Events</Link>
                    </ListGroup.Item>
                    <ListGroup.Item>
                         <button className='btn btn-danger' onClick={logout}>Logout</button>
                    </ListGroup.Item>
               </ListGroup>
          </div>
     )
}

export default AdminSidebar;