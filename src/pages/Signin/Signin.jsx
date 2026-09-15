import { notifySessionChange } from '../../services/session';
import { translateError } from "../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
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

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  signinUser,
  getCurrentUser,
} from "../../services/api";


function Signin() {
  useTranslation(); // Subscribe this screen to language changes.

  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success] = useState(
    location.state?.message || ""
  );


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const data = await signinUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        data.refresh_token
      );

      const user = await getCurrentUser();

      notifySessionChange();

      if (user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
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
          >{t("Sign In")}</Typography>


          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >{t("Sign in to your account")}</Typography>


          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {translateError(error)}
            </Alert>
          )}


          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
            >
              {translateError(success)}
            </Alert>
          )}


          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            <TextField
              label={t("Email")}
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
              label={t("Password")}
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
              disabled={submitting}
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >{t("Sign In")}</Button>


            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1 }}
              onClick={() =>
                navigate("/signup")
              }
            >{t("Don't have an account? Sign Up")}</Button>

            <Button fullWidth variant="outlined" sx={{ mt: 2 }} disabled={submitting}
              onClick={() => navigate("/", { replace: true })}>
              {t("Continue as guest")}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              {t("Your guest cart stays on this browser when you return.")}
            </Typography>
          </Box>

        </Paper>

      </Box>

    </Container>
  );
}


export default Signin;