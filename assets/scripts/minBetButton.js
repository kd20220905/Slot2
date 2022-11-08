cc.Class({
  extends: cc.Component,

  onLoad() {
    const button = this.node.getComponent(cc.Button);
    button.node.on('click', () => {
      const currentBetValue = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel/BetValue/Value').getComponent(cc.Label);
      const currentBetValueBg = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel/BetValue');
      const betScroll = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel/BetValueScroll');

      const currentBet = parseInt(currentBetValue.string);
      if (currentBet !== cc.store.minBet) {
        // 如果玩家金額夠
        if(cc.store.userPoints>=cc.store.minBet){
          currentBetValue.string = cc.store.currentBet = cc.store.minBet;

            // scroll & value 位置
            let vPos = betScroll.getPosition()
            let bPos = currentBetValueBg.getPosition()
            vPos.x = bPos.x = (1.4 * 98) + -740
            betScroll.setPosition(vPos)
            currentBetValueBg.setPosition(bPos)
        // 如果玩家金額不夠
        }else{
          currentBetValue.string =cc.store.currentBet= Math.floor(cc.store.userPoints);
        }
        
      }
    });
  }
});