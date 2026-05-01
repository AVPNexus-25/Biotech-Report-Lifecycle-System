import { useEffect, useState } from 'react';
import axios from 'axios';

// MUI
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const roles = ['admin', 'analyst', 'manager', 'client'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  const token = localStorage.getItem('token');

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Open Modal
  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(
      user || { name: '', email: '', password: '', role: 'client' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  // 🔹 Save User
  const handleSubmit = async () => {
    if (editUser) {
      await axios.put(
        `http://localhost:5000/api/users/${editUser._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post('http://localhost:5000/api/users', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    handleClose();
    fetchUsers();
  };

  // 🔹 Delete User
  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    }
  };

  // 🔹 Table Columns
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </>
      ),
      flex: 1
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Users Management
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>
        Add User
      </Button>

      <Box mt={2} style={{ height: 400 }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>

      {/* 🔹 Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />

          {!editUser && (
            <TextField
              margin="dense"
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
          )}

          <TextField
            margin="dense"
            select
            label="Role"
            name="role"
            fullWidth
            value={form.role}
            onChange={handleChange}
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}