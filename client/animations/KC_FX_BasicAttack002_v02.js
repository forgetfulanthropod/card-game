const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 22,
    assets: {
        "KC_FX_BasicAttack002_v02": "images/KC_FX_BasicAttack002_v02.shapes.txt"
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
                super({ mode: mode, duration: 19, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[9]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[10]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[11]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[12]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1);
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 5, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[14]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[15]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[16]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[17]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[18]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1);
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 6, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[19]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[20]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[21]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[22]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[23]);
                const instance2 = new Graphic1(MovieClip.SYNCHED)
                    .setTransform(-57.35, 13, 1, 1, -0.523)
                    .setColorTransform(0.32, 0.68, 0.32, 0.41, 0.32, 0);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance5, 3, 1)
                    .addTimedChild(instance6, 4, 1)
                    .addTimedChild(instance2, 1, 5);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 21, loop: false });
                const instance2 = new Graphic3(MovieClip.SYNCHED);
                const instance1 = new Graphic2(MovieClip.SYNCHED);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[0]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[1]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[2]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[3]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[4]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[5]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicAttack002_v02[8]);
                this.addTimedChild(instance2, 3, 6, {
                        "3": {
                            x: 0.3
                        }
                    })
                    .addTimedChild(instance1, 2, 19, {
                        "2": {
                            x: -17,
                            y: 169.9,
                            sx: 0.751,
                            sy: 0.751,
                            r: -2.054
                        }
                    })
                    .addTimedChild(instance3, 5, 1)
                    .addTimedChild(instance4, 6, 1)
                    .addTimedChild(instance5, 7, 1)
                    .addTimedChild(instance6, 8, 2)
                    .addTimedChild(instance7, 10, 2)
                    .addTimedChild(instance8, 12, 2)
                    .addTimedChild(instance9, 14, 2)
                    .addTimedChild(instance10, 16, 2)
                    .addTimedChild(instance11, 18, 2);
            }
        };

        data.lib.KC_FX_BasicAttack002_v02 = class extends MovieClip {
            constructor() {
                super({
                    duration: 22,
                    framerate: 24
                });
                const instance1 = new Graphic4(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 21, {
                    "0": {
                        x: 39.85,
                        y: 118.2,
                        sx: 0.424,
                        sy: 0.424
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_BasicAttack002_v02;
    }
};


export default data;