/**
 * 调用此函数，游戏加载完毕后会进入战斗测试
 */
export function enterBattleTest() {
  DataManager.isBattleTest = () => true;
}