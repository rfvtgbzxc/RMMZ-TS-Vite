import { enterBattleTest } from "./plugins/utils/DebugTool";
import "./plugins/侧视角色状态图标";

console.log("整合插件加载完成! ");

// 无论去不去掉注释，构建后都会移除
if (import.meta.env.DEV) {
  // 去掉注释，启用战斗测试
  // enterBattleTest();
}

