const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 34,
    assets: {
        "KC_FX_GainEnergy001_v01": "images/KC_FX_GainEnergy001_v01.shapes.txt"
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


        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 29, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[5]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[6]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[7]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[8]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[9]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[10]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[11]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy001_v01[12]);
                this.addTimedChild(instance1, 0, 2)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2)
                    .addTimedChild(instance4, 6, 2)
                    .addTimedChild(instance5, 8, 2)
                    .addTimedChild(instance6, 10, 2)
                    .addTimedChild(instance7, 12, 2)
                    .addTimedChild(instance8, 14, 2)
                    .addTimedChild(instance9, 16, 2)
                    .addTimedChild(instance10, 18, 2)
                    .addTimedChild(instance11, 20, 2)
                    .addTimedChild(instance12, 22, 2)
                    .addTimedChild(instance13, 24, 5);
            }
        };

        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 29, loop: false });
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 29, {
                    "0": {
                        x: -146.3,
                        y: -255.25,
                        c: [
                            1,
                            0,
                            1,
                            0,
                            1,
                            0
                        ]
                    },
                    "22": {
                        c: [
                            0.93,
                            0.07,
                            0.93,
                            0.01,
                            0.93,
                            0.05
                        ]
                    },
                    "23": {
                        c: [
                            0.86,
                            0.14,
                            0.86,
                            0.03,
                            0.86,
                            0.11
                        ]
                    },
                    "24": {
                        c: [
                            0.79,
                            0.21,
                            0.79,
                            0.04,
                            0.79,
                            0.16
                        ]
                    },
                    "25": {
                        c: [
                            0.71,
                            0.28,
                            0.71,
                            0.05,
                            0.71,
                            0.21
                        ]
                    },
                    "26": {
                        c: [
                            0.64,
                            0.35,
                            0.64,
                            0.07,
                            0.64,
                            0.27
                        ]
                    },
                    "27": {
                        c: [
                            0.57,
                            0.42,
                            0.57,
                            0.08,
                            0.57,
                            0.32
                        ]
                    },
                    "28": {
                        c: [
                            0.5,
                            0.49,
                            0.5,
                            0.09,
                            0.5,
                            0.37
                        ]
                    }
                });
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 34, loop: false });
                const instance1 = new Graphic2(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 29, {
                    "0": {
                        x: 374.8,
                        y: 647.05,
                        a: 1
                    },
                    "1": {
                        y: 625.25
                    },
                    "2": {
                        y: 584.2
                    },
                    "3": {
                        y: 522.45
                    },
                    "4": {
                        y: 486.4
                    },
                    "5": {
                        y: 466.6
                    },
                    "6": {
                        y: 454
                    },
                    "7": {
                        y: 445.45
                    },
                    "8": {
                        y: 439.45
                    },
                    "9": {
                        y: 435.25
                    },
                    "10": {
                        y: 432.35
                    },
                    "11": {
                        y: 430.55
                    },
                    "12": {
                        y: 429.55
                    },
                    "22": {
                        a: 0.79
                    },
                    "23": {
                        a: 0.61
                    },
                    "24": {
                        a: 0.46
                    },
                    "25": {
                        a: 0.32
                    },
                    "26": {
                        a: 0.21
                    },
                    "27": {
                        a: 0.13
                    },
                    "28": {
                        a: 0.07
                    }
                });
            }
        };

        data.lib.KC_FX_GainEnergy001_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 34,
                    framerate: 24
                });
                const instance1 = new Graphic3(MovieClip.SYNCHED)
                    .setTransform(9.3, 9.8, 0.256, 0.256)
                    .setColorTransform(0.48, 0.52, 0.48, 0.18, 0.48, 0.52);
                this.addTimedChild(instance1);
            }
        };
        data.stage = data.lib.KC_FX_GainEnergy001_v01;
    }
};


export default data;