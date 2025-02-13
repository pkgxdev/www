import React from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";

// Social Proof Data
const socialProofData = [
  { number: "73M+", label: "developers" },
  { number: "1B+", label: "contributors" },
  { number: "4M+", label: "organizations" },
  { number: "99.9%", label: "uptime" },
];

const TeaProtocol = () => {
  return (
    <>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Column - Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h1" gutterBottom>
              Tea Protocol
            </Typography>
            <Typography variant="body1" paragraph>
              A revolutionary new way to brew, share, and enjoy tea with the power of decentralized technology.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Get Started
            </Button>
          </Grid>

          {/* Right Column - Image Placeholder */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                height: 300,
                backgroundColor: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Image Placeholder
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </Container>

      {/* Social Proof Section */}
      <Box sx={{ py: 8, textAlign: "center", backgroundColor: "#121212", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {socialProofData.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Typography variant="h3" component="div" fontWeight="bold">
                  {item.number}
                </Typography>
                <Typography variant="body1" color="grey.500">
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default TeaProtocol;
