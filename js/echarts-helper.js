/* ECharts图表辅助函数 - 支持多种图表类型和横轴缩放 */

/**
 * 将十六进制颜色转换为rgba
 */
function hexToRgba(hex, alpha) {
  if (hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (hex.startsWith('rgba')) {
    return hex.replace(/[\d\.]+\)$/g, alpha + ')');
  }
  return hex;
}

/**
 * 创建支持缩放的时间趋势图表（多种类型）
 * @param {string} containerId - 容器ID
 * @param {Object} config - 配置对象
 * @param {Array} config.data - 数据数组
 * @param {Array} config.series - 系列配置
 * @param {Object} config.yAxis - Y轴配置
 * @param {string} config.chartType - 图表类型: 'line'|'bar'|'area'|'stackedArea'|'stackedBar'|'dualAxis'
 */
function createZoomableChart(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Chart container not found:', containerId);
    return null;
  }
  
  if (!config || !config.data || !Array.isArray(config.data) || config.data.length === 0) {
    console.error('Invalid chart config or empty data:', containerId);
    return null;
  }
  
  if (!config.series || !Array.isArray(config.series) || config.series.length === 0) {
    console.error('Invalid series config:', containerId);
    return null;
  }
  
  if (typeof echarts === 'undefined') {
    console.error('ECharts library not loaded');
    return null;
  }

  const chartType = config.chartType || 'line';
  
  // 确保dates数组有效
  const dates = config.data.map(d => {
    const date = d.date || d.label;
    return date || '';
  }).filter(d => d !== '');
  
  if (dates.length === 0) {
    console.error('No valid dates found in data:', containerId);
    return null;
  }
  
  const seriesData = [];
  
  // 根据图表类型生成不同的系列配置
  config.series.forEach((series, index) => {
    const values = config.data.map(d => {
      const val = d.values && d.values[index] !== undefined ? d.values[index] : 0;
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    });
    const baseSeries = {
      name: series.name,
      data: values,
      itemStyle: {
        color: series.color
      }
    };

    switch(chartType) {
      case 'bar':
        Object.assign(baseSeries, {
          type: 'bar',
          barWidth: '60%',
          barGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: hexToRgba(series.color, 0.8)
              }, {
                offset: 1,
                color: hexToRgba(series.color, 0.4)
              }]
            },
            borderRadius: [4, 4, 0, 0]
          }
        });
        break;

      case 'stackedBar':
        const stackedBarStyle = {
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          itemStyle: {
            color: series.color
          }
        };
        // 只有最上面的柱子有圆角
        if (index === config.series.length - 1) {
          stackedBarStyle.itemStyle.borderRadius = [4, 4, 0, 0];
        }
        Object.assign(baseSeries, stackedBarStyle);
        break;

      case 'area':
        Object.assign(baseSeries, {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2.5,
            color: series.color
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: hexToRgba(series.color, 0.4)
              }, {
                offset: 1,
                color: hexToRgba(series.color, 0)
              }]
            }
          }
        });
        break;

      case 'stackedArea':
        Object.assign(baseSeries, {
          type: 'line',
          smooth: true,
          stack: 'total',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: series.color
          },
          areaStyle: {
            color: series.color,
            opacity: 0.6
          }
        });
        break;

      case 'dualAxis':
        // 双Y轴：第一个系列用左轴，其他用右轴
        const dualAxisSeries = {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2.5,
            color: series.color
          },
          yAxisIndex: index === 0 ? 0 : 1
        };
        // 默认显示面积，除非明确禁用
        if (config.showArea !== false) {
          dualAxisSeries.areaStyle = {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: hexToRgba(series.color, 0.3)
              }, {
                offset: 1,
                color: hexToRgba(series.color, 0)
              }]
            }
          };
        }
        Object.assign(baseSeries, dualAxisSeries);
        break;

      default: // 'line'
        Object.assign(baseSeries, {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2.5,
            color: series.color
          },
          areaStyle: config.showArea ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: hexToRgba(series.color, 0.3)
              }, {
                offset: 1,
                color: hexToRgba(series.color, 0)
              }]
            }
          } : null
        });
    }
    
    seriesData.push(baseSeries);
  });

  // 计算Y轴范围
  const allValues = config.data.flatMap(d => d.values || []);
  const yMin = config.yAxis?.min ?? Math.min(0, Math.min(...allValues));
  const yMax = config.yAxis?.max ?? Math.max(...allValues);

  // 双Y轴配置 - 计算每个系列的数据范围
  let yAxisConfig;
  if (chartType === 'dualAxis' && config.series.length >= 2) {
    const firstSeriesValues = config.data.map(d => d.values[0] || 0);
    const secondSeriesValues = config.data.map(d => d.values[1] || 0);
    const firstMin = Math.min(0, Math.min(...firstSeriesValues));
    const firstMax = Math.max(...firstSeriesValues);
    const secondMin = Math.min(0, Math.min(...secondSeriesValues));
    const secondMax = Math.max(...secondSeriesValues);
    
    // 为双Y轴计算合适的范围，留出一些边距
    const firstRange = firstMax - firstMin;
    const secondRange = secondMax - secondMin;
    const firstPadding = firstRange * 0.1;
    const secondPadding = secondRange * 0.1;
    
    yAxisConfig = [
      {
        type: 'value',
        name: config.series[0]?.name || '',
        min: config.yAxis?.min !== undefined ? config.yAxis.min : Math.max(0, firstMin - firstPadding),
        max: config.yAxis?.max !== undefined ? config.yAxis.max : firstMax + firstPadding,
        splitNumber: 5,
        axisLine: { 
          show: true,
          lineStyle: { color: config.series[0]?.color || '#999' }
        },
        axisTick: { show: false },
        axisLabel: {
          color: config.series[0]?.color || '#999',
          fontSize: 11,
          formatter: config.yAxis?.format || function(value) {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return Math.round(value).toString();
          }
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'solid' }
        }
      },
      {
        type: 'value',
        name: config.series[1]?.name || '',
        min: config.yAxis?.min !== undefined ? config.yAxis.min : Math.max(0, secondMin - secondPadding),
        max: config.yAxis?.max !== undefined ? config.yAxis.max : secondMax + secondPadding,
        splitNumber: 5,
        position: 'right',
        axisLine: { 
          show: true,
          lineStyle: { color: config.series[1]?.color || '#999' }
        },
        axisTick: { show: false },
        axisLabel: {
          color: config.series[1]?.color || '#999',
          fontSize: 11,
          formatter: config.yAxis?.format || function(value) {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return Math.round(value).toString();
          }
        },
        splitLine: { show: false }
      }
    ];
  } else {
    yAxisConfig = [{
      type: 'value',
      min: yMin,
      max: yMax,
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 11,
        formatter: config.yAxis?.format || function(value) {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
          if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
          return Math.round(value).toString();
        }
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'solid' }
      }
    }];
  }

  // ECharts配置
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: chartType === 'dualAxis' ? '60px' : '50px',
      right: chartType === 'dualAxis' ? '60px' : '20px',
      top: '30px',
      bottom: '70px',
      containLabel: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(37, 37, 37, 0.95)',
      borderColor: 'rgba(58, 58, 58, 1)',
      borderWidth: 1,
      textStyle: { color: '#e0e0e0' },
      axisPointer: {
        type: chartType === 'bar' || chartType === 'stackedBar' ? 'shadow' : 'cross',
        lineStyle: { color: '#999', opacity: 0.5 }
      }
    },
    legend: { show: false },
    xAxis: [{
      type: 'category',
      boundaryGap: chartType === 'bar' || chartType === 'stackedBar' ? true : false,
      data: dates,
      axisLine: { 
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.1)' } 
      },
      axisLabel: { 
        color: '#999', 
        fontSize: 11, 
        interval: 'auto'
      },
      axisTick: { show: false }
    }],
    yAxis: yAxisConfig,
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      },
      {
        type: 'slider',
        show: true,
        height: 20,
        start: 0,
        end: 100,
        bottom: 10,
        handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: { color: '#4a4a4a', borderColor: '#3a3a3a' },
        textStyle: { color: '#999', fontSize: 11 },
        borderColor: '#3a3a3a',
        fillerColor: 'rgba(255,255,255,0.1)',
        dataBackground: {
          lineStyle: { color: 'rgba(255,255,255,0.3)' },
          areaStyle: { color: 'rgba(255,255,255,0.05)' }
        },
        selectedDataBackground: {
          lineStyle: { color: '#4a4a4a' },
          areaStyle: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    ],
    series: seriesData
  };

  try {
    // 确保容器有尺寸
    if (!container.style.width || container.style.width === 'auto') {
      container.style.width = '100%';
    }
    if (!container.style.height || container.style.height === 'auto') {
      container.style.height = '240px';
    }

    // 使用默认渲染器（canvas），更兼容
    const chart = echarts.init(container);

    if (!chart) {
      console.error('Failed to initialize chart:', containerId);
      return null;
    }

    // 设置配置
    chart.setOption(option, true);

    // 立即调整大小
    chart.resize();

    // 延迟再次调整，确保DOM已完全渲染
    setTimeout(() => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    }, 200);

    // 响应式调整
    let resizeTimer;
    const resizeHandler = function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (chart && !chart.isDisposed()) {
          chart.resize();
        }
      }, 100);
    };
    window.addEventListener('resize', resizeHandler);

    return chart;
  } catch (error) {
    console.error('Error creating chart:', containerId, error);
    console.error('Error details:', error.message);
    return null;
  }
}
