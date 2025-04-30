import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { students } from '../data/data';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const AdminDashboard = () => {
  const { user, mealStatus, updateMealStatus } = useApp();
  const navigate = useNavigate();
  const [scannedStudent, setScannedStudent] = useState(null);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }

    // Initialize QR code scanner
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scannerRef.current = scanner;

    scanner.render((decodedText) => {
      const student = students.find(s => s.email === decodedText);
      if (student) {
        setScannedStudent(student);
        setError('');
      } else {
        setError('Student not found');
        setScannedStudent(null);
      }
    }, () => {
      // Ignore errors
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [user, navigate]);

  const handleMealToggle = (mealType) => {
    if (scannedStudent) {
      const currentStatus = mealStatus[scannedStudent.email]?.[mealType] || false;
      updateMealStatus(scannedStudent.email, mealType, !currentStatus);
    }
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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                QR Code Scanner
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                <div id="qr-reader"></div>
              </Box>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scanned Student
              </Typography>
              {scannedStudent ? (
                <>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={scannedStudent.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={scannedStudent.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={scannedStudent.phone}
                      />
                    </ListItem>
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Meal Status
                  </Typography>
                  <Grid container spacing={2}>
                    {meals.map((meal) => (
                      <Grid item xs={6} key={meal.key}>
                        <Button
                          variant="contained"
                          fullWidth
                          color={mealStatus[scannedStudent.email]?.[meal.key] ? 'success' : 'primary'}
                          onClick={() => handleMealToggle(meal.key)}
                        >
                          {meal.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Typography color="text.secondary">
                  Scan a student's QR code to view their information
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 