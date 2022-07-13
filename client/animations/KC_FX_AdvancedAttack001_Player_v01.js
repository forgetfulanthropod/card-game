const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 39,
    assets: {
        "KC_FX_AdvancedAttack001_Player_v01": "images/KC_FX_AdvancedAttack001_Player_v01.shapes.txt"
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


        const Graphic7 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 33, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[2]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[3]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
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

        const Graphic6 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 35, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[2]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[3]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
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
                super({ mode: mode, duration: 37, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[2]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[3]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
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
                super({ mode: mode, duration: 38, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[2]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[3]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
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
                super({ mode: mode, duration: 39, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[2]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[3]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[5]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[4]);
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

        const Graphic10 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 24, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2);
            }
        };

        const Graphic11 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 24, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2);
            }
        };

        const Graphic8 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 24, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2);
            }
        };

        const Graphic9 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 24, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2);
            }
        };

        const Graphic4 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 36, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance17 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance18 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance19 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance20 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance21 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance22 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance23 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance24 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2)
                    .addTimedChild(instance17, 24, 1)
                    .addTimedChild(instance18, 25, 1)
                    .addTimedChild(instance19, 26, 1)
                    .addTimedChild(instance20, 27, 1)
                    .addTimedChild(instance21, 28, 1)
                    .addTimedChild(instance22, 29, 2)
                    .addTimedChild(instance23, 31, 2)
                    .addTimedChild(instance24, 33, 2);
            }
        };

        const Graphic5 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 36, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                const instance17 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[6]);
                const instance18 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[7]);
                const instance19 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[8]);
                const instance20 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[9]);
                const instance21 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[10]);
                const instance22 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[11]);
                const instance23 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[12]);
                const instance24 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[13]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 1)
                    .addTimedChild(instance3, 2, 1)
                    .addTimedChild(instance4, 3, 1)
                    .addTimedChild(instance5, 4, 1)
                    .addTimedChild(instance6, 5, 2)
                    .addTimedChild(instance7, 7, 2)
                    .addTimedChild(instance8, 9, 2)
                    .addTimedChild(instance9, 12, 1)
                    .addTimedChild(instance10, 13, 1)
                    .addTimedChild(instance11, 14, 1)
                    .addTimedChild(instance12, 15, 1)
                    .addTimedChild(instance13, 16, 1)
                    .addTimedChild(instance14, 17, 2)
                    .addTimedChild(instance15, 19, 2)
                    .addTimedChild(instance16, 21, 2)
                    .addTimedChild(instance17, 24, 1)
                    .addTimedChild(instance18, 25, 1)
                    .addTimedChild(instance19, 26, 1)
                    .addTimedChild(instance20, 27, 1)
                    .addTimedChild(instance21, 28, 1)
                    .addTimedChild(instance22, 29, 2)
                    .addTimedChild(instance23, 31, 2)
                    .addTimedChild(instance24, 33, 2);
            }
        };

        const Graphic12 = class extends MovieClip {
            constructor(mode) {
                super({ mode: mode, duration: 39, loop: false });
                const instance7 = new Graphic5(MovieClip.SYNCHED);
                const instance6 = new Graphic4(MovieClip.SYNCHED);
                const instance11 = new Graphic9(MovieClip.SYNCHED);
                const instance10 = new Graphic8(MovieClip.SYNCHED);
                const instance13 = new Graphic11(MovieClip.SYNCHED);
                const instance12 = new Graphic10(MovieClip.SYNCHED);
                const instance2 = new Graphic1(MovieClip.SYNCHED);
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[0]);
                const instance3 = new Graphic2(MovieClip.SYNCHED);
                const instance5 = new Graphic3(MovieClip.SYNCHED);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_AdvancedAttack001_Player_v01[1]);
                const instance8 = new Graphic6(MovieClip.SYNCHED);
                const instance9 = new Graphic7(MovieClip.SYNCHED)
                    .setTransform(-12, -146.15, 0.882, 0.882);
                this.addTimedChild(instance7, 3, 36, {
                        "3": {
                            x: 26.4,
                            y: -171.8,
                            r: -0.006,
                            c: [
                                0.32,
                                0.68,
                                0.32,
                                0.68,
                                0.32,
                                0.68
                            ]
                        }
                    })
                    .addTimedChild(instance6, 2, 36, {
                        "2": {
                            x: 26.4,
                            y: -171.8,
                            r: -0.006
                        }
                    })
                    .addTimedChild(instance11, 9, 24, {
                        "9": {
                            x: -65.45,
                            y: -160.05,
                            r: -1.309,
                            a: 0.45
                        }
                    })
                    .addTimedChild(instance10, 8, 24, {
                        "8": {
                            x: -65.45,
                            y: -160.05,
                            r: -1.309
                        }
                    })
                    .addTimedChild(instance13, 12, 24, {
                        "12": {
                            x: 65.75,
                            y: -165.45,
                            kx: 3.505,
                            ky: 2.778,
                            a: 0.45
                        }
                    })
                    .addTimedChild(instance12, 11, 24, {
                        "11": {
                            x: 65.75,
                            y: -165.45,
                            kx: 3.505,
                            ky: 2.778,
                            c: [
                                0.25,
                                0.37,
                                0.25,
                                0.45,
                                0.25,
                                0.6
                            ]
                        }
                    })
                    .addTimedChild(instance2, 0, 39, {
                        "0": {
                            x: -65,
                            y: 20.9
                        }
                    })
                    .addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance3, 1, 38, {
                        "1": {
                            x: -179.35,
                            y: -57.85,
                            sx: 0.612,
                            sy: 0.612,
                            c: [
                                0.51,
                                0.47,
                                0.51,
                                0.04,
                                0.51,
                                0.1
                            ]
                        }
                    })
                    .addTimedChild(instance5, 2, 37, {
                        "2": {
                            x: -122.2,
                            y: 6.1,
                            sx: 0.291,
                            sy: 0.291
                        }
                    })
                    .addTimedChild(instance4, 2, 1)
                    .addTimedChild(instance8, 4, 35, {
                        "4": {
                            x: -95.65,
                            y: -188.1,
                            sx: 1.287,
                            sy: 1.287,
                            c: [
                                0.51,
                                0.47,
                                0.51,
                                0.04,
                                0.51,
                                0.1
                            ]
                        }
                    })
                    .addTimedChild(instance9, 6, 33);
            }
        };

        data.lib.KC_FX_AdvancedAttack001_Player_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 39,
                    framerate: 24
                });
                const instance1 = new Graphic12(MovieClip.SYNCHED)
                    .setTransform(101.4, 160.25, 0.369, 0.369, 0, 0, 3.142);
                this.addTimedChild(instance1);
            }
        };
        data.stage = data.lib.KC_FX_AdvancedAttack001_Player_v01;
    }
};


export default data;