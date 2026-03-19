import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface OrderItem {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  hasPainting: boolean;
  paintingColor?: string;
  hasInspectionWindow: boolean;
}

export interface OrderData {
  orderNumber: string;
  clientName: string;
  orderDate: string;
  deliveryDate: string;
  seller: string;
  manufacturingDays: number;
  printDate?: string;
  deliveryType: 'Coleta' | 'Entrega' | 'Cliente Retira';
  items: OrderItem[];
}

export async function extractOrderData(base64Pdf: string): Promise<OrderData | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf,
              },
            },
            {
              text: "Extract the following information from this Purchase Order (Pedido) PDF in JSON format:\n- orderNumber (Pedido Nº)\n- clientName (Informações do Cliente -> Name)\n- orderDate (Pedido - incluído em)\n- deliveryDate (Previsão de Faturamento)\n- seller (Vendedor)\n- printDate: Look for 'Gerado em' in the footer of the page (e.g., 'Gerado em 06/03/2026'). Extract only the date part.\n- manufacturingDays: Look for 'PRAZO PREVISTO DE FABRICAÇÃO' in 'Outras Informações'. Extract the maximum number of business days mentioned (e.g., if it says '20 A 25 DIAS UTEIS', return 25).\n- deliveryType: Look for mentions of 'FRETE' or 'Entrega'. If 'FOB' or 'por conta do cliente', return 'Cliente Retira'. If 'CIF' or 'por conta da empresa', return 'Entrega'. Default to 'Cliente Retira' if unclear.\n- items: This is a list of products. For each product, extract:\n    * code: The first part of the 'Produto' column (usually a numeric or alphanumeric code like '1001', 'ARM-01', etc.).\n    * description: The rest of the 'Produto' column (the full name/description of the product).\n    * quantity: The numeric value in the 'Quant.' column.\n    * unit: The value in the 'Unit.' column (e.g., 'PC', 'UN', 'M').\n    * hasPainting: Boolean. Check if the description contains 'PINTURA' or if there is any mention of painting in the item details.\n    * paintingColor: If hasPainting is true, extract the color mentioned (e.g., 'PRETA', 'BRANCA', 'CINZA').\n    * hasInspectionWindow: Boolean. Check if the description or 'OBS' mentions 'JANELA DE INSPEÇÃO'. If it says 'SEM ACRESCIMO' or 'OPCIONAL' but doesn't explicitly say it HAS it, default to false unless the item description specifically includes it.\n\nIMPORTANT: You MUST capture EVERY item listed in the products table. If there are 10 items, the 'items' array MUST have 10 objects. Return ONLY the JSON object.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            orderNumber: { type: Type.STRING },
            clientName: { type: Type.STRING },
            orderDate: { type: Type.STRING },
            deliveryDate: { type: Type.STRING },
            seller: { type: Type.STRING },
            printDate: { type: Type.STRING },
            manufacturingDays: { type: Type.NUMBER },
            deliveryType: { type: Type.STRING, enum: ['Coleta', 'Entrega', 'Cliente Retira'] },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  hasPainting: { type: Type.BOOLEAN },
                  paintingColor: { type: Type.STRING },
                  hasInspectionWindow: { type: Type.BOOLEAN },
                },
                required: ["code", "description", "quantity", "hasPainting", "hasInspectionWindow"],
              },
            },
          },
          required: ["orderNumber", "clientName", "items", "manufacturingDays", "deliveryType"],
        },
      },
    });

    if (!response.text) return null;
    console.log("Raw Gemini Response:", response.text);
    return JSON.parse(response.text) as OrderData;
  } catch (error) {
    console.error("Error extracting order data:", error);
    return null;
  }
}
