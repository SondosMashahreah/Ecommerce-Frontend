import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { signupUser } from "../../services/api";


function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signupUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        password,
      });

      navigate("/verify-otp", {
        state: {
          email: email.trim(),
        },
      });

    } catch (error) {
      setError(
        error.message ||
        "Failed to create account"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            mb={1}
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Sign up to start shopping
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Full Name"
              fullWidth
              required
              margin="normal"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <TextField
              label="Username"
              fullWidth
              required
              margin="normal"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              helperText="Letters, numbers and underscore only"
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading
                ? "Creating Account..."
                : "Sign Up"}
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1 }}
              onClick={() =>
                navigate("/signin")
              }
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}


export default Signup;