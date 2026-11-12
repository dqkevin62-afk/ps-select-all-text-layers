# PS一键选中所有文字

Photoshop 脚本：一键选中当前文档中**所有文字图层**（包括嵌套在多层图层组里的文字层）。普通图层、调整层、填充层、图层组本身、背景层都不会被选中。

Photoshop 本身没有"全选所有文字图层"的功能，官方做法是「图层面板筛选文字 + Ctrl+Alt+A」，每次都要点两次。这个脚本把它压缩成一次菜单点击。

## 适用版本

| 项 | 说明 |
| --- | --- |
| 已验证 | Adobe Photoshop CC 2017（Windows 10/11，实测通过） |
| 理论兼容 | Photoshop CC 及以上全部版本（脚本只使用 CC 时代即有、至今仍在的 Action Manager 接口） |
| 未验证 | CC 2018+ / macOS —— 接口未变动，但未实机测试，有问题请提 Issue |

## 安装

**方式一：装成菜单项（推荐，一次安装长期可用）**

1. 下载本仓库的 `PS一键选中所有文字.jsx`
2. 放到对应目录：
   - Windows：`C:\Program Files\Adobe\Adobe Photoshop <版本号>\Presets\Scripts\`
   - macOS：`/Applications/Adobe Photoshop <版本号>/Presets/Scripts/`
3. 重启 Photoshop
4. 菜单：**文件 → 脚本 → PS一键选中所有文字**

**方式二：不安装，直接运行**

菜单 **文件 → 脚本 → 浏览…**，选中下载的 `.jsx` 文件即可，用完即走。

## 使用

1. 打开需要处理的 PSD（或任何含文字图层的文档）
2. 文件 → 脚本 → PS一键选中所有文字
3. 所有文字图层被选中，接着可以：
   - 在字符面板批量改字体、字号、颜色、行距
   - 右键批量栅格化 / 转换为形状
   - 拖进新图层组、批量对齐、批量改不透明度
   - 用「新建组」把选中的文字统一收纳

文档里没有文字图层时，会提示"当前文档中没有文字图层。"，不改动任何选区。

## 实测记录

测试环境：Photoshop CC 2017，Windows，2026-11 实测。

| 用例 | 文档结构 | 预期 | 实际 |
| --- | --- | --- | --- |
| 常规 | 背景 + 2 文字层 + 1 普通层 + 1 图层组（组内 1 文字层） | 选中 3 个文字层 | 选中 3 个：`text_1`、`text_2`、`text_3`，普通层/图层组/背景未选中 |
| 深度嵌套 | 图层组内再套图层组，最内层文字层 + 纯色填充层 + 普通层 | 只选中文字层 | 选中 4 个文字层，填充层与普通层未选中 |
| 空文档 | 仅背景 + 1 普通层 | 提示无文字层，选区不变 | 弹出提示，原活动图层保持不变，无报错 |

## 实现说明

- 递归遍历图层树（`document.layers` → `layerSets` → `layers`），按 `kind === LayerKind.TEXT` 收集**图层 ID**
- 用 `ActionReference.putIdentifier` 在一个引用里塞入多个图层 ID，一次 `slct` 调用完成批量选中
- 用图层 ID 而非堆叠索引：不受"有/无背景层导致索引偏移 1"的影响，也不会因为图层顺序变化选错

图层多选所用的 Action Manager 调用属于 Photoshop 通用接口用法。实现思路参考 Anton Lyubushkin 的 [selectAllTextLayers.jsx](https://github.com/anton-liubushkin/experimental-ps-scripts/blob/master/selectAllTextLayers.jsx)（uberplugins.cc）；本仓库代码为独立编写，算法不同（递归收集 ID → 按 ID 批量选中），并附 MIT 许可，可自由再分发。

## 许可

[MIT](LICENSE)
