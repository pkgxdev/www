import React from "react";
import { Container, Grid, Typography, Button, Box, Link, Stack } from "@mui/material";
import teaImage from "/src/assets/tea-icon.svg"; // Hero Image
import backgroundPattern from "/src/assets/pkgx-bg-pattern-right.svg"; // Full-Page Background Image

// Social Proof Data
const socialProofData = [
  { number: "1,212,925", label: "Total Blocks" },
  { number: "2.17", label: "Daily Transactions" },
  { number: "72,160,103", label: "Total Transactions" },
  { number: "81,122,220", label: "Wallet Addresses" },
];

// Feature Section Data
const features = [
  { title: "Feature One", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod nec sapien nec vestibulum. Ut vestibulum, ligula mattis efficitur gravida, enim sem bibendum magna, vel fermentum tortor leo dapibus magna. Sed varius rutrum sapien a suscipit. Integer magna lorem, dictum eu dapibus tincidunt, venenatis." },
  { title: "Feature Two", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod nec sapien nec vestibulum. Ut vestibulum, ligula mattis efficitur gravida, enim sem bibendum magna, vel fermentum tortor leo dapibus magna. Sed varius rutrum sapien a suscipit. Integer magna lorem, dictum eu dapibus tincidunt, venenatis." },
  { title: "Feature Three", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod nec sapien nec vestibulum. Ut vestibulum, ligula mattis efficitur gravida, enim sem bibendum magna, vel fermentum tortor leo dapibus magna. Sed varius rutrum sapien a suscipit. Integer magna lorem, dictum eu dapibus tincidunt, venenatis." },
  { title: "Feature Four", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod nec sapien nec vestibulum. Ut vestibulum, ligula mattis efficitur gravida, enim sem bibendum magna, vel fermentum tortor leo dapibus magna. Sed varius rutrum sapien a suscipit. Integer magna lorem, dictum eu dapibus tincidunt, venenatis." }
];

const TeaProtocol = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: "contain",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Hero Section */}
      {/* Hero Section */}
<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
  <Grid container spacing={4} alignItems="center">
    
    {/* Left Column - Text Content */}
    <Grid item xs={12} md={6}>
      <Typography 
        sx={{ fontSize: "14px", fontWeight: 500, textTransform: "uppercase", color: "#F26212", mb: 1 }}
      >
        From the creator of homebrew
      </Typography>
      <Typography 
        variant="h1" 
        gutterBottom 
        sx={{ fontWeight: 800, fontSize: "48px", lineHeight: "58px", color: "#EDF2EF" }}
      >
        Get rewards for your <span style={{ color: "#F26212" }}>open source</span> contributions.
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF", mb: 3 }}>
        PKGX is a core contributor to tea Protocol, a web3 project that empowers you to support the most important OSS projects, earn rewards, and gain recognition for your open source contributions. Have an open source project? Check out tea Protocol and discover your project's teaRank!
      </Typography>
      <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          href="https://tea.xyz"
          sx={{ textTransform: "none" }}
        >
          Get started on testnet
        </Button>
    </Grid>

    {/* Right Column - Hero Image (Hidden on Mobile) */}
    <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
      <Box
        component="img"
        src="/src/assets/tea-icon.svg"
        alt="Tea Protocol Homepage"
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
        }}
      />
    </Grid>

  </Grid>
</Container>


      {/* Metrics Section */}
      <Container maxWidth="lg" sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: "700px", mx: "auto" }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF" }}
          >
            Everyone's <span style={{ color: "#F26212" }}>sipping the tea</span>.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
            tea Protocol is trusted by hundreds of thousands of developers, contributors, and organizations worldwide.
            See the impact we've made in the open-source community.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {socialProofData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Typography sx={{ fontWeight: "bold", fontSize: "32px", color: "#EDF2EF" }}>
                {item.number}
              </Typography>
              <Typography variant="body1" sx={{ color: "#EDF2EF" }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Side */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h2" 
              sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF" }}
            >
              There's something brewing for <span style={{ color: "#F26212" }}>everyone</span>.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
              There are plenty of ways for developers and speculators alike to participate in tea's testnet. This is just any web3 project; tea is the network for developers, and they're changing the way the world interacts with open source software. 
            </Typography>
          </Grid>

          {/* Right Side (Feature List) */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#EDF2EF" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#EDF2EF" }}>
                    {feature.description}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Container>

{/* Final Call-to-Action Section */}
<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
  <Grid container spacing={4} alignItems="center">
    
    {/* Left Column - Text & Buttons */}
    <Grid item xs={12} md={6}>
      <Typography 
        variant="h2" 
        gutterBottom
        sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF" }}
      >
        Ready to <span style={{ color: "#F26212" }}>Get Started</span>?
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
        Join the tea party and start making your mark on the testnet. The open source revolution is here and you can be a part of it. We, here at PKGX, are super proud of the work we've done on tea, and we can't wait to hear your feedback. 
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          href="https://tea.xyz"
          sx={{ textTransform: "none" }}
        >
          Get started on testnet
        </Button>
      </Stack>
    </Grid>

    {/* Right Column - Updated Image */}
    <Grid item xs={12} md={6}>
        <Box
            component="img"
            src="/src/assets/pkgx-3d-glyphs.png"
            alt="PKGX 3D Glyphs"
            sx={{
            width: "100%",
            height: "auto",
            borderRadius: "8px"
            }}
        />
        </Grid>

    </Grid>
    </Container>

    </Box>
  );
};

export default TeaProtocol;
