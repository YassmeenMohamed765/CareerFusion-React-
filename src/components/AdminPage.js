import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup, FormControl, Table } from 'react-bootstrap';
//import './admin.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editableUserId, setEditableUserId] = useState(null); // Track the ID of the user being edited
  const [updatedInfo, setUpdatedInfo] = useState({}); // Track the updated user information
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:5266/api/crud/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUsernameClick = async (userId) => {
    try {
      navigate(`/admin-view/${userId}`);
    } catch (error) {
      console.error('Navigation to admin view failed:', error);
    }
  };

  const editUser = (userId) => {
    // Set the user ID being edited and initialize updatedInfo with the current user's data
    setEditableUserId(userId);
    const userToUpdate = users.find(user => user.userId === userId);
    setUpdatedInfo(userToUpdate);
  };

  const saveUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5266/api/crud/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (response.ok) {
        console.log('User updated successfully');
        setEditableUserId(null); // Reset editableUserId after saving
        getUsers(); // Refresh the user list after an update
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      console.log('Deleting user with ID:', userId);
      const response = await fetch(`http://localhost:5266/api/crud/userDel/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('User deleted successfully');
        alert('User deleted successfully');
        getUsers();
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Container>
        <h1 className="mt-5 mb-4">Admin Page</h1>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>
                  {editableUserId === user.userId ? (
                    <FormControl
                      type="text"
                      name="userName"
                      value={updatedInfo.userName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span onClick={() => handleUsernameClick(user.userId)}>{user.userName}</span>
                  )}
                </td>
                <td>
                  {editableUserId === user.userId ? (
                    <FormControl
                      type="text"
                      name="fullName"
                      value={updatedInfo.fullName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.fullName}</span>
                  )}
                </td>
                <td>
                  {editableUserId === user.userId ? (
                    <FormControl
                      type="text"
                      name="email"
                      value={updatedInfo.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </td>
                <td>
                  {editableUserId === user.userId ? (
                    <FormControl
                      type="text"
                      name="phoneNumber"
                      value={updatedInfo.phoneNumber}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.phoneNumber}</span>
                  )}
                </td>
                <td>
                  {editableUserId === user.userId ? (
                    <Button variant="success" onClick={() => saveUser(user.userId)}>Save</Button>
                  ) : (
                    <>
                      <Button variant="primary" onClick={() => editUser(user.userId)}>Edit</Button>{' '}
                      <Button variant="danger" onClick={() => deleteUser(user.userId)}>Delete</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminPage;
