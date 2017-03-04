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
        direction: 1,   // 1: to right; 2: to left.
        speed: 5,
        HP: 20,
        attackRangeMin: 25,
        attackRangeMax: 50,
    },

    // use this for initialization
    onLoad: function () {
        this.coldTime = 0;
        this.state = PlayerState.Idle;
        this._idle();
        
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
                cc.log("game end");
            });
            this.node.runAction(cc.sequence(fadeOut, callFunc));
            return;
        }

        this.recordTime = Date.now();
        
        if (this.isTryingAttack) {
            this.tryAttack();
        }
        else if (this.isTryingLeft) {
            this.tryWalkLeft();
        }
        else if (this.isTryingRight) {
            this.tryWalkRight();
        }
        else {
            this._idle();
        }
    },

    tryAttack: function () {
        if (Date.now() - this.coldTime <= this.coldDuration) {
            if (Date.now() - this.coldTime > this.coldDuration * 0.5 && this.state == PlayerState.Attack) {
                this._idle();
            }
            return;
        }
        this.state = PlayerState.Attack;
        this._attack();
        // 攻击效果
        var posL, posR;
        if (this.direction == 1) {
            posL = this.node.x - this.attackRangeMin;
            posR = this.node.x + this.attackRangeMax;
        }
        else {
            posL = this.node.x - this.attackRangeMax;
            posR = this.node.x + this.attackRangeMin;
        }
        this.node.parent.getComponentsInChildren("AI").forEach((ai)=>{
            if (ai.node.x >= posL && ai.node.x <= posR) {
                cc.log("pl:x=" + this.node.x + " range:[" + posL + "," + posR + "]" + ai.node.x);
                ai.tryHurt();
            }
        });
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
