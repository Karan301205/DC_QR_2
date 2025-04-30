import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const MealCard = styled(Paper)(({ theme, served }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '12px',
  background: served ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' : 'rgba(255, 255, 255, 0.8)',
  color: served ? 'white' : 'inherit',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const StudentDashboard = () => {
  const { user, mealStatus, notifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check for new notifications
    const userNotifications = notifications[user?.email] || {};
    const unreadNotification = Object.entries(userNotifications).find(
      ([_, notification]) => !notification.read
    );

    if (unreadNotification) {
      const [mealType, notification] = unreadNotification;
      setCurrentNotification(notification);
      setOpenNotification(true);
      markNotificationAsRead(user.email, mealType);
    }
  }, [notifications, user, markNotificationAsRead]);

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  if (!user) return null;

  const meals = [
    { name: 'Breakfast', key: 'breakfast' },
    { name: 'Lunch', key: 'lunch' },
    { name: 'Snacks', key: 'snacks' },
    { name: 'Dinner', key: 'dinner' }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        mt: 4,
        mb: 4,
        minHeight: '100vh',
        py: 4,
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontWeight: 700,
            color: '#1976D2',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Student Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper className="fade-in">
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{
                  fontWeight: 600,
                  color: '#1976D2',
                  mb: 3,
                }}
              >
                Your QR Code
              </Typography>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}>
                <QRCodeSVG 
                  value={user.email} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </Box>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#1976D2',
                  mb: 3,
                }}
              >
                Meal Status
              </Typography>
              <List sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
              }}>
                {meals.map((meal) => (
                  <ListItem key={meal.key}>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, color: '#1976D2' }}>
                          {meal.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: mealStatus[user.email]?.[meal.key]
                              ? '#4CAF50'
                              : '#f44336',
                            fontWeight: 500,
                          }}
                        >
                          {mealStatus[user.email]?.[meal.key]
                            ? 'Served'
                            : 'Not Served'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          icon={<NotificationsIcon />}
        >
          {currentNotification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentDashboard; 