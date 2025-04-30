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
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';

// Add custom styles for QR scanner
const qrScannerStyles = `
  #qr-reader button {
    color: #1976D2 !important;
    background-color: white !important;
    border: 2px solid #1976D2 !important;
    padding: 8px 16px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s ease-in-out !important;
  }
  #qr-reader button:hover {
    background-color: #1976D2 !important;
    color: white !important;
  }
  #qr-reader__scan_region {
    background-color: white !important;
    border-radius: 12px !important;
  }
  #qr-reader__scan_region video {
    border-radius: 12px !important;
  }
`;

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

const StyledButton = styled(Button)(({ theme, served }) => ({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  background: served 
    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: served
    ? '0 3px 5px 2px rgba(76, 175, 80, .3)'
    : '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  '&:hover': {
    background: served
      ? 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)'
      : 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  borderRadius: '12px',
  padding: '8px 16px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
  boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #d32f2f 30%, #ef5350 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const AdminDashboard = () => {
  const { user, mealStatus, updateMealStatus, logout } = useApp();
  const navigate = useNavigate();
  const [scannedStudent, setScannedStudent] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }

    // Add custom styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = qrScannerStyles;
    document.head.appendChild(styleElement);

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
      // Remove custom styles
      document.head.removeChild(styleElement);
    };
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMealToggle = (mealType) => {
    setSelectedMeal(mealType);
    setShowConfirmation(true);
  };

  const confirmMealService = () => {
    if (scannedStudent && selectedMeal) {
      updateMealStatus(scannedStudent.email, selectedMeal, true);
      setShowConfirmation(false);
      setShowSuccess(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setScannedStudent(null);
        setSelectedMeal(null);
        setShowSuccess(false);
        // Reinitialize scanner
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current.render((decodedText) => {
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
        }
      }, 2000);
    }
  };

  const cancelMealService = () => {
    setShowConfirmation(false);
    setSelectedMeal(null);
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
      <LogoutButton
        variant="contained"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </LogoutButton>
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
          Admin Dashboard
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
                QR Code Scanner
              </Typography>
              <Box sx={{ 
                width: '100%', 
                maxWidth: 400, 
                mx: 'auto',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}>
                <div id="qr-reader"></div>
              </Box>
              {error && (
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 2,
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {error}
                </Typography>
              )}
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
                Scanned Student
              </Typography>
              {scannedStudent ? (
                <>
                  <List sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    mb: 3,
                  }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 600, color: '#1976D2' }}>
                            Name
                          </Typography>
                        }
                        secondary={scannedStudent.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 600, color: '#1976D2' }}>
                            Email
                          </Typography>
                        }
                        secondary={scannedStudent.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 600, color: '#1976D2' }}>
                            Phone
                          </Typography>
                        }
                        secondary={scannedStudent.phone}
                      />
                    </ListItem>
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: '#1976D2',
                      mb: 2,
                    }}
                  >
                    Meal Status
                  </Typography>
                  <Grid container spacing={2}>
                    {meals.map((meal) => (
                      <Grid item xs={6} key={meal.key}>
                        <StyledButton
                          fullWidth
                          served={mealStatus[scannedStudent.email]?.[meal.key]}
                          onClick={() => handleMealToggle(meal.key)}
                          disabled={mealStatus[scannedStudent.email]?.[meal.key]}
                        >
                          {meal.name}
                        </StyledButton>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Typography 
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    opacity: 0.7,
                  }}
                >
                  Scan a student's QR code to view their information
                </Typography>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={cancelMealService}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#1976D2', fontWeight: 600 }}>
          Confirm Meal Service
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark {selectedMeal?.charAt(0).toUpperCase() + selectedMeal?.slice(1)} as served for {scannedStudent?.name}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button 
            onClick={cancelMealService}
            sx={{ 
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmMealService}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
          sx={{ width: '100%' }}
        >
          Meal has been served successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard; 