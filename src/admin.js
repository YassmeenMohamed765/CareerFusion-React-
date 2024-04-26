import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./admin.css"

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
      const response = await fetch('/api/crud/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUsernameClick = async (userId) => {
    try {
      const response = await fetch(`/api/crud/user/${userId}`);
      navigate(`/user/${userId}`, { state: response.data });
    } catch (error) {
      console.error('Error fetching user information:', error.message);
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
      const response = await fetch(`/api/crud/updateUser/${userId}`, {
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
      const response = await fetch(`/api/crud/userDel/${userId}`, {
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
      <div className="header">
        <h1>Admin Page</h1>
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="section-title">
          <span>Users</span>
        </div>
        <div className="section-content">
          {filteredUsers.map((user) => (
            <div className="user-item" key={user.userId}>
              <div>
                {editableUserId === user.userId ? (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={updatedInfo.fullName}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="email"
                      value={updatedInfo.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={updatedInfo.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </>
                ) : (
                  <>
                    <span onClick={() => handleUsernameClick(user.userId)}>{user.userName}</span>
                    <p>{user.fullName}</p>
                    <p>{user.email}</p>
                    <p>{user.phoneNumber}</p>
                  </>
                )}
              </div>
              {editableUserId === user.userId ? (
                <button onClick={() => saveUser(user.userId)}>Save</button>
              ) : (
                <button onClick={() => editUser(user.userId)}>Edit</button>
              )}
              <button onClick={() => { console.log(user); deleteUser(user.userId); }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
