// const aliases = {
//   paramBasePlus: Game_Actor.prototype.paramBasePlus,
// };

// // declare global{
  
// // }

declare global{
  interface Game_Actor{
    extraHp: number;
  }
}

// Game_Actor.prototype.paramBasePlus = function(paramId: number): number {
//   let result = aliases.paramBasePlus.call(this, paramId);
//   if (paramId === 0) {
//     result += this.extraHp;
//   }
//   return result;
// }
console.log("hello1");
const aliases = 1;

export { aliases };