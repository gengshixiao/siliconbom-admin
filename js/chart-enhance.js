/* 图表增强功能 - 添加坐标轴标签和hover交互 */

/**
 * 增强图表：添加坐标轴标签和hover交互（跟随鼠标）
 */
function enhanceChart(svgSelector, config) {
  const svg = document.querySelector(svgSelector);
  if (!svg) return;

  const viewBox = svg.getAttribute('viewBox') || '0 0 800 280';
  const [x0, y0, width, height] = viewBox.split(' ').map(Number);
  const padding = { left: 40, right: 40, top: 20, bottom: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 添加坐标轴标签组
  const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  axesGroup.setAttribute('class', 'chart-axes');

  // Y轴标签
  if (config.axes && config.axes.y && config.axes.y.labels) {
    const yLabels = config.axes.y.labels;
    const yMin = config.axes.y.min || 0;
    const yMax = config.axes.y.max || 100;

    yLabels.forEach((label, i) => {
      const y = padding.top + chartHeight - (i / (yLabels.length - 1 || 1)) * chartHeight;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', padding.left - 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('fill', 'var(--text-muted)');
      text.setAttribute('font-size', '11');
      text.textContent = label;
      axesGroup.appendChild(text);
    });
  }

  // X轴标签
  if (config.axes && config.axes.x && config.axes.x.labels) {
    const xLabels = config.axes.x.labels;
    const xStep = chartWidth / (xLabels.length - 1 || 1);

    xLabels.forEach((label, i) => {
      const x = padding.left + i * xStep;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', height - padding.bottom + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--text-muted)');
      text.setAttribute('font-size', '11');
      text.textContent = label;
      axesGroup.appendChild(text);
    });
  }

  svg.appendChild(axesGroup);

  // 添加hover交互（跟随鼠标）
  if (config.data && config.data.length > 0 && config.series) {
    const hoverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverGroup.setAttribute('class', 'chart-hover');

    // 创建hover提示框
    const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tooltip.setAttribute('class', 'chart-tooltip');
    tooltip.style.display = 'none';
    tooltip.style.pointerEvents = 'none';

    const tooltipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tooltipRect.setAttribute('fill', 'var(--bg-card)');
    tooltipRect.setAttribute('stroke', 'var(--border)');
    tooltipRect.setAttribute('stroke-width', '1');
    tooltipRect.setAttribute('rx', '4');
    tooltipRect.setAttribute('opacity', '0.95');
    tooltip.appendChild(tooltipRect);

    const tooltipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltipText.setAttribute('fill', 'var(--text)');
    tooltipText.setAttribute('font-size', '12');
    tooltipText.setAttribute('x', '8');
    tooltipText.setAttribute('y', '20');
    tooltip.appendChild(tooltipText);

    // 创建指示线
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'var(--text-muted)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4,4');
    line.setAttribute('opacity', '0');
    line.style.transition = 'opacity 0.2s';
    hoverGroup.appendChild(line);

    // 数据点标记容器
    const pointsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hoverGroup.appendChild(pointsGroup);
    hoverGroup.appendChild(tooltip);
    svg.appendChild(hoverGroup);

    const yMin = (config.axes && config.axes.y && config.axes.y.min) || 0;
    const yMax = (config.axes && config.axes.y && config.axes.y.max) || 100;
    const dataLength = config.data.length;
    const xStep = chartWidth / (dataLength - 1 || 1);

    // 创建整个图表的交互区域
    const chartArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    chartArea.setAttribute('x', padding.left);
    chartArea.setAttribute('y', padding.top);
    chartArea.setAttribute('width', chartWidth);
    chartArea.setAttribute('height', chartHeight);
    chartArea.setAttribute('fill', 'transparent');
    chartArea.style.pointerEvents = 'all';
    chartArea.style.cursor = 'crosshair';

    // 缓存当前显示的数据点索引，避免重复更新
    let currentIndex = -1;

    // 将屏幕坐标转换为SVG viewBox坐标（优化版本，缓存svgRect）
    let cachedSvgRect = null;
    function screenToSVG(screenX, screenY) {
      // 每次重新获取，因为SVG可能被缩放
      cachedSvgRect = svg.getBoundingClientRect();
      
      // 计算缩放比例
      const scaleX = width / cachedSvgRect.width;
      const scaleY = height / cachedSvgRect.height;
      
      // 转换为相对于SVG的坐标
      const relativeX = (screenX - cachedSvgRect.left) * scaleX;
      const relativeY = (screenY - cachedSvgRect.top) * scaleY;
      
      return { x: relativeX, y: relativeY };
    }

    // 获取最接近的数据点
    function getNearestPoint(svgX) {
      const relativeX = svgX - padding.left;
      const index = Math.round(relativeX / xStep);
      return Math.max(0, Math.min(index, dataLength - 1));
    }

    // 预创建数据点圆圈（重用DOM元素）
    const circleCache = [];
    function getOrCreateCircle(index) {
      if (!circleCache[index]) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '5');
        circle.setAttribute('stroke', 'var(--bg-card)');
        circle.setAttribute('stroke-width', '2');
        pointsGroup.appendChild(circle);
        circleCache[index] = circle;
      }
      return circleCache[index];
    }

    // 从SVG path中提取折线坐标点（只提取L命令的点，跳过M起点和Z闭合）
    function extractPathPoints(pathElement) {
      if (!pathElement) return [];
      const d = pathElement.getAttribute('d');
      if (!d) return [];
      
      const points = [];
      // 匹配所有L命令的坐标点（L x,y格式）
      const lCommands = d.match(/L\s*(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?)/g);
      if (lCommands) {
        lCommands.forEach(cmd => {
          const match = cmd.match(/(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?)/);
          if (match) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            // 只添加在图表区域内的点（排除底部填充点）
            if (y < padding.top + chartHeight && x >= padding.left && x <= padding.left + chartWidth) {
              points.push({ x, y });
            }
          }
        });
      }
      
      // 如果没有L命令，尝试匹配M命令后的所有坐标（某些path可能只有M和坐标）
      if (points.length === 0) {
        // 匹配M后的第一个点，然后所有后续坐标
        const allCoords = d.match(/(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?)/g);
        if (allCoords && allCoords.length > 1) {
          // 跳过第一个点（M的起点），取后续的点
          for (let i = 1; i < allCoords.length; i++) {
            const match = allCoords[i].match(/(\d+(?:\.\d+)?),?\s*(\d+(?:\.\d+)?)/);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              if (y < padding.top + chartHeight && x >= padding.left && x <= padding.left + chartWidth) {
                points.push({ x, y });
              }
            }
          }
        }
      }
      
      // 按x坐标排序，确保顺序正确
      points.sort((a, b) => a.x - b.x);
      
      // 如果点的数量超过数据点数量，只取前N个（按x坐标均匀分布）
      if (points.length > dataLength) {
        const step = Math.floor(points.length / dataLength);
        const filtered = [];
        for (let i = 0; i < dataLength; i++) {
          const idx = Math.min(i * step, points.length - 1);
          filtered.push(points[idx]);
        }
        return filtered;
      }
      
      return points;
    }

    // 获取所有折线路径的实际坐标点
    // 优先选择有stroke且没有fill的path（折线），排除只有fill的path（面积填充）
    const allPaths = svg.querySelectorAll('path');
    const pathPointsCache = [];
    let pathIndex = 0;
    
    allPaths.forEach((path) => {
      const stroke = path.getAttribute('stroke');
      const fill = path.getAttribute('fill');
      
      // 只处理折线path（有stroke且fill为none或transparent，或者没有fill）
      if (stroke && (!fill || fill === 'none' || fill === 'transparent' || !fill.startsWith('url'))) {
        const points = extractPathPoints(path);
        if (points.length > 0 && points.length >= dataLength) {
          pathPointsCache[pathIndex] = points;
          pathIndex++;
        }
      }
    });

    // 更新hover显示（优化版本）
    function updateHover(screenX, screenY) {
      // 将屏幕坐标转换为SVG坐标
      const svgCoords = screenToSVG(screenX, screenY);
      const index = getNearestPoint(svgCoords.x);
      
      // 如果索引没变，跳过更新
      if (index === currentIndex) return;
      
      currentIndex = index;
      const point = config.data[index];
      if (!point) return;

      // 优先使用path中的实际x坐标（更精确）
      let x = padding.left + index * xStep;
      if (pathPointsCache.length > 0 && pathPointsCache[0] && pathPointsCache[0][index]) {
        x = pathPointsCache[0][index].x;
      }

      // 更新数据点标记（重用已有元素）
      // 优先使用从SVG path中提取的实际坐标
      let circleIndex = 0;
      if (point.values && Array.isArray(point.values)) {
        point.values.forEach((value, seriesIndex) => {
          const series = config.series[seriesIndex];
          if (!series) return;

          let y, circleX = x;
          // 如果可以从path中获取实际坐标，使用实际坐标
          // pathPointsCache的索引应该对应series的索引
          if (pathPointsCache[seriesIndex] && 
              pathPointsCache[seriesIndex].length > index &&
              pathPointsCache[seriesIndex][index]) {
            const pathPoint = pathPointsCache[seriesIndex][index];
            // 使用path中的实际坐标（更精确）
            circleX = pathPoint.x;
            y = pathPoint.y;
          } else {
            // 回退：根据数据值计算y坐标
            y = padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
          }
          
          const circle = getOrCreateCircle(circleIndex);
          circle.setAttribute('cx', circleX);
          circle.setAttribute('cy', y);
          circle.setAttribute('fill', series.color);
          circle.setAttribute('opacity', '1');
          circleIndex++;
        });
      }
      
      // 隐藏多余的圆圈
      for (let i = circleIndex; i < circleCache.length; i++) {
        if (circleCache[i]) {
          circleCache[i].setAttribute('opacity', '0');
        }
      }

      // 更新提示框内容（只在数据点改变时更新）
      while (tooltipText.firstChild) {
        tooltipText.removeChild(tooltipText.firstChild);
      }

      let tooltipContent = point.label || point.date || `第 ${index + 1} 个数据点`;
      if (point.values && Array.isArray(point.values)) {
        point.values.forEach((value, idx) => {
          const series = config.series[idx];
          if (series) {
            tooltipContent += `\n${series.name}: ${formatValue(value, config.axes && config.axes.y)}`;
          }
        });
      }

      const lines = tooltipContent.split('\n');
      lines.forEach((lineText, idx) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', '8');
        tspan.setAttribute('dy', idx === 0 ? '0' : '16');
        tspan.setAttribute('font-weight', idx === 0 ? '600' : '400');
        tspan.textContent = lineText;
        tooltipText.appendChild(tspan);
      });

      // 计算提示框位置
      const bbox = tooltipText.getBBox();
      tooltipRect.setAttribute('width', bbox.width + 16);
      tooltipRect.setAttribute('height', bbox.height + 16);
      
      let tooltipX = x - bbox.width / 2;
      if (tooltipX < 8) tooltipX = 8;
      if (tooltipX + bbox.width + 16 > width) tooltipX = width - bbox.width - 16;
      
      const tooltipY = Math.max(8, padding.top - bbox.height - 30);
      
      tooltip.setAttribute('transform', `translate(${tooltipX}, ${tooltipY})`);
      tooltip.style.display = 'block';
    }

    // 优化鼠标移动事件 - 立即更新位置，延迟更新内容
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 16; // 约60fps
    
    chartArea.addEventListener('mousemove', function(e) {
      const now = performance.now();
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      
      // 检查鼠标是否在图表区域内
      if (svgCoords.x >= padding.left && svgCoords.x <= padding.left + chartWidth &&
          svgCoords.y >= padding.top && svgCoords.y <= padding.top + chartHeight) {
        
        const index = getNearestPoint(svgCoords.x);
        // 优先使用path中的实际x坐标（更精确）
        let x = padding.left + index * xStep;
        if (pathPointsCache.length > 0 && pathPointsCache[0] && pathPointsCache[0][index]) {
          x = pathPointsCache[0][index].x;
        }
        
        // 立即更新指示线位置（这个很快）
        line.setAttribute('x1', x);
        line.setAttribute('x2', x);
        line.setAttribute('opacity', '0.5');
        
        // 如果索引改变或超过更新间隔，才完整更新
        if (index !== currentIndex || (now - lastUpdateTime) >= UPDATE_INTERVAL) {
          updateHover(e.clientX, e.clientY);
          lastUpdateTime = now;
        }
      }
    });

    chartArea.addEventListener('mouseleave', function() {
      currentIndex = -1;
      
      line.setAttribute('opacity', '0');
      // 隐藏所有圆圈
      circleCache.forEach(circle => {
        if (circle) circle.setAttribute('opacity', '0');
      });
      tooltip.style.display = 'none';
    });

    hoverGroup.appendChild(chartArea);
  }
}

/**
 * 格式化数值
 */
function formatValue(value, yAxis) {
  if (yAxis && yAxis.format) {
    return yAxis.format(value);
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return Math.round(value).toString();
}

/**
 * 生成日期标签（近30天）
 */
function generateDateLabels(days = 30, format = 'M-D') {
  const labels = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let label = '';
    if (format === 'M-D') {
      label = `${date.getMonth() + 1}-${date.getDate()}`;
    } else if (format === 'Y-M-D') {
      label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else if (format === 'M/D') {
      label = `${date.getMonth() + 1}/${date.getDate()}`;
    }
    
    labels.push(label);
  }
  
  // 只返回需要显示的标签（均匀分布）
  const step = Math.ceil(days / 8); // 显示8个标签
  const result = [];
  for (let i = 0; i < labels.length; i += step) {
    result.push(labels[i]);
  }
  if (result[result.length - 1] !== labels[labels.length - 1]) {
    result.push(labels[labels.length - 1]);
  }
  return result;
}
