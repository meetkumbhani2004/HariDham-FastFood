import React from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "./Contact.css";

const Contact = () => {
  return (
    <Box sx={{ py: 6, px: 2, backgroundColor: "#f9f9f9" }}>
      {/* Heading Section */}
      <Box
        sx={{
          maxWidth: "900px",
          margin: "auto",
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#222",
          }}
        >
          Contact My Restaurant
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#555",
            maxWidth: "700px",
            margin: "auto",
          }}
        >
          We’re here to assist you with any questions, orders, or feedback you
          might have. Reach out to us via phone, email, or our toll-free number.
        </Typography>
      </Box>

      {/* Table Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "600px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Table aria-label="contact table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#222",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Contact Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.3s",
                }}
              >
                <TableCell sx={{ fontSize: "16px" }}>
                  <SupportAgentIcon
                    sx={{
                      color: "red",
                      mr: 1,
                      verticalAlign: "middle",
                    }}
                  />
                  1800-00-0000 (Toll-free)
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.3s",
                }}
              >
                <TableCell sx={{ fontSize: "16px" }}>
                  <MailIcon
                    sx={{
                      color: "skyblue",
                      mr: 1,
                      verticalAlign: "middle",
                    }}
                  />
                  help@myrest.com
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "0.3s",
                }}
              >
                <TableCell sx={{ fontSize: "16px" }}>
                  <CallIcon
                    sx={{
                      color: "green",
                      mr: 1,
                      verticalAlign: "middle",
                    }}
                  />
                  1234567890
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Contact;
