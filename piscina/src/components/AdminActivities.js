import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Card, Form } from 'react-bootstrap';
import FileUpload from './FileUpload';
import AdminSidebar from './AdminSidebar';
import '../App.css';

function AdminActivities() {
    useEffect(() => {
        fetchData();
    }, []);

    const activitiesStyle = {
        color: "white",
    };

    const [activitiesData, setActivitiesData] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
    });

    const fetchData = async () => {
        const response = await fetch("http://localhost:3001/getActivitiesData");
        const data = await response.json();
        if (response.ok) {
            const mappedData = data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
            }));

            setActivitiesData(mappedData);
        } else alert("errore nel getActivitiesData");
    };

    async function edit(item) {
        const response = await fetch("http://localhost:3001/updateActivitiesData", {
            method: "post",
            credentials: 'include',
            body: JSON.stringify(item),
            headers: {
                'Content-type': "application/json",
            },
        });
        if (!response.ok) alert("Update failed");
    }

    const deleteItem = async (item) => {
        const response = await fetch("http://localhost:3001/deleteActivity", {
            method: "post",
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json'
            }
        });
        if(response.ok)
            fetchData();
    };

    const handleChange = (e, index) => {
        const field = e.target.name;
        const value = e.target.value;
        const updateRecordData = [...activitiesData];
        updateRecordData[index][field] = value;
        setActivitiesData(updateRecordData);
    };

    const [file, setFile] = useState([]);

    const handleChangeNewItem = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        let updateNewItem = { ...newItem };
        updateNewItem[field] = value;
        setNewItem(updateNewItem);
    };

    const addActivity = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", document.getElementById("newName").value);
        formData.append("description", document.getElementById("newDescription").value);

        const response = await fetch("http://localhost:3001/insertActivitiesData", {
            method: "post",
            credentials: 'include',
            body: formData,
        });
        if (response.ok) {
            //alert("Insert successfully");
            setNewItem({ name: "", description: "" });
            fetchData();
        }
    };

    return (
        <div className='container-fluid bg-dark min-vh-100'>
            <Row>
                <Col xs={12} md={2} className='bg-white min-vh-100'>
                    <AdminSidebar />
                </Col>

                <Col md={10}>
                    <div style={activitiesStyle}>
                        <h1 className= "text-center mb-3 text-light">Gestione Attività</h1>
                        <Card  bg = "dark" border = "primary">
                            <Card.Body>
                                <Table size="sm" responsive variant = "dark">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Photo</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activitiesData.map((item, index) => (
                                            <tr key={index}>
                                                <td> <input type="text" value={activitiesData[index].name} name="name" onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input> </td>
                                                <td> <input type="text" value={activitiesData[index].description} name="description" onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input> </td>
                                                <td>  <FileUpload url={"uploadActivitiesPhoto?id=" + item.id} /></td>
                                                <td> <button className="btn btn-light" type="submit" onClick={() => edit(item)}>Modifica</button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-danger' onClick={() => deleteItem(item)}>Elimina</button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>
                                                <input type="text" name="name" id="newName" value={newItem.name} placeholder = "Name" onChange={(e) => handleChangeNewItem(e)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                            </td>
                                            <td>
                                                <input type="text" name="description" id="newDescription" value={newItem.description} placeholder = "Description" onChange={(e) => handleChangeNewItem(e)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                            </td>
                                            <td>
                                                <label className=' btn btn-primary'>
                                                    Inserisci Foto
                                                    <input type="file" name="file" value={newItem.file} onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }}></input>
                                                </label>
                                            </td>
                                            <td>
                                                <button type="submit" className='btn btn-light' onClick={addActivity}>Aggiungi</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AdminActivities;
