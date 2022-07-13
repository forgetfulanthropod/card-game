const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 14,
    assets: {
        "KC_FX_BasicAttack001_Player_v01": "images/KC_FX_BasicAttack001_Player_v01.shapes.txt"
    },
    lib: {},
    shapes: {},
    textures: {},
    spritesheets: [],
    getTexture: function (id) {
        if (data.textures[id]) {
            return data.textures[id];
        }
        const atlas = data.spritesheets.find(atlas => !!atlas.textures[id]);
        return atlas ? atlas.textures[id] : null;
    },
    setup: function (animate) {
        const MovieClip = animate.MovieClip;
        const Graphics = animate.Graphics;


        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[5]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[6]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[7]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2);
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[5]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[6]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack001_Player_v01[7]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2);
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphic1(MovieClip.SYNCHED)
                    .setTransform(-45.05, 83.4, 1, 1, -1.172)
                    .setColorTransform(0.27, 0.15, 0.27, 0.58, 0.27, 0.58);
                this.addTimedChild(instance1);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 13, loop: false });
                const instance2 = new Graphic3(MovieClip.SYNCHED);
                const instance1 = new Graphic2(MovieClip.SYNCHED);
                this.addTimedChild(instance2, 1, 12, {
                        "1": {
                            x: 3.55,
                            y: -0.85,
                            a: 0.38
                        }
                    })
                    .addTimedChild(instance1, 0, 12, {
                        "0": {
                            x: -45.05,
                            y: 83.4,
                            r: -1.172
                        }
                    });
            }
        };

        data.lib.KC_FX_BasicAttack001_Player_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 14,
                    framerate: 24
                });
                const instance1 = new Graphic4(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 13, {
                    "0": {
                        x: 111.4,
                        y: 74.3,
                        sx: 0.344,
                        sy: 0.344,
                        ky: 3.142
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_BasicAttack001_Player_v01;
    }
};


export default data;