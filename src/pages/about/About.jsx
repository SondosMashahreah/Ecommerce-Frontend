import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

function About() {
  useTranslation(); // Subscribe this screen to language changes.

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>

        <Typography variant="h4" align="center" gutterBottom>{t("About Us")}</Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >{t("Welcome to our online electronics store.")}</Typography>

        <Stack spacing={3}>

          <Typography variant="body1">{t("We offer a wide range of electronic products, including smartphones, laptops, tablets, and accessories.")}</Typography>

          <Typography variant="body1">{t("Our goal is to provide high-quality products at competitive prices and make online shopping simple and easy.")}</Typography>

          <Typography variant="body1">{t("We are always working to improve our store and provide our customers with a better shopping experience.")}</Typography>

          <Typography variant="h6">{t("Thank you for choosing us!")}</Typography>

        </Stack>

      </Box>
    </Container>
  );
}

export default About;