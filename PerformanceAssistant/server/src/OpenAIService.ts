import OpenAI from 'openai';
import { BatchDataModel, StrengthAnalysisModel } from './Interfaces/Interface';

export class OpenAIService {

   public async evaluate(batchData:BatchDataModel): Promise<string | any> {

    const api_key = process.env.OAI_API_KEY;
        try {
            const openai = new OpenAI({apiKey: api_key});
            const prompt = `Here is data for analysis: \n${JSON.stringify(batchData)}
             Provide a detailed analysis and recommendation for mentors for the following batch data in the JSON format as specified:
             {
                "BatchData": {
                  "Name": "string",
                  "Module": "string",
                  "AnalysisModel": [
                    {
                      "Name": "string",
                      "Strengths": [{
                        "Parameter": "string",
                        "Data": "string"
                      }],
                      "AreasOfImprovement": [
                        {
                          "Parameter": "string",
                          "Data": "string"
                        }
                      ],
                      "InputForMentors": [
                        {
                          "Parameter": "string",
                          "Data": "string"
                        }
                      ]
                    }
                  ]
                }
              }`;

            const completionResponse = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "We gave software development training to a fresher and now evaluating each by giving individual projects." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-3.5-turbo",
              });
            return completionResponse.choices[0].message.content;

        } catch (error) {
            console.error('OpenAI Function exception:', error);
            return "";
        }
   }  
   public async insights(strengthData:StrengthAnalysisModel[]): Promise<string | any> {

    const api_key = process.env.OAI_API_KEY;
        try {
            const openai = new OpenAI({apiKey: api_key});
            const prompt = `Here is data for analysis: \n${JSON.stringify(strengthData, null, 2)}
             and compare the strengths of every candidate and provide their combine strength as well as individual strength scale from 0 to 100 in below json format as specified and don't add any extra descriptive data
             {
              "Data": [
                {
                  "Name": "string",
                  "CombineStrength": "number",
                  "suggestedRole": ["string"],
                  "insight": [
                    {
                      "parameter": "string",
                      "strength": "number"
                    }
                  ]
                }
              ]
            }
            `;

            const completionResponse = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a evaluator which evaluates and compares the strengths for each candidate on basis of different parameters individually and with combined parameters and also provide role for each candidate" },
                    { role: "user", content: prompt }
                ],
                model: "gpt-3.5-turbo",
              }); 
            return completionResponse.choices[0].message.content;

        } catch (error) {
            console.error('OpenAI Function exception:', error);
            return "";
        }
   } 
}