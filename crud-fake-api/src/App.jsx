import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const apiUrl = 'http://localhost:3000/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', age: '' });
  const [editableUserId, setEditableUserId] = useState(null);

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const addUser = () => {
    axios.post(apiUrl, newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ username: '', email: '', age: '' });
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const deleteUser = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  const editUser = (id) => {
    setEditableUserId(id);
  };

  const saveEditedUser = (editedUser) => {
    axios.put(`${apiUrl}/${editedUser.id}`, editedUser)
      .then(response => {
        setUsers(users.map(user => (user.id === editedUser.id ? response.data : user)));
        setEditableUserId(null);
      })
      .catch(error => console.error('Error editing user:', error));
  };

  return (
    <div>
      <h1>React CRUD</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      <table border={3}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr className='input' key={user.id}>
              <td>
                {editableUserId === user.id ? (
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUsers(users.map(u => (u.id === user.id ? { ...u, username: e.target.value } : u)))}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editableUserId === user.id ? (
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) => setUsers(users.map(u => (u.id === user.id ? { ...u, email: e.target.value } : u)))}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editableUserId === user.id ? (
                  <input
                    type="text"
                    value={user.age}
                    onChange={(e) => setUsers(users.map(u => (u.id === user.id ? { ...u, age: e.target.value } : u)))}
                  />
                ) : (
                  user.age
                )}
              </td>
              <td>
                {editableUserId === user.id ? (
                  <button onClick={() => saveEditedUser(user)}>Save</button>
                ) : (
                  <div>
                    <button onClick={() => editUser(user.id)}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
