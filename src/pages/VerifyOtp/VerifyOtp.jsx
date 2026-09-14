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
import { useLocation, useNavigate } from "react-router-dom";

import { verifyOtp } from "../../services/api";

function VerifyOtp() {
  useTranslation(); // Subscribe this screen to language changes.

  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await verifyOtp({
        email,
        otp,
      });

      navigate("/signin", {
        state: {
          message: "Account verified successfully. Please sign in.",
          email,
        },
      });
    } catch (error) {
      setError(error.message);
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
          >{t("Verify OTP")}</Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >{t("Enter the code sent to your email")}</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {translateError(error)}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label={t("Email")}
              type="email"
              fullWidth
              required
              disabled
              margin="normal"
              value={email}
            />

            <TextField
              label={t("OTP Code")}
              fullWidth
              required
              margin="normal"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              inputProps={{
                maxLength: 6,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >{t("Verify")}</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default VerifyOtp;
