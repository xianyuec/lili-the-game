cc.Class({
    extends: cc.Component,

    properties: {
        aboutNode: cc.Node,
        succeedNode: cc.Node,
        failedNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.sys.localStorage.getItem("chapter") == null) {
            cc.sys.localStorage.setItem("chapter", 0);
        }
        this.dataList = [
            {chapter:0,playerX:200,background:"place1",ai:[ {name:"player7",pos:600},{name:"player8",pos:700},
            ]},
            {chapter:1,playerX:200,background:"place2",ai:[ {name:"player8",pos:600},{name:"player8",pos:700},{name:"player1",pos:800},
            ]},
            {chapter:2,playerX:200,background:"place3",ai:[ {name:"player8",pos:600},{name:"player3",pos:700},{name:"player4",pos:800},
            ]},
            {chapter:3,playerX:200,background:"place4",ai:[ {name:"player2",pos:600},{name:"player5",pos:700},{name:"player10",pos:800},
            ]},
            {chapter:4,playerX:1000,background:"place4",ai:[ {name:"player7",pos:600},{name:"player2",pos:650},{name:"player8",pos:700},
                                                                {name:"player7",pos:750},{name:"player2",pos:800},{name:"player8",pos:850},
                                                                {name:"player7",pos:1150},{name:"player2",pos:1200},{name:"player8",pos:1250},
                                                                {name:"player2",pos:1300},{name:"player7",pos:1350},{name:"player8",pos:1400},
            ]},
            {chapter:5,playerX:1000,background:"place4",ai:[ {name:"player7",pos:600},{name:"player2",pos:650},{name:"player8",pos:700},
                                                                {name:"player7",pos:750},{name:"player2",pos:800},{name:"player8",pos:850},
                                                                {name:"player7",pos:1150},{name:"player2",pos:1200},{name:"player8",pos:1250},
                                                                {name:"player2",pos:1300},{name:"player7",pos:1350},{name:"player8",pos:1400},
                                                                {name:"player7",pos:1450},{name:"player2",pos:1500},{name:"player8",pos:1520},
                                                                {name:"player7",pos:1550},{name:"player2",pos:1600},{name:"player8",pos:1800},
                                                                {name:"player7",pos:1850},{name:"player2",pos:2000},{name:"player8",pos:2050},
                                                                {name:"player2",pos:2100},{name:"player7",pos:2120},{name:"player8",pos:2150},
            ]},
            {chapter:6,playerX:1000,background:"place4",ai:[ {name:"player3",pos:600},{name:"player2",pos:650},{name:"player4",pos:700},
                                                                {name:"player2",pos:750},{name:"player2",pos:800},{name:"player10",pos:850},
                                                                {name:"player1",pos:1150},{name:"player2",pos:1200},{name:"player8",pos:1250},
                                                                {name:"player2",pos:1300},{name:"player7",pos:1350},{name:"player8",pos:1400},
                                                                {name:"player3",pos:1450},{name:"player2",pos:1500},{name:"player8",pos:1520},
                                                                {name:"player4",pos:1550},{name:"player2",pos:1600},{name:"player8",pos:1800},
                                                                {name:"player5",pos:1850},{name:"player2",pos:2000},{name:"player8",pos:2050},
                                                                {name:"player10",pos:2100},{name:"player2",pos:2120},{name:"player8",pos:2150},  
            ]},
            {chapter:7,playerX:1000,background:"place4",ai:[ {name:"player5",pos:600},{name:"player3",pos:650},{name:"player4",pos:700},
                                                                {name:"player1",pos:750},{name:"player2",pos:800},{name:"player2",pos:850},
                                                                {name:"player2",pos:1150},{name:"player2",pos:1200},{name:"player4",pos:1250},
                                                                {name:"player2",pos:1300},{name:"player7",pos:1350},{name:"player5",pos:1400},
                                                                {name:"player10",pos:1450},{name:"player2",pos:1500},{name:"player2",pos:1520},
                                                                {name:"player10",pos:1550},{name:"player2",pos:1600},{name:"player3",pos:1800},
                                                                {name:"player10",pos:1850},{name:"player2",pos:2000},{name:"player4",pos:2050},
                                                                {name:"player2",pos:2100},{name:"player3",pos:2120},{name:"player1",pos:2150},
            ]},
        ];
    },

    loadGame: function (chapter) {
        if (chapter == null || chapter < 0) chapter = 0;
        else if (chapter >= this.dataList.length) chapter = this.dataList.length - 1;
        var data = this.dataList[chapter];
        if (this.fightNode != null) {
            this.fightNode.destroy();
        }
        cc.loader.loadRes("panel/LoadingPanel", (err, prefab)=>{
            if (!err) {
                var loadingNode = cc.instantiate(prefab);
                this.node.addChild(loadingNode);
                loadingNode.setPosition(0, 0);
                cc.loader.loadRes("panel/FightScene", (err, prefab)=>{
                    if (!err) {
                        var fightNode = cc.instantiate(prefab);
                        this.node.addChild(fightNode);
                        fightNode.setPosition(-568, 0);
                        this.fightNode = fightNode;
                        var fightScene = fightNode.getComponent("FightScene");
                        fightScene.mainPanel = this.node;
                        fightScene.initPanel(this.dataList[chapter]);
                    }
                });
            }
        });
    },

    onClickNewChapter: function () {
        var chapter = 0;
        cc.sys.localStorage.setItem("chapter", "" + chapter);
        this.loadGame(chapter);
    },

    onClickContinueChapter: function () {
        var chapter = parseInt(cc.sys.localStorage.getItem("chapter"));
        this.loadGame(chapter);
    },

    onClickOpenAbout: function () {
        this.aboutNode.active = true;
    },

    onClickCloseAbout: function () {
        this.aboutNode.active = false;
    },

    succeedCallBack: function (chapter) {
        this.succeedNode.active = true;
        this.failedNode.active = false;
        var nextChapter = Math.min(this.dataList.length-1, chapter+1);
        cc.sys.localStorage.setItem("chapter", nextChapter);
    },

    failedCallBack: function (chapter) {
        this.succeedNode.active = false;
        this.failedNode.active = true;
    },

    onClickCloseCallBack: function () {
        this.succeedNode.active = this.failedNode.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
