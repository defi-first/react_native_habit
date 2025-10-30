export function generateMacaronColors() {
  // 马卡龙色系的基色范围（柔和的色调）
  const colorRanges = [
    { h: [0, 15], s: [70, 90], l: [70, 80] }, // 粉色系
    { h: [180, 210], s: [60, 80], l: [70, 80] }, // 蓝色系
    { h: [280, 320], s: [50, 70], l: [70, 80] }, // 紫色系
    { h: [80, 140], s: [60, 80], l: [70, 80] }, // 绿色系
    { h: [40, 60], s: [70, 90], l: [75, 85] }, // 黄色系
    { h: [330, 360], s: [60, 80], l: [70, 80] }, // 玫红色系
  ];

  // 随机选择一个颜色范围
  const range = colorRanges[Math.floor(Math.random() * colorRanges.length)];

  // 生成基色（浅色）
  const baseH = randomInRange(range.h[0], range.h[1]);
  const baseS = randomInRange(range.s[0], range.s[1]);
  const baseL = randomInRange(range.l[0], range.l[1]);

  // 生成对应的深色（降低亮度，稍微增加饱和度）
  const darkH = baseH;
  const darkS = Math.min(100, baseS + 10);
  const darkL = Math.max(20, baseL - 30);

  // 转换HSL为HEX
  const lightColor = hslToHex(baseH, baseS, baseL);
  const darkColor = hslToHex(darkH, darkS, darkL);

  return {
    dark: darkColor,
    light: lightColor,
  };
}

// 辅助函数：生成指定范围内的随机数
function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 辅助函数：HSL转HEX
function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
