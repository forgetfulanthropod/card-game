"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/alea.js
var require_alea = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/alea.js"(exports, module2) {
    (function(global2, module3, define2) {
      function Alea(seed2) {
        var me2 = this, mash = Mash();
        me2.next = function() {
          var t = 2091639 * me2.s0 + me2.c * 23283064365386963e-26;
          me2.s0 = me2.s1;
          me2.s1 = me2.s2;
          return me2.s2 = t - (me2.c = t | 0);
        };
        me2.c = 1;
        me2.s0 = mash(" ");
        me2.s1 = mash(" ");
        me2.s2 = mash(" ");
        me2.s0 -= mash(seed2);
        if (me2.s0 < 0) {
          me2.s0 += 1;
        }
        me2.s1 -= mash(seed2);
        if (me2.s1 < 0) {
          me2.s1 += 1;
        }
        me2.s2 -= mash(seed2);
        if (me2.s2 < 0) {
          me2.s2 += 1;
        }
        mash = null;
      }
      __name(Alea, "Alea");
      function copy(f, t) {
        t.c = f.c;
        t.s0 = f.s0;
        t.s1 = f.s1;
        t.s2 = f.s2;
        return t;
      }
      __name(copy, "copy");
      function impl(seed2, opts) {
        var xg = new Alea(seed2), state = opts && opts.state, prng = xg.next;
        prng.int32 = function() {
          return xg.next() * 4294967296 | 0;
        };
        prng.double = function() {
          return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
        };
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      function Mash() {
        var n = 4022871197;
        var mash = /* @__PURE__ */ __name(function(data) {
          data = String(data);
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h2 = 0.02519603282416938 * n;
            n = h2 >>> 0;
            h2 -= n;
            h2 *= n;
            n = h2 >>> 0;
            h2 -= n;
            n += h2 * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        }, "mash");
        return mash;
      }
      __name(Mash, "Mash");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.alea = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xor128.js
var require_xor128 = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xor128.js"(exports, module2) {
    (function(global2, module3, define2) {
      function XorGen(seed2) {
        var me2 = this, strseed = "";
        me2.x = 0;
        me2.y = 0;
        me2.z = 0;
        me2.w = 0;
        me2.next = function() {
          var t = me2.x ^ me2.x << 11;
          me2.x = me2.y;
          me2.y = me2.z;
          me2.z = me2.w;
          return me2.w ^= me2.w >>> 19 ^ t ^ t >>> 8;
        };
        if (seed2 === (seed2 | 0)) {
          me2.x = seed2;
        } else {
          strseed += seed2;
        }
        for (var k2 = 0; k2 < strseed.length + 64; k2++) {
          me2.x ^= strseed.charCodeAt(k2) | 0;
          me2.next();
        }
      }
      __name(XorGen, "XorGen");
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        return t;
      }
      __name(copy, "copy");
      function impl(seed2, opts) {
        var xg = new XorGen(seed2), state = opts && opts.state, prng = /* @__PURE__ */ __name(function() {
          return (xg.next() >>> 0) / 4294967296;
        }, "prng");
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor128 = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xorwow.js
var require_xorwow = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xorwow.js"(exports, module2) {
    (function(global2, module3, define2) {
      function XorGen(seed2) {
        var me2 = this, strseed = "";
        me2.next = function() {
          var t = me2.x ^ me2.x >>> 2;
          me2.x = me2.y;
          me2.y = me2.z;
          me2.z = me2.w;
          me2.w = me2.v;
          return (me2.d = me2.d + 362437 | 0) + (me2.v = me2.v ^ me2.v << 4 ^ (t ^ t << 1)) | 0;
        };
        me2.x = 0;
        me2.y = 0;
        me2.z = 0;
        me2.w = 0;
        me2.v = 0;
        if (seed2 === (seed2 | 0)) {
          me2.x = seed2;
        } else {
          strseed += seed2;
        }
        for (var k2 = 0; k2 < strseed.length + 64; k2++) {
          me2.x ^= strseed.charCodeAt(k2) | 0;
          if (k2 == strseed.length) {
            me2.d = me2.x << 10 ^ me2.x >>> 4;
          }
          me2.next();
        }
      }
      __name(XorGen, "XorGen");
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        t.v = f.v;
        t.d = f.d;
        return t;
      }
      __name(copy, "copy");
      function impl(seed2, opts) {
        var xg = new XorGen(seed2), state = opts && opts.state, prng = /* @__PURE__ */ __name(function() {
          return (xg.next() >>> 0) / 4294967296;
        }, "prng");
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorwow = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xorshift7.js
var require_xorshift7 = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xorshift7.js"(exports, module2) {
    (function(global2, module3, define2) {
      function XorGen(seed2) {
        var me2 = this;
        me2.next = function() {
          var X2 = me2.x, i = me2.i, t, v, w2;
          t = X2[i];
          t ^= t >>> 7;
          v = t ^ t << 24;
          t = X2[i + 1 & 7];
          v ^= t ^ t >>> 10;
          t = X2[i + 3 & 7];
          v ^= t ^ t >>> 3;
          t = X2[i + 4 & 7];
          v ^= t ^ t << 7;
          t = X2[i + 7 & 7];
          t = t ^ t << 13;
          v ^= t ^ t << 9;
          X2[i] = v;
          me2.i = i + 1 & 7;
          return v;
        };
        function init(me3, seed3) {
          var j2, w2, X2 = [];
          if (seed3 === (seed3 | 0)) {
            w2 = X2[0] = seed3;
          } else {
            seed3 = "" + seed3;
            for (j2 = 0; j2 < seed3.length; ++j2) {
              X2[j2 & 7] = X2[j2 & 7] << 15 ^ seed3.charCodeAt(j2) + X2[j2 + 1 & 7] << 13;
            }
          }
          while (X2.length < 8)
            X2.push(0);
          for (j2 = 0; j2 < 8 && X2[j2] === 0; ++j2)
            ;
          if (j2 == 8)
            w2 = X2[7] = -1;
          else
            w2 = X2[j2];
          me3.x = X2;
          me3.i = 0;
          for (j2 = 256; j2 > 0; --j2) {
            me3.next();
          }
        }
        __name(init, "init");
        init(me2, seed2);
      }
      __name(XorGen, "XorGen");
      function copy(f, t) {
        t.x = f.x.slice();
        t.i = f.i;
        return t;
      }
      __name(copy, "copy");
      function impl(seed2, opts) {
        if (seed2 == null)
          seed2 = +new Date();
        var xg = new XorGen(seed2), state = opts && opts.state, prng = /* @__PURE__ */ __name(function() {
          return (xg.next() >>> 0) / 4294967296;
        }, "prng");
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.x)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorshift7 = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xor4096.js
var require_xor4096 = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/xor4096.js"(exports, module2) {
    (function(global2, module3, define2) {
      function XorGen(seed2) {
        var me2 = this;
        me2.next = function() {
          var w2 = me2.w, X2 = me2.X, i = me2.i, t, v;
          me2.w = w2 = w2 + 1640531527 | 0;
          v = X2[i + 34 & 127];
          t = X2[i = i + 1 & 127];
          v ^= v << 13;
          t ^= t << 17;
          v ^= v >>> 15;
          t ^= t >>> 12;
          v = X2[i] = v ^ t;
          me2.i = i;
          return v + (w2 ^ w2 >>> 16) | 0;
        };
        function init(me3, seed3) {
          var t, v, i, j2, w2, X2 = [], limit = 128;
          if (seed3 === (seed3 | 0)) {
            v = seed3;
            seed3 = null;
          } else {
            seed3 = seed3 + "\0";
            v = 0;
            limit = Math.max(limit, seed3.length);
          }
          for (i = 0, j2 = -32; j2 < limit; ++j2) {
            if (seed3)
              v ^= seed3.charCodeAt((j2 + 32) % seed3.length);
            if (j2 === 0)
              w2 = v;
            v ^= v << 10;
            v ^= v >>> 15;
            v ^= v << 4;
            v ^= v >>> 13;
            if (j2 >= 0) {
              w2 = w2 + 1640531527 | 0;
              t = X2[j2 & 127] ^= v + w2;
              i = 0 == t ? i + 1 : 0;
            }
          }
          if (i >= 128) {
            X2[(seed3 && seed3.length || 0) & 127] = -1;
          }
          i = 127;
          for (j2 = 4 * 128; j2 > 0; --j2) {
            v = X2[i + 34 & 127];
            t = X2[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            X2[i] = v ^ t;
          }
          me3.w = w2;
          me3.X = X2;
          me3.i = i;
        }
        __name(init, "init");
        init(me2, seed2);
      }
      __name(XorGen, "XorGen");
      function copy(f, t) {
        t.i = f.i;
        t.w = f.w;
        t.X = f.X.slice();
        return t;
      }
      __name(copy, "copy");
      ;
      function impl(seed2, opts) {
        if (seed2 == null)
          seed2 = +new Date();
        var xg = new XorGen(seed2), state = opts && opts.state, prng = /* @__PURE__ */ __name(function() {
          return (xg.next() >>> 0) / 4294967296;
        }, "prng");
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.X)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor4096 = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/tychei.js
var require_tychei = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/lib/tychei.js"(exports, module2) {
    (function(global2, module3, define2) {
      function XorGen(seed2) {
        var me2 = this, strseed = "";
        me2.next = function() {
          var b2 = me2.b, c = me2.c, d = me2.d, a = me2.a;
          b2 = b2 << 25 ^ b2 >>> 7 ^ c;
          c = c - d | 0;
          d = d << 24 ^ d >>> 8 ^ a;
          a = a - b2 | 0;
          me2.b = b2 = b2 << 20 ^ b2 >>> 12 ^ c;
          me2.c = c = c - d | 0;
          me2.d = d << 16 ^ c >>> 16 ^ a;
          return me2.a = a - b2 | 0;
        };
        me2.a = 0;
        me2.b = 0;
        me2.c = 2654435769 | 0;
        me2.d = 1367130551;
        if (seed2 === Math.floor(seed2)) {
          me2.a = seed2 / 4294967296 | 0;
          me2.b = seed2 | 0;
        } else {
          strseed += seed2;
        }
        for (var k2 = 0; k2 < strseed.length + 20; k2++) {
          me2.b ^= strseed.charCodeAt(k2) | 0;
          me2.next();
        }
      }
      __name(XorGen, "XorGen");
      function copy(f, t) {
        t.a = f.a;
        t.b = f.b;
        t.c = f.c;
        t.d = f.d;
        return t;
      }
      __name(copy, "copy");
      ;
      function impl(seed2, opts) {
        var xg = new XorGen(seed2), state = opts && opts.state, prng = /* @__PURE__ */ __name(function() {
          return (xg.next() >>> 0) / 4294967296;
        }, "prng");
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      __name(impl, "impl");
      if (module3 && module3.exports) {
        module3.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.tychei = impl;
      }
    })(
      exports,
      typeof module2 == "object" && module2,
      typeof define == "function" && define
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/seedrandom.js
var require_seedrandom = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/seedrandom.js"(exports, module2) {
    (function(global2, pool, math) {
      var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
      function seedrandom2(seed2, options, callback) {
        var key = [];
        options = options == true ? { entropy: true } : options || {};
        var shortseed = mixkey(flatten(
          options.entropy ? [seed2, tostring(pool)] : seed2 == null ? autoseed() : seed2,
          3
        ), key);
        var arc4 = new ARC4(key);
        var prng = /* @__PURE__ */ __name(function() {
          var n = arc4.g(chunks), d = startdenom, x2 = 0;
          while (n < significance) {
            n = (n + x2) * width;
            d *= width;
            x2 = arc4.g(1);
          }
          while (n >= overflow) {
            n /= 2;
            d /= 2;
            x2 >>>= 1;
          }
          return (n + x2) / d;
        }, "prng");
        prng.int32 = function() {
          return arc4.g(4) | 0;
        };
        prng.quick = function() {
          return arc4.g(4) / 4294967296;
        };
        prng.double = prng;
        mixkey(tostring(arc4.S), pool);
        return (options.pass || callback || function(prng2, seed3, is_math_call, state) {
          if (state) {
            if (state.S) {
              copy(state, arc4);
            }
            prng2.state = function() {
              return copy(arc4, {});
            };
          }
          if (is_math_call) {
            math[rngname] = prng2;
            return seed3;
          } else
            return prng2;
        })(
          prng,
          shortseed,
          "global" in options ? options.global : this == math,
          options.state
        );
      }
      __name(seedrandom2, "seedrandom");
      function ARC4(key) {
        var t, keylen = key.length, me2 = this, i = 0, j2 = me2.i = me2.j = 0, s2 = me2.S = [];
        if (!keylen) {
          key = [keylen++];
        }
        while (i < width) {
          s2[i] = i++;
        }
        for (i = 0; i < width; i++) {
          s2[i] = s2[j2 = mask & j2 + key[i % keylen] + (t = s2[i])];
          s2[j2] = t;
        }
        (me2.g = function(count) {
          var t2, r = 0, i2 = me2.i, j3 = me2.j, s3 = me2.S;
          while (count--) {
            t2 = s3[i2 = mask & i2 + 1];
            r = r * width + s3[mask & (s3[i2] = s3[j3 = mask & j3 + t2]) + (s3[j3] = t2)];
          }
          me2.i = i2;
          me2.j = j3;
          return r;
        })(width);
      }
      __name(ARC4, "ARC4");
      function copy(f, t) {
        t.i = f.i;
        t.j = f.j;
        t.S = f.S.slice();
        return t;
      }
      __name(copy, "copy");
      ;
      function flatten(obj, depth) {
        var result = [], typ = typeof obj, prop;
        if (depth && typ == "object") {
          for (prop in obj) {
            try {
              result.push(flatten(obj[prop], depth - 1));
            } catch (e) {
            }
          }
        }
        return result.length ? result : typ == "string" ? obj : obj + "\0";
      }
      __name(flatten, "flatten");
      function mixkey(seed2, key) {
        var stringseed = seed2 + "", smear, j2 = 0;
        while (j2 < stringseed.length) {
          key[mask & j2] = mask & (smear ^= key[mask & j2] * 19) + stringseed.charCodeAt(j2++);
        }
        return tostring(key);
      }
      __name(mixkey, "mixkey");
      function autoseed() {
        try {
          var out;
          if (nodecrypto && (out = nodecrypto.randomBytes)) {
            out = out(width);
          } else {
            out = new Uint8Array(width);
            (global2.crypto || global2.msCrypto).getRandomValues(out);
          }
          return tostring(out);
        } catch (e) {
          var browser = global2.navigator, plugins = browser && browser.plugins;
          return [+new Date(), global2, plugins, global2.screen, tostring(pool)];
        }
      }
      __name(autoseed, "autoseed");
      function tostring(a) {
        return String.fromCharCode.apply(0, a);
      }
      __name(tostring, "tostring");
      mixkey(math.random(), pool);
      if (typeof module2 == "object" && module2.exports) {
        module2.exports = seedrandom2;
        try {
          nodecrypto = require("crypto");
        } catch (ex) {
        }
      } else if (typeof define == "function" && define.amd) {
        define(function() {
          return seedrandom2;
        });
      } else {
        math["seed" + rngname] = seedrandom2;
      }
    })(
      typeof self !== "undefined" ? self : exports,
      [],
      Math
    );
  }
});

// node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/index.js
var require_seedrandom2 = __commonJS({
  "node_modules/.pnpm/seedrandom@3.0.5/node_modules/seedrandom/index.js"(exports, module2) {
    var alea = require_alea();
    var xor128 = require_xor128();
    var xorwow = require_xorwow();
    var xorshift7 = require_xorshift7();
    var xor4096 = require_xor4096();
    var tychei = require_tychei();
    var sr = require_seedrandom();
    sr.alea = alea;
    sr.xor128 = xor128;
    sr.xorwow = xorwow;
    sr.xorshift7 = xorshift7;
    sr.xor4096 = xor4096;
    sr.tychei = tychei;
    module2.exports = sr;
  }
});

// shared/code/arrayMethods.ts
function nonNulls(arr) {
  return arr.filter((x2) => x2 != null);
}
function setAt(arr, i, x2) {
  const copy = [...arr];
  copy[i] = x2;
  return copy;
}
var init_arrayMethods = __esm({
  "shared/code/arrayMethods.ts"() {
    "use strict";
    __name(nonNulls, "nonNulls");
    __name(setAt, "setAt");
  }
});

// shared/code/dedent.ts
var init_dedent = __esm({
  "shared/code/dedent.ts"() {
    "use strict";
  }
});

// shared/code/jsonString.ts
var init_jsonString = __esm({
  "shared/code/jsonString.ts"() {
    "use strict";
  }
});

// shared/code/misc.ts
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function satisfies(_2) {
}
function assertFinite(val) {
  if (!config.checkNumbersAreFinite)
    return val;
  if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++)
      if (!isFinite(val[i]))
        throw Error(
          `value '${val[i]}' at index ${i} is not a finite number`
        );
  } else if (typeof val === "object" && val != null) {
    for (const [k2, v] of Object.entries(val))
      if (!isFinite(v))
        throw Error(`value '${v}' at key ${k2} is not a finite number`);
  } else {
    if (!isFinite(val))
      throw Error(`value ${JSON.stringify(val)} is not a finite number`);
  }
  return val;
}
var config;
var init_misc = __esm({
  "shared/code/misc.ts"() {
    "use strict";
    config = { checkNumbersAreFinite: true };
    __name(sleep, "sleep");
    __name(satisfies, "satisfies");
    __name(assertFinite, "assertFinite");
  }
});

// shared/code/notnull.ts
function throwNull(name) {
  throw Error(`'${name}' is null`);
}
var init_notnull = __esm({
  "shared/code/notnull.ts"() {
    "use strict";
    __name(throwNull, "throwNull");
  }
});

// shared/code/objectHelpers.ts
function vals(obj) {
  return Object.values(obj);
}
function keys(obj) {
  return Object.keys(obj);
}
function entryMap(obj, f) {
  return Object.fromEntries(
    Object.entries(obj).map(([k2, v]) => [k2, f(k2, v)])
  );
}
function objFilter(obj, f) {
  const o = {};
  Object.entries(obj).forEach(([k2, v]) => {
    if (f(k2, v))
      o[k2] = v;
  });
  return o;
}
var import_lodash;
var init_objectHelpers = __esm({
  "shared/code/objectHelpers.ts"() {
    "use strict";
    import_lodash = require("lodash");
    __name(vals, "vals");
    __name(keys, "keys");
    __name(entryMap, "entryMap");
    __name(objFilter, "objFilter");
  }
});

// shared/code/rulebookVersion.ts
var rulebookVersion;
var init_rulebookVersion = __esm({
  "shared/code/rulebookVersion.ts"() {
    "use strict";
    rulebookVersion = "2.1.0";
  }
});

// shared/code/timezones.ts
function changeTimezone(date, ianatz) {
  const invdate = new Date(
    date.toLocaleString("en-US", {
      timeZone: ianatz
    })
  );
  const diff = date.getTime() - invdate.getTime();
  return new Date(date.getTime() - diff);
}
function pacificDate() {
  const d = changeTimezone(new Date(), "America/Los_Angeles");
  return d.toLocaleString();
}
var init_timezones = __esm({
  "shared/code/timezones.ts"() {
    "use strict";
    __name(changeTimezone, "changeTimezone");
    __name(pacificDate, "pacificDate");
  }
});

// shared/code/getServerEnv.ts
var DEFAULTS, getServerEnv;
var init_getServerEnv = __esm({
  "shared/code/getServerEnv.ts"() {
    "use strict";
    DEFAULTS = {
      LOG_LEVEL: "info",
      PORT: "3456",
      IS_PRODUCTION: "false",
      FIXED_SEED: "false",
      DEV_STATIC_ASSETS: "yes",
      JWT_TOKEN_SECRET: "dev-insecure-secret-remove-for-prod",
      MAX_POOL_SIZE: "5"
    };
    getServerEnv = /* @__PURE__ */ __name((key) => {
      if (key in DEFAULTS)
        return DEFAULTS[key];
      const fromProc = process.env[key];
      if (fromProc != null)
        return fromProc;
      return "";
    }, "getServerEnv");
  }
});

// shared/code/weight.ts
var weightsToCDF;
var init_weight = __esm({
  "shared/code/weight.ts"() {
    "use strict";
    weightsToCDF = /* @__PURE__ */ __name((weights) => {
      const totalWeight = Object.values(weights).reduce(
        (prev, cur) => cur + prev,
        0
      );
      let s2 = 0;
      const numValues = Object.keys(weights).length;
      if (totalWeight == 0) {
        return Object.fromEntries(
          Object.keys(weights).map((id, i) => {
            s2 += 1 / numValues;
            return i == numValues - 1 ? [id, 1] : [id, s2];
          })
        );
      }
      const weightCdf = Object.fromEntries(
        Object.entries(weights).map(([id, t], i) => {
          let normalWeight = t / totalWeight;
          s2 += normalWeight;
          return i == weights.length - 1 ? [id, 1] : [id, s2];
        })
      );
      return weightCdf;
    }, "weightsToCDF");
  }
});

// shared/code/taunt.ts
var baseTauntClass, baseTauntSpecies, effectTauntMap, miscTauntValues, calculateBaseTaunt, calculateTaunt;
var init_taunt = __esm({
  "shared/code/taunt.ts"() {
    "use strict";
    baseTauntClass = {
      cleric: 5,
      knight: 3,
      rogue: 0,
      wizard: 0,
      bard: 0
    };
    baseTauntSpecies = {
      frogKnight: 1,
      penguinKnight: 1,
      warhog: 2
    };
    effectTauntMap = {
      vulnerableDebuff: 8,
      unguardedDebuff: 4,
      unreadyDebuff: 2,
      berserkBuff: 5
    };
    miscTauntValues = {
      playAttack: 3,
      over20dmg: 3,
      aggressive: 5,
      avoidant: -5,
      halfHP: 3
    };
    calculateBaseTaunt = /* @__PURE__ */ __name((cm) => {
      if (!cm.isPc)
        return 0;
      const taunt = (baseTauntClass[cm.class] ?? 0) + (baseTauntSpecies[cm.id] ?? 0);
      return taunt;
    }, "calculateBaseTaunt");
    calculateTaunt = /* @__PURE__ */ __name((cm, time) => {
      let t = !time || time === "last" ? cm.lastTaunt : cm.taunt;
      if (cm.health <= cm.constitution / 2)
        t += miscTauntValues["halfHP"];
      for (const { id } of cm.effects) {
        t += effectTauntMap[id] ?? 0;
      }
      return t;
    }, "calculateTaunt");
  }
});

// shared/code/blockchain.ts
var getShortAccountId, getShortWalletAddress;
var init_blockchain = __esm({
  "shared/code/blockchain.ts"() {
    "use strict";
    getShortAccountId = /* @__PURE__ */ __name((id) => {
      if (!id)
        return "???";
      return id.length > 8 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id;
    }, "getShortAccountId");
    getShortWalletAddress = getShortAccountId;
  }
});

// shared/code/index.ts
var init_code = __esm({
  "shared/code/index.ts"() {
    "use strict";
    init_arrayMethods();
    init_dedent();
    init_jsonString();
    init_misc();
    init_notnull();
    init_objectHelpers();
    init_rulebookVersion();
    init_timezones();
    init_getServerEnv();
    init_weight();
    init_taunt();
    init_blockchain();
  }
});

// game/util/rand.ts
function srandInt(min, under) {
  return srandom() * (under - min) + min | 0;
}
function randInt(min, under) {
  return Math.random() * (under - min) + min | 0;
}
function randomEl(arr) {
  return arr[srandom() * arr.length | 0];
}
var init_rand = __esm({
  "game/util/rand.ts"() {
    "use strict";
    __name(srandInt, "srandInt");
    __name(randInt, "randInt");
    __name(randomEl, "randomEl");
  }
});

// game/util/rulebookUtil.ts
function getRulebookNames() {
  if (!(0, import_fs.existsSync)(prefix)) {
    (0, import_fs.mkdirSync)(prefix);
  }
  const filenames = (0, import_fs.readdirSync)(prefix);
  const names4 = filenames.map((fn) => removeExtension(fn));
  return [...names4, "default"];
}
function stringifyRulebook(rb) {
  const allKeys = [];
  const seen = /* @__PURE__ */ new Set();
  JSON.stringify(rb, function(key, value) {
    if (!seen.has(key)) {
      allKeys.push(key);
      seen.add(key);
    }
    return value;
  });
  allKeys.sort();
  const final = [...keyOrder, ...(0, import_lodash2.difference)(allKeys, keyOrder)];
  return JSON.stringify(rb, final, 4);
}
var import_fs, import_os, import_lodash2, prefix, toPath, removeExtension, keyOrder;
var init_rulebookUtil = __esm({
  "game/util/rulebookUtil.ts"() {
    "use strict";
    import_fs = require("fs");
    import_os = require("os");
    import_lodash2 = require("lodash");
    prefix = (0, import_os.homedir)() + "/rulebooks/";
    toPath = /* @__PURE__ */ __name((id) => prefix + id + ".json", "toPath");
    removeExtension = /* @__PURE__ */ __name((filename) => filename.replace(/\.[^/.]+$/, ""), "removeExtension");
    __name(getRulebookNames, "getRulebookNames");
    keyOrder = ["name", "version", "savedAt"];
    __name(stringifyRulebook, "stringifyRulebook");
  }
});

// game/util/treeHelpers.ts
function getBattleSceneIn(game) {
  const scene = game.select("scene");
  if (scene.get("id") !== "battle") {
    throw Error("getBattleScene called when not in battle scene");
  }
  return scene;
}
function toCursor(tree) {
  return new import_sbaobab.SBaobab(tree).select();
}
function getEntrySceneIn(game) {
  const scene = game.select("scene");
  const id = scene.get("id");
  const selectionIds = ["entry", "worlds", "pvp", "daily"];
  if (!selectionIds.includes(id)) {
    throw Error("getEntryScene called when not in entry/selection scene: " + id);
  }
  return scene;
}
function emit(args) {
  const { userId, event } = args;
  happenedThisTurn[userId] = [...happenedThisTurn[userId] ?? [], event];
}
function getHappened(userId) {
  return happenedThisTurn[userId] ?? [];
}
function clearHappened(userId) {
  happenedThisTurn[userId] = [];
}
var import_sbaobab, happenedThisTurn;
var init_treeHelpers = __esm({
  "game/util/treeHelpers.ts"() {
    "use strict";
    import_sbaobab = require("sbaobab");
    __name(getBattleSceneIn, "getBattleSceneIn");
    __name(toCursor, "toCursor");
    __name(getEntrySceneIn, "getEntrySceneIn");
    happenedThisTurn = {};
    __name(emit, "emit");
    __name(getHappened, "getHappened");
    __name(clearHappened, "clearHappened");
  }
});

// game/util/index.ts
var isProduction;
var init_util = __esm({
  "game/util/index.ts"() {
    "use strict";
    init_code();
    init_rand();
    init_rulebookUtil();
    init_treeHelpers();
    isProduction = getServerEnv("IS_PRODUCTION") === "true";
  }
});

// game/rulebook/battle/playerCharacterStatsMap.ts
var playerCharacterStatsMap;
var init_playerCharacterStatsMap = __esm({
  "game/rulebook/battle/playerCharacterStatsMap.ts"() {
    "use strict";
    playerCharacterStatsMap = {
      bloatDemon: {
        id: "bloatDemon",
        displayName: "Bloat Demon",
        isPc: true,
        class: "knight",
        constitution: 160,
        strength: 27,
        magic: 5,
        defense: 5
      },
      bogSpirit: {
        id: "bogSpirit",
        displayName: "Bog Spirit",
        isPc: true,
        class: "knight",
        constitution: 224,
        strength: 16,
        magic: 5,
        defense: 5
      },
      bookle: {
        id: "bookle",
        displayName: "Bookle",
        isPc: true,
        class: "knight",
        constitution: 60,
        strength: 10,
        magic: 5,
        defense: 5
      },
      bumbit: {
        id: "bumbit",
        displayName: "Bumbit",
        isPc: true,
        class: "knight",
        constitution: 58,
        strength: 18,
        magic: 5,
        defense: 5
      },
      frogKnight: {
        id: "frogKnight",
        displayName: "Frog Knight",
        isPc: true,
        class: "knight",
        constitution: 82,
        strength: 10,
        magic: 5,
        defense: 12
      },
      frogWizard: {
        id: "frogWizard",
        displayName: "Frog Wizard",
        isPc: true,
        class: "knight",
        constitution: 66,
        strength: 24,
        magic: 5,
        defense: 5
      },
      gnomeHooligan: {
        id: "gnomeHooligan",
        displayName: "Gnome Hooligan",
        isPc: true,
        class: "rogue",
        constitution: 42,
        strength: 12 + 1,
        magic: 14,
        defense: 7
      },
      goblinDragon: {
        id: "goblinDragon",
        displayName: "Goblin Dragon",
        isPc: true,
        class: "knight",
        constitution: 120,
        strength: 13,
        magic: 5,
        defense: 5
      },
      greenJester: {
        id: "greenJester",
        displayName: "Green Jester",
        isPc: true,
        class: "knight",
        constitution: 120,
        strength: 34,
        magic: 5,
        defense: 5
      },
      jerry: {
        id: "jerry",
        displayName: "Jerry",
        isPc: true,
        class: "wizard",
        constitution: 86,
        strength: 999,
        magic: 14,
        defense: 5 + 1
      },
      lichLord: {
        id: "lichLord",
        displayName: "Lich Lord",
        isPc: true,
        class: "knight",
        constitution: 250,
        strength: 27,
        magic: 5,
        defense: 5
      },
      matchaGelatinCube: {
        id: "matchaGelatinCube",
        displayName: "Matcha Gelatin Cube",
        isPc: false,
        class: "cleric",
        constitution: 78 + 25,
        strength: 5 + 1,
        magic: 7 + 2,
        defense: 5 + 4
      },
      mushroomFarmer: {
        id: "mushroomFarmer",
        displayName: "Mushroom Farmer",
        isPc: true,
        class: "cleric",
        constitution: 112,
        strength: 8,
        magic: 9,
        defense: 6
      },
      notoriousBean: {
        id: "notoriousBean",
        displayName: "Notorious B.E.A.N.",
        isPc: true,
        class: "bard",
        constitution: 70,
        strength: 12,
        magic: 7,
        defense: 6
      },
      orcWarrior: {
        id: "orcWarrior",
        displayName: "Orc Warrior",
        isPc: false,
        class: "knight",
        constitution: 88,
        strength: 12,
        magic: 5,
        defense: 5
      },
      penguinKnight: {
        id: "penguinKnight",
        displayName: "Penguin Knight",
        isPc: true,
        class: "knight",
        constitution: 74,
        strength: 12,
        magic: 5,
        defense: 9
      },
      skeletonWarrior: {
        id: "skeletonWarrior",
        displayName: "Skeleton Warrior",
        isPc: false,
        class: "knight",
        constitution: 54 + 4,
        strength: 11 + 3,
        magic: 4,
        defense: 4 + 3
      },
      snacky: {
        id: "snacky",
        displayName: "Snacky",
        isPc: true,
        class: "bard",
        constitution: 67,
        strength: 16,
        magic: 5,
        defense: 5
      },
      theHatefly: {
        id: "theHatefly",
        displayName: "The Hatefly",
        isPc: true,
        class: "knight",
        constitution: 300,
        strength: 22,
        magic: 5,
        defense: 5
      },
      trioOfFools: {
        id: "trioOfFools",
        displayName: "Trio of Fools",
        isPc: true,
        class: "knight",
        constitution: 110,
        strength: 15,
        magic: 5,
        defense: 5
      },
      warhog: {
        id: "warhog",
        displayName: "Warhog",
        isPc: true,
        class: "cleric",
        constitution: 84 + 40,
        strength: 6,
        magic: 7,
        defense: 5 + 5
      },
      wimpyGuard: {
        id: "wimpyGuard",
        displayName: "Wimpy Guard",
        isPc: true,
        class: "knight",
        constitution: 170,
        strength: 24,
        magic: 5,
        defense: 5
      }
    };
  }
});

// game/rulebook/eventSceneMap.ts
var eventSceneMap;
var init_eventSceneMap = __esm({
  "game/rulebook/eventSceneMap.ts"() {
    "use strict";
    eventSceneMap = {
      cursedStatue: {
        id: "cursedStatue",
        title: "The Cursed Statue",
        prompts: [
          "A large statue of a demon with gems for eyes stands before you.\nYou hear a faint whisper echo as you lock eyes with the demon. The whisper feels like it coming within your own head.",
          '"Closer", says the demon.\n"Choose a hand,"\n"Gifts, Closer."'
        ],
        choices: [
          {
            souvenirId: "demonsLeftHand",
            text: "Touch the demon's left hand.",
            postPrompts: [
              "One of your Kaiju steps forward and touches the Demon's left hand. They let out a shriek as their body is wrapped in a red mist.",
              "After the mist settles you can tell that your Kaiju is 5% shorter\n but its head and arms are 5 % larger.",
              '"Gifts of power, at the cost of Vitality." the statue whispered.'
            ]
          },
          {
            souvenirId: "demonsRightHand",
            text: "Touch the demon's right hand.",
            postPrompts: [
              "One of your Kaiju steps forward and touches the Demon's right hand. They let out a shriek as their body is wrapped in a yellow mist.",
              "After the mist has settled you can tell that your Kaiju is 5% taller\nbut its head and arms are 5 % smaller.",
              '"Gifts of Vitality, at the cost of Power" the statue hisses.'
            ]
          },
          {
            souvenirId: null,
            text: '"Aaaaaaaaah!", you scream "AaaaaAaah!".',
            postPrompts: [
              "AAAAAAAAaaaaaHHHhh! aaaAAAHHHhh!\nThe statue was too scary so you had to run away.\nYou leave without accepting the Demon's gifts."
            ]
          }
        ]
      },
      frogCarriage: {
        id: "frogCarriage",
        title: "No Carriage For Old Frogs",
        prompts: [
          "Your party sees a carriage with a broken wheel.\n Driving the carriage is an elderly frog with a very big beard.",
          '"Hello Travelers. I am an elderly frog with a very big beard. I am bad at driving and as a result i have broken my carriage wheel while attempting to do donuts in the fields. ',
          'I am unable to fix the wheel by myself, but perhaps I could repair it with the assistance of some strapping young Kaiju. Will you help me?"'
        ],
        choices: [
          {
            souvenirId: "frogWine",
            text: "Help the elderly frog fix his wheel.",
            postPrompts: [
              '"Well I"ll be darned, you fixed it up good as new! I"d bet I could do hundreds of donuts with this wheel."',
              '"Take a barrel of frog wine for your trouble. Don"t mind me now, I"ve got open fields to do donuts in."'
            ]
          },
          {
            souvenirId: "brokenCarriageWheel",
            text: "Attempt to do donuts with the broken carriage, further damaging the wheel.",
            postPrompts: [
              '"That wheel has at least 3 or 4 more donuts left in it my guy" you say to the old frog with the very big beard.',
              "Everyone hops in and you get two perfect donuts before the broken wheel shatters.",
              '"Hmm, looks like you don"t know anything about carriages, Please take this broken wheel because it is reminding me of how bad at doing donuts you are."'
            ]
          },
          {
            souvenirId: "bundleOfFrogWine",
            text: "Fight the elderly frog and rob him of his cargo.",
            postPrompts: [
              "You look over the old man and determine that he is very old and frail, and his beard is very big.",
              'You decide to rob him of his cargo and grab all of the frog wine you can carry. The old frog doesn"t put up a fight because he is worried about damaging his very big beard.'
            ]
          }
        ]
      },
      gnomeStory: {
        id: "gnomeStory",
        title: '"It is my bedtime."',
        prompts: [
          'A gnome wearing striped pajamas with matching nightcap approaches you.\nHe smacks his lips three times. "Ho hum, memememe", exclaims the gnome.',
          '"It is my bed time", the gnome tells you.',
          '"I will have a much more comfortable sleep if you read me a tale from my favorite book: "The Little Gnome Prince Who Lived in a Bath Tub Made of Chocolate".',
          '"Please do not read me the tale from the back of the book: "The little Gnome Who Lived Alone in a Townhouse Made of Ghosts". It will give me sleep paralysis".'
        ],
        choices: [
          {
            souvenirId: "glassOfWarmMilk",
            text: 'Read: "The Little Gnome Prince Who\nLived in a Bathtub Made of Chocolate."',
            postPrompts: [
              '"mmmmmmmmm ZzzZzz mmMmmm zzZZZZzz mmmzzzz mm zzz zzz zZz".'
            ]
          },
          {
            souvenirId: "nightmareBiscuit",
            text: 'Read: "The Little Gnome Who Lived in a Townhouse Made of Ghosts."',
            postPrompts: [
              '"aaaAAAAAAAAAAA ZZZZZZZZZZ AAAAAAAHHHHAAAA ZZZ AHAHAAAAAAAAA NONONONO AAAAAAAAA ZZZZ aaaHhhhhhhhhhfffffffff"!'
            ]
          }
        ]
      },
      gnomeTooth: {
        id: "gnomeTooth",
        title: "Are You a Dentist?",
        prompts: [
          'A gnome with a gigantic tooth stands before you. He looks like he is in terrible pain. "I am in terrible pain", says the gnome.',
          '"Owie ouch ouch ouch, I do not like having a gigantic tooth no sir wow this sucks".',
          '"If you are a dentist, would you mind removing it for me?\nI have never seen a dentist before so I do not know how to identify one."'
        ],
        choices: [
          {
            souvenirId: "dentistryForDummies",
            text: '"No, I am not a dentist".',
            postPrompts: [
              'You tell the gnome that you aren"t a dentist and cannot help him.',
              '"Oh, Ok. I think I have a book on removing teeth, but I cannot read it because \nmy very large tooth is blocking my good reading eye."',
              '"If you encounter another Gnome with a big stinky tooth,hopefully you can help them with this book. Owww Owwwie."'
            ]
          },
          {
            souvenirId: "bigStinkyTooth",
            text: '"Yes, I am a licensed medical professional."',
            postPrompts: [
              "You attempt to remove the tooth despite not actually being a dentist.\nAfter a slight struggle and some painful cries, the tooth slides right out.",
              '"Hooray! You were a dentist after all!  Thank you for not lying about that.\nI will remember that all dentists look like you from now on."',
              '"This is my first time ever meeting a licensed medical professional.\nPlease, keep the tooth as a reward, I do not want it."'
            ]
          }
        ]
      },
      hogClown: {
        id: "hogClown",
        title: "\u201CAck!  I am covered in small clowns!\u201D",
        prompts: [
          "A Warhog covered in gnome Hooligans that are dressed as clowns stands nearby.\nHe is desperately trying to swat them off.",
          '"There are too many dang clowns on my back. Can you please help me decrease the number of clowns that are on my back?" ',
          '"I cannot remove them myself because my body is enormous but my arms are very small."'
        ],
        choices: [
          {
            souvenirId: "squeakyClownShoes",
            text: '"Yes, I will help you remove the small clowns that are on your back."',
            postPrompts: [
              '"Thank goodness! There were far too many clowns on my back. There is a pair of clown shoes wedged in-between my shoulder blades if you would like to take them."'
            ]
          },
          {
            souvenirId: "clownInfestation",
            text: '"Sorry you are a stranger and I have no interest in helping you at this time."',
            postPrompts: [
              '"I respect your decision to be wary of strangers, but I am also sad because I simply have too many clowns on my back and would like for them to not be there anymore."',
              '"Uh-Oh, it looks like you have clowns on your back now. Hopefully you can find a stranger willing to help you. I would help you but I simply have too many clowns on my back."'
            ]
          },
          {
            souvenirId: "cowardsCrown",
            text: '"I have a fear of clowns. I would help you but it is too scary sorry time for me to go."',
            postPrompts: [
              '"That is extremely reasonable. It is unfortunate for me that you are too scared of clowns to help me. I have a lot of clowns on my back and I do not want them there but I understand. Pleae take this, It will hopefully help you with your fear of clowns."'
            ]
          }
        ]
      },
      tooManyHats: {
        id: "tooManyHats",
        title: "Too Many Hats",
        prompts: [
          `"Hats!  Hats for sale!  I am selling hats oh god is there anyone here please please help me sell these hats I am desperate to sell my hats".`,
          "\u201CThrough a series of events I am legally not allowed to disclose, I have been cursed with the burden of 1000 hats. I must sell them all or go to jail. Buy a hat please?\u201D"
        ],
        choices: [
          {
            souvenirId: "questionableHat",
            text: "Acquire Questionable Hat",
            postPrompts: []
          },
          {
            souvenirId: null,
            text: "This man and his terrible hats must suffer for their unspoken crimes. Leave without purchasing one.",
            postPrompts: []
          }
        ]
      }
    };
  }
});

// game/rulebook/battle/rooms.ts
function getDungeonRooms() {
  return fillRooms((0, import_lodash3.cloneDeep)(getRulebook().dungeonTemplates));
}
function fillRooms(roomSkeletons) {
  const takenRoomIndicesByCategory = {
    events: [],
    tierOne: [],
    tierTwo: [],
    tierThree: [],
    tierFour: [],
    restSite: [],
    bosses: []
  };
  const roomOptions2 = getRulebook().roomOptions;
  keys(roomSkeletons).forEach((roomSkeletonKey) => {
    keys(roomSkeletons[roomSkeletonKey]).forEach((roomUid) => {
      const room = roomSkeletons[roomSkeletonKey][roomUid];
      if (room.category == null || room.enemies.length)
        return;
      const takenRoomIndicesOfCategory = takenRoomIndicesByCategory[room.category];
      Object.assign(
        room,
        randomRoomOfCategory(
          room.category,
          takenRoomIndicesOfCategory,
          roomOptions2
        )
      );
    });
  });
  return roomSkeletons;
}
function randomRoomOfCategory(category, takenRoomIndicesOfCategory, roomOptions2) {
  const roomsOfCategory = roomOptions2[category];
  const randomRoomIndex = randInt(0, roomsOfCategory.length);
  if (takenRoomIndicesOfCategory.includes(randomRoomIndex) && takenRoomIndicesOfCategory.length < roomsOfCategory.length)
    return randomRoomOfCategory(
      category,
      takenRoomIndicesOfCategory,
      roomOptions2
    );
  takenRoomIndicesOfCategory.push(randomRoomIndex);
  const room = roomsOfCategory[randomRoomIndex];
  if (!room.enemies)
    return { enemies: room };
  return room;
}
var import_lodash3, eventEnemies, roomOptions, dungeonTemplates;
var init_rooms = __esm({
  "game/rulebook/battle/rooms.ts"() {
    "use strict";
    init_util();
    import_lodash3 = require("lodash");
    init_code();
    init_eventSceneMap();
    init_rulebook();
    eventEnemies = [
      [
        {
          id: "gnomeBandit",
          level: 1
        },
        {
          id: "orcWarrior",
          level: 3
        },
        {
          id: "gnomeBandit",
          level: 2
        }
      ],
      [
        {
          id: "matchaGelatinCube",
          level: 6
        }
      ],
      [
        {
          id: "skeletonWarrior",
          level: 2
        },
        {
          id: "matchaGelatinCube",
          level: 3
        },
        {
          id: "skeletonWarrior",
          level: 2
        }
      ],
      [
        {
          id: "matchaGelatinCube",
          level: 2
        },
        {
          id: "skeletonWarrior",
          level: 3
        },
        {
          id: "matchaGelatinCube",
          level: 1
        }
      ],
      [
        {
          id: "matchaGelatinCube",
          level: 2
        },
        {
          id: "matchaGelatinCube",
          level: 2
        },
        {
          id: "matchaGelatinCube",
          level: 2
        }
      ],
      [
        {
          id: "orcWarrior",
          level: 2
        },
        {
          id: "gnomeProspector",
          level: 3
        },
        {
          id: "orcWarrior",
          level: 2
        }
      ],
      [
        {
          id: "skeletonWarrior",
          level: 8
        }
      ],
      [
        {
          id: "warhogRaider",
          level: 3
        },
        {
          id: "plaguehog",
          level: 3
        },
        {
          id: "groghog",
          level: 3
        }
      ],
      [
        {
          id: "skeletonWarrior",
          level: 4
        },
        {
          id: "orcWarrior",
          level: 4
        }
      ]
    ];
    roomOptions = {
      events: vals(eventSceneMap).map((event, index) => ({
        enemies: eventEnemies[index % eventEnemies.length],
        event
      })),
      tierOne: [
        [
          {
            id: "orcWarrior",
            level: 1
          },
          {
            id: "brimboneSkeleton",
            level: 2
          },
          {
            id: "orcWarrior",
            level: 1
          }
        ],
        [
          {
            id: "plaguehog",
            level: 1
          },
          {
            id: "gnomeProspector",
            level: 2
          },
          {
            id: "frostHog",
            level: 2
          }
        ],
        [
          {
            id: "gnomeProspector",
            level: 2
          },
          {
            id: "frostHog",
            level: 2
          }
        ],
        [
          {
            id: "plaguehog",
            level: 2
          },
          {
            id: "gnomeProspector",
            level: 2
          }
        ],
        [
          {
            id: "plaguehog",
            level: 4
          }
        ],
        [
          {
            id: "brimboneSkeleton",
            level: 5
          }
        ]
      ],
      tierTwo: [
        [
          {
            id: "groghog",
            level: 2
          },
          {
            id: "frostHog",
            level: 3
          },
          {
            id: "groghog",
            level: 2
          }
        ],
        [
          {
            id: "gnomeProspector",
            level: 2
          },
          {
            id: "gnomeBandit",
            level: 3
          },
          {
            id: "groghog",
            level: 2
          }
        ],
        [
          {
            id: "gnomeBandit",
            level: 2
          },
          {
            id: "plaguehog",
            level: 3
          },
          {
            id: "gnomeBandit",
            level: 2
          }
        ],
        [
          {
            id: "matchaGelatinCube",
            level: 2
          },
          {
            id: "frostHog",
            level: 3
          },
          {
            id: "matchaGelatinCube",
            level: 2
          }
        ],
        [
          {
            id: "gnomeBigBomber",
            level: 2
          },
          {
            id: "gnomeProspector",
            level: 3
          },
          {
            id: "gnomeBigBomber",
            level: 2
          }
        ]
      ],
      tierThree: [
        [
          {
            id: "groghog",
            level: 3
          },
          {
            id: "plaguehog",
            level: 3
          },
          {
            id: "frostHog",
            level: 3
          }
        ],
        [
          {
            id: "skeletonWarrior",
            level: 9
          }
        ],
        [
          {
            id: "gnomeBandit",
            level: 3
          },
          {
            id: "groghog",
            level: 3
          },
          {
            id: "gnomeBandit",
            level: 3
          }
        ],
        [
          {
            id: "gnomeBandit",
            level: 9
          }
        ]
      ],
      tierFour: [
        [
          {
            id: "orcWarrior",
            level: 4
          },
          {
            id: "plaguehog",
            level: 4
          },
          {
            id: "brimboneSkeleton",
            level: 4
          }
        ],
        [
          {
            id: "frostHog",
            level: 6
          },
          {
            id: "groghog",
            level: 6
          }
        ],
        [
          {
            id: "plaguehog",
            level: 4
          },
          {
            id: "frostHog",
            level: 4
          },
          {
            id: "plaguehog",
            level: 4
          }
        ],
        [
          {
            id: "gnomeProspector",
            level: 4
          },
          {
            id: "gnomeBandit",
            level: 4
          },
          {
            id: "gnomeBigBomber",
            level: 4
          }
        ],
        [
          {
            id: "skeletonWarrior",
            level: 3
          },
          {
            id: "warhogRaider",
            level: 6
          },
          {
            id: "brimboneSkeleton",
            level: 3
          }
        ]
      ],
      restSite: [
        [
          {
            id: "REST_SITE",
            level: 1
          }
        ]
      ],
      bosses: [
        [
          {
            id: "bosshogJurgen",
            level: 9
          }
        ]
      ]
    };
    dungeonTemplates = {
      "Skelepit Dungeon": {},
      "Hooligans Bluff": {
        root: {
          uid: "root",
          enemies: [],
          edges: ["", "1_1", "", ""]
        },
        "1_1": {
          uid: "1_1",
          enemies: [],
          category: "tierOne",
          edges: ["1_3", "", "2_0", ""]
        },
        "1_3": {
          uid: "1_3",
          enemies: [],
          category: "tierOne",
          edges: ["1_5", "2_4", "", ""]
        },
        "1_5": {
          uid: "1_5",
          enemies: [],
          category: "events",
          edges: ["1_7", "", "", ""]
        },
        "1_7": {
          uid: "1_7",
          enemies: [],
          category: "tierTwo",
          edges: ["", "2_8", "", ""]
        },
        "2_0": {
          uid: "2_0",
          enemies: [],
          category: "tierOne",
          edges: ["", "3_1", "", ""]
        },
        "2_4": {
          uid: "2_4",
          enemies: [],
          category: "tierOne",
          edges: ["", "3_5", "", ""]
        },
        "2_8": {
          uid: "2_8",
          enemies: [],
          category: "tierTwo",
          edges: ["", "", "3_7", ""]
        },
        "3_1": {
          uid: "3_1",
          enemies: [],
          category: "events",
          edges: ["", "4_2", "", ""]
        },
        "3_5": {
          uid: "3_5",
          enemies: [],
          category: "tierTwo",
          edges: ["3_7", "4_6", "", ""]
        },
        "3_7": {
          uid: "3_7",
          enemies: [],
          category: "events",
          edges: ["", "4_8", "", ""]
        },
        "4_2": {
          uid: "4_2",
          enemies: [],
          category: "tierTwo",
          edges: ["4_4", "", "", ""]
        },
        "4_4": {
          uid: "4_4",
          enemies: [],
          category: "tierTwo",
          edges: ["4_6", "", "", ""]
        },
        "4_6": {
          uid: "4_6",
          enemies: [],
          category: "events",
          edges: ["4_8", "", "", ""]
        },
        "4_8": {
          uid: "4_8",
          enemies: [
            {
              id: "mimic",
              level: 5
            }
          ],
          category: "bosses",
          edges: ["4_10", "5_9", "", ""]
        },
        "4_10": {
          uid: "4_10",
          enemies: [],
          category: "tierTwo",
          edges: ["4_12", "", "", ""]
        },
        "4_12": {
          uid: "4_12",
          enemies: [],
          category: "tierTwo",
          edges: ["", "5_13", "", ""]
        },
        "5_9": {
          uid: "5_9",
          enemies: [],
          category: "tierTwo",
          edges: ["", "6_10", "6_8", ""]
        },
        "5_13": {
          uid: "5_13",
          enemies: [],
          category: "events",
          edges: ["", "6_14", "", ""]
        },
        "6_8": {
          uid: "6_8",
          enemies: [],
          category: "tierThree",
          edges: ["", "", "7_7", ""]
        },
        "6_10": {
          uid: "6_10",
          enemies: [],
          category: "events",
          edges: ["", "7_11", "", ""]
        },
        "6_14": {
          uid: "6_14",
          enemies: [],
          category: "tierTwo",
          edges: ["", "", "7_13", ""]
        },
        "7_7": {
          uid: "7_7",
          enemies: [],
          category: "restSite",
          edges: ["", "8_8", "", ""]
        },
        "7_11": {
          uid: "7_11",
          enemies: [],
          category: "tierThree",
          edges: ["7_13", "", "", ""]
        },
        "7_13": {
          uid: "7_13",
          enemies: [],
          category: "tierThree",
          edges: ["", "8_14", "", ""]
        },
        "8_8": {
          uid: "8_8",
          enemies: [],
          category: "tierThree",
          edges: ["", "9_9", "", ""]
        },
        "8_14": {
          uid: "8_14",
          enemies: [],
          category: "tierFour",
          edges: ["", "9_15", "", ""]
        },
        "9_9": {
          uid: "9_9",
          enemies: [],
          category: "tierThree",
          edges: ["9_11", "", "", ""]
        },
        "9_11": {
          uid: "9_11",
          enemies: [],
          category: "tierThree",
          edges: ["9_13", "", "", ""]
        },
        "9_13": {
          uid: "9_13",
          enemies: [],
          category: "tierFour",
          edges: ["9_15", "", "", ""]
        },
        "9_15": {
          uid: "9_15",
          enemies: [],
          category: "restSite",
          edges: ["9_17", "", "", ""]
        },
        "9_17": {
          uid: "9_17",
          enemies: [
            {
              id: "bosshogJurgen",
              level: "default",
              boss: true
            }
          ],
          category: "bosses",
          edges: ["", "", "", ""]
        }
      },
      "Fort Skeleton": {},
      "The Ninth Trash Hole of Hell": {},
      "The Matcha Caves": {}
    };
    __name(getDungeonRooms, "getDungeonRooms");
    __name(fillRooms, "fillRooms");
    __name(randomRoomOfCategory, "randomRoomOfCategory");
  }
});

// game/rulebook/battle/stanceTypeMetaMap.ts
var stanceTypeMetaMap;
var init_stanceTypeMetaMap = __esm({
  "game/rulebook/battle/stanceTypeMetaMap.ts"() {
    "use strict";
    stanceTypeMetaMap = {
      avoidant: {
        id: "avoidant",
        attackMultiplier: 0.75,
        defenseMultiplier: 1.25,
        targetLikelihood: 1
      },
      neutral: {
        id: "neutral",
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1
      },
      aggressive: {
        id: "aggressive",
        attackMultiplier: 1.25,
        defenseMultiplier: 0.75,
        targetLikelihood: 1
      }
    };
  }
});

// game/rulebook/battle/index.ts
var init_battle = __esm({
  "game/rulebook/battle/index.ts"() {
    "use strict";
    init_playerCharacterStatsMap();
    init_rooms();
    init_stanceTypeMetaMap();
  }
});

// game/rulebook/npcStatsMapByLevel.ts
var npcStatsMapByLevel;
var init_npcStatsMapByLevel = __esm({
  "game/rulebook/npcStatsMapByLevel.ts"() {
    "use strict";
    npcStatsMapByLevel = {
      skeletonWarrior: {
        1: { level: "1", magic: 0, constitution: 19, strength: 10, defense: 7, moves: ["swordWack", "rustyPokeLow", "jab", "strike", "jab"] },
        2: { level: "2", magic: 0, constitution: 27, strength: 14, defense: 9, moves: ["swordWack", "rustyPokeLow", "swordWack", "block", "swordWack"] },
        3: { level: "3", magic: 0, constitution: 36, strength: 18, defense: 12, moves: ["swordWack", "rustyPokeLow", "slash", "block", "swordWack"] },
        4: { level: "4", magic: 0, constitution: 50, strength: 22, defense: 16, moves: ["swordWack", "rustyPokeLow", "slash", "block", "swordWack"] },
        5: { level: "5", magic: 0, constitution: 65, strength: 26, defense: 19, moves: ["swordWack", "rustyPokeLow", "slash", "block", "swordWack"] },
        6: { level: "6", magic: 0, constitution: 87, strength: 30, defense: 22, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(1,1)"] },
        7: { level: "7", magic: 0, constitution: 101, strength: 34, defense: 25, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(2,2)"] },
        8: { level: "8", magic: 0, constitution: 121, strength: 38, defense: 28, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(2,2)"] },
        9: { level: "9", magic: 0, constitution: 135, strength: 42, defense: 31, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(3,3)"] },
        10: { level: "10", magic: 0, constitution: 150, strength: 46, defense: 34, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(3,3)"] }
      },
      brimboneSkeleton: {
        1: { level: "1", magic: 0, constitution: 16, strength: 6, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        2: { level: "2", magic: 0, constitution: 32, strength: 12, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        3: { level: "3", magic: 0, constitution: 48, strength: 18, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        4: { level: "4", magic: 0, constitution: 64, strength: 24, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        5: { level: "5", magic: 0, constitution: 80, strength: 30, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        6: { level: "6", magic: 0, constitution: 96, strength: 36, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        7: { level: "7", magic: 0, constitution: 112, strength: 42, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        8: { level: "8", magic: 0, constitution: 128, strength: 48, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        9: { level: "9", magic: 0, constitution: 144, strength: 54, defense: 0, moves: ["fire", "brimbone", "basicAttack"] },
        10: { level: "10", magic: 0, constitution: 160, strength: 60, defense: 0, moves: ["fire", "brimbone", "basicAttack"] }
      },
      matchaGelatinCube: {
        1: { level: "1", magic: 0, constitution: 22, strength: 8, defense: 10, moves: ["itchyOoze(2)", "block", "basicAttack", "block", "basicAttack"] },
        2: { level: "2", magic: 0, constitution: 36, strength: 14, defense: 14, moves: ["basicAttack", "surpriseAllergy(2,1)", "block", "basicAttack", "block"] },
        3: { level: "3", magic: 0, constitution: 55, strength: 20, defense: 17, moves: ["basicAttack", "surpriseAllergy(2,1)", "itchyOoze(3)", "block", "surpriseAllergy(3,2)"] },
        4: { level: "4", magic: 0, constitution: 72, strength: 22, defense: 22, moves: ["basicAttack", "surpriseAllergy(3,2)", "itchyOoze(4)", "block", "surpriseAllergy(3,2)"] },
        5: { level: "5", magic: 0, constitution: 80, strength: 32, defense: 26, moves: ["basicAttack", "surpriseAllergy(3,2)", "itchyOoze(4)", "block", "surpriseAllergy(3,2)"] },
        6: { level: "6", magic: 0, constitution: 105, strength: 38, defense: 31, moves: ["basicAttack", "surpriseAllergy(3,2)", "itchyOoze(5)", "block", "engulf(50)"] },
        7: { level: "7", magic: 0, constitution: 130, strength: 44, defense: 36, moves: ["basicAttack", "surpriseAllergy(3,2)", "itchyOoze(6)", "block", "engulf(50)"] },
        8: { level: "8", magic: 0, constitution: 160, strength: 50, defense: 41, moves: ["basicAttack", "surpriseAllergy(4,2)", "itchyOoze(7)", "block", "engulf(75)"] },
        9: { level: "9", magic: 0, constitution: 175, strength: 56, defense: 48, moves: ["basicAttack", "surpriseAllergy(4,2)", "itchyOoze(8)", "block", "engulf(75)"] },
        10: { level: "10", magic: 0, constitution: 200, strength: 62, defense: 56, moves: ["basicAttack", "surpriseAllergy(5,2)", "itchyOoze(9)", "block", "engulf(75)"] },
        large: { level: "large", magic: 0, constitution: "200-100", strength: 68, defense: 20, moves: ["matchaMash", "matchaMadness", "matchaMeld", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)"] },
        medium: { level: "medium", magic: 0, constitution: "99-30", strength: 74, defense: 10, moves: ["matchaMash", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)"] },
        small: { level: "small", magic: 0, constitution: ">29", strength: 80, defense: 5, moves: ["matchaMash", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)", "surpriseAllergy(2,1)"] }
      },
      gnomeHooligan: {
        1: { level: "1", magic: 0, constitution: 10, strength: 10, defense: 6, moves: ["gnomeBomb", "bellowAndSing(1,1)", "gnomeBomb", "block", "gnomeBomb"] },
        2: { level: "2", magic: 0, constitution: 12, strength: 12, defense: 8, moves: ["gnomeBomb", "bellowAndSing(1,1)", "gnomeBomb", "block", "gnomeBomb"] },
        3: { level: "3", magic: 0, constitution: 14, strength: 14, defense: 10, moves: ["gnomeBomb", "slash", "gnomeBomb", "block", "gnomeBomb"] },
        4: { level: "4", magic: 0, constitution: 16, strength: 16, defense: 12, moves: ["gnomeBomb", "slash", "bellowAndSing(1,1)", "block", "gnomeBomb"] },
        5: { level: "5", magic: 0, constitution: 18, strength: 18, defense: 14, moves: ["gnomeBomb", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,1)"] },
        6: { level: "6", magic: 0, constitution: 20, strength: 20, defense: 16, moves: ["gnomeBomb", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,1)"] },
        7: { level: "7", magic: 0, constitution: 22, strength: 22, defense: 19, moves: ["gnomeBomb", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,2)"] },
        8: { level: "8", magic: 0, constitution: 24, strength: 24, defense: 22, moves: ["gnomeBomb", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(125,2)"] },
        9: { level: "9", magic: 0, constitution: 26, strength: 26, defense: 25, moves: ["gnomeBomb", "slash", "bellowAndSing(2,1)", "block", "screamAndCharge(125,2)"] },
        10: { level: "10", magic: 0, constitution: 28, strength: 28, defense: 28, moves: ["gnomeBomb", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(125,2)"] }
      },
      orcWarrior: {
        1: { level: "1", magic: 0, constitution: 15, strength: 14, defense: 6, moves: ["meatyCharge(1)", "slash", "meatyCharge(1)", "block", "meatyCharge(1)"] },
        2: { level: "2", magic: 0, constitution: 33, strength: 20, defense: 8, moves: ["meatyCharge(1)", "slash", "meatyCharge(1)", "block", "meatyCharge(1)"] },
        3: { level: "3", magic: 0, constitution: 50, strength: 26, defense: 10, moves: ["meatyCharge(1)", "slash", "meatyCharge(1)", "block", "meatyCharge(1)"] },
        4: { level: "4", magic: 0, constitution: 75, strength: 32, defense: 12, moves: ["meatyCharge(1)", "slash", "bellowAndSing(1,1)", "block", "meatyCharge(1)"] },
        5: { level: "5", magic: 0, constitution: 88, strength: 38, defense: 14, moves: ["meatyCharge(1)", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,1)"] },
        6: { level: "6", magic: 0, constitution: 103, strength: 44, defense: 16, moves: ["meatyCharge(2)", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,1)"] },
        7: { level: "7", magic: 0, constitution: 118, strength: 50, defense: 19, moves: ["meatyCharge(2)", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(100,2)"] },
        8: { level: "8", magic: 0, constitution: 133, strength: 56, defense: 22, moves: ["meatyCharge(2)", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(125,2)"] },
        9: { level: "9", magic: 0, constitution: 148, strength: 62, defense: 25, moves: ["meatyCharge(2)", "slash", "bellowAndSing(2,1)", "block", "screamAndCharge(125,2)"] },
        10: { level: "10", magic: 0, constitution: 163, strength: 68, defense: 28, moves: ["meatyCharge(2)", "slash", "bellowAndSing(2,2)", "block", "screamAndCharge(125,2)"] }
      },
      warhog: {
        1: { level: "1", magic: 0, constitution: 135, strength: 42, defense: 31, moves: ["swordWack", "rustyPokeHigh", "slash", "block", "startlingSpook(3,3)"] }
      },
      bosshogJurgen: {
        default: { level: "default", magic: 0, constitution: 300, strength: 60, defense: 50, moves: ["jurgenBellyFlop", "jurgenRollAround", "block", "jurgenSitUpon", "jurgenStampSnort"] }
      },
      mimic: {
        1: { level: "1", magic: 0, constitution: 40, strength: 9, defense: 8, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        2: { level: "2", magic: 0, constitution: 80, strength: 18, defense: 12, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        3: { level: "3", magic: 0, constitution: 120, strength: 27, defense: 16, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        4: { level: "4", magic: 0, constitution: 160, strength: 36, defense: 20, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        5: { level: "5", magic: 0, constitution: 200, strength: 45, defense: 24, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        6: { level: "6", magic: 0, constitution: 240, strength: 54, defense: 28, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        7: { level: "7", magic: 0, constitution: 280, strength: 63, defense: 32, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        8: { level: "8", magic: 0, constitution: 320, strength: 72, defense: 36, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        9: { level: "9", magic: 0, constitution: 360, strength: 81, defense: 40, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] },
        10: { level: "10", magic: 0, constitution: 400, strength: 90, defense: 44, moves: ["mimicAttack", "chomp", "mimicInfectiousBite", "block", "grudge"] }
      },
      toadmaw: {
        default: { level: "default", magic: 0, constitution: 132, strength: 25, defense: 9, moves: ["hansBuffBlock", "hansMagicMissile", "hansGuards", "hansCurse", null] }
      },
      cultist: {
        default: { level: "default", magic: 0, constitution: 18, strength: 4, defense: 0, moves: [null, null, null, null, null] }
      },
      halfdan: {
        default: { level: "default", magic: 0, constitution: 250, strength: 25, defense: 20, moves: ["rest", "evisceratingSweep", "passiveBlockCmd", "ancientStrike", null] }
      },
      gnomeBandit: {
        1: { level: "1", strength: 5, magic: 0, defense: 2, constitution: 11, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        2: { level: "2", strength: 10, magic: 0, defense: 4, constitution: 22, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        3: { level: "3", strength: 15, magic: 0, defense: 6, constitution: 33, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        4: { level: "4", strength: 20, magic: 0, defense: 8, constitution: 44, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        5: { level: "5", strength: 25, magic: 0, defense: 10, constitution: 55, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        6: { level: "6", strength: 30, magic: 0, defense: 12, constitution: 66, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        7: { level: "7", strength: 35, magic: 0, defense: 14, constitution: 77, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        8: { level: "8", strength: 40, magic: 0, defense: 16, constitution: 88, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        9: { level: "9", strength: 45, magic: 0, defense: 18, constitution: 99, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] },
        10: { level: "10", strength: 50, magic: 0, defense: 20, constitution: 110, moves: ["gnomeBomb", "bucketOfBangSnaps", "fireCracker", "block"] }
      },
      gnomeProspector: {
        1: { level: 1, strength: 5, magic: 0, defense: 2, constitution: 13, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        2: { level: 2, strength: 10, magic: 0, defense: 4, constitution: 26, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        3: { level: 3, strength: 15, magic: 0, defense: 6, constitution: 39, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        4: { level: 4, strength: 20, magic: 0, defense: 8, constitution: 52, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        5: { level: 5, strength: 25, magic: 0, defense: 10, constitution: 65, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        6: { level: 6, strength: 30, magic: 0, defense: 12, constitution: 78, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        7: { level: 7, strength: 35, magic: 0, defense: 14, constitution: 91, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        8: { level: 8, strength: 40, magic: 0, defense: 16, constitution: 104, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        9: { level: 9, strength: 45, magic: 0, defense: 18, constitution: 117, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] },
        10: { level: 10, strength: 50, magic: 0, defense: 20, constitution: 130, moves: ["yodel", "demolitionCharge", "gnomeBomb", "block"] }
      },
      gnomeBigBomber: {
        1: { level: 1, strength: 5, magic: 0, defense: 4, constitution: 12, moves: ["bigBomb1", "bigBomb2", "block"] },
        2: { level: 2, strength: 10, magic: 0, defense: 8, constitution: 24, moves: ["bigBomb1", "bigBomb2", "block"] },
        3: { level: 3, strength: 15, magic: 0, defense: 12, constitution: 36, moves: ["bigBomb1", "bigBomb2", "block"] },
        4: { level: 4, strength: 20, magic: 0, defense: 16, constitution: 48, moves: ["bigBomb1", "bigBomb2", "block"] },
        5: { level: 5, strength: 25, magic: 0, defense: 20, constitution: 60, moves: ["bigBomb1", "bigBomb2", "block"] },
        6: { level: 6, strength: 30, magic: 0, defense: 24, constitution: 72, moves: ["bigBomb1", "bigBomb2", "block"] },
        7: { level: 7, strength: 35, magic: 0, defense: 28, constitution: 84, moves: ["bigBomb1", "bigBomb2", "block"] },
        8: { level: 8, strength: 40, magic: 0, defense: 32, constitution: 96, moves: ["bigBomb1", "bigBomb2", "block"] },
        9: { level: 9, strength: 45, magic: 0, defense: 36, constitution: 108, moves: ["bigBomb1", "bigBomb2", "block"] },
        10: { level: 10, strength: 50, magic: 0, defense: 40, constitution: 120, moves: ["bigBomb1", "bigBomb2", "block"] }
      },
      groghog: {
        1: { level: 1, strength: 4, magic: 0, defense: 7, constitution: 16, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        2: { level: 2, strength: 8, magic: 0, defense: 14, constitution: 32, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        3: { level: 3, strength: 12, magic: 0, defense: 21, constitution: 48, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        4: { level: 4, strength: 16, magic: 0, defense: 28, constitution: 64, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        5: { level: 5, strength: 20, magic: 0, defense: 35, constitution: 80, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        6: { level: 6, strength: 24, magic: 0, defense: 42, constitution: 96, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        7: { level: 7, strength: 28, magic: 0, defense: 49, constitution: 112, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        8: { level: 8, strength: 32, magic: 0, defense: 56, constitution: 128, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        9: { level: 9, strength: 36, magic: 0, defense: 63, constitution: 144, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] },
        10: { level: 10, strength: 40, magic: 0, defense: 70, constitution: 160, moves: ["hypnosis", "psychicBolt", "strike", "block", "spiritQuest"] }
      },
      warhogRaider: {
        1: { level: 1, strength: 4, magic: 0, defense: 8, constitution: 18, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        2: { level: 2, strength: 8, magic: 0, defense: 16, constitution: 36, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        3: { level: 3, strength: 12, magic: 0, defense: 24, constitution: 54, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        4: { level: 4, strength: 16, magic: 0, defense: 32, constitution: 72, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        5: { level: 5, strength: 20, magic: 0, defense: 40, constitution: 90, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        6: { level: 6, strength: 24, magic: 0, defense: 48, constitution: 108, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        7: { level: 7, strength: 28, magic: 0, defense: 56, constitution: 126, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        8: { level: 8, strength: 32, magic: 0, defense: 64, constitution: 144, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        9: { level: 9, strength: 36, magic: 0, defense: 72, constitution: 162, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] },
        10: { level: 10, strength: 40, magic: 0, defense: 80, constitution: 180, moves: ["snortinTime", "tummySlam", "bigBelly", "strike", "quickNap", "strike"] }
      },
      plaguehog: {
        1: { level: 1, strength: 4, magic: 0, defense: 9, constitution: 20, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        2: { level: 2, strength: 8, magic: 0, defense: 18, constitution: 40, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        3: { level: 3, strength: 12, magic: 0, defense: 27, constitution: 60, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        4: { level: 4, strength: 16, magic: 0, defense: 36, constitution: 80, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        5: { level: 5, strength: 20, magic: 0, defense: 45, constitution: 100, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        6: { level: 6, strength: 24, magic: 0, defense: 54, constitution: 120, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        7: { level: 7, strength: 28, magic: 0, defense: 63, constitution: 140, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        8: { level: 8, strength: 32, magic: 0, defense: 72, constitution: 160, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        9: { level: 9, strength: 36, magic: 0, defense: 81, constitution: 180, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] },
        10: { level: 10, strength: 40, magic: 0, defense: 90, constitution: 200, moves: ["violentSneeze", "surpriseAllergy", "strike", "parasiticNibble", "block"] }
      },
      frostHog: {
        1: { level: 1, strength: 7, magic: 0, defense: 10, constitution: 20, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        2: { level: 2, strength: 11, magic: 0, defense: 18, constitution: 40, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        3: { level: 3, strength: 15, magic: 0, defense: 26, constitution: 60, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        4: { level: 4, strength: 19, magic: 0, defense: 34, constitution: 80, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        5: { level: 5, strength: 23, magic: 0, defense: 42, constitution: 100, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        6: { level: 6, strength: 27, magic: 0, defense: 50, constitution: 120, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        7: { level: 7, strength: 31, magic: 0, defense: 58, constitution: 140, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        8: { level: 8, strength: 35, magic: 0, defense: 66, constitution: 160, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        9: { level: 9, strength: 39, magic: 0, defense: 74, constitution: 180, moves: ["roadClosure", "snowFort", "commonCold", "strike"] },
        10: { level: 10, strength: 43, magic: 0, defense: 82, constitution: 200, moves: ["roadClosure", "snowFort", "commonCold", "strike"] }
      }
    };
  }
});

// game/rulebook/rulebook.ts
function setRulebook(r) {
  rulebook = r;
}
function getRulebook() {
  return rulebook;
}
function getCurrentRawRulebookForMigration() {
  return rulebook;
}
function resetRulebook() {
  rulebook = defaultRulebook;
}
var dungeonLevels, defaultRulebook, rulebook;
var init_rulebook = __esm({
  "game/rulebook/rulebook.ts"() {
    "use strict";
    init_code();
    init_battle();
    init_npcStatsMapByLevel();
    dungeonLevels = [
      { name: "Skelepit Dungeon", num: 0, modifier: 1 },
      { name: "Hooligans Bluff", num: 1, modifier: 1 },
      { name: "The Matcha Caves", num: 2, modifier: 2 },
      { name: "Fort Skeleton", num: 3, modifier: 3 },
      {
        name: "The Ninth Trash Hole of Hell",
        num: 4,
        modifier: 5
      }
    ];
    defaultRulebook = {
      version: rulebookVersion,
      name: "default",
      npcStatsMapByLevel,
      playerCharacterStatsMap,
      dungeonLevels,
      stanceTypeMetaMap,
      dungeonTemplates,
      roomOptions
    };
    rulebook = defaultRulebook;
    __name(setRulebook, "setRulebook");
    __name(getRulebook, "getRulebook");
    __name(getCurrentRawRulebookForMigration, "getCurrentRawRulebookForMigration");
    __name(resetRulebook, "resetRulebook");
  }
});

// game/rulebook/cardDefinitionsMap.ts
var basicMagicAttackBase, basicAttackBase, blockBase, cardDefinitionsMap;
var init_cardDefinitionsMap = __esm({
  "game/rulebook/cardDefinitionsMap.ts"() {
    "use strict";
    basicMagicAttackBase = {
      name: "Magic Attack",
      energy: 1,
      targetNum: 1,
      targetType: "enemies",
      actions: "deal(magic)",
      type: "attack"
    };
    basicAttackBase = {
      name: "Attack",
      energy: 1,
      targetNum: 1,
      targetType: "enemies",
      actions: "deal(strength)",
      type: "attack"
    };
    blockBase = {
      name: "Shield",
      energy: 1,
      targetNum: 1,
      targetType: "friends",
      actions: "addBlock(defense)",
      type: "defense"
    };
    cardDefinitionsMap = {
      leadRazor: {
        name: "Lead Razor",
        id: "leadRazor",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: 'strengthy = strength * .2; chain(deal(strengthy), effect("bleed", 2), effect("poisoned", 5), effect("fatigued", 1))',
        type: "attack",
        characterClass: "rogue"
      },
      shieldOfHolyLight: {
        name: "Shield of Holy Light",
        energy: 1,
        id: "shieldOfHolyLight",
        targetNum: 1,
        targetType: "friends",
        actions: `magicaldefensey = magic * 0.5 + defense; addBlock(magicaldefensey)`,
        type: "defense",
        characterClass: "cleric"
      },
      sweepTheLeg: {
        name: "Sweep The Leg",
        energy: 2,
        id: "sweepTheLeg",
        targetNum: 1,
        targetType: "enemies",
        actions: `strength1 = strength * 1.6;
            chain(
                deal(strength1),
                effect("debilitated",3),
                effect("unguarded", 1)
            )`,
        type: "attack",
        characterClass: "knight"
      },
      bodySlam: {
        name: "Shield Bash",
        energy: 1,
        id: "bodySlam",
        targetNum: 1,
        targetType: "enemies",
        actions: 'chain(deal(block), "(equal to block)")',
        type: "attack",
        characterClass: "cleric"
      },
      jab: {
        name: "Jab",
        energy: 0,
        id: "jab",
        targetNum: 1,
        targetType: "enemies",
        actions: "strengthy = strength * .5; deal(strengthy)",
        type: "attack",
        characterClass: "bard"
      },
      zap: {
        name: "Zap!",
        energy: 2,
        id: "zap",
        targetNum: -1,
        targetType: "allEnemies",
        actions: 'magical = magic * .4; chain(deal(magical), effect("vulnerable", 1))',
        type: "enchantment",
        characterClass: "wizard"
      },
      flashBang: {
        name: "Flash Bang",
        energy: 2,
        id: "flashBang",
        targetNum: 1,
        targetType: "enemies",
        actions: `chain(
            effect("stunned", 1, "enemies"),
            effect("debilitated", 1, "allEnemies"),
            effect("vulnerable", 1, "allEnemies"),
            momentary()
        )`,
        type: "utility",
        characterClass: "rogue"
      },
      orbOfLightning: {
        name: "Orb of Lightning",
        energy: 1,
        id: "orbOfLightning",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(orb("lightning", 3), momentary())',
        type: "enchantment",
        characterClass: "wizard"
      },
      orbOfProtection: {
        name: "Orb of Protection",
        energy: 1,
        id: "orbOfProtection",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(orb("protection", 3), momentary())',
        type: "enchantment",
        characterClass: "wizard"
      },
      basicAttackWizard: {
        ...basicMagicAttackBase,
        id: "basicAttackWizard",
        characterClass: "wizard"
      },
      basicAttackBard: {
        ...basicMagicAttackBase,
        id: "basicAttackBard",
        characterClass: "bard"
      },
      magicRitual: {
        name: "Magic Ritual",
        energy: 0,
        id: "magicRitual",
        targetNum: 0,
        targetType: "self",
        actions: "chain(addEnergy(2), momentary())",
        type: "utility",
        characterClass: "wizard"
      },
      chainLightning: {
        name: "Chain Lightning",
        energy: 2,
        id: "chainLightning",
        targetNum: 3,
        targetType: "enemies",
        actions: "magical = 0.75 * magic; deal(magical, 3)",
        type: "attack",
        characterClass: "wizard"
      },
      spellBook: {
        name: "Spell Book",
        energy: 2,
        id: "spellBook",
        targetNum: 0,
        targetType: "self",
        actions: "chain(addEnergyPerRound(1), momentary())",
        type: "enchantment",
        characterClass: "wizard"
      },
      fireball: {
        name: "Fireball",
        energy: 2,
        id: "fireball",
        targetNum: 1,
        targetType: "enemies",
        actions: "magical = magic * 2.5; deal(magical)",
        type: "attack",
        characterClass: "wizard"
      },
      scatterBrained: {
        name: "Scatter Brained",
        energy: 1,
        id: "scatterBrained",
        targetNum: 0,
        targetType: "self",
        actions: "draw(3)",
        type: "utility",
        characterClass: "wizard"
      },
      trance: {
        name: "Trance",
        energy: 1,
        id: "trance",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(effect("entranced", 5), momentary())',
        type: "utility",
        characterClass: "wizard"
      },
      orbOfFrost: {
        name: "Orb of Frost",
        energy: 1,
        id: "orbOfFrost",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(orb("frost", 3), momentary())',
        type: "enchantment",
        characterClass: "wizard"
      },
      basicAttackKnight: {
        ...basicAttackBase,
        id: "basicAttackKnight",
        characterClass: "knight"
      },
      basicAttackCleric: {
        ...basicAttackBase,
        id: "basicAttackCleric",
        characterClass: "cleric"
      },
      basicAttackRogue: {
        ...basicAttackBase,
        id: "basicAttackRogue",
        characterClass: "rogue"
      },
      blockKnight: {
        ...blockBase,
        id: "blockKnight",
        characterClass: "knight"
      },
      blockCleric: {
        ...blockBase,
        id: "blockCleric",
        characterClass: "cleric"
      },
      blockRogue: {
        ...blockBase,
        id: "blockRogue",
        characterClass: "rogue"
      },
      blockWizard: {
        ...blockBase,
        id: "blockWizard",
        characterClass: "wizard"
      },
      blockBard: {
        ...blockBase,
        id: "blockBard",
        characterClass: "bard"
      },
      swordSlash: {
        name: "Sword Slash",
        energy: 1,
        id: "swordSlash",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            strengthy = 0.4 * strength;
            defensey = defense * 0.25;
            chain(
                deal(strengthy),
                effect("bleed", 3),
                addBlock(defensey, "self")
            )
        `,
        type: "attack",
        characterClass: "knight"
      },
      parry: {
        name: "Parry",
        energy: 1,
        id: "parry",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = 0.75 * strength;
            defensey = defense * 0.55;
            chain(
                deal(strengthy),
                addBlock(defensey, "self"),
                effect("guarded", 1, "self")
            )
        `,
        type: "attack",
        characterClass: "knight"
      },
      berserk: {
        name: "Berserk",
        energy: 1,
        id: "berserk",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(effect("berserk",3), momentary())',
        type: "enchantment",
        characterClass: "rogue"
      },
      patientAmbush: {
        name: "Patient Ambush",
        energy: 1,
        id: "patientAmbush",
        targetNum: 1,
        targetType: "enemies",
        actions: 'ifStance("avoidant", queue(1, strengthy = strength * 2; dealFromStance("avoidant", strengthy)))',
        type: "attack",
        characterClass: "rogue"
      },
      stab: {
        name: "Stab",
        energy: 1,
        id: "stab",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = strength + 1;
            chain(deal(strengthy), effect("bleed", 2))
        `,
        type: "attack",
        characterClass: "rogue"
      },
      catchTheKnife: {
        name: "Catch The Knife",
        energy: 1,
        id: "catchTheKnife",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                modifyStats("damageDealAddend", "-999", "turn"),
                brittle(3)
            );
            "Every time target enemy attacks this turn, change the damage value of their attacks to 1.  <b>Brittle&nbsp(3)</b>"
        `,
        type: "utility",
        characterClass: "rogue"
      },
      poisonedBlade: {
        name: "Poisoned Blade",
        energy: 1,
        id: "poisonedBlade",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthmagic1 = (strength * 0.25) + (magic * 0.25);
            chain(deal(strengthmagic1), effect("poisoned", 5))
        `,
        type: "utility",
        characterClass: "rogue"
      },
      dutifulStab: {
        name: "Dutiful Stab",
        energy: 1,
        id: "dutifulStab",
        targetNum: 1,
        targetType: "enemies",
        actions: 'chain(deal(strength), effect("debilitated",1))',
        type: "attack",
        characterClass: "knight"
      },
      charge: {
        name: "Charge",
        energy: 2,
        id: "charge",
        targetNum: 1,
        targetType: "enemies",
        actions: 'strength1 = strength * 2; chain(deal(strength1), effect("vulnerable", 2))',
        type: "attack",
        characterClass: "knight"
      },
      testudoFormation: {
        name: "Testudo Formation",
        energy: 1,
        id: "testudoFormation",
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defense1 = 0.75 * defense;
            ifStance(
                "avoidant",
                chain(
                    addBlock(defense1),
                    effect("strongblock", 2)
                )
            )`,
        type: "defense",
        characterClass: "knight"
      },
      guidingBolt: {
        name: "Guiding Bolt",
        energy: 2,
        id: "guidingBolt",
        targetNum: 1,
        targetType: "enemies",
        actions: 'magical = magic * 2.25; chain(deal(magical), effect("unguarded", 4))',
        type: "attack",
        characterClass: "cleric"
      },
      gnomeBomb: {
        name: "Gnome Bomb",
        energy: 0,
        id: "gnomeBomb",
        targetNum: 1,
        targetType: "enemies",
        actions: "strengthymagical = strength * .5 + magic * .5; chain(deal(strengthymagical), dwindle())",
        type: "attack",
        characterClass: "rogue"
      },
      smite: {
        name: "Smite",
        energy: 1,
        id: "smite",
        targetNum: 1,
        targetType: "enemies",
        actions: "smite(magic, defense)",
        type: "attack",
        characterClass: "cleric"
      },
      bless: {
        name: "Bless",
        energy: 1,
        id: "bless",
        targetNum: -1,
        targetType: "allFriends",
        actions: `chain(
            effect("courageous", 2, "allFriends"),
            effect("strongblock", 2, "allFriends")
        )`,
        type: "defense",
        characterClass: "cleric"
      },
      psychicWarfare: {
        name: "Psychic Warfare",
        energy: 0,
        id: "psychicWarfare",
        targetNum: 1,
        targetType: "enemies",
        actions: "magical1 = magic * .75; magical2 = magic * .33; chain(psychicWarfare(magical1,magical2), dwindle())",
        type: "attack",
        characterClass: "wizard"
      },
      orbOfHolyLight: {
        name: "Orb of Holy Light",
        energy: 2,
        id: "orbOfHolyLight",
        targetNum: 0,
        targetType: "self",
        actions: 'chain(orb("holyLight", 3), momentary())',
        type: "enchantment",
        characterClass: "cleric"
      },
      mantraOfPatience: {
        name: "Mantra of Patience",
        energy: 1,
        id: "mantraOfPatience",
        targetNum: 0,
        targetType: "self",
        actions: `chain(
            draw(1),
            queue(1, addEnergy(1)),
            drawSizeChange(2),
            momentary()
        )`,
        type: "utility",
        characterClass: "cleric"
      },
      helpingHand: {
        name: "Helping Hand",
        energy: 1,
        id: "helpingHand",
        targetNum: 1,
        targetType: "friends",
        actions: `
            chain(
                addBlock(defense),
                modifyStats("strength|magic", "3|3", "room")
            )`,
        type: "utility",
        characterClass: "cleric"
      },
      ancientVerse: {
        name: "Ancient Verse",
        energy: 0,
        id: "ancientVerse",
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            chain(
                modifyStats("strength|magic", "2|2", "room", "allFriends"),
                draw(1),
                dwindle()
            )`,
        type: "utility",
        characterClass: "cleric"
      },
      momentOfClarity: {
        name: "Moment Of Clarity",
        energy: 1,
        id: "momentOfClarity",
        targetNum: 1,
        targetType: "friends",
        actions: `
            defensey = 0.75 * defense;
            chain(
                removeAllDebuffs(),
                modifyStats("strength|magic", "6|6", "turn"),
                addBlock(defensey),
                momentary()
            )`,
        type: "utility",
        characterClass: "cleric"
      },
      enchantedStrike: {
        name: "Enchanted Strike",
        energy: 1,
        id: "enchantedStrike",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            magicy1 = 0.75 * magic;
            strengthymagicy = 0.75 * magic + 0.6 * strength;
            chain(
                deal(strengthymagicy),
                modifyStats("magic", magicy1, "turn", "self")
            )`,
        type: "attack",
        characterClass: "cleric"
      },
      songOfTheBrazen: {
        name: "Song of the Brazen",
        energy: 0,
        id: "songOfTheBrazen",
        targetNum: 1,
        targetType: "friends",
        actions: `
            strengthy1 = strength * .45;
            magicy1 = magic * .45;
            strengthy2 = strength * .3;
            magicy2 = magic * .3;
            chain(
                ifStanceElse(
                    "aggressive",
                    modifyStats(
                        "strength|magic",
                        "" + strengthy1 + "|" + magicy1,
                        "turn",
                        "friends"
                    ),
                    modifyStats(
                        "strength|magic",
                        "" + strengthy2 + "|" + magicy2,
                        "turn",
                        "friends"
                    )
                ),
                draw(1),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "bard"
      },
      songOfGoodHealth: {
        name: "Song of Good Health",
        energy: 1,
        id: "songOfGoodHealth",
        targetNum: 1,
        targetType: "friends",
        actions: `
            strengthmagicdefense1 = (0.5 * strength) + (0.5 * magic) + (0.25 * defense);
            magic1 = 0.4 * magic;
            chain(
                addBlock(strengthmagicdefense1),
                heal(magic1),
                brittle(4)
            )`,
        type: "defense",
        characterClass: "bard"
      },
      songOfTheWarrior: {
        name: "Song of the Warrior",
        energy: 1,
        id: "songOfTheWarrior",
        targetNum: 1,
        targetType: "friends",
        actions: `
            strengthy1 = strength;
            strengthy2 = 0.65 * strength;
            chain(
                modifyStats("strength", strengthy1, "turn"),
                addBlock(strengthy2),
                momentary()
            )`,
        type: "utility",
        characterClass: "bard"
      },
      songOfWizardry: {
        name: "Song of Wizardry",
        energy: 1,
        id: "songOfWizardry",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicy1 = magic;
            magicy2 = 0.75 * magic;
            chain(
                modifyStats("magic", magicy1, "turn"),
                addBlock(magicy2),
                momentary()
            )`,
        type: "utility",
        characterClass: "bard"
      },
      songOfTheHuntsman: {
        name: "Song of the Huntsman",
        energy: 2,
        id: "songOfTheHuntsman",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                effect("stunned",1),
                effect("vulnerable",2),
                discardRandom(2),
                momentary()
            )`,
        type: "utility",
        characterClass: "bard"
      },
      songOfFortitude: {
        name: "Song of Fortitude",
        energy: 1,
        id: "songOfFortitude",
        targetNum: 1,
        targetType: "friends",
        actions: `
            defenseymagicy = 0.5 * defense + 0.5 * magic;
            chain(
                addBlock(defenseymagicy),
                effect("guarded",1),
                effect("fatigued",1,"allEnemies"),
                momentary()
            )
        `,
        type: "defense",
        characterClass: "bard"
      },
      songOfSilence: {
        name: "Song of Silence",
        energy: 1,
        id: "songOfSilence",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                effect("unguarded", 2),
                effect("debilitated",2),
                effect("fatigued",1),
                effect("targeted",1),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "bard"
      },
      rapidFireBolts: {
        name: "Rapid Fire Bolts",
        energy: 1,
        id: "rapidFireBolts",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            strengthy = 0.5 * strength;
            deal(strengthy)
        `,
        type: "attack",
        characterClass: "bard"
      },
      swissArmyWand: {
        name: "Swiss Army Wand",
        energy: 1,
        id: "swissArmyWand",
        targetNum: 0,
        targetType: "self",
        actions: `
            defenseymagicy = 0.25 * defense + 0.5 * magic;
            magicy = 0.25 * magic;
            chain(
                draw(2),
                discard(1),
                addBlock(defenseymagicy),
                modifyStats("magic", magicy, "turn")
            )
        `,
        type: "utility",
        characterClass: "wizard"
      },
      warStomp: {
        name: "War Stomp",
        energy: 1,
        id: "warStomp",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            strengthy = 0.5 * strength;
            chain(
                deal(strengthy),
                effect("tired",1)
            )
            `,
        type: "attack",
        characterClass: "warhog"
      },
      magicalTrebuchet: {
        name: "Magical Trebuchet",
        energy: 1,
        id: "magicalTrebuchet",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            magicy= 1.25 * magic;
            ifStance("avoidant", dealFromStance("avoidant",magicy))
        `,
        type: "attack",
        characterClass: "wizard"
      },
      tubularCellWall: {
        name: "Tubular Cell Wall",
        energy: 1,
        id: "tubularCellWall",
        targetNum: 1,
        targetType: "friends",
        actions: `
            defensey = 0.75 * defense;
            defenseymagicy = 0.5 * defense + 0.25 * magic;
            chain(
                addBlock(defensey),
                addBlock(defenseymagicy, "self")
            ),
        `,
        type: "attack",
        characterClass: "mushroomFarmer"
      },
      cultivate: {
        name: "Cultivate",
        energy: 0,
        id: "cultivate",
        targetNum: 0,
        targetType: "self",
        actions: `
            chain(
                draw(1),
                discard(1),
                addEnergy(1)
            )
        `,
        type: "utility",
        characterClass: "mushroomFarmer"
      },
      sleepyTimeSpores: {
        name: "Sleepy Time Spores",
        energy: 1,
        id: "sleepyTimeSpores",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            addEffect(fatigue,1)
            `,
        type: "utility",
        characterClass: "mushroomFarmer"
      },
      valiantJab: {
        name: "Valiant Jab",
        energy: 1,
        id: "valiantJab",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                deal(strength),
                effect("unguarded", 1)
            )
        `,
        type: "attack",
        characterClass: "penguinKnight"
      },
      featheredFortress: {
        name: "Feathered Fortress",
        energy: 1,
        id: "featheredFortress",
        targetNum: 0,
        targetType: "self",
        actions: `
            chain(
                addBlock(defense),
                effect("strongBlock", 2),
                ifStance("neutral", effect("guarded",1))
            )
        `,
        type: "defense",
        characterClass: "penguinKnight"
      },
      hedgedBet: {
        name: "Hedged Bet",
        energy: 1,
        id: "hedgedBet",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthymagicy = 0.5 * strength + 0.5 * magic;
            chain(
                deal(strengthymagicy),
                addBlock(defense, "self"),
                draw(1),
                discard(1)
            )
        `,
        type: "attack",
        characterClass: "snacky"
      },
      compulsiveGambler: {
        name: "Compulsive Gambler",
        energy: 0,
        id: "compulsiveGambler",
        targetNum: 0,
        targetType: "self",
        actions: `
            chain(
                draw(3),
                discard(2)
            )
        `,
        type: "utility",
        characterClass: "snacky"
      },
      youGottaStealMoneyToMakeMoney: {
        name: "You Gotta Steal Money to Make Money",
        energy: 1,
        id: "youGottaStealMoneyToMakeMoney",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthymagicy = 0.15 * magic + 0.1 * strength;
            handSizey = strengthymagicy * handSize;
            chain(
                deal(handSizey),
                draw(2),
                dwindle()
            )
            `,
        type: "attack",
        characterClass: "snacky"
      },
      jerryIsEternal: {
        name: "Jerry Is Eternal",
        energy: 1,
        id: "jerryIsEternal",
        targetNum: 0,
        targetType: "self",
        actions: `
            chain(
                addBlock(magic),
                effect("guarded",1),
                effect("trance",2)
            )
        `,
        type: "defense",
        characterClass: "jerry"
      },
      itIsWeakToJerry: {
        name: "It is Weak to Jerry",
        energy: 1,
        id: "itIsWeakToJerry",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                effect("debilitated",1),
                effect("unguarded",1),
                dwindle()
            )
        `,
        type: "attack",
        characterClass: "jerry"
      },
      slipperyLittleGuy: {
        name: "Slippery Little Guy",
        energy: 0,
        id: "slipperyLittleGuy",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                deal(strength),
                setStance("neutral", "self"),
                dwindle(1)
            )
            `,
        type: "attack",
        characterClass: "frogKnight"
      },
      smallButStoic: {
        name: "Small But Stoic",
        energy: 0,
        id: "smallButStoic",
        targetNum: 0,
        targetType: "self",
        actions: `
            defensey = 0.5 * defense;
            chain(
                removeAllDebuffs(),
                addBlock(defensey),
                draw(1)
            )
            `,
        type: "utility",
        characterClass: "frogKnight"
      },
      bellyFlop: {
        name: "Belly Flop",
        energy: 1,
        id: "bellyFlop",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            defense1 = 0.6 * defense;
            chain(
                deal(defense),
                addBlock(defense1, "self")
            )
        `,
        type: "attack",
        characterClass: "warhog"
      },
      screechOfTheBean: {
        name: "Screech of the B.E.A.N.",
        energy: 1,
        id: "screechOfTheBean",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            strengthy = 0.5 * strength;
            chain(
                deal(strengthy),
                discardRandom(1)
            )
            `,
        type: "attack",
        characterClass: "notoriousBean"
      },
      magicShield: {
        name: "Magic Shield",
        energy: 1,
        id: "magicShield",
        targetNum: 1,
        targetType: "friends",
        actions: `
            defenseymagicy = 0.5 * defense + 0.75 * magic;
            addBlock(defenseymagicy)
        `,
        type: "defense",
        characterClass: "wizard"
      },
      huntedByTheBean: {
        name: "Hunted by the Bean",
        energy: 1,
        id: "huntedByTheBean",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                effect("vulnerable",2),
                effect("bleed",4),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "notoriousBean"
      },
      beanNeverMisses: {
        name: "B.E.A.N. Never Misses",
        energy: 1,
        id: "beanNeverMisses",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = 1.2 * strength;
            deal(strengthy, "piercing")
        `,
        type: "attack",
        characterClass: "notoriousBean"
      },
      hope: {
        name: "Hope",
        energy: 0,
        id: "hope",
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defensey = 0.1 * defense;
            chain(
                addBlock(defensey),
                draw(2),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "bard"
      },
      songOfClarity: {
        name: "Song of Clarity",
        energy: 1,
        id: "songOfClarity",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicky = 0.3 * magic;
            chain(
                removeAllDebuffs(),
                heal(magicky),
                effect("brave",1),
                effect("guarded",1),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "bard"
      },
      dummyBomb: {
        name: "Dummy Bomb",
        energy: -1,
        id: "dummyBomb",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            explain("If this card is discarded before the end of your turn, deal ", strength, " to all enemies. <b>Momentary</b>")
        `,
        on: {
          discard: "deal(strength); momentary()"
        },
        type: "attack",
        characterClass: "rogue"
      },
      twistTheKnife: {
        name: "Twist The Knife",
        energy: 1,
        id: "twistTheKnife",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthx = 1.2 * strength;
            strengthy = 2 * strength;
            chain(
                ifHealthUnder(50, deal(strengthy), deal(strengthx)),
                effect("bleed", 1)
            )
        `,
        type: "attack",
        characterClass: "rogue"
      },
      retreatToTheShadows: {
        name: "Retreat to the Shadows",
        energy: 0,
        id: "retreatToTheShadows",
        targetNum: 0,
        targetType: "self",
        actions: `
            chain(
                setStance("avoidant"),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "rogue"
      },
      crimeAlwaysPays: {
        name: "Crime Always Pays",
        energy: 1,
        id: "crimeAlwaysPays",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = 0.2 * strength;
            chain(
                deal(strengthy * handSize),
                explain("(hand size * ", strengthy, ")")
            )
        `,
        type: "attack",
        characterClass: "rogue"
      },
      declarationOfPeace: {
        name: "Declaration of Peace",
        energy: 2,
        id: "declarationOfPeace",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            chain(
                effect("debilitated",1),
                addBlock(defense, "self")
            )
        `,
        type: "utility",
        characterClass: "cleric"
      },
      prayerOfGoodHealth: {
        name: "Prayer of Good Health",
        energy: 0,
        id: "prayerOfGoodHealth",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magic1 = 0.9 * magic;
            chain(
                heal(magic1),
                brittle(3)
            )
        `,
        type: "utility",
        characterClass: "cleric"
      },
      fellTheMighty: {
        name: "Fell the Mighty",
        energy: 1,
        id: "fellTheMighty",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            constitution1 = targetConstitution / 2;
            chain(
                deal(constitution1),
                brittle(1)
            );
            "Deal 50% of the target's max HP.
<b>Brittle (1)</b>"`,
        type: "attack",
        characterClass: "cleric"
      },
      hypnotized: {
        name: "Hypnotized",
        energy: -1,
        id: "hypnotized",
        targetNum: 0,
        targetType: "self",
        actions: `"You have been hypnotized!
This card cannot be played"`,
        type: "utility",
        characterClass: "groghog"
      },
      burnIncense: {
        name: "Burn Incense",
        energy: -1,
        id: "burnIncense",
        targetNum: 0,
        targetType: "self",
        on: {
          discard: "addEnergy(1)"
        },
        actions: `"This card cannot be played. If this card is discarded before the end of your turn, gain 1 energy"`,
        type: "utility",
        characterClass: "cleric"
      },
      retreat: {
        name: "Retreat",
        energy: 1,
        id: "retreat",
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defense1 = 0.5 * defense;
            chain(
                addBlock(defense1),
                setStance("avoidant", "self"),
                discard(1)
            )`,
        type: "defense",
        characterClass: "knight"
      },
      bigLunge: {
        name: "Big Lunge",
        energy: 1,
        id: "bigLunge",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = 1.8 * strength;
            chain(
                deal(strengthy),
                effect("tired", 1, "self"),
                effect("unguarded", 1, "self"),
                setStance("aggressive", "self"),
                discard(1)
            )`,
        type: "attack",
        characterClass: "knight"
      },
      hammerThrow: {
        name: "Hammer Throw",
        energy: 2,
        id: "hammerThrow",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            chain(
                deal(strength),
                effect("stunned",1),
                brittle(2)
            )
        `,
        type: "utility",
        characterClass: "knight"
      },
      killingBlow: {
        name: "Killing Blow",
        energy: 2,
        id: "killingBlow",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = 2.2 * strength;
            ifKilled(
                deal(strengthy),
                addEnergy(1)
            )`,
        type: "attack",
        characterClass: "knight"
      },
      cleave: {
        name: "Cleave",
        energy: 1,
        id: "cleave",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            strengthy = 0.6 * strength;
            chain(
                ifStance("aggressive", deal(strengthy)),
                dwindle(1)
            )
            `,
        type: "attack",
        characterClass: "knight"
      },
      whirlingBladesOfDeath: {
        name: "Whirling Blades of Death",
        energy: 1,
        id: "whirlingBladesOfDeath",
        targetNum: 0,
        targetType: "self",
        actions: `
            strengthy = 0.4 * strength;
            chain(
                addBlock(defense),
                effect("reflect", strengthy)
            )`,
        type: "defense",
        characterClass: "knight"
      },
      gargantuanGnomeBomb: {
        name: "Gargantuan Gnome Bomb",
        energy: 0,
        id: "gargantuanGnomeBomb",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthymagicy = 0.65 * magic + 0.75 * strength;
            chain(
                deal(strengthymagicy),
                brittle(3)
            )
            `,
        type: "attack",
        characterClass: "gnomeHooligan"
      },
      tinyKleptomaniac: {
        name: "Tiny Kleptomaniac",
        energy: 0,
        id: "tinyKleptomaniac",
        targetNum: -1,
        targetType: "friends",
        actions: `
            chain(
                draw(3),
                discard(2),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "gnomeHooligan"
      },
      barterWithTheUnderworld: {
        name: "Barter With The Underworld",
        energy: 1,
        id: "barterWithTheUnderworld",
        targetNum: -1,
        targetType: "allEnemies",
        actions: `
            magicy = magic * .15;
            chain(
                deal(magicy * discardPileSize),
                explain(magicy, "* discard pile size")
            )
        `,
        type: "attack",
        characterClass: "wizard"
      },
      blindingLight: {
        name: "Blinding Light",
        energy: 1,
        id: "blindingLight",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicydefensey = magic * .5 + defense * .5;
            chain(
                modifyStats("damageTakeAddend", "-" + magicydefensey, "turn"),
                dwindle()
            );
            join("All attacks that target this character deal", magicydefensey, "less damage until the end of the turn.  <b>Dwindle</b>")
        `,
        type: "defense",
        characterClass: "cleric"
      },
      emergencySnack: {
        name: "Emergency Snack",
        energy: 1,
        id: "emergencySnack",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicydefensey = magic * 2.5 + defense;
            chain(heal(magicydefensey), brittle(1))
        `,
        type: "utility",
        characterClass: "cleric"
      },
      aPlanYearsInTheMaking: {
        name: "A Plan Years in The Making",
        energy: 1,
        id: "aPlanYearsInTheMaking",
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = strength * 4;
            ifStance(
                "avoidant",
                queue(
                    3,
                    strengthy = strength * 4;
                    ifKilled(
                        dealFromStance("avoidant", strengthy),
                        effect("emboldened", 1, "allFriends")
                    )
                )
            );
            join("This card can only be played if this character is in <b>Avoidant Stance</b>.<br/>In 3 turns, deal", strengthy, "to target enemy.  If that enemy dies as a result of this attack, all friendly Kaiju gain <b>Emboldened&nbsp(1)</b>")
        `,
        type: "attack",
        characterClass: "rogue"
      },
      thereThereLittleBuddy: {
        name: "There There, Little Buddy",
        energy: 1,
        id: "thereThereLittleBuddy",
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicy = magic * .5;
            defensey = defense * 1.25;
            chain(
                heal(magicy),
                addBlock(defensey),
                modifyStats("strength|magic", "2|1", "room"),
                removeAllDebuffs(),
                momentary()
            );
            join("Target character heals for", magicy, "and gains", defensey, "block.  They also receive +2 Strength and +1 Magic until the end of the room.  Remove all debuffs from that character.  <b>Momentary</b>")
        `,
        type: "utility",
        characterClass: "cleric"
      },
      divineIntervention: {
        name: "Divine Intervention",
        energy: 1,
        id: "divineIntervention",
        targetNum: 1,
        targetType: "friends",
        actions: `
          modifyStats("damageTakeMultiplicand", "0", "turn");
          "Target character can only lose a maximum of one health this turn"
        `,
        type: "utility",
        characterClass: "cleric"
      },
      wishingWell: {
        id: "wishingWell",
        name: "Wishing Well",
        energy: 1,
        targetNum: 1,
        targetType: "friends",
        actions: `
            magicy = 1.25 * magic;
            chain(addBlock(magicy), draw(2))
        `,
        type: "defense",
        characterClass: "cleric"
      },
      prayerofTheSponge: {
        id: "prayerofTheSponge",
        name: "Prayer of The Sponge",
        energy: 1,
        targetNum: 1,
        targetType: "friends",
        actions: `
            on("beforeDamageTaken", magicy = magic * .75; heal(magicy), "turn");
            draw(1);
            momentary();
            magicy = magic * .75;
            join("Every time target Kaiju takes unblocked damage this turn, heal them for", magicy)
        `,
        type: "utility",
        characterClass: "cleric"
      },
      shieldofDuplicity: {
        id: "shieldofDuplicity",
        name: "Shield of Duplicity",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            addBlock(targetBlock);
            "Gain block equal to target block"
        `,
        type: "defense",
        characterClass: "cleric"
      },
      theBestDefense: {
        id: "theBestDefense",
        name: "The Best Defense...",
        energy: 1,
        targetNum: 1,
        targetType: "friends",
        actions: `
            on("playAttackCard", addBlock(defense), "turn");
            join("Every time you play an attack card this turn, target character gains", defense, "block")
        `,
        type: "utility",
        characterClass: "cleric"
      },
      tinyBandAid: {
        id: "tinyBandAid",
        name: "Tiny Band-Aid",
        energy: 1,
        targetNum: 1,
        targetType: "friends",
        actions: `
            chain(
                on("playCard", magicy = magic * .25; heal(magicy)),
                momentary()
            );
            magicy = magic * .25;
            join("Every time you play a card this turn, heal target character for", magicy, "<b>Momentary</b>")
        `,
        type: "utility",
        characterClass: "cleric"
      },
      cowardlyTactics: {
        id: "cowardlyTactics",
        name: "Cowardly Tactics",
        energy: 0,
        targetNum: 0,
        targetType: "self",
        actions: `
                effect("cowardlyTactics", 1);
                "If this character is in Avoidant Stance, until the end of the turn they do not suffer the 25% less damage penalty for doing so"
            `,
        type: "utility",
        characterClass: "rogue"
      },
      dodge: {
        id: "dodge",
        name: "Dodge",
        energy: 2,
        targetNum: 0,
        targetType: "self",
        actions: `
                chain(
                    modifyStats("damageTakeAddend", "-999", "turn"),
                    brittle(2)
                );
                "Prevent all damage that would be done to this character until the end of the turn"
            `,
        type: "defense",
        characterClass: "rogue"
      },
      exponentialIllness: {
        id: "exponentialIllness",
        name: "Exponential Illness",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            dealCounterTimes("poisoned", 3)
        `,
        type: "utility",
        characterClass: "rogue"
      },
      glassCannon: {
        id: "glassCannon",
        name: "Glass Cannon",
        energy: 0,
        targetNum: 0,
        targetType: "self",
        actions: `
            if(
                stance === "aggressive" && block === 0,
                chain(
                    modifyStats("strength|magic", ""+strength+"|"+magic, "turn"),
                    effect("vulnerable", 1)
                )
            )
        `,
        type: "utility",
        characterClass: "rogue"
      },
      mutuallyAssuredDestruction: {
        id: "mutuallyAssuredDestruction",
        name: "Mutually Assured Destruction",
        energy: 1,
        targetNum: 0,
        targetType: "self",
        actions: `
            effect("mutuallyAssuredDestruction", 1);
            "For every unblocked point of damage this character takes this turn, deal 2 damage to the enemy that targeted them"
        `,
        type: "utility",
        characterClass: "rogue"
      },
      throwingKnife: {
        id: "throwingKnife",
        name: "Throwing Knife",
        energy: 0,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = strength * .5;
            ifKilled(
                deal(strengthy),
                on(
                    "playCard",
                    returnThisCardToHand(),
                    "once"
                )
            );
            join("deal", strengthy, "damage to enemy target<br/>If target dies, then return this card to your hand")
        `,
        type: "attack",
        characterClass: "rogue"
      },
      surpriseAllergy: {
        id: "surpriseAllergy",
        name: "Surprise Allergy",
        energy: 0,
        targetNum: 1,
        targetType: "enemies",
        actions: `
                effect("poisoned", 5, "enemies", "orDouble")
            `,
        type: "utility",
        characterClass: "rogue"
      },
      pocketSand: {
        id: "pocketSand",
        name: "Pocket Sand",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = strength * .33;
            chain(
                effect("debilitated", 1),
                deal(strengthy, null, "allEnemies"),
                draw(1),
                discard(1)
            )
        `,
        type: "attack",
        characterClass: "rogue"
      },
      aSlowDeath: {
        id: "aSlowDeath",
        name: "A Slow Death",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthymagicy = strength * .30 + magic * .25;
            chain(
                effect("poison", strengthymagicy),
                effect("bleed", 5)
            )
        `,
        type: "attack",
        characterClass: "rogue"
      },
      theHighwayman: {
        id: "theHighwayman",
        name: "The Highwayman",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
                ifKilled(
    deal(strength),
    chain(
        draw(2),
        discard(1),
        addEnergy(1)
    )
    )
            `,
        type: "attack",
        characterClass: "rogue"
      },
      bargainBin: {
        id: "bargainBin",
        name: "Bargain Bin",
        energy: 0,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
                chain(
    discard(2),
    addEnergy(1)
    )
            `,
        type: "utility",
        characterClass: "rogue"
      },
      scopedKnife: {
        id: "scopedKnife",
        name: "Scoped Knife",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
                strengthy = strength * .5;
    chain(
    deal(strengthy),
    effect("targeted", 99),
    momentary()
    )
            `,
        type: "attack",
        characterClass: "rogue"
      },
      annihilationMode: {
        id: "annihilationMode",
        name: "Annihilation Mode",
        energy: 1,
        targetNum: 0,
        targetType: "self",
        actions: `
            strengthy = strength * 1.5;
            chain(
                modifyStats("strength", ""+strengthy, "turn"),
                effect("berserk", 1),
                draw(1)
            )
        `,
        type: "utility",
        characterClass: "knight"
      },
      counterAttack: {
        id: "counterAttack",
        name: "Counter Attack",
        energy: 0,
        targetNum: 0,
        targetType: "self",
        actions: `
            strengthy = strength * 0.75;
            chain(
                effect("counterAttack", strengthy),
                dwindle()
            );
            join("Whenever this character is attacked by an enemy this turn, deal", strengthy, "to the enemy who attacked them.  <b>Dwindle</b>")
            `,
        type: "utility",
        characterClass: "knight"
      },
      juggernaught: {
        id: "juggernaught",
        name: "Juggernaught",
        energy: 0,
        targetNum: 0,
        targetType: "self",
        actions: `
                chain(
    effect("keepBlock", 1),
    dwindle()
    );
    "Block this character gains this turn lasts until the end of your following turn.  <b>Dwindle</b>"
            `,
        type: "utility",
        characterClass: "knight"
      },
      whiteKnuckledBloodGrip: {
        id: "whiteKnuckledBloodGrip",
        name: "White Knuckled Blood Grip",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
                strengthyToSelf = strength * .5;
    strengthy = strength * 2;
    chain(
    deal(strengthy),
    deal(strengthyToSelf, null, "self")
    )
            `,
        type: "attack",
        characterClass: "knight"
      },
      executionersAxe: {
        id: "executionersAxe",
        name: "Executioner's Axe",
        energy: 1,
        targetNum: 1,
        targetType: "enemies",
        actions: `
            strengthy = strength * 1.25;
            strengthIncrease = strength * .5;
            ifKilled(
                deal(strengthy),
                modifyStats("strength", ""+strengthIncrease, "room", "self")
            )
        `,
        type: "attack",
        characterClass: "knight"
      },
      wedgeFormation: {
        id: "wedgeFormation",
        name: "Wedge Formation",
        energy: 0,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defensey = defense;
            strength1 = strength * .2;
            strength2 = strength * .4;
            magic1 = magic * .2;
            magic2 = magic * .4;
            if(allStancesDifferent, chain(
                ifTargetStance("aggressive", addBlock(defensey)),
                ifTargetStance("neutral", modifyStats("strength|magic", "" + strength1 + "|" + magic1, "turn")),
                ifTargetStance("avoidant", modifyStats("strength|magic", "" + strength2 + "|" + magic2, "turn"))
            ));
            join(
                "<div style='font-size: .7em'>This card can only be played if all allies are in a different stance. Lock the stances of all allies.<br>Character in Aggressive Stance gains",
                defensey,
                "block.<br>Characters in Neutral Stance gain",
                strength1,
                "<b>Strength</b> and ",
                magic1,
                "<b>Magic</b> until the end of the turn.<br>Characters in Avoidant Stance gain",
                strength2,
                "<b>Strength</b> and",
                magic2,
                "<b>Magic</b> until the end of the turn</div>"
            )
        `,
        type: "utility",
        characterClass: "knight"
      },
      phalanx: {
        id: "phalanx",
        name: "Phalanx",
        energy: 0,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defensey = defense * .65;
            strengthy = strength * 0.25;
            magicy = magic * 0.25;
            if(allStancesSame, chain(
                addBlock(defensey),
                modifyStats("strength|magic", ""+ strengthy + "|" + magicy, "turn")
            ));
            join("This card can only be played if all allies are the same stance. Lock the stances of all allies. All characters gain", defensey, "block,", strengthy, "Strength and", magicy, "Magic until the end of the turn.")
            `,
        type: "utility",
        characterClass: "knight"
      },
      inspiringSpeech: {
        id: "inspiringSpeech",
        name: "Inspiring Speech",
        energy: 0,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            chain(
                modifyStats("strength|magic|defense", ""+strength*.5+"|"+magic*.5+"|"+defense*.25, "turn"),
                draw(1),
                momentary()
            )
        `,
        type: "utility",
        characterClass: "knight"
      },
      violenceHour: {
        id: "violenceHour",
        name: "Violence Hour",
        energy: 0,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            effect("vulnerable", 1, "allFriends");
            effect("vulnerable", 1, "allEnemies");
            "ALL characters gain <b>Vulnerable (1).</b>"
        `,
        type: "utility",
        characterClass: "knight"
      },
      barricade: {
        id: "barricade",
        name: "Barricade",
        energy: 1,
        targetNum: -1,
        targetType: "allFriends",
        actions: `
            defensey = defense * 0.4;
            defensey2 = defense * 0.2;
            addBlock(defensey, "allFriends");
            on("playCard", defensey2 = defense * 0.2; addBlock(defensey2, "allFriends"), "turn");
            join("All allies gain",defensey,"block.  Whenever a character plays a card this turn, allies gain", defensey2, "block.")
        `,
        type: "defense",
        characterClass: "knight"
      }
    };
  }
});

// game/rulebook/RulebookManager.ts
function loadRulebook(type = "default") {
  if (type !== "default") {
    try {
      const p = toPath(type);
      if ((0, import_fs2.existsSync)(p)) {
        const raw = JSON.parse((0, import_fs2.readFileSync)(p, "utf8"));
        return migrateRulebookIfNeeded(raw);
      }
    } catch {
    }
  }
  const rb = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook();
  return migrateRulebookIfNeeded(rb);
}
function migrateAllRulebooks(currentVersion, incomingPatches = patches) {
  const base = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook();
  let updatedBase = migrateRulebookIfNeeded({ ...base, version: currentVersion }, incomingPatches);
  const variantDefs = [
    { name: "world-default", fileKey: "world-default" },
    { name: "pvp-arena", fileKey: "pvp-arena" },
    { name: "daily", fileKey: "daily" }
  ];
  const variants = {};
  variantDefs.forEach((v) => {
    const vr = migrateRulebookIfNeeded({ ...base, name: v.name, version: currentVersion }, incomingPatches);
    variants[v.fileKey] = vr;
    try {
      (0, import_fs2.writeFileSync)(toPath(v.fileKey), stringifyRulebook(vr));
    } catch (e) {
    }
  });
  const validatedSaves = validateAllSaves(updatedBase, variants);
  const realCur = getRulebook ? stringifyRulebook(getRulebook()) : stringifyRulebook(updatedBase);
  const playerSave = { curRulebook: realCur };
  try {
    const patched = migratePlayerGamestateSave(playerSave);
    if (patched && patched.curRulebook && patched.curRulebook !== realCur) {
    }
  } catch {
  }
  setRulebook(updatedBase);
  try {
    (0, import_fs2.writeFileSync)(toPath("default"), stringifyRulebook(updatedBase));
  } catch {
  }
  return { updatedBase, updatedVariants: variants, validatedSaves };
}
function migrateRulebookIfNeeded(rb, activePatches = patches) {
  let current3 = { ...rb };
  const target = CURRENT_RULEBOOK_VERSION;
  if (current3.version === target)
    return current3;
  let changed = true;
  let guard = 0;
  while (current3.version !== target && guard++ < 10) {
    const applicable = activePatches.filter((p) => p.fromVersion === current3.version);
    if (applicable.length === 0) {
      current3 = { ...current3, version: target };
      break;
    }
    for (const p of applicable) {
      current3 = p.apply({ ...current3 });
      current3.version = p.toVersion;
    }
  }
  current3.savedAt = new Date().toISOString();
  return current3;
}
function validateAllSaves(base, variants) {
  const check = /* @__PURE__ */ __name((rb) => !!rb.version && !!rb.name && !!rb.playerCharacterStatsMap && Array.isArray(rb.dungeonLevels), "check");
  if (!check(base))
    return false;
  return Object.values(variants).every(check);
}
function ensureRulebooksMigrated() {
  const rb = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook();
  if (rb.version !== CURRENT_RULEBOOK_VERSION) {
    const res = migrateAllRulebooks(rb.version);
    return res.updatedBase;
  }
  return rb;
}
function migratePlayerGamestateSave(gamestate) {
  if (!gamestate || !gamestate.curRulebook)
    return gamestate;
  try {
    const parsed = JSON.parse(gamestate.curRulebook);
    if (parsed.version !== CURRENT_RULEBOOK_VERSION) {
      const migrated = migrateRulebookIfNeeded(parsed);
      gamestate.curRulebook = stringifyRulebook(migrated);
    }
  } catch {
  }
  return gamestate;
}
var import_fs2, CURRENT_RULEBOOK_VERSION, patches;
var init_RulebookManager = __esm({
  "game/rulebook/RulebookManager.ts"() {
    "use strict";
    init_rulebook();
    init_code();
    init_rulebookUtil();
    import_fs2 = require("fs");
    CURRENT_RULEBOOK_VERSION = rulebookVersion;
    patches = [];
    __name(loadRulebook, "loadRulebook");
    __name(migrateAllRulebooks, "migrateAllRulebooks");
    __name(migrateRulebookIfNeeded, "migrateRulebookIfNeeded");
    __name(validateAllSaves, "validateAllSaves");
    __name(ensureRulebooksMigrated, "ensureRulebooksMigrated");
    __name(migratePlayerGamestateSave, "migratePlayerGamestateSave");
  }
});

// game/rulebook/migrationStrategy.ts
var init_migrationStrategy = __esm({
  "game/rulebook/migrationStrategy.ts"() {
    "use strict";
    init_RulebookManager();
  }
});

// game/rulebook/index.ts
var rulebook_exports = {};
__export(rulebook_exports, {
  CURRENT_RULEBOOK_VERSION: () => CURRENT_RULEBOOK_VERSION,
  cardDefinitionsMap: () => cardDefinitionsMap,
  ensureRulebooksMigrated: () => ensureRulebooksMigrated,
  getRulebook: () => getRulebook,
  loadRulebook: () => loadRulebook,
  migrateAllRulebooks: () => migrateAllRulebooks,
  resetRulebook: () => resetRulebook,
  setRulebook: () => setRulebook
});
var init_rulebook2 = __esm({
  "game/rulebook/index.ts"() {
    "use strict";
    init_rulebook();
    init_cardDefinitionsMap();
    init_rulebook();
    init_RulebookManager();
    init_migrationStrategy();
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/thunk.js
var require_thunk = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/thunk.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Value = exports.create = void 0;
    function create(expr, context, inputLength, locals) {
      switch (expr.kind) {
        case "variable":
          return thunkVariable(expr, context, inputLength, locals);
        case "number":
          return thunkNumber(expr, context, inputLength);
        case "bool":
          return thunkBool(expr, context, inputLength);
        case "functioncall":
          return thunkFunctioncall(expr, context, inputLength, locals);
        case "string":
          return thunkString(expr, context, inputLength);
      }
    }
    __name(create, "create");
    exports.create = create;
    function thunkVariable(expr, context, inputLength, locals) {
      return new Value(inputLength, expr, function() {
        return locals && expr.name in locals ? locals[expr.name] : (context.scope || EMPTY)[expr.name];
      });
    }
    __name(thunkVariable, "thunkVariable");
    function thunkNumber(expr, _context, inputLength) {
      return new Value(inputLength, expr, function() {
        return expr.value;
      });
    }
    __name(thunkNumber, "thunkNumber");
    function thunkBool(expr, _context, inputLength) {
      return new Value(inputLength, expr, function() {
        return expr.value;
      });
    }
    __name(thunkBool, "thunkBool");
    function thunkString(expr, _context, inputLength) {
      return new Value(inputLength, expr, function() {
        return expr.value;
      });
    }
    __name(thunkString, "thunkString");
    function thunkFunctioncall(expr, context, inputLength, locals) {
      return new Value(inputLength, expr, function() {
        var fn = locals && expr.name in locals ? locals[expr.name] : (context.scope || EMPTY)[expr.name];
        if (typeof fn === "function") {
          try {
            return fn.apply({ context }, expr.args.map(function(arg) {
              return create(arg, context, inputLength, locals);
            }));
          } catch (e) {
            var err2 = {
              kind: "EVAL_THROW",
              expr,
              error: e
            };
            throw err2;
          }
        } else if (!fn) {
          var err2 = {
            kind: "FUNCTION_NOT_DEFINED",
            expr
          };
          throw err2;
        } else {
          var err2 = {
            kind: "NOT_A_FUNCTION",
            expr,
            value: fn
          };
          throw err2;
        }
      });
    }
    __name(thunkFunctioncall, "thunkFunctioncall");
    var Value = function() {
      function Value2(inputLength, expr, evaluateThunk) {
        this.inputLength = inputLength;
        this.expr = expr;
        this.evaluateThunk = evaluateThunk;
      }
      __name(Value2, "Value");
      Value2.prototype.eval = function() {
        return this.evaluateThunk();
      };
      Value2.prototype.kind = function() {
        return this.expr.kind;
      };
      Value2.prototype.pos = function() {
        var pos = this.expr.pos;
        var len = this.inputLength;
        return {
          start: len - pos.startLen,
          end: len - pos.endLen
        };
      };
      Value2.prototype.toString = function() {
        return stringifyExpr(this.expr);
      };
      Value2.prototype.name = function() {
        return nameOfExpr(this.expr);
      };
      return Value2;
    }();
    exports.Value = Value;
    function nameOfExpr(e) {
      switch (e.kind) {
        case "variable":
          return e.name;
        case "bool":
          return String(e.value);
        case "number":
          return e.string;
        case "string":
          return e.value;
        case "functioncall":
          return e.name;
      }
    }
    __name(nameOfExpr, "nameOfExpr");
    function stringifyExpr(e) {
      switch (e.kind) {
        case "variable":
          return e.name;
        case "bool":
          return String(e.value);
        case "number":
          return e.string;
        case "string":
          return stringifyString(e);
        case "functioncall":
          return stringifyFunctionCall(e);
      }
    }
    __name(stringifyExpr, "stringifyExpr");
    function stringifyFunctionCall(e) {
      if (e.infix) {
        if (e.args.length == 1) {
          return e.name + "(" + stringifyExpr(e.args[0]) + ")";
        } else {
          return "(" + stringifyExpr(e.args[0]) + " " + e.name + " " + stringifyExpr(e.args[1]) + ")";
        }
      } else {
        return e.name + "(" + e.args.map(stringifyExpr).join(", ") + ")";
      }
    }
    __name(stringifyFunctionCall, "stringifyFunctionCall");
    function stringifyString(e) {
      var s2 = e.value;
      return '"' + s2.replace(/(["\\])/g, "\\$1") + '"';
    }
    __name(stringifyString, "stringifyString");
    var EMPTY = {};
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/result.js
var require_result = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/result.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toOutputResult = exports.mapErr = exports.map = exports.isErr = exports.isOk = exports.err = exports.ok = void 0;
    function ok(value) {
      return { kind: "ok", value };
    }
    __name(ok, "ok");
    exports.ok = ok;
    function err2(value) {
      return { kind: "err", value };
    }
    __name(err2, "err");
    exports.err = err2;
    function isOk(result) {
      return result.kind === "ok";
    }
    __name(isOk, "isOk");
    exports.isOk = isOk;
    function isErr(result) {
      return result.kind === "err";
    }
    __name(isErr, "isErr");
    exports.isErr = isErr;
    function map(result, fn) {
      if (isOk(result)) {
        return ok(fn(result.value));
      } else {
        return result;
      }
    }
    __name(map, "map");
    exports.map = map;
    function mapErr(result, fn) {
      if (isErr(result)) {
        return err2(fn(result.value));
      } else {
        return result;
      }
    }
    __name(mapErr, "mapErr");
    exports.mapErr = mapErr;
    function toOutputResult(result) {
      var res = Object.create(resultMethods());
      res.kind = result.kind;
      res.value = result.value;
      return res;
    }
    __name(toOutputResult, "toOutputResult");
    exports.toOutputResult = toOutputResult;
    var resultMethods = /* @__PURE__ */ __name(function() {
      return {
        isOk: function() {
          return this.kind === "ok";
        },
        isErr: function() {
          return this.kind === "err";
        }
      };
    }, "resultMethods");
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/libparser.js
var require_libparser = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/libparser.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m2, k2, k22) {
      if (k22 === void 0)
        k22 = k2;
      Object.defineProperty(o, k22, { enumerable: true, get: function() {
        return m2[k2];
      } });
    } : function(o, m2, k2, k22) {
      if (k22 === void 0)
        k22 = k2;
      o[k22] = m2[k2];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result2 = {};
      if (mod != null) {
        for (var k2 in mod)
          if (k2 !== "default" && Object.hasOwnProperty.call(mod, k2))
            __createBinding(result2, mod, k2);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = void 0;
    var result = __importStar(require_result());
    var Parser = function() {
      function Parser2(_fn_) {
        this._fn_ = _fn_;
      }
      __name(Parser2, "Parser");
      Parser2.prototype.eval = function(input) {
        var res = this._fn_(input);
        return result.map(res, function(val) {
          return val.output;
        });
      };
      Parser2.prototype.parse = function(input) {
        return this._fn_(input);
      };
      Parser2.ok = function(val) {
        return new Parser2(function(input) {
          return result.ok({ output: val, rest: input });
        });
      };
      Parser2.anyChar = function() {
        return new Parser2(function(input) {
          if (input.length) {
            return result.ok({ output: input.slice(0, 1), rest: input.slice(1) });
          } else {
            return result.err({ kind: "EXPECTS_A_CHAR", input: "" });
          }
        });
      };
      Parser2.string = function() {
        return new Parser2(function(input) {
          var thisDelim = input[0];
          if (thisDelim !== '"' && thisDelim !== "'") {
            return result.err({
              kind: "EXPECTS_A_STRING",
              expectedOneOf: ['"', "'"],
              input
            });
          }
          var i = 1;
          var lastEscape = false;
          var s2 = "";
          while (i < input.length) {
            var char = input[i];
            if (!lastEscape && char === "\\") {
              lastEscape = true;
            } else if (!lastEscape && char === thisDelim) {
              return result.ok({ output: s2, rest: input.slice(i + 1) });
            } else {
              s2 += char;
              lastEscape = false;
            }
            i++;
          }
          return result.err({
            kind: "EXPECTS_A_CHAR",
            input: ""
          });
        });
      };
      Parser2.numberStr = function() {
        return new Parser2(function(input) {
          var idx = 0;
          var nStr = "";
          function nan() {
            return result.err({
              kind: "NOT_A_NUMBER",
              input
            });
          }
          __name(nan, "nan");
          function pushSign() {
            if (input[idx] === "+") {
              idx++;
            } else if (input[idx] === "-") {
              idx++;
              nStr += "-";
            }
          }
          __name(pushSign, "pushSign");
          function pushDigits() {
            var hasNumbers = false;
            var charCode = input.charCodeAt(idx);
            while (charCode >= 48 && charCode <= 57) {
              nStr += input[idx];
              idx++;
              hasNumbers = true;
              charCode = input.charCodeAt(idx);
            }
            return hasNumbers;
          }
          __name(pushDigits, "pushDigits");
          pushSign();
          var hasLeadingDigits = pushDigits();
          var hasDecimalPlaces = false;
          if (input[idx] === ".") {
            if (!hasLeadingDigits)
              nStr += "0";
            nStr += ".";
            idx++;
            if (!pushDigits()) {
              if (!hasLeadingDigits) {
                return nan();
              } else {
                return result.ok({
                  output: nStr.slice(0, -1),
                  rest: input.slice(idx - 1)
                });
              }
            }
            hasDecimalPlaces = true;
          }
          if (!hasLeadingDigits && !hasDecimalPlaces) {
            return nan();
          }
          var e = input[idx];
          if (e === "e" || e === "E") {
            var eIdx = idx;
            nStr += "e";
            idx++;
            pushSign();
            if (!pushDigits()) {
              idx = eIdx;
              nStr = nStr.slice(0, eIdx);
            }
          }
          return result.ok({
            output: nStr,
            rest: input.slice(idx)
          });
        });
      };
      Parser2.lazy = function(fn) {
        return new Parser2(function(input) {
          return fn().parse(input);
        });
      };
      Parser2.matchString = function() {
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          strings[_i] = arguments[_i];
        }
        return new Parser2(function(input) {
          for (var _i2 = 0, strings_1 = strings; _i2 < strings_1.length; _i2++) {
            var s2 = strings_1[_i2];
            if (input.slice(0, s2.length) === s2) {
              return result.ok({ output: s2, rest: input.slice(s2.length) });
            }
          }
          return result.err({ kind: "EXPECTS_A_STRING", expectedOneOf: strings, input });
        });
      };
      Parser2.takeWhileN = function(n, pat) {
        var fn = pat instanceof RegExp ? function(c) {
          return pat.test(c);
        } : typeof pat === "string" ? function(c) {
          return pat === c;
        } : pat;
        return new Parser2(function(input) {
          var i = 0;
          while (i < n && fn(input.charAt(i))) {
            i++;
          }
          return result.ok({ output: input.slice(0, i), rest: input.slice(i) });
        });
      };
      Parser2.takeWhile = function(pat) {
        return Parser2.takeWhileN(Infinity, pat);
      };
      Parser2.mustTakeWhileN = function(n, pat) {
        return new Parser2(function(input) {
          var res = Parser2.takeWhileN(n, pat).parse(input);
          if (result.isOk(res) && !res.value.output.length) {
            return result.err({ kind: "EXPECTS_PATTERN", expectedPattern: pat, input });
          } else {
            return res;
          }
        });
      };
      Parser2.mustTakeWhile = function(pat) {
        return Parser2.mustTakeWhileN(Infinity, pat);
      };
      Parser2.prototype.mapWithPosition = function(fn) {
        var _this = this;
        return new Parser2(function(input) {
          return result.map(_this.parse(input), function(val) {
            var startLen = input.length;
            var endLen = val.rest.length;
            return { output: fn(val.output, { startLen, endLen }), rest: val.rest };
          });
        });
      };
      Parser2.prototype.optional = function() {
        var _this = this;
        return new Parser2(function(input) {
          var res = _this.parse(input);
          if (result.isOk(res)) {
            return result.map(res, function(o) {
              return { output: result.ok(o.output), rest: o.rest };
            });
          } else {
            return result.ok({
              output: result.err(res.value),
              rest: input
            });
          }
        });
      };
      Parser2.prototype.map = function(fn) {
        var _this = this;
        return new Parser2(function(input) {
          return result.map(_this.parse(input), function(val) {
            return { output: fn(val.output), rest: val.rest };
          });
        });
      };
      Parser2.prototype.mapErr = function(fn) {
        var _this = this;
        return new Parser2(function(input) {
          return result.mapErr(_this.parse(input), function(err2) {
            return fn(err2);
          });
        });
      };
      Parser2.prototype.or = function(other) {
        var _this = this;
        return new Parser2(function(input) {
          var res1 = _this.parse(input);
          if (result.isErr(res1)) {
            return other.parse(input);
          } else {
            return res1;
          }
        });
      };
      Parser2.prototype.andThen = function(next) {
        var _this = this;
        return new Parser2(function(input) {
          var res1 = _this.parse(input);
          if (result.isOk(res1)) {
            return next(res1.value.output).parse(res1.value.rest);
          } else {
            return res1;
          }
        });
      };
      Parser2.prototype.sepBy = function(sep) {
        var _this = this;
        return new Parser2(function(input) {
          var results = [];
          var separators = [];
          var restOfInput = input;
          var res = _this.parse(restOfInput);
          if (result.isOk(res)) {
            results.push(res.value.output);
            restOfInput = res.value.rest;
          } else {
            return res;
          }
          while (true) {
            var sepRes = sep.parse(restOfInput);
            if (result.isErr(sepRes)) {
              break;
            }
            var res_1 = _this.parse(sepRes.value.rest);
            if (result.isErr(res_1)) {
              break;
            }
            separators.push(sepRes.value.output);
            results.push(res_1.value.output);
            restOfInput = res_1.value.rest;
          }
          return result.ok({
            output: { results, separators },
            rest: restOfInput
          });
        });
      };
      Parser2.prototype.mustSepBy = function(sep) {
        var _this = this;
        return new Parser2(function(input) {
          var res = _this.sepBy(sep).parse(input);
          if (result.isOk(res) && !res.value.output.separators.length) {
            return result.err({ kind: "EXPECTS_A_SEPARATOR", input });
          } else {
            return res;
          }
        });
      };
      return Parser2;
    }();
    exports.Parser = Parser;
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/parser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.token = exports.parenExpression = exports.functioncallExpression = exports.binaryOpExpression = exports.unaryOpExpression = exports.booleanExpression = exports.stringExpression = exports.numberExpression = exports.variableExpression = exports.binaryOpSubExpression = exports.anyExpression = exports.expression = void 0;
    var libparser_1 = require_libparser();
    var TOKEN_START_REGEX = /[a-zA-Z]/;
    var TOKEN_BODY_REGEX = /[a-zA-Z0-9_]/;
    var WHITESPACE_REGEX = /\s/;
    function expression(opts) {
      return anyExpression(opts).mapErr(function(e) {
        return { kind: "PARSE_ERROR", input: e.input };
      });
    }
    __name(expression, "expression");
    exports.expression = expression;
    function anyExpression(opts) {
      var exprParser = binaryOpExpression(opts).or(binaryOpSubExpression(opts));
      return ignoreWhitespace().andThen(function(_2) {
        return exprParser;
      }).andThen(function(e) {
        return ignoreWhitespace().map(function(_2) {
          return e;
        });
      });
    }
    __name(anyExpression, "anyExpression");
    exports.anyExpression = anyExpression;
    function binaryOpSubExpression(opts) {
      return parenExpression(opts).or(stringExpression()).or(functioncallExpression(opts)).or(numberExpression()).or(unaryOpExpression(opts)).or(booleanExpression()).or(variableExpression());
    }
    __name(binaryOpSubExpression, "binaryOpSubExpression");
    exports.binaryOpSubExpression = binaryOpSubExpression;
    function variableExpression() {
      return token().mapWithPosition(function(tok, pos) {
        return { kind: "variable", name: tok, pos };
      });
    }
    __name(variableExpression, "variableExpression");
    exports.variableExpression = variableExpression;
    function numberExpression() {
      return libparser_1.Parser.numberStr().mapWithPosition(function(n, pos) {
        return { kind: "number", value: Number(n), string: n, pos };
      });
    }
    __name(numberExpression, "numberExpression");
    exports.numberExpression = numberExpression;
    function stringExpression() {
      return libparser_1.Parser.string().mapWithPosition(function(s2, pos) {
        return { kind: "string", value: s2, pos };
      });
    }
    __name(stringExpression, "stringExpression");
    exports.stringExpression = stringExpression;
    function booleanExpression() {
      return libparser_1.Parser.matchString("true", "false").mapWithPosition(function(boolStr, pos) {
        return {
          kind: "bool",
          value: boolStr === "true" ? true : false,
          pos
        };
      });
    }
    __name(booleanExpression, "booleanExpression");
    exports.booleanExpression = booleanExpression;
    function unaryOpExpression(opts) {
      return op(opts.unaryOps).andThen(function(op2) {
        return anyExpression(opts).mapWithPosition(function(expr, pos) {
          return { kind: "functioncall", name: op2.value, args: [expr], infix: true, pos };
        });
      });
    }
    __name(unaryOpExpression, "unaryOpExpression");
    exports.unaryOpExpression = unaryOpExpression;
    function binaryOpExpression(opts) {
      var precedence = opts.precedence || {};
      var associativity = opts.associativity || {};
      var restOfNormalBinaryOp = op(opts.binaryOps).andThen(function(op2) {
        return ignoreWhitespace().map(function(_2) {
          return op2;
        });
      });
      var restOfStringBinaryOp = op(opts.binaryStringOps).andThen(function(op2) {
        return mustIgnoreWhitespace().map(function(_2) {
          return op2;
        });
      });
      var sep = ignoreWhitespace().andThen(function(wasSpace) {
        return wasSpace ? restOfNormalBinaryOp.or(restOfStringBinaryOp) : restOfNormalBinaryOp;
      });
      function highestPrecIdx(ops) {
        var bestP = 0;
        var bestIdx = -1;
        var bestLastIdx = -1;
        for (var i = 0; i < ops.length; i++) {
          var curr = ops[i];
          var currP = precedence[curr.value] || (curr.isOp ? 0 : Infinity);
          if (bestIdx < 0 || currP > bestP) {
            bestP = currP;
            bestIdx = i;
            bestLastIdx = i;
          } else if (currP === bestP && bestLastIdx - 1 === i) {
            bestLastIdx = i;
          }
        }
        return [bestIdx, bestLastIdx];
      }
      __name(highestPrecIdx, "highestPrecIdx");
      function getIdxFromAssociativity(startIdx, endIdx, ops) {
        var assoc = "";
        for (var i = startIdx; i <= endIdx; i++) {
          if (!assoc) {
            assoc = associativity[ops[i].value] || "left";
          } else if (assoc !== associativity[ops[i].value]) {
            throw new Error("This should not be possible: adjacent operators have mixed associativity");
          }
        }
        return assoc === "left" ? startIdx : endIdx;
      }
      __name(getIdxFromAssociativity, "getIdxFromAssociativity");
      return binaryOpSubExpression(opts).mustSepBy(sep).map(function(_a) {
        var results = _a.results, separators = _a.separators;
        while (separators.length) {
          var _b = highestPrecIdx(separators), firstIdx = _b[0], lastIdx = _b[1];
          var idx = getIdxFromAssociativity(firstIdx, lastIdx, separators);
          var op_1 = separators.splice(idx, 1)[0];
          var left = results[idx];
          var right = results[idx + 1];
          var expr = {
            kind: "functioncall",
            name: op_1.value,
            args: [left, right],
            infix: true,
            pos: { startLen: left.pos.startLen, endLen: right.pos.endLen }
          };
          results.splice(idx, 2, expr);
        }
        return results[0];
      });
    }
    __name(binaryOpExpression, "binaryOpExpression");
    exports.binaryOpExpression = binaryOpExpression;
    function functioncallExpression(opts) {
      return libparser_1.Parser.lazy(function() {
        var name;
        var sep = ignoreWhitespace().andThen(function(_2) {
          return libparser_1.Parser.matchString(",");
        }).andThen(function(_2) {
          return ignoreWhitespace();
        });
        return token().andThen(function(n) {
          name = n;
          return libparser_1.Parser.matchString("(");
        }).andThen(function(_2) {
          return anyExpression(opts).sepBy(sep).optional().map(function(maybe) {
            return maybe.kind === "ok" ? maybe.value.results : [];
          });
        }).andThen(function(r) {
          return ignoreWhitespace().andThen(function(_2) {
            return libparser_1.Parser.matchString(")");
          }).map(function(_2) {
            return r;
          });
        }).mapWithPosition(function(args, pos) {
          return { kind: "functioncall", name, args, infix: false, pos };
        });
      });
    }
    __name(functioncallExpression, "functioncallExpression");
    exports.functioncallExpression = functioncallExpression;
    function parenExpression(opts) {
      return libparser_1.Parser.lazy(function() {
        var expr;
        return libparser_1.Parser.matchString("(").andThen(function(_2) {
          return ignoreWhitespace();
        }).andThen(function(_2) {
          return anyExpression(opts);
        }).andThen(function(e) {
          expr = e;
          return ignoreWhitespace();
        }).andThen(function(_2) {
          return libparser_1.Parser.matchString(")");
        }).map(function(_2) {
          return expr;
        });
      });
    }
    __name(parenExpression, "parenExpression");
    exports.parenExpression = parenExpression;
    function token() {
      return libparser_1.Parser.lazy(function() {
        var s2 = "";
        return libparser_1.Parser.mustTakeWhile(TOKEN_START_REGEX).andThen(function(r) {
          s2 += r;
          return libparser_1.Parser.takeWhile(TOKEN_BODY_REGEX);
        }).andThen(function(r) {
          s2 += r;
          return libparser_1.Parser.ok(s2);
        });
      });
    }
    __name(token, "token");
    exports.token = token;
    function op(opList) {
      return libparser_1.Parser.matchString.apply(
        libparser_1.Parser,
        opList
      ).map(function(s2) {
        return { value: s2, isOp: true };
      });
    }
    __name(op, "op");
    function ignoreWhitespace() {
      return libparser_1.Parser.takeWhile(WHITESPACE_REGEX).map(function(s2) {
        return !!s2.length;
      });
    }
    __name(ignoreWhitespace, "ignoreWhitespace");
    function mustIgnoreWhitespace() {
      return libparser_1.Parser.mustTakeWhile(WHITESPACE_REGEX).map(function(_2) {
        return void 0;
      });
    }
    __name(mustIgnoreWhitespace, "mustIgnoreWhitespace");
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/errors.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s2, i = 1, n = arguments.length; i < n; i++) {
          s2 = arguments[i];
          for (var p in s2)
            if (Object.prototype.hasOwnProperty.call(s2, p))
              t[p] = s2[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toOutputError = void 0;
    function toOutputError(fullInput, error) {
      var start;
      var end;
      switch (error.kind) {
        case "PARSE_ERROR":
        case "NOT_CONSUMED_ALL":
          start = fullInput.length - error.input.length;
          end = start;
          return __assign(__assign({}, error), { pos: { start, end } });
        case "EVAL_THROW":
        case "FUNCTION_NOT_DEFINED":
        case "NOT_A_FUNCTION":
          start = fullInput.length - error.expr.pos.startLen;
          end = fullInput.length - error.expr.pos.endLen;
          return __assign(__assign({}, error), { pos: { start, end } });
      }
      neverHappens(error);
    }
    __name(toOutputError, "toOutputError");
    exports.toOutputError = toOutputError;
    function neverHappens(_2) {
      throw new Error("Cannot happen");
    }
    __name(neverHappens, "neverHappens");
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/context.js
var require_context = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/context.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toInternalContext = void 0;
    var parser_1 = require_parser();
    var OP_REGEX = /^[!£$%^&*@#~?<>|/+=;:.-]+$/;
    function toInternalContext(ctx) {
      if (isInternalContext(ctx))
        return ctx;
      var precedenceArray = ctx.precedence || [];
      var precedenceMap = {};
      var associativityMap = {};
      var precedenceValue = precedenceArray.length;
      for (var _i = 0, precedenceArray_1 = precedenceArray; _i < precedenceArray_1.length; _i++) {
        var rawEntry = precedenceArray_1[_i];
        var entry = Array.isArray(rawEntry) ? { ops: rawEntry } : rawEntry;
        var ops = entry.ops;
        var associativity = entry.associativity || "left";
        for (var _a = 0, ops_1 = ops; _a < ops_1.length; _a++) {
          var op = ops_1[_a];
          precedenceMap[op] = precedenceValue;
          associativityMap[op] = associativity;
        }
        precedenceValue--;
      }
      var scope = ctx.scope || {};
      var validUnaryOps = [];
      var validBinaryOps = [];
      var validBinaryStringOps = [];
      for (var key in scope) {
        var val = scope[key];
        if (typeof val !== "function") {
          continue;
        }
        var isOpChars = OP_REGEX.test(key);
        var isInPrecedenceMap = key in precedenceMap;
        var numberOfArgs = val.length;
        if (numberOfArgs === 2) {
          if (isOpChars)
            validBinaryOps.push(key);
          else if (isInPrecedenceMap)
            validBinaryStringOps.push(key);
        } else if (numberOfArgs === 1 && isOpChars) {
          validUnaryOps.push(key);
        }
      }
      validUnaryOps.sort(sortOps);
      validBinaryOps.sort(sortOps);
      validBinaryStringOps.sort(sortOps);
      var internalContext = {
        _internal_: true,
        precedence: precedenceMap,
        associativity: associativityMap,
        unaryOps: validUnaryOps,
        binaryOps: validBinaryOps,
        binaryStringOps: validBinaryStringOps,
        scope
      };
      internalContext.expressionParser = parser_1.expression(internalContext);
      return internalContext;
    }
    __name(toInternalContext, "toInternalContext");
    exports.toInternalContext = toInternalContext;
    function isInternalContext(ctx) {
      return ctx._internal_ === true;
    }
    __name(isInternalContext, "isInternalContext");
    function sortOps(a, b2) {
      return a.length > b2.length ? -1 : a.length < b2.length ? 1 : 0;
    }
    __name(sortOps, "sortOps");
  }
});

// node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/angu@0.12.0/node_modules/angu/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m2, k2, k22) {
      if (k22 === void 0)
        k22 = k2;
      Object.defineProperty(o, k22, { enumerable: true, get: function() {
        return m2[k2];
      } });
    } : function(o, m2, k2, k22) {
      if (k22 === void 0)
        k22 = k2;
      o[k22] = m2[k2];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k2 in mod)
          if (k2 !== "default" && Object.hasOwnProperty.call(mod, k2))
            __createBinding(result, mod, k2);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareContext = exports.evaluate = void 0;
    var thunk = __importStar(require_thunk());
    var parser = __importStar(require_parser());
    var errors = __importStar(require_errors());
    var result_1 = require_result();
    var context_1 = require_context();
    var thunk_1 = require_thunk();
    Object.defineProperty(exports, "Value", { enumerable: true, get: function() {
      return thunk_1.Value;
    } });
    function evaluate2(input, context, locals) {
      var internalCtx = context_1.toInternalContext(context);
      return result_1.toOutputResult(doEvaluate(input, internalCtx, locals));
    }
    __name(evaluate2, "evaluate");
    exports.evaluate = evaluate2;
    function doEvaluate(input, internalCtx, locals) {
      var parsed = internalCtx.expressionParser ? internalCtx.expressionParser.parse(input) : parser.expression(internalCtx).parse(input);
      if (!result_1.isOk(parsed)) {
        return result_1.mapErr(parsed, function(e2) {
          return errors.toOutputError(input, e2);
        });
      }
      if (parsed.value.rest.length) {
        var e = { kind: "NOT_CONSUMED_ALL", input: parsed.value.rest };
        return result_1.err(errors.toOutputError(input, e));
      }
      try {
        var value = thunk.create(parsed.value.output, internalCtx, input.length, locals);
        return result_1.ok(value.eval());
      } catch (e2) {
        return result_1.err(e2);
      }
    }
    __name(doEvaluate, "doEvaluate");
    function prepareContext(context) {
      return context_1.toInternalContext(context);
    }
    __name(prepareContext, "prepareContext");
    exports.prepareContext = prepareContext;
  }
});

// node_modules/.pnpm/color_library@0.0.2/node_modules/color_library/index.js
var require_color_library = __commonJS({
  "node_modules/.pnpm/color_library@0.0.2/node_modules/color_library/index.js"(exports, module2) {
    var colorLibrary = {
      html: [
        { name: "AliceBlue", rgb: { "r": 240, "g": 248, "b": 255 } },
        { name: "AntiqueWhite", rgb: { "r": 250, "g": 235, "b": 215 } },
        { name: "Aqua", rgb: { "r": 0, "g": 255, "b": 255 } },
        { name: "Aquamarine", rgb: { "r": 127, "g": 255, "b": 212 } },
        { name: "Azure", rgb: { "r": 240, "g": 255, "b": 255 } },
        { name: "Beige", rgb: { "r": 245, "g": 245, "b": 220 } },
        { name: "Bisque", rgb: { "r": 255, "g": 228, "b": 196 } },
        { name: "Black", rgb: { "r": 0, "g": 0, "b": 0 } },
        { name: "BlanchedAlmond", rgb: { "r": 255, "g": 235, "b": 205 } },
        { name: "Blue", rgb: { "r": 0, "g": 0, "b": 255 } },
        { name: "BlueViolet", rgb: { "r": 138, "g": 43, "b": 226 } },
        { name: "Brown", rgb: { "r": 165, "g": 42, "b": 42 } },
        { name: "BurlyWood", rgb: { "r": 222, "g": 184, "b": 135 } },
        { name: "CadetBlue", rgb: { "r": 95, "g": 158, "b": 160 } },
        { name: "Chartreuse", rgb: { "r": 127, "g": 255, "b": 0 } },
        { name: "Chocolate", rgb: { "r": 210, "g": 105, "b": 30 } },
        { name: "Coral", rgb: { "r": 255, "g": 127, "b": 80 } },
        { name: "CornflowerBlue", rgb: { "r": 100, "g": 149, "b": 237 } },
        { name: "Cornsilk", rgb: { "r": 255, "g": 248, "b": 220 } },
        { name: "Crimson", rgb: { "r": 220, "g": 20, "b": 60 } },
        { name: "Cyan", rgb: { "r": 0, "g": 255, "b": 255 } },
        { name: "DarkBlue", rgb: { "r": 0, "g": 0, "b": 139 } },
        { name: "DarkCyan", rgb: { "r": 0, "g": 139, "b": 139 } },
        { name: "DarkGoldenRod", rgb: { "r": 184, "g": 134, "b": 11 } },
        { name: "DarkGray", rgb: { "r": 169, "g": 169, "b": 169 } },
        { name: "DarkGrey", rgb: { "r": 169, "g": 169, "b": 169 } },
        { name: "DarkGreen", rgb: { "r": 0, "g": 100, "b": 0 } },
        { name: "DarkKhaki", rgb: { "r": 189, "g": 183, "b": 107 } },
        { name: "DarkMagenta", rgb: { "r": 139, "g": 0, "b": 139 } },
        { name: "DarkOliveGreen", rgb: { "r": 85, "g": 107, "b": 47 } },
        { name: "DarkOrange", rgb: { "r": 255, "g": 140, "b": 0 } },
        { name: "DarkOrchid", rgb: { "r": 153, "g": 50, "b": 204 } },
        { name: "DarkRed", rgb: { "r": 139, "g": 0, "b": 0 } },
        { name: "DarkSalmon", rgb: { "r": 233, "g": 150, "b": 122 } },
        { name: "DarkSeaGreen", rgb: { "r": 143, "g": 188, "b": 143 } },
        { name: "DarkSlateBlue", rgb: { "r": 72, "g": 61, "b": 139 } },
        { name: "DarkSlateGray", rgb: { "r": 47, "g": 79, "b": 79 } },
        { name: "DarkSlateGrey", rgb: { "r": 47, "g": 79, "b": 79 } },
        { name: "DarkTurquoise", rgb: { "r": 0, "g": 206, "b": 209 } },
        { name: "DarkViolet", rgb: { "r": 148, "g": 0, "b": 211 } },
        { name: "DeepPink", rgb: { "r": 255, "g": 20, "b": 147 } },
        { name: "DeepSkyBlue", rgb: { "r": 0, "g": 191, "b": 255 } },
        { name: "DimGray", rgb: { "r": 105, "g": 105, "b": 105 } },
        { name: "DimGrey", rgb: { "r": 105, "g": 105, "b": 105 } },
        { name: "DodgerBlue", rgb: { "r": 30, "g": 144, "b": 255 } },
        { name: "FireBrick", rgb: { "r": 178, "g": 34, "b": 34 } },
        { name: "FloralWhite", rgb: { "r": 255, "g": 250, "b": 240 } },
        { name: "ForestGreen", rgb: { "r": 34, "g": 139, "b": 34 } },
        { name: "Fuchsia", rgb: { "r": 255, "g": 0, "b": 255 } },
        { name: "Gainsboro", rgb: { "r": 220, "g": 220, "b": 220 } },
        { name: "GhostWhite", rgb: { "r": 248, "g": 248, "b": 255 } },
        { name: "Gold", rgb: { "r": 255, "g": 215, "b": 0 } },
        { name: "GoldenRod", rgb: { "r": 218, "g": 165, "b": 32 } },
        { name: "Gray", rgb: { "r": 128, "g": 128, "b": 128 } },
        { name: "Grey", rgb: { "r": 128, "g": 128, "b": 128 } },
        { name: "Green", rgb: { "r": 0, "g": 128, "b": 0 } },
        { name: "GreenYellow", rgb: { "r": 173, "g": 255, "b": 47 } },
        { name: "HoneyDew", rgb: { "r": 240, "g": 255, "b": 240 } },
        { name: "HotPink", rgb: { "r": 255, "g": 105, "b": 180 } },
        { name: "IndianRed ", rgb: { "r": 205, "g": 92, "b": 92 } },
        { name: "Indigo ", rgb: { "r": 75, "g": 0, "b": 130 } },
        { name: "Ivory", rgb: { "r": 255, "g": 255, "b": 240 } },
        { name: "Khaki", rgb: { "r": 240, "g": 230, "b": 140 } },
        { name: "Lavender", rgb: { "r": 230, "g": 230, "b": 250 } },
        { name: "LavenderBlush", rgb: { "r": 255, "g": 240, "b": 245 } },
        { name: "LawnGreen", rgb: { "r": 124, "g": 252, "b": 0 } },
        { name: "LemonChiffon", rgb: { "r": 255, "g": 250, "b": 205 } },
        { name: "LightBlue", rgb: { "r": 173, "g": 216, "b": 230 } },
        { name: "LightCoral", rgb: { "r": 240, "g": 128, "b": 128 } },
        { name: "LightCyan", rgb: { "r": 224, "g": 255, "b": 255 } },
        { name: "LightGoldenRodYellow", rgb: { "r": 250, "g": 250, "b": 210 } },
        { name: "LightGray", rgb: { "r": 211, "g": 211, "b": 211 } },
        { name: "LightGrey", rgb: { "r": 211, "g": 211, "b": 211 } },
        { name: "LightGreen", rgb: { "r": 144, "g": 238, "b": 144 } },
        { name: "LightPink", rgb: { "r": 255, "g": 182, "b": 193 } },
        { name: "LightSalmon", rgb: { "r": 255, "g": 160, "b": 122 } },
        { name: "LightSeaGreen", rgb: { "r": 32, "g": 178, "b": 170 } },
        { name: "LightSkyBlue", rgb: { "r": 135, "g": 206, "b": 250 } },
        { name: "LightSlateGray", rgb: { "r": 119, "g": 136, "b": 153 } },
        { name: "LightSlateGrey", rgb: { "r": 119, "g": 136, "b": 153 } },
        { name: "LightSteelBlue", rgb: { "r": 176, "g": 196, "b": 222 } },
        { name: "LightYellow", rgb: { "r": 255, "g": 255, "b": 224 } },
        { name: "Lime", rgb: { "r": 0, "g": 255, "b": 0 } },
        { name: "LimeGreen", rgb: { "r": 50, "g": 205, "b": 50 } },
        { name: "Linen", rgb: { "r": 250, "g": 240, "b": 230 } },
        { name: "Magenta", rgb: { "r": 255, "g": 0, "b": 255 } },
        { name: "Maroon", rgb: { "r": 128, "g": 0, "b": 0 } },
        { name: "MediumAquaMarine", rgb: { "r": 102, "g": 205, "b": 170 } },
        { name: "MediumBlue", rgb: { "r": 0, "g": 0, "b": 205 } },
        { name: "MediumOrchid", rgb: { "r": 186, "g": 85, "b": 211 } },
        { name: "MediumPurple", rgb: { "r": 147, "g": 112, "b": 219 } },
        { name: "MediumSeaGreen", rgb: { "r": 60, "g": 179, "b": 113 } },
        { name: "MediumSlateBlue", rgb: { "r": 123, "g": 104, "b": 238 } },
        { name: "MediumSpringGreen", rgb: { "r": 0, "g": 250, "b": 154 } },
        { name: "MediumTurquoise", rgb: { "r": 72, "g": 209, "b": 204 } },
        { name: "MediumVioletRed", rgb: { "r": 199, "g": 21, "b": 133 } },
        { name: "MidnightBlue", rgb: { "r": 25, "g": 25, "b": 112 } },
        { name: "MintCream", rgb: { "r": 245, "g": 255, "b": 250 } },
        { name: "MistyRose", rgb: { "r": 255, "g": 228, "b": 225 } },
        { name: "Moccasin", rgb: { "r": 255, "g": 228, "b": 181 } },
        { name: "NavajoWhite", rgb: { "r": 255, "g": 222, "b": 173 } },
        { name: "Navy", rgb: { "r": 0, "g": 0, "b": 128 } },
        { name: "OldLace", rgb: { "r": 253, "g": 245, "b": 230 } },
        { name: "Olive", rgb: { "r": 128, "g": 128, "b": 0 } },
        { name: "OliveDrab", rgb: { "r": 107, "g": 142, "b": 35 } },
        { name: "Orange", rgb: { "r": 255, "g": 165, "b": 0 } },
        { name: "OrangeRed", rgb: { "r": 255, "g": 69, "b": 0 } },
        { name: "Orchid", rgb: { "r": 218, "g": 112, "b": 214 } },
        { name: "PaleGoldenRod", rgb: { "r": 238, "g": 232, "b": 170 } },
        { name: "PaleGreen", rgb: { "r": 152, "g": 251, "b": 152 } },
        { name: "PaleTurquoise", rgb: { "r": 175, "g": 238, "b": 238 } },
        { name: "PaleVioletRed", rgb: { "r": 219, "g": 112, "b": 147 } },
        { name: "PapayaWhip", rgb: { "r": 255, "g": 239, "b": 213 } },
        { name: "PeachPuff", rgb: { "r": 255, "g": 218, "b": 185 } },
        { name: "Peru", rgb: { "r": 205, "g": 133, "b": 63 } },
        { name: "Pink", rgb: { "r": 255, "g": 192, "b": 203 } },
        { name: "Plum", rgb: { "r": 221, "g": 160, "b": 221 } },
        { name: "PowderBlue", rgb: { "r": 176, "g": 224, "b": 230 } },
        { name: "Purple", rgb: { "r": 128, "g": 0, "b": 128 } },
        { name: "RebeccaPurple", rgb: { "r": 102, "g": 51, "b": 153 } },
        { name: "Red", rgb: { "r": 255, "g": 0, "b": 0 } },
        { name: "RosyBrown", rgb: { "r": 188, "g": 143, "b": 143 } },
        { name: "RoyalBlue", rgb: { "r": 65, "g": 105, "b": 225 } },
        { name: "SaddleBrown", rgb: { "r": 139, "g": 69, "b": 19 } },
        { name: "Salmon", rgb: { "r": 250, "g": 128, "b": 114 } },
        { name: "SandyBrown", rgb: { "r": 244, "g": 164, "b": 96 } },
        { name: "SeaGreen", rgb: { "r": 46, "g": 139, "b": 87 } },
        { name: "SeaShell", rgb: { "r": 255, "g": 245, "b": 238 } },
        { name: "Sienna", rgb: { "r": 160, "g": 82, "b": 45 } },
        { name: "Silver", rgb: { "r": 192, "g": 192, "b": 192 } },
        { name: "SkyBlue", rgb: { "r": 135, "g": 206, "b": 235 } },
        { name: "SlateBlue", rgb: { "r": 106, "g": 90, "b": 205 } },
        { name: "SlateGray", rgb: { "r": 112, "g": 128, "b": 144 } },
        { name: "SlateGrey", rgb: { "r": 112, "g": 128, "b": 144 } },
        { name: "Snow", rgb: { "r": 255, "g": 250, "b": 250 } },
        { name: "SpringGreen", rgb: { "r": 0, "g": 255, "b": 127 } },
        { name: "SteelBlue", rgb: { "r": 70, "g": 130, "b": 180 } },
        { name: "Tan", rgb: { "r": 210, "g": 180, "b": 140 } },
        { name: "Teal", rgb: { "r": 0, "g": 128, "b": 128 } },
        { name: "Thistle", rgb: { "r": 216, "g": 191, "b": 216 } },
        { name: "Tomato", rgb: { "r": 255, "g": 99, "b": 71 } },
        { name: "Turquoise", rgb: { "r": 64, "g": 224, "b": 208 } },
        { name: "Violet", rgb: { "r": 238, "g": 130, "b": 238 } },
        { name: "Wheat", rgb: { "r": 245, "g": 222, "b": 179 } },
        { name: "White", rgb: { "r": 255, "g": 255, "b": 255 } },
        { name: "WhiteSmoke", rgb: { "r": 245, "g": 245, "b": 245 } },
        { name: "Yellow", rgb: { "r": 255, "g": 255, "b": 0 } },
        { name: "YellowGreen", rgb: { "r": 154, "g": 205, "b": 50 } }
      ],
      pantone: [
        { name: "100C", cmyk: { "c": 1, "m": 0, "y": 70, "k": 0 }, rgb: { "r": 246, "g": 235, "b": 97 }, lab: { "l": 91.62764957506504, "a": -12.654196127772188, "b": 66.37857444316361 } },
        { name: "101C", cmyk: { "c": 1, "m": 0, "y": 78, "k": 0 }, rgb: { "r": 247, "g": 234, "b": 72 }, lab: { "l": 91.27394599493934, "a": -13.122721089750156, "b": 75.67454812121998 } },
        { name: "102C", cmyk: { "c": 0, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 252, "g": 227, "b": 0 }, lab: { "l": 89.68895708924758, "a": -9.212217839985659, "b": 88.97519572799432 } },
        { name: "103C", cmyk: { "c": 0, "m": 8, "y": 100, "k": 19 }, rgb: { "r": 197, "g": 169, "b": 0 }, lab: { "l": 69.64456323477853, "a": -3.3727692023357014, "b": 72.38090980058873 } },
        { name: "104C", cmyk: { "c": 3, "m": 10, "y": 100, "k": 29 }, rgb: { "r": 175, "g": 152, "b": 0 }, lab: { "l": 62.986250974806836, "a": -4.209464854240119, "b": 66.67770102411077 } },
        { name: "105C", cmyk: { "c": 15, "m": 20, "y": 93, "k": 42 }, rgb: { "r": 137, "g": 122, "b": 39 }, lab: { "l": 51.13337700974586, "a": -4.151039990419713, "b": 45.43511228246666 } },
        { name: "106C", cmyk: { "c": 1, "m": 0, "y": 79, "k": 0 }, rgb: { "r": 249, "g": 229, "b": 71 }, lab: { "l": 90.15256279464377, "a": -9.873145614063716, "b": 74.99642399880473 } },
        { name: "107C", cmyk: { "c": 0, "m": 1, "y": 88, "k": 0 }, rgb: { "r": 251, "g": 225, "b": 34 }, lab: { "l": 89.14657204073644, "a": -8.234765880155592, "b": 84.45526601234855 } },
        { name: "108C", cmyk: { "c": 0, "m": 2, "y": 99, "k": 0 }, rgb: { "r": 254, "g": 219, "b": 0 }, lab: { "l": 87.840332245593, "a": -4.36712543165485, "b": 87.73943091677774 } },
        { name: "109C", cmyk: { "c": 0, "m": 5, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 209, "b": 0 }, lab: { "l": 85.43366636227017, "a": 1.1234853281921198, "b": 86.08624754747561 } },
        { name: "110C", cmyk: { "c": 0, "m": 20, "y": 100, "k": 8 }, rgb: { "r": 218, "g": 170, "b": 0 }, lab: { "l": 71.99721192360349, "a": 5.3940670482281465, "b": 75.00492846704032 } },
        { name: "111C", cmyk: { "c": 0, "m": 17, "y": 100, "k": 33 }, rgb: { "r": 170, "g": 138, "b": 0 }, lab: { "l": 58.7170567107719, "a": 1.1229965646303297, "b": 63.43321681234002 } },
        { name: "112C", cmyk: { "c": 3, "m": 18, "y": 100, "k": 38 }, rgb: { "r": 156, "g": 132, "b": 18 }, lab: { "l": 55.699354803601736, "a": -1.725132065894086, "b": 57.31698636176053 } },
        { name: "113C", cmyk: { "c": 0, "m": 1, "y": 74, "k": 0 }, rgb: { "r": 250, "g": 224, "b": 83 }, lab: { "l": 89.04514485168566, "a": -6.3769685267134335, "b": 69.44419929189642 } },
        { name: "114C", cmyk: { "c": 0, "m": 2, "y": 80, "k": 0 }, rgb: { "r": 251, "g": 222, "b": 64 }, lab: { "l": 88.50584278625549, "a": -5.843604978287287, "b": 75.88382430152738 } },
        { name: "115C", cmyk: { "c": 0, "m": 4, "y": 88, "k": 0 }, rgb: { "r": 253, "g": 218, "b": 37 }, lab: { "l": 87.56221249001172, "a": -3.8191734368785424, "b": 82.63603337552965 } },
        { name: "116C", cmyk: { "c": 0, "m": 10, "y": 98, "k": 0 }, rgb: { "r": 255, "g": 205, "b": 0 }, lab: { "l": 84.44385835546392, "a": 3.167487924777168, "b": 85.39459381183204 } },
        { name: "117C", cmyk: { "c": 0, "m": 26, "y": 100, "k": 15 }, rgb: { "r": 201, "g": 151, "b": 0 }, lab: { "l": 65.39737051345456, "a": 8.05642867398737, "b": 69.60931034346953 } },
        { name: "118C", cmyk: { "c": 0, "m": 26, "y": 100, "k": 31 }, rgb: { "r": 172, "g": 132, "b": 0 }, lab: { "l": 57.340631247363405, "a": 5.3617212835068155, "b": 62.57667408370665 } },
        { name: "119C", cmyk: { "c": 11, "m": 24, "y": 96, "k": 45 }, rgb: { "r": 137, "g": 115, "b": 34 }, lab: { "l": 49.12446637090807, "a": -0.4618621098358977, "b": 45.53913775483619 } },
        { name: "120C", cmyk: { "c": 0, "m": 5, "y": 66, "k": 0 }, rgb: { "r": 251, "g": 219, "b": 101 }, lab: { "l": 88.02240007489769, "a": -2.358712410884367, "b": 60.80119354795113 } },
        { name: "121C", cmyk: { "c": 0, "m": 6, "y": 72, "k": 0 }, rgb: { "r": 252, "g": 215, "b": 87 }, lab: { "l": 86.98923412512198, "a": -0.7855270964189365, "b": 65.73135341769498 } },
        { name: "122C", cmyk: { "c": 0, "m": 9, "y": 80, "k": 0 }, rgb: { "r": 254, "g": 209, "b": 65 }, lab: { "l": 85.53091148657153, "a": 2.0399529614560374, "b": 72.83262019382771 } },
        { name: "123C", cmyk: { "c": 0, "m": 16, "y": 89, "k": 0 }, rgb: { "r": 255, "g": 199, "b": 44 }, lab: { "l": 83.06670941195898, "a": 6.89512869948361, "b": 77.28592397488565 } },
        { name: "124C", cmyk: { "c": 0, "m": 29, "y": 100, "k": 1 }, rgb: { "r": 234, "g": 170, "b": 0 }, lab: { "l": 73.70220884710346, "a": 12.370210979377072, "b": 76.97943297758236 } },
        { name: "125C", cmyk: { "c": 0, "m": 31, "y": 100, "k": 25 }, rgb: { "r": 181, "g": 133, "b": 0 }, lab: { "l": 58.60113190000655, "a": 8.917533968789805, "b": 63.9143503916707 } },
        { name: "126C", cmyk: { "c": 0, "m": 30, "y": 100, "k": 40 }, rgb: { "r": 154, "g": 118, "b": 17 }, lab: { "l": 51.686915927980536, "a": 5.174721902571622, "b": 54.244925530812026 } },
        { name: "127C", cmyk: { "c": 0, "m": 3, "y": 63, "k": 0 }, rgb: { "r": 243, "g": 221, "b": 109 }, lab: { "l": 87.90680573923137, "a": -6.054256625946608, "b": 56.87077864288332 } },
        { name: "128C", cmyk: { "c": 0, "m": 7, "y": 75, "k": 0 }, rgb: { "r": 243, "g": 213, "b": 78 }, lab: { "l": 85.60143920145183, "a": -3.999005825741808, "b": 67.6865300426932 } },
        { name: "129C", cmyk: { "c": 0, "m": 10, "y": 80, "k": 0 }, rgb: { "r": 243, "g": 208, "b": 62 }, lab: { "l": 84.23279601439505, "a": -2.1984597888424218, "b": 72.28703671106229 } },
        { name: "130C", cmyk: { "c": 0, "m": 32, "y": 100, "k": 0 }, rgb: { "r": 242, "g": 169, "b": 0 }, lab: { "l": 74.35142394988864, "a": 16.33855976547427, "b": 77.84203930564064 } },
        { name: "131C", cmyk: { "c": 0, "m": 39, "y": 100, "k": 11 }, rgb: { "r": 204, "g": 138, "b": 0 }, lab: { "l": 62.51972618710383, "a": 16.455310571712843, "b": 67.83021931102839 } },
        { name: "132C", cmyk: { "c": 0, "m": 34, "y": 100, "k": 36 }, rgb: { "r": 160, "g": 116, "b": 0 }, lab: { "l": 51.79689834787435, "a": 8.80322901399655, "b": 58.13870154376816 } },
        { name: "133C", cmyk: { "c": 12, "m": 33, "y": 98, "k": 60 }, rgb: { "r": 108, "g": 87, "b": 27 }, lab: { "l": 37.99217481761767, "a": 1.6567089804550017, "b": 36.49461446642589 } },
        { name: "134C", cmyk: { "c": 0, "m": 11, "y": 62, "k": 0 }, rgb: { "r": 253, "g": 210, "b": 110 }, lab: { "l": 86.05723762536718, "a": 3.6854402020502497, "b": 54.48232399968993 } },
        { name: "135C", cmyk: { "c": 0, "m": 18, "y": 72, "k": 0 }, rgb: { "r": 255, "g": 198, "b": 88 }, lab: { "l": 83.10065408817445, "a": 9.24327062548297, "b": 61.225420957758935 } },
        { name: "136C", cmyk: { "c": 0, "m": 22, "y": 83, "k": 0 }, rgb: { "r": 255, "g": 191, "b": 63 }, lab: { "l": 81.2258573766608, "a": 11.66334875319236, "b": 69.49098717758923 } },
        { name: "137C", cmyk: { "c": 0, "m": 36, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 164, "b": 0 }, lab: { "l": 74.70551347006342, "a": 24.457228740249192, "b": 78.80842309804098 } },
        { name: "138C", cmyk: { "c": 0, "m": 54, "y": 100, "k": 1 }, rgb: { "r": 222, "g": 124, "b": 0 }, lab: { "l": 61.606650228746375, "a": 31.65938071547475, "b": 68.37503399368876 } },
        { name: "139C", cmyk: { "c": 0, "m": 48, "y": 100, "k": 26 }, rgb: { "r": 175, "g": 109, "b": 4 }, lab: { "l": 51.904985761916834, "a": 19.648523814933316, "b": 58.28678227502599 } },
        { name: "140C", cmyk: { "c": 6, "m": 43, "y": 100, "k": 58 }, rgb: { "r": 116, "g": 83, "b": 28 }, lab: { "l": 37.81254435936873, "a": 8.002780612080679, "b": 36.14933923886835 } },
        { name: "141C", cmyk: { "c": 0, "m": 16, "y": 68, "k": 0 }, rgb: { "r": 242, "g": 199, "b": 92 }, lab: { "l": 82.10748074474321, "a": 3.5799642830575684, "b": 57.99188763819452 } },
        { name: "142C", cmyk: { "c": 0, "m": 21, "y": 77, "k": 0 }, rgb: { "r": 241, "g": 190, "b": 72 }, lab: { "l": 79.61129375698408, "a": 6.696191006447361, "b": 63.9137083141448 } },
        { name: "143C", cmyk: { "c": 0, "m": 27, "y": 85, "k": 0 }, rgb: { "r": 241, "g": 180, "b": 52 }, lab: { "l": 77.03576377715669, "a": 11.08752620678799, "b": 68.97758922249851 } },
        { name: "144C", cmyk: { "c": 0, "m": 49, "y": 100, "k": 0 }, rgb: { "r": 237, "g": 139, "b": 0 }, lab: { "l": 66.87730770267855, "a": 30.02125928530769, "b": 72.67443368796484 } },
        { name: "145C", cmyk: { "c": 0, "m": 49, "y": 100, "k": 8 }, rgb: { "r": 207, "g": 127, "b": 0 }, lab: { "l": 60.28788950844928, "a": 23.732080922552136, "b": 66.55238620485792 } },
        { name: "146C", cmyk: { "c": 0, "m": 47, "y": 100, "k": 31 }, rgb: { "r": 167, "g": 109, "b": 17 }, lab: { "l": 50.91252422177055, "a": 16.264592660553355, "b": 54.286329638085284 } },
        { name: "147C", cmyk: { "c": 19, "m": 38, "y": 87, "k": 52 }, rgb: { "r": 113, "g": 92, "b": 42 }, lab: { "l": 40.13439124962558, "a": 2.109863069142792, "b": 31.452397812305634 } },
        { name: "148C", cmyk: { "c": 0, "m": 17, "y": 47, "k": 0 }, rgb: { "r": 254, "g": 203, "b": 139 }, lab: { "l": 84.81592473146831, "a": 10.191652359340718, "b": 38.70626245917457 } },
        { name: "149C", cmyk: { "c": 0, "m": 22, "y": 56, "k": 0 }, rgb: { "r": 255, "g": 194, "b": 123 }, lab: { "l": 82.52562553152451, "a": 13.80975535962914, "b": 43.93162546487985 } },
        { name: "150C", cmyk: { "c": 0, "m": 30, "y": 71, "k": 0 }, rgb: { "r": 255, "g": 178, "b": 91 }, lab: { "l": 78.37776268270788, "a": 19.838444694441737, "b": 54.645912760431536 } },
        { name: "151C", cmyk: { "c": 0, "m": 54, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 130, "b": 0 }, lab: { "l": 67.44569115171247, "a": 41.84488292764066, "b": 74.26131023765143 } },
        { name: "152C", cmyk: { "c": 0, "m": 61, "y": 100, "k": 0 }, rgb: { "r": 229, "g": 114, "b": 0 }, lab: { "l": 60.509406044297435, "a": 39.6250001511666, "b": 68.21240985457844 } },
        { name: "153C", cmyk: { "c": 0, "m": 57, "y": 100, "k": 17 }, rgb: { "r": 190, "g": 106, "b": 20 }, lab: { "l": 53.282480146115134, "a": 28.074666182904718, "b": 56.616606103106534 } },
        { name: "154C", cmyk: { "c": 0, "m": 57, "y": 100, "k": 38 }, rgb: { "r": 155, "g": 90, "b": 26 }, lab: { "l": 44.73846598026753, "a": 21.884939676552417, "b": 45.45605414454429 } },
        { name: "155C", cmyk: { "c": 0, "m": 13, "y": 35, "k": 0 }, rgb: { "r": 239, "g": 209, "b": 159 }, lab: { "l": 85.22789954965558, "a": 3.4082259400713966, "b": 28.688517898422084 } },
        { name: "156C", cmyk: { "c": 0, "m": 23, "y": 51, "k": 0 }, rgb: { "r": 239, "g": 190, "b": 125 }, lab: { "l": 79.98701986263362, "a": 9.657364618849861, "b": 39.386077991606626 } },
        { name: "157C", cmyk: { "c": 0, "m": 40, "y": 71, "k": 0 }, rgb: { "r": 236, "g": 161, "b": 84 }, lab: { "l": 72.20355789203133, "a": 20.5591408413886, "b": 50.42837249398533 } },
        { name: "158C", cmyk: { "c": 0, "m": 62, "y": 97, "k": 0 }, rgb: { "r": 232, "g": 119, "b": 34 }, lab: { "l": 62.053337587149116, "a": 38.76982018303154, "b": 61.65689273893054 } },
        { name: "159C", cmyk: { "c": 0, "m": 68, "y": 100, "k": 7 }, rgb: { "r": 203, "g": 96, "b": 21 }, lab: { "l": 53.07664715638475, "a": 38.65703286532746, "b": 56.996279644077774 } },
        { name: "160C", cmyk: { "c": 0, "m": 64, "y": 100, "k": 32 }, rgb: { "r": 161, "g": 86, "b": 28 }, lab: { "l": 44.6834297163898, "a": 26.8112458357016, "b": 44.89298171853555 } },
        { name: "161C", cmyk: { "c": 11, "m": 61, "y": 92, "k": 65 }, rgb: { "r": 96, "g": 61, "b": 32 }, lab: { "l": 29.23152764784753, "a": 12.128406822599747, "b": 23.886931855050676 } },
        { name: "162C", cmyk: { "c": 0, "m": 27, "y": 32, "k": 0 }, rgb: { "r": 255, "g": 190, "b": 159 }, lab: { "l": 82.15789751289479, "a": 19.471076811263366, "b": 24.788362482218496 } },
        { name: "163C", cmyk: { "c": 0, "m": 44, "y": 57, "k": 0 }, rgb: { "r": 255, "g": 157, "b": 110 }, lab: { "l": 73.8686329678217, "a": 32.07955105985166, "b": 39.8162084605745 } },
        { name: "164C", cmyk: { "c": 0, "m": 59, "y": 81, "k": 0 }, rgb: { "r": 255, "g": 127, "b": 65 }, lab: { "l": 67.14206636555029, "a": 44.67293205099598, "b": 54.691982630582395 } },
        { name: "165C", cmyk: { "c": 0, "m": 68, "y": 96, "k": 0 }, rgb: { "r": 255, "g": 103, "b": 32 }, lab: { "l": 62.562281049409506, "a": 54.92871402964211, "b": 64.21815738053613 } },
        { name: "166C", cmyk: { "c": 0, "m": 76, "y": 100, "k": 0 }, rgb: { "r": 227, "g": 82, "b": 5 }, lab: { "l": 54.424153681644725, "a": 53.88278129301782, "b": 63.588889568642706 } },
        { name: "167C", cmyk: { "c": 0, "m": 73, "y": 100, "k": 15 }, rgb: { "r": 190, "g": 83, "b": 28 }, lab: { "l": 48.53292919896761, "a": 40.214597218012294, "b": 50.00593641244272 } },
        { name: "168C", cmyk: { "c": 2, "m": 74, "y": 94, "k": 57 }, rgb: { "r": 115, "g": 57, "b": 29 }, lab: { "l": 31.019543622734737, "a": 23.140361673321618, "b": 28.417931286807807 } },
        { name: "169C", cmyk: { "c": 0, "m": 34, "y": 21, "k": 0 }, rgb: { "r": 255, "g": 179, "b": 171 }, lab: { "l": 79.86385118429396, "a": 26.655385912468244, "b": 15.199242483085861 } },
        { name: "170C", cmyk: { "c": 0, "m": 56, "y": 48, "k": 0 }, rgb: { "r": 255, "g": 134, "b": 116 }, lab: { "l": 69.16298498537404, "a": 44.2480483955292, "b": 30.601034535290793 } },
        { name: "171C", cmyk: { "c": 0, "m": 74, "y": 85, "k": 0 }, rgb: { "r": 255, "g": 92, "b": 57 }, lab: { "l": 60.96625494083, "a": 60.25870821869922, "b": 52.220418631622714 } },
        { name: "172C", cmyk: { "c": 0, "m": 80, "y": 98, "k": 0 }, rgb: { "r": 250, "g": 70, "b": 22 }, lab: { "l": 56.84302253847294, "a": 66.13061358406192, "b": 62.99851001348864 } },
        { name: "173C", cmyk: { "c": 0, "m": 83, "y": 99, "k": 4 }, rgb: { "r": 207, "g": 69, "b": 32 }, lab: { "l": 49.03921716276723, "a": 52.82958813280037, "b": 49.86526271730624 } },
        { name: "174C", cmyk: { "c": 0, "m": 84, "y": 95, "k": 37 }, rgb: { "r": 150, "g": 56, "b": 33 }, lab: { "l": 36.78475297722826, "a": 38.20199414642145, "b": 34.121189662397775 } },
        { name: "175C", cmyk: { "c": 13, "m": 78, "y": 77, "k": 59 }, rgb: { "r": 107, "g": 53, "b": 41 }, lab: { "l": 28.984856457988037, "a": 22.79197462908142, "b": 18.416407698009387 } },
        { name: "176C", cmyk: { "c": 0, "m": 34, "y": 9, "k": 0 }, rgb: { "r": 255, "g": 177, "b": 187 }, lab: { "l": 79.77979473541849, "a": 29.76698865235533, "b": 6.433738393783672 } },
        { name: "177C", cmyk: { "c": 0, "m": 58, "y": 29, "k": 0 }, rgb: { "r": 255, "g": 128, "b": 139 }, lab: { "l": 68.43310512521549, "a": 49.20470521841247, "b": 16.830770466900557 } },
        { name: "178C", cmyk: { "c": 0, "m": 75, "y": 57, "k": 0 }, rgb: { "r": 255, "g": 88, "b": 93 }, lab: { "l": 60.80788517659674, "a": 63.49168969764424, "b": 32.704410400655895 } },
        { name: "179C", cmyk: { "c": 0, "m": 88, "y": 85, "k": 0 }, rgb: { "r": 224, "g": 60, "b": 49 }, lab: { "l": 51.037242264209766, "a": 62.150764493238086, "b": 44.45894291170228 } },
        { name: "180C", cmyk: { "c": 1, "m": 87, "y": 77, "k": 13 }, rgb: { "r": 190, "g": 58, "b": 52 }, lab: { "l": 44.54849512658529, "a": 52.2462708870961, "b": 33.92831578279976 } },
        { name: "181C", cmyk: { "c": 6, "m": 87, "y": 71, "k": 47 }, rgb: { "r": 129, "g": 49, "b": 47 }, lab: { "l": 31.963450018690267, "a": 34.42153176586249, "b": 19.15446626775179 } },
        { name: "182C", cmyk: { "c": 0, "m": 30, "y": 0, "k": 0 }, rgb: { "r": 250, "g": 187, "b": 203 }, lab: { "l": 81.93399751739273, "a": 25.00550580208921, "b": 0.8542274712035169 } },
        { name: "183C", cmyk: { "c": 0, "m": 46, "y": 6, "k": 0 }, rgb: { "r": 252, "g": 155, "b": 179 }, lab: { "l": 74.44033071832264, "a": 39.09593783882692, "b": 3.0504992993595437 } },
        { name: "184C", cmyk: { "c": 0, "m": 79, "y": 31, "k": 0 }, rgb: { "r": 246, "g": 82, "b": 117 }, lab: { "l": 58.89257280021363, "a": 64.66184803780278, "b": 16.020992587948534 } },
        { name: "185C", cmyk: { "c": 0, "m": 100, "y": 89, "k": 0 }, rgb: { "r": 228, "g": 0, "b": 43 }, lab: { "l": 47.83947113738808, "a": 74.2198403935917, "b": 44.74636206344014 } },
        { name: "186C", cmyk: { "c": 0, "m": 100, "y": 80, "k": 5 }, rgb: { "r": 200, "g": 16, "b": 46 }, lab: { "l": 42.5321046643138, "a": 65.9062142132314, "b": 35.71173674207762 } },
        { name: "187C", cmyk: { "c": 0, "m": 100, "y": 74, "k": 26 }, rgb: { "r": 166, "g": 25, "b": 46 }, lab: { "l": 35.983350283073406, "a": 55.232481656433684, "b": 26.347230483232444 } },
        { name: "188C", cmyk: { "c": 5, "m": 96, "y": 56, "k": 54 }, rgb: { "r": 118, "g": 35, "b": 47 }, lab: { "l": 27.45985646011497, "a": 37.01453208868644, "b": 12.878888685849555 } },
        { name: "189C", cmyk: { "c": 0, "m": 42, "y": 3, "k": 0 }, rgb: { "r": 248, "g": 163, "b": 188 }, lab: { "l": 75.93506450137754, "a": 34.74637852433965, "b": 0.22162082588450538 } },
        { name: "190C", cmyk: { "c": 0, "m": 65, "y": 11, "k": 0 }, rgb: { "r": 246, "g": 117, "b": 153 }, lab: { "l": 65.44806338620366, "a": 52.872901811809314, "b": 4.5063218639624925 } },
        { name: "191C", cmyk: { "c": 0, "m": 85, "y": 30, "k": 0 }, rgb: { "r": 239, "g": 66, "b": 111 }, lab: { "l": 55.47674021947816, "a": 67.89344901332083, "b": 14.652311922025785 } },
        { name: "192C", cmyk: { "c": 0, "m": 100, "y": 62, "k": 0 }, rgb: { "r": 228, "g": 0, "b": 70 }, lab: { "l": 48.179517746317686, "a": 75.14182616654203, "b": 29.33582920205935 } },
        { name: "193C", cmyk: { "c": 0, "m": 100, "y": 59, "k": 11 }, rgb: { "r": 191, "g": 13, "b": 62 }, lab: { "l": 40.7547026789377, "a": 64.66778261500022, "b": 23.333416357345904 } },
        { name: "194C", cmyk: { "c": 2, "m": 97, "y": 43, "k": 33 }, rgb: { "r": 155, "g": 39, "b": 67 }, lab: { "l": 35.64485574416858, "a": 49.1239907336713, "b": 12.05988104226725 } },
        { name: "196C", cmyk: { "c": 0, "m": 21, "y": 2, "k": 0 }, rgb: { "r": 236, "g": 199, "b": 205 }, lab: { "l": 83.48839209842549, "a": 14.012376261450187, "b": 1.882834793380539 } },
        { name: "197C", cmyk: { "c": 0, "m": 45, "y": 7, "k": 0 }, rgb: { "r": 232, "g": 156, "b": 174 }, lab: { "l": 72.22096457685869, "a": 30.781053519668532, "b": 2.3047710819032563 } },
        { name: "198C", cmyk: { "c": 0, "m": 85, "y": 41, "k": 0 }, rgb: { "r": 223, "g": 70, "b": 97 }, lab: { "l": 52.87429113113295, "a": 60.755315622311514, "b": 18.979593712640785 } },
        { name: "199C", cmyk: { "c": 0, "m": 100, "y": 79, "k": 0 }, rgb: { "r": 213, "g": 0, "b": 50 }, lab: { "l": 44.76799957071758, "a": 70.82614854069364, "b": 36.58027955185075 } },
        { name: "200C", cmyk: { "c": 0, "m": 100, "y": 76, "k": 13 }, rgb: { "r": 186, "g": 12, "b": 47 }, lab: { "l": 39.423870433661385, "a": 62.86716069249832, "b": 30.816563433029486 } },
        { name: "201C", cmyk: { "c": 0, "m": 100, "y": 63, "k": 31 }, rgb: { "r": 157, "g": 34, "b": 53 }, lab: { "l": 35.14124878943107, "a": 50.47919446278032, "b": 20.463023756354804 } },
        { name: "202C", cmyk: { "c": 1, "m": 98, "y": 58, "k": 44 }, rgb: { "r": 134, "g": 38, "b": 51 }, lab: { "l": 31.098893769014637, "a": 41.548438972698, "b": 15.63038965263348 } },
        { name: "203C", cmyk: { "c": 0, "m": 34, "y": 0, "k": 0 }, rgb: { "r": 236, "g": 179, "b": 203 }, lab: { "l": 78.68561458056294, "a": 24.315757212176326, "b": -4.070134815800275 } },
        { name: "204C", cmyk: { "c": 0, "m": 58, "y": 1, "k": 0 }, rgb: { "r": 231, "g": 130, "b": 169 }, lab: { "l": 66.3812113327199, "a": 43.35450449505651, "b": -3.453110736858922 } },
        { name: "205C", cmyk: { "c": 0, "m": 84, "y": 15, "k": 0 }, rgb: { "r": 224, "g": 69, "b": 123 }, lab: { "l": 53.528605839676246, "a": 63.5515167685457, "b": 4.370219956682364 } },
        { name: "206C", cmyk: { "c": 0, "m": 100, "y": 69, "k": 2 }, rgb: { "r": 206, "g": 0, "b": 55 }, lab: { "l": 43.356392827035414, "a": 69.32316091579216, "b": 31.576340780017233 } },
        { name: "207C", cmyk: { "c": 0, "m": 100, "y": 59, "k": 26 }, rgb: { "r": 165, "g": 0, "b": 52 }, lab: { "l": 34.49263001132918, "a": 59.22160979182334, "b": 20.624722263312336 } },
        { name: "208C", cmyk: { "c": 0, "m": 100, "y": 29, "k": 44 }, rgb: { "r": 134, "g": 32, "b": 65 }, lab: { "l": 30.59974634556871, "a": 45.012142243925354, "b": 5.717175074423908 } },
        { name: "209C", cmyk: { "c": 15, "m": 96, "y": 31, "k": 55 }, rgb: { "r": 111, "g": 38, "b": 61 }, lab: { "l": 27.025250937952144, "a": 34.496316771563535, "b": 2.6891120478964248 } },
        { name: "210C", cmyk: { "c": 1, "m": 44, "y": 0, "k": 0 }, rgb: { "r": 249, "g": 159, "b": 201 }, lab: { "l": 75.5464485772207, "a": 39.05290216683321, "b": -7.464940690264887 } },
        { name: "211C", cmyk: { "c": 0, "m": 60, "y": 0, "k": 0 }, rgb: { "r": 245, "g": 126, "b": 182 }, lab: { "l": 67.8075064262924, "a": 51.75009573620587, "b": -8.468170437297061 } },
        { name: "212C", cmyk: { "c": 0, "m": 78, "y": 2, "k": 0 }, rgb: { "r": 240, "g": 78, "b": 152 }, lab: { "l": 58.26514176134961, "a": 67.63721430140824, "b": -5.52770581148998 } },
        { name: "213C", cmyk: { "c": 0, "m": 95, "y": 9, "k": 0 }, rgb: { "r": 227, "g": 28, "b": 121 }, lab: { "l": 50.14685857179376, "a": 75.11712070403686, "b": 0.7473134261184011 } },
        { name: "214C", cmyk: { "c": 1, "m": 100, "y": 14, "k": 3 }, rgb: { "r": 206, "g": 15, "b": 105 }, lab: { "l": 44.91832678695018, "a": 70.80227172091853, "b": 2.488862109295553 } },
        { name: "215C", cmyk: { "c": 2, "m": 100, "y": 14, "k": 21 }, rgb: { "r": 172, "g": 20, "b": 90 }, lab: { "l": 37.85885280782026, "a": 60.76070698853661, "b": 0.8617300624128799 } },
        { name: "216C", cmyk: { "c": 12, "m": 98, "y": 17, "k": 46 }, rgb: { "r": 125, "g": 34, "b": 72 }, lab: { "l": 29.34148108861769, "a": 42.162083712907226, "b": -0.9644208265795706 } },
        { name: "217C", cmyk: { "c": 1, "m": 27, "y": 0, "k": 0 }, rgb: { "r": 234, "g": 190, "b": 219 }, lab: { "l": 81.52946585048625, "a": 20.42680236665184, "b": -8.520112142981851 } },
        { name: "218C", cmyk: { "c": 2, "m": 66, "y": 0, "k": 0 }, rgb: { "r": 229, "g": 109, "b": 177 }, lab: { "l": 62.3126675765716, "a": 54.20367607133397, "b": -14.090701566438435 } },
        { name: "219C", cmyk: { "c": 0, "m": 95, "y": 0, "k": 0 }, rgb: { "r": 218, "g": 25, "b": 132 }, lab: { "l": 48.59424957259613, "a": 74.50363329033455, "b": -8.429776435155079 } },
        { name: "220C", cmyk: { "c": 0, "m": 100, "y": 13, "k": 26 }, rgb: { "r": 165, "g": 0, "b": 80 }, lab: { "l": 35.159792677930135, "a": 61.0032536375909, "b": 3.2316027824315308 } },
        { name: "221C", cmyk: { "c": 0, "m": 100, "y": 14, "k": 38 }, rgb: { "r": 145, "g": 0, "b": 72 }, lab: { "l": 30.61079362199225, "a": 55.69042562487039, "b": 1.3807787718419173 } },
        { name: "222C", cmyk: { "c": 21, "m": 100, "y": 7, "k": 52 }, rgb: { "r": 108, "g": 29, "b": 69 }, lab: { "l": 25.249402942135937, "a": 38.52964290330863, "b": -5.37655124439792 } },
        { name: "223C", cmyk: { "c": 4, "m": 48, "y": 0, "k": 0 }, rgb: { "r": 239, "g": 149, "b": 207 }, lab: { "l": 72.4622233369967, "a": 41.834424350199626, "b": -15.496643591889558 } },
        { name: "224C", cmyk: { "c": 5, "m": 64, "y": 0, "k": 0 }, rgb: { "r": 235, "g": 111, "b": 189 }, lab: { "l": 63.921469014900566, "a": 56.78535955640712, "b": -18.402090131102167 } },
        { name: "225C", cmyk: { "c": 4, "m": 90, "y": 0, "k": 0 }, rgb: { "r": 223, "g": 25, "b": 149 }, lab: { "l": 50.16027608801021, "a": 77.27147267952905, "b": -16.226585504962856 } },
        { name: "226C", cmyk: { "c": 0, "m": 100, "y": 0, "k": 2 }, rgb: { "r": 208, "g": 0, "b": 112 }, lab: { "l": 45.05313975515047, "a": 73.20324279943242, "b": -1.6180948093203806 } },
        { name: "227C", cmyk: { "c": 3, "m": 100, "y": 0, "k": 20 }, rgb: { "r": 170, "g": 0, "b": 97 }, lab: { "l": 36.760339587568716, "a": 63.57395862816606, "b": -5.289279071243513 } },
        { name: "228C", cmyk: { "c": 17, "m": 100, "y": 0, "k": 33 }, rgb: { "r": 137, "g": 12, "b": 88 }, lab: { "l": 30.122577778682164, "a": 53.47951773632434, "b": -10.115056943857558 } },
        { name: "229C", cmyk: { "c": 27, "m": 100, "y": 9, "k": 54 }, rgb: { "r": 103, "g": 33, "b": 70 }, lab: { "l": 24.993800357788047, "a": 35.282162048765635, "b": -6.530757546246968 } },
        { name: "230C", cmyk: { "c": 3, "m": 39, "y": 0, "k": 0 }, rgb: { "r": 244, "g": 166, "b": 215 }, lab: { "l": 76.9278042517002, "a": 35.88410508271694, "b": -13.115519201299875 } },
        { name: "231C", cmyk: { "c": 5, "m": 61, "y": 0, "k": 0 }, rgb: { "r": 242, "g": 119, "b": 198 }, lab: { "l": 66.63293990280798, "a": 56.41997616353489, "b": -19.271036947915988 } },
        { name: "232C", cmyk: { "c": 7, "m": 81, "y": 0, "k": 0 }, rgb: { "r": 233, "g": 60, "b": 172 }, lab: { "l": 55.61808506195203, "a": 74.14340101730815, "b": -21.322852875471842 } },
        { name: "233C", cmyk: { "c": 11, "m": 100, "y": 0, "k": 0 }, rgb: { "r": 198, "g": 0, "b": 126 }, lab: { "l": 43.52497275593083, "a": 72.33215904766543, "b": -12.778827614909694 } },
        { name: "234C", cmyk: { "c": 16, "m": 100, "y": 0, "k": 17 }, rgb: { "r": 162, "g": 0, "b": 103 }, lab: { "l": 35.32255062135018, "a": 62.406964014313196, "b": -11.461128674999266 } },
        { name: "235C", cmyk: { "c": 18, "m": 100, "y": 0, "k": 37 }, rgb: { "r": 132, "g": 11, "b": 85 }, lab: { "l": 28.904116834378847, "a": 52.12437781600787, "b": -10.08498065035013 } },
        { name: "236C", cmyk: { "c": 5, "m": 38, "y": 0, "k": 0 }, rgb: { "r": 241, "g": 167, "b": 220 }, lab: { "l": 76.98421444918209, "a": 35.18576466748813, "b": -15.785003828154998 } },
        { name: "237C", cmyk: { "c": 7, "m": 53, "y": 0, "k": 0 }, rgb: { "r": 236, "g": 134, "b": 208 }, lab: { "l": 69.06673206476366, "a": 48.728979972000154, "b": -21.227860530344177 } },
        { name: "238C", cmyk: { "c": 11, "m": 70, "y": 0, "k": 0 }, rgb: { "r": 228, "g": 93, "b": 191 }, lab: { "l": 59.964794772201316, "a": 63.16550827547851, "b": -25.67973522463276 } },
        { name: "239C", cmyk: { "c": 14, "m": 81, "y": 0, "k": 0 }, rgb: { "r": 219, "g": 62, "b": 177 }, lab: { "l": 53.68543728566341, "a": 70.76990116339898, "b": -27.413970733395665 } },
        { name: "240C", cmyk: { "c": 20, "m": 90, "y": 0, "k": 0 }, rgb: { "r": 197, "g": 41, "b": 155 }, lab: { "l": 46.741079282125064, "a": 68.9925189906022, "b": -25.482824277207115 } },
        { name: "241C", cmyk: { "c": 28, "m": 100, "y": 0, "k": 0 }, rgb: { "r": 175, "g": 22, "b": 133 }, lab: { "l": 40.21528789046788, "a": 65.61410980400164, "b": -22.56178089326778 } },
        { name: "242C", cmyk: { "c": 32, "m": 100, "y": 0, "k": 29 }, rgb: { "r": 128, "g": 34, "b": 95 }, lab: { "l": 30.782234531629832, "a": 45.93593858009892, "b": -13.836740385334046 } },
        { name: "243C", cmyk: { "c": 6, "m": 29, "y": 0, "k": 0 }, rgb: { "r": 234, "g": 184, "b": 228 }, lab: { "l": 80.38996465544516, "a": 25.213070469331022, "b": -15.06226731233642 } },
        { name: "244C", cmyk: { "c": 10, "m": 43, "y": 0, "k": 0 }, rgb: { "r": 229, "g": 155, "b": 220 }, lab: { "l": 73.06801848465136, "a": 37.61630048536585, "b": -21.835709580560337 } },
        { name: "245C", cmyk: { "c": 14, "m": 56, "y": 0, "k": 0 }, rgb: { "r": 221, "g": 127, "b": 211 }, lab: { "l": 65.94597723890654, "a": 48.15522134067035, "b": -27.83954494894809 } },
        { name: "246C", cmyk: { "c": 27, "m": 89, "y": 0, "k": 0 }, rgb: { "r": 199, "g": 36, "b": 177 }, lab: { "l": 47.724099111090126, "a": 73.59642791214516, "b": -36.98145544241653 } },
        { name: "247C", cmyk: { "c": 30, "m": 94, "y": 0, "k": 0 }, rgb: { "r": 187, "g": 22, "b": 163 }, lab: { "l": 43.920045330487355, "a": 71.988019463471, "b": -34.81546834082903 } },
        { name: "248C", cmyk: { "c": 37, "m": 100, "y": 0, "k": 0 }, rgb: { "r": 165, "g": 24, "b": 144 }, lab: { "l": 39.012510383402585, "a": 64.56063487189937, "b": -31.332762433409755 } },
        { name: "249C", cmyk: { "c": 43, "m": 100, "y": 0, "k": 17 }, rgb: { "r": 128, "g": 40, "b": 108 }, lab: { "l": 32.23444668726641, "a": 45.46160282914779, "b": -19.954289405079727 } },
        { name: "250C", cmyk: { "c": 7, "m": 29, "y": 0, "k": 0 }, rgb: { "r": 231, "g": 186, "b": 228 }, lab: { "l": 80.57626999988933, "a": 23.146221082120057, "b": -14.810924484106947 } },
        { name: "251C", cmyk: { "c": 13, "m": 42, "y": 0, "k": 0 }, rgb: { "r": 221, "g": 156, "b": 223 }, lab: { "l": 72.54604422576702, "a": 35.059470024365325, "b": -24.353168202974373 } },
        { name: "252C", cmyk: { "c": 26, "m": 67, "y": 0, "k": 0 }, rgb: { "r": 201, "g": 100, "b": 207 }, lab: { "l": 58.072005517340315, "a": 55.12805376902347, "b": -38.01890951570363 } },
        { name: "253C", cmyk: { "c": 40, "m": 95, "y": 0, "k": 0 }, rgb: { "r": 173, "g": 26, "b": 172 }, lab: { "l": 42.15669168176727, "a": 69.89454515989863, "b": -43.13859984052668 } },
        { name: "254C", cmyk: { "c": 46, "m": 98, "y": 0, "k": 0 }, rgb: { "r": 152, "g": 30, "b": 151 }, lab: { "l": 37.550663358998776, "a": 61.527034889416214, "b": -38.066826066660774 } },
        { name: "255C", cmyk: { "c": 53, "m": 100, "y": 0, "k": 16 }, rgb: { "r": 114, "g": 36, "b": 108 }, lab: { "l": 29.214486753918997, "a": 43.31291236776211, "b": -24.850414848121517 } },
        { name: "256C", cmyk: { "c": 11, "m": 24, "y": 0, "k": 0 }, rgb: { "r": 214, "g": 191, "b": 221 }, lab: { "l": 80.05468161558768, "a": 13.48708050290326, "b": -11.981994881322787 } },
        { name: "257C", cmyk: { "c": 19, "m": 39, "y": 0, "k": 0 }, rgb: { "r": 198, "g": 161, "b": 207 }, lab: { "l": 70.8712636912849, "a": 21.771051410643118, "b": -18.317554547885194 } },
        { name: "258C", cmyk: { "c": 51, "m": 84, "y": 0, "k": 0 }, rgb: { "r": 140, "g": 71, "b": 153 }, lab: { "l": 41.816656361559055, "a": 42.208526881006456, "b": -32.64094078952531 } },
        { name: "259C", cmyk: { "c": 64, "m": 100, "y": 0, "k": 7 }, rgb: { "r": 109, "g": 32, "b": 119 }, lab: { "l": 28.422607341612448, "a": 45.76334049230549, "b": -33.17859194311298 } },
        { name: "260C", cmyk: { "c": 60, "m": 100, "y": 0, "k": 22 }, rgb: { "r": 100, "g": 38, "b": 103 }, lab: { "l": 26.946883695278075, "a": 37.571480210331494, "b": -25.358817306465507 } },
        { name: "261C", cmyk: { "c": 60, "m": 100, "y": 0, "k": 31 }, rgb: { "r": 93, "g": 41, "b": 95 }, lab: { "l": 25.97860801316569, "a": 32.29641428877147, "b": -21.75621182239138 } },
        { name: "262C", cmyk: { "c": 58, "m": 96, "y": 6, "k": 49 }, rgb: { "r": 81, "g": 40, "b": 79 }, lab: { "l": 23.106130670616913, "a": 25.574304763207294, "b": -15.792695052150474 } },
        { name: "263C", cmyk: { "c": 11, "m": 20, "y": 0, "k": 0 }, rgb: { "r": 215, "g": 198, "b": 230 }, lab: { "l": 82.13537185720024, "a": 11.80015138417706, "b": -13.687468792272671 } },
        { name: "264C", cmyk: { "c": 23, "m": 34, "y": 0, "k": 0 }, rgb: { "r": 193, "g": 167, "b": 226 }, lab: { "l": 72.53879519878522, "a": 20.74890414976627, "b": -26.2422796042183 } },
        { name: "265C", cmyk: { "c": 54, "m": 67, "y": 0, "k": 0 }, rgb: { "r": 144, "g": 99, "b": 205 }, lab: { "l": 50.99088636842478, "a": 39.86063120107086, "b": -48.5153596383924 } },
        { name: "266C", cmyk: { "c": 71, "m": 88, "y": 0, "k": 0 }, rgb: { "r": 117, "g": 59, "b": 189 }, lab: { "l": 38.87072787504688, "a": 51.07341976097723, "b": -58.90333968722163 } },
        { name: "267C", cmyk: { "c": 81, "m": 99, "y": 0, "k": 0 }, rgb: { "r": 95, "g": 36, "b": 159 }, lab: { "l": 29.906239818341867, "a": 50.200888245213044, "b": -55.71510684922193 } },
        { name: "268C", cmyk: { "c": 79, "m": 100, "y": 0, "k": 0 }, rgb: { "r": 88, "g": 44, "b": 131 }, lab: { "l": 28.153688327566684, "a": 37.76393189836166, "b": -41.34182673927809 } },
        { name: "269C", cmyk: { "c": 76, "m": 100, "y": 0, "k": 18 }, rgb: { "r": 81, "g": 45, "b": 109 }, lab: { "l": 25.95194066025742, "a": 29.6705040541122, "b": -30.97933844966876 } },
        { name: "270C", cmyk: { "c": 29, "m": 23, "y": 0, "k": 0 }, rgb: { "r": 180, "g": 181, "b": 223 }, lab: { "l": 74.87457738741284, "a": 8.303298539350967, "b": -21.140240399981746 } },
        { name: "271C", cmyk: { "c": 44, "m": 38, "y": 0, "k": 0 }, rgb: { "r": 149, "g": 149, "b": 210 }, lab: { "l": 63.78473602902436, "a": 13.712034438370823, "b": -31.204521828403454 } },
        { name: "272C", cmyk: { "c": 61, "m": 55, "y": 0, "k": 0 }, rgb: { "r": 116, "g": 116, "b": 193 }, lab: { "l": 51.898257267509535, "a": 19.244374234813456, "b": -40.366149381579675 } },
        { name: "273C", cmyk: { "c": 98, "m": 97, "y": 0, "k": 37 }, rgb: { "r": 36, "g": 18, "b": 95 }, lab: { "l": 13.435188730847706, "a": 31.30413064928625, "b": -42.35046608172669 } },
        { name: "274C", cmyk: { "c": 98, "m": 97, "y": 0, "k": 49 }, rgb: { "r": 34, "g": 21, "b": 81 }, lab: { "l": 12.419230924211405, "a": 24.456712060835052, "b": -34.56277113296859 } },
        { name: "275C", cmyk: { "c": 98, "m": 99, "y": 0, "k": 58 }, rgb: { "r": 33, "g": 23, "b": 71 }, lab: { "l": 11.897997832638993, "a": 19.40144415349551, "b": -28.51391839234495 } },
        { name: "276C", cmyk: { "c": 94, "m": 93, "y": 0, "k": 79 }, rgb: { "r": 34, "g": 28, "b": 53 }, lab: { "l": 12.140377876892366, "a": 9.913138488962817, "b": -15.39419652737773 } },
        { name: "277C", cmyk: { "c": 32, "m": 8, "y": 0, "k": 0 }, rgb: { "r": 171, "g": 202, "b": 233 }, lab: { "l": 80.05692353924815, "a": -3.472760900118277, "b": -18.7394269127781 } },
        { name: "278C", cmyk: { "c": 43, "m": 17, "y": 0, "k": 0 }, rgb: { "r": 139, "g": 184, "b": 232 }, lab: { "l": 73.28270833701576, "a": -2.9359470695318746, "b": -28.69907508278715 } },
        { name: "279C", cmyk: { "c": 69, "m": 34, "y": 0, "k": 0 }, rgb: { "r": 65, "g": 143, "b": 222 }, lab: { "l": 58.07752529688054, "a": 1.857365638399222, "b": -47.17079166822573 } },
        { name: "280C", cmyk: { "c": 100, "m": 85, "y": 0, "k": 39 }, rgb: { "r": 1, "g": 33, "b": 105 }, lab: { "l": 16.074921395230632, "a": 21.60336349843198, "b": -44.6949142317384 } },
        { name: "281C", cmyk: { "c": 100, "m": 78, "y": 0, "k": 57 }, rgb: { "r": 0, "g": 32, "b": 91 }, lab: { "l": 14.334898311251198, "a": 16.032552439624066, "b": -38.2812586986647 } },
        { name: "282C", cmyk: { "c": 100, "m": 72, "y": 0, "k": 73 }, rgb: { "r": 4, "g": 30, "b": 66 }, lab: { "l": 11.605124505147753, "a": 6.364982907548944, "b": -25.591914417465567 } },
        { name: "283C", cmyk: { "c": 41, "m": 11, "y": 0, "k": 0 }, rgb: { "r": 146, "g": 193, "b": 233 }, lab: { "l": 76.15150534719305, "a": -5.690986402048292, "b": -24.811369503995408 } },
        { name: "284C", cmyk: { "c": 54, "m": 19, "y": 0, "k": 0 }, rgb: { "r": 108, "g": 172, "b": 228 }, lab: { "l": 68.23720446093131, "a": -4.912448868378105, "b": -34.44018627199876 } },
        { name: "285C", cmyk: { "c": 90, "m": 47, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 114, "b": 206 }, lab: { "l": 47.61200449950369, "a": 8.392770198147382, "b": -54.901820223102796 } },
        { name: "286C", cmyk: { "c": 100, "m": 80, "y": 0, "k": 12 }, rgb: { "r": 0, "g": 50, "b": 160 }, lab: { "l": 26.213535944952284, "a": 32.36834750145853, "b": -62.629003158389686 } },
        { name: "287C", cmyk: { "c": 100, "m": 81, "y": 0, "k": 23 }, rgb: { "r": 0, "g": 48, "b": 135 }, lab: { "l": 23.21384530483771, "a": 23.54712050623223, "b": -52.1554550767273 } },
        { name: "288C", cmyk: { "c": 100, "m": 79, "y": 0, "k": 37 }, rgb: { "r": 0, "g": 45, "b": 114 }, lab: { "l": 20.40737550127057, "a": 16.635744901244642, "b": -43.43886479096136 } },
        { name: "289C", cmyk: { "c": 100, "m": 66, "y": 0, "k": 76 }, rgb: { "r": 12, "g": 35, "b": 64 }, lab: { "l": 13.533867327378939, "a": 2.89358474799728, "b": -21.082167389775798 } },
        { name: "290C", cmyk: { "c": 25, "m": 1, "y": 0, "k": 0 }, rgb: { "r": 185, "g": 217, "b": 235 }, lab: { "l": 84.9648610788484, "a": -6.714650733990135, "b": -12.340210913173655 } },
        { name: "291C", cmyk: { "c": 38, "m": 4, "y": 0, "k": 0 }, rgb: { "r": 155, "g": 203, "b": 235 }, lab: { "l": 79.43054542792356, "a": -8.06433257992506, "b": -20.85029400719303 } },
        { name: "292C", cmyk: { "c": 55, "m": 13, "y": 0, "k": 0 }, rgb: { "r": 105, "g": 179, "b": 231 }, lab: { "l": 70.18501458125797, "a": -8.489841463692471, "b": -33.07155688510095 } },
        { name: "293C", cmyk: { "c": 100, "m": 76, "y": 0, "k": 9 }, rgb: { "r": 0, "g": 61, "b": 165 }, lab: { "l": 29.54854489138421, "a": 26.916923729948444, "b": -60.172914431124916 } },
        { name: "294C", cmyk: { "c": 100, "m": 74, "y": 0, "k": 45 }, rgb: { "r": 0, "g": 47, "b": 108 }, lab: { "l": 20.50158533532114, "a": 12.47670196318329, "b": -39.41596180278313 } },
        { name: "295C", cmyk: { "c": 100, "m": 63, "y": 0, "k": 67 }, rgb: { "r": 0, "g": 40, "b": 85 }, lab: { "l": 16.372426856017, "a": 7.120695447223796, "b": -30.94199020553682 } },
        { name: "296C", cmyk: { "c": 100, "m": 46, "y": 0, "k": 89 }, rgb: { "r": 5, "g": 28, "b": 44 }, lab: { "l": 9.357767775078088, "a": -2.263569270552504, "b": -13.391145020833173 } },
        { name: "297C", cmyk: { "c": 52, "m": 0, "y": 0, "k": 0 }, rgb: { "r": 113, "g": 197, "b": 232 }, lab: { "l": 75.61862669289943, "a": -16.0697880561434, "b": -25.22966300439158 } },
        { name: "298C", cmyk: { "c": 65, "m": 3, "y": 0, "k": 0 }, rgb: { "r": 65, "g": 182, "b": 230 }, lab: { "l": 69.67763029176707, "a": -17.20232182069703, "b": -33.41804886477118 } },
        { name: "299C", cmyk: { "c": 79, "m": 7, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 163, "b": 224 }, lab: { "l": 62.991063757548204, "a": -13.623931862828286, "b": -40.60792403118365 } },
        { name: "300C", cmyk: { "c": 100, "m": 56, "y": 0, "k": 3 }, rgb: { "r": 0, "g": 94, "b": 184 }, lab: { "l": 40.35466655801712, "a": 12.40407293542517, "b": -53.873039547426146 } },
        { name: "301C", cmyk: { "c": 100, "m": 51, "y": 0, "k": 34 }, rgb: { "r": 0, "g": 75, "b": 135 }, lab: { "l": 31.304045476116563, "a": 4.5753205026345665, "b": -39.03159630606109 } },
        { name: "302C", cmyk: { "c": 100, "m": 32, "y": 0, "k": 68 }, rgb: { "r": 0, "g": 59, "b": 92 }, lab: { "l": 23.34019132154547, "a": -3.291112480432373, "b": -24.44797244109712 } },
        { name: "303C", cmyk: { "c": 100, "m": 33, "y": 6, "k": 84 }, rgb: { "r": 0, "g": 42, "b": 58 }, lab: { "l": 15.283450162625225, "a": -6.9211358207863505, "b": -14.159014701635675 } },
        { name: "304C", cmyk: { "c": 35, "m": 0, "y": 2, "k": 0 }, rgb: { "r": 154, "g": 219, "b": 232 }, lab: { "l": 83.63104331426408, "a": -17.323076030814565, "b": -12.930294219428152 } },
        { name: "305C", cmyk: { "c": 55, "m": 0, "y": 1, "k": 0 }, rgb: { "r": 89, "g": 203, "b": 232 }, lab: { "l": 76.47376092382791, "a": -23.770651875535897, "b": -24.00113818190437 } },
        { name: "306C", cmyk: { "c": 76, "m": 0, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 181, "b": 226 }, lab: { "l": 68.41581225686525, "a": -22.480734209164797, "b": -33.2532432228743 } },
        { name: "307C", cmyk: { "c": 100, "m": 20, "y": 0, "k": 25 }, rgb: { "r": 0, "g": 107, "b": 166 }, lab: { "l": 43.16514901594758, "a": -3.213375286713338, "b": -38.799566900113525 } },
        { name: "308C", cmyk: { "c": 100, "m": 10, "y": 0, "k": 52 }, rgb: { "r": 0, "g": 88, "b": 124 }, lab: { "l": 34.87224631099043, "a": -8.425768842414028, "b": -26.583947533701892 } },
        { name: "309C", cmyk: { "c": 100, "m": 8, "y": 20, "k": 76 }, rgb: { "r": 0, "g": 59, "b": 73 }, lab: { "l": 22.33413687150518, "a": -11.42825693958685, "b": -13.466483480331926 } },
        { name: "310C", cmyk: { "c": 50, "m": 0, "y": 4, "k": 0 }, rgb: { "r": 106, "g": 209, "b": 227 }, lab: { "l": 78.58469446886957, "a": -25.02139021838762, "b": -18.061202970419068 } },
        { name: "311C", cmyk: { "c": 65, "m": 0, "y": 6, "k": 0 }, rgb: { "r": 5, "g": 195, "b": 221 }, lab: { "l": 72.41720723170602, "a": -31.009487788519696, "b": -24.370018280831452 } },
        { name: "312C", cmyk: { "c": 92, "m": 0, "y": 12, "k": 0 }, rgb: { "r": 0, "g": 169, "b": 206 }, lab: { "l": 64.02478178731383, "a": -23.177938070120085, "b": -29.03061857952549 } },
        { name: "313C", cmyk: { "c": 100, "m": 0, "y": 11, "k": 6 }, rgb: { "r": 0, "g": 146, "b": 188 }, lab: { "l": 56.276140534084234, "a": -17.366955042295295, "b": -30.936843597444774 } },
        { name: "314C", cmyk: { "c": 100, "m": 0, "y": 13, "k": 22 }, rgb: { "r": 0, "g": 127, "b": 163 }, lab: { "l": 49.280825217696616, "a": -16.071613547088692, "b": -27.44089352992505 } },
        { name: "315C", cmyk: { "c": 100, "m": 0, "y": 17, "k": 44 }, rgb: { "r": 0, "g": 103, "b": 127 }, lab: { "l": 39.969834313586794, "a": -16.077484222005943, "b": -20.483696921401506 } },
        { name: "316C", cmyk: { "c": 100, "m": 10, "y": 29, "k": 68 }, rgb: { "r": 0, "g": 72, "b": 81 }, lab: { "l": 27.37694527221361, "a": -15.961687680806108, "b": -11.001258566619098 } },
        { name: "317C", cmyk: { "c": 26, "m": 0, "y": 6, "k": 0 }, rgb: { "r": 177, "g": 228, "b": 227 }, lab: { "l": 87.18288753312355, "a": -16.456277733807532, "b": -4.8774174696633255 } },
        { name: "318C", cmyk: { "c": 39, "m": 0, "y": 9, "k": 0 }, rgb: { "r": 136, "g": 219, "b": 223 }, lab: { "l": 82.49954585612346, "a": -24.183575744109454, "b": -9.932260681944506 } },
        { name: "319C", cmyk: { "c": 60, "m": 0, "y": 16, "k": 0 }, rgb: { "r": 44, "g": 204, "b": 211 }, lab: { "l": 75.0917957477726, "a": -36.35092075225322, "b": -14.86786758944132 } },
        { name: "320C", cmyk: { "c": 100, "m": 0, "y": 36, "k": 1 }, rgb: { "r": 0, "g": 156, "b": 166 }, lab: { "l": 58.5368428555081, "a": -30.103144190206876, "b": -14.975554165596972 } },
        { name: "321C", cmyk: { "c": 100, "m": 0, "y": 37, "k": 10 }, rgb: { "r": 0, "g": 140, "b": 149 }, lab: { "l": 52.868513306978954, "a": -27.83433490198306, "b": -13.806113996771984 } },
        { name: "322C", cmyk: { "c": 100, "m": 0, "y": 39, "k": 33 }, rgb: { "r": 0, "g": 115, "b": 119 }, lab: { "l": 43.64404781168047, "a": -25.367218605749446, "b": -10.04938493968497 } },
        { name: "323C", cmyk: { "c": 100, "m": 0, "y": 41, "k": 51 }, rgb: { "r": 0, "g": 95, "b": 97 }, lab: { "l": 36.07556045346015, "a": -22.651289335519603, "b": -8.000439442238417 } },
        { name: "324C", cmyk: { "c": 34, "m": 0, "y": 10, "k": 0 }, rgb: { "r": 156, "g": 219, "b": 217 }, lab: { "l": 83.30576573594618, "a": -20.2436267607628, "b": -5.442670945174721 } },
        { name: "325C", cmyk: { "c": 54, "m": 0, "y": 20, "k": 0 }, rgb: { "r": 100, "g": 204, "b": 201 }, lab: { "l": 76.13801764009426, "a": -30.7825064206681, "b": -7.76324490544027 } },
        { name: "326C", cmyk: { "c": 81, "m": 0, "y": 38, "k": 0 }, rgb: { "r": 0, "g": 178, "b": 169 }, lab: { "l": 65.51862574180404, "a": -39.42654629000669, "b": -6.2062388226235 } },
        { name: "327C", cmyk: { "c": 100, "m": 0, "y": 59, "k": 13 }, rgb: { "r": 0, "g": 134, "b": 117 }, lab: { "l": 49.899390596296925, "a": -35.069539069402886, "b": 0.4059473841026007 } },
        { name: "328C", cmyk: { "c": 100, "m": 0, "y": 56, "k": 30 }, rgb: { "r": 0, "g": 115, "b": 103 }, lab: { "l": 43.123764290674046, "a": -30.55824442960664, "b": -1.2079414608304306 } },
        { name: "329C", cmyk: { "c": 100, "m": 0, "y": 55, "k": 42 }, rgb: { "r": 0, "g": 104, "b": 94 }, lab: { "l": 39.08558992905294, "a": -28.147528048570763, "b": -1.6786169948445062 } },
        { name: "330C", cmyk: { "c": 93, "m": 14, "y": 53, "k": 57 }, rgb: { "r": 0, "g": 83, "b": 76 }, lab: { "l": 31.133441974647496, "a": -23.659995789044125, "b": -2.1538633622468883 } },
        { name: "331C", cmyk: { "c": 27, "m": 0, "y": 15, "k": 0 }, rgb: { "r": 167, "g": 230, "b": 215 }, lab: { "l": 86.85709674740623, "a": -22.94196760107581, "b": 0.8919722009247844 } },
        { name: "332C", cmyk: { "c": 35, "m": 0, "y": 21, "k": 0 }, rgb: { "r": 140, "g": 226, "b": 208 }, lab: { "l": 84.23693408497765, "a": -30.05830337336818, "b": 0.5995854895917807 } },
        { name: "333C", cmyk: { "c": 54, "m": 0, "y": 34, "k": 0 }, rgb: { "r": 60, "g": 219, "b": 192 }, lab: { "l": 79.28800183041645, "a": -46.59979192678642, "b": 1.5756847343249003 } },
        { name: "334C", cmyk: { "c": 100, "m": 0, "y": 68, "k": 1 }, rgb: { "r": 0, "g": 151, "b": 117 }, lab: { "l": 55.49987385351288, "a": -42.39754222650471, "b": 8.465805454477726 } },
        { name: "335C", cmyk: { "c": 100, "m": 0, "y": 67, "k": 23 }, rgb: { "r": 0, "g": 123, "b": 95 }, lab: { "l": 45.623431245602916, "a": -36.47479280460239, "b": 7.167558271017027 } },
        { name: "336C", cmyk: { "c": 99, "m": 1, "y": 67, "k": 45 }, rgb: { "r": 0, "g": 102, "b": 79 }, lab: { "l": 37.96286759979713, "a": -31.729468258306415, "b": 5.868167631347299 } },
        { name: "337C", cmyk: { "c": 40, "m": 0, "y": 29, "k": 0 }, rgb: { "r": 143, "g": 214, "b": 189 }, lab: { "l": 80.51974170364717, "a": -27.611039770411516, "b": 5.3048593004340505 } },
        { name: "338C", cmyk: { "c": 52, "m": 0, "y": 36, "k": 0 }, rgb: { "r": 110, "g": 206, "b": 178 }, lab: { "l": 76.47987435120285, "a": -35.06481369305503, "b": 5.174130559626167 } },
        { name: "339C", cmyk: { "c": 79, "m": 0, "y": 60, "k": 0 }, rgb: { "r": 0, "g": 179, "b": 136 }, lab: { "l": 64.97667643342847, "a": -48.87245604710277, "b": 11.269427490030171 } },
        { name: "340C", cmyk: { "c": 100, "m": 0, "y": 81, "k": 0 }, rgb: { "r": 0, "g": 150, "b": 94 }, lab: { "l": 54.67962925678688, "a": -47.523196258309916, "b": 20.260375071796588 } },
        { name: "341C", cmyk: { "c": 95, "m": 1, "y": 75, "k": 26 }, rgb: { "r": 0, "g": 122, "b": 83 }, lab: { "l": 45.002640711519156, "a": -39.1638638815589, "b": 13.340809018787514 } },
        { name: "342C", cmyk: { "c": 93, "m": 4, "y": 75, "k": 43 }, rgb: { "r": 0, "g": 103, "b": 71 }, lab: { "l": 38.11995173642342, "a": -34.32702790764897, "b": 10.94212341566635 } },
        { name: "343C", cmyk: { "c": 87, "m": 13, "y": 72, "k": 56 }, rgb: { "r": 17, "g": 87, "b": 64 }, lab: { "l": 32.49300737617776, "a": -27.276085868295414, "b": 7.416542415494776 } },
        { name: "344C", cmyk: { "c": 35, "m": 0, "y": 35, "k": 0 }, rgb: { "r": 160, "g": 218, "b": 179 }, lab: { "l": 82.30937904201042, "a": -26.39168112800577, "b": 13.285732990121769 } },
        { name: "345C", cmyk: { "c": 40, "m": 0, "y": 38, "k": 0 }, rgb: { "r": 145, "g": 214, "b": 172 }, lab: { "l": 80.23099455718766, "a": -30.446690900645613, "b": 13.939732418624118 } },
        { name: "346C", cmyk: { "c": 52, "m": 0, "y": 50, "k": 0 }, rgb: { "r": 113, "g": 204, "b": 152 }, lab: { "l": 75.42857775310233, "a": -38.90774399691532, "b": 17.617880951823906 } },
        { name: "347C", cmyk: { "c": 92, "m": 0, "y": 97, "k": 0 }, rgb: { "r": 0, "g": 154, "b": 68 }, lab: { "l": 55.612651942633875, "a": -53.736523617183394, "b": 35.24553789959229 } },
        { name: "348C", cmyk: { "c": 93, "m": 0, "y": 98, "k": 17 }, rgb: { "r": 0, "g": 132, "b": 61 }, lab: { "l": 48.05710272238127, "a": -47.42444306606597, "b": 29.61975545464911 } },
        { name: "349C", cmyk: { "c": 85, "m": 3, "y": 91, "k": 44 }, rgb: { "r": 4, "g": 106, "b": 56 }, lab: { "l": 38.93191046121688, "a": -38.601448082111936, "b": 20.87166843913717 } },
        { name: "350C", cmyk: { "c": 74, "m": 18, "y": 81, "k": 62 }, rgb: { "r": 44, "g": 82, "b": 52 }, lab: { "l": 31.388922379689717, "a": -21.05497848988616, "b": 13.499960428288349 } },
        { name: "351C", cmyk: { "c": 32, "m": 0, "y": 33, "k": 0 }, rgb: { "r": 162, "g": 228, "b": 184 }, lab: { "l": 85.31618411827156, "a": -29.62427793740835, "b": 14.916454744880593 } },
        { name: "352C", cmyk: { "c": 37, "m": 0, "y": 38, "k": 0 }, rgb: { "r": 143, "g": 226, "b": 176 }, lab: { "l": 83.63507172395866, "a": -35.875217452218834, "b": 16.602808430285965 } },
        { name: "353C", cmyk: { "c": 42, "m": 0, "y": 44, "k": 0 }, rgb: { "r": 128, "g": 224, "b": 167 }, lab: { "l": 82.21208955635996, "a": -40.886336768679755, "b": 19.22575418280099 } },
        { name: "354C", cmyk: { "c": 85, "m": 0, "y": 98, "k": 0 }, rgb: { "r": 0, "g": 177, "b": 64 }, lab: { "l": 63.189228791085, "a": -61.580359182207225, "b": 45.95658993097255 } },
        { name: "355C", cmyk: { "c": 93, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 0, "g": 151, "b": 57 }, lab: { "l": 54.47886036898163, "a": -54.320619514952675, "b": 39.24831126663221 } },
        { name: "356C", cmyk: { "c": 91, "m": 0, "y": 100, "k": 26 }, rgb: { "r": 0, "g": 122, "b": 51 }, lab: { "l": 44.45879409255075, "a": -45.596611415139265, "b": 30.45819347525166 } },
        { name: "357C", cmyk: { "c": 80, "m": 9, "y": 88, "k": 60 }, rgb: { "r": 33, "g": 87, "b": 50 }, lab: { "l": 32.634829219346166, "a": -27.274418394553773, "b": 16.29242974874542 } },
        { name: "358C", cmyk: { "c": 32, "m": 0, "y": 51, "k": 0 }, rgb: { "r": 173, "g": 220, "b": 145 }, lab: { "l": 82.9745224700584, "a": -28.614686567920046, "b": 32.02884691143319 } },
        { name: "359C", cmyk: { "c": 38, "m": 0, "y": 58, "k": 0 }, rgb: { "r": 161, "g": 216, "b": 132 }, lab: { "l": 80.93561679167416, "a": -32.74735552982355, "b": 35.83473719580583 } },
        { name: "360C", cmyk: { "c": 59, "m": 0, "y": 90, "k": 0 }, rgb: { "r": 108, "g": 194, "b": 74 }, lab: { "l": 71.05401769135318, "a": -47.72110063049762, "b": 51.03635617863023 } },
        { name: "361C", cmyk: { "c": 68, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 67, "g": 176, "b": 42 }, lab: { "l": 63.68123077775, "a": -54.956428370320054, "b": 55.454922258221686 } },
        { name: "362C", cmyk: { "c": 66, "m": 0, "y": 100, "k": 9 }, rgb: { "r": 80, "g": 158, "b": 47 }, lab: { "l": 58.381359657943236, "a": -44.25508090706942, "b": 48.38238736483827 } },
        { name: "363C", cmyk: { "c": 64, "m": 0, "y": 100, "k": 24 }, rgb: { "r": 76, "g": 141, "b": 43 }, lab: { "l": 52.68656234542418, "a": -38.835051602631395, "b": 44.000979578457155 } },
        { name: "364C", cmyk: { "c": 59, "m": 0, "y": 100, "k": 43 }, rgb: { "r": 74, "g": 119, "b": 41 }, lab: { "l": 45.372294890939585, "a": -29.9091224703511, "b": 36.98136533300281 } },
        { name: "365C", cmyk: { "c": 23, "m": 0, "y": 56, "k": 0 }, rgb: { "r": 194, "g": 225, "b": 137 }, lab: { "l": 85.56748654793249, "a": -24.47239252800881, "b": 39.704810338369526 } },
        { name: "366C", cmyk: { "c": 29, "m": 0, "y": 64, "k": 0 }, rgb: { "r": 183, "g": 221, "b": 121 }, lab: { "l": 83.52683781716338, "a": -28.524241027695464, "b": 44.86094086501675 } },
        { name: "367C", cmyk: { "c": 37, "m": 0, "y": 77, "k": 0 }, rgb: { "r": 164, "g": 214, "b": 94 }, lab: { "l": 80.06347615297898, "a": -35.121752191782484, "b": 53.141481324195496 } },
        { name: "368C", cmyk: { "c": 54, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 120, "g": 190, "b": 33 }, lab: { "l": 70.12670167771523, "a": -44.8660762497029, "b": 64.9165637637287 } },
        { name: "369C", cmyk: { "c": 58, "m": 0, "y": 100, "k": 4 }, rgb: { "r": 100, "g": 167, "b": 11 }, lab: { "l": 61.972951295789514, "a": -43.047734613864904, "b": 62.012311868685025 } },
        { name: "370C", cmyk: { "c": 49, "m": 0, "y": 100, "k": 30 }, rgb: { "r": 101, "g": 141, "b": 27 }, lab: { "l": 53.91604421844647, "a": -30.6243031119392, "b": 51.56163415022357 } },
        { name: "371C", cmyk: { "c": 40, "m": 10, "y": 98, "k": 59 }, rgb: { "r": 84, "g": 98, "b": 35 }, lab: { "l": 39.14168904578, "a": -15.60943110818952, "b": 33.19440284486724 } },
        { name: "372C", cmyk: { "c": 15, "m": 0, "y": 53, "k": 0 }, rgb: { "r": 212, "g": 236, "b": 142 }, lab: { "l": 89.83191646098165, "a": -22.471947224941225, "b": 42.92879781315329 } },
        { name: "373C", cmyk: { "c": 18, "m": 0, "y": 60, "k": 0 }, rgb: { "r": 205, "g": 234, "b": 128 }, lab: { "l": 88.63019638908462, "a": -25.68858276951136, "b": 48.11640082195656 } },
        { name: "374C", cmyk: { "c": 23, "m": 0, "y": 69, "k": 0 }, rgb: { "r": 197, "g": 232, "b": 108 }, lab: { "l": 87.32260364063767, "a": -29.73918734620623, "b": 55.75568965487987 } },
        { name: "375C", cmyk: { "c": 40, "m": 0, "y": 98, "k": 0 }, rgb: { "r": 151, "g": 215, "b": 0 }, lab: { "l": 79.14494319270464, "a": -44.818051564688375, "b": 77.90923250522012 } },
        { name: "376C", cmyk: { "c": 48, "m": 0, "y": 100, "k": 1 }, rgb: { "r": 132, "g": 189, "b": 0 }, lab: { "l": 70.38610299460376, "a": -40.800586399168445, "b": 70.73133705030462 } },
        { name: "377C", cmyk: { "c": 41, "m": 0, "y": 100, "k": 22 }, rgb: { "r": 122, "g": 154, "b": 1 }, lab: { "l": 59.20591018221191, "a": -28.828992963602918, "b": 61.78850550120977 } },
        { name: "378C", cmyk: { "c": 32, "m": 9, "y": 100, "k": 60 }, rgb: { "r": 89, "g": 98, "b": 29 }, lab: { "l": 39.492616130001394, "a": -13.7763984250778, "b": 36.52783437476018 } },
        { name: "379C", cmyk: { "c": 9, "m": 0, "y": 69, "k": 0 }, rgb: { "r": 226, "g": 232, "b": 104 }, lab: { "l": 89.33743596780346, "a": -18.73832162093886, "b": 60.3941996740583 } },
        { name: "380C", cmyk: { "c": 13, "m": 0, "y": 83, "k": 0 }, rgb: { "r": 219, "g": 228, "b": 66 }, lab: { "l": 87.45595715709648, "a": -21.978381469778874, "b": 73.28886766981984 } },
        { name: "381C", cmyk: { "c": 18, "m": 0, "y": 99, "k": 0 }, rgb: { "r": 206, "g": 220, "b": 0 }, lab: { "l": 84.12598414897373, "a": -25.152872450333653, "b": 83.23887978335144 } },
        { name: "382C", cmyk: { "c": 22, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 196, "g": 214, "b": 0 }, lab: { "l": 81.74509835447095, "a": -26.456626045929355, "b": 81.14449627914489 } },
        { name: "383C", cmyk: { "c": 19, "m": 0, "y": 100, "k": 18 }, rgb: { "r": 168, "g": 173, "b": 0 }, lab: { "l": 68.17655274683382, "a": -18.31599507469267, "b": 70.15355470544785 } },
        { name: "384C", cmyk: { "c": 14, "m": 0, "y": 100, "k": 35 }, rgb: { "r": 148, "g": 147, "b": 0 }, lab: { "l": 59.12520910957414, "a": -13.842476040222317, "b": 62.7673863442361 } },
        { name: "385C", cmyk: { "c": 17, "m": 15, "y": 96, "k": 52 }, rgb: { "r": 120, "g": 113, "b": 33 }, lab: { "l": 46.86031064372994, "a": -7.361326359733744, "b": 43.15634096799079 } },
        { name: "386C", cmyk: { "c": 6, "m": 0, "y": 67, "k": 0 }, rgb: { "r": 233, "g": 236, "b": 107 }, lab: { "l": 90.95124288929738, "a": -17.66690508042351, "b": 61.0452189430031 } },
        { name: "387C", cmyk: { "c": 10, "m": 0, "y": 86, "k": 0 }, rgb: { "r": 227, "g": 233, "b": 53 }, lab: { "l": 89.33007783966055, "a": -21.639621625590465, "b": 79.28450924498614 } },
        { name: "388C", cmyk: { "c": 11, "m": 0, "y": 91, "k": 0 }, rgb: { "r": 224, "g": 231, "b": 34 }, lab: { "l": 88.50234937494491, "a": -22.466180971376872, "b": 83.01389501470486 } },
        { name: "389C", cmyk: { "c": 15, "m": 0, "y": 99, "k": 0 }, rgb: { "r": 208, "g": 223, "b": 0 }, lab: { "l": 85.09082137651997, "a": -25.75135673064488, "b": 84.01933795094764 } },
        { name: "390C", cmyk: { "c": 20, "m": 0, "y": 100, "k": 8 }, rgb: { "r": 181, "g": 189, "b": 0 }, lab: { "l": 73.68738151446169, "a": -20.668594916814833, "b": 74.67491228246014 } },
        { name: "391C", cmyk: { "c": 10, "m": 0, "y": 100, "k": 35 }, rgb: { "r": 154, "g": 149, "b": 0 }, lab: { "l": 60.21699594086134, "a": -12.168127465289501, "b": 63.79956360126655 } },
        { name: "392C", cmyk: { "c": 9, "m": 7, "y": 100, "k": 49 }, rgb: { "r": 130, "g": 122, "b": 4 }, lab: { "l": 50.303196662383954, "a": -8.63895509742263, "b": 54.82194666728317 } },
        { name: "393C", cmyk: { "c": 3, "m": 0, "y": 63, "k": 0 }, rgb: { "r": 240, "g": 236, "b": 116 }, lab: { "l": 91.58476662073085, "a": -14.174372358938037, "b": 57.88467637149128 } },
        { name: "394C", cmyk: { "c": 5, "m": 0, "y": 84, "k": 0 }, rgb: { "r": 237, "g": 233, "b": 57 }, lab: { "l": 90.12691527849208, "a": -17.374286572203744, "b": 79.14389760002409 } },
        { name: "395C", cmyk: { "c": 6, "m": 0, "y": 92, "k": 0 }, rgb: { "r": 236, "g": 232, "b": 26 }, lab: { "l": 89.68292791178224, "a": -18.11903513961005, "b": 85.74119251475287 } },
        { name: "396C", cmyk: { "c": 7, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 225, "g": 224, "b": 0 }, lab: { "l": 86.6617022455721, "a": -19.124406997997887, "b": 85.76102520419177 } },
        { name: "397C", cmyk: { "c": 11, "m": 0, "y": 100, "k": 13 }, rgb: { "r": 191, "g": 184, "b": 0 }, lab: { "l": 73.1265711540102, "a": -13.81108373905937, "b": 74.63287639350595 } },
        { name: "398C", cmyk: { "c": 8, "m": 0, "y": 100, "k": 26 }, rgb: { "r": 173, "g": 164, "b": 0 }, lab: { "l": 66.08606495166647, "a": -11.472098586103819, "b": 68.81837189738732 } },
        { name: "399C", cmyk: { "c": 2, "m": 5, "y": 100, "k": 36 }, rgb: { "r": 160, "g": 146, "b": 0 }, lab: { "l": 59.91705220034649, "a": -7.828768351277882, "b": 63.83011773770142 } },
        { name: "400C", cmyk: { "c": 20, "m": 17, "y": 19, "k": 0 }, rgb: { "r": 196, "g": 191, "b": 182 }, lab: { "l": 77.50439354294804, "a": 0.15810271145405563, "b": 5.146215346174454 } },
        { name: "401C", cmyk: { "c": 28, "m": 25, "y": 28, "k": 3 }, rgb: { "r": 175, "g": 169, "b": 160 }, lab: { "l": 69.48944012358668, "a": 0.5382185928114458, "b": 5.3962603076605165 } },
        { name: "402C", cmyk: { "c": 34, "m": 30, "y": 33, "k": 8 }, rgb: { "r": 157, "g": 150, "b": 141 }, lab: { "l": 62.426407034713506, "a": 0.939111443336138, "b": 5.652290088646272 } },
        { name: "403C", cmyk: { "c": 39, "m": 36, "y": 40, "k": 14 }, rgb: { "r": 140, "g": 133, "b": 123 }, lab: { "l": 55.86742067373919, "a": 0.7982370966285179, "b": 6.322032510603748 } },
        { name: "404C", cmyk: { "c": 45, "m": 43, "y": 47, "k": 25 }, rgb: { "r": 119, "g": 110, "b": 100 }, lab: { "l": 46.966483525245685, "a": 1.6692002183971155, "b": 6.836245613880054 } },
        { name: "405C", cmyk: { "c": 49, "m": 47, "y": 51, "k": 32 }, rgb: { "r": 105, "g": 97, "b": 88 }, lab: { "l": 41.62205297534574, "a": 1.495525319417712, "b": 6.275895664435815 } },
        { name: "406C", cmyk: { "c": 20, "m": 19, "y": 17, "k": 0 }, rgb: { "r": 196, "g": 188, "b": 183 }, lab: { "l": 76.75230630555038, "a": 1.9279660686743472, "b": 3.517944349466662 } },
        { name: "408C", cmyk: { "c": 35, "m": 36, "y": 32, "k": 10 }, rgb: { "r": 151, "g": 140, "b": 135 }, lab: { "l": 59.05268697256926, "a": 3.1958989132578886, "b": 4.136286159087699 } },
        { name: "409C", cmyk: { "c": 40, "m": 42, "y": 40, "k": 18 }, rgb: { "r": 133, "g": 120, "b": 116 }, lab: { "l": 51.473970430412095, "a": 4.269993444630693, "b": 4.003218179386736 } },
        { name: "410C", cmyk: { "c": 45, "m": 48, "y": 45, "k": 26 }, rgb: { "r": 116, "g": 102, "b": 97 }, lab: { "l": 44.34574811366455, "a": 4.646501654966939, "b": 4.852718349912188 } },
        { name: "411C", cmyk: { "c": 51, "m": 55, "y": 52, "k": 39 }, rgb: { "r": 94, "g": 81, "b": 77 }, lab: { "l": 35.59705065524959, "a": 4.6320653049045095, "b": 4.3268591463177515 } },
        { name: "412C", cmyk: { "c": 61, "m": 68, "y": 64, "k": 74 }, rgb: { "r": 56, "g": 47, "b": 45 }, lab: { "l": 20.295425908263795, "a": 3.6663841251640408, "b": 2.786195551895365 } },
        { name: "413C", cmyk: { "c": 25, "m": 17, "y": 22, "k": 0 }, rgb: { "r": 186, "g": 187, "b": 177 }, lab: { "l": 75.54708095278434, "a": -2.16175595308149, "b": 4.929907155430602 } },
        { name: "414C", cmyk: { "c": 31, "m": 23, "y": 29, "k": 3 }, rgb: { "r": 168, "g": 169, "b": 158 }, lab: { "l": 68.87378716591175, "a": -2.378236969565739, "b": 5.542446711339122 } },
        { name: "415C", cmyk: { "c": 39, "m": 29, "y": 36, "k": 9 }, rgb: { "r": 145, "g": 147, "b": 136 }, lab: { "l": 60.48460982607028, "a": -2.808074257506621, "b": 5.562313209364356 } },
        { name: "416C", cmyk: { "c": 45, "m": 35, "y": 43, "k": 18 }, rgb: { "r": 126, "g": 127, "b": 116 }, lab: { "l": 52.81276704981603, "a": -2.4895063700454134, "b": 5.845750178148412 } },
        { name: "417C", cmyk: { "c": 53, "m": 42, "y": 52, "k": 31 }, rgb: { "r": 101, "g": 102, "b": 92 }, lab: { "l": 42.826687398871464, "a": -2.3828701054462442, "b": 5.515998773980602 } },
        { name: "418C", cmyk: { "c": 59, "m": 48, "y": 58, "k": 44 }, rgb: { "r": 81, "g": 83, "b": 74 }, lab: { "l": 34.86334366492579, "a": -2.6782357163830373, "b": 4.993319114542727 } },
        { name: "419C", cmyk: { "c": 76, "m": 65, "y": 66, "k": 90 }, rgb: { "r": 33, "g": 35, "b": 34 }, lab: { "l": 13.477079874467705, "a": -1.1689712255649465, "b": 0.34853093589778394 } },
        { name: "420C", cmyk: { "c": 18, "m": 13, "y": 10, "k": 0 }, rgb: { "r": 199, "g": 201, "b": 199 }, lab: { "l": 80.76042613067044, "a": -1.050077776166669, "b": 0.7465788359426018 } },
        { name: "421C", cmyk: { "c": 28, "m": 20, "y": 20, "k": 1 }, rgb: { "r": 178, "g": 180, "b": 178 }, lab: { "l": 73.10331341065663, "a": -1.0723462745228507, "b": 0.7631354531360879 } },
        { name: "422C", cmyk: { "c": 36, "m": 26, "y": 23, "k": 4 }, rgb: { "r": 158, "g": 162, "b": 162 }, lab: { "l": 66.30419545502487, "a": -1.4226609925525047, "b": -0.5061197726417221 } },
        { name: "423C", cmyk: { "c": 44, "m": 33, "y": 29, "k": 9 }, rgb: { "r": 137, "g": 141, "b": 141 }, lab: { "l": 58.312434454278204, "a": -1.4588394782621972, "b": -0.5174065145576723 } },
        { name: "424C", cmyk: { "c": 52, "m": 41, "y": 38, "k": 20 }, rgb: { "r": 112, "g": 115, "b": 114 }, lab: { "l": 48.160489163858315, "a": -1.341584442692112, "b": 0.14813791269112642 } },
        { name: "425C", cmyk: { "c": 63, "m": 51, "y": 45, "k": 33 }, rgb: { "r": 84, "g": 88, "b": 89 }, lab: { "l": 37.08804770464685, "a": -1.3619389825946515, "b": -1.1338811281875527 } },
        { name: "426C", cmyk: { "c": 81, "m": 67, "y": 55, "k": 83 }, rgb: { "r": 37, "g": 40, "b": 42 }, lab: { "l": 15.891705183308659, "a": -0.8280787173627346, "b": -1.7782686984012974 } },
        { name: "427C", cmyk: { "c": 14, "m": 8, "y": 4, "k": 0 }, rgb: { "r": 208, "g": 211, "b": 212 }, lab: { "l": 84.35572392908531, "a": -0.8318470889896457, "b": -0.8602631453560994 } },
        { name: "428C", cmyk: { "c": 21, "m": 13, "y": 8, "k": 0 }, rgb: { "r": 193, "g": 198, "b": 200 }, lab: { "l": 79.55445259963814, "a": -1.3365029144911111, "b": -1.607219197993337 } },
        { name: "429C", cmyk: { "c": 35, "m": 23, "y": 19, "k": 2 }, rgb: { "r": 162, "g": 170, "b": 173 }, lab: { "l": 69.07452191636843, "a": -2.2180558343378176, "b": -2.525186088556919 } },
        { name: "430C", cmyk: { "c": 50, "m": 34, "y": 27, "k": 11 }, rgb: { "r": 124, "g": 135, "b": 142 }, lab: { "l": 55.65064528819239, "a": -2.5028507770813446, "b": -5.125853092893373 } },
        { name: "431C", cmyk: { "c": 63, "m": 45, "y": 34, "k": 25 }, rgb: { "r": 91, "g": 103, "b": 112 }, lab: { "l": 42.90528107950164, "a": -2.4488957866727334, "b": -6.595161166478314 } },
        { name: "432C", cmyk: { "c": 78, "m": 57, "y": 39, "k": 56 }, rgb: { "r": 51, "g": 63, "b": 72 }, lab: { "l": 25.941505756130724, "a": -2.449330961517837, "b": -7.098911666975605 } },
        { name: "433C", cmyk: { "c": 88, "m": 63, "y": 40, "k": 85 }, rgb: { "r": 29, "g": 37, "b": 45 }, lab: { "l": 14.252425571496694, "a": -1.1453042064782648, "b": -6.438129020820393 } },
        { name: "434C", cmyk: { "c": 14, "m": 17, "y": 10, "k": 0 }, rgb: { "r": 208, "g": 196, "b": 197 }, lab: { "l": 80.13512295420307, "a": 4.367350354384792, "b": 0.995184986950326 } },
        { name: "435C", cmyk: { "c": 21, "m": 24, "y": 14, "k": 0 }, rgb: { "r": 193, "g": 178, "b": 182 }, lab: { "l": 73.90463962471044, "a": 6.0541011995524086, "b": -0.10968915647671107 } },
        { name: "436C", cmyk: { "c": 30, "m": 33, "y": 22, "k": 4 }, rgb: { "r": 171, "g": 152, "b": 157 }, lab: { "l": 64.60277211999347, "a": 7.8879485141758465, "b": -0.05991475159843329 } },
        { name: "437C", cmyk: { "c": 44, "m": 51, "y": 39, "k": 24 }, rgb: { "r": 123, "g": 100, "b": 105 }, lab: { "l": 44.72399968687821, "a": 10.103370527677013, "b": 0.6544833815534279 } },
        { name: "438C", cmyk: { "c": 52, "m": 62, "y": 51, "k": 47 }, rgb: { "r": 88, "g": 68, "b": 70 }, lab: { "l": 30.999170228029037, "a": 8.949670796336322, "b": 2.078693406790111 } },
        { name: "439C", cmyk: { "c": 56, "m": 68, "y": 59, "k": 64 }, rgb: { "r": 69, "g": 53, "b": 54 }, lab: { "l": 23.926854387950684, "a": 7.340786966904406, "b": 2.101931532260537 } },
        { name: "440C", cmyk: { "c": 61, "m": 69, "y": 63, "k": 75 }, rgb: { "r": 56, "g": 46, "b": 44 }, lab: { "l": 19.94990705259113, "a": 4.148122051778502, "b": 2.9775678586482113 } },
        { name: "441C", cmyk: { "c": 24, "m": 12, "y": 14, "k": 0 }, rgb: { "r": 190, "g": 198, "b": 196 }, lab: { "l": 79.22571479700152, "a": -3.114046370959911, "b": 0.03739863912111119 } },
        { name: "442C", cmyk: { "c": 36, "m": 20, "y": 23, "k": 2 }, rgb: { "r": 162, "g": 172, "b": 171 }, lab: { "l": 69.55968020938643, "a": -3.697632241045967, "b": -0.7077182750981459 } },
        { name: "443C", cmyk: { "c": 43, "m": 25, "y": 26, "k": 5 }, rgb: { "r": 145, "g": 157, "b": 157 }, lab: { "l": 63.80958314539579, "a": -4.257256797738029, "b": -1.474027910997866 } },
        { name: "444C", cmyk: { "c": 54, "m": 35, "y": 35, "k": 17 }, rgb: { "r": 113, "g": 124, "b": 125 }, lab: { "l": 51.15964944653719, "a": -3.849378126605685, "b": -1.946089222233649 } },
        { name: "445C", cmyk: { "c": 66, "m": 47, "y": 47, "k": 37 }, rgb: { "r": 80, "g": 87, "b": 89 }, lab: { "l": 36.44825510354276, "a": -2.3023197604920274, "b": -2.1128578085330973 } },
        { name: "446C", cmyk: { "c": 71, "m": 53, "y": 55, "k": 53 }, rgb: { "r": 63, "g": 68, "b": 67 }, lab: { "l": 28.370104645693047, "a": -2.2917282949644346, "b": -0.1112336354719301 } },
        { name: "447C", cmyk: { "c": 70, "m": 57, "y": 63, "k": 65 }, rgb: { "r": 55, "g": 58, "b": 54 }, lab: { "l": 24.014529749135264, "a": -2.192757884264873, "b": 2.0400811252526907 } },
        { name: "448C", cmyk: { "c": 39, "m": 47, "y": 81, "k": 67 }, rgb: { "r": 74, "g": 65, "b": 42 }, lab: { "l": 27.85501180515471, "a": -0.045542799100517506, "b": 15.455021343650287 } },
        { name: "449C", cmyk: { "c": 29, "m": 43, "y": 87, "k": 67 }, rgb: { "r": 82, "g": 70, "b": 39 }, lab: { "l": 30.20741384471384, "a": 0.31406360752067597, "b": 20.485300037054245 } },
        { name: "450C", cmyk: { "c": 25, "m": 42, "y": 88, "k": 64 }, rgb: { "r": 89, "g": 74, "b": 37 }, lab: { "l": 32.157146107138324, "a": 1.0320357173033146, "b": 24.225628124267462 } },
        { name: "451C", cmyk: { "c": 27, "m": 24, "y": 61, "k": 16 }, rgb: { "r": 155, "g": 148, "b": 95 }, lab: { "l": 60.75920123240756, "a": -5.5652566615759795, "b": 28.958815866821762 } },
        { name: "452C", cmyk: { "c": 24, "m": 20, "y": 48, "k": 6 }, rgb: { "r": 176, "g": 170, "b": 126 }, lab: { "l": 69.10179604774731, "a": -4.903562156258978, "b": 23.511777476132558 } },
        { name: "453C", cmyk: { "c": 20, "m": 16, "y": 37, "k": 2 }, rgb: { "r": 191, "g": 187, "b": 152 }, lab: { "l": 75.37911280034751, "a": -4.398051865446839, "b": 18.27023043923386 } },
        { name: "454C", cmyk: { "c": 17, "m": 12, "y": 29, "k": 0 }, rgb: { "r": 202, "g": 199, "b": 167 }, lab: { "l": 79.72377632826641, "a": -4.305375029117597, "b": 16.42212158746419 } },
        { name: "455C", cmyk: { "c": 18, "m": 30, "y": 94, "k": 59 }, rgb: { "r": 105, "g": 91, "b": 36 }, lab: { "l": 38.92052699615449, "a": -1.5903013296572621, "b": 32.99275155274742 } },
        { name: "456C", cmyk: { "c": 12, "m": 20, "y": 91, "k": 29 }, rgb: { "r": 162, "g": 142, "b": 42 }, lab: { "l": 59.15397498465184, "a": -3.6178925257785433, "b": 52.95440900148073 } },
        { name: "457C", cmyk: { "c": 7, "m": 16, "y": 96, "k": 22 }, rgb: { "r": 184, "g": 157, "b": 24 }, lab: { "l": 65.25538712571039, "a": -2.443116044714422, "b": 64.79024709262941 } },
        { name: "458C", cmyk: { "c": 10, "m": 9, "y": 71, "k": 2 }, rgb: { "r": 217, "g": 199, "b": 86 }, lab: { "l": 79.76749139619874, "a": -7.239663295414034, "b": 57.43840826050985 } },
        { name: "459C", cmyk: { "c": 9, "m": 8, "y": 67, "k": 1 }, rgb: { "r": 222, "g": 205, "b": 99 }, lab: { "l": 81.8887622668909, "a": -7.288393380142755, "b": 54.05817875817984 } },
        { name: "460C", cmyk: { "c": 7, "m": 4, "y": 55, "k": 0 }, rgb: { "r": 228, "g": 215, "b": 126 }, lab: { "l": 85.30216072116185, "a": -7.583349842729126, "b": 45.34884973787725 } },
        { name: "461C", cmyk: { "c": 4, "m": 1, "y": 43, "k": 0 }, rgb: { "r": 233, "g": 223, "b": 151 }, lab: { "l": 88.12879947405163, "a": -7.013492465199667, "b": 36.55156230747132 } },
        { name: "462C", cmyk: { "c": 27, "m": 52, "y": 82, "k": 61 }, rgb: { "r": 92, "g": 70, "b": 43 }, lab: { "l": 31.41683420822916, "a": 5.597159144001135, "b": 19.82296124357694 } },
        { name: "463C", cmyk: { "c": 13, "m": 54, "y": 88, "k": 53 }, rgb: { "r": 116, "g": 79, "b": 40 }, lab: { "l": 36.851869372587544, "a": 11.196762203650595, "b": 28.856221873680976 } },
        { name: "464C", cmyk: { "c": 7, "m": 53, "y": 89, "k": 42 }, rgb: { "r": 139, "g": 91, "b": 41 }, lab: { "l": 42.96032032885903, "a": 14.787868135899163, "b": 35.99468903652666 } },
        { name: "465C", cmyk: { "c": 13, "m": 31, "y": 63, "k": 12 }, rgb: { "r": 185, "g": 151, "b": 91 }, lab: { "l": 64.32481175368885, "a": 5.060918204936538, "b": 36.19632141259635 } },
        { name: "466C", cmyk: { "c": 13, "m": 25, "y": 52, "k": 6 }, rgb: { "r": 198, "g": 170, "b": 118 }, lab: { "l": 70.91448723068456, "a": 2.9552328633286606, "b": 30.56704932642638 } },
        { name: "467C", cmyk: { "c": 11, "m": 19, "y": 42, "k": 2 }, rgb: { "r": 211, "g": 188, "b": 141 }, lab: { "l": 77.12415623980583, "a": 1.2993385867707263, "b": 26.803836884368604 } },
        { name: "468C", cmyk: { "c": 8, "m": 14, "y": 33, "k": 0 }, rgb: { "r": 221, "g": 203, "b": 164 }, lab: { "l": 82.25190174321678, "a": 0.29522577862239885, "b": 21.76042911955973 } },
        { name: "469C", cmyk: { "c": 11, "m": 64, "y": 89, "k": 61 }, rgb: { "r": 105, "g": 63, "b": 35 }, lab: { "l": 31.06614016622953, "a": 15.395023425238241, "b": 24.588085521495806 } },
        { name: "470C", cmyk: { "c": 3, "m": 62, "y": 88, "k": 30 }, rgb: { "r": 164, "g": 90, "b": 42 }, lab: { "l": 46.13956383674716, "a": 26.46665814293708, "b": 39.90642788731328 } },
        { name: "471C", cmyk: { "c": 1, "m": 63, "y": 94, "k": 19 }, rgb: { "r": 184, "g": 97, "b": 37 }, lab: { "l": 50.538650894136595, "a": 30.865871529799083, "b": 47.64042980720106 } },
        { name: "472C", cmyk: { "c": 0, "m": 40, "y": 54, "k": 1 }, rgb: { "r": 229, "g": 158, "b": 109 }, lab: { "l": 71.01949046246327, "a": 21.14392303592716, "b": 36.110715583927444 } },
        { name: "473C", cmyk: { "c": 0, "m": 24, "y": 33, "k": 0 }, rgb: { "r": 240, "g": 191, "b": 155 }, lab: { "l": 80.82401589817889, "a": 12.719492023529789, "b": 24.8446287832617 } },
        { name: "474C", cmyk: { "c": 0, "m": 20, "y": 28, "k": 0 }, rgb: { "r": 241, "g": 198, "b": 166 }, lab: { "l": 82.82938561643296, "a": 10.773877995173375, "b": 21.780778826778956 } },
        { name: "475C", cmyk: { "c": 0, "m": 15, "y": 23, "k": 0 }, rgb: { "r": 243, "g": 207, "b": 179 }, lab: { "l": 85.47111369129263, "a": 8.522515572685629, "b": 18.604817891746748 } },
        { name: "476C", cmyk: { "c": 33, "m": 66, "y": 76, "k": 68 }, rgb: { "r": 78, "g": 54, "b": 41 }, lab: { "l": 25.008211086898072, "a": 8.83893922315418, "b": 12.422408511004978 } },
        { name: "477C", cmyk: { "c": 19, "m": 69, "y": 78, "k": 60 }, rgb: { "r": 98, "g": 59, "b": 42 }, lab: { "l": 29.13774317410391, "a": 15.212315166368452, "b": 17.70192335662485 } },
        { name: "478C", cmyk: { "c": 12, "m": 72, "y": 81, "k": 54 }, rgb: { "r": 113, "g": 63, "b": 42 }, lab: { "l": 32.331317770923675, "a": 19.61827216757839, "b": 22.181218282093106 } },
        { name: "479C", cmyk: { "c": 17, "m": 44, "y": 50, "k": 15 }, rgb: { "r": 170, "g": 128, "b": 102 }, lab: { "l": 57.02052423430774, "a": 12.697985880250783, "b": 20.405943714305508 } },
        { name: "480C", cmyk: { "c": 14, "m": 29, "y": 34, "k": 3 }, rgb: { "r": 198, "g": 169, "b": 146 }, lab: { "l": 71.18487933632089, "a": 7.040517334442054, "b": 15.785545307967851 } },
        { name: "481C", cmyk: { "c": 11, "m": 23, "y": 24, "k": 0 }, rgb: { "r": 211, "g": 187, "b": 168 }, lab: { "l": 77.41022569456989, "a": 5.5263002933578775, "b": 12.742359200912823 } },
        { name: "482C", cmyk: { "c": 8, "m": 17, "y": 20, "k": 0 }, rgb: { "r": 219, "g": 200, "b": 182 }, lab: { "l": 81.69994489013473, "a": 3.7349756838073733, "b": 11.404396401943195 } },
        { name: "483C", cmyk: { "c": 10, "m": 82, "y": 81, "k": 63 }, rgb: { "r": 101, "g": 48, "b": 36 }, lab: { "l": 26.7574916240709, "a": 22.678757897020894, "b": 18.591201770562048 } },
        { name: "484C", cmyk: { "c": 1, "m": 90, "y": 92, "k": 33 }, rgb: { "r": 154, "g": 51, "b": 36 }, lab: { "l": 36.677852322399445, "a": 42.109137360518325, "b": 32.5370349513632 } },
        { name: "485C", cmyk: { "c": 0, "m": 95, "y": 100, "k": 0 }, rgb: { "r": 218, "g": 41, "b": 28 }, lab: { "l": 47.72019303017832, "a": 65.45834105268582, "b": 51.38843366190555 } },
        { name: "486C", cmyk: { "c": 0, "m": 50, "y": 42, "k": 0 }, rgb: { "r": 232, "g": 146, "b": 124 }, lab: { "l": 68.87337021937556, "a": 30.102181672522654, "b": 25.283192614620532 } },
        { name: "487C", cmyk: { "c": 0, "m": 37, "y": 31, "k": 0 }, rgb: { "r": 234, "g": 167, "b": 148 }, lab: { "l": 74.3608539172349, "a": 22.304678514264488, "b": 19.654549403530353 } },
        { name: "488C", cmyk: { "c": 0, "m": 28, "y": 23, "k": 0 }, rgb: { "r": 236, "g": 186, "b": 168 }, lab: { "l": 79.48720862082526, "a": 15.465717406721202, "b": 15.99983894109398 } },
        { name: "489C", cmyk: { "c": 0, "m": 22, "y": 20, "k": 0 }, rgb: { "r": 236, "g": 195, "b": 178 }, lab: { "l": 81.88025949014411, "a": 12.067369008410655, "b": 14.007224579479516 } },
        { name: "490C", cmyk: { "c": 18, "m": 88, "y": 59, "k": 66 }, rgb: { "r": 93, "g": 42, "b": 44 }, lab: { "l": 24.2093783173845, "a": 23.49636427466331, "b": 9.727721308309857 } },
        { name: "491C", cmyk: { "c": 9, "m": 89, "y": 59, "k": 48 }, rgb: { "r": 127, "g": 48, "b": 53 }, lab: { "l": 31.53899478179344, "a": 34.63695519966875, "b": 14.67948652005262 } },
        { name: "492C", cmyk: { "c": 6, "m": 89, "y": 60, "k": 39 }, rgb: { "r": 143, "g": 50, "b": 55 }, lab: { "l": 34.795727120425056, "a": 39.70690745431399, "b": 18.2179536203666 } },
        { name: "494C", cmyk: { "c": 0, "m": 41, "y": 7, "k": 0 }, rgb: { "r": 233, "g": 162, "b": 178 }, lab: { "l": 73.79056313831789, "a": 28.5153185922849, "b": 2.389763504378828 } },
        { name: "495C", cmyk: { "c": 0, "m": 28, "y": 1, "k": 0 }, rgb: { "r": 241, "g": 189, "b": 200 }, lab: { "l": 81.43764081879137, "a": 20.29683416096234, "b": 1.6370446739940814 } },
        { name: "496C", cmyk: { "c": 0, "m": 23, "y": 1, "k": 0 }, rgb: { "r": 242, "g": 198, "b": 207 }, lab: { "l": 83.84608732086816, "a": 16.98368898266589, "b": 1.401962309193583 } },
        { name: "497C", cmyk: { "c": 34, "m": 77, "y": 62, "k": 67 }, rgb: { "r": 81, "g": 47, "b": 46 }, lab: { "l": 23.603943708100402, "a": 15.421062611447129, "b": 7.248466635703887 } },
        { name: "498C", cmyk: { "c": 23, "m": 76, "y": 61, "k": 54 }, rgb: { "r": 106, "g": 55, "b": 53 }, lab: { "l": 29.547265688989448, "a": 22.365026010739808, "b": 11.399237255326955 } },
        { name: "499C", cmyk: { "c": 18, "m": 75, "y": 60, "k": 46 }, rgb: { "r": 122, "g": 62, "b": 58 }, lab: { "l": 33.74919087990167, "a": 25.57103881968828, "b": 14.290874514975837 } },
        { name: "500C", cmyk: { "c": 12, "m": 50, "y": 21, "k": 5 }, rgb: { "r": 198, "g": 133, "b": 143 }, lab: { "l": 62.307897548901806, "a": 26.34127831922012, "b": 4.880687710152887 } },
        { name: "501C", cmyk: { "c": 7, "m": 37, "y": 11, "k": 0 }, rgb: { "r": 218, "g": 165, "b": 173 }, lab: { "l": 72.78167875728879, "a": 20.709104574575253, "b": 3.4832061071471188 } },
        { name: "502C", cmyk: { "c": 2, "m": 27, "y": 6, "k": 0 }, rgb: { "r": 229, "g": 186, "b": 193 }, lab: { "l": 79.40053464780767, "a": 16.50839847070501, "b": 2.3082143542127787 } },
        { name: "503C", cmyk: { "c": 1, "m": 22, "y": 7, "k": 0 }, rgb: { "r": 233, "g": 197, "b": 199 }, lab: { "l": 82.58242376923127, "a": 13.045372791251285, "b": 3.742832931739115 } },
        { name: "504C", cmyk: { "c": 29, "m": 88, "y": 45, "k": 65 }, rgb: { "r": 87, "g": 41, "b": 50 }, lab: { "l": 23.143435099751315, "a": 22.28958670388326, "b": 4.018660717142075 } },
        { name: "505C", cmyk: { "c": 21, "m": 90, "y": 34, "k": 52 }, rgb: { "r": 111, "g": 44, "b": 63 }, lab: { "l": 28.220276653172093, "a": 31.698442841797764, "b": 3.0723719638129476 } },
        { name: "506C", cmyk: { "c": 20, "m": 87, "y": 28, "k": 37 }, rgb: { "r": 132, "g": 52, "b": 78 }, lab: { "l": 33.798046146435034, "a": 37.01145141394463, "b": 1.757623905555361 } },
        { name: "507C", cmyk: { "c": 7, "m": 47, "y": 6, "k": 1 }, rgb: { "r": 213, "g": 146, "b": 170 }, lab: { "l": 67.7293535231909, "a": 28.72375850843073, "b": -2.280946405868556 } },
        { name: "508C", cmyk: { "c": 1, "m": 37, "y": 3, "k": 0 }, rgb: { "r": 228, "g": 169, "b": 187 }, lab: { "l": 75.11274534759748, "a": 24.313863170926876, "b": -0.6895621497652549 } },
        { name: "509C", cmyk: { "c": 0, "m": 32, "y": 1, "k": 0 }, rgb: { "r": 232, "g": 179, "b": 195 }, lab: { "l": 78.07303794635696, "a": 21.63404811577757, "b": -0.6748491899670972 } },
        { name: "510C", cmyk: { "c": 0, "m": 26, "y": 2, "k": 0 }, rgb: { "r": 235, "g": 190, "b": 203 }, lab: { "l": 81.18201980327636, "a": 18.10715126021678, "b": -0.4186224515424941 } },
        { name: "511C", cmyk: { "c": 45, "m": 92, "y": 12, "k": 47 }, rgb: { "r": 97, "g": 44, "b": 81 }, lab: { "l": 26.55403844266648, "a": 29.264692581769307, "b": -11.608712908399099 } },
        { name: "512C", cmyk: { "c": 48, "m": 96, "y": 1, "k": 10 }, rgb: { "r": 131, "g": 49, "b": 119 }, lab: { "l": 34.70917251491868, "a": 44.14567336160502, "b": -23.020093600912396 } },
        { name: "513C", cmyk: { "c": 48, "m": 96, "y": 0, "k": 0 }, rgb: { "r": 147, "g": 50, "b": 142 }, lab: { "l": 38.61600276685278, "a": 52.01395760241512, "b": -30.946244735118334 } },
        { name: "514C", cmyk: { "c": 14, "m": 51, "y": 0, "k": 0 }, rgb: { "r": 212, "g": 139, "b": 200 }, lab: { "l": 67.00033542331225, "a": 37.092216922996194, "b": -20.175840457854257 } },
        { name: "515C", cmyk: { "c": 7, "m": 35, "y": 0, "k": 0 }, rgb: { "r": 226, "g": 172, "b": 215 }, lab: { "l": 76.42395247865267, "a": 26.64894197394718, "b": -14.060751708169805 } },
        { name: "516C", cmyk: { "c": 4, "m": 26, "y": 0, "k": 0 }, rgb: { "r": 230, "g": 190, "b": 221 }, lab: { "l": 81.22028624883934, "a": 19.415218328061144, "b": -10.09411657337087 } },
        { name: "517C", cmyk: { "c": 1, "m": 22, "y": 0, "k": 0 }, rgb: { "r": 235, "g": 198, "b": 223 }, lab: { "l": 83.6408922993308, "a": 17.20958460018318, "b": -7.520499861443075 } },
        { name: "518C", cmyk: { "c": 60, "m": 84, "y": 22, "k": 54 }, rgb: { "r": 75, "g": 48, "b": 72 }, lab: { "l": 23.926473251441912, "a": 16.839280077024927, "b": -9.914106760562102 } },
        { name: "519C", cmyk: { "c": 62, "m": 92, "y": 6, "k": 34 }, rgb: { "r": 89, "g": 49, "b": 95 }, lab: { "l": 27.148677651398387, "a": 26.391466167267563, "b": -19.968619390570964 } },
        { name: "520C", cmyk: { "c": 63, "m": 99, "y": 0, "k": 20 }, rgb: { "r": 100, "g": 47, "b": 108 }, lab: { "l": 28.96675871992698, "a": 33.8955455290417, "b": -25.392664404114097 } },
        { name: "521C", cmyk: { "c": 35, "m": 54, "y": 0, "k": 0 }, rgb: { "r": 165, "g": 127, "b": 178 }, lab: { "l": 58.40768233147466, "a": 23.976829339131754, "b": -21.31508967697211 } },
        { name: "522C", cmyk: { "c": 24, "m": 40, "y": 0, "k": 0 }, rgb: { "r": 186, "g": 156, "b": 197 }, lab: { "l": 68.2024533518648, "a": 18.548793187093736, "b": -16.931402174304623 } },
        { name: "523C", cmyk: { "c": 16, "m": 30, "y": 0, "k": 0 }, rgb: { "r": 201, "g": 177, "b": 208 }, lab: { "l": 75.0864669566357, "a": 14.202709084431664, "b": -12.49012385243251 } },
        { name: "524C", cmyk: { "c": 11, "m": 21, "y": 0, "k": 0 }, rgb: { "r": 213, "g": 194, "b": 216 }, lab: { "l": 80.56477883525402, "a": 10.600160767706146, "b": -8.541886644243224 } },
        { name: "525C", cmyk: { "c": 64, "m": 98, "y": 1, "k": 33 }, rgb: { "r": 87, "g": 44, "b": 95 }, lab: { "l": 25.724837259075052, "a": 28.698945497959897, "b": -22.217502848745152 } },
        { name: "526C", cmyk: { "c": 66, "m": 100, "y": 0, "k": 0 }, rgb: { "r": 112, "g": 47, "b": 138 }, lab: { "l": 32.508549730915036, "a": 43.72165641476222, "b": -38.519604681586614 } },
        { name: "527C", cmyk: { "c": 62, "m": 93, "y": 0, "k": 0 }, rgb: { "r": 128, "g": 49, "b": 167 }, lab: { "l": 37.070146501147455, "a": 52.826668821681935, "b": -48.70682041257651 } },
        { name: "528C", cmyk: { "c": 31, "m": 54, "y": 0, "k": 0 }, rgb: { "r": 181, "g": 128, "b": 209 }, lab: { "l": 61.538041186079866, "a": 35.041588747651176, "b": -33.90755710559985 } },
        { name: "529C", cmyk: { "c": 19, "m": 38, "y": 0, "k": 0 }, rgb: { "r": 202, "g": 162, "b": 221 }, lab: { "l": 71.97220850375776, "a": 25.319021345827363, "b": -24.301910668317795 } },
        { name: "530C", cmyk: { "c": 12, "m": 27, "y": 0, "k": 0 }, rgb: { "r": 215, "g": 185, "b": 228 }, lab: { "l": 78.89498583739183, "a": 18.397921106433568, "b": -17.485391600441712 } },
        { name: "531C", cmyk: { "c": 8, "m": 20, "y": 0, "k": 0 }, rgb: { "r": 223, "g": 200, "b": 231 }, lab: { "l": 83.31913360679359, "a": 13.564259463510142, "b": -12.38154938067375 } },
        { name: "532C", cmyk: { "c": 92, "m": 73, "y": 29, "k": 89 }, rgb: { "r": 29, "g": 31, "b": 42 }, lab: { "l": 12.013129398659345, "a": 2.243347059972603, "b": -7.682513916529215 } },
        { name: "533C", cmyk: { "c": 94, "m": 73, "y": 5, "k": 69 }, rgb: { "r": 32, "g": 42, "b": 68 }, lab: { "l": 17.368668287175225, "a": 4.210263191077063, "b": -17.712551674509935 } },
        { name: "534C", cmyk: { "c": 100, "m": 71, "y": 0, "k": 51 }, rgb: { "r": 27, "g": 54, "b": 93 }, lab: { "l": 22.519792666265133, "a": 4.136399142532138, "b": -26.352676531552287 } },
        { name: "535C", cmyk: { "c": 44, "m": 27, "y": 5, "k": 2 }, rgb: { "r": 142, "g": 159, "b": 188 }, lab: { "l": 65.10353234709943, "a": 0.5211511589288675, "b": -16.950851053443785 } },
        { name: "536C", cmyk: { "c": 36, "m": 19, "y": 3, "k": 0 }, rgb: { "r": 162, "g": 178, "b": 200 }, lab: { "l": 72.02235140262731, "a": -0.8613866887179356, "b": -13.024421217121173 } },
        { name: "537C", cmyk: { "c": 24, "m": 12, "y": 1, "k": 0 }, rgb: { "r": 187, "g": 199, "b": 214 }, lab: { "l": 79.76535584943312, "a": -1.097016213220836, "b": -8.873425930164757 } },
        { name: "538C", cmyk: { "c": 19, "m": 9, "y": 2, "k": 0 }, rgb: { "r": 197, "g": 207, "b": 218 }, lab: { "l": 82.67776411284653, "a": -1.2523186718534363, "b": -6.617168187920952 } },
        { name: "539C", cmyk: { "c": 100, "m": 43, "y": 0, "k": 83 }, rgb: { "r": 0, "g": 38, "b": 58 }, lab: { "l": 13.77833254988549, "a": -4.153267121977472, "b": -16.515802595532904 } },
        { name: "540C", cmyk: { "c": 100, "m": 53, "y": 0, "k": 65 }, rgb: { "r": 0, "g": 48, "b": 87 }, lab: { "l": 19.232920408062434, "a": 2.136889454505603, "b": -27.682247732727983 } },
        { name: "541C", cmyk: { "c": 100, "m": 61, "y": 0, "k": 43 }, rgb: { "r": 0, "g": 60, "b": 113 }, lab: { "l": 25.026276748004186, "a": 5.328097439485314, "b": -35.31789382831681 } },
        { name: "542C", cmyk: { "c": 51, "m": 16, "y": 0, "k": 0 }, rgb: { "r": 123, "g": 175, "b": 212 }, lab: { "l": 69.20114376901222, "a": -7.564843566224388, "b": -24.114913116202796 } },
        { name: "543C", cmyk: { "c": 35, "m": 7, "y": 0, "k": 0 }, rgb: { "r": 164, "g": 200, "b": 225 }, lab: { "l": 78.83189367617052, "a": -6.332601478148403, "b": -16.339899309608484 } },
        { name: "544C", cmyk: { "c": 24, "m": 4, "y": 0, "k": 0 }, rgb: { "r": 189, "g": 214, "b": 230 }, lab: { "l": 84.29018887623978, "a": -5.003981947945324, "b": -10.668731216630412 } },
        { name: "545C", cmyk: { "c": 20, "m": 3, "y": 0, "k": 0 }, rgb: { "r": 198, "g": 218, "b": 231 }, lab: { "l": 85.9654771964897, "a": -4.054670228551382, "b": -8.641884449887428 } },
        { name: "546C", cmyk: { "c": 97, "m": 32, "y": 34, "k": 86 }, rgb: { "r": 7, "g": 43, "b": 49 }, lab: { "l": 15.459278907535325, "a": -10.020379089479448, "b": -7.552994170702288 } },
        { name: "547C", cmyk: { "c": 100, "m": 11, "y": 20, "k": 82 }, rgb: { "r": 0, "g": 49, "b": 60 }, lab: { "l": 18.02172061375341, "a": -10.616168744147087, "b": -11.305326941148353 } },
        { name: "548C", cmyk: { "c": 100, "m": 8, "y": 11, "k": 74 }, rgb: { "r": 0, "g": 61, "b": 76 }, lab: { "l": 23.200696557017537, "a": -11.424824294385406, "b": -14.12515912291643 } },
        { name: "549C", cmyk: { "c": 57, "m": 16, "y": 10, "k": 2 }, rgb: { "r": 107, "g": 164, "b": 184 }, lab: { "l": 64.27201737283144, "a": -13.344682779243444, "b": -16.175721566433097 } },
        { name: "550C", cmyk: { "c": 44, "m": 10, "y": 6, "k": 0 }, rgb: { "r": 141, "g": 185, "b": 202 }, lab: { "l": 72.64422480880204, "a": -10.560241153331152, "b": -13.322729332535799 } },
        { name: "551C", cmyk: { "c": 35, "m": 6, "y": 4, "k": 0 }, rgb: { "r": 163, "g": 199, "b": 210 }, lab: { "l": 78.04385984549829, "a": -9.524099731088864, "b": -9.454449431446044 } },
        { name: "552C", cmyk: { "c": 25, "m": 4, "y": 1, "k": 0 }, rgb: { "r": 185, "g": 211, "b": 220 }, lab: { "l": 82.95069863477876, "a": -6.796673491990035, "b": -7.371089425358046 } },
        { name: "553C", cmyk: { "c": 77, "m": 28, "y": 74, "k": 67 }, rgb: { "r": 40, "g": 71, "b": 52 }, lab: { "l": 27.312461243354903, "a": -16.503508460698203, "b": 7.881694038818177 } },
        { name: "554C", cmyk: { "c": 80, "m": 16, "y": 72, "k": 51 }, rgb: { "r": 32, "g": 92, "b": 64 }, lab: { "l": 34.66401982805441, "a": -26.780179133794352, "b": 10.5042002423267 } },
        { name: "555C", cmyk: { "c": 77, "m": 12, "y": 68, "k": 35 }, rgb: { "r": 40, "g": 114, "b": 79 }, lab: { "l": 42.83887254842189, "a": -31.75504887577793, "b": 12.807865599315793 } },
        { name: "556C", cmyk: { "c": 56, "m": 12, "y": 44, "k": 7 }, rgb: { "r": 111, "g": 162, "b": 135 }, lab: { "l": 62.48182565172581, "a": -22.91819936708761, "b": 8.6741900725521 } },
        { name: "557C", cmyk: { "c": 48, "m": 10, "y": 36, "k": 3 }, rgb: { "r": 133, "g": 176, "b": 154 }, lab: { "l": 68.2926580187996, "a": -19.04221031502945, "b": 6.598525430821689 } },
        { name: "558C", cmyk: { "c": 40, "m": 7, "y": 29, "k": 0 }, rgb: { "r": 154, "g": 190, "b": 170 }, lab: { "l": 73.93267774865083, "a": -16.10933321141783, "b": 6.1147796507235785 } },
        { name: "559C", cmyk: { "c": 31, "m": 4, "y": 22, "k": 0 }, rgb: { "r": 173, "g": 202, "b": 184 }, lab: { "l": 78.80219231412032, "a": -13.226067562084609, "b": 5.724757085844234 } },
        { name: "560C", cmyk: { "c": 86, "m": 30, "y": 65, "k": 75 }, rgb: { "r": 29, "g": 60, "b": 52 }, lab: { "l": 22.795545705366756, "a": -13.8664130567408, "b": 1.3793918108839787 } },
        { name: "561C", cmyk: { "c": 91, "m": 13, "y": 60, "k": 53 }, rgb: { "r": 0, "g": 89, "b": 76 }, lab: { "l": 33.2785777749541, "a": -26.610939442284376, "b": 0.9862973552810739 } },
        { name: "562C", cmyk: { "c": 92, "m": 7, "y": 55, "k": 35 }, rgb: { "r": 0, "g": 111, "b": 98 }, lab: { "l": 41.61185655046356, "a": -30.22211372086936, "b": -0.4082615582459592 } },
        { name: "563C", cmyk: { "c": 58, "m": 0, "y": 31, "k": 0 }, rgb: { "r": 107, "g": 187, "b": 174 }, lab: { "l": 70.67913241152894, "a": -27.69893629583542, "b": -1.099589424492331 } },
        { name: "564C", cmyk: { "c": 47, "m": 0, "y": 25, "k": 0 }, rgb: { "r": 134, "g": 200, "b": 188 }, lab: { "l": 76.07400279463248, "a": -23.546154371118288, "b": -0.671905795395844 } },
        { name: "565C", cmyk: { "c": 35, "m": 0, "y": 19, "k": 0 }, rgb: { "r": 161, "g": 214, "b": 202 }, lab: { "l": 81.8025574904944, "a": -19.54240790367956, "b": 0.3597243544967377 } },
        { name: "566C", cmyk: { "c": 25, "m": 0, "y": 14, "k": 0 }, rgb: { "r": 185, "g": 220, "b": 210 }, lab: { "l": 85.07482248404281, "a": -13.445208214737491, "b": 1.0589020825450435 } },
        { name: "567C", cmyk: { "c": 88, "m": 24, "y": 66, "k": 74 }, rgb: { "r": 23, "g": 63, "b": 53 }, lab: { "l": 23.65230264308682, "a": -16.982297145819974, "b": 1.9191938289802368 } },
        { name: "569C", cmyk: { "c": 96, "m": 1, "y": 59, "k": 20 }, rgb: { "r": 0, "g": 129, "b": 109 }, lab: { "l": 48.01293385116841, "a": -35.16567699602793, "b": 2.3519477905402653 } },
        { name: "570C", cmyk: { "c": 54, "m": 0, "y": 30, "k": 0 }, rgb: { "r": 107, "g": 202, "b": 186 }, lab: { "l": 75.3965672269039, "a": -32.03036073779247, "b": -0.7251182517015176 } },
        { name: "571C", cmyk: { "c": 36, "m": 0, "y": 18, "k": 0 }, rgb: { "r": 152, "g": 219, "b": 206 }, lab: { "l": 82.8041049824543, "a": -23.816540187868995, "b": -0.3633313415845718 } },
        { name: "572C", cmyk: { "c": 30, "m": 0, "y": 15, "k": 0 }, rgb: { "r": 165, "g": 223, "b": 211 }, lab: { "l": 84.72936367956525, "a": -20.926798861118257, "b": -0.1168110633989583 } },
        { name: "573C", cmyk: { "c": 24, "m": 0, "y": 11, "k": 0 }, rgb: { "r": 181, "g": 227, "b": 216 }, lab: { "l": 86.85925073230153, "a": -17.03039124571548, "b": 0.46485994865297364 } },
        { name: "574C", cmyk: { "c": 49, "m": 22, "y": 85, "k": 58 }, rgb: { "r": 78, "g": 91, "b": 49 }, lab: { "l": 36.600058532583255, "a": -12.864221120407693, "b": 22.51098332100535 } },
        { name: "575C", cmyk: { "c": 47, "m": 9, "y": 86, "k": 35 }, rgb: { "r": 103, "g": 130, "b": 58 }, lab: { "l": 50.867262243090494, "a": -22.042880682579757, "b": 35.380955115195846 } },
        { name: "576C", cmyk: { "c": 48, "m": 6, "y": 79, "k": 17 }, rgb: { "r": 120, "g": 157, "b": 74 }, lab: { "l": 60.42824258239992, "a": -26.975031557845085, "b": 38.93527400520457 } },
        { name: "577C", cmyk: { "c": 34, "m": 3, "y": 55, "k": 1 }, rgb: { "r": 169, "g": 196, "b": 127 }, lab: { "l": 75.72868312117173, "a": -20.897560329452112, "b": 31.70346755376179 } },
        { name: "578C", cmyk: { "c": 28, "m": 1, "y": 44, "k": 0 }, rgb: { "r": 183, "g": 206, "b": 149 }, lab: { "l": 79.82949849776108, "a": -17.601624022945906, "b": 25.862410150682113 } },
        { name: "579C", cmyk: { "c": 25, "m": 1, "y": 42, "k": 0 }, rgb: { "r": 188, "g": 209, "b": 155 }, lab: { "l": 81.10371450546292, "a": -16.392635473076066, "b": 24.508304306231675 } },
        { name: "580C", cmyk: { "c": 21, "m": 0, "y": 38, "k": 0 }, rgb: { "r": 196, "g": 214, "b": 164 }, lab: { "l": 83.18348850415417, "a": -14.649567230774707, "b": 22.732536889923182 } },
        { name: "581C", cmyk: { "c": 22, "m": 21, "y": 96, "k": 60 }, rgb: { "r": 98, "g": 93, "b": 32 }, lab: { "l": 38.77672409266614, "a": -6.433786346882964, "b": 34.62305872594773 } },
        { name: "582C", cmyk: { "c": 16, "m": 4, "y": 100, "k": 37 }, rgb: { "r": 142, "g": 140, "b": 19 }, lab: { "l": 56.63822346169252, "a": -12.50852050650575, "b": 57.304452764037606 } },
        { name: "583C", cmyk: { "c": 24, "m": 0, "y": 99, "k": 6 }, rgb: { "r": 183, "g": 191, "b": 16 }, lab: { "l": 74.42346047055804, "a": -20.598974872113875, "b": 73.49528662407195 } },
        { name: "584C", cmyk: { "c": 17, "m": 0, "y": 75, "k": 0 }, rgb: { "r": 210, "g": 215, "b": 85 }, lab: { "l": 83.42048248517659, "a": -18.24313015877721, "b": 61.69244501246178 } },
        { name: "585C", cmyk: { "c": 12, "m": 0, "y": 64, "k": 0 }, rgb: { "r": 219, "g": 222, "b": 112 }, lab: { "l": 86.24215491371352, "a": -15.969522724780195, "b": 53.040373888595994 } },
        { name: "586C", cmyk: { "c": 9, "m": 0, "y": 59, "k": 0 }, rgb: { "r": 224, "g": 226, "b": 124 }, lab: { "l": 87.82169175361184, "a": -14.868813039960294, "b": 49.3516394353686 } },
        { name: "587C", cmyk: { "c": 7, "m": 0, "y": 51, "k": 0 }, rgb: { "r": 227, "g": 228, "b": 141 }, lab: { "l": 88.79982960539404, "a": -12.954567755856072, "b": 42.33227222174829 } },
        { name: "600C", cmyk: { "c": 1, "m": 0, "y": 44, "k": 0 }, rgb: { "r": 241, "g": 235, "b": 156 }, lab: { "l": 91.91666201081777, "a": -9.396895537954808, "b": 39.1014179400998 } },
        { name: "601C", cmyk: { "c": 2, "m": 0, "y": 49, "k": 0 }, rgb: { "r": 240, "g": 233, "b": 145 }, lab: { "l": 91.1652123239688, "a": -9.98834418433442, "b": 43.57678993119804 } },
        { name: "602C", cmyk: { "c": 2, "m": 0, "y": 59, "k": 0 }, rgb: { "r": 240, "g": 232, "b": 123 }, lab: { "l": 90.62844031614391, "a": -11.610942553242133, "b": 53.51673715542085 } },
        { name: "603C", cmyk: { "c": 4, "m": 0, "y": 78, "k": 0 }, rgb: { "r": 237, "g": 224, "b": 75 }, lab: { "l": 87.88372575134207, "a": -12.168612117651856, "b": 70.97930581431847 } },
        { name: "604C", cmyk: { "c": 5, "m": 0, "y": 88, "k": 0 }, rgb: { "r": 234, "g": 218, "b": 36 }, lab: { "l": 85.88760616768427, "a": -11.875559845121286, "b": 80.79659082286076 } },
        { name: "605C", cmyk: { "c": 4, "m": 1, "y": 100, "k": 4 }, rgb: { "r": 225, "g": 205, "b": 0 }, lab: { "l": 81.65859555482956, "a": -9.702591906876778, "b": 82.13476274470794 } },
        { name: "606C", cmyk: { "c": 0, "m": 6, "y": 100, "k": 13 }, rgb: { "r": 207, "g": 181, "b": 0 }, lab: { "l": 73.748268860798, "a": -5.235768683605646, "b": 75.73150536965166 } },
        { name: "607C", cmyk: { "c": 4, "m": 0, "y": 44, "k": 0 }, rgb: { "r": 235, "g": 228, "b": 154 }, lab: { "l": 89.61831872297864, "a": -8.41732018612651, "b": 37.01554238086169 } },
        { name: "608C", cmyk: { "c": 5, "m": 0, "y": 53, "k": 0 }, rgb: { "r": 233, "g": 225, "b": 134 }, lab: { "l": 88.39775439795112, "a": -9.852932180698327, "b": 45.37238650495876 } },
        { name: "609C", cmyk: { "c": 7, "m": 0, "y": 60, "k": 0 }, rgb: { "r": 230, "g": 222, "b": 119 }, lab: { "l": 87.19143308850913, "a": -10.962729744790511, "b": 51.08445096107648 } },
        { name: "610C", cmyk: { "c": 10, "m": 3, "y": 74, "k": 0 }, rgb: { "r": 225, "g": 213, "b": 85 }, lab: { "l": 84.09676560329063, "a": -11.07778840565099, "b": 62.77591279548371 } },
        { name: "611C", cmyk: { "c": 11, "m": 5, "y": 90, "k": 4 }, rgb: { "r": 215, "g": 200, "b": 38 }, lab: { "l": 79.55434583073553, "a": -10.876264445650152, "b": 74.39767545956451 } },
        { name: "612C", cmyk: { "c": 4, "m": 5, "y": 100, "k": 17 }, rgb: { "r": 196, "g": 176, "b": 0 }, lab: { "l": 71.40977612686093, "a": -7.488309163855622, "b": 73.59552076472751 } },
        { name: "613C", cmyk: { "c": 1, "m": 9, "y": 100, "k": 28 }, rgb: { "r": 179, "g": 155, "b": 0 }, lab: { "l": 64.1822762223299, "a": -4.005648068169998, "b": 67.70580528458507 } },
        { name: "614C", cmyk: { "c": 11, "m": 5, "y": 41, "k": 0 }, rgb: { "r": 220, "g": 213, "b": 154 }, lab: { "l": 84.55440508719151, "a": -6.560037545811081, "b": 30.09721887214669 } },
        { name: "615C", cmyk: { "c": 13, "m": 8, "y": 48, "k": 0 }, rgb: { "r": 214, "g": 207, "b": 141 }, lab: { "l": 82.29527902380146, "a": -7.403925801579502, "b": 33.71839923214031 } },
        { name: "616C", cmyk: { "c": 15, "m": 9, "y": 52, "k": 1 }, rgb: { "r": 208, "g": 200, "b": 131 }, lab: { "l": 79.81664936964957, "a": -7.3315772746751495, "b": 35.53058045462891 } },
        { name: "617C", cmyk: { "c": 19, "m": 13, "y": 66, "k": 6 }, rgb: { "r": 192, "g": 182, "b": 97 }, lab: { "l": 73.23653149141943, "a": -8.007939797894103, "b": 44.180828248696116 } },
        { name: "618C", cmyk: { "c": 19, "m": 16, "y": 82, "k": 18 }, rgb: { "r": 172, "g": 159, "b": 60 }, lab: { "l": 64.87768994399916, "a": -7.321771620444951, "b": 51.60658377174546 } },
        { name: "619C", cmyk: { "c": 16, "m": 16, "y": 91, "k": 28 }, rgb: { "r": 159, "g": 145, "b": 42 }, lab: { "l": 59.697535524452206, "a": -6.602201829401466, "b": 53.38344772856182 } },
        { name: "620C", cmyk: { "c": 10, "m": 16, "y": 98, "k": 44 }, rgb: { "r": 138, "g": 123, "b": 25 }, lab: { "l": 51.427010092883805, "a": -4.8928416126179926, "b": 51.0353590121601 } },
        { name: "621C", cmyk: { "c": 13, "m": 0, "y": 9, "k": 0 }, rgb: { "r": 209, "g": 224, "b": 215 }, lab: { "l": 87.85917091920669, "a": -6.665704350448887, "b": 2.668707655197178 } },
        { name: "622C", cmyk: { "c": 27, "m": 5, "y": 18, "k": 0 }, rgb: { "r": 183, "g": 205, "b": 194 }, lab: { "l": 80.52983120875787, "a": -9.518055779889734, "b": 2.9478123948750934 } },
        { name: "623C", cmyk: { "c": 40, "m": 10, "y": 27, "k": 1 }, rgb: { "r": 154, "g": 185, "b": 173 }, lab: { "l": 72.61784158005553, "a": -12.927321329862684, "b": 2.5811005989690328 } },
        { name: "624C", cmyk: { "c": 53, "m": 16, "y": 38, "k": 7 }, rgb: { "r": 120, "g": 159, "b": 144 }, lab: { "l": 62.34094536066033, "a": -16.55915989833706, "b": 3.49266796037635 } },
        { name: "625C", cmyk: { "c": 66, "m": 21, "y": 49, "k": 22 }, rgb: { "r": 80, "g": 127, "b": 112 }, lab: { "l": 49.56162214620703, "a": -19.657050035382817, "b": 3.0978365023263787 } },
        { name: "626C", cmyk: { "c": 80, "m": 21, "y": 60, "k": 48 }, rgb: { "r": 40, "g": 92, "b": 77 }, lab: { "l": 35.2841527419243, "a": -21.50532142740588, "b": 3.3796307103986956 } },
        { name: "627C", cmyk: { "c": 89, "m": 28, "y": 66, "k": 83 }, rgb: { "r": 19, "g": 50, "b": 43 }, lab: { "l": 18.338805866304085, "a": -13.630799324762716, "b": 0.962653495287269 } },
        { name: "628C", cmyk: { "c": 25, "m": 0, "y": 4, "k": 0 }, rgb: { "r": 183, "g": 221, "b": 225 }, lab: { "l": 85.61312156205926, "a": -11.524875026790838, "b": -6.0989466436918605 } },
        { name: "629C", cmyk: { "c": 36, "m": 0, "y": 5, "k": 0 }, rgb: { "r": 155, "g": 211, "b": 221 }, lab: { "l": 81.16916848748731, "a": -15.574360049576018, "b": -10.748347932042112 } },
        { name: "630C", cmyk: { "c": 50, "m": 0, "y": 8, "k": 0 }, rgb: { "r": 119, "g": 197, "b": 213 }, lab: { "l": 75.23840375136366, "a": -19.877295770204416, "b": -15.516986432482781 } },
        { name: "631C", cmyk: { "c": 67, "m": 2, "y": 11, "k": 0 }, rgb: { "r": 62, "g": 177, "b": 200 }, lab: { "l": 67.00496321045834, "a": -24.55719099611381, "b": -21.068187179524877 } },
        { name: "632C", cmyk: { "c": 87, "m": 8, "y": 14, "k": 7 }, rgb: { "r": 0, "g": 147, "b": 178 }, lab: { "l": 56.16959052097654, "a": -21.468393379218853, "b": -25.4163245396132 } },
        { name: "633C", cmyk: { "c": 100, "m": 5, "y": 9, "k": 30 }, rgb: { "r": 0, "g": 115, "b": 150 }, lab: { "l": 44.89040765758565, "a": -14.189906253441825, "b": -26.634793122592427 } },
        { name: "634C", cmyk: { "c": 100, "m": 6, "y": 1, "k": 48 }, rgb: { "r": 0, "g": 95, "b": 131 }, lab: { "l": 37.52306981277733, "a": -9.868610870604893, "b": -26.721491205741422 } },
        { name: "635C", cmyk: { "c": 32, "m": 0, "y": 1, "k": 0 }, rgb: { "r": 164, "g": 219, "b": 232 }, lab: { "l": 84.16413277039366, "a": -14.563836661145913, "b": -12.077783528702458 } },
        { name: "636C", cmyk: { "c": 42, "m": 0, "y": 0, "k": 0 }, rgb: { "r": 139, "g": 211, "b": 230 }, lab: { "l": 80.62226898457541, "a": -17.682865888074552, "b": -16.45733941685372 } },
        { name: "637C", cmyk: { "c": 60, "m": 0, "y": 2, "k": 0 }, rgb: { "r": 78, "g": 195, "b": 224 }, lab: { "l": 73.56612075043611, "a": -23.924175322645514, "b": -24.148599134762748 } },
        { name: "638C", cmyk: { "c": 77, "m": 0, "y": 3, "k": 0 }, rgb: { "r": 0, "g": 175, "b": 215 }, lab: { "l": 66.18716084581573, "a": -23.17134669805354, "b": -30.665454811500048 } },
        { name: "639C", cmyk: { "c": 97, "m": 4, "y": 3, "k": 2 }, rgb: { "r": 0, "g": 149, "b": 200 }, lab: { "l": 57.71771666662909, "a": -14.650748617683007, "b": -35.473884522154634 } },
        { name: "640C", cmyk: { "c": 100, "m": 8, "y": 0, "k": 12 }, rgb: { "r": 0, "g": 130, "b": 186 }, lab: { "l": 51.27911957836341, "a": -9.138936620653237, "b": -37.61196185859481 } },
        { name: "641C", cmyk: { "c": 100, "m": 22, "y": 0, "k": 29 }, rgb: { "r": 0, "g": 103, "b": 160 }, lab: { "l": 41.59278888622173, "a": -3.148218769255029, "b": -37.74493227576382 } },
        { name: "642C", cmyk: { "c": 15, "m": 4, "y": 0, "k": 0 }, rgb: { "r": 209, "g": 221, "b": 230 }, lab: { "l": 87.47596276111383, "a": -2.2854445529664202, "b": -5.792869171640658 } },
        { name: "643C", cmyk: { "c": 20, "m": 6, "y": 0, "k": 0 }, rgb: { "r": 198, "g": 214, "b": 227 }, lab: { "l": 84.81498781998434, "a": -2.787815082238465, "b": -8.230662276106981 } },
        { name: "644C", cmyk: { "c": 38, "m": 15, "y": 0, "k": 0 }, rgb: { "r": 155, "g": 184, "b": 211 }, lab: { "l": 73.51482579018507, "a": -3.7487161189746487, "b": -16.83768374939043 } },
        { name: "645C", cmyk: { "c": 51, "m": 23, "y": 0, "k": 1 }, rgb: { "r": 125, "g": 161, "b": 196 }, lab: { "l": 64.83157723326967, "a": -3.6245160791884556, "b": -21.930268533967933 } },
        { name: "646C", cmyk: { "c": 65, "m": 34, "y": 2, "k": 1 }, rgb: { "r": 94, "g": 138, "b": 180 }, lab: { "l": 55.939236439586935, "a": -3.3541620741146527, "b": -26.716724421124248 } },
        { name: "647C", cmyk: { "c": 88, "m": 52, "y": 3, "k": 12 }, rgb: { "r": 35, "g": 97, "b": 146 }, lab: { "l": 39.550197914649615, "a": -2.1756656296038344, "b": -32.574956225840566 } },
        { name: "648C", cmyk: { "c": 100, "m": 69, "y": 0, "k": 56 }, rgb: { "r": 0, "g": 46, "b": 93 }, lab: { "l": 18.98931021084328, "a": 6.365296680382909, "b": -32.053304066212874 } },
        { name: "649C", cmyk: { "c": 11, "m": 3, "y": 0, "k": 0 }, rgb: { "r": 219, "g": 226, "b": 233 }, lab: { "l": 89.55013462176065, "a": -1.033408561907423, "b": -4.231247888421774 } },
        { name: "650C", cmyk: { "c": 16, "m": 6, "y": 0, "k": 0 }, rgb: { "r": 206, "g": 217, "b": 229 }, lab: { "l": 86.20839249869212, "a": -1.3759162028715854, "b": -7.162807818400774 } },
        { name: "651C", cmyk: { "c": 33, "m": 15, "y": 0, "k": 0 }, rgb: { "r": 167, "g": 188, "b": 214 }, lab: { "l": 75.47432108300215, "a": -1.5599052268144287, "b": -15.437126349648356 } },
        { name: "652C", cmyk: { "c": 52, "m": 27, "y": 0, "k": 1 }, rgb: { "r": 125, "g": 156, "b": 192 }, lab: { "l": 63.295480488926486, "a": -1.8875029856591508, "b": -22.042629236214893 } },
        { name: "653C", cmyk: { "c": 84, "m": 54, "y": 3, "k": 10 }, rgb: { "r": 50, "g": 98, "b": 149 }, lab: { "l": 40.54619038560802, "a": 0.7226236391937868, "b": -32.769998112090036 } },
        { name: "654C", cmyk: { "c": 100, "m": 73, "y": 0, "k": 33 }, rgb: { "r": 0, "g": 58, "b": 112 }, lab: { "l": 24.30898970528387, "a": 6.297281896994356, "b": -35.832873442059466 } },
        { name: "655C", cmyk: { "c": 100, "m": 73, "y": 0, "k": 61 }, rgb: { "r": 0, "g": 37, "b": 84 }, lab: { "l": 15.293080338739308, "a": 8.932520263382065, "b": -32.01419915961349 } },
        { name: "656C", cmyk: { "c": 10, "m": 2, "y": 0, "k": 0 }, rgb: { "r": 221, "g": 229, "b": 237 }, lab: { "l": 90.56279925712325, "a": -1.1690850471977599, "b": -4.819686284207325 } },
        { name: "657C", cmyk: { "c": 19, "m": 7, "y": 0, "k": 0 }, rgb: { "r": 200, "g": 216, "b": 235 }, lab: { "l": 85.70013630342724, "a": -1.5586064112417808, "b": -11.137822440885458 } },
        { name: "658C", cmyk: { "c": 29, "m": 11, "y": 0, "k": 0 }, rgb: { "r": 177, "g": 201, "b": 232 }, lab: { "l": 80.14954728443294, "a": -1.3891107517510215, "b": -18.02626326244905 } },
        { name: "659C", cmyk: { "c": 51, "m": 26, "y": 0, "k": 0 }, rgb: { "r": 123, "g": 164, "b": 219 }, lab: { "l": 66.42533537830913, "a": 0.453102246544157, "b": -32.24155890459102 } },
        { name: "660C", cmyk: { "c": 74, "m": 44, "y": 0, "k": 0 }, rgb: { "r": 64, "g": 126, "b": 201 }, lab: { "l": 52.09485414892741, "a": 4.4656899095630305, "b": -44.81656684268847 } },
        { name: "661C", cmyk: { "c": 100, "m": 81, "y": 0, "k": 13 }, rgb: { "r": 0, "g": 53, "b": 148 }, lab: { "l": 25.815790277683163, "a": 25.462943973016795, "b": -55.94757092842173 } },
        { name: "662C", cmyk: { "c": 100, "m": 87, "y": 0, "k": 36 }, rgb: { "r": 0, "g": 26, "b": 112 }, lab: { "l": 15.000312717168274, "a": 29.394932560658837, "b": -51.033968649250575 } },
        { name: "663C", cmyk: { "c": 5, "m": 6, "y": 0, "k": 0 }, rgb: { "r": 229, "g": 225, "b": 230 }, lab: { "l": 89.96213467781698, "a": 2.247766263100248, "b": -1.9656850289996086 } },
        { name: "664C", cmyk: { "c": 6, "m": 8, "y": 0, "k": 0 }, rgb: { "r": 224, "g": 219, "b": 227 }, lab: { "l": 87.99572103451374, "a": 3.1407290766678475, "b": -3.3190602857948504 } },
        { name: "665C", cmyk: { "c": 19, "m": 22, "y": 0, "k": 0 }, rgb: { "r": 198, "g": 188, "b": 208 }, lab: { "l": 77.59446877942338, "a": 7.229650685955713, "b": -8.774164005984254 } },
        { name: "666C", cmyk: { "c": 35, "m": 39, "y": 4, "k": 2 }, rgb: { "r": 161, "g": 146, "b": 178 }, lab: { "l": 62.801307440154645, "a": 11.805945197402746, "b": -14.673103327687652 } },
        { name: "667C", cmyk: { "c": 52, "m": 58, "y": 8, "k": 8 }, rgb: { "r": 124, "g": 105, "b": 146 }, lab: { "l": 47.5768833291016, "a": 15.999506917383554, "b": -19.644467896548214 } },
        { name: "668C", cmyk: { "c": 65, "m": 72, "y": 8, "k": 18 }, rgb: { "r": 97, "g": 75, "b": 121 }, lab: { "l": 35.89561108054079, "a": 19.211515563160226, "b": -22.761574171828524 } },
        { name: "669C", cmyk: { "c": 80, "m": 97, "y": 0, "k": 45 }, rgb: { "r": 63, "g": 42, "b": 86 }, lab: { "l": 21.52258485170148, "a": 19.914643646225667, "b": -23.122349592073256 } },
        { name: "670C", cmyk: { "c": 1, "m": 15, "y": 0, "k": 0 }, rgb: { "r": 234, "g": 211, "b": 226 }, lab: { "l": 86.78648954528049, "a": 10.528947234003494, "b": -4.477903680108253 } },
        { name: "671C", cmyk: { "c": 2, "m": 28, "y": 0, "k": 0 }, rgb: { "r": 230, "g": 188, "b": 215 }, lab: { "l": 80.56932910680541, "a": 19.43144852609602, "b": -7.834073889715887 } },
        { name: "672C", cmyk: { "c": 5, "m": 42, "y": 0, "k": 0 }, rgb: { "r": 223, "g": 160, "b": 201 }, lab: { "l": 72.92258944054633, "a": 29.661983093135834, "b": -11.677618939034096 } },
        { name: "673C", cmyk: { "c": 6, "m": 55, "y": 0, "k": 0 }, rgb: { "r": 217, "g": 134, "b": 186 }, lab: { "l": 66.01799807794659, "a": 39.046922747459355, "b": -13.76181552792033 } },
        { name: "674C", cmyk: { "c": 14, "m": 76, "y": 0, "k": 0 }, rgb: { "r": 199, "g": 87, "b": 154 }, lab: { "l": 53.267164129105765, "a": 52.12393939540577, "b": -14.85304695859111 } },
        { name: "675C", cmyk: { "c": 17, "m": 98, "y": 1, "k": 7 }, rgb: { "r": 174, "g": 37, "b": 115 }, lab: { "l": 40.50745281178595, "a": 59.71676858645855, "b": -10.9661556749988 } },
        { name: "676C", cmyk: { "c": 0, "m": 100, "y": 7, "k": 35 }, rgb: { "r": 150, "g": 0, "b": 81 }, lab: { "l": 31.984074343887897, "a": 57.62516775573337, "b": -2.4417883677031793 } },
        { name: "677C", cmyk: { "c": 3, "m": 17, "y": 0, "k": 0 }, rgb: { "r": 229, "g": 206, "b": 219 }, lab: { "l": 84.95309255637162, "a": 10.223213374417172, "b": -3.51003403890926 } },
        { name: "678C", cmyk: { "c": 4, "m": 20, "y": 0, "k": 0 }, rgb: { "r": 227, "g": 200, "b": 216 }, lab: { "l": 83.230052939597, "a": 12.183763365334277, "b": -4.466652502881918 } },
        { name: "679C", cmyk: { "c": 6, "m": 25, "y": 0, "k": 0 }, rgb: { "r": 222, "g": 190, "b": 210 }, lab: { "l": 80.18502177509855, "a": 14.733331629575074, "b": -5.790177147938902 } },
        { name: "680C", cmyk: { "c": 14, "m": 44, "y": 0, "k": 0 }, rgb: { "r": 201, "g": 150, "b": 182 }, lab: { "l": 67.73040487423648, "a": 24.226556056466396, "b": -9.136705461727534 } },
        { name: "681C", cmyk: { "c": 24, "m": 64, "y": 4, "k": 3 }, rgb: { "r": 176, "g": 108, "b": 149 }, lab: { "l": 54.15954665205915, "a": 32.99880130911098, "b": -10.87863272479419 } },
        { name: "682C", cmyk: { "c": 29, "m": 80, "y": 8, "k": 12 }, rgb: { "r": 153, "g": 72, "b": 120 }, lab: { "l": 42.40410608846026, "a": 39.81146422535403, "b": -11.533212715041753 } },
        { name: "683C", cmyk: { "c": 25, "m": 96, "y": 7, "k": 38 }, rgb: { "r": 124, "g": 40, "b": 85 }, lab: { "l": 30.541058675825134, "a": 40.898775274083725, "b": -7.7610626228694635 } },
        { name: "684C", cmyk: { "c": 4, "m": 21, "y": 0, "k": 0 }, rgb: { "r": 228, "g": 198, "b": 212 }, lab: { "l": 82.71926126262018, "a": 12.896945367942392, "b": -3.06934480069907 } },
        { name: "685C", cmyk: { "c": 6, "m": 29, "y": 0, "k": 0 }, rgb: { "r": 220, "g": 182, "b": 201 }, lab: { "l": 77.80917377600586, "a": 16.768002211435984, "b": -4.451835671464566 } },
        { name: "686C", cmyk: { "c": 11, "m": 39, "y": 1, "k": 0 }, rgb: { "r": 208, "g": 161, "b": 186 }, lab: { "l": 71.17651537418858, "a": 21.35846156249682, "b": -6.163768228130251 } },
        { name: "687C", cmyk: { "c": 19, "m": 51, "y": 5, "k": 2 }, rgb: { "r": 190, "g": 132, "b": 163 }, lab: { "l": 61.73526174546936, "a": 27.023400244680474, "b": -7.469172752218567 } },
        { name: "688C", cmyk: { "c": 26, "m": 65, "y": 9, "k": 7 }, rgb: { "r": 167, "g": 99, "b": 137 }, lab: { "l": 50.623163487962614, "a": 32.8206871745203, "b": -9.229190615533177 } },
        { name: "689C", cmyk: { "c": 32, "m": 85, "y": 12, "k": 23 }, rgb: { "r": 137, "g": 59, "b": 103 }, lab: { "l": 36.791072501241594, "a": 38.56105100039981, "b": -9.675781194542466 } },
        { name: "690C", cmyk: { "c": 26, "m": 98, "y": 13, "k": 59 }, rgb: { "r": 97, "g": 33, "b": 65 }, lab: { "l": 23.706961720400145, "a": 32.55835392803444, "b": -5.185368138771285 } },
        { name: "691C", cmyk: { "c": 1, "m": 17, "y": 5, "k": 0 }, rgb: { "r": 233, "g": 205, "b": 208 }, lab: { "l": 84.76141011063427, "a": 10.274922858967306, "b": 2.1019557368747943 } },
        { name: "692C", cmyk: { "c": 3, "m": 25, "y": 8, "k": 0 }, rgb: { "r": 227, "g": 190, "b": 195 }, lab: { "l": 80.23464699889485, "a": 13.976046564555421, "b": 2.417881345194006 } },
        { name: "693C", cmyk: { "c": 7, "m": 38, "y": 14, "k": 0 }, rgb: { "r": 215, "g": 163, "b": 171 }, lab: { "l": 71.94803772566175, "a": 20.3872829328447, "b": 3.3405931551780066 } },
        { name: "694C", cmyk: { "c": 12, "m": 51, "y": 21, "k": 5 }, rgb: { "r": 196, "g": 132, "b": 144 }, lab: { "l": 61.870968464942436, "a": 26.28099657550681, "b": 3.6505733269856178 } },
        { name: "695C", cmyk: { "c": 15, "m": 61, "y": 26, "k": 11 }, rgb: { "r": 180, "g": 107, "b": 122 }, lab: { "l": 53.625584907441436, "a": 30.962273976945344, "b": 4.249265174220662 } },
        { name: "696C", cmyk: { "c": 16, "m": 76, "y": 38, "k": 27 }, rgb: { "r": 152, "g": 72, "b": 87 }, lab: { "l": 41.2133379973069, "a": 35.029489149807134, "b": 7.111367270464763 } },
        { name: "697C", cmyk: { "c": 15, "m": 80, "y": 46, "k": 36 }, rgb: { "r": 137, "g": 60, "b": 71 }, lab: { "l": 35.993948480796085, "a": 33.96314917121904, "b": 9.484279579394773 } },
        { name: "698C", cmyk: { "c": 0, "m": 15, "y": 3, "k": 0 }, rgb: { "r": 242, "g": 212, "b": 215 }, lab: { "l": 87.42205746054887, "a": 10.908296559004715, "b": 2.3523929874886607 } },
        { name: "699C", cmyk: { "c": 0, "m": 25, "y": 4, "k": 0 }, rgb: { "r": 244, "g": 195, "b": 204 }, lab: { "l": 83.24359355556507, "a": 18.808029062166774, "b": 2.152410233193347 } },
        { name: "700C", cmyk: { "c": 0, "m": 37, "y": 9, "k": 0 }, rgb: { "r": 242, "g": 172, "b": 185 }, lab: { "l": 77.21206749865429, "a": 27.44529244681937, "b": 3.636963203972887 } },
        { name: "701C", cmyk: { "c": 0, "m": 56, "y": 16, "k": 0 }, rgb: { "r": 230, "g": 134, "b": 153 }, lab: { "l": 66.65197162484904, "a": 38.87102959873362, "b": 5.962033459353067 } },
        { name: "702C", cmyk: { "c": 2, "m": 73, "y": 30, "k": 3 }, rgb: { "r": 210, "g": 91, "b": 115 }, lab: { "l": 54.47151553329512, "a": 49.128382324112316, "b": 10.161015974994502 } },
        { name: "703C", cmyk: { "c": 3, "m": 88, "y": 52, "k": 16 }, rgb: { "r": 184, "g": 58, "b": 75 }, lab: { "l": 43.83515237885607, "a": 51.62322016531906, "b": 18.99002375346849 } },
        { name: "704C", cmyk: { "c": 1, "m": 95, "y": 75, "k": 31 }, rgb: { "r": 158, "g": 43, "b": 47 }, lab: { "l": 36.37051243521479, "a": 47.30379336726595, "b": 25.808156469416353 } },
        { name: "705C", cmyk: { "c": 0, "m": 12, "y": 0, "k": 0 }, rgb: { "r": 245, "g": 218, "b": 223 }, lab: { "l": 89.33816047238383, "a": 10.13395988475474, "b": 0.9532003435801517 } },
        { name: "706C", cmyk: { "c": 0, "m": 19, "y": 0, "k": 0 }, rgb: { "r": 247, "g": 206, "b": 215 }, lab: { "l": 86.41635840491833, "a": 15.805065534533536, "b": 0.9427831602540238 } },
        { name: "707C", cmyk: { "c": 0, "m": 33, "y": 4, "k": 0 }, rgb: { "r": 248, "g": 181, "b": 196 }, lab: { "l": 80.17381644893915, "a": 26.42292388492168, "b": 2.0415068529225255 } },
        { name: "708C", cmyk: { "c": 0, "m": 52, "y": 15, "k": 0 }, rgb: { "r": 248, "g": 145, "b": 165 }, lab: { "l": 71.50326865583318, "a": 41.06782436059825, "b": 6.502317752033915 } },
        { name: "709C", cmyk: { "c": 0, "m": 73, "y": 32, "k": 0 }, rgb: { "r": 239, "g": 96, "b": 121 }, lab: { "l": 59.97621733746334, "a": 57.038286077454146, "b": 15.012548866850285 } },
        { name: "710C", cmyk: { "c": 0, "m": 88, "y": 58, "k": 0 }, rgb: { "r": 224, "g": 62, "b": 82 }, lab: { "l": 51.7259327763649, "a": 62.9655464992066, "b": 26.434973199259726 } },
        { name: "711C", cmyk: { "c": 0, "m": 94, "y": 84, "k": 5 }, rgb: { "r": 203, "g": 44, "b": 48 }, lab: { "l": 45.23617980538703, "a": 60.88693765791092, "b": 37.6715518597175 } },
        { name: "712C", cmyk: { "c": 0, "m": 19, "y": 40, "k": 0 }, rgb: { "r": 252, "g": 200, "b": 155 }, lab: { "l": 84.15833126392239, "a": 12.640949981822303, "b": 29.544083395586075 } },
        { name: "713C", cmyk: { "c": 0, "m": 25, "y": 49, "k": 0 }, rgb: { "r": 253, "g": 190, "b": 135 }, lab: { "l": 81.5431486519615, "a": 16.18466852348893, "b": 36.51752678808309 } },
        { name: "714C", cmyk: { "c": 0, "m": 36, "y": 66, "k": 0 }, rgb: { "r": 253, "g": 170, "b": 99 }, lab: { "l": 76.39522769001726, "a": 23.72381271754681, "b": 48.43563730674041 } },
        { name: "715C", cmyk: { "c": 0, "m": 50, "y": 93, "k": 0 }, rgb: { "r": 246, "g": 141, "b": 46 }, lab: { "l": 68.63509118766217, "a": 33.43228342126703, "b": 63.75486632264054 } },
        { name: "716C", cmyk: { "c": 0, "m": 59, "y": 100, "k": 0 }, rgb: { "r": 234, "g": 118, "b": 0 }, lab: { "l": 62.03996303548634, "a": 39.59146640017591, "b": 69.49545154307404 } },
        { name: "717C", cmyk: { "c": 0, "m": 69, "y": 100, "k": 2 }, rgb: { "r": 212, "g": 93, "b": 0 }, lab: { "l": 53.84163255079234, "a": 43.375321642975415, "b": 63.005731701567804 } },
        { name: "718C", cmyk: { "c": 0, "m": 74, "y": 100, "k": 12 }, rgb: { "r": 190, "g": 77, "b": 0 }, lab: { "l": 47.307154281095826, "a": 42.66622210502513, "b": 57.4720761489647 } },
        { name: "719C", cmyk: { "c": 1, "m": 18, "y": 31, "k": 0 }, rgb: { "r": 237, "g": 200, "b": 163 }, lab: { "l": 82.89077221886922, "a": 7.821387305108174, "b": 23.390498100505617 } },
        { name: "720C", cmyk: { "c": 2, "m": 26, "y": 43, "k": 0 }, rgb: { "r": 231, "g": 183, "b": 138 }, lab: { "l": 77.69213293560857, "a": 11.483430934799532, "b": 29.481267478032457 } },
        { name: "721C", cmyk: { "c": 4, "m": 34, "y": 54, "k": 3 }, rgb: { "r": 221, "g": 164, "b": 111 }, lab: { "l": 71.60297634728775, "a": 14.860498659511112, "b": 35.61488605419423 } },
        { name: "722C", cmyk: { "c": 4, "m": 46, "y": 75, "k": 13 }, rgb: { "r": 200, "g": 130, "b": 66 }, lab: { "l": 60.4607826090967, "a": 21.085949561066908, "b": 44.85649634162373 } },
        { name: "723C", cmyk: { "c": 1, "m": 55, "y": 94, "k": 25 }, rgb: { "r": 179, "g": 105, "b": 36 }, lab: { "l": 51.62652393963198, "a": 24.362023103400464, "b": 48.856885631299484 } },
        { name: "724C", cmyk: { "c": 0, "m": 64, "y": 100, "k": 41 }, rgb: { "r": 147, "g": 77, "b": 17 }, lab: { "l": 40.493856985630174, "a": 25.41245433495323, "b": 44.80500543227266 } },
        { name: "725C", cmyk: { "c": 0, "m": 68, "y": 100, "k": 53 }, rgb: { "r": 125, "g": 64, "b": 22 }, lab: { "l": 34.158649469133586, "a": 23.220818504114227, "b": 35.82065006163878 } },
        { name: "726C", cmyk: { "c": 6, "m": 21, "y": 33, "k": 0 }, rgb: { "r": 224, "g": 192, "b": 159 }, lab: { "l": 79.64213648756635, "a": 6.536585562828323, "b": 20.85808151009396 } },
        { name: "727C", cmyk: { "c": 8, "m": 26, "y": 39, "k": 2 }, rgb: { "r": 217, "g": 180, "b": 143 }, lab: { "l": 75.68551509808013, "a": 8.146910486470926, "b": 23.88821049208769 } },
        { name: "728C", cmyk: { "c": 10, "m": 32, "y": 49, "k": 6 }, rgb: { "r": 205, "g": 161, "b": 119 }, lab: { "l": 69.32740345754998, "a": 10.77149205242306, "b": 28.072562224859297 } },
        { name: "729C", cmyk: { "c": 10, "m": 43, "y": 65, "k": 18 }, rgb: { "r": 181, "g": 129, "b": 80 }, lab: { "l": 58.1351214289992, "a": 14.542010364220037, "b": 34.29584671782009 } },
        { name: "730C", cmyk: { "c": 7, "m": 51, "y": 85, "k": 33 }, rgb: { "r": 158, "g": 101, "b": 46 }, lab: { "l": 47.973646243678, "a": 17.868407568417844, "b": 39.60841730141078 } },
        { name: "731C", cmyk: { "c": 0, "m": 63, "y": 100, "k": 57 }, rgb: { "r": 119, "g": 66, "b": 18 }, lab: { "l": 33.693899609605275, "a": 19.180197582752967, "b": 36.89288703702039 } },
        { name: "732C", cmyk: { "c": 0, "m": 69, "y": 100, "k": 68 }, rgb: { "r": 98, "g": 52, "b": 18 }, lab: { "l": 27.00745254232495, "a": 17.76449919078224, "b": 29.39698175997393 } },
        { name: "801C", cmyk: { "c": 85, "m": 0, "y": 8, "k": 0 }, rgb: { "r": 0, "g": 154, "b": 206 }, lab: { "l": 59.495911938654345, "a": -15.213656712627143, "b": -36.06492299525384 } },
        { name: "802C", cmyk: { "c": 51, "m": 0, "y": 85, "k": 0 }, rgb: { "r": 68, "g": 214, "b": 44 }, lab: { "l": 75.76376137516644, "a": -67.3165006896338, "b": 66.43712842305088 } },
        { name: "803C", cmyk: { "c": 0, "m": 3, "y": 97, "k": 0 }, rgb: { "r": 255, "g": 233, "b": 0 }, lab: { "l": 91.47708926454217, "a": -10.916658227605291, "b": 90.37654403731341 } },
        { name: "804C", cmyk: { "c": 0, "m": 41, "y": 63, "k": 0 }, rgb: { "r": 255, "g": 170, "b": 77 }, lab: { "l": 76.40273744295038, "a": 23.246383568700235, "b": 58.91209771608139 } },
        { name: "805C", cmyk: { "c": 0, "m": 58, "y": 41, "k": 0 }, rgb: { "r": 255, "g": 114, "b": 118 }, lab: { "l": 65.43811377182682, "a": 54.014950648732075, "b": 24.572659345836833 } },
        { name: "806C", cmyk: { "c": 0, "m": 72, "y": 0, "k": 0 }, rgb: { "r": 255, "g": 62, "b": 181 }, lab: { "l": 59.92616272402175, "a": 79.83581343758028, "b": -19.623879649852682 } },
        { name: "807C", cmyk: { "c": 12, "m": 76, "y": 0, "k": 0 }, rgb: { "r": 234, "g": 39, "b": 194 }, lab: { "l": 54.90560173433096, "a": 82.31541366352712, "b": -35.18161902660148 } },
        { name: "808C", cmyk: {}, rgb: { "r": 0, "g": 183, "b": 150 }, lab: { "l": 66.57259759041804, "a": -46.89499380496176, "b": 5.842571025787602 } },
        { name: "809C", cmyk: {}, rgb: { "r": 227, "g": 232, "b": 41 }, lab: { "l": 89.01891157329334, "a": -21.532240284572126, "b": 82.05985000480457 } },
        { name: "810C", cmyk: {}, rgb: { "r": 255, "g": 214, "b": 53 }, lab: { "l": 86.80531465588565, "a": -0.5212654877392864, "b": 77.94340412199628 } },
        { name: "811C", cmyk: {}, rgb: { "r": 255, "g": 143, "b": 108 }, lab: { "l": 70.86239105409986, "a": 39.118188061788686, "b": 37.11008354423768 } },
        { name: "812C", cmyk: {}, rgb: { "r": 255, "g": 95, "b": 162 }, lab: { "l": 63.38670731002735, "a": 66.3710946908792, "b": -3.487068062996701 } },
        { name: "813C", cmyk: {}, rgb: { "r": 251, "g": 72, "b": 196 }, lab: { "l": 60.89573298711933, "a": 77.66155018978732, "b": -26.801584553420945 } },
        { name: "814C", cmyk: {}, rgb: { "r": 138, "g": 105, "b": 212 }, lab: { "l": 52.12978508667406, "a": 36.702410635254815, "b": -50.723382876602074 } },
        { name: "1205C", cmyk: { "c": 0, "m": 4, "y": 48, "k": 0 }, rgb: { "r": 248, "g": 224, "b": 142 }, lab: { "l": 89.49630081035835, "a": -2.656122992434673, "b": 43.073690635533524 } },
        { name: "1215C", cmyk: { "c": 0, "m": 7, "y": 61, "k": 0 }, rgb: { "r": 251, "g": 216, "b": 114 }, lab: { "l": 87.40520415479742, "a": 0.10903377194065866, "b": 54.13962507739605 } },
        { name: "1225C", cmyk: { "c": 0, "m": 16, "y": 80, "k": 0 }, rgb: { "r": 255, "g": 200, "b": 69 }, lab: { "l": 83.44144470916825, "a": 7.251010980908523, "b": 69.38521860942967 } },
        { name: "1235C", cmyk: { "c": 0, "m": 25, "y": 94, "k": 0 }, rgb: { "r": 255, "g": 184, "b": 28 }, lab: { "l": 79.3998141227177, "a": 14.325609542502725, "b": 78.18451875744388 } },
        { name: "1245C", cmyk: { "c": 2, "m": 31, "y": 98, "k": 16 }, rgb: { "r": 198, "g": 146, "b": 20 }, lab: { "l": 63.84717072274694, "a": 9.698730076142192, "b": 65.1932390509817 } },
        { name: "1255C", cmyk: { "c": 3, "m": 30, "y": 95, "k": 29 }, rgb: { "r": 173, "g": 132, "b": 31 }, lab: { "l": 57.545619444167585, "a": 6.449597315779876, "b": 55.86104516992432 } },
        { name: "1265C", cmyk: { "c": 10, "m": 32, "y": 92, "k": 45 }, rgb: { "r": 136, "g": 107, "b": 37 }, lab: { "l": 46.82087888232216, "a": 3.822825732665347, "b": 41.90255746000664 } },
        { name: "1345C", cmyk: { "c": 0, "m": 13, "y": 50, "k": 0 }, rgb: { "r": 253, "g": 208, "b": 134 }, lab: { "l": 85.86405451293564, "a": 6.7302463003129915, "b": 42.553252717335056 } },
        { name: "1355C", cmyk: { "c": 0, "m": 19, "y": 61, "k": 0 }, rgb: { "r": 255, "g": 197, "b": 110 }, lab: { "l": 83.08239761827893, "a": 11.213223464447752, "b": 51.02336311229152 } },
        { name: "1365C", cmyk: { "c": 0, "m": 28, "y": 79, "k": 0 }, rgb: { "r": 255, "g": 181, "b": 73 }, lab: { "l": 78.9194506027333, "a": 17.305398542037555, "b": 63.26297351632384 } },
        { name: "1375C", cmyk: { "c": 0, "m": 40, "y": 97, "k": 0 }, rgb: { "r": 255, "g": 158, "b": 27 }, lab: { "l": 73.41091759849749, "a": 27.864975690025773, "b": 73.8560906797838 } },
        { name: "1385C", cmyk: { "c": 0, "m": 54, "y": 100, "k": 5 }, rgb: { "r": 213, "g": 120, "b": 0 }, lab: { "l": 59.50653790855556, "a": 30.02251778176407, "b": 66.45303076174872 } },
        { name: "1395C", cmyk: { "c": 0, "m": 51, "y": 100, "k": 39 }, rgb: { "r": 153, "g": 96, "b": 23 }, lab: { "l": 45.906794066981426, "a": 17.46978967670848, "b": 47.53810439804524 } },
        { name: "1405C", cmyk: { "c": 8, "m": 49, "y": 97, "k": 60 }, rgb: { "r": 110, "g": 76, "b": 30 }, lab: { "l": 35.157997608788015, "a": 9.472308871162294, "b": 32.15462831414603 } },
        { name: "1485C", cmyk: { "c": 0, "m": 34, "y": 68, "k": 0 }, rgb: { "r": 255, "g": 174, "b": 98 }, lab: { "l": 77.5277042123443, "a": 22.372208172518228, "b": 50.31299360784847 } },
        { name: "1495C", cmyk: { "c": 0, "m": 49, "y": 96, "k": 0 }, rgb: { "r": 255, "g": 143, "b": 28 }, lab: { "l": 70.16804814252578, "a": 35.60760223260589, "b": 71.17797653026223 } },
        { name: "1505C", cmyk: { "c": 0, "m": 64, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 105, "b": 0 }, lab: { "l": 62.81300444338501, "a": 53.679864418145485, "b": 71.61073417588733 } },
        { name: "1525C", cmyk: { "c": 0, "m": 77, "y": 100, "k": 14 }, rgb: { "r": 185, "g": 71, "b": 0 }, lab: { "l": 45.38772255926457, "a": 43.60126952179583, "b": 55.97722822295561 } },
        { name: "1535C", cmyk: { "c": 0, "m": 71, "y": 100, "k": 38 }, rgb: { "r": 148, "g": 69, "b": 11 }, lab: { "l": 38.85749639655024, "a": 30.10270179916083, "b": 45.60472905742816 } },
        { name: "1545C", cmyk: { "c": 0, "m": 68, "y": 100, "k": 67 }, rgb: { "r": 101, "g": 56, "b": 24 }, lab: { "l": 28.540553427314393, "a": 17.05648434483631, "b": 27.90139871499271 } },
        { name: "1555C", cmyk: { "c": 0, "m": 29, "y": 40, "k": 0 }, rgb: { "r": 255, "g": 185, "b": 144 }, lab: { "l": 80.72296528610946, "a": 20.47368976495145, "b": 30.782819866817746 } },
        { name: "1565C", cmyk: { "c": 0, "m": 42, "y": 60, "k": 0 }, rgb: { "r": 255, "g": 160, "b": 106 }, lab: { "l": 74.47174926299405, "a": 30.228291442797982, "b": 42.639083306981476 } },
        { name: "1575C", cmyk: { "c": 0, "m": 59, "y": 90, "k": 0 }, rgb: { "r": 255, "g": 127, "b": 50 }, lab: { "l": 67.02798066393228, "a": 44.140884966536234, "b": 61.19840012533933 } },
        { name: "1585C", cmyk: { "c": 0, "m": 66, "y": 99, "k": 0 }, rgb: { "r": 255, "g": 106, "b": 20 }, lab: { "l": 63.02637980055883, "a": 53.40699202400956, "b": 68.07599826871842 } },
        { name: "1595C", cmyk: { "c": 0, "m": 70, "y": 100, "k": 2 }, rgb: { "r": 216, "g": 96, "b": 24 }, lab: { "l": 55.10386328275679, "a": 43.7521518313182, "b": 58.4740580606635 } },
        { name: "1605C", cmyk: { "c": 1, "m": 66, "y": 95, "k": 30 }, rgb: { "r": 166, "g": 85, "b": 35 }, lab: { "l": 45.255688761327825, "a": 29.73816227400561, "b": 42.53252492616719 } },
        { name: "1615C", cmyk: { "c": 1, "m": 68, "y": 98, "k": 44 }, rgb: { "r": 139, "g": 71, "b": 32 }, lab: { "l": 38.02082617400256, "a": 25.828727708296697, "b": 35.38272253779673 } },
        { name: "1625C", cmyk: { "c": 0, "m": 41, "y": 39, "k": 0 }, rgb: { "r": 255, "g": 163, "b": 139 }, lab: { "l": 75.64902350336557, "a": 31.47659495400468, "b": 26.6758534978198 } },
        { name: "1635C", cmyk: { "c": 0, "m": 53, "y": 55, "k": 0 }, rgb: { "r": 255, "g": 141, "b": 109 }, lab: { "l": 70.4649235200727, "a": 40.20484185457796, "b": 36.07319593879641 } },
        { name: "1645C", cmyk: { "c": 0, "m": 68, "y": 85, "k": 0 }, rgb: { "r": 255, "g": 106, "b": 57 }, lab: { "l": 63.22988754410932, "a": 54.25091502239471, "b": 54.48441095393212 } },
        { name: "1655C", cmyk: { "c": 0, "m": 77, "y": 100, "k": 0 }, rgb: { "r": 252, "g": 76, "b": 2 }, lab: { "l": 57.91222241632765, "a": 64.47535542655596, "b": 68.41626178418521 } },
        { name: "1665C", cmyk: { "c": 0, "m": 82, "y": 100, "k": 0 }, rgb: { "r": 220, "g": 68, "b": 5 }, lab: { "l": 51.106732915593355, "a": 57.16240423690616, "b": 61.10782467599807 } },
        { name: "1675C", cmyk: { "c": 0, "m": 79, "y": 100, "k": 26 }, rgb: { "r": 169, "g": 67, "b": 30 }, lab: { "l": 42.06652824198215, "a": 40.01980267104977, "b": 42.01818918272574 } },
        { name: "1685C", cmyk: { "c": 1, "m": 79, "y": 95, "k": 48 }, rgb: { "r": 131, "g": 57, "b": 33 }, lab: { "l": 33.6924552769569, "a": 30.18990859791279, "b": 29.82446024427966 } },
        { name: "1765C", cmyk: { "c": 0, "m": 42, "y": 9, "k": 0 }, rgb: { "r": 255, "g": 163, "b": 181 }, lab: { "l": 76.55198076382212, "a": 36.27501773676867, "b": 5.050101014100283 } },
        { name: "1767C", cmyk: { "c": 0, "m": 36, "y": 5, "k": 0 }, rgb: { "r": 252, "g": 175, "b": 192 }, lab: { "l": 79.13400764519274, "a": 30.431377177846276, "b": 2.7495649327363925 } },
        { name: "1775C", cmyk: { "c": 0, "m": 53, "y": 15, "k": 0 }, rgb: { "r": 255, "g": 141, "b": 161 }, lab: { "l": 71.47546248211388, "a": 45.08481213163956, "b": 8.80716974946898 } },
        { name: "1777C", cmyk: { "c": 0, "m": 72, "y": 30, "k": 0 }, rgb: { "r": 251, "g": 99, "b": 126 }, lab: { "l": 62.456332300897174, "a": 60.02987380353708, "b": 15.848324356213507 } },
        { name: "1785C", cmyk: { "c": 0, "m": 82, "y": 51, "k": 0 }, rgb: { "r": 248, "g": 72, "b": 94 }, lab: { "l": 57.4624602010779, "a": 67.33450396511925, "b": 27.616546609257586 } },
        { name: "1787C", cmyk: { "c": 0, "m": 89, "y": 66, "k": 0 }, rgb: { "r": 244, "g": 54, "b": 76 }, lab: { "l": 54.44176908786592, "a": 70.8533218842985, "b": 34.15245190397632 } },
        { name: "1788C", cmyk: { "c": 0, "m": 93, "y": 82, "k": 0 }, rgb: { "r": 238, "g": 39, "b": 55 }, lab: { "l": 51.72851650900101, "a": 72.07724611199046, "b": 42.73731717034727 } },
        { name: "1795C", cmyk: { "c": 0, "m": 96, "y": 82, "k": 1 }, rgb: { "r": 210, "g": 39, "b": 48 }, lab: { "l": 46.131568686514036, "a": 64.23876746902835, "b": 39.04126427302194 } },
        { name: "1797C", cmyk: { "c": 0, "m": 92, "y": 72, "k": 6 }, rgb: { "r": 203, "g": 51, "b": 59 }, lab: { "l": 46.150234835549874, "a": 59.17132500744088, "b": 32.31988230392864 } },
        { name: "1805C", cmyk: { "c": 0, "m": 97, "y": 78, "k": 22 }, rgb: { "r": 175, "g": 39, "b": 47 }, lab: { "l": 39.19075927765231, "a": 54.040177485122435, "b": 29.963686236393038 } },
        { name: "1807C", cmyk: { "c": 3, "m": 90, "y": 65, "k": 28 }, rgb: { "r": 164, "g": 52, "b": 58 }, lab: { "l": 38.99147164638282, "a": 46.336731376827615, "b": 22.495513287637614 } },
        { name: "1815C", cmyk: { "c": 2, "m": 97, "y": 72, "k": 52 }, rgb: { "r": 124, "g": 38, "b": 41 }, lab: { "l": 28.98307380259378, "a": 37.37691725753231, "b": 19.036635984074834 } },
        { name: "1817C", cmyk: { "c": 23, "m": 80, "y": 58, "k": 57 }, rgb: { "r": 100, "g": 51, "b": 53 }, lab: { "l": 27.665944169692303, "a": 22.18276459814139, "b": 8.664854895076179 } },
        { name: "1895C", cmyk: { "c": 0, "m": 32, "y": 0, "k": 0 }, rgb: { "r": 245, "g": 182, "b": 205 }, lab: { "l": 80.3346671928335, "a": 26.190163974195602, "b": -2.623316369181894 } },
        { name: "1905C", cmyk: { "c": 0, "m": 47, "y": 2, "k": 0 }, rgb: { "r": 245, "g": 155, "b": 187 }, lab: { "l": 73.83208569595777, "a": 37.73553344932995, "b": -2.3474498939603183 } },
        { name: "1915C", cmyk: { "c": 0, "m": 81, "y": 16, "k": 0 }, rgb: { "r": 239, "g": 75, "b": 129 }, lab: { "l": 57.04408788539584, "a": 66.21975402009295, "b": 6.190628935685671 } },
        { name: "1925C", cmyk: { "c": 0, "m": 100, "y": 52, "k": 0 }, rgb: { "r": 224, "g": 0, "b": 77 }, lab: { "l": 47.47316483377123, "a": 74.53394681451486, "b": 23.984136496572482 } },
        { name: "1935C", cmyk: { "c": 0, "m": 100, "y": 59, "k": 8 }, rgb: { "r": 197, "g": 0, "b": 62 }, lab: { "l": 41.56070247273917, "a": 67.46348719753958, "b": 24.61693025878643 } },
        { name: "1945C", cmyk: { "c": 0, "m": 100, "y": 48, "k": 26 }, rgb: { "r": 166, "g": 10, "b": 61 }, lab: { "l": 35.323223496957795, "a": 58.69506867336971, "b": 15.890414779363926 } },
        { name: "1955C", cmyk: { "c": 0, "m": 100, "y": 43, "k": 43 }, rgb: { "r": 138, "g": 21, "b": 56 }, lab: { "l": 29.973484365116477, "a": 48.873861745075466, "b": 10.952329221946322 } },
        { name: "2365C", cmyk: { "c": 3, "m": 29, "y": 0, "k": 0 }, rgb: { "r": 239, "g": 186, "b": 225 }, lab: { "l": 81.23922593344362, "a": 25.291140739254647, "b": -12.12692094573493 } },
        { name: "2375C", cmyk: { "c": 12, "m": 59, "y": 0, "k": 0 }, rgb: { "r": 226, "g": 119, "b": 205 }, lab: { "l": 64.77973986648095, "a": 52.67604625219746, "b": -26.222219363529643 } },
        { name: "2385C", cmyk: { "c": 19, "m": 82, "y": 0, "k": 0 }, rgb: { "r": 213, "g": 57, "b": 181 }, lab: { "l": 52.29605516433236, "a": 71.50441584059458, "b": -31.983547295226145 } },
        { name: "2395C", cmyk: { "c": 23, "m": 96, "y": 0, "k": 0 }, rgb: { "r": 200, "g": 0, "b": 161 }, lab: { "l": 45.43160339462622, "a": 76.59326608420957, "b": -31.074941136754532 } },
        { name: "2405C", cmyk: { "c": 31, "m": 100, "y": 0, "k": 1 }, rgb: { "r": 176, "g": 0, "b": 142 }, lab: { "l": 39.887162899759076, "a": 69.71993884728575, "b": -28.5894567853329 } },
        { name: "2415C", cmyk: { "c": 35, "m": 100, "y": 0, "k": 6 }, rgb: { "r": 158, "g": 0, "b": 126 }, lab: { "l": 35.54833010756345, "a": 64.22886890449267, "b": -25.73549592638521 } },
        { name: "2425C", cmyk: { "c": 36, "m": 100, "y": 0, "k": 23 }, rgb: { "r": 131, "g": 0, "b": 101 }, lab: { "l": 28.811354927407116, "a": 55.63645879439411, "b": -20.73277004595937 } },
        { name: "2562C", cmyk: { "c": 14, "m": 35, "y": 0, "k": 0 }, rgb: { "r": 215, "g": 169, "b": 227 }, lab: { "l": 75.05711087444223, "a": 26.872023422197632, "b": -22.76117531389572 } },
        { name: "2563C", cmyk: { "c": 18, "m": 38, "y": 0, "k": 0 }, rgb: { "r": 203, "g": 163, "b": 216 }, lab: { "l": 72.12729499705365, "a": 24.0921631556969, "b": -21.315484407156692 } },
        { name: "2567C", cmyk: { "c": 24, "m": 38, "y": 0, "k": 0 }, rgb: { "r": 193, "g": 160, "b": 218 }, lab: { "l": 70.55331781704912, "a": 22.92345656699335, "b": -24.89902559372521 } },
        { name: "2572C", cmyk: { "c": 23, "m": 49, "y": 0, "k": 0 }, rgb: { "r": 201, "g": 139, "b": 219 }, lab: { "l": 66.51779890847962, "a": 37.185094298767595, "b": -31.59528619630967 } },
        { name: "2573C", cmyk: { "c": 28, "m": 52, "y": 0, "k": 0 }, rgb: { "r": 184, "g": 132, "b": 203 }, lab: { "l": 62.511577631975314, "a": 32.49074644891026, "b": -29.00311532761752 } },
        { name: "2577C", cmyk: { "c": 39, "m": 56, "y": 0, "k": 0 }, rgb: { "r": 167, "g": 123, "b": 202 }, lab: { "l": 58.644916103206896, "a": 32.07366019015123, "b": -34.57979938401709 } },
        { name: "2582C", cmyk: { "c": 41, "m": 77, "y": 0, "k": 0 }, rgb: { "r": 172, "g": 79, "b": 198 }, lab: { "l": 50.02529524964349, "a": 55.8492935830519, "b": -45.83344190579186 } },
        { name: "2583C", cmyk: { "c": 42, "m": 71, "y": 0, "k": 0 }, rgb: { "r": 160, "g": 94, "b": 181 }, lab: { "l": 50.47027819407829, "a": 41.52517962698088, "b": -35.39399917543506 } },
        { name: "2587C", cmyk: { "c": 61, "m": 83, "y": 0, "k": 0 }, rgb: { "r": 130, "g": 70, "b": 175 }, lab: { "l": 41.5656837132689, "a": 44.91101060824365, "b": -46.230616922409865 } },
        { name: "2592C", cmyk: { "c": 52, "m": 93, "y": 0, "k": 0 }, rgb: { "r": 155, "g": 38, "b": 182 }, lab: { "l": 40.787270105176724, "a": 65.23557741827781, "b": -51.4256005070372 } },
        { name: "2593C", cmyk: { "c": 59, "m": 94, "y": 0, "k": 0 }, rgb: { "r": 132, "g": 50, "b": 155 }, lab: { "l": 37.02846562177048, "a": 50.76171904679683, "b": -41.516989830503135 } },
        { name: "2597C", cmyk: { "c": 82, "m": 100, "y": 0, "k": 4 }, rgb: { "r": 92, "g": 6, "b": 140 }, lab: { "l": 24.636299732396623, "a": 54.51895111412741, "b": -52.658491194516344 } },
        { name: "2602C", cmyk: { "c": 58, "m": 99, "y": 0, "k": 0 }, rgb: { "r": 135, "g": 24, "b": 157 }, lab: { "l": 34.47470497129528, "a": 60.818795622772484, "b": -46.80517195804394 } },
        { name: "2603C", cmyk: { "c": 66, "m": 100, "y": 0, "k": 4 }, rgb: { "r": 112, "g": 32, "b": 130 }, lab: { "l": 29.63708721198234, "a": 48.62160288731576, "b": -38.14363077235144 } },
        { name: "2607C", cmyk: { "c": 85, "m": 100, "y": 0, "k": 13 }, rgb: { "r": 80, "g": 8, "b": 120 }, lab: { "l": 20.962267590475854, "a": 48.097718575381975, "b": -46.11125818303622 } },
        { name: "2612C", cmyk: { "c": 61, "m": 100, "y": 0, "k": 1 }, rgb: { "r": 119, "g": 37, "b": 131 }, lab: { "l": 31.540826240520396, "a": 48.44040332851096, "b": -35.657893367701355 } },
        { name: "2613C", cmyk: { "c": 68, "m": 100, "y": 0, "k": 8 }, rgb: { "r": 103, "g": 30, "b": 117 }, lab: { "l": 27.007845145123063, "a": 44.76366262102008, "b": -34.22449186250254 } },
        { name: "2617C", cmyk: { "c": 85, "m": 100, "y": 0, "k": 23 }, rgb: { "r": 71, "g": 10, "b": 104 }, lab: { "l": 18.17067301596625, "a": 42.59531129357239, "b": -40.358119150081606 } },
        { name: "2622C", cmyk: { "c": 57, "m": 95, "y": 3, "k": 27 }, rgb: { "r": 101, "g": 49, "b": 101 }, lab: { "l": 29.166187608480854, "a": 31.634854505530967, "b": -20.57596949638174 } },
        { name: "2623C", cmyk: { "c": 66, "m": 100, "y": 0, "k": 20 }, rgb: { "r": 95, "g": 33, "b": 103 }, lab: { "l": 25.259600583564904, "a": 38.61177952263298, "b": -28.082070525852366 } },
        { name: "2627C", cmyk: { "c": 83, "m": 100, "y": 0, "k": 44 }, rgb: { "r": 60, "g": 16, "b": 83 }, lab: { "l": 15.253420405444185, "a": 33.35964430344415, "b": -31.156704679420656 } },
        { name: "2635C", cmyk: { "c": 21, "m": 27, "y": 0, "k": 0 }, rgb: { "r": 197, "g": 180, "b": 227 }, lab: { "l": 76.10538975570948, "a": 15.086464860162852, "b": -21.314749292815648 } },
        { name: "2645C", cmyk: { "c": 34, "m": 41, "y": 0, "k": 0 }, rgb: { "r": 173, "g": 150, "b": 220 }, lab: { "l": 66.41606062423256, "a": 22.7282008704095, "b": -32.52308017420309 } },
        { name: "2655C", cmyk: { "c": 49, "m": 55, "y": 0, "k": 0 }, rgb: { "r": 150, "g": 120, "b": 211 }, lab: { "l": 56.70339890875691, "a": 30.989452386008253, "b": -42.829751933757066 } },
        { name: "2665C", cmyk: { "c": 65, "m": 73, "y": 0, "k": 0 }, rgb: { "r": 125, "g": 85, "b": 199 }, lab: { "l": 45.60746958583302, "a": 41.514242882654486, "b": -53.79548652956334 } },
        { name: "2685C", cmyk: { "c": 97, "m": 100, "y": 0, "k": 19 }, rgb: { "r": 51, "g": 0, "b": 114 }, lab: { "l": 15.054743785318383, "a": 45.70920227591135, "b": -52.12437801995095 } },
        { name: "2695C", cmyk: { "c": 89, "m": 100, "y": 0, "k": 58 }, rgb: { "r": 46, "g": 26, "b": 71 }, lab: { "l": 14.256718966892983, "a": 20.880559562993174, "b": -24.63187104330752 } },
        { name: "2705C", cmyk: { "c": 36, "m": 32, "y": 0, "k": 0 }, rgb: { "r": 167, "g": 164, "b": 224 }, lab: { "l": 69.57497477419315, "a": 13.983884589060525, "b": -29.88502534618278 } },
        { name: "2706C", cmyk: { "c": 18, "m": 11, "y": 0, "k": 0 }, rgb: { "r": 203, "g": 211, "b": 234 }, lab: { "l": 84.59983047065631, "a": 1.809171860578107, "b": -12.227462972885128 } },
        { name: "2707C", cmyk: { "c": 21, "m": 7, "y": 0, "k": 0 }, rgb: { "r": 195, "g": 215, "b": 238 }, lab: { "l": 85.1878585992679, "a": -1.966933834394835, "b": -13.527062378466415 } },
        { name: "2708C", cmyk: { "c": 25, "m": 12, "y": 0, "k": 0 }, rgb: { "r": 184, "g": 204, "b": 234 }, lab: { "l": 81.46530623735696, "a": -0.4160300220036328, "b": -17.065578608004394 } },
        { name: "2715C", cmyk: { "c": 52, "m": 47, "y": 0, "k": 0 }, rgb: { "r": 139, "g": 132, "b": 215 }, lab: { "l": 58.87960327309642, "a": 22.0244392086244, "b": -41.716533064797126 } },
        { name: "2716C", cmyk: { "c": 38, "m": 26, "y": 0, "k": 0 }, rgb: { "r": 159, "g": 174, "b": 229 }, lab: { "l": 71.758233483407, "a": 7.277801422684915, "b": -29.30594828006152 } },
        { name: "2717C", cmyk: { "c": 32, "m": 13, "y": 0, "k": 0 }, rgb: { "r": 167, "g": 198, "b": 237 }, lab: { "l": 78.87860185279595, "a": -1.5560528800795392, "b": -22.69305967173334 } },
        { name: "2718C", cmyk: { "c": 65, "m": 40, "y": 0, "k": 0 }, rgb: { "r": 92, "g": 136, "b": 218 }, lab: { "l": 57.02236442469189, "a": 9.292699274161265, "b": -46.53316610722469 } },
        { name: "2725C", cmyk: { "c": 73, "m": 68, "y": 0, "k": 0 }, rgb: { "r": 104, "g": 91, "b": 199 }, lab: { "l": 45.009837255287664, "a": 33.221377424018314, "b": -54.85989915014227 } },
        { name: "2726C", cmyk: { "c": 83, "m": 66, "y": 0, "k": 0 }, rgb: { "r": 72, "g": 92, "b": 199 }, lab: { "l": 42.99666339828994, "a": 26.35484828463086, "b": -58.22237866644748 } },
        { name: "2727C", cmyk: { "c": 75, "m": 45, "y": 0, "k": 0 }, rgb: { "r": 48, "g": 127, "b": 226 }, lab: { "l": 53.274224222276814, "a": 10.871403656038892, "b": -57.09295321739993 } },
        { name: "2728C", cmyk: { "c": 99, "m": 76, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 71, "b": 187 }, lab: { "l": 34.178576798761, "a": 29.00987318202941, "b": -65.68374911834255 } },
        { name: "2735C", cmyk: { "c": 99, "m": 99, "y": 0, "k": 5 }, rgb: { "r": 46, "g": 0, "b": 139 }, lab: { "l": 17.667666225965014, "a": 51.581587366239745, "b": -63.75227354961787 } },
        { name: "2736C", cmyk: { "c": 100, "m": 90, "y": 0, "k": 2 }, rgb: { "r": 30, "g": 34, "b": 170 }, lab: { "l": 24.70971775542617, "a": 46.916318412202926, "b": -71.14367921948886 } },
        { name: "2738C", cmyk: { "c": 100, "m": 91, "y": 0, "k": 13 }, rgb: { "r": 6, "g": 3, "b": 141 }, lab: { "l": 15.627940604180797, "a": 49.95703323759248, "b": -68.47614420045045 } },
        { name: "2745C", cmyk: { "c": 100, "m": 98, "y": 0, "k": 22 }, rgb: { "r": 40, "g": 0, "b": 113 }, lab: { "l": 13.491927710695165, "a": 44.68044851676081, "b": -54.10975252964568 } },
        { name: "2746C", cmyk: { "c": 100, "m": 91, "y": 0, "k": 10 }, rgb: { "r": 23, "g": 28, "b": 143 }, lab: { "l": 20.027214316451243, "a": 40.72455093091965, "b": -62.38093439207808 } },
        { name: "2747C", cmyk: { "c": 100, "m": 85, "y": 0, "k": 37 }, rgb: { "r": 0, "g": 26, "b": 114 }, lab: { "l": 15.242336405161375, "a": 30.188954101911413, "b": -51.930721980432835 } },
        { name: "2748C", cmyk: { "c": 100, "m": 86, "y": 0, "k": 35 }, rgb: { "r": 0, "g": 24, "b": 113 }, lab: { "l": 14.654748454685706, "a": 31.10263979510733, "b": -52.25568386781438 } },
        { name: "2755C", cmyk: { "c": 99, "m": 98, "y": 0, "k": 35 }, rgb: { "r": 37, "g": 14, "b": 98 }, lab: { "l": 13.16445105599676, "a": 34.463786755475596, "b": -44.792783316791116 } },
        { name: "2756C", cmyk: { "c": 100, "m": 92, "y": 0, "k": 26 }, rgb: { "r": 21, "g": 31, "b": 109 }, lab: { "l": 16.716630253082037, "a": 26.26470255588226, "b": -46.223665456294135 } },
        { name: "2757C", cmyk: { "c": 100, "m": 81, "y": 0, "k": 51 }, rgb: { "r": 0, "g": 30, "b": 96 }, lab: { "l": 14.248255521571028, "a": 19.80104855565318, "b": -41.75977774163319 } },
        { name: "2758C", cmyk: { "c": 100, "m": 83, "y": 0, "k": 47 }, rgb: { "r": 0, "g": 30, "b": 98 }, lab: { "l": 14.458972069294166, "a": 20.684446651578675, "b": -42.74123837752784 } },
        { name: "2765C", cmyk: { "c": 98, "m": 98, "y": 0, "k": 60 }, rgb: { "r": 32, "g": 21, "b": 71 }, lab: { "l": 11.263862366789326, "a": 20.548636853598104, "b": -29.547879318576303 } },
        { name: "2766C", cmyk: { "c": 100, "m": 87, "y": 0, "k": 58 }, rgb: { "r": 20, "g": 27, "b": 77 }, lab: { "l": 12.405806917534328, "a": 16.05788650519574, "b": -31.8937370753568 } },
        { name: "2767C", cmyk: { "c": 100, "m": 71, "y": 0, "k": 66 }, rgb: { "r": 19, "g": 41, "b": 75 }, lab: { "l": 16.6620680244529, "a": 4.493982794887719, "b": -23.671147766799628 } },
        { name: "2768C", cmyk: { "c": 100, "m": 78, "y": 0, "k": 66 }, rgb: { "r": 7, "g": 29, "b": 73 }, lab: { "l": 11.990493922892092, "a": 10.865076542001695, "b": -29.839109781740824 } },
        { name: "2905C", cmyk: { "c": 43, "m": 3, "y": 0, "k": 0 }, rgb: { "r": 141, "g": 200, "b": 232 }, lab: { "l": 77.75527009703501, "a": -10.973918964209684, "b": -21.855211498736125 } },
        { name: "2915C", cmyk: { "c": 58, "m": 8, "y": 0, "k": 0 }, rgb: { "r": 98, "g": 181, "b": 229 }, lab: { "l": 70.38668493172554, "a": -11.588066489346794, "b": -31.692604270366907 } },
        { name: "2925C", cmyk: { "c": 75, "m": 18, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 156, "b": 222 }, lab: { "l": 60.82648951879938, "a": -10.476739068753238, "b": -42.899676999775394 } },
        { name: "2935C", cmyk: { "c": 100, "m": 63, "y": 0, "k": 2 }, rgb: { "r": 0, "g": 87, "b": 183 }, lab: { "l": 38.26144272027819, "a": 16.636374714070424, "b": -56.67426141344638 } },
        { name: "2945C", cmyk: { "c": 100, "m": 64, "y": 0, "k": 16 }, rgb: { "r": 0, "g": 76, "b": 151 }, lab: { "l": 32.70782788305678, "a": 10.719529921931453, "b": -46.561464830525935 } },
        { name: "2955C", cmyk: { "c": 100, "m": 52, "y": 0, "k": 58 }, rgb: { "r": 0, "g": 56, "b": 101 }, lab: { "l": 22.888901781584053, "a": 2.790180917841112, "b": -31.028871356859522 } },
        { name: "2965C", cmyk: { "c": 100, "m": 40, "y": 0, "k": 82 }, rgb: { "r": 0, "g": 38, "b": 62 }, lab: { "l": 14.024557113700531, "a": -2.2784514311590396, "b": -18.933302101193373 } },
        { name: "2975C", cmyk: { "c": 37, "m": 0, "y": 0, "k": 0 }, rgb: { "r": 153, "g": 214, "b": 234 }, lab: { "l": 82.27431391823015, "a": -14.56639138208815, "b": -16.03284041249293 } },
        { name: "2985C", cmyk: { "c": 58, "m": 0, "y": 0, "k": 0 }, rgb: { "r": 91, "g": 194, "b": 231 }, lab: { "l": 73.91853929317651, "a": -19.140669872969806, "b": -27.363591848159952 } },
        { name: "2995C", cmyk: { "c": 79, "m": 3, "y": 0, "k": 0 }, rgb: { "r": 0, "g": 169, "b": 224 }, lab: { "l": 64.76982912979852, "a": -16.875103472149267, "b": -37.825508509252344 } },
        { name: "3005C", cmyk: { "c": 100, "m": 35, "y": 0, "k": 2 }, rgb: { "r": 0, "g": 119, "b": 200 }, lab: { "l": 48.7151706441594, "a": 2.890581543898596, "b": -49.70323090858566 } },
        { name: "3015C", cmyk: { "c": 100, "m": 32, "y": 0, "k": 25 }, rgb: { "r": 0, "g": 98, "b": 155 }, lab: { "l": 39.75160711096444, "a": -2.051666198477381, "b": -37.6897241464979 } },
        { name: "3025C", cmyk: { "c": 100, "m": 19, "y": 0, "k": 56 }, rgb: { "r": 0, "g": 79, "b": 113 }, lab: { "l": 31.31054369542408, "a": -7.340641238502394, "b": -25.332708260014147 } },
        { name: "3035C", cmyk: { "c": 100, "m": 19, "y": 10, "k": 72 }, rgb: { "r": 0, "g": 62, "b": 81 }, lab: { "l": 23.801041322342627, "a": -9.973761150966876, "b": -16.501764786873895 } },
        { name: "3105C", cmyk: { "c": 49, "m": 0, "y": 7, "k": 0 }, rgb: { "r": 103, "g": 210, "b": 223 }, lab: { "l": 78.63893286969488, "a": -27.211186217548256, "b": -15.846423980114821 } },
        { name: "3115C", cmyk: { "c": 70, "m": 0, "y": 13, "k": 0 }, rgb: { "r": 0, "g": 193, "b": 212 }, lab: { "l": 71.4825556737801, "a": -33.07790768702823, "b": -20.902267527527574 } },
        { name: "3125C", cmyk: { "c": 89, "m": 0, "y": 19, "k": 0 }, rgb: { "r": 0, "g": 174, "b": 199 }, lab: { "l": 65.27538918843084, "a": -28.076733593435378, "b": -23.22659413753754 } },
        { name: "3135C", cmyk: { "c": 100, "m": 0, "y": 22, "k": 10 }, rgb: { "r": 0, "g": 142, "b": 170 }, lab: { "l": 54.28945026877912, "a": -21.653197755757247, "b": -23.740658762393863 } },
        { name: "3145C", cmyk: { "c": 100, "m": 0, "y": 24, "k": 30 }, rgb: { "r": 0, "g": 119, "b": 139 }, lab: { "l": 45.71316808321945, "a": -20.459658890992326, "b": -18.842744405952505 } },
        { name: "3155C", cmyk: { "c": 100, "m": 0, "y": 25, "k": 47 }, rgb: { "r": 0, "g": 98, "b": 113 }, lab: { "l": 37.71221093114989, "a": -18.51475546299122, "b": -15.406504910626994 } },
        { name: "3165C", cmyk: { "c": 100, "m": 0, "y": 29, "k": 64 }, rgb: { "r": 0, "g": 79, "b": 89 }, lab: { "l": 30.189358831613156, "a": -16.891440665695175, "b": -11.866077395717323 } },
        { name: "3242C", cmyk: { "c": 44, "m": 0, "y": 17, "k": 0 }, rgb: { "r": 113, "g": 219, "b": 212 }, lab: { "l": 81.25157008859259, "a": -32.32429830636235, "b": -6.034222065872141 } },
        { name: "3245C", cmyk: { "c": 40, "m": 0, "y": 19, "k": 0 }, rgb: { "r": 124, "g": 224, "b": 211 }, lab: { "l": 83.07245948598295, "a": -32.41943259175856, "b": -2.77232239915719 } },
        { name: "3248C", cmyk: { "c": 52, "m": 0, "y": 32, "k": 0 }, rgb: { "r": 109, "g": 205, "b": 184 }, lab: { "l": 76.2985831915352, "a": -33.449057465361534, "b": 1.6788270761667556 } },
        { name: "3252C", cmyk: { "c": 59, "m": 0, "y": 26, "k": 0 }, rgb: { "r": 42, "g": 210, "b": 201 }, lab: { "l": 76.55920352219849, "a": -42.14281463007657, "b": -7.286609063276672 } },
        { name: "3255C", cmyk: { "c": 58, "m": 0, "y": 30, "k": 0 }, rgb: { "r": 44, "g": 213, "b": 196 }, lab: { "l": 77.34626439883323, "a": -44.6673245017058, "b": -3.4343829726087405 } },
        { name: "3258C", cmyk: { "c": 62, "m": 0, "y": 35, "k": 0 }, rgb: { "r": 73, "g": 197, "b": 177 }, lab: { "l": 72.57689001842479, "a": -38.92440795877344, "b": -0.09981709830579888 } },
        { name: "3262C", cmyk: { "c": 81, "m": 0, "y": 40, "k": 0 }, rgb: { "r": 0, "g": 191, "b": 178 }, lab: { "l": 69.80719283385349, "a": -42.53281796399322, "b": -4.826083499987965 } },
        { name: "3265C", cmyk: { "c": 75, "m": 0, "y": 43, "k": 0 }, rgb: { "r": 0, "g": 199, "b": 177 }, lab: { "l": 72.24264653658098, "a": -46.24682455239887, "b": -0.701056815299772 } },
        { name: "3268C", cmyk: { "c": 86, "m": 0, "y": 55, "k": 0 }, rgb: { "r": 0, "g": 171, "b": 142 }, lab: { "l": 62.57410961061116, "a": -44.06112349095959, "b": 4.518634430674573 } },
        { name: "3272C", cmyk: { "c": 100, "m": 0, "y": 51, "k": 0 }, rgb: { "r": 0, "g": 164, "b": 153 }, lab: { "l": 60.64975004852084, "a": -37.903943050830726, "b": -4.460476123921264 } },
        { name: "3275C", cmyk: { "c": 93, "m": 0, "y": 57, "k": 0 }, rgb: { "r": 0, "g": 179, "b": 152 }, lab: { "l": 65.36317481995717, "a": -44.69943368664825, "b": 2.9936745930277953 } },
        { name: "3278C", cmyk: { "c": 100, "m": 0, "y": 65, "k": 0 }, rgb: { "r": 0, "g": 155, "b": 119 }, lab: { "l": 56.855140602795515, "a": -43.522771766673515, "b": 9.254705830117715 } },
        { name: "3282C", cmyk: { "c": 100, "m": 0, "y": 54, "k": 15 }, rgb: { "r": 0, "g": 133, "b": 120 }, lab: { "l": 49.65476161901566, "a": -33.720488244761704, "b": -1.7067365240470034 } },
        { name: "3285C", cmyk: { "c": 100, "m": 0, "y": 57, "k": 1 }, rgb: { "r": 0, "g": 150, "b": 129 }, lab: { "l": 55.47961498339504, "a": -38.6905034302803, "b": 1.592142286017073 } },
        { name: "3288C", cmyk: { "c": 100, "m": 0, "y": 67, "k": 17 }, rgb: { "r": 0, "g": 130, "b": 100 }, lab: { "l": 48.11526788890754, "a": -38.111159099004865, "b": 7.771680060166086 } },
        { name: "3292C", cmyk: { "c": 100, "m": 0, "y": 56, "k": 56 }, rgb: { "r": 0, "g": 89, "b": 79 }, lab: { "l": 33.36991872341146, "a": -25.658463845737415, "b": -0.765209779683107 } },
        { name: "3295C", cmyk: { "c": 100, "m": 0, "y": 61, "k": 28 }, rgb: { "r": 0, "g": 120, "b": 100 }, lab: { "l": 44.73503759330879, "a": -33.75120744240584, "b": 2.931817416722926 } },
        { name: "3298C", cmyk: { "c": 100, "m": 0, "y": 67, "k": 40 }, rgb: { "r": 0, "g": 106, "b": 82 }, lab: { "l": 39.440771663865654, "a": -32.65983347652515, "b": 6.147332653669024 } },
        { name: "3302C", cmyk: { "c": 95, "m": 12, "y": 56, "k": 64 }, rgb: { "r": 0, "g": 76, "b": 69 }, lab: { "l": 28.376182997871936, "a": -22.454431982922657, "b": -1.7268965140795012 } },
        { name: "3305C", cmyk: { "c": 93, "m": 13, "y": 61, "k": 62 }, rgb: { "r": 0, "g": 78, "b": 66 }, lab: { "l": 29.010616801858156, "a": -24.436600809526087, "b": 1.1331712234870839 } },
        { name: "3308C", cmyk: { "c": 92, "m": 14, "y": 67, "k": 70 }, rgb: { "r": 2, "g": 70, "b": 56 }, lab: { "l": 25.799189544092208, "a": -23.41064054989095, "b": 2.970155066877289 } },
        { name: "3375C", cmyk: { "c": 41, "m": 0, "y": 31, "k": 0 }, rgb: { "r": 122, "g": 225, "b": 191 }, lab: { "l": 82.78007458594934, "a": -37.94851530856435, "b": 7.376664606937955 } },
        { name: "3385C", cmyk: { "c": 55, "m": 0, "y": 45, "k": 0 }, rgb: { "r": 71, "g": 215, "b": 172 }, lab: { "l": 77.82716817615241, "a": -48.293603332937366, "b": 10.156850597119016 } },
        { name: "3395C", cmyk: { "c": 77, "m": 0, "y": 67, "k": 0 }, rgb: { "r": 0, "g": 195, "b": 137 }, lab: { "l": 70.06111807985226, "a": -54.789944620966814, "b": 17.832023515834262 } },
        { name: "3405C", cmyk: { "c": 92, "m": 0, "y": 85, "k": 0 }, rgb: { "r": 0, "g": 175, "b": 102 }, lab: { "l": 63.02694507147855, "a": -54.953857186261224, "b": 27.020310741963982 } },
        { name: "3415C", cmyk: { "c": 100, "m": 0, "y": 85, "k": 29 }, rgb: { "r": 0, "g": 119, "b": 73 }, lab: { "l": 43.76273923061836, "a": -40.322204467088426, "b": 17.45588563975401 } },
        { name: "3425C", cmyk: { "c": 96, "m": 2, "y": 80, "k": 47 }, rgb: { "r": 0, "g": 99, "b": 65 }, lab: { "l": 36.565643096258555, "a": -34.171169080608855, "b": 12.418233729931128 } },
        { name: "3435C", cmyk: { "c": 87, "m": 15, "y": 77, "k": 69 }, rgb: { "r": 21, "g": 71, "b": 52 }, lab: { "l": 26.4878712162907, "a": -21.98414371656027, "b": 6.605660226608401 } },
        { name: "3935C", cmyk: { "c": 2, "m": 0, "y": 72, "k": 0 }, rgb: { "r": 243, "g": 234, "b": 93 }, lab: { "l": 91.09413231456524, "a": -13.631763988874946, "b": 67.38943536890115 } },
        { name: "3945C", cmyk: { "c": 2, "m": 0, "y": 98, "k": 0 }, rgb: { "r": 243, "g": 230, "b": 0 }, lab: { "l": 89.69580298230052, "a": -14.485157627203538, "b": 88.63075537428959 } },
        { name: "3955C", cmyk: { "c": 2, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 239, "g": 223, "b": 0 }, lab: { "l": 87.54622489366028, "a": -12.724814525795491, "b": 86.9245079033362 } },
        { name: "3965C", cmyk: { "c": 2, "m": 0, "y": 100, "k": 1 }, rgb: { "r": 238, "g": 220, "b": 0 }, lab: { "l": 86.68375533157523, "a": -11.661121255775342, "b": 86.26385325430942 } },
        { name: "3975C", cmyk: { "c": 3, "m": 6, "y": 100, "k": 23 }, rgb: { "r": 187, "g": 166, "b": 0 }, lab: { "l": 67.90047916440294, "a": -6.2530230981101, "b": 70.70417071615311 } },
        { name: "3985C", cmyk: { "c": 2, "m": 12, "y": 100, "k": 41 }, rgb: { "r": 154, "g": 135, "b": 0 }, lab: { "l": 56.285463522889, "a": -4.6248513145225045, "b": 60.9680504055982 } },
        { name: "3995C", cmyk: { "c": 17, "m": 25, "y": 96, "k": 60 }, rgb: { "r": 104, "g": 92, "b": 32 }, lab: { "l": 39.07333046289746, "a": -2.9522967297980207, "b": 35.1181849265137 } },
        { name: "4485C", cmyk: { "c": 21, "m": 40, "y": 90, "k": 61 }, rgb: { "r": 97, "g": 79, "b": 37 }, lab: { "l": 34.53271351005372, "a": 1.8526900467370766, "b": 27.252800851616776 } },
        { name: "4495C", cmyk: { "c": 17, "m": 29, "y": 84, "k": 37 }, rgb: { "r": 140, "g": 119, "b": 50 }, lab: { "l": 50.68649237313501, "a": -0.3749924878044264, "b": 39.99880655476598 } },
        { name: "4505C", cmyk: { "c": 20, "m": 27, "y": 75, "k": 26 }, rgb: { "r": 153, "g": 133, "b": 66 }, lab: { "l": 56.02838262594105, "a": -1.1281719257050238, "b": 38.41254142321251 } },
        { name: "4515C", cmyk: { "c": 20, "m": 22, "y": 59, "k": 10 }, rgb: { "r": 179, "g": 163, "b": 105 }, lab: { "l": 67.12521395528037, "a": -2.5380524865236676, "b": 32.22231236615669 } },
        { name: "4525C", cmyk: { "c": 17, "m": 17, "y": 49, "k": 4 }, rgb: { "r": 197, "g": 183, "b": 131 }, lab: { "l": 74.42962578282199, "a": -2.8287520677066635, "b": 28.284681105489497 } },
        { name: "4535C", cmyk: { "c": 15, "m": 13, "y": 42, "k": 1 }, rgb: { "r": 207, "g": 196, "b": 147 }, lab: { "l": 78.95584787675767, "a": -3.687619808836695, "b": 26.041855489057998 } },
        { name: "4545C", cmyk: { "c": 12, "m": 11, "y": 36, "k": 0 }, rgb: { "r": 213, "g": 203, "b": 159 }, lab: { "l": 81.48973774811974, "a": -3.4203305754024194, "b": 23.244192415357467 } },
        { name: "4625C", cmyk: { "c": 14, "m": 75, "y": 91, "k": 76 }, rgb: { "r": 79, "g": 44, "b": 29 }, lab: { "l": 22.132567867024434, "a": 14.44220164296331, "b": 16.565791455019642 } },
        { name: "4635C", cmyk: { "c": 11, "m": 54, "y": 76, "k": 34 }, rgb: { "r": 148, "g": 96, "b": 55 }, lab: { "l": 45.54844369427425, "a": 16.887807619908102, "b": 31.753457478702497 } },
        { name: "4645C", cmyk: { "c": 14, "m": 44, "y": 59, "k": 18 }, rgb: { "r": 173, "g": 124, "b": 89 }, lab: { "l": 56.1086221886859, "a": 14.775759010262735, "b": 26.595072919574836 } },
        { name: "4655C", cmyk: { "c": 14, "m": 37, "y": 47, "k": 8 }, rgb: { "r": 191, "g": 148, "b": 116 }, lab: { "l": 64.57746385509043, "a": 11.842661383470787, "b": 23.124760876096005 } },
        { name: "4665C", cmyk: { "c": 12, "m": 30, "y": 40, "k": 3 }, rgb: { "r": 205, "g": 167, "b": 136 }, lab: { "l": 71.14181630155718, "a": 9.528846211077525, "b": 21.29060863108567 } },
        { name: "4675C", cmyk: { "c": 8, "m": 21, "y": 27, "k": 0 }, rgb: { "r": 220, "g": 191, "b": 166 }, lab: { "l": 79.17380674838458, "a": 6.497568437878187, "b": 16.412583043392882 } },
        { name: "4685C", cmyk: { "c": 6, "m": 18, "y": 24, "k": 0 }, rgb: { "r": 224, "g": 198, "b": 173 }, lab: { "l": 81.43023952189382, "a": 5.300729736493038, "b": 15.884711784455696 } },
        { name: "4695C", cmyk: { "c": 19, "m": 75, "y": 79, "k": 66 }, rgb: { "r": 91, "g": 52, "b": 39 }, lab: { "l": 26.234965567655514, "a": 16.022567142429388, "b": 15.675126169624043 } },
        { name: "4705C", cmyk: { "c": 19, "m": 64, "y": 67, "k": 42 }, rgb: { "r": 124, "g": 77, "b": 58 }, lab: { "l": 37.65933430153426, "a": 17.64543619620007, "b": 19.513053004132086 } },
        { name: "4715C", cmyk: { "c": 21, "m": 50, "y": 54, "k": 24 }, rgb: { "r": 149, "g": 108, "b": 88 }, lab: { "l": 49.27615904458311, "a": 13.626071964333686, "b": 17.615568272309424 } },
        { name: "4725C", cmyk: { "c": 20, "m": 41, "y": 41, "k": 11 }, rgb: { "r": 174, "g": 138, "b": 121 }, lab: { "l": 60.38785421662456, "a": 11.156406984507317, "b": 14.308126645777698 } },
        { name: "4735C", cmyk: { "c": 17, "m": 31, "y": 33, "k": 4 }, rgb: { "r": 192, "g": 163, "b": 146 }, lab: { "l": 69.09479864187892, "a": 7.980544148115776, "b": 12.774750752175134 } },
        { name: "4745C", cmyk: { "c": 14, "m": 25, "y": 23, "k": 0 }, rgb: { "r": 205, "g": 181, "b": 167 }, lab: { "l": 75.3372780271102, "a": 6.336884900944472, "b": 10.271330887516505 } },
        { name: "4755C", cmyk: { "c": 10, "m": 19, "y": 17, "k": 0 }, rgb: { "r": 215, "g": 196, "b": 183 }, lab: { "l": 80.37371330444186, "a": 4.538314504224816, "b": 8.93341272252779 } },
        { name: "4975C", cmyk: { "c": 27, "m": 90, "y": 62, "k": 83 }, rgb: { "r": 63, "g": 32, "b": 33 }, lab: { "l": 16.501640691614448, "a": 15.077671865995235, "b": 5.916356587763916 } },
        { name: "4985C", cmyk: { "c": 24, "m": 70, "y": 41, "k": 31 }, rgb: { "r": 135, "g": 75, "b": 82 }, lab: { "l": 39.228334608769835, "a": 26.198298621010725, "b": 7.059751201276853 } },
        { name: "4995C", cmyk: { "c": 23, "m": 61, "y": 34, "k": 19 }, rgb: { "r": 156, "g": 97, "b": 105 }, lab: { "l": 47.799653588858135, "a": 25.024121325137706, "b": 5.584906044345672 } },
        { name: "5005C", cmyk: { "c": 20, "m": 50, "y": 27, "k": 9 }, rgb: { "r": 176, "g": 124, "b": 131 }, lab: { "l": 57.351191681499046, "a": 21.244353647211778, "b": 4.304557682816457 } },
        { name: "5015C", cmyk: { "c": 13, "m": 36, "y": 17, "k": 1 }, rgb: { "r": 204, "g": 161, "b": 166 }, lab: { "l": 70.23213237826124, "a": 16.645134928741424, "b": 3.4832318175098242 } },
        { name: "5025C", cmyk: { "c": 8, "m": 27, "y": 9, "k": 0 }, rgb: { "r": 219, "g": 183, "b": 187 }, lab: { "l": 77.58771224748551, "a": 13.555214391991699, "b": 2.809095781797022 } },
        { name: "5035C", cmyk: { "c": 6, "m": 22, "y": 9, "k": 0 }, rgb: { "r": 223, "g": 194, "b": 195 }, lab: { "l": 80.85633489838881, "a": 10.415185432204431, "b": 3.2752887019840804 } },
        { name: "5115C", cmyk: { "c": 48, "m": 91, "y": 17, "k": 59 }, rgb: { "r": 81, "g": 42, "b": 68 }, lab: { "l": 23.07612434633461, "a": 22.16489164998295, "b": -8.434259531009147 } },
        { name: "5125C", cmyk: { "c": 48, "m": 82, "y": 16, "k": 34 }, rgb: { "r": 105, "g": 60, "b": 94 }, lab: { "l": 31.904888075911785, "a": 25.244279991980452, "b": -11.807967313953604 } },
        { name: "5135C", cmyk: { "c": 43, "m": 68, "y": 17, "k": 19 }, rgb: { "r": 126, "g": 84, "b": 117 }, lab: { "l": 41.31230671003294, "a": 23.077881837399033, "b": -11.69405299971663 } },
        { name: "5145C", cmyk: { "c": 34, "m": 53, "y": 13, "k": 7 }, rgb: { "r": 155, "g": 119, "b": 147 }, lab: { "l": 54.311049674851404, "a": 18.912945050707673, "b": -9.726928903439603 } },
        { name: "5155C", cmyk: { "c": 20, "m": 33, "y": 7, "k": 1 }, rgb: { "r": 191, "g": 165, "b": 184 }, lab: { "l": 70.48819300392839, "a": 12.798516065780696, "b": -6.255255368644841 } },
        { name: "5165C", cmyk: { "c": 11, "m": 21, "y": 3, "k": 0 }, rgb: { "r": 211, "g": 192, "b": 205 }, lab: { "l": 79.58873404449321, "a": 8.96713730794163, "b": -4.08316416799539 } },
        { name: "5175C", cmyk: { "c": 9, "m": 18, "y": 3, "k": 0 }, rgb: { "r": 216, "g": 200, "b": 209 }, lab: { "l": 82.11511952091908, "a": 7.153029818064038, "b": -2.469275687007255 } },
        { name: "5185C", cmyk: { "c": 57, "m": 82, "y": 30, "k": 59 }, rgb: { "r": 74, "g": 48, "b": 65 }, lab: { "l": 23.510132687065294, "a": 14.962607970290087, "b": -5.850600065304256 } },
        { name: "5195C", cmyk: { "c": 50, "m": 73, "y": 26, "k": 35 }, rgb: { "r": 102, "g": 67, "b": 90 }, lab: { "l": 33.086531704493964, "a": 19.086225791729277, "b": -7.4990231365303694 } },
        { name: "5205C", cmyk: { "c": 41, "m": 58, "y": 21, "k": 16 }, rgb: { "r": 134, "g": 100, "b": 122 }, lab: { "l": 46.42900502774484, "a": 17.516811799390297, "b": -6.951020863792068 } },
        { name: "5215C", cmyk: { "c": 27, "m": 38, "y": 12, "k": 3 }, rgb: { "r": 175, "g": 149, "b": 166 }, lab: { "l": 64.45297864114036, "a": 12.655752079744731, "b": -5.305127186711145 } },
        { name: "5225C", cmyk: { "c": 18, "m": 27, "y": 7, "k": 0 }, rgb: { "r": 198, "g": 176, "b": 188 }, lab: { "l": 73.98929116962826, "a": 9.986091198712687, "b": -3.2187535680318513 } },
        { name: "5235C", cmyk: { "c": 13, "m": 22, "y": 5, "k": 0 }, rgb: { "r": 208, "g": 190, "b": 199 }, lab: { "l": 78.67137449389197, "a": 7.919112483942447, "b": -2.2230370814783074 } },
        { name: "5245C", cmyk: { "c": 8, "m": 15, "y": 1, "k": 0 }, rgb: { "r": 219, "g": 205, "b": 211 }, lab: { "l": 83.66594288175938, "a": 5.900343884767622, "b": -1.2355452635752773 } },
        { name: "5255C", cmyk: { "c": 100, "m": 94, "y": 0, "k": 78 }, rgb: { "r": 30, "g": 26, "b": 52 }, lab: { "l": 11.012378124969118, "a": 9.666948131933362, "b": -16.482137100306204 } },
        { name: "5265C", cmyk: { "c": 80, "m": 78, "y": 11, "k": 38 }, rgb: { "r": 64, "g": 58, "b": 96 }, lab: { "l": 26.62230229928781, "a": 12.436549560311871, "b": -21.654631724985972 } },
        { name: "5275C", cmyk: { "c": 67, "m": 63, "y": 15, "k": 21 }, rgb: { "r": 89, "g": 84, "b": 120 }, lab: { "l": 37.51843607776292, "a": 10.59552604181621, "b": -19.688449585976752 } },
        { name: "5285C", cmyk: { "c": 44, "m": 40, "y": 10, "k": 5 }, rgb: { "r": 141, "g": 137, "b": 165 }, lab: { "l": 58.293065676586664, "a": 7.321977283415714, "b": -14.258957094874635 } },
        { name: "5295C", cmyk: { "c": 28, "m": 24, "y": 4, "k": 0 }, rgb: { "r": 179, "g": 176, "b": 196 }, lab: { "l": 72.64090351981731, "a": 4.949659453551303, "b": -9.774184969771005 } },
        { name: "5305C", cmyk: { "c": 19, "m": 16, "y": 1, "k": 0 }, rgb: { "r": 198, "g": 196, "b": 210 }, lab: { "l": 79.69272931966461, "a": 3.3312108660881745, "b": -6.740552248285736 } },
        { name: "5315C", cmyk: { "c": 11, "m": 9, "y": 0, "k": 0 }, rgb: { "r": 216, "g": 215, "b": 223 }, lab: { "l": 86.26954605810944, "a": 1.8092343135409084, "b": -3.81528865306755 } },
        { name: "5395C", cmyk: { "c": 100, "m": 44, "y": 10, "k": 91 }, rgb: { "r": 9, "g": 31, "b": 44 }, lab: { "l": 10.703361973088693, "a": -3.486697776374628, "b": -11.275067875541916 } },
        { name: "5405C", cmyk: { "c": 69, "m": 37, "y": 19, "k": 16 }, rgb: { "r": 79, "g": 117, "b": 139 }, lab: { "l": 47.299390410147346, "a": -7.246586220740314, "b": -16.220799362412876 } },
        { name: "5415C", cmyk: { "c": 65, "m": 34, "y": 16, "k": 11 }, rgb: { "r": 91, "g": 127, "b": 149 }, lab: { "l": 51.350749045597084, "a": -6.788596996430474, "b": -15.870935892243999 } },
        { name: "5425C", cmyk: { "c": 52, "m": 25, "y": 13, "k": 4 }, rgb: { "r": 122, "g": 153, "b": 172 }, lab: { "l": 61.56663157154438, "a": -6.209164006229839, "b": -13.435591076591734 } },
        { name: "5435C", cmyk: { "c": 34, "m": 14, "y": 6, "k": 0 }, rgb: { "r": 166, "g": 187, "b": 200 }, lab: { "l": 74.7098455695355, "a": -4.431195237798724, "b": -8.979706012131272 } },
        { name: "5445C", cmyk: { "c": 26, "m": 10, "y": 3, "k": 0 }, rgb: { "r": 183, "g": 201, "b": 211 }, lab: { "l": 79.9222682810672, "a": -4.066373992114736, "b": -7.05982043562996 } },
        { name: "5455C", cmyk: { "c": 23, "m": 8, "y": 2, "k": 0 }, rgb: { "r": 191, "g": 206, "b": 214 }, lab: { "l": 81.87840524031614, "a": -3.486166870894758, "b": -5.710892268806056 } },
        { name: "5463C", cmyk: { "c": 99, "m": 31, "y": 34, "k": 90 }, rgb: { "r": 7, "g": 39, "b": 45 }, lab: { "l": 13.742825375057784, "a": -9.03364206641509, "b": -7.328907082928127 } },
        { name: "5467C", cmyk: { "c": 88, "m": 37, "y": 59, "k": 80 }, rgb: { "r": 24, "g": 51, "b": 47 }, lab: { "l": 19.085837042271457, "a": -11.520430306666135, "b": -0.6702091154958345 } },
        { name: "5473C", cmyk: { "c": 86, "m": 24, "y": 33, "k": 43 }, rgb: { "r": 17, "g": 94, "b": 103 }, lab: { "l": 36.18347886339446, "a": -18.56801767274649, "b": -11.540194023445016 } },
        { name: "5477C", cmyk: { "c": 71, "m": 36, "y": 48, "k": 39 }, rgb: { "r": 62, "g": 93, "b": 88 }, lab: { "l": 37.036086888348386, "a": -12.60786079237755, "b": -0.7755452040260846 } },
        { name: "5483C", cmyk: { "c": 68, "m": 23, "y": 28, "k": 14 }, rgb: { "r": 79, "g": 134, "b": 142 }, lab: { "l": 52.58139266295427, "a": -15.943904172176172, "b": -9.99552696682995 } },
        { name: "5487C", cmyk: { "c": 61, "m": 32, "y": 39, "k": 21 }, rgb: { "r": 94, "g": 121, "b": 117 }, lab: { "l": 48.6840969028533, "a": -10.639963359246885, "b": -1.023303224552774 } },
        { name: "5493C", cmyk: { "c": 51, "m": 15, "y": 20, "k": 3 }, rgb: { "r": 127, "g": 169, "b": 174 }, lab: { "l": 66.47707808055091, "a": -12.890998411541343, "b": -7.1811564023424035 } },
        { name: "5497C", cmyk: { "c": 48, "m": 24, "y": 29, "k": 7 }, rgb: { "r": 130, "g": 153, "b": 149 }, lab: { "l": 61.39295935210018, "a": -8.924011285208477, "b": -0.627417043737788 } },
        { name: "5503C", cmyk: { "c": 42, "m": 11, "y": 16, "k": 0 }, rgb: { "r": 148, "g": 183, "b": 187 }, lab: { "l": 72.06156893981009, "a": -10.859310594825033, "b": -5.939765612914583 } },
        { name: "5507C", cmyk: { "c": 38, "m": 18, "y": 22, "k": 1 }, rgb: { "r": 157, "g": 176, "b": 172 }, lab: { "l": 70.31395009355944, "a": -7.367434964919539, "b": -0.20003661736063272 } },
        { name: "5513C", cmyk: { "c": 32, "m": 7, "y": 10, "k": 0 }, rgb: { "r": 171, "g": 199, "b": 201 }, lab: { "l": 78.29924828589772, "a": -8.953060757191711, "b": -4.169383888285627 } },
        { name: "5517C", cmyk: { "c": 29, "m": 13, "y": 16, "k": 0 }, rgb: { "r": 177, "g": 192, "b": 188 }, lab: { "l": 76.48307598864255, "a": -5.905057057438379, "b": 0.23902800078885456 } },
        { name: "5523C", cmyk: { "c": 27, "m": 5, "y": 8, "k": 0 }, rgb: { "r": 182, "g": 207, "b": 208 }, lab: { "l": 81.36014470286136, "a": -8.139678337979905, "b": -3.3377497629286657 } },
        { name: "5527C", cmyk: { "c": 24, "m": 10, "y": 13, "k": 0 }, rgb: { "r": 188, "g": 201, "b": 197 }, lab: { "l": 79.89520569539823, "a": -5.1807412254091805, "b": 0.4594154951587992 } },
        { name: "5535C", cmyk: { "c": 87, "m": 31, "y": 69, "k": 86 }, rgb: { "r": 24, "g": 48, "b": 41 }, lab: { "l": 17.77413267023205, "a": -11.472385306859678, "b": 1.557048462475863 } },
        { name: "5545C", cmyk: { "c": 70, "m": 27, "y": 54, "k": 35 }, rgb: { "r": 67, "g": 105, "b": 91 }, lab: { "l": 41.298287266858345, "a": -16.949300353997167, "b": 3.609252808407948 } },
        { name: "5555C", cmyk: { "c": 62, "m": 24, "y": 47, "k": 21 }, rgb: { "r": 92, "g": 127, "b": 113 }, lab: { "l": 50.270810868638705, "a": -15.546895941771833, "b": 3.622596329908867 } },
        { name: "5565C", cmyk: { "c": 50, "m": 19, "y": 36, "k": 7 }, rgb: { "r": 127, "g": 156, "b": 144 }, lab: { "l": 61.914419744925695, "a": -12.621547781404342, "b": 2.9311951546088233 } },
        { name: "5575C", cmyk: { "c": 43, "m": 16, "y": 30, "k": 3 }, rgb: { "r": 146, "g": 172, "b": 160 }, lab: { "l": 68.13404068944496, "a": -11.39644383217725, "b": 3.1619836472030594 } },
        { name: "5585C", cmyk: { "c": 34, "m": 11, "y": 25, "k": 0 }, rgb: { "r": 167, "g": 189, "b": 177 }, lab: { "l": 74.68912382735355, "a": -9.852649329048335, "b": 3.512954396256718 } },
        { name: "5595C", cmyk: { "c": 23, "m": 6, "y": 18, "k": 0 }, rgb: { "r": 191, "g": 206, "b": 194 }, lab: { "l": 81.3542293815976, "a": -7.32517940326316, "b": 4.212092388080069 } },
        { name: "5605C", cmyk: { "c": 78, "m": 35, "y": 74, "k": 78 }, rgb: { "r": 34, "g": 55, "b": 43 }, lab: { "l": 21.00665986286672, "a": -11.57273417291768, "b": 4.895015101802658 } },
        { name: "5615C", cmyk: { "c": 57, "m": 30, "y": 53, "k": 27 }, rgb: { "r": 94, "g": 116, "b": 97 }, lab: { "l": 46.622933717638915, "a": -12.18468550226559, "b": 7.849297459101212 } },
        { name: "5625C", cmyk: { "c": 52, "m": 27, "y": 45, "k": 17 }, rgb: { "r": 112, "g": 133, "b": 115 }, lab: { "l": 53.44672196127276, "a": -11.33737607192159, "b": 7.186981118026203 } },
        { name: "5635C", cmyk: { "c": 40, "m": 20, "y": 33, "k": 5 }, rgb: { "r": 148, "g": 165, "b": 150 }, lab: { "l": 66.06522613728991, "a": -8.916987158995028, "b": 5.744703212792501 } },
        { name: "5645C", cmyk: { "c": 35, "m": 17, "y": 28, "k": 2 }, rgb: { "r": 163, "g": 178, "b": 164 }, lab: { "l": 71.08251760481807, "a": -7.9023639778198485, "b": 5.367581424180878 } },
        { name: "5655C", cmyk: { "c": 29, "m": 13, "y": 23, "k": 0 }, rgb: { "r": 176, "g": 189, "b": 176 }, lab: { "l": 75.30170502819276, "a": -6.932360216765909, "b": 5.022298176858642 } },
        { name: "5665C", cmyk: { "c": 24, "m": 11, "y": 19, "k": 0 }, rgb: { "r": 186, "g": 197, "b": 185 }, lab: { "l": 78.38843365767686, "a": -6.002285789078687, "b": 4.706286868052434 } },
        { name: "5743C", cmyk: { "c": 49, "m": 26, "y": 88, "k": 70 }, rgb: { "r": 62, "g": 72, "b": 39 }, lab: { "l": 28.915960708014666, "a": -10.469529076776563, "b": 18.451379400252634 } },
        { name: "5747C", cmyk: { "c": 39, "m": 19, "y": 96, "k": 76 }, rgb: { "r": 61, "g": 68, "b": 30 }, lab: { "l": 27.352793432480787, "a": -9.73304863864427, "b": 21.860923647666375 } },
        { name: "5753C", cmyk: { "c": 44, "m": 24, "y": 80, "k": 47 }, rgb: { "r": 94, "g": 103, "b": 56 }, lab: { "l": 41.79153891837336, "a": -11.649768417728884, "b": 25.30046425929712 } },
        { name: "5757C", cmyk: { "c": 32, "m": 17, "y": 89, "k": 46 }, rgb: { "r": 109, "g": 113, "b": 46 }, lab: { "l": 45.98653641653773, "a": -11.531981106015499, "b": 35.92647543083361 } },
        { name: "5763C", cmyk: { "c": 41, "m": 23, "y": 69, "k": 31 }, rgb: { "r": 115, "g": 123, "b": 76 }, lab: { "l": 49.897005656502714, "a": -11.116660934412048, "b": 24.719491956989092 } },
        { name: "5767C", cmyk: { "c": 33, "m": 18, "y": 75, "k": 25 }, rgb: { "r": 138, "g": 141, "b": 74 }, lab: { "l": 57.02417250531356, "a": -11.330689378262814, "b": 35.147093389170834 } },
        { name: "5773C", cmyk: { "c": 38, "m": 22, "y": 59, "k": 18 }, rgb: { "r": 137, "g": 144, "b": 100 }, lab: { "l": 58.21221956650329, "a": -10.164824907158254, "b": 22.588018458600434 } },
        { name: "5777C", cmyk: { "c": 30, "m": 16, "y": 60, "k": 11 }, rgb: { "r": 162, "g": 165, "b": 104 }, lab: { "l": 66.20632422884606, "a": -10.704574579723625, "b": 31.281736869716823 } },
        { name: "5783C", cmyk: { "c": 32, "m": 18, "y": 47, "k": 7 }, rgb: { "r": 163, "g": 170, "b": 131 }, lab: { "l": 68.14915717629124, "a": -9.258376634473265, "b": 19.32326459821201 } },
        { name: "5787C", cmyk: { "c": 24, "m": 12, "y": 46, "k": 3 }, rgb: { "r": 186, "g": 189, "b": 139 }, lab: { "l": 75.26329557253767, "a": -9.219820621161556, "b": 24.999498133566632 } },
        { name: "5793C", cmyk: { "c": 27, "m": 14, "y": 38, "k": 2 }, rgb: { "r": 179, "g": 185, "b": 149 }, lab: { "l": 73.83758667921126, "a": -8.324510795960139, "b": 17.60252346467166 } },
        { name: "5797C", cmyk: { "c": 20, "m": 9, "y": 39, "k": 0 }, rgb: { "r": 198, "g": 200, "b": 155 }, lab: { "l": 79.43185075742326, "a": -8.095642005686631, "b": 22.34416465314153 } },
        { name: "5803C", cmyk: { "c": 21, "m": 11, "y": 32, "k": 0 }, rgb: { "r": 195, "g": 198, "b": 168 }, lab: { "l": 78.9359846046517, "a": -6.205735863671846, "b": 14.703532744291303 } },
        { name: "5807C", cmyk: { "c": 16, "m": 6, "y": 31, "k": 0 }, rgb: { "r": 208, "g": 209, "b": 171 }, lab: { "l": 82.88740843068133, "a": -6.6646252410503815, "b": 18.78369326263092 } },
        { name: "5815C", cmyk: { "c": 29, "m": 29, "y": 91, "k": 65 }, rgb: { "r": 85, "g": 80, "b": 37 }, lab: { "l": 33.56747443814804, "a": -4.580881417571847, "b": 25.80223411511129 } },
        { name: "5825C", cmyk: { "c": 26, "m": 22, "y": 80, "k": 32 }, rgb: { "r": 137, "g": 129, "b": 61 }, lab: { "l": 53.336717347323344, "a": -6.464979851143582, "b": 37.43421857000362 } },
        { name: "5835C", cmyk: { "c": 26, "m": 20, "y": 67, "k": 16 }, rgb: { "r": 160, "g": 153, "b": 88 }, lab: { "l": 62.47438406125285, "a": -6.95148231095688, "b": 34.95691743836251 } },
        { name: "5845C", cmyk: { "c": 24, "m": 18, "y": 57, "k": 8 }, rgb: { "r": 175, "g": 169, "b": 110 }, lab: { "l": 68.4719584513746, "a": -6.810913740644631, "b": 31.24105726129183 } },
        { name: "5855C", cmyk: { "c": 21, "m": 14, "y": 47, "k": 3 }, rgb: { "r": 192, "g": 187, "b": 135 }, lab: { "l": 75.13694050062516, "a": -6.38894695148079, "b": 27.034764837359802 } },
        { name: "5865C", cmyk: { "c": 17, "m": 10, "y": 43, "k": 1 }, rgb: { "r": 203, "g": 199, "b": 147 }, lab: { "l": 79.41417386587008, "a": -6.7855050233471275, "b": 26.60479482887559 } },
        { name: "5875C", cmyk: { "c": 14, "m": 8, "y": 37, "k": 0 }, rgb: { "r": 210, "g": 206, "b": 158 }, lab: { "l": 82.00795542897791, "a": -6.243629964184261, "b": 24.43849334223178 } }
      ],
      ral: [
        { ral: 1e3, name: "GreenBeige", LRV: 50, cmyk: { "c": 0, "m": 7, "y": 32, "k": 21 }, rgb: { "r": 201, "g": 187, "b": 136 }, lab: { "l": 76.022, "a": -0.366, "b": 27.636 } },
        { ral: 1001, name: "Beige", LRV: 46, cmyk: { "c": 0, "m": 14, "y": 36, "k": 20 }, rgb: { "r": 204, "g": 176, "b": 131 }, lab: { "l": 73.595, "a": 5.518, "b": 26.95 } },
        { ral: 1002, name: "SandYellow", LRV: 44, cmyk: { "c": 0, "m": 17, "y": 47, "k": 20 }, rgb: { "r": 205, "g": 170, "b": 109 }, lab: { "l": 71.934, "a": 7.362, "b": 36.744 } },
        { ral: 1003, name: "SignalYellow", LRV: 48, cmyk: { "c": 0, "m": 30, "y": 100, "k": 5 }, rgb: { "r": 242, "g": 169, "b": 0 }, lab: { "l": 75.041, "a": 19.801, "b": 80.264 } },
        { ral: 1004, name: "GoldenYellow", LRV: 41, cmyk: { "c": 0, "m": 28, "y": 100, "k": 13 }, rgb: { "r": 221, "g": 159, "b": 0 }, lab: { "l": 70.089, "a": 16.1, "b": 78.815 } },
        { ral: 1005, name: "HoneyYellow", LRV: 32, cmyk: { "c": 0, "m": 27, "y": 100, "k": 23 }, rgb: { "r": 197, "g": 143, "b": 0 }, lab: { "l": 63.448, "a": 13.382, "b": 74.694 } },
        { ral: 1006, name: "MaizeYellow", LRV: 36, cmyk: { "c": 0, "m": 34, "y": 100, "k": 14 }, rgb: { "r": 219, "g": 145, "b": 0 }, lab: { "l": 66.562, "a": 22.472, "b": 76.492 } },
        { ral: 1007, name: "DaffodilYellow", LRV: 36, cmyk: { "c": 0, "m": 38, "y": 100, "k": 11 }, rgb: { "r": 226, "g": 141, "b": 0 }, lab: { "l": 66.5, "a": 27.308, "b": 80.402 } },
        { ral: 1011, name: "BrownBeige", LRV: 25, cmyk: { "c": 0, "m": 25, "y": 54, "k": 33 }, rgb: { "r": 171, "g": 129, "b": 79 }, lab: { "l": 57.338, "a": 12.518, "b": 33.353 } },
        { ral: 1012, name: "LemonYellow", LRV: 46, cmyk: { "c": 0, "m": 18, "y": 83, "k": 16 }, rgb: { "r": 214, "g": 176, "b": 37 }, lab: { "l": 73.615, "a": 4.946, "b": 68.938 } },
        { ral: 1013, name: "OysterWhite", LRV: 70, cmyk: { "c": 0, "m": 3, "y": 12, "k": 12 }, rgb: { "r": 225, "g": 218, "b": 199 }, lab: { "l": 87.152, "a": 0.27, "b": 10.431 } },
        { ral: 1014, name: "Ivory", LRV: 57, cmyk: { "c": 0, "m": 9, "y": 29, "k": 15 }, rgb: { "r": 217, "g": 197, "b": 154 }, lab: { "l": 80.411, "a": 2.763, "b": 24.175 } },
        { ral: 1015, name: "LightIvory", LRV: 66, cmyk: { "c": 0, "m": 7, "y": 20, "k": 11 }, rgb: { "r": 227, "g": 211, "b": 181 }, lab: { "l": 85.219, "a": 2.394, "b": 16.821 } },
        { ral: 1016, name: "SulfurYellow", LRV: 71, cmyk: { "c": 0, "m": 4, "y": 77, "k": 9 }, rgb: { "r": 232, "g": 222, "b": 53 }, lab: { "l": 87.29, "a": -9.283, "b": 76.694 } },
        { ral: 1017, name: "SaffronYellow", LRV: 49, cmyk: { "c": 0, "m": 29, "y": 67, "k": 6 }, rgb: { "r": 240, "g": 170, "b": 80 }, lab: { "l": 75.183, "a": 20.633, "b": 55.581 } },
        { ral: 1018, name: "ZincYellow", LRV: 63, cmyk: { "c": 0, "m": 16, "y": 81, "k": 5 }, rgb: { "r": 242, "g": 203, "b": 46 }, lab: { "l": 83.353, "a": 3.462, "b": 75.829 } },
        { ral: 1019, name: "GreyBeige", LRV: 29, cmyk: { "c": 0, "m": 12, "y": 25, "k": 36 }, rgb: { "r": 162, "g": 143, "b": 122 }, lab: { "l": 60.643, "a": 4.702, "b": 13.952 } },
        { ral: 1020, name: "OliveYellow", LRV: 28, cmyk: { "c": 0, "m": 9, "y": 36, "k": 38 }, rgb: { "r": 157, "g": 143, "b": 101 }, lab: { "l": 59.883, "a": 0.56, "b": 24.683 } },
        { ral: 1021, name: "RapeYellow", LRV: 53, cmyk: { "c": 0, "m": 23, "y": 100, "k": 7 }, rgb: { "r": 238, "g": 183, "b": 0 }, lab: { "l": 77.828, "a": 10.664, "b": 94.6 } },
        { ral: 1023, name: "TrafficYellow", LRV: 53, cmyk: { "c": 0, "m": 23, "y": 100, "k": 6 }, rgb: { "r": 239, "g": 183, "b": 0 }, lab: { "l": 77.72, "a": 11.334, "b": 93.913 } },
        { ral: 1024, name: "OchreYellow", LRV: 31, cmyk: { "c": 0, "m": 20, "y": 59, "k": 29 }, rgb: { "r": 181, "g": 144, "b": 75 }, lab: { "l": 62.261, "a": 8.491, "b": 41.488 } },
        { ral: 1026, name: "LuminousYellow", LRV: 99, cmyk: { "c": 0, "m": 0, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 255, "b": 0 }, lab: { "l": 99.618, "a": -17.229, "b": 116.966 } },
        { ral: 1027, name: "Curry", LRV: 23, cmyk: { "c": 0, "m": 21, "y": 93, "k": 36 }, rgb: { "r": 162, "g": 128, "b": 12 }, lab: { "l": 55.557, "a": 6.493, "b": 58.255 } },
        { ral: 1028, name: "MelonYellow", LRV: 46, cmyk: { "c": 0, "m": 39, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 156, "b": 0 }, lab: { "l": 73.671, "a": 31.654, "b": 95.458 } },
        { ral: 1032, name: "BroomYellow", LRV: 42, cmyk: { "c": 0, "m": 25, "y": 100, "k": 14 }, rgb: { "r": 219, "g": 164, "b": 0 }, lab: { "l": 71.135, "a": 12.766, "b": 74.772 } },
        { ral: 1033, name: "DahliaYellow", LRV: 43, cmyk: { "c": 0, "m": 36, "y": 89, "k": 5 }, rgb: { "r": 243, "g": 155, "b": 27 }, lab: { "l": 71.74, "a": 27.78, "b": 71.677 } },
        { ral: 1034, name: "PastelYellow", LRV: 42, cmyk: { "c": 0, "m": 32, "y": 65, "k": 10 }, rgb: { "r": 230, "g": 157, "b": 81 }, lab: { "l": 70.94, "a": 22.91, "b": 49.962 } },
        { ral: 1035, name: "PearlBeige", LRV: 0, cmyk: { "c": 0, "m": 8, "y": 21, "k": 44 }, rgb: { "r": 142, "g": 131, "b": 112 }, lab: { "l": 55.258, "a": 1.866, "b": 11.775 } },
        { ral: 1036, name: "PearlGold", LRV: 0, cmyk: { "c": 0, "m": 19, "y": 50, "k": 51 }, rgb: { "r": 125, "g": 101, "b": 63 }, lab: { "l": 44.425, "a": 6.462, "b": 25.001 } },
        { ral: 1037, name: "SunYellow", LRV: 39, cmyk: { "c": 0, "m": 37, "y": 100, "k": 8 }, rgb: { "r": 234, "g": 147, "b": 0 }, lab: { "l": 68.889, "a": 27.62, "b": 74.504 } },
        { ral: 2e3, name: "YellowOrange", LRV: 26, cmyk: { "c": 0, "m": 48, "y": 100, "k": 16 }, rgb: { "r": 213, "g": 111, "b": 0 }, lab: { "l": 58.201, "a": 37.297, "b": 68.683 } },
        { ral: 2001, name: "RedOrange", LRV: 15, cmyk: { "c": 0, "m": 60, "y": 85, "k": 29 }, rgb: { "r": 182, "g": 72, "b": 28 }, lab: { "l": 45.824, "a": 44.129, "b": 47.554 } },
        { ral: 2002, name: "Vermilion", LRV: 14, cmyk: { "c": 0, "m": 70, "y": 81, "k": 26 }, rgb: { "r": 188, "g": 56, "b": 35 }, lab: { "l": 44.441, "a": 52.797, "b": 43.768 } },
        { ral: 2003, name: "PastelOrange", LRV: 33, cmyk: { "c": 0, "m": 50, "y": 83, "k": 5 }, rgb: { "r": 241, "g": 120, "b": 41 }, lab: { "l": 64.235, "a": 44.142, "b": 61.832 } },
        { ral: 2004, name: "PureOrange", LRV: 22, cmyk: { "c": 0, "m": 63, "y": 97, "k": 13 }, rgb: { "r": 222, "g": 83, "b": 6 }, lab: { "l": 54.448, "a": 53.586, "b": 63.716 } },
        { ral: 2005, name: "LuminousOrange", LRV: 44, cmyk: { "c": 0, "m": 71, "y": 93, "k": 0 }, rgb: { "r": 255, "g": 75, "b": 17 }, lab: { "l": 72.274, "a": 87.783, "b": 82.315 } },
        { ral: 2007, name: "LuminousBrightOrange", LRV: 74, cmyk: { "c": 0, "m": 28, "y": 100, "k": 0 }, rgb: { "r": 255, "g": 183, "b": 0 }, lab: { "l": 88.914, "a": 52.782, "b": 97.982 } },
        { ral: 2008, name: "BrightRedOrange", LRV: 28, cmyk: { "c": 0, "m": 54, "y": 85, "k": 9 }, rgb: { "r": 232, "g": 107, "b": 34 }, lab: { "l": 60.334, "a": 46.913, "b": 60.652 } },
        { ral: 2009, name: "TrafficOrange", LRV: 22, cmyk: { "c": 0, "m": 62, "y": 95, "k": 15 }, rgb: { "r": 218, "g": 83, "b": 10 }, lab: { "l": 53.766, "a": 51.886, "b": 62.145 } },
        { ral: 2010, name: "SignalOrange", LRV: 21, cmyk: { "c": 0, "m": 54, "y": 80, "k": 20 }, rgb: { "r": 204, "g": 93, "b": 41 }, lab: { "l": 53.28, "a": 42.985, "b": 49.867 } },
        { ral: 2011, name: "DeepOrange", LRV: 27, cmyk: { "c": 0, "m": 50, "y": 93, "k": 13 }, rgb: { "r": 221, "g": 110, "b": 15 }, lab: { "l": 59.241, "a": 40.856, "b": 64.504 } },
        { ral: 2012, name: "SalmonOrange", LRV: 24, cmyk: { "c": 0, "m": 52, "y": 63, "k": 18 }, rgb: { "r": 209, "g": 101, "b": 78 }, lab: { "l": 56.085, "a": 42.492, "b": 34.021 } },
        { ral: 2013, name: "PearlOrange", LRV: 0, cmyk: { "c": 0, "m": 57, "y": 73, "k": 44 }, rgb: { "r": 143, "g": 62, "b": 38 }, lab: { "l": 37.341, "a": 33.898, "b": 32.139 } },
        { ral: 3e3, name: "FlameRed", LRV: 10, cmyk: { "c": 0, "m": 76, "y": 80, "k": 36 }, rgb: { "r": 164, "g": 40, "b": 33 }, lab: { "l": 37.687, "a": 50.439, "b": 36.563 } },
        { ral: 3001, name: "SignalRed", LRV: 8, cmyk: { "c": 0, "m": 77, "y": 77, "k": 40 }, rgb: { "r": 152, "g": 35, "b": 35 }, lab: { "l": 34.702, "a": 48.478, "b": 31.204 } },
        { ral: 3002, name: "CarmineRed", LRV: 8, cmyk: { "c": 0, "m": 78, "y": 78, "k": 40 }, rgb: { "r": 152, "g": 34, "b": 34 }, lab: { "l": 34.458, "a": 48.832, "b": 31.869 } },
        { ral: 3003, name: "RubyRed", LRV: 6, cmyk: { "c": 0, "m": 81, "y": 74, "k": 48 }, rgb: { "r": 132, "g": 25, "b": 34 }, lab: { "l": 29.149, "a": 45.067, "b": 24.389 } },
        { ral: 3004, name: "PurpleRed", LRV: 4, cmyk: { "c": 0, "m": 74, "y": 67, "k": 59 }, rgb: { "r": 105, "g": 27, "b": 35 }, lab: { "l": 23.903, "a": 35.433, "b": 16.085 } },
        { ral: 3005, name: "WineRed", LRV: 3, cmyk: { "c": 0, "m": 73, "y": 65, "k": 65 }, rgb: { "r": 88, "g": 24, "b": 31 }, lab: { "l": 19.699, "a": 30.019, "b": 12.525 } },
        { ral: 3007, name: "BlackRed", LRV: 2, cmyk: { "c": 0, "m": 48, "y": 44, "k": 76 }, rgb: { "r": 61, "g": 32, "b": 34 }, lab: { "l": 16.437, "a": 14.617, "b": 5.268 } },
        { ral: 3009, name: "OxideRed", LRV: 5, cmyk: { "c": 0, "m": 53, "y": 60, "k": 60 }, rgb: { "r": 102, "g": 48, "b": 41 }, lab: { "l": 27.272, "a": 24.588, "b": 16.512 } },
        { ral: 3011, name: "BrownRed", LRV: 5, cmyk: { "c": 0, "m": 70, "y": 70, "k": 53 }, rgb: { "r": 119, "g": 36, "b": 36 }, lab: { "l": 27.966, "a": 36.64, "b": 21.316 } },
        { ral: 3012, name: "BeigeRed", LRV: 30, cmyk: { "c": 0, "m": 31, "y": 44, "k": 24 }, rgb: { "r": 194, "g": 133, "b": 109 }, lab: { "l": 61.394, "a": 22.436, "b": 22.979 } },
        { ral: 3013, name: "TomatoRed", LRV: 9, cmyk: { "c": 0, "m": 69, "y": 75, "k": 42 }, rgb: { "r": 149, "g": 46, "b": 37 }, lab: { "l": 35.45, "a": 43.402, "b": 30.523 } },
        { ral: 3014, name: "AntiquePink", LRV: 26, cmyk: { "c": 0, "m": 43, "y": 42, "k": 21 }, rgb: { "r": 201, "g": 115, "b": 117 }, lab: { "l": 58.26, "a": 34.939, "b": 14.085 } },
        { ral: 3015, name: "LightPink", LRV: 43, cmyk: { "c": 0, "m": 26, "y": 23, "k": 16 }, rgb: { "r": 215, "g": 160, "b": 166 }, lab: { "l": 71.232, "a": 21.595, "b": 4.983 } },
        { ral: 3016, name: "CoralRed", LRV: 12, cmyk: { "c": 0, "m": 63, "y": 71, "k": 36 }, rgb: { "r": 164, "g": 60, "b": 48 }, lab: { "l": 40.678, "a": 42.925, "b": 30.919 } },
        { ral: 3017, name: "Rose", LRV: 20, cmyk: { "c": 0, "m": 58, "y": 53, "k": 22 }, rgb: { "r": 200, "g": 84, "b": 93 }, lab: { "l": 51.708, "a": 47.655, "b": 19.335 } },
        { ral: 3018, name: "StrawberryRed", LRV: 16, cmyk: { "c": 0, "m": 68, "y": 62, "k": 23 }, rgb: { "r": 196, "g": 62, "b": 74 }, lab: { "l": 47.141, "a": 54.458, "b": 24.604 } },
        { ral: 3020, name: "TrafficRed", LRV: 12, cmyk: { "c": 0, "m": 84, "y": 90, "k": 28 }, rgb: { "r": 184, "g": 29, "b": 19 }, lab: { "l": 40.511, "a": 59.32, "b": 47.967 } },
        { ral: 3022, name: "SalmonPink", LRV: 24, cmyk: { "c": 0, "m": 49, "y": 58, "k": 20 }, rgb: { "r": 204, "g": 105, "b": 85 }, lab: { "l": 56.056, "a": 38.9, "b": 29.704 } },
        { ral: 3024, name: "LuminousRed", LRV: 30, cmyk: { "c": 0, "m": 84, "y": 86, "k": 0 }, rgb: { "r": 255, "g": 42, "b": 36 }, lab: { "l": 61.253, "a": 83.212, "b": 65.195 } },
        { ral: 3026, name: "LuminousBrightRed", LRV: 32, cmyk: { "c": 0, "m": 85, "y": 87, "k": 0 }, rgb: { "r": 255, "g": 38, "b": 32 }, lab: { "l": 63.701, "a": 87.132, "b": 70.01 } },
        { ral: 3027, name: "RaspberryRed", LRV: 10, cmyk: { "c": 0, "m": 78, "y": 64, "k": 34 }, rgb: { "r": 169, "g": 38, "b": 61 }, lab: { "l": 38.686, "a": 53.68, "b": 20.868 } },
        { ral: 3028, name: "PureRed", LRV: 15, cmyk: { "c": 0, "m": 79, "y": 81, "k": 21 }, rgb: { "r": 201, "g": 43, "b": 38 }, lab: { "l": 45.358, "a": 60.958, "b": 44.231 } },
        { ral: 3031, name: "OrientRed", LRV: 11, cmyk: { "c": 0, "m": 69, "y": 66, "k": 36 }, rgb: { "r": 164, "g": 51, "b": 56 }, lab: { "l": 39.32, "a": 47.086, "b": 24.708 } },
        { ral: 3032, name: "PearlrubyRed", LRV: 0, cmyk: { "c": 0, "m": 75, "y": 67, "k": 57 }, rgb: { "r": 110, "g": 28, "b": 36 }, lab: { "l": 25.034, "a": 36.705, "b": 17.139 } },
        { ral: 3033, name: "PearlPink", LRV: 0, cmyk: { "c": 0, "m": 65, "y": 72, "k": 36 }, rgb: { "r": 162, "g": 57, "b": 46 }, lab: { "l": 39.808, "a": 43.686, "b": 30.991 } },
        { ral: 4001, name: "RedLilac", LRV: 15, cmyk: { "c": 0, "m": 27, "y": 0, "k": 49 }, rgb: { "r": 131, "g": 96, "b": 131 }, lab: { "l": 45.333, "a": 19.568, "b": -14.009 } },
        { ral: 4002, name: "Redviolet", LRV: 9, cmyk: { "c": 0, "m": 57, "y": 46, "k": 45 }, rgb: { "r": 140, "g": 60, "b": 75 }, lab: { "l": 36.8, "a": 35.858, "b": 8.343 } },
        { ral: 4003, name: "Heatherviolet", LRV: 22, cmyk: { "c": 0, "m": 51, "y": 29, "k": 23 }, rgb: { "r": 196, "g": 96, "b": 140 }, lab: { "l": 54.247, "a": 44.659, "b": -5.015 } },
        { ral: 4004, name: "Claretviolet", LRV: 4, cmyk: { "c": 0, "m": 71, "y": 43, "k": 61 }, rgb: { "r": 100, "g": 29, "b": 57 }, lab: { "l": 23.577, "a": 34.298, "b": 0.517 } },
        { ral: 4005, name: "BlueLilac", LRV: 16, cmyk: { "c": 20, "m": 33, "y": 0, "k": 40 }, rgb: { "r": 123, "g": 103, "b": 154 }, lab: { "l": 47.024, "a": 16.762, "b": -25.226 } },
        { ral: 4006, name: "Trafficpurple", LRV: 10, cmyk: { "c": 0, "m": 67, "y": 21, "k": 43 }, rgb: { "r": 145, "g": 48, "b": 115 }, lab: { "l": 36.964, "a": 46.56, "b": -16.759 } },
        { ral: 4007, name: "Purpleviolet", LRV: 3, cmyk: { "c": 0, "m": 49, "y": 15, "k": 72 }, rgb: { "r": 71, "g": 36, "b": 60 }, lab: { "l": 19.721, "a": 20.17, "b": -7.946 } },
        { ral: 4008, name: "Signalviolet", LRV: 12, cmyk: { "c": 0, "m": 44, "y": 3, "k": 47 }, rgb: { "r": 135, "g": 75, "b": 131 }, lab: { "l": 40.761, "a": 32.526, "b": -20.561 } },
        { ral: 4009, name: "Pastelviolet", LRV: 26, cmyk: { "c": 0, "m": 15, "y": 7, "k": 38 }, rgb: { "r": 157, "g": 133, "b": 146 }, lab: { "l": 58.22, "a": 11.056, "b": -3.283 } },
        { ral: 4010, name: "Telemagenta", LRV: 16, cmyk: { "c": 0, "m": 67, "y": 36, "k": 27 }, rgb: { "r": 187, "g": 62, "b": 119 }, lab: { "l": 46.538, "a": 54.36, "b": -4.083 } },
        { ral: 4011, name: "Pearlviolet", LRV: 0, cmyk: { "c": 16, "m": 27, "y": 0, "k": 47 }, rgb: { "r": 113, "g": 98, "b": 135 }, lab: { "l": 44.108, "a": 12.383, "b": -18.407 } },
        { ral: 4012, name: "PearlBlackberry", LRV: 0, cmyk: { "c": 14, "m": 16, "y": 0, "k": 50 }, rgb: { "r": 109, "g": 107, "b": 127 }, lab: { "l": 45.891, "a": 4.098, "b": -11.086 } },
        { ral: 5e3, name: "VioletBlue", LRV: 7, cmyk: { "c": 50, "m": 30, "y": 0, "k": 56 }, rgb: { "r": 56, "g": 78, "b": 111 }, lab: { "l": 32.585, "a": -1.282, "b": -21.686 } },
        { ral: 5001, name: "GreenBlue", LRV: 6, cmyk: { "c": 71, "m": 24, "y": 0, "k": 61 }, rgb: { "r": 29, "g": 76, "b": 100 }, lab: { "l": 29.866, "a": -9.761, "b": -19.22 } },
        { ral: 5002, name: "UltramarineBlue", LRV: 4, cmyk: { "c": 76, "m": 56, "y": 0, "k": 52 }, rgb: { "r": 30, "g": 54, "b": 123 }, lab: { "l": 24.179, "a": 11.008, "b": -42.748 } },
        { ral: 5003, name: "SapphireBlue", LRV: 4, cmyk: { "c": 55, "m": 34, "y": 0, "k": 67 }, rgb: { "r": 38, "g": 56, "b": 85 }, lab: { "l": 22.956, "a": 0.076, "b": -20.213 } },
        { ral: 5004, name: "BlackBlue", LRV: 1, cmyk: { "c": 35, "m": 25, "y": 0, "k": 84 }, rgb: { "r": 26, "g": 30, "b": 40 }, lab: { "l": 11.174, "a": 0.654, "b": -7.457 } },
        { ral: 5005, name: "SignalBlue", LRV: 7, cmyk: { "c": 100, "m": 40, "y": 0, "k": 47 }, rgb: { "r": 0, "g": 81, "b": 135 }, lab: { "l": 32.448, "a": -6.68, "b": -37.201 } },
        { ral: 5007, name: "BrilliantBlue", LRV: 13, cmyk: { "c": 53, "m": 24, "y": 0, "k": 45 }, rgb: { "r": 66, "g": 106, "b": 140 }, lab: { "l": 42.929, "a": -6.8, "b": -23.609 } },
        { ral: 5008, name: "GreyBlue", LRV: 4, cmyk: { "c": 34, "m": 15, "y": 0, "k": 73 }, rgb: { "r": 45, "g": 58, "b": 68 }, lab: { "l": 23.463, "a": -3.174, "b": -8.172 } },
        { ral: 5009, name: "AzureBlue", LRV: 10, cmyk: { "c": 62, "m": 22, "y": 0, "k": 53 }, rgb: { "r": 45, "g": 94, "b": 120 }, lab: { "l": 37.421, "a": -10.799, "b": -19.905 } },
        { ral: 5010, name: "GentianBlue", LRV: 7, cmyk: { "c": 100, "m": 37, "y": 0, "k": 51 }, rgb: { "r": 0, "g": 78, "b": 124 }, lab: { "l": 30.95, "a": -7.433, "b": -32.954 } },
        { ral: 5011, name: "SteelBlue", LRV: 2, cmyk: { "c": 51, "m": 30, "y": 0, "k": 76 }, rgb: { "r": 30, "g": 43, "b": 61 }, lab: { "l": 16.969, "a": -1.198, "b": -13.154 } },
        { ral: 5012, name: "LightBlue", LRV: 21, cmyk: { "c": 75, "m": 25, "y": 0, "k": 29 }, rgb: { "r": 46, "g": 136, "b": 182 }, lab: { "l": 53.135, "a": -15.219, "b": -32.486 } },
        { ral: 5013, name: "CobaltBlue", LRV: 3, cmyk: { "c": 59, "m": 42, "y": 0, "k": 67 }, rgb: { "r": 34, "g": 48, "b": 83 }, lab: { "l": 20.044, "a": 2.964, "b": -23.406 } },
        { ral: 5014, name: "PigeonBlue", LRV: 19, cmyk: { "c": 31, "m": 17, "y": 0, "k": 41 }, rgb: { "r": 104, "g": 124, "b": 150 }, lab: { "l": 51.233, "a": -2.817, "b": -16.741 } },
        { ral: 5015, name: "SkyBlue", LRV: 17, cmyk: { "c": 94, "m": 30, "y": 0, "k": 31 }, rgb: { "r": 11, "g": 123, "b": 176 }, lab: { "l": 48.193, "a": -13.907, "b": -36.485 } },
        { ral: 5017, name: "TrafficBlue", LRV: 8, cmyk: { "c": 100, "m": 36, "y": 0, "k": 45 }, rgb: { "r": 0, "g": 90, "b": 140 }, lab: { "l": 34.824, "a": -13.495, "b": -36.357 } },
        { ral: 5018, name: "TurquoiseBlue", LRV: 20, cmyk: { "c": 81, "m": 1, "y": 0, "k": 45 }, rgb: { "r": 27, "g": 139, "b": 140 }, lab: { "l": 52.285, "a": -30.312, "b": -9.335 } },
        { ral: 5019, name: "CapriBlue", LRV: 9, cmyk: { "c": 89, "m": 30, "y": 0, "k": 48 }, rgb: { "r": 15, "g": 93, "b": 132 }, lab: { "l": 36.615, "a": -11.411, "b": -28.473 } },
        { ral: 5020, name: "OceanBlue", LRV: 4, cmyk: { "c": 100, "m": 13, "y": 0, "k": 71 }, rgb: { "r": 0, "g": 65, "b": 75 }, lab: { "l": 23.75, "a": -20.682, "b": -12.512 } },
        { ral: 5021, name: "WaterBlue", LRV: 13, cmyk: { "c": 100, "m": 2, "y": 0, "k": 53 }, rgb: { "r": 0, "g": 117, "b": 119 }, lab: { "l": 43.325, "a": -33.797, "b": -10.417 } },
        { ral: 5022, name: "NightBlue", LRV: 3, cmyk: { "c": 52, "m": 51, "y": 0, "k": 65 }, rgb: { "r": 43, "g": 44, "b": 90 }, lab: { "l": 19.872, "a": 10.632, "b": -28.485 } },
        { ral: 5023, name: "DistantBlue", LRV: 13, cmyk: { "c": 48, "m": 26, "y": 0, "k": 45 }, rgb: { "r": 74, "g": 104, "b": 141 }, lab: { "l": 43.013, "a": -3.442, "b": -23.737 } },
        { ral: 5024, name: "PastelBlue", LRV: 26, cmyk: { "c": 40, "m": 15, "y": 0, "k": 33 }, rgb: { "r": 103, "g": 146, "b": 172 }, lab: { "l": 58.295, "a": -10.309, "b": -18.647 } },
        { ral: 5025, name: "PearlGentianBlue", LRV: 0, cmyk: { "c": 65, "m": 15, "y": 0, "k": 51 }, rgb: { "r": 44, "g": 105, "b": 124 }, lab: { "l": 41.102, "a": -15.762, "b": -16.748 } },
        { ral: 5026, name: "PearlnightBlue", LRV: 0, cmyk: { "c": 67, "m": 43, "y": 0, "k": 68 }, rgb: { "r": 27, "g": 47, "b": 82 }, lab: { "l": 19.227, "a": 1.728, "b": -24.359 } },
        { ral: 6e3, name: "PatinaGreen", LRV: 14, cmyk: { "c": 49, "m": 0, "y": 17, "k": 55 }, rgb: { "r": 59, "g": 116, "b": 96 }, lab: { "l": 44.529, "a": -23.651, "b": 5.316 } },
        { ral: 6001, name: "EmeraldGreen", LRV: 11, cmyk: { "c": 53, "m": 0, "y": 50, "k": 59 }, rgb: { "r": 49, "g": 104, "b": 52 }, lab: { "l": 39.247, "a": -28.094, "b": 23.342 } },
        { ral: 6002, name: "LeafGreen", LRV: 8, cmyk: { "c": 50, "m": 0, "y": 57, "k": 65 }, rgb: { "r": 45, "g": 90, "b": 39 }, lab: { "l": 34.079, "a": -24.697, "b": 23.999 } },
        { ral: 6003, name: "OliveGreen", LRV: 8, cmyk: { "c": 6, "m": 0, "y": 29, "k": 67 }, rgb: { "r": 78, "g": 83, "b": 59 }, lab: { "l": 34.335, "a": -5.296, "b": 13.147 } },
        { ral: 6004, name: "BlueGreen", LRV: 5, cmyk: { "c": 88, "m": 0, "y": 3, "k": 73 }, rgb: { "r": 8, "g": 68, "b": 66 }, lab: { "l": 25.484, "a": -19.095, "b": -4.31 } },
        { ral: 6005, name: "MossGreen", LRV: 4, cmyk: { "c": 74, "m": 0, "y": 24, "k": 74 }, rgb: { "r": 17, "g": 66, "b": 50 }, lab: { "l": 24.439, "a": -20.569, "b": 4.665 } },
        { ral: 6006, name: "Greyolive", LRV: 4, cmyk: { "c": 0, "m": 3, "y": 22, "k": 77 }, rgb: { "r": 59, "g": 57, "b": 46 }, lab: { "l": 24.036, "a": -1.163, "b": 7.105 } },
        { ral: 6007, name: "BottleGreen", LRV: 3, cmyk: { "c": 16, "m": 0, "y": 32, "k": 80 }, rgb: { "r": 42, "g": 50, "b": 34 }, lab: { "l": 19.792, "a": -6.46, "b": 9.562 } },
        { ral: 6008, name: "BrownGreen", LRV: 3, cmyk: { "c": 0, "m": 4, "y": 22, "k": 79 }, rgb: { "r": 54, "g": 52, "b": 42 }, lab: { "l": 21.675, "a": -0.827, "b": 6.489 } },
        { ral: 6009, name: "FirGreen", LRV: 3, cmyk: { "c": 28, "m": 0, "y": 22, "k": 79 }, rgb: { "r": 39, "g": 54, "b": 42 }, lab: { "l": 20.78, "a": -8.546, "b": 5.213 } },
        { ral: 6010, name: "GrassGreen", LRV: 13, cmyk: { "c": 35, "m": 0, "y": 50, "k": 56 }, rgb: { "r": 72, "g": 111, "b": 56 }, lab: { "l": 42.993, "a": -22.872, "b": 26.093 } },
        { ral: 6011, name: "ResedaGreen", LRV: 18, cmyk: { "c": 16, "m": 0, "y": 30, "k": 51 }, rgb: { "r": 105, "g": 125, "b": 88 }, lab: { "l": 49.931, "a": -12.896, "b": 17.344 } },
        { ral: 6012, name: "BlackGreen", LRV: 4, cmyk: { "c": 21, "m": 0, "y": 5, "k": 76 }, rgb: { "r": 48, "g": 61, "b": 58 }, lab: { "l": 24.554, "a": -6.234, "b": -0.13 } },
        { ral: 6013, name: "ReedGreen", LRV: 18, cmyk: { "c": 0, "m": 3, "y": 26, "k": 52 }, rgb: { "r": 122, "g": 118, "b": 90 }, lab: { "l": 49.493, "a": -2.158, "b": 16.371 } },
        { ral: 6014, name: "Yellowolive", LRV: 5, cmyk: { "c": 0, "m": 7, "y": 24, "k": 73 }, rgb: { "r": 70, "g": 65, "b": 53 }, lab: { "l": 27.639, "a": 0.59, "b": 7.89 } },
        { ral: 6015, name: "Blackolive", LRV: 5, cmyk: { "c": 2, "m": 0, "y": 11, "k": 76 }, rgb: { "r": 60, "g": 61, "b": 54 }, lab: { "l": 25.484, "a": -1.59, "b": 4.15 } },
        { ral: 6016, name: "TurquoiseGreen", LRV: 10, cmyk: { "c": 100, "m": 0, "y": 28, "k": 58 }, rgb: { "r": 0, "g": 106, "b": 76 }, lab: { "l": 38.439, "a": -39.355, "b": 8.026 } },
        { ral: 6017, name: "MayGreen", LRV: 18, cmyk: { "c": 35, "m": 0, "y": 51, "k": 50 }, rgb: { "r": 83, "g": 128, "b": 63 }, lab: { "l": 49.029, "a": -25.488, "b": 29.753 } },
        { ral: 6018, name: "YellowGreen", LRV: 26, cmyk: { "c": 42, "m": 0, "y": 63, "k": 40 }, rgb: { "r": 89, "g": 154, "b": 57 }, lab: { "l": 57.587, "a": -35.153, "b": 42.334 } },
        { ral: 6019, name: "PastelGreen", LRV: 57, cmyk: { "c": 11, "m": 0, "y": 17, "k": 19 }, rgb: { "r": 183, "g": 206, "b": 172 }, lab: { "l": 80.385, "a": -13.069, "b": 14.476 } },
        { ral: 6020, name: "ChromeGreen", LRV: 5, cmyk: { "c": 18, "m": 0, "y": 29, "k": 74 }, rgb: { "r": 54, "g": 66, "b": 47 }, lab: { "l": 26.338, "a": -8.365, "b": 10.002 } },
        { ral: 6021, name: "PaleGreen", LRV: 30, cmyk: { "c": 12, "m": 0, "y": 23, "k": 40 }, rgb: { "r": 135, "g": 154, "b": 119 }, lab: { "l": 61.305, "a": -11.717, "b": 16.056 } },
        { ral: 6022, name: "Brownolive", LRV: 3, cmyk: { "c": 0, "m": 11, "y": 32, "k": 78 }, rgb: { "r": 57, "g": 51, "b": 39 }, lab: { "l": 21.685, "a": 1.103, "b": 8.802 } },
        { ral: 6024, name: "TrafficGreen", LRV: 17, cmyk: { "c": 100, "m": 0, "y": 39, "k": 48 }, rgb: { "r": 0, "g": 132, "b": 80 }, lab: { "l": 47.925, "a": -44.563, "b": 18.534 } },
        { ral: 6025, name: "FernGreen", LRV: 14, cmyk: { "c": 18, "m": 0, "y": 46, "k": 57 }, rgb: { "r": 90, "g": 110, "b": 59 }, lab: { "l": 43.932, "a": -15.048, "b": 26.076 } },
        { ral: 6026, name: "OpalGreen", LRV: 8, cmyk: { "c": 100, "m": 0, "y": 18, "k": 63 }, rgb: { "r": 0, "g": 95, "b": 78 }, lab: { "l": 34.35, "a": -36.57, "b": 0.829 } },
        { ral: 6027, name: "LightGreen", LRV: 43, cmyk: { "c": 31, "m": 0, "y": 3, "k": 27 }, rgb: { "r": 128, "g": 186, "b": 181 }, lab: { "l": 71.56, "a": -20.503, "b": -3.86 } },
        { ral: 6028, name: "PineGreen", LRV: 7, cmyk: { "c": 43, "m": 0, "y": 21, "k": 67 }, rgb: { "r": 48, "g": 84, "b": 66 }, lab: { "l": 32.5, "a": -17.091, "b": 6.069 } },
        { ral: 6029, name: "MintGreen", LRV: 11, cmyk: { "c": 100, "m": 0, "y": 46, "k": 56 }, rgb: { "r": 0, "g": 112, "b": 60 }, lab: { "l": 39.92, "a": -47.213, "b": 19.273 } },
        { ral: 6032, name: "SignalGreen", LRV: 16, cmyk: { "c": 78, "m": 0, "y": 37, "k": 50 }, rgb: { "r": 28, "g": 128, "b": 81 }, lab: { "l": 47.236, "a": -37.788, "b": 16.942 } },
        { ral: 6033, name: "Mintturquoise", LRV: 20, cmyk: { "c": 47, "m": 0, "y": 6, "k": 47 }, rgb: { "r": 72, "g": 135, "b": 127 }, lab: { "l": 51.934, "a": -22.925, "b": -2.331 } },
        { ral: 6034, name: "Pastelturquoise", LRV: 37, cmyk: { "c": 28, "m": 0, "y": 1, "k": 32 }, rgb: { "r": 124, "g": 173, "b": 172 }, lab: { "l": 67.128, "a": -16.7, "b": -5.213 } },
        { ral: 6035, name: "PearlGreen", LRV: 0, cmyk: { "c": 75, "m": 0, "y": 53, "k": 70 }, rgb: { "r": 19, "g": 77, "b": 36 }, lab: { "l": 28.366, "a": -27.124, "b": 18.409 } },
        { ral: 6036, name: "PearlopalGreen", LRV: 0, cmyk: { "c": 92, "m": 0, "y": 15, "k": 65 }, rgb: { "r": 7, "g": 88, "b": 75 }, lab: { "l": 32.729, "a": -25.854, "b": 0.881 } },
        { ral: 6037, name: "PureGreen", LRV: 19, cmyk: { "c": 100, "m": 0, "y": 72, "k": 45 }, rgb: { "r": 0, "g": 140, "b": 39 }, lab: { "l": 50.209, "a": -53.031, "b": 41.386 } },
        { ral: 6038, name: "LuminousGreen", LRV: 31, cmyk: { "c": 100, "m": 0, "y": 90, "k": 29 }, rgb: { "r": 0, "g": 182, "b": 18 }, lab: { "l": 62.308, "a": -84.293, "b": 57.548 } },
        { ral: 7e3, name: "SquirrelGrey", LRV: 24, cmyk: { "c": 13, "m": 4, "y": 0, "k": 44 }, rgb: { "r": 123, "g": 136, "b": 142 }, lab: { "l": 55.673, "a": -3.552, "b": -4.905 } },
        { ral: 7001, name: "SilverGrey", LRV: 30, cmyk: { "c": 10, "m": 4, "y": 0, "k": 38 }, rgb: { "r": 142, "g": 150, "b": 157 }, lab: { "l": 61.648, "a": -2.346, "b": -4.456 } },
        { ral: 7002, name: "OliveGrey", LRV: 19, cmyk: { "c": 0, "m": 6, "y": 22, "k": 50 }, rgb: { "r": 127, "g": 120, "b": 99 }, lab: { "l": 50.775, "a": -0.044, "b": 12.64 } },
        { ral: 7003, name: "MossGrey", LRV: 18, cmyk: { "c": 0, "m": 1, "y": 13, "k": 53 }, rgb: { "r": 120, "g": 119, "b": 105 }, lab: { "l": 49.694, "a": -1.244, "b": 7.793 } },
        { ral: 7004, name: "SignalGrey", LRV: 33, cmyk: { "c": 0, "m": 0, "y": 0, "k": 39 }, rgb: { "r": 155, "g": 155, "b": 155 }, lab: { "l": 63.832, "a": 0.185, "b": -0.439 } },
        { ral: 7005, name: "MouseGrey", LRV: 15, cmyk: { "c": 3, "m": 0, "y": 3, "k": 57 }, rgb: { "r": 107, "g": 110, "b": 107 }, lab: { "l": 46.213, "a": -1.581, "b": 1.174 } },
        { ral: 7006, name: "BeigeGrey", LRV: 15, cmyk: { "c": 0, "m": 9, "y": 20, "k": 54 }, rgb: { "r": 117, "g": 106, "b": 94 }, lab: { "l": 45.607, "a": 2.498, "b": 8.713 } },
        { ral: 7008, name: "KhakiGrey", LRV: 12, cmyk: { "c": 0, "m": 17, "y": 47, "k": 55 }, rgb: { "r": 114, "g": 95, "b": 60 }, lab: { "l": 41.485, "a": 4.118, "b": 22.658 } },
        { ral: 7009, name: "GreenGrey", LRV: 11, cmyk: { "c": 4, "m": 0, "y": 8, "k": 62 }, rgb: { "r": 92, "g": 96, "b": 88 }, lab: { "l": 40.2, "a": -2.864, "b": 4.187 } },
        { ral: 7010, name: "TarpaulinGrey", LRV: 10, cmyk: { "c": 4, "m": 0, "y": 7, "k": 64 }, rgb: { "r": 88, "g": 92, "b": 86 }, lab: { "l": 38.442, "a": -2.331, "b": 2.593 } },
        { ral: 7011, name: "IronGrey", LRV: 10, cmyk: { "c": 11, "m": 4, "y": 0, "k": 64 }, rgb: { "r": 83, "g": 89, "b": 93 }, lab: { "l": 37.44, "a": -2.068, "b": -3.02 } },
        { ral: 7012, name: "BasaltGrey", LRV: 11, cmyk: { "c": 6, "m": 1, "y": 0, "k": 63 }, rgb: { "r": 88, "g": 93, "b": 94 }, lab: { "l": 39.159, "a": -2.027, "b": -1.452 } },
        { ral: 7013, name: "BrownGrey", LRV: 8, cmyk: { "c": 0, "m": 7, "y": 21, "k": 66 }, rgb: { "r": 86, "g": 80, "b": 68 }, lab: { "l": 34.343, "a": 0.836, "b": 8.009 } },
        { ral: 7015, name: "SlateGrey", LRV: 9, cmyk: { "c": 10, "m": 7, "y": 0, "k": 65 }, rgb: { "r": 80, "g": 83, "b": 89 }, lab: { "l": 35.155, "a": -0.229, "b": -3.737 } },
        { ral: 7016, name: "AnthraciteGrey", LRV: 5, cmyk: { "c": 15, "m": 6, "y": 0, "k": 74 }, rgb: { "r": 56, "g": 62, "b": 66 }, lab: { "l": 25.926, "a": -1.853, "b": -3.407 } },
        { ral: 7021, name: "BlackGrey", LRV: 3, cmyk: { "c": 8, "m": 4, "y": 0, "k": 80 }, rgb: { "r": 48, "g": 50, "b": 52 }, lab: { "l": 20.639, "a": -0.806, "b": -1.325 } },
        { ral: 7022, name: "UmbraGrey", LRV: 7, cmyk: { "c": 0, "m": 3, "y": 11, "k": 70 }, rgb: { "r": 76, "g": 74, "b": 68 }, lab: { "l": 31.372, "a": -1e-3, "b": 3.652 } },
        { ral: 7023, name: "ConcreteGrey", LRV: 21, cmyk: { "c": 1, "m": 0, "y": 8, "k": 50 }, rgb: { "r": 127, "g": 128, "b": 118 }, lab: { "l": 53.265, "a": -1.634, "b": 5.038 } },
        { ral: 7024, name: "GraphiteGrey", LRV: 7, cmyk: { "c": 11, "m": 8, "y": 0, "k": 69 }, rgb: { "r": 70, "g": 73, "b": 79 }, lab: { "l": 30.964, "a": -0.314, "b": -3.685 } },
        { ral: 7026, name: "GraniteGrey", LRV: 5, cmyk: { "c": 19, "m": 3, "y": 0, "k": 73 }, rgb: { "r": 56, "g": 67, "b": 69 }, lab: { "l": 27.434, "a": -4.013, "b": -3.107 } },
        { ral: 7030, name: "StoneGrey", LRV: 27, cmyk: { "c": 0, "m": 2, "y": 8, "k": 43 }, rgb: { "r": 145, "g": 142, "b": 133 }, lab: { "l": 59.041, "a": -0.114, "b": 5.3 } },
        { ral: 7031, name: "BlueGrey", LRV: 13, cmyk: { "c": 15, "m": 5, "y": 0, "k": 57 }, rgb: { "r": 93, "g": 104, "b": 109 }, lab: { "l": 43.16, "a": -3.593, "b": -4.523 } },
        { ral: 7032, name: "PebbleGrey", LRV: 44, cmyk: { "c": 0, "m": 2, "y": 11, "k": 29 }, rgb: { "r": 180, "g": 176, "b": 161 }, lab: { "l": 71.941, "a": -0.909, "b": 8.469 } },
        { ral: 7033, name: "CementGrey", LRV: 22, cmyk: { "c": 3, "m": 0, "y": 11, "k": 49 }, rgb: { "r": 126, "g": 130, "b": 116 }, lab: { "l": 53.842, "a": -3.737, "b": 7.189 } },
        { ral: 7034, name: "YellowGrey", LRV: 25, cmyk: { "c": 0, "m": 6, "y": 23, "k": 44 }, rgb: { "r": 144, "g": 136, "b": 111 }, lab: { "l": 56.857, "a": 0.031, "b": 14.835 } },
        { ral: 7035, name: "LightGrey", LRV: 57, cmyk: { "c": 1, "m": 0, "y": 2, "k": 22 }, rgb: { "r": 197, "g": 199, "b": 196 }, lab: { "l": 80.047, "a": -1.207, "b": 1.387 } },
        { ral: 7036, name: "PlatinumGrey", LRV: 30, cmyk: { "c": 0, "m": 3, "y": 3, "k": 41 }, rgb: { "r": 151, "g": 147, "b": 146 }, lab: { "l": 61.233, "a": 1.346, "b": 1.022 } },
        { ral: 7037, name: "DustyGrey", LRV: 20, cmyk: { "c": 1, "m": 0, "y": 1, "k": 52 }, rgb: { "r": 122, "g": 123, "b": 122 }, lab: { "l": 51.431, "a": -0.642, "b": 0.533 } },
        { ral: 7038, name: "AgateGrey", LRV: 43, cmyk: { "c": 1, "m": 0, "y": 5, "k": 31 }, rgb: { "r": 175, "g": 177, "b": 169 }, lab: { "l": 71.73, "a": -1.62, "b": 3.82 } },
        { ral: 7039, name: "QuartzGrey", LRV: 13, cmyk: { "c": 0, "m": 4, "y": 11, "k": 58 }, rgb: { "r": 106, "g": 102, "b": 94 }, lab: { "l": 43.496, "a": 0.373, "b": 5.56 } },
        { ral: 7040, name: "WindowGrey", LRV: 34, cmyk: { "c": 6, "m": 2, "y": 0, "k": 37 }, rgb: { "r": 152, "g": 158, "b": 161 }, lab: { "l": 64.7, "a": -1.517, "b": -2.498 } },
        { ral: 7042, name: "TrafficGreyA", LRV: 28, cmyk: { "c": 3, "m": 0, "y": 1, "k": 43 }, rgb: { "r": 142, "g": 146, "b": 145 }, lab: { "l": 60.149, "a": -1.676, "b": 0.035 } },
        { ral: 7043, name: "TrafficGreyB", LRV: 8, cmyk: { "c": 4, "m": 0, "y": 2, "k": 68 }, rgb: { "r": 79, "g": 82, "b": 80 }, lab: { "l": 34.565, "a": -1.532, "b": 0.596 } },
        { ral: 7044, name: "SilkGrey", LRV: 45, cmyk: { "c": 0, "m": 2, "y": 8, "k": 29 }, rgb: { "r": 182, "g": 179, "b": 168 }, lab: { "l": 72.904, "a": -0.082, "b": 5.939 } },
        { ral: 7045, name: "TeleGrey1", LRV: 29, cmyk: { "c": 5, "m": 2, "y": 0, "k": 42 }, rgb: { "r": 142, "g": 146, "b": 149 }, lab: { "l": 60.348, "a": -1.428, "b": -1.836 } },
        { ral: 7046, name: "TeleGrey2", LRV: 23, cmyk: { "c": 8, "m": 3, "y": 0, "k": 46 }, rgb: { "r": 127, "g": 134, "b": 138 }, lab: { "l": 55.438, "a": -1.833, "b": -3.188 } },
        { ral: 7047, name: "TeleGrey4", LRV: 58, cmyk: { "c": 0, "m": 0, "y": 0, "k": 22 }, rgb: { "r": 200, "g": 200, "b": 199 }, lab: { "l": 80.668, "a": -0.266, "b": 0.82 } },
        { ral: 7048, name: "PearlmouseGrey", LRV: 0, cmyk: { "c": 0, "m": 4, "y": 10, "k": 50 }, rgb: { "r": 128, "g": 123, "b": 115 }, lab: { "l": 51.991, "a": 0.679, "b": 5.105 } },
        { ral: 8e3, name: "GreenBrown", LRV: 16, cmyk: { "c": 0, "m": 21, "y": 54, "k": 47 }, rgb: { "r": 134, "g": 106, "b": 62 }, lab: { "l": 46.778, "a": 7.583, "b": 28.693 } },
        { ral: 8001, name: "OchreBrown", LRV: 16, cmyk: { "c": 0, "m": 35, "y": 72, "k": 40 }, rgb: { "r": 153, "g": 99, "b": 43 }, lab: { "l": 47.08, "a": 18.952, "b": 39.867 } },
        { ral: 8002, name: "SignalBrown", LRV: 10, cmyk: { "c": 0, "m": 35, "y": 48, "k": 53 }, rgb: { "r": 119, "g": 77, "b": 62 }, lab: { "l": 37.391, "a": 16.881, "b": 16.707 } },
        { ral: 8003, name: "ClayBrown", LRV: 10, cmyk: { "c": 0, "m": 40, "y": 69, "k": 51 }, rgb: { "r": 124, "g": 75, "b": 39 }, lab: { "l": 37.148, "a": 18.589, "b": 30.287 } },
        { ral: 8004, name: "CopperBrown", LRV: 11, cmyk: { "c": 0, "m": 47, "y": 64, "k": 46 }, rgb: { "r": 138, "g": 73, "b": 49 }, lab: { "l": 38.964, "a": 26.631, "b": 27.038 } },
        { ral: 8007, name: "FawnBrown", LRV: 8, cmyk: { "c": 0, "m": 36, "y": 61, "k": 57 }, rgb: { "r": 109, "g": 70, "b": 43 }, lab: { "l": 33.824, "a": 15.336, "b": 23.6 } },
        { ral: 8008, name: "OliveBrown", LRV: 9, cmyk: { "c": 0, "m": 33, "y": 67, "k": 56 }, rgb: { "r": 111, "g": 74, "b": 37 }, lab: { "l": 35.151, "a": 13.225, "b": 28.492 } },
        { ral: 8011, name: "NutBrown", LRV: 5, cmyk: { "c": 0, "m": 36, "y": 56, "k": 65 }, rgb: { "r": 88, "g": 56, "b": 39 }, lab: { "l": 27.125, "a": 13.264, "b": 17.081 } },
        { ral: 8012, name: "RedBrown", LRV: 5, cmyk: { "c": 0, "m": 49, "y": 57, "k": 61 }, rgb: { "r": 100, "g": 51, "b": 43 }, lab: { "l": 27.74, "a": 22.005, "b": 15.201 } },
        { ral: 8014, name: "SepiaBrown", LRV: 4, cmyk: { "c": 0, "m": 26, "y": 47, "k": 72 }, rgb: { "r": 72, "g": 53, "b": 38 }, lab: { "l": 24.029, "a": 7.289, "b": 12.866 } },
        { ral: 8015, name: "ChestnutBrown", LRV: 5, cmyk: { "c": 0, "m": 49, "y": 58, "k": 64 }, rgb: { "r": 93, "g": 47, "b": 39 }, lab: { "l": 25.491, "a": 20.675, "b": 15.127 } },
        { ral: 8016, name: "MahoganyBrown", LRV: 3, cmyk: { "c": 0, "m": 43, "y": 57, "k": 71 }, rgb: { "r": 75, "g": 43, "b": 32 }, lab: { "l": 21.4, "a": 14.371, "b": 13.84 } },
        { ral: 8017, name: "ChocolateBrown", LRV: 3, cmyk: { "c": 0, "m": 30, "y": 39, "k": 74 }, rgb: { "r": 67, "g": 47, "b": 41 }, lab: { "l": 21.544, "a": 8.972, "b": 7.368 } },
        { ral: 8019, name: "GreyBrown", LRV: 4, cmyk: { "c": 0, "m": 11, "y": 13, "k": 76 }, rgb: { "r": 61, "g": 54, "b": 53 }, lab: { "l": 23.321, "a": 2.993, "b": 1.467 } },
        { ral: 8022, name: "BlackBrown", LRV: 1, cmyk: { "c": 0, "m": 12, "y": 4, "k": 90 }, rgb: { "r": 26, "g": 23, "b": 25 }, lab: { "l": 8.139, "a": 1.932, "b": -0.585 } },
        { ral: 8023, name: "OrangeBrown", LRV: 15, cmyk: { "c": 0, "m": 46, "y": 74, "k": 37 }, rgb: { "r": 160, "g": 87, "b": 41 }, lab: { "l": 45.42, "a": 28.236, "b": 39.65 } },
        { ral: 8024, name: "BeigeBrown", LRV: 10, cmyk: { "c": 0, "m": 32, "y": 53, "k": 54 }, rgb: { "r": 118, "g": 80, "b": 56 }, lab: { "l": 38.036, "a": 14.136, "b": 20.822 } },
        { ral: 8025, name: "PaleBrown", LRV: 11, cmyk: { "c": 0, "m": 23, "y": 38, "k": 55 }, rgb: { "r": 115, "g": 88, "b": 71 }, lab: { "l": 39.85, "a": 9.63, "b": 14.49 } },
        { ral: 8028, name: "TerraBrown", LRV: 5, cmyk: { "c": 0, "m": 27, "y": 47, "k": 69 }, rgb: { "r": 79, "g": 58, "b": 42 }, lab: { "l": 26.58, "a": 7.884, "b": 13.812 } },
        { ral: 8029, name: "Pearlcopper", LRV: 0, cmyk: { "c": 0, "m": 49, "y": 61, "k": 51 }, rgb: { "r": 125, "g": 64, "b": 49 }, lab: { "l": 34.763, "a": 26.058, "b": 21.392 } },
        { ral: 9001, name: "Cream", LRV: 75, cmyk: { "c": 0, "m": 3, "y": 9, "k": 9 }, rgb: { "r": 231, "g": 225, "b": 210 }, lab: { "l": 89.616, "a": 0.594, "b": 8.06 } },
        { ral: 9002, name: "GreyWhite", LRV: 66, cmyk: { "c": 0, "m": 0, "y": 5, "k": 16 }, rgb: { "r": 214, "g": 213, "b": 203 }, lab: { "l": 85.07, "a": -1.04, "b": 5.18 } },
        { ral: 9003, name: "SignalWhite", LRV: 83, cmyk: { "c": 0, "m": 0, "y": 2, "k": 7 }, rgb: { "r": 236, "g": 236, "b": 231 }, lab: { "l": 93.223, "a": -0.644, "b": 2.45 } },
        { ral: 9004, name: "SignalBlack", LRV: 2, cmyk: { "c": 2, "m": 2, "y": 0, "k": 83 }, rgb: { "r": 43, "g": 43, "b": 44 }, lab: { "l": 17.464, "a": 0.429, "b": -0.837 } },
        { ral: 9005, name: "JetBlack", LRV: 0, cmyk: { "c": 12, "m": 12, "y": 0, "k": 94 }, rgb: { "r": 14, "g": 14, "b": 16 }, lab: { "l": 4.041, "a": 0.091, "b": -0.873 } },
        { ral: 9006, name: "WhiteAluminium", LRV: 0, cmyk: { "c": 0, "m": 0, "y": 1, "k": 37 }, rgb: { "r": 161, "g": 161, "b": 160 }, lab: { "l": 66.321, "a": -0.347, "b": 0.545 } },
        { ral: 9007, name: "GreyAluminium", LRV: 0, cmyk: { "c": 0, "m": 1, "y": 4, "k": 47 }, rgb: { "r": 134, "g": 133, "b": 129 }, lab: { "l": 55.547, "a": -0.061, "b": 2.142 } },
        { ral: 9010, name: "PureWhite", LRV: 84, cmyk: { "c": 0, "m": 1, "y": 6, "k": 6 }, rgb: { "r": 240, "g": 237, "b": 225 }, lab: { "l": 93.613, "a": -0.425, "b": 6.008 } },
        { ral: 9011, name: "GraphiteBlack", LRV: 2, cmyk: { "c": 9, "m": 5, "y": 0, "k": 83 }, rgb: { "r": 39, "g": 41, "b": 43 }, lab: { "l": 16.572, "a": -0.383, "b": -1.735 } },
        { ral: 9016, name: "TrafficWhite", LRV: 87, cmyk: { "c": 0, "m": 0, "y": 3, "k": 5 }, rgb: { "r": 240, "g": 241, "b": 234 }, lab: { "l": 94.843, "a": -0.921, "b": 3.28 } },
        { ral: 9017, name: "TrafficBlack", LRV: 2, cmyk: { "c": 0, "m": 2, "y": 0, "k": 84 }, rgb: { "r": 42, "g": 41, "b": 42 }, lab: { "l": 16.521, "a": 0.709, "b": -0.582 } },
        { ral: 9018, name: "PapyrusWhite", LRV: 59, cmyk: { "c": 2, "m": 0, "y": 3, "k": 20 }, rgb: { "r": 199, "g": 203, "b": 196 }, lab: { "l": 81.343, "a": -2.293, "b": 2.956 } },
        { ral: 9022, name: "PearlLightGrey", LRV: 0, cmyk: { "c": 0, "m": 0, "y": 2, "k": 48 }, rgb: { "r": 133, "g": 133, "b": 131 }, lab: { "l": 55.474, "a": -0.381, "b": 1.165 } },
        { ral: 9023, name: "PearlDarkGrey", LRV: 0, cmyk: { "c": 2, "m": 0, "y": 0, "k": 52 }, rgb: { "r": 121, "g": 123, "b": 123 }, lab: { "l": 51.274, "a": -0.7, "b": -0.279 } }
      ]
    };
    module2.exports = colorLibrary;
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/compare_deltaE_CIE76.js
var require_compare_deltaE_CIE76 = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/compare_deltaE_CIE76.js"(exports, module2) {
    module2.exports = (lab1, lab2) => Math.sqrt((lab1.l - lab2.l) ** 2 + (lab1.a - lab2.a) ** 2 + (lab1.b - lab2.b) ** 2);
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_remove_array_from_array.js
var require_remove_array_from_array = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_remove_array_from_array.js"(exports, module2) {
    module2.exports = (listOfElements, listOfExclusion) => listOfElements.filter((x2) => listOfExclusion.indexOf(x2) < 0);
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_accepted_colors.js
var require_accepted_colors = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_accepted_colors.js"(exports, module2) {
    var _removeFromArray = require_remove_array_from_array();
    var AcceptedColors = class {
      constructor() {
        this.cmyk = {};
        this.grayscale = {};
        this.hex3 = {};
        this.hex4 = {};
        this.hex6 = {};
        this.hex8 = {};
        this.html = {};
        this.hsl = {};
        this.hsv = {};
        this.lab = {};
        this.pantone = {};
        this.ral = {};
        this.rgb = {};
        this.rgba = {};
        this.rgbdecimal = {};
        this.w = {};
        this.xyz = {};
        this.yuv = {};
      }
      get keys() {
        return Object.keys(this);
      }
      get paintKeys() {
        return _removeFromArray(this.keys, ["ral", "rgbdecimal", "pantone", "grayscale", "hex3", "hex4", "rgba", "yuv"]);
      }
      get sanitaryKeys() {
        return _removeFromArray(this.keys, ["isHex", "hex", "isHexVerbos"]).sort((a, b2) => b2.length - a.length);
      }
    };
    __name(AcceptedColors, "AcceptedColors");
    module2.exports = AcceptedColors;
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_paint_factory.js
var require_color_paint_factory = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_paint_factory.js"(exports, module2) {
    var { html, pantone, ral } = require_color_library();
    var deltaE = require_compare_deltaE_CIE76();
    var AcceptedColors = require_accepted_colors();
    var colorConvertor = new AcceptedColors();
    var approxFix = /* @__PURE__ */ __name((colorObject) => {
      const _this = { ...colorObject };
      for (const i in _this) {
        if (Object.prototype.hasOwnProperty.call(_this, i)) {
          _this[i] = Math.round(_this[i] * 1e9) / 1e9;
        }
      }
      return _this;
    }, "approxFix");
    var splitCamelCase = /* @__PURE__ */ __name((name) => name.replace(/([A-Z])/g, " $1").trim(), "splitCamelCase");
    var PullDataFromList = /* @__PURE__ */ __name((listName, coloType, reference, query = "name") => {
      const _this = listName.filter((a) => a[query] === reference);
      return _this.length ? _this[0][coloType] : false;
    }, "PullDataFromList");
    var doubleString = /* @__PURE__ */ __name((string) => {
      let _this = "";
      for (let index = 0; index < string.length; index++) {
        _this += string[index] + string[index];
      }
      return _this.toUpperCase();
    }, "doubleString");
    var makeNumeric = /* @__PURE__ */ __name((inputNumber) => {
      const _this = parseInt(inputNumber, 10);
      return Number.isNaN(_this) ? 0 : _this;
    }, "makeNumeric");
    colorConvertor.cmyk.rgb = (cmyk) => ({
      r: Math.round(255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100)),
      g: Math.round(255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100)),
      b: Math.round(255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100))
    });
    colorConvertor.grayscale.cmyk = (grayscale) => ({
      c: 0,
      m: 0,
      y: 0,
      k: grayscale
    });
    colorConvertor.grayscale.rgb = (_grayscale) => {
      const grayscale = Math.round((100 - _grayscale) / 0.392156862745098);
      return { r: grayscale, g: grayscale, b: grayscale };
    };
    colorConvertor.grayscale.w = () => ({ error: "You can`t get the wavelength of no color" });
    colorConvertor.hex3.hex6 = (hex3) => doubleString(hex3);
    colorConvertor.hex4.hex8 = (hex4) => doubleString(hex4);
    colorConvertor.hex4.rgb = (hex4) => {
      const _this = {
        color: colorConvertor.hex6.rgb(colorConvertor.hex3.hex6(hex4.substring(0, 3))),
        opacity: parseInt([hex4.substring(3, 4), hex4.substring(3, 4)].join(""), 16) / 255
      };
      for (const i in _this.color) {
        if (Object.prototype.hasOwnProperty.call(_this.color, i)) {
          _this.color[i] *= _this.opacity;
          _this.color[i] = Math.round(_this.color[i]);
        }
      }
      return _this.color;
    };
    colorConvertor.hex6.hex3 = (hex6) => {
      const convertor = /* @__PURE__ */ __name((a, b2) => {
        let _this = "";
        _this = [a, b2].join("");
        _this = Math.floor(parseInt(_this, 16) / 16);
        return _this.toString(16).toUpperCase();
      }, "convertor");
      return convertor(hex6[0], hex6[1]) + convertor(hex6[2], hex6[3]) + convertor(hex6[4], hex6[5]);
    };
    colorConvertor.hex6.hex4 = (hex6) => `${colorConvertor.hex6.hex3(hex6)}F`;
    colorConvertor.hex6.hex8 = (hex6) => `${hex6}FF`.toUpperCase();
    colorConvertor.hex6.rgb = (hex6) => ({
      r: parseInt(hex6.substring(0, 2), 16),
      g: parseInt(hex6.substring(2, 4), 16),
      b: parseInt(hex6.substring(4, 6), 16)
    });
    colorConvertor.hex8.rgb = (hex8) => {
      const _this = {
        color: colorConvertor.hex6.rgb(hex8.substring(0, 6)),
        opacity: parseInt(hex8.substring(6, 8), 16) / 255
      };
      for (const i in _this.color) {
        if (Object.prototype.hasOwnProperty.call(_this.color, i)) {
          _this.color[i] *= _this.opacity;
          _this.color[i] = Math.round(_this.color[i]);
        }
      }
      return _this.color;
    };
    colorConvertor.hex8.rgba = (hex8) => {
      const _this = colorConvertor.hex6.rgb(hex8.substring(0, 6));
      _this.a = Number((parseInt(hex8.substring(6, 8), 16) / 255).toFixed(2));
      return _this;
    };
    colorConvertor.html.rgb = (htmlInput) => PullDataFromList(html, "rgb", htmlInput);
    colorConvertor.hsl.rgb = (_hsl) => {
      const hsl = { ..._hsl };
      const rgb = { r: 0, g: 0, b: 0 };
      hsl.h /= 60;
      if (hsl.h < 0) {
        hsl.h = 6 - -hsl.h % 6;
      }
      hsl.h %= 6;
      hsl.s = Math.max(0, Math.min(1, hsl.s / 100));
      hsl.l = Math.max(0, Math.min(1, hsl.l / 100));
      hsl.c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
      hsl.x = hsl.c * (1 - Math.abs(hsl.h % 2 - 1));
      if (hsl.h < 1) {
        rgb.r = hsl.c;
        rgb.g = hsl.x;
      } else if (hsl.h < 2) {
        rgb.r = hsl.x;
        rgb.g = hsl.c;
      } else if (hsl.h < 3) {
        rgb.g = hsl.c;
        rgb.b = hsl.x;
      } else if (hsl.h < 4) {
        rgb.g = hsl.x;
        rgb.b = hsl.c;
      } else if (hsl.h < 5) {
        rgb.r = hsl.x;
        rgb.b = hsl.c;
      } else {
        rgb.r = hsl.c;
        rgb.b = hsl.x;
      }
      hsl.m = hsl.l - hsl.c / 2;
      for (const i of "rgb") {
        rgb[i] = Math.round((rgb[i] + hsl.m) * 255);
      }
      return rgb;
    };
    colorConvertor.hsl.w = (hsl) => Math.round(620 - 170 / 270 * hsl.h);
    colorConvertor.hsv.rgb = (_hsv) => {
      const hsv = { ..._hsv };
      hsv.h /= 360;
      hsv.s /= 100;
      hsv.v /= 100;
      const i = Math.floor(hsv.h * 6);
      const f = hsv.h * 6 - i;
      const p = hsv.v * (1 - hsv.s);
      const q2 = hsv.v * (1 - f * hsv.s);
      const t = hsv.v * (1 - (1 - f) * hsv.s);
      switch (i % 6) {
        case 0:
          return { r: hsv.v * 255, g: t * 255, b: p * 255 };
        case 1:
          return { r: q2 * 255, g: hsv.v * 255, b: p * 255 };
        case 2:
          return { r: p * 255, g: hsv.v * 255, b: t * 255 };
        case 3:
          return { r: p * 255, g: q2 * 255, b: hsv.v * 255 };
        case 4:
          return { r: t * 255, g: p * 255, b: hsv.v * 255 };
        case 5:
          return { r: hsv.v * 255, g: p * 255, b: q2 * 255 };
        default:
          return false;
      }
    };
    colorConvertor.lab.pantone = (labOrigin) => {
      const lab = { ...labOrigin };
      const _this = {
        index: 768,
        name: ""
      };
      for (const elementPantone of pantone) {
        const t = deltaE(elementPantone.lab, lab);
        if (t < _this.index) {
          _this.index = t;
          _this.name = elementPantone.name;
          if (_this.index === 1) {
            return _this.name;
          }
        }
      }
      return _this.name;
    };
    colorConvertor.lab.ral = (lab) => {
      const _this = {
        index: 768,
        position: ral.length - 1
      };
      for (const elementRal in ral) {
        if (Object.prototype.hasOwnProperty.call(ral, elementRal)) {
          const t = deltaE(ral[elementRal].lab, lab);
          if (t < _this.index) {
            _this.index = t;
            _this.position = elementRal;
            if (_this.index === 0) {
              return {
                ral: ral[_this.position].ral,
                name: splitCamelCase(ral[_this.position].name),
                lrv: ral[_this.position].LRV
              };
            }
          }
        }
      }
      return {
        ral: ral[_this.position].ral,
        name: splitCamelCase(ral[_this.position].name),
        lrv: ral[_this.position].LRV
      };
    };
    colorConvertor.lab.rgb = (lab) => {
      const xyz = { x: 0, y: 0, z: 0 };
      const rgb = { r: 0, g: 0, b: 0 };
      xyz.y = (lab.l + 16) / 116;
      xyz.x = lab.a / 500 + xyz.y;
      xyz.z = xyz.y - lab.b / 200;
      xyz.x = 0.95047 * (xyz.x ** 3 > 8856e-6 ? xyz.x ** 3 : (xyz.x - 16 / 116) / 7.787);
      xyz.y = 1 * (xyz.y ** 3 > 8856e-6 ? xyz.y ** 3 : (xyz.y - 16 / 116) / 7.787);
      xyz.z = 1.08883 * (xyz.z ** 3 > 8856e-6 ? xyz.z ** 3 : (xyz.z - 16 / 116) / 7.787);
      rgb.r = xyz.x * 3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986;
      rgb.g = xyz.x * -0.9689 + xyz.y * 1.8758 + xyz.z * 0.0415;
      rgb.b = xyz.x * 0.0557 + xyz.y * -0.204 + xyz.z * 1.057;
      for (const i of "rgb") {
        rgb[i] = rgb[i] > 31308e-7 ? 1.055 * rgb[i] ** (1 / 2.4) - 0.055 : 12.92 * rgb[i];
        rgb[i] = Math.round(Math.max(0, Math.min(1, rgb[i])) * 255);
      }
      return rgb;
    };
    colorConvertor.pantone.rgb = (pantoneInput) => PullDataFromList(pantone, "rgb", pantoneInput);
    colorConvertor.pantone.cmyk = (pantoneInput) => PullDataFromList(pantone, "cmyk", pantoneInput);
    colorConvertor.pantone.lab = (pantoneInput) => PullDataFromList(pantone, "lab", pantoneInput);
    colorConvertor.ral.rgb = (ralInput) => PullDataFromList(ral, "rgb", ralInput, "ral");
    colorConvertor.ral.cmyk = (ralInput) => PullDataFromList(ral, "cmyk", ralInput, "ral");
    colorConvertor.ral.lab = (ralInput) => PullDataFromList(ral, "lab", ralInput, "ral");
    colorConvertor.rgb.hex6 = (_rgb) => {
      const rgbNormalize = /* @__PURE__ */ __name((colorBase) => {
        let color = makeNumeric(colorBase);
        if (color < 16) {
          color = `0${Number(color).toString(16)}`;
        } else {
          color = color.toString(16);
        }
        return color;
      }, "rgbNormalize");
      const rgb = { ..._rgb };
      Object.keys(rgb).map((k2) => {
        rgb[k2] = rgbNormalize(rgb[k2]);
      });
      return [rgb.r, rgb.g, rgb.b].join("").toUpperCase();
    };
    colorConvertor.rgb.rgba = (rgb) => Object.assign(rgb, { a: 1 });
    colorConvertor.rgb.hsl = (_rgb) => {
      const rgb = { ..._rgb };
      const hsl = { h: 0, s: 0, l: 0 };
      Object.keys(rgb).map((k2) => {
        rgb[k2] /= 255;
      });
      rgb.cmin = Math.min(rgb.r, rgb.g, rgb.b);
      rgb.cmax = Math.max(rgb.r, rgb.g, rgb.b);
      rgb.delta = rgb.cmax - rgb.cmin;
      if (rgb.delta === 0) {
        hsl.h = 0;
      } else if (rgb.cmax === rgb.r) {
        hsl.h = Math.round((rgb.g - rgb.b) / rgb.delta % 6 * 60);
      } else if (rgb.cmax === rgb.g) {
        hsl.h = Math.round(((rgb.b - rgb.r) / rgb.delta + 2) * 60);
      } else {
        hsl.h = Math.round(((rgb.r - rgb.g) / rgb.delta + 4) * 60);
      }
      hsl.h = hsl.h < 0 ? hsl.h + 360 : hsl.h;
      hsl.l = (rgb.cmax + rgb.cmin) / 2;
      hsl.s = rgb.delta === 0 ? 0 : rgb.delta / (1 - Math.abs(2 * hsl.l - 1));
      hsl.s = parseFloat((hsl.s * 100).toFixed(1));
      hsl.l = parseFloat((hsl.l * 100).toFixed(1));
      return approxFix(hsl);
    };
    colorConvertor.rgb.hsv = (_rgb) => {
      const rgb = { ..._rgb };
      Object.keys(rgb).map((k2) => {
        rgb[k2] /= 255;
      });
      const minRGB = Math.min(rgb.r, Math.min(rgb.g, rgb.b));
      const maxRGB = Math.max(rgb.r, Math.max(rgb.g, rgb.b));
      let hsv = false;
      if (minRGB === maxRGB) {
        hsv = {
          h: 0,
          s: 0,
          v: minRGB * 100
        };
      } else {
        let d = rgb.b === minRGB ? rgb.r - rgb.g : rgb.b - rgb.r;
        let h2 = rgb.b === minRGB ? 1 : 5;
        if (rgb.r === minRGB) {
          d = rgb.g - rgb.b;
          h2 = 3;
        }
        hsv = {
          h: 60 * (h2 - d / (maxRGB - minRGB)),
          s: (maxRGB - minRGB) / maxRGB * 100,
          v: maxRGB * 100
        };
      }
      return hsv;
    };
    colorConvertor.rgb.grayscale = (_rgb) => {
      if (_rgb) {
        const rgb = { ..._rgb };
        const grayscaleWhite = {
          r: 0.3,
          g: 0.59,
          b: 0.11
        };
        Object.keys(rgb).map((k2) => {
          rgb[k2] = (255 - rgb[k2]) * grayscaleWhite[k2];
        });
        return Math.round((rgb.r + rgb.g + rgb.b) / 2.56);
      }
      return 100;
    };
    colorConvertor.rgb.lab = (_rgb) => {
      const rgb = { ..._rgb };
      Object.keys(rgb).map((k2) => {
        rgb[k2] /= 255;
        rgb[k2] = rgb[k2] > 0.04045 ? ((rgb[k2] + 0.055) / 1.055) ** 2.4 : rgb[k2] / 12.92;
      });
      const xyz = { x: 0, y: 0, z: 0 };
      xyz.x = (rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805) / 0.95047;
      xyz.y = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 1;
      xyz.z = (rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505) / 1.08883;
      Object.keys(xyz).map((k2) => {
        xyz[k2] = xyz[k2] > 8856e-6 ? xyz[k2] ** (1 / 3) : 7.787 * xyz[k2] + 16 / 116;
      });
      const lab = { l: 116 * xyz.y - 16, a: 500 * (xyz.x - xyz.y), b: 200 * (xyz.y - xyz.z) };
      return approxFix(lab);
    };
    colorConvertor.rgb.cmyk = (_rgb) => {
      const rgb = { ..._rgb };
      const cmyk = {
        c: 0,
        m: 0,
        y: 0,
        k: 0
      };
      if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
        cmyk.k = 100;
      } else {
        Object.keys(rgb).map((k2) => {
          rgb[k2] /= 255;
        });
        cmyk.k = 1 - Math.max(rgb.r, rgb.g, rgb.b);
        if (cmyk.k !== 1) {
          cmyk.c = (1 - rgb.r - cmyk.k) / (1 - cmyk.k);
          cmyk.m = (1 - rgb.g - cmyk.k) / (1 - cmyk.k);
          cmyk.y = (1 - rgb.b - cmyk.k) / (1 - cmyk.k);
          Object.keys(cmyk).map((k2) => {
            cmyk[k2] = Math.round(cmyk[k2] * 100);
          });
        }
      }
      return cmyk;
    };
    colorConvertor.rgb.rgbdecimal = (rgb) => (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    colorConvertor.rgb.html = (rgb) => {
      const _this = {
        index: 768,
        html: ""
      };
      const { r, g: g2, b: b2 } = rgb;
      for (const eHtml of html) {
        const t = Math.abs(eHtml.rgb.r - r) + Math.abs(eHtml.rgb.g - g2) + Math.abs(eHtml.rgb.b - b2);
        if (t < _this.index) {
          _this.index = t;
          _this.html = splitCamelCase(eHtml.name);
          if (_this.index === 0) {
            return _this.html;
          }
        }
      }
      return _this.html;
    };
    colorConvertor.rgb.xyz = (_rgb) => {
      const pivot = /* @__PURE__ */ __name((n) => (n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92) * 100, "pivot");
      const rgb = { ..._rgb };
      Object.keys(rgb).map((k2) => {
        rgb[k2] = pivot(rgb[k2] / 255);
      });
      return {
        x: rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805,
        y: rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722,
        z: rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505
      };
    };
    colorConvertor.rgb.yuv = (rgb) => {
      const yuv = { y: 0, u: 0, v: 0 };
      yuv.y = 0.257 * rgb.r + 0.504 * rgb.g + 0.098 * rgb.b + 16;
      yuv.u = -0.148 * rgb.r - 0.291 * rgb.g + 0.439 * rgb.b + 128;
      yuv.v = 0.439 * rgb.r - 0.368 * rgb.g - 0.071 * rgb.b + 128;
      return yuv;
    };
    colorConvertor.rgba.rgb = (rgba) => {
      const rgb = { r: 0, g: 0, b: 0 };
      Object.keys(rgb).map((k2) => {
        rgb[k2] = Math.round(rgba[k2] * rgba.a);
      });
      return rgb;
    };
    colorConvertor.rgbdecimal.rgb = (RGBd) => ({
      r: (RGBd & 16711680) >> 16,
      g: (RGBd & 65280) >> 8,
      b: RGBd & 255
    });
    colorConvertor.w.rgb = (w2) => {
      const rgb = { r: 0, g: 0, b: 0 };
      if (w2 >= 380 && w2 < 440) {
        rgb.r = -1 * (w2 - 440) / (440 - 380);
        rgb.b = 1;
      } else if (w2 >= 440 && w2 < 490) {
        rgb.g = (w2 - 440) / (490 - 440);
        rgb.b = 1;
      } else if (w2 >= 490 && w2 < 510) {
        rgb.g = 1;
        rgb.b = -1 * (w2 - 510) / (510 - 490);
      } else if (w2 >= 510 && w2 < 580) {
        rgb.r = (w2 - 510) / (580 - 510);
        rgb.g = 1;
      } else if (w2 >= 580 && w2 < 645) {
        rgb.r = 1;
        rgb.g = -1 * (w2 - 645) / (645 - 580);
      } else if (w2 >= 645 && w2 <= 780) {
        rgb.r = 1;
      }
      Object.keys(rgb).map((k2) => {
        rgb[k2] = Math.round(rgb[k2] * 255);
      });
      return rgb;
    };
    colorConvertor.xyz.lab = (_xyz) => {
      const pivot = /* @__PURE__ */ __name((n) => n > 8856e-6 ? n ** 0.3333 : (903.3 * n + 16) / 116, "pivot");
      const xyz = { ..._xyz };
      xyz.x /= 95.047;
      xyz.y /= 100;
      xyz.z /= 108.883;
      Object.keys(xyz).map((k2) => {
        xyz[k2] = pivot(xyz[k2]);
      });
      const lab = {
        l: Math.max(0, 116 * xyz.y - 16),
        a: 500 * (xyz.x - xyz.y),
        b: 200 * (xyz.y - xyz.z)
      };
      return approxFix(lab);
    };
    colorConvertor.yuv.rgb = (yuv) => ({
      r: Math.round(yuv.y + 1.14 * yuv.v),
      g: Math.round(yuv.y - 0.395 * yuv.v - 0.581 * yuv.v),
      b: Math.round(yuv.y + 2.032 * yuv.u)
    });
    module2.exports = colorConvertor;
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_safeguard.js
var require_color_safeguard = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_safeguard.js"(exports, module2) {
    var AcceptedColors = require_accepted_colors();
    module2.exports = (colorString, probableColor) => {
      if (typeof colorString !== "string") {
        return false;
      }
      const _this = {
        colorString,
        probableColor,
        get acceptedColors() {
          return new AcceptedColors().keys.filter((a) => a !== "w").concat(["hex"]);
        },
        fullMatch(i) {
          return _this.colorString.indexOf(i) > -1;
        }
      };
      if (_this.fullMatch(_this.probableColor)) {
        return true;
      }
      for (const i of _this.acceptedColors) {
        if (_this.fullMatch(i)) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_reindex.js
var require_color_reindex = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_reindex.js"(exports, module2) {
    module2.exports = ({ colorData, colorName, regex }) => {
      if (colorData.length < colorName.length + (colorName.length - 1)) {
        return false;
      }
      const _this = {
        tempOut: {},
        regexColorMatch: new RegExp(regex, "g") || new RegExp("/(d+)/", "g"),
        get perfectMatch() {
          return colorData.indexOf(colorName) > -1;
        },
        get partialMatch() {
          let requiredLetters = colorName.length;
          for (const i of colorName) {
            if (colorData.indexOf(i) > -1) {
              requiredLetters -= 1;
            }
          }
          return requiredLetters === 0;
        },
        get preventNoFormatReindex() {
          if (colorName === "hsl" || colorName === "hsv") {
            if (colorData.indexOf("\xB0") === -1) {
              return false;
            }
          }
          return true;
        }
      };
      if (_this.perfectMatch) {
        _this.tempOut = colorData.match(_this.regexColorMatch);
        if (_this.tempOut.length === colorName.length) {
          return _this.tempOut;
        }
      } else if (_this.partialMatch) {
        for (const i of colorName) {
          const colorIndex = colorData.indexOf(i) + 1;
          const match = colorData.substring(colorIndex).match(_this.regexColorMatch);
          if (match) {
            const [a] = match;
            _this.tempOut[i] = a;
          }
        }
        return _this.tempOut ? _this.tempOut : false;
      } else if (_this.preventNoFormatReindex) {
        const match = colorData.match(_this.regexColorMatch);
        if (match && match.length === colorName.length) {
          for (let i = 0; i < colorName.length; i++) {
            _this.tempOut[colorName[i]] = match[i];
          }
          return _this.tempOut;
        }
      }
      return false;
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_procent_fix.js
var require_frame_procent_fix = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_procent_fix.js"(exports, module2) {
    module2.exports = {
      require(number1, number2) {
        if (number1 > 1 && number2 > 1) {
          return false;
        }
        return true;
      },
      fix(number) {
        return number * 100;
      }
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_clone.js
var require_frame_clone = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_clone.js"(exports, module2) {
    module2.exports = {
      cloneAndFormat: (ObjectToClone) => {
        if (typeof ObjectToClone === "object") {
          return JSON.parse(JSON.stringify(ObjectToClone).toLocaleLowerCase());
        }
        return ObjectToClone;
      },
      cloneData: (data) => {
        if (typeof data === "object" && !Array.isArray(data)) {
          return { ...data };
        }
        return data;
      }
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_sanitizer.js
var require_color_sanitizer = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_sanitizer.js"(exports, module2) {
    var { html, pantone, ral } = require_color_library();
    var _safeguard = require_color_safeguard();
    var AcceptedColors = require_accepted_colors();
    var ReindexColor = require_color_reindex();
    var procent = require_frame_procent_fix();
    var { cloneData } = require_frame_clone();
    var colorSanitizer = new AcceptedColors();
    var stringToArray = /* @__PURE__ */ __name(({ colorName, colorData, regex }) => {
      if (_safeguard(colorData, colorName)) {
        return ReindexColor({ colorData, colorName, regex });
      }
      return colorData;
    }, "stringToArray");
    var arrayToObject = /* @__PURE__ */ __name(({ data, key }) => {
      if (Array.isArray(data) && data.length === key.length) {
        const _this = {};
        for (const i in key) {
          if (Object.prototype.hasOwnProperty.call(key, i)) {
            _this[key[i]] = data[i];
          }
        }
        return _this;
      }
      return data;
    }, "arrayToObject");
    var makeInt = /* @__PURE__ */ __name((inputNumber) => {
      const _this = parseInt(inputNumber, 10);
      return Number.isNaN(_this) ? 0 : _this;
    }, "makeInt");
    var makeFloat = /* @__PURE__ */ __name((inputNumber) => {
      const _this = parseFloat(inputNumber);
      return Number.isNaN(_this) ? 0 : _this;
    }, "makeFloat");
    var abstractMakeInt = /* @__PURE__ */ __name((a, b2 = 100) => {
      if (typeof a === "string") {
        if (a.indexOf("%") > -1) {
          return parseFloat(a) / 100 * b2;
        }
        if (parseFloat(a) < 1) {
          return parseFloat(a) * b2;
        }
        return parseFloat(a);
      }
      return Number.isNaN(a) ? false : a;
    }, "abstractMakeInt");
    colorSanitizer.cmyk = (_cmyk) => {
      let cmyk = cloneData(_cmyk);
      cmyk = stringToArray({
        colorData: cmyk,
        colorName: "cmyk",
        regex: /[+-]?([0-9]*[.])?[0-9]+/
      });
      cmyk = arrayToObject({ data: cmyk, key: "cmyk" });
      if (typeof cmyk === "object") {
        for (const i of "cmyk") {
          cmyk[i] = abstractMakeInt(cmyk[i]);
          if (Number.isNaN(cmyk[i]) || cmyk[i] < 0 || cmyk[i] > 100) {
            return false;
          }
        }
        return cmyk;
      }
      return false;
    };
    colorSanitizer.grayscale = (_grayscale) => {
      let grayscale = cloneData(_grayscale);
      if (!colorSanitizer.isHex(grayscale)) {
        if (typeof grayscale === "string" && grayscale.indexOf("rgb") === -1) {
          grayscale = makeInt(grayscale.replace(/%20|[^0-9]/g, ""));
        }
        if (typeof grayscale === "number" && grayscale >= 0 && grayscale <= 100) {
          return grayscale >= 0 && grayscale <= 100 ? grayscale : true;
        }
      }
      return false;
    };
    colorSanitizer.hex = (hex) => {
      if (_safeguard(hex, "hex")) {
        if (hex.indexOf("#") < 0 || hex.indexOf("hex") < 0) {
          for (const indexColor of colorSanitizer.sanitaryKeys) {
            if (hex.indexOf(indexColor) > -1 && ["hex3", "hex4", "hex6", "hex8"].indexOf(indexColor) < 0) {
              return false;
            }
          }
          if (colorSanitizer.html(hex)) {
            return false;
          }
        }
        const _hex = hex.replace(/android|hex3|hex4|hex6|hex8|hex|0x|ox|[^a-f^0-9]/g, "");
        return _hex.length === 8 || _hex.length === 6 || _hex.length === 4 || _hex.length === 3 ? _hex : false;
      }
      return false;
    };
    colorSanitizer.isHex = (hex) => {
      const _this = colorSanitizer.hex(hex);
      return _this ? _this.length : false;
    };
    colorSanitizer.hex3 = (hex) => {
      const _this = colorSanitizer.hex(hex);
      return _this.length === 3 ? _this : false;
    };
    colorSanitizer.hex4 = (hex) => {
      const _this = colorSanitizer.hex(hex);
      return _this.length === 4 ? _this : false;
    };
    colorSanitizer.hex6 = (hex) => {
      const _this = colorSanitizer.hex(hex);
      return _this.length === 6 ? _this : false;
    };
    colorSanitizer.hex8 = (hex) => {
      const _this = colorSanitizer.hex(hex);
      return _this.length === 8 ? _this : false;
    };
    colorSanitizer.html = (htmlInput) => {
      if (_safeguard(htmlInput, "html")) {
        const _htmlInput = htmlInput.toLowerCase().replace(/html|[^a-z]/g, "");
        const _this = html.filter((a) => a.name.toLowerCase() === _htmlInput);
        return _this.length > 0 ? _this[0].name : false;
      }
      return false;
    };
    colorSanitizer.hsl = (hsl) => {
      let _hsl = cloneData(hsl);
      _hsl = stringToArray({
        colorData: _hsl,
        colorName: "hsl",
        regex: /([0-9]*[.])?[0-9]+/
      });
      _hsl = arrayToObject({ data: _hsl, key: "hsl" });
      if (typeof _hsl === "object") {
        for (const i of "hsl") {
          _hsl[i] = makeFloat(_hsl[i]);
        }
        const { h: h2, s: s2, l } = _hsl;
        if (h2 >= 0 && h2 <= 360 && s2 >= 0 && s2 <= 100 && l >= 0 && l <= 100) {
          if (procent.require(s2, l)) {
            _hsl.s *= 100;
            _hsl.l *= 100;
          }
          return _hsl;
        }
      }
      return false;
    };
    colorSanitizer.hsv = (_hsv) => {
      let hsv = cloneData(_hsv);
      hsv = stringToArray({
        colorData: hsv,
        colorName: "hsv",
        regex: /([0-9]*[.])?[0-9]+/
      });
      hsv = arrayToObject({ data: hsv, key: "hsv" });
      if (typeof hsv === "object") {
        for (const i of "hsv") {
          hsv[i] = makeFloat(hsv[i]);
        }
        const { h: h2, s: s2, v } = hsv;
        if (h2 >= 0 && h2 <= 360 && s2 >= 0 && s2 <= 100 && v >= 0 && v <= 100) {
          if (procent.require(s2, v)) {
            hsv.s *= 100;
            hsv.v *= 100;
          }
          return hsv;
        }
      }
      return false;
    };
    colorSanitizer.lab = (_lab) => {
      let lab = cloneData(_lab);
      lab = stringToArray({
        colorData: lab,
        colorName: "lab",
        regex: /[+-]?([0-9]*[.])?[0-9]+/
      });
      lab = arrayToObject({ data: lab, key: "lab" });
      if (typeof lab === "object") {
        for (const i of "lab") {
          lab[i] = parseFloat(lab[i]);
        }
        const { l, a, b: b2 } = lab;
        if (l >= 0 && l <= 100 && a >= -128 && a <= 127 && b2 >= -128 && b2 <= 127) {
          return lab;
        }
      }
      return false;
    };
    colorSanitizer.pantone = (pantoneInput) => {
      const truePantone = /* @__PURE__ */ __name((panton) => {
        const _pantone = panton.toLowerCase();
        const pTempNumeric = Number(_pantone.replace(/[^0-9]/g, ""));
        const pIsIndex = _pantone.indexOf("c") > -1 || _pantone.indexOf("pantone") > -1;
        const pIsNumeric = pTempNumeric >= 100 && pTempNumeric <= 5875;
        return pIsNumeric && pIsIndex ? `${pTempNumeric}C` : false;
      }, "truePantone");
      let tempPantoneNumber = "";
      if (typeof pantoneInput === "number") {
        return false;
      }
      if (typeof pantoneInput === "string" && pantoneInput.length >= 3 && _safeguard(pantoneInput, "pantone")) {
        tempPantoneNumber = truePantone(pantoneInput);
      } else if (typeof pantoneInput === "object" && pantoneInput.name && typeof pantoneInput.name === "string" && pantoneInput.length >= 3) {
        tempPantoneNumber = truePantone(pantoneInput.name);
      }
      if (tempPantoneNumber) {
        const tempPantoneArray = pantone.filter((a) => a.name === tempPantoneNumber);
        return tempPantoneArray.length === 1 ? tempPantoneArray[0].name : false;
      }
      return false;
    };
    colorSanitizer.ral = (ralInput) => {
      let _ral = cloneData(ralInput);
      const isRalNumeric = /* @__PURE__ */ __name((_ralColor) => _ralColor >= 1e3 && _ralColor <= 9023 ? _ralColor : false, "isRalNumeric");
      const isRalName = /* @__PURE__ */ __name((_ralColor) => {
        const _ralTemp = _ralColor.replace(/ral|[^a-z]/g, "");
        if (_ralTemp.length >= 4) {
          return _ralTemp;
        }
        return false;
      }, "isRalName");
      let _this = "";
      if (typeof _ral === "number" && isRalNumeric(_ral)) {
        _ral = {
          ral: `${_ral}`
        };
      } else if (typeof _ral === "string" && _ral.indexOf("ral") > -1) {
        const ralFilterName = isRalName(_ral);
        const ralFilterNumber = isRalNumeric(makeInt(_ral.replace(/[^0-9]/g, "")));
        _this = ralFilterName || ralFilterNumber ? ral.filter((a) => a.name.toLowerCase() === ralFilterName || a.ral === ralFilterNumber) : false;
      } else if (typeof _ral === "object" && !_ral.ral && _ral.name && typeof _ral.name === "string") {
        _ral.name = isRalName(_ral.name);
        _this = _ral.name ? ral.filter((a) => a.name === _ral.name) : false;
      } else {
        _this = ral.filter((a) => a.ral === _ral.ral);
      }
      return _this.length ? _this[0].ral : false;
    };
    colorSanitizer.rgb = (_rgb) => {
      let rgb = cloneData(_rgb);
      if (_safeguard(rgb, "rgb")) {
        rgb = ReindexColor({
          colorData: rgb,
          colorName: "rgb",
          regex: /([0-9]*[.])?[0-9]?[0-9%]+/
        });
      }
      rgb = arrayToObject({ data: rgb, key: "rgb" });
      if (typeof rgb === "object") {
        for (const i of "rgb") {
          rgb[i] = abstractMakeInt(rgb[i], 255);
          if (Number.isNaN(rgb[i]) || rgb[i] < 0 || rgb[i] > 255) {
            return false;
          }
        }
        return rgb;
      }
      return false;
    };
    colorSanitizer.rgba = (_rgba) => {
      let rgba = cloneData(_rgba);
      rgba = stringToArray({
        colorData: rgba,
        colorName: "rgba",
        regex: /([0-9]*[.])?[0-9]+/
      });
      rgba = arrayToObject({ data: rgba, key: "rgba" });
      if (typeof rgba === "object") {
        for (const i of "rgb") {
          rgba[i] = makeInt(rgba[i]);
          if (rgba[i] < 0 || rgba[i] > 255) {
            return false;
          }
        }
        rgba.a = parseFloat(rgba.a);
        return rgba.a >= 0 && rgba.a <= 1 ? rgba : false;
      }
      return false;
    };
    colorSanitizer.rgbdecimal = (_rgb) => {
      const rgb = cloneData(_rgb);
      if (typeof rgb === "string") {
        const numericData = rgb.match(/(\d+)/g);
        if (rgb.indexOf("rgb") > -1 || rgb.indexOf("decimal") > -1) {
          return numericData && numericData.length === 1 ? numericData : false;
        }
        if (numericData && numericData.length === 1) {
          return makeInt(numericData[0]) > 65792 ? numericData : false;
        }
      }
      return false;
    };
    colorSanitizer.w = (_w) => {
      let w2 = cloneData(_w);
      if (typeof w2 === "string") {
        w2 = makeInt(w2.replace(/[^0-9]/, ""));
      }
      if (typeof w2 === "number") {
        return w2 >= 380 && w2 <= 780 ? w2 : false;
      }
      return false;
    };
    colorSanitizer.xyz = (_xyz) => {
      let xyz = cloneData(_xyz);
      xyz = stringToArray({
        colorData: xyz,
        colorName: "xyz",
        regex: /[+-]?([0-9]*[.])?[0-9]+/
      });
      xyz = arrayToObject({ data: xyz, key: "xyz" });
      if (typeof xyz === "object") {
        for (const i of "xyz") {
          xyz[i] = makeInt(xyz[i]);
          if (xyz[i] <= 0) {
            return false;
          }
        }
        return xyz;
      }
      return false;
    };
    colorSanitizer.yuv = (_yuv) => {
      let yuv = cloneData(_yuv);
      yuv = stringToArray({
        colorData: yuv,
        colorName: "yuv",
        regex: /[+-]?([0-9]*[.])?[0-9]+/
      });
      yuv = arrayToObject({ data: yuv, key: "yuv" });
      if (typeof yuv === "object") {
        for (const i of "yuv") {
          yuv[i] = makeInt(yuv[i]);
          if (i !== "u" && yuv[i] < 0) {
            return false;
          }
        }
        return yuv;
      }
      return false;
    };
    module2.exports = colorSanitizer;
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_tell.js
var require_color_tell = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/_color_tell.js"(exports, module2) {
    var _colorSanitizer = require_color_sanitizer();
    module2.exports = (data) => {
      const everyKeyIndexOf = /* @__PURE__ */ __name((keys4, string) => {
        for (const i of keys4) {
          if (string.indexOf(i) === -1) {
            return false;
          }
        }
        return true;
      }, "everyKeyIndexOf");
      const ColorHasKeys = /* @__PURE__ */ __name((color, rawData) => {
        for (let i = 0; i < color.length; i++) {
          if (!Object.prototype.hasOwnProperty.call(rawData, color[i])) {
            return false;
          }
        }
        return true;
      }, "ColorHasKeys");
      if (typeof data === "number") {
        for (const i of ["grayscale", "w", "ral"]) {
          if (_colorSanitizer[i](data)) {
            return i;
          }
        }
      } else if (typeof data === "object") {
        for (const i of _colorSanitizer.sanitaryKeys) {
          if (ColorHasKeys(i, data)) {
            return i;
          }
        }
      } else if (typeof data === "string") {
        for (const i of _colorSanitizer.sanitaryKeys) {
          if ((data.indexOf(i) > -1 || everyKeyIndexOf(i, data)) && _colorSanitizer[i](data)) {
            return i;
          }
        }
        for (const i of _colorSanitizer.sanitaryKeys) {
          const tempSanitized = _colorSanitizer[i](data);
          if (tempSanitized) {
            return i;
          }
        }
        return false;
      }
      return false;
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_permutation.js
var require_frame_permutation = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/_components/frame/_frame_permutation.js"(exports, module2) {
    module2.exports = (list, from, to, maxLen) => {
      const noDuplicates = /* @__PURE__ */ __name((array) => new Set(array).size === array.length, "noDuplicates");
      const perm = list.map((val) => [val]);
      const generate = /* @__PURE__ */ __name((_perm, _maxLen, currLen) => {
        if (currLen === _maxLen) {
          return _perm;
        }
        for (let i = 0, len = _perm.length; i < len; i++) {
          const currPerm = _perm.shift();
          for (let k2 = 0; k2 < list.length; k2++) {
            const _temp = currPerm.concat(list[k2]);
            if (noDuplicates(_temp)) {
              _perm.push(_temp);
            }
          }
        }
        return generate(_perm, _maxLen, currLen + 1);
      }, "generate");
      const temp = generate(perm, maxLen, 1);
      for (const a in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, a)) {
          temp[a].unshift(from);
          temp[a].push(to);
        }
      }
      return temp;
    };
  }
});

// node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/simple_color_converter.js
var require_simple_color_converter = __commonJS({
  "node_modules/.pnpm/simple-color-converter@2.1.13/node_modules/simple-color-converter/simple_color_converter.js"(exports, module2) {
    var _colorFactory = require_color_paint_factory();
    var _colorSanitizer = require_color_sanitizer();
    var _colorTell = require_color_tell();
    var _permutation = require_frame_permutation();
    var { cloneData, cloneAndFormat } = require_frame_clone();
    var _removeFromArray = require_remove_array_from_array();
    var color = class {
      constructor(settingsArg = {}) {
        this.settings = cloneAndFormat(settingsArg);
        this.sanitizeAlternativeKeys();
        this.debug = settingsArg.debug || false;
        this.error = "";
        this.grayscale = this.settings.grayscale || false;
        this.from = this.sanitizeFrom(this.settings) || false;
        this.to = this.sanitizeTo({ from: this.from, to: this.settings.to }) || false;
        this.extraStepsForGrayscale();
        this.color = this.from && this.to ? _colorSanitizer[this.from](this.settings[this.from]) : false;
        this.color = this.ColorConvert({ color: this.color, steps: this.to });
        this.hexRefBuild();
        this.cleanUp();
      }
      extraStepsForGrayscale() {
        if (!this.error && this.grayscale === true) {
          const LastColorStep = this.to.pop();
          const tempTo = [
            this.sanitizeTo({ from: LastColorStep, to: "grayscale" }),
            this.sanitizeTo({ from: "grayscale", to: LastColorStep })
          ];
          if (tempTo[0] && tempTo[1]) {
            tempTo[0].pop();
            this.to = this.to.concat(tempTo[0], tempTo[1]);
          }
        }
      }
      hexRefBuild() {
        if (this.settings.hexref) {
          const lastElement = this.to[this.to.length - 1];
          const stepsTemp = this.sanitizeTo({ from: lastElement, to: "hex6" });
          if (lastElement === "ral" || lastElement === "html") {
            this.hexref = this.ColorConvert({ color: _colorSanitizer[lastElement](this.color), steps: stepsTemp });
          } else {
            this.hexref = this.ColorConvert({ color: this.color, steps: stepsTemp });
          }
          return true;
        }
        return false;
      }
      sanitizeAlternativeKeys() {
        const clean = {
          removeKey: "hex",
          setKey: "hex"
        };
        if (Object.prototype.hasOwnProperty.call(this.settings, "hex") && _colorSanitizer.hex(this.settings.hex)) {
          clean.setKey += _colorSanitizer.hex(this.settings.hex).length;
        } else if (Object.prototype.hasOwnProperty.call(this.settings, "android") && _colorSanitizer.hex(this.settings.android)) {
          clean.removeKey = "android";
          clean.setKey += _colorSanitizer.hex(this.settings.android).length;
        }
        if (clean.setKey && clean.removeKey) {
          this.settings[clean.setKey] = this.settings[clean.removeKey];
          delete this.settings[clean.removeKey];
        }
      }
      sanitizeExceptionsFrom(parameters) {
        const _parameters = _removeFromArray(parameters, ["to", "hexref", "debug"]);
        const parametersException = _parameters.filter((from) => ["color", "from"].indexOf(from) > -1);
        if (parametersException.length === 1) {
          const pEX = parametersException[0];
          const localTell = _colorTell(this.settings[pEX]);
          if (localTell) {
            _parameters.push(localTell);
            this.settings[localTell] = this.settings[pEX];
            _parameters.splice(_parameters.indexOf(pEX), 1);
          }
        }
        return [...new Set(_parameters)];
      }
      sanitizeFrom(settings) {
        const parameters = this.sanitizeExceptionsFrom(Object.keys(settings));
        let output = false;
        if (parameters.indexOf("grayscale") > -1 && typeof settings.grayscale === "boolean" && parameters.length > 1) {
          parameters.splice(parameters.indexOf("grayscale"), 1);
        }
        if (parameters.length === 1 && _colorFactory.keys.indexOf(parameters[0]) > -1) {
          [output] = parameters;
        } else if (parameters[0] === "color") {
          const objectData = {};
          objectData.tell = _colorTell(objectData[parameters[0]]);
          if (objectData.tell) {
            objectData[objectData.tell] = objectData.color;
            if (objectData.tell === "hex") {
              output = _colorSanitizer.isHexVerbos(objectData.hex);
            } else {
              output = objectData.tell;
            }
          } else {
            this.error = "Inputed color dose not math any color format";
          }
        } else {
          this.error = "The color specified in from is not an accepted input";
        }
        return output;
      }
      static validateLine(array) {
        const _this = [];
        for (let a = 0; a < array.length - 1; a++) {
          _this.push(Object.prototype.hasOwnProperty.call(_colorFactory[array[a]], array[a + 1]));
        }
        return _this.indexOf(false) < 0;
      }
      static sanitizeExceptionsTo(to) {
        const listOfExceptions = {
          hex: "hex6",
          android: "hex8",
          decimal: "rgbdecimal",
          web: "hex3",
          websafe: "hex3"
        };
        if (Object.prototype.hasOwnProperty.call(listOfExceptions, to)) {
          return listOfExceptions[to];
        }
        return to;
      }
      sanitizeTo({ from, to }) {
        if (!this.error) {
          const _to = this.constructor.sanitizeExceptionsTo(to);
          if (Object.prototype.hasOwnProperty.call(_colorFactory[from], _to) || _to === from) {
            return [from, _to];
          }
          if (_colorFactory.keys.indexOf(_to) !== -1) {
            for (let i = 1; i < _colorFactory.paintKeys.length; i++) {
              const stepsTable = _permutation(_colorFactory.paintKeys, from, _to, i);
              for (let a = 0; a < stepsTable.length; a++) {
                if (this.constructor.validateLine(stepsTable[a])) {
                  return stepsTable[a];
                }
              }
            }
          }
          this.error = "The value you want to convert to is not acceptable";
        }
        return false;
      }
      cleanUp() {
        const tempKeys = _removeFromArray(Object.keys(this), ["hexref", "color"]);
        if (this.error) {
          tempKeys.splice(tempKeys.indexOf("error"), 1);
        }
        if (this.debug !== true) {
          for (const i of tempKeys) {
            delete this[i];
          }
        }
      }
      ColorConvert({ color: color2, steps }) {
        let _color2 = cloneData(color2);
        if (!this.error && _color2 && steps) {
          if (steps[0] !== steps[1]) {
            for (let i = 0; i < steps.length - 1; i++) {
              _color2 = _colorFactory[steps[i]][steps[i + 1]](_color2);
            }
          } else if (["hex3", "hex4", "hex6", "hex8"].indexOf(steps[0]) > -1) {
            return _color2.toUpperCase();
          }
          return _color2;
        }
        this.error = this.error || "Can`t convert color.";
        return {};
      }
    };
    __name(color, "color");
    module2.exports = color;
  }
});

// node_modules/.pnpm/level@8.0.1/node_modules/level/index.js
var require_level = __commonJS({
  "node_modules/.pnpm/level@8.0.1/node_modules/level/index.js"(exports) {
    exports.Level = require("classic-level").ClassicLevel;
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  getGameStateCursor: () => getGameStateCursor,
  getGamestate: () => getGamestate,
  setGamestate: () => setGamestate
});
async function getGamestate(userId) {
  if (cache[userId])
    return cache[userId];
  if (!db2)
    return null;
  try {
    return await db2.get(userPrefix + userId);
  } catch (e) {
    return null;
  }
}
function setGamestate(userId, gamestate) {
  cache[userId] = gamestate;
  if (!db2)
    return;
  try {
    void db2.put(userPrefix + userId, gamestate);
  } catch {
  }
}
async function getGameStateCursor(userId) {
  const gamestate = await getGamestate(userId);
  if (gamestate == null) {
    throw Error(`no gamestate for user ${userId}`);
  }
  return new import_sbaobab5.SBaobab(gamestate).select();
}
var import_level, import_sbaobab5, isVercel, db2, userPrefix, cache;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_level = __toESM(require_level());
    import_sbaobab5 = require("sbaobab");
    isVercel = !!process.env.VERCEL;
    db2 = null;
    if (!isVercel) {
      try {
        db2 = new import_level.Level(__dirname + "/leveldb", {
          valueEncoding: "json"
        });
      } catch {
        db2 = null;
      }
    }
    userPrefix = "user-";
    cache = {};
    __name(getGamestate, "getGamestate");
    __name(setGamestate, "setGamestate");
    __name(getGameStateCursor, "getGameStateCursor");
  }
});

// server/index.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"));
var import_path3 = __toESM(require("path"));
var import_fs6 = __toESM(require("fs"));

// server/resolvePublicDir.ts
var import_path = __toESM(require("path"));
function resolvePublicDir() {
  if (process.env.VERCEL) {
    return import_path.default.join(__dirname, "api", "bundled-public");
  }
  return import_path.default.join(process.cwd(), "public");
}
__name(resolvePublicDir, "resolvePublicDir");

// game/config/logger.ts
var import_child_process = require("child_process");
var import_winston = __toESM(require("winston"));
var gitBranch = (0, import_child_process.spawnSync)("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
  encoding: "utf8",
  cwd: __dirname
})?.output?.[1]?.trim() ?? "unknown";
var transports = [new import_winston.default.transports.Console()];
if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
  transports.push(new import_winston.default.transports.File({ filename: __dirname + "/../server.log" }));
}
global.logger = import_winston.default.createLogger({
  format: import_winston.default.format.combine(
    import_winston.default.format.colorize(),
    import_winston.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    import_winston.default.format.printf(
      (info) => `${info.timestamp} [${info.level}] [${gitBranch}]: ${typeof info.message === "string" ? info.message : JSON.stringify(info.message)}`
    )
  ),
  transports
});
function getLogger() {
  return logger;
}
__name(getLogger, "getLogger");

// game/config/seedrand.ts
var import_seedrandom = __toESM(require_seedrandom2());
var seed = "seedThree";
logger.info(`setting random seed: ${seed}`);
global.srandom = (0, import_seedrandom.default)(seed);
var srandom2 = global.srandom;
function setGlobalRandomSeed(seed2) {
  global.srandom = (0, import_seedrandom.default)(seed2);
  logger.info(`setting random seed: ${seed2}`);
}
__name(setGlobalRandomSeed, "setGlobalRandomSeed");

// game/index.ts
init_util();

// game/gameState/battle/cards/discardUtil.ts
var import_immer10 = __toESM(require("immer"));

// game/gameState/battle/characters/characterGetters.ts
init_code();
var import_sbaobab3 = require("sbaobab");
init_rulebook2();
init_util();
init_util();

// game/gameState/battle/cards/cardManagement.ts
var import_lodash20 = require("lodash");

// shared/tree/battle/Card.ts
var emptyPiles = {
  draw: {},
  hand: {},
  discard: {},
  removedRoom: {},
  removedRun: {},
  removedDead: {}
};

// shared/tree/battle/Effect.ts
var effectIds = [
  "stunnedDebuff",
  "bleedDebuff",
  "poisonedDebuff",
  "fireDebuff",
  "yodelBuff",
  "tiredDebuff",
  "fatiguedDebuff",
  "debilitatedDebuff",
  "unreadyDebuff",
  "unguardedDebuff",
  "vulnerableDebuff",
  "targetedDebuff",
  "passiveBlockBuff",
  "reflectBuff",
  "counterAttackBuff",
  "mutuallyAssuredDestructionBuff",
  "strongblockBuff",
  "braveBuff",
  "courageousBuff",
  "guardedBuff",
  "entrancedBuff",
  "berserkBuff",
  "smallDamageIncreaseBuff",
  "doubleDamageBuff",
  "stampBuff",
  "chargedBombBuff",
  "cowardsCrown",
  "ignoreAggressive",
  "immuneToPoisonBuff",
  "damageTakeSubtractorBuff",
  "damageTakeAddendDebuff",
  "lockStanceDebuff",
  "valiant",
  "arcaneFriendship",
  "anHonestLiving",
  "hypochondriac"
];
var turnStartEffectIds = [
  "bleedDebuff",
  "poisonedDebuff",
  "passiveBlockBuff",
  "fireDebuff",
  "yodelBuff"
];
var passiveClassEffectIds = [
  "valiant",
  "arcaneFriendship",
  "anHonestLiving"
];
var procEffectIds = ["hypochondriac"];
var turnEndClearEffects = ["smallDamageIncreaseBuff"];

// shared/tree/battle/RunScore.ts
var RUN_SCORE_EVENT_MAPPING = {
  enemiesKilled: "ENEMY_KILLED",
  roomsCleared: "ROOM_CLEARED",
  roomClearDifficulty: "ROOM_CLEAR_DIFFICULTY",
  roomClearSpeed: "ROOM_CLEAR_SPEED",
  perfectKills: "PERFECT_KILL",
  perfectBlocks: "PERFECT_BLOCK",
  overkills: "OVERKILL",
  bossesKilled: "BOSS_KILLED",
  roomsExitedFullHealth: "EXIT_ROOM_FULL_HEALTH",
  bossRoomsExitedFullHealth: "EXIT_BOSS_FULL_HEALTH",
  highestDamageHit: "HIGHEST_DAMAGE",
  hitsOverVulgarThreshold: "HIT_VULGAR_THRESHOLD",
  bossRoomsExitedLowDamage: "EXIT_BOSS_LOW_DAMAGE",
  winsNoEnergyUsedLastTurn: "ROOM_WIN_NO_ENERGY_USED",
  finalUserHealthRemaining: "FINAL_USER_HEALTH_REMAINING",
  survivingKaiju: "SURVIVING_KAIJU",
  numSouvenirs: "NUM_SOUVENIRS",
  balancedTeam: "BALANCED_TEAM",
  specialBoy: "SPECIAL_BOY",
  roomsWonZeroDamage: "ROOM_WIN_ZERO_DAMAGE",
  roomsWonFiveDamage: "ROOM_WIN_FIVE_DAMAGE",
  roomsTake100Damage: "ROOM_TAKE_100_DAMAGE",
  blocksOverThreshold: "BLOCK_OVER_THRESHOLD",
  cardsPlayedOverThreshold: "CARDS_OVER_THRESHOLD",
  cardsWholeParty: "CARDS_WHOLE_PARTY",
  cardsDraftBalanced: "CARDS_DRAFT_BALANCED",
  runCompleted: "RUN_COMPLETED",
  runDefeated: "RUN_DEFEATED",
  null: "NULL"
};
var RUN_SCORE_EVENT_META = {
  ENEMY_KILLED: {
    description: "Aggregate enemy level of all enemies defeated",
    shortDescription: "Combat Score",
    pointValue: 1,
    attributeName: "enemiesKilled",
    keyword: "Combat Score",
    increment: true
  },
  EXIT_ROOM_FULL_HEALTH: {
    description: "Number of battles completed with all party members having full health",
    pointValue: 2,
    shortDescription: "Battles Completed with Full Health",
    attributeName: "roomsExitedFullHealth",
    keyword: "Mint Condition",
    increment: true
  },
  EXIT_BOSS_FULL_HEALTH: {
    description: "Number of boss battles completed with full party health",
    shortDescription: "Boss Battles Completed with Full Health",
    pointValue: 20,
    attributeName: "bossRoomsExitedFullHealth",
    keyword: "Was That A Boss?",
    increment: true
  },
  EXIT_BOSS_LOW_DAMAGE: {
    description: "Number of boss battles completed without losing more than 15 health",
    shortDescription: "Complete a Boss Battle and lose less than 15 Health",
    pointValue: 15,
    attributeName: "bossRoomsExitedLowDamage",
    keyword: "Just a Fleshwound (Near Mint)",
    increment: true
  },
  BOSS_KILLED: {
    description: "Number of bosses defeated",
    shortDescription: "Bosses Defeated",
    pointValue: 10,
    attributeName: "bossesKilled",
    keyword: "Bosses Defeated",
    increment: true
  },
  ROOM_CLEARED: {
    description: "Number of rooms cleared",
    shortDescription: "Rooms Cleared",
    pointValue: 5,
    attributeName: "roomsCleared",
    keyword: "Rooms Cleared",
    increment: true
  },
  ROOM_CLEAR_DIFFICULTY: {
    description: "3 bonus points for every difficulty level 4 room defeated, 2 bonus points for every difficulty level 3 room defeated.",
    shortDescription: "Rooms Cleared Difficulty",
    pointValue: 1,
    attributeName: "roomClearDifficulty",
    keyword: "The Hard Way",
    increment: true
  },
  ROOM_CLEAR_SPEED: {
    description: "Room clear speed",
    shortDescription: "bonus points based on finishing a room by a turn count",
    pointValue: 1,
    attributeName: "roomClearSpeed",
    keyword: "Mustn't Tarry",
    increment: true
  },
  ROOM_WIN_NO_ENERGY_USED: {
    description: "Win a battle without spending any energy in the last turn",
    shortDescription: "No Energy Used Last Turn",
    pointValue: 3,
    attributeName: "winsNoEnergyUsedLastTurn",
    keyword: "Walk Away",
    increment: true
  },
  PERFECT_KILL: {
    description: "Score a final hit against enemy exacly equal to its remaining health",
    shortDescription: "Perfect Kills",
    pointValue: 1,
    attributeName: "perfectKills",
    keyword: "Perfect Kill",
    increment: true
  },
  PERFECT_BLOCK: {
    description: "Generate block equal to the exact value of an enemy attack",
    shortDescription: "Perfect Blocks",
    pointValue: 1,
    attributeName: "perfectBlocks",
    keyword: "Block Block Revolution",
    increment: true
  },
  OVERKILL: {
    description: "Overkill an enemy by 20 or more health",
    shortDescription: "No Mercy",
    pointValue: 1,
    attributeName: "overkills",
    keyword: "No Mercy",
    increment: true
  },
  HIGHEST_DAMAGE: {
    description: "Highest damage from a single hit",
    shortDescription: "Highest Damage From a Single Hit",
    pointValue: 0.25,
    attributeName: "highestDamageHit",
    keyword: "Number Go Up",
    increment: false
  },
  RUN_COMPLETED: {
    description: "Successfully completed a run",
    shortDescription: "You won!",
    pointValue: 5,
    attributeName: "runCompleted",
    keyword: "Winner!",
    increment: false
  },
  RUN_DEFEATED: {
    description: "Why would I give you points?",
    shortDescription: "You lost!",
    pointValue: 0,
    attributeName: "runDefeated",
    keyword: "Loser!",
    increment: false
  },
  SURVIVING_KAIJU: {
    description: "Number of party members alive at the end of run",
    shortDescription: "Surviving Party Members",
    pointValue: 12,
    attributeName: "survivingKaiju",
    keyword: "Present and Accounted For",
    increment: false
  },
  BALANCED_TEAM: {
    description: "Have 3 different characters in your party",
    shortDescription: "All different characters in your team",
    pointValue: 5,
    attributeName: "balancedTeam",
    keyword: "Fellowship of The Balanced Team",
    increment: false
  },
  SPECIAL_BOY: {
    description: "No duplicates in final deck outside of basic attack, block and starter cards",
    shortDescription: "No added duplicates to your deck",
    pointValue: 10,
    attributeName: "specialBoy",
    keyword: "A Very Special Boy",
    increment: false
  },
  NUM_SOUVENIRS: {
    description: "Number of souvenirs held at the end",
    shortDescription: "Number of souvenirs held at the end",
    pointValue: 1,
    attributeName: "numSouvenirs",
    keyword: "Tourist",
    increment: false
  },
  FINAL_USER_HEALTH_REMAINING: {
    description: "Amount of health remaining at the end of your run: 3 points per 10% of max HP per character (max 90 points)",
    shortDescription: "Total Health Remaining",
    pointValue: 1,
    attributeName: "finalUserHealthRemaining",
    keyword: "For Your Health",
    increment: false
  },
  HIT_VULGAR_THRESHOLD: {
    description: "Deal over 55 damage in a single turn",
    shortDescription: "Deal Over 55 Damage in One Turn",
    pointValue: 1,
    attributeName: "hitsOverVulgarThreshold",
    keyword: "A Vulgar Display of Power",
    increment: true
  },
  ROOM_WIN_ZERO_DAMAGE: {
    description: "Lose 0 health during a room",
    shortDescription: "Rooms Beat with 0 Lost Health",
    pointValue: 4,
    attributeName: "roomsWonZeroDamage",
    keyword: `Feelin' Fine`,
    increment: true
  },
  ROOM_WIN_FIVE_DAMAGE: {
    description: "Lose fewer than 5 health points during a room",
    shortDescription: "Rooms Beat losing a little health",
    pointValue: 3,
    attributeName: "roomsWonFiveDamage",
    keyword: `A-`,
    increment: true
  },
  ROOM_TAKE_100_DAMAGE: {
    description: "Lose over 100 health in one room",
    shortDescription: "Lose over 100 health in one room",
    pointValue: 5,
    attributeName: "roomsTake100Damage",
    keyword: `Sorry That Happened To You`,
    increment: true
  },
  BLOCK_OVER_THRESHOLD: {
    description: "Generate over 40 block in a single turn",
    shortDescription: "Generate Over 40 Block in One Turn",
    pointValue: 2,
    attributeName: "blocksOverThreshold",
    keyword: `Fortified`,
    increment: true
  },
  CARDS_OVER_THRESHOLD: {
    description: "Play 5 or more cards in a single turn",
    shortDescription: "Cards Over 5 Played",
    pointValue: 1,
    attributeName: "cardsPlayedOverThreshold",
    keyword: `Long Combo`,
    increment: true
  },
  CARDS_WHOLE_PARTY: {
    description: "Have each of your 3 Kaiju play a card in a single turn",
    shortDescription: "Play a card by every character in your party in a single turn (max 1 point per room, only scorable if all 3 characters are alive)",
    pointValue: 1,
    attributeName: "cardsWholeParty",
    keyword: `Taking Turns, Playing Nice`,
    increment: true
  },
  CARDS_DRAFT_BALANCED: {
    description: `Draft a card type that's different than the last two types of cards you've drafted`,
    shortDescription: "Draw cards of different types",
    pointValue: 1,
    attributeName: "cardsDraftBalanced",
    keyword: `A Balanced Portfolio`,
    increment: true
  },
  NULL: {
    description: "Can be optionally used for derived events",
    shortDescription: "NULL",
    pointValue: 0,
    attributeName: "null",
    keyword: `Null`,
    increment: true
  }
};

// shared/tree/battle/Loot.ts
var TreasureChestLevelThreshold = {
  0: 0,
  1: 100,
  2: 200,
  3: 400,
  4: 700,
  5: 1200
};
var MAX_CHEST_LEVEL = 5;

// shared/tree/EventScene.ts
var disableEventScene = process.env.IS_PRODUCTION !== "false";

// shared/tree/Souvenir.ts
var souvenirMap = {
  bigStinkyTooth: {
    id: "bigStinkyTooth",
    name: "Big Stinky Tooth",
    equippable: true,
    description: "Equipped Kaiju gains +6 DEF,-2 STR, and -2 MAG.",
    on: {
      acquire: 'modifyStats("defense|strength|magic", "6|-2|-2", "run")'
    }
  },
  dentistryForDummies: {
    id: "dentistryForDummies",
    name: "Dentistry for Dummies",
    equippable: true,
    description: "Equipped Kaiju gains +1 MAG after completing each room.",
    on: {
      battleEnd: 'modifyStats("magic", "1", "run")'
    }
  },
  frogWine: {
    id: "frogWine",
    name: "Frog Wine",
    equippable: false,
    description: "All Kaiju gain +1 STR, +1 MAG, and +1 DEF.",
    on: {
      acquire: 'modifyStats("strength|magic|defense", "1|1|1", "run")'
    }
  },
  brokenCarriageWheel: {
    id: "brokenCarriageWheel",
    name: "Broken Carriage Wheel",
    equippable: true,
    description: "Equipped Kaiju takes 2 damage and gains 2 STR on equip.<br/>At the start of each room, apply Berserk (5) to equpped Kaiju.",
    on: {
      acquire: 'deal(2); modifyStats("strength", "2", "run")',
      battleStart: 'effect("berserk", 5)'
    }
  },
  bundleOfFrogWine: {
    id: "bundleOfFrogWine",
    name: "Bundle of Frog Wine",
    equippable: false,
    description: "All Kaiju take 10 Damage.All Kaiju gain +2 STR, +2 MAG, and +2 DEF.",
    on: {
      acquire: `deal(10); modifyStats("strength|magic|defense", "2|2|2", "run")`
    }
  },
  squeakyClownShoes: {
    id: "squeakyClownShoes",
    name: "Squeaky Clown Shoes",
    equippable: true,
    description: "Aggressive Stance no longer gives this Kaiju damage modifiers.",
    on: {
      turnStart: 'effect("ignoreAggressive", 1)'
    }
  },
  cowardsCrown: {
    id: "cowardsCrown",
    name: "Cowards Crown",
    equippable: false,
    description: "All Kaiju deal 15% more damage in avoidant stance",
    on: {
      turnStart: 'effect("cowardsCrown", 1)'
    }
  },
  clownInfestation: {
    id: "clownInfestation",
    name: "Infestation of Clowns",
    equippable: false,
    description: "At the start of a new Encounter, apply Unguarded (1) to all friendly characters.  Apply Vulnerable (2) to all enemy characters. ",
    on: {
      battleStart: 'chain(effect("unguarded", 1, "allFriends"), effect("vulnerable", 2, "allEnemies"))'
    }
  },
  demonsLeftHand: {
    id: "demonsLeftHand",
    name: "Demon's Left Hand",
    equippable: true,
    description: "Equipped Kaiju gets+2 STR, +2 MAG, and-12 max Health",
    on: {
      acquire: 'modifyStats("strength|magic|constitution", "2|2|-12", "run")'
    }
  },
  demonsRightHand: {
    id: "demonsRightHand",
    name: "Demon's Right Hand",
    equippable: true,
    description: "Equipped Kaiju gets+35 max Health, -1 STR,and -1 MAG",
    on: {
      acquire: `chain(
                    modifyStats("strength|magic|constitution", "-1|-1|35", "run"),
                    heal(30)
                )`
    }
  },
  nightmareBiscuit: {
    id: "nightmareBiscuit",
    name: "Nightmare Biscuit",
    equippable: true,
    description: "Equipped Kaiju gains +3 STR, +3 MAG, and a permanent stack of Unguarded.",
    on: {
      acquire: 'modifyStats("strength|magic", "3|3", "run")',
      turnStart: 'effect("unguarded", 1)'
    }
  },
  glassOfWarmMilk: {
    id: "glassOfWarmMilk",
    name: "Glass of Warm Milk",
    equippable: false,
    description: "Heal all Kaiju for 12.",
    on: {
      acquire: "heal(12)"
    }
  },
  yummyRice: {
    id: "yummyRice",
    name: "Yummy Rice",
    description: "Heal all party members for 8. In addition, characters heal for an additional 8 HP whenever you enter a rest site.",
    equippable: false,
    on: {
      acquire: "heal(8)",
      enterRestSite: "heal(8)"
    }
  },
  familyBeetle: {
    id: "familyBeetle",
    name: `Family Beetle`,
    description: `Equipped Kaiju gains Brave (1) if they start their turn in avoidant stance.`,
    equippable: true,
    on: {
      turnStart: 'ifStance("avoidant", effect("brave", 1))'
    }
  },
  dietaryYogurt: {
    id: "dietaryYogurt",
    name: `Dietary Yogurt`,
    description: `All party members start encounters with 9 block`,
    equippable: false,
    on: {
      battleStart: "addBlock(9)"
    }
  },
  emptyDiaper: {
    id: "emptyDiaper",
    name: `Empty Diaper`,
    description: `The next time equipped Kaiju would take lethal damage, ignore that damage, and replace this item with Filled Daiper.`,
    equippable: true,
    on: {
      lethalDamageInterrupt: `removeSouvenir("emptyDiaper"); acquireSouvenir("filledDiaper")`
    }
  },
  filledDiaper: {
    id: "filledDiaper",
    name: `Filled Diaper`,
    description: `Equipped Kaiju Has -20 Constitution, -2 STR, and -2 MAG.`,
    equippable: true,
    on: {
      acquire: 'modifyStats("constitution|strength|magic", "-20|-2|-2", "run")'
    }
  },
  lilFella: {
    id: "lilFella",
    name: `Funny lil Fella`,
    description: `Whenever a friendly Kaiju takes unblocked damage, draw a card, then discard a card.`,
    equippable: false,
    on: {
      takeDamage: "queue(1, chain(draw(1), discard(1)))"
    }
  },
  pulledRug: {
    id: "pulledRug",
    name: `Pulled Rug`,
    description: `Upon obtaining Pulled Rug, deal 7 damage to the character it's equipped to.  That character gains +3 DEF and starts every encounter with 7 block.
        If a character equipped with this souvenir ends their turn in Neutral Stance, they take 2 damage and gain Brave (1)`,
    equippable: true,
    on: {
      acquire: 'deal(7); modifyStats("defense", "3", "run")',
      battleStart: "addBlock(7)",
      turnEnd: `
                ifStance(
                    "neutral",
                    chain(
                        deal(2),
                        modifyStats("defense", "3", "run")
                    )
                )
            `
    }
  },
  questionableHat: {
    id: "questionableHat",
    name: `Questionable Hat`,
    description: `Draw two less cards at the start of each turn.  Gain an additional energy at the start of each turn`,
    equippable: false,
    on: {
      turnStart: `addEnergy(1); drawSizeChange(-2)`
    }
  },
  restrainingOrder: {
    id: "restrainingOrder",
    name: `Restraining Order`,
    description: `Bosses and tier four enemies deal 10% less damage`,
    equippable: false,
    on: {
      turnStart: `if(
                    currentRoomCategory === "tierFour" || currentRoomCategory === "boss",
                    effect("restrainingOrder", 1, "allEnemies")
                )`
    }
  },
  stinkEgg: {
    id: "stinkEgg",
    name: `Stink Egg`,
    description: `Set Equipped Kaiju's stance to avoident after you end your turn.`,
    equippable: true,
    on: {
      turnEnd: 'setStance("avoidant")'
    }
  },
  stinkyMeat: {
    id: "stinkyMeat",
    name: `Stinky Meat`,
    description: `Equipped Kaiju's attacks apply poisoned 2.`,
    equippable: true,
    on: {
      playCard: `if(lastCardPlayedType === "attack", effect("poisoned", 2))`
    }
  },
  strangeHat: {
    id: "strangeHat",
    name: `Strange Hat`,
    description: `Equipped Kaiju gains +3 DEF.`,
    equippable: true,
    on: {
      acquire: 'modifyStats("defense", "3", "run")'
    }
  },
  squireEmblem: {
    id: "squireEmblem",
    name: `Squire Emblem`,
    description: `Whenever equipped kaiju plays a card, they gain 4 block.`,
    equippable: true,
    on: {
      playCard: "if(wasLastCardPlayedFromThisCharacter, addBlock(4))"
    }
  },
  woolBandana: {
    id: "woolBandana",
    name: `Wool Bandana`,
    description: `Whenever equipped Kaiju ends its turn in a new stance, it gains 1 Orb of Lightning`,
    equippable: true,
    on: {
      turnEnd: 'ifStanceElse(turnStartStance, null, orb("lightning", 1))'
    }
  },
  contaminatedRag: {
    id: "contaminatedRag",
    name: `Contaminated Rag`,
    description: `Equipped Kaiju is immune to Poison Damage`,
    equippable: true,
    on: {
      turnStart: 'effect("immuneToPoison", 1)'
    }
  },
  rustedGear: {
    id: "rustedGear",
    name: `Rusted Gear`,
    description: `If you've played an attack card this turn, all utility cards cost 1 less.`,
    equippable: false,
    on: {
      playCard: 'if(lastCardPlayedType === "attack", discountCardsOfType("utility", 1))'
    }
  },
  enchantedSnowball: {
    id: "enchantedSnowball",
    name: `Enchanted Snowball`,
    description: `Whenever equipped Kaiju ends their turn in the same stance they started their turn in, they gains 1 Orb of Frost`,
    equippable: false,
    on: {
      turnEnd: 'ifStance(turnStartStance, orb("frost", 1))'
    }
  },
  lavenderTea: {
    id: "lavenderTea",
    name: `Lavender Tea`,
    description: `Set equipped Kaiju's stance to neutral after you end your turn.`,
    equippable: true,
    on: {
      turnEnd: 'setStance("neutral")'
    }
  },
  petRock: {
    id: "petRock",
    name: `Pet Rock`,
    description: `Equipped Kaiju gains 1 block whenever a card is played.`,
    equippable: true,
    on: {
      playCard: "addBlock(1)"
    }
  },
  penguinEgg: {
    id: "penguinEgg",
    name: `Penguin Egg`,
    description: `Yummy`,
    equippable: false,
    on: {
      acquire: "heal(2)"
    }
  },
  bootlegExplosive: {
    id: "bootlegExplosive",
    name: `Bootleg Explosive`,
    description: `Gain a charge when you play a utility card, When you play 3 attacks in 1 turn deal damage to all enemies equal to the number of charges on Bootleg Explosive, then remove all charges. Charges are retained between encounters`,
    equippable: false,
    on: {
      playCard: `
                if(lastCardPlayedType === "utility", souvenirCounter("bootlegExplosiveCharge", 1));
                if(lastCardPlayedType === "attack", souvenirCounter("bootlegAttackStack", 1))
            `
    }
  },
  dearestDiary: {
    id: "dearestDiary",
    name: `Dearest Diary`,
    description: `Gain Sticky 1 (Keep up to X cards in your hand that don't get discarded at the end of your turn)`,
    equippable: false,
    on: {
      turnEnd: "keep(1)"
    }
  },
  shinyMarble: {
    id: "shinyMarble",
    name: `Shiny Marble`,
    description: `Deal 5 damage to a random enemy at the start of your turn.`,
    equippable: false,
    targetNum: 1,
    targetType: "enemies",
    on: {
      turnStart: `deal(5)`
    }
  },
  silkGloves: {
    id: "silkGloves",
    name: `Silk Gloves`,
    description: `Equipped Kaiju gains +2 MAG until end of turn whenever you play a card.`,
    equippable: true,
    on: {
      playCard: 'modifyStats("magic", "2", "turn")'
    }
  },
  allPurposeKnob: {
    id: "allPurposeKnob",
    name: `All Purpose Knob.`,
    description: `Activate this object to finish a room without gaining room rewards, and go to next room. (clickable!) Remove after use.`,
    equippable: false,
    on: {
      activate: `openMap(); removeSouvenir("allPurposeKnob")`
    }
  },
  advilPM: {
    id: "advilPM",
    name: `Advil PM`,
    description: `Enemy Kaiju start encounters with Tired 2`,
    equippable: false,
    on: {
      battleStart: 'effect("tired", 2, "allEnemies")'
    }
  },
  gamerBathwater: {
    id: "gamerBathwater",
    name: `Gamer Bathwater`,
    description: `Activate to deal 25 damage to all enemies. (clickable!)This souvenir is destroyed after use. `,
    equippable: false,
    on: {
      activate: `deal(25, null, "allEnemies"); removeSouvenir("gamerBathwater")`
    }
  },
  demonCookie: {
    id: "demonCookie",
    name: `Demon Cookie`,
    description: `Equipped Kaiju gains +5 STR and -5 DEF`,
    equippable: true,
    on: {
      acquire: `modifyStats("strength|defense", "5|-5", "run")`
    }
  },
  grandmasHandbag: {
    id: "grandmasHandbag",
    name: `Grandma's Handbag`,
    description: `Draw +1 card at the start of every turn.`,
    equippable: false,
    on: {
      turnStart: `drawSizeChange(1)`
    }
  },
  stinkySandwich: {
    id: "stinkySandwich",
    name: `Stinky Sandwich`,
    description: `Whenever equipped Kaiju takes damage from an attack, they get +2 DEF until the end of the room.`,
    equippable: true,
    on: {
      takeDamage: `modifyStats("defense", "1", "room")`
    }
  },
  bigSniff: {
    id: "bigSniff",
    name: `Big Sniff`,
    description: `At the start of a new encounter, apply vulnerable 1 to a random enemy.`,
    equippable: false,
    targetNum: 1,
    targetType: "enemies",
    on: {
      battleStart: `effect("vulnerable", 1)`
    }
  },
  organicBathSalts: {
    id: "organicBathSalts",
    name: `Organic Bath Salts`,
    description: `Equipped Kaiju takes 2 less damage from attacks.`,
    equippable: true,
    on: {
      battleStart: `effect("damageTakeSubtractorBuff", 1)`,
      turnStart: `effect("damageTakeSubtractorBuff", 1)`
    }
  },
  lacedBathSalts: {
    id: "lacedBathSalts",
    name: `Laced Bath Salts`,
    description: `Equipped Kaiju takes 2 extra damage from all attacks.  It gains a permanent stack of Brave.`,
    equippable: true,
    on: {
      battleStart: `effect("damageTakeAddendDebuff", 1)`,
      turnStart: `effect("damageTakeAddendDebuff", 1); effect("brave", 1)`
    }
  },
  concreteShoes: {
    id: "concreteShoes",
    name: `Concrete Shoes`,
    description: `Equipped Kaiju gets +8 DEF and +35 max health but can't change stances outside of cards and abilities that force them to do so.`,
    equippable: true,
    on: {
      acquire: `modifyStats("defense", "5", "run"); modifyStats("constitution", "35", "run")`,
      turnStart: `effect("lockStance", 1)`
    }
  },
  hypochondriac: {
    id: "hypochondriac",
    name: "Hypochondriac",
    description: "This character ignores the first debuff applied to them per room.",
    equippable: true,
    on: {
      battleStart: `effect("hypochondriac", 1)`
    }
  },
  healthyEater: {
    id: "healthyEater",
    name: `Healthy Eater`,
    description: `The Health of this character is increased by 8%+1.`,
    equippable: true,
    on: {
      acquire: `chain(modifyStats("constitution|constitutionMultiplicand", "1|0.08", "run"), heal(targetConstitution*0.08+1))`
    }
  },
  gymRat: {
    id: "gymRat",
    name: `Gym Rat`,
    description: `The Strength of this character is increased by 8%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("strength|strengthMultiplicand", "1|0.08", "run")`
    }
  },
  sorcerer: {
    id: "sorcerer",
    name: `Sorcerer`,
    description: `The Magic of this character is increased by 8%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("magic|magicMultiplicand", "1|0.08", "run")`
    }
  },
  thickSkinned: {
    id: "thickSkinned",
    name: `Thick Skinned`,
    description: `The Defense of this character is increased by 8%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("defense|defenseMultiplicand", "1|0.08", "run")`
    }
  },
  aboveAverageMetabolism: {
    id: "aboveAverageMetabolism",
    name: `Above Average Metabolism`,
    description: `The Health of this character is increased by 3%+1.`,
    equippable: true,
    on: {
      acquire: `chain(modifyStats("constitution|constitutionMultiplicand", "1|0.03", "run"), heal(targetConstitution*0.03+1))`
    }
  },
  worksOutOccasionally: {
    id: "worksOutOccasionally",
    name: `Works Out Occasionally`,
    description: `The Strength of this character is increased by 3%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("strength|strengthMultiplicand", "1|0.03", "run")`
    }
  },
  magicallyInclined: {
    id: "magicallyInclined",
    name: `Magically Inclined`,
    description: `The Magic of this character is increased by 3%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("magic|magicMultiplicand", "1|0.03", "run")`
    }
  },
  tougherThanMost: {
    id: "tougherThanMost",
    name: `Tougher Than Most`,
    description: `The Defense of this character is increased by 3%+1.`,
    equippable: true,
    on: {
      acquire: `modifyStats("defense|defenseMultiplicand", "1|0.03", "run")`
    }
  },
  lovesCamping: {
    id: "lovesCamping",
    name: `Loves Camping`,
    description: "Whenever you enter a rest site, this character heals for 25% of their maximum health.",
    equippable: true,
    on: {
      enterRestSite: "heal(0.25*constitution)"
    }
  },
  anxiousAvoidant: {
    id: "anxiousAvoidant",
    name: `Anxious Avoidant`,
    description: "Whenever this character plays a card that discards a card, 25% chance of draw 1.",
    equippable: true,
    on: {
      discardEnd: "chance(0.25, draw(1))"
    }
  },
  oftenSleepy: {
    id: "oftenSleepy",
    name: `Often Sleepy`,
    description: "This character starts the first 5 combat rooms with Tired (1).  After the first 5 combat rooms, this character starts all combat rooms with Guarded (1).  Whenever you enter a rest site, this character heals for 15% of their maximum health.",
    equippable: true,
    on: {
      battleStart: 'incrementSouvenir(idx); if(counter < 5, effect("tired", 1), effect("guarded", 1))',
      enterRestSite: "heal(0.15*constitution)"
    }
  },
  amateurCardCounter: {
    id: "amateurCardCounter",
    name: `Amateur Card Counter`,
    description: "Whenever you shuffle your discard pile back into your draw pile, draw 1.",
    equippable: true,
    on: {
      shuffleDiscard: "draw(1)"
    }
  },
  goodAtPlanning: {
    id: "goodAtPlanning",
    name: `Good at Planning`,
    description: "Draw an additional card during the first turn of every combat.",
    equippable: true,
    on: {
      battleStart: "draw(1)"
    }
  },
  quickToPickAFight: {
    id: "quickToPickAFight",
    name: `Quick To Pick A Fight`,
    description: "At the start of your turn, if your hand has no attack cards, draw cards until you draw an attack card. (Unique)",
    unique: true,
    equippable: true,
    on: {}
  },
  pressurePointSpecialist: {
    id: "pressurePointSpecialist",
    name: `Pressure Point Specialist`,
    description: "The Critical Hit chance of this character is increased by 5%.",
    equippable: true,
    on: {}
  },
  nativeOfHooligansBluff: {
    id: "nativeOfHooligansBluff",
    name: `Native Of Hooligan's Bluff`,
    description: `Increase this character's stats by 5% in Hooligan's Bluff.`,
    equippable: true,
    on: {}
  },
  excellentCook: {
    id: "excellentCook",
    name: `Excellent Cook`,
    description: `Rest sites heal your party for 8% more health.`,
    equippable: true,
    on: {}
  },
  fisherman: {
    id: "fisherman",
    name: `Fisherman`,
    description: `Draw an additional card and heal all party members for 2% of their maximum health at the start of your third turn.`,
    equippable: true,
    on: {}
  },
  alwaysPackSnacks: {
    id: "alwaysPackSnacks",
    name: `Always Pack Snacks`,
    description: `Event rooms heal your party for 3% of their maximum health`,
    equippable: true,
    on: {}
  },
  goodImmuneSystem: {
    id: "goodImmuneSystem",
    name: `Good Immune System`,
    description: "",
    equippable: true,
    on: {}
  },
  mildlyLucky: {
    id: "mildlyLucky",
    name: `Mildly Lucky`,
    description: `+2% chance of Critical Hit.  +1% chance of Dodge.  If this character would die, 33% they are reduced to 1 Health instead (can only successfully trigger once per run)`,
    equippable: true,
    on: {}
  },
  experiencedForager: {
    id: "experiencedForager",
    name: `Experienced Forager`,
    description: `All party members heal for 2% of their maximum health after every combat.`,
    equippable: true,
    on: {}
  },
  bornSurvivor: {
    id: "bornSurvivor",
    name: `Born Survivor`,
    description: "The first time this character would die, reduce their health to 1 instead.",
    equippable: true,
    on: {}
  },
  secretVampire: {
    id: "secretVampire",
    name: `Secret Vampire`,
    description: "Whenever this character plays an attack card that destroys an enemy, they heal for 10% of their maximum health.",
    equippable: true,
    on: {}
  },
  marathonRunner: {
    id: "marathonRunner",
    name: `Marathon Runner`,
    description: "After the first 5 combats in a dungeon, increase this characters stats by 10%.",
    equippable: true,
    on: {}
  },
  bully: {
    id: "bully",
    name: `Bully`,
    description: "Attack cards played by this character deal 5%+1 more damage against enemies with less health than them.",
    equippable: true,
    on: {}
  },
  bigGameHunter: {
    id: "bigGameHunter",
    name: `Big Game Hunter`,
    description: "This character deals 10% more damage against Bosses.",
    equippable: true,
    on: {}
  },
  stealthy: {
    id: "stealthy",
    name: `stealthy`,
    description: `Increase this character's Dodge chance by 4%.  Slightly decrease this character's Taunt (decrease it by -5, hidden)`,
    equippable: true,
    on: {}
  },
  frontLineFighter: {
    id: "frontLineFighter",
    name: `frontLineFighter`,
    description: `Increase this character's Defense and Strength by +4%.`,
    equippable: true,
    on: {}
  },
  levelHeaded: {
    id: "levelHeaded",
    name: `levelHeaded`,
    description: `Increase this character's Health by +6%.`,
    equippable: true,
    on: {}
  },
  greatGuy: {
    id: "greatGuy",
    name: `greatGuy`,
    description: `Everyone agrees that this Kaiju is extremely nice.`,
    equippable: true,
    on: {}
  },
  ADHD: {
    id: "ADHD",
    name: `ADHD`,
    description: `Draw an additional card at the beginning of every other turn. If you don't play any cards from this character in a turn, this character gains Fatigue (1) at the start of their next turn.`,
    equippable: true,
    on: {}
  },
  veryLoyal: {
    id: "veryLoyal",
    name: `Very Loyal`,
    description: `The first time this character plays a defense card that targets an ally each turn, their target gains an extra +20% block.`,
    equippable: true,
    on: {}
  },
  pillager: {
    id: "pillager",
    name: `Pillager`,
    description: `Whenever a character in your party destroys an enemy, all friendly characters gain +15% block.`,
    equippable: true,
    on: {}
  },
  giantSlayer: {
    id: "giantSlayer",
    name: `Giant Slayer`,
    description: `+15% Critical Hit chance vs Bosses.  The first attack card this character targets a boss with per combat automatically crits.`,
    equippable: true,
    on: {}
  },
  eternalOptimist: {
    id: "eternalOptimist",
    name: `Eternal Optimist`,
    description: `This character starts all Boss Fights and Elite encounters with Courageous (3).`,
    equippable: true,
    on: {}
  },
  emotionallySensitive: {
    id: "emotionallySensitive",
    name: `Emotionally Sensitive`,
    description: `This character's Magic and Strength are increased by 8%+1.  Their Defense and Health are decreased by 4%.  Critical hits by this character deal an additional +25% damage.`,
    equippable: true,
    on: {}
  },
  distinctiveRibbit: {
    id: "distinctiveRibbit",
    name: `Distinctive Ribbit`,
    description: `Increase the critical hit chance of allies by 3%.`,
    equippable: true,
    on: {}
  },
  slipperyWhenWet: {
    id: "slipperyWhenWet",
    name: `slipperyWhenWet`,
    description: `If this character ends their turn with 0 block, they gain +20% block.`,
    equippable: true,
    on: {}
  },
  poisonousBlood: {
    id: "poisonousBlood",
    name: `Poisonous Blood`,
    description: `If this character is attacked by an enemy while they have Bleed, apply Poison (20%) to the attacker.`,
    equippable: true,
    on: {}
  },
  stickyHands: {
    id: "stickyHands",
    name: `Sticky Hands`,
    description: `Randomly keep one card in your hand at the end of your turn. (Unqiue)`,
    unique: true,
    equippable: true,
    on: {}
  },
  wiseCroaker: {
    id: "wiseCroaker",
    name: `Wise Croaker`,
    description: `If you don't play any cards from this Kaiju in a turn, draw an additional card and this Kaiju gains Strongblock (1) at the beginning of your next turn.`,
    equippable: true,
    on: {}
  },
  excellentStompDancer: {
    id: "excellentStompDancer",
    name: `Excellent Stomp Dancer`,
    description: `This Warhog's War Stomp card deals an additional 25% damage.`,
    equippable: true,
    on: {}
  },
  thickBoned: {
    id: "thickBoned",
    name: `Thick Boned`,
    description: `Whenever you draw a card for this character, they gain +6% block.`,
    equippable: true,
    on: {}
  },
  shortTempered: {
    id: "shortTempered",
    name: `Short Tempered`,
    description: `This character starts every room with Berserk (1) and Resistant (1).`,
    equippable: true,
    on: {}
  },
  ironSkinned: {
    id: "ironSkinned",
    name: `Iron Skinned`,
    description: `This character is immune to Poison damage and Bleed.`,
    equippable: true,
    on: {}
  },
  bigYawn: {
    id: "bigYawn",
    name: `Big Yarn`,
    description: `The first Defense card this character plays per room applies Tired (1) to all enemies.`,
    equippable: true,
    on: {}
  },
  apexOmnivore: {
    id: "apexOmnivore",
    name: `Apex Omnivore`,
    description: `Critical Hits from this character have Piercing.`,
    equippable: true,
    on: {}
  },
  veryLarge: {
    id: "veryLarge",
    name: `Very Large`,
    description: `The Health of this character is increased by 7.5%.`,
    equippable: true,
    on: {}
  },
  veryVeryLarge: {
    id: "veryVeryLarge",
    name: `Very, Very, Large`,
    description: `The Health of this character is increased by 15%.`,
    equippable: true,
    on: {}
  },
  reinforcedHooves: {
    id: "reinforcedHooves",
    name: `Reinforced Hooves`,
    description: `The Strength of this character is increased by 10%.`,
    equippable: true,
    on: {}
  },
  bigNapper: {
    id: "bigNapper",
    name: `Big Napper`,
    description: `If you don't play any cards from this Kaiju in a turn, this Kaiju heals for 6% of their maximum health.`,
    equippable: true,
    on: {}
  },
  disarminglyCute: {
    id: "disarminglyCute",
    name: `Disarmingly Cute`,
    description: `Every time this character plays an Attack Card, 20% chance of applying Fatigue (1) to enemies targeted.`,
    equippable: true,
    on: {}
  },
  anxietyRiddled: {
    id: "anxietyRiddled",
    name: `Anxiety Riddled`,
    description: `The first time this character discards a card per room, draw 1.`,
    equippable: true,
    on: {}
  },
  extraBlubbery: {
    id: "extraBlubbery",
    name: `Extra Blubbery`,
    description: `Whenever this character plays a card, they gain 10% block.`,
    equippable: true,
    on: {}
  },
  headEmpty: {
    id: "headEmpty",
    name: `Head Empty`,
    description: `If you don't play any cards from this character in a turn, they gain +100% block.`,
    equippable: true,
    on: {}
  },
  doingTheirBest: {
    id: "doingTheirBest",
    name: `Doing Their Best`,
    description: `If you play 3 cards owned by this character in one turn, remove all debuffs from this Kaiju.  They gain +50% block.`,
    equippable: true,
    on: {}
  },
  accidentProne: {
    id: "accidentProne",
    name: `AccidentProne`,
    description: `Whenever a card from this character with Brittle breaks, apply Bleed (1) to all enemies.`,
    equippable: true,
    on: {}
  },
  peppy: {
    id: "peppy",
    name: `Peppy`,
    description: `The first time per room this character plays 3 cards in 1 turn, gain 1 energy.`,
    equippable: true,
    on: {}
  },
  partyBouncer: {
    id: "partyBouncer",
    name: `Party Bouncer`,
    description: `Whenever this character plays a card with Redirect, they gain +15% block and Courageous (1).`,
    equippable: true,
    on: {}
  },
  townMilitiaMember: {
    id: "townMilitiaMember",
    name: `Town Militia Member`,
    description: `This character's Basic Attack deals an additional +25%.`,
    equippable: true,
    on: {}
  },
  barbarian: {
    id: "barbarian",
    name: `Barbarian`,
    description: `Increase this character's Strength by 8%. Increase the damage bonus Berserk gives this character by 10%`,
    equippable: true,
    on: {}
  },
  veteranPitFighter: {
    id: "veteranPitFighter",
    name: `Veternal Pit Fighter`,
    description: `The first attack card this character plays per room costs 1 less energy.`,
    equippable: true,
    on: {}
  },
  royalGuard: {
    id: "royalGuard",
    name: `Royal Guard`,
    description: `Increase the amount of block generated by Defense cards this character plays that target allies by 15%.`,
    equippable: true,
    on: {}
  },
  shieldProficiency: {
    id: "shieldProficiency",
    name: `Shield Proficiency`,
    description: `Increase the amount of block generated by Defense cards this character plays by 10%.`,
    equippable: true,
    on: {}
  },
  intimidating: {
    id: "intimidating",
    name: `Intimidating`,
    description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Tired (2).`,
    equippable: true,
    on: {}
  },
  terrifying: {
    id: "terrifying",
    name: `Terrifying`,
    description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Fatigue (1).`,
    equippable: true,
    on: {}
  },
  attritionFighter: {
    id: "attritionFighter",
    name: `Attrition Fighter`,
    description: `After your third turn, increase this character's Strength, Defense and Magic by 18% until the end of the room.`,
    equippable: true,
    on: {}
  },
  nobleGuardian: {
    id: "nobleGuardian",
    name: `Noble Guardian`,
    description: `This character gives all other characters +15% block during the first turn of every room.`,
    equippable: true,
    on: {}
  },
  conduitOfChaosMagic: {
    id: "conduitOfChaosMagic",
    name: `Conduit Of Chaos Magic`,
    description: `15% chance to gain +1 energy at the start of each turn.`,
    equippable: true,
    on: {}
  },
  privyToAnAncientandTerribleSecret: {
    id: "privyToAnAncientandTerribleSecret",
    name: `Privy To Ancient and Terrible Secret`,
    description: `Every time you draw a card, there is a 10% chance that cards cost will be reduced by 1 (triggers a maximum of once per room).  The Magic of this character is increased by 10%.  The Health of this character is decreased by 10%.  This character starts each room with Tired (1).`,
    equippable: true,
    on: {}
  },
  legendaryFireMage: {
    id: "legendaryFireMage",
    name: `Legendary Fire Mage`,
    description: `All Attack Cards this character plays have Fire Damage.`,
    equippable: true,
    on: {}
  },
  masterOracle: {
    id: "masterOracle",
    name: `Master Oracle`,
    description: `Draw an additional card at the start of each turn. (Unique)`,
    equippable: true,
    on: {}
  },
  aspiringSeer: {
    id: "aspiringSeer",
    name: `Aspiring Seer`,
    description: `Draw an additional card at the start of your first turn.  (Unique)`,
    equippable: true,
    on: {}
  },
  forgetfulGenius: {
    id: "forgetfulGenius",
    name: `Forgetful Genius`,
    description: `Every time you draw a card, 20% chance to draw an additional card.`,
    equippable: true,
    on: {}
  },
  starChartExpert: {
    id: "starChartExpert",
    name: `Star Chart Expert`,
    description: `Whenever an Attack, Defense, Utility, and Enchantment card are played in the same turn, deal 50% to all enemies.`,
    equippable: true,
    on: {}
  },
  tormentedByWhispers: {
    id: "tormentedByWhispers",
    name: `Tormented by Whispers`,
    description: `When a card with Momentary is played, deal 10% damage to a random enemy. `,
    equippable: true,
    on: {}
  },
  photographicMemory: {
    id: "photographicMemory",
    name: `Photographic Memory`,
    description: `Whenever a card with Momentary is played, it has a 20% chance to be added to the discard pile instead of being removed for the room. `,
    equippable: true,
    on: {}
  },
  dirtyDealer: {
    id: "dirtyDealer",
    name: `Dirty Dealer`,
    description: `Every time a character destroys an enemy, draw a card.`,
    equippable: true,
    on: {}
  },
  masterLooter: {
    id: "masterLooter",
    name: `Master Looter`,
    description: `After the first combat of a run, draft an additional card. (Unique)`,
    unique: true,
    equippable: true,
    on: {}
  },
  thrifty: {
    id: "thrifty",
    name: `Thrifty`,
    description: `The first time you discard a card per room, draw a card.`,
    equippable: true,
    on: {}
  },
  invigoratedbyBloodshed: {
    id: "invigoratedbyBloodshed",
    name: `Invigorated by Bloodshed`,
    description: `Whenever an enemy is destroyed, this character gains Courageous (1) and Guarded (1).`,
    equippable: true,
    on: {}
  },
  scrappyandVicious: {
    id: "scrappyandVicious",
    name: `Scrappy and Vicious`,
    description: `If you play 3 or more attack cards in a single turn, increase this character's strength by 33% until the end of the turn.`,
    equippable: true,
    on: {}
  },
  collectorOfContraband: {
    id: "collectorOfContraband",
    name: `Collector of Contraband`,
    description: `At the start of your second turn, decrease the cost of a random card in your hand to 0.`,
    equippable: true,
    on: {}
  },
  arterialArtisan: {
    id: "arterialArtisan",
    name: `Arterial Artisan`,
    description: `As long as this character is alive, enemies lose an addtional 5% max health from bleed stacks. (Unique)`,
    equippable: true,
    on: {}
  },
  oneWithTheShadows: {
    id: "oneWithTheShadows",
    name: `One with The Shadowd`,
    description: `Slightly decrease this character's Taunt at the start of each turn. (Decrease it by 3).`,
    equippable: true,
    on: {}
  }
};

// shared/tree/Sword.ts
var swordPartIds = [
  "dirt",
  "junk",
  "normal",
  "wood",
  "air",
  "earth",
  "fire",
  "iron",
  "jade",
  "love",
  "soap",
  "spooky",
  "water",
  "great",
  "lava"
];
var swordPartDefinitionsMap = {
  normal: {
    pommel: {
      magic: 1
    },
    handle: {
      defense: 1
    },
    guard: {
      defense: 1
    },
    blade: {
      strength: 1,
      defense: 1
    }
  },
  junk: {
    pommel: {
      constitution: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1,
      defense: 1
    }
  },
  dirt: {
    pommel: {
      constitution: 2
    },
    handle: {
      constitution: 2
    },
    guard: {
      constitution: 2
    },
    blade: {
      constitution: 3,
      defense: 1
    }
  },
  wood: {
    pommel: {
      strength: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1
    }
  },
  air: {
    pommel: {
      defense: 4,
      magic: 1,
      strength: 1
    },
    handle: {
      constitution: 6,
      defense: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      magic: 4,
      defense: 2,
      strength: 1
    }
  },
  earth: {
    pommel: {
      defenseMultiplicand: 0.04,
      constitutionMultiplicand: 0.05
    },
    handle: {
      defenseMultiplicand: 0.06,
      constitutionMultiplicand: 0.04
    },
    guard: {
      defenseMultiplicand: 0.04,
      constitutionMultiplicand: 0.05
    },
    blade: {
      defenseMultiplicand: 0.04,
      constitutionMultiplicand: 0.05
    }
  },
  fire: {
    pommel: {
      magicMultiplicand: 0.08,
      magic: 3,
      strengthMultiplicand: 0.08,
      strength: 3,
      critChanceAddend: 0.03
    },
    handle: {
      magicMultiplicand: 0.07,
      magic: 3,
      strengthMultiplicand: 0.08,
      strength: 3,
      critChanceAddend: 0.03
    },
    guard: {
      magicMultiplicand: 0.08,
      magic: 3,
      strengthMultiplicand: 0.08,
      strength: 3
    },
    blade: {
      magicMultiplicand: 0.04,
      magic: 3,
      critChanceAddend: 0.02
    }
  },
  iron: {
    pommel: {
      strength: 2
    },
    handle: {
      strength: 2
    },
    guard: {
      defense: 2
    },
    blade: {
      strengthMultiplicand: 0.02,
      strength: 2,
      defenseMultiplicand: 0.02,
      defense: 2
    }
  },
  jade: {
    pommel: {
      magicMultiplicand: 0.04,
      magic: 1
    },
    handle: {
      magic: 1
    },
    guard: {
      magicMultiplicand: 0.04,
      magic: 1
    },
    blade: {
      magicMultiplicand: 0.02
    }
  },
  love: {
    pommel: {
      constitutionMultiplicand: 0.03,
      magicMultiplicand: 0.02,
      strengthMultiplicand: 0.02
    },
    handle: {},
    guard: {
      constitutionMultiplicand: 0.05,
      constitution: 10
    },
    blade: {
      magicMultiplicand: 0.04
    }
  },
  soap: {
    pommel: {
      dodgeChanceAddend: 0.01,
      defenseMultiplicand: 0.02,
      defense: 1
    },
    handle: {
      dodgeChanceAddend: 0.01,
      defenseMultiplicand: 0.02,
      defense: 1
    },
    guard: {
      dodgeChanceAddend: 0.01,
      defenseMultiplicand: 0.02,
      defense: 1
    },
    blade: {
      dodgeChanceAddend: 0.02,
      defenseMultiplicand: 0.03,
      defense: 1
    }
  },
  spooky: {
    pommel: {
      strength: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1
    }
  },
  water: {
    pommel: {
      magic: 2,
      defense: 1
    },
    handle: {
      defense: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      magic: 2,
      strength: 2,
      defense: 2
    }
  },
  great: {
    pommel: {
      strength: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1
    }
  },
  lava: {
    pommel: {
      strength: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1
    }
  },
  oni: {
    pommel: {
      strength: 1
    },
    handle: {
      strength: 1
    },
    guard: {
      strength: 1
    },
    blade: {
      strength: 1
    }
  }
};

// shared/constants.ts
var BUILD_VER = "1.2.1.0";
var LEADERBOARD_ENTRIES_PER_PAGE = 5;
var LEADERBOARD_ENTRIES_TO_DISPLAY = 100;
var MAX_LEADERBOARD_PAGE = LEADERBOARD_ENTRIES_TO_DISPLAY / LEADERBOARD_ENTRIES_PER_PAGE;
var NUM_KAIJUS_IN_PARTY = 3;
var MAX_USERNAME_LENGTH = 20;
var MIN_USERNAME_LENGTH = 3;

// shared/index.ts
init_code();

// shared/auth/authActions.ts
var authenticatedActions = {
  activateOrb: true,
  activateSouvenir: true,
  addCardToDeck: true,
  changeDungeon: true,
  changeScene: true,
  chooseEventResponse: true,
  choosePlushy: true,
  chooseStance: true,
  collectLoot: true,
  discard: true,
  endRun: true,
  endTurn: true,
  exitDungeon: true,
  finishCard: true,
  getCurrentRun: true,
  getFreeCard: true,
  getFreeSouvenir: true,
  getLeaderboard: true,
  loadGameState: true,
  nextRoom: true,
  openEndOfRoom: true,
  openEndOfRun: true,
  placeSelectedCharacters: true,
  playCard: true,
  removeCardForFree: true,
  resetRandomSeed: true,
  rollKaiju: true,
  rulebookAction: true,
  setBattleScene: true,
  setInitialGameState: true,
  setRunId: true,
  prepareRun: true,
  startRun: true,
  setUsername: true
};
function isAuthenticatedAction(action) {
  return action in authenticatedActions;
}
__name(isAuthenticatedAction, "isAuthenticatedAction");

// game/gameState/battle/cards/cardManagement.ts
init_rulebook2();
init_util();
init_code();

// game/gameState/battle/cards/interpretCommand.ts
var angu = __toESM(require_dist());
var import_sbaobab2 = require("sbaobab");
init_code();

// game/gameState/battle/activateSouvenirs.ts
init_util();
var import_lodash8 = require("lodash");

// game/gameState/battle/characters/updateCharacters.ts
var import_lodash7 = require("lodash");

// game/gameState/battle/cards/commands/effect.ts
var import_lodash4 = require("lodash");
init_code();

// game/gameState/battle/cards/commands/util/getTargetUidsOverride.ts
function getTargetUidsOverride({
  targetTypeOverride,
  scene,
  command,
  givenUids
}) {
  if (targetTypeOverride == null) {
    return givenUids;
  }
  if (["allFriends", "allEnemies"].includes(targetTypeOverride)) {
    const ac = scene.get("allCharacters");
    const isPcSource = ac[command.characterUid].isPc;
    const shouldBePc = isPcSource === (targetTypeOverride === "allFriends");
    return Object.values(ac).filter((x2) => x2.isPc === shouldBePc).map((x2) => x2.uid);
  } else if (["self"].includes(targetTypeOverride)) {
    return [command.characterUid];
  } else {
    return givenUids;
  }
}
__name(getTargetUidsOverride, "getTargetUidsOverride");

// game/gameState/battle/cards/commands/util/index.ts
var import_simple_color_converter = __toESM(require_simple_color_converter());
function s(n) {
  return n > 1 ? "s" : "";
}
__name(s, "s");
function evalAll(angus) {
  return angus.map((angu2) => angu2.eval());
}
__name(evalAll, "evalAll");
function getOuterHtmlArr(html) {
  return html.split(">").length > 1 ? [html.split(">")[0] + ">", "</" + html.split("</")[1]] : ["", ""];
}
__name(getOuterHtmlArr, "getOuterHtmlArr");
var statsToColorsMap = {
  strength: "#d44c47",
  magic: "#9e6ec2",
  defense: "#337ea9",
  constitution: "#1cc8af"
};
function evalAllAsHtml(angus) {
  return angus.map((angu2) => {
    const statName = angu2.name();
    const rawValue = angu2.eval();
    const value = typeof rawValue === "number" ? Math.ceil(rawValue) : rawValue;
    return applyStatHtml(statName, value);
  });
}
__name(evalAllAsHtml, "evalAllAsHtml");
function applyStatHtml(statName, value) {
  let color = "";
  Object.keys(statsToColorsMap).map((stat) => {
    const statColor = statsToColorsMap[stat];
    if (statName.includes(stat)) {
      if (!color.length)
        color = statColor;
      else
        color = blend(color, statColor);
    }
  });
  return color ? `<span style="color: ${color}; font-weight: bold;">${value}</span>` : `${value}`;
}
__name(applyStatHtml, "applyStatHtml");
function blend(color1Hex, color2Hex) {
  const color1 = new import_simple_color_converter.default({
    hex6: color1Hex,
    to: "cmyk"
  }).color;
  const color2 = new import_simple_color_converter.default({
    hex6: color2Hex,
    to: "cmyk"
  }).color;
  const blendColor = new import_simple_color_converter.default({
    cmyk: {
      c: color1.c + color2.c / 2,
      m: color1.m + color2.m / 2,
      y: color1.y + color2.y / 2,
      k: color1.k + color2.k / 2
    },
    to: "hex6"
  });
  return `#${blendColor.color}`;
}
__name(blend, "blend");

// game/gameState/battle/cards/commands/util/getTargetText.ts
function getTargetText(targetType, cm) {
  return `${targetType == null ? "target Kaiju" : targetType === "allFriends" ? "every friendly Kaiju" : targetType === "allEnemies" ? "every enemy" : targetType === "enemies" ? "enemy target" : targetType === "friends" ? "target Kaiju" : targetType === "self" ? `${cm.displayName.split(" ")[0]}` : ""}`;
}
__name(getTargetText, "getTargetText");

// game/gameState/battle/cards/commands/effect.ts
var explain = /* @__PURE__ */ __name((dslArgs, context) => {
  const [id, increase, _2] = evalAllAsHtml(dslArgs);
  const [__, ___, targetTypeArg, double] = evalAll(dslArgs);
  const targetType = targetTypeArg ?? context.command.targetType;
  const effectName = (0, import_lodash4.startCase)(id).replace("Debuff", "").replace("Buff", "");
  const targetText = getTargetText(targetType, context.characterMeta);
  return double ? `Double the amount of Poison counters on ${targetText}.  If no poison counters, it receives <b>${effectName}</b>&nbsp;(${increase}).` : `${targetText} gains <b>${effectName}</b>&nbsp;(${increase})`;
}, "explain");
var execute = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [id, increase, targetTypeOverride, double] = evalAll(dslArgs);
  const targetUids = getTargetUidsOverride({
    targetTypeOverride,
    scene,
    command,
    givenUids
  });
  applyEffect(scene, targetUids, id, increase, double);
}, "execute");
function applyEffect(scene, targetUids, idPartial, increase, double) {
  let increaseInt = Math.round(increase);
  const id = effectIds.includes(idPartial) ? idPartial : effectIds[effectIds.map((id2) => id2.replace("Debuff", "").replace("Buff", "")).indexOf(idPartial)];
  if (!id) {
    logger.warn(`couldn't find effect from partial ${idPartial}`);
    return;
  }
  const ac = scene.select("allCharacters");
  for (const uid of targetUids) {
    ac.select(uid, "effects").apply((effects) => {
      const i = effects.findIndex((e) => e.id === id);
      let effect;
      let countType = procEffectIds.includes(id) ? "proc" : "turn";
      if (id.endsWith("Debuff")) {
        const h2 = effects.findIndex((e) => e.id === "hypochondriac");
        if (h2 !== -1 && effects[h2].counter > 0) {
          effect = {
            ...effects[h2],
            counter: effects[h2].counter - 1
          };
          return setAt(effects, h2, effect);
        }
      }
      if (i === -1) {
        effect = {
          id,
          counter: increaseInt,
          countType
        };
      } else {
        effect = {
          ...effects[i],
          counter: effects[i].counter > 0 && double ? effects[i].counter * 2 : effects[i].counter + increaseInt
        };
      }
      if (i === -1)
        return [...effects, effect];
      return setAt(effects, i, effect);
    });
  }
}
__name(applyEffect, "applyEffect");

// game/gameState/battle/characters/activateClassAbility.ts
var import_immer = __toESM(require("immer"));
var import_lodash5 = require("lodash");
init_code();

// game/gameState/battle/cards/commands/draw.ts
var explain2 = /* @__PURE__ */ __name((dslArgs) => {
  const [numCards] = evalAllAsHtml(dslArgs);
  return `Draw ${numCards}`;
}, "explain");
var execute2 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [numCards] = evalAll(dslArgs);
  drawCards(scene, numCards);
}, "execute");
function draw(scene, numCards) {
  drawCards(scene, numCards);
}
__name(draw, "draw");

// game/gameState/battle/characters/activateClassAbility.ts
function updateWizardAbility(scene) {
  const wizardsInParty = vals(scene.get("allCharacters")).filter(
    (c) => c.class === "wizard"
  );
  const numWizardsInParty = wizardsInParty.length;
  if (!numWizardsInParty)
    return;
  const numPlayersOfCardsThisTurn = (0, import_lodash5.uniq)(
    scene.get("cardsPlayedThisTurn").map((card) => card.characterUid)
  ).length;
  if (numPlayersOfCardsThisTurn !== (wizardsInParty[0].effects.find((e) => e.id === "arcaneFriendship")?.counter ?? -1)) {
    scene.apply(
      "allCharacters",
      (0, import_immer.default)((allCharacters) => {
        const effect = {
          id: "arcaneFriendship",
          counter: numPlayersOfCardsThisTurn
        };
        wizardsInParty.forEach((wiz) => {
          const eIndex = allCharacters[wiz.uid].effects.findIndex(
            (e) => e.id === "arcaneFriendship"
          );
          if (~eIndex)
            allCharacters[wiz.uid].effects[eIndex] = effect;
          else
            allCharacters[wiz.uid].effects.unshift(effect);
        });
      })
    );
    if (numPlayersOfCardsThisTurn === 3)
      activateWizardAbility(scene, numWizardsInParty);
  }
}
__name(updateWizardAbility, "updateWizardAbility");
function activateWizardAbility(scene, numWizardsInParty) {
  scene.apply("energy", (e) => e + 1);
  draw(scene, numWizardsInParty);
}
__name(activateWizardAbility, "activateWizardAbility");
function maybeIncrementKnightAbility(scene, command, targetUids) {
  const character = scene.select("allCharacters", command.characterUid);
  if ((0, import_lodash5.without)(targetUids, command.characterUid).length && character.get("isPc") && character.get("class") === "knight") {
    applyEffect(scene, [command.characterUid], "valiant", 1);
  }
}
__name(maybeIncrementKnightAbility, "maybeIncrementKnightAbility");
var NUM_VALIANT_STACKS_AT_RESET = 2;
function maybeResetKnightAbilityCounter(scene, cm) {
  const shouldClear = cm?.class === "knight" && (cm.effects.find((e) => e.id === "valiant")?.counter ?? 0) >= NUM_VALIANT_STACKS_AT_RESET;
  if (shouldClear)
    resetKnightAbilityCounter(scene, cm);
  return shouldClear;
}
__name(maybeResetKnightAbilityCounter, "maybeResetKnightAbilityCounter");
function resetKnightAbilityCounter(scene, cm) {
  ;
  (cm ? [cm] : vals(scene.get("allCharacters")).filter((cm2) => cm2.class === "knight")).forEach((cm2) => {
    scene.select("allCharacters", cm2.uid).apply(
      "effects",
      (0, import_immer.default)((effects) => {
        const index = effects.findIndex((e) => e.id === "valiant");
        if (~index)
          effects[index] = { id: "valiant", counter: 0 };
      })
    );
  });
}
__name(resetKnightAbilityCounter, "resetKnightAbilityCounter");
function maybeActivateRogueAbility(scene, attacker) {
  if (attacker?.class === "rogue")
    scene.apply("energy", (e) => e + 1);
}
__name(maybeActivateRogueAbility, "maybeActivateRogueAbility");

// game/gameState/battle/commandHookUtil.ts
var import_immer2 = __toESM(require("immer"));
init_code();
function triggerOnHook(scene, id, commandOwnerUid) {
  scene.set(
    "on",
    (0, import_immer2.default)(scene.get("on") ?? {}, (on) => {
      const remainingCommands = (on[id] ?? []).map((commandDetail) => {
        const { command, targetUids } = commandDetail;
        if (!commandOwnerUid || command.characterUid === commandOwnerUid)
          interpretCommand({ command, targetUids, scene }, false);
        return commandDetail.turnsAway ? commandDetail : null;
      }).filter((cd) => cd != null);
      if (remainingCommands.length > 0)
        on[id] = remainingCommands;
      else
        delete on[id];
    })
  );
}
__name(triggerOnHook, "triggerOnHook");
function clearCommandHooksForTurn(scene) {
  scene.apply(
    "on",
    (0, import_immer2.default)(
      (on) => vals(on).forEach(
        (queue) => queue = queue?.filter(
          (commandDetail) => commandDetail.turnsAway !== 1
        )
      )
    )
  );
}
__name(clearCommandHooksForTurn, "clearCommandHooksForTurn");
function clearCommandHooks(scene) {
  scene.set("on", {});
}
__name(clearCommandHooks, "clearCommandHooks");

// game/gameState/battle/score/checkServerScoringEvent.ts
init_code();

// game/gameState/battle/characters/trackStanceChanges.ts
init_code();
function trackStanceChanges(scene) {
  const allChars = scene.get("allCharacters");
  const newChars = { ...allChars };
  keys(newChars).forEach((uid) => {
    if (!allChars[uid].isPc)
      return;
    const stanceInPrevTurn = newChars[uid].stanceInPrevTurn;
    const newStance = newChars[uid].stance;
    if (newStance !== stanceInPrevTurn) {
      scene.apply("stanceChangesThisRoom", (changes) => {
        return [...changes, { newStance, targetUid: uid }];
      });
    }
    newChars[uid] = {
      ...newChars[uid],
      stanceInPrevTurn: newStance
    };
  });
  scene.set("allCharacters", newChars);
  return newChars;
}
__name(trackStanceChanges, "trackStanceChanges");

// game/gameState/battle/score/updateScore.ts
init_util();
var updateScore = /* @__PURE__ */ __name(({
  scene,
  event,
  count,
  notify,
  data,
  increment
}) => {
  const eventMeta = RUN_SCORE_EVENT_META[event];
  const attributeNameInTree = eventMeta.attributeName;
  if (increment === void 0)
    increment = eventMeta.increment;
  const attributeCount = scene.select("runScore").select("attributes").select(attributeNameInTree);
  const currCount = attributeCount.get();
  const newCount = increment ? currCount + count : count;
  attributeCount.set(newCount);
  const scoreEventsThisRoom = scene.select("scoreEventsThisRoom").select(attributeNameInTree);
  scoreEventsThisRoom.set(scoreEventsThisRoom.get() + 1);
  const scoreEventsThisTurn = scene.select("scoreEventsThisTurn").select(attributeNameInTree);
  scoreEventsThisTurn.set(scoreEventsThisTurn.get() + 1);
  if (notify) {
    const eventData = {
      event,
      count,
      data
    };
    emit({
      userId: scene.get("userId"),
      event: {
        type: "notifyScore",
        data: eventData
      }
    });
  }
  calculateNewRunScore(scene);
  calculateChestProgress(scene);
}, "updateScore");

// game/gameState/battle/score/checkServerScoringEvent.ts
var roundWinPointMap = {
  1: 4,
  2: 3,
  3: 2,
  4: 2,
  5: 1
};
var checkServerScoringEvent = /* @__PURE__ */ __name((event, scene, data) => {
  if (data === void 0)
    data = {};
  switch (event) {
    case "ROOM_CLEARED":
      updateScore({
        scene,
        event: "ROOM_CLEARED",
        count: 1,
        notify: true
      });
      checkRoomClearSpeed(scene);
      checkRoomDifficulty(scene);
      checkCharsInFullHealth(scene);
      checkBossRoomCleared(scene);
      checkNoEnergyUsed(scene);
      break;
    case "HIGHEST_DAMAGE":
      checkHighestDamageHit(scene, data);
      break;
    case "RUN_COMPLETED":
      checkSurvivingKaiju(scene);
      checkSouvenirs(scene);
      checkBalancedTeam(scene);
      checkSpecialBoy(scene);
      break;
    case "RUN_DEFEATED":
      checkSouvenirs(scene);
      checkBalancedTeam(scene);
      checkSpecialBoy(scene);
      break;
    case "BLOCK_OVER_THRESHOLD":
      checkBlocksAppliedInTurn(scene);
      break;
    case "HIT_VULGAR_THRESHOLD":
      checkDamageDealtInTurn(scene);
      break;
    case "CARDS_OVER_THRESHOLD":
      checkCardsOverThreshold(scene);
      break;
    case "CARDS_WHOLE_PARTY":
      checkCardsWholeParty(scene);
      break;
    case "CARDS_DRAFT_BALANCED":
      checkCardsDraftBalanced(scene);
      break;
    case "ROOM_TAKE_100_DAMAGE":
      checkRoomTake100Damage(scene);
      break;
    case "PERFECT_BLOCK":
      checkPerfectBlock(scene);
      break;
  }
}, "checkServerScoringEvent");
var checkSouvenirs = /* @__PURE__ */ __name((scene) => {
  const numSouvenirs = scene.get("souvenirs").length;
  updateScore({
    scene,
    event: "NUM_SOUVENIRS",
    count: numSouvenirs
  });
}, "checkSouvenirs");
var checkBalancedTeam = /* @__PURE__ */ __name((scene) => {
  const team = new Set(
    Object.entries(scene.get("allCharacters")).filter(([key, char]) => char.isPc).map(([key, char]) => char.id)
  );
  if (team.size === 3) {
    updateScore({
      scene,
      event: "BALANCED_TEAM",
      count: 1
    });
  }
}, "checkBalancedTeam");
var checkSpecialBoy = /* @__PURE__ */ __name((scene) => {
  const allCards = scene.get("cards");
  const startDeck = Object.values(makeCards(scene).draw).filter((card) => card.id).map((card) => card.id);
  let countStartDeck = {};
  startDeck.forEach(
    (cardId) => countStartDeck[cardId] = (countStartDeck[cardId] || 0) + 1
  );
  const fullDeck = Object.values({
    ...allCards.discard,
    ...allCards.draw,
    ...allCards.hand,
    ...allCards.removedRoom,
    ...allCards.removedRun
  }).map((card) => card.id);
  let countFullDeck = {};
  fullDeck.forEach((cardId) => {
    let start = countFullDeck[cardId] !== void 0 ? countFullDeck[cardId] : countStartDeck[cardId] !== void 0 ? -countStartDeck[cardId] : 0;
    countFullDeck[cardId] = start + 1;
  });
  let foundBadDuplicate = false;
  for (let [cardId, count] of Object.entries(countFullDeck)) {
    if (count > 1) {
      foundBadDuplicate = true;
      break;
    }
  }
  if (foundBadDuplicate === false) {
    updateScore({
      scene,
      event: "SPECIAL_BOY",
      count: 1
    });
  }
}, "checkSpecialBoy");
var checkRoomClearSpeed = /* @__PURE__ */ __name((scene) => {
  const turnCount = scene.get("turnCount");
  if (!(turnCount in roundWinPointMap))
    return;
  updateScore({
    scene,
    event: "ROOM_CLEAR_SPEED",
    count: roundWinPointMap[turnCount],
    notify: true
  });
}, "checkRoomClearSpeed");
var checkRoomDifficulty = /* @__PURE__ */ __name((scene) => {
  const roomCategory = scene.get("currentRoom", "category");
  let points;
  if (roomCategory === "tierThree") {
    points = 2;
  } else if (roomCategory === "tierFour") {
    points = 3;
  } else {
    return;
  }
  updateScore({
    scene,
    event: "ROOM_CLEAR_DIFFICULTY",
    count: points
  });
}, "checkRoomDifficulty");
var checkCharsInFullHealth = /* @__PURE__ */ __name((scene) => {
  const userCharsInFullHealth = vals(scene.get("allCharacters")).filter(
    (meta) => meta.isPc && meta.constitution === meta.health
  );
  const partyInFullHealth = userCharsInFullHealth.length === NUM_KAIJUS_IN_PARTY;
  const roomHadBoss = roomContainsBoss(scene);
  if (partyInFullHealth) {
    const roomTypeEvent = roomHadBoss ? "EXIT_BOSS_FULL_HEALTH" : "EXIT_ROOM_FULL_HEALTH";
    updateScore({ scene, event: roomTypeEvent, count: 1, notify: true });
  }
  if (roomHadBoss) {
    checkHealthLostInBossRoom(scene);
  } else {
    checkHealthLostInRoom(scene);
  }
}, "checkCharsInFullHealth");
var checkBossRoomCleared = /* @__PURE__ */ __name((scene) => {
  if (roomContainsBoss(scene)) {
    updateScore({ scene, event: "BOSS_KILLED", count: 1, notify: true });
  }
}, "checkBossRoomCleared");
var checkHealthLostInBossRoom = /* @__PURE__ */ __name((scene) => {
  const totalHealthLost = getTotalHealthLost(scene);
  if (totalHealthLost < 15) {
    updateScore({
      scene,
      event: "EXIT_BOSS_LOW_DAMAGE",
      count: 1,
      notify: true
    });
  }
}, "checkHealthLostInBossRoom");
var checkHealthLostInRoom = /* @__PURE__ */ __name((scene) => {
  const totalHealthLost = getTotalHealthLost(scene);
  if (totalHealthLost === 0) {
    updateScore({
      scene,
      event: "ROOM_WIN_ZERO_DAMAGE",
      count: 1,
      notify: true
    });
  } else if (totalHealthLost <= 5) {
    updateScore({
      scene,
      event: "ROOM_WIN_FIVE_DAMAGE",
      count: 1,
      notify: true
    });
  }
}, "checkHealthLostInRoom");
var checkRoomTake100Damage = /* @__PURE__ */ __name((scene) => {
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "roomsTake100Damage"
  );
  if (roomScoreEventCount >= 1)
    return;
  const totalHealthLost = getTotalHealthLost(scene);
  if (totalHealthLost >= 100) {
    updateScore({
      scene,
      event: "ROOM_TAKE_100_DAMAGE",
      count: 1,
      notify: true
    });
  }
}, "checkRoomTake100Damage");
var roomContainsBoss = /* @__PURE__ */ __name((scene) => {
  const currentRoom = scene.get("currentRoom");
  const boss = currentRoom.enemies.filter((enemyChar) => enemyChar.boss);
  return boss.length > 0;
}, "roomContainsBoss");
var checkNoEnergyUsed = /* @__PURE__ */ __name((scene) => {
  const noEnergyUsed = scene.get("energy") === scene.get("roundEnergy");
  if (noEnergyUsed) {
    updateScore({
      scene,
      event: "ROOM_WIN_NO_ENERGY_USED",
      count: 1,
      notify: true
    });
  }
}, "checkNoEnergyUsed");
var getTotalHealthLost = /* @__PURE__ */ __name((scene) => {
  return scene.get("damagesUnblockedThisRoom").reduce((prev, curr) => {
    if (curr.targetUid.includes("pc")) {
      return curr.amount + prev;
    }
    return prev + 0;
  }, 0);
}, "getTotalHealthLost");
var checkHighestDamageHit = /* @__PURE__ */ __name((scene, data) => {
  const { damage, attackerUid, attacker } = data;
  const userIsAttacker = (attackerUid && scene.get("allCharacters", attackerUid).isPc || attacker && attacker.isPc) ?? false;
  if (userIsAttacker) {
    const prevHighest = scene.get("runScore").attributes.highestDamageHit;
    if (damage > prevHighest) {
      updateScore({
        scene,
        event: "HIGHEST_DAMAGE",
        count: parseInt(damage.toFixed(0))
      });
    }
  }
}, "checkHighestDamageHit");
var checkSurvivingKaiju = /* @__PURE__ */ __name((scene) => {
  const survivingKaiju = vals(scene.get("allCharacters")).filter(
    (char) => char.isPc && char.health > 0
  );
  updateScore({
    scene,
    event: "SURVIVING_KAIJU",
    count: survivingKaiju.length
  });
  const healthRemaining = Math.round(
    survivingKaiju.reduce((prev, curr) => {
      return prev + curr.health / curr.constitution * 30;
    }, 0)
  );
  updateScore({
    scene,
    event: "FINAL_USER_HEALTH_REMAINING",
    count: healthRemaining
  });
}, "checkSurvivingKaiju");
var checkBlocksAppliedInTurn = /* @__PURE__ */ __name((scene) => {
  const BLOCK_THRESHOLD = 40;
  const turnScoreEventCount = scene.get(
    "scoreEventsThisTurn",
    "blocksOverThreshold"
  );
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "blocksOverThreshold"
  );
  if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3)
    return;
  const totalBlockApplied = scene.get("blocksAppliedThisTurn").reduce((prev, curr) => {
    if (curr.targetUid.includes("pc")) {
      return prev + curr.amount;
    }
    return prev + 0;
  }, 0);
  if (totalBlockApplied > BLOCK_THRESHOLD) {
    updateScore({
      scene,
      event: "BLOCK_OVER_THRESHOLD",
      count: 1
    });
  }
}, "checkBlocksAppliedInTurn");
var checkDamageDealtInTurn = /* @__PURE__ */ __name((scene) => {
  const VULGAR_DAMAGE_THRESHOLD = 20;
  const turnScoreEventCount = scene.get(
    "scoreEventsThisTurn",
    "hitsOverVulgarThreshold"
  );
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "hitsOverVulgarThreshold"
  );
  if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3)
    return;
  const totalDamageApplied = scene.get("damagesDealtThisTurn").reduce((prev, curr) => {
    if (curr.targetUid.includes("pc")) {
      return prev + 0;
    }
    return prev + curr.amount;
  }, 0);
  if (totalDamageApplied > VULGAR_DAMAGE_THRESHOLD) {
    updateScore({
      scene,
      event: "HIT_VULGAR_THRESHOLD",
      count: 1
    });
  }
}, "checkDamageDealtInTurn");
var checkCardsOverThreshold = /* @__PURE__ */ __name((scene) => {
  const CARDS_PLAYED_THRESHOLD = 5;
  const turnScoreEventCount = scene.get(
    "scoreEventsThisTurn",
    "cardsPlayedOverThreshold"
  );
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "cardsPlayedOverThreshold"
  );
  if (turnScoreEventCount >= 1 || roomScoreEventCount >= 3)
    return;
  const cardsPlayed = scene.get("cardsPlayedThisTurn");
  if (cardsPlayed.length === CARDS_PLAYED_THRESHOLD) {
    updateScore({
      scene,
      event: "CARDS_OVER_THRESHOLD",
      count: 1
    });
  }
}, "checkCardsOverThreshold");
var checkCardsWholeParty = /* @__PURE__ */ __name((scene) => {
  const CARDS_PLAYED_THRESHOLD = 5;
  const turnScoreEventCount = scene.get(
    "scoreEventsThisTurn",
    "cardsWholeParty"
  );
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "cardsWholeParty"
  );
  if (turnScoreEventCount >= 1 || roomScoreEventCount >= 1)
    return;
  const cardsPlayed = scene.get("cardsPlayedThisTurn");
  const charsPlayedSet = new Set(cardsPlayed.map((card) => card.characterUid));
  if (charsPlayedSet.size === 3) {
    updateScore({
      scene,
      event: "CARDS_WHOLE_PARTY",
      count: 1
    });
  }
}, "checkCardsWholeParty");
var checkCardsDraftBalanced = /* @__PURE__ */ __name((scene) => {
  const cardsDrafted = scene.get("cardsDrafted");
  if (cardsDrafted.length < 3)
    return;
  const lastDraftTypes = cardsDrafted.slice(cardsDrafted.length - 3).map((card) => card.type);
  if (!lastDraftTypes.slice(0, 2).includes(lastDraftTypes[2])) {
    updateScore({
      scene,
      event: "CARDS_DRAFT_BALANCED",
      count: 1
    });
  }
}, "checkCardsDraftBalanced");
var checkPerfectBlock = /* @__PURE__ */ __name((scene) => {
  const roomScoreEventCount = scene.get(
    "scoreEventsThisRoom",
    "perfectBlocks"
  );
  if (roomScoreEventCount >= 3)
    return;
  updateScore({
    scene,
    event: "PERFECT_BLOCK",
    count: 1,
    notify: true
  });
}, "checkPerfectBlock");

// game/gameState/battle/util/removeDeadCharacterCards.ts
var import_immer3 = __toESM(require("immer"));
init_code();
function removeDeadCharacterCards(scene) {
  scene.apply(
    "cards",
    (0, import_immer3.default)((cards) => {
      getDeadPcs(scene.get()).forEach(({ uid }) => {
        keys(cards).forEach((pileId) => {
          vals(cards[pileId]).forEach((card) => {
            if (card.characterUid === uid) {
              cards.removedDead[card.uid] = card;
            }
            delete cards[pileId][card.uid];
          });
        });
      });
    })
  );
}
__name(removeDeadCharacterCards, "removeDeadCharacterCards");
function restoreDeadCharacterCards(scene, characterUid) {
  scene.apply(
    "cards",
    (0, import_immer3.default)((cards) => {
      vals(cards.removedDead).forEach((card) => {
        if (card.characterUid === characterUid) {
          cards.draw[card.uid] = card;
        }
      });
    })
  );
}
__name(restoreDeadCharacterCards, "restoreDeadCharacterCards");

// game/gameState/battle/util/clearDead.ts
function clearDead(scene) {
  removeDeadCharacterCards(scene);
  clearDeadCommands(scene);
}
__name(clearDead, "clearDead");
function clearDeadCommands(scene) {
  const livingNpcUids = getLivingNpcs(scene.get()).map((npc) => npc.uid);
  if (scene.get("nextNpcCommands").length !== livingNpcUids.length) {
    scene.apply(
      "nextNpcCommands",
      (nextCommands) => nextCommands.filter(
        (cmd) => livingNpcUids.includes(cmd.command.characterUid)
      )
    );
  }
}
__name(clearDeadCommands, "clearDeadCommands");

// game/gameState/battle/util/applyDamage.ts
function applyDamage(args) {
  let {
    damage,
    targetUid,
    scene,
    attackerUid,
    attacker,
    piercing,
    cardId,
    damageType
  } = args;
  const target = scene.get("allCharacters", targetUid);
  let attackerMeta = null;
  if (attacker)
    attackerMeta = attacker;
  else if (attackerUid)
    attackerMeta = scene.get("allCharacters", attackerUid);
  let critChance = 0.05;
  if (attackerMeta)
    critChance = calculateStats(attackerMeta).critChance ?? critChance;
  if (target && attackerMeta) {
    critChance = activateTalentsData({
      scene,
      key: "critChance",
      cm: attackerMeta,
      data: critChance,
      extra: { target, attacker: attackerMeta, cardId }
    });
    critChance = activateTalentsData({
      scene,
      key: "critChanceGeneral",
      data: critChance,
      extra: { target, attacker: attackerMeta, cardId }
    });
  }
  let isCritical = attackerMeta && attackerMeta.isPc ? maybeResetKnightAbilityCounter(scene, attackerMeta) || !scene.get("isSimulation") && Math.random() < critChance : false;
  piercing = activateTalentsData({
    scene,
    key: "piercingCheck",
    cm: attacker,
    data: piercing,
    extra: { target, attacker, isCritical }
  });
  const calcedDamage = args.ignoreModifiers ? damage : getDamage({
    attacker: attackerMeta,
    target: scene.get("allCharacters", targetUid),
    damage,
    isCritical,
    scene,
    cardId
  });
  if (attackerUid?.includes("pc")) {
    checkServerScoringEvent("HIGHEST_DAMAGE", scene, {
      ...args,
      damage: calcedDamage
    });
  }
  attackerMeta && manageSideEffectsOfCalcedDamage({
    scene,
    targetUid,
    attackerUid: attackerMeta.uid,
    calcedDamage
  });
  if (wouldDamageKillTarget({
    scene,
    targetUid,
    calcedDamage,
    piercing
  }) && activateSouvenirs("lethalDamageInterrupt", scene, targetUid))
    return 0;
  const unblockedDamage = applyCalcedDamage({
    scene,
    targetUid,
    calcedDamage,
    piercing
  });
  if (unblockedDamage > 0) {
    if (attackerMeta?.uid)
      manageMutuallyAssuredDestruction(
        unblockedDamage,
        targetUid,
        attackerMeta?.uid,
        scene
      );
    activateSouvenirs("takeDamage", scene, targetUid);
    activateSouvenirs("dealDamage", scene, attackerUid);
  }
  if (!attackerUid?.includes("pc")) {
    if (calcedDamage > 0 && unblockedDamage === 0) {
      checkServerScoringEvent("PERFECT_BLOCK", scene);
    }
  }
  manageSideEffectsOfUnblockedDamage({
    scene,
    targetUid,
    attacker,
    unblockedDamage
  });
  if (unblockedDamage === Number.NEGATIVE_INFINITY)
    throw new Error("unblocked damage wasn't calculated");
  if (target.isPc && target.health <= 0) {
    activateTalents({
      scene,
      key: "postDie",
      cm: target,
      notLiving: true,
      extra: { target }
    });
  }
  if (!target.isPc && target.health <= 0) {
    activateTalents({
      scene,
      key: "postKill",
      cm: attacker,
      extra: { target }
    });
    activateTalents({
      scene,
      key: "postKillGeneral",
      extra: { target }
    });
  }
  return unblockedDamage;
}
__name(applyDamage, "applyDamage");
function applyCalcedDamage({
  scene,
  targetUid,
  calcedDamage,
  piercing = false
}) {
  let unblockedDamage = Number.NEGATIVE_INFINITY;
  scene.select("allCharacters").apply(targetUid, (c) => {
    let health = c.health;
    let block = piercing ? 0 : c.block;
    unblockedDamage = calcedDamage - block;
    if (unblockedDamage > 0) {
      block = 0;
      health -= unblockedDamage;
    } else {
      block -= calcedDamage;
    }
    return { ...c, health, block: piercing ? c.block : block };
  });
  return unblockedDamage;
}
__name(applyCalcedDamage, "applyCalcedDamage");
function wouldDamageKillTarget({
  scene,
  targetUid,
  calcedDamage,
  piercing = false
}) {
  let unblockedDamage = Number.NEGATIVE_INFINITY;
  const c = scene.get("allCharacters", targetUid);
  let health = c.health;
  let block = piercing ? 0 : c.block;
  unblockedDamage = calcedDamage - block;
  if (unblockedDamage > 0) {
    block = 0;
    health -= unblockedDamage;
  } else {
    block -= calcedDamage;
  }
  return health <= 0;
}
__name(wouldDamageKillTarget, "wouldDamageKillTarget");
function manageSideEffectsOfCalcedDamage({
  scene,
  targetUid,
  attackerUid,
  calcedDamage
}) {
  recordDamage(scene, calcedDamage, targetUid, "raw");
  manageReflect(calcedDamage, targetUid, attackerUid, scene);
  triggerCounterAttack(targetUid, attackerUid, scene);
  triggerOnHook(scene, "damageTaken", targetUid);
}
__name(manageSideEffectsOfCalcedDamage, "manageSideEffectsOfCalcedDamage");
function manageReflect(calcedDamage, targetUid, attackerUid, scene) {
  const reflectBuff = scene.get("allCharacters", targetUid, "effects").find((e) => e.id === "reflectBuff");
  if (!reflectBuff)
    return;
  const reflectedDamage = Math.min(reflectBuff.counter, calcedDamage);
  applyCalcedDamage({
    scene,
    targetUid: attackerUid,
    calcedDamage: getDamage({
      scene,
      attacker: scene.get("allCharacters", attackerUid),
      target: scene.get("allCharacters", targetUid),
      damage: reflectedDamage
    })
  });
}
__name(manageReflect, "manageReflect");
function triggerCounterAttack(targetUid, attackerUid, scene) {
  const hasCounterAttack = scene.get("allCharacters", targetUid, "effects").find((e) => e.id === "counterAttackBuff");
  if (!hasCounterAttack)
    return;
  applyCalcedDamage({
    scene,
    targetUid: attackerUid,
    calcedDamage: getDamage({
      scene,
      attacker: scene.get("allCharacters", attackerUid),
      target: scene.get("allCharacters", targetUid),
      damage: Math.ceil(
        scene.get("allCharacters", targetUid, "strength") * 0.75
      )
    })
  });
}
__name(triggerCounterAttack, "triggerCounterAttack");
function manageMutuallyAssuredDestruction(unblockedDamage, targetUid, attackerUid, scene) {
  const count = scene.get("allCharacters", targetUid, "effects").find((e) => e.id === "mutuallyAssuredDestructionBuff")?.counter;
  if (!count)
    return;
  applyCalcedDamage({
    scene,
    targetUid: attackerUid,
    calcedDamage: getDamage({
      scene,
      attacker: scene.get("allCharacters", attackerUid),
      target: scene.get("allCharacters", targetUid),
      damage: unblockedDamage * 2
    })
  });
}
__name(manageMutuallyAssuredDestruction, "manageMutuallyAssuredDestruction");
function manageSideEffectsOfUnblockedDamage({
  scene,
  targetUid,
  unblockedDamage,
  attacker
}) {
  recordDamage(scene, unblockedDamage, targetUid, "unblocked");
  checkServerScoringEvent("ROOM_TAKE_100_DAMAGE", scene);
  if (didTargetDie(scene, targetUid)) {
    clearDead(scene);
    applyKillScores(scene, targetUid);
    maybeActivateRogueAbility(scene, attacker);
  }
  maybeApplyDamageThresholdDebuffs(scene, targetUid, unblockedDamage);
}
__name(manageSideEffectsOfUnblockedDamage, "manageSideEffectsOfUnblockedDamage");
function applyKillScores(scene, targetUid) {
  const character = scene.select("allCharacters").get(targetUid);
  if (character.isPc === true)
    return;
  const enemy = character;
  const remainingHealth = enemy.health;
  if (remainingHealth > 0)
    return;
  const enemyLevel = Number(enemy.level);
  if (enemyLevel) {
    updateScore({
      scene,
      event: "ENEMY_KILLED",
      count: enemyLevel,
      notify: true,
      data: enemy
    });
  }
  if (remainingHealth === 0) {
    updateScore({
      scene,
      event: "PERFECT_KILL",
      count: 1,
      notify: true
    });
  } else if (remainingHealth <= -20) {
    updateScore({
      scene,
      event: "OVERKILL",
      count: 1,
      notify: true
    });
  }
}
__name(applyKillScores, "applyKillScores");
function didTargetDie(scene, targetUid) {
  return scene.select("allCharacters").get(targetUid).health <= 0;
}
__name(didTargetDie, "didTargetDie");
function getDamage({
  scene,
  attacker,
  target,
  damage,
  damageType,
  isCritical,
  cardId
}) {
  let damageDealMultiplicand = attacker ? calculateStats(attacker).damageDealMultiplicand : 1;
  let damageDealAddend = attacker ? calculateStats(attacker).damageDealAddend : 0;
  let damageTakeMultiplicand = target ? calculateStats(target).damageTakeMultiplicand : 1;
  let damageTakeAddend = target ? calculateStats(target).damageTakeAddend : 0;
  if (attacker) {
    damageDealAddend = activateTalentsData({
      scene,
      key: "damageGiveAdd",
      data: damageDealAddend,
      cm: attacker,
      extra: { target, attacker, cardId, damageType }
    });
    damageDealMultiplicand = activateTalentsData({
      scene,
      key: "damageGiveMultiply",
      data: damageDealMultiplicand,
      cm: attacker,
      extra: { target, attacker, cardId, damageType }
    });
  }
  if (target) {
    damageTakeAddend = activateTalentsData({
      scene,
      key: "damageReceiveAdd",
      data: damageTakeAddend,
      cm: target,
      extra: { target, attacker, cardId, damageType }
    });
    damageTakeMultiplicand = activateTalentsData({
      scene,
      key: "damageReceiveMultiply",
      data: damageTakeMultiplicand,
      cm: target,
      extra: { target, attacker, cardId, damageType }
    });
  }
  damageTakeMultiplicand = activateTalentsData({
    scene,
    key: "damageReceive",
    data: damageTakeMultiplicand,
    cm: target || void 0,
    extra: { target, attacker, cardId, damageType }
  });
  const multiplicand = damageDealMultiplicand * damageTakeMultiplicand;
  let calcedDamage = Math.ceil(
    damage * multiplicand + damageTakeAddend + damageDealAddend
  );
  if (isCritical) {
    let critMultiply = 1.5;
    if (attacker)
      critMultiply = activateTalentsData({
        scene,
        key: "critDamageMultiply",
        data: critMultiply,
        cm: attacker,
        extra: { target }
      });
    calcedDamage = Math.ceil(calcedDamage * critMultiply);
  }
  return damage > 0 ? Math.max(calcedDamage, 1) : calcedDamage;
}
__name(getDamage, "getDamage");
function maybeApplyDamageThresholdDebuffs(scene, targetUid, calcedDamage) {
  const target = scene.get("allCharacters", targetUid);
  const characterIdToThresholdEffectsMap = {
    gnomeBigBomber: [
      {
        health: 0.6,
        effects: [
          {
            id: "debilitatedDebuff",
            counter: 2
          }
        ]
      },
      {
        health: 0.4,
        effects: [
          {
            id: "stunnedDebuff",
            counter: 1
          }
        ]
      }
    ]
  };
  if (characterIdToThresholdEffectsMap[target.id] != null) {
    const thresholdEffects = characterIdToThresholdEffectsMap[target.id];
    const character = scene.get("allCharacters", targetUid);
    thresholdEffects?.forEach((thresholdEffect) => {
      if (thresholdEffect.health > character.health / character.constitution && thresholdEffect.health <= (character.health + calcedDamage) / character.constitution) {
        thresholdEffect.effects.map(
          (effect) => applyEffect(scene, [targetUid], effect.id, effect.counter)
        );
      }
    });
    updateNpcMoves(scene);
  }
}
__name(maybeApplyDamageThresholdDebuffs, "maybeApplyDamageThresholdDebuffs");
function recordDamage(scene, amount, targetUid, type) {
  if (amount <= 0)
    return;
  if (type === "unblocked") {
    scene.apply("damagesUnblockedThisTurn", (damages) => [
      ...damages,
      { amount, targetUid }
    ]);
    scene.apply("damagesUnblockedThisRoom", (damages) => [
      ...damages,
      { amount, targetUid }
    ]);
  } else {
    scene.apply("damagesDealtThisTurn", (damages) => [
      ...damages,
      { amount, targetUid }
    ]);
    scene.apply("damagesDealtThisRoom", (damages) => [
      ...damages,
      { amount, targetUid }
    ]);
  }
}
__name(recordDamage, "recordDamage");

// game/gameState/battle/characters/effects.ts
init_rulebook2();
var import_immer4 = __toESM(require("immer"));

// game/gameState/battle/cards/commands/addBlock.ts
var explain3 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [block] = evalAllAsHtml(dslArgs);
  const [_2, targetType] = evalAll(dslArgs);
  return `Give ${getTargetText(
    targetType ?? context.command.targetType,
    context.characterMeta
  )} +${block} block`;
}, "explain");
var execute3 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [block, targetType] = evalAll(dslArgs);
  const targetUids = getTargetUidsOverride({
    targetTypeOverride: targetType,
    scene,
    command,
    givenUids
  });
  maybeIncrementKnightAbility(scene, command, targetUids);
  applyBlocks({ targetUids, fromUid: command.characterUid, scene, block });
}, "execute");
function applyBlocks({
  fromUid,
  targetUids,
  scene,
  block
}) {
  const fromCm = fromUid ? scene.get("allCharacters", fromUid) : null;
  targetUids.forEach((targetUid) => {
    let target = scene.get("allCharacters", targetUid);
    let blockAddend = fromCm ? activateTalentsData({
      scene,
      key: "blockGiveAdd",
      data: 0,
      cm: fromCm,
      extra: { target }
    }) : 0;
    blockAddend = activateTalentsData({
      scene,
      key: "blockReceiveAdd",
      data: blockAddend,
      cm: target,
      extra: { target: fromCm }
    });
    let blockMultiplier = getBlockMultiplier(targetUids[0], scene);
    blockMultiplier = fromCm ? activateTalentsData({
      scene,
      key: "blockGiveMultiply",
      data: blockMultiplier,
      cm: fromCm,
      extra: { target }
    }) : 1;
    blockMultiplier = activateTalentsData({
      scene,
      key: "blockReceiveMultiply",
      data: blockMultiplier,
      cm: target,
      extra: { target: fromCm }
    });
    const finalBlock = (block + blockAddend) * blockMultiplier;
    scene.apply(
      ["allCharacters", targetUid, "block"],
      (b2) => Math.ceil(b2 + finalBlock)
    );
    scene.apply("blocksAppliedThisTurn", (blocks) => [
      ...blocks,
      { amount: finalBlock, targetUid }
    ]);
  });
}
__name(applyBlocks, "applyBlocks");
function getBlockMultiplier(uid, scene) {
  return calculateStats(scene.get("allCharacters", uid)).blockMultiplier;
}
__name(getBlockMultiplier, "getBlockMultiplier");

// game/gameState/battle/util/characterManagement.ts
init_rulebook2();
init_code();
var import_lodash6 = require("lodash");
var BASE_WIDTH = 1920;
var BASE_HEIGHT = 1080;
var CENTERING_X_OFFSET = 5;
function makeCharacters(chosen = []) {
  const playerCharacterPositions = makeLeftPositions();
  const all = [
    ...chosen.map((c, i) => {
      const [x2, y2] = playerCharacterPositions[i];
      return newPCMeta(
        {
          uid: c.uid,
          name: c.id,
          x: x2,
          y: y2
        },
        c
      );
    })
  ];
  const o = {};
  for (const c of all) {
    o[c.uid] = c;
  }
  return o;
}
__name(makeCharacters, "makeCharacters");
function rearrangeNpcs(npcs) {
  const positions = getEnemyPositions(keys(npcs).length);
  const rearrangedNpcs = {};
  const npcKeys = keys(npcs);
  vals(npcs).forEach((npc, i) => {
    const [x2, y2] = positions[i];
    rearrangedNpcs[npcKeys[i]] = {
      ...npc,
      x: x2,
      y: y2,
      screenX: BASE_WIDTH * x2 / 100,
      screenY: BASE_HEIGHT * y2 / 100
    };
  });
  return rearrangedNpcs;
}
__name(rearrangeNpcs, "rearrangeNpcs");
function getEnemyPositions(n) {
  const threePoints = getThreePointGrid();
  if (n === 1)
    return [threePoints[1]];
  if (n === 2)
    return [
      positionBetween(threePoints[0], threePoints[1]),
      positionBetween(threePoints[1], threePoints[2])
    ];
  return threePoints;
}
__name(getEnemyPositions, "getEnemyPositions");
function makeLeftPositions() {
  const measurements = [
    [31, 34.2],
    [18.5, 50.23],
    [6, 67.16]
  ];
  return measurements.map((m2) => [m2[0] + CENTERING_X_OFFSET, m2[1]]);
}
__name(makeLeftPositions, "makeLeftPositions");
function getThreePointGrid() {
  const measurements = [
    [60.37, 34.2],
    [69.62, 50.23],
    [78.13, 67.16]
  ];
  return measurements.map(
    (m2) => [m2[0] + CENTERING_X_OFFSET, m2[1]]
  );
}
__name(getThreePointGrid, "getThreePointGrid");
function newPCMeta(args, origCm) {
  const { playerCharacterStatsMap: statsMap } = getRulebook();
  const scale = 1;
  const stance = "neutral";
  const stats = { ...statsMap[args.name], ...origCm };
  const characterMeta = {
    ...stats,
    uid: args.uid,
    isPc: true,
    x: args.x,
    y: args.y,
    screenX: scale * BASE_WIDTH * args.x / 100,
    screenY: scale * BASE_HEIGHT * args.y / 100,
    stance,
    stanceInPrevTurn: stance,
    hasMoved: false,
    health: stats.constitution,
    block: 0,
    effects: getStartingClassPassiveEffects(stats.class),
    orbs: [],
    statModifiersMap: {
      turn: {},
      room: {},
      run: {}
    }
  };
  return { ...characterMeta, calculatedStats: calculateStats(characterMeta) };
}
__name(newPCMeta, "newPCMeta");
function newNPCMeta(args) {
  const { name, level } = args;
  const enemyDefinition = getRulebook().npcStatsMapByLevel[name][level];
  const cm = {
    ...enemyDefinition,
    id: name,
    displayName: (0, import_lodash6.startCase)(name),
    health: getHealthFromBase(enemyDefinition.constitution),
    constitution: getHealthFromBase(enemyDefinition.constitution),
    block: 0,
    uid: args.uid,
    isPc: false,
    x: args.x,
    y: args.y,
    screenX: BASE_WIDTH * args.x / 100,
    screenY: BASE_HEIGHT * args.y / 100,
    hasMoved: false,
    effects: [],
    orbs: [],
    statModifiersMap: {
      turn: {},
      room: {},
      run: {}
    },
    lastTaunt: 0,
    taunt: 0
  };
  return { ...cm, calculatedStats: calculateStats(cm) };
}
__name(newNPCMeta, "newNPCMeta");
function getHealthFromBase(base) {
  return parseInt(`${base}`);
}
__name(getHealthFromBase, "getHealthFromBase");
function positionBetween(arg0, arg1) {
  return [(arg0[0] + arg1[0]) / 2, (arg0[1] + arg1[1]) / 2];
}
__name(positionBetween, "positionBetween");
function getStartingClassPassiveEffects(characterClass) {
  const classToPassiveEffectMap = {
    wizard: { id: "arcaneFriendship", counter: 0 },
    knight: { id: "valiant", counter: 0 },
    rogue: { id: "anHonestLiving", counter: "\u221E" },
    bard: null,
    cleric: null
  };
  const effect = classToPassiveEffectMap[characterClass];
  return effect ? [effect] : [];
}
__name(getStartingClassPassiveEffects, "getStartingClassPassiveEffects");

// game/gameState/battle/characters/effects.ts
var staticEffectFuncs = {
  berserkBuff(stats) {
    if (stats.stance !== "aggressive")
      return;
    stats.damageDealMultiplicand += 0.5;
    stats.damageTakeMultiplicand += 1;
  },
  braveBuff(stats) {
    stats.damageDealMultiplicand += 0.15;
  },
  courageousBuff(stats) {
    stats.damageDealMultiplicand += 0.25;
  },
  debilitatedDebuff(stats) {
    stats.damageDealMultiplicand -= 0.5;
  },
  doubleDamageBuff(stats) {
    stats.strength *= 2;
  },
  cowardsCrown(stats) {
    if (stats.stance === "avoidant")
      stats.damageDealMultiplicand += 0.15;
  },
  chargedBombBuff(stats) {
    stats.strength *= 3;
  },
  stampBuff(stats) {
    stats.strength += 30;
  },
  entrancedBuff(stats, counter) {
    stats.magic += counter;
  },
  fatiguedDebuff(stats) {
    stats.damageDealMultiplicand -= 0.25;
  },
  guardedBuff(stats) {
    stats.damageTakeMultiplicand -= 0.25;
  },
  ignoreAggressive(stats) {
    if (stats.stance !== "aggressive")
      return;
    stats.damageTakeMultiplicand -= getDamageTakeMulitplicandForStance("aggressive") - 1;
    stats.damageDealMultiplicand -= getDamageDealMulitplicandForStance("aggressive") - 1;
  },
  reflectBuff() {
  },
  counterAttackBuff() {
  },
  mutuallyAssuredDestructionBuff() {
  },
  smallDamageIncreaseBuff(stats) {
    stats.damageTakeAddend += 4;
  },
  strongblockBuff(stats) {
    stats.blockMultiplier += 0.5;
  },
  stunnedDebuff(stats) {
    stats.isSkipped = true;
  },
  targetedDebuff(stats) {
    stats.damageTakeAddend += 5;
  },
  tiredDebuff(stats) {
    stats.damageDealMultiplicand -= 0.12;
  },
  unguardedDebuff(stats) {
    stats.damageTakeMultiplicand += 0.25;
  },
  unreadyDebuff(stats) {
    stats.damageTakeMultiplicand += 0.12;
  },
  vulnerableDebuff(stats) {
    stats.damageTakeMultiplicand += 0.5;
  },
  immuneToPoisonBuff() {
  },
  damageTakeSubtractorBuff(stats, counter) {
    stats.damageTakeAddend -= counter;
  },
  damageTakeAddendDebuff(stats, counter) {
    stats.damageTakeAddend += counter;
  },
  lockStanceDebuff() {
  }
};
var turnStartEffectFuncs = {
  passiveBlockBuff({ effect, character, scene }) {
    const block = Math.ceil(
      effect.counter * character.calculatedStats.blockMultiplier
    );
    applyBlocks({
      targetUids: [character.uid],
      block,
      scene,
      fromUid: null
    });
  },
  bleedDebuff({ character, scene }) {
    let bleedMultiplicand = 0.05;
    bleedMultiplicand = activateTalentsData({
      scene,
      key: "bleedMultiply",
      data: bleedMultiplicand,
      extra: { target: character }
    });
    let damage = Math.ceil(
      character.calculatedStats.constitution * bleedMultiplicand
    );
    damage = activateTalentsData({
      scene,
      key: "preEffectDamage",
      data: damage,
      cm: character,
      extra: { damageType: "bleed" }
    });
    if (damage != 0) {
      applyDamage({
        damage,
        targetUid: character.uid,
        scene,
        piercing: true,
        damageType: "bleed"
      });
    }
  },
  poisonedDebuff({ effect, character, scene }) {
    if (character.effects.find((e) => e.id === "immuneToPoisonBuff"))
      return;
    let damage = effect.counter;
    damage = activateTalentsData({
      scene,
      key: "preEffectDamage",
      data: damage,
      cm: character,
      extra: { damageType: "poison" }
    });
    if (damage != 0) {
      applyDamage({
        damage,
        targetUid: character.uid,
        scene,
        piercing: true,
        damageType: "poison"
      });
    }
  },
  fireDebuff({ character, scene }) {
    applyEffect(scene, [character.uid], "vulnerableDebuff", 2);
  },
  yodelBuff({ character, scene }) {
    applyEffect(
      scene,
      !character.isPc ? getLivingPcUids(scene.get()) : getLivingNpcUids(scene.get()),
      "braveBuff",
      2
    );
  }
};
var activateTurnStartEffect = /* @__PURE__ */ __name((effect, character, scene) => {
  const effectFunc = turnStartEffectFuncs?.[effect.id];
  if (!effectFunc || character.health <= 0) {
    return;
  }
  effectFunc({
    effect,
    character,
    scene
  });
}, "activateTurnStartEffect");
function calculateStats(cm) {
  const stance = cm.stance ?? "neutral";
  const constitution = Math.ceil(
    cm.constitution + getStatModifierAddend(cm, "constitution") + cm.constitution * getStatModifierAddend(cm, "constitutionMultiplicand")
  );
  const stats = {
    block: cm.block ?? 0,
    blockMultiplier: 1,
    constitution,
    defense: Math.ceil(
      cm.defense + getStatModifierAddend(cm, "defense") + cm.defense * getStatModifierAddend(cm, "defenseMultiplicand")
    ),
    magic: Math.ceil(
      cm.magic + getStatModifierAddend(cm, "magic") + cm.magic * getStatModifierAddend(cm, "magicMultiplicand")
    ),
    strength: Math.ceil(
      cm.strength + getStatModifierAddend(cm, "strength") + cm.strength * getStatModifierAddend(cm, "strengthMultiplicand")
    ),
    isSkipped: false,
    damageDealMultiplicand: getDamageDealMulitplicandForStance(stance) + getStatModifierAddend(cm, "damageDealMultiplicand"),
    damageDealAddend: getStatModifierAddend(cm, "damageDealAddend"),
    damageTakeMultiplicand: getDamageTakeMulitplicandForStance(stance) + getStatModifierAddend(cm, "damageTakeMultiplicand"),
    damageTakeAddend: getStatModifierAddend(cm, "damageTakeAddend"),
    health: Math.min(cm.health, constitution),
    stance,
    taunt: cm.taunt,
    lastTaunt: cm.lastTaunt,
    critChance: cm.isPc ? (0.05 + getStatModifierAddend(cm, "critChanceAddend")) * (getStatModifierAddend(cm, "critChanceMultiplicand") + 1) : 0,
    dodgeChance: cm.isPc ? (0.01 + getStatModifierAddend(cm, "dodgeChanceAddend")) * (getStatModifierAddend(cm, "dodgeChanceMultiplicand") + 1) : 0
  };
  cm.effects?.forEach((effect) => {
    if (turnStartEffectIds.includes(effect.id))
      return;
    staticEffectFuncs[effect.id]?.(stats, effect.counter);
  });
  return stats;
}
__name(calculateStats, "calculateStats");
function getStatModifierAddend(cm, stat) {
  return (cm.statModifiersMap?.turn?.[stat] ?? 0) + (cm.statModifiersMap?.room?.[stat] ?? 0) + (cm.statModifiersMap?.run?.[stat] ?? 0);
}
__name(getStatModifierAddend, "getStatModifierAddend");
function getDamageDealMulitplicandForStance(stance) {
  const stanceMeta = getRulebook().stanceTypeMetaMap[stance];
  return stanceMeta ? stanceMeta.attackMultiplier : 1;
}
__name(getDamageDealMulitplicandForStance, "getDamageDealMulitplicandForStance");
function getDamageTakeMulitplicandForStance(stance) {
  const stanceMeta = getRulebook().stanceTypeMetaMap[stance];
  return stanceMeta ? stanceMeta.defenseMultiplier : 1;
}
__name(getDamageTakeMulitplicandForStance, "getDamageTakeMulitplicandForStance");
function applyTurnStartEffects(scene, whichSide) {
  scene.select("allCharacters").apply(
    (0, import_immer4.default)((allCharacters) => {
      for (const character of Object.values(allCharacters)) {
        if (character.isPc && whichSide === "npc")
          continue;
        if (!character.isPc && whichSide === "pc")
          continue;
        if (character.health <= 0)
          continue;
        if (!character.effects)
          logger.debug(`no effects for ${character.id}`);
        else {
          character.effects.forEach((effect) => {
            activateTurnStartEffect(effect, character, scene);
          });
        }
      }
    })
  );
  decrementTurnStartEffects(scene, whichSide);
}
__name(applyTurnStartEffects, "applyTurnStartEffects");
function decrementTurnStartEffects(scene, whichSide) {
  decrementEffects(scene, whichSide, true);
}
__name(decrementTurnStartEffects, "decrementTurnStartEffects");
function decrementEffects(scene, whichSide, turnStart = false) {
  scene.select("allCharacters").apply(
    (0, import_immer4.default)((ac) => {
      for (const cm of Object.values(ac)) {
        if (cm.isPc && whichSide === "npc")
          continue;
        if (!cm.isPc && whichSide === "pc")
          continue;
        cm.effects.forEach((e) => {
          if (e.countType === "proc")
            return;
          if (passiveClassEffectIds.includes(
            e.id
          ))
            return;
          if (turnStart === turnStartEffectIds.includes(e.id))
            e.counter -= 1;
        });
        cm.effects = cm.effects.filter(
          (e) => (e.counter > 0 || passiveClassEffectIds.includes(e.id)) && !turnEndClearEffects.includes(e.id)
        );
      }
    })
  );
}
__name(decrementEffects, "decrementEffects");
function clearAllEffects(scene) {
  scene.apply(
    "allCharacters",
    (0, import_immer4.default)((ac) => {
      Object.values(ac).forEach((cm) => {
        cm.block = 0;
        cm.effects = getStartingClassPassiveEffects(cm.class);
        cm.orbs = [];
      });
    })
  );
}
__name(clearAllEffects, "clearAllEffects");

// game/gameState/battle/characters/updateCharacters.ts
function updateCharacters(sceneCursor) {
  sceneCursor.apply("allCharacters", (ac) => {
    const newAc = { ...ac };
    (0, import_lodash7.keys)(ac).map((characterUid) => {
      const cm = newAc[characterUid];
      const calculatedStats = calculateStats(cm);
      newAc[characterUid] = {
        ...cm,
        health: calculatedStats.health,
        calculatedStats
      };
    });
    return newAc;
  });
}
__name(updateCharacters, "updateCharacters");

// game/gameState/battle/activateSouvenirs.ts
function activateSouvenirs(activationKey, scene, characterUid) {
  let wasSouvenirActivated = false;
  (scene.get("souvenirs") ?? []).forEach((souvenir, idx) => {
    if (!characterUid || !souvenir.equippable && souvenir.targetType == null && isPc(scene.get(), characterUid) || (souvenir.targetType ?? "").includes("nemies") && !isPc(scene.get(), characterUid) || characterUid === souvenir.characterUid)
      wasSouvenirActivated = activateSouvenir(souvenir, activationKey, scene, idx) || wasSouvenirActivated;
  });
  return wasSouvenirActivated;
}
__name(activateSouvenirs, "activateSouvenirs");
function activateSouvenir(souvenir, activationKey, scene, idx) {
  const livingPcs = getLivingPcs(scene.get());
  const livingNpcs = getLivingNpcs(scene.get());
  const commandDSLString = souvenir.on[activationKey];
  if (!commandDSLString)
    return false;
  let characterUid = souvenir.characterUid;
  if (!characterUid && souvenir.equippable)
    throw new Error(
      `equippable souvenirs must have characterUid assigned... ${souvenir.id}`
    );
  if (!characterUid)
    characterUid = livingPcs[0].uid;
  const targetUids = souvenir.equippable ? [characterUid] : souvenir.targetNum && souvenir.targetType ? (0, import_lodash8.range)(0, souvenir.targetNum).map(
    () => randomEl(
      souvenir.targetType?.includes("friend") ? livingPcs : livingNpcs
    ).uid
  ) : souvenir.targetType === "allEnemies" ? livingNpcs.map((cm) => cm.uid) : livingPcs.map((cm) => cm.uid);
  interpretCommand({
    command: {
      id: "",
      name: "",
      targetNum: souvenir.targetNum ?? (souvenir.equippable ? 1 : -1),
      actions: commandDSLString,
      targetType: souvenir.equippable ? "self" : "allFriends",
      characterUid
    },
    targetUids,
    scene,
    extra: { idx, counter: souvenir.counter }
  });
  updateCharacters(scene);
  return true;
}
__name(activateSouvenir, "activateSouvenir");

// game/actions/chooseEventResponse.ts
init_util();
var chooseEventResponse = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  if (scene.get("currentRoom", "category") !== "events" || scene.get("isInMap"))
    return;
  const choice = scene.get("currentRoom", "event")?.choices[args.index];
  const souvenirId = choice?.souvenirId;
  if (choice === void 0)
    return logger.warn("invalid event response");
  if (args.characterUid != null && !scene.get("allCharacters", args.characterUid, "isPc"))
    return logger.warn("invalid character UID");
  if (souvenirId != null)
    acquireSouvenir(souvenirId, args.characterUid, scene);
  scene.set("isInMap", true);
}, "chooseEventResponse");
function acquireSouvenir(id, characterUid, scene) {
  if (!souvenirMap[id]) {
    logger.error(`souvenir or talent not implemented: ${id}`);
    return;
  }
  if (!characterUid && souvenirMap[id].equippable)
    throw new Error("cannot equip to character without characterUid...");
  const newSouvenir = {
    ...souvenirMap[id],
    characterUid: souvenirMap[id].equippable ? characterUid : void 0,
    counter: 0
  };
  logger.debug(`souvenir ${id} given to ${characterUid}`);
  scene.apply("souvenirs", (souvenirs) => [...souvenirs ?? [], newSouvenir]);
  const idx = scene.get("souvenirs").length - 1;
  activateSouvenir(newSouvenir, "acquire", scene, idx);
  activateTalent(newSouvenir, "acquire", scene, idx);
  return newSouvenir;
}
__name(acquireSouvenir, "acquireSouvenir");
var acquireTalents = /* @__PURE__ */ __name((scene) => {
  const ac = scene.get("allCharacters");
  for (const [cuid, cm] of Object.entries(ac)) {
    if (!cm.talents)
      continue;
    for (const { name: talent } of cm.talents) {
      acquireSouvenir(talent, cuid, scene);
    }
  }
}, "acquireTalents");

// game/gameState/battle/cards/commands/acquireSouvenir.ts
var import_lodash9 = require("lodash");
var explain4 = /* @__PURE__ */ __name((dslArgs) => {
  return `acquire ${(0, import_lodash9.startCase)(dslArgs[0].eval())}`;
}, "explain");
var execute4 = /* @__PURE__ */ __name(({
  dslArgs,
  command: { characterUid },
  scene
}) => {
  const [id] = evalAll(dslArgs);
  acquireSouvenir(id, characterUid, scene);
}, "execute");

// game/gameState/battle/cards/commands/addEnergy.ts
var explain5 = /* @__PURE__ */ __name((dslArgs) => {
  const [amount] = evalAllAsHtml(dslArgs);
  return `gain ${amount} energy`;
}, "explain");
var execute5 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [amount] = evalAll(dslArgs);
  scene.apply("energy", (e) => e + amount);
}, "execute");

// game/gameState/battle/cards/commands/addEnergyPerRound.ts
var explain6 = /* @__PURE__ */ __name((dslArgs) => {
  const [energy] = evalAllAsHtml(dslArgs);
  return `gain ${energy} energy <br/>at the start of each turn`;
}, "explain");
var execute6 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene,
  command
}) => {
  enqueueAction(
    {
      actions: `addEnergy(${dslArgs[0].eval()})`,
      characterUid: command.characterUid,
      turnsAway: -1,
      targetUids,
      side: "pc"
    },
    scene
  );
}, "execute");

// game/gameState/battle/util/clearBlock.ts
var import_immer5 = __toESM(require("immer"));
init_code();
function clearBlock(scene, which) {
  scene.apply(
    "allCharacters",
    (0, import_immer5.default)((ac) => {
      vals(ac).filter((c) => c.isPc === (which === "pc")).forEach((c) => c.block = 0);
    })
  );
}
__name(clearBlock, "clearBlock");

// game/gameState/battle/util/clearHasMoved.ts
init_code();
function clearHasMoved(scene) {
  scene.apply("allCharacters", (ac) => {
    const newAc = { ...ac };
    keys(newAc).forEach(
      (cKey) => newAc[cKey] = { ...newAc[cKey], hasMoved: false }
    );
    return newAc;
  });
}
__name(clearHasMoved, "clearHasMoved");

// game/gameState/battle/util/makeRoomNpcs.ts
function makeRoomNpcs(nextRoom3) {
  if (nextRoom3[0].id === "REST_SITE")
    return {};
  let newNpcs = Object.fromEntries(
    nextRoom3.map(({ id: name, level }) => {
      const uid = srandom().toString().slice(6);
      return [
        uid,
        newNPCMeta({
          name,
          level,
          uid,
          x: 0,
          y: 0
        })
      ];
    })
  );
  newNpcs = rearrangeNpcs(newNpcs);
  return newNpcs;
}
__name(makeRoomNpcs, "makeRoomNpcs");

// game/gameState/battle/util/emitMove.ts
init_util();
function emitMove({
  moveName,
  characterUid,
  targetType,
  targetUids,
  scene
}) {
  const data = {
    cardName: moveName,
    characterUid,
    targetType,
    targetUids
  };
  emit({
    userId: scene.get("userId"),
    event: {
      type: "move$",
      data
    }
  });
}
__name(emitMove, "emitMove");

// game/gameState/battle/cards/commands/bellyFlop.ts
var explain7 = /* @__PURE__ */ __name((dslArgs) => {
  const [damageHtml, times] = evalAllAsHtml(dslArgs);
  const timesString = Number(times) > 1 ? ` ${times} times` : ``;
  return `Bosshog J\xFCrgen will attempt to attack for ${damageHtml} damage${timesString}, but will deal 1 point less for every point of damage he takes.`;
}, "explain");
var execute7 = /* @__PURE__ */ __name(({
  scene,
  command,
  targetUids,
  dslArgs
}) => {
  const [damageBase, times] = evalAll(dslArgs);
  const damageDealtThisTurn = scene.get("damagesDealtThisTurn").filter((damage2) => damage2.targetUid === command.characterUid).reduce((total, d) => total + d.amount, 0);
  const damage = Math.max(1, damageBase - damageDealtThisTurn);
  if (targetUids.length == times) {
    targetUids.map(
      (targetUid) => applyDamage({
        damage,
        targetUid,
        attackerUid: command.characterUid,
        scene
      })
    );
  } else {
    for (let i = 0; i < times; i++) {
      applyDamage({
        damage,
        targetUid: targetUids[0],
        attackerUid: command.characterUid,
        scene
      });
    }
  }
}, "execute");

// game/gameState/battle/cards/commands/brittle.ts
var import_immer6 = require("immer");
var explain8 = /* @__PURE__ */ __name((dslArgs) => {
  const [count] = evalAll(dslArgs);
  return "<b>Brittle</b>" + (count ? ` (${count})` : "");
}, "explain");
var execute8 = /* @__PURE__ */ __name(({ dslArgs, cardUid, scene }) => {
  const [count] = evalAll(dslArgs);
  if (cardUid == null)
    throw Error("brittle did not receive a cardUid");
  let cardOut = null;
  scene.apply(
    "cards",
    (0, import_immer6.produce)((piles) => {
      const card = piles.hand[cardUid] ?? piles.discard[cardUid] ?? piles.draw[cardUid];
      if (card == null)
        throw Error(`card '${cardUid}' had brittle but was not found`);
      if (count > 1) {
        card.actions = card.actions.replace(
          /brittle(.+)/,
          `brittle(${count - 1})`
        );
      } else {
        delete piles.hand[cardUid];
        delete piles.discard[cardUid];
        delete piles.draw[cardUid];
        piles.removedRun[cardUid] = card;
        cardOut = (0, import_immer6.current)(card);
      }
      return piles;
    })
  );
  if (cardOut)
    activateTalents({
      scene,
      key: "brittleBreak",
      extra: { card: cardOut }
    });
  updateHand(scene);
}, "execute");

// game/gameState/battle/cards/commands/chain.ts
var import_lodash10 = require("lodash");
var explain9 = /* @__PURE__ */ __name((dslArgs) => {
  return dslArgs.map((link) => (0, import_lodash10.upperFirst)(link.eval())).join(".<br/>");
}, "explain");
var execute9 = /* @__PURE__ */ __name(({ dslArgs }) => {
  dslArgs.forEach((a) => a.eval());
}, "execute");

// game/gameState/battle/cards/commands/choice.ts
var explain10 = /* @__PURE__ */ __name((dslArgs) => {
  const choices = evalAllAsHtml(dslArgs);
  return `${choices.map((c, i) => `${i > 0 ? "<br/>or " : "   "}${c}`).join("")}`;
}, "explain");
var execute10 = /* @__PURE__ */ __name(({ dslArgs }) => {
  dslArgs[Math.floor(dslArgs.length * srandom())].eval();
}, "execute");

// game/gameState/battle/cards/commands/deal.ts
var import_lodash11 = require("lodash");
init_code();
var explain11 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [damageHtml] = evalAllAsHtml(dslArgs);
  const [damage, modifier, targetType] = evalAll(dslArgs);
  const damageHtmlArr = getOuterHtmlArr(damageHtml);
  let explication = `deal ${damageHtmlArr[0]}${getDamage({
    scene: context.scene,
    damage,
    attacker: context.characterMeta,
    target: null
  })}${damageHtmlArr[1]} damage`;
  explication += " to " + getTargetText(
    targetType ?? context.command.targetType,
    context.characterMeta
  );
  if (modifier)
    explication += ` <b>${(0, import_lodash11.upperFirst)(modifier)}</b>`;
  return explication;
}, "explain");
var execute11 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  command,
  targetUids
}) => {
  const [damage, modifier, targetType] = evalAll(dslArgs);
  const expectedNumTargets = command.targetNum;
  if (expectedNumTargets > -1 && expectedNumTargets !== targetUids.length) {
    logger.error(
      `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
    );
    return;
  }
  let totalDamage = 0;
  getTargetUidsOverride({
    targetTypeOverride: targetType,
    scene,
    command,
    givenUids: targetUids
  }).forEach(
    (targetUid) => totalDamage += applyDamage({
      scene,
      damage,
      targetUid,
      attackerUid: command.characterUid,
      piercing: modifier === "piercing",
      cardId: command.id
    })
  );
  if (totalDamage > 20) {
    scene.apply(
      ["allCharacters", command.characterUid, "taunt"],
      (t) => t + miscTauntValues["over20dmg"]
    );
  }
}, "execute");

// game/gameState/battle/cards/commands/dealCounterTimes.ts
var explain12 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [_2, effectCounterMultiplicand] = evalAllAsHtml(dslArgs);
  const [effectId] = evalAll(dslArgs);
  return `deal ${effectCounterMultiplicand} points of damage to target enemy for every ${effectId} counter they have`;
}, "explain");
var execute12 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  command,
  targetUids
}) => {
  const [effectId, effectCounterMultiplicand, targetType] = evalAll(dslArgs);
  getTargetUidsOverride({
    targetTypeOverride: targetType,
    scene,
    command,
    givenUids: targetUids
  }).forEach((targetUid) => {
    const damage = (scene.get("allCharacters", targetUid, "effects").find((e) => e.id.includes(effectId))?.counter ?? 0) * effectCounterMultiplicand;
    applyDamage({
      damage,
      targetUid,
      attackerUid: command.characterUid,
      scene
    });
  });
}, "execute");

// game/gameState/battle/cards/commands/dealFromStance.ts
var explain13 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [_2, damageHtml, times] = evalAllAsHtml(dslArgs);
  const [stanceId, damage] = evalAll(dslArgs);
  const attacker = { ...context.characterMeta, stance: stanceId };
  const damageHtmlArr = damageHtml.split(">").length > 1 ? [damageHtml.split(">")[0] + ">", "</" + damageHtml.split("</")[1]] : ["", ""];
  let explication = `deal ${damageHtmlArr[0]}${getDamage({
    scene: context.scene,
    damage,
    attacker,
    target: null
  })}${damageHtmlArr[1]} damage`;
  if (times != null) {
    explication += ` ${times} times`;
  }
  return explication;
}, "explain");
var execute13 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  command,
  targetUids
}) => {
  const [stanceId, damage, _times] = evalAll(dslArgs);
  const expectedNumTargets = command.targetNum;
  if (expectedNumTargets !== targetUids.length) {
    logger.error(
      `command ${command.id} received ${targetUids.length} targets, but ${expectedNumTargets} were expected`
    );
    return;
  }
  targetUids.forEach(
    (targetUid) => applyDamage({
      damage,
      targetUid,
      attacker: {
        ...scene.get("allCharacters", command.characterUid),
        stance: stanceId
      },
      scene
    })
  );
}, "execute");

// game/gameState/battle/cards/commands/discard.ts
init_code();
var explain14 = /* @__PURE__ */ __name((dslArgs) => {
  const [numCards] = evalAllAsHtml(dslArgs);
  return `Discard ${numCards} card${Number(numCards) > 1 ? "s" : ""}`;
}, "explain");
var execute14 = /* @__PURE__ */ __name(({ cardUid, dslArgs, scene }) => {
  const [numCards] = evalAll(dslArgs);
  const numCardsBefore = scene.get("numRequiredToDiscard");
  const remainingCardsInHand = vals(scene.get("cards", "hand")).filter(
    (card) => card.uid !== cardUid
  );
  const handHasMoreCardsThanThis = remainingCardsInHand.length > numCards + numCardsBefore;
  if (numCards > 0 && handHasMoreCardsThanThis)
    scene.set("numRequiredToDiscard", numCards + numCardsBefore);
  else {
    discardBeforeTurnEnd({
      cardUids: remainingCardsInHand.map((c) => c.uid),
      scene
    });
  }
}, "execute");

// game/gameState/battle/cards/commands/discardRandom.ts
var import_lodash12 = require("lodash");
var explain15 = /* @__PURE__ */ __name((dslArgs) => {
  const [numCards] = evalAllAsHtml(dslArgs);
  return `Discard ${numCards} card${Number(numCards) > 1 ? "s" : ""} at random.`;
}, "explain");
var execute15 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [numCards] = evalAll(dslArgs);
  const cardUids = (0, import_lodash12.shuffle)(Object.keys(scene.get("cards", "hand")));
  const numDiscard = Math.min(numCards, cardUids.length);
  const cardsDiscard = cardUids.slice(0, numDiscard);
  discardBeforeTurnEnd({
    cardUids: cardsDiscard,
    scene
  });
}, "execute");

// game/gameState/battle/cards/commands/doubleEnchantmentOrToken.ts
var explain16 = /* @__PURE__ */ __name((_dslArgs) => {
  return `doubleEnchantmentOrToken: Unimplemented!`;
}, "explain");
var execute16 = /* @__PURE__ */ __name(() => {
}, "execute");

// game/gameState/battle/cards/commands/drawSizeChange.ts
var explain17 = /* @__PURE__ */ __name((dslArgs) => {
  const [amount] = evalAllAsHtml(dslArgs);
  const count = Number(amount);
  return `next turn, draw ${amount} ${count < 0 ? "fewer" : "extra"} card${Math.abs(count) > 1 ? "s" : ""}`;
}, "explain");
var execute17 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [amount] = evalAll(dslArgs);
  scene.apply("handSize", (h2) => Number(h2) + amount);
}, "execute");

// game/gameState/battle/cards/commands/dwindle.ts
var explain18 = /* @__PURE__ */ __name(() => {
  return "<b>Dwindle</b>";
}, "explain");
var execute18 = /* @__PURE__ */ __name(({ scene, cardUid }) => {
  if (cardUid == null)
    throw new Error("Trying to dwindle non-card?");
  scene.select("cards", "hand", cardUid).apply("energy", (e) => e + 1);
}, "execute");

// game/gameState/battle/cards/commands/explain.ts
var explain19 = /* @__PURE__ */ __name((dslArgs) => {
  const all = evalAllAsHtml(dslArgs);
  return all.join("");
}, "explain");
var execute19 = /* @__PURE__ */ __name(({ dslArgs }) => {
}, "execute");

// game/gameState/battle/cards/commands/heal.ts
var explain20 = /* @__PURE__ */ __name((dslArgs) => {
  const [amount] = evalAllAsHtml(dslArgs);
  return `heal for ${amount}`;
}, "explain");
var execute20 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [amount, targetType] = evalAll(dslArgs);
  getTargetUidsOverride({
    targetTypeOverride: targetType,
    scene,
    command,
    givenUids
  }).forEach((uid) => {
    healCharacter(scene, uid, amount);
  });
}, "execute");
var healCharacter = /* @__PURE__ */ __name((scene, characterUid, amount, percent) => {
  const characterCursor = scene.select("allCharacters", characterUid);
  const constitution = characterCursor.get("calculatedStats", "constitution");
  characterCursor.select("health").apply(
    (h2) => Math.min(
      h2 + Math.ceil(percent ? amount * constitution : amount),
      constitution
    )
  );
}, "healCharacter");

// game/gameState/battle/cards/commands/hypnotize.ts
var explain21 = /* @__PURE__ */ __name((dslArgs) => {
  const [count] = evalAllAsHtml(dslArgs);
  return `add ${count} hypnotized cards to your deck for this room`;
}, "explain");
var execute21 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene
}) => {
  const [count] = evalAll(dslArgs);
  let hypnoCards = [];
  for (let i = 0; i < count; i++) {
    let newCard2 = getCardInstance("hypnotized", targetUids[0]);
    newCard2 = updateExplanations(newCard2, scene);
    hypnoCards.push(newCard2);
  }
  scene.select("cards", "draw").apply((draw2) => {
    let drawEntries = Object.entries(draw2);
    const numInDraw = drawEntries.length;
    for (const card of hypnoCards) {
      let idx = Math.floor(Math.random() * (numInDraw + 1));
      drawEntries.splice(idx, 0, [card.uid, card]);
    }
    draw2 = Object.fromEntries(drawEntries);
    return draw2;
  });
}, "execute");

// game/gameState/battle/cards/commands/if.ts
var explain22 = /* @__PURE__ */ __name((dslArgs) => {
  const [condition, outcomeIfTrue, outcomeIfFalse] = evalAllAsHtml(dslArgs);
  return `If ${condition}, ${outcomeIfTrue}, otherwise ${outcomeIfFalse}`;
}, "explain");
var execute22 = /* @__PURE__ */ __name(({ dslArgs }) => {
  dslArgs[0].eval() ? dslArgs[1].eval() : dslArgs[2]?.eval();
}, "execute");

// game/gameState/battle/cards/commands/ifDamageDealt.ts
init_code();
var explain23 = /* @__PURE__ */ __name((dslArgs) => {
  const [_2, conditionalMove] = evalAllAsHtml(dslArgs);
  return `if damage is dealt, then ${conditionalMove}`;
}, "explain");
var execute23 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene
}) => {
  if (targetUids.length !== 1) {
    logger.error("ifDamageDealt requires exactly one target");
    throw Error();
  }
  const targetUid = targetUids[0];
  const healthBefore = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthBefore });
  if (healthBefore <= 0) {
    logger.warn(
      "ifDamageDealt: target already died before executing first argument"
    );
  }
  const mainMove = dslArgs[0];
  mainMove.eval();
  const healthAfter = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthAfter });
  if (healthAfter < healthBefore) {
    const conditionalMove = dslArgs[1];
    conditionalMove.eval();
  }
}, "execute");

// game/gameState/battle/cards/commands/ifDamageDealtApplyEffect.ts
var explain24 = /* @__PURE__ */ __name((dslArgs) => {
  return `ifDamageDealtApplyEffect`;
}, "explain");
var execute24 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene,
  command
}) => {
  const [damage, effectId, counter] = evalAll(dslArgs);
  targetUids.forEach((targetUid) => {
    const healthBefore = scene.get("allCharacters", targetUid, "health");
    applyDamage({
      damage,
      targetUid,
      scene,
      attackerUid: command.characterUid
    });
    const healthAfter = scene.get("allCharacters", targetUid, "health");
    if (healthBefore !== healthAfter)
      applyEffect(scene, [targetUid], effectId, counter);
  });
}, "execute");

// game/gameState/battle/cards/commands/ifFirstPlay.ts
var explain25 = /* @__PURE__ */ __name((dslArgs) => {
  return "<br/>if first use in room:<br/> " + dslArgs.map((link) => `${link.eval()}`).join("<br/>");
}, "explain");
var execute25 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  cardUid
}) => {
  if (cardUid == null)
    throw Error("cardUid is null");
  const thisId = scene.select("cards", "hand", cardUid).get("id");
  if (thisId == null)
    throw Error("card is not in hand!");
  if (!scene.get("cardsPlayedThisRoom").some((c) => c.id === thisId)) {
    dslArgs.forEach((a) => a.eval());
  }
}, "execute");

// game/gameState/battle/cards/commands/ifHealthUnder.ts
var explain26 = /* @__PURE__ */ __name((dslArgs) => {
  const [threshold, explanation1, explantion2] = evalAllAsHtml(dslArgs);
  return `${explantion2}.<br/>Alternately, if target health under ${threshold}%, ${explanation1}`;
}, "explain");
var execute26 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  targetUids
}) => {
  const threshold = +dslArgs[0].eval();
  targetUids.forEach((targetUid) => {
    const cm = scene.get("allCharacters", targetUid);
    if (cm.health / cm.constitution < threshold / 100)
      dslArgs[1].eval();
    else
      dslArgs[2].eval();
  });
}, "execute");

// game/gameState/battle/cards/commands/ifKilled.ts
init_code();
var explain27 = /* @__PURE__ */ __name((dslArgs) => {
  const [mainMove, conditionalMove] = evalAllAsHtml(dslArgs);
  return `${mainMove}<br/>If target dies, then ${conditionalMove}`;
}, "explain");
var execute27 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene
}) => {
  if (targetUids.length !== 1) {
    logger.error("ifKilled requires exactly one target");
    throw Error();
  }
  const targetUid = targetUids[0];
  const healthBefore = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthBefore });
  if (healthBefore <= 0) {
    logger.warn(
      "ifKilled: target already died before executing first argument"
    );
  }
  const mainMove = dslArgs[0];
  mainMove.eval();
  const healthAfter = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthAfter });
  if (healthAfter <= 0) {
    const conditionalMove = dslArgs[1];
    conditionalMove.eval();
  }
}, "execute");

// game/gameState/battle/cards/commands/ifStance.ts
init_code();
var explain28 = /* @__PURE__ */ __name((dslArgs) => {
  const [stance, explanation] = evalAllAsHtml(dslArgs);
  return `You can only play this card if your character is in ${stance} stance.<br/>${explanation}`;
}, "explain");
var execute28 = /* @__PURE__ */ __name(({ dslArgs, scene, command }) => {
  const stanceIdentifier = dslArgs[0].eval();
  const allStances = ["avoidant", "neutral", "aggressive"];
  const stances = !allStances.includes(stanceIdentifier) ? allStances.filter((s2) => stanceIdentifier.includes(s2)) : [stanceIdentifier];
  const characterMeta = scene.get("allCharacters", command.characterUid);
  dslArgs[1].eval();
  if (stances.includes("aggressive")) {
    scene.apply(
      ["allCharacters", command.characterUid, "taunt"],
      (t) => t + miscTauntValues["aggresive"]
    );
  } else if (stances.includes("avoidant")) {
    scene.apply(
      ["allCharacters", command.characterUid, "taunt"],
      (t) => t + miscTauntValues["avoidant"]
    );
  }
}, "execute");

// game/gameState/battle/cards/commands/ifStanceElse.ts
var explain29 = /* @__PURE__ */ __name((dslArgs) => {
  const [stance, explanation1, explantion2] = evalAllAsHtml(dslArgs);
  return `${explantion2}.<br/>Alternately, if in ${stance} stance, ${explanation1}`;
}, "explain");
var execute29 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  command
}) => {
  const stance = dslArgs[0].eval();
  const characterMeta = scene.get("allCharacters", command.characterUid);
  logger.info(
    `stance required is ${stance}, char stance is ${characterMeta.stance}`
  );
  if (characterMeta.stance === stance)
    dslArgs[1].eval();
  else
    dslArgs[2].eval();
}, "execute");

// game/gameState/battle/cards/commands/ifTargetStance.ts
var explain30 = /* @__PURE__ */ __name((dslArgs) => {
  const [stance, explanation] = evalAllAsHtml(dslArgs);
  return `You can only play this card if target Kaiju is in ${stance} stance.<br/>${explanation}`;
}, "explain");
var execute30 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  command,
  targetUids
}) => {
  const stance = dslArgs[0].eval();
  targetUids.forEach((uid) => {
    if (scene.get("allCharacters", uid, "stance") === stance)
      dslArgs[1].eval();
  });
}, "execute");

// game/gameState/battle/cards/commands/infectiousBite.ts
var explain31 = /* @__PURE__ */ __name((dslArgs) => {
  return "Mimic attacks for 100%.\nApply <b>Poisoned</b> equal to the amount of unblocked damage.";
}, "explain");
var execute31 = /* @__PURE__ */ __name(({
  scene,
  command,
  targetUids,
  dslArgs
}) => {
  scene.apply("handSize", (h2) => Number(h2) + 1);
  const [damage] = evalAll(dslArgs);
  const unblockedDamage = applyDamage({
    damage,
    targetUid: targetUids[0],
    attackerUid: command.characterUid,
    scene
  });
  if (unblockedDamage > 0)
    applyEffect(
      scene,
      targetUids,
      "poisonedDebuff",
      Math.ceil(unblockedDamage / 5)
    );
}, "execute");

// game/gameState/battle/cards/commands/join.ts
var explain32 = /* @__PURE__ */ __name((dslArgs) => {
  const links = evalAllAsHtml(dslArgs);
  return links.join(" ");
}, "explain");
var execute32 = /* @__PURE__ */ __name(({ dslArgs }) => {
}, "execute");

// game/gameState/battle/cards/commands/keep.ts
var explain33 = /* @__PURE__ */ __name((dslArgs) => {
  const [numCards] = evalAll(dslArgs);
  return `At the end of your turn, you may keep up to ${numCards} card${s(
    numCards
  )}`;
}, "explain");
var execute33 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [numCards] = evalAll(dslArgs);
  scene.set("numAllowedToKeep", numCards);
}, "execute");

// game/gameState/battle/cards/commands/killIf.ts
var explain34 = /* @__PURE__ */ __name((dslArgs) => {
  const [condition] = evalAllAsHtml(dslArgs);
  return `Kill enemy if ${condition}`;
}, "explain");
var execute34 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene,
  command
}) => {
  const [condition] = evalAll(dslArgs);
  if (targetUids.length !== 1)
    throw Error("killIf only works on one target");
  const targetUid = targetUids[0];
  const healthBefore = scene.get("allCharacters", targetUid, "health");
  if (healthBefore <= 0) {
    logger.warn("killIf: target already dead");
    return;
  }
  if (condition) {
    scene.set(["allCharacters", targetUid, "health"], 0);
  }
}, "execute");

// game/gameState/battle/cards/commands/mimicAttack.ts
var explain35 = /* @__PURE__ */ __name(() => {
  return "mimics the last attack against this character, otherwise deal 999";
}, "explain");
var execute35 = /* @__PURE__ */ __name(({
  scene,
  command,
  targetUids
}) => {
  const damagesDealtThisTurn = scene.get("damagesDealtThisTurn").filter((damage2) => damage2.targetUid === command.characterUid).reverse();
  let damage = 999;
  if (damagesDealtThisTurn.length)
    damage = damagesDealtThisTurn[0].amount;
  applyDamage({
    damage,
    targetUid: targetUids[0],
    attackerUid: command.characterUid,
    scene
  });
}, "execute");

// game/gameState/battle/cards/commands/modifyStats.ts
var import_lodash13 = require("lodash");
init_code();
var explain36 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [statNames, addends, expiration, targetType] = getLocals(dslArgs);
  return `give ${getTargetText(
    targetType || context.command.targetType,
    context.characterMeta
  )} ${statNames.map((_2, i) => getStatModHtml(statNames[i], addends[i])).join(" and ")}
    until end of ${expiration}`;
}, "explain");
function getStatModHtml(statName, addend) {
  return `${addend >= 0 ? "+" : ""}${applyStatHtml(
    statName,
    addend.toString()
  )} <b>${(0, import_lodash13.upperFirst)(statName)}</b>`;
}
__name(getStatModHtml, "getStatModHtml");
var execute36 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [statNames, addends, expiration, targetType] = getLocals(dslArgs);
  const uids = getTargetUidsOverride({
    targetTypeOverride: targetType,
    scene,
    command,
    givenUids
  });
  applyStatModifiers({
    scene,
    uids,
    stats: statNames.reduce((stats, name, i) => {
      stats[name] = addends[i];
      return stats;
    }, {}),
    expiration
  });
}, "execute");
function getLocals(dslArgs) {
  const [statNamesString, addendsString, expiration, targetType] = evalAll(dslArgs);
  const statNames = String(statNamesString).split("|");
  const addends = String(addendsString).split("|").map((a) => parseFloat(a));
  return [statNames, addends, expiration, targetType];
}
__name(getLocals, "getLocals");
function applyStatModifiers({
  scene,
  uids,
  stats,
  expiration
}) {
  uids.forEach(
    (uid) => scene.apply(["allCharacters", uid, "statModifiersMap"], (modifiers) => {
      return getUpdatedModifiers(modifiers, stats, expiration);
    })
  );
  updateCharacters(scene);
}
__name(applyStatModifiers, "applyStatModifiers");
function getUpdatedModifiers(modifiers, stats, expiration) {
  const updatedModifiers = {
    turn: { ...modifiers?.turn },
    room: { ...modifiers?.room },
    run: { ...modifiers?.run }
  };
  keys(stats).forEach((statKey) => {
  });
  return updatedModifiers;
}
__name(getUpdatedModifiers, "getUpdatedModifiers");

// game/gameState/battle/cards/commands/momentary.ts
var import_immer7 = require("immer");
var explain37 = /* @__PURE__ */ __name((_dslArgs) => {
  return `<b>Momentary</b>`;
}, "explain");
var execute37 = /* @__PURE__ */ __name(({ scene, cardUid }) => {
  if (cardUid == null)
    throw Error("momentary did not receive a cardUid");
  let oldCard = null;
  scene.select("cards").apply(
    (0, import_immer7.produce)((piles) => {
      const card = piles.hand[cardUid] ?? piles.discard[cardUid] ?? piles.draw[cardUid];
      oldCard = (0, import_immer7.current)(card);
      if (card == null)
        throw Error(`card '${cardUid}' had momentary but was not found`);
      let interrupt2 = false;
      if (!scene.get("isSimulation"))
        interrupt2 = activateTalentsData({
          scene,
          key: "momentaryInterrupt",
          data: interrupt2,
          extra: { card: (0, import_immer7.current)(card) }
        });
      if (!interrupt2) {
        delete piles.hand[cardUid];
        delete piles.discard[cardUid];
        delete piles.draw[cardUid];
        piles.removedRoom[cardUid] = card;
      }
      return piles;
    })
  );
  let interrupt = false;
  if (!scene.get("isSimulation") && oldCard)
    interrupt = activateTalentsData({
      scene,
      key: "momentaryAfter",
      data: interrupt,
      extra: { card: oldCard }
    });
}, "execute");

// game/gameState/battle/cards/commands/on.ts
var import_immer8 = __toESM(require("immer"));
var import_lodash14 = require("lodash");
var explain38 = /* @__PURE__ */ __name((dslArgs) => {
  const [commandHookId, nextAction] = evalAll(dslArgs);
  return `on ${(0, import_lodash14.startCase)(commandHookId)}, ${nextAction}`;
}, "explain");
var execute38 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene,
  command,
  cardUid
}) => {
  const commandHookId = dslArgs[0].eval();
  const onceOnly = dslArgs[2].eval() === "once";
  const thisTurnOnly = dslArgs[2].eval() === "turn";
  scene.apply(
    "on",
    (0, import_immer8.default)((on) => {
      const commandsQueuedForHook = on[commandHookId] ?? [];
      commandsQueuedForHook.push({
        description: command.name,
        command: {
          uid: cardUid,
          id: command.id,
          name: command.name,
          targetNum: command.targetNum,
          targetType: command.targetType,
          actions: dslArgs[1].toString(),
          characterUid: command.characterUid
        },
        targetUids,
        turnsAway: onceOnly ? 0 : thisTurnOnly ? 1 : Number.POSITIVE_INFINITY,
        side: "pc"
      });
      on[commandHookId] = commandsQueuedForHook;
    })
  );
}, "execute");

// game/gameState/battle/cards/commands/openMap.ts
var explain39 = /* @__PURE__ */ __name(() => {
  return `Exit room without gaining rewards.`;
}, "explain");
var execute39 = /* @__PURE__ */ __name(({ scene }) => {
  scene.set("isInMap", true);
}, "execute");

// game/gameState/battle/cards/commands/orb.ts
var import_lodash15 = require("lodash");
var explain40 = /* @__PURE__ */ __name((args) => {
  const [orbType, count] = evalAllAsHtml(args);
  return `create ${count} <b>Orbs of ${(0, import_lodash15.startCase)(orbType)}</b>`;
}, "explain");
var execute40 = /* @__PURE__ */ __name(({ dslArgs, command, scene }) => {
  const [orbType, count] = evalAll(dslArgs);
  summonOrbs(orbType, count, command.characterUid, scene);
}, "execute");
function summonOrbs(orbType, count, characterUid, scene) {
  logger.info(`adding orb of ${orbType}`);
  scene.select("allCharacters").apply(characterUid, (character) => {
    let orbs = character.orbs;
    const existingOrbOfTypeIndex = orbs.findIndex((o) => o.type === orbType);
    if (existingOrbOfTypeIndex === -1) {
      orbs = [...orbs, { type: orbType, remainingCount: count }];
    } else {
      const newOrbOfType = { ...orbs[existingOrbOfTypeIndex] };
      newOrbOfType.remainingCount += count;
      orbs = [
        ...orbs.slice(0, existingOrbOfTypeIndex),
        newOrbOfType,
        ...orbs.slice(existingOrbOfTypeIndex + 1)
      ];
    }
    return { ...character, orbs };
  });
}
__name(summonOrbs, "summonOrbs");

// game/gameState/battle/cards/commands/orbOfHolyLight.ts
var explain41 = /* @__PURE__ */ __name((_dslArgs) => {
  return `orbOfHolyLight: Unimplemented!`;
}, "explain");
var execute41 = /* @__PURE__ */ __name(() => {
}, "execute");

// game/gameState/battle/cards/commands/psychicWarfare.ts
var explain42 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [damageHtml, sameTargetAddendHtml] = evalAllAsHtml(dslArgs);
  const [damage, sameTargetAddend] = evalAll(dslArgs);
  return `deal ${damageHtml.split(">")[0]}>${getDamageWithAdditional({
    damage,
    attacker: context.characterMeta,
    sameTargetAddend,
    cardUid: context.command.uid,
    scene: context.scene
  })}</${damageHtml.split("</")[1]} damage<br/> +${sameTargetAddendHtml} damage each time used`;
}, "explain");
var execute42 = /* @__PURE__ */ __name(({
  dslArgs,
  scene,
  targetUids,
  cardUid,
  command
}) => {
  const [damage, sameTargetAddend] = evalAll(dslArgs);
  if (cardUid == null)
    throw new Error("psychic warfare on non-card?");
  const attacker = scene.get("allCharacters", command.characterUid);
  targetUids.forEach(
    (targetUid) => applyDamage({
      damage: getDamageWithAdditional({
        damage,
        attacker,
        sameTargetAddend,
        cardUid,
        scene
      }),
      targetUid,
      attackerUid: command.characterUid,
      scene
    })
  );
}, "execute");
function getDamageWithAdditional({
  damage,
  attacker,
  sameTargetAddend,
  cardUid,
  scene
}) {
  return getDamage({
    scene,
    damage,
    attacker,
    target: null
  }) + getAdditionalDamage(sameTargetAddend, cardUid, scene);
}
__name(getDamageWithAdditional, "getDamageWithAdditional");
function getAdditionalDamage(sameTargetAddend, cardUid, scene) {
  if (scene == null)
    return 0;
  const cardsPlayed = scene.get("cardsPlayedThisRoom") ?? [];
  return Math.ceil(sameTargetAddend) * cardsPlayed.filter((c) => c.uid === cardUid).length;
}
__name(getAdditionalDamage, "getAdditionalDamage");

// game/gameState/battle/cards/commands/queue.ts
var explain43 = /* @__PURE__ */ __name((dslArgs) => {
  const [turnsAway, nextAction] = evalAll(dslArgs);
  return `${turnsAway === 1 ? "Next turn" : `In ${turnsAway} turns`}, ${nextAction}`;
}, "explain");
var execute43 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids,
  scene,
  command
}) => {
  const turnsAway = dslArgs[0].eval();
  const nextAction = dslArgs[1].toString();
  const side = "pc";
  enqueueAction(
    {
      actions: nextAction,
      characterUid: command.characterUid,
      turnsAway,
      targetUids,
      side
    },
    scene
  );
}, "execute");

// game/gameState/battle/cards/commands/removeAllDebuffs.ts
var explain44 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [targetTypeOverride] = evalAll(dslArgs);
  return `remove all debuffs from ${getTargetText(
    targetTypeOverride ?? context.command.targetType,
    context.characterMeta
  )}`;
}, "explain");
var execute44 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [targetTypeOverride] = evalAll(dslArgs);
  const targetUids = getTargetUidsOverride({
    targetTypeOverride,
    scene,
    command,
    givenUids
  });
  targetUids.forEach(
    (uid) => scene.select("allCharacters", uid).apply((cm) => ({
      ...cm,
      effects: cm.effects.filter((effect) => !effect.id.includes("Debuff"))
    }))
  );
}, "execute");

// game/gameState/battle/cards/commands/removeSouvenir.ts
var import_lodash16 = require("lodash");
var explain45 = /* @__PURE__ */ __name((dslArgs) => {
  return `acquire ${(0, import_lodash16.startCase)(dslArgs[0].eval())}`;
}, "explain");
var execute45 = /* @__PURE__ */ __name(({
  dslArgs,
  command: { characterUid },
  scene
}) => {
  const [id] = evalAll(dslArgs);
  removeSouvenir(id, characterUid, scene);
}, "execute");
function removeSouvenir(id, characterUid, scene) {
  let hasNotBeenRemoved = true;
  scene.apply(
    "souvenirs",
    (souvenirs) => souvenirs.filter(
      (s2) => !hasNotBeenRemoved || (hasNotBeenRemoved = s2.id !== id || s2.equippable && s2.characterUid != characterUid)
    )
  );
  if (hasNotBeenRemoved)
    logger.error(
      `the souvenir ${id} for cUid ${characterUid} has not been removed... available were ${scene.get("souvenirs").map((s2) => `id: ${s2.id} characterUid: ${s2.characterUid}`)}`
    );
}
__name(removeSouvenir, "removeSouvenir");

// game/gameState/battle/cards/commands/require.ts
var explain46 = /* @__PURE__ */ __name((dslArgs) => {
  const [type, least, most] = evalAll(dslArgs);
  const numStr = least === most ? `${least}` : `${least}-${most}`;
  const s2 = least < 1 || most > 1 ? "s" : "";
  switch (type) {
    case "discardHand":
      return `discard ${numStr} card${s2}`;
    case "discardDraw":
      return `discard ${numStr} card${s2} from your draw pile`;
    case "removeRoom":
      return `remove ${numStr} card${s2} in the draw pile from the room`;
    default:
      throw Error("unknown require type:", type);
  }
}, "explain");
var execute46 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [type, least, most] = evalAll(dslArgs);
  if (!["discardHand", "discardDraw", "removeRoom"].includes(type))
    throw Error(`unknown require type: ${type}`);
  scene.set("requireAction", { type, least, most });
}, "execute");

// game/gameState/battle/cards/commands/returnThisCardToHand.ts
var import_immer9 = __toESM(require("immer"));
var explain47 = /* @__PURE__ */ __name((dslArgs) => {
  return "return this card to your hand";
}, "explain");
var execute47 = /* @__PURE__ */ __name(({
  scene,
  cardUid
}) => {
  if (cardUid)
    bringCardToHand(scene, cardUid);
}, "execute");
function bringCardToHand(scene, cardUid) {
  scene.apply(
    "cards",
    (0, import_immer9.default)((cards) => {
      let card = null;
      if (card = cards.draw[cardUid]) {
        delete cards.draw[cardUid];
      } else if (card = cards.discard[cardUid]) {
        delete cards.discard[cardUid];
      }
      if (card)
        cards.hand[cardUid] = card;
    })
  );
}
__name(bringCardToHand, "bringCardToHand");

// game/gameState/battle/cards/commands/setStance.ts
init_code();
var explain48 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [stance, targetTypeOverride] = evalAll(dslArgs);
  return `Set the stance of ${getTargetText(
    targetTypeOverride ?? context.command.targetType,
    context.characterMeta
  )} to ${stance} (even&nbsp;if&nbsp;locked)`;
}, "explain");
var execute48 = /* @__PURE__ */ __name(({
  dslArgs,
  targetUids: givenUids,
  scene,
  command
}) => {
  const [stance, targetTypeOverride] = evalAll(dslArgs);
  const targetUids = getTargetUidsOverride({
    targetTypeOverride,
    scene,
    command,
    givenUids
  });
  targetUids.filter(
    (uid) => !scene.get("allCharacters", uid, "effects").find((e) => e.id === "lockStanceDebuff")
  ).forEach(
    (uid) => scene.select("allCharacters", uid).apply((cm) => ({
      ...cm,
      stance,
      taunt: cm.taunt + stance === "aggressive" ? miscTauntValues["aggressive"] : stance === "avoidant" ? miscTauntValues["avoidant"] : 0
    }))
  );
}, "execute");

// game/gameState/battle/cards/commands/smite.ts
init_code();
var explain49 = /* @__PURE__ */ __name((dslArgs, context) => {
  const [damageHtml, blockHtml] = evalAllAsHtml(dslArgs);
  const [damage] = evalAll(dslArgs);
  const damageHtmlArr = getOuterHtmlArr(damageHtml);
  return `deal ${damageHtmlArr[0]}${getDamage({
    scene: context.scene,
    damage,
    attacker: context.characterMeta,
    target: null
  })}${damageHtmlArr[1]} damage. If enemy is killed, block ${blockHtml}`;
}, "explain");
var execute49 = /* @__PURE__ */ __name(({
  command,
  targetUids,
  scene,
  calculatedStats
}) => {
  if (targetUids.length !== 1)
    throw Error("smite requires exactly one target");
  const targetUid = targetUids[0];
  const healthBefore = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthBefore });
  applyDamage({
    damage: calculatedStats.magic,
    targetUid,
    attackerUid: command.characterUid,
    scene
  });
  const healthAfter = scene.get("allCharacters", targetUid).health;
  assertFinite({ healthAfter });
  if (healthAfter <= 0) {
    scene.select("allCharacters", command.characterUid, "block").apply((b2) => b2 + Math.ceil(calculatedStats.defense));
  }
}, "execute");

// game/gameState/battle/cards/commands/text.ts
var explain50 = /* @__PURE__ */ __name((dslArgs) => {
  const [text] = evalAll(dslArgs);
  return text;
}, "explain");
var execute50 = /* @__PURE__ */ __name(() => {
}, "execute");

// game/gameState/battle/cards/commands/chance.ts
var explain51 = /* @__PURE__ */ __name((dslArgs) => {
  const [chance, success, fail] = evalAllAsHtml(dslArgs);
  return `${chance} chance for ${success} otherwise ${fail}`;
}, "explain");
var execute51 = /* @__PURE__ */ __name(({ dslArgs }) => {
  const chance = dslArgs[0].eval();
  const roll = Math.random();
  if (roll <= chance) {
    logger.info("chance success!");
    dslArgs[1].eval();
  } else if (dslArgs[2]) {
    dslArgs[2].eval();
  }
}, "execute");

// game/gameState/battle/cards/commands/incrementSouvenir.ts
var explain52 = /* @__PURE__ */ __name((dslArgs) => {
  const [idx] = evalAllAsHtml(dslArgs);
  return `counter + 1`;
}, "explain");
var execute52 = /* @__PURE__ */ __name(({ dslArgs, scene }) => {
  const [idx] = evalAll(dslArgs);
  scene.apply(["souvenirs", idx, "counter"], (count) => count ? count + 1 : 1);
}, "execute");

// game/gameState/battle/cards/commands/index.ts
var explainers = {
  acquireSouvenir: explain4,
  addBlock: explain3,
  addEnergy: explain5,
  addEnergyPerRound: explain6,
  bellyFlop: explain7,
  brittle: explain8,
  chain: explain9,
  chance: explain51,
  choice: explain10,
  deal: explain11,
  dealCounterTimes: explain12,
  dealFromStance: explain13,
  discard: explain14,
  discardRandom: explain15,
  doubleEnchantmentOrToken: explain16,
  draw: explain2,
  drawSizeChange: explain17,
  dwindle: explain18,
  effect: explain,
  explain: explain19,
  heal: explain20,
  hypnotize: explain21,
  if: explain22,
  ifDamageDealt: explain23,
  ifDamageDealtApplyEffect: explain24,
  ifFirstPlay: explain25,
  ifHealthUnder: explain26,
  ifKilled: explain27,
  ifStance: explain28,
  ifStanceElse: explain29,
  ifTargetStance: explain30,
  incrementSouvenir: explain52,
  infectiousBite: explain31,
  join: explain32,
  keep: explain33,
  killIf: explain34,
  mimicAttack: explain35,
  modifyStats: explain36,
  momentary: explain37,
  on: explain38,
  openMap: explain39,
  orb: explain40,
  orbOfHolyLight: explain41,
  psychicWarfare: explain42,
  queue: explain43,
  removeAllDebuffs: explain44,
  removeSouvenir: explain45,
  require: explain46,
  returnThisCardToHand: explain47,
  setStance: explain48,
  smite: explain49,
  text: explain50
};
var executors = {
  acquireSouvenir: execute4,
  addBlock: execute3,
  addEnergy: execute5,
  addEnergyPerRound: execute6,
  bellyFlop: execute7,
  brittle: execute8,
  chain: execute9,
  chance: execute51,
  choice: execute10,
  deal: execute11,
  dealCounterTimes: execute12,
  dealFromStance: execute13,
  discard: execute14,
  discardRandom: execute15,
  doubleEnchantmentOrToken: execute16,
  draw: execute2,
  drawSizeChange: execute17,
  dwindle: execute18,
  effect: execute,
  explain: execute19,
  heal: execute20,
  hypnotize: execute21,
  if: execute22,
  ifDamageDealt: execute23,
  ifDamageDealtApplyEffect: execute24,
  ifFirstPlay: execute25,
  ifHealthUnder: execute26,
  ifKilled: execute27,
  ifStance: execute28,
  ifStanceElse: execute29,
  ifTargetStance: execute30,
  incrementSouvenir: execute52,
  infectiousBite: execute31,
  join: execute32,
  keep: execute33,
  killIf: execute34,
  mimicAttack: execute35,
  modifyStats: execute36,
  momentary: execute37,
  on: execute38,
  openMap: execute39,
  orb: execute40,
  orbOfHolyLight: execute41,
  psychicWarfare: execute42,
  queue: execute43,
  removeAllDebuffs: execute44,
  removeSouvenir: execute45,
  require: execute46,
  returnThisCardToHand: execute47,
  setStance: execute48,
  smite: execute49,
  text: execute50
};

// game/gameState/battle/cards/outcomeUtil.ts
var import_lodash17 = require("lodash");
function extractDamages(prev, next) {
  const damages = {};
  for (const [uid, { health }] of Object.entries(prev.allCharacters)) {
    if (next.allCharacters[uid].health !== health) {
      damages[uid] = health - next.allCharacters[uid].health;
    }
  }
  return damages;
}
__name(extractDamages, "extractDamages");
function extractBlocks(prev, next) {
  const blocks = {};
  for (const [uid, { block }] of Object.entries(prev.allCharacters)) {
    if (block !== next.allCharacters[uid].block) {
      blocks[uid] = next.allCharacters[uid].block - block;
    }
  }
  return blocks;
}
__name(extractBlocks, "extractBlocks");
function extractEffects(prev, next) {
  const effectsChanged = {};
  for (const [uid, { effects }] of Object.entries(
    prev.allCharacters
  )) {
    if (!(0, import_lodash17.isEqual)(effects, next.allCharacters[uid].effects))
      effectsChanged[uid] = 1;
  }
  return effectsChanged;
}
__name(extractEffects, "extractEffects");

// game/gameState/battle/cards/standardOperators.ts
function process2(av, bv) {
  const [a, b2] = [av.eval(), bv.eval()];
  return [a, b2];
}
__name(process2, "process");
var standardOperators = {
  "-": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a - b2;
  },
  "+": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a + b2;
  },
  "/": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a / b2;
  },
  "*": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a * b2;
  },
  "<": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a < b2;
  },
  "<=": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a <= b2;
  },
  ">": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a > b2;
  },
  ">=": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a >= b2;
  },
  "===": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a === b2;
  },
  "!==": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a !== b2;
  },
  "==": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a == b2;
  },
  "!=": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a != b2;
  },
  "||": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a || b2;
  },
  "&&": (av, bv) => {
    const [a, b2] = process2(av, bv);
    return a && b2;
  },
  ";": (a, b2) => {
    a.eval();
    return b2.eval();
  },
  log10: (a) => Math.log(a.eval()) / Math.log(10),
  pow: (a, b2) => Math.pow(a.eval(), b2.eval())
};

// game/gameState/battle/cards/interpretCommand.ts
init_util();
var import_lodash18 = require("lodash");
function interpretCommand(args, emit2 = true) {
  const locals = localsFromCommand(args);
  if (locals.isSkipped)
    return;
  if (emit2)
    emitMove({
      moveName: args.command.name,
      characterUid: args.command.characterUid,
      targetType: args.command.targetType,
      targetUids: args.targetUids,
      scene: args.scene
    });
  executeCommand({ ...args, locals });
}
__name(interpretCommand, "interpretCommand");
function localsFromCommand(args) {
  const { scene, command, targetUids } = args;
  const sceneData = scene.get();
  const cardOwner = sceneData.allCharacters?.[command.characterUid] ?? scene.get("selectedCharacters")?.find((c) => c?.uid === command.characterUid);
  const cardsPlayedThisRoom = sceneData.cardsPlayedThisRoom ?? [];
  const lastCardPlayed = cardsPlayedThisRoom[cardsPlayedThisRoom.length - 1];
  const stanceIds = sceneData.id === "battle" ? getLivingPcs(sceneData).map((c) => c.stance) : [];
  const extra = args.extra ? args.extra : {};
  return {
    ...calculateStats(cardOwner),
    targetConstitution: targetUids.length === 1 ? sceneData.allCharacters[targetUids[0]]?.constitution : void 0,
    targetHealth: targetUids.length === 1 ? sceneData.allCharacters[targetUids[0]]?.health : void 0,
    targetBlock: targetUids.length === 1 ? sceneData.allCharacters[targetUids[0]]?.block : void 0,
    incomingDamageIntended: sceneData.nextNpcCommands?.reduce(
      (sum, command2) => sum + command2.outcome.damages[targetUids[0]],
      0
    ) ?? 0,
    handSize: Object.keys(sceneData.cards?.hand ?? {}).length,
    drawPileSize: Object.keys(sceneData.cards?.draw ?? {}).length,
    discardPileSize: Object.keys(sceneData.cards?.discard ?? {}).length,
    lastCardPlayedType: lastCardPlayed?.type,
    currentRoomCategory: (sceneData.currentRoom ?? {})?.category,
    wasLastCardPlayedFromThisCharacter: command.characterUid === lastCardPlayed?.characterUid,
    turnStartStance: cardOwner.stanceInPrevTurn ?? "neutral",
    allStancesDifferent: (0, import_lodash18.uniq)(stanceIds).length === stanceIds.length,
    allStancesSame: (0, import_lodash18.uniq)(stanceIds).length === 1,
    turnCount: sceneData.turnCount,
    ...extra
  };
}
__name(localsFromCommand, "localsFromCommand");
function explainCommand(command, scene, stance) {
  const context = {
    scene,
    command,
    characterMeta: {
      ...getCharacterMeta(scene, command.characterUid),
      ...stance ? { stance } : {}
    }
  };
  const res = explainActions(
    command.actions,
    localsFromCommand({ command, scene, targetUids: [] }),
    context
  );
  if (typeof res !== "string") {
    logger.error(["non-string result:", res]);
    return "error!";
  }
  return `${res}.`;
}
__name(explainCommand, "explainCommand");
function explainActions(actions, locals, context) {
  const wrappedExplainers = entryMap(
    explainers,
    (_2, func) => (...args) => func(args, context)
  );
  try {
    const ctx = generateAnguContext(wrappedExplainers);
    return angu.evaluate(actions, ctx, locals).value;
  } catch (e) {
    logger.warn(["[explainActions] angu error:", e]);
    return "error!";
  }
}
__name(explainActions, "explainActions");
function simulateCommand(args) {
  const locals = localsFromCommand(args);
  if (locals.isSkipped)
    return [{ damages: {}, blocks: {}, effects: {} }, args.scene];
  const sceneCopy = new import_sbaobab2.SBaobab(args.scene.deepClone()).select();
  sceneCopy.set("isSimulation", true);
  const userId = args.scene.get("userId");
  const happened = getHappened(userId);
  executeCommand({ ...args, locals, scene: sceneCopy });
  clearHappened(userId);
  for (const event of happened) {
    emit({ userId, event });
  }
  const damages = extractDamages(args.scene.get(), sceneCopy.get());
  const blocks = extractBlocks(args.scene.get(), sceneCopy.get());
  const effects = extractEffects(args.scene.get(), sceneCopy.get());
  return [{ damages, blocks, effects }, sceneCopy];
}
__name(simulateCommand, "simulateCommand");
function executeCommand({
  command,
  targetUids,
  scene,
  locals
}) {
  const cardUid = "uid" in command ? command?.["uid"] : void 0;
  const wrappedExecutors = entryMap(
    executors,
    (_2, func) => (...dslArgs) => func({
      dslArgs,
      command,
      targetUids,
      scene,
      calculatedStats: locals,
      cardUid
    })
  );
  try {
    const ctx = generateAnguContext(wrappedExecutors);
    const output = angu.evaluate(command.actions, ctx, locals);
    if (output.kind === "err") {
      logger.error([
        "error in command:",
        command.actions,
        command.id,
        output.value
      ]);
    }
  } catch (e) {
    logger.error(["error in command:", command.actions, command.id]);
  }
  maybeTransitionBattleState(scene);
}
__name(executeCommand, "executeCommand");
function generateAnguContext(actionsMap) {
  return {
    scope: {
      "="(a, b2) {
        const resB = b2.eval();
        if (a.kind() === "variable") {
          this.context.scope[a.name()] = resB;
        } else {
          throw Error(
            `Assignment expected a variable on the left but got a ${a.kind()}`
          );
        }
        return resB;
      },
      ...standardOperators,
      ...actionsMap
    },
    precedence: [
      ["/", "*"],
      ["-", "+"],
      ["pow", "log10"],
      ["<", "<=", ">", ">=", "===", "!==", "==", "!="],
      ["&&"],
      ["||"],
      { ops: ["="], associativity: "right" },
      [";"]
    ]
  };
}
__name(generateAnguContext, "generateAnguContext");

// game/gameState/battle/cards/shufflePile.ts
var import_lodash19 = require("lodash");
init_code();
function shufflePile(pile) {
  let newPile = {};
  (0, import_lodash19.shuffle)(keys(pile)).forEach(
    (pileKey) => newPile = { ...newPile, [pileKey]: pile[pileKey] }
  );
  return newPile;
}
__name(shufflePile, "shufflePile");

// game/gameState/battle/cards/cardManagement.ts
function getCardOutcomes(scene, card) {
  const targetUids = getTargetUids({
    card,
    targetUids: [],
    scene
  });
  let ac = scene.get("allCharacters");
  let commandOutcomes;
  if (targetUids.length) {
    const commandDetail = {
      command: card,
      targetUids,
      scene
    };
    const [commandOutcome] = simulateCommand(commandDetail);
    return { outcome: commandOutcome };
  }
  if (card.targetNum == 1) {
    commandOutcomes = Object.fromEntries(
      Object.entries(ac).map(([cuid, cm]) => {
        const commandDetail = {
          command: card,
          targetUids: [cuid],
          scene
        };
        const [commandOutcome] = simulateCommand(commandDetail);
        return [cuid, commandOutcome];
      })
    );
  }
  return commandOutcomes;
}
__name(getCardOutcomes, "getCardOutcomes");
function updateHand(scene) {
  scene.apply(["cards", "hand"], (hand) => {
    const newHand = {};
    const characterUidsToYPositionMap = {};
    vals(scene.get("allCharacters")).forEach(
      (c) => characterUidsToYPositionMap[c.uid] = c.y
    );
    const yOf = /* @__PURE__ */ __name((uid) => characterUidsToYPositionMap[uid], "yOf");
    keys(hand).sort((cardAUid, cardBUid) => {
      return yOf(hand[cardAUid].characterUid) < yOf(hand[cardBUid].characterUid) ? -1 : 1;
    }).forEach((cardUid) => {
      const card = hand[cardUid];
      let commandOutcomes = getCardOutcomes(scene, card);
      newHand[cardUid] = {
        ...updateExplanations(hand[cardUid], scene),
        outcomes: commandOutcomes
      };
      return newHand[cardUid];
    });
    return newHand;
  });
}
__name(updateHand, "updateHand");
function setCards(scene) {
  scene.set("cards", makeCards(scene));
}
__name(setCards, "setCards");
function getNullCards() {
  return emptyPiles;
}
__name(getNullCards, "getNullCards");
function makeCards(scene) {
  const allCharacters = vals(scene.get("allCharacters"));
  const characterUidToCardIdMap = {};
  allCharacters.forEach((cm) => {
    characterUidToCardIdMap[cm.uid] = [];
    const cardIds = characterUidToCardIdMap[cm.uid];
    const ccuf = (0, import_lodash20.upperFirst)(cm.class);
    cardIds.push(
      `basicAttack${ccuf}`,
      `block${ccuf}`
    );
    getFirstCardIdForCharacterId(cm.id) && cardIds.push(getFirstCardIdForCharacterId(cm.id));
    if (cm.class === "wizard")
      cardIds.push(
        ["orbOfLightning", "orbOfFrost", "zap"][srandInt(0, 2)]
      );
    if (cm.class === "cleric")
      cardIds.push("shieldOfHolyLight");
    if (cm.class === "knight")
      cardIds.push("dutifulStab");
    if (cm.class === "rogue")
      cardIds.push("patientAmbush");
  });
  const draw2 = {};
  keys(characterUidToCardIdMap).forEach((characterUid) => {
    const cardIds = characterUidToCardIdMap[characterUid];
    cardIds.forEach((id) => {
      const card = updateExplanations(
        getCardInstance(id, characterUid),
        scene
      );
      draw2[card.uid] = card;
    });
  });
  return {
    ...emptyPiles,
    draw: shufflePile(draw2)
  };
}
__name(makeCards, "makeCards");
function getFirstCardIdForCharacterId(characterId) {
  const characterIdToCardIdMap = {
    frogKnight: "charge",
    mushroomFarmer: "helpingHand",
    notoriousBean: "beanNeverMisses",
    penguinKnight: "parry",
    skeletonWarrior: "swordSlash",
    matchaGelatinCube: "shieldOfHolyLight",
    gnomeHooligan: "gnomeBomb",
    jerry: "psychicWarfare"
  };
  return characterIdToCardIdMap[characterId];
}
__name(getFirstCardIdForCharacterId, "getFirstCardIdForCharacterId");
function getRandomCardIdForCharacter(cm) {
  const idPool = keys(cardDefinitionsMap).filter(
    (cardId) => (getCardClass(cardId) === cm.class || getCardClass(cardId) === cm.id) && !~cardId.indexOf("basicAttack") && !~cardId.indexOf("strike") && !~cardId.indexOf("block")
  );
  return idPool[Math.floor(srandom() * idPool.length)];
}
__name(getRandomCardIdForCharacter, "getRandomCardIdForCharacter");
function getFullDeckForCharacter(character, scene) {
  const idPool = keys(cardDefinitionsMap).filter(
    (cardId) => getCardClass(cardId) === character.class || getCardClass(cardId) === character.id
  );
  const pile = {};
  idPool.forEach((cardId) => {
    const card = updateExplanations(
      getCardInstance(cardId, character.uid),
      scene
    );
    pile[card.uid] = card;
  });
  return pile;
}
__name(getFullDeckForCharacter, "getFullDeckForCharacter");
function updateExplanations(card, scene) {
  return {
    ...card,
    explanation: explainCommand(card, scene)
  };
}
__name(updateExplanations, "updateExplanations");
function getCardInstance(id, characterUid) {
  return {
    ...cardDefinitionsMap[id],
    uid: `${id}-${makeRandId()}`,
    characterUid,
    explanation: "error!"
  };
}
__name(getCardInstance, "getCardInstance");
function makeRandId() {
  return srandom().toString().slice(2);
}
__name(makeRandId, "makeRandId");
function getCardClass(id) {
  return cardDefinitionsMap[id].characterClass;
}
__name(getCardClass, "getCardClass");

// game/gameState/battle/cards/drawNewHand.ts
var import_lodash21 = require("lodash");
function drawNewHand(scene) {
  drawCards(scene, scene.get("handSize"));
  activateSouvenirs("postDrawHand", scene);
  activateTalents({ scene, key: "postDrawHand" });
  updateHand(scene);
  scene.set("handSize", scene.get("baseHandSize"));
}
__name(drawNewHand, "drawNewHand");
var drawCards = /* @__PURE__ */ __name((scene, numCards) => {
  for (let i = 0; i < numCards; i++) {
    drawCard(scene);
  }
}, "drawCards");
var drawCard = /* @__PURE__ */ __name((scene, hand, draw2, discard3) => {
  if (!hand || !draw2 || !discard3)
    ({ hand, draw: draw2, discard: discard3 } = scene.get("cards"));
  let drawKey = Object.keys(draw2)[0];
  if (!drawKey) {
    shuffleDiscard(scene);
    ({ hand, draw: draw2, discard: discard3 } = scene.get("cards"));
    drawKey = Object.keys(draw2)[0];
    if (!drawKey)
      return false;
  }
  let nextCard = draw2[drawKey];
  nextCard = activateTalentsData({
    scene,
    key: "drawCardPreAdd",
    data: nextCard
  });
  hand = { ...hand, [drawKey]: nextCard };
  draw2 = (0, import_lodash21.omit)(draw2, drawKey);
  scene.set(["cards", "hand"], hand);
  scene.set(["cards", "draw"], draw2);
  activateSouvenirs("drawCard", scene);
  activateTalents({
    scene,
    key: "drawCard",
    extra: { card: nextCard }
  });
  return nextCard;
}, "drawCard");
var shuffleDiscard = /* @__PURE__ */ __name((scene) => {
  let { hand, draw: draw2, discard: discard3 } = scene.get("cards");
  draw2 = shufflePile(discard3);
  discard3 = {};
  scene.set(["cards", "draw"], draw2);
  scene.set(["cards", "discard"], discard3);
  activateSouvenirs("shuffleDiscard", scene);
  activateTalents({ scene, key: "shuffleDiscard" });
}, "shuffleDiscard");

// game/characterGeneration/data/util.ts
var getRand = /* @__PURE__ */ __name(() => typeof global !== "undefined" && global.srandom ? global.srandom() : Math.random(), "getRand");
var randomInteger = /* @__PURE__ */ __name((min, max) => {
  return Math.floor(getRand() * (max - min + 1)) + min;
}, "randomInteger");
var rollNumber = /* @__PURE__ */ __name(() => {
  return randomInteger(1, 1e4);
}, "rollNumber");
var randomValue = /* @__PURE__ */ __name((list) => {
  const idx = randomInteger(0, list.length - 1);
  return list[idx];
}, "randomValue");
var rollWeights = /* @__PURE__ */ __name((pdfMap) => {
  const roll = rollNumber();
  for (const [value, weight] of Object.entries(pdfMap)) {
    if (roll <= weight)
      return value;
  }
  return -1;
}, "rollWeights");

// game/gameState/battle/Talents.ts
var getTurnCards = /* @__PURE__ */ __name((scene, turnCount, characterUid) => {
  return scene.get("cardsPlayedThisRoom").filter(
    (card) => card.turnCount == turnCount && (!characterUid || card.characterUid == characterUid)
  );
}, "getTurnCards");
var talentMap2 = {
  quickToPickAFight: {
    id: "quickToPickAFight",
    name: `Quick To Pick A Fight`,
    description: "At the start of your turn, if your hand has no attack cards, draw cards until you draw an attack card. (Unique)",
    unique: true,
    equippable: true,
    on: {},
    on2: {
      postDrawHand: ({ scene }) => {
        while (Object.keys(scene.get("cards", "draw")).length && !Object.values(scene.get("cards", "hand")).some(
          (card) => card.type === "attack"
        )) {
          logger.info("no attack");
          drawCard(scene);
        }
      }
    }
  },
  pressurePointSpecialist: {
    id: "pressurePointSpecialist",
    name: `Pressure Point Specialist`,
    description: "The Critical Hit chance of this character is increased by 5%.",
    equippable: true,
    on: {},
    on2: {
      critChance: ({ data: critChance }) => critChance + 0.05
    }
  },
  nativeOfHooligansBluff: {
    id: "nativeOfHooligansBluff",
    name: `Native of Hooligan's Bluff`,
    description: `Increase this character's stats by 5% in Hooligan's Bluff.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!(scene.get("dungeonName") === "Hooligans Bluff"))
          return;
        if (!souvenir.characterUid)
          return;
        let calculatedStats = scene.select(
          "allCharacters",
          souvenir.characterUid,
          "calculatedStats"
        );
        let hp = calculatedStats.get("constitution");
        const stats = {
          strengthMultiplicand: 0.05,
          magicMultiplicand: 0.05,
          defenseMultiplicand: 0.05,
          constitutionMultiplicand: 0.05
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
        let hpNew = calculatedStats.get("constitution");
        healCharacter(scene, souvenir.characterUid, hpNew - hp, false);
      }
    }
  },
  excellentCook: {
    id: "excellentCook",
    name: `Excellent Cook`,
    description: `Rest sites heal your party for 8% more health.`,
    equippable: true,
    on: {},
    on2: {
      enterRestSite: ({ scene }) => {
        for (const cm of getLivingPcs(scene.get())) {
          healCharacter(scene, cm.uid, 0.08, true);
        }
      }
    }
  },
  fisherman: {
    id: "fisherman",
    name: `Fisherman`,
    description: `Draw an additional card and heal all party members for 2% of their maximum health at the start of your third turn.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene }) => {
        if (scene.get("turnCount") != 3)
          return;
        drawCard(scene);
        for (const cm of getLivingPcs(scene.get())) {
          healCharacter(scene, cm.uid, 0.02, true);
        }
      }
    }
  },
  alwaysPackSnacks: {
    id: "alwaysPackSnacks",
    name: `alwaysPackSnacks`,
    description: `Event rooms heal your party for 3% of their maximum health`,
    equippable: true,
    on: {},
    on2: {
      enterEventSite: ({ scene }) => {
        const healAmount = 0.03;
        for (const cm of getLivingPcs(scene.get())) {
          healCharacter(scene, cm.uid, healAmount, true);
        }
      }
    }
  },
  goodImmuneSystem: {
    id: "goodImmuneSystem",
    name: `Good Immune System`,
    description: `This character reduces all Poison and Bleed damage by 50%.`,
    equippable: true,
    on: {},
    on2: {
      preEffectDamage: ({ data }) => data * 0.5
    }
  },
  mildlyLucky: {
    id: "mildlyLucky",
    name: `Mildly Lucky`,
    description: "+2% chance of Critical Hit.  +1% chance of Dodge.  If this character would die, 33% they are reduced to 1 Health instead (can only successfully trigger once per run)",
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          critChanceAddend: 0.02,
          dodgeChanceAddend: 0.01
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      },
      postDie: ({ scene, souvenir, idx, target }) => {
        if ((souvenir.counter ?? 0) > 0)
          return;
        const roll = Math.random();
        if (roll < 1 / 3) {
          scene.set(["allCharacters", target.uid, "health"], 1);
          scene.apply(
            ["souvenirs", idx, "counter"],
            (s2) => (s2 ?? 0) + 1
          );
        }
      }
    }
  },
  experiencedForager: {
    id: "experiencedForager",
    name: `Experienced Forager`,
    description: "All party members heal for 2% of their maximum health after every combat.",
    equippable: true,
    on: {},
    on2: {
      battleEnd: ({ scene }) => {
        for (const cm of getLivingPcs(scene.get())) {
          healCharacter(scene, cm.uid, 0.02, true);
        }
      }
    }
  },
  bornSurvivor: {
    id: "bornSurvivor",
    name: `Born Survivor`,
    description: "The first time this character would die, reduce their health to 1 instead.",
    equippable: true,
    on: {},
    on2: {
      postDie: ({ scene, souvenir, idx, target }) => {
        if ((souvenir.counter ?? 0) > 0)
          return;
        scene.set(["allCharacters", target.uid, "health"], 1);
        incrementCounter(scene, idx);
      }
    }
  },
  secretVampire: {
    id: "secretVampire",
    name: `Secret Vampire`,
    description: "Whenever this character plays an attack card that destroys an enemy, they heal for 10% of their maximum health.",
    equippable: true,
    on: {},
    on2: {
      postKill: ({ scene, souvenir, target }) => {
        if (!souvenir.characterUid)
          return;
        if (target.isPc)
          return;
        healCharacter(scene, souvenir.characterUid, 0.1, true);
      }
    }
  },
  marathonRunner: {
    id: "marathonRunner",
    name: `Marathon Runner`,
    description: "After the first 5 combats in a dungeon, increase this characters stats by 10%.",
    equippable: true,
    on: {},
    on2: {
      battleEnd: ({ scene, souvenir, idx }) => {
        souvenir = incrementCounter(scene, idx);
        if (souvenir.counter == 5) {
          if (!souvenir.characterUid)
            return;
          let calculatedStats = scene.select(
            "allCharacters",
            souvenir.characterUid,
            "calculatedStats"
          );
          let hp = calculatedStats.get("constitution");
          const stats = {
            strengthMultiplicand: 0.1,
            magicMultiplicand: 0.1,
            defenseMultiplicand: 0.1,
            constitutionMultiplicand: 0.1
          };
          applyStatModifiers({
            scene,
            uids: [souvenir.characterUid],
            stats,
            expiration: "run"
          });
          let hpNew = calculatedStats.get("constitution");
          healCharacter(
            scene,
            souvenir.characterUid,
            hpNew - hp,
            false
          );
        }
      }
    }
  },
  bigGameHunter: {
    id: "bigGameHunter",
    name: `Big Game Hunter`,
    description: "This character deals 10% more damage against Bosses.",
    equippable: true,
    on: {},
    on2: {
      damageGiveMultiply: ({ data, scene }) => {
        if (scene.get("currentRoom", "category") === "bosses")
          return data + 0.1;
        return data;
      }
    }
  },
  bully: {
    id: "bully",
    name: `Bully`,
    description: "Attack cards played by this character deal 5%+1 more damage against enemies with less health than them.",
    equippable: true,
    on: {},
    on2: {
      damageGiveAdd: ({ souvenir, target, attacker, data }) => {
        if (souvenir.characterUid != attacker.uid)
          return data;
        if (!attacker || !target)
          return data;
        return attacker.health > target.health ? data + 1 : data;
      },
      damageGiveMultiply: ({ souvenir, target, attacker, data }) => {
        if (souvenir.characterUid != attacker.uid)
          return data;
        if (!attacker || !target)
          return data;
        return attacker.health > target.health ? data + 0.05 : data;
      }
    }
  },
  stealthy: {
    id: "stealthy",
    name: `stealthy`,
    description: `Increase this character's Dodge chance by 4%.  Slightly decrease this character's Taunt (decrease it by -5, hidden)`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          dodgeChanceAddend: 0.04
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      },
      tauntBase: ({ data }) => {
        return data - 5;
      }
    }
  },
  frontLineFighter: {
    id: "frontLineFighter",
    name: `frontLineFighter`,
    description: `Increase this character's Defense and Strength by +4%.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          defenseMultiplicand: 0.04,
          strengthMultiplicand: 0.04
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      }
    }
  },
  levelHeaded: {
    id: "levelHeaded",
    name: `levelHeaded`,
    description: `Increase this character's Health by +6%.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        let calculatedStats = scene.select(
          "allCharacters",
          souvenir.characterUid,
          "calculatedStats"
        );
        let hp = calculatedStats.get("constitution");
        const stats = {
          constitutionMultiplicand: 0.06
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
        let hpNew = calculatedStats.get("constitution");
        healCharacter(scene, souvenir.characterUid, hpNew - hp, false);
      }
    }
  },
  greatGuy: {
    id: "greatGuy",
    name: `greatGuy`,
    description: `Everyone agrees that this Kaiju is extremely nice.`,
    equippable: true,
    on: {}
  },
  ADHD: {
    id: "ADHD",
    name: `ADHD`,
    description: `Draw an additional card at the beginning of every other turn. If you don't play any cards from this character in a turn, this character gains Fatigue (1) at the start of their next turn.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const turnCount = scene.get("turnCount");
        if (turnCount == 1)
          return;
        if (turnCount % 2 == 0)
          drawCard(scene);
        const lastTurnCards = getTurnCards(
          scene,
          turnCount - 1,
          souvenir.characterUid
        );
        if (lastTurnCards.length == 0) {
          applyEffect(
            scene,
            [souvenir.characterUid],
            "tiredDebuff",
            1
          );
        }
      }
    }
  },
  veryLoyal: {
    id: "veryLoyal",
    name: `Very Loyal`,
    description: `The first time this character plays a defense card that targets an ally each turn, their target gains an extra +20% block.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      blockGiveAdd: ({ scene, data, souvenir, cm, idx, target }) => {
        if (!cm)
          return data;
        if ((souvenir.counter ?? 0) > 0)
          return data;
        if (target.uid == souvenir.characterUid)
          return data;
        data += cm.calculatedStats.defense * 0.2;
        incrementCounter(scene, idx);
        return data;
      }
    }
  },
  pillager: {
    id: "pillager",
    name: `Pillager`,
    description: `Whenever a character in your party destroys an enemy, all friendly characters gain +15% block.`,
    equippable: true,
    on: {},
    on2: {
      postKillGeneral: ({ scene, souvenir, target }) => {
        if (!souvenir.characterUid)
          return;
        if (target.isPc)
          return;
        const cm = scene.get("allCharacters", souvenir.characterUid);
        const block = 0.15 * cm.calculatedStats.defense;
        const targetUids = getLivingPcs(scene.get()).map((cm2) => cm2.uid);
        applyBlocks({ scene, block, fromUid: null, targetUids });
      }
    }
  },
  giantSlayer: {
    id: "giantSlayer",
    name: `Giant Slayer`,
    description: `+15% Critical Hit chance vs Bosses.  The first attack card this character targets a boss with per combat automatically crits.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      critChance: ({ scene, souvenir, idx, data: critChance }) => {
        if (scene.get("currentRoom", "category") != "bosses")
          return critChance;
        if ((souvenir.counter ?? 0) > 0)
          return critChance + 1;
        incrementCounter(scene, idx);
        return critChance + 0.15;
      }
    }
  },
  eternalOptimist: {
    id: "eternalOptimist",
    name: `Eternal Optimist`,
    description: `This character starts all Boss Fights and Elite encounters with Courageous (3).`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        if (scene.get("currentRoom", "category") == "bosses")
          applyEffect(
            scene,
            [souvenir.characterUid],
            "courageousBuff",
            3
          );
      }
    }
  },
  emotionallySensitive: {
    id: "emotionallySensitive",
    name: `Emotionally Sensitive`,
    description: `This character's Magic and Strength are increased by 8%+1.  Their Defense and Health are decreased by 4%.  Critical hits by this character deal an additional +25% damage.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir, idx }) => {
        souvenir = incrementCounter(scene, idx);
        if (!souvenir.characterUid)
          return;
        const stats = {
          strengthMultiplicand: 0.08,
          magicMultiplicand: 0.08,
          defenseMultiplicand: -0.04,
          constitutionMultiplicand: -0.04
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      },
      critDamageMultiply({ data }) {
        return data + 0.25;
      }
    }
  },
  distinctiveRibbit: {
    id: "distinctiveRibbit",
    name: `Distinctive Ribbit`,
    description: `Increase the critical hit chance of allies by 3%.`,
    equippable: true,
    on: {},
    on2: {
      critChanceGeneral: ({ souvenir, data: critChance, attacker }) => {
        if (attacker.uid == souvenir.characterUid)
          return critChance;
        return critChance + 0.03;
      }
    }
  },
  slipperyWhenWet: {
    id: "slipperyWhenWet",
    name: `slipperyWhenWet`,
    description: `If this character ends their turn with 0 block, they gain +20% block.`,
    equippable: true,
    on: {},
    on2: {
      turnEnd: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const cm = scene.get("allCharacters", souvenir.characterUid);
        if (cm.block == 0) {
          const block = cm.calculatedStats.defense * 0.2;
          applyBlocks({
            fromUid: null,
            targetUids: [cm.uid],
            scene,
            block
          });
        }
      }
    }
  },
  poisonousBlood: {
    id: "poisonousBlood",
    name: `Poisonous Blood`,
    description: `If this character is attacked by an enemy while they have Bleed, apply Poison (20%) to the attacker.`,
    equippable: true,
    on: {},
    on2: {
      damageReceive: ({ scene, cm, target, attacker, data: damage }) => {
        if (cm && cm.effects.find(
          (effect) => effect.id === "bleedDebuff" && effect.counter > 0
        ) != void 0) {
          applyEffect(
            scene,
            [attacker.uid],
            "poisonedDebuff",
            cm.calculatedStats.magic * 0.2
          );
        }
        return damage;
      }
    }
  },
  stickyHands: {
    id: "stickyHands",
    name: `Sticky Hands`,
    description: `Randomly keep one card in your hand at the end of your turn. (Unqiue)`,
    unique: true,
    equippable: true,
    on: {},
    on2: {
      preDiscardAtTurnEnd({ scene, data: keep, piles }) {
        const hand = Object.values(piles.hand);
        const card = randomValue(hand);
        if (card)
          keep.push(card.uid);
        return keep;
      }
    }
  },
  wiseCroaker: {
    id: "wiseCroaker",
    name: `Wise Croaker`,
    description: `If you don't play any cards from this Kaiju in a turn, draw an additional card and this Kaiju gains Strongblock (1) at the beginning of your next turn.`,
    equippable: true,
    on: {},
    on2: {
      turnStart({ scene, souvenir }) {
        if (!souvenir.characterUid)
          return;
        const turnCount = scene.get("turnCount");
        if (turnCount == 1)
          return;
        const lastTurnCards = getTurnCards(
          scene,
          turnCount - 1,
          souvenir.characterUid
        );
        if (lastTurnCards.length == 0) {
          drawCard(scene);
          applyEffect(
            scene,
            [souvenir.characterUid],
            "strongblockBuff",
            1
          );
        }
      }
    }
  },
  excellentStompDancer: {
    id: "excellentStompDancer",
    name: `Excellent Stomp Dancer`,
    description: `This Warhog's War Stomp card deals an additional 25% damage.`,
    equippable: true,
    on: {},
    on2: {
      damageGiveMultiply: ({ souvenir, data, attacker, cardId }) => {
        if (souvenir.characterUid != attacker.uid)
          return data;
        if (cardId != "warStomp")
          return data;
        return data + 0.25;
      }
    }
  },
  thickBoned: {
    id: "thickBoned",
    name: `Thick Boned`,
    description: `Whenever you draw a card for this character, they gain +6% block.`,
    equippable: true,
    on: {},
    on2: {
      drawCard: ({ scene, souvenir, card }) => {
        if (souvenir.characterUid == card.characterUid) {
          const block = scene.get(
            "allCharacters",
            souvenir.characterUid,
            "calculatedStats"
          ).defense * 0.06;
          applyBlocks({
            scene,
            block,
            fromUid: null,
            targetUids: [souvenir.characterUid]
          });
        }
      }
    }
  },
  shortTempered: {
    id: "shortTempered",
    name: `Short Tempered`,
    description: `This character starts every room with Berserk (1) and Resistant (1).`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        applyEffect(scene, [souvenir.characterUid], "berserkBuff", 1);
        applyEffect(scene, [souvenir.characterUid], "guardedBuff", 1);
      }
    }
  },
  ironSkinned: {
    id: "ironSkinned",
    name: `Iron Skinned`,
    description: `This character is immune to Poison damage and Bleed.`,
    equippable: true,
    on: {},
    on2: {
      preEffectDamage: ({ souvenir, target, data, damageType }) => {
        if (souvenir.characterUid != target.uid)
          return data;
        if (damageType == "poison" || damageType == "bleed")
          return 0;
        return data;
      }
    }
  },
  bigYawn: {
    id: "bigYawn",
    name: `Big Yarn`,
    description: `The first Defense card this character plays per room applies Tired (1) to all enemies.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      playCard: ({ scene, souvenir, idx, card }) => {
        if (souvenir.characterUid != card.characterUid)
          return;
        if ((souvenir.counter ?? 0) > 0)
          return;
        if (card.type === "defense") {
          incrementCounter(scene, idx);
          const npcs = getLivingNpcs(scene.get()).map((npc) => npc.uid);
          applyEffect(scene, npcs, "tiredDebuff", 1);
        }
      }
    }
  },
  apexOmnivore: {
    id: "apexOmnivore",
    name: `Apex Omnivore`,
    description: `Critical Hits from this character have Piercing.`,
    equippable: true,
    on: {},
    on2: {
      piercingCheck: ({
        attacker,
        souvenir,
        data: piercing,
        isCritical
      }) => {
        if (souvenir.characterUid != attacker.uid)
          return piercing;
        if (isCritical)
          return true;
        return piercing;
      }
    }
  },
  veryLarge: {
    id: "veryLarge",
    name: `Very Large`,
    description: `The Health of this character is increased by 7.5%.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        let calculatedStats = scene.select(
          "allCharacters",
          souvenir.characterUid,
          "calculatedStats"
        );
        let hp = calculatedStats.get("constitution");
        const stats = {
          constitutionMultiplicand: 0.075
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
        let hpNew = calculatedStats.get("constitution");
        healCharacter(scene, souvenir.characterUid, hpNew - hp, false);
      }
    }
  },
  veryVeryLarge: {
    id: "veryVeryLarge",
    name: `Very, Very, Large`,
    description: `The Health of this character is increased by 15%.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        let calculatedStats = scene.select(
          "allCharacters",
          souvenir.characterUid,
          "calculatedStats"
        );
        let hp = calculatedStats.get("constitution");
        const stats = {
          constitutionMultiplicand: 0.15
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
        let hpNew = calculatedStats.get("constitution");
        healCharacter(scene, souvenir.characterUid, hpNew - hp, false);
      }
    }
  },
  reinforcedHooves: {
    id: "reinforcedHooves",
    name: `Reinforced Hooves`,
    description: `The Strength of this character is increased by 10%.`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          strengthMultiplicand: 0.1
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      }
    }
  },
  bigNapper: {
    id: "bigNapper",
    name: `Big Napper`,
    description: `If you don't play any cards from this Kaiju in a turn, this Kaiju heals for 6% of their maximum health.`,
    equippable: true,
    on: {},
    on2: {
      turnEnd: ({ scene, souvenir, cm }) => {
        if (!souvenir.characterUid)
          return;
        const turnCount = scene.get("turnCount");
        const lastTurnCards = getTurnCards(
          scene,
          turnCount,
          souvenir.characterUid
        );
        if (lastTurnCards.length == 0) {
          healCharacter(scene, souvenir.characterUid, 0.06, true);
        }
      }
    }
  },
  disarminglyCute: {
    id: "disarminglyCute",
    name: `Disarmingly Cute`,
    description: `Every time this character plays an Attack Card, 20% chance of applying Fatigue (1) to enemies targeted.`,
    equippable: true,
    on: {},
    on2: {
      playCard: ({ scene, souvenir, idx, card, targetUids }) => {
        if (souvenir.characterUid != card.characterUid)
          return;
        if (card.type !== "attack")
          return;
        const roll = Math.random();
        if (roll < 0.2) {
          applyEffect(scene, targetUids, "tiredDebuff", 1);
        }
      }
    }
  },
  anxietyRiddled: {
    id: "anxietyRiddled",
    name: `Anxiety Riddled`,
    description: `The first time this character discards a card per room, draw 1.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      discardCard: ({ scene, souvenir, idx }) => {
        if ((souvenir.counter ?? 0) > 0)
          return;
        incrementCounter(scene, idx);
        drawCard(scene);
      }
    }
  },
  extraBlubbery: {
    id: "extraBlubbery",
    name: `Extra Blubbery`,
    description: `Whenever this character plays a card, they gain 10% block.`,
    equippable: true,
    on: {},
    on2: {
      playCard: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const character = scene.get(
          "allCharacters",
          souvenir.characterUid
        );
        const block = character.calculatedStats.defense * 0.1;
        applyBlocks({
          scene,
          block,
          fromUid: null,
          targetUids: [souvenir.characterUid]
        });
      }
    }
  },
  headEmpty: {
    id: "headEmpty",
    name: `Head Empty`,
    description: `If you don't play any cards from this character in a turn, they gain +100% block.`,
    equippable: true,
    on: {},
    on2: {
      turnEnd: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const turnCount = scene.get("turnCount");
        const lastTurnCards = getTurnCards(
          scene,
          turnCount,
          souvenir.characterUid
        );
        if (lastTurnCards.length == 0) {
          const character = scene.get(
            "allCharacters",
            souvenir.characterUid
          );
          const block = character.calculatedStats.defense;
          applyBlocks({
            scene,
            block,
            fromUid: null,
            targetUids: [souvenir.characterUid]
          });
        }
      }
    }
  },
  doingTheirBest: {
    id: "doingTheirBest",
    name: `Doing Their Best`,
    description: `If you play 3 cards owned by this character in one turn, remove all debuffs from this Kaiju.  They gain +50% block.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      playCard: ({ scene, card, souvenir, idx }) => {
        if (souvenir.characterUid != card.characterUid)
          return;
        souvenir = incrementCounter(scene, idx);
        if (!souvenir.characterUid)
          return;
        if (souvenir.counter == 3) {
          const character = scene.get(
            "allCharacters",
            souvenir.characterUid
          );
          const block = character.calculatedStats.defense * 0.5;
          applyBlocks({
            scene,
            block,
            fromUid: null,
            targetUids: [souvenir.characterUid]
          });
        }
      }
    }
  },
  accidentProne: {
    id: "accidentProne",
    name: `AccidentProne`,
    description: `Whenever a card from this character with Brittle breaks, apply Bleed (1) to all enemies.`,
    equippable: true,
    on: {},
    on2: {
      brittleBreak: ({ scene, souvenir, card }) => {
        if (!card)
          return;
        if (souvenir.characterUid != card.characterUid)
          return;
        const npcs = getLivingNpcs(scene.get()).map((npc) => npc.uid);
        applyEffect(scene, npcs, "bleedDebuff", 1);
      }
    }
  },
  peppy: {
    id: "peppy",
    name: `Peppy`,
    description: `The first time per room this character plays 3 cards in 1 turn, gain 1 energy.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      turnStart: ({ scene, souvenir, idx }) => {
        if (souvenir.counter == -1)
          return;
        setCounter(scene, idx, 0);
      },
      playCard: ({ scene, souvenir, idx, card }) => {
        if ((souvenir.counter ?? 0) == -1)
          return;
        if (souvenir.characterUid != card.characterUid)
          return;
        souvenir = incrementCounter(scene, idx);
        if (souvenir.counter == 3) {
          setCounter(scene, idx, -1);
          scene.apply("energy", (e) => e + 1);
        }
      }
    }
  },
  partyBouncer: {
    id: "partyBouncer",
    name: `Party Bouncer`,
    description: `Whenever this character plays a card with Redirect, they gain +15% block and Courageous (1).`,
    equippable: true,
    on: {}
  },
  townMilitiaMember: {
    id: "townMilitiaMember",
    name: `Town Militia Member`,
    description: `This character's Basic Attack deals an additional +25%.`,
    equippable: true,
    on: {},
    on2: {
      damageGiveMultiply: ({ scene, souvenir, cardId, data }) => {
        if (!cardId)
          return data;
        const card = scene.get("cards", "hand", cardId);
        if (souvenir.characterUid != card.characterUid)
          return data;
        if (card.id.startsWith("basicAttack"))
          return data + 0.25;
        return data;
      }
    }
  },
  barbarian: {
    id: "barbarian",
    name: `Barbarian`,
    description: `Increase this character's Strength by 8%. Increase the damage bonus Berserk gives this character by 10%`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          strengthMultiplicand: 0.08
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      },
      damageGiveMultiply: ({ cm, data }) => {
        if (cm && cm.effects.find(
          (effect) => effect.id === "berserkBuff" && effect.counter > 0
        ) != void 0) {
          return data + 0.1;
        }
        return data;
      }
    }
  },
  veteranPitFighter: {
    id: "veteranPitFighter",
    name: `Veternal Pit Fighter`,
    description: `The first attack card this character plays per room costs 1 less energy.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      playCardPre: ({ scene, souvenir, idx, data: card }) => {
        if ((souvenir.counter ?? 0) > 0)
          return card;
        if (card.type != "attack")
          return card;
        incrementCounter(scene, idx);
        card.energy = Math.max(card.energy - 1, 0);
        return card;
      }
    }
  },
  royalGuard: {
    id: "royalGuard",
    name: `Royal Guard`,
    description: `Increase the amount of block generated by Defense cards this character plays that target allies by 15%.`,
    equippable: true,
    on: {},
    on2: {
      blockGiveMultiply: ({ souvenir, data, cm, target }) => {
        if (!cm)
          return data;
        if (cm.uid != souvenir.characterUid)
          return data;
        if (target.uid == souvenir.characterUid)
          return data;
        return data + 0.15;
      }
    }
  },
  shieldProficiency: {
    id: "shieldProficiency",
    name: `Shield Proficiency`,
    description: `Increase the amount of block generated by Defense cards this character plays by 10%.`,
    equippable: true,
    on: {},
    on2: {
      blockGiveMultiply: ({ souvenir, data, cm, target }) => {
        if (!cm)
          return data;
        if (cm.uid != souvenir.characterUid)
          return data;
        return data + 0.1;
      }
    }
  },
  intimidating: {
    id: "intimidating",
    name: `Intimidating`,
    description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Tired (2).`,
    equippable: true,
    on: {},
    on2: {
      postKill: ({ scene, cm, souvenir }) => {
        if (!cm || souvenir.characterUid != cm.uid)
          return;
        const npcs = getLivingNpcs(scene.get()).map((npc) => npc.uid);
        applyEffect(scene, npcs, "tiredDebuff", 2);
      }
    }
  },
  terrifying: {
    id: "terrifying",
    name: `Terrifying`,
    description: `Whenever this character plays a card that destroys an enemy, all other enemies gain Fatigue (1).`,
    equippable: true,
    on: {},
    on2: {
      postKill: ({ scene, cm, souvenir }) => {
        if (!cm || souvenir.characterUid != cm.uid)
          return;
        const npcs = getLivingNpcs(scene.get()).map((npc) => npc.uid);
        applyEffect(scene, npcs, "fatiguedDebuff", 1);
      }
    }
  },
  attritionFighter: {
    id: "attritionFighter",
    name: `Attrition Fighter`,
    description: `After your third turn, increase this character's Strength, Defense and Magic by 18% until the end of the room.`,
    equippable: true,
    on: {},
    on2: {
      turnEnd: ({ scene, souvenir, idx }) => {
        souvenir = incrementCounter(scene, idx);
        if (!souvenir.characterUid)
          return;
        if (souvenir.counter == 3) {
          const stats = {
            strengthMultiplicand: 0.18,
            magicMultiplicand: 0.18,
            defenseMultiplicand: 0.18
          };
          applyStatModifiers({
            scene,
            uids: [souvenir.characterUid],
            stats,
            expiration: "run"
          });
        }
      }
    }
  },
  nobleGuardian: {
    id: "nobleGuardian",
    name: `Noble Guardian`,
    description: `This character gives all other characters +15% block during the first turn of every room.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const cm = scene.get("allCharacters", souvenir.characterUid);
        if (!cm)
          return;
        const players = cm.isPc ? getLivingPcs(scene.get()) : getLivingNpcs(scene.get());
        const playerUids = players.map((p) => p.uid).filter((uid) => uid != souvenir.characterUid);
        const block = cm.calculatedStats.defense * 0.15;
        applyBlocks({
          fromUid: souvenir.characterUid,
          targetUids: playerUids,
          scene,
          block
        });
      }
    }
  },
  conduitOfChaosMagic: {
    id: "conduitOfChaosMagic",
    name: `Conduit Of Chaos Magic`,
    description: `15% chance to gain +1 energy at the start of each turn.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene }) => {
        const roll = Math.random();
        if (roll < 0.15) {
          scene.apply("energy", (e) => e + 1);
        }
      }
    }
  },
  privyToAnAncientandTerribleSecret: {
    id: "privyToAnAncientandTerribleSecret",
    name: `Privy To Ancient and Terrible Secret`,
    description: `Every time you draw a card, there is a 10% chance that cards cost will be reduced by 1 (triggers a maximum of once per room).  The Magic of this character is increased by 10%.  The Health of this character is decreased by 10%.  This character starts each room with Tired (1).`,
    equippable: true,
    on: {},
    on2: {
      acquire: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const stats = {
          magicMultiplicand: 0.1,
          constitutionMultiplicand: -0.1
        };
        applyStatModifiers({
          scene,
          uids: [souvenir.characterUid],
          stats,
          expiration: "run"
        });
      },
      battleStart: ({ scene, souvenir, idx }) => {
        setCounter(scene, idx, 0);
        if (!souvenir.characterUid)
          return;
        applyEffect(scene, [souvenir.characterUid], "tiredDebuff", 1);
      },
      drawCard: ({ scene, card, souvenir }) => {
        return;
      }
    }
  },
  legendaryFireMage: {
    id: "legendaryFireMage",
    name: `Legendary Fire Mage`,
    description: `All Attack Cards this character plays have Fire Damage.`,
    equippable: true,
    on: {},
    on2: {
      damageGiveAdd: ({ scene, souvenir, data, attacker, target }) => {
        if (souvenir.characterUid != attacker.uid)
          return data;
        if (!target)
          return data;
        applyEffect(scene, [target.uid], "fireDebuff", 1);
        return data;
      }
    }
  },
  masterOracle: {
    id: "masterOracle",
    name: `Master Oracle`,
    description: `Draw an additional card at the start of each turn. (Unique)`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene }) => {
        drawCard(scene);
      }
    }
  },
  aspiringSeer: {
    id: "aspiringSeer",
    name: `Aspiring Seer`,
    description: `Draw an additional card at the start of your first turn.  (Unique)`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene }) => {
        drawCard(scene);
      }
    }
  },
  forgetfulGenius: {
    id: "forgetfulGenius",
    name: `Forgetful Genius`,
    description: `Every time you draw a card, 10% chance to draw an additional card.`,
    equippable: true,
    on: {},
    on2: {
      drawCard: ({ scene }) => {
        const roll = Math.random();
        if (roll < 0.1)
          drawCard(scene);
      }
    }
  },
  starChartExpert: {
    id: "starChartExpert",
    name: `Star Chart Expert`,
    description: `Whenever an Attack, Defense, Utility, and Enchantment card are played in the same turn, deal 50% to all enemies.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      playCard: ({ scene, souvenir, idx }) => {
        if (!souvenir.characterUid)
          return;
        if ((souvenir.counter ?? 0) > 0)
          return;
        let hasTypes = {
          attack: false,
          defense: false,
          utility: false,
          enchantment: false
        };
        const turnCount = scene.get("turnCount");
        const turnCards = getTurnCards(scene, turnCount);
        turnCards.forEach((card) => {
          hasTypes[card.type] = true;
        });
        if (Object.values(hasTypes).every((t) => t == true)) {
          incrementCounter(scene, idx);
          const character = scene.get(
            "allCharacters",
            souvenir.characterUid
          );
          const damage = character.calculatedStats.magic * 0.5;
          getLivingNpcs(scene.get()).map((npc) => npc.uid).forEach((targetUid) => {
            applyDamage({
              scene,
              damage,
              targetUid,
              damageType: "normal"
            });
          });
        }
      }
    }
  },
  tormentedByWhispers: {
    id: "tormentedByWhispers",
    name: `Tormented by Whispers`,
    description: `When a card with Momentary is played, deal 10% damage to a random enemy. `,
    equippable: true,
    on: {},
    on2: {
      momentaryAfter: ({ scene, souvenir, card }) => {
        if (!souvenir.characterUid)
          return;
        const npc = randomValue(getLivingNpcs(scene.get()));
        if (!npc)
          return;
        const character = scene.get(
          "allCharacters",
          souvenir.characterUid
        );
        const damage = character.calculatedStats.magic * 0.1;
        applyDamage({
          scene,
          damage,
          targetUid: npc.uid,
          attackerUid: character.uid,
          damageType: "normal"
        });
        return;
      }
    }
  },
  photographicMemory: {
    id: "photographicMemory",
    name: `Photographic Memory`,
    description: `Whenever a card with Momentary is played, it has a 20% chance to be added to the discard pile instead of being removed for the room. `,
    equippable: true,
    on: {},
    on2: {
      momentaryInterrupt: ({ data: interrupt }) => {
        const roll = Math.random();
        return roll < 0.2 ? true : interrupt;
      }
    }
  },
  dirtyDealer: {
    id: "dirtyDealer",
    name: `Dirty Dealer`,
    description: `Every time a character destroys an enemy, draw a card.`,
    equippable: true,
    on: {},
    on2: {
      postKillGeneral: ({ scene }) => {
        drawCard(scene);
      }
    }
  },
  masterLooter: {
    id: "masterLooter",
    name: `Master Looter`,
    description: `After the first combat of a run, draft an additional card. (Unique)`,
    unique: true,
    equippable: true,
    on: {},
    on2: {
      lootItems: ({ scene, souvenir, idx, data: shuffledLootItems }) => {
        if ((souvenir.counter ?? 0) > 0)
          return shuffledLootItems;
        incrementCounter(scene, idx);
        shuffledLootItems.unshift({ name: "draftCard", count: 1 });
        return shuffledLootItems;
      }
    }
  },
  thrifty: {
    id: "thrifty",
    name: `Thrifty`,
    description: `The first time you discard a card per room, draw a card.`,
    equippable: true,
    on: {},
    on2: {
      battleStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      discardCard: ({ scene, souvenir, idx, card }) => {
        if ((souvenir.counter ?? 0) > 0)
          return;
        incrementCounter(scene, idx);
        drawCard(scene);
      }
    }
  },
  invigoratedbyBloodshed: {
    id: "invigoratedbyBloodshed",
    name: `Invigorated by Bloodshed`,
    description: `Whenever an enemy is destroyed, this character gains Courageous (1) and Guarded (1).`,
    equippable: true,
    on: {},
    on2: {
      postKillGeneral: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        applyEffect(scene, [souvenir.characterUid], "courageousBuff", 1);
        applyEffect(scene, [souvenir.characterUid], "guardedBuff", 1);
      }
    }
  },
  scrappyandVicious: {
    id: "scrappyandVicious",
    name: `Scrappy and Vicious`,
    description: `If you play 3 or more attack cards in a single turn, increase this character's strength by 33% until the end of the turn.`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, idx }) => {
        setCounter(scene, idx, 0);
      },
      playCard: ({ scene, souvenir, idx, card }) => {
        if (card.type === "attack") {
          souvenir = incrementCounter(scene, idx);
        }
        if (!souvenir.characterUid)
          return;
        if (souvenir.counter == 3) {
          const stats = {
            strengthMultiplicand: 0.33
          };
          applyStatModifiers({
            scene,
            uids: [souvenir.characterUid],
            stats,
            expiration: "room"
          });
        }
      }
    }
  },
  collectorOfContraband: {
    id: "collectorOfContraband",
    name: `Collector of Contraband`,
    description: `At the start of your second turn, decrease the cost of a random card in your hand to 0.`,
    equippable: true,
    on: {}
  },
  arterialArtisan: {
    id: "arterialArtisan",
    name: `Arterial Artisan`,
    description: `As long as this character is alive, enemies lose an addtional 5% max health from bleed stacks. (Unique)`,
    equippable: true,
    on: {},
    on2: {
      bleedMultiply: ({
        scene,
        data: bleedMultiplicand,
        souvenir,
        target
      }) => {
        if (!souvenir.characterUid)
          return bleedMultiplicand;
        const character = scene.get(
          "allCharacters",
          souvenir.characterUid
        );
        if (character.isPc != target.isPc) {
          return bleedMultiplicand + 0.05;
        }
        return bleedMultiplicand;
      }
    }
  },
  oneWithTheShadows: {
    id: "oneWithTheShadows",
    name: `One with The Shadowd`,
    description: `Slightly decrease this character's Taunt at the start of each turn. (Decrease it by 3).`,
    equippable: true,
    on: {},
    on2: {
      turnStart: ({ scene, souvenir }) => {
        if (!souvenir.characterUid)
          return;
        const characterCursor = scene.select(
          "allCharacters",
          souvenir.characterUid
        );
        characterCursor.apply("taunt", (t) => t - 3);
        characterCursor.apply(["calculatedStats", "taunt"], (t) => t - 3);
      }
    }
  }
};
var filterTalents = /* @__PURE__ */ __name((scene, activationKey, cm, notLiving) => {
  if (scene.get("id") != "battle")
    return [];
  const livingPcs = getLivingPcs(scene.get()).map((cm2) => cm2.uid);
  const talents = (scene.get("souvenirs") ?? []).map((souvenir, idx) => [souvenir, idx]).filter(([souvenir, idx]) => {
    souvenir = souvenir;
    return souvenir.characterUid && (notLiving || livingPcs.includes(souvenir.characterUid)) && (!cm || souvenir.characterUid == cm.uid) && talentMap2[souvenir.id]?.on2?.[activationKey];
  });
  return talents;
}, "filterTalents");
var incrementCounter = /* @__PURE__ */ __name((scene, idx) => {
  scene.apply(["souvenirs", idx, "counter"], (count) => count ? count + 1 : 1);
  return scene.get("souvenirs", idx);
}, "incrementCounter");
var setCounter = /* @__PURE__ */ __name((scene, idx, value) => {
  scene.apply(["souvenirs", idx, "counter"], (count) => value);
  return scene.get("souvenirs", idx);
}, "setCounter");
var activateTalent = /* @__PURE__ */ __name((souvenir, key, scene, idx, extra) => {
  if (!extra)
    extra = {};
  let func;
  if (func = talentMap2[souvenir.id]?.on2?.[key])
    return func({ scene, souvenir, idx, ...extra });
  return void 0;
}, "activateTalent");
var activateTalents = /* @__PURE__ */ __name(({
  scene,
  key,
  cm,
  notLiving,
  extra
}) => {
  filterTalents(scene, key, cm, notLiving).forEach(([souvenir, idx]) => {
    activateTalent(souvenir, key, scene, idx, extra);
  });
}, "activateTalents");
var activateTalentsData = /* @__PURE__ */ __name((args) => {
  let { scene, key, data, cm, notLiving, extra } = args;
  if (!extra)
    extra = {};
  filterTalents(scene, key, cm, notLiving).forEach(([souvenir, idx]) => {
    const tmp = activateTalent(souvenir, key, scene, idx, {
      data,
      cm,
      ...extra
    });
    if (tmp !== void 0)
      data = tmp;
  });
  return data;
}, "activateTalentsData");

// game/gameState/battle/characters/characterGetters.ts
function getLivingNpcUids(scene) {
  return getLivingNpcs(scene).map((c) => c.uid);
}
__name(getLivingNpcUids, "getLivingNpcUids");
function getLivingNpcs(scene) {
  return vals(scene.allCharacters).filter(
    (c) => !c.isPc && c.health > 0
  );
}
__name(getLivingNpcs, "getLivingNpcs");
function getLivingPcUids(scene) {
  return getLivingPcs(scene).map((c) => c.uid);
}
__name(getLivingPcUids, "getLivingPcUids");
function getLivingPcs(scene) {
  return vals(scene.allCharacters).filter((c) => c.isPc && c.health > 0);
}
__name(getLivingPcs, "getLivingPcs");
function getDeadPcs(scene) {
  return vals(scene.allCharacters).filter((c) => c.isPc && c.health <= 0);
}
__name(getDeadPcs, "getDeadPcs");
function isAlive(scene, uid) {
  return scene.allCharacters[uid]?.health > 0;
}
__name(isAlive, "isAlive");
function isPc(scene, uid) {
  return scene.allCharacters[uid].isPc;
}
__name(isPc, "isPc");
function getCharacterMeta(scene, uid) {
  return scene.get("allCharacters", uid) || scene.get("selectedCharacters")?.find((c) => c?.uid === uid);
}
__name(getCharacterMeta, "getCharacterMeta");
var targetEnemies = /* @__PURE__ */ __name((scene, command) => {
  for (const v of scene.get("nextNpcCommands")) {
    if (v.command.characterUid == command.characterUid) {
      return v.targetUids;
    }
  }
  const targets = [];
  const taunts = Object.fromEntries(
    getLivingPcs(scene.get()).map((cm) => {
      let t = calculateTaunt(cm);
      t = activateTalentsData({
        scene,
        key: "taunt",
        data: t,
        cm
      });
      return [cm.uid, Math.max(t, 0)];
    })
  );
  const characterName = scene.get("allCharacters", command.characterUid, "id") ?? "";
  let userMessage = `acquiring targets for ${command.characterUid} ${characterName} attack ${command.id}`;
  logger.debug(
    `acquiring targets for ${command.characterUid}  ${characterName} attack ${command.id}`
  );
  let weightCdf = weightsToCDF(taunts);
  logger.debug(weightCdf);
  logger.debug(taunts);
  userMessage += `
taunts:	${JSON.stringify(
    taunts
  )}
CDF:	${JSON.stringify(weightCdf)}`;
  for (let i = 0; i < command.targetNum; i++) {
    const roll = Math.random();
    logger.debug(`rolled ${roll}`);
    userMessage += `
rolled ${roll}`;
    for (const [id, w2] of Object.entries(weightCdf)) {
      if (roll <= w2) {
        targets.push(id);
        break;
      }
    }
  }
  userMessage += `
targets: ${JSON.stringify(targets)}`;
  logger.debug(`targets: ${JSON.stringify(targets)}`);
  if (isProduction) {
    const networkEventData = {
      type: "message",
      data: userMessage
    };
    emit({ userId: scene.get("userId"), event: networkEventData });
  }
  return targets;
}, "targetEnemies");
function getCommandTargets(scene, command) {
  if (command.targetType === "enemies") {
    const targets = targetEnemies(scene, command);
    if (targets.length != command.targetNum) {
      logger.warn(
        `did not target correct number of enemies: ${targets.length} instead of ${command.targetNum}`
      );
      console.log(`targets: ${JSON.stringify(targets)}`);
    }
    return targets;
  } else if (command.targetType === "allEnemies") {
    return getLivingPcs(scene.get()).map((c) => c.uid);
  } else if (command.targetType === "allFriends") {
    return getLivingNpcs(scene.get()).map((c) => c.uid);
  } else if (command.targetType === "self") {
    return [command.characterUid];
  }
  return [];
}
__name(getCommandTargets, "getCommandTargets");

// game/gameState/battle/cards/getTargetUids.ts
function getTargetUids({
  card,
  targetUids,
  scene
}) {
  if (card.targetType === "allEnemies")
    return getLivingNpcs(scene.get()).map((npc) => npc.uid);
  if (card.targetType === "allFriends")
    return getLivingPcs(scene.get()).map((npc) => npc.uid);
  if (card.targetType === "self")
    return [card.characterUid];
  return targetUids;
}
__name(getTargetUids, "getTargetUids");

// game/gameState/battle/cards/discardUtil.ts
function discardAllCards(scene) {
  let keep = [];
  keep = activateTalentsData({
    scene,
    key: "preDiscardAtTurnEnd",
    data: keep,
    extra: { piles: scene.get("cards") }
  });
  scene.apply("cards", (cards) => {
    const newCards = { ...cards };
    newCards.discard = { ...newCards.discard, ...newCards.hand };
    newCards.hand = {};
    return newCards;
  });
  putInHandFromDiscard(scene, keep);
}
__name(discardAllCards, "discardAllCards");
var putInHandFromDiscard = /* @__PURE__ */ __name((scene, selected) => {
  scene.apply("cards", (cards) => {
    const newCards = { ...cards };
    selected.forEach((carduid) => {
      try {
        newCards.hand = {
          ...newCards.hand,
          [carduid]: newCards.discard[carduid]
        };
        newCards.discard = Object.fromEntries(
          Object.entries(newCards.discard).filter(
            ([uid, card]) => uid != carduid
          )
        );
      } catch (e) {
        logger.error(e);
      }
    });
    return newCards;
  });
}, "putInHandFromDiscard");
function discard({
  cardUids,
  scene
}) {
  scene.apply(
    "cards",
    (0, import_immer10.default)((cards) => {
      for (const uid of cardUids) {
        const card = cards.hand[uid];
        if (card == null) {
          throw Error("card not in hand: " + uid);
        }
        delete cards.hand[uid];
        cards.discard[uid] = card;
      }
    })
  );
}
__name(discard, "discard");
function discardBeforeTurnEnd({
  cardUids,
  scene
}) {
  discard({ cardUids, scene });
  const discardPile = scene.get("cards", "discard");
  for (const uid of cardUids) {
    const card = discardPile[uid];
    activeOnDiscardActions(card, scene);
    activateTalents({ scene, key: "discardCard", extra: { card } });
  }
  activateSouvenirs("discardEnd", scene);
  activateTalents({ scene, key: "discardEnd" });
}
__name(discardBeforeTurnEnd, "discardBeforeTurnEnd");
function activeOnDiscardActions(card, scene) {
  if (!card.on?.discard)
    return;
  interpretCommand({
    command: {
      characterUid: card.characterUid,
      id: card.id,
      name: card.name,
      uid: card.uid,
      actions: card.on.discard,
      targetNum: card.targetNum,
      targetType: card.targetType
    },
    targetUids: getTargetUids({
      card,
      targetUids: [],
      scene
    }),
    scene
  });
}
__name(activeOnDiscardActions, "activeOnDiscardActions");

// game/gameState/battle/cards/play.ts
init_code();
function play({
  card,
  targetUids,
  scene
}) {
  scene.apply("energy", (energy) => energy - card.energy);
  interpretCommand({
    command: card,
    targetUids: getTargetUids({
      card,
      targetUids,
      scene
    }),
    scene
  });
  if (card.type == "attack") {
    scene.apply(
      ["allCharacters", card.characterUid, "taunt"],
      (t) => t + miscTauntValues["playAttack"]
    );
  }
  scene.apply("cardsPlayedThisRoom", (cards) => [
    ...cards,
    {
      ...card,
      turnCount: scene.get("turnCount"),
      timestamp: new Date().toISOString()
    }
  ]);
  scene.apply("cardsPlayedThisTurn", (cards) => [
    ...cards,
    {
      uid: card.uid,
      characterUid: card.characterUid,
      turnCount: scene.get("turnCount"),
      timestamp: new Date().toISOString()
    }
  ]);
}
__name(play, "play");

// game/gameState/battle/cards/putAllCardsInDrawPile.ts
var import_immer11 = __toESM(require("immer"));
function putAllCardsInDrawPile(scene) {
  scene.apply(
    "cards",
    (0, import_immer11.default)((cards) => {
      cards.draw = shufflePile({
        ...cards.draw,
        ...cards.hand,
        ...cards.discard
      });
      cards.hand = {};
      cards.discard = {};
    })
  );
}
__name(putAllCardsInDrawPile, "putAllCardsInDrawPile");

// game/gameState/battle/cards/clearRoomCardModifiers.ts
init_code();
init_rulebook2();
var removeAfterRoom = ["hypnotized"];
function clearRoomCardModifiers(scene) {
  putAllCardsInDrawPile(scene);
  scene.apply("cards", (piles) => {
    let draw2 = { ...piles.draw, ...piles.removedRoom };
    draw2 = Object.fromEntries(
      Object.entries(draw2).filter(
        ([_2, card]) => removeAfterRoom.includes(card.id) == false
      )
    );
    undoDwindle(draw2);
    return {
      ...piles,
      removedRoom: {},
      draw: draw2
    };
  });
}
__name(clearRoomCardModifiers, "clearRoomCardModifiers");
function undoDwindle(pile) {
  keys(pile).forEach((cardUid) => {
    if (pile[cardUid].actions.includes("dwindle")) {
      pile[cardUid] = {
        ...pile[cardUid],
        energy: cardDefinitionsMap[pile[cardUid].id].energy
      };
    }
  });
}
__name(undoDwindle, "undoDwindle");

// game/gameState/battle/queueUtil.ts
var import_lodash22 = require("lodash");
function enqueueCommand(qc, scene) {
  scene.select("queue").apply((q2) => [...q2, qc]);
}
__name(enqueueCommand, "enqueueCommand");
function enqueueAction(args, scene) {
  const { targetType = "enemies" } = args;
  const { id = `generated-command-${(0, import_lodash22.random)(1e5, 1e6)}` } = args;
  const command = {
    description: args.description,
    command: {
      id,
      name: id,
      targetNum: args.targetUids.length,
      targetType,
      actions: args.actions,
      characterUid: args.characterUid
    },
    targetUids: args.targetUids,
    turnsAway: args.turnsAway,
    side: args.side
  };
  enqueueCommand(command, scene);
}
__name(enqueueAction, "enqueueAction");
function popAndRunQueue(scene, starting) {
  const nextQ = [];
  for (const qc of scene.get("queue")) {
    if (qc.side === starting) {
      const turnsAway = qc.turnsAway - 1;
      if (turnsAway <= 0) {
        const { command, targetUids } = qc;
        logger.info(`interpreting "${JSON.stringify(command)}"`);
        interpretCommand({ command, scene, targetUids });
        if (turnsAway < 0)
          nextQ.push({ ...qc, turnsAway });
      } else {
        nextQ.push({ ...qc, turnsAway });
      }
    } else {
      nextQ.push(qc);
    }
  }
  scene.set("queue", nextQ);
}
__name(popAndRunQueue, "popAndRunQueue");

// game/gameState/battle/energy/getEnergy.ts
function getEnergy(card) {
  return card.energy;
}
__name(getEnergy, "getEnergy");

// game/gameState/battle/energy/setRoundEnergy.ts
function setRoundEnergy(scene) {
  const turnCount = scene.get("turnCount");
  let energy = 3;
  if (turnCount > 3) {
    energy += 1;
  }
  if (turnCount > 6) {
    energy += 1;
  }
  scene.set("energy", energy);
  scene.set("roundEnergy", energy);
}
__name(setRoundEnergy, "setRoundEnergy");

// game/gameState/battle/transition.ts
init_code();

// game/gameState/battle/checkWinner.ts
function checkWinner(ac) {
  if (ac.every((c) => c.isPc || c.health <= 0))
    return "PC";
  if (ac.every((c) => !c.isPc || c.health <= 0))
    return "NPC";
  return null;
}
__name(checkWinner, "checkWinner");

// game/gameState/battle/cards/getNewCardOptions.ts
init_util();
function getNewCardOptions(scene) {
  const newPile = {};
  const livingPcs = getLivingPcs(scene);
  for (let i = 0; i < livingPcs.length; i++) {
    const card = updateExplanations(newCard(livingPcs, i), toCursor(scene));
    newPile[card.uid] = card;
  }
  return newPile;
}
__name(getNewCardOptions, "getNewCardOptions");
function newCard(characters, i) {
  const character = i < characters.length ? characters[i] : characters[Math.floor(srandom() * characters.length)];
  return getCardInstance(
    getRandomCardIdForCharacter(character),
    character.uid
  );
}
__name(newCard, "newCard");

// game/gameState/battle/characters/resetClassPassives.ts
function resetClassPassives(scene) {
  resetKnightAbilityCounter(scene);
  updateWizardAbility(scene);
}
__name(resetClassPassives, "resetClassPassives");

// game/gameState/battle/characters/setAllCharactersToUnmoved.ts
init_code();
function setAllCharactersToUnmoved(scene) {
  scene.apply("allCharacters", (ac) => {
    const newAc = { ...ac };
    keys(newAc).forEach((k2) => {
      newAc[k2] = { ...newAc[k2], hasMoved: false };
    });
    return newAc;
  });
}
__name(setAllCharactersToUnmoved, "setAllCharactersToUnmoved");

// game/gameState/battle/characters/clearCharacterStatModifiers.ts
init_code();
function clearCharacterStatModifiers(scene, expiration) {
  scene.apply("allCharacters", (ac) => {
    const newAc = { ...ac };
    keys(newAc).forEach((k2) => {
      newAc[k2] = {
        ...newAc[k2],
        statModifiersMap: {
          ...newAc[k2].statModifiersMap,
          [expiration]: {}
        }
      };
    });
    return newAc;
  });
}
__name(clearCharacterStatModifiers, "clearCharacterStatModifiers");

// game/gameState/battle/characters/clearCharacterModifiersForRoom.ts
function clearCharacterModifiersForRoom(scene) {
  resetClassPassives(scene);
  setAllCharactersToUnmoved(scene);
  clearAllEffects(scene);
  clearCharacterStatModifiers(scene, "room");
  clearCharacterStatModifiers(scene, "turn");
}
__name(clearCharacterModifiersForRoom, "clearCharacterModifiersForRoom");

// game/gameState/battle/loot/calculateLoot.ts
function calculateLoot(scene, source) {
  const getRandomAmount = /* @__PURE__ */ __name(() => parseInt((Math.random() * 100).toFixed(0)), "getRandomAmount");
  let shuffledLootItems = [];
  shuffledLootItems.unshift({ name: "draftCard", count: 1 });
  shuffledLootItems = activateTalentsData({
    scene,
    key: "lootItems",
    data: shuffledLootItems
  });
  return shuffledLootItems;
}
__name(calculateLoot, "calculateLoot");

// game/gameState/battle/loot/getInitialLoot.ts
function getInitialLoot() {
  return [];
}
__name(getInitialLoot, "getInitialLoot");

// game/gameState/battle/loot/getInitialTreasureChest.ts
function getInitialTreasureChest() {
  return { level: 1, progressPct: 0, state: "pending", upgraded: false };
}
__name(getInitialTreasureChest, "getInitialTreasureChest");

// game/gameState/battle/loot/calculateChestProgress.ts
var import_lodash23 = require("lodash");
function calculateChestProgress(scene) {
  const { level: prevLevel, state: prevChestState } = scene.get("treasureChest");
  const currRunScore = scene.get("runScore").totalScore;
  const newLevel = calcNewChestLevel(currRunScore);
  const newProgressPct = calcNewProgressPct(currRunScore, newLevel);
  const upgraded = newLevel > prevLevel;
  scene.set("treasureChest", {
    level: newLevel,
    progressPct: newProgressPct,
    state: "calculated",
    upgraded
  });
  return {
    level: newLevel,
    progressPct: newProgressPct,
    state: "calculated",
    upgraded
  };
}
__name(calculateChestProgress, "calculateChestProgress");
var calcNewChestLevel = /* @__PURE__ */ __name((newRunScore) => {
  let newLevel = 0;
  (0, import_lodash23.entries)(TreasureChestLevelThreshold).forEach(([level, threshold]) => {
    if (newRunScore >= threshold) {
      newLevel = parseInt(level);
    }
  });
  return newLevel;
}, "calcNewChestLevel");
var calcNewProgressPct = /* @__PURE__ */ __name((runScore, level) => {
  if (level === MAX_CHEST_LEVEL) {
    return 1;
  }
  const currLevelThreshold = TreasureChestLevelThreshold[level];
  const nextLevelThreshold = TreasureChestLevelThreshold[level + 1];
  const nextLevelTotalRange = nextLevelThreshold - currLevelThreshold;
  const progressPct = (runScore - currLevelThreshold) / nextLevelTotalRange;
  return progressPct;
}, "calcNewProgressPct");

// game/gameState/battle/score/calculateNewRunScore.ts
init_code();
function calculateNewRunScore(scene) {
  const { attributes, currModifier } = scene.get("runScore");
  let newTotalScore = 0;
  keys(attributes).forEach((attributeName) => {
    const matchingEvent = RUN_SCORE_EVENT_MAPPING[attributeName];
    const { pointValue } = RUN_SCORE_EVENT_META[matchingEvent];
    newTotalScore += attributes[attributeName] * pointValue;
  });
  newTotalScore = newTotalScore * currModifier;
  scene.select("runScore").set("totalScore", newTotalScore);
  return newTotalScore;
}
__name(calculateNewRunScore, "calculateNewRunScore");

// game/gameState/battle/score/getInitialRunDuration.ts
function getInitialRunDuration() {
  return {
    startTime: new Date().getTime(),
    endTime: null
  };
}
__name(getInitialRunDuration, "getInitialRunDuration");

// game/gameState/battle/score/getInitialRunScore.ts
function getInitialRunScore() {
  return {
    totalScore: 0,
    currModifier: 1,
    attributes: Object.fromEntries(
      Object.keys(RUN_SCORE_EVENT_MAPPING).map((key) => [key, 0])
    )
  };
}
__name(getInitialRunScore, "getInitialRunScore");
function getRoomScoreCounter() {
  return Object.fromEntries(
    Object.keys(RUN_SCORE_EVENT_MAPPING).map((key) => [key, 0])
  );
}
__name(getRoomScoreCounter, "getRoomScoreCounter");

// game/gameState/battle/transition.ts
function maybeTransitionBattleState(scene) {
  if (scene.get("state") !== "in battle")
    return false;
  const winner = checkWinner(vals(scene.get("allCharacters")));
  const gameIsOver = !!scene.get("currentRoom").enemies.find((e) => e.boss);
  if (winner) {
    checkServerScoringEvent("CARDS_OVER_THRESHOLD", scene);
    checkServerScoringEvent("CARDS_WHOLE_PARTY", scene);
    calculateNewRunScore(scene);
    calculateChestProgress(scene);
    scene.set("numRequiredToDiscard", 0);
  }
  if (winner === "PC") {
    checkServerScoringEvent("ROOM_CLEARED", scene);
    if (gameIsOver) {
      scene.set("numRoomsPassed", scene.get("numRoomsPassed") + 1);
      checkServerScoringEvent("RUN_COMPLETED", scene);
      scene.set("state", "won");
      scene.select("runDuration").set("endTime", new Date().getTime());
    } else {
      clearCharacterModifiersForRoom(scene);
      clearRoomCardModifiers(scene);
      clearCommandHooks(scene);
      activateSouvenirs("battleEnd", scene);
      activateTalents({ scene, key: "battleEnd" });
      scene.set("state", "collecting loot");
      scene.set("lootEarned", calculateLoot(scene, "room"));
      scene.set("newCardOptions", getNewCardOptions(scene.get()));
    }
    return true;
  } else if (winner === "NPC") {
    checkServerScoringEvent("RUN_DEFEATED", scene);
    scene.set("state", "lost");
    return true;
  }
  return false;
}
__name(maybeTransitionBattleState, "maybeTransitionBattleState");

// game/gameState/battle/makeBattleState.ts
init_battle();
function makeBattleState(args) {
  const allCharacters = makeCharacters(args?.chosen);
  const playerStarts = true;
  const rooms = getDungeonRooms()[args.dungeonName ?? "Hooligans Bluff"];
  const bs = {
    userId: args.game.get("userId"),
    id: "battle",
    dungeonName: args?.dungeonName ?? "The Matcha Caves",
    turnCount: 1,
    state: "map",
    playerStarts,
    isPlayerTurn: playerStarts,
    allCharacters,
    cards: getNullCards(),
    newCardOptions: {},
    fullSelectedCharacterDecks: args.game.get(
      "scene",
      "fullSelectedCharacterDecks"
    ),
    handSize: 5,
    baseHandSize: 5,
    energy: 3,
    roundEnergy: 3,
    isSimulation: false,
    isBasicLoaded: false,
    isDeluxeLoaded: false,
    rooms,
    roomUidsVisited: [],
    numRoomsPassed: -1,
    currentRoom: rooms.root,
    nextNpcCommands: [],
    cardsPlayedThisRoom: [],
    cardsPlayedThisTurn: [],
    blocksAppliedThisTurn: [],
    stanceChangesThisRoom: [],
    damagesDealtThisTurn: [],
    damagesDealtThisRoom: [],
    damagesUnblockedThisTurn: [],
    damagesUnblockedThisRoom: [],
    cardsDrafted: [],
    scoreEventsThisTurn: getRoomScoreCounter(),
    scoreEventsThisRoom: getRoomScoreCounter(),
    queue: [],
    on: {},
    requireAction: null,
    isInMap: true,
    lootEarned: getInitialLoot(),
    lootClaimed: [],
    lootScreenHasOpened: false,
    numRequiredToDiscard: 0,
    numAllowedToKeep: 0,
    endScreenHasOpened: false,
    treasureChest: getInitialTreasureChest(),
    runScore: getInitialRunScore(),
    runDuration: getInitialRunDuration(),
    runId: args.runId || null,
    souvenirs: []
  };
  return bs;
}
__name(makeBattleState, "makeBattleState");

// game/gameState/battle/characters/npcMoves.ts
var import_sbaobab4 = require("sbaobab");
init_code();

// game/rulebook/commandDefinitionsMap.ts
init_code();

// game/rulebook/commandAliases.ts
var commandAliases_exports = {};
__export(commandAliases_exports, {
  bellowAndSing: () => bellowAndSing,
  engulf: () => engulf,
  itchyOoze: () => itchyOoze,
  meatyCharge: () => meatyCharge,
  screamAndCharge: () => screamAndCharge,
  startlingSpook: () => startlingSpook,
  surpriseAllergy: () => surpriseAllergy
});
var startlingSpook = /* @__PURE__ */ __name((x2, y2) => ({
  actions: `effect("unguarded",${x2}); effect("fatigued",${y2})`,
  id: `startlingSpook(${x2},${y2})`,
  name: `Startling Spook ${x2}-${y2}`,
  targetNum: 1,
  targetType: "enemies"
}), "startlingSpook");
var surpriseAllergy = /* @__PURE__ */ __name((x2, y2) => ({
  actions: `ifDamageDealt(deal(strength/2), chain(effect("poisoned",${x2}), effect("fatigued",${y2})))`,
  id: `surpriseAllergy(${x2},${y2})`,
  name: `Surprise Allergy ${x2}-${y2}`,
  targetNum: 1,
  targetType: "enemies"
}), "surpriseAllergy");
var itchyOoze = /* @__PURE__ */ __name((x2) => ({
  actions: `chain(deal(strength * .2), effect("poisoned", ${x2}))`,
  id: `itchyOoze(${x2})`,
  name: `Itchy Ooze ${x2}`,
  targetNum: 1,
  targetType: "enemies"
}), "itchyOoze");
var engulf = /* @__PURE__ */ __name((x2) => ({
  actions: `ifDamageDealt(deal(strength*0.${x2}), effect("stunned",1))`,
  id: `engulf(${x2})`,
  name: `Engulf ${x2}`,
  targetNum: 1,
  targetType: "enemies"
}), "engulf");
var meatyCharge = /* @__PURE__ */ __name((x2) => ({
  actions: `ifDamageDealt(deal(strength), effect("bleed",${x2}))`,
  id: `meatyCharge(${x2})`,
  name: `Meaty Charge ${x2}`,
  targetNum: 1,
  targetType: "enemies"
}), "meatyCharge");
var bellowAndSing = /* @__PURE__ */ __name((x2, y2) => ({
  actions: `ifDamageDealt(deal(strength/2), effect("debilitated",${y2})); effect("fatigued",${x2})`,
  id: `bellowAndSing(${x2},${y2})`,
  name: `Bellow and Sing ${x2}-${y2}`,
  targetNum: 1,
  targetType: "enemies"
}), "bellowAndSing");
var screamAndCharge = /* @__PURE__ */ __name((x2, y2) => ({
  actions: `deal(strength*0.${x2}); effect("unguarded",${y2})`,
  id: `screamAndCharge(${x2},${y2})`,
  name: `Scream and Charge ${x2}-${y2}`,
  targetNum: 1,
  targetType: "enemies"
}), "screamAndCharge");

// game/rulebook/commandDefinitionsMap.ts
init_rulebook();
var singleOpponentTargetCommands = {
  swordWack: ["Sword Wack", "deal(strength)"],
  rustyPokeHigh: ["Rusty Poke High", 'deal(strength); effect("fatigued", 1)'],
  rustyPokeLow: ["Rusty Poke Low", "deal(strength)"],
  basicAttack: ["Basic Attack", "deal(strength)"],
  chomp: ["Chomp", "deal(strength)"],
  itchyOozeSpecial: [
    "Itchy Ooze Special",
    'ifDamageDealt(dot(2), effect("poisoned", 1))'
  ],
  jurgenBellyFlop: ["Belly Flop", "bellyFlop(strength, 1)"],
  jurgenSitUpon: ["Sit Upon", 'deal(strength*2/3); effect("debilitated",2)'],
  matchaMash: ["Matcha Mash", "deal(strength)"],
  matchaMadness: ["Matcha Madness", 'effect("poisoned", 3, "allEnemies")'],
  matchaMeld: ["Matcha Meld", "TODO"],
  ancientStrike: [
    "Ancient Strike",
    'ifDamageDealt(deal(strength * 2), effect("stunned", 1))'
  ],
  hansMagicMissile: ["Hans Magic Missile", "deal(25)"],
  jab: ["Jab", "deal(strength * .5)"],
  strike: ["Strike", "deal(strength + 2)"]
};
var commandDefinitionsMap = {
  evisceratingSweep: {
    name: "Eviscerating Sweep",
    id: "evisceratingSweep",
    targetNum: 2,
    targetType: "enemies",
    actions: 'chain(deal(strength), effect("vulnerable", 3))'
  },
  roadClosure: {
    name: "Road Closure",
    explanation: "At the start of your next turn, draw 2 fewer cards than normal.",
    id: "roadClosure",
    targetNum: 1,
    targetType: "enemies",
    actions: "drawSizeChange(-2)"
  },
  snowFort: {
    name: "Snow Fort",
    explanation: "All enemies receive 100% block",
    id: "snowFort",
    targetNum: -1,
    targetType: "allFriends",
    actions: "addBlock(defense)"
  },
  commonCold: {
    name: "Common Cold",
    explanation: [
      "All targeted Kaiju receive <b>Fatigued</b> (1) and <b>Unguarded</b> (1).",
      "At the start of your next turn, draw 1 fewer card than normal."
    ],
    id: "commonCold",
    targetNum: -1,
    targetType: "allEnemies",
    actions: 'effect("fatigued", 1, "enemies"); effect("unguarded", 1, "enemies"); drawSizeChange(-1)'
  },
  mimicAttack: {
    id: "mimicAttack",
    name: "Mimic Attack",
    actions: "mimicAttack()",
    targetNum: 1,
    targetType: "enemies"
  },
  mimicInfectiousBite: {
    id: "mimicInfectiousBite",
    name: "Infectious Bite",
    explanation: [
      "Mimic attacks for 100%.",
      "Apply <b>Poisoned</b> equal to the amount of unblocked damage."
    ],
    actions: "infectiousBite(strength)",
    targetNum: 1,
    targetType: "enemies"
  },
  hansCurse: {
    name: "Hans Curse",
    id: "hansCurse",
    targetNum: -1,
    targetType: "allEnemies",
    actions: 'effect("fatigued", 2, "enemies"); effect("unguarded", 2, "enemies")'
  },
  hansGuards: {
    name: "Hans Guards",
    id: "hansGuards",
    targetNum: 1,
    targetType: "self",
    actions: 'summon("cultistGuard"); summon("cultistGuard")'
  },
  jurgenStampSnort: {
    name: "Stamp and Snort",
    id: "jurgenStampSnort",
    targetNum: 1,
    targetType: "self",
    actions: 'effect("stamp", 2)'
  },
  passiveBlockCmd: {
    name: "Passive Block",
    id: "passiveBlockCmd",
    targetNum: 0,
    targetType: "self",
    actions: 'effect("passiveBlock", 20)'
  },
  hansBuffBlock: {
    name: "Hans Buff Block",
    id: "hansBuffBlock",
    targetNum: 0,
    targetType: "self",
    actions: 'effect("smallDamageIncrease", 2, "friends")'
  },
  rest: {
    name: "Rest",
    id: "rest",
    targetNum: 0,
    targetType: "self",
    actions: "rest()"
  },
  block: {
    name: "Block",
    id: "block",
    targetNum: 1,
    targetType: "self",
    actions: "addBlock(defense)"
  },
  slash: {
    name: "Slash",
    id: "slash",
    targetNum: 2,
    targetType: "enemies",
    actions: "deal(strength/2)"
  },
  jurgenRollAround: {
    name: "Roll Around",
    id: "jurgenRollAround",
    targetNum: 2,
    targetType: "enemies",
    actions: "bellyFlop(strength / 2, 2)"
  },
  hypnosis: {
    actions: `chain(deal(strength / 2), effect("debilitated", 1), hypnotize(1))`,
    id: `hypnosis`,
    name: `Hypnosis`,
    targetNum: 1,
    targetType: "enemies"
  },
  psychicBolt: {
    explanation: "Attacks for 50%. Target character receives Unguarded and Fatigued (1). Adds a <b>hypnotized</b> card to your deck for this room",
    actions: `chain(deal(strength * .5), effect("unguarded", 1), effect("fatigued", 1), hypnotize(1))`,
    id: `psychicBolt`,
    name: `Psychic Bolt`,
    targetNum: 1,
    targetType: "enemies"
  },
  spiritQuest: {
    explanation: "All enemies receive Brave (2)",
    actions: `effect("brave", 2, "allFriends")`,
    id: `spiritQuest`,
    name: `Spirit Quest`,
    targetNum: -1,
    targetType: "allFriends"
  },
  snortinTime: {
    actions: `effect("unguarded", 2)`,
    id: `snortinTime`,
    explanation: "",
    name: ``,
    targetNum: -1,
    targetType: "allEnemies"
  },
  tummySlam: {
    actions: `ifDamageDealtApplyEffect(strength * .6, "tired", 2)`,
    id: `tummySlam`,
    explanation: "Attacks for 60% of Basic Attack twice. If any damage goes unblocked, the targeted character gains Tired (1).",
    name: ``,
    targetNum: 2,
    targetType: "enemies"
  },
  bigBelly: {
    actions: `addBlock(defense * .5)`,
    id: `bigBelly`,
    explanation: "Applies 50% block to all Enemies.",
    name: ``,
    targetNum: -1,
    targetType: "allFriends"
  },
  quickNap: {
    actions: `chain(effect("doubleDamage", 2), heal(health * .1))`,
    id: `quickNap`,
    explanation: [
      `Warhog Raider naps.`,
      `Warhog Raider's heals for 10% of its health and will deal double damage next turn.`
    ],
    name: ``,
    targetNum: 1,
    targetType: "self"
  },
  violentSneeze: {
    actions: `chain(deal(strength * .5), effect("vulnerable", 3))`,
    id: `violentSneeze`,
    explanation: "Deals 50% to target character, applies Vulnerable (3)",
    name: ``,
    targetNum: 2,
    targetType: "enemies"
  },
  surpriseAllergy: {
    actions: `ifDamageDealtApplyEffect(strength * .5, "poisoned", 5)`,
    id: `surpriseAllergy`,
    explanation: "Deals 50% to target character, applies 5 Poison if damage goes unblocked.",
    name: ``,
    targetNum: 1,
    targetType: "enemies"
  },
  parasiticNibble: {
    actions: `chain(deal(strength * .75), heal(constitution * .05, "self"))`,
    id: `parasiticNibble`,
    explanation: "Deal 75%.  Heal for 5% of base health.",
    name: ``,
    targetNum: 1,
    targetType: "enemies"
  },
  bigBomb1: {
    actions: `effect("chargedBomb", 2)`,
    id: `bigBomb1`,
    name: `Big Bomb`,
    targetNum: 1,
    targetType: "self"
  },
  bigBomb2: {
    actions: `deal(strength)`,
    id: `bigBomb2`,
    name: `Big Bomb`,
    targetNum: 1,
    targetType: "enemies"
  },
  bucketOfBangSnaps: {
    actions: `ifDamageDealtApplyEffect(strength * .33, "unready", 2)`,
    id: `bucketOfBangSnaps`,
    name: `Bucket of Bang Snaps`,
    targetNum: -1,
    targetType: "allEnemies"
  },
  yodel: {
    actions: `chain(
            deal(strength * .5),
            effect("yodel", 1)
        )`,
    id: `yodel`,
    name: `Bucket of Bang Snaps`,
    targetNum: 1,
    targetType: "enemies"
  },
  demolitionCharge: {
    actions: `ifDamageDealt(deal(strength), effect("unguarded", 1))`,
    id: `demolitionCharge`,
    name: `Demolition Charge`,
    targetNum: 1,
    targetType: "enemies"
  },
  fireCracker: {
    actions: `chain(deal(strength * 1.2), effect("unguarded", 2))`,
    id: `fireCracker`,
    name: `Fire Cracker`,
    targetNum: 1,
    targetType: "enemies"
  },
  grudge: {
    actions: `deal((constitution-health)*0.25)`,
    id: `grudge`,
    name: `grudge`,
    targetNum: 1,
    targetType: "enemies"
  },
  fire: {
    actions: `effect("fire", 1)`,
    id: `fire`,
    name: `Fire`,
    targetNum: -1,
    targetType: "allEnemies"
  },
  brimbone: {
    actions: `strengthy = strength * .5; ifDamageDealtApplyEffect(strengthy, "vulnerable", 1)`,
    id: `brimbone`,
    name: `Brimbone`,
    targetNum: 2,
    targetType: "enemies"
  },
  gnomeBomb: {
    actions: `ifDamageDealtApplyEffect(strength * .3, 'tired', 1)`,
    id: `gnomeBomb`,
    name: `Gnome Bomb`,
    explanation: "deal strength",
    targetNum: -1,
    targetType: "allEnemies"
  },
  ...(() => {
    const singleTargetDefinitions = {};
    keys(singleOpponentTargetCommands).forEach((commandId) => {
      const command = singleOpponentTargetCommands[commandId];
      singleTargetDefinitions[commandId] = {
        id: commandId,
        name: command[0],
        actions: command[1],
        targetNum: 1,
        targetType: "enemies"
      };
    });
    return singleTargetDefinitions;
  })()
};
function generateParameterizedCommands() {
  for (const levelObj of Object.values(getRulebook().npcStatsMapByLevel))
    for (const enemy of Object.values(levelObj))
      for (const commandId of enemy.moves) {
        if (commandId == null || !commandId.includes("("))
          continue;
        const baseId = commandId.split("(")[0];
        const args = [...commandId.matchAll(/\d+/g)].map(
          (x2) => Number(x2[0])
        );
        args.forEach((x2) => {
          if (!isFinite(x2))
            throw Error(
              `command '${commandId}' has non-finite argument '${x2}'`
            );
        });
        if (!(baseId in commandAliases_exports))
          throw Error(`'${baseId}' is not a known alias`);
        if (`${baseId}(${args})` in commandDefinitionsMap)
          continue;
        const baseCommand = commandAliases_exports[baseId];
        commandDefinitionsMap[commandId] = baseCommand(...args);
      }
}
__name(generateParameterizedCommands, "generateParameterizedCommands");
generateParameterizedCommands();

// game/gameState/battle/characters/getNpcMove.ts
init_rulebook2();
function getNpcMove(scene, attacker) {
  const enemy = getRulebook().npcStatsMapByLevel[attacker.id][attacker.level];
  const moves = enemy.moves;
  const move = moves[(scene.get("turnCount") - 1) % moves.length];
  if (move == null)
    return move;
  return {
    ...commandDefinitionsMap[move],
    characterUid: attacker.uid
  };
}
__name(getNpcMove, "getNpcMove");

// game/gameState/battle/characters/npcMoves.ts
function getNpcMoves(scene) {
  const movable = getLivingNpcs(scene.get());
  const cmds = nonNulls(movable.map((attacker) => getNpcMove(scene, attacker)));
  let simulatedScene = new import_sbaobab4.SBaobab(scene.deepClone()).select();
  return cmds.map((command) => {
    const targetUids = getCommandTargets(scene, command);
    let outcome;
    [outcome, simulatedScene] = simulateCommand({
      command,
      scene: simulatedScene,
      targetUids
    });
    return {
      command,
      targetUids,
      outcome
    };
  });
}
__name(getNpcMoves, "getNpcMoves");
function updateNpcMoves(scene) {
  scene.select("nextNpcCommands").set(getNpcMoves(scene));
}
__name(updateNpcMoves, "updateNpcMoves");

// game/gameState/entryState.ts
init_rulebook2();

// game/entryBootstrap.ts
init_rulebookUtil();
init_RulebookManager();
init_code();
function rulebookTypeForScene(sceneId) {
  if (sceneId === "worlds")
    return "world-default";
  if (sceneId === "pvp")
    return "pvp-arena";
  if (sceneId === "daily")
    return "daily";
  if (sceneId === "marketplace")
    return "default";
  return "default";
}
__name(rulebookTypeForScene, "rulebookTypeForScene");
var NUM_OF_EACH_CHAR = 5;
function initialOwnedCharacters(statsMap) {
  let oc = {};
  const characterIds = keys(statsMap);
  vals(statsMap).forEach((c, i) => {
    for (let j2 = 0; j2 < NUM_OF_EACH_CHAR; j2++) {
      const uid = `${characterIds[i]}-${j2}`;
      oc = { ...oc, [uid]: { ...c, uid, isPc: true } };
    }
  });
  return oc;
}
__name(initialOwnedCharacters, "initialOwnedCharacters");
function buildInitialGameState(args) {
  const sceneId = args.sceneId || "entry";
  const rbType = rulebookTypeForScene(sceneId);
  ensureRulebooksMigrated();
  const rb = loadRulebook(rbType);
  let base = args.existingState ? { ...args.existingState } : {};
  if (args.existingState) {
    migratePlayerGamestateSave(base);
  }
  const entry = getInitialEntryState(sceneId);
  const owned = initialOwnedCharacters(rb.playerCharacterStatsMap);
  const result = {
    ...base,
    scene: entry,
    ownedCharacters: owned,
    events: { world$: [], move$: [], DOT$: [] },
    rulebooks: getRulebookNames(),
    curRulebook: stringifyRulebook(rb),
    userId: args.userId,
    nextAction: null
  };
  return result;
}
__name(buildInitialGameState, "buildInitialGameState");

// game/gameState/entryState.ts
var allCharacterOptionsIds = [
  "frogKnight",
  "gnomeHooligan",
  "warhog",
  "notoriousBean",
  "penguinKnight",
  "skeletonWarrior",
  "matchaGelatinCube",
  "mushroomFarmer",
  "snacky",
  "jerry"
];
function getInitialEntryState(sceneId = "entry") {
  ensureRulebooksMigrated();
  const rbType = rulebookTypeForScene(sceneId);
  const rb = loadRulebook(rbType);
  const { playerCharacterStatsMap: statsMap, dungeonLevels: dungeonLevels2 } = rb;
  const selectedLevel = dungeonLevels2.find((v) => v.name === "Hooligans Bluff") ?? dungeonLevels2[0];
  return {
    id: sceneId === "worlds" || sceneId === "pvp" || sceneId === "daily" || sceneId === "marketplace" ? sceneId : "entry",
    selectedCharacters: [null, null, null],
    fullSelectedCharacterDecks: {},
    allCharacterOptions: allCharacterOptionsIds.map((id) => statsMap[id]),
    selectedLevel,
    runId: -1
  };
}
__name(getInitialEntryState, "getInitialEntryState");

// game/gameState/initial.ts
init_code();
init_rulebook2();

// game/actions/index.ts
var actions_exports = {};
__export(actions_exports, {
  activateOrb: () => activateOrb2,
  activateSouvenir: () => activateSouvenir2,
  addCardToDeck: () => addCardToDeck2,
  buyFromMarket: () => buyFromMarket,
  changeDungeon: () => changeDungeon,
  changeScene: () => changeScene,
  chooseEventResponse: () => chooseEventResponse,
  choosePlushy: () => choosePlushy,
  chooseStance: () => chooseStance2,
  collectLoot: () => collectLoot,
  discard: () => discard2,
  endTurn: () => endTurn2,
  exitDungeon: () => exitDungeon,
  finishCard: () => finishCard,
  getFreeCard: () => getFreeCard,
  getFreeSouvenir: () => getFreeSouvenir,
  getRandom: () => getRandom,
  nextRoom: () => nextRoom2,
  openEndOfRoom: () => openEndOfRoom,
  openEndOfRun: () => openEndOfRun,
  placeSelectedCharacters: () => placeSelectedCharacters,
  playCard: () => playCard2,
  removeCardForFree: () => removeCardForFree,
  resetRandomSeed: () => resetRandomSeed,
  rollKaiju: () => rollKaiju,
  rulebookAction: () => rulebookAction,
  setBattleScene: () => setBattleScene,
  setRunId: () => setRunId,
  step: () => step
});

// game/actions/internal/endNpcTurn.ts
init_util();
var DEBUG = false;
var endNpcTurn = /* @__PURE__ */ __name(({ game }) => {
  const scene = getBattleSceneIn(game);
  if (DEBUG)
    logger.info("ending NPC turn");
  scene.apply("turnCount", (c) => c + 1);
  setRoundEnergy(scene);
  clearHasMoved(scene);
  scene.set("isPlayerTurn", true);
  clearBlock(scene, "pc");
  decrementEffects(scene, "pc");
  decrementEffects(scene, "npc");
  updateWizardAbility(scene);
  activateSouvenirs("turnStart", scene);
  activateTalents({ scene, key: "turnStart" });
  applyTurnStartEffects(scene, "pc");
  clearCharacterStatModifiers(scene, "turn");
  clearCommandHooksForTurn(scene);
  drawNewHand(scene);
  popAndRunQueue(scene, "pc");
  checkServerScoringEvent("HIT_VULGAR_THRESHOLD", scene);
  checkServerScoringEvent("BLOCK_OVER_THRESHOLD", scene);
  scene.set("scoreEventsThisTurn", getRoomScoreCounter());
  scene.set("damagesUnblockedThisTurn", []);
  scene.set("damagesDealtThisTurn", []);
  scene.set("blocksAppliedThisTurn", []);
  scene.set("nextNpcCommands", []);
  updateNpcMoves(scene);
}, "endNpcTurn");

// game/actions/internal/activatePlayCardHooks.ts
init_util();
var activatePlayCardHooks = /* @__PURE__ */ __name(({ game, card }) => {
  const scene = getBattleSceneIn(game);
  triggerOnHook(scene, "playCard");
  if (card.type === "attack")
    triggerOnHook(scene, "playAttackCard");
  activateSouvenirs("playCard", scene, card.characterUid);
  updateWizardAbility(scene);
  updateNpcMoves(scene);
  updateCharacters(scene);
  updateHand(scene);
}, "activatePlayCardHooks");

// game/actions/internal/doNpcTurn.ts
init_util();
var TIME_BETWEEN_NPC_MOVES = 2e3;
var doNpcTurn = /* @__PURE__ */ __name(({ game, index }) => {
  const scene = getBattleSceneIn(game);
  const isBattleOver = maybeTransitionBattleState(scene);
  if (isBattleOver)
    return;
  const processedCmds = scene.get("nextNpcCommands");
  if (processedCmds.length) {
    const processedCmd = processedCmds[index];
    const { targetUids, command } = processedCmd;
    if (validateCommand(scene.get(), command))
      interpretCommand({ command, targetUids, scene });
  }
  if (index >= processedCmds.length - 1) {
    endNpcTurn2(game);
    return;
  }
  game.set("nextAction", {
    index: index + 1,
    delay: TIME_BETWEEN_NPC_MOVES,
    method: "doNpcTurn"
  });
}, "doNpcTurn");
function endNpcTurn2(game) {
  game.set("nextAction", {
    delay: TIME_BETWEEN_NPC_MOVES,
    method: "endNpcTurn"
  });
}
__name(endNpcTurn2, "endNpcTurn");
function validateCommand(scene, command) {
  return command != null && isAlive(scene, command.characterUid);
}
__name(validateCommand, "validateCommand");

// game/actions/internal/step.ts
var internalActions = {
  activatePlayCardHooks,
  doNpcTurn,
  endNpcTurn
};
function step(game, action) {
  const func = internalActions[action.method];
  func({ game, ...action });
}
__name(step, "step");

// game/actions/activateOrb.ts
var import_lodash24 = require("lodash");
init_util();

// server/metrics/influx.ts
init_code();

// node_modules/@influxdata/influxdb-client/dist/index.mjs
var import_url = require("url");
var Fe = __toESM(require("http"), 1);
var Le = __toESM(require("https"), 1);
var import_buffer = require("buffer");
var import_buffer2 = require("buffer");
var import_zlib = __toESM(require("zlib"), 1);
var import_stream = require("stream");
function P() {
  let r = new TextDecoder("utf-8");
  return { concat(e, t) {
    let n = new Uint8Array(e.length + t.length);
    return n.set(e), n.set(t, e.length), n;
  }, copy(e, t, n) {
    let i = new Uint8Array(n - t);
    return i.set(e.subarray(t, n)), i;
  }, toUtf8String(e, t, n) {
    return r.decode(e.subarray(t, n));
  } };
}
__name(P, "P");
function C(r, e) {
  let t = e != null ? e : P(), n, i = false, s2 = false, a = false, o;
  function u(l) {
    let p, c = 0;
    for (n ? (p = l.length === 0 ? 0 : n.length, l = t.concat(n, l)) : p = 0; p < l.length; ) {
      let d = l[p];
      if (d === 10) {
        if (!s2) {
          let D = p > 0 && l[p - 1] === 13 ? p - 1 : p;
          if (i)
            return;
          if (a = r.next(t.toUtf8String(l, c, D)) === false, c = p + 1, a)
            break;
        }
      } else
        d === 34 && (s2 = !s2);
      p++;
    }
    if (c < l.length ? n = t.copy(l, c, l.length) : n = void 0, a) {
      if (r.useResume) {
        r.useResume(() => {
          a = false, u(new Uint8Array(0));
        });
        return;
      }
      f.error(new Error("Unable to pause, useResume is not configured!")), a = false;
    }
    o && (o(), o = void 0);
  }
  __name(u, "u");
  let f = { next(l) {
    if (!i)
      try {
        return u(l), !a;
      } catch (p) {
        this.error(p);
      }
    return true;
  }, error(l) {
    i || (i = true, r.error(l));
  }, complete() {
    i || (n && r.next(t.toUtf8String(n, 0, n.length)), i = true, r.complete());
  } };
  return r.useCancellable && (f.useCancellable = (l) => {
    r.useCancellable && r.useCancellable({ cancel() {
      l.cancel(), n = void 0, f.complete();
    }, isCancelled() {
      return l.isCancelled();
    } });
  }), r.useResume && (f.useResume = (l) => {
    o = l;
  }), f;
}
__name(C, "C");
async function* k(r, e) {
  let t = e != null ? e : P(), n, i = false;
  for await (let s2 of r) {
    let a, o = 0;
    for (n ? (a = n.length, s2 = t.concat(n, s2)) : a = 0; a < s2.length; ) {
      let u = s2[a];
      if (u === 10) {
        if (!i) {
          let f = a > 0 && s2[a - 1] === 13 ? a - 1 : a;
          yield t.toUtf8String(s2, o, f), o = a + 1;
        }
      } else
        u === 34 && (i = !i);
      a++;
    }
    o < s2.length ? n = t.copy(s2, o, s2.length) : n = void 0;
  }
  n && (yield t.toUtf8String(n, 0, n.length));
}
__name(k, "k");
var R = /* @__PURE__ */ __name(class {
  constructor() {
    this._reuse = false;
  }
  get reuse() {
    return this._reuse;
  }
  set reuse(e) {
    e && !this.reusedValues && (this.reusedValues = new Array(10)), this._reuse = e;
  }
  withReuse() {
    return this.reuse = true, this;
  }
  splitLine(e) {
    if (e == null)
      return this.lastSplitLength = 0, [];
    let t = 0, n = 0, i = this._reuse ? this.reusedValues : [], s2 = 0;
    for (let o = 0; o < e.length; o++) {
      let u = e[o];
      if (u === ",") {
        if (t % 2 === 0) {
          let f = this.getValue(e, n, o, t);
          this._reuse ? i[s2++] = f : i.push(f), n = o + 1, t = 0;
        }
      } else
        u === '"' && t++;
    }
    let a = this.getValue(e, n, e.length, t);
    return this._reuse ? (i[s2] = a, this.lastSplitLength = s2 + 1) : (i.push(a), this.lastSplitLength = i.length), i;
  }
  getValue(e, t, n, i) {
    return t === e.length ? "" : i === 0 ? e.substring(t, n) : i === 2 ? e.substring(t + 1, n - 1) : e.substring(t + 1, n - 1).replace(/""/gi, '"');
  }
}, "R");
var W = /* @__PURE__ */ __name((r) => r, "W");
var S = { boolean: (r) => r === "" ? null : r === "true", unsignedLong: (r) => r === "" ? null : +r, long: (r) => r === "" ? null : +r, double(r) {
  switch (r) {
    case "":
      return null;
    case "+Inf":
      return Number.POSITIVE_INFINITY;
    case "-Inf":
      return Number.NEGATIVE_INFINITY;
    default:
      return +r;
  }
}, string: W, base64Binary: W, duration: (r) => r === "" ? null : r, "dateTime:RFC3339": (r) => r === "" ? null : r };
var F = /* @__PURE__ */ __name(class {
  get(e) {
    var n;
    let t = e[this.index];
    return (t === "" || t === void 0) && this.defaultValue && (t = this.defaultValue), ((n = S[this.dataType]) != null ? n : W)(t);
  }
}, "F");
var oe = Object.freeze({ label: "", dataType: "", group: false, defaultValue: "", index: Number.MAX_SAFE_INTEGER, get: () => {
} });
function L() {
  return new F();
}
__name(L, "L");
var Be = [404, 408, 425, 429, 500, 502, 503, 504];
function $e(r) {
  return Be.includes(r);
}
__name($e, "$e");
var y = /* @__PURE__ */ __name(class extends Error {
  constructor(e) {
    super(e), this.name = "IllegalArgumentError", Object.setPrototypeOf(this, y.prototype);
  }
}, "y");
var h = /* @__PURE__ */ __name(class extends Error {
  constructor(t, n, i, s2, a, o) {
    super();
    this.statusCode = t;
    this.statusMessage = n;
    this.body = i;
    this.contentType = a;
    if (Object.setPrototypeOf(this, h.prototype), o)
      this.message = o;
    else if (i) {
      if (a != null && a.startsWith("application/json"))
        try {
          this.json = JSON.parse(i), this.message = this.json.message, this.code = this.json.code;
        } catch (u) {
        }
      this.message || (this.message = `${t} ${n} : ${i}`);
    } else
      this.message = `${t} ${n}`;
    this.name = "HttpError", this.setRetryAfter(s2);
  }
  setRetryAfter(t) {
    typeof t == "string" ? /^[0-9]+$/.test(t) ? this._retryAfter = parseInt(t) : this._retryAfter = 0 : this._retryAfter = 0;
  }
  canRetry() {
    return $e(this.statusCode);
  }
  retryAfter() {
    return this._retryAfter;
  }
}, "h");
function ae(r, e) {
  if (r) {
    let t;
    return typeof r.retryAfter == "function" ? r.retryAfter() : (t = 0, e && e > 0 ? t + Math.round(Math.random() * e) : t);
  } else
    return 0;
}
__name(ae, "ae");
var x = /* @__PURE__ */ __name(class extends Error {
  constructor() {
    super(), Object.setPrototypeOf(this, x.prototype), this.name = "RequestTimedOutError", this.message = "Request timed out";
  }
  canRetry() {
    return true;
  }
  retryAfter() {
    return 0;
  }
}, "x");
var b = /* @__PURE__ */ __name(class extends Error {
  constructor() {
    super(), this.name = "AbortError", Object.setPrototypeOf(this, b.prototype), this.message = "Response aborted";
  }
  canRetry() {
    return true;
  }
  retryAfter() {
    return 0;
  }
}, "b");
var N = /* @__PURE__ */ __name(class {
  constructor(e) {
    e.forEach((t, n) => t.index = n), this.columns = e;
  }
  column(e, t = true) {
    for (let n = 0; n < this.columns.length; n++) {
      let i = this.columns[n];
      if (i.label === e)
        return i;
    }
    if (t)
      throw new y(`Column ${e} not found!`);
    return oe;
  }
  toObject(e) {
    let t = {};
    for (let n = 0; n < this.columns.length && n < e.length; n++) {
      let i = this.columns[n];
      t[i.label] = i.get(e);
    }
    return t;
  }
  get(e, t) {
    return this.column(t, false).get(e);
  }
}, "N");
function I(r) {
  return new N(r);
}
__name(I, "I");
function H(r) {
  let e = new R().withReuse(), t, n = true, i = 0, s2, a = { error(o) {
    r.error(o);
  }, next(o) {
    if (o === "")
      n = true, t = void 0;
    else {
      let u = e.splitLine(o), f = e.lastSplitLength;
      if (n) {
        if (!t) {
          t = new Array(f);
          for (let l = 0; l < f; l++)
            t[l] = L();
        }
        if (u[0].startsWith("#")) {
          if (u[0] === "#datatype")
            for (let l = 1; l < f; l++)
              t[l].dataType = u[l];
          else if (u[0] === "#default")
            for (let l = 1; l < f; l++)
              t[l].defaultValue = u[l];
          else if (u[0] === "#group")
            for (let l = 1; l < f; l++)
              t[l].group = u[l][0] === "t";
        } else {
          u[0] === "" ? (i = 1, t = t.slice(1)) : i = 0;
          for (let l = i; l < f; l++)
            t[l - i].label = u[l];
          s2 = I(t), n = false;
        }
      } else
        return r.next(u.slice(i, f), s2);
    }
    return true;
  }, complete() {
    r.complete();
  } };
  return r.useCancellable && (a.useCancellable = r.useCancellable.bind(r)), r.useResume && (a.useResume = r.useResume.bind(r)), a;
}
__name(H, "H");
async function* le(r) {
  let e = new R().withReuse(), t, n = true, i = 0, s2;
  for await (let a of r)
    if (a === "")
      n = true, t = void 0;
    else {
      let o = e.splitLine(a), u = e.lastSplitLength;
      if (n) {
        if (!t) {
          t = new Array(u);
          for (let f = 0; f < u; f++)
            t[f] = L();
        }
        if (o[0].startsWith("#")) {
          if (o[0] === "#datatype")
            for (let f = 1; f < u; f++)
              t[f].dataType = o[f];
          else if (o[0] === "#default")
            for (let f = 1; f < u; f++)
              t[f].defaultValue = o[f];
          else if (o[0] === "#group")
            for (let f = 1; f < u; f++)
              t[f].group = o[f][0] === "t";
        } else {
          o[0] === "" ? (i = 1, t = t.slice(1)) : i = 0;
          for (let f = i; f < u; f++)
            t[f - i].label = o[f];
          s2 = I(t), n = false;
        }
      } else
        yield { values: o.slice(i, u), tableMeta: s2 };
    }
}
__name(le, "le");
var ue = (() => typeof Symbol == "function" && Symbol.observable || "@@observable")();
var Q = /* @__PURE__ */ __name(class {
  constructor(e, t) {
    this.isClosed = false;
    try {
      t({ next: (n) => {
        e.next(n);
      }, error: (n) => {
        this.isClosed = true, e.error(n);
      }, complete: () => {
        this.isClosed = true, e.complete();
      }, useCancellable: (n) => {
        this.cancellable = n;
      } });
    } catch (n) {
      this.isClosed = true, e.error(n);
    }
  }
  get closed() {
    return this.isClosed;
  }
  unsubscribe() {
    var e;
    (e = this.cancellable) == null || e.cancel(), this.isClosed = true;
  }
}, "Q");
function q() {
}
__name(q, "q");
function ze(r) {
  let { next: e, error: t, complete: n } = r;
  return { next: e ? e.bind(r) : q, error: t ? t.bind(r) : q, complete: n ? n.bind(r) : q };
}
__name(ze, "ze");
var w = /* @__PURE__ */ __name(class {
  constructor(e, t) {
    this.executor = e;
    this.decorator = t;
  }
  subscribe(e, t, n) {
    let i = ze(typeof e != "object" || e === null ? { next: e, error: t, complete: n } : e);
    return new Q(this.decorator(i), this.executor);
  }
  [ue]() {
    return this;
  }
}, "w");
Symbol.observable;
var fe = { timeout: 1e4 };
var pe = { retryJitter: 200, minRetryDelay: 5e3, maxRetryDelay: 125e3, exponentialBase: 5, randomRetry: true };
var ce = { batchSize: 1e3, maxBatchBytes: 5e7, flushInterval: 6e4, writeFailed: function() {
}, writeSuccess: function() {
}, writeRetrySkipped: function() {
}, maxRetries: 5, maxRetryTime: 18e4, maxBufferLines: 32e3, retryJitter: 200, minRetryDelay: 5e3, maxRetryDelay: 125e3, exponentialBase: 2, gzipThreshold: 1e3, randomRetry: true };
function j(r, e) {
  return function(t) {
    let n = "", i = 0, s2 = 0;
    for (; s2 < t.length; ) {
      let a = r.indexOf(t[s2]);
      a >= 0 && (n += t.substring(i, s2), n += e[a], i = s2 + 1), s2++;
    }
    return i == 0 ? t : (i < t.length && (n += t.substring(i, t.length)), n);
  };
}
__name(j, "j");
function Ve(r, e) {
  let t = j(r, e);
  return (n) => '"' + t(n) + '"';
}
__name(Ve, "Ve");
var T = { measurement: j(`, 
\r	`, ["\\,", "\\ ", "\\n", "\\r", "\\t"]), quoted: Ve('"\\', ['\\"', "\\\\"]), tag: j(`, =
\r	`, ["\\,", "\\ ", "\\=", "\\n", "\\r", "\\t"]) };
var _ = "000000000";
var Y = false;
function ke(r) {
  return Y = r && process && typeof process.hrtime == "function";
}
__name(ke, "ke");
ke(true);
var de;
var U;
var me = Date.now();
var J = 0;
function X() {
  if (Y) {
    let r = process.hrtime(), e = Date.now();
    U ? (r[0] = r[0] - U[0], r[1] = r[1] - U[1], r[1] < 0 && (r[0] -= 1, r[1] += 1e9), e = de + r[0] * 1e3 + Math.floor(r[1] / 1e6)) : (U = r, de = e);
    let t = String(r[1] % 1e6);
    return String(e) + _.substr(0, 6 - t.length) + t;
  } else {
    let r = Date.now();
    r !== me ? (me = r, J = 0) : J++;
    let e = String(J);
    return String(r) + _.substr(0, 6 - e.length) + e;
  }
}
__name(X, "X");
function he() {
  if (Y) {
    let r = process.hrtime(), e = String(Math.trunc(r[1] / 1e3) % 1e3);
    return String(Date.now()) + _.substr(0, 3 - e.length) + e;
  } else
    return String(Date.now()) + _.substr(0, 3);
}
__name(he, "he");
function ge() {
  return String(Date.now());
}
__name(ge, "ge");
function ye() {
  return String(Math.floor(Date.now() / 1e3));
}
__name(ye, "ye");
var be = { s: ye, ms: ge, us: he, ns: X, seconds: ye, millis: ge, micros: he, nanos: X };
var xe = { s: (r) => `${Math.floor(r.getTime() / 1e3)}`, ms: (r) => `${r.getTime()}`, us: (r) => `${r.getTime()}000`, ns: (r) => `${r.getTime()}000000` };
function Re(r) {
  return r === void 0 ? X() : typeof r == "string" ? r.length > 0 ? r : void 0 : r instanceof Date ? `${r.getTime()}000000` : String(typeof r == "number" ? Math.floor(r) : r);
}
__name(Re, "Re");
var We = { error(r, e) {
  console.error("ERROR: " + r, e || "");
}, warn(r, e) {
  console.warn("WARN: " + r, e || "");
} };
var B = We;
var g = { error(r, e) {
  B.error(r, e);
}, warn(r, e) {
  B.warn(r, e);
} };
var $ = Symbol("FLUX_VALUE");
var m = /* @__PURE__ */ __name(class {
  constructor(e) {
    this.fluxValue = e;
  }
  toString() {
    return this.fluxValue;
  }
  [$]() {
    return this.fluxValue;
  }
}, "m");
var ve = /* @__PURE__ */ __name(class {
  constructor(e) {
    this.tags = {};
    this.fields = {};
    e && (this.name = e);
  }
  measurement(e) {
    return this.name = e, this;
  }
  tag(e, t) {
    return this.tags[e] = t, this;
  }
  booleanField(e, t) {
    return this.fields[e] = t ? "T" : "F", this;
  }
  intField(e, t) {
    let n;
    if (typeof t == "number" ? n = t : n = parseInt(String(t)), isNaN(n) || n <= -9223372036854776e3 || n >= 9223372036854776e3)
      throw new Error(`invalid integer value for field '${e}': '${t}'!`);
    return this.fields[e] = `${Math.floor(n)}i`, this;
  }
  uintField(e, t) {
    if (typeof t == "number") {
      if (isNaN(t) || t < 0 || t > Number.MAX_SAFE_INTEGER)
        throw new Error(`uint value for field '${e}' out of range: ${t}`);
      this.fields[e] = `${Math.floor(t)}u`;
    } else {
      let n = String(t);
      for (let i = 0; i < n.length; i++) {
        let s2 = n.charCodeAt(i);
        if (s2 < 48 || s2 > 57)
          throw new Error(`uint value has an unsupported character at pos ${i}: ${t}`);
      }
      if (n.length > 20 || n.length === 20 && n.localeCompare("18446744073709551615") > 0)
        throw new Error(`uint value for field '${e}' out of range: ${n}`);
      this.fields[e] = `${n}u`;
    }
    return this;
  }
  floatField(e, t) {
    let n;
    if (typeof t == "number" ? n = t : n = parseFloat(t), !isFinite(n))
      throw new Error(`invalid float value for field '${e}': ${t}`);
    return this.fields[e] = String(n), this;
  }
  stringField(e, t) {
    return t != null && (typeof t != "string" && (t = String(t)), this.fields[e] = T.quoted(t)), this;
  }
  timestamp(e) {
    return this.time = e, this;
  }
  toLineProtocol(e) {
    if (!this.name)
      return;
    let t = "";
    if (Object.keys(this.fields).sort().forEach((a) => {
      if (a) {
        let o = this.fields[a];
        t.length > 0 && (t += ","), t += `${T.tag(a)}=${o}`;
      }
    }), t.length === 0)
      return;
    let n = "", i = e && e.defaultTags ? { ...e.defaultTags, ...this.tags } : this.tags;
    Object.keys(i).sort().forEach((a) => {
      if (a) {
        let o = i[a];
        o && (n += ",", n += `${T.tag(a)}=${T.tag(o)}`);
      }
    });
    let s2 = this.time;
    return e && e.convertTime ? s2 = e.convertTime(s2) : s2 = Re(s2), `${T.measurement(this.name)}${n} ${t}${s2 !== void 0 ? " " + s2 : ""}`;
  }
  toString() {
    let e = this.toLineProtocol(void 0);
    return e || `invalid point: ${JSON.stringify(this, void 0)}`;
  }
}, "ve");
var K = /* @__PURE__ */ __name(class {
  constructor(e) {
    this.options = { ...pe, ...e }, this.success();
  }
  nextDelay(e, t) {
    let n = ae(e);
    if (n && n > 0)
      return n + Math.round(Math.random() * this.options.retryJitter);
    if (t && t > 0) {
      if (this.options.randomRetry) {
        let s2 = Math.max(this.options.minRetryDelay, 1), a = s2 * this.options.exponentialBase;
        for (let o = 1; o < t; o++)
          if (s2 = a, a = a * this.options.exponentialBase, a >= this.options.maxRetryDelay) {
            a = this.options.maxRetryDelay;
            break;
          }
        return s2 + Math.round(Math.random() * (a - s2) + Math.random() * this.options.retryJitter);
      }
      let i = Math.max(this.options.minRetryDelay, 1);
      for (let s2 = 1; s2 < t; s2++)
        if (i = i * this.options.exponentialBase, i >= this.options.maxRetryDelay) {
          i = this.options.maxRetryDelay;
          break;
        }
      return i + Math.round(Math.random() * this.options.retryJitter);
    } else
      this.currentDelay ? this.currentDelay = Math.min(Math.max(this.currentDelay * this.options.exponentialBase, 1) + Math.round(Math.random() * this.options.retryJitter), this.options.maxRetryDelay) : this.currentDelay = this.options.minRetryDelay + Math.round(Math.random() * this.options.retryJitter);
    return this.currentDelay;
  }
  success() {
    this.currentDelay = void 0;
  }
}, "K");
function Oe(r) {
  return new K(r);
}
__name(Oe, "Oe");
function qe(r) {
  let e, t = r, n = r;
  for (; n.next; )
    n.next.expires < t.expires && (e = n, t = n.next), n = n.next;
  return [t, e];
}
__name(qe, "qe");
var O = /* @__PURE__ */ __name(class {
  constructor(e, t, n = () => {
  }) {
    this.maxLines = e;
    this.retryLines = t;
    this.onShrink = n;
    this.size = 0;
    this.closed = false;
    this._timeoutHandle = void 0;
  }
  addLines(e, t, n, i) {
    if (this.closed || !e.length)
      return;
    let s2 = Date.now() + n;
    if (i < s2 && (s2 = i), this.first && this.size + e.length > this.maxLines) {
      let f = this.size, l = f * 0.7;
      do {
        let [p, c] = qe(this.first);
        this.size -= p.lines.length, c ? c.next = p.next : (this.first = p.next, this.first && this.scheduleRetry(this.first.retryTime - Date.now())), p.next = void 0, this.onShrink(p);
      } while (this.first && this.size + e.length > l);
      g.error(`RetryBuffer: ${f - this.size} oldest lines removed to keep buffer size under the limit of ${this.maxLines} lines.`);
    }
    let a = { lines: e, retryCount: t, retryTime: s2, expires: i }, o = this.first, u;
    for (; ; ) {
      if (!o || o.retryTime > s2) {
        a.next = o, u ? u.next = a : (this.first = a, this.scheduleRetry(s2 - Date.now()));
        break;
      }
      u = o, o = o.next;
    }
    this.size += e.length;
  }
  removeLines() {
    if (this.first) {
      let e = this.first;
      return this.first = this.first.next, e.next = void 0, this.size -= e.lines.length, e;
    }
  }
  scheduleRetry(e) {
    this._timeoutHandle && clearTimeout(this._timeoutHandle), this._timeoutHandle = setTimeout(() => {
      let t = this.removeLines();
      t ? this.retryLines(t.lines, t.retryCount, t.expires).catch(() => {
      }).finally(() => {
        this.first && this.scheduleRetry(this.first.retryTime - Date.now());
      }) : this._timeoutHandle = void 0;
    }, Math.max(e, 0));
  }
  async flush() {
    let e;
    for (; e = this.removeLines(); )
      await this.retryLines(e.lines, e.retryCount, e.expires);
  }
  close() {
    return this._timeoutHandle && (clearTimeout(this._timeoutHandle), this._timeoutHandle = void 0), this.closed = true, this.size;
  }
}, "O");
function Z(r) {
  let e = r.length;
  for (let t = 0; t < r.length; t++) {
    let n = r.charCodeAt(t);
    n < 128 || (n >= 128 && n <= 2047 ? e++ : n >= 2048 && n <= 65535 ? n >= 55296 && n <= 57343 ? e++ : e += 2 : e += 3);
  }
  return e;
}
__name(Z, "Z");
var ee = /* @__PURE__ */ __name(class {
  constructor(e, t, n, i) {
    this.maxChunkRecords = e;
    this.maxBatchBytes = t;
    this.flushFn = n;
    this.scheduleSend = i;
    this.length = 0;
    this.bytes = -1;
    this.lines = new Array(e);
  }
  add(e) {
    let t = Z(e);
    this.length === 0 ? this.scheduleSend() : this.bytes + t + 1 >= this.maxBatchBytes && this.flush().catch((n) => {
    }), this.lines[this.length] = e, this.length++, this.bytes += t + 1, (this.length >= this.maxChunkRecords || this.bytes >= this.maxBatchBytes) && this.flush().catch((n) => {
    });
  }
  flush() {
    let e = this.reset();
    return e.length > 0 ? this.flushFn(e) : Promise.resolve();
  }
  reset() {
    let e = this.lines.slice(0, this.length);
    return this.length = 0, this.bytes = -1, e;
  }
}, "ee");
var A = /* @__PURE__ */ __name(class {
  constructor(e, t, n, i, s2) {
    this.transport = e;
    this.closed = false;
    this._timeoutHandle = void 0;
    this.path = `/api/v2/write?org=${encodeURIComponent(t)}&bucket=${encodeURIComponent(n)}&precision=${i}`, s2 != null && s2.consistency && (this.path += `&consistency=${encodeURIComponent(s2.consistency)}`), this.writeOptions = { ...ce, ...s2 }, this.currentTime = be[i], this.dateToProtocolTimestamp = xe[i], this.writeOptions.defaultTags && this.useDefaultTags(this.writeOptions.defaultTags), this.sendOptions = { method: "POST", headers: { "content-type": "text/plain; charset=utf-8", ...s2 == null ? void 0 : s2.headers }, gzipThreshold: this.writeOptions.gzipThreshold };
    let a = /* @__PURE__ */ __name(() => {
      this.writeOptions.flushInterval > 0 && (this._clearFlushTimeout(), this.closed || (this._timeoutHandle = setTimeout(() => this.sendBatch(this.writeBuffer.reset(), this.writeOptions.maxRetries).catch((o) => {
      }), this.writeOptions.flushInterval)));
    }, "a");
    this.writeBuffer = new ee(this.writeOptions.batchSize, this.writeOptions.maxBatchBytes, (o) => (this._clearFlushTimeout(), this.sendBatch(o, this.writeOptions.maxRetries)), a), this.sendBatch = this.sendBatch.bind(this), this.retryStrategy = Oe(this.writeOptions), this.retryBuffer = new O(this.writeOptions.maxBufferLines, this.sendBatch, this.writeOptions.writeRetrySkipped);
  }
  sendBatch(e, t, n = Date.now() + this.writeOptions.maxRetryTime) {
    let i = this, s2 = i.writeOptions.maxRetries + 1 - t;
    if (!this.closed && e.length > 0) {
      if (n <= Date.now()) {
        let a = new Error("Max retry time exceeded."), o = i.writeOptions.writeFailed.call(i, a, e, s2, n);
        return o || (g.error(`Write to InfluxDB failed (attempt: ${s2}).`, a), Promise.reject(a));
      }
      return new Promise((a, o) => {
        let u, f = { responseStarted(l, p) {
          u = p;
        }, error(l) {
          let p = i.writeOptions.writeFailed.call(i, l, e, s2, n);
          if (p) {
            p.then(a, o);
            return;
          }
          if (l instanceof h && l.json && typeof l.json.error == "string" && l.json.error.includes("hinted handoff queue not empty")) {
            g.warn("Write to InfluxDB returns: " + l.json.error), u = 204, f.complete();
            return;
          }
          if (!i.closed && t > 0 && (!(l instanceof h) || l.statusCode >= 429)) {
            g.warn(`Write to InfluxDB failed (attempt: ${s2}).`, l), i.retryBuffer.addLines(e, t - 1, i.retryStrategy.nextDelay(l, s2), n), o(l);
            return;
          }
          g.error("Write to InfluxDB failed.", l), o(l);
        }, complete() {
          if (u == 204 || u == null)
            i.writeOptions.writeSuccess.call(i, e), i.retryStrategy.success(), a();
          else {
            let l = `204 HTTP response status code expected, but ${u} returned`, p = new h(u, l, void 0, "0");
            p.message = l, f.error(p);
          }
        } };
        this.transport.send(this.path, e.join(`
`), this.sendOptions, f);
      });
    } else
      return Promise.resolve();
  }
  _clearFlushTimeout() {
    this._timeoutHandle !== void 0 && (clearTimeout(this._timeoutHandle), this._timeoutHandle = void 0);
  }
  writeRecord(e) {
    if (this.closed)
      throw new Error("writeApi: already closed!");
    this.writeBuffer.add(e);
  }
  writeRecords(e) {
    if (this.closed)
      throw new Error("writeApi: already closed!");
    for (let t = 0; t < e.length; t++)
      this.writeBuffer.add(e[t]);
  }
  writePoint(e) {
    if (this.closed)
      throw new Error("writeApi: already closed!");
    let t = e.toLineProtocol(this);
    t && this.writeBuffer.add(t);
  }
  writePoints(e) {
    if (this.closed)
      throw new Error("writeApi: already closed!");
    for (let t = 0; t < e.length; t++) {
      let n = e[t].toLineProtocol(this);
      n && this.writeBuffer.add(n);
    }
  }
  async flush(e) {
    if (await this.writeBuffer.flush(), e)
      return await this.retryBuffer.flush();
  }
  close() {
    return this.writeBuffer.flush().finally(() => {
      let t = this.retryBuffer.close();
      t && g.error(`Retry buffer closed with ${t} items that were not written to InfluxDB!`, null), this.closed = true;
    });
  }
  dispose() {
    return this._clearFlushTimeout(), this.closed = true, this.retryBuffer.close() + this.writeBuffer.length;
  }
  useDefaultTags(e) {
    return this.defaultTags = e, this;
  }
  convertTime(e) {
    return e === void 0 ? this.currentTime() : typeof e == "string" ? e.length > 0 ? e : void 0 : e instanceof Date ? this.dateToProtocolTimestamp(e) : String(typeof e == "number" ? Math.floor(e) : e);
  }
}, "A");
var Qe = { concat(r, e) {
  return import_buffer2.Buffer.concat([r, e]);
}, toUtf8String(r, e, t) {
  return r.toString("utf-8", e, t);
}, copy(r, e, t) {
  let n = import_buffer2.Buffer.allocUnsafe(t - e);
  return r.copy(n, 0, e, t), n;
} };
var Ee = Qe;
function te(r = {}) {
  let e = 0, t = { next: (n) => {
    if (e === 0 && r.next && n !== null && n !== void 0)
      return r.next(n);
  }, error: (n) => {
    e === 0 && (e = 1, r.error && r.error(n));
  }, complete: () => {
    e === 0 && (e = 2, r.complete && r.complete());
  }, responseStarted: (n, i) => {
    r.responseStarted && r.responseStarted(n, i);
  } };
  return r.useCancellable && (t.useCancellable = r.useCancellable.bind(r)), r.useResume && (t.useResume = r.useResume.bind(r)), t;
}
__name(te, "te");
var De = "1.33.1";
var Je = { flush: import_zlib.default.constants.Z_SYNC_FLUSH, finishFlush: import_zlib.default.constants.Z_SYNC_FLUSH };
var Xe = import_buffer.Buffer.allocUnsafe(0);
var ne = /* @__PURE__ */ __name(class {
  constructor() {
    this.cancelled = false;
  }
  cancel() {
    this.cancelled = true, this.resume && (this.resume(), this.resume = void 0);
  }
  isCancelled() {
    return this.cancelled;
  }
}, "ne");
var ie = /* @__PURE__ */ __name(class {
  constructor(e) {
    this.chunkCombiner = Ee;
    var u, f, l, p, c, d, D;
    let { url: t, proxyUrl: n, token: i, transportOptions: s2, ...a } = e, o = (0, import_url.parse)(n || t);
    if (this.token = i, this.defaultOptions = { ...fe, ...a, ...s2, port: o.port, protocol: o.protocol, hostname: o.hostname }, this.contextPath = n ? t : (u = o.path) != null ? u : "", this.contextPath.endsWith("/") && (this.contextPath = this.contextPath.substring(0, this.contextPath.length - 1)), Object.keys(this.defaultOptions).forEach((se) => this.defaultOptions[se] === void 0 && delete this.defaultOptions[se]), this.contextPath.endsWith("/api/v2") && (g.warn(`Please remove '/api/v2' context path from InfluxDB base url, using ${o.protocol}//${o.hostname}:${o.port} !`), this.contextPath = ""), o.protocol === "http:")
      this.requestApi = (p = (l = (f = this.defaultOptions["follow-redirects"]) == null ? void 0 : f.http) == null ? void 0 : l.request) != null ? p : Fe.request;
    else if (o.protocol === "https:")
      this.requestApi = (D = (d = (c = this.defaultOptions["follow-redirects"]) == null ? void 0 : c.https) == null ? void 0 : d.request) != null ? D : Le.request;
    else
      throw new Error(`Unsupported protocol "${o.protocol} in URL: "${e.url}"`);
    this.headers = { "User-Agent": `influxdb-client-js/${De}`, ...e.headers }, n && (this.headers.Host = (0, import_url.parse)(t).host);
  }
  send(e, t, n, i) {
    let s2 = new ne();
    i && i.useCancellable && i.useCancellable(s2), this.createRequestMessage(e, t, n, (a) => {
      this._request(a, s2, i);
    }, (a) => (i == null ? void 0 : i.error) && i.error(a));
  }
  request(e, t, n, i) {
    t ? typeof t != "string" && (t = JSON.stringify(t)) : t = "";
    let s2 = Xe, a, o;
    return new Promise((u, f) => {
      this.send(e, t, n, { responseStarted(l, p) {
        i && i(l, p), a = String(l["content-type"]), o = p;
      }, next: (l) => {
        s2 = import_buffer.Buffer.concat([s2, l]);
      }, complete: () => {
        var p, c;
        let l = (c = (p = n.headers) == null ? void 0 : p.accept) != null ? c : a;
        try {
          o === 204 && u(void 0), l.includes("json") ? s2.length ? u(JSON.parse(s2.toString("utf8"))) : u(void 0) : l.includes("text") || l.startsWith("application/csv") ? u(s2.toString("utf8")) : u(s2);
        } catch (d) {
          f(d);
        }
      }, error: (l) => {
        f(l);
      } });
    });
  }
  async *iterate(e, t, n) {
    var l;
    let i, s2;
    function a(p) {
      i = p, s2(p);
    }
    __name(a, "a");
    let o = await new Promise((p, c) => {
      s2 = c, this.createRequestMessage(e, t, n, p, a);
    });
    (l = o.signal) != null && l.addEventListener && o.signal.addEventListener("abort", () => {
      a(new b());
    });
    let u = await new Promise((p, c) => {
      s2 = c;
      let d = this.requestApi(o, p);
      d.on("timeout", () => a(new x())), d.on("error", a), d.write(o.body), d.end();
    }), f = await new Promise((p, c) => {
      s2 = c, this._prepareResponse(u, p, a);
    });
    for await (let p of f) {
      if (i)
        throw i;
      yield p;
    }
  }
  createRequestMessage(e, t, n, i, s2) {
    let a = import_buffer.Buffer.from(t, "utf-8"), o = { "content-type": "application/json; charset=utf-8", ...this.headers };
    this.token && (o.authorization = "Token " + this.token);
    let u = { ...this.defaultOptions, path: this.contextPath + e, method: n.method, headers: { ...o, ...n.headers } };
    if (n.signal && (u.signal = n.signal), n.gzipThreshold !== void 0 && n.gzipThreshold < a.length) {
      import_zlib.default.gzip(a, (f, l) => {
        if (f)
          return s2(f);
        u.headers["content-encoding"] = "gzip", u.body = l, i(u);
      });
      return;
    }
    u.body = a, u.headers["content-length"] = u.body.length, i(u);
  }
  _prepareResponse(e, t, n) {
    var o;
    e.on("aborted", () => {
      n(new b());
    }), e.on("error", n);
    let i = (o = e.statusCode) != null ? o : 600, s2 = e.headers["content-encoding"], a;
    if (s2 === "gzip" ? (a = import_zlib.default.createGunzip(Je), a = (0, import_stream.pipeline)(e, a, (u) => u && n(u))) : a = e, i >= 300) {
      let u = "", f = String(e.headers["content-type"]).startsWith("application/json");
      a.on("data", (l) => {
        u += l.toString(), !f && u.length > 1e3 && (u = u.slice(0, 1e3), e.resume());
      }), a.on("end", () => {
        u === "" && !!e.headers["x-influxdb-error"] && (u = e.headers["x-influxdb-error"].toString()), n(new h(i, e.statusMessage, u, e.headers["retry-after"], e.headers["content-type"]));
      });
    } else
      t(a);
  }
  _request(e, t, n) {
    var a;
    let i = te(n);
    if (t.isCancelled()) {
      i.complete();
      return;
    }
    (a = e.signal) != null && a.addEventListener && e.signal.addEventListener("abort", () => {
      i.error(new b());
    });
    let s2 = this.requestApi(e, (o) => {
      if (t.isCancelled()) {
        o.resume(), i.complete();
        return;
      }
      i.responseStarted(o.headers, o.statusCode), this._prepareResponse(o, (u) => {
        u.on("data", (f) => {
          if (t.isCancelled())
            o.resume();
          else if (i.next(f) === false) {
            if (!i.useResume) {
              i.error(new Error("Unable to pause, useResume is not configured!")), o.resume();
              return;
            }
            o.pause();
            let l = /* @__PURE__ */ __name(() => {
              o.resume();
            }, "l");
            t.resume = l, i.useResume(l);
          }
        }), u.on("end", i.complete);
      }, i.error);
    });
    typeof s2.setTimeout == "function" && e.timeout && s2.setTimeout(e.timeout), s2.on("timeout", () => {
      i.error(new x());
    }), s2.on("error", (o) => {
      i.error(o);
    }), e.body && s2.write(e.body), s2.end();
  }
}, "ie");
var Ie = ie;
var Ue = { header: true, delimiter: ",", quoteChar: '"', commentPrefix: "#", annotations: ["datatype", "group", "default"] };
var E = /* @__PURE__ */ __name(class {
  constructor(e, t, n) {
    this.transport = e;
    this.createCSVResponse = t;
    this.options = typeof n == "string" ? { org: n } : n;
  }
  with(e) {
    return new E(this.transport, this.createCSVResponse, { ...this.options, ...e });
  }
  response(e) {
    let { org: t, type: n, gzip: i, headers: s2 } = this.options, a = `/api/v2/query?org=${encodeURIComponent(t)}`, o = JSON.stringify(this.decorateRequest({ query: e.toString(), dialect: Ue, type: n })), u = { method: "POST", headers: { "content-type": "application/json; encoding=utf-8", "accept-encoding": i ? "gzip" : "identity", ...s2 } };
    return this.createCSVResponse((f) => this.transport.send(a, o, u, f), () => this.transport.iterate(a, o, u));
  }
  iterateLines(e) {
    return this.response(e).iterateLines();
  }
  iterateRows(e) {
    return this.response(e).iterateRows();
  }
  lines(e) {
    return this.response(e).lines();
  }
  rows(e) {
    return this.response(e).rows();
  }
  queryLines(e, t) {
    return this.response(e).consumeLines(t);
  }
  queryRows(e, t) {
    return this.response(e).consumeRows(t);
  }
  collectRows(e, t) {
    return this.response(e).collectRows(t);
  }
  collectLines(e) {
    return this.response(e).collectLines();
  }
  queryRaw(e) {
    let { org: t, type: n, gzip: i, headers: s2 } = this.options;
    return this.transport.request(`/api/v2/query?org=${encodeURIComponent(t)}`, JSON.stringify(this.decorateRequest({ query: e.toString(), dialect: Ue, type: n })), { method: "POST", headers: { accept: "text/csv", "accept-encoding": i ? "gzip" : "identity", "content-type": "application/json; encoding=utf-8", ...s2 } });
  }
  decorateRequest(e) {
    var t;
    return typeof this.options.now == "function" && (e.now = this.options.now()), e.type = (t = this.options.type) != null ? t : "flux", e;
  }
}, "E");
var _e = E;
function Ye(r, e) {
  return e.toObject(r);
}
__name(Ye, "Ye");
var z = /* @__PURE__ */ __name(class {
  constructor(e, t, n) {
    this.executor = e;
    this.iterableResultExecutor = t;
    this.chunkCombiner = n;
  }
  iterateLines() {
    return k(this.iterableResultExecutor());
  }
  iterateRows() {
    return le(k(this.iterableResultExecutor()));
  }
  lines() {
    return new w(this.executor, (e) => C(e, this.chunkCombiner));
  }
  rows() {
    return new w(this.executor, (e) => C(H({ next(t, n) {
      e.next({ values: t, tableMeta: n });
    }, error(t) {
      e.error(t);
    }, complete() {
      e.complete();
    } }), this.chunkCombiner));
  }
  consumeLines(e) {
    this.executor(C(e, this.chunkCombiner));
  }
  consumeRows(e) {
    this.executor(C(H(e), this.chunkCombiner));
  }
  collectRows(e = Ye) {
    let t = [];
    return new Promise((n, i) => {
      this.consumeRows({ next(s2, a) {
        let o = e.call(this, s2, a);
        o !== void 0 && t.push(o);
      }, error(s2) {
        i(s2);
      }, complete() {
        n(t);
      } });
    });
  }
  collectLines() {
    let e = [];
    return new Promise((t, n) => {
      this.consumeLines({ next(i) {
        e.push(i);
      }, error(i) {
        n(i);
      }, complete() {
        t(e);
      } });
    });
  }
}, "z");
var V = /* @__PURE__ */ __name(class {
  constructor(e) {
    var n;
    if (typeof e == "string")
      this._options = { url: e };
    else if (e !== null && typeof e == "object")
      this._options = e;
    else
      throw new y("No url or configuration specified!");
    let t = this._options.url;
    if (typeof t != "string")
      throw new y("No url specified!");
    t.endsWith("/") && (this._options.url = t.substring(0, t.length - 1)), this.transport = (n = this._options.transport) != null ? n : new Ie(this._options), this.processCSVResponse = (i, s2) => new z(i, s2, this.transport.chunkCombiner);
  }
  getWriteApi(e, t, n = "ns", i) {
    return new A(this.transport, e, t, n, i != null ? i : this._options.writeOptions);
  }
  getQueryApi(e) {
    return new _e(this.transport, this.processCSVResponse, e);
  }
}, "V");

// server/metrics/influx.ts
var logger2 = getLogger();
var _db;
var enableMetrics = true;
var influxOrg;
var influxBucket;
var getInfluxDb = /* @__PURE__ */ __name(() => {
  if (_db)
    return _db;
  const influxUrl = getServerEnv("INFLUX_URL");
  const influxApiToken = getServerEnv("INFLUX_TOKEN");
  if (!influxUrl || !influxApiToken) {
    logger2.error(
      "no influx url or token defined. check your INFLUX_URL and INFLUX_TOKEN variable in env"
    );
    logger2.error("METRICS DISABLED");
    enableMetrics = false;
    return;
  }
  influxOrg = getServerEnv("INFLUX_ORG");
  influxBucket = getServerEnv("INFLUX_BUCKET");
  if (!influxOrg || !influxBucket) {
    logger2.error(
      "no influx organization or bucket defined. check your INFLUX_ORG and INFLUX_BUCKET variables in env"
    );
    logger2.error("METRICS DISABLED");
    enableMetrics = false;
    return;
  }
  _db = new V({
    url: influxUrl,
    token: influxApiToken
  });
  return _db;
}, "getInfluxDb");
var defaultMetricField = {
  name: "value",
  type: 0 /* int */,
  value: 1
};
function metricField(t = void 0) {
  if (!t)
    return defaultMetricField;
  else
    return { ...defaultMetricField, ...t };
}
__name(metricField, "metricField");
var writeOptions = {
  batchSize: ce.batchSize,
  flushInterval: ce.flushInterval
};
var writeMetric = /* @__PURE__ */ __name((name, tags = {}, fields = [defaultMetricField]) => {
  if (!enableMetrics)
    return;
  try {
    let point = new ve(name);
    fields.forEach((field) => {
      const finalField = metricField(field);
      if (finalField.type == 0 /* int */)
        point.intField(finalField.name, finalField.value);
      else if (finalField.type == 1 /* float */)
        point.floatField(finalField.name, finalField.value);
      else
        point.stringField(finalField.name, finalField.value);
    });
    for (const [tagKey, tagValue] of Object.entries(tags)) {
      try {
        let tagString = String(tagValue);
        if (tagString != "" && tagString.slice(-1) != "\\") {
          point.tag(tagKey, tagString);
        }
      } catch (e) {
        const err2 = e;
        logger2.error(
          `failed to create tag for metric ${name}: tag ${tagKey}: ${tagValue}: ${err2.message}. ${err2.stack}`
        );
      }
    }
    let db3 = getInfluxDb();
    if (!db3) {
      logger2.error("could not get influxDB connection");
      return;
    }
    const writeApi = db3.getWriteApi(
      influxOrg,
      influxBucket,
      "ns",
      writeOptions
    );
    writeApi.writePoint(point);
    const fieldMsg = JSON.stringify(point.fields);
    const tagMsg = JSON.stringify(point.tags);
    logger2.debug(`metric sent for writing ${name}: ${fieldMsg}, ${tagMsg}`);
  } catch (e) {
    const err2 = e;
    logger2.error(
      `writing metric failed ${name}: ${err2.message}: ${err2.stack}`
    );
  }
}, "writeMetric");

// server/metrics/metrics.ts
var metrics_exports = {};
__export(metrics_exports, {
  endRun: () => endRun,
  startRun: () => startRun
});
var startRun = /* @__PURE__ */ __name((args) => {
  const { runId, userId } = args;
  let tags = {
    run_id: runId,
    user_id: userId
  };
  writeMetric("run_start", tags);
}, "startRun");
var endRun = /* @__PURE__ */ __name((args) => {
  const { runDuration, restart, scene } = args;
  let stateName = restart ? "restart" : scene.state;
  let currentRoom = scene.currentRoom.uid;
  if (currentRoom == "root") {
    currentRoom = "0_0";
  }
  let tags = {
    state: stateName,
    current_room: currentRoom,
    run_id: scene.runId,
    user_id: scene.userId
  };
  const totalScore = scene.runScore.totalScore;
  writeMetric("run_end", tags);
  writeMetric("run_score", tags, [
    { value: totalScore, type: 1 /* float */ }
  ]);
  writeMetric("run_duration", tags, [{ value: runDuration }]);
}, "endRun");

// game/metrics/index.ts
var metrics_exports2 = {};
__export(metrics_exports2, {
  activateOrb: () => activateOrb,
  addCardToDeck: () => addCardToDeck,
  chooseStance: () => chooseStance,
  discardCard: () => discardCard,
  endTurn: () => endTurn,
  nextRoom: () => nextRoom,
  playCard: () => playCard
});

// game/metrics/metrics.ts
var playCard = /* @__PURE__ */ __name((args) => {
  const { card, targetUids, scene } = args;
  let tags = {};
  const character = scene.get("allCharacters", card.characterUid);
  Object.assign(tags, {
    card_name: card.id,
    card_energy: card.energy,
    card_type: card.type,
    card_class: card.characterClass,
    character_name: character.id,
    character_stance: character.stance,
    character_hp: character.health,
    character_block: character.block,
    turn_count: scene.get("turnCount"),
    play_order: scene.get("cardsPlayedThisTurn").length,
    target_type: card.targetType,
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  });
  if (targetUids.length == 1) {
    let target = scene.get("allCharacters", targetUids[0]);
    tags.target_id = target.id;
    tags.target_hp = target.health;
    tags.target_block = target.block;
  } else {
    tags.target_id = "multiple";
  }
  writeMetric("card_play", tags);
}, "playCard");
var chooseStance = /* @__PURE__ */ __name((args) => {
  const { character, stanceId, scene } = args;
  const tags = {
    character_name: character.id,
    character_class: character.class,
    character_hp: character.health,
    character_block: character.block,
    turn_count: scene.get("turnCount"),
    stance_name: stanceId,
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  writeMetric("choose_stance", tags);
}, "chooseStance");
var nextRoom = /* @__PURE__ */ __name((args) => {
  const { choice, chosenRoom, scene } = args;
  const tags = {
    room_choice: chosenRoom.uid,
    room_category: chosenRoom.category,
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  const fields = [metricField({ value: choice })];
  writeMetric("next_room", tags, fields);
}, "nextRoom");
var addCardToDeck = /* @__PURE__ */ __name((args) => {
  const { card, scene } = args;
  const tags = {
    card_name: card.id,
    card_type: card.type,
    card_energy: card.energy,
    character_class: card.characterClass,
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  writeMetric("card_draft", tags);
}, "addCardToDeck");
var endTurn = /* @__PURE__ */ __name((args) => {
  const { scene } = args;
  const cards = scene.get("cardsPlayedThisTurn");
  const damages = scene.get("damagesDealtThisTurn");
  const blocks = scene.get("blocksAppliedThisTurn");
  const tags = {
    turn_count: scene.get("turnCount"),
    num_cards_played: cards.length,
    num_damage_cards: damages.length,
    num_block_cards: blocks.length,
    turn_damage_dealt: damages.reduce((n, { amount }) => n + amount, 0),
    turn_block_added: blocks.reduce((n, { amount }) => n + amount, 0),
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  writeMetric("turn_end", tags);
}, "endTurn");
var discardCard = /* @__PURE__ */ __name((args) => {
  const { card, scene } = args;
  const tags = {
    card_name: card.name,
    card_energy: card.energy,
    card_type: card.type,
    card_class: card.characterClass,
    turn_count: scene.get("turnCount"),
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  writeMetric("card_discard", tags);
}, "discardCard");
var activateOrb = /* @__PURE__ */ __name((args) => {
  const { orb, character, scene } = args;
  const tags = {
    orb_name: orb.type,
    orb_remaining: orb.remainingCount,
    character_name: character.id,
    character_hp: character.health,
    character_block: character.block,
    turn_count: scene.get("turnCount"),
    run_id: scene.get("runId"),
    user_id: scene.get("userId")
  };
  writeMetric("orb_activate", tags);
}, "activateOrb");

// server/metrics/trackMetric.ts
var trackMetric = /* @__PURE__ */ __name((method, args) => {
  let action;
  if (method in metrics_exports2) {
    action = metrics_exports2[method];
  } else {
    action = metrics_exports[method];
  }
  action(args);
}, "trackMetric");

// game/actions/activateOrb.ts
var orbActivators = {
  protection(character, scene) {
    const block = character.magic * 0.5;
    applyBlock(character, scene, block);
    emitMove({
      moveName: "Protection!",
      targetType: "self",
      characterUid: character.uid,
      targetUids: [character.uid],
      scene
    });
  },
  lightning(character, scene) {
    const damage = Math.ceil(character.magic * 0.35);
    const targetUids = getLivingNpcs(scene.get()).map((npc) => npc.uid);
    targetUids.forEach(
      (uid) => applyDamage({
        damage,
        targetUid: uid,
        attackerUid: character.uid,
        scene
      })
    );
    emitMove({
      moveName: "Lightning!",
      targetType: "allEnemies",
      characterUid: character.uid,
      targetUids: [],
      scene
    });
  },
  frost(character, scene) {
    applyEffect(
      scene,
      getLivingPcs(scene.get()).map((c) => c.uid),
      "strongblockBuff",
      1
    );
    applyEffect(
      scene,
      getLivingNpcs(scene.get()).map((c) => c.uid),
      "tiredDebuff",
      1
    );
    updateHand(scene);
    emitMove({
      moveName: "Orb of Frost",
      targetType: "self",
      characterUid: character.uid,
      targetUids: [character.uid],
      scene
    });
  },
  holyLight(character, scene) {
    scene.apply(["allCharacters", character.uid], (cm) => {
      const addHealth = Math.ceil(cm.magic * 0.15);
      const newHealth = Math.min(cm.constitution, cm.health + addHealth);
      return { ...cm, health: newHealth };
    });
    applyBlock(character, scene, character.defense + character.magic * 0.5);
    updateHand(scene);
    emitMove({
      moveName: "Holy Light",
      targetType: "self",
      characterUid: character.uid,
      targetUids: [character.uid],
      scene
    });
  },
  crossedFingers(character, scene) {
  }
};
var activateOrb2 = /* @__PURE__ */ __name(({
  game,
  orb,
  characterUid
}) => {
  const scene = getBattleSceneIn(game);
  const character = scene.get("allCharacters", characterUid);
  validate(character, orb);
  activate(orb, character, scene);
  trackMetric("activateOrb", { orb, character, scene });
  updateHand(scene);
  maybeTransitionBattleState(scene);
}, "activateOrb");
function applyBlock(character, scene, block) {
  const multiplier = calculateStats(character).blockMultiplier;
  scene.apply(
    ["allCharacters", character.uid, "block"],
    (b2) => Math.ceil(b2 + block * multiplier)
  );
}
__name(applyBlock, "applyBlock");
function validate(character, orb) {
  if (character.orbs.find((o) => (0, import_lodash24.isEqual)(o, orb)) == null)
    throw new Error("hmm you don't seem to have that orb");
  if (character.isPc === false)
    throw new Error("why would an npc perform this action?");
}
__name(validate, "validate");
function activate(orb, character, scene) {
  orbActivators[orb.type](character, scene);
  decrementCounter(character, orb, scene);
  updateNpcMoves(scene);
}
__name(activate, "activate");
function decrementCounter(character, orb, scene) {
  scene.select("allCharacters", character.uid).apply("orbs", (orbs) => {
    const orbIndex = orbs.findIndex((o) => o.type === orb.type);
    if (orbIndex === -1)
      throw new Error("something is deeply wrong with orb updating");
    let updatedOrb = [orb];
    if (orb.remainingCount <= 1) {
      updatedOrb = [];
    } else {
      updatedOrb = [
        { type: orb.type, remainingCount: orb.remainingCount - 1 }
      ];
    }
    return [
      ...orbs.slice(0, orbIndex),
      ...updatedOrb,
      ...orbs.slice(orbIndex + 1)
    ];
  });
}
__name(decrementCounter, "decrementCounter");

// game/actions/activateSouvenir.ts
init_util();
var activateSouvenir2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  const souvenirs = scene.get("souvenirs");
  const idx = souvenirs.findIndex((s2) => s2.id === args.souvenirId);
  const souvenir = souvenirs[idx];
  if (!souvenir || !souvenir.on.activate)
    return;
  activateSouvenir(souvenir, "activate", scene, idx);
}, "activateSouvenir");

// game/actions/addCardToDeck.ts
init_util();
var addCardToDeck2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  const card = scene.get("newCardOptions", args.cardUid);
  if (card == null)
    throw new Error("that card uid isn't an option..");
  trackMetric("addCardToDeck", { card, scene });
  addCardToDeckPostValidation(scene, { ...card, uid: args.cardUid });
  checkServerScoringEvent("CARDS_DRAFT_BALANCED", scene);
  scene.set("lootEarned", scene.get("lootEarned").slice(1));
  if (scene.get("lootEarned").length > 0) {
    scene.set("newCardOptions", getNewCardOptions(scene.get()));
    scene.set("state", "collecting loot");
  } else {
    scene.set("newCardOptions", {});
    scene.set("state", "map");
    scene.set("isInMap", true);
  }
}, "addCardToDeck");
function addCardToDeckPostValidation(scene, card) {
  scene.apply("cards", (cards) => {
    return {
      ...cards,
      draw: {
        ...cards.draw,
        [card.uid]: card
      }
    };
  });
  scene.apply("cardsDrafted", (cards) => [...cards, card]);
}
__name(addCardToDeckPostValidation, "addCardToDeckPostValidation");

// game/actions/changeDungeon.ts
init_rulebook2();
init_util();
var changeDungeon = /* @__PURE__ */ __name((args) => {
  const levels = getRulebook().dungeonLevels;
  const scene = getEntrySceneIn(args.game);
  let l = scene.select("selectedLevel").get().num + args.direction;
  if (l < 1) {
    l = levels.length;
  } else if (l > levels.length) {
    l = 1;
  }
  scene.select("selectedCharacters").set([null, null, null]);
  scene.select("selectedLevel").set(levels[l - 1]);
}, "changeDungeon");

// game/actions/changeScene.ts
init_rulebook2();
init_util();
var changeScene = /* @__PURE__ */ __name((args) => {
  const { game } = args;
  if (args.newSceneName === "battle") {
    const entrySceneData = getEntrySceneIn(args.game).get();
    const { selectedCharacters, selectedLevel, runId } = entrySceneData;
    const dungeonName = getRulebook().dungeonLevels[selectedLevel.num].name;
    game.set(
      "scene",
      makeBattleState({
        chosen: selectedCharacters.filter((c) => c != null).map((c) => c),
        dungeonName,
        game: args.game,
        runId
      })
    );
    const scene = getBattleSceneIn(args.game);
    setCards(scene);
    acquireTalents(scene);
  } else if (args.newSceneName === "showcase") {
    game.set("scene", { id: "showcase" });
  } else if (["worlds", "pvp", "daily", "marketplace", "entry"].includes(args.newSceneName)) {
    const cur = game.select("scene").get();
    game.set("scene", { ...cur, id: args.newSceneName });
  }
}, "changeScene");

// game/actions/choosePlushy.ts
var import_immer12 = __toESM(require("immer"));
init_util();
var import_lodash25 = require("lodash");
var REVIVE_HEAL = 0.25;
var SINGLE_HEAL = 0.5;
var PARTY_HEAL = 0.5;
var MAX_NUM_CARDS_TO_REMOVE = 3;
var choosePlushy = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  if (scene.get("currentRoom", "category") !== "restSite" || scene.get("isInMap"))
    return;
  if (args.index === 2)
    healAllPartyMembers(scene);
  else if (args.index === 1)
    healOrReviveOne(scene, args.specifics);
  else if (args.index === 0)
    removeCards(scene, args.specifics);
  scene.set("isInMap", true);
}, "choosePlushy");
function healAllPartyMembers(scene) {
  scene.apply(
    "allCharacters",
    (0, import_immer12.default)((ac) => {
      Object.values(ac).filter((cm) => cm.isPc && cm.health > 0).forEach((cm) => {
        cm.health = Math.min(
          cm.constitution,
          Math.ceil(cm.health + cm.constitution * PARTY_HEAL)
        );
      });
    })
  );
}
__name(healAllPartyMembers, "healAllPartyMembers");
function removeCards(scene, cardUids) {
  scene.select("cards", "draw").apply(
    (draw2) => (0, import_lodash25.omit)(draw2, ...cardUids.slice(0, MAX_NUM_CARDS_TO_REMOVE))
  );
}
__name(removeCards, "removeCards");
function healOrReviveOne(scene, characterUid) {
  const character = scene.get("allCharacters", characterUid);
  if (character.health <= 0) {
    restoreDeadCharacterCards(scene, characterUid);
  }
  scene.select("allCharacters", characterUid).apply(
    (0, import_immer12.default)((c) => {
      if (c.health <= 0) {
        c.health = Math.ceil(c.constitution * REVIVE_HEAL);
      } else
        c.health = Math.min(
          c.constitution,
          c.health + Math.ceil(c.constitution * SINGLE_HEAL)
        );
    })
  );
}
__name(healOrReviveOne, "healOrReviveOne");

// game/actions/collectLoot.ts
init_util();
var import_lodash26 = require("lodash");
var collectLoot = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  const remainingLoot = scene.get("lootEarned");
  if ((0, import_lodash26.isEmpty)(remainingLoot)) {
    return;
  }
  if (remainingLoot[0].name === "draftCard") {
    return scene.set("state", "choosing cards");
  }
  const newRemainingLoot = collectCurrentLootItem(scene);
  if ((0, import_lodash26.isEmpty)(newRemainingLoot)) {
    return args.game.select("scene").set("isInMap", true);
  }
  return;
}, "collectLoot");
function collectCurrentLootItem(scene) {
  const currentLootItem = scene.get("lootEarned").at(0);
  if (currentLootItem) {
    scene.set("lootClaimed", [...scene.get("lootClaimed"), currentLootItem]);
  } else {
    return [];
  }
  const newRemainingLoot = scene.get("lootEarned").slice(1);
  scene.set("lootEarned", newRemainingLoot);
  return newRemainingLoot;
}
__name(collectCurrentLootItem, "collectCurrentLootItem");

// game/actions/discard.ts
init_util();
var discard2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  const numRequiredToDiscard = scene.get("numRequiredToDiscard");
  if (numRequiredToDiscard <= 0) {
    logger.warn("tried to discard in wrong gamestate");
    return;
  }
  if (numRequiredToDiscard !== args.cardUids.length) {
    logger.warn(
      `expected ${numRequiredToDiscard} card uids, but got ${args.cardUids.length}`
    );
    return;
  }
  const hand = scene.get("cards", "hand");
  args.cardUids.forEach((uid) => {
    try {
      const card = hand[uid];
      trackMetric("discardCard", { card, scene });
    } catch (err2) {
      const error = err2;
      logger.error(`error tracking card discard aciton: ${error.message}`);
    }
  });
  discardBeforeTurnEnd({ cardUids: args.cardUids, scene });
  scene.set("numRequiredToDiscard", 0);
}, "discard");

// game/actions/endTurn.ts
init_util();
var import_immer13 = require("immer");
var TIME_AFTER_PLAYER_MOVE = 1500;
var endTurn2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  if (scene.get("isPlayerTurn") !== true || scene.get("state") !== "in battle" || scene.get("isInMap") === true) {
    logger.warn(`${scene.get("userId")} tried to end turn when not allowed`);
    return;
  }
  updateMetricsAndScoring(scene);
  setDefaultEndPlayerTurnState(scene);
  applyTurnStartEffects(scene, "npc");
  activateSouvenirs("turnEnd", scene);
  activateTalents({ scene, key: "turnEnd" });
  trackStateChanges(scene);
  scene.apply(
    "allCharacters",
    (0, import_immer13.produce)((ac) => {
      for (const [uid, cm] of Object.entries(ac)) {
        if (!cm.isPc)
          continue;
        cm.lastTaunt = cm.taunt;
      }
      return ac;
    })
  );
  popAndRunQueue(scene, "npc");
  args.game.set("nextAction", {
    index: 0,
    method: "doNpcTurn",
    delay: TIME_AFTER_PLAYER_MOVE
  });
}, "endTurn");
function updateMetricsAndScoring(scene) {
  trackMetric("endTurn", { scene });
  checkServerScoringEvent("CARDS_OVER_THRESHOLD", scene);
  checkServerScoringEvent("CARDS_WHOLE_PARTY", scene);
}
__name(updateMetricsAndScoring, "updateMetricsAndScoring");
function setDefaultEndPlayerTurnState(scene) {
  clearBlock(scene, "npc");
  scene.set("cardsPlayedThisTurn", []);
  updateWizardAbility(scene);
  scene.set("numAllowedToKeep", 0);
  setAllCharactersToUnmoved(scene);
  discardAllCards(scene);
  scene.set("isPlayerTurn", false);
}
__name(setDefaultEndPlayerTurnState, "setDefaultEndPlayerTurnState");
function trackStateChanges(scene) {
  trackStanceChanges(scene);
}
__name(trackStateChanges, "trackStateChanges");

// game/actions/exitDungeon.ts
var exitDungeon = /* @__PURE__ */ __name((args) => {
  if (args.game.select("scene").get("id") !== "battle") {
    throw Error("exitDungeon callede when not in a battle scene");
  }
  args.game.select("scene").set(getInitialEntryState());
}, "exitDungeon");

// game/actions/finishCard.ts
var import_immer14 = require("immer");
init_util();
var finishCard = /* @__PURE__ */ __name(({ cardUids, game }) => {
  const scene = getBattleSceneIn(game);
  const ra = scene.get("requireAction");
  if (ra == null)
    throw Error("no action is required");
  if (cardUids.length < ra.least || cardUids.length > ra.most)
    throw Error("wrong number of cards");
  switch (ra.type) {
    case "discardHand": {
      discard({ cardUids, scene });
      break;
    }
    case "removeRoom": {
      scene.apply(
        "cards",
        (0, import_immer14.produce)((cards) => {
          for (const uid of cardUids) {
            const card = cards.hand[uid];
            if (card == null)
              throw Error("card not in hand:" + uid);
            delete cards.hand[uid];
            cards.removedRoom[uid] = card;
          }
        })
      );
      break;
    }
    case "discardDraw": {
      scene.apply(
        "cards",
        (0, import_immer14.produce)((cards) => {
          for (const uid of cardUids) {
            const card = cards.draw[uid];
            if (card == null)
              throw Error("card not in draw:" + uid);
            delete cards.draw[uid];
            cards.discard[uid] = card;
          }
        })
      );
      break;
    }
    default: {
      throw Error("unknown required action type:", ra.type);
    }
  }
  scene.set("requireAction", null);
}, "finishCard");

// game/actions/getFreeCard.ts
init_util();
var import_lodash27 = require("lodash");
var getFreeCard = /* @__PURE__ */ __name((args) => {
  if (isProduction)
    return logger.info("tried to get free card in production!");
  const scene = getBattleSceneIn(args.game);
  addCardToDeckPostValidation(scene, args.card);
  updateUidInFullDecks(args, scene);
}, "getFreeCard");
function updateUidInFullDecks(args, scene) {
  const oldUid = args.card.uid;
  const newUid = args.card.uid + "_";
  scene.select("fullSelectedCharacterDecks", args.card.characterUid).apply((pile) => ({
    ...(0, import_lodash27.omit)(pile, oldUid),
    [newUid]: {
      ...pile[oldUid],
      uid: newUid
    }
  }));
}
__name(updateUidInFullDecks, "updateUidInFullDecks");

// game/actions/getFreeSouvenir.ts
init_util();
var getFreeSouvenir = /* @__PURE__ */ __name((args) => {
  if (isProduction)
    return logger.info("tried to get free souvenir in production!");
  acquireSouvenir(
    args.souvenirId,
    args.characterUid,
    getBattleSceneIn(args.game)
  );
}, "getFreeSouvenir");

// game/actions/getRandom.ts
function getRandom() {
  return srandom();
}
__name(getRandom, "getRandom");

// game/actions/nextRoom.ts
init_util();
var import_immer15 = require("immer");
init_code();

// game/characterGeneration/data/talents.ts
var numTalents = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 3
};
var talentRarities = {
  common: {
    bard: [],
    cleric: [],
    frogKnight: [],
    generic: [
      "aboveAverageMetabolism",
      "worksOutOccasionally",
      "magicallyInclined",
      "tougherThanMost"
    ],
    knight: [],
    penguinKnight: [],
    rogue: [],
    warhog: [],
    wizard: []
  },
  uncommon: {
    bard: ["quickWittedInsults", "loungeSinger"],
    cleric: ["emergencyBaptismKit", "bloodPact"],
    frogKnight: ["stickyTongue", "slipperyWhenWet", "stickyhands"],
    generic: [
      "fisherman",
      "hypochondriac",
      "quickToPickAFight",
      "excellentCook",
      "bully",
      "selflessCompanion",
      "stealthy",
      "frontlineFighter",
      "levelHeaded",
      "healthyEater",
      "gymRat",
      "sorcerer",
      "thickSkinned"
    ],
    knight: ["barbarian", "pillager", "nobleGuardian"],
    penguinKnight: [
      "anxietyRiddled",
      "accidentProne",
      "oathOftheMoment",
      "peppy"
    ],
    rogue: [
      "dirtyDealer",
      "thrifty",
      "scrappyAndVicious",
      "oneWithTheShadows"
    ],
    warhog: [
      "bigYawn",
      "shortTempered",
      "bigNapper",
      "veryVeryLarge",
      "reinforcedHooves"
    ],
    wizard: ["tormentedByWhispers", "photographicMemory"]
  },
  rare: {
    bard: [
      "rolltoSeduce",
      "lordOfLullabies",
      "reallyGoodAtWritingSongsAboutWizards",
      "warriorPoet"
    ],
    cleric: [
      "selflessHealer",
      "immovableObject",
      "unholyPracticioner",
      "certifiedReikiSpecialist"
    ],
    frogKnight: ["poisonousBlood", "wiseCroaker"],
    generic: [
      "escapeArtist",
      "goodAtPlanning",
      "pressurePointSpecialist",
      "experiencedForager",
      "magnetForWeirdCircumstances",
      "marathonRunner",
      "bigGameHunter",
      "greatGuy",
      "ADHD"
    ],
    knight: [
      "royalGuard",
      "shieldProficiency",
      "intimidating",
      "attritionFighter"
    ],
    penguinKnight: ["disarminglyCute", "extraBlubbery", "headEmpty"],
    rogue: [
      "masterLooter",
      "invigoratedbyBloodshed",
      "bagofContraband",
      "arterialArtisan"
    ],
    warhog: ["excellentStompDancer", "thickBoned", "ironSkinned"],
    wizard: [
      "fireMage",
      "aspiringSeer",
      "forgetfulGenius",
      "theStarsAreRight"
    ]
  },
  epic: {
    bard: [],
    cleric: ["pulseOfFaith"],
    frogKnight: [],
    generic: ["bornSurvivor", "secretVampire"],
    knight: ["veteranPitFighter", "terrifying"],
    penguinKnight: ["doingtheirBest"],
    rogue: [],
    warhog: ["apexOmnivore"],
    wizard: ["privyToAnAncientAndTerribleSecret", "masterOracle"]
  }
};

// game/characterGeneration/data/rarities.ts
var rarityOrder = ["common", "uncommon", "rare", "epic"];
var masterRarities = {
  common: -1,
  uncommon: 5169,
  rare: 9539,
  epic: 1e4
};
var rollRanges = {
  common: [1e4, 0, 0, 0],
  uncommon: [4e3, 1e4, 0, 0],
  rare: [1500, 5500, 1e4, 0],
  epic: [0, 2500, 6e3, 1e4]
};
var rollMasterRarity = /* @__PURE__ */ __name(() => {
  const roll = rollNumber();
  for (const [rarity, value] of Object.entries(masterRarities)) {
    if (roll <= value)
      return rarity;
  }
  return "common";
}, "rollMasterRarity");
var rollItemRarity = /* @__PURE__ */ __name((master) => {
  const ranges = rollRanges[master];
  const roll = rollNumber();
  for (const [idx, val] of ranges.entries()) {
    if (roll <= val)
      return rarityOrder[idx];
  }
  return "common";
}, "rollItemRarity");
var rollItem = /* @__PURE__ */ __name((items, masterRarity, pity = false, filterOut = []) => {
  const rarity = pity ? masterRarity : rollItemRarity(masterRarity);
  const pool = items[rarity].filter(
    (v) => !Object.entries(filterOut).map(([k2, v2]) => v2.name).includes(v)
  );
  const item = randomValue(pool);
  return {
    rarity,
    name: item
  };
}, "rollItem");
var rollComponents = /* @__PURE__ */ __name((components, masterRarity) => {
  const items = {};
  const pitySlot = randomValue(Object.keys(components));
  let hasPity = true;
  for (const [component, pools] of Object.entries(components)) {
    const item = rollItem(pools, masterRarity);
    if (item.rarity === masterRarity)
      hasPity = false;
    items[component] = item;
  }
  if (hasPity === true) {
    items[pitySlot] = rollItem(components[pitySlot], masterRarity, true);
  }
  return items;
}, "rollComponents");
var rollTalents = /* @__PURE__ */ __name((species4, characterClass, masterRarity) => {
  const pools = Object.fromEntries(
    Object.entries(talentRarities).map(([k2, v]) => {
      return [k2, [...v["generic"], ...v[species4], ...v[characterClass]]];
    })
  );
  const numAttributes = numTalents[masterRarity];
  const pitySlot = randomInteger(0, numAttributes - 1);
  let hasPity = true;
  const talents = [];
  for (let i = 0; i < numAttributes; i++) {
    const talent = rollItem(pools, masterRarity, false, talents);
    if (talent.rarity === masterRarity)
      hasPity = false;
    talents.push(talent);
  }
  if (hasPity === true) {
    talents[pitySlot] = rollItem(pools, masterRarity, true, talents);
  }
  return talents;
}, "rollTalents");

// game/characterGeneration/data/frog.ts
var frog_exports = {};
__export(frog_exports, {
  attachmentMap: () => attachmentMap,
  classOverrides: () => classOverrides,
  names: () => names,
  skinMap: () => skinMap,
  species: () => species
});
var species = "frogKnight";
var skinMap = {
  common: {
    Regular: {
      base: "Regular/Regular"
    }
  },
  uncommon: {
    Regular: {
      base: "Regular/Regular"
    }
  },
  rare: {
    Regular: {
      base: "Regular/Regular"
    }
  },
  epic: {
    Regular: {
      base: "Regular/Regular"
    }
  }
};
var attachmentMap = {
  Body: {
    common: ["Regular/Body/Body_01"],
    uncommon: ["Regular/Body/Body_02", "Regular/Body/Body_03"],
    rare: ["Regular/Body/Body_05"],
    epic: ["Regular/Body/Body_04"]
  },
  Eyes: {
    common: ["Regular/Eyes/Eye_01"],
    uncommon: [
      "Regular/Eyes/Eye_02",
      "Regular/Eyes/Eye_07",
      "Regular/Eyes/Eye_09",
      "Regular/Eyes/Eye_011",
      "Regular/Eyes/Eye_014",
      "Regular/Eyes/Eye_015",
      "Regular/Eyes/Eye_017",
      "Regular/Eyes/Eye_018",
      "Regular/Eyes/Eye_019",
      "Regular/Eyes/Eye_020",
      "Regular/Eyes/Eye_022",
      "Regular/Eyes/Eye_023",
      "Regular/Eyes/Eye_024"
    ],
    rare: [
      "Regular/Eyes/Eye_04",
      "Regular/Eyes/Eye_05",
      "Regular/Eyes/Eye_06",
      "Regular/Eyes/Eye_010",
      "Regular/Eyes/Eye_012",
      "Regular/Eyes/Eye_013",
      "Regular/Eyes/Eye_016"
    ],
    epic: [
      "Regular/Eyes/Eye_03",
      "Regular/Eyes/Eye_08",
      "Regular/Eyes/Eye_021"
    ]
  },
  Mouth: {
    common: ["Regular/Mouth/Mouth_04"],
    uncommon: [
      "Regular/Mouth/Mouth_02",
      "Regular/Mouth/Mouth_03",
      "Regular/Mouth/Mouth_06",
      "Regular/Mouth/Mouth_07",
      "Regular/Mouth/Mouth_09",
      "Regular/Mouth/Mouth_010",
      "Regular/Mouth/Mouth_011",
      "Regular/Mouth/Mouth_012",
      "Regular/Mouth/Mouth_013",
      "Regular/Mouth/Mouth_014",
      "Regular/Mouth/Mouth_018",
      "Regular/Mouth/Mouth_019"
    ],
    rare: [
      "Regular/Mouth/Mouth_05",
      "Regular/Mouth/Mouth_08",
      "Regular/Mouth/Mouth_015",
      "Regular/Mouth/Mouth_016",
      "Regular/Mouth/Mouth_017"
    ],
    epic: ["Regular/Mouth/Mouth_01"]
  }
};
var classOverrides = {
  cleric: {
    Head: {
      common: ["Regular/Class/Cleric/Head/Cleric_Head_01"],
      uncommon: ["Regular/Class/Cleric/Head/Cleric_Head_01"],
      rare: ["Regular/Class/Cleric/Head/Cleric_Head_02"],
      epic: ["Regular/Class/Cleric/Head/Cleric_Head_02"]
    },
    LeftHand: {
      common: ["Regular/Class/Cleric/L_Hand/Cleric_L_Hand_01"],
      uncommon: ["Regular/Class/Cleric/L_Hand/Cleric_L_Hand_01"],
      rare: ["Regular/Class/Cleric/L_Hand/Cleric_L_Hand_01"],
      epic: ["Regular/Class/Cleric/L_Hand/Cleric_L_Hand_01"]
    },
    RightHand: {
      common: ["Regular/Class/Cleric/R_Hand/Cleric_R_Hand_01"],
      uncommon: ["Regular/Class/Cleric/R_Hand/Cleric_R_Hand_01"],
      rare: ["Regular/Class/Cleric/R_Hand/Cleric_R_Hand_01"],
      epic: ["Regular/Class/Cleric/R_Hand/Cleric_R_Hand_01"]
    }
  },
  knight: {
    Head: {
      common: ["Regular/Class/Knight/Head/Knight_Head_01"],
      uncommon: ["Regular/Class/Knight/Head/Knight_Head_01"],
      rare: ["Regular/Class/Knight/Head/Knight_Head_02"],
      epic: ["Regular/Class/Knight/Head/Knight_Head_02"]
    },
    LeftHand: {
      common: ["Regular/Class/Knight/L_Hand/Knight_L_Hand_01"],
      uncommon: ["Regular/Class/Knight/L_Hand/Knight_L_Hand_01"],
      rare: ["Regular/Class/Knight/L_Hand/Knight_L_Hand_01"],
      epic: ["Regular/Class/Knight/L_Hand/Knight_L_Hand_01"]
    },
    RightHand: {
      common: ["Regular/Class/Knight/R_Hand/Knight_R_Hand_01"],
      uncommon: ["Regular/Class/Knight/R_Hand/Knight_R_Hand_01"],
      rare: ["Regular/Class/Knight/R_Hand/Knight_R_Hand_01"],
      epic: ["Regular/Class/Knight/R_Hand/Knight_R_Hand_01"]
    }
  },
  rogue: {
    Head: {
      common: ["Regular/Class/Rogue/Head/Rogue_Head_01"],
      uncommon: ["Regular/Class/Rogue/Head/Rogue_Head_01"],
      rare: ["Regular/Class/Rogue/Head/Rogue_Head_01"],
      epic: ["Regular/Class/Rogue/Head/Rogue_Head_01"]
    },
    LeftHand: {
      common: ["Regular/Class/Rogue/L_Hand/Rogue_L_Hand_01"],
      uncommon: ["Regular/Class/Rogue/L_Hand/Rogue_L_Hand_01"],
      rare: ["Regular/Class/Rogue/L_Hand/Rogue_L_Hand_01"],
      epic: ["Regular/Class/Rogue/L_Hand/Rogue_L_Hand_01"]
    },
    RightHand: {
      common: ["Regular/Class/Rogue/R_Hand/Rogue_R_Hand_01"],
      uncommon: ["Regular/Class/Rogue/R_Hand/Rogue_R_Hand_01"],
      rare: ["Regular/Class/Rogue/R_Hand/Rogue_R_Hand_01"],
      epic: ["Regular/Class/Rogue/R_Hand/Rogue_R_Hand_01"]
    }
  }
};
var names = {
  firstName: [
    "Skip",
    "Gorb",
    "Hoppy",
    "James",
    "Kermit",
    "Mr.",
    "Squish",
    "Squirt",
    "Dennis",
    "Elvis",
    "Patsy",
    "Waylon",
    "Judd",
    "Earl",
    "June",
    "Bentley",
    "Darnell",
    "Baldwin",
    "Alfred",
    "Charlton",
    "Presley",
    "Remington",
    "Weston",
    "Woodrow",
    "Blossom",
    "Brook",
    "Chester",
    "Poppy",
    "Skippy",
    "Tatum",
    "Bridget",
    "Bayou",
    "Ms.",
    "Mrs.",
    "Renelda",
    "Hank",
    "Ayahuasca",
    "Kambo",
    "Aldwin",
    "Arthur",
    "Lily"
  ],
  lastName1: [
    {
      name: "Pond",
      complete: false
    },
    {
      name: "Hop",
      complete: false
    },
    {
      name: "Slip",
      complete: false
    },
    {
      name: "Wet",
      complete: false
    },
    {
      name: "Croak",
      complete: false
    },
    {
      name: "Leap",
      complete: false
    },
    {
      name: "Tree",
      complete: false
    },
    {
      name: "Webfoot",
      complete: true
    },
    {
      name: "Ribbit",
      complete: false
    },
    {
      name: "Puddle",
      complete: false
    },
    {
      name: "Splish Splash",
      complete: true
    },
    {
      name: "Smooth",
      complete: false
    },
    {
      name: "Bumpy",
      complete: false
    },
    {
      name: "Jump",
      complete: false
    },
    {
      name: "Lake",
      complete: false
    },
    {
      name: "Tadpole",
      complete: true
    },
    {
      name: "Lick",
      complete: false
    },
    {
      name: "Poison",
      complete: false
    },
    {
      name: "Wood",
      complete: false
    },
    {
      name: "Tomato",
      complete: false
    },
    {
      name: "Moss",
      complete: false
    },
    {
      name: "Mold",
      complete: false
    },
    {
      name: "Oak",
      complete: false
    },
    {
      name: "Summer",
      complete: false
    },
    {
      name: "Bog",
      complete: false
    },
    {
      name: "Marsh",
      complete: false
    },
    {
      name: "Salt Marsh",
      complete: true
    },
    {
      name: "Swim",
      complete: false
    },
    {
      name: "Paddle",
      complete: false
    },
    {
      name: "Reservoir",
      complete: true
    },
    {
      name: "Lagoon",
      complete: true
    },
    {
      name: "Pothole",
      complete: true
    },
    {
      name: "Bounce",
      complete: false
    },
    {
      name: "Yonder",
      complete: false
    },
    {
      name: "Lazy",
      complete: false
    },
    {
      name: "Green",
      complete: false
    },
    {
      name: "Mescaline",
      complete: true
    },
    {
      name: "Psychic",
      complete: false
    },
    {
      name: "Damp",
      complete: false
    },
    {
      name: "Moist",
      complete: false
    },
    {
      name: "Lily Pad",
      complete: true
    }
  ],
  lastName2: [
    "water",
    "lake",
    "splash",
    "hopper",
    "croaker",
    "bump",
    "swallower",
    "tongue",
    "stare",
    "friend",
    "buddy",
    "champ",
    "lick",
    "hop",
    "frog",
    "toad",
    "creek",
    "bog",
    "pool",
    "marsh",
    "mold",
    "tree",
    "land",
    "moor",
    "swim",
    "tunnel",
    "sleep",
    "spring",
    "skip",
    "frolic",
    "dance",
    "skipper",
    "kettle",
    "vision",
    "herb",
    "venom",
    "dream",
    "fly",
    "bark",
    "trip",
    "log",
    "bubble"
  ]
};

// game/characterGeneration/data/warhog.ts
var warhog_exports = {};
__export(warhog_exports, {
  attachmentMap: () => attachmentMap2,
  names: () => names2,
  skinMap: () => skinMap2,
  species: () => species2
});
var species2 = "warhog";
var skinMap2 = {
  common: {
    "01_regular": {
      base: "01_regular/Regular",
      extra: {
        Tail: {
          common: ["01_regular/regularTails/regular_tail_01"],
          uncommon: [
            "01_regular/regularTails/regular_tail_02",
            "01_regular/regularTails/regular_tail_03",
            "01_regular/regularTails/regular_tail_05",
            "01_regular/regularTails/regular_tail_06",
            "01_regular/regularTails/regular_tail_011",
            "01_regular/regularTails/regular_tail_012",
            "01_regular/regularTails/regular_tail_013",
            "01_regular/regularTails/regular_tail_014",
            "01_regular/regularTails/regular_tail_015"
          ],
          rare: [
            "01_regular/regularTails/regular_tail_07",
            "01_regular/regularTails/regular_tail_016"
          ],
          epic: [
            "01_regular/regularTails/regular_tail_04",
            "01_regular/regularTails/regular_tail_08",
            "01_regular/regularTails/regular_tail_010"
          ]
        }
      }
    }
  },
  uncommon: {
    "07_swamp": {
      base: "07_swamp/swamp",
      extra: {
        Tail: {
          common: ["07_swamp/swampTails/swamp_tail_01"],
          uncommon: [
            "07_swamp/swampTails/swamp_tail_02",
            "07_swamp/swampTails/swamp_tail_03",
            "07_swamp/swampTails/swamp_tail_05",
            "07_swamp/swampTails/swamp_tail_06",
            "07_swamp/swampTails/swamp_tail_011",
            "07_swamp/swampTails/swamp_tail_012",
            "07_swamp/swampTails/swamp_tail_013",
            "07_swamp/swampTails/swamp_tail_014",
            "07_swamp/swampTails/swamp_tail_015"
          ],
          rare: [
            "07_swamp/swampTails/swamp_tail_07",
            "07_swamp/swampTails/swamp_tail_016"
          ],
          epic: [
            "07_swamp/swampTails/swamp_tail_04",
            "07_swamp/wampTails/swamp_tail_08",
            "07_swamp/wampTails/swamp_tail_010"
          ]
        }
      }
    },
    "04_fire": {
      base: "04_fire/fire",
      extra: {
        Tail: {
          common: ["04_fire/fireTails/fire_tail_01"],
          uncommon: [
            "04_fire/fireTails/fire_tail_02",
            "04_fire/fireTails/fire_tail_03",
            "04_fire/fireTails/fire_tail_05",
            "04_fire/fireTails/fire_tail_06",
            "04_fire/fireTails/fire_tail_011",
            "04_fire/fireTails/fire_tail_012",
            "04_fire/fireTails/fire_tail_013",
            "04_fire/fireTails/fire_tail_014",
            "04_fire/fireTails/fire_tail_015"
          ],
          rare: [
            "04_fire/fireTails/fire_tail_07",
            "04_fire/fireTails/fire_tail_016"
          ],
          epic: [
            "04_fire/fireTails/fire_tail_04",
            "04_fire/fireTails/fire_tail_08",
            "04_fire/fireTails/fire_tail_010"
          ]
        }
      }
    },
    "05_ice": {
      base: "05_ice/ice",
      extra: {
        Tail: {
          common: ["05_ice/iceTails/ice_tail_01"],
          uncommon: [
            "05_ice/iceTails/ice_tail_02",
            "05_ice/iceTails/ice_tail_03",
            "05_ice/iceTails/ice_tail_05",
            "05_ice/iceTails/ice_tail_06",
            "05_ice/iceTails/ice_tail_011",
            "05_ice/iceTails/ice_tail_012",
            "05_ice/iceTails/ice_tail_013",
            "05_ice/iceTails/ice_tail_014",
            "05_ice/iceTails/ice_tail_015"
          ],
          rare: [
            "05_ice/iceTails/ice_tail_07",
            "05_ice/iceTails/ice_tail_016"
          ],
          epic: [
            "05_ice/iceTails/ice_tail_04",
            "05_ice/iceTails/ice_tail_08",
            "05_ice/iceTails/ice_tail_010"
          ]
        }
      }
    }
  },
  rare: {
    "02_Algae": {
      base: "02_Algae/algae",
      extra: {
        Tail: {
          common: ["02_Algae/algaeTails/algae_tail_01"],
          uncommon: [
            "02_Algae/algaeTails/algae_tail_02",
            "02_Algae/algaeTails/algae_tail_03",
            "02_Algae/algaeTails/algae_tail_05",
            "02_Algae/algaeTails/algae_tail_06",
            "02_Algae/algaeTails/algae_tail_011",
            "02_Algae/algaeTails/algae_tail_012",
            "02_Algae/algaeTails/algae_tail_013",
            "02_Algae/algaeTails/algae_tail_014",
            "02_Algae/algaeTails/algae_tail_015"
          ],
          rare: [
            "02_Algae/algaeTails/algae_tail_07",
            "02_Algae/algaeTails/algae_tail_016"
          ],
          epic: [
            "02_Algae/algaeTails/algae_tail_04",
            "02_Algae/algaeTails/algae_tail_08",
            "02_Algae/algaeTails/algae_tail_010"
          ]
        }
      }
    },
    "03_Darkness": {
      base: "03_Darkness/darkness",
      extra: {
        Tail: {
          common: ["03_Darkness/darknessTails/darkness_tail_01"],
          uncommon: [
            "03_Darkness/darknessTails/darkness_tail_02",
            "03_Darkness/darknessTails/darkness_tail_03",
            "03_Darkness/darknessTails/darkness_tail_05",
            "03_Darkness/darknessTails/darkness_tail_06",
            "03_Darkness/darknessTails/darkness_tail_011",
            "03_Darkness/darknessTails/darkness_tail_012",
            "03_Darkness/darknessTails/darkness_tail_013",
            "03_Darkness/darknessTails/darkness_tail_014",
            "03_Darkness/darknessTails/darkness_tail_015"
          ],
          rare: [
            "03_Darkness/darknessTails/darkness_tail_07",
            "03_Darkness/darknessTails/darkness_tail_016"
          ],
          epic: [
            "03_Darkness/darknessTails/darkness_tail_04",
            "03_Darkness/darknessTails/darkness_tail_08",
            "03_Darkness/darknessTails/darkness_tail_010"
          ]
        }
      }
    }
  },
  epic: {
    "06_Golden": {
      base: "06_Golden/golden",
      extra: {
        Tail: {
          common: ["06_Golden/goldenTails/golden_tail_01"],
          uncommon: [
            "06_Golden/goldenTails/golden_tail_02",
            "06_Golden/goldenTails/golden_tail_03",
            "06_Golden/goldenTails/golden_tail_05",
            "06_Golden/goldenTails/golden_tail_06",
            "06_Golden/goldenTails/golden_tail_011",
            "06_Golden/goldenTails/golden_tail_012",
            "06_Golden/goldenTails/golden_tail_013",
            "06_Golden/goldenTails/golden_tail_014",
            "06_Golden/goldenTails/golden_tail_015"
          ],
          rare: [
            "06_Golden/goldenTails/golden_tail_07",
            "06_Golden/goldenTails/golden_tail_016"
          ],
          epic: [
            "06_Golden/goldenTails/golden_tail_04",
            "06_Golden/goldenTails/golden_tail_08",
            "06_Golden/goldenTails/golden_tail_010"
          ]
        }
      }
    }
  }
};
var attachmentMap2 = {
  Eyes: {
    common: ["Eyes/eye_01"],
    uncommon: [
      "Eyes/eye_02",
      "Eyes/eye_07",
      "Eyes/eye_09",
      "Eyes/eye_011",
      "Eyes/eye_014",
      "Eyes/eye_015",
      "Eyes/eye_017",
      "Eyes/eye_018",
      "Eyes/eye_019",
      "Eyes/eye_020",
      "Eyes/eye_022",
      "Eyes/eye_023",
      "Eyes/eye_024",
      "Eyes/eye_025",
      "Eyes/eye_026"
    ],
    rare: [
      "Eyes/eye_04",
      "Eyes/eye_05",
      "Eyes/eye_06",
      "Eyes/eye_010",
      "Eyes/eye_012",
      "Eyes/eye_013",
      "Eyes/eye_016"
    ],
    epic: ["Eyes/eye_03", "Eyes/eye_08", "Eyes/eye_021"]
  },
  Tusks: {
    common: ["Tusks/tusk_02"],
    uncommon: [
      "Tusks/tusk_03",
      "Tusks/tusk_04",
      "Tusks/tusk_06",
      "Tusks/tusk_07",
      "Tusks/tusk_09",
      "Tusks/tusk_11",
      "Tusks/tusk_011",
      "Tusks/tusk_012",
      "Tusks/tusk_013",
      "Tusks/tusk_014",
      "Tusks/tusk_018",
      "Tusks/tusk_019",
      "Tusks/tusk_020"
    ],
    rare: [
      "Tusks/tusk_05",
      "Tusks/tusk_08",
      "Tusks/tusk_015",
      "Tusks/tusk_016",
      "Tusks/tusk_017"
    ],
    epic: ["Tusks/tusk_01"]
  }
};
var names2 = {
  firstName: [
    "Marmook",
    "H\xF6boken",
    "Orlando",
    "Axel",
    "Hoof",
    "Niagra",
    "Houston",
    "H\xF6rk",
    "Hog",
    "Wart",
    "Kogi",
    "Hamper",
    "Briscuit",
    "Bork",
    "Hamlet",
    "Dallas",
    "Brisk",
    "Hans",
    "J\xFCrgen",
    "B\xFCrgen",
    "Cliff",
    "Klaus",
    "G\xFCnter",
    "Shikona",
    "Tochi",
    "Koto",
    "Moriwaka",
    "Haru",
    "Denver"
  ],
  lastName1: [
    {
      name: "Hair",
      complete: false
    },
    {
      name: "Hobble",
      complete: false
    },
    {
      name: "Oyster",
      complete: false
    },
    {
      name: "Axe",
      complete: false
    },
    {
      name: "Stomp",
      complete: false
    },
    {
      name: "Rock",
      complete: false
    },
    {
      name: "Stomp",
      complete: false
    },
    {
      name: "Big",
      complete: false
    },
    {
      name: "Gentle",
      complete: false
    },
    {
      name: "Anger",
      complete: false
    },
    {
      name: "Tough",
      complete: false
    },
    {
      name: "River",
      complete: false
    },
    {
      name: "Large",
      complete: false
    },
    {
      name: "Hoof",
      complete: false
    },
    {
      name: "Iron",
      complete: false
    },
    {
      name: "Mountain",
      complete: false
    },
    {
      name: "Hog",
      complete: false
    },
    {
      name: "Storm",
      complete: false
    },
    {
      name: "Thunder",
      complete: false
    },
    {
      name: "War",
      complete: false
    },
    {
      name: "Danger",
      complete: false
    },
    {
      name: "Tundra",
      complete: false
    },
    {
      name: "Boulder",
      complete: false
    },
    {
      name: "Wind",
      complete: false
    },
    {
      name: "Sumo",
      complete: false
    },
    {
      name: "Dust",
      complete: false
    },
    {
      name: "Snort",
      complete: false
    },
    {
      name: "Pig",
      complete: false
    },
    {
      name: "Pork",
      complete: false
    }
  ],
  lastName2: [
    "lumps",
    "trough",
    "bucket",
    "hammer",
    "haven",
    "turtle",
    "biscuit",
    "trodder",
    "foot",
    "stone",
    "belly",
    "stomper",
    "kicker",
    "quake",
    "waddle",
    "crusher",
    "fellow",
    "crusher",
    "breather",
    "hog",
    "sitter",
    "-Thighs",
    "charge",
    "nap",
    "thunder",
    "ranch",
    "duster",
    "lake",
    "butter"
  ]
};

// game/characterGeneration/data/penguin.ts
var penguin_exports = {};
__export(penguin_exports, {
  attachmentMap: () => attachmentMap3,
  classOverrides: () => classOverrides2,
  names: () => names3,
  skinMap: () => skinMap3,
  species: () => species3
});
var species3 = "penguinKnight";
var skinMap3 = {
  common: {
    Regular: {
      base: "BasePengReference"
    }
  },
  uncommon: {
    Regular: {
      base: "BasePengReference"
    }
  },
  rare: {
    Regular: {
      base: "BasePengReference"
    }
  },
  epic: {
    Regular: {
      base: "BasePengReference"
    }
  }
};
var attachmentMap3 = {
  Body: {
    common: ["Body/Body_01", "Body/Body_09"],
    uncommon: [
      "Body/Body_02",
      "Body/Body_03",
      "Body/Body_05",
      "Body/Body_06",
      "Body/Body_011",
      "Body/Body_012",
      "Body/Body_013",
      "Body/Body_014",
      "Body/Body_015"
    ],
    rare: ["Body/Body_07"],
    epic: ["Body/Body_04", "Body/Body_08", "Body/Body_010"]
  },
  Color: {
    common: ["Color/Color_01"],
    uncommon: [
      "Color/Color_05",
      "Color/Color_06",
      "Color/Color_07",
      "Color/Color_08",
      "Color/Color_09",
      "Color/Color_010",
      "Color/Color_011"
    ],
    rare: ["Color/Color_03", "Color/Color_04"],
    epic: ["Color/Color_02"]
  },
  Eyes: {
    common: ["Eye/Eye_01"],
    uncommon: [
      "Eye/Eye_02",
      "Eye/Eye_07",
      "Eye/Eye_09",
      "Eye/Eye_011",
      "Eye/Eye_014",
      "Eye/Eye_015",
      "Eye/Eye_017",
      "Eye/Eye_018",
      "Eye/Eye_019",
      "Eye/Eye_020",
      "Eye/Eye_022",
      "Eye/Eye_023",
      "Eye/Eye_024",
      "Eye/Eye_025",
      "Eye/Eye_026",
      "Eye/Eye_027"
    ],
    rare: [
      "Eye/Eye_04",
      "Eye/Eye_05",
      "Eye/Eye_06",
      "Eye/Eye_010",
      "Eye/Eye_012",
      "Eye/Eye_013",
      "Eye/Eye_016"
    ],
    epic: ["Eye/Eye_03", "Eye/Eye_08", "Eye/Eye_021"]
  },
  Mouth: {
    common: ["Mouth/Mouth_04"],
    uncommon: [
      "Mouth/Mouth_02",
      "Mouth/Mouth_03",
      "Mouth/Mouth_06",
      "Mouth/Mouth_07",
      "Mouth/Mouth_09",
      "Mouth/Mouth_010",
      "Mouth/Mouth_011",
      "Mouth/Mouth_012",
      "Mouth/Mouth_013",
      "Mouth/Mouth_014"
    ],
    rare: [
      "Mouth/Mouth_05",
      "Mouth/Mouth_08",
      "Mouth/Mouth_015",
      "Mouth/Mouth_016",
      "Mouth/Mouth_017"
    ],
    epic: ["Mouth/Mouth_01"]
  }
};
var classOverrides2 = {
  knight: {
    Head: {
      common: ["Class/Knight/Head/Knight_Head_01"],
      uncommon: ["Class/Knight/Head/Knight_Head_01"],
      rare: ["Class/Knight/Head/Knight_Head_01"],
      epic: ["Class/Knight/Head/Knight_Head_01"]
    },
    LeftHand: {
      common: ["Class/Knight/L_Hand/Knight_L_Hand_01"],
      uncommon: ["Class/Knight/L_Hand/Knight_L_Hand_01"],
      rare: ["Class/Knight/L_Hand/Knight_L_Hand_01"],
      epic: ["Class/Knight/L_Hand/Knight_L_Hand_01"]
    },
    RightHand: {
      common: ["Class/Knight/R_Hand/Knight_R_Hand_01"],
      uncommon: ["Class/Knight/R_Hand/Knight_R_Hand_01"],
      rare: ["Class/Knight/R_Hand/Knight_R_Hand_01"],
      epic: ["Class/Knight/R_Hand/Knight_R_Hand_01"]
    }
  },
  rogue: {
    Head: {
      common: ["Class/Rogue/Head/Rogue_Head_01"],
      uncommon: ["Class/Rogue/Head/Rogue_Head_02"],
      rare: ["Class/Rogue/Head/Rogue_Head_03"],
      epic: ["Class/Rogue/Head/Rogue_Head_04"]
    },
    LeftHand: {
      common: ["Class/Rogue/L_Hand/Rogue_L_Hand_01"],
      uncommon: ["Class/Rogue/L_Hand/Rogue_L_Hand_01"],
      rare: ["Class/Rogue/L_Hand/Rogue_L_Hand_02"],
      epic: ["Class/Rogue/L_Hand/Rogue_L_Hand_03"]
    },
    RightHand: {
      common: ["Class/Rogue/R_Hand/Rogue_R_Hand_01"],
      uncommon: ["Class/Rogue/R_Hand/Rogue_R_Hand_01"],
      rare: ["Class/Rogue/R_Hand/Rogue_R_Hand_02"],
      epic: ["Class/Rogue/R_Hand/Rogue_R_Hand_02"]
    }
  },
  wizard: {
    Head: {
      common: ["Class/Wizard/Head/Wizard_Head_01"],
      uncommon: [
        "Class/Wizard/Head/Wizard_Head_02",
        "Class/Wizard/Head/Wizard_Head_03"
      ],
      rare: [
        "Class/Wizard/Head/Wizard_Head_04",
        "Class/Wizard/Head/Wizard_Head_05"
      ],
      epic: ["Class/Wizard/Head/Wizard_Head_06"]
    },
    LeftHand: {
      common: ["Class/Wizard/L_Hand/Wizard_L_Hand_01"],
      uncommon: ["Class/Wizard/L_Hand/Wizard_L_Hand_01"],
      rare: ["Class/Wizard/L_Hand/Wizard_L_Hand_01"],
      epic: ["Class/Wizard/L_Hand/Wizard_L_Hand_01"]
    },
    RightHand: {
      common: ["Class/Wizard/R_Hand/Wizard_R_Hand_01"],
      uncommon: ["Class/Wizard/R_Hand/Wizard_R_Hand_02"],
      rare: ["Class/Wizard/R_Hand/Wizard_R_Hand_03"],
      epic: ["Class/Wizard/R_Hand/Wizard_R_Hand_04"]
    }
  }
};
var names3 = {
  firstName: [
    "Flotsam",
    "Flipper",
    "Bobo",
    "Bing Bong",
    "Fl\xF3ki",
    "Helgi",
    "Halberd",
    "Arnkatla",
    "Harold",
    "Noodle",
    "Bj\xF8rn",
    "Toki",
    "Gudrun",
    "Inga",
    "Frida",
    "Hilda",
    "Sneezes",
    "Pittsburgh",
    "Sushi",
    "Boba",
    "Buddy",
    "Jimbo",
    "Gumdrop",
    "Junior",
    "Skipper",
    "Captain",
    "Scooter",
    "Poseidon",
    "Gumbo",
    "Rudolph"
  ],
  lastName1: [
    {
      name: "Penguin",
      complete: false
    },
    {
      name: "Tiny",
      complete: false
    },
    {
      name: "Fish",
      complete: false
    },
    {
      name: "Sniffle",
      complete: false
    },
    {
      name: "Aqua",
      complete: false
    },
    {
      name: "Artic",
      complete: false
    },
    {
      name: "Frost",
      complete: false
    },
    {
      name: "Wet",
      complete: false
    },
    {
      name: "Frigid",
      complete: false
    },
    {
      name: "Fish",
      complete: false
    },
    {
      name: "Ice",
      complete: false
    },
    {
      name: "Damp",
      complete: false
    },
    {
      name: "Cold",
      complete: false
    },
    {
      name: "Loud",
      complete: false
    },
    {
      name: "Honk",
      complete: false
    },
    {
      name: "Feather",
      complete: false
    },
    {
      name: "Frozen",
      complete: false
    },
    {
      name: "Glacier",
      complete: false
    },
    {
      name: "Plumage",
      complete: false
    },
    {
      name: "Little",
      complete: false
    },
    {
      name: "Baby",
      complete: false
    },
    {
      name: "Water",
      complete: false
    },
    {
      name: "Happy",
      complete: false
    },
    {
      name: "Tuxedo",
      complete: false
    },
    {
      name: "Cruise",
      complete: false
    },
    {
      name: "Freezer",
      complete: false
    },
    {
      name: "Herring",
      complete: false
    },
    {
      name: "Rock",
      complete: false
    },
    {
      name: "Tuna",
      complete: false
    },
    {
      name: "Pool",
      complete: false
    },
    {
      name: "Sleepy",
      complete: false
    },
    {
      name: "Nice",
      complete: false
    },
    {
      name: "Oyster",
      complete: false
    },
    {
      name: "Baby",
      complete: false
    }
  ],
  lastName2: [
    "flipper",
    "fin",
    "toe",
    "waddle",
    "water",
    "honker",
    "boat",
    "beach",
    "snow",
    "feet",
    "dancer",
    "fisher",
    "sniffer",
    "beak",
    "dive",
    "bill",
    "flopper",
    "skate",
    "slip",
    "frost",
    "honk",
    "bottle",
    "nap",
    "friend",
    "coolant",
    "slapper",
    "egg",
    "flight",
    "hopper",
    "bubbles ",
    "clam",
    "shrimp",
    "snack",
    "nugget"
  ]
};

// game/characterGeneration/data/index.ts
var kaijus = {
  warhog: warhog_exports,
  frog: frog_exports,
  penguin: penguin_exports
};

// game/characterGeneration/data/stats.ts
var speciesStatBonus = {
  frogKnight: {
    strength: 100,
    magic: 100,
    defense: 0,
    constitution: 0
  },
  warhog: {
    strength: 0,
    magic: 0,
    defense: 100,
    constitution: 100
  },
  penguinKnight: {
    strength: 50,
    magic: 50,
    defense: 100,
    constitution: 0
  }
};
var speciesClassCDF = {
  warhog: { bard: -1, rogue: -1, cleric: 4500, wizard: 7250, knight: 1e4 },
  frogKnight: {
    wizard: -1,
    bard: -1,
    cleric: 4500,
    knight: 7250,
    rogue: 1e4
  },
  penguinKnight: {
    bard: -1,
    cleric: -1,
    knight: 3333,
    rogue: 6666,
    wizard: 1e4
  }
};
var rollClass = /* @__PURE__ */ __name((species4) => {
  return rollWeights(speciesClassCDF[species4]);
}, "rollClass");
var classStatOptions = {
  knight: {
    primary: ["strength", "defense"],
    secondary: ["strength", "defense"],
    tertiary1: ["magic", "constitution"],
    tertiary2: ["magic", "constitution"]
  },
  cleric: {
    primary: ["defense", "constitution"],
    secondary: ["defense", "constitution"],
    tertiary1: ["strength", "magic"],
    tertiary2: ["strength", "magic"]
  },
  bard: {
    primary: ["strength", "magic"],
    secondary: ["strength", "magic"],
    tertiary1: ["defense", "constitution"],
    tertiary2: ["defense", "constitution"]
  },
  rogue: {
    primary: ["strength"],
    secondary: ["defense", "magic"],
    tertiary1: ["defense", "magic", "constitution"],
    tertiary2: ["defense", "magic", "constitution"]
  },
  wizard: {
    primary: ["magic"],
    secondary: ["constitution", "defense", "strength"],
    tertiary1: ["constitution", "defense", "strength"],
    tertiary2: ["constitution", "defense", "strength"]
  }
};
var statRanges = {
  primary: [9, 13],
  secondary: [7, 11],
  tertiary1: [6, 10],
  tertiary2: [6, 10]
};
var statScaling = {
  common: {
    primary: [1e3, 1e3],
    secondary: [1e3, 1e3],
    tertiary1: [1e3, 1e3],
    tertiary2: [1e3, 1e3]
  },
  uncommon: {
    primary: [1050, 1050],
    secondary: [1e3, 1050],
    tertiary1: [1e3, 1050],
    tertiary2: [1e3, 1050]
  },
  rare: {
    primary: [1060, 1100],
    secondary: [1050, 1100],
    tertiary1: [1025, 1100],
    tertiary2: [1025, 1100]
  },
  epic: {
    primary: [1100, 1150],
    secondary: [1050, 1150],
    tertiary1: [1050, 1100],
    tertiary2: [1050, 1100]
  }
};
var rollStatValues = /* @__PURE__ */ __name((rarity) => {
  const scaling = statScaling[rarity];
  const stats = Object.fromEntries(
    Object.entries(statRanges).map(([stat, range2]) => {
      return [
        stat,
        {
          flat: randomInteger(...range2),
          scaling: randomInteger(...scaling[stat])
        }
      ];
    })
  );
  return stats;
}, "rollStatValues");
var rollStatNames = /* @__PURE__ */ __name((characterClass) => {
  const options = classStatOptions[characterClass];
  const statsNames = [];
  statsNames.push(
    randomValue(options.primary.filter((k2) => !statsNames.includes(k2)))
  );
  statsNames.push(
    randomValue(options.secondary.filter((k2) => !statsNames.includes(k2)))
  );
  statsNames.push(
    randomValue(options.tertiary1.filter((k2) => !statsNames.includes(k2)))
  );
  statsNames.push(
    randomValue(options.tertiary2.filter((k2) => !statsNames.includes(k2)))
  );
  const statsNamesDict = {
    primary: statsNames[0],
    secondary: statsNames[1],
    tertiary1: statsNames[2],
    tertiary2: statsNames[3]
  };
  return statsNamesDict;
}, "rollStatNames");
var rollStats = /* @__PURE__ */ __name((species4, rarity) => {
  const characterClass = rollClass(species4);
  const statValues = rollStatValues(rarity);
  const statNames = rollStatNames(characterClass);
  const finalStats = {
    primary: {
      stat: statNames.primary,
      ...statValues.primary,
      bonusScaling: speciesStatBonus[species4][statNames.primary]
    },
    secondary: {
      stat: statNames.secondary,
      ...statValues.secondary,
      bonusScaling: speciesStatBonus[species4][statNames.secondary]
    },
    tertiary1: {
      stat: statNames.tertiary1,
      ...statValues.tertiary1,
      bonusScaling: speciesStatBonus[species4][statNames.tertiary1]
    },
    tertiary2: {
      stat: statNames.tertiary2,
      ...statValues.tertiary2,
      bonusScaling: speciesStatBonus[species4][statNames.tertiary2]
    }
  };
  return finalStats;
}, "rollStats");
var calculateStats2 = /* @__PURE__ */ __name((stats) => {
  return Object.fromEntries(
    Object.entries(stats).map(([k2, v]) => {
      return [
        v.stat,
        v.flat * (v.scaling + v.bonusScaling) * (v.stat === "constitution" ? 8 : 1) / 1e3
      ];
    })
  );
}, "calculateStats");

// game/characterGeneration/roll.ts
var kaijuSpineMap = {
  frogKnight: "frogKnightGenOne",
  penguinKnight: "penguinKnightGenOne",
  warhog: "warhogGenOne"
};
var rollName = /* @__PURE__ */ __name((kaiju) => {
  const lastNameRoll = randomValue(kaiju.names.lastName1);
  const lastName = lastNameRoll.complete ? lastNameRoll.name : `${lastNameRoll.name}${randomValue(kaiju.names.lastName2)}`;
  const name = kaiju.names ? `${randomValue(kaiju.names.firstName)} ${lastName}` : `Gen One ${kaiju.species}`;
  return name;
}, "rollName");
var rollCharacter = /* @__PURE__ */ __name((kaijuOverride, rarityOverride, startPlain = false, startEnhanced = false) => {
  const kaiju = kaijuOverride ? kaijuOverride : randomValue(Object.values(kaijus));
  let character = {};
  character["level"] = 1;
  character["species"] = kaiju.species;
  let masterRarity = rarityOverride ? rarityOverride : rollMasterRarity();
  if (startPlain)
    masterRarity = "common";
  if (startEnhanced)
    masterRarity = "rare";
  character["rarity"] = masterRarity;
  character["class"] = rollWeights(
    speciesClassCDF[character.species]
  );
  const cosmeticPool = kaiju.skinMap[masterRarity] || kaiju.skinMap["common"] || kaiju.skinMap[Object.keys(kaiju.skinMap)[0]];
  const [skinName, skinBase] = randomValue(Object.entries(cosmeticPool));
  const components = {
    ...skinBase.extra,
    ...kaiju.attachmentMap,
    ...kaiju.classOverrides?.[character.class] ?? {}
  };
  let skinComponents = rollComponents(components, masterRarity);
  if (startPlain) {
    skinComponents = Object.fromEntries(
      Object.entries(components).map(([slot, byRarity]) => {
        const commons = byRarity.common || [];
        const chosen = commons[0] || Object.values(byRarity)[0]?.[0];
        return [slot, { rarity: "common", name: chosen }];
      }).filter(([, v]) => v.name)
    );
  }
  if (startEnhanced && !startPlain) {
    skinComponents = rollComponents(components, "epic");
  }
  const skin = {
    spine: kaijuSpineMap[kaiju.species],
    base: { rarity: masterRarity, name: skinBase.base },
    ...skinComponents
  };
  const name = rollName(kaiju);
  const stats = rollStats(character.species, masterRarity);
  const talents = rollTalents(
    character.species,
    character.class,
    masterRarity
  );
  const calculatedStats = calculateStats2(stats);
  if (startEnhanced) {
    Object.keys(calculatedStats).forEach((k2) => {
      ;
      calculatedStats[k2] = Math.round((calculatedStats[k2] || 0) * 1.25);
    });
  }
  character = { name, ...character, skin, stats, talents, calculatedStats };
  return character;
}, "rollCharacter");
function upgradeCharacterSkin(currentSkin, species4) {
  if (!currentSkin || !currentSkin.spine)
    return currentSkin;
  const newSkin = { ...currentSkin };
  const slots = Object.keys(currentSkin).filter((k2) => k2 !== "base" && k2 !== "spine" && k2 !== "path");
  if (slots.length === 0)
    return currentSkin;
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const cur = currentSkin[slot]?.name || "";
  const m2 = cur.match(/^(.*_)(\d+)$/);
  if (m2) {
    const nextNum = String(parseInt(m2[2], 10) + 1).padStart(2, "0");
    const candidate = `${m2[1]}${nextNum}`;
    newSkin[slot] = { ...currentSkin[slot] || {}, name: candidate, rarity: "upgraded" };
  } else {
    newSkin[slot] = { ...currentSkin[slot] || {}, name: cur.replace(/01|1$/, "02"), rarity: "upgraded" };
  }
  return newSkin;
}
__name(upgradeCharacterSkin, "upgradeCharacterSkin");

// game/actions/nextRoom.ts
var nextRoom2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  if (!scene.get("isInMap"))
    return;
  scene.set("numRoomsPassed", scene.get("numRoomsPassed") + 1);
  scene.apply("allCharacters", (0, import_immer15.produce)((ac) => {
    for (const c of Object.values(ac)) {
      if (c && c.isPc && c.skin) {
        c.skin = upgradeCharacterSkin(c.skin, c.id || c.species);
      }
    }
    return ac;
  }));
  const chosenRoom = getChosenRoom(scene, args.choice);
  scene.apply("roomUidsVisited", (uids) => [...uids, chosenRoom.uid]);
  scene.set("currentRoom", chosenRoom);
  if (chosenRoom.category === "restSite") {
    activateSouvenirs("enterRestSite", scene);
    activateTalents({ scene, key: "enterRestSite" });
  } else if (chosenRoom.category === "events") {
    activateSouvenirs("enterEventSite", scene);
    activateTalents({ scene, key: "enterEventSite" });
  }
  trackMetric("nextRoom", { choice: args.choice, chosenRoom, scene });
  const currentRoomCategory = scene.get("currentRoom", "category");
  if (currentRoomCategory !== "restSite" && currentRoomCategory !== "events") {
    prepareBattleScene(scene, chosenRoom);
  }
  scene.set("isInMap", false);
}, "nextRoom");
function prepareBattleScene(scene, chosenRoom) {
  scene.set("turnCount", 1);
  scene.set("isPlayerTurn", true);
  scene.select("runScore").select("attributes").set("roomsCleared", scene.get("numRoomsPassed"));
  scene.set("cardsPlayedThisRoom", []);
  scene.set("cardsPlayedThisTurn", []);
  scene.set("damagesDealtThisRoom", []);
  scene.set("damagesDealtThisTurn", []);
  scene.set("damagesUnblockedThisTurn", []);
  scene.set("damagesUnblockedThisRoom", []);
  scene.set("scoreEventsThisTurn", getRoomScoreCounter());
  scene.set("scoreEventsThisRoom", getRoomScoreCounter());
  scene.select("treasureChest").set("upgraded", false);
  scene.select("treasureChest").set("state", "pending");
  const newNpcs = makeRoomNpcs(chosenRoom.enemies);
  scene.apply("allCharacters", (ac) => ({
    ...objFilter(ac, (_2, c) => c.isPc),
    ...newNpcs
  }));
  setBaseTaunt(scene);
  setRoundEnergy(scene);
  activateSouvenirs("battleStart", scene);
  activateTalents({ scene, key: "battleStart" });
  activateSouvenirs("turnStart", scene);
  activateTalents({ scene, key: "turnStart" });
  scene.set("state", "in battle");
  scene.set("lootScreenHasOpened", false);
  updateNpcMoves(scene);
  drawNewHand(scene);
}
__name(prepareBattleScene, "prepareBattleScene");
function getChosenRoom(scene, choice) {
  const chosenRoomKey = scene.get("currentRoom").edges[choice];
  const chosenRoom = scene.get("rooms", chosenRoomKey);
  return chosenRoom;
}
__name(getChosenRoom, "getChosenRoom");
var setBaseTaunt = /* @__PURE__ */ __name((scene) => {
  scene.apply(
    "allCharacters",
    (0, import_immer15.produce)((ac) => {
      for (const [id, cm] of Object.entries(ac)) {
        if (!cm.isPc)
          continue;
        let taunt = calculateBaseTaunt(cm);
        taunt = activateTalentsData({
          scene,
          key: "tauntBase",
          data: taunt,
          cm
        });
        cm.taunt = taunt;
        cm.lastTaunt = taunt;
      }
      return ac;
    })
  );
}, "setBaseTaunt");

// game/actions/openEndOfRoom.ts
init_util();
var openEndOfRoom = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  scene.set("lootScreenHasOpened", true);
  return;
}, "openEndOfRoom");

// game/actions/openEndOfRun.ts
init_util();
var openEndOfRun = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  scene.set("endScreenHasOpened", true);
  const ev = args.game.select("events");
  const cur = ev.get("gems") || 50;
  ev.set("gems", cur + 25);
  console.log("[economy] awarded 25 gems post-battle");
  return;
}, "openEndOfRun");

// game/actions/placeSelectedCharacters.ts
var import_immer16 = __toESM(require("immer"));
init_util();
init_code();
var placeSelectedCharacters = /* @__PURE__ */ __name((args) => {
  const scene = getEntrySceneIn(args.game);
  scene.apply(
    "selectedCharacters",
    (0, import_immer16.default)((selected) => {
      for (const {
        allCharacterOptionsIndex,
        placeIndex
      } of args.characters) {
        const characterStats = scene.get("allCharacterOptions")[allCharacterOptionsIndex];
        selected[placeIndex] = equipSword({
          ...characterStats,
          uid: `pc-${characterStats.id}-${Math.random() * 1e4 | 0}`,
          isPc: true
        });
      }
    })
  );
  const fullSelectedCharacterDecks = {};
  scene.get("selectedCharacters").forEach((c) => {
    if (c == null)
      return;
    fullSelectedCharacterDecks[c.uid] = getFullDeckForCharacter(
      c,
      scene
    );
  });
  scene.set("fullSelectedCharacterDecks", fullSelectedCharacterDecks);
}, "placeSelectedCharacters");
function equipSword(cm) {
  if (!cm)
    throw new Error("null character in equipsword");
  const newCm = { ...cm };
  const kind = getRandomPartKind();
  const sword = {
    pommel: {
      kind
    },
    handle: {
      kind
    },
    guard: {
      kind
    },
    blade: {
      kind
    }
  };
  let runModifiers = {};
  keys(sword).forEach((swordPartKey) => {
    const swordStats = swordPartDefinitionsMap[sword[swordPartKey].kind][swordPartKey];
    runModifiers = getUpdatedModifiers(
      { turn: {}, room: {}, run: swordStats },
      runModifiers,
      "run"
    );
  });
  newCm.statModifiersMap = { turn: {}, room: {}, run: runModifiers };
  newCm.sword = sword;
  return newCm;
  function getRandomPartKind() {
    return swordPartIds[Math.random() * swordPartIds.length | 0];
  }
  __name(getRandomPartKind, "getRandomPartKind");
}
__name(equipSword, "equipSword");

// game/actions/playCard.ts
init_util();
init_code();
var TIME_FOR_CARD_TO_PLAY = 1e3;
var playCard2 = /* @__PURE__ */ __name((args) => {
  const scene = getBattleSceneIn(args.game);
  if (scene.get("state") !== "in battle" || scene.get("isInMap") === true) {
    logger.warn("tried to play card while not in battle");
    return;
  }
  let card = scene.get("cards", "hand", args.cardUid) ?? throwNull(`cardUid ${args.cardUid}`);
  card = { ...card };
  const targetUids = getTargetUids({
    card,
    targetUids: args.targetUids,
    scene
  });
  if (isPlayable({ card, scene, targetUids })) {
    scene.select("allCharacters", card.characterUid).set("hasMoved", true);
    card = activateTalentsData({
      scene,
      key: "playCardPre",
      data: card,
      extra: { targetUids: args.targetUids }
    });
    trackMetric("playCard", { card, scene, targetUids: args.targetUids });
    play({ card, targetUids: args.targetUids, scene });
    if (scene.get("cards", "hand", card.uid) != null)
      discard({ cardUids: [args.cardUid], scene });
    activateTalents({
      scene,
      key: "playCard",
      extra: { card, targetUids: args.targetUids }
    });
    args.game.set("nextAction", {
      card,
      method: "activatePlayCardHooks",
      delay: TIME_FOR_CARD_TO_PLAY
    });
    updateNpcMoves(scene);
    updateCharacters(scene);
    updateHand(scene);
  } else {
    logger.warn("tried to play unplayable card: " + args.cardUid);
  }
}, "playCard");
function isPlayable({
  card,
  scene,
  targetUids
}) {
  if (scene.get("numRequiredToDiscard") > 0)
    return false;
  if (card.targetNum > 0 && targetUids?.length !== card.targetNum) {
    logger.info(
      `tried to play card ${card.id} but number of targets was off`
    );
    return false;
  }
  if (getEnergy(card) < 0 || getEnergy(card) > scene.get("energy"))
    return false;
  const allCharacters = scene.get("allCharacters");
  if (targetUids?.length) {
    const livingTargets = Object.entries(allCharacters).filter(([k2, v]) => targetUids?.includes(k2) && v.health > 0).map(([k2, _2]) => k2);
    if (!livingTargets.length)
      return false;
  }
  return true;
}
__name(isPlayable, "isPlayable");

// game/actions/removeCardForFree.ts
init_util();
var import_lodash28 = require("lodash");
var removeCardForFree = /* @__PURE__ */ __name((args) => {
  if (isProduction)
    return logger.info("tried to remove card for free in production!");
  getBattleSceneIn(args.game).select("cards", "draw").apply((cards) => ({ ...(0, import_lodash28.omit)(cards, args.uid) }));
}, "removeCardForFree");

// game/actions/resetRandomSeed.ts
var resetRandomSeed = /* @__PURE__ */ __name(() => setGlobalRandomSeed("seedThree"), "resetRandomSeed");

// game/actions/rollKaiju.ts
var import_immer17 = __toESM(require("immer"));
init_util();
var rollKaiju = /* @__PURE__ */ __name((args) => {
  const scene = getEntrySceneIn(args.game);
  const entryData = scene.get();
  const plain = args.plain !== void 0 ? args.plain !== false : entryData.rollPlain !== void 0 ? entryData.rollPlain : true;
  const enhanced = args.enhanced !== void 0 ? !!args.enhanced : entryData.rollEnhanced ?? false;
  scene.apply(
    "selectedCharacters",
    (0, import_immer17.default)((selected) => {
      const rolledCharacter = rollCharacter(void 0, void 0, plain, enhanced);
      const stats = Object.fromEntries(
        Object.entries(rolledCharacter.calculatedStats).map(
          ([k2, v]) => {
            return [k2, Math.ceil(v)];
          }
        )
      );
      logger.debug(`rolled Character: ${JSON.stringify(rolledCharacter)}`);
      const characterStats = {
        id: rolledCharacter.species,
        displayName: rolledCharacter.name,
        isPc: true,
        class: rolledCharacter.class,
        ...stats,
        skin: rolledCharacter.skin,
        talents: rolledCharacter.talents
      };
      logger.debug(characterStats);
      selected[args.placeIndex] = equipSword({
        ...characterStats,
        uid: `pc-${characterStats.id}-${Math.random() * 1e4 | 0}`,
        isPc: true
      });
    })
  );
  const fullSelectedCharacterDecks = {};
  scene.get("selectedCharacters").forEach((c) => {
    if (c == null)
      return;
    fullSelectedCharacterDecks[c.uid] = getFullDeckForCharacter(c, scene);
  });
  scene.set("fullSelectedCharacterDecks", fullSelectedCharacterDecks);
}, "rollKaiju");

// game/actions/rulebookAction.ts
var import_fs3 = require("fs");
init_code();
init_rulebook2();
init_util();
var rulebookAction = /* @__PURE__ */ __name((args) => {
  logger.info(`rulebookAction performing action ${args.do}`);
  if (isProduction)
    return logger.info("tried to update rulebook in production!");
  if (!(0, import_fs3.existsSync)(prefix)) {
    (0, import_fs3.mkdirSync)(prefix);
  }
  switch (args.do) {
    case "choose": {
      logger.info(`choosing rulebook ${args.name}`);
      if (args.name === "default") {
        resetRulebook();
        return;
      }
      const p = toPath(args.name);
      if (!(0, import_fs3.existsSync)(p)) {
        throw Error("chosen rulebook does not exist");
      }
      setRulebook(JSON.parse((0, import_fs3.readFileSync)(p, "utf-8")));
      return;
    }
    case "delete": {
      logger.info(`deleting rulebook ${args.name}`);
      if (args.name === "default") {
        throw Error("cannot delete default rulebook");
      }
      const p = toPath(args.name);
      if (!(0, import_fs3.existsSync)(p)) {
        throw Error("delete attempt: rulebook file does not exist");
      }
      (0, import_fs3.rmSync)(p);
      resetRulebook();
      return;
    }
    case "new": {
      const newName = args.rulebook.name;
      if (newName === "default") {
        throw Error("cannot name rulebook 'default'");
      }
      const rulebook2 = { ...args.rulebook, savedAt: pacificDate() };
      const s2 = stringifyRulebook(rulebook2);
      const p = toPath(newName);
      logger.info(`creating rulebook ${newName}`);
      if ((0, import_fs3.existsSync)(p)) {
        throw Error(`rulebook with name ${newName} already exists`);
      }
      (0, import_fs3.writeFileSync)(p, s2, { encoding: "utf-8" });
      setRulebook(JSON.parse(s2));
      return;
    }
    default: {
      throw Error("unknown arg type");
    }
  }
}, "rulebookAction");

// game/actions/setBattleScene.ts
init_util();
var setBattleScene = /* @__PURE__ */ __name(({
  game,
  scene
}) => {
  if (isProduction)
    return logger.info("tried to update battle scene in production!");
  scene.userId = game.get("userId");
  game.set("scene", scene);
  maybeTransitionBattleState(game.select("scene"));
}, "setBattleScene");

// game/actions/setRunId.ts
init_util();
var setRunId = /* @__PURE__ */ __name(async (args) => {
  const { game, runId } = args;
  const scene = getBattleSceneIn(game);
  scene.set("runId", runId);
  return;
}, "setRunId");

// game/actions/chooseStance.ts
init_util();
var chooseStance2 = /* @__PURE__ */ __name((args) => {
  const { characterUid, stanceId } = args;
  const scene = getBattleSceneIn(args.game);
  const characterCursor = scene.select("allCharacters").select(characterUid);
  const character = characterCursor.get();
  if (!character.isPc || character.hasMoved || !scene.get().isPlayerTurn)
    return;
  logger.debug(`${character.id} setting stance to ${stanceId}`);
  characterCursor.select("stance").set(stanceId);
  updateNpcMoves(scene);
  updateHand(scene);
}, "chooseStance");

// game/actions/buyFromMarket.ts
init_rulebook2();
var buyFromMarket = /* @__PURE__ */ __name((args) => {
  const { game, itemId, cost = 10 } = args;
  const currentGems = game.select("events").get("gems") || 0;
  if (currentGems < cost) {
    console.log("[buyFromMarket] insufficient gems for", itemId);
    return;
  }
  game.select("events").set("gems", currentGems - cost);
  if (typeof itemId === "string" && itemId.startsWith("char:")) {
    const charId = itemId.slice(5);
    const rb = getRulebook();
    const statsMap = rb.playerCharacterStatsMap || {};
    const base = statsMap[charId];
    if (base) {
      const freshUid = `${charId}-mkt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e3)}`;
      const clone2 = { ...base, uid: freshUid, isPc: true };
      const owned = game.select("ownedCharacters").get() || {};
      game.select("ownedCharacters").set({ ...owned, [freshUid]: clone2 });
      console.log("[buyFromMarket] purchased character", charId, "as", freshUid);
    } else {
      console.log("[buyFromMarket] unknown char id", charId);
    }
    return;
  }
  if (typeof itemId === "string" && itemId.startsWith("item:")) {
    const itemName = itemId.slice(5);
    const purchases = game.select("events").get("purchases") || [];
    game.select("events").set("purchases", [...purchases, { itemId, at: Date.now() }]);
    console.log("[buyFromMarket] purchased item", itemName);
    return;
  }
  console.log("[buyFromMarket] purchased", itemId);
}, "buyFromMarket");

// game/gameAction.ts
init_code();
satisfies(actions_exports);
function doGameAction(args) {
  try {
    const { game, method } = args;
    if (game.get("scene", "id") === "battle" && game.select("scene").get("requireAction") != null && method !== "finishCard") {
      throw Error("you must finish your card before doing another action");
    }
    const action = actions_exports[method] ?? throwNull(`actions.${method}`);
    action(args);
  } catch (e) {
    const err2 = e;
    logger.error(`error doing game action: ${err2.message} ${err2.stack}`);
  }
}
__name(doGameAction, "doGameAction");
function isGameAction(name) {
  return name in actions_exports;
}
__name(isGameAction, "isGameAction");

// server/index.ts
var import_cors = __toESM(require("cors"));

// server/IO.ts
var import_fs5 = require("fs");
var import_socket = require("socket.io");

// server/actions/index.ts
var actions_exports2 = {};
__export(actions_exports2, {
  authenticateGuestUser: () => authenticateGuestUser,
  authenticateWeb3User: () => authenticateWeb3User,
  createAccount: () => createAccountAction,
  deleteAccount: () => deleteAccountAction,
  discover: () => discoverAction,
  endRun: () => endRun3,
  generateGame: () => generateGameAction,
  getCompendium: () => getCompendiumAction,
  getCurrentRun: () => getCurrentRun,
  getLeaderboard: () => getLeaderboard,
  getLeaderboardEntryCount: () => getLeaderboardEntryCount,
  getNumKaijuInGoodEarth: () => getNumKaijuInGoodEarth,
  getSchema: () => getSchema,
  listAccounts: () => listAccountsAction,
  loadGameState: () => loadGameState,
  login: () => login,
  loginGuest: () => loginGuest,
  prepareRun: () => prepareRun,
  setInitialGameState: () => setInitialGameState,
  setUsername: () => setUsername,
  startRun: () => startRun2,
  verifyAuthToken: () => verifyAuthToken
});

// server/storage.ts
var import_fs4 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var logger3 = getLogger ? getLogger() : console;
var DB_PATH = import_path2.default.join(process.cwd(), "server", "data", "simple-db.json");
var MAX_ACCOUNTS = 4;
var db = { users: [], runs: [], nextRunId: 1 };
function ensureDir() {
  const dir = import_path2.default.dirname(DB_PATH);
  if (!import_fs4.default.existsSync(dir))
    import_fs4.default.mkdirSync(dir, { recursive: true });
}
__name(ensureDir, "ensureDir");
function loadDb() {
  ensureDir();
  if (import_fs4.default.existsSync(DB_PATH)) {
    try {
      const raw = import_fs4.default.readFileSync(DB_PATH, "utf8");
      db = JSON.parse(raw);
      if (!db.users)
        db.users = [];
      if (!db.runs)
        db.runs = [];
      if (!db.nextRunId)
        db.nextRunId = (db.runs.reduce((m2, r) => Math.max(m2, r.run_id), 0) || 0) + 1;
      db.users.forEach((u) => {
        if (!u.discovered)
          u.discovered = { cards: [], souvenirs: [], swords: [] };
      });
      logger3.info(`Loaded simple json db with ${db.users.length} users, ${db.runs.length} runs`);
    } catch (e) {
      logger3.error("Failed to load db, starting fresh", e);
      db = { users: [], runs: [], nextRunId: 1 };
    }
  } else {
    db.users = [];
    db.runs = [];
    db.nextRunId = 1;
    saveDb();
    logger3.info("Initialized empty user db (4 account limit)");
  }
  return db;
}
__name(loadDb, "loadDb");
function saveDb() {
  if (process.env.VERCEL) {
    return;
  }
  try {
    ensureDir();
    import_fs4.default.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    logger3.warn && logger3.warn("saveDb: FS write skipped (serverless/ephemeral FS?)");
  }
}
__name(saveDb, "saveDb");
loadDb();
function getUserById(userId) {
  return db.users.find((u) => u.user_id === userId);
}
__name(getUserById, "getUserById");
function getUserByAccountId(accountId) {
  return getUserById(accountId);
}
__name(getUserByAccountId, "getUserByAccountId");
function createUser(accountId) {
  let userId = accountId || "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  if (getUserById(userId)) {
    return userId;
  }
  if (db.users.length >= MAX_ACCOUNTS) {
    logger3.warn("Account limit reached, not creating new");
    return db.users[0] ? db.users[0].user_id : userId;
  }
  const rec = {
    user_id: userId,
    username: null,
    initial_auth_method: "pick",
    discovered: { cards: [], souvenirs: [], swords: [] }
  };
  db.users.push(rec);
  saveDb();
  logger3.info(`Created user ${userId}`);
  return userId;
}
__name(createUser, "createUser");
function listAccounts() {
  return db.users.map((u) => ({ userId: u.user_id, username: u.username }));
}
__name(listAccounts, "listAccounts");
function createAccount(username, overwrite = false) {
  const trimmed = (username || "").trim();
  if (trimmed.length < 3 || trimmed.length > 20) {
    return { success: false, error: "Username must be 3-20 characters" };
  }
  const clean = trimmed.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!clean || clean.length < 3) {
    return { success: false, error: "Invalid username. Use letters, numbers, _ or -" };
  }
  const existing = db.users.find((u) => u.username && u.username.toLowerCase() === clean);
  if (existing) {
    if (!overwrite) {
      return { success: false, error: "Username already taken. Choose another or delete/overwrite the existing account." };
    }
    deleteAccount(existing.user_id);
    logger3.info(`Overwriting account for username ${clean} (deleted old ${existing.user_id})`);
  }
  if (db.users.length >= MAX_ACCOUNTS) {
    return { success: false, error: "Account limit reached (4 max). Delete one to add." };
  }
  const userId = "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const rec = {
    user_id: userId,
    username: clean,
    initial_auth_method: "typed",
    discovered: { cards: [], souvenirs: [], swords: [] }
  };
  db.users.push(rec);
  saveDb();
  logger3.info(`Created account ${userId} with username ${clean}`);
  return { success: true, userId, username: clean };
}
__name(createAccount, "createAccount");
function deleteAccount(userId) {
  const before = db.users.length;
  db.users = db.users.filter((u) => u.user_id !== userId);
  db.runs = db.runs.filter((r) => r.user_id !== userId);
  if (db.users.length < before) {
    saveDb();
    logger3.info(`Deleted account ${userId}`);
    return true;
  }
  return false;
}
__name(deleteAccount, "deleteAccount");
function updateUsername(userId, username) {
  const u = getUserById(userId);
  if (!u)
    return false;
  u.username = username.toLowerCase();
  saveDb();
  return true;
}
__name(updateUsername, "updateUsername");
function usernameExists(username) {
  const lower = username.toLowerCase();
  return db.users.some((u) => u.username && u.username.toLowerCase() === lower);
}
__name(usernameExists, "usernameExists");
function touchLogin(userId) {
  const u = getUserById(userId);
  if (u) {
    u.last_login_ts = Date.now();
    saveDb();
  }
}
__name(touchLogin, "touchLogin");
function getCurrentRunId(userId) {
  const active = db.runs.filter((r) => r.user_id === userId && (r.run_status === "initializing" || r.run_status === "in_progress")).sort((a, b2) => b2.run_id - a.run_id)[0];
  return active ? active.run_id : null;
}
__name(getCurrentRunId, "getCurrentRunId");
function createRun(userId, gameState) {
  db.runs.forEach((r) => {
    if (r.user_id === userId && (r.run_status === "initializing" || r.run_status === "in_progress")) {
      r.run_status = "abandoned";
    }
  });
  const runId = db.nextRunId++;
  const runStatus = gameState ? "in_progress" : "initializing";
  const rec = {
    run_id: runId,
    user_id: userId,
    run_status: runStatus,
    build_version: BUILD_VER || "dev",
    start_ts: Date.now(),
    game_state: gameState || null
  };
  db.runs.push(rec);
  saveDb();
  return runId;
}
__name(createRun, "createRun");
function endRun2(runId, status, score, durationSec, gameState) {
  const run = db.runs.find((r) => r.run_id === runId);
  if (!run)
    return;
  run.run_status = status === "won" || status === "lost" ? status : "abandoned";
  run.end_ts = Date.now();
  if (durationSec != null)
    run.run_duration_in_sec = durationSec;
  if (score != null)
    run.run_score = score;
  if (gameState)
    run.game_state = gameState;
  saveDb();
}
__name(endRun2, "endRun");
function getAllRunsForLeaderboard() {
  return db.runs;
}
__name(getAllRunsForLeaderboard, "getAllRunsForLeaderboard");
function getUsersMap() {
  const m2 = {};
  db.users.forEach((u) => {
    m2[u.user_id] = u;
  });
  return m2;
}
__name(getUsersMap, "getUsersMap");
function getCompendium(userId) {
  const u = getUserById(userId);
  return u?.discovered || { cards: [], souvenirs: [], swords: [] };
}
__name(getCompendium, "getCompendium");
function discoverItem(userId, category, id) {
  const u = getUserById(userId);
  if (!u)
    return;
  if (!u.discovered)
    u.discovered = { cards: [], souvenirs: [], swords: [] };
  const list = u.discovered[category];
  if (Array.isArray(list) && !list.includes(id)) {
    list.push(id);
    saveDb();
    logger3.info(`Discovered ${category} ${id} for ${userId}`);
  }
}
__name(discoverItem, "discoverItem");

// server/actions/internal/getUserInfo.ts
var getUserInfo = /* @__PURE__ */ __name(async (props) => {
  const { accountId, walletAddress } = props;
  const acct = accountId || walletAddress;
  let userId;
  let username = null;
  if (acct) {
    const existing = getUserByAccountId(acct);
    if (existing) {
      userId = existing.user_id;
      username = existing.username;
      logger.info(`Account ${acct} had userId: ${userId}`);
    } else {
      userId = createUser(acct);
      logger.info(`Account ${acct} created userId: ${userId}`);
    }
  } else {
    userId = createUser();
    logger.info(`New player userId: ${userId}`);
  }
  const nonce = getCurrentNonce(userId) || getNewNonce(userId);
  const userType = "player";
  return { userId, username: username || null, nonce, userType };
}, "getUserInfo");

// server/actions/internal/getNonce.ts
var inMemoryNonceCache = null;
var getNonceCache = /* @__PURE__ */ __name(() => {
  if (inMemoryNonceCache === null)
    inMemoryNonceCache = /* @__PURE__ */ new Map();
  return inMemoryNonceCache;
}, "getNonceCache");
var getCurrentNonce = /* @__PURE__ */ __name((userId) => {
  const nonceCache = getNonceCache();
  const nonce = nonceCache.get(userId) ?? getNewNonce(userId);
  return nonce;
}, "getCurrentNonce");
var getNewNonce = /* @__PURE__ */ __name((userId) => {
  logger.info(`Getting new nonce for ${userId}`);
  const nonceCache = getNonceCache();
  const nonce = "n-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  nonceCache.set(userId, nonce);
  return nonce;
}, "getNewNonce");

// server/actions/authenticateGuestUser.ts
var authenticateGuestUser = /* @__PURE__ */ __name(async ({ userId }) => {
  const storedNonce = getCurrentNonce(userId);
  return { result: "success", authToken: "guest-" + userId };
}, "authenticateGuestUser");

// server/actions/endRun.ts
var import_lodash29 = require("lodash");
init_db();
var endRun3 = /* @__PURE__ */ __name(async ({ userId, restart }) => {
  logger.info(`Ending run for: ${userId}`);
  const gameState = await getGamestate(userId);
  if (!gameState) {
    logger.error(`No gamestate found for ${userId}`);
    return { runId: null };
  }
  if (!isBattleScene(gameState.scene)) {
    logger.warn("Not in battle scene");
    return { runId: null };
  }
  const { runId, state } = gameState.scene;
  const totalScore = (0, import_lodash29.round)(gameState.scene.runScore.totalScore, 0);
  const { startTime, endTime } = gameState.scene.runDuration;
  let runDuration = 0;
  if (endTime) {
    runDuration = getRunDurationInSec(startTime, endTime);
  } else {
    let newEndTime = Date.now();
    runDuration = getRunDurationInSec(startTime, newEndTime);
  }
  logger.info({ userId, runId, totalScore, state, runDuration });
  if (!restart && state !== "won" && state !== "lost") {
    logger.warn("Not in battle end state");
    return { runId: null };
  }
  if (typeof runId !== "number") {
    logger.error("Run is not valid");
    return { runId: null };
  }
  endRun2(runId, restart ? "abandoned" : state, totalScore, runDuration, gameState);
  trackMetric("endRun", {
    scene: gameState.scene,
    runDuration,
    restart: restart || false
  });
  return { runId };
}, "endRun");
var isBattleScene = /* @__PURE__ */ __name((scene) => {
  return scene.id === "battle";
}, "isBattleScene");
var getRunDurationInSec = /* @__PURE__ */ __name((startTime, endTime) => {
  return ~~((endTime - startTime) / 1e3);
}, "getRunDurationInSec");

// server/actions/getCurrentRun.ts
var getCurrentRun = /* @__PURE__ */ __name(async ({
  userId
}) => {
  logger.info(`Getting current run for: ${userId}`);
  const runId = getCurrentRunId(userId);
  logger.info(`${userId} current runId: ${runId}`);
  if (!runId)
    return null;
  return { runId };
}, "getCurrentRun");

// server/actions/getLeaderboard.ts
var import_lodash30 = require("lodash");
var getLeaderboard = /* @__PURE__ */ __name(async (args) => {
  const { userId } = args;
  logger.info(`Getting leaderboards for ${userId}`);
  const runs = getAllRunsForLeaderboard();
  const users = getUsersMap();
  const now = Date.now();
  const oneDayMs = 24 * 3600 * 1e3;
  const sevenDaysMs = 7 * oneDayMs;
  const filterByTime = /* @__PURE__ */ __name((r, tf) => {
    if (r.run_score == null)
      return false;
    if (!["won", "lost", "abandoned"].includes(r.run_status))
      return false;
    if (BUILD_VER && r.build_version && r.build_version !== BUILD_VER)
      return false;
    if (tf === "daily") {
      const end = r.end_ts || r.start_ts;
      return now - end < oneDayMs;
    }
    if (tf === "weekly") {
      const end = r.end_ts || r.start_ts;
      return now - end < sevenDaysMs;
    }
    return true;
  }, "filterByTime");
  const makeLb = /* @__PURE__ */ __name((timeframe) => {
    let filtered = runs.filter((r) => filterByTime(r, timeframe)).map((r) => {
      const u = users[r.user_id];
      let allCharactersStr = null;
      try {
        if (r.game_state && r.game_state.scene && r.game_state.scene.allCharacters) {
          allCharactersStr = JSON.stringify(r.game_state.scene.allCharacters);
        }
      } catch {
      }
      return {
        leaderboard_rank: 0,
        is_self: r.user_id === userId,
        username: u ? u.username : null,
        max_score: r.run_score,
        start_ts: r.start_ts,
        end_ts: r.end_ts || r.start_ts,
        run_id: r.run_id,
        all_characters: allCharactersStr
      };
    }).sort((a, b2) => (b2.max_score || 0) - (a.max_score || 0));
    filtered.forEach((e, i) => {
      e.leaderboard_rank = i + 1;
    });
    const top = filtered.slice(0, LEADERBOARD_ENTRIES_TO_DISPLAY);
    const selfEntry = filtered.find((e) => e.is_self);
    let result = top;
    if (selfEntry && !top.some((e) => e.run_id === selfEntry.run_id)) {
      result = [...top, selfEntry].sort((a, b2) => (b2.max_score || 0) - (a.max_score || 0));
    }
    return result.map((e) => {
      let teamComp = [];
      const ac = e.all_characters;
      if (ac) {
        try {
          const chars = JSON.parse(ac);
          (0, import_lodash30.keys)(chars).forEach((k2) => {
            if (chars[k2].isPc)
              teamComp.push(chars[k2].id);
          });
        } catch {
        }
      }
      return { ...e, teamComp };
    });
  }, "makeLb");
  const allTime = makeLb("allTime");
  const weekly = makeLb("weekly");
  const daily = makeLb("daily");
  return {
    allTime,
    weekly,
    daily
  };
}, "getLeaderboard");

// server/actions/getLeaderboardEntryCount.ts
var getLeaderboardEntryCount = /* @__PURE__ */ __name(async (args) => {
  const runs = getAllRunsForLeaderboard();
  const unique = new Set(runs.map((r) => r.user_id));
  const count = unique.size;
  logger.info(`Total leaderboard entry count: ${count}`);
  return { count };
}, "getLeaderboardEntryCount");

// server/actions/getNumKaijuInGoodEarth.ts
var getNumKaijuInGoodEarth = /* @__PURE__ */ __name(async () => ({ numKaijuOwned: 0 }), "getNumKaijuInGoodEarth");

// server/actions/getSchema.ts
async function getSchema() {
  return { status: "no-db" };
}
__name(getSchema, "getSchema");

// server/actions/setInitialGameState.ts
init_db();
init_RulebookManager();
var setInitialGameState = /* @__PURE__ */ __name(async ({
  userId,
  sceneId
}) => {
  const effScene = sceneId || "entry";
  let existing = null;
  try {
    existing = await (init_db(), __toCommonJS(db_exports)).getGamestate(userId);
  } catch {
  }
  if (existing) {
    migratePlayerGamestateSave(existing);
  }
  const initialGameState = buildInitialGameState({ userId, sceneId: effScene, existingState: existing });
  setGamestate(userId, initialGameState);
  emitUpdatedGameState(userId, initialGameState);
}, "setInitialGameState");

// server/actions/loadGameState.ts
init_db();
var loadGameState = /* @__PURE__ */ __name(async ({
  userId
}) => {
  logger.debug("loading gamestate...");
  const existingGameState = await getGamestate(userId);
  if (existingGameState)
    return emitUpdatedGameState(userId, existingGameState);
  else
    setInitialGameState({ userId });
}, "loadGameState");

// server/actions/login.ts
var login = /* @__PURE__ */ __name(async (args) => {
  const { accountId, walletAddress, socketId } = args || {};
  logger.debug(`Handling login for account: ${accountId}`);
  const existingSocket = activeUserSockets.get(accountId);
  if (existingSocket && existingSocket !== socketId) {
    logger.debug(
      `Account ${accountId} already logged in with socketId: ${existingSocket}`
    );
  }
  const { userId, username, nonce, userType } = await getUserInfo({
    accountId: accountId || walletAddress
  });
  activeUserSockets.set(userId, socketId);
  const activeUser = activeUsers.get(socketId);
  if (activeUser)
    activeUsers.set(socketId, { ...activeUser, userId });
  touchLogin(userId);
  return { userId, username, nonce, userType };
}, "login");

// server/actions/internal/getGuestUserInfo.ts
var getGuestUserInfo = /* @__PURE__ */ __name(async (props) => {
  const { userId: existingUserId } = props;
  const userType = "player";
  if (existingUserId) {
    const existing = getUserById(existingUserId);
    if (existing) {
      logger.info(`Existing userId: ${existingUserId}`);
      const nonce2 = getCurrentNonce(existingUserId) || getNewNonce(existingUserId);
      return { userId: existingUserId, username: existing.username, nonce: nonce2, userType };
    }
  }
  const userId = createUser();
  logger.info(`Player created new userId: ${userId}.`);
  const nonce = getNewNonce(userId);
  return { userId, username: null, nonce, userType };
}, "getGuestUserInfo");

// server/actions/loginGuest.ts
var loginGuest = /* @__PURE__ */ __name(async ({
  existingUserId,
  socketId
}) => {
  logger.info(`Handling login for: ${existingUserId ?? "New Player"}`);
  const { userId, username, nonce, userType } = await getGuestUserInfo({
    userId: existingUserId
  });
  activeUserSockets.set(userId, socketId);
  const activeUser = activeUsers.get(socketId);
  if (activeUser)
    activeUsers.set(socketId, { ...activeUser, userId });
  console.log({ userId, socketId });
  touchLogin(userId);
  return { userId, username, nonce, userType };
}, "loginGuest");

// server/actions/setUsername.ts
var import_bad_words = __toESM(require("bad-words"));
var import_lodash31 = require("lodash");
var setUsername = /* @__PURE__ */ __name(async ({
  userId,
  username
}) => {
  username = (0, import_lodash31.toLower)(username);
  logger.info(`${userId} is trying to set username to: ${username}`);
  if (!usernameIsValid(username)) {
    return { result: "failure" };
  }
  if (usernameIsValid(username) && !usernameExists(username)) {
    const ok = updateUsername(userId, username);
    return { result: ok ? "success" : "failure" };
  }
  return { result: "failure" };
}, "setUsername");
var usernameIsValid = /* @__PURE__ */ __name((username) => {
  const filter = new import_bad_words.default();
  if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
    return false;
  } else if (filter.isProfane(username)) {
    return false;
  } else if (username.indexOf(" ") >= 0) {
    return false;
  }
  return true;
}, "usernameIsValid");

// server/actions/startRun.ts
init_db();
var startRun2 = /* @__PURE__ */ __name(async ({ userId }) => {
  logger.info(`Starting run for: ${userId}`);
  const gameState = await getGamestate(userId);
  const runId = createRun(userId, gameState);
  trackMetric("startRun", { runId, userId });
  logger.info(`Started run for ${userId}: ${runId}`);
  return { runId };
}, "startRun");

// server/actions/prepareRun.ts
var import_sbaobab7 = require("sbaobab");

// server/sleepLoop.ts
init_code();
init_db();
var import_sbaobab6 = require("sbaobab");
init_db();
var processingQueue = {};
var isProcessing = /* @__PURE__ */ new Set();
function clearActionQueue(userId) {
  delete processingQueue[userId];
  isProcessing.delete(userId);
}
__name(clearActionQueue, "clearActionQueue");
function syncGameStateToClient(userId, game) {
  updateClient(userId, game);
}
__name(syncGameStateToClient, "syncGameStateToClient");
var processActionQueue = /* @__PURE__ */ __name(async (userId) => {
  let actionQueue = processingQueue[userId];
  if (!actionQueue || isProcessing.has(userId))
    return;
  isProcessing.add(userId);
  let action;
  while (action = processingQueue[userId].shift()) {
    try {
      const gamestate = await getGamestate(userId);
      if (gamestate == null)
        throw Error("no gamestate for this user");
      const game = new import_sbaobab6.SBaobab(gamestate).select();
      await doActionAndTakeSteps({ ...action, game });
    } catch (e) {
      const err2 = e;
      logger.error(
        `error doing game action: ${err2.message}
${err2.stack}`
      );
    }
  }
  isProcessing.delete(userId);
  if (!processingQueue[userId].length)
    delete processingQueue[userId];
  return;
}, "processActionQueue");
async function doActionAndTakeSteps(args) {
  const { game, userId } = args;
  doGameAction(args);
  let maybeNextAction = game.get("nextAction");
  while (maybeNextAction != null) {
    updateClient(args.userId, game);
    await sleep(maybeNextAction.delay);
    game.set("nextAction", null);
    step(game, maybeNextAction);
    maybeNextAction = game.get("nextAction");
  }
  updateClient(userId, game);
}
__name(doActionAndTakeSteps, "doActionAndTakeSteps");
function updateClient(userId, game) {
  for (const event of getHappened(userId)) {
    emitNetworkEvent({ userId, event });
  }
  clearHappened(userId);
  emitUpdatedGameState(userId, game.get());
  setGamestate(userId, game.get());
}
__name(updateClient, "updateClient");

// server/actions/prepareRun.ts
init_db();
var prepareRun = /* @__PURE__ */ __name(async ({
  userId,
  daily,
  plain,
  enhanced,
  autoStart,
  sceneId
}) => {
  logger.info(
    `prepareRun for ${userId}, daily=${!!daily}, autoStart=${!!autoStart}, sceneId=${sceneId || (daily ? "daily" : "entry")}`
  );
  clearActionQueue(userId);
  const effectiveScene = sceneId || (daily ? "daily" : "entry");
  if (daily) {
    const today = new Date().toISOString().slice(0, 10);
    setGlobalRandomSeed(`daily-${today}`);
  } else {
    setGlobalRandomSeed(`adv-${Date.now()}`);
  }
  await setInitialGameState({ userId, sceneId: effectiveScene });
  try {
    (init_rulebook2(), __toCommonJS(rulebook_exports)).ensureRulebooksMigrated();
  } catch {
  }
  const usePlain = plain !== false && !enhanced;
  const useEnhanced = !!enhanced;
  const gamestate = await getGamestate(userId);
  if (gamestate == null) {
    throw new Error("no gamestate after reset");
  }
  const game = new import_sbaobab7.SBaobab(gamestate).select();
  game.select("scene").merge({
    rollPlain: usePlain,
    rollEnhanced: useEnhanced
  });
  syncGameStateToClient(userId, game);
  const effectiveAutoStart = autoStart || daily;
  if (!effectiveAutoStart)
    return;
  for (let i = 0; i < 3; i++) {
    doGameAction({
      method: "rollKaiju",
      placeIndex: i,
      plain: usePlain,
      enhanced: useEnhanced,
      game,
      userId
    });
  }
  const selected = game.select("scene").get("selectedCharacters");
  if (!selected?.every((c) => c != null)) {
    throw new Error("failed to roll party for menu start");
  }
  const runId = createRun(userId, game.get());
  doGameAction({
    method: "changeScene",
    newSceneName: "battle",
    game,
    userId
  });
  doGameAction({
    method: "setRunId",
    userId,
    runId,
    game
  });
  syncGameStateToClient(userId, game);
  return { runId };
}, "prepareRun");

// server/actions/verifyAuthToken.ts
var verifyAuthToken = /* @__PURE__ */ __name(async ({
  userId
}) => {
  logger.info(`verifying auth token (simplified) for ${userId}`);
  const socketId = getSocketId(userId);
  if (socketId) {
    const expires = Date.now() + 1e3 * 60 * 60 * 4;
    const activeUser = activeUsers.get(socketId);
    if (activeUser)
      activeUsers.set(socketId, { ...activeUser, authExpires: expires });
  }
  return { result: "success" };
}, "verifyAuthToken");

// server/actions/authenticateWeb3User.ts
var authenticateWeb3User = /* @__PURE__ */ __name(async () => ({ result: "failure", error: "web3 auth removed" }), "authenticateWeb3User");

// server/actions/listAccounts.ts
var listAccountsAction = /* @__PURE__ */ __name(async () => {
  return { accounts: listAccounts() };
}, "listAccountsAction");

// server/actions/createAccount.ts
var createAccountAction = /* @__PURE__ */ __name(async ({ username, overwrite }) => {
  const res = createAccount(username, !!overwrite);
  if (!res.success) {
    return { result: "failure", error: res.error };
  }
  return { result: "success", userId: res.userId, username: res.username };
}, "createAccountAction");

// server/actions/deleteAccount.ts
var deleteAccountAction = /* @__PURE__ */ __name(async ({ userId }) => {
  const ok = deleteAccount(userId);
  return { result: ok ? "success" : "failure" };
}, "deleteAccountAction");

// server/actions/getCompendium.ts
var getCompendiumAction = /* @__PURE__ */ __name(async ({ userId }) => {
  return getCompendium(userId);
}, "getCompendiumAction");

// server/actions/discover.ts
var discoverAction = /* @__PURE__ */ __name(async ({ userId, category, id }) => {
  discoverItem(userId, category, id);
  return;
}, "discoverAction");

// server/actions/generateGame.ts
var generateGameAction = /* @__PURE__ */ __name(async ({ userId, worldPrompt, stylePrompt }) => {
  const world = (worldPrompt || "mysterious land").trim();
  const style = (stylePrompt || "vibrant").trim();
  const name = `AI: ${world.split(" ").slice(0, 3).join(" ")} ${style.split(" ")[0]}`;
  const desc = `A ${style} world where ${world}. Unique Kaiju, cards, and mechanics generated by Grok.`;
  const cards = [
    { id: "gen-slash", name: `${world.split(" ")[0]} Fury`, desc: `Deal extra in ${style} style.` },
    { id: "gen-echo", name: "World Pulse", desc: `Chain based on generated stance.` }
  ];
  const image = "/assets/generated/grok-generated-kaiju.jpg";
  console.log(`[generateGame] for ${userId}: world="${world}" style="${style}"`);
  return { name, desc, cards, image };
}, "generateGameAction");

// server/api.ts
init_db();

// server/serverAction.ts
init_code();
satisfies(actions_exports2);
function isServerAction(name) {
  return name in actions_exports2;
}
__name(isServerAction, "isServerAction");

// server/api.ts
async function api(method, args, userId) {
  try {
    if (isServerAction(method)) {
      logger.info(
        `server api call: ${JSON.stringify({ method, ...args })}`
      );
      const response = await actions_exports2[method]({ ...args });
      logger.info(`server api response: ${JSON.stringify(response)}`);
      return response;
    } else if (isGameAction(method)) {
      if (typeof userId !== "string")
        return err("no userId");
      const gamestate = await getGamestate(userId);
      if (gamestate == null)
        return err("no gamestate for this user");
      const actionArgs = { userId, method, ...args };
      logger.debug(`api call: ${JSON.stringify(actionArgs)}`);
      if (!processingQueue[userId])
        processingQueue[userId] = [];
      processingQueue[userId].push(actionArgs);
      await processActionQueue(userId);
      return { status: "success" };
    } else {
      return err("invalid method");
    }
  } catch (e) {
    const error = e;
    const msg = error.message;
    logger.error(
      `exception occured in client call to ${method}: ${msg} ${error.stack}`
    );
    return err(msg);
  }
}
__name(api, "api");
var err = /* @__PURE__ */ __name((message) => {
  return { status: "error", message };
}, "err");

// server/IO.ts
var socketServer = null;
var activeUsers = /* @__PURE__ */ new Map();
var activeUserSockets = /* @__PURE__ */ new Map();
function mountSocketServer(server, prefix2) {
  const isStagingServer = process.env.DEV_STATIC_ASSETS === "yes" || true;
  try {
    socketServer = new import_socket.Server(server, {
      path: prefix2 + `${isStagingServer ? "/server" : ""}/socket`
    });
    refreshOnChange(socketServer);
    socketServer.on("connection", (socket) => {
      logger.info(`[CONNECTED] Socket ${socket.id}`);
      activeUsers.set(socket.id, { userId: null, authExpires: null });
      logger.info({ activeUsers: activeUsers.size });
      socket.on("api", handleApiCall);
      socket.on("disconnect", () => {
        const userId = activeUsers.get(socket.id)?.userId;
        if (userId)
          activeUserSockets.delete(userId);
        activeUsers.delete(socket.id);
        logger.info(`[DISCONNECTED] Socket ${socket.id} had userId: ${userId}`);
        logger.info({ activeUsers: activeUsers.size });
      });
    });
  } catch (e) {
    console.error(e);
  }
}
__name(mountSocketServer, "mountSocketServer");
function refreshOnChange(socketServer2) {
  (0, import_fs5.watchFile)(__dirname + "../../public/dailyship.js", () => {
    socketServer2.emit("refresh");
  });
}
__name(refreshOnChange, "refreshOnChange");
function getSocketId(userId) {
  let socketId = activeUserSockets.get(userId);
  if (!socketId) {
    activeUsers.forEach((value, key) => {
      if (value.userId === userId) {
        socketId = key;
        activeUserSockets.set(userId, key);
      }
    });
  }
  return socketId;
}
__name(getSocketId, "getSocketId");
var userIsAuthenticated = /* @__PURE__ */ __name((userId) => {
  if (!userId)
    return false;
  logger.debug(`checking auth for ${getShortWalletAddress(userId)}...`);
  logger.debug({ activeUserSockets });
  const socketId = getSocketId(userId);
  if (!socketId)
    return new Error("no socket wtf");
  const authExpires = activeUsers.get(socketId)?.authExpires;
  logger.debug({ authExpires, dateNow: Date.now() });
  if (!authExpires)
    return false;
  if (authExpires < Date.now())
    return false;
  return true;
}, "userIsAuthenticated");
function emitUpdatedGameState(userId, gamestate) {
  const socketId = getSocketId(userId);
  if (socketServer === null) {
    logger.debug && logger.debug("emitUpdatedGameState: no socketServer, skipping (test/env mode)");
    return;
  }
  if (!socketId) {
    logger.error("no socketId");
    return;
  }
  socketServer.to(socketId).emit("update", gamestate);
}
__name(emitUpdatedGameState, "emitUpdatedGameState");
function emitNetworkEvent(args) {
  if (socketServer == null) {
    logger.debug && logger.debug("emitNetworkEvent: no socketServer, skipping (test/env mode)");
    return;
  }
  const { userId, event } = args;
  const socketId = getSocketId(userId);
  if (!socketId) {
    logger.error("no socketId");
    return;
  }
  console.log({ socketId });
  socketServer.to(socketId).emit(event.type, event);
}
__name(emitNetworkEvent, "emitNetworkEvent");
async function handleApiCall(args, callback) {
  const { method, userId } = args;
  if (isAuthenticatedAction(method)) {
    const userId2 = args.userId;
    if (!userId2)
      return console.warn("no user id!!!");
    if (!userIsAuthenticated(userId2)) {
      logger.warn("[todo] socket is not authenticated");
    }
  }
  try {
    const response = await api(method, args, userId ?? void 0);
    callback(response);
  } catch (e) {
    const err2 = e;
    logger.error(`error in calling api: ${err2.message}. ${err2.stack}`);
  }
}
__name(handleApiCall, "handleApiCall");

// server/build/buildInfo.ts
var port = getServerEnv("PORT") ?? 3e3;
var buildInfo = {
  port,
  gitBranch: "test",
  gitCommit: "8a4e9c2f fix(vercel): stage to api/bundled-public + include + nft force reads in shim + rename for no conflict + map-driven package test + robust resolve; build succeeds, assets in filePathMap+phys for func, tests pass",
  buildTime: "2026-06-23T06:59:37.806Z"
};

// server/index.ts
init_db();

// server/types.ts
global.logger = getLogger();

// server/index.ts
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3456;
var LOG_LEVEL = process.env.LOG_LEVEL || "info";
var FIXED_SEED = process.env.FIXED_SEED === "true";
var DEV_STATIC_ASSETS = true;
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.post("/api", async (req, res) => {
  try {
    const { method, userId, ...args } = req.body ?? {};
    const result = await api(method, args, userId);
    if (userId) {
      try {
        const gs = await getGamestate(userId);
        if (gs) {
          ;
          result.gamestate = gs;
        }
      } catch {
      }
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ status: "error", message: e?.message || "api error" });
  }
});
app.use("/media-proxy", async (req, res) => {
  const remotePath = req.url.replace(/^\//, "");
  if (!remotePath) {
    res.status(400).end("missing path");
    return;
  }
  const url = `https://media.kaijucards.io/${remotePath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).end();
      return;
    }
    const contentType = response.headers.get("content-type");
    if (contentType)
      res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    logger.warn(`media proxy failed for ${url}`, e);
    res.status(502).end();
  }
});
if (DEV_STATIC_ASSETS) {
  const publicDir = resolvePublicDir();
  const mount = import_fs6.default.existsSync(publicDir) || !!process.env.VERCEL;
  if (mount) {
    const assetsDir = import_path3.default.join(publicDir, "assets");
    app.use(
      "/assets",
      import_express.default.static(assetsDir, {
        extensions: [".atlas", ".txt"],
        maxAge: "1d"
      })
    );
    app.use(
      "/",
      import_express.default.static(publicDir, {
        extensions: [".atlas", ".txt"],
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".js") || filePath.endsWith(".css") || filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
        }
      })
    );
  }
}
logger.transports.forEach((transport) => {
  transport.level = LOG_LEVEL;
});
logger.info(`LOG LEVEL: ${LOG_LEVEL}`);
if (FIXED_SEED) {
  logger.info("NOTE: USING FIXED SEED");
  setGlobalRandomSeed("seedThree");
}
if (require.main === module && !process.env.VERCEL) {
  const port2 = PORT;
  const server = app.listen(port2, function() {
    logger.info(`Serving on http://localhost:${port2}`);
  });
  mountSocketServer(server, "");
  logger.info(`the server started with ${JSON.stringify(buildInfo)}`);
}
var server_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=server.js.map
