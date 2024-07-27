// src/components/Shifts.jsx

import React, { useEffect, useState } from 'react';
import { fetchShifts } from '../api'; // Tuo fetchShifts-funktio API-tiedostosta
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const Shifts = () => {
  const [shifts, setShifts] = useState([]); // Määrittele tila työvuoroille

  useEffect(() => {
    // Hae työvuorot API:sta
    fetchShifts()
      .then(response => {
        setShifts(response.data); // Aseta työvuorot tilaan
      })
      .catch(error => {
        console.error('Error fetching shifts:', error);
      });
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Työvuorot
        </Typography>
        <List>
          {shifts.map(shift => (
            <ListItem key={shift.id}>
              <ListItemText
                primary={`${shift.date} - ${shift.start_time} to ${shift.end_time}`}
                secondary={`Tunnit: ${shift.hours}, Tyyppi: ${shift.type}, Selite: ${shift.description}, Kilometrit: ${shift.kilometers}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Shifts;
