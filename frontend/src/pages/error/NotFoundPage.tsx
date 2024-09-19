
// complete component use mui
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404 Not Found
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        We couldn't find the page you're looking for.
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Try going back to the <span onClick={() => navigate('/')}>home page</span>.
      </Typography>
    </Box>
  );
}