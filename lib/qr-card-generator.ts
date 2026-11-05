import QRCode from "qrcode";

/**
 * Helper to load the official brand icon (/icon.png) in the browser.
 */
function loadBrandIcon(): Promise<HTMLImageElement | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn("Could not load /icon.png for QR canvas embedding");
      resolve(null);
    };
    img.src = "/icon.png";
  });
}
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generates an ultra-premium, agency-grade 1200 x 1500 presentation card
 * styled perfectly to the Wealthy Step brand theme (#180D45, #84BD3C, AMFI ARN-322891).
 */
export async function generateBrandedQrCard(
  targetUrl: string,
  options: {
    title?: string;
    subtitle?: string;
    arn?: string;
  } = {}
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("generateBrandedQrCard can only be called in the browser");
  }

  const {
    title = "Financial Freedom Awareness Program",
    subtitle = "Scan with your mobile camera to share your details & receive personalized insights.",
    arn = "ARN - 322891",
  } = options;

  // 1. Generate high-resolution QR code image with high error correction
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 600,
    color: {
      dark: "#180D45",
      light: "#FFFFFF",
    },
  });

  const qrImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = qrDataUrl;
  });

  // 2. Setup Canvas
  const width = 1200;
  const height = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2D context");

  // Enable crisp text rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 3. Background Gradient: Deep Royal Navy (#180D45) to Midnight Navy (#08031A)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#180D45");
  bgGrad.addColorStop(0.5, "#1F1256");
  bgGrad.addColorStop(1, "#09041A");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Ambient Luxury Radial Glows
  // Glow 1: Top-Right Lime Ambient
  const glow1 = ctx.createRadialGradient(width - 150, 150, 20, width - 150, 150, 500);
  glow1.addColorStop(0, "rgba(132, 189, 60, 0.22)");
  glow1.addColorStop(1, "rgba(132, 189, 60, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  // Glow 2: Bottom-Left Royal Violet Ambient
  const glow2 = ctx.createRadialGradient(150, height - 150, 20, 150, height - 150, 600);
  glow2.addColorStop(0, "rgba(100, 70, 200, 0.35)");
  glow2.addColorStop(1, "rgba(100, 70, 200, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 5. Outer Premium Border & Double Accent Frame
  roundRect(ctx, 40, 40, width - 80, height - 80, 48);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(132, 189, 60, 0.4)";
  ctx.stroke();

  roundRect(ctx, 52, 52, width - 104, height - 104, 40);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.stroke();

  // 6. Header Badge: "WEALTHY STEP™" & AMFI registration
  // Brand name
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "900 44px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("WEALTHY STEP™", width / 2, 130);

  // Subtitle: AMFI Registered Distributor
  ctx.font = "700 17px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#84BD3C";
  ctx.fillText("AMFI REGISTERED MUTUAL FUND DISTRIBUTOR", width / 2, 175);

  // ARN Pill Badge
  const arnBadgeW = 200;
  const arnBadgeH = 34;
  const arnBadgeX = width / 2 - arnBadgeW / 2;
  const arnBadgeY = 200;
  roundRect(ctx, arnBadgeX, arnBadgeY, arnBadgeW, arnBadgeH, 17);
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(132, 189, 60, 0.5)";
  ctx.stroke();

  ctx.font = "800 15px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(arn, width / 2, arnBadgeY + arnBadgeH / 2);

  // 7. Program Banner Box & Title
  const programPillW = 460;
  const programPillH = 38;
  const programPillX = width / 2 - programPillW / 2;
  const programPillY = 270;
  roundRect(ctx, programPillX, programPillY, programPillW, programPillH, 19);
  ctx.fillStyle = "rgba(132, 189, 60, 0.18)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#84BD3C";
  ctx.stroke();

  ctx.font = "800 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#84BD3C";
  ctx.fillText("★ LIVE SEMINAR & WEBINAR PARTICIPANT DETAILS ★", width / 2, programPillY + programPillH / 2);

  // Main Heading
  ctx.font = "900 42px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(title, width / 2, 350);

  // Subtitle
  ctx.font = "500 20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText(subtitle, width / 2, 395);

  // 8. Center QR Code Container (Crisp White Card with Double Border)
  const qrCardSize = 580;
  const qrCardX = (width - qrCardSize) / 2;
  const qrCardY = 445;

  // QR Card Outer Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;
  roundRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 36);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  // QR Card Lime Outer Stroke
  roundRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 36);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#84BD3C";
  ctx.stroke();

  // Draw the QR Code image inside
  const qrImgSize = 460;
  const qrImgX = (width - qrImgSize) / 2;
  const qrImgY = qrCardY + 28;
  ctx.drawImage(qrImage, qrImgX, qrImgY, qrImgSize, qrImgSize);

  // Load official brand icon (/icon.png)
  const brandIcon = await loadBrandIcon();

  // Center Brand Badge inside QR (safe with error correction 'H')
  const badgeSize = 96;
  const badgeRadius = 22;
  const badgeX = (width - badgeSize) / 2;
  const badgeY = qrImgY + (qrImgSize - badgeSize) / 2;

  // Outer shadow & white badge container
  ctx.save();
  ctx.shadowColor = "rgba(24, 13, 69, 0.35)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, badgeRadius);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  // Lime stroke border around badge
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, badgeRadius);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#84BD3C";
  ctx.stroke();

  // Draw the official brand icon inside
  if (brandIcon) {
    const iconPadding = 12;
    ctx.drawImage(
      brandIcon,
      badgeX + iconPadding,
      badgeY + iconPadding,
      badgeSize - iconPadding * 2,
      badgeSize - iconPadding * 2
    );
  } else {
    ctx.font = "900 24px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#180D45";
    ctx.fillText("W", width / 2, badgeY + badgeSize / 2 + 1);
  }

  // Bottom text inside the QR Card
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#180D45";
  ctx.fillText("POINT MOBILE CAMERA TO SCAN", width / 2, qrCardY + qrCardSize - 50);

  ctx.font = "700 14px monospace";
  ctx.fillStyle = "#6B7280";
  ctx.fillText(targetUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""), width / 2, qrCardY + qrCardSize - 25);

  // 9. 3-Step Instruction Pills
  const stepsY = 1085;
  const stepItems = [
    { num: "1", title: "Open Camera", desc: "No App Needed" },
    { num: "2", title: "Scan QR", desc: "Tap notification" },
    { num: "3", title: "Fill Details", desc: "Takes 60 Seconds" },
  ];

  const pillWidth = 280;
  const pillHeight = 72;
  const pillGap = 25;
  const totalStepsWidth = 3 * pillWidth + 2 * pillGap;
  const startX = (width - totalStepsWidth) / 2;

  stepItems.forEach((step, idx) => {
    const x = startX + idx * (pillWidth + pillGap);
    roundRect(ctx, x, stepsY, pillWidth, pillHeight, 20);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.stroke();

    // Number circle
    const circleX = x + 38;
    const circleY = stepsY + pillHeight / 2;
    ctx.beginPath();
    ctx.arc(circleX, circleY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#84BD3C";
    ctx.fill();

    ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#180D45";
    ctx.fillText(step.num, circleX, circleY + 1);

    // Step text
    ctx.textAlign = "left";
    ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(step.title, x + 70, stepsY + 30);

    ctx.font = "500 13px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText(step.desc, x + 70, stepsY + 50);
    ctx.textAlign = "center";
  });

  // 10. Privacy & Trust Guarantee
  const trustY = 1205;
  const trustBoxW = 720;
  const trustBoxH = 50;
  const trustBoxX = (width - trustBoxW) / 2;
  roundRect(ctx, trustBoxX, trustY, trustBoxW, trustBoxH, 25);
  ctx.fillStyle = "rgba(132, 189, 60, 0.12)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(132, 189, 60, 0.35)";
  ctx.stroke();

  ctx.font = "700 16px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#84BD3C";
  ctx.fillText("🔒 100% Spam-Free • Confidential • AMFI Compliant Advisory", width / 2, trustY + trustBoxH / 2);

  // 11. Regulatory Footer Disclaimers
  ctx.font = "600 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText(
    "Wealthy Step™ • AMFI Registered Mutual Fund Distributor | ARN - 322891",
    width / 2,
    1305
  );

  ctx.font = "400 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText(
    "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully.",
    width / 2,
    1330
  );

  return canvas.toDataURL("image/png");
}

/**
 * Downloads the ultra-premium presentation card directly to the client's device.
 */
export async function downloadBrandedQrCard(
  targetUrl: string,
  filename = "WealthyStep_Awareness_Program_Slide_Card.png"
): Promise<void> {
  const dataUrl = await generateBrandedQrCard(targetUrl);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads a clean high-resolution standalone QR code PNG (1024x1024)
 * with the official Wealthy Step brand icon (/icon.png) embedded in the center.
 */
export async function downloadCleanQrCode(
  targetUrl: string,
  filename = "WealthyStep_Participant_QR_Code.png"
): Promise<void> {
  const qrSize = 1024;
  const rawQrUrl = await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: "H",
    width: qrSize,
    margin: 2,
    color: {
      dark: "#180D45",
      light: "#FFFFFF",
    },
  });

  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = rawQrUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = qrSize;
  canvas.height = qrSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2D context");

  // Draw QR code
  ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

  // Load and embed brand icon in center
  const brandIcon = await loadBrandIcon();
  const badgeSize = 210;
  const badgeRadius = 48;
  const badgeX = (qrSize - badgeSize) / 2;
  const badgeY = (qrSize - badgeSize) / 2;

  ctx.save();
  ctx.shadowColor = "rgba(24, 13, 69, 0.35)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, badgeRadius);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, badgeRadius);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#84BD3C";
  ctx.stroke();

  if (brandIcon) {
    const padding = 26;
    ctx.drawImage(
      brandIcon,
      badgeX + padding,
      badgeY + padding,
      badgeSize - padding * 2,
      badgeSize - padding * 2
    );
  } else {
    ctx.font = "900 64px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#180D45";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("W", qrSize / 2, qrSize / 2);
  }

  const finalUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = finalUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

