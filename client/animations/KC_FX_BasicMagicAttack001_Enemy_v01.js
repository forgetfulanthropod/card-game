const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 27,
    assets: {
        "KC_FX_BasicMagicAttack001_Enemy_v01": "images/KC_FX_BasicMagicAttack001_Enemy_v01.shapes.txt"
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


        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 19, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[5]);
                this.addTimedChild(instance1, 0, 2)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2)
                    .addTimedChild(instance4, 6, 2)
                    .addTimedChild(instance5, 8, 2)
                    .addTimedChild(instance6, 10, 2);
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 21, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[5]);
                this.addTimedChild(instance1, 0, 2)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2)
                    .addTimedChild(instance4, 6, 2)
                    .addTimedChild(instance5, 8, 2)
                    .addTimedChild(instance6, 10, 2);
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 23, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[5]);
                this.addTimedChild(instance1, 0, 2)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2)
                    .addTimedChild(instance4, 6, 2)
                    .addTimedChild(instance5, 8, 2)
                    .addTimedChild(instance6, 10, 2);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 21, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[2]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[5]);
                this.addTimedChild(instance1, 0, 2)
                    .addTimedChild(instance2, 2, 2)
                    .addTimedChild(instance3, 4, 2)
                    .addTimedChild(instance4, 6, 2)
                    .addTimedChild(instance5, 8, 2)
                    .addTimedChild(instance6, 10, 2);
            }
        };

        const Graphic10 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 13, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[12]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[13]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[14]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[15]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[16]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[17]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[18]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[19]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[20]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[21]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[22]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[23]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[24]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 1)
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance8, 7, 1)
                    .addTimedChild(instance9, 8, 1)
                    .addTimedChild(instance10, 9, 1)
                    .addTimedChild(instance11, 10, 1)
                    .addTimedChild(instance12, 11, 1)
                    .addTimedChild(instance13, 12, 1);
            }
        };

        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 25, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[25]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[26]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[27]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[28]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[29]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[30]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[31]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[32]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[33]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[34]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 2)
                    .addTimedChild(instance4, 4, 2)
                    .addTimedChild(instance5, 6, 1)
                    .addTimedChild(instance6, 7, 1)
                    .addTimedChild(instance7, 8, 2)
                    .addTimedChild(instance8, 10, 2)
                    .addTimedChild(instance9, 12, 2)
                    .addTimedChild(instance10, 14, 2);
            }
        };

        const Graphic11 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 14, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[35]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[37]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 16, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[35]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[37]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 18, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[35]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[36]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[37]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic12 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[42]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[43]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[38]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[44]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[39]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[40]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[45]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[41]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 3, {
                        "4": {
                            x: 0,
                            y: 0,
                            sx: 1,
                            sy: 1
                        },
                        "5": {
                            x: 110.55,
                            y: 86.55,
                            sx: 0.312,
                            sy: 0.305
                        }
                    })
                    .addTimedChild(instance7, 4, 1);
            }
        };

        const Graphic9 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 14, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[42]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[43]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[38]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[44]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[39]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[40]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[45]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[41]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 3, {
                        "4": {
                            x: 0,
                            y: 0,
                            sx: 1,
                            sy: 1
                        },
                        "5": {
                            x: 110.55,
                            y: 86.55,
                            sx: 0.312,
                            sy: 0.305
                        }
                    })
                    .addTimedChild(instance7, 4, 1);
            }
        };

        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 16, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[42]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[43]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[38]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[44]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[39]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[40]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[45]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[41]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance5, 2, 2)
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance6, 3, 1)
                    .addTimedChild(instance8, 4, 3, {
                        "4": {
                            x: 0,
                            y: 0,
                            sx: 1,
                            sy: 1
                        },
                        "5": {
                            x: 110.55,
                            y: 86.55,
                            sx: 0.312,
                            sy: 0.305
                        }
                    })
                    .addTimedChild(instance7, 4, 1);
            }
        };

        const Graphic13 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 26, loop: false });
                const instance10 = new Graphic7(MovieClip.SYNCHED);
                const instance14 = new Graphic9(MovieClip.SYNCHED);
                const instance18 = new Graphic12(MovieClip.SYNCHED);
                const instance9 = new Graphic6(MovieClip.SYNCHED);
                const instance13 = new Graphic8(MovieClip.SYNCHED);
                const instance17 = new Graphic11(MovieClip.SYNCHED);
                const instance2 = new Graphic2(MovieClip.SYNCHED);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[6]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[7]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[8]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[9]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[10]);
                const instance16 = new Graphic10(MovieClip.SYNCHED);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_BasicMagicAttack001_Enemy_v01[11]);
                const instance4 = new Graphic4(MovieClip.SYNCHED);
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                const instance3 = new Graphic3(MovieClip.SYNCHED);
                const instance5 = new Graphic5(MovieClip.SYNCHED);
                this.addTimedChild(instance10, 7, 16, {
                        "7": {
                            x: 182.55,
                            y: 9.7,
                            sx: 0.47,
                            sy: 0.47
                        }
                    })
                    .addTimedChild(instance14, 9, 14, {
                        "9": {
                            x: 0.05,
                            y: -59.05,
                            sx: 0.47,
                            sy: 0.47
                        }
                    })
                    .addTimedChild(instance18, 11, 12, {
                        "11": {
                            x: 131.3,
                            y: -167.8,
                            sx: 0.47,
                            sy: 0.47
                        }
                    })
                    .addTimedChild(instance9, 7, 18, {
                        "7": {
                            x: 165.6,
                            y: 112.15,
                            sx: 0.424,
                            sy: 0.424,
                            r: -2.754
                        }
                    })
                    .addTimedChild(instance13, 9, 16, {
                        "9": {
                            x: 74.85,
                            y: -90.2,
                            sx: 0.424,
                            sy: 0.424,
                            r: -0.572
                        }
                    })
                    .addTimedChild(instance17, 11, 14, {
                        "11": {
                            x: 290.45,
                            y: -72.95,
                            sx: 0.424,
                            sy: 0.424,
                            r: 1.363
                        }
                    })
                    .addTimedChild(instance2, 0, 25, {
                        "0": {
                            x: 105.7,
                            y: 103.55,
                            sx: 0.799,
                            sy: 0.799,
                            c: [
                                0,
                                0.8,
                                0,
                                0.4,
                                0,
                                0.8
                            ]
                        }
                    })
                    .addTimedChild(instance6, 5, 1)
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance8, 7, 1)
                    .addTimedChild(instance11, 8, 1)
                    .addTimedChild(instance12, 9, 1)
                    .addTimedChild(instance16, 10, 13, {
                        "10": {
                            x: 134.9,
                            y: 7.4,
                            sx: 0.663,
                            sy: 0.663,
                            a: 1,
                            c: [
                                0,
                                1,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "11": {
                            x: 134.898,
                            y: -12.45,
                            c: [
                                0,
                                0.75,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "12": {
                            y: -40.65,
                            c: [
                                0,
                                0.4,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "13": {
                            y: -50.5,
                            c: [
                                0,
                                0.28,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "14": {
                            y: -54.8,
                            c: [
                                0,
                                0.23,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "15": {
                            y: -56.7,
                            c: [
                                0,
                                0.21,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "16": {
                            x: 134.9,
                            y: -57.2,
                            c: [
                                0,
                                0.2,
                                0,
                                1,
                                0,
                                1
                            ]
                        },
                        "17": {
                            a: 0.81,
                            c: [
                                0.23,
                                0.15,
                                0.23,
                                0.77,
                                0.23,
                                0.77
                            ]
                        },
                        "18": {
                            a: 0.66,
                            c: [
                                0.41,
                                0.12,
                                0.41,
                                0.59,
                                0.41,
                                0.59
                            ]
                        },
                        "19": {
                            a: 0.54,
                            c: [
                                0.55,
                                0.09,
                                0.55,
                                0.44,
                                0.55,
                                0.44
                            ]
                        },
                        "20": {
                            a: 0.43,
                            c: [
                                0.7,
                                0.06,
                                0.7,
                                0.31,
                                0.7,
                                0.31
                            ]
                        },
                        "21": {
                            a: 0.31,
                            c: [
                                0.84,
                                0.03,
                                0.84,
                                0.16,
                                0.84,
                                0.16
                            ]
                        },
                        "22": {
                            a: 0.17,
                            c: [
                                1,
                                0,
                                1,
                                0,
                                1,
                                0
                            ]
                        }
                    })
                    .addTimedChild(instance15, 10, 1)
                    .addTimedChild(instance4, 2, 21, {
                        "2": {
                            x: 108.15,
                            y: 277.45,
                            sx: 0.547,
                            sy: 0.547,
                            r: -1.571,
                            c: [
                                0,
                                0.4,
                                0,
                                0.4,
                                0,
                                0.8
                            ]
                        }
                    })
                    .addTimedChild(instance1, 0, 23, {
                        "0": {
                            x: 19.95,
                            y: 325.55,
                            sx: 1.019,
                            sy: 1.019,
                            r: -1.571,
                            c: [
                                0,
                                0.6,
                                0,
                                0.4,
                                0,
                                1
                            ]
                        }
                    })
                    .addTimedChild(instance3, 2, 21, {
                        "2": {
                            x: -56.05,
                            y: 192.1,
                            sx: 1.253,
                            sy: 1.253,
                            r: -0.785,
                            c: [
                                0,
                                0.8,
                                0,
                                0.4,
                                0,
                                0.8
                            ]
                        }
                    })
                    .addTimedChild(instance5, 4, 19, {
                        "4": {
                            x: 135.65,
                            y: 301.5,
                            sx: 0.763,
                            sy: 0.763,
                            r: -2.439,
                            c: [
                                0,
                                0.8,
                                0,
                                0.6,
                                0,
                                1
                            ]
                        }
                    });
            }
        };

        data.lib.KC_FX_BasicMagicAttack001_Enemy_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 27,
                    framerate: 24
                });
                const instance1 = new Graphic13(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 26, {
                    "0": {
                        x: 36.9,
                        y: 87.05,
                        sx: 0.429,
                        sy: 0.429
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_BasicMagicAttack001_Enemy_v01;
    }
};


export default data;