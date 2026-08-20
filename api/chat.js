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

    // Limitar la pregunta para proteger el uso gratuito
    const userQuestion = question.trim().slice(0, 4000);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
  "Eres DixzAI, el asistente oficial de DixzAI Intelligent. " +
  "Responde siempre en español, de forma clara, profesional, natural y completa. " +
  "Desarrolla las respuestas cuando la pregunta lo requiera. " +
  "Explica los conceptos paso a paso cuando sea útil. " +
  "Incluye ejemplos, detalles, recomendaciones o listas cuando ayuden a responder mejor. " +
  "No respondas de manera excesivamente corta si el usuario solicita una explicación. " +
  "Organiza las respuestas con títulos, listas y párrafos cuando corresponda. " +
  "No afirmes capacidades que no tienes."
                
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userQuestion
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 2500,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR GEMINI:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Error de Gemini."
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "No recibí una respuesta de Gemini.";

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error("ERROR SERVIDOR:", error);

    return res.status(500).json({
      error: error.message || "Error interno del servidor."
    });
  }
};
