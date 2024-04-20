import React, { useState, useEffect } from 'react';
import '../../App.css'; 

function PostsPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [usernames, setUsernames] = useState([]);
  const [isNewPost, setIsNewPost] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultBody, setDefaultBody] = useState('');
  const [defaultUsername, setDefaultUsername] = useState('');
  const [isValidUser, setIsValidUser] = useState(false); // Track if a valid user is selected
  const [selectedUserIds, setSelectedUserIds] = useState({}); // Track userIds for each edited item
  const [selectedUserIdTemp, setSelectedUserIdTemp] = useState(''); // Temporary storage for selected user ID

  useEffect(() => {
    fetchPosts();
    fetchUsernames();
  }, []);

  useEffect(() => {
    // Check if a valid user is selected
    setIsValidUser(!!selectedUserId);
  }, [selectedUserId]);

  const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (response.ok) {
      const posts = await response.json();
      setData(posts);
    } else {
      console.error('Failed to fetch posts');
    }
  };

  const fetchUsernames = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (response.ok) {
      const users = await response.json();
      setUsernames(users.map(user => ({ id: user.id, username: user.username })));
    } else {
      console.error('Failed to fetch usernames');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
    setIsNewPost(false);
    setDefaultTitle(item.title);
    setDefaultBody(item.body);
    setDefaultUsername(item.username);
    setSelectedUserId(item.userId);  // Capture the current userId when editing starts
};

  const handleCreatePost = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: defaultTitle,
        body: defaultBody,
        userId: selectedUserIdTemp, // Use the temporary user ID for new post
        username: defaultUsername
      })
    });
    if (response.ok) {
      const newPost = await response.json();
      setData([...data, newPost]);
      setShowModal(false);
    } else {
      console.error('Failed to create post');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData(data.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete post');
      }
    }
  };
  const handleSavePost = async () => {
    if (!isValidUser && !isNewPost) {
      console.error('Cannot save post with unknown username');
      return;
    }
    const url = `https://jsonplaceholder.typicode.com/posts/${editItem.id}`;
    const requestBody = {
      id: editItem.id,
      title: defaultTitle,
      body: defaultBody,
      userId: selectedUserId,  // Use the locally updated userId, not from prevState
      username: defaultUsername,
    };
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      // Update the state with the updated post including the new user ID
      setData(data.map(item => item.id === updatedPost.id ? updatedPost : item));
      setShowModal(false);
    } else {
      console.error('Failed to save post');
    }
};

const handleUsernameChange = (e) => {
  const selectedUsername = e.target.value;
  setDefaultUsername(selectedUsername);
  const user = usernames.find(user => user.username === selectedUsername);
  if (user) {
    const newSelectedUserId = user.id;
    setIsValidUser(true);
    setSelectedUserId(newSelectedUserId);  // Update the selectedUserId for saving
    setSelectedUserIdTemp(newSelectedUserId);  // Update the temporary userId to display in the input field
  } else {
    setIsValidUser(false);
    setSelectedUserId('');  // Clear selected user ID if invalid user is picked
    setSelectedUserIdTemp('');  // Also clear the temporary user ID
  }
};


const renderTableData = () => {
  return data.map((item) => (
    <tr key={item.id}>
      <td>#{selectedUserIds[item.id] || item.userId}</td> {/* Prefixing the user ID with # */}
      <td>{item.title}</td>
      <td>
        <button className="edit-btn" onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20H21" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69698 19.8532 3.93083 19.9598 4.1882C20.0665 4.44557 20.1213 4.72142 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06916 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="delete-btn" onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="20" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11V17" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11V17" stroke="#D6D6D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  ));
};




  return (
    <div className="posts-page">
      <h1 className="posts-heading">POSTS</h1>
      <button className="create-post-btn" onClick={() => { setShowModal(true); setIsNewPost(true); }}>+ Create Post</button>
      <div className="table-container">
        <div className="table-scroll">
          <table className="post-table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>TITLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
      {showModal && (
  <div className="modal-background">
    <div className="modal" style={{ width: '600px', height: '400px', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Montserrat' }}>
      <button className="back-btn" onClick={() => setShowModal(false)}>&lt;</button> {/* Back Arrow */}
      <h2 className="modal-heading" style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>{isNewPost ? 'Create Post' : 'Edit Post'}</h2>
      <div className="input-group">
        <label htmlFor="username" style={{ position: 'absolute', left: '40px', top: '100px', color: 'white' }}>Username</label>
        <select
          id="username"
          name="username"
          value={defaultUsername}
          onChange={handleUsernameChange}
          style={{ position: 'absolute', left: '30px', top: '130px', borderRadius: '44px', width: '200px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }}
        >
          <option value="">Select username</option>
          {usernames.map(user => (
            <option key={user.id} value={user.username}>{user.username}</option>
          ))}
        </select>
        <label htmlFor="userId" style={{ position: 'absolute', right: '250px', top: '100px', color: 'white' }}>User ID</label>
        <input type="text" id="userId" name="userId" value={selectedUserIdTemp} readOnly={!isNewPost} style={{ position: 'absolute', right: '100px', top: '130px', borderRadius: '44px', width: '200px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />

        <label htmlFor="title" style={{ position: 'absolute', left: '40px', top: '200px', color: 'white' }}>Title</label>
        <input type="text" id="title" name="title" value={defaultTitle} onChange={(e) => setDefaultTitle(e.target.value)} style={{ position: 'absolute', left: '30px', top: '230px', borderRadius: '44px', width: '200px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
        <label htmlFor="body" style={{ position: 'absolute', right: '265px', top: '200px', color: 'white' }}>Body</label>
        <input type="text" id="body" name="body" value={defaultBody} onChange={(e) => setDefaultBody(e.target.value)} style={{ position: 'absolute', right: '100px', top: '230px', borderRadius: '44px', width: '200px', height: '36px', backgroundColor: '#2E3549', color: 'white', textAlign: 'center' }} />
      </div>
      <div className="btn-group" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        <button className="cancel-btn" onClick={() => setShowModal(false)} style={{ borderRadius: '44px', width: '150px', height: '40px', backgroundColor: '#FFFFFF', color: '#11182A', marginRight: '10px', fontFamily: 'Montserrat' }}>Cancel</button>
        <button className="save-btn" onClick={isNewPost ? handleCreatePost : handleSavePost} disabled={!isValidUser} style={{ borderRadius: '44px', width: '150px', height: '40px', backgroundColor: '#68ECED', color: '#11182A', fontFamily: 'Montserrat' }}>{isNewPost ? 'Create Post' : 'Save Post'}</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default PostsPage;


