import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
    Generate a short AI spend audit summary.

    User tools:
    ${JSON.stringify(body.tools)}

    Total monthly savings:
    $${body.totalSavings}

    Keep it professional and under 100 words.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary =
      response.choices[0].message.content;

    return Response.json({
      summary,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      summary:
        "Your AI stack has optimization opportunities. Consider switching smaller teams to lower-cost plans to reduce monthly spend.",
    });
  }
}