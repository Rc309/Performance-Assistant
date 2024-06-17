import * as XLSX from 'xlsx';

export const convertDataToExcel = (newData:any) => {
  var headers = [["Candidate Name", "Strengths", "Area of improvements", "Notes from Mentor"]];
  var ws= XLSX.utils.aoa_to_sheet([[]]);
  XLSX.utils.sheet_add_aoa(ws, headers, {origin: "A1"});

  const record =  newData.BatchData.AnalysisModel;
  
  for(var i:number= 0;i<record.length;i++) {
    let oneCandidate:string[] = [];
    oneCandidate.push(record[i].Name);// .CandidateName);

    let strengthCell:string = "";
    for(var j:number = 0; j < record[i].Strengths.length; j++)
      {
        strengthCell += record[i].Strengths[j].Parameter + ":" +  record[i].Strengths[j].Data + ";    ";
      }
    oneCandidate.push(strengthCell);

    let improvCell:string = "";
    for(var k:number = 0; k < record[i].AreasOfImprovement.length; k++)
      {
        improvCell += record[i].AreasOfImprovement[k].Parameter + ":" + record[i].AreasOfImprovement[k].Data + ";    ";
      }
    oneCandidate.push(improvCell);

    let notesCell:string = "";
    for(var l:number = 0; l < record[i].InputForMentors.length; l++)
      {
        notesCell += record[i].InputForMentors[l].Parameter + ":" + record[i].InputForMentors[l].Data + ";    ";
      }
    oneCandidate.push(notesCell);

    let rowNum:number = i+2;
    XLSX.utils.sheet_add_aoa(ws, [oneCandidate], {origin: "A"+rowNum});
  }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, "Report Details");
    let fileName:string = newData.BatchData.Name+" Report.xlsx";
    XLSX.writeFile(workbook, fileName);
  
}; 
