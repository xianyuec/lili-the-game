cc.Class({
    extends: cc.Component,

    properties: {
        player: require("player"),
        leftNode: cc.Node,
        rightNode: cc.Node,
        backgroundNode: cc.Node,
        charactersNode: cc.Node,
        cloudsNode: cc.Node,
        playerNode: cc.Node,
        progressBar: cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },

    onEnable: function () {
        this.leftNode.on("touchstart", this.onLeftTouchStart, this);
        this.leftNode.on("touchend", this.onLeftTouchEnd, this);
        this.leftNode.on("touchcancel", this.onLeftTouchEnd, this);
        this.rightNode.on("touchstart", this.onRightTouchStart, this);
        this.rightNode.on("touchend", this.onRightTouchEnd, this);
        this.rightNode.on("touchcancel", this.onRightTouchEnd, this);
    },

    onDisable: function () {
        this.leftNode.off("touchstart", this.onLeftTouchStart, this);
        this.leftNode.off("touchend", this.onLeftTouchEnd, this);
        this.leftNode.off("touchcancel", this.onLeftTouchEnd, this);
        this.rightNode.off("touchstart", this.onRightTouchStart, this);
        this.rightNode.off("touchend", this.onRightTouchEnd, this);
        this.rightNode.off("touchcancel", this.onRightTouchEnd, this);
    },
    
    init: function () {
        this.clickLeftTime = 0;
        this.clickRightTime = 0;
        this.clickAttackTime = 0;
    },

    onLeftTouchStart: function () {
        this.clickLeftTime ++;
        this.player.isTryingLeft = true;
        this.player.isTryingRight = false;
    },

    onLeftTouchEnd: function () {
        this.clickLeftTime --;
        if (this.clickLeftTime <= 0) {
            this.clickLeftTime = 0;
            this.player.isTryingLeft = false;
        }
    },

    onRightTouchStart: function () {
        this.clickRightTime ++;
        this.player.isTryingRight = true;
        this.player.isTryingLeft = false;
    },

    onRightTouchEnd: function () {
        this.clickRightTime --;
        if (this.clickRightTime <= 0) {
            this.clickRightTime = 0;
            this.player.isTryingRight = false;
        }
    },

    onClickAttack: function () {
        this.clickAttackTime ++;
        this.player.isTryingAttack = true;
        this.scheduleOnce(()=>{
            this.clickAttackTime --;
            if (this.clickAttackTime <= 0) {
                this.clickAttackTime = 0;
                this.player.isTryingAttack = false;
            }
        }, 0.1);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // 镜头跟着人动
        var playerX = this.playerNode.x;
        var cameraX = -playerX + 568;
        if (cameraX > 0) cameraX = 0;
        if (cameraX < 1136 - 3200) cameraX = 1136 - 3200;
        this.backgroundNode.x = this.charactersNode.x = this.cloudsNode.x = cameraX;
        this.progressBar.progress = this.player.HP / 20;

    },
});
