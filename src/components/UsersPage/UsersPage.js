import React, { useState, useEffect } from 'react';
import '../../App.css';

function UsersPage() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [isReversed, setIsReversed] = useState(false); // State to track the arrow direction

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (response.ok) {
        const users = await response.json();
        setData(users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleRow = (userId) => {
    setExpandedRows(prevRows => ({
      ...prevRows,
      [userId]: !prevRows[userId]
    }));
  };
  const isRowExpanded = (userId) => expandedRows.includes(userId);

  const renderAddressDetails = (address) => (
    <div>
      <div style={{ display: 'flex', marginBottom: '5px' }}>
        <div style={{ marginLeft: '200px' }}>
          <p>Street: {address.street}</p>
          <p>Suite: {address.suite}</p>
        </div>
        <div style={{ marginLeft: '80px' }}>
          <p>City: {address.city}</p>
          <p>Zipcode: {address.zipcode}</p>
        </div>
      </div>
    </div>
  );

  const renderRevealButton = (userId) => (
    <td>
      <button
        className="reveal-btn"
        onClick={() => toggleRow(userId)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Toggle Details"
      >
        {expandedRows[userId] ? (
          <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8L8 1L15 8" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12L12 19L5 12" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </td>
  );

  const renderActionButtons = (user) => (
    <td className="actions">
      <button className="edit-btn" onClick={() => handleEdit(user)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20H21" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69698 19.8532 3.93083 19.9598 4.1882C20.0665 4.44557 20.1213 4.72142 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06916 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="delete-btn" aria-label="Delete" onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <svg width="20" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5H21" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11V17" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11V17" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </td>
  );

  const handleEdit = (user) => {
    setEditItem(user);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setPhone(user.phone);
    setShowModal(true);
    setIsNewUser(false);
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          address: {
            street,
            suite,
            city,
            zipcode,
          },
          phone,
        }),
      });
  
      if (response.ok) {
        const newUser = await response.json();
        setData([...data, newUser]);
        setShowModal(false);
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const handleEditUser = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editItem.id,
          name,
          username,
          email,
          address: {
            street,
            suite,
            city,
            zipcode,
          },
          phone,
        }),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        const updatedData = data.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setData(updatedData);
        setShowModal(false);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setData(data.filter(user => user.id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

 const renderTableData = () => {
    return data.map((user) => (
      <React.Fragment key={user.id}>
        <tr>
          {renderRevealButton(user.id)}
          <td className="left-align">{user.name}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          {renderActionButtons(user)}
        </tr>
        {expandedRows[user.id] && (
          <tr>
            <td colSpan="6">{renderAddressDetails(user.address)}</td>
          </tr>
        )}
      </React.Fragment>
    ));
  };


  return (
    <div className="users-page">
      <div className="background-ellipses">
        <div className="ellipse-1618"></div>
        <div className="ellipse-1619-container">
          <div className="ellipse-1619"></div>
        </div>
      </div>
      <h1 className="posts-heading">USERS</h1>
      <button
        className="create-post-btn"
        onClick={() => { setShowModal(true); setIsNewUser(true); }}
      >
        + CREATE USER
      </button>
      <div className="table-container" style={{ height: 'calc(100vh - 350px)' }}>
        <div className="table-scroll">
          <table className="post-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '5px' }}> </th>
                <th className="left-align">NAME</th>
                <th style={{ textAlign: 'left' }}>USERNAME</th>
                <th style={{ textAlign: 'left' }}>EMAIL</th>
                <th style={{ textAlign: 'left' }}>PHONE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
      {showModal && (
  <div className="modal-background">
    <div className="modal" style={{ width: '650px', height: '550px', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Montserrat' }}>
      <button className="back-btn" onClick={() => setShowModal(false)} style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '30px',
        height: '30px',
        border: 'none',
        borderRadius: '50%',
        backgroundColor: '#435560',
        color: 'white',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>&lt;</button>
      <h2 className="modal-heading" style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>{isNewUser ? 'Create User' : 'Edit User'}</h2>
      <div className="input-group">
        {/* Adjusted positioning and sizes for input fields */}
        <label htmlFor="name" style={{ position: 'absolute', left: '40px', top: '60px', color: 'white' }}>Name</label>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} style={{ position: 'absolute', left: '30px', top: '90px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="username" style={{ position: 'absolute', right: '230px', top: '60px', color: 'white' }}>Username</label>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ position: 'absolute', right: '30px', top: '90px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="email" style={{ position: 'absolute', left: '40px', top: '150px', color: 'white' }}>Email</label>
        <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ position: 'absolute', left: '30px', top: '180px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="phone" style={{ position: 'absolute', right: '250px', top: '150px', color: 'white' }}>Phone</label>
        <input type="text" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ position: 'absolute', right: '30px', top: '180px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="street" style={{ position: 'absolute', left: '40px', top: '240px', color: 'white' }}>Street</label>
        <input type="text" id="street" name="street" value={street} onChange={(e) => setStreet(e.target.value)} style={{ position: 'absolute', left: '30px', top: '270px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="suite" style={{ position: 'absolute', right: '260px', top: '240px', color: 'white' }}>Suite</label>
        <input type="text" id="suite" name="suite" value={suite} onChange={(e) => setSuite(e.target.value)} style={{ position: 'absolute', right: '30px', top: '270px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="city" style={{ position: 'absolute', left: '40px', top: '330px', color: 'white' }}>City</label>
        <input type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} style={{ position: 'absolute', left: '30px', top: '360px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="zipcode" style={{ position: 'absolute', right: '240px', top: '330px', color: 'white' }}>Zipcode</label>
        <input type="text" id="zipcode" name="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} style={{ position: 'absolute', right: '30px', top: '360px', borderRadius: '44px', width: '260px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
      </div>
      <div className="btn-group" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ borderRadius: '44px', width: '150px', height: '46px', backgroundColor: '#FFFFFF', color: '#11182A', marginRight: '10px', fontFamily: 'Montserrat' }}>Cancel</button>
        <button className="save-btn" onClick={isNewUser ? handleCreateUser : handleEditUser} style={{ borderRadius: '44px', width: '150px', height: '46px', backgroundColor: '#68ECED', color: '#11182A', fontFamily: 'Montserrat' }}>{isNewUser ? 'Create' : 'Save'}</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default UsersPage;
