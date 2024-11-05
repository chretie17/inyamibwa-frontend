import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import api from '../api';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await api.get('/trainings');
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };
    fetchTrainings();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#000000', fontWeight: 'bold' }}>Available Trainings</Typography>
      <Grid container spacing={4}>
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <Grid item xs={12} sm={6} md={4} key={training.id}>
              <StyledCard>
                {training.file_type === 'video' ? (
                  <CardMedia
                    component="video"
                    controls
                    src={`data:video/mp4;base64,${training.file_data}`}
                    alt={training.title}
                    sx={{ height: 200, borderRadius: '8px' }}
                  />
                ) : (
                  <Placeholder>
                    <Typography variant="h6" color="textSecondary">PDF Preview</Typography>
                  </Placeholder>
                )}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>{training.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{training.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      if (training.file_type === 'pdf') {
                        // PDF Viewer logic
                        const byteCharacters = atob(training.file_data); // Decode base64
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'application/pdf' });
                        const pdfUrl = URL.createObjectURL(blob);
                        window.open(pdfUrl, '_blank');
                      }
                    }}
                  >
                    View {training.file_type === 'video' ? 'Video' : 'PDF'}
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            No trainings found
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Trainings;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const Placeholder = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #888;
`;
