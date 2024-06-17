import React, { ChangeEvent, useEffect, useState } from "react";
import Navbar from "./HomePageNavbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import LaunchIcon from "@mui/icons-material/Launch"; // Import Link icon
import { useNavigate } from "react-router-dom";
import { convertDataToExcel } from "../../utils/excelUtils";
import { ServerData } from "../../../model/evaluationData";

interface HomePageProps {
  onfileName: (fileName: File | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onfileName }) => {
  const navigate = useNavigate();
  const [homepageData, setHomepageData] = useState<ServerData[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/getAllRecords");
      const data: ServerData[] = await response.json();
      setHomepageData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onfileName(event.target.files[0]);
      navigate("/upload");
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDelete = async (objectid: string | null) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${objectid}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedData = homepageData.filter(
          (data) => data.objectid !== objectid
        );
        setHomepageData(updatedData);
      } else {
        console.error(`Failed to delete record with ID ${objectid}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleAnalysisClick = async (objectid: string | null) => {
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
        navigate("/report", { state: { data } });
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Button
          variant="contained"
          sx={{
            fontSize: "1.25rem",
            py: 0.3,
            px: 5,
            borderRadius: "30px",
            backgroundColor: "#2196F3",
            color: "white",
            transition: "background-color 0.3s, box-shadow 0.3s",
            "&:hover": {
              backgroundColor: "#1976D2",
            },
          }}
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadClick}
        >
          Upload File
        </Button>
      </Box>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Box
        component={Paper}
        sx={{
          p: 5,
          borderRadius: 2,
          boxShadow: 3,
          m: 5,
          backgroundColor: "aliceblue",
        }}
      >
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "papayawhip" }}>
                <TableCell
                  sx={{
                    backgroundColor: "papayawhip",
                    fontSize: 25,
                    fontWeight: "bold",
                    border: "1px solid black",
                    width: "40%",
                  }}
                >
                  Analysis
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "papayawhip",
                    fontSize: 25,
                    fontWeight: "bold",
                    border: "1px solid black",
                    width: "20%",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "papayawhip",
                    fontSize: 25,
                    fontWeight: "bold",
                    border: "1px solid black",
                    width: "10%",
                  }}
                >
                  Delete
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "papayawhip",
                    fontSize: 25,
                    fontWeight: "bold",
                    border: "1px solid black",
                    width: "10%",
                  }}
                >
                  Download
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {homepageData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid black",
                      padding: "8px",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                    onClick={() => handleAnalysisClick(data.objectid)}
                  >
                    <Link
                      component="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAnalysisClick(data.objectid);
                      }}
                      sx={{
                        color: "black",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {data.BatchData.Name}
                      <ListItemIcon
                        sx={{ color: "blue", marginLeft: "0.5rem" }}
                      >
                        <LaunchIcon />
                      </ListItemIcon>
                    </Link>
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid black",
                      padding: "8px",
                      fontSize: "20px",
                    }}
                  >
                    {formatDate(data.BatchData.Date)}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid black",
                      padding: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(data.objectid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleDownload(data.objectid)}
                    >
                      <DownloadIcon />
                    </IconButton>
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

export default HomePage;
