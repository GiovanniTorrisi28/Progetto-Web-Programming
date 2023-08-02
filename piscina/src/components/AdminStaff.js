import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Card } from 'react-bootstrap';
import FileUpload from './FileUpload';
import '../App.css';
import AdminSidebar from './AdminSidebar';

function AdminStaff() {
    useEffect(() => {
        fetchData();
    }, []);

    const staffStyle = {
        color: "white",
    };

    const [staffData, setStaffData] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "",
        surname: "",
        instagram: "",
        linkedin: "",
        file: "",
    });

    const fetchData = async () => {
        const response = await fetch("http://localhost:3001/getStaffData");
        const data = await response.json();
        if (response.ok) {
            const mappedData = data.map((item) => ({
                id: item.id,
                name: item.name,
                surname: item.surname,
                instagram: item.instagram,
                linkedin: item.linkedin,
                file: item.photo,
            }));

            setStaffData(mappedData);
        } else alert("errore nel getStaffData");
    };

    async function edit(item) {
        const response = await fetch("http://localhost:3001/updateStaffData", {
            method: "post",
            credentials: 'include',
            body: JSON.stringify(item),
            headers: {
                'Content-type': "application/json",
            },
        });
        if (response.ok) alert("Update successfully");
    }

    const deleteItem = async (item) => {
        const response = await fetch("http://localhost:3001/deleteStaffData", {
            method: "post",
            body: JSON.stringify(item),
            headers: {
                'Content-type': "application/json"
            }
        });
        if(response.ok)
            fetchData();
    }

    const handleChange = (e, index) => {
        const field = e.target.name;
        const value = e.target.value;
        const updateRecordData = [...staffData];
        updateRecordData[index][field] = value;
        setStaffData(updateRecordData);
    };

    const [file, setFile] = useState([]);

    const handleChangeNewItem = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        let updateNewItem = { ...newItem };
        updateNewItem[field] = value;
        setNewItem(updateNewItem);
    };

    const addStaff = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", document.getElementById("newName").value);
        formData.append("surname", document.getElementById("newSurname").value);
        formData.append("instagram", document.getElementById("newInstagram").value);
        formData.append("linkedin", document.getElementById("newLinkedin").value);

        const response = await fetch("http://localhost:3001/insertStaffData", {
            method: "post",
            credentials: 'include',
            body: formData,
        });
        if (response.ok) {
            alert("Insert successfully");
            setNewItem({ name: "", surname: "", instagram: "", linkedin: "" });
            fetchData();
        }
        else if (response.status == 501)
            alert("I campi nome e cognome sono obbligatori");
    };

    return (
        <div className='container-fluid bg-dark min-vh-100 '>
            <Row>
                <Col xs={12} md={2} className='bg-light min-vh-100' >
                    <AdminSidebar />
                </Col>
                <Col md={10}>
                    <div style={staffStyle}>
                        <h1 className= "text-center mb-3 text-light">Gestione Staff</h1>
                        <Card border = "primary" bg = "dark">
                            <Card.Body>
                                <Table size="sm" variant='dark'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Instagram</th>
                                            <th>Linkedin</th>
                                            <th>Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staffData.map((item, index) => (
                                            <tr key={index}>
                                                <td> <input type="text" value={staffData[index].name} name="name" onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input> </td>
                                                <td> <input type="text" value={staffData[index].surname} name="surname" onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input> </td>
                                                <td>
                                                     <input type="text" value={staffData[index].instagram} name="instagram" placeholder='Instagram' onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                                </td>
                                                <td>
                                                <input type="text" value={staffData[index].linkedin} name="linkedin" placeholder='Linkedin' onChange={(e) => handleChange(e, index)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                                </td>

                                                <td>  <FileUpload url={"uploadStaffPhoto?id=" + item.id} /></td>
                                                <td>
                                                    <button className="btn btn-light" onClick={() => edit(item)}>Modifica</button>
                                                </td> 
                                                <td> 
                                                    <button className="btn btn-danger" onClick = {() => deleteItem(item)}>Elimina</button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>
                                                <input type="text" name="name" id="newName" value={newItem.name} placeholder = "Name" onChange={(e) => handleChangeNewItem(e)}  style={{ border: "none",background: "rgb(0,0,0,0)",color: "white" }} ></input>
                                            </td>
                                            <td>
                                                <input type="text" name="surname" id="newSurname" value={newItem.surname} placeholder = "Surname" onChange={(e) => handleChangeNewItem(e)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                            </td>
                                            <td>
                                                <input type="text" name="instagram" id="newInstagram" value={newItem.instagram} placeholder ='Instagram' onChange={(e) => handleChangeNewItem(e)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                            </td>
                                            <td>
                                                 <input type="text" name="linkedin" id="newLinkedin" value={newItem.linkedin} placeholder = "Linkedin" onChange={(e) => handleChangeNewItem(e)} style={{ border: "none",background: "rgba(0,0,0,0)",color: "white" }}></input>
                                           
                                            </td>
                                            <td>
                                                <label className=' btn btn-primary'>
                                                    Inserisci Foto
                                                    <input type="file" name="file" value={newItem.file} onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }}></input>
                                                </label>
                                            </td>
                                            <td>
                                                <button type="submit" className='btn btn-light' onClick={addStaff}>Aggiungi</button>
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

export default AdminStaff;
