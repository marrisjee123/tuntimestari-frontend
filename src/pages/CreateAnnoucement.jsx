import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Grid, Paper, MenuItem } from '@mui/material';
import { fetchGroups, createAnnouncement } from '../api';
import { useAuth } from '../context/AuthContext';
import { Editor } from '@tinymce/tinymce-react';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groups, setGroups] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await fetchGroups();
        setGroups(response);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchAllGroups();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createAnnouncement(title, content, groupId);
      alert('Announcement created successfully');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Announcement
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Editor
                apiKey="your-tinymce-api-key"
                value={content}
                onEditorChange={(newValue) => setContent(newValue)}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Visibility"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <MenuItem value="">Whole Organization</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Announcement
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateAnnouncement;
