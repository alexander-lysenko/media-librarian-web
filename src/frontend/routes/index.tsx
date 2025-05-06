import { Button, Container, Grid, Typography } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <Container maxWidth='xl'>
      <Grid container spacing={4} sx={{ minHeight: '100vh', py: 8 }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant='h2' component='h1' gutterBottom>
            Welcome to Our App
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            Start managing your library efficiently with our powerful tools and features.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid>
              <Button variant='contained' size='large' component={Link} to='/app'>
                Get Started
              </Button>
            </Grid>
            <Grid>
              <Button variant='outlined' size='large' component={Link} to='/login'>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h1' sx={{ color: 'primary.main', opacity: 0.1, fontSize: '15rem' }}>
            MUI
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
