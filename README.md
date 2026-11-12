# PS一键选中所有文字

Photoshop 脚本：一键选中当前文档中**所有文字图层**（包括嵌套在多层图层组里的文字层）。普通图层、调整层、填充层、图层组本身、背景层都不会被选中。

Photoshop 本身没有"全选所有文字图层"的功能，官方做法是「图层面板筛选文字 + `Ctrl+Alt+A`」，每次都要点好几下。这个脚本把它压缩成一次菜单点击。

**📖 完整使用说明见 [使用说明.md](使用说明.md)** —— 安装细节、典型场景、选中范围规则、常见问题排错都在里面。

## 快速开始

1. 下载 `PS一键选中所有文字.jsx`（[Release 下载页](https://github.com/dqkevin62-afk/ps-select-all-text-layers/releases/latest)）
2. 放到 Photoshop 脚本目录，**重启 Photoshop**：
   - Windows：`C:\Program Files\Adobe\Adobe Photoshop <版本号>\Presets\Scripts\`
   - macOS：`/Applications/Adobe Photoshop <版本号>/Presets/Scripts/`
3. 打开文档 → **文件 → 脚本 → PS一键选中所有文字**

不想安装？直接 **文件 → 脚本 → 浏览…** 选择该 `.jsx` 文件也能跑。

## 适用版本

| 项 | 说明 |
| --- | --- |
| 已验证 | Adobe Photoshop CC 2017（Windows 10/11，实测通过） |
| 理论兼容 | Photoshop CC 及以上全部版本（脚本只使用 CC 时代即有、至今仍在的 Action Manager 接口） |
| 未验证 | CC 2018+ / macOS —— 接口未变动，但未实机测试，有问题请提 Issue |

## 选中之后能做什么

- 字符面板批量改字体、字号、颜色、行距
- 右键批量栅格化 / 转换为形状
- `Ctrl+G` 把选中的文字统一收纳进一个图层组
- 批量改不透明度、混合模式、图层样式
- 移动工具批量对齐 / 分布

## 选中范围

| 类型 | 结果 |
| --- | --- |
| 文字图层（含多层组内嵌套） | ✅ 选中 |
| 隐藏 / 锁定的文字图层 | ✅ 选中（不过滤可见性与锁定，实测确认） |
| 普通像素层、背景层、调整层、填充层、图层组 | ❌ 不选中 |
| 智能对象内部的文字 | ❌ 不选中（封装容器对脚本不可见） |

文档里没有文字图层时，会提示"当前文档中没有文字图层。"，不改动任何选区。详见 [使用说明.md](使用说明.md#五选中范围规则)。

## 实测记录

测试环境：Photoshop CC 2017，Windows，2026-11 实测。测试方式为脚本自建文档 → 执行最终交付文件本体 → 回读图层选区状态。

| 用例 | 文档结构 | 预期 | 实际 |
| --- | --- | --- | --- |
| 常规 | 背景 + 2 文字层 + 1 普通层 + 1 图层组（组内 1 文字层） | 选中 3 个文字层 | 选中 3 个：`text_1`、`text_2`、`text_3`，普通层/图层组/背景未选中 |
| 深度嵌套 | 组内再套组（2 层嵌套）+ 最内层文字层 + 纯色填充层 + 普通层 | 只选中文字层 | 选中 4 个文字层，填充层与普通层未选中 |
| 空文档 | 仅背景 + 1 普通层 | 提示无文字层，选区不变 | 弹出提示，原活动图层保持不变，无报错 |
| 隐藏 / 锁定 | 1 可见文字层 + 1 隐藏文字层 + 1 全锁定文字层 | 三者都选中 | 选中 3 个，隐藏层与锁定层均未报错 |

## 实现说明

- 递归遍历图层树（`document.layers` → `layerSets` → `layers`），按 `kind === LayerKind.TEXT` 收集**图层 ID**
- 用 `ActionReference.putIdentifier` 在一个引用里塞入多个图层 ID，一次 `slct` 调用完成批量选中
- 用图层 ID 而非堆叠索引：不受"有/无背景层导致索引偏移 1"的影响，也不会因为图层顺序变化选错
- 只读图层树、只写选区，不修改图层内容、不保存文件

图层多选所用的 Action Manager 调用属于 Photoshop 通用接口用法。实现思路参考 Anton Lyubushkin 的 [selectAllTextLayers.jsx](https://github.com/anton-liubushkin/experimental-ps-scripts/blob/master/selectAllTextLayers.jsx)（uberplugins.cc）；本仓库代码为独立编写，算法不同（递归收集 ID → 按 ID 批量选中），并附 MIT 许可，可自由再分发。

## 文档

- [使用说明.md](使用说明.md) —— 安装、使用、选中范围、FAQ、卸载
- [LICENSE](LICENSE) —— MIT

## 许可

[MIT](LICENSE)
