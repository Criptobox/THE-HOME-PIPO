import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import JSZip from "jszip";

function addFolderToZip(zip: JSZip, folderPath: string, relativePath = "") {
  try {
    const items = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(folderPath, item.name);
      const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

      // Ignore node_modules, dist, git, cache and zip files
      if (
        item.name === "node_modules" ||
        item.name === "dist" ||
        item.name === ".git" ||
        item.name === ".cache" ||
        item.name.endsWith(".zip")
      ) {
        continue;
      }

      if (item.isDirectory()) {
        const subFolder = zip.folder(itemRelativePath);
        if (subFolder) {
          addFolderToZip(zip, fullPath, itemRelativePath);
        }
      } else if (item.isFile()) {
        try {
          const fileData = fs.readFileSync(fullPath);
          zip.file(itemRelativePath, fileData);
        } catch (readErr) {
          console.error(`Error reading file ${fullPath}:`, readErr);
        }
      }
    }
  } catch (dirErr) {
    console.error(`Error reading dir ${folderPath}:`, dirErr);
  }
}

function addDistFolderToZip(zip: JSZip, folderPath: string, relativePath = "") {
  try {
    const items = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(folderPath, item.name);
      const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        const subFolder = zip.folder(itemRelativePath);
        if (subFolder) {
          addDistFolderToZip(zip, fullPath, itemRelativePath);
        }
      } else if (item.isFile()) {
        try {
          const fileData = fs.readFileSync(fullPath);
          zip.file(itemRelativePath, fileData);
        } catch (readErr) {
          console.error(`Error reading file ${fullPath}:`, readErr);
        }
      }
    }
  } catch (dirErr) {
    console.error(`Error reading dir ${folderPath}:`, dirErr);
  }
}
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Persistent Store Data File Location
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_DATA_FILE = path.join(DATA_DIR, "store_data.json");

// In-memory cache for fast response and real-time sync
let inMemoryStoreData: any = null;

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(STORE_DATA_FILE)) {
    const raw = fs.readFileSync(STORE_DATA_FILE, "utf-8");
    inMemoryStoreData = JSON.parse(raw);
    console.log("📁 Datos guardados del menú y tienda cargados desde el disco.");
  }
} catch (e) {
  console.error("Error al leer store_data.json inicial:", e);
}

// Connected SSE clients for live synchronization across all devices
let sseClients: express.Response[] = [];

function broadcastStoreData(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch (e) {
      // client connection closed
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Pizzas Pipo API", time: new Date().toISOString() });
  });

  // Real-Time SSE Stream Endpoint for Live Syncing across all visitors
  app.get("/api/store-data/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    if (inMemoryStoreData) {
      res.write(`data: ${JSON.stringify(inMemoryStoreData)}\n\n`);
    } else {
      res.write(`data: {}\n\n`);
    }

    sseClients.push(res);

    req.on("close", () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
  });

  // GET current store data (Menu items, photos, promos, store info)
  app.get("/api/store-data", (req, res) => {
    res.json(inMemoryStoreData || {});
  });

  // POST update store data and broadcast to all users in real-time
  app.post("/api/store-data", (req, res) => {
    try {
      const incoming = req.body || {};
      incoming.updatedAt = Date.now();
      inMemoryStoreData = { ...(inMemoryStoreData || {}), ...incoming };

      // Write asynchronously to disk
      fs.writeFile(STORE_DATA_FILE, JSON.stringify(inMemoryStoreData, null, 2), (err) => {
        if (err) console.error("Error guardando store_data.json:", err);
      });

      // Broadcast update to all connected users instantly
      broadcastStoreData(inMemoryStoreData);

      res.json({ success: true, updatedAt: inMemoryStoreData.updatedAt });
    } catch (error: any) {
      console.error("Error en POST /api/store-data:", error);
      res.status(500).json({ error: "No se pudo sincronizar la información del menú." });
    }
  });

  // POST reset store data to defaults
  app.post("/api/store-data/reset", (req, res) => {
    try {
      inMemoryStoreData = null;
      if (fs.existsSync(STORE_DATA_FILE)) {
        fs.unlinkSync(STORE_DATA_FILE);
      }
      broadcastStoreData({ reset: true, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Error al reiniciar la base de datos." });
    }
  });

  // Initialize Gemini AI Client lazily or safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Pipo AI Sommelier / Chef Endpoint
  app.post("/api/gemini/recommend", async (req, res) => {
    try {
      const { prompt, peopleCount, budget, preferences } = req.body;

      if (!prompt && !preferences) {
        return res.status(400).json({ error: "Por favor proporciona detalles de lo que buscas." });
      }

      const ai = getGeminiClient();

      const systemInstruction = `
Eres Chef Pipo, el carismático y apasionado maestro pizzero de "THE HOME PIPO 🍕".
Tu misión es recomendar la combinación perfecta de pizzas y acompañamientos basada en lo que pide el cliente para disfrutar en nuestras mesas o para recoger caliente en sucursal.
Mantén un tono entusiasta, amigable, artesanal e italiano-mexicano súper antojable ("¡Mamma Mia!", "¡Apetitoso!", "¡Te va a encantar!").

Lista de productos disponibles en THE HOME PIPO 🍕:
- Pizza Pipo Suprema ($169 base): Pepperoni, jamón, tocino, salchicha italiana, champiñones, pimientos, aceitunas.
- Pipo Prosciutto & Burrata Premium ($219 base): Prosciutto, burrata cremosa fresca, jitomate cherry, arugula, glace de balsámico.
- Pipo la Diabla ($179 base): Salsa diabla picante, doble pepperoni, carne molida, jalapeños, cebolla morada.
- Pipo 4 Quesos Artesanales ($185 base): Mozzarella, Gorgonzola, Gouda, Parmesano Reggiano.
- Pipo BBQ Ranch Pollo & Tocino ($175 base): Salsa BBQ, pollo marinado, tocino, cebolla morada, aderezo ranch.
- Clásica Pepperoni Lovers ($139 base): Doble pepperoni con extra mozzarella fundido.
- Clásica Hawaiana Pipo ($145 base): Jamón ahumado, piña miel horneada, mozzarella.
- Margherita Napolitana ($149 base): Tomate San Marzano, mozzarella de búfala, albahaca fresca, aceite de oliva.
- Veggie Garden Verde ($149 base): Champiñones, pimientos, cebolla morada, aceitunas, jitomate.
- Alitas & Boneless Pipo 12pzs ($149): Crujientes con salsa BBQ, Buffalo o Mango Habanero + Ranch.
- Nudos de Ajo ($79): 8 nudos horneados con mantequilla de ajo y parmesano.
- Bastones Rellenos de Queso ($89): Bastones crocantes con mozzarella fundido.
- Refresco 2 Litros ($45): Coca-Cola, Sprite, Fanta.
- Calzone de Nutella & Fresa ($95): Relleno de Nutella derretida y fresas frescas.
- Combo Pareja Pipo ($289): 1 Pizza Grande 2 ing. + Nudos de Ajo + 2 Refrescos 600ml.
- Combo Fiesta Familiar ($499): 2 Pizzas Familiares + Alitas 12pzs + Refresco 2L.

Tallas disponibles: Chica (1 persona), Mediana (2 personas), Grande (3-4 personas), Familiar (4-6 personas). Multiplicador aprox: Mediana 1.35x, Grande 1.75x, Familiar 2.25x.

Responde ÚNICAMENTE con un JSON válido usando esta estructura exacta:
{
  "recommendationTitle": "Título creativo y eufórico del combo/recomendación",
  "summaryReason": "Explicación breve y antojable de por qué esta recomendación es perfecta para ellos",
  "pizzas": [
    {
      "name": "Nombre exacto o creativo de la pizza/combo recomendada",
      "description": "Por qué incluir esta opción",
      "suggestedSize": "Grande | Familiar | Mediana | Chica",
      "estimatedPrice": 250,
      "ingredients": ["ingrediente 1", "ingrediente 2"]
    }
  ],
  "totalEstimated": 450,
  "tipFromChef": "Consejo secreto del Chef Pipo (ej: agregar orilla rellena de queso o dip pomodoro)"
}
`;

      const userPrompt = `
Consulta del cliente: "${prompt || 'Recomiéndame algo delicioso'}"
Número de personas: ${peopleCount || 'No especificado'}
Presupuesto aprox: ${budget ? '$' + budget : 'Cualquiera'}
Preferencias/restricciones: ${preferences || 'Sin restricciones'}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationTitle: { type: Type.STRING },
              summaryReason: { type: Type.STRING },
              pizzas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    suggestedSize: { type: Type.STRING },
                    estimatedPrice: { type: Type.NUMBER },
                    ingredients: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
              },
              totalEstimated: { type: Type.NUMBER },
              tipFromChef: { type: Type.STRING },
            },
            required: ["recommendationTitle", "summaryReason", "pizzas", "totalEstimated", "tipFromChef"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response generated from AI Chef");
      }

      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error in /api/gemini/recommend:", error);
      return res.status(500).json({
        error: "Hubo un problema al consultar a Pipo AI Chef.",
        details: error.message || String(error),
      });
    }
  });

  // Endpoint to download the full project source code as ZIP
  app.get("/api/download-zip", async (req, res) => {
    try {
      const zip = new JSZip();
      const rootDir = process.cwd();

      addFolderToZip(zip, rootDir);

      const zipBuffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="THE-HOME-PIPO-fuente.zip"');
      res.setHeader("Content-Length", zipBuffer.length.toString());
      return res.send(zipBuffer);
    } catch (err: any) {
      console.error("Error generating ZIP:", err);
      return res.status(500).json({ error: "No se pudo generar el archivo ZIP: " + err.message });
    }
  });

  // Endpoint to download the PRE-COMPILED website ready for GitHub Pages / Web Host
  app.get("/api/download-web-zip", async (req, res) => {
    try {
      const rootDir = process.cwd();
      const distDir = path.join(rootDir, "dist");

      // Build static site if not exists or to update
      try {
        execSync("npx vite build", { cwd: rootDir, stdio: "pipe" });
      } catch (buildErr: any) {
        console.warn("Vite build warning during ZIP generation:", buildErr.message);
      }

      // Ensure .nojekyll and 404.html exist in dist for GitHub Pages
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, ".nojekyll"), "");
        const indexPath = path.join(distDir, "index.html");
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
        }
      }

      const zip = new JSZip();
      addDistFolderToZip(zip, distDir);

      const zipBuffer = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="THE-HOME-PIPO-WEB-LISTA.zip"');
      res.setHeader("Content-Length", zipBuffer.length.toString());
      return res.send(zipBuffer);
    } catch (err: any) {
      console.error("Error generating WEB ZIP:", err);
      return res.status(500).json({ error: "No se pudo generar la web lista: " + err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de THE HOME PIPO ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();
