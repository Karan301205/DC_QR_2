import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { students } from '../data/data';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useApp();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Admin login
    if (email === 'admin123' && phone === 'admin000') {
      login({ role: 'admin' });
      navigate('/admin');
      return;
    }

    // Student login
    const student = students.find(s => s.email === email && s.phone === phone);
    if (student) {
      login({ ...student, role: 'student' });
      navigate('/student');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledPaper elevation={3} className="fade-in">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              fontWeight: 700,
              color: '#1976D2',
              mb: 4,
            }}
          >
            Welcome Back
          </Typography>
          <form onSubmit={handleLogin}>
            <StyledTextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />
            <StyledTextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
              variant="outlined"
            />
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
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4 }}
            >
              Sign In
            </StyledButton>
          </form>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Login; 