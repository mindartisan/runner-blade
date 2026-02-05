/**
 * 中文排版修复脚本
 * 基于：https://github.com/sparanoid/chinese-copywriting-guidelines
 */

const fs = require('fs');
const path = require('path');

// 排版规则
const rules = [
  // 中英文之间添加空格
  [/([\u4e00-\u9fa5])([A-Za-z])/g, '$1 $2'],
  [/([A-Za-z])([\u4e00-\u9fa5])/g, '$1 $2'],
  // 中文数字之间添加空格
  [/([\u4e00-\u9fa5])([0-9])/g, '$1 $2'],
  [/([0-9])([\u4e00-\u9fa5])/g, '$1 $2'],
  // 全角标点
  [/\(可选\)/g, '（可选）'],
  [/温度：/g, '温度：'],
  [/海拔：/g, '海拔：'],
  [/原始时间：/g, '原始时间：'],
  [/调整后：/g, '调整后：'],
  [/原始配速：/g, '原始配速：'],
  [/调整后配速：/g, '调整后配速：'],
  [/"/g, '"'],
  // VO₂max 下标
  [/\bVO[Uu]?2[\s_]?max\b/g, 'VO₂max'],
];

/**
 * 修复文件中的中文排版
 */
function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  let modified = false;

  rules.forEach(([pattern, replacement]) => {
    const newContent = fixed.replace(pattern, replacement);
    if (newContent !== fixed) {
      fixed = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✓ ${filePath}`);
    return true;
  }

  return false;
}

/**
 * 递归处理目录
 */
function processDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;

  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // 跳过 node_modules 和 .next
      if (['node_modules', '.next', 'out', 'build', '.git'].includes(file.name)) {
        return;
      }
      count += processDirectory(fullPath, extensions);
    } else if (file.isFile()) {
      const ext = path.extname(file.name);
      if (extensions.includes(ext)) {
        if (fixFile(fullPath)) {
          count++;
        }
      }
    }
  });

  return count;
}

// 主函数
function main() {
  const rootDir = process.cwd();
  console.log('🔍 开始修复中文排版...\n');

  const count = processDirectory(rootDir);

  console.log(`\n✅ 完成！共修改 ${count} 个文件`);
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { fixFile, processDirectory };
