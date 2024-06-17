import express, { Request, Response, response } from 'express';
import {OpenAIService} from "./OpenAIService";
import { Authenticator } from './Authenticator/Authenticator';
import { BatchAnalysisModel, UserCredentials,StrengthAnalysisModel,CandidateAnalysisModel, BatchDbModel, InsightModel} from './Interfaces/Interface';
import cors from "cors";
import { Database } from './Database/database';
import { ObjectId } from 'mongodb';



const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors<Request>());

app.post('/login', async (req: Request, res: Response) => {
  const authenticator = new Authenticator();
  const userCredentials: UserCredentials = req.body;
  
  let result = await authenticator.authenticate(userCredentials);
  res.send(result);
  
});

app.post('/evaluate', async (req: Request, res: Response) => {
  let oaiService = new OpenAIService();
  
  oaiService.evaluate(req.body).then((response)=>{
    const json = JSON.parse(response);
    const data = json as BatchAnalysisModel
   

    let am = data.BatchData.AnalysisModel; // am = analysis model

    let samList: StrengthAnalysisModel[] = []; // samList = strenght analysis model
    am.forEach((cam: CandidateAnalysisModel) => { // cam = candidate analysis model
      let sam :StrengthAnalysisModel = {
        Name: cam.Name,
        Strengths: cam.Strengths
      }
      samList.push(sam);
    })

    oaiService.insights(samList).then(async (response) => {
      //save to database
      const insightsjson = JSON.parse(response);
      const insightsdata = insightsjson as InsightModel
      data.BatchData.insight = insightsdata;
      let db = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
      db.connectToDatabase();
       let objid = db.addReport(data); 
       let responseData =   db.getReportById(await objid);
      //  const finaldata :  BatchDbModel | null = await responseData;
       
       res.send(true);
      

    }).catch((error) => {
      res.send(error);
    });

  
  }).catch((error)=>{
      res.send(error);
  });
});

app.post('/getinsights', async (req: Request, res: Response) => {
  try {
    let objid = req.body.Key;
    let db = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    db.connectToDatabase();

    // Fetch insights by ID
    let insights = await db.getInsightsByID(objid);
    
    if (insights) {
      res.status(200).send(insights);
    } else {
      res.status(404).send({ message: 'No insights found for the given ID' });
    }
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).send({ message: 'Failed to fetch insights' });
  }
});


app.post("/getSelectedRecord",async(req:Request,res:Response) => {
    let objid = req.body.Key;
    let db = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    db.connectToDatabase();
    let dbreport =  await db.getReportById(objid); 
    
    res.send(dbreport);
});


app.get("/getAllRecords", async (req: Request, res: Response) => {
  try {
    const database = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    await database.connectToDatabase();
    const records = await database.getAllRecords("reports");
    res.send(records);
  } catch (error) {
    console.error('Failed to get records', error);
    res.status(500).send('Failed to get records');
  }
});

app.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const database = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    await database.connectToDatabase();
    const reportId = req.params.id;
    const result = await database.deleteReportById(reportId);
    if (result.deletedCount === 1) {
      res.send(`Report with ID ${reportId} deleted successfully`);
    } else {
      res.status(404).send(`No report found with ID ${reportId}`);
    }
  } catch (error) {
    console.error('Failed to delete record', error);
    res.status(500).send('Failed to delete record');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
