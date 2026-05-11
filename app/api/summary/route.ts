export async function POST(req: Request) {
  try {
    const body = await req.json();

    const summary = `
Your AI stack has optimization opportunities.
Consider switching smaller teams to lower-cost plans
to reduce monthly spend and improve efficiency.
`;

    return Response.json({
      summary,
    });
  } catch (error) {
    return Response.json({
      summary: "Unable to generate summary",
    });
  }
}