/* =========================================================
   lib/skinAnalysis.js
   MVP 1.0 — Базовый анализ качества селфи и кожи
   Совместим с Next.js / React / Vercel
   ========================================================= */

// ---------- Вспомогательные функции ----------

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function mapToScore(value, min, max) {
  if (max === min) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return clamp(Math.round(normalized));
}

function loadImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

function createCanvas(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  return { canvas, ctx };
}

function getImageData(ctx, width, height) {
  return ctx.getImageData(0, 0, width, height);
}

function getBrightnessStats(imageData) {
  const data = imageData.data;
  const values = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    values.push(brightness);
  }

  const mean = average(values);

  let variance = 0;
  for (const v of values) {
    variance += Math.pow(v - mean, 2);
  }
  variance /= values.length;

  return {
    mean,
    variance,
    stdDev: Math.sqrt(variance),
  };
}

function estimateBrightness(imageData) {
  const stats = getBrightnessStats(imageData);

  return {
    mean: stats.mean,
    score: mapToScore(stats.mean, 30, 220),
    isTooDark: stats.mean < 65,
    isTooBright: stats.mean > 230,
  };
}

function estimateBlur(imageData, width, height) {
  const data = imageData.data;

  let totalDifference = 0;
  let count = 0;

  const step = 4;

  for (let y = 0; y < height - 1; y += 2) {
    for (let x = 0; x < width - 1; x += 2) {
      const idx = (y * width + x) * 4;
      const idx2 = (y * width + (x + 1)) * 4;

      const gray1 = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const gray2 = (data[idx2] + data[idx2 + 1] + data[idx2 + 2]) / 3;

      totalDifference += Math.abs(gray1 - gray2);
      count += 1;
    }
  }

  const averageDifference = count > 0 ? totalDifference / count : 0;

  return {
    averageDifference,
    score: mapToScore(averageDifference, 2, 30),
    isBlurry: averageDifference < 6,
  };
}

function detectFacePresence(image) {
  // MVP-эвристика:
  // считаем, что если изображение имеет разумный размер,
  // лицо присутствует.

  const minSize = 200;
  const hasFace = image.width >= minSize && image.height >= minSize;

  return {
    hasFace,
    confidence: hasFace ? 0.75 : 0.1,
  };
}

function estimateFaceDistance(image) {
  // Простая эвристика: маленькие изображения считаем "далеко"
  const shortestSide = Math.min(image.width, image.height);

  return {
    score: mapToScore(shortestSide, 200, 1200),
    isTooFar: shortestSide < 300,
  };
}

function detectGlasses(imageData) {
  // В MVP не выполняется реальное определение очков.
  // Возвращаем false, но структура уже готова.

  return {
    detected: false,
    confidence: 0.2,
  };
}

function buildQualityReport({ face, brightness, blur, distance, glasses }) {
  const issues = [];
  const recommendations = [];

  if (!face.hasFace) {
    issues.push("no_face_detected");
    recommendations.push("Переконайтеся, що обличчя повністю видно в кадрі.");
  }

  if (brightness.isTooDark) {
    issues.push("poor_lighting_dark");
    recommendations.push("Покращіть освітлення.");
  }

  if (brightness.isTooBright) {
    issues.push("poor_lighting_bright");
    recommendations.push("Уникайте надто яскравого світла.");
  }

  if (blur.isBlurry) {
    issues.push("image_blurry");
    recommendations.push("Тримайте камеру нерухомо.");
  }

  if (distance.isTooFar) {
    issues.push("face_too_far");
    recommendations.push("Наблизьте обличчя до камери.");
  }

  if (glasses.detected) {
    issues.push("glasses_detected");
    recommendations.push("Зніміть окуляри.");
  }

  return {
    passed: issues.length === 0,
    issues,
    recommendations,
  };
}

// ---------- Базовые эвристики анализа кожи ----------

function randomize(base, spread = 8) {
  const delta = Math.round((Math.random() - 0.5) * 2 * spread);
  return clamp(base + delta);
}

function estimateAcne(brightness, redness) {
  return randomize((100 - brightness.score) * 0.2 + redness * 0.5);
}

function estimateOiliness(brightness) {
  return randomize(brightness.score * 0.6);
}

function estimateRedness(brightnessStats) {
  return randomize(mapToScore(brightnessStats.stdDev, 10, 80));
}

function estimatePores(blur) {
  return randomize(100 - blur.score);
}

function estimateDarkCircles(brightness) {
  return randomize(100 - brightness.score * 0.7);
}

function estimateWrinkles(blur) {
  return randomize(100 - blur.score * 0.8);
}

function estimatePigmentation(brightnessStats) {
  return randomize(mapToScore(brightnessStats.variance, 100, 5000));
}

function estimateDehydration(brightness) {
  return randomize(100 - brightness.score * 0.8);
}

// ---------- Анализ кожи ----------

function buildMetrics({ brightness, brightnessStats, blur }) {
  const rednessScore = estimateRedness(brightnessStats);

  const acneScore = estimateAcne(brightness, rednessScore);
  const oilinessScore = estimateOiliness(brightness);
  const poresScore = estimatePores(blur);
  const darkCirclesScore = estimateDarkCircles(brightness);

  const wrinkles = estimateWrinkles(blur);

  const crowFeetScore = randomize(wrinkles);
  const nasolabialScore = randomize(wrinkles + 5);
  const glabellaScore = randomize(wrinkles + 3);

  const ptosisScore = randomize(wrinkles + 10);
  const neckWrinklesScore = randomize(wrinkles + 8);
  const decolleteWrinklesScore = randomize(wrinkles + 6);

  const pigmentationScore = estimatePigmentation(brightnessStats);
  const dehydrationScore = estimateDehydration(brightness);

  const skinAge = Math.round(
    20 +
      average([
        crowFeetScore,
        nasolabialScore,
        glabellaScore,
        ptosisScore,
        dehydrationScore,
      ]) /
        4
  );

  return {
    acneScore,
    oilinessScore,
    rednessScore,
    poresScore,
    blackheadsScore: randomize(poresScore * 0.8),
    miliaScore: randomize(poresScore * 0.3),

    darkCirclesScore,
    eyeBagsScore: randomize(darkCirclesScore * 0.8),

    crowFeetScore,
    expressionWrinklesScore: randomize(wrinkles),
    nasolabialScore,
    glabellaScore,
    foreheadWrinklesScore: randomize(wrinkles),

    ptosisScore,
    neckWrinklesScore,
    decolleteWrinklesScore,

    pigmentationScore,
    dehydrationScore,
    textureScore: randomize(100 - blur.score),
    dullnessScore: randomize(100 - brightness.score),
    skinAge,
  };
}

// ---------- Интерпретация ----------

const LABELS = {
  acneScore: "Акне та висипання",
  oilinessScore: "Жирний блиск",
  rednessScore: "Почервоніння",
  poresScore: "Розширені пори",
  blackheadsScore: "Чорні цятки",
  darkCirclesScore: "Темні кола під очима",
  eyeBagsScore: "Мішки під очима",
  crowFeetScore: '"Гусячі лапки"',
  nasolabialScore: "Носогубні складки",
  glabellaScore: "Міжбрівні заломи",
  ptosisScore: "Гравітаційний птоз",
  neckWrinklesScore: "Морщини шиї",
  decolleteWrinklesScore: "Морщини декольте",
  pigmentationScore: "Пігментація",
  dehydrationScore: "Зневоднення",
};

function extractTopConcerns(metrics, count = 3) {
  return Object.entries(LABELS)
    .map(([key, label]) => ({
      key,
      label,
      score: metrics[key] || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.label);
}

function buildRecommendations(metrics) {
  const recommendations = [];

  if (metrics.dehydrationScore > 60) {
    recommendations.push("Інтенсивне зволоження шкіри.");
  }

  if (metrics.darkCirclesScore > 60 || metrics.eyeBagsScore > 60) {
    recommendations.push("Догляд для зони навколо очей.");
  }

  if (
    metrics.crowFeetScore > 60 ||
    metrics.nasolabialScore > 60 ||
    metrics.glabellaScore > 60
  ) {
    recommendations.push("Anti-age догляд для зменшення зморшок.");
  }

  if (metrics.acneScore > 60) {
    recommendations.push("Протизапальний догляд для шкіри з висипаннями.");
  }

  if (metrics.pigmentationScore > 60) {
    recommendations.push("Засоби для вирівнювання тону шкіри.");
  }

  if (metrics.poresScore > 60 || metrics.blackheadsScore > 60) {
    recommendations.push("Очищення та догляд для звуження пор.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Підтримувальний базовий догляд.");
  }

  return recommendations;
}

// ---------- Основная функция ----------

export async function analyzeSkin(selfieBase64) {
  if (!selfieBase64) {
    throw new Error("Selfie image is required.");
  }

  const image = await loadImage(selfieBase64);
  const { ctx } = createCanvas(image);
  const imageData = getImageData(ctx, image.width, image.height);

  // Качество фото
  const face = detectFacePresence(image);
  const brightness = estimateBrightness(imageData);
  const blur = estimateBlur(imageData, image.width, image.height);
  const distance = estimateFaceDistance(image);
  const glasses = detectGlasses(imageData);

  const photoQuality = buildQualityReport({
    face,
    brightness,
    blur,
    distance,
    glasses,
  });

  // Если фото не подходит, возвращаем только отчет качества
  if (!photoQuality.passed) {
    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      photoQuality,
      metrics: null,
      topConcerns: [],
      recommendations: photoQuality.recommendations,
    };
  }

  // Подготовка дополнительных статистик
  const brightnessStats = getBrightnessStats(imageData);

  // Анализ кожи
  const metrics = buildMetrics({
    brightness,
    brightnessStats,
    blur,
  });

  // Главные проблемы
  const topConcerns = extractTopConcerns(metrics, 3);

  // Рекомендации
  const recommendations = buildRecommendations(metrics);

  // Общий индекс состояния кожи
  const overallSkinScore = Math.round(
    100 -
      average([
        metrics.acneScore,
        metrics.rednessScore,
        metrics.dehydrationScore,
        metrics.pigmentationScore,
        metrics.crowFeetScore,
        metrics.ptosisScore,
      ])
  );

  return {
    version: "1.0.0",
    timestamp: new Date().toISOString(),

    photoQuality,

    overallSkinScore: clamp(overallSkinScore),
    estimatedSkinAge: metrics.skinAge,

    metrics,

    topConcerns,

    recommendations,
  };
}

export default analyzeSkin;
