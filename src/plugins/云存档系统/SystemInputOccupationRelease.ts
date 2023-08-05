
// 注：本来想移除事件监听的，但是绑定的都是匿名函数，无法移除

let blocked = false;
/**
 * 释放Input和TouchInput对输入的全局占用
 * 
 * 实际情况是，这些输入将被完全无效。
 */
export function releaseSystemInputOccupation() {
  blocked = true;
  Input.clear();
  TouchInput.clear();
}

/**
 * 恢复Input和TouchInput对输入的全局占用
 */
export function recoverSystemInputOccupation() {
  blocked = false;
}

const alias = {
  Input: {
    _onKeyDown: Input._onKeyDown,
    _onKeyUp: Input._onKeyUp,
    _onLostFocus: Input._onLostFocus,
  },
  TouchInput: {
    _onMouseDown: TouchInput._onMouseDown,
    _onMouseMove: TouchInput._onMouseMove,
    _onMouseUp: TouchInput._onMouseUp,
    _onWheel: TouchInput._onWheel,
    _onTouchStart: TouchInput._onTouchStart,
    _onTouchMove: TouchInput._onTouchMove,
    _onTouchEnd: TouchInput._onTouchEnd,
    _onTouchCancel: TouchInput._onTouchCancel,
    _onLostFocus: TouchInput._onLostFocus,
  }
};

for (let key in alias.Input) {
  // @ts-ignore
  Input[key] = function () {
    if (!blocked) {
      // @ts-ignore
      alias.Input[key].apply(this, arguments);
    }
  }
}

for (let key in alias.TouchInput) {
  // @ts-ignore
  TouchInput[key] = function () {
    if (!blocked) {
      // @ts-ignore
      alias.TouchInput[key].apply(this, arguments);
    }
  }
}