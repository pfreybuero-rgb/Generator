
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, LineItem, getTodayStr } from "../types";

export const parseDataWithGemini = async (text: string, currentData: AppState): Promise<Partial<AppState>> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided");
    return {};
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are a data extraction expert for a German legal/invoice system.
    Extract the following entities from the unstructured text provided:
    1. Client details (Name, Company, Address, Delivery Address if different, VAT ID).
    2. Invoice Items (Name, Article Number, Price, Quantity, Notes/Accessories).
    3. Invoice Metadata (Invoice Number, Date).
    
    If a field is not found, leave it null.
    Prices should be extracted as numbers (e.g. 1000.00).
    Dates should be strictly in DD.MM.YYYY format. Use ${getTodayStr()} if no date is found.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract data from this text:\n\n${text}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            client: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                company: { type: Type.STRING },
                addressLine1: { type: Type.STRING },
                addressLine2: { type: Type.STRING },
                deliveryAddress: { type: Type.STRING },
                vatId: { type: Type.STRING },
              },
            },
            invoiceNr: { type: Type.STRING },
            date: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  articleNr: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const extracted = JSON.parse(response.text || "{}");
    const newData: Partial<AppState> = {};

    if (extracted.client) {
      newData.client = { ...currentData.client, ...extracted.client };
    }
    
    if (extracted.invoiceNr) {
      newData.invoiceNr = extracted.invoiceNr;
      // Sync customer nr by stripping 2025-
      if (extracted.invoiceNr.startsWith('2025-')) {
        newData.client = { ...newData.client || currentData.client, customerNr: extracted.invoiceNr.replace('2025-', '') };
      }
    }
    
    newData.date = extracted.date || getTodayStr();
    
    if (extracted.items && Array.isArray(extracted.items)) {
      newData.items = extracted.items.map((item: any, idx: number) => ({
        id: `imported-${idx}-${Date.now()}`,
        name: item.name || "Position",
        articleNr: item.articleNr || Math.floor(10000 + Math.random() * 90000).toString(),
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        notes: item.notes || ""
      }));
    }

    return newData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return {};
  }
};
