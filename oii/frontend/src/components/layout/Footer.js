import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Pinterest,
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About OII
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop destination for fashion. We bring you the latest trends
              and styles from around the world.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="primary" aria-label="Pinterest">
                <Pinterest />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Link
                component={RouterLink}
                to="/about"
                color="text.secondary"
                underline="hover"
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="text.secondary"
                underline="hover"
              >
                Contact Us
              </Link>
              <Link
                component={RouterLink}
                to="/faq"
                color="text.secondary"
                underline="hover"
              >
                FAQ
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                color="text.secondary"
                underline="hover"
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                color="text.secondary"
                underline="hover"
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subscribe to receive updates, access to exclusive deals, and more.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                placeholder="Enter your email"
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" color="primary">
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} OII. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
