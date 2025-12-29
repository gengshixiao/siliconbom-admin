/* BOM看板页面特定脚本 */

// 词云数据
const bomWords = [
  { text: '替换料号', size: 32, weight: 5 },
  { text: '成本优化', size: 28, weight: 4 },
  { text: '规格调整', size: 28, weight: 4 },
  { text: '物料对齐', size: 24, weight: 3 },
  { text: '供货周期', size: 20, weight: 2 },
  { text: '封装变更', size: 20, weight: 2 },
  { text: '新增器件', size: 20, weight: 2 },
  { text: 'BOM 清理', size: 20, weight: 2 },
  { text: '规格书更新', size: 18, weight: 1 },
  { text: '停产', size: 16, weight: 1 },
  { text: '兼容', size: 16, weight: 1 },
  { text: '参数校验', size: 16, weight: 1 },
  { text: '替代方案', size: 16, weight: 1 },
  { text: '版本回滚', size: 16, weight: 1 },
  { text: '数量修正', size: 16, weight: 1 },
  { text: '备注补充', size: 16, weight: 1 },
  { text: '工艺变更', size: 16, weight: 1 },
  { text: '多供应商', size: 16, weight: 1 },
  { text: '交期', size: 14, weight: 1 },
  { text: '风险提示', size: 14, weight: 1 }
];

const docWords = [
  { text: '规格参数', size: 32, weight: 5 },
  { text: '电气特性', size: 28, weight: 4 },
  { text: '测试方法', size: 28, weight: 4 },
  { text: '应用场景', size: 24, weight: 3 },
  { text: '工艺流程', size: 20, weight: 2 },
  { text: '接口定义', size: 20, weight: 2 },
  { text: '校准', size: 20, weight: 2 },
  { text: '误差', size: 20, weight: 2 },
  { text: '时序', size: 18, weight: 1 },
  { text: '可靠性', size: 18, weight: 1 },
  { text: '认证', size: 18, weight: 1 },
  { text: '封装', size: 16, weight: 1 },
  { text: '功耗', size: 16, weight: 1 },
  { text: '温度范围', size: 16, weight: 1 },
  { text: '典型电路', size: 16, weight: 1 },
  { text: '注意事项', size: 16, weight: 1 },
  { text: '引脚', size: 14, weight: 1 },
  { text: 'EMI', size: 14, weight: 1 },
  { text: '测试报告', size: 14, weight: 1 },
  { text: '工艺规范', size: 14, weight: 1 }
];

// 初始化词云
document.addEventListener('DOMContentLoaded', function() {
  // 动态获取容器尺寸
  function initWordClouds() {
    const bomContainer = document.getElementById('bomWordCloud');
    const docContainer = document.getElementById('docWordCloud');
    
    if (bomContainer) {
      const rect = bomContainer.getBoundingClientRect();
      const width = Math.max(rect.width || 400, 400);
      const height = Math.max(rect.height || 280, 280);
      createWordCloud(bomWords, 'bomWordCloud', width, height);
    }
    
    if (docContainer) {
      const rect = docContainer.getBoundingClientRect();
      const width = Math.max(rect.width || 400, 400);
      const height = Math.max(rect.height || 280, 280);
      createWordCloud(docWords, 'docWordCloud', width, height);
    }
  }
  
  // 延迟初始化，确保DOM完全渲染
  setTimeout(initWordClouds, 100);
  
  // 窗口大小改变时重新生成
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initWordClouds, 300);
  });
});

