const data = {
    version: 2,
    stage: null,
    background: 0xffffff,
    width: 200,
    height: 200,
    framerate: 24,
    totalFrames: 22,
    assets: {
        "KC_FX_Bleed_v01": "images/KC_FX_Bleed_v01.shapes.txt"
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
                super({ mode: mode, duration: 21, loop: false });
                const instance1 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[8]);
                const instance2 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[9]);
                const instance3 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[10]);
                const instance4 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[11]);
                const instance5 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[12]);
                const instance6 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[13]);
                const instance8 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[14]);
                const instance7 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[0]);
                const instance10 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[15]);
                const instance9 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[1]);
                const instance11 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[2]);
                const instance12 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[3]);
                const instance14 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[16]);
                const instance13 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[4]);
                const instance16 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[17]);
                const instance15 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[5]);
                const instance18 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[18]);
                const instance17 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[6]);
                const instance20 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[19]);
                const instance19 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[7]);
                const instance21 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[20]);
                const instance22 = new Graphics()
                    .drawCommands(data.shapes.KC_FX_Bleed_v01[21]);
                this.addTimedChild(instance1, 0, 1)
                    .addTimedChild(instance2, 1, 2)
                    .addTimedChild(instance3, 3, 2)
                    .addTimedChild(instance4, 5, 1)
                    .addTimedChild(instance5, 6, 1)
                    .addTimedChild(instance6, 7, 1)
                    .addTimedChild(instance8, 8, 1)
                    .addTimedChild(instance7, 8, 1)
                    .addTimedChild(instance10, 9, 5)
                    .addTimedChild(instance9, 9, 2)
                    .addTimedChild(instance11, 11, 2)
                    .addTimedChild(instance12, 13, 1)
                    .addTimedChild(instance14, 14, 1)
                    .addTimedChild(instance13, 14, 1)
                    .addTimedChild(instance16, 15, 2)
                    .addTimedChild(instance15, 15, 2)
                    .addTimedChild(instance18, 17, 1)
                    .addTimedChild(instance17, 17, 1)
                    .addTimedChild(instance20, 18, 1)
                    .addTimedChild(instance19, 18, 1)
                    .addTimedChild(instance21, 19, 1)
                    .addTimedChild(instance22, 20, 1);
            }
        };

        data.lib.KC_FX_Bleed_v01 = class extends MovieClip {
            constructor() {
                super({
                    duration: 22,
                    framerate: 24
                });
                const instance1 = new Graphic1(MovieClip.SYNCHED);
                this.addTimedChild(instance1, 0, 21, {
                    "0": {
                        x: 176.65,
                        y: 27.65,
                        sx: 1.121,
                        sy: 1.121
                    }
                });
            }
        };
        data.stage = data.lib.KC_FX_Bleed_v01;
    }
};


export default data;