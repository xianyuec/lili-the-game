cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1,
        width: 3200,
    },

    // use this for initialization
    onLoad: function () {
        this.originX = this.node.x;
        this.isRunning = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (Math.abs(this.speed) < 0.001) {
            return;
        }
        if (this.isRunning == false) {
            this.isRunning = true;
            var callFunc = cc.callFunc(()=>{
                this.node.x = this.originX;
                this.isRunning = false;
            });
            var moveDis = (this.speed > 0) ? 
                                (this.width + this.node.width) : 
                                -(this.width + this.node.width);
            var moveDuration = Math.abs(parseInt(moveDis / this.speed));
            var moveBy = cc.moveBy(moveDuration, moveDis, 0);
            var fadeIn = cc.fadeIn(1);
            var fadeOut = cc.fadeOut(1);
            this.node.runAction(cc.sequence(cc.spawn(moveBy, fadeIn), callFunc));
            var waitTime = Math.max(1, moveDuration-1);
            this.scheduleOnce(()=>{
                this.node.runAction(fadeOut);
            }, waitTime);
        }
    },
});
