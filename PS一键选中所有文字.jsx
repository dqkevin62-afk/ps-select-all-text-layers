// ============================================================================
// PS一键选中所有文字.jsx  |  v1.0.0
// ----------------------------------------------------------------------------
// 功能：一次性选中当前文档中所有文字图层（包括嵌套在图层组里的文字层）。
//       普通图层、调整层、图层组本身、背景层不会被选中。
// 环境：Adobe Photoshop CC 2017 及以上。已在 CC 2017 实测通过。
// 用法：文件 > 脚本 > PS一键选中所有文字（或 文件 > 脚本 > 浏览... 选择本文件）
// ----------------------------------------------------------------------------
// 许可：MIT License
// 说明：图层多选所用的 Action Manager 调用属于 Photoshop 通用接口用法；
//       实现思路参考 Anton Lyubushkin 的 selectAllTextLayers.jsx（uberplugins.cc）。
//       本文件代码为独立编写，算法不同（递归收集图层 ID → 按 ID 一次性多选）。
// ============================================================================
#target photoshop

(function () {
    if (app.documents.length === 0) {
        alert("请先打开一个文档。");
        return;
    }

    var doc = app.activeDocument;
    var ids = [];

    collectTextLayerIds(doc, ids);

    if (ids.length === 0) {
        alert("当前文档中没有文字图层。");
        return;
    }

    selectLayersById(ids);

    // 递归收集所有文字图层的 ID（ID 与图层堆叠顺序无关，不受背景层索引偏移影响）
    function collectTextLayerIds(container, out) {
        var layers = container.layers;
        for (var i = 0; i < layers.length; i++) {
            var ly = layers[i];
            if (ly.typename === "LayerSet") {
                collectTextLayerIds(ly, out);
                continue;
            }
            var isText = false;
            try {
                isText = (ly.kind === LayerKind.TEXT);
            } catch (e) {
                isText = false;
            }
            if (isText && ly.id) {
                out.push(ly.id);
            }
        }
    }

    // 按图层 ID 批量选中：一个引用里放多个 identifier，一次 slct 调用完成多选
    function selectLayersById(layerIds) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        for (var i = 0; i < layerIds.length; i++) {
            ref.putIdentifier(stringIDToTypeID("layer"), layerIds[i]);
        }
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putBoolean(charIDToTypeID("MkVs"), false);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
})();
