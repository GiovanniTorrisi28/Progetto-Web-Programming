import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import AdminSidebar from './AdminSidebar';
import '../App.css';

function AdminSubscriptions() {

    useEffect(() => {
        fetchData();
    }, []);

    const [subscriptionsData, setSubscriptionsData] = useState([]);
    const [activitiesData, setActivitiesData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    const incrementDateByOneDay = (dateString) => {
        const endDate = new Date(dateString);
        endDate.setDate(endDate.getDate() + 1);
        return endDate.toISOString().slice(0, 10);
    };

    const fetchData = async () => {
        const response = await fetch("http://localhost:3001/getSubscriptionsData");
        const data = await response.json();
        if (response.ok) {
            const mappedData = data.map(item => ({
                user_id: item.user_id,
                activity_id: item.activity_id,
                endDate: incrementDateByOneDay(item.endDate),
                user_name: item.user_name,
                surname: item.surname,
                activity_name: item.activity_name,
                status: item.endDate > new Date().toISOString()
            }));
            setSubscriptionsData(mappedData);
        }

        const response2 = await fetch("http://localhost:3001/getActivitiesData");
        const data2 = await response2.json();
        if (response2.ok)
            setActivitiesData(data2);

        const response3 = await fetch("http://localhost:3001/getUsersData");
        const data3 = await response3.json();
        if (response3.ok)
            setUsersData(data3);
    }

    const handleChange = (e, index) => {
        const updateSubscriptionsData = [...subscriptionsData];
        updateSubscriptionsData[index].endDate = e.target.value;
        setSubscriptionsData(updateSubscriptionsData);
    };

    const rinnova = async (e, index) => {
        e.preventDefault();
        if (subscriptionsData[index].endDate == "") {
            alert("La data inserita non è valida");
            fetchData();
            return;
        }
        const response = await fetch("http://localhost:3001/updateSubscriptionData", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                newEndDate: subscriptionsData[index].endDate,
                user_id: subscriptionsData[index].user_id,
                activity_id: subscriptionsData[index].activity_id
            }),
            headers: {
                'Content-type': "application/json",
            }
        });
        if (response.ok) {
            fetchData();
        }
    }

    const addSubscription = async () => {

        const response = await fetch("http://localhost:3001/insertSubscriptionData", {
            method: "post",
            body: JSON.stringify({
                user: document.getElementById("newUser").value,
                activity: document.getElementById("newActivity").value,
                endDate: document.getElementById("newEndDate").value
            }),
            headers: {
                'Content-type': "application/json",
            }
        });
        if (response.ok) {
            fetchData();
            document.getElementById("newUser").value = "";
            document.getElementById("newActivity").value = "";
            document.getElementById("newEndDate").value = "";
        }

    }

    const deleteSubscription = async (e, index) => {
        const response = await fetch("http://localhost:3001/deleteSubscription", {
            method: "post",
            body: JSON.stringify({
                user: subscriptionsData[index].user_id,
                activity: subscriptionsData[index].activity_id
            })
        });
        if (response.ok)
            fetchData();
    }

    return (
        <div className='container-fluid bg-dark min-vh-100'>
            <Row>
                <Col xs={12} md={2} className='bg-white min-vh-100'>
                    <AdminSidebar />
                </Col>
                <Col md={10}>
                       <h1 className= "text-center mb-3 text-light">Gestione Abbonamenti</h1>
                        <Card bg = "dark" border = "primary">
                            <Card.Body>
                                <Table  size="sm" responsive variant = "dark">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Attività</th>
                                            <th>Stato</th>
                                            <th>Scadenza</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptionsData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.user_name + " " + item.surname}</td>
                                                <td>{item.activity_name}</td>
                                                <td>{item.status ? "Valido" : "Scaduto"}</td>
                                                <td ><input type="date" value={item.endDate} className = "AdminInput CustomDateInput" onChange={(e) => handleChange(e, index)} />{' '}
                                                     <button className='btn btn-primary' onClick={(e) => rinnova(e, index)}>Rinnova</button></td>
                                                <td><button className='btn btn-danger' onClick={(e) => deleteSubscription(e, index)}>Elimina</button></td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>
                                                <select id="newUser" style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}>
                                                    <option value="0"></option>
                                                    {usersData.map(item => (
                                                        <option value={item.id} key = {item.id} className = "text-dark">{item.name + " " + item.surname}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select name="newActivity" id="newActivity" style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}>
                                                    <option value="0"></option>
                                                    {activitiesData.map(item => (
                                                        <option value={item.id} key={item.id} className = "text-dark">{item.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td><input type="text" disabled style={{ border: "none",background: "rgba(0,0,0,0)" }}></input></td>
                                            <td><input type="date" name="newDate" id="newEndDate" className = "CustomDateInput" style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input></td>
                                            <td><button className='btn btn-light' onClick={addSubscription}>Aggiungi</button></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminSubscriptions;