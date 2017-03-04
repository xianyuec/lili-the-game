cc.Class({
    extends: cc.Component,

    properties: {
        backgroundNode: cc.Node,
        charactersNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    initPanel: function (data) {
        this.chapter = data.chapter;
        this.gameEnd = false;
        this.gameEndHandled = false;

        this.backgroundLoaded = false;
        this.nowLoadAiNum = 0;
        this.totalLoadAiNum = data.ai.length;
        this.backgroundNode.removeAllChildren();
        this.charactersNode.children.forEach((node)=>{
            if (node.getComponent("AI") != null) {
                node.destroy();
            }
        });
        this.player = this.charactersNode.getComponentInChildren("player");
        this.player.node.x = data.playerX;
        this.player._idle();
        cc.loader.loadRes("backgrounds/" + data.background, (err, prefab)=>{
            if (!err) {
                var backNode = cc.instantiate(prefab);
                this.backgroundNode.addChild(backNode);
                backNode.setPosition(0, 0);
                this.backgroundLoaded = true;
                this.tryCloseLoadingPanel();
            }
            else {
                cc.log("loading err: background: " + data.background);
            }
        });
        data.ai.forEach((ai)=>{
            var name = ai.name;
            var pos = ai.pos;
            cc.loader.loadRes("AI/" + name, (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    this.charactersNode.addChild(node);
                    node.setPosition(pos, 0);
                    this.nowLoadAiNum ++;
                    this.tryCloseLoadingPanel();
                }
                else {
                    cc.log("loading err: ai: (" + i + "): " + JSON.stringify(ai));
                }
            });
        });
    },

    tryCloseLoadingPanel: function () {
        if (this.backgroundLoaded != true) {
            return;
        }
        if (this.nowLoadAiNum < this.totalLoadAiNum) {
            return;
        }
        if (this.mainPanel != null) {
            var loadingList = this.mainPanel.getComponentsInChildren("LoadingPanel");
            loadingList.forEach((loading)=>{
                loading.node.destroy();
            });
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.gameEnd) {
            cc.log("game end enter");
            if (this.gameEndHandled) {
                return;
            }
            this.gameEndHandled = true;
            if (this.mainPanel != null) {
                if (this.player.HP > 0) {
                    this.mainPanel.getComponent("MainPanel").succeedCallBack(this.chapter);
                    cc.log("game end win");
                }
                else {
                    this.mainPanel.getComponent("MainPanel").failedCallBack(this.chapter);
                    cc.log("game end lose");
                }
                this.node.destroy();
            }
            return;
        }

        // 每1秒钟判断一下还有多少AI
        if (this.recordTime == null) this.recordTime = Date.now();
        if (Date.now() - this.recordTime > 1000) {
            this.recordTime = Date.now();
            if (this.player.HP <= 0) {
                this.gameEnd = true;
            }
            else if (this.charactersNode.children.length <= 1) {
                this.gameEnd = true;
            }
        }
    },
});
