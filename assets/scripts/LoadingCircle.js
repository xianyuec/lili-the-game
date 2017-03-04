cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var repeat = cc.repeatForever(cc.rotateBy(4.0, 360));
        this.node.runAction(repeat);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
