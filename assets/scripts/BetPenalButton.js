cc.Class({
  extends: cc.Component,
  properties: {
  
  },

  onLoad() {
      const button = this.node.getComponent(cc.Button);

    button.node.on('click', () => {

      const BetPanel = cc.find('Canvas/Game/Machine/MenuPanel/BetPanel');
      BetPanel.active = !BetPanel.active;
   
    });
  }
});