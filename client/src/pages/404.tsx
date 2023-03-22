import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default () => {
  return (
    <Container maxWidth="lg">
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              align="center"
              color="textPrimary"
              variant="h6"
              sx={{ mb: 1, mt: 5 }}
            >
              <b>404: Page not found!</b>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};
