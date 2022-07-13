const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 17,
    assets: {
        "KC_FX_UseEnergy001_v01": "images/KC_FX_UseEnergy001_v01.shapes.txt"
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
                super({ mode: mode, duration: 8, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[0]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic14 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 8, loop: false });
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 8, {
                    "0": {
                        x: -144.45,
                        y: -206.45,
                        a: 0.11
                    },
                    "1": {
                        a: 0.41
                    },
                    "2": {
                        a: 0.7
                    },
                    "3": {
                        a: 1
                    },
                    "4": {
                        a: 0.67
                    },
                    "5": {
                        a: 0.33
                    },
                    "6": {
                        a: 0
                    }
                });
            }
        };

        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 10, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[0]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic13 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 10, loop: false });
                const instance1 = new Graphic2(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 10, {
                    "0": {
                        x: -144.45,
                        y: -206.45,
                        a: 0.11
                    },
                    "1": {
                        a: 0.41
                    },
                    "2": {
                        a: 0.7
                    },
                    "3": {
                        a: 1
                    },
                    "4": {
                        a: 0.67
                    },
                    "5": {
                        a: 0.33
                    },
                    "6": {
                        a: 0
                    }
                });
            }
        };

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[0]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic11 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 12, loop: false });
                const instance1 = new Graphic3(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 12, {
                    "0": {
                        x: -144.45,
                        y: -206.45,
                        a: 0.11
                    },
                    "1": {
                        a: 0.41
                    },
                    "2": {
                        a: 0.7
                    },
                    "3": {
                        a: 1
                    },
                    "4": {
                        a: 0.67
                    },
                    "5": {
                        a: 0.33
                    },
                    "6": {
                        a: 0
                    }
                });
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 14, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[0]);
                this.addTimedChild(instance1);
            }
        };

        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 14, loop: false });
                const instance1 = new Graphic4(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 14, {
                    "0": {
                        x: -144.45,
                        y: -206.45,
                        a: 0.11
                    },
                    "1": {
                        a: 0.41
                    },
                    "2": {
                        a: 0.7
                    },
                    "3": {
                        a: 1
                    },
                    "4": {
                        a: 0.67
                    },
                    "5": {
                        a: 0.33
                    },
                    "6": {
                        a: 0
                    }
                });
            }
        };

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 16, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[1]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[2]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[3]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[4]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[5]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[6]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[7]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 2)
                    .addTimedChild(instance5, 5, 2)
                    .addTimedChild(instance6, 7, 2)
                    .addTimedChild(instance7, 9, 2);
            }
        };

        const Graphic9 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 9, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[11]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[12]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[8]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[13]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[9]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[14]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[10]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[15]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance2, 2, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance4, 4, 1)
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance6, 6, 1)
                    .addTimedChild(instance8, 8, 1);
            }
        };

        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 9, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[11]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[12]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[8]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[13]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[9]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[14]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[10]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[15]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance2, 2, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance4, 4, 1)
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance6, 6, 1)
                    .addTimedChild(instance8, 8, 1);
            }
        };

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 10, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[11]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[12]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[8]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[13]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[9]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[14]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[10]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[15]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance2, 2, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance4, 4, 1)
                    .addTimedChild(instance7, 6, 1)
                    .addTimedChild(instance6, 6, 1)
                    .addTimedChild(instance8, 8, 1);
            }
        };

        const Graphic12 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 10, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[16]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[17]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[18]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[19]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[20]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[21]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[22]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 5, 1)
                    .addTimedChild(instance6, 7, 1)
                    .addTimedChild(instance7, 9, 1);
            }
        };

        const Graphic10 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 10, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[16]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[17]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[18]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[19]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[20]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[21]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[22]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 5, 1)
                    .addTimedChild(instance6, 7, 1)
                    .addTimedChild(instance7, 9, 1);
            }
        };

        const Graphic15 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 16, loop: false });
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[23]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[24]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[25]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[26]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[27]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_UseEnergy001_v01[28]);
                const instance9 = new Graphic10(MovieClip.SYNCHED);
                const instance13 = new Graphic12(MovieClip.SYNCHED);
                const instance2 = new Graphic6(MovieClip.SYNCHED);
                const instance4 = new Graphic7(MovieClip.SYNCHED);
                const instance7 = new Graphic9(MovieClip.SYNCHED);
                const instance1 = new Graphic5(MovieClip.SYNCHED);
                const instance6 = new Graphic8(MovieClip.SYNCHED);
                const instance11 = new Graphic11(MovieClip.SYNCHED);
                const instance15 = new Graphic13(MovieClip.SYNCHED);
                const instance16 = new Graphic14(MovieClip.SYNCHED)
                    .setTransform(129, -238.25);
                this.addTimedChild(instance3, 0, 1)
                    .addTimedChild(instance5, 1, 1)
                    .addTimedChild(instance8, 2, 1)
                    .addTimedChild(instance10, 3, 1)
                    .addTimedChild(instance12, 4, 1)
                    .addTimedChild(instance14, 5, 1)
                    .addTimedChild(instance9, 3, 10, {
                        "3": {
                            x: -1.1,
                            y: -0.5
                        }
                    })
                    .addTimedChild(instance13, 5, 10, {
                        "5": {
                            x: -80.25,
                            y: -87.5,
                            sx: 0.658,
                            sy: 0.658,
                            ky: 3.142
                        }
                    })
                    .addTimedChild(instance2, 0, 10, {
                        "0": {
                            x: -30.15,
                            y: -117.95,
                            sx: 0.238,
                            sy: 0.238
                        },
                        "1": {
                            y: -125.548
                        },
                        "2": {
                            y: -133.048
                        },
                        "3": {
                            x: -30.148,
                            y: -140.591
                        },
                        "4": {
                            y: -148.091
                        },
                        "5": {
                            y: -155.641
                        },
                        "6": {
                            y: -163.141
                        },
                        "7": {
                            x: -30.196,
                            y: -170.684
                        },
                        "8": {
                            y: -178.184
                        },
                        "9": {
                            x: -30.1,
                            y: -185.65
                        }
                    })
                    .addTimedChild(instance4, 1, 9, {
                        "1": {
                            x: -130.15,
                            y: -55.95,
                            sx: 0.238,
                            sy: 0.238
                        },
                        "2": {
                            x: -130.148,
                            y: -75.999
                        },
                        "3": {
                            x: -130.19,
                            y: -96.046
                        },
                        "4": {
                            y: -116.096
                        },
                        "5": {
                            y: -136.096
                        },
                        "6": {
                            x: -130.232,
                            y: -156.142
                        },
                        "7": {
                            y: -176.192
                        },
                        "8": {
                            x: -130.224,
                            y: -196.189
                        },
                        "9": {
                            x: -130.15,
                            y: -216.15
                        }
                    })
                    .addTimedChild(instance7, 2, 9, {
                        "2": {
                            x: -93.05,
                            y: -91.95,
                            sx: 0.109,
                            sy: 0.109
                        },
                        "3": {
                            x: -93.049,
                            y: -100.099
                        },
                        "4": {
                            y: -108.249
                        },
                        "5": {
                            x: -93.086,
                            y: -116.486
                        },
                        "6": {
                            y: -124.636
                        },
                        "7": {
                            x: -93.136,
                            y: -132.786
                        },
                        "8": {
                            y: -140.936
                        },
                        "9": {
                            x: -93.123,
                            y: -149.123
                        },
                        "10": {
                            x: -93.05,
                            y: -157.2
                        }
                    })
                    .addTimedChild(instance1, 0, 16, {
                        "0": {
                            x: -686.35,
                            y: 45.25,
                            sx: 8.782,
                            sy: 0.194,
                            c: [
                                0.01,
                                0.99,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "1": {
                            c: [
                                0.01,
                                0.9,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "2": {
                            c: [
                                0.01,
                                0.81,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "3": {
                            c: [
                                0.01,
                                0.73,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "4": {
                            c: [
                                0.01,
                                0.64,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "5": {
                            c: [
                                0.01,
                                0.55,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "6": {
                            c: [
                                0.01,
                                0.46,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "7": {
                            c: [
                                0.01,
                                0.37,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "8": {
                            c: [
                                0.01,
                                0.28,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        },
                        "9": {
                            c: [
                                0.01,
                                0.2,
                                0.01,
                                0.99,
                                0.01,
                                0.99
                            ]
                        }
                    })
                    .addTimedChild(instance6, 2, 14, {
                        "2": {
                            x: -3,
                            y: 30.55
                        }
                    })
                    .addTimedChild(instance11, 4, 12, {
                        "4": {
                            x: 149,
                            y: -33.45
                        }
                    })
                    .addTimedChild(instance15, 6, 10, {
                        "6": {
                            x: -0.6,
                            y: -115.05
                        }
                    })
                    .addTimedChild(instance16, 8, 8);
            }
        };

        data.lib.KC_FX_UseEnergy001_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 17,
                    framerate: 24
                });
                const instance1 = new Graphic15(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 16, {
                    "0": {
                        x: 115.75,
                        y: 178.9,
                        sx: 0.312,
                        sy: 0.312
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_UseEnergy001_v01;
    }
};


export default data;