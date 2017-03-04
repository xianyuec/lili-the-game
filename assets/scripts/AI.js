var PlayerState = cc.Enum({
    Idle: 0,
    Walk: 1,
    Attack: 2,
    Hurt: 3,
    Dead: 4,
});

cc.Class({
    extends: cc.Component,

    properties: {
        idleNode: cc.Node,
        walkNodes: [cc.Node],
        attackNode: cc.Node,
        hurtNode: cc.Node,
        deadNode: cc.Node,
        coldDuration: 0.5,
        direction: -1,   // 1: to right; -1: to left.
        speed: 5,
        HP: 10,
        attackRangeMin: 20,
        attackRangeMax: 45,
        waitAttackTime: 1,
    },

    // use this for initialization
    onLoad: function () {
        this.coldTime = 0;
        this.state = PlayerState.Idle;
        this._idle();
        if (this.direction == -1) {
            this.node.setScale(-1, 1);
        }
    },

    tryAttack: function () {
        this.state = PlayerState.Attack;
        this._attack();
        // 攻击效果
        if (this.player != null) {
            this.player.tryHurt();
        }
    },

    tryWalkLeft: function () {
        if (this.direction != -1) {
            this.direction = -1;
        }
        this._walk();
    },

    tryWalkRight: function () {
        if (this.direction != 1) {
            this.direction = 1;
        }
        this._walk();
    },

    tryHurt: function () {
        this.prepareTime = null;
        this.HP --;
        if (this.HP > 0) {
            this._hurt();
            this.scheduleOnce(()=>{
                this._idle();
            }, 0.3);
        }
        else {
            this._dead();
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.recordTime != null && Date.now() - this.recordTime < 100) {    // 每隔0.1秒判断一次
            return;
        }
        if (this.state == PlayerState.Hurt) {
            return;
        }
        if (this.state == PlayerState.Dead) {
            var fadeOut = cc.fadeOut(2);
            var callFunc = cc.callFunc(()=>{
                this.node.destroy();
            });
            this.node.runAction(cc.sequence(fadeOut, callFunc));
            return;
        }

        this.recordTime = Date.now();

        if (this.player == null) {
            this.player = this.node.parent.getComponentInChildren("player");
        }
        var playerX = this.player.node.x;
        cc.log("ai report: this.node.x=" + this.node.x + " , playerX=" + playerX);
        if (this.hasSeenPlayer != true) {
            this.hasSeenPlayer = (Math.abs(playerX - this.node.x) <= 1000); 
        } 
        if (this.hasSeenPlayer == true) {
            var posL, posR;
            if (this.direction == 1) {
                posL = this.node.x - this.attackRangeMin;
                posR = this.node.x + this.attackRangeMax;
            }
            else {
                posL = this.node.x - this.attackRangeMax;
                posR = this.node.x + this.attackRangeMin;
            }
            if (playerX < posL) {
                cc.log("ai walk left");
                this.tryWalkLeft();
                this.prepareTime = null;
            }
            else if (playerX > posR) {
                cc.log("ai walk right");
                this.tryWalkRight();
                this.prepareTime = null;
            }
            else {
                this._idle();
                if (this.lastAttackTime == null) this.lastAttackTime = Date.now();
                if (this.prepareTime == null) this.prepareTime = Date.now();
                if (this.lastAttackTime <= this.prepareTime && Date.now() - this.prepareTime > this.waitAttackTime * 1000) {
                    this.lastAttackTime = Date.now();
                    this.prepareTime = Date.now();
                    cc.log("ai try attack");
                    this.tryAttack();
                }
            }
        }

    },

    _idle: function () {
        this.state = PlayerState.Idle;

        this.idleNode.active = true;
        this.walkNodes.forEach((node)=>{ node.active = false; });
        this.attackNode.active = false;
        this.hurtNode.active = false;
        this.deadNode.active = false;
    },
    
    _walk: function () {
        var isWalking = (this.state == PlayerState.Walk);

        this.state = PlayerState.Walk;

        if (this.direction == 1) {
            this.node.setScale(1, 1);
            this.node.x = Math.min(this.node.x+this.speed, 3200 - this.node.width/2);
        }
        else {
            this.node.setScale(-1, 1);
            this.node.x = Math.max(this.node.x-this.speed, this.node.width/2);
        }

        this.idleNode.active = false;
        if (!isWalking) {
            this.walkNodes[0].active = true;
            this.walkNodes[1].active = false;
        }
        else {
            this.walkNodes.forEach((node)=>{node.active = !node.active;});
        }
        this.attackNode.active = false;
        this.hurtNode.active = false;
        this.deadNode.active = false;
    },
    
    _attack: function () {
        this.state = PlayerState.Attack;

        this.idleNode.active = false;
        this.walkNodes.forEach((node)=>{ node.active = false; });
        this.attackNode.active = true;
        this.coldTime = Date.now();
        this.hurtNode.active = false;
        this.deadNode.active = false;
    },
    
    _hurt: function () {
        this.state = PlayerState.Hurt;

        this.idleNode.active = false;
        this.walkNodes.forEach((node)=>{ node.active = false; });
        this.attackNode.active = false;
        this.hurtNode.active = true;
        this.deadNode.active = false;
    },
    
    _dead: function () {
        this.state = PlayerState.Dead;

        this.idleNode.active = false;
        this.walkNodes.forEach((node)=>{ node.active = false; });
        this.attackNode.active = false;
        this.hurtNode.active = false;
        this.deadNode.active = true;
    },
});
