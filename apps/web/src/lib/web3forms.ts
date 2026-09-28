const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const isWeb3FormsConfigured = Boolean(WEB3FORMS_KEY);

export async function submitToWeb3Forms(fields: Record<string, string>): Promise<void> {
  if (!WEB3FORMS_KEY) throw new Error("VITE_WEB3FORMS_KEY is not set");

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
}
