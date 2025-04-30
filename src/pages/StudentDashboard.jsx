import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

const StudentDashboard = () => {
  const { user, mealStatus } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const meals = [
    { name: 'Breakfast', key: 'breakfast' },
    { name: 'Lunch', key: 'lunch' },
    { name: 'Snacks', key: 'snacks' },
    { name: 'Dinner', key: 'dinner' }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Student Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your QR Code
              </Typography>
              <QRCodeSVG value={user.email} size={200} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Meal Status
              </Typography>
              <Grid container spacing={2}>
                {meals.map((meal) => (
                  <Grid item xs={6} key={meal.key}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: mealStatus[user.email]?.[meal.key] ? 'success.light' : 'grey.200'
                      }}
                    >
                      <Typography variant="subtitle1">{meal.name}</Typography>
                      <Typography variant="body2">
                        {mealStatus[user.email]?.[meal.key] ? 'Served' : 'Not Served'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDashboard; 