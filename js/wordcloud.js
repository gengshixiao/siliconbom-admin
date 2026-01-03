/* 词云生成功能 */

const WORD_CLOUD_COLORS = [
  'var(--color-blue)',
  'var(--color-teal)',
  'var(--color-green)',
  'var(--color-purple)',
  'var(--color-pink)',
  'var(--color-orange)'
];

/**
 * 获取文本的宽度和高度（估算）
 */
function getTextBounds(text, fontSize) {
  // 中文字符宽度约为fontSize，高度约为fontSize * 1.2
  const charWidth = fontSize * 0.8; // 中文字符宽度
  const textWidth = text.length * charWidth;
  const textHeight = fontSize * 1.2;
  return { width: textWidth, height: textHeight };
}

/**
 * 检查两个矩形是否重叠
 */
function checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x1 + w1 / 2 < x2 - w2 / 2 || 
           x1 - w1 / 2 > x2 + w2 / 2 || 
           y1 + h1 / 2 < y2 - h2 / 2 || 
           y1 - h1 / 2 > y2 + h2 / 2);
}

/**
 * 创建词云
 * @param {Array} words - 词云数据数组，格式: [{text: '词', size: 32, weight: 5}, ...]
 * @param {string} containerId - 容器ID
 * @param {number} width - 宽度，默认400
 * @param {number} height - 高度，默认280
 */
function createWordCloud(words, containerId, width = 400, height = 280) {
  const svg = document.querySelector(`#${containerId} svg`);
  if (!svg) return;
  
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  // 按权重排序，大的先放
  const sortedWords = [...words].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  
  const placedWords = [];
  const padding = 15; // 边距
  const maxAttempts = 200; // 增加尝试次数

  sortedWords.forEach((word, index) => {
    const fontSize = word.size;
    const bounds = getTextBounds(word.text, fontSize);
    const wordWidth = bounds.width;
    const wordHeight = bounds.height;
    
    let placed = false;
    let attempts = 0;
    let x, y;

    // 使用改进的螺旋布局算法
    while (!placed && attempts < maxAttempts) {
      // 黄金角度螺旋布局（137.5度，约2.4弧度）
      const goldenAngle = 2.4;
      const angle = index * goldenAngle + attempts * 0.3;
      const radius = Math.sqrt(attempts) * 15; // 增加间距到15
      
      x = width / 2 + Math.cos(angle) * radius;
      y = height / 2 + Math.sin(angle) * radius;

      // 边界检查
      if (x - wordWidth / 2 < padding || x + wordWidth / 2 > width - padding ||
          y - wordHeight / 2 < padding || y + wordHeight / 2 > height - padding) {
        attempts++;
        continue;
      }

      // 检查是否与已放置的词重叠（增加间距缓冲）
      let overlap = false;
      const spacing = 8; // 词语之间的最小间距
      for (let placedWord of placedWords) {
        const placedBounds = getTextBounds(placedWord.text, placedWord.size);
        const expandedWidth = wordWidth + spacing;
        const expandedHeight = wordHeight + spacing;
        const placedExpandedWidth = placedBounds.width + spacing;
        const placedExpandedHeight = placedBounds.height + spacing;
        
        if (checkOverlap(
          x, y, expandedWidth, expandedHeight,
          placedWord.x, placedWord.y, placedExpandedWidth, placedExpandedHeight
        )) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        placed = true;
        placedWords.push({
          x, y, 
          size: fontSize,
          text: word.text,
          weight: word.weight
        });
      }
      attempts++;
    }

    // 如果还是没放置，尝试随机位置
    if (!placed) {
      const spacing = 8;
      for (let i = 0; i < 150; i++) {
        x = padding + wordWidth / 2 + Math.random() * (width - padding * 2 - wordWidth);
        y = padding + wordHeight / 2 + Math.random() * (height - padding * 2 - wordHeight);
        
        let overlap = false;
        const expandedWidth = wordWidth + spacing;
        const expandedHeight = wordHeight + spacing;
        
        for (let placedWord of placedWords) {
          const placedBounds = getTextBounds(placedWord.text, placedWord.size);
          const placedExpandedWidth = placedBounds.width + spacing;
          const placedExpandedHeight = placedBounds.height + spacing;
          
          if (checkOverlap(
            x, y, expandedWidth, expandedHeight,
            placedWord.x, placedWord.y, placedExpandedWidth, placedExpandedHeight
          )) {
            overlap = true;
            break;
          }
        }
        
        if (!overlap) {
          placed = true;
          placedWords.push({
            x, y,
            size: fontSize,
            text: word.text,
            weight: word.weight
          });
          break;
        }
      }
    }

    // 渲染文字
    if (placed) {
      const color = WORD_CLOUD_COLORS[index % WORD_CLOUD_COLORS.length];
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('font-size', fontSize);
      text.setAttribute('fill', color);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('class', 'word-cloud-text');
      text.setAttribute('font-weight', word.weight >= 3 ? '600' : word.weight >= 2 ? '500' : '400');
      text.textContent = word.text;
      svg.appendChild(text);
    }
  });
}

