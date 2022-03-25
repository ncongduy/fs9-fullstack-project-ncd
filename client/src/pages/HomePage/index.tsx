import { Container, Grid } from '@mui/material';
import { useEffect } from 'react';

import bookApi from '../../fetchApi/bookApi';
import './homepage.css';

type HomePageProps = {};

function HomePage(props: HomePageProps) {
  useEffect(() => {
    bookApi.getAllBooks().then((res) => console.log('print book in HomePage component: ', res));
  }, []);

  return (
    <Container className="container">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="item"></div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="item"></div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="item"></div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="item"></div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="item"></div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
