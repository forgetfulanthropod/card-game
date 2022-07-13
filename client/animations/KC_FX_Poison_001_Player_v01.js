const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 34,
    assets: {
        "KC_FX_Poison_001_Player_v01": "images/KC_FX_Poison_001_Player_v01.shapes.txt"
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


        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 30, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 32, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic1 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 34, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[0]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[1]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[2]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1);
            }
        };

        const Graphic9 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 30, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[8]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[9]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[5]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[10]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[6]);
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

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 32, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[8]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[9]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[5]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[10]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[6]);
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

        const Graphic2 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 34, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[8]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[3]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[9]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[4]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[5]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[10]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[6]);
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

        const Graphic3 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 7, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[11]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[12]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[13]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[14]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[15]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 2)
                    .addTimedChild(instance4, 4, 1)
                    .addTimedChild(instance5, 5, 2);
            }
        };

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 31, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[16]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[17]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[18]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[19]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[20]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[21]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[22]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[23]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[24]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[25]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[26]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[27]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 2)
                    .addTimedChild(instance6, 6, 2)
                    .addTimedChild(instance7, 8, 2)
                    .addTimedChild(instance8, 10, 2)
                    .addTimedChild(instance9, 12, 2)
                    .addTimedChild(instance10, 14, 2)
                    .addTimedChild(instance11, 16, 2)
                    .addTimedChild(instance12, 18, 2);
            }
        };

        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 31, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[28]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[29]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[30]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[31]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[32]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[33]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[34]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[35]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[36]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[37]);
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

        const Graphic12 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 25, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[38]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[39]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[40]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[41]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[42]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[43]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[44]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[45]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[46]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[47]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[48]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[49]);
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
                    .addTimedChild(instance12, 22, 2);
            }
        };

        const Graphic11 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 28, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[38]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[39]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[40]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[41]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[42]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[43]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[44]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[45]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[46]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[47]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[48]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[49]);
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
                    .addTimedChild(instance12, 22, 2);
            }
        };

        const Graphic10 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 29, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[38]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[39]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[40]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[41]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[42]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[43]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[44]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[45]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[46]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[47]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[48]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Poison_001_Player_v01[49]);
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
                    .addTimedChild(instance12, 22, 2);
            }
        };

        const Graphic13 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 34, loop: false });
                const instance10 = new Graphic10(MovieClip.SYNCHED);
                const instance11 = new Graphic11(MovieClip.SYNCHED);
                const instance12 = new Graphic12(MovieClip.SYNCHED)
                    .setTransform(-14, 23.8, 0.591, 0.601, 0, 0.193, 2.948);
                const instance7 = new Graphic7(MovieClip.SYNCHED)
                    .setTransform(-3.05, 12.95);
                const instance6 = new Graphic6(MovieClip.SYNCHED);
                const instance3 = new Graphic3(MovieClip.SYNCHED);
                const instance2 = new Graphic2(MovieClip.SYNCHED);
                const instance5 = new Graphic5(MovieClip.SYNCHED);
                const instance9 = new Graphic9(MovieClip.SYNCHED)
                    .setTransform(30.8, -104.7, 0.489, 0.489);
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                const instance4 = new Graphic4(MovieClip.SYNCHED);
                const instance8 = new Graphic8(MovieClip.SYNCHED)
                    .setTransform(-43.05, -103.7, 1, 1, -0.191);
                this.addTimedChild(instance10, 5, 29, {
                        "5": {
                            y: 0.2
                        }
                    })
                    .addTimedChild(instance11, 6, 28, {
                        "6": {
                            x: 68.55,
                            y: 32.25,
                            sx: 0.394,
                            sy: 0.394,
                            r: 0.012
                        }
                    })
                    .addTimedChild(instance12, 9, 25)
                    .addTimedChild(instance7, 3, 31)
                    .addTimedChild(instance6, 3, 31, {
                        "3": {
                            x: -0.95
                        }
                    })
                    .addTimedChild(instance3, 0, 7, {
                        "0": {
                            x: 310.45,
                            y: 34.7,
                            sx: 1.417,
                            sy: 1.417
                        }
                    })
                    .addTimedChild(instance2, 0, 34, {
                        "0": {
                            x: -0.25,
                            y: 0.15
                        }
                    })
                    .addTimedChild(instance5, 2, 32, {
                        "2": {
                            x: -222.6,
                            y: 10.9,
                            sx: 0.659,
                            sy: 0.659
                        }
                    })
                    .addTimedChild(instance9, 4, 30)
                    .addTimedChild(instance1, 0, 34, {
                        "0": {
                            x: -10.25,
                            y: 17.4,
                            r: -0.108
                        }
                    })
                    .addTimedChild(instance4, 2, 32, {
                        "2": {
                            x: 94.05,
                            y: 272.55,
                            r: -2.889
                        }
                    })
                    .addTimedChild(instance8, 4, 30);
            }
        };

        data.lib.KC_FX_Poison_001_Player_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 34,
                    framerate: 24
                });
                const instance1 = new Graphic13(MovieClip.SYNCHED)
                    .setTransform(82.35, 112.2, 0.414, 0.414);
                this.addTimedChild(instance1);
            }
        };
        data.stage = data.lib.KC_FX_Poison_001_Player_v01;
    }
};


export default data;