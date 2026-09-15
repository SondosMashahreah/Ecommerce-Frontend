import { translateError } from "../../i18n";
import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { sendContactMessage } from "../../services/api";

function Contact() {
  useTranslation(); // Subscribe this screen to language changes.

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [responseMessage, setResponseMessage] = useState("");

const handleSubmit = async (event) => {
  event.preventDefault();

  const contactData = {
    name,
    email,
    subject,
    message,
  };

  try {
const data = await sendContactMessage(contactData);

  setResponseMessage(data.message);

  window.location.reload();
} catch (error) {
  console.error("Error:", error);
  setResponseMessage("Could not connect to the backend.");
}
};

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>{t("Contact Us")}</Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >{t("Send us a message and we will get back to you.")}</Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label={t("Name")}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <TextField
              label={t("Email")}
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
              label={t("Subject")}
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />

            <TextField
              label={t("Message")}
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >{t("Send Message")}</Button>

            {responseMessage && (
              <Typography align="center">
                {translateError(responseMessage)}
              </Typography>
            )}
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default Contact;
