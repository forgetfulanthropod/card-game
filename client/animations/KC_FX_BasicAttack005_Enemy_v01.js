const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 13,
    assets: {
        "KC_FX_BasicAttack005_Enemy_v01": "images/KC_FX_BasicAttack005_Enemy_v01.shapes.txt"
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


        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 7, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1, {
                        "4": {
                            x: 100.9,
                            y: 8.55,
                            sx: 0.203,
                            sy: 0.203
                        }
                    });
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 9, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1, {
                        "4": {
                            x: 100.9,
                            y: 8.55,
                            sx: 0.203,
                            sy: 0.203
                        }
                    });
            }
        };

        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 11, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1, {
                        "4": {
                            x: 100.9,
                            y: 8.55,
                            sx: 0.203,
                            sy: 0.203
                        }
                    });
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 13, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1, {
                        "4": {
                            x: 100.9,
                            y: 8.55,
                            sx: 0.203,
                            sy: 0.203
                        }
                    });
            }
        };

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 13, loop: false });
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[4]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[6]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[7]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[8]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack005_Enemy_v01[9]);
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                const instance4 = new Graphic2(MovieClip.SYNCHED);
                const instance7 = new Graphic3(MovieClip.SYNCHED);
                const instance10 = new Graphic4(MovieClip.SYNCHED)
                    .setTransform(-1.35, -103.2, 0.892, 0.892);
                this.addTimedChild(instance2, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance5, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 1)
                    .addTimedChild(instance9, 5, 1)
                    .addTimedChild(instance1, 0, 13, {
                        "0": {
                            x: -259,
                            y: 130.6,
                            sx: 1.423,
                            sy: 1.423
                        }
                    })
                    .addTimedChild(instance4, 2, 11, {
                        "2": {
                            x: -113.35,
                            y: 40.6,
                            sx: 0.492,
                            sy: 0.492
                        }
                    })
                    .addTimedChild(instance7, 4, 9, {
                        "4": {
                            x: -57.7,
                            y: 30.45,
                            sx: 1.079,
                            sy: 1.079
                        }
                    })
                    .addTimedChild(instance10, 6, 7);
            }
        };

        data.lib.KC_FX_BasicAttack005_Enemy_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 13,
                    framerate: 24
                });
                const instance1 = new Graphic5(MovieClip.SYNCHED)
                    .setTransform(76.2, 87.75, 0.562, 0.562);
                this.addTimedChild(instance1);
            }
        };
        data.stage = data.lib.KC_FX_BasicAttack005_Enemy_v01;
    }
};


export default data;