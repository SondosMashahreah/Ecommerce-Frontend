import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";

import { getCurrentUser } from "../../services/api";


function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();

        setUser(data);

      } catch (error) {
        setError(error.message);
      }
    };

    loadUser();
  }, []);


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
            fontWeight="bold"
            mb={3}
          >
            My Profile
          </Typography>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {user && (
            <>
              <Typography mb={2}>
                <strong>ID:</strong> {user.id}
              </Typography>

              <Typography mb={2}>
                <strong>Email:</strong> {user.email}
              </Typography>

              <Typography mb={2}>
                <strong>Role:</strong> {user.role}
              </Typography>

              <Typography>
                <strong>Verified:</strong>{" "}
                {user.is_verified ? "Yes" : "No"}
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}


export default Profile;