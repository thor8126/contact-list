import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', website: '' });
    const [editContact, setEditContact] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteContact, setDeleteContact] = useState(null);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleAddContact = () => {
        setShowAddForm(true);
    };

    const handleAddFormSubmit = event => {
        event.preventDefault();
        axios.post('https://jsonplaceholder.typicode.com/users', newContact)
            .then(response => {
                setContacts([...contacts, response.data]);
                setShowAddForm(false);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setNewContact({ ...newContact, [name]: value });
    };

    const handleEditContact = contact => {
        setEditContact(contact);
    };

    const handleEditFormSubmit = event => {
        event.preventDefault();
        axios.put(`https://jsonplaceholder.typicode.com/users/${editContact.id}`, editContact)
            .then(response => {
                const updatedContacts = contacts.map(contact => {
                    if (contact.id === editContact.id) {
                        return response.data;
                    } else {
                        return contact;
                    }
                });
                setContacts(updatedContacts);
                setEditContact(null);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleEditInputChange = event => {
        const { name, value } = event.target;
        setEditContact({ ...editContact, [name]: value });
    };

    const handleDeleteContact = contact => {
        setDeleteContact(contact);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        axios.delete(`https://jsonplaceholder.typicode.com/users/${deleteContact.id}`)
            .then(response => {
                const updatedContacts = contacts.filter(contact => {
                    return contact.id !== deleteContact.id;
                });
                setContacts(updatedContacts);
                setDeleteContact(null);
                setShowDeleteConfirmation(false);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDeleteCancel = () => {
        setDeleteContact(null);
        setShowDeleteConfirmation(false);
    };
    return (
        <div className='container'>
            <h1>Contact List</h1>
            <button onClick={handleAddContact}>Add Contact</button>
            {showAddForm && (
                <>
                <div className="modal">
                <form style={{color:'white' }} className='addform' onSubmit={handleAddFormSubmit}>
                    <button className="close-btn" onClick={() => setShowAddForm(false)}>Close</button>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={newContact.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Email
                            :</label>
                        <input type="email" name="email" value={newContact.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input type="tel" name="phone" value={newContact.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Website:</label>
                        <input type="url" name="website" value={newContact.website} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Save</button>
                </form>
                </div>
                </>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Website</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>{contact.website}</td>
                            <td className='sidebar'>
                                <button className='edit-btn' onClick={() => handleEditContact(contact)}>Edit</button>
                                <button className='delete-btn' onClick={() => handleDeleteContact(contact)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editContact && (
                <div className="modal">
                    <form className='edit-form' onSubmit={handleEditFormSubmit}>
                        <button style={{color:'black'}} className="close-btn2" onClick={() => setEditContact(null)}>Close</button>
                        <br /><br />
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={editContact.name} onChange={handleEditInputChange} />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={editContact.email} onChange={handleEditInputChange} />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="tel" name="phone" value={editContact.phone} onChange={handleEditInputChange} />
                        </div>
                        <div>
                            <label>Website:</label>
                            <input type="text" name="website" value={editContact.website} onChange={handleEditInputChange} />
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className='modal'>
                    <p style={{ color: 'white' }}>Are you sure you want to delete {deleteContact.name}?</p>
                    <button onClick={handleDeleteConfirmation}>Yes</button>
                    <button onClick={handleDeleteCancel}>No</button>
                </div>
            )}
        </div>
    );
}

export default Contacts;