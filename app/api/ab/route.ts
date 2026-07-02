/* Recebe eventos do teste A/B (beacon do CTA). Loga no servidor —
   visível nos logs da Vercel. Sem banco por enquanto: análise manual. */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.log("[ab]", body);
  } catch {
    /* beacon malformado: ignora */
  }
  return new Response(null, { status: 204 });
}
