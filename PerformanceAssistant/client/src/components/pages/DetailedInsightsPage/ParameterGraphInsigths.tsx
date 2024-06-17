import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { BatchInsightModel } from "../../../model/evaluationData";
import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";

const chartSetting = {
  yAxis: [
    {
      label: "Strength",
    },
  ],
  width: 550,
  height: 400,
};

const valueFormatter = (value: number | null) => `${value}`;

const ParameterGraphInsights: React.FC<{ data: BatchInsightModel }> = ({
  data,
}) => {
  const [formattedData, setFormattedData] = useState<any[]>([]);

  useEffect(() => {
    const insights = data.BatchData.insight.Data;
    const allParameters = Array.from(
      new Set(insights.flatMap((item) => item.insight.map((i) => i.parameter)))
    );

    const transformedData = allParameters.map((parameter) => {
      const candidatesData = insights.map((candidate) => {
        const parameterData = candidate.insight.find(
          (insight) => insight.parameter === parameter
        );
        return {
          Name: candidate.Name,
          [parameter]: parameterData ? parameterData.strength : 0,
        };
      });
      return {
        parameter,
        candidatesData,
      };
    });

    setFormattedData(transformedData);
  }, [data]);

  return (
    <Box
      component={Paper}
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        m: 5,
        backgroundColor: "aliceblue",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginLeft: "150px",
          marginRight: "150px",
        }}
      >
        {formattedData.map(({ parameter, candidatesData }) => (
          <Box key={parameter} sx={{ width: "50%", marginBottom: "20px" }}>
            <b> {parameter} Graph</b>
            <BarChart
              dataset={candidatesData}
              xAxis={[{ scaleType: "band", dataKey: "Name", 
                tickLabelStyle: {
                angle: -75,
                textAnchor: 'end',
                fontSize: 11,
            }, 
          }]}
              series={[
                {
                  dataKey: parameter,
                  // label: `${parameter} strength`,
                  valueFormatter,
                },
              ]}
              layout="vertical"
              grid={{ vertical: false }}
              {...chartSetting}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ParameterGraphInsights;