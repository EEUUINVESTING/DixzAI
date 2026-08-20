const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { question } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "No se recibió ninguna pregunta."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `Eres DixzAI, el asistente oficial de DixzAI Intelligent.

Responde de forma clara, profesional y útil.

Pregunta del usuario:
${question}`
    });

    return res.status(200).json({
      answer: response.output_text
    });

  } catch (error) {
    console.error("ERROR OPENAI:", error);

    return res.status(500).json({
      error: error.message || "Error interno del servidor."
    });
  }
};
