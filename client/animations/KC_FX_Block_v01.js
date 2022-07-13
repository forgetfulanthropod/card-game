const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 34,
    assets: {
        "KC_FX_Block_v01": "images/KC_FX_Block_v01.shapes.txt"
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
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 2)
                    .addTimedChild(instance3, 3, 2);
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 2)
                    .addTimedChild(instance3, 3, 2);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 2)
                    .addTimedChild(instance3, 3, 2);
            }
        };

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 1, 1)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2);
            }
        };

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 1, 1)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2);
            }
        };

        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 22, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[2]);
                this.addTimedChild(instance1, 1, 1)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2);
            }
        };

        const Graphic9 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 11, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[3]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic10 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 5, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[8]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 2, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[12]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 19, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[12]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic11 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 33, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[13]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[14]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[15]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[16]);
                const instance5 = new Graphic1(MovieClip.SYNCHED);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[17]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[4]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[18]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[5]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[19]);
                const instance18 = new Graphic8(MovieClip.SYNCHED);
                const instance17 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[6]);
                const instance19 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[7]);
                const instance21 = new Graphic10(MovieClip.SYNCHED);
                const instance20 = new Graphic9(MovieClip.SYNCHED);
                const instance22 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[9]);
                const instance23 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[10]);
                const instance24 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Block_v01[11]);
                const instance16 = new Graphic7(MovieClip.SYNCHED)
                    .setTransform(248.4, 10.95, 0.133, 0.133, -0.785);
                const instance15 = new Graphic6(MovieClip.SYNCHED)
                    .setTransform(269.45, 40.7, 0.133, 0.133, -0.402);
                const instance14 = new Graphic5(MovieClip.SYNCHED)
                    .setTransform(211.65, 7.45, 0.133, 0.133, -1.352);
                const instance13 = new Graphic4(MovieClip.SYNCHED)
                    .setTransform(0.95, 44.5, 0.133, 0.133, -2.356);
                const instance12 = new Graphic3(MovieClip.SYNCHED)
                    .setTransform(30.7, 23.45, 0.133, 0.133, -1.973);
                const instance11 = new Graphic2(MovieClip.SYNCHED)
                    .setTransform(-2.55, 81.25, 0.133, 0.133, -2.923);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 2, {
                        "4": {
                            x: 45.7,
                            y: 77.1
                        },
                        "5": {
                            y: 68.75
                        }
                    })
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance6, 6, 1)
                    .addTimedChild(instance9, 7, 2)
                    .addTimedChild(instance8, 7, 2)
                    .addTimedChild(instance10, 9, 2)
                    .addTimedChild(instance18, 11, 19, {
                        "11": {
                            x: 48.25,
                            y: 50.2,
                            sx: 1,
                            sy: 1
                        },
                        "13": {
                            x: 38.45,
                            y: 39.15,
                            sx: 1.111,
                            sy: 1.111
                        },
                        "15": {
                            x: 40,
                            y: 40.9,
                            sx: 1.094,
                            sy: 1.094
                        },
                        "28": {
                            x: 40.7,
                            y: 50.9,
                            sx: 1.098,
                            sy: 1.098
                        },
                        "29": {
                            y: 63.8
                        }
                    })
                    .addTimedChild(instance17, 11, 2)
                    .addTimedChild(instance19, 13, 2)
                    .addTimedChild(instance21, 15, 5, {
                        "15": {
                            x: 128.1,
                            y: 41.2,
                            a: 1
                        },
                        "16": {
                            a: 0.8
                        },
                        "17": {
                            a: 0.6
                        },
                        "18": {
                            a: 0.4
                        },
                        "19": {
                            a: 0.2
                        }
                    })
                    .addTimedChild(instance20, 15, 11, {
                        "15": {
                            x: 197.15,
                            y: 169.35,
                            sx: 1,
                            sy: 1,
                            kx: 0,
                            ky: 0,
                            r: 0,
                            a: 1
                        },
                        "16": {
                            x: 237.7,
                            y: 97.15,
                            sx: 1.832,
                            sy: 1.832,
                            r: 0.495
                        },
                        "18": {
                            x: 284.2,
                            y: 80.9,
                            sx: 2.29,
                            sy: 2.29,
                            r: 1.173
                        },
                        "20": {
                            x: 294.45,
                            y: 120.95,
                            sx: 2.405,
                            sy: 2.405,
                            kx: 4.06,
                            ky: 2.223,
                            r: 0,
                            a: 0.8
                        },
                        "22": {
                            x: 254.5,
                            y: 103.9,
                            sx: 1.6,
                            sy: 1.6,
                            kx: 3.436,
                            ky: 2.847,
                            a: 0.4
                        },
                        "24": {
                            x: 229.15,
                            y: 82.85,
                            sx: 0.72,
                            sy: 0.72,
                            kx: 0,
                            ky: 0,
                            r: -2.65,
                            a: 0.2
                        }
                    })
                    .addTimedChild(instance22, 30, 1)
                    .addTimedChild(instance23, 31, 1)
                    .addTimedChild(instance24, 32, 1)
                    .addTimedChild(instance16, 11, 22)
                    .addTimedChild(instance15, 11, 22)
                    .addTimedChild(instance14, 11, 22)
                    .addTimedChild(instance13, 11, 22)
                    .addTimedChild(instance12, 11, 22)
                    .addTimedChild(instance11, 11, 22);
            }
        };

        data.lib.KC_FX_Block_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 34,
                    framerate: 24
                });
                const instance1 = new Graphic11(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 33, {
                    "0": {
                        x: 25.45,
                        y: 28.8,
                        sx: 0.538,
                        sy: 0.538
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_Block_v01;
    }
};


export default data;