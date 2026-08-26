import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Contact() {
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
    const response = await fetch("http://127.0.0.1:8000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.reload();
    } else {
      setResponseMessage(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    setResponseMessage("Could not connect to the backend.");
  }
};

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Contact Us
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Send us a message and we will get back to you.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />

            <TextField
              label="Message"
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
            >
              Send Message
            </Button>

            {responseMessage && (
              <Typography align="center">
                {responseMessage}
              </Typography>
            )}
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default Contact;
