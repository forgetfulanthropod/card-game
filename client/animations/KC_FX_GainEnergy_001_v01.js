const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 30,
    assets: {
        "KC_FX_GainEnergy_001_v01": "images/KC_FX_GainEnergy_001_v01.shapes.txt"
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
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[5]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[6]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[7]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[8]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[9]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[10]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[11]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[12]);
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
                super({ mode: mode, duration: 30, loop: false });
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

        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 16, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[37]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[32]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[38]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[33]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[34]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[39]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[35]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[40]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 1)
                    .addTimedChild(instance7, 4, 1)
                    .addTimedChild(instance9, 5, 2);
            }
        };

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 18, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[37]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[32]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[38]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[33]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[34]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[39]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[35]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[40]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 1)
                    .addTimedChild(instance7, 4, 1)
                    .addTimedChild(instance9, 5, 2);
            }
        };

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 6, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[37]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[32]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[38]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[33]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[34]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[39]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[35]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[40]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 1)
                    .addTimedChild(instance7, 4, 1)
                    .addTimedChild(instance9, 5, 1);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 30, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[41]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[42]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[43]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[44]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[45]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[46]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[47]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[48]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[49]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 2)
                    .addTimedChild(instance3, 3, 2)
                    .addTimedChild(instance4, 5, 2)
                    .addTimedChild(instance5, 7, 2)
                    .addTimedChild(instance6, 9, 2)
                    .addTimedChild(instance7, 11, 2)
                    .addTimedChild(instance8, 13, 2)
                    .addTimedChild(instance9, 15, 1);
            }
        };

        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 30, loop: false });
                const instance3 = new Graphic4(MovieClip.SYNCHED);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[21]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[22]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[23]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[13]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[24]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[14]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[25]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[15]);
                const instance13 = new Graphic5(MovieClip.SYNCHED);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[26]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[16]);
                const instance16 = new Graphic6(MovieClip.SYNCHED);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[27]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[17]);
                const instance19 = new Graphic7(MovieClip.SYNCHED);
                const instance18 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[28]);
                const instance17 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[18]);
                const instance21 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[29]);
                const instance20 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[19]);
                const instance23 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[30]);
                const instance22 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[20]);
                const instance24 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_GainEnergy_001_v01[31]);
                const instance1 = new Graphic3(MovieClip.SYNCHED)
                    .setTransform(-73.7, -323.4, 0.511, 0.511);
                this.addTimedChild(instance3, 0, 30, {
                        "0": {
                            x: -675.45,
                            y: 206.35,
                            sx: 10.736,
                            sy: 0.475,
                            a: 0.4,
                            c: [
                                0.54,
                                0.33,
                                0.54,
                                0.46,
                                0.54,
                                0
                            ]
                        },
                        "1": {
                            a: 0.6,
                            c: [
                                0.54,
                                0.22,
                                0.54,
                                0.43,
                                0.54,
                                0.15
                            ]
                        },
                        "2": {
                            a: 0.8,
                            c: [
                                0.54,
                                0.11,
                                0.54,
                                0.39,
                                0.54,
                                0.31
                            ]
                        },
                        "3": {
                            a: 1,
                            c: [
                                0.54,
                                0,
                                0.54,
                                0.36,
                                0.54,
                                0.46
                            ]
                        }
                    })
                    .addTimedChild(instance2, 0, 2)
                    .addTimedChild(instance4, 2, 2)
                    .addTimedChild(instance6, 4, 2)
                    .addTimedChild(instance5, 4, 2)
                    .addTimedChild(instance8, 6, 2)
                    .addTimedChild(instance7, 6, 2)
                    .addTimedChild(instance10, 8, 2)
                    .addTimedChild(instance9, 8, 2)
                    .addTimedChild(instance13, 10, 6, {
                        "10": {
                            x: -48.65,
                            y: -88.7,
                            sx: 1.529,
                            sy: 1.529
                        }
                    })
                    .addTimedChild(instance12, 10, 2)
                    .addTimedChild(instance11, 10, 2)
                    .addTimedChild(instance16, 12, 18, {
                        "12": {
                            x: -127.1,
                            y: -35.6,
                            sx: 0.623,
                            sy: 0.623
                        }
                    })
                    .addTimedChild(instance15, 12, 2)
                    .addTimedChild(instance14, 12, 2)
                    .addTimedChild(instance19, 14, 16, {
                        "14": {
                            x: 65.4,
                            y: -139.95,
                            sx: 0.623,
                            sy: 0.623
                        }
                    })
                    .addTimedChild(instance18, 14, 2)
                    .addTimedChild(instance17, 14, 2)
                    .addTimedChild(instance21, 16, 2)
                    .addTimedChild(instance20, 16, 2)
                    .addTimedChild(instance23, 18, 2)
                    .addTimedChild(instance22, 18, 2)
                    .addTimedChild(instance24, 20, 2)
                    .addTimedChild(instance1);
            }
        };

        data.lib.KC_FX_GainEnergy_001_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 30,
                    framerate: 24
                });
                const instance1 = new Graphic8(MovieClip.SYNCHED)
                    .setTransform(72, 108.95, 0.272, 0.272);
                this.addTimedChild(instance1);
            }
        };
        data.stage = data.lib.KC_FX_GainEnergy_001_v01;
    }
};


export default data;