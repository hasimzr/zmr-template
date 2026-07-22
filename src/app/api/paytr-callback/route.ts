import { NextRequest } from "next/server";

async function handlePaymentCallback(request: NextRequest) {
  let orderId = "";
  let status = "success";

  try {
    const contentType = request.headers.get("content-type") || "";

    // Form POST veya Multipart olarak gelen veriyi ayrıştır
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData();
      orderId =
        formData.get("merchant_oid")?.toString() ||
        formData.get("orderId")?.toString() ||
        "";
      status = formData.get("status")?.toString() || "success";
    } else {
      const { searchParams } = new URL(request.url);
      orderId =
        searchParams.get("merchant_oid") ||
        searchParams.get("orderId") ||
        "";
      status = searchParams.get("status") || "success";
    }
  } catch (err) {
    console.error("Payment Callback Parse Error:", err);
  }

  // Yönlendirilecek URL
  const redirectUrl = orderId
    ? `/cart?orderId=${encodeURIComponent(orderId)}${
        status === "failed" ? "&status=failed" : ""
      }`
    : `/cart`;

  // window.top.location.href kullanarak iframe'den çıkıp ana pencereyi yönlendiren HTML yanıtı
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Yönlendiriliyorsunuz...</title>
</head>
<body>
    <script type="text/javascript">
        (function() {
            var targetUrl = "${redirectUrl}";
            if (window.top && window.top !== window) {
                window.top.location.href = targetUrl;
            } else {
                window.location.href = targetUrl;
            }
        })();
    </script>
    <p style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        Ödeme işlemi tamamlandı, yönlendiriliyorsunuz...
    </p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

export async function POST(request: NextRequest) {
  return handlePaymentCallback(request);
}

export async function GET(request: NextRequest) {
  return handlePaymentCallback(request);
}
