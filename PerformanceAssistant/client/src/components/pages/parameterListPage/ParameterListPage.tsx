import { Grid, Checkbox, FormControlLabel, Button, Paper } from "@mui/material";
import * as XLSX from "xlsx";
import {
  BatchDataModel,
  CandidateDataModel,
  ServerData,
} from "../../../model/evaluationData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const ParameterListPage: React.FC<{ parameterFileName: File | null }> = ({
  parameterFileName: uploadfileName,
}) => {
  const [parameters, setParameters] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [jsonSheet, setJsonSheet] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<File | null>(null);
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    setFileName(uploadfileName);
    handleFileUpload(uploadfileName);
  }, [uploadfileName]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showMessage) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            navigate("/homepage");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showMessage, navigate]);

  useEffect(() => {
    if (jsonSheet.length > 0) {
      const headers = jsonSheet[0];
      setSelectedParameters(headers.slice(1));
    }
  }, [jsonSheet]);

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonSheet = XLSX.utils.sheet_to_json<any[]>(worksheet, {
        header: 1,
      });
      const headers = jsonSheet[0];
      setParameters(headers.slice(1));
      setJsonSheet(jsonSheet);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedParameters([...selectedParameters, name]);
    } else {
      setSelectedParameters(
        selectedParameters.filter((param) => param !== name)
      );
    }
  };

  const transformData = (
    jsonSheet: any[][],
    batchName: string
  ): BatchDataModel => {
    const headers = jsonSheet[0];
    const rows = jsonSheet.slice(1);
    const candidateDataModel: CandidateDataModel[] = rows.map((row) => ({
      Name: row[0] as string,
      Data: headers.slice(1).map((header, index) => ({
        Parameter: header,
        Data: row[index + 1] as string,
      })),
    }));

    const batchDataModel: BatchDataModel = {
      Name: batchName,
      Module: "",
      Data: candidateDataModel,
    };

    return batchDataModel;
  };

  const submitData = async () => {
    try {
      if (!fileName) return;
      const batchDataModel: BatchDataModel = transformData(
        jsonSheet,
        fileName.name
      );
      const batchDataModelString = JSON.stringify(batchDataModel);

      const response = await fetch("http://localhost:3000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedParameters,
          transformedData: batchDataModelString,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const tempresponseData = await response.json();
      let responseData = tempresponseData as ServerData;
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <Navbar></Navbar>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 20px)",
          padding: "20px",
          margin: "auto",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "16px",
            textAlign: "center",
            opacity: showMessage ? 0.5 : 1,
          }}
        >
          Select Parameters For Analysis
        </div>

        <div style={{ opacity: showMessage ? 0.5 : 1 }}>
          {parameters.length > 0 && (
            <Paper
              style={{
                width: "calc(100vw - 40px)",
                background: "aliceblue",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                height: "400px",
                overflowY: "auto",
              }}
            >
              <Grid container spacing={4}>
                {parameters.map((param, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Paper
                      elevation={2}
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        background: selectedParameters.includes(param)
                          ? "#48BB78"
                          : "#4299E1",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={showMessage}
                            color="primary"
                            onChange={handleCheckboxChange}
                            name={param}
                            checked={selectedParameters.includes(param)}
                            style={{
                              color: selectedParameters.includes(param)
                                ? "#FFFFFF"
                                : "#FFFFFF",
                            }}
                          />
                        }
                        label={
                          <span style={{ fontSize: "20px", color: "#FFFFFF" }}>
                            {param}
                          </span>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </div>

        {showMessage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 1)",
              textAlign: "center",
              padding: "20px",
              fontSize: "2",
              color: "black",
              zIndex: 1000,
              height: "100px",
            }}
          >
            <b>
              <p style={{ fontSize: 25 }}>
                Your file is being evaluated. You are being routed back to
                homepage in {countdown} seconds.
              </p>
            </b>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/homepage")}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              Go Back to Homepage
            </Button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <Button
            disabled={showMessage || selectedParameters.length === 0}
            variant="contained"
            color="primary"
            onClick={() => {
              setShowMessage(true);
              submitData();
            }}
            style={{ fontSize: "18px" }}
          >
            Evaluate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParameterListPage;
