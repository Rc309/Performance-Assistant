import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  IconButton,
  alpha,
  List,
  ListItem,
} from "@mui/material";
import { BatchInsightModel, ServerData } from "../../../model/evaluationData";
import { convertDataToExcel } from "../../utils/excelUtils";
import DownloadIcon from "@mui/icons-material/Download";

const ReportPage: React.FC = () => {
  const location = useLocation();
  const { data } = location.state as { data: ServerData };
  const navigate = useNavigate();

  const handleDetailedInsights = async (objectid: string | null) => {
    try {
      const response = await fetch("http://localhost:3000/getinsights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Key: objectid }),
      });

      let insightsData: BatchInsightModel;
      insightsData = await response.json();

      if (response.ok) {
        navigate("/detailed-insights", { state: { data: insightsData } });
      } else {
        console.error(`Failed to fetch record with ID ${objectid}`);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

  const handleDownload = async (objectid: string | null) => {
    try {
      const response = await fetch("http://localhost:3000/getSelectedRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Key: objectid }),
      });

      let data: ServerData;
      data = await response.json();

      if (response.ok) {
        convertDataToExcel(data);
      } else {
        console.error(`Failed to fetch record with ID ${objectid}`);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box
        component={Paper}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          m: 4,
          backgroundColor: alpha("#1976D2", 0.1),
          maxWidth: "100vw",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: 24,
            fontWeight: "bold",
            mb: 1,
            fontFamily: "sans-serif",
          }}
        >
          Team Performance Report for {data.BatchData.Name}
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              mb: 3,
              fontFamily: "sans-serif",
            }}
          >
            Module: {data.BatchData.Module || "N/A"}
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <Button
              color="primary"
              variant="contained"
              style={{ fontSize: "15px", marginRight: "20px" }}
              onClick={() => handleDetailedInsights(data.objectid)}
            >
              Detailed Insights
            </Button>
            <IconButton
              color="primary"
              onClick={() => handleDownload(data.objectid)}
            >
              <DownloadIcon style={{ fontSize: "50px" }} />
            </IconButton>
          </div>
        </div>

        <TableContainer sx={{ maxHeight: "55vh", maxWidth: "99vw" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: alpha("#fffacd", 1),
                    fontSize: 18,
                    fontWeight: "bold",
                    border: "1px solid black",
                  }}
                >
                  Candidate Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: alpha("#aff500", 1),
                    fontSize: 18,
                    fontWeight: "bold",
                    border: "1px solid black",
                  }}
                >
                  Strengths
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: alpha("#ffa500", 1),
                    fontSize: 18,
                    fontWeight: "bold",
                    border: "1px solid black",
                  }}
                >
                  Areas of Improvement
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: alpha("#da70d6", 1),
                    fontSize: 18,
                    fontWeight: "bold",
                    border: "1px solid black",
                  }}
                >
                  Recommendations for Mentor
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.BatchData.AnalysisModel.map((candidate, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      backgroundColor: alpha("#fffacd", 0.7),
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "15px",
                    }}
                  >
                    {candidate.Name}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: alpha("#aff500", 0.2),
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "15px",
                    }}
                  >
                    <List sx={{ padding: 1 }}>
                      {candidate.Strengths.map((strength, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            display: "list-item",
                            listStyleType: "disc",
                            padding: "2px 0",
                            marginLeft: "15px",
                          }}
                        >
                          {strength.Parameter}: {strength.Data}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: alpha("#ffa500", 0.2),
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "15px",
                    }}
                  >
                    <List sx={{ padding: 0 }}>
                      {candidate.AreasOfImprovement.map(
                        (improvement, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              display: "list-item",
                              listStyleType: "disc",
                              padding: "2px 0",
                              marginLeft: "15px",
                            }}
                          >
                            {improvement.Parameter}: {improvement.Data}
                          </ListItem>
                        )
                      )}
                    </List>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: alpha("#da70d6", 0.2),
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "15px",
                    }}
                  >
                    <List sx={{ padding: 0 }}>
                      {candidate.InputForMentors.map((input, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            display: "list-item",
                            listStyleType: "disc",
                            padding: "2px 0",
                            marginLeft: "15px",
                          }}
                        >
                          {input.Parameter}: {input.Data}
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>      
    </Box>

  );
};

export default ReportPage;
