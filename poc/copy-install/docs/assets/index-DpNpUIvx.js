(function () {
  const o = document.createElement("link").relList;
  if (o && o.supports && o.supports("modulepreload")) return;
  for (const d of document.querySelectorAll('link[rel="modulepreload"]')) c(d);
  new MutationObserver((d) => {
    for (const h of d)
      if (h.type === "childList")
        for (const S of h.addedNodes) S.tagName === "LINK" && S.rel === "modulepreload" && c(S);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(d) {
    const h = {};
    return (
      d.integrity && (h.integrity = d.integrity),
      d.referrerPolicy && (h.referrerPolicy = d.referrerPolicy),
      d.crossOrigin === "use-credentials"
        ? (h.credentials = "include")
        : d.crossOrigin === "anonymous"
          ? (h.credentials = "omit")
          : (h.credentials = "same-origin"),
      h
    );
  }
  function c(d) {
    if (d.ep) return;
    d.ep = !0;
    const h = s(d);
    fetch(d.href, h);
  }
})();
function hm(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var Mc = { exports: {} },
  Ou = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Fd;
function a0() {
  if (Fd) return Ou;
  Fd = 1;
  var f = Symbol.for("react.transitional.element"),
    o = Symbol.for("react.fragment");
  function s(c, d, h) {
    var S = null;
    if ((h !== void 0 && (S = "" + h), d.key !== void 0 && (S = "" + d.key), "key" in d)) {
      h = {};
      for (var M in d) M !== "key" && (h[M] = d[M]);
    } else h = d;
    return ((d = h.ref), { $$typeof: f, type: c, key: S, ref: d !== void 0 ? d : null, props: h });
  }
  return ((Ou.Fragment = o), (Ou.jsx = s), (Ou.jsxs = s), Ou);
}
var Id;
function u0() {
  return (Id || ((Id = 1), (Mc.exports = a0())), Mc.exports);
}
var W = u0(),
  Oc = { exports: {} },
  I = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Pd;
function n0() {
  if (Pd) return I;
  Pd = 1;
  var f = Symbol.for("react.transitional.element"),
    o = Symbol.for("react.portal"),
    s = Symbol.for("react.fragment"),
    c = Symbol.for("react.strict_mode"),
    d = Symbol.for("react.profiler"),
    h = Symbol.for("react.consumer"),
    S = Symbol.for("react.context"),
    M = Symbol.for("react.forward_ref"),
    b = Symbol.for("react.suspense"),
    v = Symbol.for("react.memo"),
    D = Symbol.for("react.lazy"),
    A = Symbol.for("react.activity"),
    H = Symbol.iterator;
  function K(g) {
    return g === null || typeof g != "object"
      ? null
      : ((g = (H && g[H]) || g["@@iterator"]), typeof g == "function" ? g : null);
  }
  var V = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    G = Object.assign,
    L = {};
  function q(g, N, j) {
    ((this.props = g), (this.context = N), (this.refs = L), (this.updater = j || V));
  }
  ((q.prototype.isReactComponent = {}),
    (q.prototype.setState = function (g, N) {
      if (typeof g != "object" && typeof g != "function" && g != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, g, N, "setState");
    }),
    (q.prototype.forceUpdate = function (g) {
      this.updater.enqueueForceUpdate(this, g, "forceUpdate");
    }));
  function k() {}
  k.prototype = q.prototype;
  function w(g, N, j) {
    ((this.props = g), (this.context = N), (this.refs = L), (this.updater = j || V));
  }
  var yt = (w.prototype = new k());
  ((yt.constructor = w), G(yt, q.prototype), (yt.isPureReactComponent = !0));
  var dt = Array.isArray;
  function Tt() {}
  var F = { H: null, A: null, T: null, S: null },
    xt = Object.prototype.hasOwnProperty;
  function Jt(g, N, j) {
    var X = j.ref;
    return { $$typeof: f, type: g, key: N, ref: X !== void 0 ? X : null, props: j };
  }
  function Ue(g, N) {
    return Jt(g.type, N, g.props);
  }
  function he(g) {
    return typeof g == "object" && g !== null && g.$$typeof === f;
  }
  function wt(g) {
    var N = { "=": "=0", ":": "=2" };
    return (
      "$" +
      g.replace(/[=:]/g, function (j) {
        return N[j];
      })
    );
  }
  var Ne = /\/+/g;
  function ye(g, N) {
    return typeof g == "object" && g !== null && g.key != null ? wt("" + g.key) : N.toString(36);
  }
  function Nt(g) {
    switch (g.status) {
      case "fulfilled":
        return g.value;
      case "rejected":
        throw g.reason;
      default:
        switch (
          (typeof g.status == "string"
            ? g.then(Tt, Tt)
            : ((g.status = "pending"),
              g.then(
                function (N) {
                  g.status === "pending" && ((g.status = "fulfilled"), (g.value = N));
                },
                function (N) {
                  g.status === "pending" && ((g.status = "rejected"), (g.reason = N));
                },
              )),
          g.status)
        ) {
          case "fulfilled":
            return g.value;
          case "rejected":
            throw g.reason;
        }
    }
    throw g;
  }
  function x(g, N, j, X, P) {
    var lt = typeof g;
    (lt === "undefined" || lt === "boolean") && (g = null);
    var st = !1;
    if (g === null) st = !0;
    else
      switch (lt) {
        case "bigint":
        case "string":
        case "number":
          st = !0;
          break;
        case "object":
          switch (g.$$typeof) {
            case f:
            case o:
              st = !0;
              break;
            case D:
              return ((st = g._init), x(st(g._payload), N, j, X, P));
          }
      }
    if (st)
      return (
        (P = P(g)),
        (st = X === "" ? "." + ye(g, 0) : X),
        dt(P)
          ? ((j = ""),
            st != null && (j = st.replace(Ne, "$&/") + "/"),
            x(P, N, j, "", function (Ba) {
              return Ba;
            }))
          : P != null &&
            (he(P) &&
              (P = Ue(
                P,
                j + (P.key == null || (g && g.key === P.key) ? "" : ("" + P.key).replace(Ne, "$&/") + "/") + st,
              )),
            N.push(P)),
        1
      );
    st = 0;
    var Wt = X === "" ? "." : X + ":";
    if (dt(g)) for (var Dt = 0; Dt < g.length; Dt++) ((X = g[Dt]), (lt = Wt + ye(X, Dt)), (st += x(X, N, j, lt, P)));
    else if (((Dt = K(g)), typeof Dt == "function"))
      for (g = Dt.call(g), Dt = 0; !(X = g.next()).done; )
        ((X = X.value), (lt = Wt + ye(X, Dt++)), (st += x(X, N, j, lt, P)));
    else if (lt === "object") {
      if (typeof g.then == "function") return x(Nt(g), N, j, X, P);
      throw (
        (N = String(g)),
        Error(
          "Objects are not valid as a React child (found: " +
            (N === "[object Object]" ? "object with keys {" + Object.keys(g).join(", ") + "}" : N) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return st;
  }
  function B(g, N, j) {
    if (g == null) return g;
    var X = [],
      P = 0;
    return (
      x(g, X, "", "", function (lt) {
        return N.call(j, lt, P++);
      }),
      X
    );
  }
  function $(g) {
    if (g._status === -1) {
      var N = g._result;
      ((N = N()),
        N.then(
          function (j) {
            (g._status === 0 || g._status === -1) && ((g._status = 1), (g._result = j));
          },
          function (j) {
            (g._status === 0 || g._status === -1) && ((g._status = 2), (g._result = j));
          },
        ),
        g._status === -1 && ((g._status = 0), (g._result = N)));
    }
    if (g._status === 1) return g._result.default;
    throw g._result;
  }
  var vt =
      typeof reportError == "function"
        ? reportError
        : function (g) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var N = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof g == "object" && g !== null && typeof g.message == "string" ? String(g.message) : String(g),
                error: g,
              });
              if (!window.dispatchEvent(N)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", g);
              return;
            }
            console.error(g);
          },
    bt = {
      map: B,
      forEach: function (g, N, j) {
        B(
          g,
          function () {
            N.apply(this, arguments);
          },
          j,
        );
      },
      count: function (g) {
        var N = 0;
        return (
          B(g, function () {
            N++;
          }),
          N
        );
      },
      toArray: function (g) {
        return (
          B(g, function (N) {
            return N;
          }) || []
        );
      },
      only: function (g) {
        if (!he(g)) throw Error("React.Children.only expected to receive a single React element child.");
        return g;
      },
    };
  return (
    (I.Activity = A),
    (I.Children = bt),
    (I.Component = q),
    (I.Fragment = s),
    (I.Profiler = d),
    (I.PureComponent = w),
    (I.StrictMode = c),
    (I.Suspense = b),
    (I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F),
    (I.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (g) {
        return F.H.useMemoCache(g);
      },
    }),
    (I.cache = function (g) {
      return function () {
        return g.apply(null, arguments);
      };
    }),
    (I.cacheSignal = function () {
      return null;
    }),
    (I.cloneElement = function (g, N, j) {
      if (g == null) throw Error("The argument must be a React element, but you passed " + g + ".");
      var X = G({}, g.props),
        P = g.key;
      if (N != null)
        for (lt in (N.key !== void 0 && (P = "" + N.key), N))
          !xt.call(N, lt) ||
            lt === "key" ||
            lt === "__self" ||
            lt === "__source" ||
            (lt === "ref" && N.ref === void 0) ||
            (X[lt] = N[lt]);
      var lt = arguments.length - 2;
      if (lt === 1) X.children = j;
      else if (1 < lt) {
        for (var st = Array(lt), Wt = 0; Wt < lt; Wt++) st[Wt] = arguments[Wt + 2];
        X.children = st;
      }
      return Jt(g.type, P, X);
    }),
    (I.createContext = function (g) {
      return (
        (g = { $$typeof: S, _currentValue: g, _currentValue2: g, _threadCount: 0, Provider: null, Consumer: null }),
        (g.Provider = g),
        (g.Consumer = { $$typeof: h, _context: g }),
        g
      );
    }),
    (I.createElement = function (g, N, j) {
      var X,
        P = {},
        lt = null;
      if (N != null)
        for (X in (N.key !== void 0 && (lt = "" + N.key), N))
          xt.call(N, X) && X !== "key" && X !== "__self" && X !== "__source" && (P[X] = N[X]);
      var st = arguments.length - 2;
      if (st === 1) P.children = j;
      else if (1 < st) {
        for (var Wt = Array(st), Dt = 0; Dt < st; Dt++) Wt[Dt] = arguments[Dt + 2];
        P.children = Wt;
      }
      if (g && g.defaultProps) for (X in ((st = g.defaultProps), st)) P[X] === void 0 && (P[X] = st[X]);
      return Jt(g, lt, P);
    }),
    (I.createRef = function () {
      return { current: null };
    }),
    (I.forwardRef = function (g) {
      return { $$typeof: M, render: g };
    }),
    (I.isValidElement = he),
    (I.lazy = function (g) {
      return { $$typeof: D, _payload: { _status: -1, _result: g }, _init: $ };
    }),
    (I.memo = function (g, N) {
      return { $$typeof: v, type: g, compare: N === void 0 ? null : N };
    }),
    (I.startTransition = function (g) {
      var N = F.T,
        j = {};
      F.T = j;
      try {
        var X = g(),
          P = F.S;
        (P !== null && P(j, X), typeof X == "object" && X !== null && typeof X.then == "function" && X.then(Tt, vt));
      } catch (lt) {
        vt(lt);
      } finally {
        (N !== null && j.types !== null && (N.types = j.types), (F.T = N));
      }
    }),
    (I.unstable_useCacheRefresh = function () {
      return F.H.useCacheRefresh();
    }),
    (I.use = function (g) {
      return F.H.use(g);
    }),
    (I.useActionState = function (g, N, j) {
      return F.H.useActionState(g, N, j);
    }),
    (I.useCallback = function (g, N) {
      return F.H.useCallback(g, N);
    }),
    (I.useContext = function (g) {
      return F.H.useContext(g);
    }),
    (I.useDebugValue = function () {}),
    (I.useDeferredValue = function (g, N) {
      return F.H.useDeferredValue(g, N);
    }),
    (I.useEffect = function (g, N) {
      return F.H.useEffect(g, N);
    }),
    (I.useEffectEvent = function (g) {
      return F.H.useEffectEvent(g);
    }),
    (I.useId = function () {
      return F.H.useId();
    }),
    (I.useImperativeHandle = function (g, N, j) {
      return F.H.useImperativeHandle(g, N, j);
    }),
    (I.useInsertionEffect = function (g, N) {
      return F.H.useInsertionEffect(g, N);
    }),
    (I.useLayoutEffect = function (g, N) {
      return F.H.useLayoutEffect(g, N);
    }),
    (I.useMemo = function (g, N) {
      return F.H.useMemo(g, N);
    }),
    (I.useOptimistic = function (g, N) {
      return F.H.useOptimistic(g, N);
    }),
    (I.useReducer = function (g, N, j) {
      return F.H.useReducer(g, N, j);
    }),
    (I.useRef = function (g) {
      return F.H.useRef(g);
    }),
    (I.useState = function (g) {
      return F.H.useState(g);
    }),
    (I.useSyncExternalStore = function (g, N, j) {
      return F.H.useSyncExternalStore(g, N, j);
    }),
    (I.useTransition = function () {
      return F.H.useTransition();
    }),
    (I.version = "19.2.6"),
    I
  );
}
var tm;
function Gc() {
  return (tm || ((tm = 1), (Oc.exports = n0())), Oc.exports);
}
var O = Gc();
const i0 = hm(O);
var xc = { exports: {} },
  xu = {},
  Dc = { exports: {} },
  Cc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var em;
function f0() {
  return (
    em ||
      ((em = 1),
      (function (f) {
        function o(x, B) {
          var $ = x.length;
          x.push(B);
          t: for (; 0 < $; ) {
            var vt = ($ - 1) >>> 1,
              bt = x[vt];
            if (0 < d(bt, B)) ((x[vt] = B), (x[$] = bt), ($ = vt));
            else break t;
          }
        }
        function s(x) {
          return x.length === 0 ? null : x[0];
        }
        function c(x) {
          if (x.length === 0) return null;
          var B = x[0],
            $ = x.pop();
          if ($ !== B) {
            x[0] = $;
            t: for (var vt = 0, bt = x.length, g = bt >>> 1; vt < g; ) {
              var N = 2 * (vt + 1) - 1,
                j = x[N],
                X = N + 1,
                P = x[X];
              if (0 > d(j, $))
                X < bt && 0 > d(P, j) ? ((x[vt] = P), (x[X] = $), (vt = X)) : ((x[vt] = j), (x[N] = $), (vt = N));
              else if (X < bt && 0 > d(P, $)) ((x[vt] = P), (x[X] = $), (vt = X));
              else break t;
            }
          }
          return B;
        }
        function d(x, B) {
          var $ = x.sortIndex - B.sortIndex;
          return $ !== 0 ? $ : x.id - B.id;
        }
        if (((f.unstable_now = void 0), typeof performance == "object" && typeof performance.now == "function")) {
          var h = performance;
          f.unstable_now = function () {
            return h.now();
          };
        } else {
          var S = Date,
            M = S.now();
          f.unstable_now = function () {
            return S.now() - M;
          };
        }
        var b = [],
          v = [],
          D = 1,
          A = null,
          H = 3,
          K = !1,
          V = !1,
          G = !1,
          L = !1,
          q = typeof setTimeout == "function" ? setTimeout : null,
          k = typeof clearTimeout == "function" ? clearTimeout : null,
          w = typeof setImmediate < "u" ? setImmediate : null;
        function yt(x) {
          for (var B = s(v); B !== null; ) {
            if (B.callback === null) c(v);
            else if (B.startTime <= x) (c(v), (B.sortIndex = B.expirationTime), o(b, B));
            else break;
            B = s(v);
          }
        }
        function dt(x) {
          if (((G = !1), yt(x), !V))
            if (s(b) !== null) ((V = !0), Tt || ((Tt = !0), wt()));
            else {
              var B = s(v);
              B !== null && Nt(dt, B.startTime - x);
            }
        }
        var Tt = !1,
          F = -1,
          xt = 5,
          Jt = -1;
        function Ue() {
          return L ? !0 : !(f.unstable_now() - Jt < xt);
        }
        function he() {
          if (((L = !1), Tt)) {
            var x = f.unstable_now();
            Jt = x;
            var B = !0;
            try {
              t: {
                ((V = !1), G && ((G = !1), k(F), (F = -1)), (K = !0));
                var $ = H;
                try {
                  e: {
                    for (yt(x), A = s(b); A !== null && !(A.expirationTime > x && Ue()); ) {
                      var vt = A.callback;
                      if (typeof vt == "function") {
                        ((A.callback = null), (H = A.priorityLevel));
                        var bt = vt(A.expirationTime <= x);
                        if (((x = f.unstable_now()), typeof bt == "function")) {
                          ((A.callback = bt), yt(x), (B = !0));
                          break e;
                        }
                        (A === s(b) && c(b), yt(x));
                      } else c(b);
                      A = s(b);
                    }
                    if (A !== null) B = !0;
                    else {
                      var g = s(v);
                      (g !== null && Nt(dt, g.startTime - x), (B = !1));
                    }
                  }
                  break t;
                } finally {
                  ((A = null), (H = $), (K = !1));
                }
                B = void 0;
              }
            } finally {
              B ? wt() : (Tt = !1);
            }
          }
        }
        var wt;
        if (typeof w == "function")
          wt = function () {
            w(he);
          };
        else if (typeof MessageChannel < "u") {
          var Ne = new MessageChannel(),
            ye = Ne.port2;
          ((Ne.port1.onmessage = he),
            (wt = function () {
              ye.postMessage(null);
            }));
        } else
          wt = function () {
            q(he, 0);
          };
        function Nt(x, B) {
          F = q(function () {
            x(f.unstable_now());
          }, B);
        }
        ((f.unstable_IdlePriority = 5),
          (f.unstable_ImmediatePriority = 1),
          (f.unstable_LowPriority = 4),
          (f.unstable_NormalPriority = 3),
          (f.unstable_Profiling = null),
          (f.unstable_UserBlockingPriority = 2),
          (f.unstable_cancelCallback = function (x) {
            x.callback = null;
          }),
          (f.unstable_forceFrameRate = function (x) {
            0 > x || 125 < x
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (xt = 0 < x ? Math.floor(1e3 / x) : 5);
          }),
          (f.unstable_getCurrentPriorityLevel = function () {
            return H;
          }),
          (f.unstable_next = function (x) {
            switch (H) {
              case 1:
              case 2:
              case 3:
                var B = 3;
                break;
              default:
                B = H;
            }
            var $ = H;
            H = B;
            try {
              return x();
            } finally {
              H = $;
            }
          }),
          (f.unstable_requestPaint = function () {
            L = !0;
          }),
          (f.unstable_runWithPriority = function (x, B) {
            switch (x) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                x = 3;
            }
            var $ = H;
            H = x;
            try {
              return B();
            } finally {
              H = $;
            }
          }),
          (f.unstable_scheduleCallback = function (x, B, $) {
            var vt = f.unstable_now();
            switch (
              (typeof $ == "object" && $ !== null
                ? (($ = $.delay), ($ = typeof $ == "number" && 0 < $ ? vt + $ : vt))
                : ($ = vt),
              x)
            ) {
              case 1:
                var bt = -1;
                break;
              case 2:
                bt = 250;
                break;
              case 5:
                bt = 1073741823;
                break;
              case 4:
                bt = 1e4;
                break;
              default:
                bt = 5e3;
            }
            return (
              (bt = $ + bt),
              (x = { id: D++, callback: B, priorityLevel: x, startTime: $, expirationTime: bt, sortIndex: -1 }),
              $ > vt
                ? ((x.sortIndex = $),
                  o(v, x),
                  s(b) === null && x === s(v) && (G ? (k(F), (F = -1)) : (G = !0), Nt(dt, $ - vt)))
                : ((x.sortIndex = bt), o(b, x), V || K || ((V = !0), Tt || ((Tt = !0), wt()))),
              x
            );
          }),
          (f.unstable_shouldYield = Ue),
          (f.unstable_wrapCallback = function (x) {
            var B = H;
            return function () {
              var $ = H;
              H = B;
              try {
                return x.apply(this, arguments);
              } finally {
                H = $;
              }
            };
          }));
      })(Cc)),
    Cc
  );
}
var lm;
function c0() {
  return (lm || ((lm = 1), (Dc.exports = f0())), Dc.exports);
}
var Uc = { exports: {} },
  $t = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var am;
function r0() {
  if (am) return $t;
  am = 1;
  var f = Gc();
  function o(b) {
    var v = "https://react.dev/errors/" + b;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var D = 2; D < arguments.length; D++) v += "&args[]=" + encodeURIComponent(arguments[D]);
    }
    return (
      "Minified React error #" +
      b +
      "; visit " +
      v +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function s() {}
  var c = {
      d: {
        f: s,
        r: function () {
          throw Error(o(522));
        },
        D: s,
        C: s,
        L: s,
        m: s,
        X: s,
        S: s,
        M: s,
      },
      p: 0,
      findDOMNode: null,
    },
    d = Symbol.for("react.portal");
  function h(b, v, D) {
    var A = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: d, key: A == null ? null : "" + A, children: b, containerInfo: v, implementation: D };
  }
  var S = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function M(b, v) {
    if (b === "font") return "";
    if (typeof v == "string") return v === "use-credentials" ? v : "";
  }
  return (
    ($t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c),
    ($t.createPortal = function (b, v) {
      var D = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)) throw Error(o(299));
      return h(b, v, null, D);
    }),
    ($t.flushSync = function (b) {
      var v = S.T,
        D = c.p;
      try {
        if (((S.T = null), (c.p = 2), b)) return b();
      } finally {
        ((S.T = v), (c.p = D), c.d.f());
      }
    }),
    ($t.preconnect = function (b, v) {
      typeof b == "string" &&
        (v
          ? ((v = v.crossOrigin), (v = typeof v == "string" ? (v === "use-credentials" ? v : "") : void 0))
          : (v = null),
        c.d.C(b, v));
    }),
    ($t.prefetchDNS = function (b) {
      typeof b == "string" && c.d.D(b);
    }),
    ($t.preinit = function (b, v) {
      if (typeof b == "string" && v && typeof v.as == "string") {
        var D = v.as,
          A = M(D, v.crossOrigin),
          H = typeof v.integrity == "string" ? v.integrity : void 0,
          K = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
        D === "style"
          ? c.d.S(b, typeof v.precedence == "string" ? v.precedence : void 0, {
              crossOrigin: A,
              integrity: H,
              fetchPriority: K,
            })
          : D === "script" &&
            c.d.X(b, {
              crossOrigin: A,
              integrity: H,
              fetchPriority: K,
              nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            });
      }
    }),
    ($t.preinitModule = function (b, v) {
      if (typeof b == "string")
        if (typeof v == "object" && v !== null) {
          if (v.as == null || v.as === "script") {
            var D = M(v.as, v.crossOrigin);
            c.d.M(b, {
              crossOrigin: D,
              integrity: typeof v.integrity == "string" ? v.integrity : void 0,
              nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            });
          }
        } else v == null && c.d.M(b);
    }),
    ($t.preload = function (b, v) {
      if (typeof b == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
        var D = v.as,
          A = M(D, v.crossOrigin);
        c.d.L(b, D, {
          crossOrigin: A,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0,
          nonce: typeof v.nonce == "string" ? v.nonce : void 0,
          type: typeof v.type == "string" ? v.type : void 0,
          fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
          referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
          imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
          imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
          media: typeof v.media == "string" ? v.media : void 0,
        });
      }
    }),
    ($t.preloadModule = function (b, v) {
      if (typeof b == "string")
        if (v) {
          var D = M(v.as, v.crossOrigin);
          c.d.m(b, {
            as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
            crossOrigin: D,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
          });
        } else c.d.m(b);
    }),
    ($t.requestFormReset = function (b) {
      c.d.r(b);
    }),
    ($t.unstable_batchedUpdates = function (b, v) {
      return b(v);
    }),
    ($t.useFormState = function (b, v, D) {
      return S.H.useFormState(b, v, D);
    }),
    ($t.useFormStatus = function () {
      return S.H.useHostTransitionStatus();
    }),
    ($t.version = "19.2.6"),
    $t
  );
}
var um;
function o0() {
  if (um) return Uc.exports;
  um = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (o) {
        console.error(o);
      }
  }
  return (f(), (Uc.exports = r0()), Uc.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var nm;
function s0() {
  if (nm) return xu;
  nm = 1;
  var f = c0(),
    o = Gc(),
    s = o0();
  function c(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++) e += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      e +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function d(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function h(t) {
    var e = t,
      l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (l = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function S(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null)) return e.dehydrated;
    }
    return null;
  }
  function M(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null)) return e.dehydrated;
    }
    return null;
  }
  function b(t) {
    if (h(t) !== t) throw Error(c(188));
  }
  function v(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = h(t)), e === null)) throw Error(c(188));
      return e !== t ? null : t;
    }
    for (var l = t, a = e; ; ) {
      var u = l.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (((a = u.return), a !== null)) {
          l = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === l) return (b(u), t);
          if (n === a) return (b(u), e);
          n = n.sibling;
        }
        throw Error(c(188));
      }
      if (l.return !== a.return) ((l = u), (a = n));
      else {
        for (var i = !1, r = u.child; r; ) {
          if (r === l) {
            ((i = !0), (l = u), (a = n));
            break;
          }
          if (r === a) {
            ((i = !0), (a = u), (l = n));
            break;
          }
          r = r.sibling;
        }
        if (!i) {
          for (r = n.child; r; ) {
            if (r === l) {
              ((i = !0), (l = n), (a = u));
              break;
            }
            if (r === a) {
              ((i = !0), (a = n), (l = u));
              break;
            }
            r = r.sibling;
          }
          if (!i) throw Error(c(189));
        }
      }
      if (l.alternate !== a) throw Error(c(190));
    }
    if (l.tag !== 3) throw Error(c(188));
    return l.stateNode.current === l ? t : e;
  }
  function D(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = D(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var A = Object.assign,
    H = Symbol.for("react.element"),
    K = Symbol.for("react.transitional.element"),
    V = Symbol.for("react.portal"),
    G = Symbol.for("react.fragment"),
    L = Symbol.for("react.strict_mode"),
    q = Symbol.for("react.profiler"),
    k = Symbol.for("react.consumer"),
    w = Symbol.for("react.context"),
    yt = Symbol.for("react.forward_ref"),
    dt = Symbol.for("react.suspense"),
    Tt = Symbol.for("react.suspense_list"),
    F = Symbol.for("react.memo"),
    xt = Symbol.for("react.lazy"),
    Jt = Symbol.for("react.activity"),
    Ue = Symbol.for("react.memo_cache_sentinel"),
    he = Symbol.iterator;
  function wt(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (he && t[he]) || t["@@iterator"]), typeof t == "function" ? t : null);
  }
  var Ne = Symbol.for("react.client.reference");
  function ye(t) {
    if (t == null) return null;
    if (typeof t == "function") return t.$$typeof === Ne ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case G:
        return "Fragment";
      case q:
        return "Profiler";
      case L:
        return "StrictMode";
      case dt:
        return "Suspense";
      case Tt:
        return "SuspenseList";
      case Jt:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case V:
          return "Portal";
        case w:
          return t.displayName || "Context";
        case k:
          return (t._context.displayName || "Context") + ".Consumer";
        case yt:
          var e = t.render;
          return (
            (t = t.displayName),
            t || ((t = e.displayName || e.name || ""), (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case F:
          return ((e = t.displayName || null), e !== null ? e : ye(t.type) || "Memo");
        case xt:
          ((e = t._payload), (t = t._init));
          try {
            return ye(t(e));
          } catch {}
      }
    return null;
  }
  var Nt = Array.isArray,
    x = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    B = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    $ = { pending: !1, data: null, method: null, action: null },
    vt = [],
    bt = -1;
  function g(t) {
    return { current: t };
  }
  function N(t) {
    0 > bt || ((t.current = vt[bt]), (vt[bt] = null), bt--);
  }
  function j(t, e) {
    (bt++, (vt[bt] = t.current), (t.current = e));
  }
  var X = g(null),
    P = g(null),
    lt = g(null),
    st = g(null);
  function Wt(t, e) {
    switch ((j(lt, e), j(P, t), j(X, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? bd(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI))) ((e = bd(e)), (t = Ed(e, t)));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (N(X), j(X, t));
  }
  function Dt() {
    (N(X), N(P), N(lt));
  }
  function Ba(t) {
    t.memoizedState !== null && j(st, t);
    var e = X.current,
      l = Ed(e, t.type);
    e !== l && (j(P, t), j(X, l));
  }
  function qu(t) {
    (P.current === t && (N(X), N(P)), st.current === t && (N(st), (Au._currentValue = $)));
  }
  var ci, Wc;
  function Dl(t) {
    if (ci === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        ((ci = (e && e[1]) || ""),
          (Wc =
            -1 <
            l.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < l.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      ci +
      t +
      Wc
    );
  }
  var ri = !1;
  function oi(t, e) {
    if (!t || ri) return "";
    ri = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var U = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(U.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(U, []);
                } catch (R) {
                  var z = R;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (R) {
                  z = R;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (R) {
                z = R;
              }
              (U = t()) && typeof U.catch == "function" && U.catch(function () {});
            }
          } catch (R) {
            if (R && z && typeof R.stack == "string") return [R.stack, z.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
      var n = a.DetermineComponentFrameRoot(),
        i = n[0],
        r = n[1];
      if (i && r) {
        var m = i.split(`
`),
          T = r.split(`
`);
        for (u = a = 0; a < m.length && !m[a].includes("DetermineComponentFrameRoot"); ) a++;
        for (; u < T.length && !T[u].includes("DetermineComponentFrameRoot"); ) u++;
        if (a === m.length || u === T.length)
          for (a = m.length - 1, u = T.length - 1; 1 <= a && 0 <= u && m[a] !== T[u]; ) u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (m[a] !== T[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || m[a] !== T[u])) {
                  var _ =
                    `
` + m[a].replace(" at new ", " at ");
                  return (
                    t.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", t.displayName)),
                    _
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((ri = !1), (Error.prepareStackTrace = l));
    }
    return (l = t ? t.displayName || t.name : "") ? Dl(l) : "";
  }
  function Hm(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Dl(t.type);
      case 16:
        return Dl("Lazy");
      case 13:
        return t.child !== e && e !== null ? Dl("Suspense Fallback") : Dl("Suspense");
      case 19:
        return Dl("SuspenseList");
      case 0:
      case 15:
        return oi(t.type, !1);
      case 11:
        return oi(t.type.render, !1);
      case 1:
        return oi(t.type, !0);
      case 31:
        return Dl("Activity");
      default:
        return "";
    }
  }
  function kc(t) {
    try {
      var e = "",
        l = null;
      do ((e += Hm(t, l)), (l = t), (t = t.return));
      while (t);
      return e;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var si = Object.prototype.hasOwnProperty,
    di = f.unstable_scheduleCallback,
    mi = f.unstable_cancelCallback,
    Bm = f.unstable_shouldYield,
    qm = f.unstable_requestPaint,
    ue = f.unstable_now,
    jm = f.unstable_getCurrentPriorityLevel,
    Fc = f.unstable_ImmediatePriority,
    Ic = f.unstable_UserBlockingPriority,
    ju = f.unstable_NormalPriority,
    Ym = f.unstable_LowPriority,
    Pc = f.unstable_IdlePriority,
    Lm = f.log,
    Gm = f.unstable_setDisableYieldValue,
    qa = null,
    ne = null;
  function nl(t) {
    if ((typeof Lm == "function" && Gm(t), ne && typeof ne.setStrictMode == "function"))
      try {
        ne.setStrictMode(qa, t);
      } catch {}
  }
  var ie = Math.clz32 ? Math.clz32 : Zm,
    Xm = Math.log,
    Qm = Math.LN2;
  function Zm(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((Xm(t) / Qm) | 0)) | 0);
  }
  var Yu = 256,
    Lu = 262144,
    Gu = 4194304;
  function Cl(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Xu(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      n = t.suspendedLanes,
      i = t.pingedLanes;
    t = t.warmLanes;
    var r = a & 134217727;
    return (
      r !== 0
        ? ((a = r & ~n),
          a !== 0 ? (u = Cl(a)) : ((i &= r), i !== 0 ? (u = Cl(i)) : l || ((l = r & ~t), l !== 0 && (u = Cl(l)))))
        : ((r = a & ~n), r !== 0 ? (u = Cl(r)) : i !== 0 ? (u = Cl(i)) : l || ((l = a & ~t), l !== 0 && (u = Cl(l)))),
      u === 0
        ? 0
        : e !== 0 &&
            e !== u &&
            (e & n) === 0 &&
            ((n = u & -u), (l = e & -e), n >= l || (n === 32 && (l & 4194048) !== 0))
          ? e
          : u
    );
  }
  function ja(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Vm(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function tr() {
    var t = Gu;
    return ((Gu <<= 1), (Gu & 62914560) === 0 && (Gu = 4194304), t);
  }
  function hi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Ya(t, e) {
    ((t.pendingLanes |= e), e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function Km(t, e, l, a, u, n) {
    var i = t.pendingLanes;
    ((t.pendingLanes = l),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= l),
      (t.entangledLanes &= l),
      (t.errorRecoveryDisabledLanes &= l),
      (t.shellSuspendCounter = 0));
    var r = t.entanglements,
      m = t.expirationTimes,
      T = t.hiddenUpdates;
    for (l = i & ~l; 0 < l; ) {
      var _ = 31 - ie(l),
        U = 1 << _;
      ((r[_] = 0), (m[_] = -1));
      var z = T[_];
      if (z !== null)
        for (T[_] = null, _ = 0; _ < z.length; _++) {
          var R = z[_];
          R !== null && (R.lane &= -536870913);
        }
      l &= ~U;
    }
    (a !== 0 && er(t, a, 0), n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(i & ~e)));
  }
  function er(t, e, l) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var a = 31 - ie(e);
    ((t.entangledLanes |= e), (t.entanglements[a] = t.entanglements[a] | 1073741824 | (l & 261930)));
  }
  function lr(t, e) {
    var l = (t.entangledLanes |= e);
    for (t = t.entanglements; l; ) {
      var a = 31 - ie(l),
        u = 1 << a;
      ((u & e) | (t[a] & e) && (t[a] |= e), (l &= ~u));
    }
  }
  function ar(t, e) {
    var l = e & -e;
    return ((l = (l & 42) !== 0 ? 1 : yi(l)), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l);
  }
  function yi(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function vi(t) {
    return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function ur() {
    var t = B.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Vd(t.type));
  }
  function nr(t, e) {
    var l = B.p;
    try {
      return ((B.p = t), e());
    } finally {
      B.p = l;
    }
  }
  var il = Math.random().toString(36).slice(2),
    Xt = "__reactFiber$" + il,
    Ft = "__reactProps$" + il,
    kl = "__reactContainer$" + il,
    gi = "__reactEvents$" + il,
    Jm = "__reactListeners$" + il,
    wm = "__reactHandles$" + il,
    ir = "__reactResources$" + il,
    La = "__reactMarker$" + il;
  function pi(t) {
    (delete t[Xt], delete t[Ft], delete t[gi], delete t[Jm], delete t[wm]);
  }
  function Fl(t) {
    var e = t[Xt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if ((e = l[kl] || l[Xt])) {
        if (((l = e.alternate), e.child !== null || (l !== null && l.child !== null)))
          for (t = Od(t); t !== null; ) {
            if ((l = t[Xt])) return l;
            t = Od(t);
          }
        return e;
      }
      ((t = l), (l = t.parentNode));
    }
    return null;
  }
  function Il(t) {
    if ((t = t[Xt] || t[kl])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function Ga(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(c(33));
  }
  function Pl(t) {
    var e = t[ir];
    return (e || (e = t[ir] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
  }
  function Lt(t) {
    t[La] = !0;
  }
  var fr = new Set(),
    cr = {};
  function Ul(t, e) {
    (ta(t, e), ta(t + "Capture", e));
  }
  function ta(t, e) {
    for (cr[t] = e, t = 0; t < e.length; t++) fr.add(e[t]);
  }
  var $m = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    rr = {},
    or = {};
  function Wm(t) {
    return si.call(or, t) ? !0 : si.call(rr, t) ? !1 : $m.test(t) ? (or[t] = !0) : ((rr[t] = !0), !1);
  }
  function Qu(t, e, l) {
    if (Wm(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + l);
      }
  }
  function Zu(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + l);
    }
  }
  function Le(t, e, l, a) {
    if (a === null) t.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, "" + a);
    }
  }
  function ve(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function sr(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function km(t, e, l) {
    var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var u = a.get,
        n = a.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (i) {
            ((l = "" + i), n.call(this, i));
          },
        }),
        Object.defineProperty(t, e, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (i) {
            l = "" + i;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function Si(t) {
    if (!t._valueTracker) {
      var e = sr(t) ? "checked" : "value";
      t._valueTracker = km(t, e, "" + t[e]);
    }
  }
  function dr(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(),
      a = "";
    return (t && (a = sr(t) ? (t.checked ? "true" : "false") : t.value), (t = a), t !== l ? (e.setValue(t), !0) : !1);
  }
  function Vu(t) {
    if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Fm = /[\n"\\]/g;
  function ge(t) {
    return t.replace(Fm, function (e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function bi(t, e, l, a, u, n, i, r) {
    ((t.name = ""),
      i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean"
        ? (t.type = i)
        : t.removeAttribute("type"),
      e != null
        ? i === "number"
          ? ((e === 0 && t.value === "") || t.value != e) && (t.value = "" + ve(e))
          : t.value !== "" + ve(e) && (t.value = "" + ve(e))
        : (i !== "submit" && i !== "reset") || t.removeAttribute("value"),
      e != null ? Ei(t, i, ve(e)) : l != null ? Ei(t, i, ve(l)) : a != null && t.removeAttribute("value"),
      u == null && n != null && (t.defaultChecked = !!n),
      u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"),
      r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean"
        ? (t.name = "" + ve(r))
        : t.removeAttribute("name"));
  }
  function mr(t, e, l, a, u, n, i, r) {
    if (
      (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (t.type = n),
      e != null || l != null)
    ) {
      if (!((n !== "submit" && n !== "reset") || e != null)) {
        Si(t);
        return;
      }
      ((l = l != null ? "" + ve(l) : ""),
        (e = e != null ? "" + ve(e) : l),
        r || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((a = a ?? u),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (t.checked = r ? t.checked : !!a),
      (t.defaultChecked = !!a),
      i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (t.name = i),
      Si(t));
  }
  function Ei(t, e, l) {
    (e === "number" && Vu(t.ownerDocument) === t) || t.defaultValue === "" + l || (t.defaultValue = "" + l);
  }
  function ea(t, e, l, a) {
    if (((t = t.options), e)) {
      e = {};
      for (var u = 0; u < l.length; u++) e["$" + l[u]] = !0;
      for (l = 0; l < t.length; l++)
        ((u = e.hasOwnProperty("$" + t[l].value)),
          t[l].selected !== u && (t[l].selected = u),
          u && a && (t[l].defaultSelected = !0));
    } else {
      for (l = "" + ve(l), e = null, u = 0; u < t.length; u++) {
        if (t[u].value === l) {
          ((t[u].selected = !0), a && (t[u].defaultSelected = !0));
          return;
        }
        e !== null || t[u].disabled || (e = t[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function hr(t, e, l) {
    if (e != null && ((e = "" + ve(e)), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + ve(l) : "";
  }
  function yr(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(c(92));
        if (Nt(a)) {
          if (1 < a.length) throw Error(c(93));
          a = a[0];
        }
        l = a;
      }
      (l == null && (l = ""), (e = l));
    }
    ((l = ve(e)),
      (t.defaultValue = l),
      (a = t.textContent),
      a === l && a !== "" && a !== null && (t.value = a),
      Si(t));
  }
  function la(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Im = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function vr(t, e, l) {
    var a = e.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === ""
      ? a
        ? t.setProperty(e, "")
        : e === "float"
          ? (t.cssFloat = "")
          : (t[e] = "")
      : a
        ? t.setProperty(e, l)
        : typeof l != "number" || l === 0 || Im.has(e)
          ? e === "float"
            ? (t.cssFloat = l)
            : (t[e] = ("" + l).trim())
          : (t[e] = l + "px");
  }
  function gr(t, e, l) {
    if (e != null && typeof e != "object") throw Error(c(62));
    if (((t = t.style), l != null)) {
      for (var a in l)
        !l.hasOwnProperty(a) ||
          (e != null && e.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? (t.cssFloat = "") : (t[a] = ""));
      for (var u in e) ((a = e[u]), e.hasOwnProperty(u) && l[u] !== a && vr(t, u, a));
    } else for (var n in e) e.hasOwnProperty(n) && vr(t, n, e[n]);
  }
  function Ti(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Pm = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    th =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ku(t) {
    return th.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function Ge() {}
  var zi = null;
  function Ai(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var aa = null,
    ua = null;
  function pr(t) {
    var e = Il(t);
    if (e && (t = e.stateNode)) {
      var l = t[Ft] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case "input":
          if (
            (bi(t, l.value, l.defaultValue, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name),
            (e = l.name),
            l.type === "radio" && e != null)
          ) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll('input[name="' + ge("" + e) + '"][type="radio"]'), e = 0; e < l.length; e++) {
              var a = l[e];
              if (a !== t && a.form === t.form) {
                var u = a[Ft] || null;
                if (!u) throw Error(c(90));
                bi(a, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
              }
            }
            for (e = 0; e < l.length; e++) ((a = l[e]), a.form === t.form && dr(a));
          }
          break t;
        case "textarea":
          hr(t, l.value, l.defaultValue);
          break t;
        case "select":
          ((e = l.value), e != null && ea(t, !!l.multiple, e, !1));
      }
    }
  }
  var Ri = !1;
  function Sr(t, e, l) {
    if (Ri) return t(e, l);
    Ri = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (((Ri = !1), (aa !== null || ua !== null) && (Nn(), aa && ((e = aa), (t = ua), (ua = aa = null), pr(e), t))))
        for (e = 0; e < t.length; e++) pr(t[e]);
    }
  }
  function Xa(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[Ft] || null;
    if (a === null) return null;
    l = a[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((a = !a.disabled) ||
          ((t = t.type), (a = !(t === "button" || t === "input" || t === "select" || t === "textarea"))),
          (t = !a));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != "function") throw Error(c(231, e, typeof l));
    return l;
  }
  var Xe = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    _i = !1;
  if (Xe)
    try {
      var Qa = {};
      (Object.defineProperty(Qa, "passive", {
        get: function () {
          _i = !0;
        },
      }),
        window.addEventListener("test", Qa, Qa),
        window.removeEventListener("test", Qa, Qa));
    } catch {
      _i = !1;
    }
  var fl = null,
    Mi = null,
    Ju = null;
  function br() {
    if (Ju) return Ju;
    var t,
      e = Mi,
      l = e.length,
      a,
      u = "value" in fl ? fl.value : fl.textContent,
      n = u.length;
    for (t = 0; t < l && e[t] === u[t]; t++);
    var i = l - t;
    for (a = 1; a <= i && e[l - a] === u[n - a]; a++);
    return (Ju = u.slice(t, 1 < a ? 1 - a : void 0));
  }
  function wu(t) {
    var e = t.keyCode;
    return (
      "charCode" in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function $u() {
    return !0;
  }
  function Er() {
    return !1;
  }
  function It(t) {
    function e(l, a, u, n, i) {
      ((this._reactName = l),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = i),
        (this.currentTarget = null));
      for (var r in t) t.hasOwnProperty(r) && ((l = t[r]), (this[r] = l ? l(n) : n[r]));
      return (
        (this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? $u : Er),
        (this.isPropagationStopped = Er),
        this
      );
    }
    return (
      A(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1),
            (this.isDefaultPrevented = $u));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0),
            (this.isPropagationStopped = $u));
        },
        persist: function () {},
        isPersistent: $u,
      }),
      e
    );
  }
  var Nl = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Wu = It(Nl),
    Za = A({}, Nl, { view: 0, detail: 0 }),
    eh = It(Za),
    Oi,
    xi,
    Va,
    ku = A({}, Za, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ci,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== Va &&
              (Va && t.type === "mousemove"
                ? ((Oi = t.screenX - Va.screenX), (xi = t.screenY - Va.screenY))
                : (xi = Oi = 0),
              (Va = t)),
            Oi);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : xi;
      },
    }),
    Tr = It(ku),
    lh = A({}, ku, { dataTransfer: 0 }),
    ah = It(lh),
    uh = A({}, Za, { relatedTarget: 0 }),
    Di = It(uh),
    nh = A({}, Nl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    ih = It(nh),
    fh = A({}, Nl, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    ch = It(fh),
    rh = A({}, Nl, { data: 0 }),
    zr = It(rh),
    oh = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    sh = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    dh = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function mh(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = dh[t]) ? !!e[t] : !1;
  }
  function Ci() {
    return mh;
  }
  var hh = A({}, Za, {
      key: function (t) {
        if (t.key) {
          var e = oh[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress"
          ? ((t = wu(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
            ? sh[t.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ci,
      charCode: function (t) {
        return t.type === "keypress" ? wu(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress" ? wu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
    }),
    yh = It(hh),
    vh = A({}, ku, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Ar = It(vh),
    gh = A({}, Za, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ci,
    }),
    ph = It(gh),
    Sh = A({}, Nl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    bh = It(Sh),
    Eh = A({}, ku, {
      deltaX: function (t) {
        return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Th = It(Eh),
    zh = A({}, Nl, { newState: 0, oldState: 0 }),
    Ah = It(zh),
    Rh = [9, 13, 27, 32],
    Ui = Xe && "CompositionEvent" in window,
    Ka = null;
  Xe && "documentMode" in document && (Ka = document.documentMode);
  var _h = Xe && "TextEvent" in window && !Ka,
    Rr = Xe && (!Ui || (Ka && 8 < Ka && 11 >= Ka)),
    _r = " ",
    Mr = !1;
  function Or(t, e) {
    switch (t) {
      case "keyup":
        return Rh.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function xr(t) {
    return ((t = t.detail), typeof t == "object" && "data" in t ? t.data : null);
  }
  var na = !1;
  function Mh(t, e) {
    switch (t) {
      case "compositionend":
        return xr(e);
      case "keypress":
        return e.which !== 32 ? null : ((Mr = !0), _r);
      case "textInput":
        return ((t = e.data), t === _r && Mr ? null : t);
      default:
        return null;
    }
  }
  function Oh(t, e) {
    if (na)
      return t === "compositionend" || (!Ui && Or(t, e)) ? ((t = br()), (Ju = Mi = fl = null), (na = !1), t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return Rr && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var xh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Dr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!xh[t.type] : e === "textarea";
  }
  function Cr(t, e, l, a) {
    (aa ? (ua ? ua.push(a) : (ua = [a])) : (aa = a),
      (e = Gn(e, "onChange")),
      0 < e.length && ((l = new Wu("onChange", "change", null, l, a)), t.push({ event: l, listeners: e })));
  }
  var Ja = null,
    wa = null;
  function Dh(t) {
    hd(t, 0);
  }
  function Fu(t) {
    var e = Ga(t);
    if (dr(e)) return t;
  }
  function Ur(t, e) {
    if (t === "change") return e;
  }
  var Nr = !1;
  if (Xe) {
    var Ni;
    if (Xe) {
      var Hi = "oninput" in document;
      if (!Hi) {
        var Hr = document.createElement("div");
        (Hr.setAttribute("oninput", "return;"), (Hi = typeof Hr.oninput == "function"));
      }
      Ni = Hi;
    } else Ni = !1;
    Nr = Ni && (!document.documentMode || 9 < document.documentMode);
  }
  function Br() {
    Ja && (Ja.detachEvent("onpropertychange", qr), (wa = Ja = null));
  }
  function qr(t) {
    if (t.propertyName === "value" && Fu(wa)) {
      var e = [];
      (Cr(e, wa, t, Ai(t)), Sr(Dh, e));
    }
  }
  function Ch(t, e, l) {
    t === "focusin" ? (Br(), (Ja = e), (wa = l), Ja.attachEvent("onpropertychange", qr)) : t === "focusout" && Br();
  }
  function Uh(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown") return Fu(wa);
  }
  function Nh(t, e) {
    if (t === "click") return Fu(e);
  }
  function Hh(t, e) {
    if (t === "input" || t === "change") return Fu(e);
  }
  function Bh(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var fe = typeof Object.is == "function" ? Object.is : Bh;
  function $a(t, e) {
    if (fe(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
    var l = Object.keys(t),
      a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var u = l[a];
      if (!si.call(e, u) || !fe(t[u], e[u])) return !1;
    }
    return !0;
  }
  function jr(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Yr(t, e) {
    var l = jr(t);
    t = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (((a = t + l.textContent.length), t <= e && a >= e)) return { node: l, offset: e - t };
        t = a;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = jr(l);
    }
  }
  function Lr(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? Lr(t, e.parentNode)
            : "contains" in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function Gr(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = Vu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Vu(t.document);
    }
    return e;
  }
  function Bi(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === "input" &&
        (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password")) ||
        e === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var qh = Xe && "documentMode" in document && 11 >= document.documentMode,
    ia = null,
    qi = null,
    Wa = null,
    ji = !1;
  function Xr(t, e, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    ji ||
      ia == null ||
      ia !== Vu(a) ||
      ((a = ia),
      "selectionStart" in a && Bi(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Wa && $a(Wa, a)) ||
        ((Wa = a),
        (a = Gn(qi, "onSelect")),
        0 < a.length &&
          ((e = new Wu("onSelect", "select", null, e, l)), t.push({ event: e, listeners: a }), (e.target = ia))));
  }
  function Hl(t, e) {
    var l = {};
    return ((l[t.toLowerCase()] = e.toLowerCase()), (l["Webkit" + t] = "webkit" + e), (l["Moz" + t] = "moz" + e), l);
  }
  var fa = {
      animationend: Hl("Animation", "AnimationEnd"),
      animationiteration: Hl("Animation", "AnimationIteration"),
      animationstart: Hl("Animation", "AnimationStart"),
      transitionrun: Hl("Transition", "TransitionRun"),
      transitionstart: Hl("Transition", "TransitionStart"),
      transitioncancel: Hl("Transition", "TransitionCancel"),
      transitionend: Hl("Transition", "TransitionEnd"),
    },
    Yi = {},
    Qr = {};
  Xe &&
    ((Qr = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete fa.animationend.animation, delete fa.animationiteration.animation, delete fa.animationstart.animation),
    "TransitionEvent" in window || delete fa.transitionend.transition);
  function Bl(t) {
    if (Yi[t]) return Yi[t];
    if (!fa[t]) return t;
    var e = fa[t],
      l;
    for (l in e) if (e.hasOwnProperty(l) && l in Qr) return (Yi[t] = e[l]);
    return t;
  }
  var Zr = Bl("animationend"),
    Vr = Bl("animationiteration"),
    Kr = Bl("animationstart"),
    jh = Bl("transitionrun"),
    Yh = Bl("transitionstart"),
    Lh = Bl("transitioncancel"),
    Jr = Bl("transitionend"),
    wr = new Map(),
    Li =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  Li.push("scrollEnd");
  function Me(t, e) {
    (wr.set(t, e), Ul(e, [t]));
  }
  var Iu =
      typeof reportError == "function"
        ? reportError
        : function (t) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var e = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
                error: t,
              });
              if (!window.dispatchEvent(e)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", t);
              return;
            }
            console.error(t);
          },
    pe = [],
    ca = 0,
    Gi = 0;
  function Pu() {
    for (var t = ca, e = (Gi = ca = 0); e < t; ) {
      var l = pe[e];
      pe[e++] = null;
      var a = pe[e];
      pe[e++] = null;
      var u = pe[e];
      pe[e++] = null;
      var n = pe[e];
      if (((pe[e++] = null), a !== null && u !== null)) {
        var i = a.pending;
        (i === null ? (u.next = u) : ((u.next = i.next), (i.next = u)), (a.pending = u));
      }
      n !== 0 && $r(l, u, n);
    }
  }
  function tn(t, e, l, a) {
    ((pe[ca++] = t),
      (pe[ca++] = e),
      (pe[ca++] = l),
      (pe[ca++] = a),
      (Gi |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a));
  }
  function Xi(t, e, l, a) {
    return (tn(t, e, l, a), en(t));
  }
  function ql(t, e) {
    return (tn(t, null, null, e), en(t));
  }
  function $r(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var u = !1, n = t.return; n !== null; )
      ((n.childLanes |= l),
        (a = n.alternate),
        a !== null && (a.childLanes |= l),
        n.tag === 22 && ((t = n.stateNode), t === null || t._visibility & 1 || (u = !0)),
        (t = n),
        (n = n.return));
    return t.tag === 3
      ? ((n = t.stateNode),
        u &&
          e !== null &&
          ((u = 31 - ie(l)),
          (t = n.hiddenUpdates),
          (a = t[u]),
          a === null ? (t[u] = [e]) : a.push(e),
          (e.lane = l | 536870912)),
        n)
      : null;
  }
  function en(t) {
    if (50 < gu) throw ((gu = 0), (Ff = null), Error(c(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var ra = {};
  function Gh(t, e, l, a) {
    ((this.tag = t),
      (this.key = l),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ce(t, e, l, a) {
    return new Gh(t, e, l, a);
  }
  function Qi(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Qe(t, e) {
    var l = t.alternate;
    return (
      l === null
        ? ((l = ce(t.tag, e, t.key, t.mode)),
          (l.elementType = t.elementType),
          (l.type = t.type),
          (l.stateNode = t.stateNode),
          (l.alternate = t),
          (t.alternate = l))
        : ((l.pendingProps = e), (l.type = t.type), (l.flags = 0), (l.subtreeFlags = 0), (l.deletions = null)),
      (l.flags = t.flags & 65011712),
      (l.childLanes = t.childLanes),
      (l.lanes = t.lanes),
      (l.child = t.child),
      (l.memoizedProps = t.memoizedProps),
      (l.memoizedState = t.memoizedState),
      (l.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (l.sibling = t.sibling),
      (l.index = t.index),
      (l.ref = t.ref),
      (l.refCleanup = t.refCleanup),
      l
    );
  }
  function Wr(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return (
      l === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = l.childLanes),
          (t.lanes = l.lanes),
          (t.child = l.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = l.memoizedProps),
          (t.memoizedState = l.memoizedState),
          (t.updateQueue = l.updateQueue),
          (t.type = l.type),
          (e = l.dependencies),
          (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function ln(t, e, l, a, u, n) {
    var i = 0;
    if (((a = t), typeof t == "function")) Qi(t) && (i = 1);
    else if (typeof t == "string")
      i = Ky(t, l, X.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case Jt:
          return ((t = ce(31, l, e, u)), (t.elementType = Jt), (t.lanes = n), t);
        case G:
          return jl(l.children, u, n, e);
        case L:
          ((i = 8), (u |= 24));
          break;
        case q:
          return ((t = ce(12, l, e, u | 2)), (t.elementType = q), (t.lanes = n), t);
        case dt:
          return ((t = ce(13, l, e, u)), (t.elementType = dt), (t.lanes = n), t);
        case Tt:
          return ((t = ce(19, l, e, u)), (t.elementType = Tt), (t.lanes = n), t);
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case w:
                i = 10;
                break t;
              case k:
                i = 9;
                break t;
              case yt:
                i = 11;
                break t;
              case F:
                i = 14;
                break t;
              case xt:
                ((i = 16), (a = null));
                break t;
            }
          ((i = 29), (l = Error(c(130, t === null ? "null" : typeof t, ""))), (a = null));
      }
    return ((e = ce(i, l, e, u)), (e.elementType = t), (e.type = a), (e.lanes = n), e);
  }
  function jl(t, e, l, a) {
    return ((t = ce(7, t, a, e)), (t.lanes = l), t);
  }
  function Zi(t, e, l) {
    return ((t = ce(6, t, null, e)), (t.lanes = l), t);
  }
  function kr(t) {
    var e = ce(18, null, null, 0);
    return ((e.stateNode = t), e);
  }
  function Vi(t, e, l) {
    return (
      (e = ce(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = l),
      (e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }),
      e
    );
  }
  var Fr = new WeakMap();
  function Se(t, e) {
    if (typeof t == "object" && t !== null) {
      var l = Fr.get(t);
      return l !== void 0 ? l : ((e = { value: t, source: e, stack: kc(e) }), Fr.set(t, e), e);
    }
    return { value: t, source: e, stack: kc(e) };
  }
  var oa = [],
    sa = 0,
    an = null,
    ka = 0,
    be = [],
    Ee = 0,
    cl = null,
    He = 1,
    Be = "";
  function Ze(t, e) {
    ((oa[sa++] = ka), (oa[sa++] = an), (an = t), (ka = e));
  }
  function Ir(t, e, l) {
    ((be[Ee++] = He), (be[Ee++] = Be), (be[Ee++] = cl), (cl = t));
    var a = He;
    t = Be;
    var u = 32 - ie(a) - 1;
    ((a &= ~(1 << u)), (l += 1));
    var n = 32 - ie(e) + u;
    if (30 < n) {
      var i = u - (u % 5);
      ((n = (a & ((1 << i) - 1)).toString(32)),
        (a >>= i),
        (u -= i),
        (He = (1 << (32 - ie(e) + u)) | (l << u) | a),
        (Be = n + t));
    } else ((He = (1 << n) | (l << u) | a), (Be = t));
  }
  function Ki(t) {
    t.return !== null && (Ze(t, 1), Ir(t, 1, 0));
  }
  function Ji(t) {
    for (; t === an; ) ((an = oa[--sa]), (oa[sa] = null), (ka = oa[--sa]), (oa[sa] = null));
    for (; t === cl; )
      ((cl = be[--Ee]), (be[Ee] = null), (Be = be[--Ee]), (be[Ee] = null), (He = be[--Ee]), (be[Ee] = null));
  }
  function Pr(t, e) {
    ((be[Ee++] = He), (be[Ee++] = Be), (be[Ee++] = cl), (He = e.id), (Be = e.overflow), (cl = t));
  }
  var Qt = null,
    zt = null,
    ft = !1,
    rl = null,
    Te = !1,
    wi = Error(c(519));
  function ol(t) {
    var e = Error(c(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw (Fa(Se(e, t)), wi);
  }
  function to(t) {
    var e = t.stateNode,
      l = t.type,
      a = t.memoizedProps;
    switch (((e[Xt] = t), (e[Ft] = a), l)) {
      case "dialog":
        (ut("cancel", e), ut("close", e));
        break;
      case "iframe":
      case "object":
      case "embed":
        ut("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Su.length; l++) ut(Su[l], e);
        break;
      case "source":
        ut("error", e);
        break;
      case "img":
      case "image":
      case "link":
        (ut("error", e), ut("load", e));
        break;
      case "details":
        ut("toggle", e);
        break;
      case "input":
        (ut("invalid", e), mr(e, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case "select":
        ut("invalid", e);
        break;
      case "textarea":
        (ut("invalid", e), yr(e, a.value, a.defaultValue, a.children));
    }
    ((l = a.children),
      (typeof l != "string" && typeof l != "number" && typeof l != "bigint") ||
      e.textContent === "" + l ||
      a.suppressHydrationWarning === !0 ||
      pd(e.textContent, l)
        ? (a.popover != null && (ut("beforetoggle", e), ut("toggle", e)),
          a.onScroll != null && ut("scroll", e),
          a.onScrollEnd != null && ut("scrollend", e),
          a.onClick != null && (e.onclick = Ge),
          (e = !0))
        : (e = !1),
      e || ol(t, !0));
  }
  function eo(t) {
    for (Qt = t.return; Qt; )
      switch (Qt.tag) {
        case 5:
        case 31:
        case 13:
          Te = !1;
          return;
        case 27:
        case 3:
          Te = !0;
          return;
        default:
          Qt = Qt.return;
      }
  }
  function da(t) {
    if (t !== Qt) return !1;
    if (!ft) return (eo(t), (ft = !0), !1);
    var e = t.tag,
      l;
    if (
      ((l = e !== 3 && e !== 27) &&
        ((l = e === 5) && ((l = t.type), (l = !(l !== "form" && l !== "button") || dc(t.type, t.memoizedProps))),
        (l = !l)),
      l && zt && ol(t),
      eo(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(c(317));
      zt = Md(t);
    } else if (e === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(c(317));
      zt = Md(t);
    } else
      e === 27
        ? ((e = zt), Al(t.type) ? ((t = gc), (gc = null), (zt = t)) : (zt = e))
        : (zt = Qt ? Ae(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Yl() {
    ((zt = Qt = null), (ft = !1));
  }
  function $i() {
    var t = rl;
    return (t !== null && (le === null ? (le = t) : le.push.apply(le, t), (rl = null)), t);
  }
  function Fa(t) {
    rl === null ? (rl = [t]) : rl.push(t);
  }
  var Wi = g(null),
    Ll = null,
    Ve = null;
  function sl(t, e, l) {
    (j(Wi, e._currentValue), (e._currentValue = l));
  }
  function Ke(t) {
    ((t._currentValue = Wi.current), N(Wi));
  }
  function ki(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
          : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
        t === l)
      )
        break;
      t = t.return;
    }
  }
  function Fi(t, e, l, a) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        t: for (; n !== null; ) {
          var r = n;
          n = u;
          for (var m = 0; m < e.length; m++)
            if (r.context === e[m]) {
              ((n.lanes |= l), (r = n.alternate), r !== null && (r.lanes |= l), ki(n.return, l, t), a || (i = null));
              break t;
            }
          n = r.next;
        }
      } else if (u.tag === 18) {
        if (((i = u.return), i === null)) throw Error(c(341));
        ((i.lanes |= l), (n = i.alternate), n !== null && (n.lanes |= l), ki(i, l, t), (i = null));
      } else i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === t) {
            i = null;
            break;
          }
          if (((u = i.sibling), u !== null)) {
            ((u.return = i.return), (i = u));
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function ma(t, e, l, a) {
    t = null;
    for (var u = e, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(c(387));
        if (((i = i.memoizedProps), i !== null)) {
          var r = u.type;
          fe(u.pendingProps.value, i.value) || (t !== null ? t.push(r) : (t = [r]));
        }
      } else if (u === st.current) {
        if (((i = u.alternate), i === null)) throw Error(c(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(Au) : (t = [Au]));
      }
      u = u.return;
    }
    (t !== null && Fi(e, t, l, a), (e.flags |= 262144));
  }
  function un(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!fe(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Gl(t) {
    ((Ll = t), (Ve = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Zt(t) {
    return lo(Ll, t);
  }
  function nn(t, e) {
    return (Ll === null && Gl(t), lo(t, e));
  }
  function lo(t, e) {
    var l = e._currentValue;
    if (((e = { context: e, memoizedValue: l, next: null }), Ve === null)) {
      if (t === null) throw Error(c(308));
      ((Ve = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
    } else Ve = Ve.next = e;
    return l;
  }
  var Xh =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (l, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (l) {
                  return l();
                }));
            };
          },
    Qh = f.unstable_scheduleCallback,
    Zh = f.unstable_NormalPriority,
    Ht = { $$typeof: w, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
  function Ii() {
    return { controller: new Xh(), data: new Map(), refCount: 0 };
  }
  function Ia(t) {
    (t.refCount--,
      t.refCount === 0 &&
        Qh(Zh, function () {
          t.controller.abort();
        }));
  }
  var Pa = null,
    Pi = 0,
    ha = 0,
    ya = null;
  function Vh(t, e) {
    if (Pa === null) {
      var l = (Pa = []);
      ((Pi = 0),
        (ha = ac()),
        (ya = {
          status: "pending",
          value: void 0,
          then: function (a) {
            l.push(a);
          },
        }));
    }
    return (Pi++, e.then(ao, ao), e);
  }
  function ao() {
    if (--Pi === 0 && Pa !== null) {
      ya !== null && (ya.status = "fulfilled");
      var t = Pa;
      ((Pa = null), (ha = 0), (ya = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Kh(t, e) {
    var l = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (u) {
          l.push(u);
        },
      };
    return (
      t.then(
        function () {
          ((a.status = "fulfilled"), (a.value = e));
          for (var u = 0; u < l.length; u++) (0, l[u])(e);
        },
        function (u) {
          for (a.status = "rejected", a.reason = u, u = 0; u < l.length; u++) (0, l[u])(void 0);
        },
      ),
      a
    );
  }
  var uo = x.S;
  x.S = function (t, e) {
    ((Qs = ue()),
      typeof e == "object" && e !== null && typeof e.then == "function" && Vh(t, e),
      uo !== null && uo(t, e));
  };
  var Xl = g(null);
  function tf() {
    var t = Xl.current;
    return t !== null ? t : Et.pooledCache;
  }
  function fn(t, e) {
    e === null ? j(Xl, Xl.current) : j(Xl, e.pool);
  }
  function no() {
    var t = tf();
    return t === null ? null : { parent: Ht._currentValue, pool: t };
  }
  var va = Error(c(460)),
    ef = Error(c(474)),
    cn = Error(c(542)),
    rn = { then: function () {} };
  function io(t) {
    return ((t = t.status), t === "fulfilled" || t === "rejected");
  }
  function fo(t, e, l) {
    switch (((l = t[l]), l === void 0 ? t.push(e) : l !== e && (e.then(Ge, Ge), (e = l)), e.status)) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw ((t = e.reason), ro(t), t);
      default:
        if (typeof e.status == "string") e.then(Ge, Ge);
        else {
          if (((t = Et), t !== null && 100 < t.shellSuspendCounter)) throw Error(c(482));
          ((t = e),
            (t.status = "pending"),
            t.then(
              function (a) {
                if (e.status === "pending") {
                  var u = e;
                  ((u.status = "fulfilled"), (u.value = a));
                }
              },
              function (a) {
                if (e.status === "pending") {
                  var u = e;
                  ((u.status = "rejected"), (u.reason = a));
                }
              },
            ));
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw ((t = e.reason), ro(t), t);
        }
        throw ((Zl = e), va);
    }
  }
  function Ql(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? ((Zl = l), va) : l;
    }
  }
  var Zl = null;
  function co() {
    if (Zl === null) throw Error(c(459));
    var t = Zl;
    return ((Zl = null), t);
  }
  function ro(t) {
    if (t === va || t === cn) throw Error(c(483));
  }
  var ga = null,
    tu = 0;
  function on(t) {
    var e = tu;
    return ((tu += 1), ga === null && (ga = []), fo(ga, t, e));
  }
  function eu(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function sn(t, e) {
    throw e.$$typeof === H
      ? Error(c(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(c(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)));
  }
  function oo(t) {
    function e(p, y) {
      if (t) {
        var E = p.deletions;
        E === null ? ((p.deletions = [y]), (p.flags |= 16)) : E.push(y);
      }
    }
    function l(p, y) {
      if (!t) return null;
      for (; y !== null; ) (e(p, y), (y = y.sibling));
      return null;
    }
    function a(p) {
      for (var y = new Map(); p !== null; ) (p.key !== null ? y.set(p.key, p) : y.set(p.index, p), (p = p.sibling));
      return y;
    }
    function u(p, y) {
      return ((p = Qe(p, y)), (p.index = 0), (p.sibling = null), p);
    }
    function n(p, y, E) {
      return (
        (p.index = E),
        t
          ? ((E = p.alternate),
            E !== null ? ((E = E.index), E < y ? ((p.flags |= 67108866), y) : E) : ((p.flags |= 67108866), y))
          : ((p.flags |= 1048576), y)
      );
    }
    function i(p) {
      return (t && p.alternate === null && (p.flags |= 67108866), p);
    }
    function r(p, y, E, C) {
      return y === null || y.tag !== 6
        ? ((y = Zi(E, p.mode, C)), (y.return = p), y)
        : ((y = u(y, E)), (y.return = p), y);
    }
    function m(p, y, E, C) {
      var Z = E.type;
      return Z === G
        ? _(p, y, E.props.children, C, E.key)
        : y !== null &&
            (y.elementType === Z || (typeof Z == "object" && Z !== null && Z.$$typeof === xt && Ql(Z) === y.type))
          ? ((y = u(y, E.props)), eu(y, E), (y.return = p), y)
          : ((y = ln(E.type, E.key, E.props, null, p.mode, C)), eu(y, E), (y.return = p), y);
    }
    function T(p, y, E, C) {
      return y === null ||
        y.tag !== 4 ||
        y.stateNode.containerInfo !== E.containerInfo ||
        y.stateNode.implementation !== E.implementation
        ? ((y = Vi(E, p.mode, C)), (y.return = p), y)
        : ((y = u(y, E.children || [])), (y.return = p), y);
    }
    function _(p, y, E, C, Z) {
      return y === null || y.tag !== 7
        ? ((y = jl(E, p.mode, C, Z)), (y.return = p), y)
        : ((y = u(y, E)), (y.return = p), y);
    }
    function U(p, y, E) {
      if ((typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint")
        return ((y = Zi("" + y, p.mode, E)), (y.return = p), y);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case K:
            return ((E = ln(y.type, y.key, y.props, null, p.mode, E)), eu(E, y), (E.return = p), E);
          case V:
            return ((y = Vi(y, p.mode, E)), (y.return = p), y);
          case xt:
            return ((y = Ql(y)), U(p, y, E));
        }
        if (Nt(y) || wt(y)) return ((y = jl(y, p.mode, E, null)), (y.return = p), y);
        if (typeof y.then == "function") return U(p, on(y), E);
        if (y.$$typeof === w) return U(p, nn(p, y), E);
        sn(p, y);
      }
      return null;
    }
    function z(p, y, E, C) {
      var Z = y !== null ? y.key : null;
      if ((typeof E == "string" && E !== "") || typeof E == "number" || typeof E == "bigint")
        return Z !== null ? null : r(p, y, "" + E, C);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case K:
            return E.key === Z ? m(p, y, E, C) : null;
          case V:
            return E.key === Z ? T(p, y, E, C) : null;
          case xt:
            return ((E = Ql(E)), z(p, y, E, C));
        }
        if (Nt(E) || wt(E)) return Z !== null ? null : _(p, y, E, C, null);
        if (typeof E.then == "function") return z(p, y, on(E), C);
        if (E.$$typeof === w) return z(p, y, nn(p, E), C);
        sn(p, E);
      }
      return null;
    }
    function R(p, y, E, C, Z) {
      if ((typeof C == "string" && C !== "") || typeof C == "number" || typeof C == "bigint")
        return ((p = p.get(E) || null), r(y, p, "" + C, Z));
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case K:
            return ((p = p.get(C.key === null ? E : C.key) || null), m(y, p, C, Z));
          case V:
            return ((p = p.get(C.key === null ? E : C.key) || null), T(y, p, C, Z));
          case xt:
            return ((C = Ql(C)), R(p, y, E, C, Z));
        }
        if (Nt(C) || wt(C)) return ((p = p.get(E) || null), _(y, p, C, Z, null));
        if (typeof C.then == "function") return R(p, y, E, on(C), Z);
        if (C.$$typeof === w) return R(p, y, E, nn(y, C), Z);
        sn(y, C);
      }
      return null;
    }
    function Y(p, y, E, C) {
      for (var Z = null, ct = null, Q = y, et = (y = 0), it = null; Q !== null && et < E.length; et++) {
        Q.index > et ? ((it = Q), (Q = null)) : (it = Q.sibling);
        var rt = z(p, Q, E[et], C);
        if (rt === null) {
          Q === null && (Q = it);
          break;
        }
        (t && Q && rt.alternate === null && e(p, Q),
          (y = n(rt, y, et)),
          ct === null ? (Z = rt) : (ct.sibling = rt),
          (ct = rt),
          (Q = it));
      }
      if (et === E.length) return (l(p, Q), ft && Ze(p, et), Z);
      if (Q === null) {
        for (; et < E.length; et++)
          ((Q = U(p, E[et], C)),
            Q !== null && ((y = n(Q, y, et)), ct === null ? (Z = Q) : (ct.sibling = Q), (ct = Q)));
        return (ft && Ze(p, et), Z);
      }
      for (Q = a(Q); et < E.length; et++)
        ((it = R(Q, p, et, E[et], C)),
          it !== null &&
            (t && it.alternate !== null && Q.delete(it.key === null ? et : it.key),
            (y = n(it, y, et)),
            ct === null ? (Z = it) : (ct.sibling = it),
            (ct = it)));
      return (
        t &&
          Q.forEach(function (xl) {
            return e(p, xl);
          }),
        ft && Ze(p, et),
        Z
      );
    }
    function J(p, y, E, C) {
      if (E == null) throw Error(c(151));
      for (
        var Z = null, ct = null, Q = y, et = (y = 0), it = null, rt = E.next();
        Q !== null && !rt.done;
        et++, rt = E.next()
      ) {
        Q.index > et ? ((it = Q), (Q = null)) : (it = Q.sibling);
        var xl = z(p, Q, rt.value, C);
        if (xl === null) {
          Q === null && (Q = it);
          break;
        }
        (t && Q && xl.alternate === null && e(p, Q),
          (y = n(xl, y, et)),
          ct === null ? (Z = xl) : (ct.sibling = xl),
          (ct = xl),
          (Q = it));
      }
      if (rt.done) return (l(p, Q), ft && Ze(p, et), Z);
      if (Q === null) {
        for (; !rt.done; et++, rt = E.next())
          ((rt = U(p, rt.value, C)),
            rt !== null && ((y = n(rt, y, et)), ct === null ? (Z = rt) : (ct.sibling = rt), (ct = rt)));
        return (ft && Ze(p, et), Z);
      }
      for (Q = a(Q); !rt.done; et++, rt = E.next())
        ((rt = R(Q, p, et, rt.value, C)),
          rt !== null &&
            (t && rt.alternate !== null && Q.delete(rt.key === null ? et : rt.key),
            (y = n(rt, y, et)),
            ct === null ? (Z = rt) : (ct.sibling = rt),
            (ct = rt)));
      return (
        t &&
          Q.forEach(function (l0) {
            return e(p, l0);
          }),
        ft && Ze(p, et),
        Z
      );
    }
    function St(p, y, E, C) {
      if (
        (typeof E == "object" && E !== null && E.type === G && E.key === null && (E = E.props.children),
        typeof E == "object" && E !== null)
      ) {
        switch (E.$$typeof) {
          case K:
            t: {
              for (var Z = E.key; y !== null; ) {
                if (y.key === Z) {
                  if (((Z = E.type), Z === G)) {
                    if (y.tag === 7) {
                      (l(p, y.sibling), (C = u(y, E.props.children)), (C.return = p), (p = C));
                      break t;
                    }
                  } else if (
                    y.elementType === Z ||
                    (typeof Z == "object" && Z !== null && Z.$$typeof === xt && Ql(Z) === y.type)
                  ) {
                    (l(p, y.sibling), (C = u(y, E.props)), eu(C, E), (C.return = p), (p = C));
                    break t;
                  }
                  l(p, y);
                  break;
                } else e(p, y);
                y = y.sibling;
              }
              E.type === G
                ? ((C = jl(E.props.children, p.mode, C, E.key)), (C.return = p), (p = C))
                : ((C = ln(E.type, E.key, E.props, null, p.mode, C)), eu(C, E), (C.return = p), (p = C));
            }
            return i(p);
          case V:
            t: {
              for (Z = E.key; y !== null; ) {
                if (y.key === Z)
                  if (
                    y.tag === 4 &&
                    y.stateNode.containerInfo === E.containerInfo &&
                    y.stateNode.implementation === E.implementation
                  ) {
                    (l(p, y.sibling), (C = u(y, E.children || [])), (C.return = p), (p = C));
                    break t;
                  } else {
                    l(p, y);
                    break;
                  }
                else e(p, y);
                y = y.sibling;
              }
              ((C = Vi(E, p.mode, C)), (C.return = p), (p = C));
            }
            return i(p);
          case xt:
            return ((E = Ql(E)), St(p, y, E, C));
        }
        if (Nt(E)) return Y(p, y, E, C);
        if (wt(E)) {
          if (((Z = wt(E)), typeof Z != "function")) throw Error(c(150));
          return ((E = Z.call(E)), J(p, y, E, C));
        }
        if (typeof E.then == "function") return St(p, y, on(E), C);
        if (E.$$typeof === w) return St(p, y, nn(p, E), C);
        sn(p, E);
      }
      return (typeof E == "string" && E !== "") || typeof E == "number" || typeof E == "bigint"
        ? ((E = "" + E),
          y !== null && y.tag === 6
            ? (l(p, y.sibling), (C = u(y, E)), (C.return = p), (p = C))
            : (l(p, y), (C = Zi(E, p.mode, C)), (C.return = p), (p = C)),
          i(p))
        : l(p, y);
    }
    return function (p, y, E, C) {
      try {
        tu = 0;
        var Z = St(p, y, E, C);
        return ((ga = null), Z);
      } catch (Q) {
        if (Q === va || Q === cn) throw Q;
        var ct = ce(29, Q, null, p.mode);
        return ((ct.lanes = C), (ct.return = p), ct);
      } finally {
      }
    };
  }
  var Vl = oo(!0),
    so = oo(!1),
    dl = !1;
  function lf(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function af(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function ml(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function hl(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (ot & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (e.next = e) : ((e.next = u.next), (u.next = e)),
        (a.pending = e),
        (e = en(t)),
        $r(t, null, l),
        e
      );
    }
    return (tn(t, a, e, l), en(t));
  }
  function lu(t, e, l) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), lr(t, l));
    }
  }
  function uf(t, e) {
    var l = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), l === a)) {
      var u = null,
        n = null;
      if (((l = l.firstBaseUpdate), l !== null)) {
        do {
          var i = { lane: l.lane, tag: l.tag, payload: l.payload, callback: null, next: null };
          (n === null ? (u = n = i) : (n = n.next = i), (l = l.next));
        } while (l !== null);
        n === null ? (u = n = e) : (n = n.next = e);
      } else u = n = e;
      ((l = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = l));
      return;
    }
    ((t = l.lastBaseUpdate), t === null ? (l.firstBaseUpdate = e) : (t.next = e), (l.lastBaseUpdate = e));
  }
  var nf = !1;
  function au() {
    if (nf) {
      var t = ya;
      if (t !== null) throw t;
    }
  }
  function uu(t, e, l, a) {
    nf = !1;
    var u = t.updateQueue;
    dl = !1;
    var n = u.firstBaseUpdate,
      i = u.lastBaseUpdate,
      r = u.shared.pending;
    if (r !== null) {
      u.shared.pending = null;
      var m = r,
        T = m.next;
      ((m.next = null), i === null ? (n = T) : (i.next = T), (i = m));
      var _ = t.alternate;
      _ !== null &&
        ((_ = _.updateQueue),
        (r = _.lastBaseUpdate),
        r !== i && (r === null ? (_.firstBaseUpdate = T) : (r.next = T), (_.lastBaseUpdate = m)));
    }
    if (n !== null) {
      var U = u.baseState;
      ((i = 0), (_ = T = m = null), (r = n));
      do {
        var z = r.lane & -536870913,
          R = z !== r.lane;
        if (R ? (nt & z) === z : (a & z) === z) {
          (z !== 0 && z === ha && (nf = !0),
            _ !== null && (_ = _.next = { lane: 0, tag: r.tag, payload: r.payload, callback: null, next: null }));
          t: {
            var Y = t,
              J = r;
            z = e;
            var St = l;
            switch (J.tag) {
              case 1:
                if (((Y = J.payload), typeof Y == "function")) {
                  U = Y.call(St, U, z);
                  break t;
                }
                U = Y;
                break t;
              case 3:
                Y.flags = (Y.flags & -65537) | 128;
              case 0:
                if (((Y = J.payload), (z = typeof Y == "function" ? Y.call(St, U, z) : Y), z == null)) break t;
                U = A({}, U, z);
                break t;
              case 2:
                dl = !0;
            }
          }
          ((z = r.callback),
            z !== null &&
              ((t.flags |= 64),
              R && (t.flags |= 8192),
              (R = u.callbacks),
              R === null ? (u.callbacks = [z]) : R.push(z)));
        } else
          ((R = { lane: z, tag: r.tag, payload: r.payload, callback: r.callback, next: null }),
            _ === null ? ((T = _ = R), (m = U)) : (_ = _.next = R),
            (i |= z));
        if (((r = r.next), r === null)) {
          if (((r = u.shared.pending), r === null)) break;
          ((R = r), (r = R.next), (R.next = null), (u.lastBaseUpdate = R), (u.shared.pending = null));
        }
      } while (!0);
      (_ === null && (m = U),
        (u.baseState = m),
        (u.firstBaseUpdate = T),
        (u.lastBaseUpdate = _),
        n === null && (u.shared.lanes = 0),
        (Sl |= i),
        (t.lanes = i),
        (t.memoizedState = U));
    }
  }
  function mo(t, e) {
    if (typeof t != "function") throw Error(c(191, t));
    t.call(e);
  }
  function ho(t, e) {
    var l = t.callbacks;
    if (l !== null) for (t.callbacks = null, t = 0; t < l.length; t++) mo(l[t], e);
  }
  var pa = g(null),
    dn = g(0);
  function yo(t, e) {
    ((t = tl), j(dn, t), j(pa, e), (tl = t | e.baseLanes));
  }
  function ff() {
    (j(dn, tl), j(pa, pa.current));
  }
  function cf() {
    ((tl = dn.current), N(pa), N(dn));
  }
  var re = g(null),
    ze = null;
  function yl(t) {
    var e = t.alternate;
    (j(Ct, Ct.current & 1),
      j(re, t),
      ze === null && (e === null || pa.current !== null || e.memoizedState !== null) && (ze = t));
  }
  function rf(t) {
    (j(Ct, Ct.current), j(re, t), ze === null && (ze = t));
  }
  function vo(t) {
    t.tag === 22 ? (j(Ct, Ct.current), j(re, t), ze === null && (ze = t)) : vl();
  }
  function vl() {
    (j(Ct, Ct.current), j(re, re.current));
  }
  function oe(t) {
    (N(re), ze === t && (ze = null), N(Ct));
  }
  var Ct = g(0);
  function mn(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && ((l = l.dehydrated), l === null || yc(l) || vc(l))) return e;
      } else if (
        e.tag === 19 &&
        (e.memoizedProps.revealOrder === "forwards" ||
          e.memoizedProps.revealOrder === "backwards" ||
          e.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          e.memoizedProps.revealOrder === "together")
      ) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  var Je = 0,
    tt = null,
    gt = null,
    Bt = null,
    hn = !1,
    Sa = !1,
    Kl = !1,
    yn = 0,
    nu = 0,
    ba = null,
    Jh = 0;
  function Mt() {
    throw Error(c(321));
  }
  function of(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++) if (!fe(t[l], e[l])) return !1;
    return !0;
  }
  function sf(t, e, l, a, u, n) {
    return (
      (Je = n),
      (tt = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (x.H = t === null || t.memoizedState === null ? Po : _f),
      (Kl = !1),
      (n = l(a, u)),
      (Kl = !1),
      Sa && (n = po(e, l, a, u)),
      go(t),
      n
    );
  }
  function go(t) {
    x.H = cu;
    var e = gt !== null && gt.next !== null;
    if (((Je = 0), (Bt = gt = tt = null), (hn = !1), (nu = 0), (ba = null), e)) throw Error(c(300));
    t === null || qt || ((t = t.dependencies), t !== null && un(t) && (qt = !0));
  }
  function po(t, e, l, a) {
    tt = t;
    var u = 0;
    do {
      if ((Sa && (ba = null), (nu = 0), (Sa = !1), 25 <= u)) throw Error(c(301));
      if (((u += 1), (Bt = gt = null), t.updateQueue != null)) {
        var n = t.updateQueue;
        ((n.lastEffect = null), (n.events = null), (n.stores = null), n.memoCache != null && (n.memoCache.index = 0));
      }
      ((x.H = ts), (n = e(l, a)));
    } while (Sa);
    return n;
  }
  function wh() {
    var t = x.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == "function" ? iu(e) : e),
      (t = t.useState()[0]),
      (gt !== null ? gt.memoizedState : null) !== t && (tt.flags |= 1024),
      e
    );
  }
  function df() {
    var t = yn !== 0;
    return ((yn = 0), t);
  }
  function mf(t, e, l) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l));
  }
  function hf(t) {
    if (hn) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      hn = !1;
    }
    ((Je = 0), (Bt = gt = tt = null), (Sa = !1), (nu = yn = 0), (ba = null));
  }
  function kt() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Bt === null ? (tt.memoizedState = Bt = t) : (Bt = Bt.next = t), Bt);
  }
  function Ut() {
    if (gt === null) {
      var t = tt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = gt.next;
    var e = Bt === null ? tt.memoizedState : Bt.next;
    if (e !== null) ((Bt = e), (gt = t));
    else {
      if (t === null) throw tt.alternate === null ? Error(c(467)) : Error(c(310));
      ((gt = t),
        (t = {
          memoizedState: gt.memoizedState,
          baseState: gt.baseState,
          baseQueue: gt.baseQueue,
          queue: gt.queue,
          next: null,
        }),
        Bt === null ? (tt.memoizedState = Bt = t) : (Bt = Bt.next = t));
    }
    return Bt;
  }
  function vn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function iu(t) {
    var e = nu;
    return (
      (nu += 1),
      ba === null && (ba = []),
      (t = fo(ba, t, e)),
      (e = tt),
      (Bt === null ? e.memoizedState : Bt.next) === null &&
        ((e = e.alternate), (x.H = e === null || e.memoizedState === null ? Po : _f)),
      t
    );
  }
  function gn(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return iu(t);
      if (t.$$typeof === w) return Zt(t);
    }
    throw Error(c(438, String(t)));
  }
  function yf(t) {
    var e = null,
      l = tt.updateQueue;
    if ((l !== null && (e = l.memoCache), e == null)) {
      var a = tt.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (e = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      l === null && ((l = vn()), (tt.updateQueue = l)),
      (l.memoCache = e),
      (l = e.data[e.index]),
      l === void 0)
    )
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++) l[a] = Ue;
    return (e.index++, l);
  }
  function we(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function pn(t) {
    var e = Ut();
    return vf(e, gt, t);
  }
  function vf(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(c(311));
    a.lastRenderedReducer = l;
    var u = t.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        ((u.next = n.next), (n.next = i));
      }
      ((e.baseQueue = u = n), (a.pending = null));
    }
    if (((n = t.baseState), u === null)) t.memoizedState = n;
    else {
      e = u.next;
      var r = (i = null),
        m = null,
        T = e,
        _ = !1;
      do {
        var U = T.lane & -536870913;
        if (U !== T.lane ? (nt & U) === U : (Je & U) === U) {
          var z = T.revertLane;
          if (z === 0)
            (m !== null &&
              (m = m.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: T.action,
                  hasEagerState: T.hasEagerState,
                  eagerState: T.eagerState,
                  next: null,
                }),
              U === ha && (_ = !0));
          else if ((Je & z) === z) {
            ((T = T.next), z === ha && (_ = !0));
            continue;
          } else
            ((U = {
              lane: 0,
              revertLane: T.revertLane,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null,
            }),
              m === null ? ((r = m = U), (i = n)) : (m = m.next = U),
              (tt.lanes |= z),
              (Sl |= z));
          ((U = T.action), Kl && l(n, U), (n = T.hasEagerState ? T.eagerState : l(n, U)));
        } else
          ((z = {
            lane: U,
            revertLane: T.revertLane,
            gesture: T.gesture,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null,
          }),
            m === null ? ((r = m = z), (i = n)) : (m = m.next = z),
            (tt.lanes |= U),
            (Sl |= U));
        T = T.next;
      } while (T !== null && T !== e);
      if ((m === null ? (i = n) : (m.next = r), !fe(n, t.memoizedState) && ((qt = !0), _ && ((l = ya), l !== null))))
        throw l;
      ((t.memoizedState = n), (t.baseState = i), (t.baseQueue = m), (a.lastRenderedState = n));
    }
    return (u === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
  }
  function gf(t) {
    var e = Ut(),
      l = e.queue;
    if (l === null) throw Error(c(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch,
      u = l.pending,
      n = e.memoizedState;
    if (u !== null) {
      l.pending = null;
      var i = (u = u.next);
      do ((n = t(n, i.action)), (i = i.next));
      while (i !== u);
      (fe(n, e.memoizedState) || (qt = !0),
        (e.memoizedState = n),
        e.baseQueue === null && (e.baseState = n),
        (l.lastRenderedState = n));
    }
    return [n, a];
  }
  function So(t, e, l) {
    var a = tt,
      u = Ut(),
      n = ft;
    if (n) {
      if (l === void 0) throw Error(c(407));
      l = l();
    } else l = e();
    var i = !fe((gt || u).memoizedState, l);
    if (
      (i && ((u.memoizedState = l), (qt = !0)),
      (u = u.queue),
      bf(To.bind(null, a, u, t), [t]),
      u.getSnapshot !== e || i || (Bt !== null && Bt.memoizedState.tag & 1))
    ) {
      if (((a.flags |= 2048), Ea(9, { destroy: void 0 }, Eo.bind(null, a, u, l, e), null), Et === null))
        throw Error(c(349));
      n || (Je & 127) !== 0 || bo(a, e, l);
    }
    return l;
  }
  function bo(t, e, l) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: l }),
      (e = tt.updateQueue),
      e === null
        ? ((e = vn()), (tt.updateQueue = e), (e.stores = [t]))
        : ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t)));
  }
  function Eo(t, e, l, a) {
    ((e.value = l), (e.getSnapshot = a), zo(e) && Ao(t));
  }
  function To(t, e, l) {
    return l(function () {
      zo(e) && Ao(t);
    });
  }
  function zo(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !fe(t, l);
    } catch {
      return !0;
    }
  }
  function Ao(t) {
    var e = ql(t, 2);
    e !== null && ae(e, t, 2);
  }
  function pf(t) {
    var e = kt();
    if (typeof t == "function") {
      var l = t;
      if (((t = l()), Kl)) {
        nl(!0);
        try {
          l();
        } finally {
          nl(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: we, lastRenderedState: t }),
      e
    );
  }
  function Ro(t, e, l, a) {
    return ((t.baseState = l), vf(t, gt, typeof a == "function" ? a : we));
  }
  function $h(t, e, l, a, u) {
    if (En(t)) throw Error(c(485));
    if (((t = e.action), t !== null)) {
      var n = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (i) {
          n.listeners.push(i);
        },
      };
      (x.T !== null ? l(!0) : (n.isTransition = !1),
        a(n),
        (l = e.pending),
        l === null ? ((n.next = e.pending = n), _o(e, n)) : ((n.next = l.next), (e.pending = l.next = n)));
    }
  }
  function _o(t, e) {
    var l = e.action,
      a = e.payload,
      u = t.state;
    if (e.isTransition) {
      var n = x.T,
        i = {};
      x.T = i;
      try {
        var r = l(u, a),
          m = x.S;
        (m !== null && m(i, r), Mo(t, e, r));
      } catch (T) {
        Sf(t, e, T);
      } finally {
        (n !== null && i.types !== null && (n.types = i.types), (x.T = n));
      }
    } else
      try {
        ((n = l(u, a)), Mo(t, e, n));
      } catch (T) {
        Sf(t, e, T);
      }
  }
  function Mo(t, e, l) {
    l !== null && typeof l == "object" && typeof l.then == "function"
      ? l.then(
          function (a) {
            Oo(t, e, a);
          },
          function (a) {
            return Sf(t, e, a);
          },
        )
      : Oo(t, e, l);
  }
  function Oo(t, e, l) {
    ((e.status = "fulfilled"),
      (e.value = l),
      xo(e),
      (t.state = l),
      (e = t.pending),
      e !== null && ((l = e.next), l === e ? (t.pending = null) : ((l = l.next), (e.next = l), _o(t, l))));
  }
  function Sf(t, e, l) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do ((e.status = "rejected"), (e.reason = l), xo(e), (e = e.next));
      while (e !== a);
    }
    t.action = null;
  }
  function xo(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Do(t, e) {
    return e;
  }
  function Co(t, e) {
    if (ft) {
      var l = Et.formState;
      if (l !== null) {
        t: {
          var a = tt;
          if (ft) {
            if (zt) {
              e: {
                for (var u = zt, n = Te; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break e;
                  }
                  if (((u = Ae(u.nextSibling)), u === null)) {
                    u = null;
                    break e;
                  }
                }
                ((n = u.data), (u = n === "F!" || n === "F" ? u : null));
              }
              if (u) {
                ((zt = Ae(u.nextSibling)), (a = u.data === "F!"));
                break t;
              }
            }
            ol(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return (
      (l = kt()),
      (l.memoizedState = l.baseState = e),
      (a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Do, lastRenderedState: e }),
      (l.queue = a),
      (l = ko.bind(null, tt, a)),
      (a.dispatch = l),
      (a = pf(!1)),
      (n = Rf.bind(null, tt, !1, a.queue)),
      (a = kt()),
      (u = { state: e, dispatch: null, action: t, pending: null }),
      (a.queue = u),
      (l = $h.bind(null, tt, u, n, l)),
      (u.dispatch = l),
      (a.memoizedState = t),
      [e, l, !1]
    );
  }
  function Uo(t) {
    var e = Ut();
    return No(e, gt, t);
  }
  function No(t, e, l) {
    if (((e = vf(t, e, Do)[0]), (t = pn(we)[0]), typeof e == "object" && e !== null && typeof e.then == "function"))
      try {
        var a = iu(e);
      } catch (i) {
        throw i === va ? cn : i;
      }
    else a = e;
    e = Ut();
    var u = e.queue,
      n = u.dispatch;
    return (
      l !== e.memoizedState && ((tt.flags |= 2048), Ea(9, { destroy: void 0 }, Wh.bind(null, u, l), null)),
      [a, n, t]
    );
  }
  function Wh(t, e) {
    t.action = e;
  }
  function Ho(t) {
    var e = Ut(),
      l = gt;
    if (l !== null) return No(e, l, t);
    (Ut(), (e = e.memoizedState), (l = Ut()));
    var a = l.queue.dispatch;
    return ((l.memoizedState = t), [e, a, !1]);
  }
  function Ea(t, e, l, a) {
    return (
      (t = { tag: t, create: l, deps: a, inst: e, next: null }),
      (e = tt.updateQueue),
      e === null && ((e = vn()), (tt.updateQueue = e)),
      (l = e.lastEffect),
      l === null ? (e.lastEffect = t.next = t) : ((a = l.next), (l.next = t), (t.next = a), (e.lastEffect = t)),
      t
    );
  }
  function Bo() {
    return Ut().memoizedState;
  }
  function Sn(t, e, l, a) {
    var u = kt();
    ((tt.flags |= t), (u.memoizedState = Ea(1 | e, { destroy: void 0 }, l, a === void 0 ? null : a)));
  }
  function bn(t, e, l, a) {
    var u = Ut();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    gt !== null && a !== null && of(a, gt.memoizedState.deps)
      ? (u.memoizedState = Ea(e, n, l, a))
      : ((tt.flags |= t), (u.memoizedState = Ea(1 | e, n, l, a)));
  }
  function qo(t, e) {
    Sn(8390656, 8, t, e);
  }
  function bf(t, e) {
    bn(2048, 8, t, e);
  }
  function kh(t) {
    tt.flags |= 4;
    var e = tt.updateQueue;
    if (e === null) ((e = vn()), (tt.updateQueue = e), (e.events = [t]));
    else {
      var l = e.events;
      l === null ? (e.events = [t]) : l.push(t);
    }
  }
  function jo(t) {
    var e = Ut().memoizedState;
    return (
      kh({ ref: e, nextImpl: t }),
      function () {
        if ((ot & 2) !== 0) throw Error(c(440));
        return e.impl.apply(void 0, arguments);
      }
    );
  }
  function Yo(t, e) {
    return bn(4, 2, t, e);
  }
  function Lo(t, e) {
    return bn(4, 4, t, e);
  }
  function Go(t, e) {
    if (typeof e == "function") {
      t = t();
      var l = e(t);
      return function () {
        typeof l == "function" ? l() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function Xo(t, e, l) {
    ((l = l != null ? l.concat([t]) : null), bn(4, 4, Go.bind(null, e, t), l));
  }
  function Ef() {}
  function Qo(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && of(e, a[1]) ? a[0] : ((l.memoizedState = [t, e]), t);
  }
  function Zo(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && of(e, a[1])) return a[0];
    if (((a = t()), Kl)) {
      nl(!0);
      try {
        t();
      } finally {
        nl(!1);
      }
    }
    return ((l.memoizedState = [a, e]), a);
  }
  function Tf(t, e, l) {
    return l === void 0 || ((Je & 1073741824) !== 0 && (nt & 261930) === 0)
      ? (t.memoizedState = e)
      : ((t.memoizedState = l), (t = Vs()), (tt.lanes |= t), (Sl |= t), l);
  }
  function Vo(t, e, l, a) {
    return fe(l, e)
      ? l
      : pa.current !== null
        ? ((t = Tf(t, l, a)), fe(t, e) || (qt = !0), t)
        : (Je & 42) === 0 || ((Je & 1073741824) !== 0 && (nt & 261930) === 0)
          ? ((qt = !0), (t.memoizedState = l))
          : ((t = Vs()), (tt.lanes |= t), (Sl |= t), e);
  }
  function Ko(t, e, l, a, u) {
    var n = B.p;
    B.p = n !== 0 && 8 > n ? n : 8;
    var i = x.T,
      r = {};
    ((x.T = r), Rf(t, !1, e, l));
    try {
      var m = u(),
        T = x.S;
      if ((T !== null && T(r, m), m !== null && typeof m == "object" && typeof m.then == "function")) {
        var _ = Kh(m, a);
        fu(t, e, _, me(t));
      } else fu(t, e, a, me(t));
    } catch (U) {
      fu(t, e, { then: function () {}, status: "rejected", reason: U }, me());
    } finally {
      ((B.p = n), i !== null && r.types !== null && (i.types = r.types), (x.T = i));
    }
  }
  function Fh() {}
  function zf(t, e, l, a) {
    if (t.tag !== 5) throw Error(c(476));
    var u = Jo(t).queue;
    Ko(
      t,
      u,
      e,
      $,
      l === null
        ? Fh
        : function () {
            return (wo(t), l(a));
          },
    );
  }
  function Jo(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: $,
      baseState: $,
      baseQueue: null,
      queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: we, lastRenderedState: $ },
      next: null,
    };
    var l = {};
    return (
      (e.next = {
        memoizedState: l,
        baseState: l,
        baseQueue: null,
        queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: we, lastRenderedState: l },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function wo(t) {
    var e = Jo(t);
    (e.next === null && (e = t.alternate.memoizedState), fu(t, e.next.queue, {}, me()));
  }
  function Af() {
    return Zt(Au);
  }
  function $o() {
    return Ut().memoizedState;
  }
  function Wo() {
    return Ut().memoizedState;
  }
  function Ih(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = me();
          t = ml(l);
          var a = hl(e, t, l);
          (a !== null && (ae(a, e, l), lu(a, e, l)), (e = { cache: Ii() }), (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function Ph(t, e, l) {
    var a = me();
    ((l = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null }),
      En(t) ? Fo(e, l) : ((l = Xi(t, e, l, a)), l !== null && (ae(l, t, a), Io(l, e, a))));
  }
  function ko(t, e, l) {
    var a = me();
    fu(t, e, l, a);
  }
  function fu(t, e, l, a) {
    var u = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (En(t)) Fo(e, u);
    else {
      var n = t.alternate;
      if (t.lanes === 0 && (n === null || n.lanes === 0) && ((n = e.lastRenderedReducer), n !== null))
        try {
          var i = e.lastRenderedState,
            r = n(i, l);
          if (((u.hasEagerState = !0), (u.eagerState = r), fe(r, i))) return (tn(t, e, u, 0), Et === null && Pu(), !1);
        } catch {
        } finally {
        }
      if (((l = Xi(t, e, u, a)), l !== null)) return (ae(l, t, a), Io(l, e, a), !0);
    }
    return !1;
  }
  function Rf(t, e, l, a) {
    if (
      ((a = { lane: 2, revertLane: ac(), gesture: null, action: a, hasEagerState: !1, eagerState: null, next: null }),
      En(t))
    ) {
      if (e) throw Error(c(479));
    } else ((e = Xi(t, l, a, 2)), e !== null && ae(e, t, 2));
  }
  function En(t) {
    var e = t.alternate;
    return t === tt || (e !== null && e === tt);
  }
  function Fo(t, e) {
    Sa = hn = !0;
    var l = t.pending;
    (l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)), (t.pending = e));
  }
  function Io(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      ((a &= t.pendingLanes), (l |= a), (e.lanes = l), lr(t, l));
    }
  }
  var cu = {
    readContext: Zt,
    use: gn,
    useCallback: Mt,
    useContext: Mt,
    useEffect: Mt,
    useImperativeHandle: Mt,
    useLayoutEffect: Mt,
    useInsertionEffect: Mt,
    useMemo: Mt,
    useReducer: Mt,
    useRef: Mt,
    useState: Mt,
    useDebugValue: Mt,
    useDeferredValue: Mt,
    useTransition: Mt,
    useSyncExternalStore: Mt,
    useId: Mt,
    useHostTransitionStatus: Mt,
    useFormState: Mt,
    useActionState: Mt,
    useOptimistic: Mt,
    useMemoCache: Mt,
    useCacheRefresh: Mt,
  };
  cu.useEffectEvent = Mt;
  var Po = {
      readContext: Zt,
      use: gn,
      useCallback: function (t, e) {
        return ((kt().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: Zt,
      useEffect: qo,
      useImperativeHandle: function (t, e, l) {
        ((l = l != null ? l.concat([t]) : null), Sn(4194308, 4, Go.bind(null, e, t), l));
      },
      useLayoutEffect: function (t, e) {
        return Sn(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        Sn(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var l = kt();
        e = e === void 0 ? null : e;
        var a = t();
        if (Kl) {
          nl(!0);
          try {
            t();
          } finally {
            nl(!1);
          }
        }
        return ((l.memoizedState = [a, e]), a);
      },
      useReducer: function (t, e, l) {
        var a = kt();
        if (l !== void 0) {
          var u = l(e);
          if (Kl) {
            nl(!0);
            try {
              l(e);
            } finally {
              nl(!1);
            }
          }
        } else u = e;
        return (
          (a.memoizedState = a.baseState = u),
          (t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: u }),
          (a.queue = t),
          (t = t.dispatch = Ph.bind(null, tt, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = kt();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = pf(t);
        var e = t.queue,
          l = ko.bind(null, tt, e);
        return ((e.dispatch = l), [t.memoizedState, l]);
      },
      useDebugValue: Ef,
      useDeferredValue: function (t, e) {
        var l = kt();
        return Tf(l, t, e);
      },
      useTransition: function () {
        var t = pf(!1);
        return ((t = Ko.bind(null, tt, t.queue, !0, !1)), (kt().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, e, l) {
        var a = tt,
          u = kt();
        if (ft) {
          if (l === void 0) throw Error(c(407));
          l = l();
        } else {
          if (((l = e()), Et === null)) throw Error(c(349));
          (nt & 127) !== 0 || bo(a, e, l);
        }
        u.memoizedState = l;
        var n = { value: l, getSnapshot: e };
        return (
          (u.queue = n),
          qo(To.bind(null, a, n, t), [t]),
          (a.flags |= 2048),
          Ea(9, { destroy: void 0 }, Eo.bind(null, a, n, l, e), null),
          l
        );
      },
      useId: function () {
        var t = kt(),
          e = Et.identifierPrefix;
        if (ft) {
          var l = Be,
            a = He;
          ((l = (a & ~(1 << (32 - ie(a) - 1))).toString(32) + l),
            (e = "_" + e + "R_" + l),
            (l = yn++),
            0 < l && (e += "H" + l.toString(32)),
            (e += "_"));
        } else ((l = Jh++), (e = "_" + e + "r_" + l.toString(32) + "_"));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: Af,
      useFormState: Co,
      useActionState: Co,
      useOptimistic: function (t) {
        var e = kt();
        e.memoizedState = e.baseState = t;
        var l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
        return ((e.queue = l), (e = Rf.bind(null, tt, !0, l)), (l.dispatch = e), [t, e]);
      },
      useMemoCache: yf,
      useCacheRefresh: function () {
        return (kt().memoizedState = Ih.bind(null, tt));
      },
      useEffectEvent: function (t) {
        var e = kt(),
          l = { impl: t };
        return (
          (e.memoizedState = l),
          function () {
            if ((ot & 2) !== 0) throw Error(c(440));
            return l.impl.apply(void 0, arguments);
          }
        );
      },
    },
    _f = {
      readContext: Zt,
      use: gn,
      useCallback: Qo,
      useContext: Zt,
      useEffect: bf,
      useImperativeHandle: Xo,
      useInsertionEffect: Yo,
      useLayoutEffect: Lo,
      useMemo: Zo,
      useReducer: pn,
      useRef: Bo,
      useState: function () {
        return pn(we);
      },
      useDebugValue: Ef,
      useDeferredValue: function (t, e) {
        var l = Ut();
        return Vo(l, gt.memoizedState, t, e);
      },
      useTransition: function () {
        var t = pn(we)[0],
          e = Ut().memoizedState;
        return [typeof t == "boolean" ? t : iu(t), e];
      },
      useSyncExternalStore: So,
      useId: $o,
      useHostTransitionStatus: Af,
      useFormState: Uo,
      useActionState: Uo,
      useOptimistic: function (t, e) {
        var l = Ut();
        return Ro(l, gt, t, e);
      },
      useMemoCache: yf,
      useCacheRefresh: Wo,
    };
  _f.useEffectEvent = jo;
  var ts = {
    readContext: Zt,
    use: gn,
    useCallback: Qo,
    useContext: Zt,
    useEffect: bf,
    useImperativeHandle: Xo,
    useInsertionEffect: Yo,
    useLayoutEffect: Lo,
    useMemo: Zo,
    useReducer: gf,
    useRef: Bo,
    useState: function () {
      return gf(we);
    },
    useDebugValue: Ef,
    useDeferredValue: function (t, e) {
      var l = Ut();
      return gt === null ? Tf(l, t, e) : Vo(l, gt.memoizedState, t, e);
    },
    useTransition: function () {
      var t = gf(we)[0],
        e = Ut().memoizedState;
      return [typeof t == "boolean" ? t : iu(t), e];
    },
    useSyncExternalStore: So,
    useId: $o,
    useHostTransitionStatus: Af,
    useFormState: Ho,
    useActionState: Ho,
    useOptimistic: function (t, e) {
      var l = Ut();
      return gt !== null ? Ro(l, gt, t, e) : ((l.baseState = t), [t, l.queue.dispatch]);
    },
    useMemoCache: yf,
    useCacheRefresh: Wo,
  };
  ts.useEffectEvent = jo;
  function Mf(t, e, l, a) {
    ((e = t.memoizedState),
      (l = l(a, e)),
      (l = l == null ? e : A({}, e, l)),
      (t.memoizedState = l),
      t.lanes === 0 && (t.updateQueue.baseState = l));
  }
  var Of = {
    enqueueSetState: function (t, e, l) {
      t = t._reactInternals;
      var a = me(),
        u = ml(a);
      ((u.payload = e), l != null && (u.callback = l), (e = hl(t, u, a)), e !== null && (ae(e, t, a), lu(e, t, a)));
    },
    enqueueReplaceState: function (t, e, l) {
      t = t._reactInternals;
      var a = me(),
        u = ml(a);
      ((u.tag = 1),
        (u.payload = e),
        l != null && (u.callback = l),
        (e = hl(t, u, a)),
        e !== null && (ae(e, t, a), lu(e, t, a)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var l = me(),
        a = ml(l);
      ((a.tag = 2), e != null && (a.callback = e), (e = hl(t, a, l)), e !== null && (ae(e, t, l), lu(e, t, l)));
    },
  };
  function es(t, e, l, a, u, n, i) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(a, n, i)
        : e.prototype && e.prototype.isPureReactComponent
          ? !$a(l, a) || !$a(u, n)
          : !0
    );
  }
  function ls(t, e, l, a) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, a),
      typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(l, a),
      e.state !== t && Of.enqueueReplaceState(e, e.state, null));
  }
  function Jl(t, e) {
    var l = e;
    if ("ref" in e) {
      l = {};
      for (var a in e) a !== "ref" && (l[a] = e[a]);
    }
    if ((t = t.defaultProps)) {
      l === e && (l = A({}, l));
      for (var u in t) l[u] === void 0 && (l[u] = t[u]);
    }
    return l;
  }
  function as(t) {
    Iu(t);
  }
  function us(t) {
    console.error(t);
  }
  function ns(t) {
    Iu(t);
  }
  function Tn(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function is(t, e, l) {
    try {
      var a = t.onCaughtError;
      a(l.value, { componentStack: l.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function xf(t, e, l) {
    return (
      (l = ml(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        Tn(t, e);
      }),
      l
    );
  }
  function fs(t) {
    return ((t = ml(t)), (t.tag = 3), t);
  }
  function cs(t, e, l, a) {
    var u = l.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = a.value;
      ((t.payload = function () {
        return u(n);
      }),
        (t.callback = function () {
          is(e, l, a);
        }));
    }
    var i = l.stateNode;
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (t.callback = function () {
        (is(e, l, a), typeof u != "function" && (bl === null ? (bl = new Set([this])) : bl.add(this)));
        var r = a.stack;
        this.componentDidCatch(a.value, { componentStack: r !== null ? r : "" });
      });
  }
  function ty(t, e, l, a, u) {
    if (((l.flags |= 32768), a !== null && typeof a == "object" && typeof a.then == "function")) {
      if (((e = l.alternate), e !== null && ma(e, l, u, !0), (l = re.current), l !== null)) {
        switch (l.tag) {
          case 31:
          case 13:
            return (
              ze === null ? Hn() : l.alternate === null && Ot === 0 && (Ot = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = u),
              a === rn
                ? (l.flags |= 16384)
                : ((e = l.updateQueue), e === null ? (l.updateQueue = new Set([a])) : e.add(a), tc(t, a, u)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              a === rn
                ? (l.flags |= 16384)
                : ((e = l.updateQueue),
                  e === null
                    ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (l.updateQueue = e))
                    : ((l = e.retryQueue), l === null ? (e.retryQueue = new Set([a])) : l.add(a)),
                  tc(t, a, u)),
              !1
            );
        }
        throw Error(c(435, l.tag));
      }
      return (tc(t, a, u), Hn(), !1);
    }
    if (ft)
      return (
        (e = re.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = u),
            a !== wi && ((t = Error(c(422), { cause: a })), Fa(Se(t, l))))
          : (a !== wi && ((e = Error(c(423), { cause: a })), Fa(Se(e, l))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (u &= -u),
            (t.lanes |= u),
            (a = Se(a, l)),
            (u = xf(t.stateNode, a, u)),
            uf(t, u),
            Ot !== 4 && (Ot = 2)),
        !1
      );
    var n = Error(c(520), { cause: a });
    if (((n = Se(n, l)), vu === null ? (vu = [n]) : vu.push(n), Ot !== 4 && (Ot = 2), e === null)) return !0;
    ((a = Se(a, l)), (l = e));
    do {
      switch (l.tag) {
        case 3:
          return ((l.flags |= 65536), (t = u & -u), (l.lanes |= t), (t = xf(l.stateNode, a, t)), uf(l, t), !1);
        case 1:
          if (
            ((e = l.type),
            (n = l.stateNode),
            (l.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == "function" ||
                (n !== null && typeof n.componentDidCatch == "function" && (bl === null || !bl.has(n)))))
          )
            return ((l.flags |= 65536), (u &= -u), (l.lanes |= u), (u = fs(u)), cs(u, t, l, a), uf(l, u), !1);
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Df = Error(c(461)),
    qt = !1;
  function Vt(t, e, l, a) {
    e.child = t === null ? so(e, null, l, a) : Vl(e, t.child, l, a);
  }
  function rs(t, e, l, a, u) {
    l = l.render;
    var n = e.ref;
    if ("ref" in a) {
      var i = {};
      for (var r in a) r !== "ref" && (i[r] = a[r]);
    } else i = a;
    return (
      Gl(e),
      (a = sf(t, e, l, i, n, u)),
      (r = df()),
      t !== null && !qt ? (mf(t, e, u), $e(t, e, u)) : (ft && r && Ki(e), (e.flags |= 1), Vt(t, e, a, u), e.child)
    );
  }
  function os(t, e, l, a, u) {
    if (t === null) {
      var n = l.type;
      return typeof n == "function" && !Qi(n) && n.defaultProps === void 0 && l.compare === null
        ? ((e.tag = 15), (e.type = n), ss(t, e, n, a, u))
        : ((t = ln(l.type, null, a, e, e.mode, u)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    if (((n = t.child), !Yf(t, u))) {
      var i = n.memoizedProps;
      if (((l = l.compare), (l = l !== null ? l : $a), l(i, a) && t.ref === e.ref)) return $e(t, e, u);
    }
    return ((e.flags |= 1), (t = Qe(n, a)), (t.ref = e.ref), (t.return = e), (e.child = t));
  }
  function ss(t, e, l, a, u) {
    if (t !== null) {
      var n = t.memoizedProps;
      if ($a(n, a) && t.ref === e.ref)
        if (((qt = !1), (e.pendingProps = a = n), Yf(t, u))) (t.flags & 131072) !== 0 && (qt = !0);
        else return ((e.lanes = t.lanes), $e(t, e, u));
    }
    return Cf(t, e, l, a, u);
  }
  function ds(t, e, l, a) {
    var u = a.children,
      n = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        e.stateNode === null &&
        (e.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      a.mode === "hidden")
    ) {
      if ((e.flags & 128) !== 0) {
        if (((n = n !== null ? n.baseLanes | l : l), t !== null)) {
          for (a = e.child = t.child, u = 0; a !== null; ) ((u = u | a.lanes | a.childLanes), (a = a.sibling));
          a = u & ~n;
        } else ((a = 0), (e.child = null));
        return ms(t, e, n, l, a);
      }
      if ((l & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && fn(e, n !== null ? n.cachePool : null),
          n !== null ? yo(e, n) : ff(),
          vo(e));
      else return ((a = e.lanes = 536870912), ms(t, e, n !== null ? n.baseLanes | l : l, l, a));
    } else
      n !== null
        ? (fn(e, n.cachePool), yo(e, n), vl(), (e.memoizedState = null))
        : (t !== null && fn(e, null), ff(), vl());
    return (Vt(t, e, u, l), e.child);
  }
  function ru(t, e) {
    return (
      (t !== null && t.tag === 22) ||
        e.stateNode !== null ||
        (e.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      e.sibling
    );
  }
  function ms(t, e, l, a, u) {
    var n = tf();
    return (
      (n = n === null ? null : { parent: Ht._currentValue, pool: n }),
      (e.memoizedState = { baseLanes: l, cachePool: n }),
      t !== null && fn(e, null),
      ff(),
      vo(e),
      t !== null && ma(t, e, a, !0),
      (e.childLanes = u),
      null
    );
  }
  function zn(t, e) {
    return (
      (e = Rn({ mode: e.mode, children: e.children }, t.mode)),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function hs(t, e, l) {
    return (Vl(e, t.child, null, l), (t = zn(e, e.pendingProps)), (t.flags |= 2), oe(e), (e.memoizedState = null), t);
  }
  function ey(t, e, l) {
    var a = e.pendingProps,
      u = (e.flags & 128) !== 0;
    if (((e.flags &= -129), t === null)) {
      if (ft) {
        if (a.mode === "hidden") return ((t = zn(e, a)), (e.lanes = 536870912), ru(null, t));
        if (
          (rf(e),
          (t = zt)
            ? ((t = _d(t, Te)),
              (t = t !== null && t.data === "&" ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: cl !== null ? { id: He, overflow: Be } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = kr(t)),
                (l.return = e),
                (e.child = l),
                (Qt = e),
                (zt = null)))
            : (t = null),
          t === null)
        )
          throw ol(e);
        return ((e.lanes = 536870912), null);
      }
      return zn(e, a);
    }
    var n = t.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if ((rf(e), u))
        if (e.flags & 256) ((e.flags &= -257), (e = hs(t, e, l)));
        else if (e.memoizedState !== null) ((e.child = t.child), (e.flags |= 128), (e = null));
        else throw Error(c(558));
      else if ((qt || ma(t, e, l, !1), (u = (l & t.childLanes) !== 0), qt || u)) {
        if (((a = Et), a !== null && ((i = ar(a, l)), i !== 0 && i !== n.retryLane)))
          throw ((n.retryLane = i), ql(t, i), ae(a, t, i), Df);
        (Hn(), (e = hs(t, e, l)));
      } else
        ((t = n.treeContext),
          (zt = Ae(i.nextSibling)),
          (Qt = e),
          (ft = !0),
          (rl = null),
          (Te = !1),
          t !== null && Pr(e, t),
          (e = zn(e, a)),
          (e.flags |= 4096));
      return e;
    }
    return (
      (t = Qe(t.child, { mode: a.mode, children: a.children })),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function An(t, e) {
    var l = e.ref;
    if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object") throw Error(c(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Cf(t, e, l, a, u) {
    return (
      Gl(e),
      (l = sf(t, e, l, a, void 0, u)),
      (a = df()),
      t !== null && !qt ? (mf(t, e, u), $e(t, e, u)) : (ft && a && Ki(e), (e.flags |= 1), Vt(t, e, l, u), e.child)
    );
  }
  function ys(t, e, l, a, u, n) {
    return (
      Gl(e),
      (e.updateQueue = null),
      (l = po(e, a, l, u)),
      go(t),
      (a = df()),
      t !== null && !qt ? (mf(t, e, n), $e(t, e, n)) : (ft && a && Ki(e), (e.flags |= 1), Vt(t, e, l, n), e.child)
    );
  }
  function vs(t, e, l, a, u) {
    if ((Gl(e), e.stateNode === null)) {
      var n = ra,
        i = l.contextType;
      (typeof i == "object" && i !== null && (n = Zt(i)),
        (n = new l(a, n)),
        (e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = Of),
        (e.stateNode = n),
        (n._reactInternals = e),
        (n = e.stateNode),
        (n.props = a),
        (n.state = e.memoizedState),
        (n.refs = {}),
        lf(e),
        (i = l.contextType),
        (n.context = typeof i == "object" && i !== null ? Zt(i) : ra),
        (n.state = e.memoizedState),
        (i = l.getDerivedStateFromProps),
        typeof i == "function" && (Mf(e, l, i, a), (n.state = e.memoizedState)),
        typeof l.getDerivedStateFromProps == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function" ||
          (typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function") ||
          ((i = n.state),
          typeof n.componentWillMount == "function" && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(),
          i !== n.state && Of.enqueueReplaceState(n, n.state, null),
          uu(e, a, n, u),
          au(),
          (n.state = e.memoizedState)),
        typeof n.componentDidMount == "function" && (e.flags |= 4194308),
        (a = !0));
    } else if (t === null) {
      n = e.stateNode;
      var r = e.memoizedProps,
        m = Jl(l, r);
      n.props = m;
      var T = n.context,
        _ = l.contextType;
      ((i = ra), typeof _ == "object" && _ !== null && (i = Zt(_)));
      var U = l.getDerivedStateFromProps;
      ((_ = typeof U == "function" || typeof n.getSnapshotBeforeUpdate == "function"),
        (r = e.pendingProps !== r),
        _ ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((r || T !== i) && ls(e, n, a, i)),
        (dl = !1));
      var z = e.memoizedState;
      ((n.state = z),
        uu(e, a, n, u),
        au(),
        (T = e.memoizedState),
        r || z !== T || dl
          ? (typeof U == "function" && (Mf(e, l, U, a), (T = e.memoizedState)),
            (m = dl || es(e, l, m, a, z, T, i))
              ? (_ ||
                  (typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function") ||
                  (typeof n.componentWillMount == "function" && n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == "function" && (e.flags |= 4194308))
              : (typeof n.componentDidMount == "function" && (e.flags |= 4194308),
                (e.memoizedProps = a),
                (e.memoizedState = T)),
            (n.props = a),
            (n.state = T),
            (n.context = i),
            (a = m))
          : (typeof n.componentDidMount == "function" && (e.flags |= 4194308), (a = !1)));
    } else {
      ((n = e.stateNode),
        af(t, e),
        (i = e.memoizedProps),
        (_ = Jl(l, i)),
        (n.props = _),
        (U = e.pendingProps),
        (z = n.context),
        (T = l.contextType),
        (m = ra),
        typeof T == "object" && T !== null && (m = Zt(T)),
        (r = l.getDerivedStateFromProps),
        (T = typeof r == "function" || typeof n.getSnapshotBeforeUpdate == "function") ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((i !== U || z !== m) && ls(e, n, a, m)),
        (dl = !1),
        (z = e.memoizedState),
        (n.state = z),
        uu(e, a, n, u),
        au());
      var R = e.memoizedState;
      i !== U || z !== R || dl || (t !== null && t.dependencies !== null && un(t.dependencies))
        ? (typeof r == "function" && (Mf(e, l, r, a), (R = e.memoizedState)),
          (_ = dl || es(e, l, _, a, z, R, m) || (t !== null && t.dependencies !== null && un(t.dependencies)))
            ? (T ||
                (typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function") ||
                (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, R, m),
                typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(a, R, m)),
              typeof n.componentDidUpdate == "function" && (e.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
            : (typeof n.componentDidUpdate != "function" ||
                (i === t.memoizedProps && z === t.memoizedState) ||
                (e.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != "function" ||
                (i === t.memoizedProps && z === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = a),
              (e.memoizedState = R)),
          (n.props = a),
          (n.state = R),
          (n.context = m),
          (a = _))
        : (typeof n.componentDidUpdate != "function" ||
            (i === t.memoizedProps && z === t.memoizedState) ||
            (e.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != "function" ||
            (i === t.memoizedProps && z === t.memoizedState) ||
            (e.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      An(t, e),
      (a = (e.flags & 128) !== 0),
      n || a
        ? ((n = e.stateNode),
          (l = a && typeof l.getDerivedStateFromError != "function" ? null : n.render()),
          (e.flags |= 1),
          t !== null && a ? ((e.child = Vl(e, t.child, null, u)), (e.child = Vl(e, null, l, u))) : Vt(t, e, l, u),
          (e.memoizedState = n.state),
          (t = e.child))
        : (t = $e(t, e, u)),
      t
    );
  }
  function gs(t, e, l, a) {
    return (Yl(), (e.flags |= 256), Vt(t, e, l, a), e.child);
  }
  var Uf = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Nf(t) {
    return { baseLanes: t, cachePool: no() };
  }
  function Hf(t, e, l) {
    return ((t = t !== null ? t.childLanes & ~l : 0), e && (t |= de), t);
  }
  function ps(t, e, l) {
    var a = e.pendingProps,
      u = !1,
      n = (e.flags & 128) !== 0,
      i;
    if (
      ((i = n) || (i = t !== null && t.memoizedState === null ? !1 : (Ct.current & 2) !== 0),
      i && ((u = !0), (e.flags &= -129)),
      (i = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (ft) {
        if (
          (u ? yl(e) : vl(),
          (t = zt)
            ? ((t = _d(t, Te)),
              (t = t !== null && t.data !== "&" ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: cl !== null ? { id: He, overflow: Be } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = kr(t)),
                (l.return = e),
                (e.child = l),
                (Qt = e),
                (zt = null)))
            : (t = null),
          t === null)
        )
          throw ol(e);
        return (vc(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
      }
      var r = a.children;
      return (
        (a = a.fallback),
        u
          ? (vl(),
            (u = e.mode),
            (r = Rn({ mode: "hidden", children: r }, u)),
            (a = jl(a, u, l, null)),
            (r.return = e),
            (a.return = e),
            (r.sibling = a),
            (e.child = r),
            (a = e.child),
            (a.memoizedState = Nf(l)),
            (a.childLanes = Hf(t, i, l)),
            (e.memoizedState = Uf),
            ru(null, a))
          : (yl(e), Bf(e, r))
      );
    }
    var m = t.memoizedState;
    if (m !== null && ((r = m.dehydrated), r !== null)) {
      if (n)
        e.flags & 256
          ? (yl(e), (e.flags &= -257), (e = qf(t, e, l)))
          : e.memoizedState !== null
            ? (vl(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (vl(),
              (r = a.fallback),
              (u = e.mode),
              (a = Rn({ mode: "visible", children: a.children }, u)),
              (r = jl(r, u, l, null)),
              (r.flags |= 2),
              (a.return = e),
              (r.return = e),
              (a.sibling = r),
              (e.child = a),
              Vl(e, t.child, null, l),
              (a = e.child),
              (a.memoizedState = Nf(l)),
              (a.childLanes = Hf(t, i, l)),
              (e.memoizedState = Uf),
              (e = ru(null, a)));
      else if ((yl(e), vc(r))) {
        if (((i = r.nextSibling && r.nextSibling.dataset), i)) var T = i.dgst;
        ((i = T),
          (a = Error(c(419))),
          (a.stack = ""),
          (a.digest = i),
          Fa({ value: a, source: null, stack: null }),
          (e = qf(t, e, l)));
      } else if ((qt || ma(t, e, l, !1), (i = (l & t.childLanes) !== 0), qt || i)) {
        if (((i = Et), i !== null && ((a = ar(i, l)), a !== 0 && a !== m.retryLane)))
          throw ((m.retryLane = a), ql(t, a), ae(i, t, a), Df);
        (yc(r) || Hn(), (e = qf(t, e, l)));
      } else
        yc(r)
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = m.treeContext),
            (zt = Ae(r.nextSibling)),
            (Qt = e),
            (ft = !0),
            (rl = null),
            (Te = !1),
            t !== null && Pr(e, t),
            (e = Bf(e, a.children)),
            (e.flags |= 4096));
      return e;
    }
    return u
      ? (vl(),
        (r = a.fallback),
        (u = e.mode),
        (m = t.child),
        (T = m.sibling),
        (a = Qe(m, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = m.subtreeFlags & 65011712),
        T !== null ? (r = Qe(T, r)) : ((r = jl(r, u, l, null)), (r.flags |= 2)),
        (r.return = e),
        (a.return = e),
        (a.sibling = r),
        (e.child = a),
        ru(null, a),
        (a = e.child),
        (r = t.child.memoizedState),
        r === null
          ? (r = Nf(l))
          : ((u = r.cachePool),
            u !== null ? ((m = Ht._currentValue), (u = u.parent !== m ? { parent: m, pool: m } : u)) : (u = no()),
            (r = { baseLanes: r.baseLanes | l, cachePool: u })),
        (a.memoizedState = r),
        (a.childLanes = Hf(t, i, l)),
        (e.memoizedState = Uf),
        ru(t.child, a))
      : (yl(e),
        (l = t.child),
        (t = l.sibling),
        (l = Qe(l, { mode: "visible", children: a.children })),
        (l.return = e),
        (l.sibling = null),
        t !== null && ((i = e.deletions), i === null ? ((e.deletions = [t]), (e.flags |= 16)) : i.push(t)),
        (e.child = l),
        (e.memoizedState = null),
        l);
  }
  function Bf(t, e) {
    return ((e = Rn({ mode: "visible", children: e }, t.mode)), (e.return = t), (t.child = e));
  }
  function Rn(t, e) {
    return ((t = ce(22, t, null, e)), (t.lanes = 0), t);
  }
  function qf(t, e, l) {
    return (
      Vl(e, t.child, null, l),
      (t = Bf(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function Ss(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    (a !== null && (a.lanes |= e), ki(t.return, e, l));
  }
  function jf(t, e, l, a, u, n) {
    var i = t.memoizedState;
    i === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: l,
          tailMode: u,
          treeForkCount: n,
        })
      : ((i.isBackwards = e),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = a),
        (i.tail = l),
        (i.tailMode = u),
        (i.treeForkCount = n));
  }
  function bs(t, e, l) {
    var a = e.pendingProps,
      u = a.revealOrder,
      n = a.tail;
    a = a.children;
    var i = Ct.current,
      r = (i & 2) !== 0;
    if (
      (r ? ((i = (i & 1) | 2), (e.flags |= 128)) : (i &= 1),
      j(Ct, i),
      Vt(t, e, a, l),
      (a = ft ? ka : 0),
      !r && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Ss(t, l, e);
        else if (t.tag === 19) Ss(t, l, e);
        else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break t;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    switch (u) {
      case "forwards":
        for (l = e.child, u = null; l !== null; )
          ((t = l.alternate), t !== null && mn(t) === null && (u = l), (l = l.sibling));
        ((l = u),
          l === null ? ((u = e.child), (e.child = null)) : ((u = l.sibling), (l.sibling = null)),
          jf(e, !1, u, l, n, a));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, u = e.child, e.child = null; u !== null; ) {
          if (((t = u.alternate), t !== null && mn(t) === null)) {
            e.child = u;
            break;
          }
          ((t = u.sibling), (u.sibling = l), (l = u), (u = t));
        }
        jf(e, !0, l, null, n, a);
        break;
      case "together":
        jf(e, !1, null, null, void 0, a);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function $e(t, e, l) {
    if ((t !== null && (e.dependencies = t.dependencies), (Sl |= e.lanes), (l & e.childLanes) === 0))
      if (t !== null) {
        if ((ma(t, e, l, !1), (l & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(c(153));
    if (e.child !== null) {
      for (t = e.child, l = Qe(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        ((t = t.sibling), (l = l.sibling = Qe(t, t.pendingProps)), (l.return = e));
      l.sibling = null;
    }
    return e.child;
  }
  function Yf(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && un(t)));
  }
  function ly(t, e, l) {
    switch (e.tag) {
      case 3:
        (Wt(e, e.stateNode.containerInfo), sl(e, Ht, t.memoizedState.cache), Yl());
        break;
      case 27:
      case 5:
        Ba(e);
        break;
      case 4:
        Wt(e, e.stateNode.containerInfo);
        break;
      case 10:
        sl(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return ((e.flags |= 128), rf(e), null);
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (yl(e), (e.flags |= 128), null)
            : (l & e.child.childLanes) !== 0
              ? ps(t, e, l)
              : (yl(e), (t = $e(t, e, l)), t !== null ? t.sibling : null);
        yl(e);
        break;
      case 19:
        var u = (t.flags & 128) !== 0;
        if (((a = (l & e.childLanes) !== 0), a || (ma(t, e, l, !1), (a = (l & e.childLanes) !== 0)), u)) {
          if (a) return bs(t, e, l);
          e.flags |= 128;
        }
        if (
          ((u = e.memoizedState),
          u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          j(Ct, Ct.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((e.lanes = 0), ds(t, e, l, e.pendingProps));
      case 24:
        sl(e, Ht, t.memoizedState.cache);
    }
    return $e(t, e, l);
  }
  function Es(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) qt = !0;
      else {
        if (!Yf(t, l) && (e.flags & 128) === 0) return ((qt = !1), ly(t, e, l));
        qt = (t.flags & 131072) !== 0;
      }
    else ((qt = !1), ft && (e.flags & 1048576) !== 0 && Ir(e, ka, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (((t = Ql(e.elementType)), (e.type = t), typeof t == "function"))
            Qi(t)
              ? ((a = Jl(t, a)), (e.tag = 1), (e = vs(null, e, t, a, l)))
              : ((e.tag = 0), (e = Cf(null, e, t, a, l)));
          else {
            if (t != null) {
              var u = t.$$typeof;
              if (u === yt) {
                ((e.tag = 11), (e = rs(null, e, t, a, l)));
                break t;
              } else if (u === F) {
                ((e.tag = 14), (e = os(null, e, t, a, l)));
                break t;
              }
            }
            throw ((e = ye(t) || t), Error(c(306, e, "")));
          }
        }
        return e;
      case 0:
        return Cf(t, e, e.type, e.pendingProps, l);
      case 1:
        return ((a = e.type), (u = Jl(a, e.pendingProps)), vs(t, e, a, u, l));
      case 3:
        t: {
          if ((Wt(e, e.stateNode.containerInfo), t === null)) throw Error(c(387));
          a = e.pendingProps;
          var n = e.memoizedState;
          ((u = n.element), af(t, e), uu(e, a, null, l));
          var i = e.memoizedState;
          if (
            ((a = i.cache), sl(e, Ht, a), a !== n.cache && Fi(e, [Ht], l, !0), au(), (a = i.element), n.isDehydrated)
          )
            if (
              ((n = { element: a, isDehydrated: !1, cache: i.cache }),
              (e.updateQueue.baseState = n),
              (e.memoizedState = n),
              e.flags & 256)
            ) {
              e = gs(t, e, a, l);
              break t;
            } else if (a !== u) {
              ((u = Se(Error(c(424)), e)), Fa(u), (e = gs(t, e, a, l)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (zt = Ae(t.firstChild), Qt = e, ft = !0, rl = null, Te = !0, l = so(e, null, a, l), e.child = l; l; )
                ((l.flags = (l.flags & -3) | 4096), (l = l.sibling));
            }
          else {
            if ((Yl(), a === u)) {
              e = $e(t, e, l);
              break t;
            }
            Vt(t, e, a, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          An(t, e),
          t === null
            ? (l = Ud(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = l)
              : ft ||
                ((l = e.type),
                (t = e.pendingProps),
                (a = Xn(lt.current).createElement(l)),
                (a[Xt] = e),
                (a[Ft] = t),
                Kt(a, l, t),
                Lt(a),
                (e.stateNode = a))
            : (e.memoizedState = Ud(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          Ba(e),
          t === null &&
            ft &&
            ((a = e.stateNode = xd(e.type, e.pendingProps, lt.current)),
            (Qt = e),
            (Te = !0),
            (u = zt),
            Al(e.type) ? ((gc = u), (zt = Ae(a.firstChild))) : (zt = u)),
          Vt(t, e, e.pendingProps.children, l),
          An(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            ft &&
            ((u = a = zt) &&
              ((a = Uy(a, e.type, e.pendingProps, Te)),
              a !== null ? ((e.stateNode = a), (Qt = e), (zt = Ae(a.firstChild)), (Te = !1), (u = !0)) : (u = !1)),
            u || ol(e)),
          Ba(e),
          (u = e.type),
          (n = e.pendingProps),
          (i = t !== null ? t.memoizedProps : null),
          (a = n.children),
          dc(u, n) ? (a = null) : i !== null && dc(u, i) && (e.flags |= 32),
          e.memoizedState !== null && ((u = sf(t, e, wh, null, null, l)), (Au._currentValue = u)),
          An(t, e),
          Vt(t, e, a, l),
          e.child
        );
      case 6:
        return (
          t === null &&
            ft &&
            ((t = l = zt) &&
              ((l = Ny(l, e.pendingProps, Te)),
              l !== null ? ((e.stateNode = l), (Qt = e), (zt = null), (t = !0)) : (t = !1)),
            t || ol(e)),
          null
        );
      case 13:
        return ps(t, e, l);
      case 4:
        return (
          Wt(e, e.stateNode.containerInfo),
          (a = e.pendingProps),
          t === null ? (e.child = Vl(e, null, a, l)) : Vt(t, e, a, l),
          e.child
        );
      case 11:
        return rs(t, e, e.type, e.pendingProps, l);
      case 7:
        return (Vt(t, e, e.pendingProps, l), e.child);
      case 8:
        return (Vt(t, e, e.pendingProps.children, l), e.child);
      case 12:
        return (Vt(t, e, e.pendingProps.children, l), e.child);
      case 10:
        return ((a = e.pendingProps), sl(e, e.type, a.value), Vt(t, e, a.children, l), e.child);
      case 9:
        return (
          (u = e.type._context),
          (a = e.pendingProps.children),
          Gl(e),
          (u = Zt(u)),
          (a = a(u)),
          (e.flags |= 1),
          Vt(t, e, a, l),
          e.child
        );
      case 14:
        return os(t, e, e.type, e.pendingProps, l);
      case 15:
        return ss(t, e, e.type, e.pendingProps, l);
      case 19:
        return bs(t, e, l);
      case 31:
        return ey(t, e, l);
      case 22:
        return ds(t, e, l, e.pendingProps);
      case 24:
        return (
          Gl(e),
          (a = Zt(Ht)),
          t === null
            ? ((u = tf()),
              u === null &&
                ((u = Et),
                (n = Ii()),
                (u.pooledCache = n),
                n.refCount++,
                n !== null && (u.pooledCacheLanes |= l),
                (u = n)),
              (e.memoizedState = { parent: a, cache: u }),
              lf(e),
              sl(e, Ht, u))
            : ((t.lanes & l) !== 0 && (af(t, e), uu(e, null, null, l), au()),
              (u = t.memoizedState),
              (n = e.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (e.memoizedState = u),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u),
                  sl(e, Ht, a))
                : ((a = n.cache), sl(e, Ht, a), a !== u.cache && Fi(e, [Ht], l, !0))),
          Vt(t, e, e.pendingProps.children, l),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(c(156, e.tag));
  }
  function We(t) {
    t.flags |= 4;
  }
  function Lf(t, e, l, a, u) {
    if (((e = (t.mode & 32) !== 0) && (e = !1), e)) {
      if (((t.flags |= 16777216), (u & 335544128) === u))
        if (t.stateNode.complete) t.flags |= 8192;
        else if ($s()) t.flags |= 8192;
        else throw ((Zl = rn), ef);
    } else t.flags &= -16777217;
  }
  function Ts(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !jd(e)))
      if ($s()) t.flags |= 8192;
      else throw ((Zl = rn), ef);
  }
  function _n(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? tr() : 536870912), (t.lanes |= e), (Ra |= e)));
  }
  function ou(t, e) {
    if (!ft)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var l = null; e !== null; ) (e.alternate !== null && (l = e), (e = e.sibling));
          l === null ? (t.tail = null) : (l.sibling = null);
          break;
        case "collapsed":
          l = t.tail;
          for (var a = null; l !== null; ) (l.alternate !== null && (a = l), (l = l.sibling));
          a === null ? (e || t.tail === null ? (t.tail = null) : (t.tail.sibling = null)) : (a.sibling = null);
      }
  }
  function At(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      l = 0,
      a = 0;
    if (e)
      for (var u = t.child; u !== null; )
        ((l |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = t),
          (u = u.sibling));
    else
      for (u = t.child; u !== null; )
        ((l |= u.lanes | u.childLanes), (a |= u.subtreeFlags), (a |= u.flags), (u.return = t), (u = u.sibling));
    return ((t.subtreeFlags |= a), (t.childLanes = l), e);
  }
  function ay(t, e, l) {
    var a = e.pendingProps;
    switch ((Ji(e), e.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (At(e), null);
      case 1:
        return (At(e), null);
      case 3:
        return (
          (l = e.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          e.memoizedState.cache !== a && (e.flags |= 2048),
          Ke(Ht),
          Dt(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (t === null || t.child === null) &&
            (da(e)
              ? We(e)
              : t === null || (t.memoizedState.isDehydrated && (e.flags & 256) === 0) || ((e.flags |= 1024), $i())),
          At(e),
          null
        );
      case 26:
        var u = e.type,
          n = e.memoizedState;
        return (
          t === null
            ? (We(e), n !== null ? (At(e), Ts(e, n)) : (At(e), Lf(e, u, null, a, l)))
            : n
              ? n !== t.memoizedState
                ? (We(e), At(e), Ts(e, n))
                : (At(e), (e.flags &= -16777217))
              : ((t = t.memoizedProps), t !== a && We(e), At(e), Lf(e, u, t, a, l)),
          null
        );
      case 27:
        if ((qu(e), (l = lt.current), (u = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== a && We(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(c(166));
            return (At(e), null);
          }
          ((t = X.current), da(e) ? to(e) : ((t = xd(u, a, l)), (e.stateNode = t), We(e)));
        }
        return (At(e), null);
      case 5:
        if ((qu(e), (u = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== a && We(e);
        else {
          if (!a) {
            if (e.stateNode === null) throw Error(c(166));
            return (At(e), null);
          }
          if (((n = X.current), da(e))) to(e);
          else {
            var i = Xn(lt.current);
            switch (n) {
              case 1:
                n = i.createElementNS("http://www.w3.org/2000/svg", u);
                break;
              case 2:
                n = i.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                break;
              default:
                switch (u) {
                  case "svg":
                    n = i.createElementNS("http://www.w3.org/2000/svg", u);
                    break;
                  case "math":
                    n = i.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                    break;
                  case "script":
                    ((n = i.createElement("div")),
                      (n.innerHTML = "<script><\/script>"),
                      (n = n.removeChild(n.firstChild)));
                    break;
                  case "select":
                    ((n =
                      typeof a.is == "string" ? i.createElement("select", { is: a.is }) : i.createElement("select")),
                      a.multiple ? (n.multiple = !0) : a.size && (n.size = a.size));
                    break;
                  default:
                    n = typeof a.is == "string" ? i.createElement(u, { is: a.is }) : i.createElement(u);
                }
            }
            ((n[Xt] = e), (n[Ft] = a));
            t: for (i = e.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                ((i.child.return = i), (i = i.child));
                continue;
              }
              if (i === e) break t;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === e) break t;
                i = i.return;
              }
              ((i.sibling.return = i.return), (i = i.sibling));
            }
            e.stateNode = n;
            t: switch ((Kt(n, u, a), u)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && We(e);
          }
        }
        return (At(e), Lf(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, l), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== a && We(e);
        else {
          if (typeof a != "string" && e.stateNode === null) throw Error(c(166));
          if (((t = lt.current), da(e))) {
            if (((t = e.stateNode), (l = e.memoizedProps), (a = null), (u = Qt), u !== null))
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((t[Xt] = e),
              (t = !!(t.nodeValue === l || (a !== null && a.suppressHydrationWarning === !0) || pd(t.nodeValue, l))),
              t || ol(e, !0));
          } else ((t = Xn(t).createTextNode(a)), (t[Xt] = e), (e.stateNode = t));
        }
        return (At(e), null);
      case 31:
        if (((l = e.memoizedState), t === null || t.memoizedState !== null)) {
          if (((a = da(e)), l !== null)) {
            if (t === null) {
              if (!a) throw Error(c(318));
              if (((t = e.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(c(557));
              t[Xt] = e;
            } else (Yl(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (At(e), (t = !1));
          } else
            ((l = $i()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l), (t = !0));
          if (!t) return e.flags & 256 ? (oe(e), e) : (oe(e), null);
          if ((e.flags & 128) !== 0) throw Error(c(558));
        }
        return (At(e), null);
      case 13:
        if (((a = e.memoizedState), t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))) {
          if (((u = da(e)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!u) throw Error(c(318));
              if (((u = e.memoizedState), (u = u !== null ? u.dehydrated : null), !u)) throw Error(c(317));
              u[Xt] = e;
            } else (Yl(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (At(e), (u = !1));
          } else
            ((u = $i()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), (u = !0));
          if (!u) return e.flags & 256 ? (oe(e), e) : (oe(e), null);
        }
        return (
          oe(e),
          (e.flags & 128) !== 0
            ? ((e.lanes = l), e)
            : ((l = a !== null),
              (t = t !== null && t.memoizedState !== null),
              l &&
                ((a = e.child),
                (u = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (u = a.alternate.memoizedState.cachePool.pool),
                (n = null),
                a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool),
                n !== u && (a.flags |= 2048)),
              l !== t && l && (e.child.flags |= 8192),
              _n(e, e.updateQueue),
              At(e),
              null)
        );
      case 4:
        return (Dt(), t === null && fc(e.stateNode.containerInfo), At(e), null);
      case 10:
        return (Ke(e.type), At(e), null);
      case 19:
        if ((N(Ct), (a = e.memoizedState), a === null)) return (At(e), null);
        if (((u = (e.flags & 128) !== 0), (n = a.rendering), n === null))
          if (u) ou(a, !1);
          else {
            if (Ot !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((n = mn(t)), n !== null)) {
                  for (
                    e.flags |= 128,
                      ou(a, !1),
                      t = n.updateQueue,
                      e.updateQueue = t,
                      _n(e, t),
                      e.subtreeFlags = 0,
                      t = l,
                      l = e.child;
                    l !== null;
                  )
                    (Wr(l, t), (l = l.sibling));
                  return (j(Ct, (Ct.current & 1) | 2), ft && Ze(e, a.treeForkCount), e.child);
                }
                t = t.sibling;
              }
            a.tail !== null && ue() > Cn && ((e.flags |= 128), (u = !0), ou(a, !1), (e.lanes = 4194304));
          }
        else {
          if (!u)
            if (((t = mn(n)), t !== null)) {
              if (
                ((e.flags |= 128),
                (u = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                _n(e, t),
                ou(a, !0),
                a.tail === null && a.tailMode === "hidden" && !n.alternate && !ft)
              )
                return (At(e), null);
            } else
              2 * ue() - a.renderingStartTime > Cn &&
                l !== 536870912 &&
                ((e.flags |= 128), (u = !0), ou(a, !1), (e.lanes = 4194304));
          a.isBackwards
            ? ((n.sibling = e.child), (e.child = n))
            : ((t = a.last), t !== null ? (t.sibling = n) : (e.child = n), (a.last = n));
        }
        return a.tail !== null
          ? ((t = a.tail),
            (a.rendering = t),
            (a.tail = t.sibling),
            (a.renderingStartTime = ue()),
            (t.sibling = null),
            (l = Ct.current),
            j(Ct, u ? (l & 1) | 2 : l & 1),
            ft && Ze(e, a.treeForkCount),
            t)
          : (At(e), null);
      case 22:
      case 23:
        return (
          oe(e),
          cf(),
          (a = e.memoizedState !== null),
          t !== null ? (t.memoizedState !== null) !== a && (e.flags |= 8192) : a && (e.flags |= 8192),
          a
            ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (At(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : At(e),
          (l = e.updateQueue),
          l !== null && _n(e, l.retryQueue),
          (l = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          (a = null),
          e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool),
          a !== l && (e.flags |= 2048),
          t !== null && N(Xl),
          null
        );
      case 24:
        return (
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          Ke(Ht),
          At(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(c(156, e.tag));
  }
  function uy(t, e) {
    switch ((Ji(e), e.tag)) {
      case 1:
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 3:
        return (
          Ke(Ht),
          Dt(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 26:
      case 27:
      case 5:
        return (qu(e), null);
      case 31:
        if (e.memoizedState !== null) {
          if ((oe(e), e.alternate === null)) throw Error(c(340));
          Yl();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 13:
        if ((oe(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(c(340));
          Yl();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 19:
        return (N(Ct), null);
      case 4:
        return (Dt(), null);
      case 10:
        return (Ke(e.type), null);
      case 22:
      case 23:
        return (
          oe(e),
          cf(),
          t !== null && N(Xl),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (Ke(Ht), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function zs(t, e) {
    switch ((Ji(e), e.tag)) {
      case 3:
        (Ke(Ht), Dt());
        break;
      case 26:
      case 27:
      case 5:
        qu(e);
        break;
      case 4:
        Dt();
        break;
      case 31:
        e.memoizedState !== null && oe(e);
        break;
      case 13:
        oe(e);
        break;
      case 19:
        N(Ct);
        break;
      case 10:
        Ke(e.type);
        break;
      case 22:
      case 23:
        (oe(e), cf(), t !== null && N(Xl));
        break;
      case 24:
        Ke(Ht);
    }
  }
  function su(t, e) {
    try {
      var l = e.updateQueue,
        a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        l = u;
        do {
          if ((l.tag & t) === t) {
            a = void 0;
            var n = l.create,
              i = l.inst;
            ((a = n()), (i.destroy = a));
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (r) {
      ht(e, e.return, r);
    }
  }
  function gl(t, e, l) {
    try {
      var a = e.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & t) === t) {
            var i = a.inst,
              r = i.destroy;
            if (r !== void 0) {
              ((i.destroy = void 0), (u = e));
              var m = l,
                T = r;
              try {
                T();
              } catch (_) {
                ht(u, m, _);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (_) {
      ht(e, e.return, _);
    }
  }
  function As(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        ho(e, l);
      } catch (a) {
        ht(t, t.return, a);
      }
    }
  }
  function Rs(t, e, l) {
    ((l.props = Jl(t.type, t.memoizedProps)), (l.state = t.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (a) {
      ht(t, e, a);
    }
  }
  function du(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof l == "function" ? (t.refCleanup = l(a)) : (l.current = a);
      }
    } catch (u) {
      ht(t, e, u);
    }
  }
  function qe(t, e) {
    var l = t.ref,
      a = t.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          ht(t, e, u);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (u) {
          ht(t, e, u);
        }
      else l.current = null;
  }
  function _s(t) {
    var e = t.type,
      l = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break t;
        case "img":
          l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (u) {
      ht(t, t.return, u);
    }
  }
  function Gf(t, e, l) {
    try {
      var a = t.stateNode;
      (_y(a, t.type, l, e), (a[Ft] = e));
    } catch (u) {
      ht(t, t.return, u);
    }
  }
  function Ms(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && Al(t.type)) || t.tag === 4;
  }
  function Xf(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Ms(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if ((t.tag === 27 && Al(t.type)) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Qf(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode),
        e
          ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(t, e)
          : ((e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l),
            e.appendChild(t),
            (l = l._reactRootContainer),
            l != null || e.onclick !== null || (e.onclick = Ge)));
    else if (a !== 4 && (a === 27 && Al(t.type) && ((l = t.stateNode), (e = null)), (t = t.child), t !== null))
      for (Qf(t, e, l), t = t.sibling; t !== null; ) (Qf(t, e, l), (t = t.sibling));
  }
  function Mn(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6) ((t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t));
    else if (a !== 4 && (a === 27 && Al(t.type) && (l = t.stateNode), (t = t.child), t !== null))
      for (Mn(t, e, l), t = t.sibling; t !== null; ) (Mn(t, e, l), (t = t.sibling));
  }
  function Os(t) {
    var e = t.stateNode,
      l = t.memoizedProps;
    try {
      for (var a = t.type, u = e.attributes; u.length; ) e.removeAttributeNode(u[0]);
      (Kt(e, a, l), (e[Xt] = t), (e[Ft] = l));
    } catch (n) {
      ht(t, t.return, n);
    }
  }
  var ke = !1,
    jt = !1,
    Zf = !1,
    xs = typeof WeakSet == "function" ? WeakSet : Set,
    Gt = null;
  function ny(t, e) {
    if (((t = t.containerInfo), (oc = $n), (t = Gr(t)), Bi(t))) {
      if ("selectionStart" in t) var l = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          l = ((l = t.ownerDocument) && l.defaultView) || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var u = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (l.nodeType, n.nodeType);
            } catch {
              l = null;
              break t;
            }
            var i = 0,
              r = -1,
              m = -1,
              T = 0,
              _ = 0,
              U = t,
              z = null;
            e: for (;;) {
              for (
                var R;
                U !== l || (u !== 0 && U.nodeType !== 3) || (r = i + u),
                  U !== n || (a !== 0 && U.nodeType !== 3) || (m = i + a),
                  U.nodeType === 3 && (i += U.nodeValue.length),
                  (R = U.firstChild) !== null;
              )
                ((z = U), (U = R));
              for (;;) {
                if (U === t) break e;
                if ((z === l && ++T === u && (r = i), z === n && ++_ === a && (m = i), (R = U.nextSibling) !== null))
                  break;
                ((U = z), (z = U.parentNode));
              }
              U = R;
            }
            l = r === -1 || m === -1 ? null : { start: r, end: m };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (sc = { focusedElem: t, selectionRange: l }, $n = !1, Gt = e; Gt !== null; )
      if (((e = Gt), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null)) ((t.return = e), (Gt = t));
      else
        for (; Gt !== null; ) {
          switch (((e = Gt), (n = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              if ((t & 4) !== 0 && ((t = e.updateQueue), (t = t !== null ? t.events : null), t !== null))
                for (l = 0; l < t.length; l++) ((u = t[l]), (u.ref.impl = u.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && n !== null) {
                ((t = void 0), (l = e), (u = n.memoizedProps), (n = n.memoizedState), (a = l.stateNode));
                try {
                  var Y = Jl(l.type, u);
                  ((t = a.getSnapshotBeforeUpdate(Y, n)), (a.__reactInternalSnapshotBeforeUpdate = t));
                } catch (J) {
                  ht(l, l.return, J);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)) hc(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      hc(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(c(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Gt = t));
            break;
          }
          Gt = e.return;
        }
  }
  function Ds(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Ie(t, l), a & 4 && su(5, l));
        break;
      case 1:
        if ((Ie(t, l), a & 4))
          if (((t = l.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (i) {
              ht(l, l.return, i);
            }
          else {
            var u = Jl(l.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(u, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (i) {
              ht(l, l.return, i);
            }
          }
        (a & 64 && As(l), a & 512 && du(l, l.return));
        break;
      case 3:
        if ((Ie(t, l), a & 64 && ((t = l.updateQueue), t !== null))) {
          if (((e = null), l.child !== null))
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            ho(t, e);
          } catch (i) {
            ht(l, l.return, i);
          }
        }
        break;
      case 27:
        e === null && a & 4 && Os(l);
      case 26:
      case 5:
        (Ie(t, l), e === null && a & 4 && _s(l), a & 512 && du(l, l.return));
        break;
      case 12:
        Ie(t, l);
        break;
      case 31:
        (Ie(t, l), a & 4 && Ns(t, l));
        break;
      case 13:
        (Ie(t, l),
          a & 4 && Hs(t, l),
          a & 64 &&
            ((t = l.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((l = hy.bind(null, l)), Hy(t, l)))));
        break;
      case 22:
        if (((a = l.memoizedState !== null || ke), !a)) {
          ((e = (e !== null && e.memoizedState !== null) || jt), (u = ke));
          var n = jt;
          ((ke = a), (jt = e) && !n ? Pe(t, l, (l.subtreeFlags & 8772) !== 0) : Ie(t, l), (ke = u), (jt = n));
        }
        break;
      case 30:
        break;
      default:
        Ie(t, l);
    }
  }
  function Cs(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), Cs(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && pi(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var Rt = null,
    Pt = !1;
  function Fe(t, e, l) {
    for (l = l.child; l !== null; ) (Us(t, e, l), (l = l.sibling));
  }
  function Us(t, e, l) {
    if (ne && typeof ne.onCommitFiberUnmount == "function")
      try {
        ne.onCommitFiberUnmount(qa, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (jt || qe(l, e),
          Fe(t, e, l),
          l.memoizedState ? l.memoizedState.count-- : l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        jt || qe(l, e);
        var a = Rt,
          u = Pt;
        (Al(l.type) && ((Rt = l.stateNode), (Pt = !1)), Fe(t, e, l), Eu(l.stateNode), (Rt = a), (Pt = u));
        break;
      case 5:
        jt || qe(l, e);
      case 6:
        if (((a = Rt), (u = Pt), (Rt = null), Fe(t, e, l), (Rt = a), (Pt = u), Rt !== null))
          if (Pt)
            try {
              (Rt.nodeType === 9 ? Rt.body : Rt.nodeName === "HTML" ? Rt.ownerDocument.body : Rt).removeChild(
                l.stateNode,
              );
            } catch (n) {
              ht(l, e, n);
            }
          else
            try {
              Rt.removeChild(l.stateNode);
            } catch (n) {
              ht(l, e, n);
            }
        break;
      case 18:
        Rt !== null &&
          (Pt
            ? ((t = Rt),
              Ad(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, l.stateNode),
              Na(t))
            : Ad(Rt, l.stateNode));
        break;
      case 4:
        ((a = Rt), (u = Pt), (Rt = l.stateNode.containerInfo), (Pt = !0), Fe(t, e, l), (Rt = a), (Pt = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (gl(2, l, e), jt || gl(4, l, e), Fe(t, e, l));
        break;
      case 1:
        (jt || (qe(l, e), (a = l.stateNode), typeof a.componentWillUnmount == "function" && Rs(l, e, a)), Fe(t, e, l));
        break;
      case 21:
        Fe(t, e, l);
        break;
      case 22:
        ((jt = (a = jt) || l.memoizedState !== null), Fe(t, e, l), (jt = a));
        break;
      default:
        Fe(t, e, l);
    }
  }
  function Ns(t, e) {
    if (e.memoizedState === null && ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))) {
      t = t.dehydrated;
      try {
        Na(t);
      } catch (l) {
        ht(e, e.return, l);
      }
    }
  }
  function Hs(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        Na(t);
      } catch (l) {
        ht(e, e.return, l);
      }
  }
  function iy(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new xs()), e);
      case 22:
        return ((t = t.stateNode), (e = t._retryCache), e === null && (e = t._retryCache = new xs()), e);
      default:
        throw Error(c(435, t.tag));
    }
  }
  function On(t, e) {
    var l = iy(t);
    e.forEach(function (a) {
      if (!l.has(a)) {
        l.add(a);
        var u = yy.bind(null, t, a);
        a.then(u, u);
      }
    });
  }
  function te(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a],
          n = t,
          i = e,
          r = i;
        t: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (Al(r.type)) {
                ((Rt = r.stateNode), (Pt = !1));
                break t;
              }
              break;
            case 5:
              ((Rt = r.stateNode), (Pt = !1));
              break t;
            case 3:
            case 4:
              ((Rt = r.stateNode.containerInfo), (Pt = !0));
              break t;
          }
          r = r.return;
        }
        if (Rt === null) throw Error(c(160));
        (Us(n, i, u), (Rt = null), (Pt = !1), (n = u.alternate), n !== null && (n.return = null), (u.return = null));
      }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) (Bs(e, t), (e = e.sibling));
  }
  var Oe = null;
  function Bs(t, e) {
    var l = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (te(e, t), ee(t), a & 4 && (gl(3, t, t.return), su(3, t), gl(5, t, t.return)));
        break;
      case 1:
        (te(e, t),
          ee(t),
          a & 512 && (jt || l === null || qe(l, l.return)),
          a & 64 &&
            ke &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((l = t.shared.hiddenCallbacks), (t.shared.hiddenCallbacks = l === null ? a : l.concat(a))))));
        break;
      case 26:
        var u = Oe;
        if ((te(e, t), ee(t), a & 512 && (jt || l === null || qe(l, l.return)), a & 4)) {
          var n = l !== null ? l.memoizedState : null;
          if (((a = t.memoizedState), l === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  ((a = t.type), (l = t.memoizedProps), (u = u.ownerDocument || u));
                  e: switch (a) {
                    case "title":
                      ((n = u.getElementsByTagName("title")[0]),
                        (!n ||
                          n[La] ||
                          n[Xt] ||
                          n.namespaceURI === "http://www.w3.org/2000/svg" ||
                          n.hasAttribute("itemprop")) &&
                          ((n = u.createElement(a)), u.head.insertBefore(n, u.querySelector("head > title"))),
                        Kt(n, a, l),
                        (n[Xt] = t),
                        Lt(n),
                        (a = n));
                      break t;
                    case "link":
                      var i = Bd("link", "href", u).get(a + (l.href || ""));
                      if (i) {
                        for (var r = 0; r < i.length; r++)
                          if (
                            ((n = i[r]),
                            n.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) &&
                              n.getAttribute("rel") === (l.rel == null ? null : l.rel) &&
                              n.getAttribute("title") === (l.title == null ? null : l.title) &&
                              n.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin))
                          ) {
                            i.splice(r, 1);
                            break e;
                          }
                      }
                      ((n = u.createElement(a)), Kt(n, a, l), u.head.appendChild(n));
                      break;
                    case "meta":
                      if ((i = Bd("meta", "content", u).get(a + (l.content || "")))) {
                        for (r = 0; r < i.length; r++)
                          if (
                            ((n = i[r]),
                            n.getAttribute("content") === (l.content == null ? null : "" + l.content) &&
                              n.getAttribute("name") === (l.name == null ? null : l.name) &&
                              n.getAttribute("property") === (l.property == null ? null : l.property) &&
                              n.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) &&
                              n.getAttribute("charset") === (l.charSet == null ? null : l.charSet))
                          ) {
                            i.splice(r, 1);
                            break e;
                          }
                      }
                      ((n = u.createElement(a)), Kt(n, a, l), u.head.appendChild(n));
                      break;
                    default:
                      throw Error(c(468, a));
                  }
                  ((n[Xt] = t), Lt(n), (a = n));
                }
                t.stateNode = a;
              } else qd(u, t.type, t.stateNode);
            else t.stateNode = Hd(u, a, t.memoizedProps);
          else
            n !== a
              ? (n === null ? l.stateNode !== null && ((l = l.stateNode), l.parentNode.removeChild(l)) : n.count--,
                a === null ? qd(u, t.type, t.stateNode) : Hd(u, a, t.memoizedProps))
              : a === null && t.stateNode !== null && Gf(t, t.memoizedProps, l.memoizedProps);
        }
        break;
      case 27:
        (te(e, t),
          ee(t),
          a & 512 && (jt || l === null || qe(l, l.return)),
          l !== null && a & 4 && Gf(t, t.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if ((te(e, t), ee(t), a & 512 && (jt || l === null || qe(l, l.return)), t.flags & 32)) {
          u = t.stateNode;
          try {
            la(u, "");
          } catch (Y) {
            ht(t, t.return, Y);
          }
        }
        (a & 4 && t.stateNode != null && ((u = t.memoizedProps), Gf(t, u, l !== null ? l.memoizedProps : u)),
          a & 1024 && (Zf = !0));
        break;
      case 6:
        if ((te(e, t), ee(t), a & 4)) {
          if (t.stateNode === null) throw Error(c(162));
          ((a = t.memoizedProps), (l = t.stateNode));
          try {
            l.nodeValue = a;
          } catch (Y) {
            ht(t, t.return, Y);
          }
        }
        break;
      case 3:
        if (
          ((Vn = null),
          (u = Oe),
          (Oe = Qn(e.containerInfo)),
          te(e, t),
          (Oe = u),
          ee(t),
          a & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            Na(e.containerInfo);
          } catch (Y) {
            ht(t, t.return, Y);
          }
        Zf && ((Zf = !1), qs(t));
        break;
      case 4:
        ((a = Oe), (Oe = Qn(t.stateNode.containerInfo)), te(e, t), ee(t), (Oe = a));
        break;
      case 12:
        (te(e, t), ee(t));
        break;
      case 31:
        (te(e, t), ee(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), On(t, a))));
        break;
      case 13:
        (te(e, t),
          ee(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) != (l !== null && l.memoizedState !== null) &&
            (Dn = ue()),
          a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), On(t, a))));
        break;
      case 22:
        u = t.memoizedState !== null;
        var m = l !== null && l.memoizedState !== null,
          T = ke,
          _ = jt;
        if (((ke = T || u), (jt = _ || m), te(e, t), (jt = _), (ke = T), ee(t), a & 8192))
          t: for (
            e = t.stateNode,
              e._visibility = u ? e._visibility & -2 : e._visibility | 1,
              u && (l === null || m || ke || jt || wl(t)),
              l = null,
              e = t;
            ;
          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                m = l = e;
                try {
                  if (((n = m.stateNode), u))
                    ((i = n.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"));
                  else {
                    r = m.stateNode;
                    var U = m.memoizedProps.style,
                      z = U != null && U.hasOwnProperty("display") ? U.display : null;
                    r.style.display = z == null || typeof z == "boolean" ? "" : ("" + z).trim();
                  }
                } catch (Y) {
                  ht(m, m.return, Y);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                m = e;
                try {
                  m.stateNode.nodeValue = u ? "" : m.memoizedProps;
                } catch (Y) {
                  ht(m, m.return, Y);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                m = e;
                try {
                  var R = m.stateNode;
                  u ? Rd(R, !0) : Rd(m.stateNode, !1);
                } catch (Y) {
                  ht(m, m.return, Y);
                }
              }
            } else if (((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) && e.child !== null) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              (l === e && (l = null), (e = e.return));
            }
            (l === e && (l = null), (e.sibling.return = e.return), (e = e.sibling));
          }
        a & 4 &&
          ((a = t.updateQueue), a !== null && ((l = a.retryQueue), l !== null && ((a.retryQueue = null), On(t, l))));
        break;
      case 19:
        (te(e, t), ee(t), a & 4 && ((a = t.updateQueue), a !== null && ((t.updateQueue = null), On(t, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (te(e, t), ee(t));
    }
  }
  function ee(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (Ms(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(c(160));
        switch (l.tag) {
          case 27:
            var u = l.stateNode,
              n = Xf(t);
            Mn(t, n, u);
            break;
          case 5:
            var i = l.stateNode;
            l.flags & 32 && (la(i, ""), (l.flags &= -33));
            var r = Xf(t);
            Mn(t, r, i);
            break;
          case 3:
          case 4:
            var m = l.stateNode.containerInfo,
              T = Xf(t);
            Qf(t, T, m);
            break;
          default:
            throw Error(c(161));
        }
      } catch (_) {
        ht(t, t.return, _);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function qs(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (qs(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling));
      }
  }
  function Ie(t, e) {
    if (e.subtreeFlags & 8772) for (e = e.child; e !== null; ) (Ds(t, e.alternate, e), (e = e.sibling));
  }
  function wl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (gl(4, e, e.return), wl(e));
          break;
        case 1:
          qe(e, e.return);
          var l = e.stateNode;
          (typeof l.componentWillUnmount == "function" && Rs(e, e.return, l), wl(e));
          break;
        case 27:
          Eu(e.stateNode);
        case 26:
        case 5:
          (qe(e, e.return), wl(e));
          break;
        case 22:
          e.memoizedState === null && wl(e);
          break;
        case 30:
          wl(e);
          break;
        default:
          wl(e);
      }
      t = t.sibling;
    }
  }
  function Pe(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate,
        u = t,
        n = e,
        i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Pe(u, n, l), su(4, n));
          break;
        case 1:
          if ((Pe(u, n, l), (a = n), (u = a.stateNode), typeof u.componentDidMount == "function"))
            try {
              u.componentDidMount();
            } catch (T) {
              ht(a, a.return, T);
            }
          if (((a = n), (u = a.updateQueue), u !== null)) {
            var r = a.stateNode;
            try {
              var m = u.shared.hiddenCallbacks;
              if (m !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < m.length; u++) mo(m[u], r);
            } catch (T) {
              ht(a, a.return, T);
            }
          }
          (l && i & 64 && As(n), du(n, n.return));
          break;
        case 27:
          Os(n);
        case 26:
        case 5:
          (Pe(u, n, l), l && a === null && i & 4 && _s(n), du(n, n.return));
          break;
        case 12:
          Pe(u, n, l);
          break;
        case 31:
          (Pe(u, n, l), l && i & 4 && Ns(u, n));
          break;
        case 13:
          (Pe(u, n, l), l && i & 4 && Hs(u, n));
          break;
        case 22:
          (n.memoizedState === null && Pe(u, n, l), du(n, n.return));
          break;
        case 30:
          break;
        default:
          Pe(u, n, l);
      }
      e = e.sibling;
    }
  }
  function Vf(t, e) {
    var l = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (l = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool),
      t !== l && (t != null && t.refCount++, l != null && Ia(l)));
  }
  function Kf(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && Ia(t)));
  }
  function xe(t, e, l, a) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) (js(t, e, l, a), (e = e.sibling));
  }
  function js(t, e, l, a) {
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (xe(t, e, l, a), u & 2048 && su(9, e));
        break;
      case 1:
        xe(t, e, l, a);
        break;
      case 3:
        (xe(t, e, l, a),
          u & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Ia(t))));
        break;
      case 12:
        if (u & 2048) {
          (xe(t, e, l, a), (t = e.stateNode));
          try {
            var n = e.memoizedProps,
              i = n.id,
              r = n.onPostCommit;
            typeof r == "function" && r(i, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
          } catch (m) {
            ht(e, e.return, m);
          }
        } else xe(t, e, l, a);
        break;
      case 31:
        xe(t, e, l, a);
        break;
      case 13:
        xe(t, e, l, a);
        break;
      case 23:
        break;
      case 22:
        ((n = e.stateNode),
          (i = e.alternate),
          e.memoizedState !== null
            ? n._visibility & 2
              ? xe(t, e, l, a)
              : mu(t, e)
            : n._visibility & 2
              ? xe(t, e, l, a)
              : ((n._visibility |= 2), Ta(t, e, l, a, (e.subtreeFlags & 10256) !== 0 || !1)),
          u & 2048 && Vf(i, e));
        break;
      case 24:
        (xe(t, e, l, a), u & 2048 && Kf(e.alternate, e));
        break;
      default:
        xe(t, e, l, a);
    }
  }
  function Ta(t, e, l, a, u) {
    for (u = u && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var n = t,
        i = e,
        r = l,
        m = a,
        T = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (Ta(n, i, r, m, u), su(8, i));
          break;
        case 23:
          break;
        case 22:
          var _ = i.stateNode;
          (i.memoizedState !== null
            ? _._visibility & 2
              ? Ta(n, i, r, m, u)
              : mu(n, i)
            : ((_._visibility |= 2), Ta(n, i, r, m, u)),
            u && T & 2048 && Vf(i.alternate, i));
          break;
        case 24:
          (Ta(n, i, r, m, u), u && T & 2048 && Kf(i.alternate, i));
          break;
        default:
          Ta(n, i, r, m, u);
      }
      e = e.sibling;
    }
  }
  function mu(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t,
          a = e,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (mu(l, a), u & 2048 && Vf(a.alternate, a));
            break;
          case 24:
            (mu(l, a), u & 2048 && Kf(a.alternate, a));
            break;
          default:
            mu(l, a);
        }
        e = e.sibling;
      }
  }
  var hu = 8192;
  function za(t, e, l) {
    if (t.subtreeFlags & hu) for (t = t.child; t !== null; ) (Ys(t, e, l), (t = t.sibling));
  }
  function Ys(t, e, l) {
    switch (t.tag) {
      case 26:
        (za(t, e, l), t.flags & hu && t.memoizedState !== null && Jy(l, Oe, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        za(t, e, l);
        break;
      case 3:
      case 4:
        var a = Oe;
        ((Oe = Qn(t.stateNode.containerInfo)), za(t, e, l), (Oe = a));
        break;
      case 22:
        t.memoizedState === null &&
          ((a = t.alternate),
          a !== null && a.memoizedState !== null ? ((a = hu), (hu = 16777216), za(t, e, l), (hu = a)) : za(t, e, l));
        break;
      default:
        za(t, e, l);
    }
  }
  function Ls(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function yu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Gt = a), Xs(a, t));
        }
      Ls(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (Gs(t), (t = t.sibling));
  }
  function Gs(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (yu(t), t.flags & 2048 && gl(9, t, t.return));
        break;
      case 3:
        yu(t);
        break;
      case 12:
        yu(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), xn(t))
          : yu(t);
        break;
      default:
        yu(t);
    }
  }
  function xn(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          ((Gt = a), Xs(a, t));
        }
      Ls(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (gl(8, e, e.return), xn(e));
          break;
        case 22:
          ((l = e.stateNode), l._visibility & 2 && ((l._visibility &= -3), xn(e)));
          break;
        default:
          xn(e);
      }
      t = t.sibling;
    }
  }
  function Xs(t, e) {
    for (; Gt !== null; ) {
      var l = Gt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          gl(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ia(l.memoizedState.cache);
      }
      if (((a = l.child), a !== null)) ((a.return = l), (Gt = a));
      else
        t: for (l = t; Gt !== null; ) {
          a = Gt;
          var u = a.sibling,
            n = a.return;
          if ((Cs(a), a === l)) {
            Gt = null;
            break t;
          }
          if (u !== null) {
            ((u.return = n), (Gt = u));
            break t;
          }
          Gt = n;
        }
    }
  }
  var fy = {
      getCacheForType: function (t) {
        var e = Zt(Ht),
          l = e.data.get(t);
        return (l === void 0 && ((l = t()), e.data.set(t, l)), l);
      },
      cacheSignal: function () {
        return Zt(Ht).controller.signal;
      },
    },
    cy = typeof WeakMap == "function" ? WeakMap : Map,
    ot = 0,
    Et = null,
    at = null,
    nt = 0,
    mt = 0,
    se = null,
    pl = !1,
    Aa = !1,
    Jf = !1,
    tl = 0,
    Ot = 0,
    Sl = 0,
    $l = 0,
    wf = 0,
    de = 0,
    Ra = 0,
    vu = null,
    le = null,
    $f = !1,
    Dn = 0,
    Qs = 0,
    Cn = 1 / 0,
    Un = null,
    bl = null,
    Yt = 0,
    El = null,
    _a = null,
    el = 0,
    Wf = 0,
    kf = null,
    Zs = null,
    gu = 0,
    Ff = null;
  function me() {
    return (ot & 2) !== 0 && nt !== 0 ? nt & -nt : x.T !== null ? ac() : ur();
  }
  function Vs() {
    if (de === 0)
      if ((nt & 536870912) === 0 || ft) {
        var t = Lu;
        ((Lu <<= 1), (Lu & 3932160) === 0 && (Lu = 262144), (de = t));
      } else de = 536870912;
    return ((t = re.current), t !== null && (t.flags |= 32), de);
  }
  function ae(t, e, l) {
    (((t === Et && (mt === 2 || mt === 9)) || t.cancelPendingCommit !== null) && (Ma(t, 0), Tl(t, nt, de, !1)),
      Ya(t, l),
      ((ot & 2) === 0 || t !== Et) &&
        (t === Et && ((ot & 2) === 0 && ($l |= l), Ot === 4 && Tl(t, nt, de, !1)), je(t)));
  }
  function Ks(t, e, l) {
    if ((ot & 6) !== 0) throw Error(c(327));
    var a = (!l && (e & 127) === 0 && (e & t.expiredLanes) === 0) || ja(t, e),
      u = a ? sy(t, e) : Pf(t, e, !0),
      n = a;
    do {
      if (u === 0) {
        Aa && !a && Tl(t, e, 0, !1);
        break;
      } else {
        if (((l = t.current.alternate), n && !ry(l))) {
          ((u = Pf(t, e, !1)), (n = !1));
          continue;
        }
        if (u === 2) {
          if (((n = e), t.errorRecoveryDisabledLanes & n)) var i = 0;
          else ((i = t.pendingLanes & -536870913), (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0));
          if (i !== 0) {
            e = i;
            t: {
              var r = t;
              u = vu;
              var m = r.current.memoizedState.isDehydrated;
              if ((m && (Ma(r, i).flags |= 256), (i = Pf(r, i, !1)), i !== 2)) {
                if (Jf && !m) {
                  ((r.errorRecoveryDisabledLanes |= n), ($l |= n), (u = 4));
                  break t;
                }
                ((n = le), (le = u), n !== null && (le === null ? (le = n) : le.push.apply(le, n)));
              }
              u = i;
            }
            if (((n = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (Ma(t, 0), Tl(t, e, 0, !0));
          break;
        }
        t: {
          switch (((a = t), (n = u), n)) {
            case 0:
            case 1:
              throw Error(c(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Tl(a, e, de, !pl);
              break t;
            case 2:
              le = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(c(329));
          }
          if ((e & 62914560) === e && ((u = Dn + 300 - ue()), 10 < u)) {
            if ((Tl(a, e, de, !pl), Xu(a, 0, !0) !== 0)) break t;
            ((el = e),
              (a.timeoutHandle = Td(Js.bind(null, a, l, le, Un, $f, e, de, $l, Ra, pl, n, "Throttled", -0, 0), u)));
            break t;
          }
          Js(a, l, le, Un, $f, e, de, $l, Ra, pl, n, null, -0, 0);
        }
      }
      break;
    } while (!0);
    je(t);
  }
  function Js(t, e, l, a, u, n, i, r, m, T, _, U, z, R) {
    if (((t.timeoutHandle = -1), (U = e.subtreeFlags), U & 8192 || (U & 16785408) === 16785408)) {
      ((U = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ge,
      }),
        Ys(e, n, U));
      var Y = (n & 62914560) === n ? Dn - ue() : (n & 4194048) === n ? Qs - ue() : 0;
      if (((Y = wy(U, Y)), Y !== null)) {
        ((el = n),
          (t.cancelPendingCommit = Y(td.bind(null, t, e, n, l, a, u, i, r, m, _, U, null, z, R))),
          Tl(t, n, i, !T));
        return;
      }
    }
    td(t, e, n, l, a, u, i, r, m);
  }
  function ry(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if (
        (l === 0 || l === 11 || l === 15) &&
        e.flags & 16384 &&
        ((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
      )
        for (var a = 0; a < l.length; a++) {
          var u = l[a],
            n = u.getSnapshot;
          u = u.value;
          try {
            if (!fe(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((l = e.child), e.subtreeFlags & 16384 && l !== null)) ((l.return = e), (e = l));
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function Tl(t, e, l, a) {
    ((e &= ~wf),
      (e &= ~$l),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      a && (t.warmLanes |= e),
      (a = t.expirationTimes));
    for (var u = e; 0 < u; ) {
      var n = 31 - ie(u),
        i = 1 << n;
      ((a[n] = -1), (u &= ~i));
    }
    l !== 0 && er(t, l, e);
  }
  function Nn() {
    return (ot & 6) === 0 ? (pu(0), !1) : !0;
  }
  function If() {
    if (at !== null) {
      if (mt === 0) var t = at.return;
      else ((t = at), (Ve = Ll = null), hf(t), (ga = null), (tu = 0), (t = at));
      for (; t !== null; ) (zs(t.alternate, t), (t = t.return));
      at = null;
    }
  }
  function Ma(t, e) {
    var l = t.timeoutHandle;
    (l !== -1 && ((t.timeoutHandle = -1), xy(l)),
      (l = t.cancelPendingCommit),
      l !== null && ((t.cancelPendingCommit = null), l()),
      (el = 0),
      If(),
      (Et = t),
      (at = l = Qe(t.current, null)),
      (nt = e),
      (mt = 0),
      (se = null),
      (pl = !1),
      (Aa = ja(t, e)),
      (Jf = !1),
      (Ra = de = wf = $l = Sl = Ot = 0),
      (le = vu = null),
      ($f = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var u = 31 - ie(a),
          n = 1 << u;
        ((e |= t[u]), (a &= ~n));
      }
    return ((tl = e), Pu(), l);
  }
  function ws(t, e) {
    ((tt = null),
      (x.H = cu),
      e === va || e === cn
        ? ((e = co()), (mt = 3))
        : e === ef
          ? ((e = co()), (mt = 4))
          : (mt = e === Df ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1),
      (se = e),
      at === null && ((Ot = 1), Tn(t, Se(e, t.current))));
  }
  function $s() {
    var t = re.current;
    return t === null
      ? !0
      : (nt & 4194048) === nt
        ? ze === null
        : (nt & 62914560) === nt || (nt & 536870912) !== 0
          ? t === ze
          : !1;
  }
  function Ws() {
    var t = x.H;
    return ((x.H = cu), t === null ? cu : t);
  }
  function ks() {
    var t = x.A;
    return ((x.A = fy), t);
  }
  function Hn() {
    ((Ot = 4),
      pl || ((nt & 4194048) !== nt && re.current !== null) || (Aa = !0),
      ((Sl & 134217727) === 0 && ($l & 134217727) === 0) || Et === null || Tl(Et, nt, de, !1));
  }
  function Pf(t, e, l) {
    var a = ot;
    ot |= 2;
    var u = Ws(),
      n = ks();
    ((Et !== t || nt !== e) && ((Un = null), Ma(t, e)), (e = !1));
    var i = Ot;
    t: do
      try {
        if (mt !== 0 && at !== null) {
          var r = at,
            m = se;
          switch (mt) {
            case 8:
              (If(), (i = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              re.current === null && (e = !0);
              var T = mt;
              if (((mt = 0), (se = null), Oa(t, r, m, T), l && Aa)) {
                i = 0;
                break t;
              }
              break;
            default:
              ((T = mt), (mt = 0), (se = null), Oa(t, r, m, T));
          }
        }
        (oy(), (i = Ot));
        break;
      } catch (_) {
        ws(t, _);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (Ve = Ll = null),
      (ot = a),
      (x.H = u),
      (x.A = n),
      at === null && ((Et = null), (nt = 0), Pu()),
      i
    );
  }
  function oy() {
    for (; at !== null; ) Fs(at);
  }
  function sy(t, e) {
    var l = ot;
    ot |= 2;
    var a = Ws(),
      u = ks();
    Et !== t || nt !== e ? ((Un = null), (Cn = ue() + 500), Ma(t, e)) : (Aa = ja(t, e));
    t: do
      try {
        if (mt !== 0 && at !== null) {
          e = at;
          var n = se;
          e: switch (mt) {
            case 1:
              ((mt = 0), (se = null), Oa(t, e, n, 1));
              break;
            case 2:
            case 9:
              if (io(n)) {
                ((mt = 0), (se = null), Is(e));
                break;
              }
              ((e = function () {
                ((mt !== 2 && mt !== 9) || Et !== t || (mt = 7), je(t));
              }),
                n.then(e, e));
              break t;
            case 3:
              mt = 7;
              break t;
            case 4:
              mt = 5;
              break t;
            case 7:
              io(n) ? ((mt = 0), (se = null), Is(e)) : ((mt = 0), (se = null), Oa(t, e, n, 7));
              break;
            case 5:
              var i = null;
              switch (at.tag) {
                case 26:
                  i = at.memoizedState;
                case 5:
                case 27:
                  var r = at;
                  if (i ? jd(i) : r.stateNode.complete) {
                    ((mt = 0), (se = null));
                    var m = r.sibling;
                    if (m !== null) at = m;
                    else {
                      var T = r.return;
                      T !== null ? ((at = T), Bn(T)) : (at = null);
                    }
                    break e;
                  }
              }
              ((mt = 0), (se = null), Oa(t, e, n, 5));
              break;
            case 6:
              ((mt = 0), (se = null), Oa(t, e, n, 6));
              break;
            case 8:
              (If(), (Ot = 6));
              break t;
            default:
              throw Error(c(462));
          }
        }
        dy();
        break;
      } catch (_) {
        ws(t, _);
      }
    while (!0);
    return ((Ve = Ll = null), (x.H = a), (x.A = u), (ot = l), at !== null ? 0 : ((Et = null), (nt = 0), Pu(), Ot));
  }
  function dy() {
    for (; at !== null && !Bm(); ) Fs(at);
  }
  function Fs(t) {
    var e = Es(t.alternate, t, tl);
    ((t.memoizedProps = t.pendingProps), e === null ? Bn(t) : (at = e));
  }
  function Is(t) {
    var e = t,
      l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = ys(l, e, e.pendingProps, e.type, void 0, nt);
        break;
      case 11:
        e = ys(l, e, e.pendingProps, e.type.render, e.ref, nt);
        break;
      case 5:
        hf(e);
      default:
        (zs(l, e), (e = at = Wr(e, tl)), (e = Es(l, e, tl)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? Bn(t) : (at = e));
  }
  function Oa(t, e, l, a) {
    ((Ve = Ll = null), hf(e), (ga = null), (tu = 0));
    var u = e.return;
    try {
      if (ty(t, u, e, l, nt)) {
        ((Ot = 1), Tn(t, Se(l, t.current)), (at = null));
        return;
      }
    } catch (n) {
      if (u !== null) throw ((at = u), n);
      ((Ot = 1), Tn(t, Se(l, t.current)), (at = null));
      return;
    }
    e.flags & 32768
      ? (ft || a === 1
          ? (t = !0)
          : Aa || (nt & 536870912) !== 0
            ? (t = !1)
            : ((pl = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = re.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        Ps(e, t))
      : Bn(e);
  }
  function Bn(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Ps(e, pl);
        return;
      }
      t = e.return;
      var l = ay(e.alternate, e, tl);
      if (l !== null) {
        at = l;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        at = e;
        return;
      }
      at = e = t;
    } while (e !== null);
    Ot === 0 && (Ot = 5);
  }
  function Ps(t, e) {
    do {
      var l = uy(t.alternate, t);
      if (l !== null) {
        ((l.flags &= 32767), (at = l));
        return;
      }
      if (
        ((l = t.return),
        l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        at = t;
        return;
      }
      at = t = l;
    } while (t !== null);
    ((Ot = 6), (at = null));
  }
  function td(t, e, l, a, u, n, i, r, m) {
    t.cancelPendingCommit = null;
    do qn();
    while (Yt !== 0);
    if ((ot & 6) !== 0) throw Error(c(327));
    if (e !== null) {
      if (e === t.current) throw Error(c(177));
      if (
        ((n = e.lanes | e.childLanes),
        (n |= Gi),
        Km(t, l, n, i, r, m),
        t === Et && ((at = Et = null), (nt = 0)),
        (_a = e),
        (El = t),
        (el = l),
        (Wf = n),
        (kf = u),
        (Zs = a),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            vy(ju, function () {
              return (nd(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = x.T), (x.T = null), (u = B.p), (B.p = 2), (i = ot), (ot |= 4));
        try {
          ny(t, e, l);
        } finally {
          ((ot = i), (B.p = u), (x.T = a));
        }
      }
      ((Yt = 1), ed(), ld(), ad());
    }
  }
  function ed() {
    if (Yt === 1) {
      Yt = 0;
      var t = El,
        e = _a,
        l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        ((l = x.T), (x.T = null));
        var a = B.p;
        B.p = 2;
        var u = ot;
        ot |= 4;
        try {
          Bs(e, t);
          var n = sc,
            i = Gr(t.containerInfo),
            r = n.focusedElem,
            m = n.selectionRange;
          if (i !== r && r && r.ownerDocument && Lr(r.ownerDocument.documentElement, r)) {
            if (m !== null && Bi(r)) {
              var T = m.start,
                _ = m.end;
              if ((_ === void 0 && (_ = T), "selectionStart" in r))
                ((r.selectionStart = T), (r.selectionEnd = Math.min(_, r.value.length)));
              else {
                var U = r.ownerDocument || document,
                  z = (U && U.defaultView) || window;
                if (z.getSelection) {
                  var R = z.getSelection(),
                    Y = r.textContent.length,
                    J = Math.min(m.start, Y),
                    St = m.end === void 0 ? J : Math.min(m.end, Y);
                  !R.extend && J > St && ((i = St), (St = J), (J = i));
                  var p = Yr(r, J),
                    y = Yr(r, St);
                  if (
                    p &&
                    y &&
                    (R.rangeCount !== 1 ||
                      R.anchorNode !== p.node ||
                      R.anchorOffset !== p.offset ||
                      R.focusNode !== y.node ||
                      R.focusOffset !== y.offset)
                  ) {
                    var E = U.createRange();
                    (E.setStart(p.node, p.offset),
                      R.removeAllRanges(),
                      J > St
                        ? (R.addRange(E), R.extend(y.node, y.offset))
                        : (E.setEnd(y.node, y.offset), R.addRange(E)));
                  }
                }
              }
            }
            for (U = [], R = r; (R = R.parentNode); )
              R.nodeType === 1 && U.push({ element: R, left: R.scrollLeft, top: R.scrollTop });
            for (typeof r.focus == "function" && r.focus(), r = 0; r < U.length; r++) {
              var C = U[r];
              ((C.element.scrollLeft = C.left), (C.element.scrollTop = C.top));
            }
          }
          (($n = !!oc), (sc = oc = null));
        } finally {
          ((ot = u), (B.p = a), (x.T = l));
        }
      }
      ((t.current = e), (Yt = 2));
    }
  }
  function ld() {
    if (Yt === 2) {
      Yt = 0;
      var t = El,
        e = _a,
        l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        ((l = x.T), (x.T = null));
        var a = B.p;
        B.p = 2;
        var u = ot;
        ot |= 4;
        try {
          Ds(t, e.alternate, e);
        } finally {
          ((ot = u), (B.p = a), (x.T = l));
        }
      }
      Yt = 3;
    }
  }
  function ad() {
    if (Yt === 4 || Yt === 3) {
      ((Yt = 0), qm());
      var t = El,
        e = _a,
        l = el,
        a = Zs;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Yt = 5)
        : ((Yt = 0), (_a = El = null), ud(t, t.pendingLanes));
      var u = t.pendingLanes;
      if ((u === 0 && (bl = null), vi(l), (e = e.stateNode), ne && typeof ne.onCommitFiberRoot == "function"))
        try {
          ne.onCommitFiberRoot(qa, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((e = x.T), (u = B.p), (B.p = 2), (x.T = null));
        try {
          for (var n = t.onRecoverableError, i = 0; i < a.length; i++) {
            var r = a[i];
            n(r.value, { componentStack: r.stack });
          }
        } finally {
          ((x.T = e), (B.p = u));
        }
      }
      ((el & 3) !== 0 && qn(),
        je(t),
        (u = t.pendingLanes),
        (l & 261930) !== 0 && (u & 42) !== 0 ? (t === Ff ? gu++ : ((gu = 0), (Ff = t))) : (gu = 0),
        pu(0));
    }
  }
  function ud(t, e) {
    (t.pooledCacheLanes &= e) === 0 && ((e = t.pooledCache), e != null && ((t.pooledCache = null), Ia(e)));
  }
  function qn() {
    return (ed(), ld(), ad(), nd());
  }
  function nd() {
    if (Yt !== 5) return !1;
    var t = El,
      e = Wf;
    Wf = 0;
    var l = vi(el),
      a = x.T,
      u = B.p;
    try {
      ((B.p = 32 > l ? 32 : l), (x.T = null), (l = kf), (kf = null));
      var n = El,
        i = el;
      if (((Yt = 0), (_a = El = null), (el = 0), (ot & 6) !== 0)) throw Error(c(331));
      var r = ot;
      if (
        ((ot |= 4),
        Gs(n.current),
        js(n, n.current, i, l),
        (ot = r),
        pu(0, !1),
        ne && typeof ne.onPostCommitFiberRoot == "function")
      )
        try {
          ne.onPostCommitFiberRoot(qa, n);
        } catch {}
      return !0;
    } finally {
      ((B.p = u), (x.T = a), ud(t, e));
    }
  }
  function id(t, e, l) {
    ((e = Se(l, e)), (e = xf(t.stateNode, e, 2)), (t = hl(t, e, 2)), t !== null && (Ya(t, 2), je(t)));
  }
  function ht(t, e, l) {
    if (t.tag === 3) id(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          id(e, t, l);
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" && (bl === null || !bl.has(a)))
          ) {
            ((t = Se(l, t)), (l = fs(2)), (a = hl(e, l, 2)), a !== null && (cs(l, a, e, t), Ya(a, 2), je(a)));
            break;
          }
        }
        e = e.return;
      }
  }
  function tc(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new cy();
      var u = new Set();
      a.set(e, u);
    } else ((u = a.get(e)), u === void 0 && ((u = new Set()), a.set(e, u)));
    u.has(l) || ((Jf = !0), u.add(l), (t = my.bind(null, t, e, l)), e.then(t, t));
  }
  function my(t, e, l) {
    var a = t.pingCache;
    (a !== null && a.delete(e),
      (t.pingedLanes |= t.suspendedLanes & l),
      (t.warmLanes &= ~l),
      Et === t &&
        (nt & l) === l &&
        (Ot === 4 || (Ot === 3 && (nt & 62914560) === nt && 300 > ue() - Dn) ? (ot & 2) === 0 && Ma(t, 0) : (wf |= l),
        Ra === nt && (Ra = 0)),
      je(t));
  }
  function fd(t, e) {
    (e === 0 && (e = tr()), (t = ql(t, e)), t !== null && (Ya(t, e), je(t)));
  }
  function hy(t) {
    var e = t.memoizedState,
      l = 0;
    (e !== null && (l = e.retryLane), fd(t, l));
  }
  function yy(t, e) {
    var l = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode,
          u = t.memoizedState;
        u !== null && (l = u.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(c(314));
    }
    (a !== null && a.delete(e), fd(t, l));
  }
  function vy(t, e) {
    return di(t, e);
  }
  var jn = null,
    xa = null,
    ec = !1,
    Yn = !1,
    lc = !1,
    zl = 0;
  function je(t) {
    (t !== xa && t.next === null && (xa === null ? (jn = xa = t) : (xa = xa.next = t)),
      (Yn = !0),
      ec || ((ec = !0), py()));
  }
  function pu(t, e) {
    if (!lc && Yn) {
      lc = !0;
      do
        for (var l = !1, a = jn; a !== null; ) {
          if (t !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes,
                r = a.pingedLanes;
              ((n = (1 << (31 - ie(42 | t) + 1)) - 1),
                (n &= u & ~(i & ~r)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((l = !0), sd(a, n));
          } else
            ((n = nt),
              (n = Xu(a, a === Et ? n : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
              (n & 3) === 0 || ja(a, n) || ((l = !0), sd(a, n)));
          a = a.next;
        }
      while (l);
      lc = !1;
    }
  }
  function gy() {
    cd();
  }
  function cd() {
    Yn = ec = !1;
    var t = 0;
    zl !== 0 && Oy() && (t = zl);
    for (var e = ue(), l = null, a = jn; a !== null; ) {
      var u = a.next,
        n = rd(a, e);
      (n === 0
        ? ((a.next = null), l === null ? (jn = u) : (l.next = u), u === null && (xa = l))
        : ((l = a), (t !== 0 || (n & 3) !== 0) && (Yn = !0)),
        (a = u));
    }
    ((Yt !== 0 && Yt !== 5) || pu(t), zl !== 0 && (zl = 0));
  }
  function rd(t, e) {
    for (var l = t.suspendedLanes, a = t.pingedLanes, u = t.expirationTimes, n = t.pendingLanes & -62914561; 0 < n; ) {
      var i = 31 - ie(n),
        r = 1 << i,
        m = u[i];
      (m === -1 ? ((r & l) === 0 || (r & a) !== 0) && (u[i] = Vm(r, e)) : m <= e && (t.expiredLanes |= r), (n &= ~r));
    }
    if (
      ((e = Et),
      (l = nt),
      (l = Xu(t, t === e ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (a = t.callbackNode),
      l === 0 || (t === e && (mt === 2 || mt === 9)) || t.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && mi(a), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((l & 3) === 0 || ja(t, l)) {
      if (((e = l & -l), e === t.callbackPriority)) return e;
      switch ((a !== null && mi(a), vi(l))) {
        case 2:
        case 8:
          l = Ic;
          break;
        case 32:
          l = ju;
          break;
        case 268435456:
          l = Pc;
          break;
        default:
          l = ju;
      }
      return ((a = od.bind(null, t)), (l = di(l, a)), (t.callbackPriority = e), (t.callbackNode = l), e);
    }
    return (a !== null && a !== null && mi(a), (t.callbackPriority = 2), (t.callbackNode = null), 2);
  }
  function od(t, e) {
    if (Yt !== 0 && Yt !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var l = t.callbackNode;
    if (qn() && t.callbackNode !== l) return null;
    var a = nt;
    return (
      (a = Xu(t, t === Et ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      a === 0
        ? null
        : (Ks(t, a, e), rd(t, ue()), t.callbackNode != null && t.callbackNode === l ? od.bind(null, t) : null)
    );
  }
  function sd(t, e) {
    if (qn()) return null;
    Ks(t, e, !0);
  }
  function py() {
    Dy(function () {
      (ot & 6) !== 0 ? di(Fc, gy) : cd();
    });
  }
  function ac() {
    if (zl === 0) {
      var t = ha;
      (t === 0 && ((t = Yu), (Yu <<= 1), (Yu & 261888) === 0 && (Yu = 256)), (zl = t));
    }
    return zl;
  }
  function dd(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ku("" + t);
  }
  function md(t, e) {
    var l = e.ownerDocument.createElement("input");
    return (
      (l.name = e.name),
      (l.value = e.value),
      t.id && l.setAttribute("form", t.id),
      e.parentNode.insertBefore(l, e),
      (t = new FormData(t)),
      l.parentNode.removeChild(l),
      t
    );
  }
  function Sy(t, e, l, a, u) {
    if (e === "submit" && l && l.stateNode === u) {
      var n = dd((u[Ft] || null).action),
        i = a.submitter;
      i &&
        ((e = (e = i[Ft] || null) ? dd(e.formAction) : i.getAttribute("formAction")),
        e !== null && ((n = e), (i = null)));
      var r = new Wu("action", "action", null, a, u);
      t.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (zl !== 0) {
                  var m = i ? md(u, i) : new FormData(u);
                  zf(l, { pending: !0, data: m, method: u.method, action: n }, null, m);
                }
              } else
                typeof n == "function" &&
                  (r.preventDefault(),
                  (m = i ? md(u, i) : new FormData(u)),
                  zf(l, { pending: !0, data: m, method: u.method, action: n }, n, m));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var uc = 0; uc < Li.length; uc++) {
    var nc = Li[uc],
      by = nc.toLowerCase(),
      Ey = nc[0].toUpperCase() + nc.slice(1);
    Me(by, "on" + Ey);
  }
  (Me(Zr, "onAnimationEnd"),
    Me(Vr, "onAnimationIteration"),
    Me(Kr, "onAnimationStart"),
    Me("dblclick", "onDoubleClick"),
    Me("focusin", "onFocus"),
    Me("focusout", "onBlur"),
    Me(jh, "onTransitionRun"),
    Me(Yh, "onTransitionStart"),
    Me(Lh, "onTransitionCancel"),
    Me(Jr, "onTransitionEnd"),
    ta("onMouseEnter", ["mouseout", "mouseover"]),
    ta("onMouseLeave", ["mouseout", "mouseover"]),
    ta("onPointerEnter", ["pointerout", "pointerover"]),
    ta("onPointerLeave", ["pointerout", "pointerover"]),
    Ul("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    Ul("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    Ul("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    Ul("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    Ul("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    Ul("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" ")));
  var Su =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Ty = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Su));
  function hd(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l],
        u = a.event;
      a = a.listeners;
      t: {
        var n = void 0;
        if (e)
          for (var i = a.length - 1; 0 <= i; i--) {
            var r = a[i],
              m = r.instance,
              T = r.currentTarget;
            if (((r = r.listener), m !== n && u.isPropagationStopped())) break t;
            ((n = r), (u.currentTarget = T));
            try {
              n(u);
            } catch (_) {
              Iu(_);
            }
            ((u.currentTarget = null), (n = m));
          }
        else
          for (i = 0; i < a.length; i++) {
            if (
              ((r = a[i]),
              (m = r.instance),
              (T = r.currentTarget),
              (r = r.listener),
              m !== n && u.isPropagationStopped())
            )
              break t;
            ((n = r), (u.currentTarget = T));
            try {
              n(u);
            } catch (_) {
              Iu(_);
            }
            ((u.currentTarget = null), (n = m));
          }
      }
    }
  }
  function ut(t, e) {
    var l = e[gi];
    l === void 0 && (l = e[gi] = new Set());
    var a = t + "__bubble";
    l.has(a) || (yd(e, t, 2, !1), l.add(a));
  }
  function ic(t, e, l) {
    var a = 0;
    (e && (a |= 4), yd(l, t, a, e));
  }
  var Ln = "_reactListening" + Math.random().toString(36).slice(2);
  function fc(t) {
    if (!t[Ln]) {
      ((t[Ln] = !0),
        fr.forEach(function (l) {
          l !== "selectionchange" && (Ty.has(l) || ic(l, !1, t), ic(l, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Ln] || ((e[Ln] = !0), ic("selectionchange", !1, e));
    }
  }
  function yd(t, e, l, a) {
    switch (Vd(e)) {
      case 2:
        var u = ky;
        break;
      case 8:
        u = Fy;
        break;
      default:
        u = Tc;
    }
    ((l = u.bind(null, e, l, t)),
      (u = void 0),
      !_i || (e !== "touchstart" && e !== "touchmove" && e !== "wheel") || (u = !0),
      a
        ? u !== void 0
          ? t.addEventListener(e, l, { capture: !0, passive: u })
          : t.addEventListener(e, l, !0)
        : u !== void 0
          ? t.addEventListener(e, l, { passive: u })
          : t.addEventListener(e, l, !1));
  }
  function cc(t, e, l, a, u) {
    var n = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var r = a.stateNode.containerInfo;
          if (r === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var m = i.tag;
              if ((m === 3 || m === 4) && i.stateNode.containerInfo === u) return;
              i = i.return;
            }
          for (; r !== null; ) {
            if (((i = Fl(r)), i === null)) return;
            if (((m = i.tag), m === 5 || m === 6 || m === 26 || m === 27)) {
              a = n = i;
              continue t;
            }
            r = r.parentNode;
          }
        }
        a = a.return;
      }
    Sr(function () {
      var T = n,
        _ = Ai(l),
        U = [];
      t: {
        var z = wr.get(t);
        if (z !== void 0) {
          var R = Wu,
            Y = t;
          switch (t) {
            case "keypress":
              if (wu(l) === 0) break t;
            case "keydown":
            case "keyup":
              R = yh;
              break;
            case "focusin":
              ((Y = "focus"), (R = Di));
              break;
            case "focusout":
              ((Y = "blur"), (R = Di));
              break;
            case "beforeblur":
            case "afterblur":
              R = Di;
              break;
            case "click":
              if (l.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              R = Tr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = ah;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = ph;
              break;
            case Zr:
            case Vr:
            case Kr:
              R = ih;
              break;
            case Jr:
              R = bh;
              break;
            case "scroll":
            case "scrollend":
              R = eh;
              break;
            case "wheel":
              R = Th;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = ch;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Ar;
              break;
            case "toggle":
            case "beforetoggle":
              R = Ah;
          }
          var J = (e & 4) !== 0,
            St = !J && (t === "scroll" || t === "scrollend"),
            p = J ? (z !== null ? z + "Capture" : null) : z;
          J = [];
          for (var y = T, E; y !== null; ) {
            var C = y;
            if (
              ((E = C.stateNode),
              (C = C.tag),
              (C !== 5 && C !== 26 && C !== 27) ||
                E === null ||
                p === null ||
                ((C = Xa(y, p)), C != null && J.push(bu(y, C, E))),
              St)
            )
              break;
            y = y.return;
          }
          0 < J.length && ((z = new R(z, Y, null, l, _)), U.push({ event: z, listeners: J }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((z = t === "mouseover" || t === "pointerover"),
            (R = t === "mouseout" || t === "pointerout"),
            z && l !== zi && (Y = l.relatedTarget || l.fromElement) && (Fl(Y) || Y[kl]))
          )
            break t;
          if (
            (R || z) &&
            ((z = _.window === _ ? _ : (z = _.ownerDocument) ? z.defaultView || z.parentWindow : window),
            R
              ? ((Y = l.relatedTarget || l.toElement),
                (R = T),
                (Y = Y ? Fl(Y) : null),
                Y !== null && ((St = h(Y)), (J = Y.tag), Y !== St || (J !== 5 && J !== 27 && J !== 6)) && (Y = null))
              : ((R = null), (Y = T)),
            R !== Y)
          ) {
            if (
              ((J = Tr),
              (C = "onMouseLeave"),
              (p = "onMouseEnter"),
              (y = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                ((J = Ar), (C = "onPointerLeave"), (p = "onPointerEnter"), (y = "pointer")),
              (St = R == null ? z : Ga(R)),
              (E = Y == null ? z : Ga(Y)),
              (z = new J(C, y + "leave", R, l, _)),
              (z.target = St),
              (z.relatedTarget = E),
              (C = null),
              Fl(_) === T && ((J = new J(p, y + "enter", Y, l, _)), (J.target = E), (J.relatedTarget = St), (C = J)),
              (St = C),
              R && Y)
            )
              e: {
                for (J = zy, p = R, y = Y, E = 0, C = p; C; C = J(C)) E++;
                C = 0;
                for (var Z = y; Z; Z = J(Z)) C++;
                for (; 0 < E - C; ) ((p = J(p)), E--);
                for (; 0 < C - E; ) ((y = J(y)), C--);
                for (; E--; ) {
                  if (p === y || (y !== null && p === y.alternate)) {
                    J = p;
                    break e;
                  }
                  ((p = J(p)), (y = J(y)));
                }
                J = null;
              }
            else J = null;
            (R !== null && vd(U, z, R, J, !1), Y !== null && St !== null && vd(U, St, Y, J, !0));
          }
        }
        t: {
          if (
            ((z = T ? Ga(T) : window),
            (R = z.nodeName && z.nodeName.toLowerCase()),
            R === "select" || (R === "input" && z.type === "file"))
          )
            var ct = Ur;
          else if (Dr(z))
            if (Nr) ct = Hh;
            else {
              ct = Uh;
              var Q = Ch;
            }
          else
            ((R = z.nodeName),
              !R || R.toLowerCase() !== "input" || (z.type !== "checkbox" && z.type !== "radio")
                ? T && Ti(T.elementType) && (ct = Ur)
                : (ct = Nh));
          if (ct && (ct = ct(t, T))) {
            Cr(U, ct, l, _);
            break t;
          }
          (Q && Q(t, z, T),
            t === "focusout" && T && z.type === "number" && T.memoizedProps.value != null && Ei(z, "number", z.value));
        }
        switch (((Q = T ? Ga(T) : window), t)) {
          case "focusin":
            (Dr(Q) || Q.contentEditable === "true") && ((ia = Q), (qi = T), (Wa = null));
            break;
          case "focusout":
            Wa = qi = ia = null;
            break;
          case "mousedown":
            ji = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((ji = !1), Xr(U, l, _));
            break;
          case "selectionchange":
            if (qh) break;
          case "keydown":
          case "keyup":
            Xr(U, l, _);
        }
        var et;
        if (Ui)
          t: {
            switch (t) {
              case "compositionstart":
                var it = "onCompositionStart";
                break t;
              case "compositionend":
                it = "onCompositionEnd";
                break t;
              case "compositionupdate":
                it = "onCompositionUpdate";
                break t;
            }
            it = void 0;
          }
        else
          na
            ? Or(t, l) && (it = "onCompositionEnd")
            : t === "keydown" && l.keyCode === 229 && (it = "onCompositionStart");
        (it &&
          (Rr &&
            l.locale !== "ko" &&
            (na || it !== "onCompositionStart"
              ? it === "onCompositionEnd" && na && (et = br())
              : ((fl = _), (Mi = "value" in fl ? fl.value : fl.textContent), (na = !0))),
          (Q = Gn(T, it)),
          0 < Q.length &&
            ((it = new zr(it, t, null, l, _)),
            U.push({ event: it, listeners: Q }),
            et ? (it.data = et) : ((et = xr(l)), et !== null && (it.data = et)))),
          (et = _h ? Mh(t, l) : Oh(t, l)) &&
            ((it = Gn(T, "onBeforeInput")),
            0 < it.length &&
              ((Q = new zr("onBeforeInput", "beforeinput", null, l, _)),
              U.push({ event: Q, listeners: it }),
              (Q.data = et))),
          Sy(U, t, T, l, _));
      }
      hd(U, e);
    });
  }
  function bu(t, e, l) {
    return { instance: t, listener: e, currentTarget: l };
  }
  function Gn(t, e) {
    for (var l = e + "Capture", a = []; t !== null; ) {
      var u = t,
        n = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          n === null ||
          ((u = Xa(t, l)), u != null && a.unshift(bu(t, u, n)), (u = Xa(t, e)), u != null && a.push(bu(t, u, n))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function zy(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function vd(t, e, l, a, u) {
    for (var n = e._reactName, i = []; l !== null && l !== a; ) {
      var r = l,
        m = r.alternate,
        T = r.stateNode;
      if (((r = r.tag), m !== null && m === a)) break;
      ((r !== 5 && r !== 26 && r !== 27) ||
        T === null ||
        ((m = T),
        u
          ? ((T = Xa(l, n)), T != null && i.unshift(bu(l, T, m)))
          : u || ((T = Xa(l, n)), T != null && i.push(bu(l, T, m)))),
        (l = l.return));
    }
    i.length !== 0 && t.push({ event: e, listeners: i });
  }
  var Ay = /\r\n?/g,
    Ry = /\u0000|\uFFFD/g;
  function gd(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        Ay,
        `
`,
      )
      .replace(Ry, "");
  }
  function pd(t, e) {
    return ((e = gd(e)), gd(t) === e);
  }
  function pt(t, e, l, a, u, n) {
    switch (l) {
      case "children":
        typeof a == "string"
          ? e === "body" || (e === "textarea" && a === "") || la(t, a)
          : (typeof a == "number" || typeof a == "bigint") && e !== "body" && la(t, "" + a);
        break;
      case "className":
        Zu(t, "class", a);
        break;
      case "tabIndex":
        Zu(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Zu(t, l, a);
        break;
      case "style":
        gr(t, a, n);
        break;
      case "data":
        if (e !== "object") {
          Zu(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || l !== "href")) {
          t.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        ((a = Ku("" + a)), t.setAttribute(l, a));
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof n == "function" &&
            (l === "formAction"
              ? (e !== "input" && pt(t, e, "name", u.name, u, null),
                pt(t, e, "formEncType", u.formEncType, u, null),
                pt(t, e, "formMethod", u.formMethod, u, null),
                pt(t, e, "formTarget", u.formTarget, u, null))
              : (pt(t, e, "encType", u.encType, u, null),
                pt(t, e, "method", u.method, u, null),
                pt(t, e, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        ((a = Ku("" + a)), t.setAttribute(l, a));
        break;
      case "onClick":
        a != null && (t.onclick = Ge);
        break;
      case "onScroll":
        a != null && ut("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ut("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(c(61));
          if (((l = a.__html), l != null)) {
            if (u.children != null) throw Error(c(60));
            t.innerHTML = l;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        ((l = Ku("" + a)), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", l));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, "" + a) : t.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, "") : t.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0
          ? t.setAttribute(l, "")
          : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol"
            ? t.setAttribute(l, a)
            : t.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a
          ? t.setAttribute(l, a)
          : t.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? t.removeAttribute(l)
          : t.setAttribute(l, a);
        break;
      case "popover":
        (ut("beforetoggle", t), ut("toggle", t), Qu(t, "popover", a));
        break;
      case "xlinkActuate":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        Le(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        Le(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        Le(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        Le(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        Qu(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || (l[0] !== "o" && l[0] !== "O") || (l[1] !== "n" && l[1] !== "N")) &&
          ((l = Pm.get(l) || l), Qu(t, l, a));
    }
  }
  function rc(t, e, l, a, u, n) {
    switch (l) {
      case "style":
        gr(t, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(c(61));
          if (((l = a.__html), l != null)) {
            if (u.children != null) throw Error(c(60));
            t.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? la(t, a) : (typeof a == "number" || typeof a == "bigint") && la(t, "" + a);
        break;
      case "onScroll":
        a != null && ut("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ut("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = Ge);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!cr.hasOwnProperty(l))
          t: {
            if (
              l[0] === "o" &&
              l[1] === "n" &&
              ((u = l.endsWith("Capture")),
              (e = l.slice(2, u ? l.length - 7 : void 0)),
              (n = t[Ft] || null),
              (n = n != null ? n[l] : null),
              typeof n == "function" && t.removeEventListener(e, n, u),
              typeof a == "function")
            ) {
              (typeof n != "function" &&
                n !== null &&
                (l in t ? (t[l] = null) : t.hasAttribute(l) && t.removeAttribute(l)),
                t.addEventListener(e, a, u));
              break t;
            }
            l in t ? (t[l] = a) : a === !0 ? t.setAttribute(l, "") : Qu(t, l, a);
          }
    }
  }
  function Kt(t, e, l) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (ut("error", t), ut("load", t));
        var a = !1,
          u = !1,
          n;
        for (n in l)
          if (l.hasOwnProperty(n)) {
            var i = l[n];
            if (i != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(c(137, e));
                default:
                  pt(t, e, n, i, l, null);
              }
          }
        (u && pt(t, e, "srcSet", l.srcSet, l, null), a && pt(t, e, "src", l.src, l, null));
        return;
      case "input":
        ut("invalid", t);
        var r = (n = i = u = null),
          m = null,
          T = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var _ = l[a];
            if (_ != null)
              switch (a) {
                case "name":
                  u = _;
                  break;
                case "type":
                  i = _;
                  break;
                case "checked":
                  m = _;
                  break;
                case "defaultChecked":
                  T = _;
                  break;
                case "value":
                  n = _;
                  break;
                case "defaultValue":
                  r = _;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (_ != null) throw Error(c(137, e));
                  break;
                default:
                  pt(t, e, a, _, l, null);
              }
          }
        mr(t, n, r, m, T, i, u, !1);
        return;
      case "select":
        (ut("invalid", t), (a = i = n = null));
        for (u in l)
          if (l.hasOwnProperty(u) && ((r = l[u]), r != null))
            switch (u) {
              case "value":
                n = r;
                break;
              case "defaultValue":
                i = r;
                break;
              case "multiple":
                a = r;
              default:
                pt(t, e, u, r, l, null);
            }
        ((e = n), (l = i), (t.multiple = !!a), e != null ? ea(t, !!a, e, !1) : l != null && ea(t, !!a, l, !0));
        return;
      case "textarea":
        (ut("invalid", t), (n = u = a = null));
        for (i in l)
          if (l.hasOwnProperty(i) && ((r = l[i]), r != null))
            switch (i) {
              case "value":
                a = r;
                break;
              case "defaultValue":
                u = r;
                break;
              case "children":
                n = r;
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(c(91));
                break;
              default:
                pt(t, e, i, r, l, null);
            }
        yr(t, a, u, n);
        return;
      case "option":
        for (m in l)
          if (l.hasOwnProperty(m) && ((a = l[m]), a != null))
            switch (m) {
              case "selected":
                t.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                pt(t, e, m, a, l, null);
            }
        return;
      case "dialog":
        (ut("beforetoggle", t), ut("toggle", t), ut("cancel", t), ut("close", t));
        break;
      case "iframe":
      case "object":
        ut("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Su.length; a++) ut(Su[a], t);
        break;
      case "image":
        (ut("error", t), ut("load", t));
        break;
      case "details":
        ut("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        (ut("error", t), ut("load", t));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (T in l)
          if (l.hasOwnProperty(T) && ((a = l[T]), a != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(c(137, e));
              default:
                pt(t, e, T, a, l, null);
            }
        return;
      default:
        if (Ti(e)) {
          for (_ in l) l.hasOwnProperty(_) && ((a = l[_]), a !== void 0 && rc(t, e, _, a, l, void 0));
          return;
        }
    }
    for (r in l) l.hasOwnProperty(r) && ((a = l[r]), a != null && pt(t, e, r, a, l, null));
  }
  function _y(t, e, l, a) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null,
          n = null,
          i = null,
          r = null,
          m = null,
          T = null,
          _ = null;
        for (R in l) {
          var U = l[R];
          if (l.hasOwnProperty(R) && U != null)
            switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                m = U;
              default:
                a.hasOwnProperty(R) || pt(t, e, R, null, a, U);
            }
        }
        for (var z in a) {
          var R = a[z];
          if (((U = l[z]), a.hasOwnProperty(z) && (R != null || U != null)))
            switch (z) {
              case "type":
                n = R;
                break;
              case "name":
                u = R;
                break;
              case "checked":
                T = R;
                break;
              case "defaultChecked":
                _ = R;
                break;
              case "value":
                i = R;
                break;
              case "defaultValue":
                r = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null) throw Error(c(137, e));
                break;
              default:
                R !== U && pt(t, e, z, R, a, U);
            }
        }
        bi(t, i, r, m, T, _, n, u);
        return;
      case "select":
        R = i = r = z = null;
        for (n in l)
          if (((m = l[n]), l.hasOwnProperty(n) && m != null))
            switch (n) {
              case "value":
                break;
              case "multiple":
                R = m;
              default:
                a.hasOwnProperty(n) || pt(t, e, n, null, a, m);
            }
        for (u in a)
          if (((n = a[u]), (m = l[u]), a.hasOwnProperty(u) && (n != null || m != null)))
            switch (u) {
              case "value":
                z = n;
                break;
              case "defaultValue":
                r = n;
                break;
              case "multiple":
                i = n;
              default:
                n !== m && pt(t, e, u, n, a, m);
            }
        ((e = r),
          (l = i),
          (a = R),
          z != null ? ea(t, !!l, z, !1) : !!a != !!l && (e != null ? ea(t, !!l, e, !0) : ea(t, !!l, l ? [] : "", !1)));
        return;
      case "textarea":
        R = z = null;
        for (r in l)
          if (((u = l[r]), l.hasOwnProperty(r) && u != null && !a.hasOwnProperty(r)))
            switch (r) {
              case "value":
                break;
              case "children":
                break;
              default:
                pt(t, e, r, null, a, u);
            }
        for (i in a)
          if (((u = a[i]), (n = l[i]), a.hasOwnProperty(i) && (u != null || n != null)))
            switch (i) {
              case "value":
                z = u;
                break;
              case "defaultValue":
                R = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(c(91));
                break;
              default:
                u !== n && pt(t, e, i, u, a, n);
            }
        hr(t, z, R);
        return;
      case "option":
        for (var Y in l)
          if (((z = l[Y]), l.hasOwnProperty(Y) && z != null && !a.hasOwnProperty(Y)))
            switch (Y) {
              case "selected":
                t.selected = !1;
                break;
              default:
                pt(t, e, Y, null, a, z);
            }
        for (m in a)
          if (((z = a[m]), (R = l[m]), a.hasOwnProperty(m) && z !== R && (z != null || R != null)))
            switch (m) {
              case "selected":
                t.selected = z && typeof z != "function" && typeof z != "symbol";
                break;
              default:
                pt(t, e, m, z, a, R);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var J in l)
          ((z = l[J]), l.hasOwnProperty(J) && z != null && !a.hasOwnProperty(J) && pt(t, e, J, null, a, z));
        for (T in a)
          if (((z = a[T]), (R = l[T]), a.hasOwnProperty(T) && z !== R && (z != null || R != null)))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null) throw Error(c(137, e));
                break;
              default:
                pt(t, e, T, z, a, R);
            }
        return;
      default:
        if (Ti(e)) {
          for (var St in l)
            ((z = l[St]), l.hasOwnProperty(St) && z !== void 0 && !a.hasOwnProperty(St) && rc(t, e, St, void 0, a, z));
          for (_ in a)
            ((z = a[_]),
              (R = l[_]),
              !a.hasOwnProperty(_) || z === R || (z === void 0 && R === void 0) || rc(t, e, _, z, a, R));
          return;
        }
    }
    for (var p in l) ((z = l[p]), l.hasOwnProperty(p) && z != null && !a.hasOwnProperty(p) && pt(t, e, p, null, a, z));
    for (U in a)
      ((z = a[U]), (R = l[U]), !a.hasOwnProperty(U) || z === R || (z == null && R == null) || pt(t, e, U, z, a, R));
  }
  function Sd(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function My() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var u = l[a],
          n = u.transferSize,
          i = u.initiatorType,
          r = u.duration;
        if (n && r && Sd(i)) {
          for (i = 0, r = u.responseEnd, a += 1; a < l.length; a++) {
            var m = l[a],
              T = m.startTime;
            if (T > r) break;
            var _ = m.transferSize,
              U = m.initiatorType;
            _ && Sd(U) && ((m = m.responseEnd), (i += _ * (m < r ? 1 : (r - T) / (m - T))));
          }
          if ((--a, (e += (8 * (n + i)) / (u.duration / 1e3)), t++, 10 < t)) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && ((t = navigator.connection.downlink), typeof t == "number") ? t : 5;
  }
  var oc = null,
    sc = null;
  function Xn(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function bd(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Ed(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function dc(t, e) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof e.children == "string" ||
      typeof e.children == "number" ||
      typeof e.children == "bigint" ||
      (typeof e.dangerouslySetInnerHTML == "object" &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var mc = null;
  function Oy() {
    var t = window.event;
    return t && t.type === "popstate" ? (t === mc ? !1 : ((mc = t), !0)) : ((mc = null), !1);
  }
  var Td = typeof setTimeout == "function" ? setTimeout : void 0,
    xy = typeof clearTimeout == "function" ? clearTimeout : void 0,
    zd = typeof Promise == "function" ? Promise : void 0,
    Dy =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof zd < "u"
          ? function (t) {
              return zd.resolve(null).then(t).catch(Cy);
            }
          : Td;
  function Cy(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Al(t) {
    return t === "head";
  }
  function Ad(t, e) {
    var l = e,
      a = 0;
    do {
      var u = l.nextSibling;
      if ((t.removeChild(l), u && u.nodeType === 8))
        if (((l = u.data), l === "/$" || l === "/&")) {
          if (a === 0) {
            (t.removeChild(u), Na(e));
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&") a++;
        else if (l === "html") Eu(t.ownerDocument.documentElement);
        else if (l === "head") {
          ((l = t.ownerDocument.head), Eu(l));
          for (var n = l.firstChild; n; ) {
            var i = n.nextSibling,
              r = n.nodeName;
            (n[La] ||
              r === "SCRIPT" ||
              r === "STYLE" ||
              (r === "LINK" && n.rel.toLowerCase() === "stylesheet") ||
              l.removeChild(n),
              (n = i));
          }
        } else l === "body" && Eu(t.ownerDocument.body);
      l = u;
    } while (l);
    Na(e);
  }
  function Rd(t, e) {
    var l = t;
    t = 0;
    do {
      var a = l.nextSibling;
      if (
        (l.nodeType === 1
          ? e
            ? ((l._stashedDisplay = l.style.display), (l.style.display = "none"))
            : ((l.style.display = l._stashedDisplay || ""),
              l.getAttribute("style") === "" && l.removeAttribute("style"))
          : l.nodeType === 3 &&
            (e ? ((l._stashedText = l.nodeValue), (l.nodeValue = "")) : (l.nodeValue = l._stashedText || "")),
        a && a.nodeType === 8)
      )
        if (((l = a.data), l === "/$")) {
          if (t === 0) break;
          t--;
        } else (l !== "$" && l !== "$?" && l !== "$~" && l !== "$!") || t++;
      l = a;
    } while (l);
  }
  function hc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (((e = e.nextSibling), l.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (hc(l), pi(l));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(l);
    }
  }
  function Uy(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var u = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (a) {
        if (!t[La])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (((n = t.getAttribute("rel")), n === "stylesheet" && t.hasAttribute("data-precedence"))) break;
              if (
                n !== u.rel ||
                t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) ||
                t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                t.getAttribute("title") !== (u.title == null ? null : u.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((n = t.getAttribute("src")),
                (n !== (u.src == null ? null : u.src) ||
                  t.getAttribute("type") !== (u.type == null ? null : u.type) ||
                  t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  n &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var n = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && t.getAttribute("name") === n) return t;
      } else return t;
      if (((t = Ae(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function Ny(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l) ||
        ((t = Ae(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function _d(t, e) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e) ||
        ((t = Ae(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function yc(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function vc(t) {
    return t.data === "$!" || (t.data === "$?" && t.ownerDocument.readyState !== "loading");
  }
  function Hy(t, e) {
    var l = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || l.readyState !== "loading") e();
    else {
      var a = function () {
        (e(), l.removeEventListener("DOMContentLoaded", a));
      };
      (l.addEventListener("DOMContentLoaded", a), (t._reactRetry = a));
    }
  }
  function Ae(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (
          ((e = t.data), e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
        )
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var gc = null;
  function Md(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "/$" || l === "/&") {
          if (e === 0) return Ae(t.nextSibling);
          e--;
        } else (l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&") || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Od(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (e === 0) return t;
          e--;
        } else (l !== "/$" && l !== "/&") || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function xd(t, e, l) {
    switch (((e = Xn(l)), t)) {
      case "html":
        if (((t = e.documentElement), !t)) throw Error(c(452));
        return t;
      case "head":
        if (((t = e.head), !t)) throw Error(c(453));
        return t;
      case "body":
        if (((t = e.body), !t)) throw Error(c(454));
        return t;
      default:
        throw Error(c(451));
    }
  }
  function Eu(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    pi(t);
  }
  var Re = new Map(),
    Dd = new Set();
  function Qn(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var ll = B.d;
  B.d = { f: By, r: qy, D: jy, C: Yy, L: Ly, m: Gy, X: Qy, S: Xy, M: Zy };
  function By() {
    var t = ll.f(),
      e = Nn();
    return t || e;
  }
  function qy(t) {
    var e = Il(t);
    e !== null && e.tag === 5 && e.type === "form" ? wo(e) : ll.r(t);
  }
  var Da = typeof document > "u" ? null : document;
  function Cd(t, e, l) {
    var a = Da;
    if (a && typeof e == "string" && e) {
      var u = ge(e);
      ((u = 'link[rel="' + t + '"][href="' + u + '"]'),
        typeof l == "string" && (u += '[crossorigin="' + l + '"]'),
        Dd.has(u) ||
          (Dd.add(u),
          (t = { rel: t, crossOrigin: l, href: e }),
          a.querySelector(u) === null &&
            ((e = a.createElement("link")), Kt(e, "link", t), Lt(e), a.head.appendChild(e))));
    }
  }
  function jy(t) {
    (ll.D(t), Cd("dns-prefetch", t, null));
  }
  function Yy(t, e) {
    (ll.C(t, e), Cd("preconnect", t, e));
  }
  function Ly(t, e, l) {
    ll.L(t, e, l);
    var a = Da;
    if (a && t && e) {
      var u = 'link[rel="preload"][as="' + ge(e) + '"]';
      e === "image" && l && l.imageSrcSet
        ? ((u += '[imagesrcset="' + ge(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == "string" && (u += '[imagesizes="' + ge(l.imageSizes) + '"]'))
        : (u += '[href="' + ge(t) + '"]');
      var n = u;
      switch (e) {
        case "style":
          n = Ca(t);
          break;
        case "script":
          n = Ua(t);
      }
      Re.has(n) ||
        ((t = A({ rel: "preload", href: e === "image" && l && l.imageSrcSet ? void 0 : t, as: e }, l)),
        Re.set(n, t),
        a.querySelector(u) !== null ||
          (e === "style" && a.querySelector(Tu(n))) ||
          (e === "script" && a.querySelector(zu(n))) ||
          ((e = a.createElement("link")), Kt(e, "link", t), Lt(e), a.head.appendChild(e)));
    }
  }
  function Gy(t, e) {
    ll.m(t, e);
    var l = Da;
    if (l && t) {
      var a = e && typeof e.as == "string" ? e.as : "script",
        u = 'link[rel="modulepreload"][as="' + ge(a) + '"][href="' + ge(t) + '"]',
        n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = Ua(t);
      }
      if (!Re.has(n) && ((t = A({ rel: "modulepreload", href: t }, e)), Re.set(n, t), l.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(zu(n))) return;
        }
        ((a = l.createElement("link")), Kt(a, "link", t), Lt(a), l.head.appendChild(a));
      }
    }
  }
  function Xy(t, e, l) {
    ll.S(t, e, l);
    var a = Da;
    if (a && t) {
      var u = Pl(a).hoistableStyles,
        n = Ca(t);
      e = e || "default";
      var i = u.get(n);
      if (!i) {
        var r = { loading: 0, preload: null };
        if ((i = a.querySelector(Tu(n)))) r.loading = 5;
        else {
          ((t = A({ rel: "stylesheet", href: t, "data-precedence": e }, l)), (l = Re.get(n)) && pc(t, l));
          var m = (i = a.createElement("link"));
          (Lt(m),
            Kt(m, "link", t),
            (m._p = new Promise(function (T, _) {
              ((m.onload = T), (m.onerror = _));
            })),
            m.addEventListener("load", function () {
              r.loading |= 1;
            }),
            m.addEventListener("error", function () {
              r.loading |= 2;
            }),
            (r.loading |= 4),
            Zn(i, e, a));
        }
        ((i = { type: "stylesheet", instance: i, count: 1, state: r }), u.set(n, i));
      }
    }
  }
  function Qy(t, e) {
    ll.X(t, e);
    var l = Da;
    if (l && t) {
      var a = Pl(l).hoistableScripts,
        u = Ua(t),
        n = a.get(u);
      n ||
        ((n = l.querySelector(zu(u))),
        n ||
          ((t = A({ src: t, async: !0 }, e)),
          (e = Re.get(u)) && Sc(t, e),
          (n = l.createElement("script")),
          Lt(n),
          Kt(n, "link", t),
          l.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function Zy(t, e) {
    ll.M(t, e);
    var l = Da;
    if (l && t) {
      var a = Pl(l).hoistableScripts,
        u = Ua(t),
        n = a.get(u);
      n ||
        ((n = l.querySelector(zu(u))),
        n ||
          ((t = A({ src: t, async: !0, type: "module" }, e)),
          (e = Re.get(u)) && Sc(t, e),
          (n = l.createElement("script")),
          Lt(n),
          Kt(n, "link", t),
          l.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function Ud(t, e, l, a) {
    var u = (u = lt.current) ? Qn(u) : null;
    if (!u) throw Error(c(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string"
          ? ((e = Ca(l.href)),
            (l = Pl(u).hoistableStyles),
            (a = l.get(e)),
            a || ((a = { type: "style", instance: null, count: 0, state: null }), l.set(e, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = Ca(l.href);
          var n = Pl(u).hoistableStyles,
            i = n.get(t);
          if (
            (i ||
              ((u = u.ownerDocument || u),
              (i = { type: "stylesheet", instance: null, count: 0, state: { loading: 0, preload: null } }),
              n.set(t, i),
              (n = u.querySelector(Tu(t))) && !n._p && ((i.instance = n), (i.state.loading = 5)),
              Re.has(t) ||
                ((l = {
                  rel: "preload",
                  as: "style",
                  href: l.href,
                  crossOrigin: l.crossOrigin,
                  integrity: l.integrity,
                  media: l.media,
                  hrefLang: l.hrefLang,
                  referrerPolicy: l.referrerPolicy,
                }),
                Re.set(t, l),
                n || Vy(u, t, l, i.state))),
            e && a === null)
          )
            throw Error(c(528, ""));
          return i;
        }
        if (e && a !== null) throw Error(c(529, ""));
        return null;
      case "script":
        return (
          (e = l.async),
          (l = l.src),
          typeof l == "string" && e && typeof e != "function" && typeof e != "symbol"
            ? ((e = Ua(l)),
              (l = Pl(u).hoistableScripts),
              (a = l.get(e)),
              a || ((a = { type: "script", instance: null, count: 0, state: null }), l.set(e, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(c(444, t));
    }
  }
  function Ca(t) {
    return 'href="' + ge(t) + '"';
  }
  function Tu(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Nd(t) {
    return A({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function Vy(t, e, l, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]")
      ? (a.loading = 1)
      : ((e = t.createElement("link")),
        (a.preload = e),
        e.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        e.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        Kt(e, "link", l),
        Lt(e),
        t.head.appendChild(e));
  }
  function Ua(t) {
    return '[src="' + ge(t) + '"]';
  }
  function zu(t) {
    return "script[async]" + t;
  }
  function Hd(t, e, l) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case "style":
          var a = t.querySelector('style[data-href~="' + ge(l.href) + '"]');
          if (a) return ((e.instance = a), Lt(a), a);
          var u = A({}, l, { "data-href": l.href, "data-precedence": l.precedence, href: null, precedence: null });
          return (
            (a = (t.ownerDocument || t).createElement("style")),
            Lt(a),
            Kt(a, "style", u),
            Zn(a, l.precedence, t),
            (e.instance = a)
          );
        case "stylesheet":
          u = Ca(l.href);
          var n = t.querySelector(Tu(u));
          if (n) return ((e.state.loading |= 4), (e.instance = n), Lt(n), n);
          ((a = Nd(l)), (u = Re.get(u)) && pc(a, u), (n = (t.ownerDocument || t).createElement("link")), Lt(n));
          var i = n;
          return (
            (i._p = new Promise(function (r, m) {
              ((i.onload = r), (i.onerror = m));
            })),
            Kt(n, "link", a),
            (e.state.loading |= 4),
            Zn(n, l.precedence, t),
            (e.instance = n)
          );
        case "script":
          return (
            (n = Ua(l.src)),
            (u = t.querySelector(zu(n)))
              ? ((e.instance = u), Lt(u), u)
              : ((a = l),
                (u = Re.get(n)) && ((a = A({}, l)), Sc(a, u)),
                (t = t.ownerDocument || t),
                (u = t.createElement("script")),
                Lt(u),
                Kt(u, "link", a),
                t.head.appendChild(u),
                (e.instance = u))
          );
        case "void":
          return null;
        default:
          throw Error(c(443, e.type));
      }
    else
      e.type === "stylesheet" &&
        (e.state.loading & 4) === 0 &&
        ((a = e.instance), (e.state.loading |= 4), Zn(a, l.precedence, t));
    return e.instance;
  }
  function Zn(t, e, l) {
    for (
      var a = l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        u = a.length ? a[a.length - 1] : null,
        n = u,
        i = 0;
      i < a.length;
      i++
    ) {
      var r = a[i];
      if (r.dataset.precedence === e) n = r;
      else if (n !== u) break;
    }
    n
      ? n.parentNode.insertBefore(t, n.nextSibling)
      : ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
  }
  function pc(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function Sc(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var Vn = null;
  function Bd(t, e, l) {
    if (Vn === null) {
      var a = new Map(),
        u = (Vn = new Map());
      u.set(l, a);
    } else ((u = Vn), (a = u.get(l)), a || ((a = new Map()), u.set(l, a)));
    if (a.has(t)) return a;
    for (a.set(t, null), l = l.getElementsByTagName(t), u = 0; u < l.length; u++) {
      var n = l[u];
      if (
        !(n[La] || n[Xt] || (t === "link" && n.getAttribute("rel") === "stylesheet")) &&
        n.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var i = n.getAttribute(e) || "";
        i = t + i;
        var r = a.get(i);
        r ? r.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function qd(t, e, l) {
    ((t = t.ownerDocument || t), t.head.insertBefore(l, e === "title" ? t.querySelector("head > title") : null));
  }
  function Ky(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
        switch (e.rel) {
          case "stylesheet":
            return ((t = e.disabled), typeof e.precedence == "string" && t == null);
          default:
            return !0;
        }
      case "script":
        if (
          e.async &&
          typeof e.async != "function" &&
          typeof e.async != "symbol" &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function jd(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Jy(t, e, l, a) {
    if (
      l.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var u = Ca(a.href),
          n = e.querySelector(Tu(u));
        if (n) {
          ((e = n._p),
            e !== null &&
              typeof e == "object" &&
              typeof e.then == "function" &&
              (t.count++, (t = Kn.bind(t)), e.then(t, t)),
            (l.state.loading |= 4),
            (l.instance = n),
            Lt(n));
          return;
        }
        ((n = e.ownerDocument || e), (a = Nd(a)), (u = Re.get(u)) && pc(a, u), (n = n.createElement("link")), Lt(n));
        var i = n;
        ((i._p = new Promise(function (r, m) {
          ((i.onload = r), (i.onerror = m));
        })),
          Kt(n, "link", a),
          (l.instance = n));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(l, e),
        (e = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (t.count++, (l = Kn.bind(t)), e.addEventListener("load", l), e.addEventListener("error", l)));
    }
  }
  var bc = 0;
  function wy(t, e) {
    return (
      t.stylesheets && t.count === 0 && wn(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (l) {
            var a = setTimeout(function () {
              if ((t.stylesheets && wn(t, t.stylesheets), t.unsuspend)) {
                var n = t.unsuspend;
                ((t.unsuspend = null), n());
              }
            }, 6e4 + e);
            0 < t.imgBytes && bc === 0 && (bc = 62500 * My());
            var u = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1), t.count === 0 && (t.stylesheets && wn(t, t.stylesheets), t.unsuspend))
                ) {
                  var n = t.unsuspend;
                  ((t.unsuspend = null), n());
                }
              },
              (t.imgBytes > bc ? 50 : 800) + e,
            );
            return (
              (t.unsuspend = l),
              function () {
                ((t.unsuspend = null), clearTimeout(a), clearTimeout(u));
              }
            );
          }
        : null
    );
  }
  function Kn() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) wn(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Jn = null;
  function wn(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null && (t.count++, (Jn = new Map()), e.forEach($y, t), (Jn = null), Kn.call(t)));
  }
  function $y(t, e) {
    if (!(e.state.loading & 4)) {
      var l = Jn.get(t);
      if (l) var a = l.get(null);
      else {
        ((l = new Map()), Jn.set(t, l));
        for (var u = t.querySelectorAll("link[data-precedence],style[data-precedence]"), n = 0; n < u.length; n++) {
          var i = u[n];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") &&
            (l.set(i.dataset.precedence, i), (a = i));
        }
        a && l.set(null, a);
      }
      ((u = e.instance),
        (i = u.getAttribute("data-precedence")),
        (n = l.get(i) || a),
        n === a && l.set(null, u),
        l.set(i, u),
        this.count++,
        (a = Kn.bind(this)),
        u.addEventListener("load", a),
        u.addEventListener("error", a),
        n
          ? n.parentNode.insertBefore(u, n.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(u, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var Au = { $$typeof: w, Provider: null, Consumer: null, _currentValue: $, _currentValue2: $, _threadCount: 0 };
  function Wy(t, e, l, a, u, n, i, r, m) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
      (this.callbackPriority = 0),
      (this.expirationTimes = hi(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = hi(0)),
      (this.hiddenUpdates = hi(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = n),
      (this.onRecoverableError = i),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = m),
      (this.incompleteTransitions = new Map()));
  }
  function Yd(t, e, l, a, u, n, i, r, m, T, _, U) {
    return (
      (t = new Wy(t, e, l, i, m, T, _, U, r)),
      (e = 1),
      n === !0 && (e |= 24),
      (n = ce(3, null, null, e)),
      (t.current = n),
      (n.stateNode = t),
      (e = Ii()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (n.memoizedState = { element: a, isDehydrated: l, cache: e }),
      lf(n),
      t
    );
  }
  function Ld(t) {
    return t ? ((t = ra), t) : ra;
  }
  function Gd(t, e, l, a, u, n) {
    ((u = Ld(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = ml(e)),
      (a.payload = { element: l }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (l = hl(t, a, e)),
      l !== null && (ae(l, t, e), lu(l, t, e)));
  }
  function Xd(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function Ec(t, e) {
    (Xd(t, e), (t = t.alternate) && Xd(t, e));
  }
  function Qd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ql(t, 67108864);
      (e !== null && ae(e, t, 67108864), Ec(t, 67108864));
    }
  }
  function Zd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = me();
      e = yi(e);
      var l = ql(t, e);
      (l !== null && ae(l, t, e), Ec(t, e));
    }
  }
  var $n = !0;
  function ky(t, e, l, a) {
    var u = x.T;
    x.T = null;
    var n = B.p;
    try {
      ((B.p = 2), Tc(t, e, l, a));
    } finally {
      ((B.p = n), (x.T = u));
    }
  }
  function Fy(t, e, l, a) {
    var u = x.T;
    x.T = null;
    var n = B.p;
    try {
      ((B.p = 8), Tc(t, e, l, a));
    } finally {
      ((B.p = n), (x.T = u));
    }
  }
  function Tc(t, e, l, a) {
    if ($n) {
      var u = zc(a);
      if (u === null) (cc(t, e, a, Wn, l), Kd(t, a));
      else if (Py(u, t, e, l, a)) a.stopPropagation();
      else if ((Kd(t, a), e & 4 && -1 < Iy.indexOf(t))) {
        for (; u !== null; ) {
          var n = Il(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var i = Cl(n.pendingLanes);
                  if (i !== 0) {
                    var r = n;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; i; ) {
                      var m = 1 << (31 - ie(i));
                      ((r.entanglements[1] |= m), (i &= ~m));
                    }
                    (je(n), (ot & 6) === 0 && ((Cn = ue() + 500), pu(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((r = ql(n, 2)), r !== null && ae(r, n, 2), Nn(), Ec(n, 2));
            }
          if (((n = zc(a)), n === null && cc(t, e, a, Wn, l), n === u)) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else cc(t, e, a, null, l);
    }
  }
  function zc(t) {
    return ((t = Ai(t)), Ac(t));
  }
  var Wn = null;
  function Ac(t) {
    if (((Wn = null), (t = Fl(t)), t !== null)) {
      var e = h(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (((t = S(e)), t !== null)) return t;
          t = null;
        } else if (l === 31) {
          if (((t = M(e)), t !== null)) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Wn = t), null);
  }
  function Vd(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (jm()) {
          case Fc:
            return 2;
          case Ic:
            return 8;
          case ju:
          case Ym:
            return 32;
          case Pc:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Rc = !1,
    Rl = null,
    _l = null,
    Ml = null,
    Ru = new Map(),
    _u = new Map(),
    Ol = [],
    Iy =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function Kd(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Rl = null;
        break;
      case "dragenter":
      case "dragleave":
        _l = null;
        break;
      case "mouseover":
      case "mouseout":
        Ml = null;
        break;
      case "pointerover":
      case "pointerout":
        Ru.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        _u.delete(e.pointerId);
    }
  }
  function Mu(t, e, l, a, u, n) {
    return t === null || t.nativeEvent !== n
      ? ((t = { blockedOn: e, domEventName: l, eventSystemFlags: a, nativeEvent: n, targetContainers: [u] }),
        e !== null && ((e = Il(e)), e !== null && Qd(e)),
        t)
      : ((t.eventSystemFlags |= a), (e = t.targetContainers), u !== null && e.indexOf(u) === -1 && e.push(u), t);
  }
  function Py(t, e, l, a, u) {
    switch (e) {
      case "focusin":
        return ((Rl = Mu(Rl, t, e, l, a, u)), !0);
      case "dragenter":
        return ((_l = Mu(_l, t, e, l, a, u)), !0);
      case "mouseover":
        return ((Ml = Mu(Ml, t, e, l, a, u)), !0);
      case "pointerover":
        var n = u.pointerId;
        return (Ru.set(n, Mu(Ru.get(n) || null, t, e, l, a, u)), !0);
      case "gotpointercapture":
        return ((n = u.pointerId), _u.set(n, Mu(_u.get(n) || null, t, e, l, a, u)), !0);
    }
    return !1;
  }
  function Jd(t) {
    var e = Fl(t.target);
    if (e !== null) {
      var l = h(e);
      if (l !== null) {
        if (((e = l.tag), e === 13)) {
          if (((e = S(l)), e !== null)) {
            ((t.blockedOn = e),
              nr(t.priority, function () {
                Zd(l);
              }));
            return;
          }
        } else if (e === 31) {
          if (((e = M(l)), e !== null)) {
            ((t.blockedOn = e),
              nr(t.priority, function () {
                Zd(l);
              }));
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function kn(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = zc(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(l.type, l);
        ((zi = a), l.target.dispatchEvent(a), (zi = null));
      } else return ((e = Il(l)), e !== null && Qd(e), (t.blockedOn = l), !1);
      e.shift();
    }
    return !0;
  }
  function wd(t, e, l) {
    kn(t) && l.delete(e);
  }
  function t0() {
    ((Rc = !1),
      Rl !== null && kn(Rl) && (Rl = null),
      _l !== null && kn(_l) && (_l = null),
      Ml !== null && kn(Ml) && (Ml = null),
      Ru.forEach(wd),
      _u.forEach(wd));
  }
  function Fn(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null), Rc || ((Rc = !0), f.unstable_scheduleCallback(f.unstable_NormalPriority, t0)));
  }
  var In = null;
  function $d(t) {
    In !== t &&
      ((In = t),
      f.unstable_scheduleCallback(f.unstable_NormalPriority, function () {
        In === t && (In = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e],
            a = t[e + 1],
            u = t[e + 2];
          if (typeof a != "function") {
            if (Ac(a || l) === null) continue;
            break;
          }
          var n = Il(l);
          n !== null && (t.splice(e, 3), (e -= 3), zf(n, { pending: !0, data: u, method: l.method, action: a }, a, u));
        }
      }));
  }
  function Na(t) {
    function e(m) {
      return Fn(m, t);
    }
    (Rl !== null && Fn(Rl, t), _l !== null && Fn(_l, t), Ml !== null && Fn(Ml, t), Ru.forEach(e), _u.forEach(e));
    for (var l = 0; l < Ol.length; l++) {
      var a = Ol[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Ol.length && ((l = Ol[0]), l.blockedOn === null); ) (Jd(l), l.blockedOn === null && Ol.shift());
    if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
      for (a = 0; a < l.length; a += 3) {
        var u = l[a],
          n = l[a + 1],
          i = u[Ft] || null;
        if (typeof n == "function") i || $d(l);
        else if (i) {
          var r = null;
          if (n && n.hasAttribute("formAction")) {
            if (((u = n), (i = n[Ft] || null))) r = i.formAction;
            else if (Ac(u) !== null) continue;
          } else r = i.action;
          (typeof r == "function" ? (l[a + 1] = r) : (l.splice(a, 3), (a -= 3)), $d(l));
        }
      }
  }
  function Wd() {
    function t(n) {
      n.canIntercept &&
        n.info === "react-transition" &&
        n.intercept({
          handler: function () {
            return new Promise(function (i) {
              return (u = i);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function e() {
      (u !== null && (u(), (u = null)), a || setTimeout(l, 20));
    }
    function l() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n &&
          n.url != null &&
          navigation.navigate(n.url, { state: n.getState(), info: "react-transition", history: "replace" });
      }
    }
    if (typeof navigation == "object") {
      var a = !1,
        u = null;
      return (
        navigation.addEventListener("navigate", t),
        navigation.addEventListener("navigatesuccess", e),
        navigation.addEventListener("navigateerror", e),
        setTimeout(l, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener("navigate", t),
            navigation.removeEventListener("navigatesuccess", e),
            navigation.removeEventListener("navigateerror", e),
            u !== null && (u(), (u = null)));
        }
      );
    }
  }
  function _c(t) {
    this._internalRoot = t;
  }
  ((Pn.prototype.render = _c.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(c(409));
      var l = e.current,
        a = me();
      Gd(l, a, t, e, null, null);
    }),
    (Pn.prototype.unmount = _c.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (Gd(t.current, 2, null, t, null, null), Nn(), (e[kl] = null));
        }
      }));
  function Pn(t) {
    this._internalRoot = t;
  }
  Pn.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = ur();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Ol.length && e !== 0 && e < Ol[l].priority; l++);
      (Ol.splice(l, 0, t), l === 0 && Jd(t));
    }
  };
  var kd = o.version;
  if (kd !== "19.2.6") throw Error(c(527, kd, "19.2.6"));
  B.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(c(188)) : ((t = Object.keys(t).join(",")), Error(c(268, t)));
    return ((t = v(e)), (t = t !== null ? D(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var e0 = {
    bundleType: 0,
    version: "19.2.6",
    rendererPackageName: "react-dom",
    currentDispatcherRef: x,
    reconcilerVersion: "19.2.6",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ti = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ti.isDisabled && ti.supportsFiber)
      try {
        ((qa = ti.inject(e0)), (ne = ti));
      } catch {}
  }
  return (
    (xu.createRoot = function (t, e) {
      if (!d(t)) throw Error(c(299));
      var l = !1,
        a = "",
        u = as,
        n = us,
        i = ns;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (l = !0),
          e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (u = e.onUncaughtError),
          e.onCaughtError !== void 0 && (n = e.onCaughtError),
          e.onRecoverableError !== void 0 && (i = e.onRecoverableError)),
        (e = Yd(t, 1, !1, null, null, l, a, null, u, n, i, Wd)),
        (t[kl] = e.current),
        fc(t),
        new _c(e)
      );
    }),
    (xu.hydrateRoot = function (t, e, l) {
      if (!d(t)) throw Error(c(299));
      var a = !1,
        u = "",
        n = as,
        i = us,
        r = ns,
        m = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (a = !0),
          l.identifierPrefix !== void 0 && (u = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (n = l.onUncaughtError),
          l.onCaughtError !== void 0 && (i = l.onCaughtError),
          l.onRecoverableError !== void 0 && (r = l.onRecoverableError),
          l.formState !== void 0 && (m = l.formState)),
        (e = Yd(t, 1, !0, e, l ?? null, a, u, m, n, i, r, Wd)),
        (e.context = Ld(null)),
        (l = e.current),
        (a = me()),
        (a = yi(a)),
        (u = ml(a)),
        (u.callback = null),
        hl(l, u, a),
        (l = a),
        (e.current.lanes = l),
        Ya(e, l),
        je(e),
        (t[kl] = e.current),
        fc(t),
        new Pn(e)
      );
    }),
    (xu.version = "19.2.6"),
    xu
  );
}
var im;
function d0() {
  if (im) return xc.exports;
  im = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (o) {
        console.error(o);
      }
  }
  return (f(), (xc.exports = s0()), xc.exports);
}
var m0 = d0();
const h0 = hm(m0);
/**
 * react-router v7.15.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var fm = "popstate";
function cm(f) {
  return (
    typeof f == "object" && f != null && "pathname" in f && "search" in f && "hash" in f && "state" in f && "key" in f
  );
}
function y0(f = {}) {
  function o(d, h) {
    let { pathname: S = "/", search: M = "", hash: b = "" } = Wl(d.location.hash.substring(1));
    return (
      !S.startsWith("/") && !S.startsWith(".") && (S = "/" + S),
      qc(
        "",
        { pathname: S, search: M, hash: b },
        (h.state && h.state.usr) || null,
        (h.state && h.state.key) || "default",
      )
    );
  }
  function s(d, h) {
    let S = d.document.querySelector("base"),
      M = "";
    if (S && S.getAttribute("href")) {
      let b = d.location.href,
        v = b.indexOf("#");
      M = v === -1 ? b : b.slice(0, v);
    }
    return M + "#" + (typeof h == "string" ? h : Cu(h));
  }
  function c(d, h) {
    Ce(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(h)})`,
    );
  }
  return g0(o, s, c, f);
}
function _t(f, o) {
  if (f === !1 || f === null || typeof f > "u") throw new Error(o);
}
function Ce(f, o) {
  if (!f) {
    typeof console < "u" && console.warn(o);
    try {
      throw new Error(o);
    } catch {}
  }
}
function v0() {
  return Math.random().toString(36).substring(2, 10);
}
function rm(f, o) {
  return {
    usr: f.state,
    key: f.key,
    idx: o,
    masked: f.mask ? { pathname: f.pathname, search: f.search, hash: f.hash } : void 0,
  };
}
function qc(f, o, s = null, c, d) {
  return {
    pathname: typeof f == "string" ? f : f.pathname,
    search: "",
    hash: "",
    ...(typeof o == "string" ? Wl(o) : o),
    state: s,
    key: (o && o.key) || c || v0(),
    mask: d,
  };
}
function Cu({ pathname: f = "/", search: o = "", hash: s = "" }) {
  return (
    o && o !== "?" && (f += o.charAt(0) === "?" ? o : "?" + o),
    s && s !== "#" && (f += s.charAt(0) === "#" ? s : "#" + s),
    f
  );
}
function Wl(f) {
  let o = {};
  if (f) {
    let s = f.indexOf("#");
    s >= 0 && ((o.hash = f.substring(s)), (f = f.substring(0, s)));
    let c = f.indexOf("?");
    (c >= 0 && ((o.search = f.substring(c)), (f = f.substring(0, c))), f && (o.pathname = f));
  }
  return o;
}
function g0(f, o, s, c = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = c,
    S = d.history,
    M = "POP",
    b = null,
    v = D();
  v == null && ((v = 0), S.replaceState({ ...S.state, idx: v }, ""));
  function D() {
    return (S.state || { idx: null }).idx;
  }
  function A() {
    M = "POP";
    let L = D(),
      q = L == null ? null : L - v;
    ((v = L), b && b({ action: M, location: G.location, delta: q }));
  }
  function H(L, q) {
    M = "PUSH";
    let k = cm(L) ? L : qc(G.location, L, q);
    (s && s(k, L), (v = D() + 1));
    let w = rm(k, v),
      yt = G.createHref(k.mask || k);
    try {
      S.pushState(w, "", yt);
    } catch (dt) {
      if (dt instanceof DOMException && dt.name === "DataCloneError") throw dt;
      d.location.assign(yt);
    }
    h && b && b({ action: M, location: G.location, delta: 1 });
  }
  function K(L, q) {
    M = "REPLACE";
    let k = cm(L) ? L : qc(G.location, L, q);
    (s && s(k, L), (v = D()));
    let w = rm(k, v),
      yt = G.createHref(k.mask || k);
    (S.replaceState(w, "", yt), h && b && b({ action: M, location: G.location, delta: 0 }));
  }
  function V(L) {
    return p0(L);
  }
  let G = {
    get action() {
      return M;
    },
    get location() {
      return f(d, S);
    },
    listen(L) {
      if (b) throw new Error("A history only accepts one active listener");
      return (
        d.addEventListener(fm, A),
        (b = L),
        () => {
          (d.removeEventListener(fm, A), (b = null));
        }
      );
    },
    createHref(L) {
      return o(d, L);
    },
    createURL: V,
    encodeLocation(L) {
      let q = V(L);
      return { pathname: q.pathname, search: q.search, hash: q.hash };
    },
    push: H,
    replace: K,
    go(L) {
      return S.go(L);
    },
  };
  return G;
}
function p0(f, o = !1) {
  let s = "http://localhost";
  (typeof window < "u" && (s = window.location.origin !== "null" ? window.location.origin : window.location.href),
    _t(s, "No window.location.(origin|href) available to create URL"));
  let c = typeof f == "string" ? f : Cu(f);
  return ((c = c.replace(/ $/, "%20")), !o && c.startsWith("//") && (c = s + c), new URL(c, s));
}
function ym(f, o, s = "/") {
  return S0(f, o, s, !1);
}
function S0(f, o, s, c, d) {
  let h = typeof o == "string" ? Wl(o) : o,
    S = al(h.pathname || "/", s);
  if (S == null) return null;
  let M = b0(f),
    b = null,
    v = U0(S);
  for (let D = 0; b == null && D < M.length; ++D) b = D0(M[D], v, c);
  return b;
}
function b0(f) {
  let o = vm(f);
  return (E0(o), o);
}
function vm(f, o = [], s = [], c = "", d = !1) {
  let h = (S, M, b = d, v) => {
    let D = {
      relativePath: v === void 0 ? S.path || "" : v,
      caseSensitive: S.caseSensitive === !0,
      childrenIndex: M,
      route: S,
    };
    if (D.relativePath.startsWith("/")) {
      if (!D.relativePath.startsWith(c) && b) return;
      (_t(
        D.relativePath.startsWith(c),
        `Absolute route path "${D.relativePath}" nested under path "${c}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (D.relativePath = D.relativePath.slice(c.length)));
    }
    let A = De([c, D.relativePath]),
      H = s.concat(D);
    (S.children &&
      S.children.length > 0 &&
      (_t(
        S.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${A}".`,
      ),
      vm(S.children, o, H, A, b)),
      !(S.path == null && !S.index) && o.push({ path: A, score: O0(A, S.index), routesMeta: H }));
  };
  return (
    f.forEach((S, M) => {
      var b;
      if (S.path === "" || !((b = S.path) != null && b.includes("?"))) h(S, M);
      else for (let v of gm(S.path)) h(S, M, !0, v);
    }),
    o
  );
}
function gm(f) {
  let o = f.split("/");
  if (o.length === 0) return [];
  let [s, ...c] = o,
    d = s.endsWith("?"),
    h = s.replace(/\?$/, "");
  if (c.length === 0) return d ? [h, ""] : [h];
  let S = gm(c.join("/")),
    M = [];
  return (
    M.push(...S.map((b) => (b === "" ? h : [h, b].join("/")))),
    d && M.push(...S),
    M.map((b) => (f.startsWith("/") && b === "" ? "/" : b))
  );
}
function E0(f) {
  f.sort((o, s) =>
    o.score !== s.score
      ? s.score - o.score
      : x0(
          o.routesMeta.map((c) => c.childrenIndex),
          s.routesMeta.map((c) => c.childrenIndex),
        ),
  );
}
var T0 = /^:[\w-]+$/,
  z0 = 3,
  A0 = 2,
  R0 = 1,
  _0 = 10,
  M0 = -2,
  om = (f) => f === "*";
function O0(f, o) {
  let s = f.split("/"),
    c = s.length;
  return (
    s.some(om) && (c += M0),
    o && (c += A0),
    s.filter((d) => !om(d)).reduce((d, h) => d + (T0.test(h) ? z0 : h === "" ? R0 : _0), c)
  );
}
function x0(f, o) {
  return f.length === o.length && f.slice(0, -1).every((c, d) => c === o[d]) ? f[f.length - 1] - o[o.length - 1] : 0;
}
function D0(f, o, s = !1) {
  let { routesMeta: c } = f,
    d = {},
    h = "/",
    S = [];
  for (let M = 0; M < c.length; ++M) {
    let b = c[M],
      v = M === c.length - 1,
      D = h === "/" ? o : o.slice(h.length) || "/",
      A = ui({ path: b.relativePath, caseSensitive: b.caseSensitive, end: v }, D),
      H = b.route;
    if (
      (!A &&
        v &&
        s &&
        !c[c.length - 1].route.index &&
        (A = ui({ path: b.relativePath, caseSensitive: b.caseSensitive, end: !1 }, D)),
      !A)
    )
      return null;
    (Object.assign(d, A.params),
      S.push({ params: d, pathname: De([h, A.pathname]), pathnameBase: q0(De([h, A.pathnameBase])), route: H }),
      A.pathnameBase !== "/" && (h = De([h, A.pathnameBase])));
  }
  return S;
}
function ui(f, o) {
  typeof f == "string" && (f = { path: f, caseSensitive: !1, end: !0 });
  let [s, c] = C0(f.path, f.caseSensitive, f.end),
    d = o.match(s);
  if (!d) return null;
  let h = d[0],
    S = h.replace(/(.)\/+$/, "$1"),
    M = d.slice(1);
  return {
    params: c.reduce((v, { paramName: D, isOptional: A }, H) => {
      if (D === "*") {
        let V = M[H] || "";
        S = h.slice(0, h.length - V.length).replace(/(.)\/+$/, "$1");
      }
      const K = M[H];
      return (A && !K ? (v[D] = void 0) : (v[D] = (K || "").replace(/%2F/g, "/")), v);
    }, {}),
    pathname: h,
    pathnameBase: S,
    pattern: f,
  };
}
function C0(f, o = !1, s = !0) {
  Ce(
    f === "*" || !f.endsWith("*") || f.endsWith("/*"),
    `Route path "${f}" will be treated as if it were "${f.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${f.replace(/\*$/, "/*")}".`,
  );
  let c = [],
    d =
      "^" +
      f
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(/\/:([\w-]+)(\?)?/g, (S, M, b, v, D) => {
          if ((c.push({ paramName: M, isOptional: b != null }), b)) {
            let A = D.charAt(v + S.length);
            return A && A !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
          }
          return "/([^\\/]+)";
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return (
    f.endsWith("*")
      ? (c.push({ paramName: "*" }), (d += f === "*" || f === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : s
        ? (d += "\\/*$")
        : f !== "" && f !== "/" && (d += "(?:(?=\\/|$))"),
    [new RegExp(d, o ? void 0 : "i"), c]
  );
}
function U0(f) {
  try {
    return f
      .split("/")
      .map((o) => decodeURIComponent(o).replace(/\//g, "%2F"))
      .join("/");
  } catch (o) {
    return (
      Ce(
        !1,
        `The URL path "${f}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${o}).`,
      ),
      f
    );
  }
}
function al(f, o) {
  if (o === "/") return f;
  if (!f.toLowerCase().startsWith(o.toLowerCase())) return null;
  let s = o.endsWith("/") ? o.length - 1 : o.length,
    c = f.charAt(s);
  return c && c !== "/" ? null : f.slice(s) || "/";
}
var N0 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function H0(f, o = "/") {
  let { pathname: s, search: c = "", hash: d = "" } = typeof f == "string" ? Wl(f) : f,
    h;
  return (
    s ? ((s = Sm(s)), s.startsWith("/") ? (h = sm(s.substring(1), "/")) : (h = sm(s, o))) : (h = o),
    { pathname: h, search: j0(c), hash: Y0(d) }
  );
}
function sm(f, o) {
  let s = ni(o).split("/");
  return (
    f.split("/").forEach((d) => {
      d === ".." ? s.length > 1 && s.pop() : d !== "." && s.push(d);
    }),
    s.length > 1 ? s.join("/") : "/"
  );
}
function Nc(f, o, s, c) {
  return `Cannot include a '${f}' character in a manually specified \`to.${o}\` field [${JSON.stringify(c)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function B0(f) {
  return f.filter((o, s) => s === 0 || (o.route.path && o.route.path.length > 0));
}
function pm(f) {
  let o = B0(f);
  return o.map((s, c) => (c === o.length - 1 ? s.pathname : s.pathnameBase));
}
function Xc(f, o, s, c = !1) {
  let d;
  typeof f == "string"
    ? (d = Wl(f))
    : ((d = { ...f }),
      _t(!d.pathname || !d.pathname.includes("?"), Nc("?", "pathname", "search", d)),
      _t(!d.pathname || !d.pathname.includes("#"), Nc("#", "pathname", "hash", d)),
      _t(!d.search || !d.search.includes("#"), Nc("#", "search", "hash", d)));
  let h = f === "" || d.pathname === "",
    S = h ? "/" : d.pathname,
    M;
  if (S == null) M = s;
  else {
    let A = o.length - 1;
    if (!c && S.startsWith("..")) {
      let H = S.split("/");
      for (; H[0] === ".."; ) (H.shift(), (A -= 1));
      d.pathname = H.join("/");
    }
    M = A >= 0 ? o[A] : "/";
  }
  let b = H0(d, M),
    v = S && S !== "/" && S.endsWith("/"),
    D = (h || S === ".") && s.endsWith("/");
  return (!b.pathname.endsWith("/") && (v || D) && (b.pathname += "/"), b);
}
var Sm = (f) => f.replace(/\/\/+/g, "/"),
  De = (f) => Sm(f.join("/")),
  ni = (f) => f.replace(/\/+$/, ""),
  q0 = (f) => ni(f).replace(/^\/*/, "/"),
  j0 = (f) => (!f || f === "?" ? "" : f.startsWith("?") ? f : "?" + f),
  Y0 = (f) => (!f || f === "#" ? "" : f.startsWith("#") ? f : "#" + f),
  L0 = class {
    constructor(f, o, s, c = !1) {
      ((this.status = f),
        (this.statusText = o || ""),
        (this.internal = c),
        s instanceof Error ? ((this.data = s.toString()), (this.error = s)) : (this.data = s));
    }
  };
function G0(f) {
  return (
    f != null &&
    typeof f.status == "number" &&
    typeof f.statusText == "string" &&
    typeof f.internal == "boolean" &&
    "data" in f
  );
}
function X0(f) {
  let o = f.map((s) => s.route.path).filter(Boolean);
  return De(o) || "/";
}
var bm = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Em(f, o) {
  let s = f;
  if (typeof s != "string" || !N0.test(s)) return { absoluteURL: void 0, isExternal: !1, to: s };
  let c = s,
    d = !1;
  if (bm)
    try {
      let h = new URL(window.location.href),
        S = s.startsWith("//") ? new URL(h.protocol + s) : new URL(s),
        M = al(S.pathname, o);
      S.origin === h.origin && M != null ? (s = M + S.search + S.hash) : (d = !0);
    } catch {
      Ce(
        !1,
        `<Link to="${s}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: c, isExternal: d, to: s };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Tm = ["POST", "PUT", "PATCH", "DELETE"];
new Set(Tm);
var Q0 = ["GET", ...Tm];
new Set(Q0);
var Ha = O.createContext(null);
Ha.displayName = "DataRouter";
var ii = O.createContext(null);
ii.displayName = "DataRouterState";
var zm = O.createContext(!1);
function Z0() {
  return O.useContext(zm);
}
var Am = O.createContext({ isTransitioning: !1 });
Am.displayName = "ViewTransition";
var V0 = O.createContext(new Map());
V0.displayName = "Fetchers";
var K0 = O.createContext(null);
K0.displayName = "Await";
var _e = O.createContext(null);
_e.displayName = "Navigation";
var Nu = O.createContext(null);
Nu.displayName = "Location";
var Ye = O.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Ye.displayName = "Route";
var Qc = O.createContext(null);
Qc.displayName = "RouteError";
var Rm = "REACT_ROUTER_ERROR",
  J0 = "REDIRECT",
  w0 = "ROUTE_ERROR_RESPONSE";
function $0(f) {
  if (f.startsWith(`${Rm}:${J0}:{`))
    try {
      let o = JSON.parse(f.slice(28));
      if (
        typeof o == "object" &&
        o &&
        typeof o.status == "number" &&
        typeof o.statusText == "string" &&
        typeof o.location == "string" &&
        typeof o.reloadDocument == "boolean" &&
        typeof o.replace == "boolean"
      )
        return o;
    } catch {}
}
function W0(f) {
  if (f.startsWith(`${Rm}:${w0}:{`))
    try {
      let o = JSON.parse(f.slice(40));
      if (typeof o == "object" && o && typeof o.status == "number" && typeof o.statusText == "string")
        return new L0(o.status, o.statusText, o.data);
    } catch {}
}
function k0(f, { relative: o } = {}) {
  _t(Hu(), "useHref() may be used only in the context of a <Router> component.");
  let { basename: s, navigator: c } = O.useContext(_e),
    { hash: d, pathname: h, search: S } = Bu(f, { relative: o }),
    M = h;
  return (s !== "/" && (M = h === "/" ? s : De([s, h])), c.createHref({ pathname: M, search: S, hash: d }));
}
function Hu() {
  return O.useContext(Nu) != null;
}
function ul() {
  return (
    _t(Hu(), "useLocation() may be used only in the context of a <Router> component."),
    O.useContext(Nu).location
  );
}
var _m = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Mm(f) {
  O.useContext(_e).static || O.useLayoutEffect(f);
}
function F0() {
  let { isDataRoute: f } = O.useContext(Ye);
  return f ? sv() : I0();
}
function I0() {
  _t(Hu(), "useNavigate() may be used only in the context of a <Router> component.");
  let f = O.useContext(Ha),
    { basename: o, navigator: s } = O.useContext(_e),
    { matches: c } = O.useContext(Ye),
    { pathname: d } = ul(),
    h = JSON.stringify(pm(c)),
    S = O.useRef(!1);
  return (
    Mm(() => {
      S.current = !0;
    }),
    O.useCallback(
      (b, v = {}) => {
        if ((Ce(S.current, _m), !S.current)) return;
        if (typeof b == "number") {
          s.go(b);
          return;
        }
        let D = Xc(b, JSON.parse(h), d, v.relative === "path");
        (f == null && o !== "/" && (D.pathname = D.pathname === "/" ? o : De([o, D.pathname])),
          (v.replace ? s.replace : s.push)(D, v.state, v));
      },
      [o, s, h, d, f],
    )
  );
}
O.createContext(null);
function P0() {
  let { matches: f } = O.useContext(Ye),
    o = f[f.length - 1];
  return (o == null ? void 0 : o.params) ?? {};
}
function Bu(f, { relative: o } = {}) {
  let { matches: s } = O.useContext(Ye),
    { pathname: c } = ul(),
    d = JSON.stringify(pm(s));
  return O.useMemo(() => Xc(f, JSON.parse(d), c, o === "path"), [f, d, c, o]);
}
function tv(f, o) {
  return Om(f, o);
}
function Om(f, o, s) {
  var L;
  _t(Hu(), "useRoutes() may be used only in the context of a <Router> component.");
  let { navigator: c } = O.useContext(_e),
    { matches: d } = O.useContext(Ye),
    h = d[d.length - 1],
    S = h ? h.params : {},
    M = h ? h.pathname : "/",
    b = h ? h.pathnameBase : "/",
    v = h && h.route;
  {
    let q = (v && v.path) || "";
    Dm(
      M,
      !v || q.endsWith("*") || q.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${M}" (under <Route path="${q}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${q}"> to <Route path="${q === "/" ? "*" : `${q}/*`}">.`,
    );
  }
  let D = ul(),
    A;
  if (o) {
    let q = typeof o == "string" ? Wl(o) : o;
    (_t(
      b === "/" || ((L = q.pathname) == null ? void 0 : L.startsWith(b)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${b}" but pathname "${q.pathname}" was given in the \`location\` prop.`,
    ),
      (A = q));
  } else A = D;
  let H = A.pathname || "/",
    K = H;
  if (b !== "/") {
    let q = b.replace(/^\//, "").split("/");
    K = "/" + H.replace(/^\//, "").split("/").slice(q.length).join("/");
  }
  let V =
    s && s.state.matches.length
      ? s.state.matches.map((q) => Object.assign(q, { route: s.manifest[q.route.id] || q.route }))
      : ym(f, { pathname: K });
  (Ce(v || V != null, `No routes matched location "${A.pathname}${A.search}${A.hash}" `),
    Ce(
      V == null ||
        V[V.length - 1].route.element !== void 0 ||
        V[V.length - 1].route.Component !== void 0 ||
        V[V.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${A.pathname}${A.search}${A.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let G = nv(
    V &&
      V.map((q) =>
        Object.assign({}, q, {
          params: Object.assign({}, S, q.params),
          pathname: De([
            b,
            c.encodeLocation
              ? c.encodeLocation(q.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname
              : q.pathname,
          ]),
          pathnameBase:
            q.pathnameBase === "/"
              ? b
              : De([
                  b,
                  c.encodeLocation
                    ? c.encodeLocation(q.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23"))
                        .pathname
                    : q.pathnameBase,
                ]),
        }),
      ),
    d,
    s,
  );
  return o && G
    ? O.createElement(
        Nu.Provider,
        {
          value: {
            location: { pathname: "/", search: "", hash: "", state: null, key: "default", mask: void 0, ...A },
            navigationType: "POP",
          },
        },
        G,
      )
    : G;
}
function ev() {
  let f = ov(),
    o = G0(f) ? `${f.status} ${f.statusText}` : f instanceof Error ? f.message : JSON.stringify(f),
    s = f instanceof Error ? f.stack : null,
    c = "rgba(200,200,200, 0.5)",
    d = { padding: "0.5rem", backgroundColor: c },
    h = { padding: "2px 4px", backgroundColor: c },
    S = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", f),
    (S = O.createElement(
      O.Fragment,
      null,
      O.createElement("p", null, "💿 Hey developer 👋"),
      O.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        O.createElement("code", { style: h }, "ErrorBoundary"),
        " or",
        " ",
        O.createElement("code", { style: h }, "errorElement"),
        " prop on your route.",
      ),
    )),
    O.createElement(
      O.Fragment,
      null,
      O.createElement("h2", null, "Unexpected Application Error!"),
      O.createElement("h3", { style: { fontStyle: "italic" } }, o),
      s ? O.createElement("pre", { style: d }, s) : null,
      S,
    )
  );
}
var lv = O.createElement(ev, null),
  xm = class extends O.Component {
    constructor(f) {
      (super(f), (this.state = { location: f.location, revalidation: f.revalidation, error: f.error }));
    }
    static getDerivedStateFromError(f) {
      return { error: f };
    }
    static getDerivedStateFromProps(f, o) {
      return o.location !== f.location || (o.revalidation !== "idle" && f.revalidation === "idle")
        ? { error: f.error, location: f.location, revalidation: f.revalidation }
        : {
            error: f.error !== void 0 ? f.error : o.error,
            location: o.location,
            revalidation: f.revalidation || o.revalidation,
          };
    }
    componentDidCatch(f, o) {
      this.props.onError
        ? this.props.onError(f, o)
        : console.error("React Router caught the following error during render", f);
    }
    render() {
      let f = this.state.error;
      if (this.context && typeof f == "object" && f && "digest" in f && typeof f.digest == "string") {
        const s = W0(f.digest);
        s && (f = s);
      }
      let o =
        f !== void 0
          ? O.createElement(
              Ye.Provider,
              { value: this.props.routeContext },
              O.createElement(Qc.Provider, { value: f, children: this.props.component }),
            )
          : this.props.children;
      return this.context ? O.createElement(av, { error: f }, o) : o;
    }
  };
xm.contextType = zm;
var Hc = new WeakMap();
function av({ children: f, error: o }) {
  let { basename: s } = O.useContext(_e);
  if (typeof o == "object" && o && "digest" in o && typeof o.digest == "string") {
    let c = $0(o.digest);
    if (c) {
      let d = Hc.get(o);
      if (d) throw d;
      let h = Em(c.location, s);
      if (bm && !Hc.get(o))
        if (h.isExternal || c.reloadDocument) window.location.href = h.absoluteURL || h.to;
        else {
          const S = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(h.to, { replace: c.replace }),
          );
          throw (Hc.set(o, S), S);
        }
      return O.createElement("meta", { httpEquiv: "refresh", content: `0;url=${h.absoluteURL || h.to}` });
    }
  }
  return f;
}
function uv({ routeContext: f, match: o, children: s }) {
  let c = O.useContext(Ha);
  return (
    c &&
      c.static &&
      c.staticContext &&
      (o.route.errorElement || o.route.ErrorBoundary) &&
      (c.staticContext._deepestRenderedBoundaryId = o.route.id),
    O.createElement(Ye.Provider, { value: f }, s)
  );
}
function nv(f, o = [], s) {
  let c = s == null ? void 0 : s.state;
  if (f == null) {
    if (!c) return null;
    if (c.errors) f = c.matches;
    else if (o.length === 0 && !c.initialized && c.matches.length > 0) f = c.matches;
    else return null;
  }
  let d = f,
    h = c == null ? void 0 : c.errors;
  if (h != null) {
    let D = d.findIndex((A) => A.route.id && (h == null ? void 0 : h[A.route.id]) !== void 0);
    (_t(D >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(h).join(",")}`),
      (d = d.slice(0, Math.min(d.length, D + 1))));
  }
  let S = !1,
    M = -1;
  if (s && c) {
    S = c.renderFallback;
    for (let D = 0; D < d.length; D++) {
      let A = d[D];
      if (((A.route.HydrateFallback || A.route.hydrateFallbackElement) && (M = D), A.route.id)) {
        let { loaderData: H, errors: K } = c,
          V = A.route.loader && !H.hasOwnProperty(A.route.id) && (!K || K[A.route.id] === void 0);
        if (A.route.lazy || V) {
          (s.isStatic && (S = !0), M >= 0 ? (d = d.slice(0, M + 1)) : (d = [d[0]]));
          break;
        }
      }
    }
  }
  let b = s == null ? void 0 : s.onError,
    v =
      c && b
        ? (D, A) => {
            var H, K;
            b(D, {
              location: c.location,
              params: ((K = (H = c.matches) == null ? void 0 : H[0]) == null ? void 0 : K.params) ?? {},
              pattern: X0(c.matches),
              errorInfo: A,
            });
          }
        : void 0;
  return d.reduceRight((D, A, H) => {
    let K,
      V = !1,
      G = null,
      L = null;
    c &&
      ((K = h && A.route.id ? h[A.route.id] : void 0),
      (G = A.route.errorElement || lv),
      S &&
        (M < 0 && H === 0
          ? (Dm("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"),
            (V = !0),
            (L = null))
          : M === H && ((V = !0), (L = A.route.hydrateFallbackElement || null))));
    let q = o.concat(d.slice(0, H + 1)),
      k = () => {
        let w;
        return (
          K
            ? (w = G)
            : V
              ? (w = L)
              : A.route.Component
                ? (w = O.createElement(A.route.Component, null))
                : A.route.element
                  ? (w = A.route.element)
                  : (w = D),
          O.createElement(uv, {
            match: A,
            routeContext: { outlet: D, matches: q, isDataRoute: c != null },
            children: w,
          })
        );
      };
    return c && (A.route.ErrorBoundary || A.route.errorElement || H === 0)
      ? O.createElement(xm, {
          location: c.location,
          revalidation: c.revalidation,
          component: G,
          error: K,
          children: k(),
          routeContext: { outlet: null, matches: q, isDataRoute: !0 },
          onError: v,
        })
      : k();
  }, null);
}
function Zc(f) {
  return `${f} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function iv(f) {
  let o = O.useContext(Ha);
  return (_t(o, Zc(f)), o);
}
function fv(f) {
  let o = O.useContext(ii);
  return (_t(o, Zc(f)), o);
}
function cv(f) {
  let o = O.useContext(Ye);
  return (_t(o, Zc(f)), o);
}
function Vc(f) {
  let o = cv(f),
    s = o.matches[o.matches.length - 1];
  return (_t(s.route.id, `${f} can only be used on routes that contain a unique "id"`), s.route.id);
}
function rv() {
  return Vc("useRouteId");
}
function ov() {
  var c;
  let f = O.useContext(Qc),
    o = fv("useRouteError"),
    s = Vc("useRouteError");
  return f !== void 0 ? f : (c = o.errors) == null ? void 0 : c[s];
}
function sv() {
  let { router: f } = iv("useNavigate"),
    o = Vc("useNavigate"),
    s = O.useRef(!1);
  return (
    Mm(() => {
      s.current = !0;
    }),
    O.useCallback(
      async (d, h = {}) => {
        (Ce(s.current, _m),
          s.current && (typeof d == "number" ? await f.navigate(d) : await f.navigate(d, { fromRouteId: o, ...h })));
      },
      [f, o],
    )
  );
}
var dm = {};
function Dm(f, o, s) {
  !o && !dm[f] && ((dm[f] = !0), Ce(!1, s));
}
O.memo(dv);
function dv({ routes: f, manifest: o, future: s, state: c, isStatic: d, onError: h }) {
  return Om(f, void 0, { manifest: o, state: c, isStatic: d, onError: h });
}
function jc(f) {
  _t(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.",
  );
}
function mv({
  basename: f = "/",
  children: o = null,
  location: s,
  navigationType: c = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: S,
}) {
  _t(!Hu(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
  let M = f.replace(/^\/*/, "/"),
    b = O.useMemo(() => ({ basename: M, navigator: d, static: h, useTransitions: S, future: {} }), [M, d, h, S]);
  typeof s == "string" && (s = Wl(s));
  let { pathname: v = "/", search: D = "", hash: A = "", state: H = null, key: K = "default", mask: V } = s,
    G = O.useMemo(() => {
      let L = al(v, M);
      return L == null
        ? null
        : { location: { pathname: L, search: D, hash: A, state: H, key: K, mask: V }, navigationType: c };
    }, [M, v, D, A, H, K, c, V]);
  return (
    Ce(
      G != null,
      `<Router basename="${M}"> is not able to match the URL "${v}${D}${A}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    G == null
      ? null
      : O.createElement(_e.Provider, { value: b }, O.createElement(Nu.Provider, { children: o, value: G }))
  );
}
function hv({ children: f, location: o }) {
  return tv(Yc(f), o);
}
function Yc(f, o = []) {
  let s = [];
  return (
    O.Children.forEach(f, (c, d) => {
      if (!O.isValidElement(c)) return;
      let h = [...o, d];
      if (c.type === O.Fragment) {
        s.push.apply(s, Yc(c.props.children, h));
        return;
      }
      (_t(
        c.type === jc,
        `[${typeof c.type == "string" ? c.type : c.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        _t(!c.props.index || !c.props.children, "An index route cannot have child routes."));
      let S = {
        id: c.props.id || h.join("-"),
        caseSensitive: c.props.caseSensitive,
        element: c.props.element,
        Component: c.props.Component,
        index: c.props.index,
        path: c.props.path,
        middleware: c.props.middleware,
        loader: c.props.loader,
        action: c.props.action,
        hydrateFallbackElement: c.props.hydrateFallbackElement,
        HydrateFallback: c.props.HydrateFallback,
        errorElement: c.props.errorElement,
        ErrorBoundary: c.props.ErrorBoundary,
        hasErrorBoundary:
          c.props.hasErrorBoundary === !0 || c.props.ErrorBoundary != null || c.props.errorElement != null,
        shouldRevalidate: c.props.shouldRevalidate,
        handle: c.props.handle,
        lazy: c.props.lazy,
      };
      (c.props.children && (S.children = Yc(c.props.children, h)), s.push(S));
    }),
    s
  );
}
var li = "get",
  ai = "application/x-www-form-urlencoded";
function fi(f) {
  return typeof HTMLElement < "u" && f instanceof HTMLElement;
}
function yv(f) {
  return fi(f) && f.tagName.toLowerCase() === "button";
}
function vv(f) {
  return fi(f) && f.tagName.toLowerCase() === "form";
}
function gv(f) {
  return fi(f) && f.tagName.toLowerCase() === "input";
}
function pv(f) {
  return !!(f.metaKey || f.altKey || f.ctrlKey || f.shiftKey);
}
function Sv(f, o) {
  return f.button === 0 && (!o || o === "_self") && !pv(f);
}
var ei = null;
function bv() {
  if (ei === null)
    try {
      (new FormData(document.createElement("form"), 0), (ei = !1));
    } catch {
      ei = !0;
    }
  return ei;
}
var Ev = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Bc(f) {
  return f != null && !Ev.has(f)
    ? (Ce(!1, `"${f}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ai}"`), null)
    : f;
}
function Tv(f, o) {
  let s, c, d, h, S;
  if (vv(f)) {
    let M = f.getAttribute("action");
    ((c = M ? al(M, o) : null),
      (s = f.getAttribute("method") || li),
      (d = Bc(f.getAttribute("enctype")) || ai),
      (h = new FormData(f)));
  } else if (yv(f) || (gv(f) && (f.type === "submit" || f.type === "image"))) {
    let M = f.form;
    if (M == null) throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let b = f.getAttribute("formaction") || M.getAttribute("action");
    if (
      ((c = b ? al(b, o) : null),
      (s = f.getAttribute("formmethod") || M.getAttribute("method") || li),
      (d = Bc(f.getAttribute("formenctype")) || Bc(M.getAttribute("enctype")) || ai),
      (h = new FormData(M, f)),
      !bv())
    ) {
      let { name: v, type: D, value: A } = f;
      if (D === "image") {
        let H = v ? `${v}.` : "";
        (h.append(`${H}x`, "0"), h.append(`${H}y`, "0"));
      } else v && h.append(v, A);
    }
  } else {
    if (fi(f)) throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    ((s = li), (c = null), (d = ai), (S = f));
  }
  return (
    h && d === "text/plain" && ((S = h), (h = void 0)),
    { action: c, method: s.toLowerCase(), encType: d, formData: h, body: S }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Kc(f, o) {
  if (f === !1 || f === null || typeof f > "u") throw new Error(o);
}
function Cm(f, o, s, c) {
  let d =
    typeof f == "string" ? new URL(f, typeof window > "u" ? "server://singlefetch/" : window.location.origin) : f;
  return (
    s
      ? d.pathname.endsWith("/")
        ? (d.pathname = `${d.pathname}_.${c}`)
        : (d.pathname = `${d.pathname}.${c}`)
      : d.pathname === "/"
        ? (d.pathname = `_root.${c}`)
        : o && al(d.pathname, o) === "/"
          ? (d.pathname = `${ni(o)}/_root.${c}`)
          : (d.pathname = `${ni(d.pathname)}.${c}`),
    d
  );
}
async function zv(f, o) {
  if (f.id in o) return o[f.id];
  try {
    let s = await import(f.module);
    return ((o[f.id] = s), s);
  } catch (s) {
    return (
      console.error(`Error loading route module \`${f.module}\`, reloading page...`),
      console.error(s),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function Av(f) {
  return f == null
    ? !1
    : f.href == null
      ? f.rel === "preload" && typeof f.imageSrcSet == "string" && typeof f.imageSizes == "string"
      : typeof f.rel == "string" && typeof f.href == "string";
}
async function Rv(f, o, s) {
  let c = await Promise.all(
    f.map(async (d) => {
      let h = o.routes[d.route.id];
      if (h) {
        let S = await zv(h, s);
        return S.links ? S.links() : [];
      }
      return [];
    }),
  );
  return xv(
    c
      .flat(1)
      .filter(Av)
      .filter((d) => d.rel === "stylesheet" || d.rel === "preload")
      .map((d) => (d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" })),
  );
}
function mm(f, o, s, c, d, h) {
  let S = (b, v) => (s[v] ? b.route.id !== s[v].route.id : !0),
    M = (b, v) => {
      var D;
      return (
        s[v].pathname !== b.pathname ||
        (((D = s[v].route.path) == null ? void 0 : D.endsWith("*")) && s[v].params["*"] !== b.params["*"])
      );
    };
  return h === "assets"
    ? o.filter((b, v) => S(b, v) || M(b, v))
    : h === "data"
      ? o.filter((b, v) => {
          var A;
          let D = c.routes[b.route.id];
          if (!D || !D.hasLoader) return !1;
          if (S(b, v) || M(b, v)) return !0;
          if (b.route.shouldRevalidate) {
            let H = b.route.shouldRevalidate({
              currentUrl: new URL(d.pathname + d.search + d.hash, window.origin),
              currentParams: ((A = s[0]) == null ? void 0 : A.params) || {},
              nextUrl: new URL(f, window.origin),
              nextParams: b.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof H == "boolean") return H;
          }
          return !0;
        })
      : [];
}
function _v(f, o, { includeHydrateFallback: s } = {}) {
  return Mv(
    f
      .map((c) => {
        let d = o.routes[c.route.id];
        if (!d) return [];
        let h = [d.module];
        return (
          d.clientActionModule && (h = h.concat(d.clientActionModule)),
          d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)),
          s && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)),
          d.imports && (h = h.concat(d.imports)),
          h
        );
      })
      .flat(1),
  );
}
function Mv(f) {
  return [...new Set(f)];
}
function Ov(f) {
  let o = {},
    s = Object.keys(f).sort();
  for (let c of s) o[c] = f[c];
  return o;
}
function xv(f, o) {
  let s = new Set();
  return (
    new Set(o),
    f.reduce((c, d) => {
      let h = JSON.stringify(Ov(d));
      return (s.has(h) || (s.add(h), c.push({ key: h, link: d })), c);
    }, [])
  );
}
function Jc() {
  let f = O.useContext(Ha);
  return (Kc(f, "You must render this element inside a <DataRouterContext.Provider> element"), f);
}
function Dv() {
  let f = O.useContext(ii);
  return (Kc(f, "You must render this element inside a <DataRouterStateContext.Provider> element"), f);
}
var wc = O.createContext(void 0);
wc.displayName = "FrameworkContext";
function $c() {
  let f = O.useContext(wc);
  return (Kc(f, "You must render this element inside a <HydratedRouter> element"), f);
}
function Cv(f, o) {
  let s = O.useContext(wc),
    [c, d] = O.useState(!1),
    [h, S] = O.useState(!1),
    { onFocus: M, onBlur: b, onMouseEnter: v, onMouseLeave: D, onTouchStart: A } = o,
    H = O.useRef(null);
  (O.useEffect(() => {
    if ((f === "render" && S(!0), f === "viewport")) {
      let G = (q) => {
          q.forEach((k) => {
            S(k.isIntersecting);
          });
        },
        L = new IntersectionObserver(G, { threshold: 0.5 });
      return (
        H.current && L.observe(H.current),
        () => {
          L.disconnect();
        }
      );
    }
  }, [f]),
    O.useEffect(() => {
      if (c) {
        let G = setTimeout(() => {
          S(!0);
        }, 100);
        return () => {
          clearTimeout(G);
        };
      }
    }, [c]));
  let K = () => {
      d(!0);
    },
    V = () => {
      (d(!1), S(!1));
    };
  return s
    ? f !== "intent"
      ? [h, H, {}]
      : [
          h,
          H,
          {
            onFocus: Du(M, K),
            onBlur: Du(b, V),
            onMouseEnter: Du(v, K),
            onMouseLeave: Du(D, V),
            onTouchStart: Du(A, K),
          },
        ]
    : [!1, H, {}];
}
function Du(f, o) {
  return (s) => {
    (f && f(s), s.defaultPrevented || o(s));
  };
}
function Uv({ page: f, ...o }) {
  let s = Z0(),
    { router: c } = Jc(),
    d = O.useMemo(() => ym(c.routes, f, c.basename), [c.routes, f, c.basename]);
  return d
    ? s
      ? O.createElement(Hv, { page: f, matches: d, ...o })
      : O.createElement(Bv, { page: f, matches: d, ...o })
    : null;
}
function Nv(f) {
  let { manifest: o, routeModules: s } = $c(),
    [c, d] = O.useState([]);
  return (
    O.useEffect(() => {
      let h = !1;
      return (
        Rv(f, o, s).then((S) => {
          h || d(S);
        }),
        () => {
          h = !0;
        }
      );
    }, [f, o, s]),
    c
  );
}
function Hv({ page: f, matches: o, ...s }) {
  let c = ul(),
    { future: d } = $c(),
    { basename: h } = Jc(),
    S = O.useMemo(() => {
      if (f === c.pathname + c.search + c.hash) return [];
      let M = Cm(f, h, d.unstable_trailingSlashAwareDataRequests, "rsc"),
        b = !1,
        v = [];
      for (let D of o) typeof D.route.shouldRevalidate == "function" ? (b = !0) : v.push(D.route.id);
      return (b && v.length > 0 && M.searchParams.set("_routes", v.join(",")), [M.pathname + M.search]);
    }, [h, d.unstable_trailingSlashAwareDataRequests, f, c, o]);
  return O.createElement(
    O.Fragment,
    null,
    S.map((M) => O.createElement("link", { key: M, rel: "prefetch", as: "fetch", href: M, ...s })),
  );
}
function Bv({ page: f, matches: o, ...s }) {
  let c = ul(),
    { future: d, manifest: h, routeModules: S } = $c(),
    { basename: M } = Jc(),
    { loaderData: b, matches: v } = Dv(),
    D = O.useMemo(() => mm(f, o, v, h, c, "data"), [f, o, v, h, c]),
    A = O.useMemo(() => mm(f, o, v, h, c, "assets"), [f, o, v, h, c]),
    H = O.useMemo(() => {
      if (f === c.pathname + c.search + c.hash) return [];
      let G = new Set(),
        L = !1;
      if (
        (o.forEach((k) => {
          var yt;
          let w = h.routes[k.route.id];
          !w ||
            !w.hasLoader ||
            ((!D.some((dt) => dt.route.id === k.route.id) &&
              k.route.id in b &&
              (yt = S[k.route.id]) != null &&
              yt.shouldRevalidate) ||
            w.hasClientLoader
              ? (L = !0)
              : G.add(k.route.id));
        }),
        G.size === 0)
      )
        return [];
      let q = Cm(f, M, d.unstable_trailingSlashAwareDataRequests, "data");
      return (
        L &&
          G.size > 0 &&
          q.searchParams.set(
            "_routes",
            o
              .filter((k) => G.has(k.route.id))
              .map((k) => k.route.id)
              .join(","),
          ),
        [q.pathname + q.search]
      );
    }, [M, d.unstable_trailingSlashAwareDataRequests, b, c, h, D, o, f, S]),
    K = O.useMemo(() => _v(A, h), [A, h]),
    V = Nv(A);
  return O.createElement(
    O.Fragment,
    null,
    H.map((G) => O.createElement("link", { key: G, rel: "prefetch", as: "fetch", href: G, ...s })),
    K.map((G) => O.createElement("link", { key: G, rel: "modulepreload", href: G, ...s })),
    V.map(({ key: G, link: L }) =>
      O.createElement("link", { key: G, nonce: s.nonce, ...L, crossOrigin: L.crossOrigin ?? s.crossOrigin }),
    ),
  );
}
function qv(...f) {
  return (o) => {
    f.forEach((s) => {
      typeof s == "function" ? s(o) : s != null && (s.current = o);
    });
  };
}
var jv = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  jv && (window.__reactRouterVersion = "7.15.1");
} catch {}
function Yv({ basename: f, children: o, useTransitions: s, window: c }) {
  let d = O.useRef();
  d.current == null && (d.current = y0({ window: c, v5Compat: !0 }));
  let h = d.current,
    [S, M] = O.useState({ action: h.action, location: h.location }),
    b = O.useCallback(
      (v) => {
        s === !1 ? M(v) : O.startTransition(() => M(v));
      },
      [s],
    );
  return (
    O.useLayoutEffect(() => h.listen(b), [h, b]),
    O.createElement(mv, {
      basename: f,
      children: o,
      location: S.location,
      navigationType: S.action,
      navigator: h,
      useTransitions: s,
    })
  );
}
var Um = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Uu = O.forwardRef(function (
    {
      onClick: o,
      discover: s = "render",
      prefetch: c = "none",
      relative: d,
      reloadDocument: h,
      replace: S,
      mask: M,
      state: b,
      target: v,
      to: D,
      preventScrollReset: A,
      viewTransition: H,
      defaultShouldRevalidate: K,
      ...V
    },
    G,
  ) {
    let { basename: L, navigator: q, useTransitions: k } = O.useContext(_e),
      w = typeof D == "string" && Um.test(D),
      yt = Em(D, L);
    D = yt.to;
    let dt = k0(D, { relative: d }),
      Tt = ul(),
      F = null;
    if (M) {
      let Nt = Xc(M, [], Tt.mask ? Tt.mask.pathname : "/", !0);
      (L !== "/" && (Nt.pathname = Nt.pathname === "/" ? L : De([L, Nt.pathname])), (F = q.createHref(Nt)));
    }
    let [xt, Jt, Ue] = Cv(c, V),
      he = Qv(D, {
        replace: S,
        mask: M,
        state: b,
        target: v,
        preventScrollReset: A,
        relative: d,
        viewTransition: H,
        defaultShouldRevalidate: K,
        useTransitions: k,
      });
    function wt(Nt) {
      (o && o(Nt), Nt.defaultPrevented || he(Nt));
    }
    let Ne = !(yt.isExternal || h),
      ye = O.createElement("a", {
        ...V,
        ...Ue,
        href: (Ne ? F : void 0) || yt.absoluteURL || dt,
        onClick: Ne ? wt : o,
        ref: qv(G, Jt),
        target: v,
        "data-discover": !w && s === "render" ? "true" : void 0,
      });
    return xt && !w ? O.createElement(O.Fragment, null, ye, O.createElement(Uv, { page: dt })) : ye;
  });
Uu.displayName = "Link";
var Lv = O.forwardRef(function (
  {
    "aria-current": o = "page",
    caseSensitive: s = !1,
    className: c = "",
    end: d = !1,
    style: h,
    to: S,
    viewTransition: M,
    children: b,
    ...v
  },
  D,
) {
  let A = Bu(S, { relative: v.relative }),
    H = ul(),
    K = O.useContext(ii),
    { navigator: V, basename: G } = O.useContext(_e),
    L = K != null && wv(A) && M === !0,
    q = V.encodeLocation ? V.encodeLocation(A).pathname : A.pathname,
    k = H.pathname,
    w = K && K.navigation && K.navigation.location ? K.navigation.location.pathname : null;
  (s || ((k = k.toLowerCase()), (w = w ? w.toLowerCase() : null), (q = q.toLowerCase())),
    w && G && (w = al(w, G) || w));
  const yt = q !== "/" && q.endsWith("/") ? q.length - 1 : q.length;
  let dt = k === q || (!d && k.startsWith(q) && k.charAt(yt) === "/"),
    Tt = w != null && (w === q || (!d && w.startsWith(q) && w.charAt(q.length) === "/")),
    F = { isActive: dt, isPending: Tt, isTransitioning: L },
    xt = dt ? o : void 0,
    Jt;
  typeof c == "function"
    ? (Jt = c(F))
    : (Jt = [c, dt ? "active" : null, Tt ? "pending" : null, L ? "transitioning" : null].filter(Boolean).join(" "));
  let Ue = typeof h == "function" ? h(F) : h;
  return O.createElement(
    Uu,
    { ...v, "aria-current": xt, className: Jt, ref: D, style: Ue, to: S, viewTransition: M },
    typeof b == "function" ? b(F) : b,
  );
});
Lv.displayName = "NavLink";
var Gv = O.forwardRef(
  (
    {
      discover: f = "render",
      fetcherKey: o,
      navigate: s,
      reloadDocument: c,
      replace: d,
      state: h,
      method: S = li,
      action: M,
      onSubmit: b,
      relative: v,
      preventScrollReset: D,
      viewTransition: A,
      defaultShouldRevalidate: H,
      ...K
    },
    V,
  ) => {
    let { useTransitions: G } = O.useContext(_e),
      L = Kv(),
      q = Jv(M, { relative: v }),
      k = S.toLowerCase() === "get" ? "get" : "post",
      w = typeof M == "string" && Um.test(M),
      yt = (dt) => {
        if ((b && b(dt), dt.defaultPrevented)) return;
        dt.preventDefault();
        let Tt = dt.nativeEvent.submitter,
          F = (Tt == null ? void 0 : Tt.getAttribute("formmethod")) || S,
          xt = () =>
            L(Tt || dt.currentTarget, {
              fetcherKey: o,
              method: F,
              navigate: s,
              replace: d,
              state: h,
              relative: v,
              preventScrollReset: D,
              viewTransition: A,
              defaultShouldRevalidate: H,
            });
        G && s !== !1 ? O.startTransition(() => xt()) : xt();
      };
    return O.createElement("form", {
      ref: V,
      method: k,
      action: q,
      onSubmit: c ? b : yt,
      ...K,
      "data-discover": !w && f === "render" ? "true" : void 0,
    });
  },
);
Gv.displayName = "Form";
function Xv(f) {
  return `${f} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Nm(f) {
  let o = O.useContext(Ha);
  return (_t(o, Xv(f)), o);
}
function Qv(
  f,
  {
    target: o,
    replace: s,
    mask: c,
    state: d,
    preventScrollReset: h,
    relative: S,
    viewTransition: M,
    defaultShouldRevalidate: b,
    useTransitions: v,
  } = {},
) {
  let D = F0(),
    A = ul(),
    H = Bu(f, { relative: S });
  return O.useCallback(
    (K) => {
      if (Sv(K, o)) {
        K.preventDefault();
        let V = s !== void 0 ? s : Cu(A) === Cu(H),
          G = () =>
            D(f, {
              replace: V,
              mask: c,
              state: d,
              preventScrollReset: h,
              relative: S,
              viewTransition: M,
              defaultShouldRevalidate: b,
            });
        v ? O.startTransition(() => G()) : G();
      }
    },
    [A, D, H, s, c, d, o, f, h, S, M, b, v],
  );
}
var Zv = 0,
  Vv = () => `__${String(++Zv)}__`;
function Kv() {
  let { router: f } = Nm("useSubmit"),
    { basename: o } = O.useContext(_e),
    s = rv(),
    c = f.fetch,
    d = f.navigate;
  return O.useCallback(
    async (h, S = {}) => {
      let { action: M, method: b, encType: v, formData: D, body: A } = Tv(h, o);
      if (S.navigate === !1) {
        let H = S.fetcherKey || Vv();
        await c(H, s, S.action || M, {
          defaultShouldRevalidate: S.defaultShouldRevalidate,
          preventScrollReset: S.preventScrollReset,
          formData: D,
          body: A,
          formMethod: S.method || b,
          formEncType: S.encType || v,
          flushSync: S.flushSync,
        });
      } else
        await d(S.action || M, {
          defaultShouldRevalidate: S.defaultShouldRevalidate,
          preventScrollReset: S.preventScrollReset,
          formData: D,
          body: A,
          formMethod: S.method || b,
          formEncType: S.encType || v,
          replace: S.replace,
          state: S.state,
          fromRouteId: s,
          flushSync: S.flushSync,
          viewTransition: S.viewTransition,
        });
    },
    [c, d, o, s],
  );
}
function Jv(f, { relative: o } = {}) {
  let { basename: s } = O.useContext(_e),
    c = O.useContext(Ye);
  _t(c, "useFormAction must be used inside a RouteContext");
  let [d] = c.matches.slice(-1),
    h = { ...Bu(f || ".", { relative: o }) },
    S = ul();
  if (f == null) {
    h.search = S.search;
    let M = new URLSearchParams(h.search),
      b = M.getAll("index");
    if (b.some((D) => D === "")) {
      (M.delete("index"), b.filter((A) => A).forEach((A) => M.append("index", A)));
      let D = M.toString();
      h.search = D ? `?${D}` : "";
    }
  }
  return (
    (!f || f === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"),
    s !== "/" && (h.pathname = h.pathname === "/" ? s : De([s, h.pathname])),
    Cu(h)
  );
}
function wv(f, { relative: o } = {}) {
  let s = O.useContext(Am);
  _t(
    s != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: c } = Nm("useViewTransitionState"),
    d = Bu(f, { relative: o });
  if (!s.isTransitioning) return !1;
  let h = al(s.currentLocation.pathname, c) || s.currentLocation.pathname,
    S = al(s.nextLocation.pathname, c) || s.nextLocation.pathname;
  return ui(d.pathname, S) != null || ui(d.pathname, h) != null;
}
const Lc = [
  {
    name: "math",
    file: "math.ts",
    code: `/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between a and b by t (0–1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/** Map a value from one range to another. */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
}
`,
    dependencies: [],
    exports: ["clamp", "lerp", "mapRange"],
  },
  {
    name: "string",
    file: "string.ts",
    code: `import { clamp } from "./math.js";

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str[0]!.toUpperCase() + str.slice(1);
}

/** Convert a string to kebab-case. */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\\s_]+/g, "-")
    .toLowerCase();
}

/** Truncate a string to a maximum length, adding an ellipsis if needed. */
export function truncate(str: string, maxLen: number, suffix = "..."): string {
  const effectiveLen = clamp(maxLen - suffix.length, 1, maxLen);
  if (str.length <= maxLen) return str;
  return str.slice(0, effectiveLen) + suffix;
}
`,
    dependencies: ["math"],
    exports: ["capitalize", "toKebabCase", "truncate"],
  },
];
function $v({ name: f, exports: o, dependencies: s }) {
  return W.jsxs(Uu, {
    to: `/${f}`,
    className:
      "block rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 hover:bg-gray-900 transition-colors",
    children: [
      W.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          W.jsxs("h3", { className: "text-lg font-semibold text-white font-mono", children: [f, ".ts"] }),
          W.jsxs("span", { className: "text-xs text-gray-500", children: [o.length, " exports"] }),
        ],
      }),
      W.jsx("div", {
        className: "mt-2 flex flex-wrap gap-1.5",
        children: o.map((c) =>
          W.jsx(
            "span",
            {
              className: "text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20",
              children: c,
            },
            c,
          ),
        ),
      }),
      s.length > 0 &&
        W.jsxs("p", {
          className: "mt-2 text-xs text-gray-500",
          children: ["deps: ", s.map((c) => `${c}.ts`).join(", ")],
        }),
    ],
  });
}
function Wv() {
  return W.jsxs("div", {
    children: [
      W.jsxs("div", {
        className: "mb-8",
        children: [
          W.jsx("h1", { className: "text-2xl font-bold text-white mb-2", children: "Modules" }),
          W.jsx("p", {
            className: "text-gray-400",
            children: "Lightweight TypeScript utilities. Install individual modules or copy-paste directly.",
          }),
        ],
      }),
      W.jsx("div", {
        className: "space-y-3",
        children: Lc.map((f) => W.jsx($v, { name: f.name, exports: f.exports, dependencies: f.dependencies }, f.name)),
      }),
    ],
  });
}
function kv({ code: f, filename: o }) {
  const [s, c] = O.useState(!1),
    d = async () => {
      (await navigator.clipboard.writeText(f), c(!0), setTimeout(() => c(!1), 2e3));
    };
  return W.jsxs("div", {
    className: "rounded-lg border border-gray-800 bg-gray-900 overflow-hidden",
    children: [
      W.jsxs("div", {
        className: "flex items-center justify-between px-4 py-2 border-b border-gray-800",
        children: [
          W.jsx("span", { className: "text-sm text-gray-400 font-mono", children: o }),
          W.jsx("button", {
            onClick: d,
            className: "text-xs px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors",
            children: s ? "Copied!" : "Copy",
          }),
        ],
      }),
      W.jsx("pre", {
        className: "p-4 overflow-x-auto text-sm leading-relaxed",
        children: W.jsx("code", { className: "text-gray-300 font-mono", children: f }),
      }),
    ],
  });
}
function Fv({ modules: f }) {
  const o = `npx copy-install install ${f.join(" ")}`;
  return W.jsxs("div", {
    className: "rounded-lg border border-gray-800 bg-gray-900 p-4",
    children: [
      W.jsx("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "Install via CLI" }),
      W.jsx("code", {
        className: "block text-sm font-mono bg-gray-950 px-3 py-2 rounded text-green-400",
        children: o,
      }),
    ],
  });
}
function Iv() {
  const { module: f } = P0(),
    o = Lc.find((c) => c.name === f);
  if (!o)
    return W.jsxs("div", {
      children: [
        W.jsx("h1", { className: "text-xl text-red-400 mb-4", children: "Module not found" }),
        W.jsx(Uu, { to: "/", className: "text-blue-400 hover:underline", children: "← Back to modules" }),
      ],
    });
  const s = [o, ...o.dependencies.map((c) => Lc.find((d) => d.name === c)).filter(Boolean)];
  return W.jsxs("div", {
    children: [
      W.jsx(Uu, {
        to: "/",
        className: "text-sm text-gray-400 hover:text-gray-300 mb-4 inline-block",
        children: "← Back to modules",
      }),
      W.jsxs("h1", { className: "text-2xl font-bold text-white font-mono mb-2", children: [o.name, ".ts"] }),
      W.jsxs("p", {
        className: "text-gray-400 mb-6",
        children: [
          o.exports.length,
          " exports",
          o.dependencies.length > 0 &&
            W.jsxs("span", { children: [" ", "· deps: ", o.dependencies.map((c) => `${c}.ts`).join(", ")] }),
        ],
      }),
      W.jsx("div", { className: "mb-6", children: W.jsx(Fv, { modules: s.map((c) => c.name) }) }),
      W.jsx("div", {
        className: "space-y-4",
        children: s.map((c) => W.jsx(kv, { code: c.code, filename: c.file }, c.name)),
      }),
    ],
  });
}
function Pv() {
  return W.jsxs("div", {
    className: "min-h-screen bg-gray-950 text-gray-100",
    children: [
      W.jsx("header", {
        className: "border-b border-gray-800 bg-gray-900/50 backdrop-blur",
        children: W.jsx("div", {
          className: "mx-auto max-w-4xl px-4 py-4",
          children: W.jsx("a", {
            href: "#/",
            className: "text-lg font-semibold text-white hover:text-blue-400",
            children: "copy-install-poc",
          }),
        }),
      }),
      W.jsx("main", {
        className: "mx-auto max-w-4xl px-4 py-8",
        children: W.jsxs(hv, {
          children: [
            W.jsx(jc, { path: "/", element: W.jsx(Wv, {}) }),
            W.jsx(jc, { path: "/:module", element: W.jsx(Iv, {}) }),
          ],
        }),
      }),
    ],
  });
}
h0.createRoot(document.getElementById("root")).render(
  W.jsx(i0.StrictMode, { children: W.jsx(Yv, { children: W.jsx(Pv, {}) }) }),
);
