import { Box, Button, Card, CardContent, Chip, Container, FormControlLabel, Grid, Stack, Switch, TextField, Typography, Alert } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DiamondIcon from "@mui/icons-material/Diamond";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

export default function TeaLandingPage() {

  // End date: October 2nd, 2025, 1 PM EST (UTC-4)
  const target = useMemo(() => new Date("2025-10-02T13:00:00-04:00"), []);
  const t = useCountdown(target);

  const [email, setEmail] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formEmail) {
      setFormError("Please enter your email address");
      return;
    }

    if (!validateEmail(formEmail)) {
      setFormError("Enter a valid email to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data to match the original form structure
      const formData = new FormData();
      formData.append('u', '9');
      formData.append('f', '9');
      formData.append('s', '');
      formData.append('c', '0');
      formData.append('m', '0');
      formData.append('act', 'sub');
      formData.append('v', '2');
      formData.append('or', 'a62f1522a75f4801557d059720d472e2');
      formData.append('email', formEmail);
      formData.append('field[5]', isDeveloper ? 'Yes' : 'No');

      const response = await fetch('https://teaxyz.activehosted.com/proc.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowThankYou(true);
        setFormEmail("");
        setIsDeveloper(false);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // reCAPTCHA handler would be implemented here in production

  return (
    <>
      <Helmet defer={false}>
        <title>tea is now live on CoinList - Early Access</title>
        <meta property="og:title" content="tea is now live on CoinList - Early Access" />
        <meta property="og:description" content="Be part of the future of open source. Join the official CoinList sale and support the tea protocol." />
        <meta property="og:image" content={`https://${import.meta.env.VITE_HOST}/coinlist-og.jpg`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${import.meta.env.VITE_HOST}/coinlist`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="tea is now live on CoinList - Early Access" />
        <meta name="twitter:description" content="Be part of the future of open source. Join the official CoinList sale and support the tea protocol." />
        <meta name="twitter:image" content={`https://${import.meta.env.VITE_HOST}/coinlist-og.jpg`} />
      </Helmet>

      <Box sx={{
        minHeight: "100dvh",
        background: "radial-gradient(1200px 600px at 20% -10%, rgba(124,58,237,.25), transparent 55%), radial-gradient(1200px 600px at 120% 10%, rgba(14,165,233,.25), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))",
      }}>
        {/* Hero */}
        <Container sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 12 } }}>
          <Stack spacing={4} alignItems="flex-start">
            <Chip label="Early Access" color="secondary" variant="outlined" sx={{ fontWeight: 700 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              tea is now live on CoinList
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={800}>
              Be part of the future of open source. PKGX built tea, and now you can join the movement by participating in the official CoinList sale.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              <Button size="large" variant="contained" color="primary" endIcon={<LaunchIcon />} href="https://coinlist.co" target="_blank" rel="noreferrer noopener">
                Join the CoinList Sale
              </Button>
              <Button size="large" variant="outlined" color="secondary" endIcon={<ArrowOutwardIcon />} href="https://tea.xyz" target="_blank" rel="noreferrer noopener">
                Learn more at tea.xyz
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} divider={<Box sx={{ width: 1, height: 1, opacity: 0 }} />}>
              <Typography variant="subtitle1" color="text.secondary">
                Sale ends in: {t.days}d {t.hours}h {t.minutes}m {t.seconds}s
              </Typography>
            </Stack>
          </Stack>
        </Container>

        {/* Why tea */}
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom fontWeight={800}>Why tea?</Typography>
              <Typography color="text.secondary" paragraph>
                Open source powers the apps, tools, and platforms you use every day — but the people who build it rarely get rewarded. <strong>tea changes that.</strong>
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleIcon color="primary" />
                  <Typography>A universal app store for open source</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleIcon color="primary" />
                  <Typography>Fair rewards for developers and maintainers</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleIcon color="primary" />
                  <Typography>Built to scale with the next generation of software and AI</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", background: "linear-gradient(180deg, rgba(124,58,237,.12), rgba(14,165,233,.08))", border: "1px solid rgba(255,255,255,.06)" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={800}>The CoinList Sale: Your Early Access</Typography>
                  <Typography color="text.secondary" paragraph>
                    The tea association has partnered with CoinList — trusted by millions of investors — to launch the tea token sale. This is your opportunity to join early and support the future of open source.
                  </Typography>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CalendarMonthIcon color="secondary" />
                      <Typography>
                        <strong>Sale ends:</strong> October 2nd, 2025 — 1 PM EST
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <DiamondIcon color="secondary" />
                      <Typography>
                        <strong>Token supply:</strong> Selling 4bn (Total supply 100bn)
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <VerifiedIcon color="secondary" />
                      <Typography>
                        <strong>How to join:</strong> Sign up on CoinList, complete verification, and participate
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                    <Button fullWidth variant="contained" color="primary" endIcon={<LaunchIcon />} href="https://coinlist.co" target="_blank" rel="noreferrer noopener">
                      Go to CoinList
                    </Button>
                    <Button fullWidth variant="outlined" color="secondary" href="#signup">
                      Get Updates
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Backed by Builders */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Backed by Builders & Trusted Platforms
          </Typography>
          <Typography color="text.secondary" paragraph maxWidth={900}>
            tea was built by <strong>PKGX</strong>, trusted across the developer ecosystem. The tea association ensures transparent, community-driven governance. With <strong>CoinList</strong>, you're participating through one of the most secure, compliant token sale platforms in crypto.
          </Typography>
        </Container>

        {/* Don't Miss Out */}
        <Container id="signup" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Don't Miss Out
              </Typography>
              <Typography color="text.secondary" paragraph>
                This is your chance to support the future of open source — and to be early.
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Sale ends in: {t.days}d {t.hours}h {t.minutes}m {t.seconds}s
              </Typography>
              <Button sx={{ mt: 2 }} variant="text" color="primary" endIcon={<LaunchIcon />} href="https://coinlist.co" target="_blank" rel="noreferrer noopener">
                Join the CoinList Sale Now
              </Button>
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                The tea token sale is offered through CoinList. Availability subject to regulations and eligibility. Nothing here is investment advice.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="text" color="secondary" endIcon={<ArrowOutwardIcon />} href="https://tea.xyz" target="_blank" rel="noreferrer noopener">
                  tea.xyz
                </Button>
                <Button variant="text" color="secondary" endIcon={<ArrowOutwardIcon />} href="https://pkgx.dev" target="_blank" rel="noreferrer noopener">
                  pkgx.dev
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Container sx={{ py: { xs: 8, md: 12 } }}>
                <Card sx={{ 
                  maxWidth: 600, 
                  mx: "auto", 
                  background: "linear-gradient(180deg, rgba(2,132,199,.14), rgba(124,58,237,.12))", 
                  border: "1px solid rgba(255,255,255,.06)" 
                }}>
                  <CardContent sx={{ p: 4 }}>
                    {!showThankYou ? (
                      <>
                        <Typography variant="h5" fontWeight={800} gutterBottom>
                          Stay Updated
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                          Get the latest updates about tea and the future of open source development.
                        </Typography>
                        
                        <Box component="form" onSubmit={handleFormSubmit} noValidate>
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              required
                              type="email"
                              label="Enter your email"
                              placeholder="Enter your email"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              error={!!formError && formError.includes("email")}
                              helperText={formError && formError.includes("email") ? formError : ""}
                            />

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={isDeveloper}
                                  onChange={(e) => setIsDeveloper(e.target.checked)}
                                  color="primary"
                                />
                              }
                              label="Are you a developer?"
                              sx={{ alignSelf: "flex-start" }}
                            />

                            {formError && !formError.includes("email") && (
                              <Alert severity="error" sx={{ mt: 1 }}>
                                {formError}
                              </Alert>
                            )}

                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              size="large"
                              fullWidth
                              disabled={isSubmitting}
                              sx={{ py: 1.5 }}
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                          </Stack>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
                          By submitting your email, you consent with our{" "}
                          <Button
                            component="a"
                            href="/privacy-policy"
                            variant="text"
                            color="primary"
                            sx={{ p: 0, minWidth: 0, textDecoration: "underline" }}
                          >
                            Privacy Policy
                          </Button>
                          .
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h5" fontWeight={800} gutterBottom>
                          Thank You!
                        </Typography>
                        <Typography color="text.secondary">
                          We'll keep you updated on tea and the future of open source.
                        </Typography>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => setShowThankYou(false)}
                          sx={{ mt: 2 }}
                        >
                          Submit Another Email
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Container>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box sx={{ py: 6, borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <Container>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
              <Typography color="text.secondary">© {new Date().getFullYear()} tea — All rights reserved.</Typography>
              <Stack direction="row" spacing={2}>
                <Button size="small" color="inherit" href="#">Terms</Button>
                <Button size="small" color="inherit" href="#">Privacy</Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
}