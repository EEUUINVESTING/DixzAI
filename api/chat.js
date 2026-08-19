const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Escribe una pregunta."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "Eres DixzAI, el asistente de inteligencia artificial de DixzAI Intelligent. Responde de manera clara, útil y profesional."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    return res.status(200).json({
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo conectar con DixzAI."
    });
  }
};
