export async function POST(req: Request) {
  try {
    const body = await req.json();

    const summary = `
Your AI stack has optimization opportunities.
Consider switching to lower-cost plans
to reduce monthly spend.
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
