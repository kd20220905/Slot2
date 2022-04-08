cc.Class({
  extends: cc.Component,

  onLoad() {
    const button = this.node.getComponent(cc.Button);
    button.node.on('click', () => {
      cc.find('Canvas/Game/Machine/UI/Menu').getComponent('menuController').dropDown();
    });
  }
});
