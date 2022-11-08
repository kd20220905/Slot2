
let isTouch;
let touchTime;
cc.Class({
  extends: cc.Component,

  start () {
    console.log(this.node.getPosition().x)
  },
  onLoad() {
    this.nodePos = this.node.getPosition();
    
    this.node.on('touchmove', this.onTouchMove, this)
    this.node.on('touchcancel', this.onTouchCancel, this)
  },
  
  onTouchMove (event) {
    var self = this;
    var value = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel/BetValue');
    var touches = event.getTouches();

    // 觸摸時剛開始的位置
    var oldPos = self.node.convertToNodeSpaceAR(touches[0].getStartLocation());
    // 觸摸時變換的位置
    var newPos = self.node.convertToNodeSpaceAR(touches[0].getLocation());
    var subPos = oldPos.sub(newPos);
    
    self.node.x = self.nodePos.x - subPos.x;
    value.x = self.node.x
    // console.log(self.node.x, value.x)
    // 控制節點不超出範圍,判斷最大 若本金夠則-740, 不夠則計算最大金額
    var minX = (1.4 * 98) + -740;
    var maxX = (cc.store.userPoints >= cc.store.maxBet) ? -740 : minX - (Math.floor(cc.store.userPoints / 10) * 1.4 - 1.4);
    // var maxX = -740
    
    var nPos = self.node.getPosition(); // 實際座標
    var vPos = value.getPosition(); // value 實際座標
    if(nPos.x < maxX) {
      nPos.x = maxX;
      vPos.x = maxX
    };
    if(nPos.x > minX) {
      nPos.x = minX;
      vPos.x = minX;
    };

    // 固定座標
    self.node.setPosition(nPos);
    value.setPosition(vPos)
    
    // 取得因滾動而變化的value
    var getValue = Math.floor(Math.abs((this.node.getPosition().x - minX) / 1.4 - 1.4)) * 10

    const currentBetValue = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel/BetValue/Value').getComponent(cc.Label);
    // const currentBet = parseInt(currentBetValue.string);
    currentBetValue.string = cc.store.currentBet = getValue
    // if (currentBet !== cc.store.minBet) {
    //   // 如果玩家金額夠
    //   if(cc.store.userPoints>=cc.store.minBet){
    //     currentBetValue.string = cc.store.currentBet = cc.store.minBet;
    //   // 如果玩家金額不夠
    //   }else{
    //     currentBetValue.string =cc.store.currentBet= Math.floor(cc.store.userPoints);
    //   }
      
    // }
    // console.log( -(Math.floor(20 / 10) * 1.4))
  },
  onTouchCancel() {
    this.nodePos = this.node.getPosition(); // 獲取觸摸結束的node座標
  }
});
