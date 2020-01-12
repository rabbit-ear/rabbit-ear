/* (c) Robby Kraft, MIT License
 * makes use of these libraries:
 * - SVG Path Properties by Roger Veciana i Rovira
 * - vkBeautify by Vadim Kiryukhin
 */
 function vkXML (text, step) {
  const ar = text.replace(/>\s{0,}</g, "><")
    .replace(/</g, "~::~<")
    .replace(/\s*xmlns\:/g, "~::~xmlns:")
    .split("~::~");
  const len = ar.length;
  let inComment = false;
  let deep = 0;
  let str = "";
  const space = (step != null && typeof step === "string" ? step : "\t");
  const shift = ["\n"];
  for (let si = 0; si < 100; si += 1) {
    shift.push(shift[si] + space);
  }
  for (let ix = 0; ix < len; ix += 1) {
    if (ar[ix].search(/<!/) > -1) {
      str += shift[deep] + ar[ix];
      inComment = true;
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
        || ar[ix].search(/!DOCTYPE/) > -1) {
        inComment = false;
      }
    } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
      str += ar[ix];
      inComment = false;
    } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix])
      && /^<[\w:\-\.\,]+/.exec(ar[ix - 1])
      == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
      str += ar[ix];
      if (!inComment) { deep -= 1; }
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1
      && ar[ix].search(/\/>/) === -1) {
      str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\//) > -1) {
      str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/\/>/) > -1) {
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\?/) > -1) {
      str += shift[deep] + ar[ix];
    } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
      str += shift[deep] + ar[ix];
    } else {
      str += ar[ix];
    }
  }
  return (str[0] === "\n") ? str.slice(1) : str;
}
const isBrowser = typeof window !== "undefined"
  && typeof window.document !== "undefined";
const isNode = typeof process !== "undefined"
  && process.versions != null
  && process.versions.node != null;
  const htmlString = "<!DOCTYPE html><title> </title>";
const win = (function () {
  let w = {};
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    w.DOMParser = DOMParser;
    w.XMLSerializer = XMLSerializer;
    w.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    w = window;
  }
  return w;
}());
var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0};
var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function parse(path) {
  var data = [];
  path.replace(segment, function(_, command, args){
    var type = command.toLowerCase();
    args = parseValues(args);
    if (type === 'm' && args.length > 2) {
      data.push([command].concat(args.splice(0, 2)));
      type = 'l';
      command = command === 'm' ? 'l' : 'L';
    }
    while (args.length >= 0) {
      if (args.length === length[type]) {
        args.unshift(command);
        return data.push(args);
      }
      if (args.length < length[type]) {
        throw new Error('malformed path data');
      }
      data.push([command].concat(args.splice(0, length[type])));
    }
  });
  return data;
}
var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function parseValues(args) {
  var numbers = args.match(number);
  return numbers ? numbers.map(Number) : [];
}
function Bezier(ax, ay, bx, by, cx, cy, dx, dy) {
  return new Bezier$1(ax, ay, bx, by, cx, cy, dx, dy);
}
function Bezier$1(ax, ay, bx, by, cx, cy, dx, dy) {
  this.a = {x:ax, y:ay};
  this.b = {x:bx, y:by};
  this.c = {x:cx, y:cy};
  this.d = {x:dx, y:dy};
  if(dx !== null && dx !== undefined && dy !== null && dy !== undefined){
    this.getArcLength = getCubicArcLength;
    this.getPoint = cubicPoint;
    this.getDerivative = cubicDerivative;
  } else {
    this.getArcLength = getQuadraticArcLength;
    this.getPoint = quadraticPoint;
    this.getDerivative = quadraticDerivative;
  }
  this.init();
}
Bezier$1.prototype = {
  constructor: Bezier$1,
  init: function() {
    this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x],
                                    [this.a.y, this.b.y, this.c.y, this.d.y]);
  },
  getTotalLength: function() {
    return this.length;
  },
  getPointAtLength: function(length) {
    var t = t2length(length, this.length, this.getArcLength,
                    [this.a.x, this.b.x, this.c.x, this.d.x],
                    [this.a.y, this.b.y, this.c.y, this.d.y]);
    return this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
                                    [this.a.y, this.b.y, this.c.y, this.d.y],
                                  t);
  },
  getTangentAtLength: function(length){
    var t = t2length(length, this.length, this.getArcLength,
                    [this.a.x, this.b.x, this.c.x, this.d.x],
                    [this.a.y, this.b.y, this.c.y, this.d.y]);
    var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
                    [this.a.y, this.b.y, this.c.y, this.d.y], t);
    var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
    var tangent;
    if (mdl > 0){
      tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
    } else {
      tangent = {x: 0, y: 0};
    }
    return tangent;
  },
  getPropertiesAtLength: function(length){
    var t = t2length(length, this.length, this.getArcLength,
                    [this.a.x, this.b.x, this.c.x, this.d.x],
                    [this.a.y, this.b.y, this.c.y, this.d.y]);
    var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
                    [this.a.y, this.b.y, this.c.y, this.d.y], t);
    var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
    var tangent;
    if (mdl > 0){
      tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
    } else {
      tangent = {x: 0, y: 0};
    }
    var point = this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
                                    [this.a.y, this.b.y, this.c.y, this.d.y],
                                  t);
    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
  }
};
function quadraticDerivative(xs, ys, t){
  return {x: (1 - t) * 2*(xs[1] - xs[0]) +t * 2*(xs[2] - xs[1]),
    y: (1 - t) * 2*(ys[1] - ys[0]) +t * 2*(ys[2] - ys[1])
  };
}
function cubicDerivative(xs, ys, t){
  var derivative = quadraticPoint(
            [3*(xs[1] - xs[0]), 3*(xs[2] - xs[1]), 3*(xs[3] - xs[2])],
            [3*(ys[1] - ys[0]), 3*(ys[2] - ys[1]), 3*(ys[3] - ys[2])],
            t);
  return derivative;
}
function t2length(length, total_length, func, xs, ys){
  var error = 1;
  var t = length/total_length;
  var step = (length - func(xs, ys, t))/total_length;
  var numIterations = 0;
  while (error > 0.001){
    var increasedTLength = func(xs, ys, t + step);
    var decreasedTLength = func(xs, ys, t - step);
    var increasedTError = Math.abs(length - increasedTLength) / total_length;
    var decreasedTError = Math.abs(length - decreasedTLength) / total_length;
    if (increasedTError < error) {
      error = increasedTError;
      t += step;
    } else if (decreasedTError < error) {
      error = decreasedTError;
      t -= step;
    } else {
      step /= 2;
    }
    numIterations++;
    if(numIterations > 500){
      break;
    }
  }
  return t;
}
function quadraticPoint(xs, ys, t){
  var x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
  var y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
  return {x: x, y: y};
}
function cubicPoint(xs, ys, t){
  var x = (1 - t) * (1 - t) * (1 - t) * xs[0] + 3 * (1 - t) * (1 - t) * t * xs[1] +
  3 * (1 - t) * t * t * xs[2] + t * t * t * xs[3];
  var y = (1 - t) * (1 - t) * (1 - t) * ys[0] + 3 * (1 - t) * (1 - t) * t * ys[1] +
  3 * (1 - t) * t * t * ys[2] + t * t * t * ys[3];
  return {x: x, y: y};
}
function getQuadraticArcLength(xs, ys, t) {
  if (t === undefined) {
    t = 1;
  }
   var ax = xs[0] - 2 * xs[1] + xs[2];
   var ay = ys[0] - 2 * ys[1] + ys[2];
   var bx = 2 * xs[1] - 2 * xs[0];
   var by = 2 * ys[1] - 2 * ys[0];
   var A = 4 * (ax * ax + ay * ay);
   var B = 4 * (ax * bx + ay * by);
   var C = bx * bx + by * by;
   if(A === 0){
     return t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
   }
   var b = B/(2*A);
   var c = C/A;
   var u = t + b;
   var k = c - b*b;
   var uuk = (u*u+k)>0?Math.sqrt(u*u+k):0;
   var bbk = (b*b+k)>0?Math.sqrt(b*b+k):0;
   var term = ((b+Math.sqrt(b*b+k)))!==0?k*Math.log(Math.abs((u+uuk)/(b+bbk))):0;
   return (Math.sqrt(A)/2)*(
     u*uuk-b*bbk+
     term
   );
}
var tValues = [
  [],
  [],
  [-0.5773502691896257,0.5773502691896257],
  [0,-0.7745966692414834,0.7745966692414834],
  [-0.33998104358485626,0.33998104358485626,-0.8611363115940526,0.8611363115940526],
  [0,-0.5384693101056831,0.5384693101056831,-0.906179845938664,0.906179845938664],
  [0.6612093864662645,-0.6612093864662645,-0.2386191860831969,0.2386191860831969,-0.932469514203152,0.932469514203152],
  [0,0.4058451513773972,-0.4058451513773972,-0.7415311855993945,0.7415311855993945,-0.9491079123427585,0.9491079123427585],
  [-0.1834346424956498,0.1834346424956498,-0.525532409916329,0.525532409916329,-0.7966664774136267,0.7966664774136267,-0.9602898564975363,0.9602898564975363],
  [0,-0.8360311073266358,0.8360311073266358,-0.9681602395076261,0.9681602395076261,-0.3242534234038089,0.3242534234038089,-0.6133714327005904,0.6133714327005904],
  [-0.14887433898163122,0.14887433898163122,-0.4333953941292472,0.4333953941292472,-0.6794095682990244,0.6794095682990244,-0.8650633666889845,0.8650633666889845,-0.9739065285171717,0.9739065285171717],
  [0,-0.26954315595234496,0.26954315595234496,-0.5190961292068118,0.5190961292068118,-0.7301520055740494,0.7301520055740494,-0.8870625997680953,0.8870625997680953,-0.978228658146057,0.978228658146057],
  [-0.1252334085114689,0.1252334085114689,-0.3678314989981802,0.3678314989981802,-0.5873179542866175,0.5873179542866175,-0.7699026741943047,0.7699026741943047,-0.9041172563704749,0.9041172563704749,-0.9815606342467192,0.9815606342467192],
  [0,-0.2304583159551348,0.2304583159551348,-0.44849275103644687,0.44849275103644687,-0.6423493394403402,0.6423493394403402,-0.8015780907333099,0.8015780907333099,-0.9175983992229779,0.9175983992229779,-0.9841830547185881,0.9841830547185881],
  [-0.10805494870734367,0.10805494870734367,-0.31911236892788974,0.31911236892788974,-0.5152486363581541,0.5152486363581541,-0.6872929048116855,0.6872929048116855,-0.827201315069765,0.827201315069765,-0.9284348836635735,0.9284348836635735,-0.9862838086968123,0.9862838086968123],
  [0,-0.20119409399743451,0.20119409399743451,-0.3941513470775634,0.3941513470775634,-0.5709721726085388,0.5709721726085388,-0.7244177313601701,0.7244177313601701,-0.8482065834104272,0.8482065834104272,-0.937273392400706,0.937273392400706,-0.9879925180204854,0.9879925180204854],
  [-0.09501250983763744,0.09501250983763744,-0.2816035507792589,0.2816035507792589,-0.45801677765722737,0.45801677765722737,-0.6178762444026438,0.6178762444026438,-0.755404408355003,0.755404408355003,-0.8656312023878318,0.8656312023878318,-0.9445750230732326,0.9445750230732326,-0.9894009349916499,0.9894009349916499],
  [0,-0.17848418149584785,0.17848418149584785,-0.3512317634538763,0.3512317634538763,-0.5126905370864769,0.5126905370864769,-0.6576711592166907,0.6576711592166907,-0.7815140038968014,0.7815140038968014,-0.8802391537269859,0.8802391537269859,-0.9506755217687678,0.9506755217687678,-0.9905754753144174,0.9905754753144174],
  [-0.0847750130417353,0.0847750130417353,-0.2518862256915055,0.2518862256915055,-0.41175116146284263,0.41175116146284263,-0.5597708310739475,0.5597708310739475,-0.6916870430603532,0.6916870430603532,-0.8037049589725231,0.8037049589725231,-0.8926024664975557,0.8926024664975557,-0.9558239495713977,0.9558239495713977,-0.9915651684209309,0.9915651684209309],
  [0,-0.16035864564022537,0.16035864564022537,-0.31656409996362983,0.31656409996362983,-0.46457074137596094,0.46457074137596094,-0.600545304661681,0.600545304661681,-0.7209661773352294,0.7209661773352294,-0.8227146565371428,0.8227146565371428,-0.9031559036148179,0.9031559036148179,-0.96020815213483,0.96020815213483,-0.9924068438435844,0.9924068438435844],
  [-0.07652652113349734,0.07652652113349734,-0.22778585114164507,0.22778585114164507,-0.37370608871541955,0.37370608871541955,-0.5108670019508271,0.5108670019508271,-0.636053680726515,0.636053680726515,-0.7463319064601508,0.7463319064601508,-0.8391169718222188,0.8391169718222188,-0.912234428251326,0.912234428251326,-0.9639719272779138,0.9639719272779138,-0.9931285991850949,0.9931285991850949],
  [0,-0.1455618541608951,0.1455618541608951,-0.2880213168024011,0.2880213168024011,-0.4243421202074388,0.4243421202074388,-0.5516188358872198,0.5516188358872198,-0.6671388041974123,0.6671388041974123,-0.7684399634756779,0.7684399634756779,-0.8533633645833173,0.8533633645833173,-0.9200993341504008,0.9200993341504008,-0.9672268385663063,0.9672268385663063,-0.9937521706203895,0.9937521706203895],
  [-0.06973927331972223,0.06973927331972223,-0.20786042668822127,0.20786042668822127,-0.34193582089208424,0.34193582089208424,-0.469355837986757,0.469355837986757,-0.5876404035069116,0.5876404035069116,-0.6944872631866827,0.6944872631866827,-0.7878168059792081,0.7878168059792081,-0.8658125777203002,0.8658125777203002,-0.926956772187174,0.926956772187174,-0.9700604978354287,0.9700604978354287,-0.9942945854823992,0.9942945854823992],
  [0,-0.1332568242984661,0.1332568242984661,-0.26413568097034495,0.26413568097034495,-0.3903010380302908,0.3903010380302908,-0.5095014778460075,0.5095014778460075,-0.6196098757636461,0.6196098757636461,-0.7186613631319502,0.7186613631319502,-0.8048884016188399,0.8048884016188399,-0.8767523582704416,0.8767523582704416,-0.9329710868260161,0.9329710868260161,-0.9725424712181152,0.9725424712181152,-0.9947693349975522,0.9947693349975522],
  [-0.06405689286260563,0.06405689286260563,-0.1911188674736163,0.1911188674736163,-0.3150426796961634,0.3150426796961634,-0.4337935076260451,0.4337935076260451,-0.5454214713888396,0.5454214713888396,-0.6480936519369755,0.6480936519369755,-0.7401241915785544,0.7401241915785544,-0.820001985973903,0.820001985973903,-0.8864155270044011,0.8864155270044011,-0.9382745520027328,0.9382745520027328,-0.9747285559713095,0.9747285559713095,-0.9951872199970213,0.9951872199970213]
];
var cValues = [
  [],
  [],
  [1,1],
  [0.8888888888888888,0.5555555555555556,0.5555555555555556],
  [0.6521451548625461,0.6521451548625461,0.34785484513745385,0.34785484513745385],
  [0.5688888888888889,0.47862867049936647,0.47862867049936647,0.23692688505618908,0.23692688505618908],
  [0.3607615730481386,0.3607615730481386,0.46791393457269104,0.46791393457269104,0.17132449237917036,0.17132449237917036],
  [0.4179591836734694,0.3818300505051189,0.3818300505051189,0.27970539148927664,0.27970539148927664,0.1294849661688697,0.1294849661688697],
  [0.362683783378362,0.362683783378362,0.31370664587788727,0.31370664587788727,0.22238103445337448,0.22238103445337448,0.10122853629037626,0.10122853629037626],
  [0.3302393550012598,0.1806481606948574,0.1806481606948574,0.08127438836157441,0.08127438836157441,0.31234707704000286,0.31234707704000286,0.26061069640293544,0.26061069640293544],
  [0.29552422471475287,0.29552422471475287,0.26926671930999635,0.26926671930999635,0.21908636251598204,0.21908636251598204,0.1494513491505806,0.1494513491505806,0.06667134430868814,0.06667134430868814],
  [0.2729250867779006,0.26280454451024665,0.26280454451024665,0.23319376459199048,0.23319376459199048,0.18629021092773426,0.18629021092773426,0.1255803694649046,0.1255803694649046,0.05566856711617366,0.05566856711617366],
  [0.24914704581340277,0.24914704581340277,0.2334925365383548,0.2334925365383548,0.20316742672306592,0.20316742672306592,0.16007832854334622,0.16007832854334622,0.10693932599531843,0.10693932599531843,0.04717533638651183,0.04717533638651183],
  [0.2325515532308739,0.22628318026289723,0.22628318026289723,0.2078160475368885,0.2078160475368885,0.17814598076194574,0.17814598076194574,0.13887351021978725,0.13887351021978725,0.09212149983772845,0.09212149983772845,0.04048400476531588,0.04048400476531588],
  [0.2152638534631578,0.2152638534631578,0.2051984637212956,0.2051984637212956,0.18553839747793782,0.18553839747793782,0.15720316715819355,0.15720316715819355,0.12151857068790319,0.12151857068790319,0.08015808715976021,0.08015808715976021,0.03511946033175186,0.03511946033175186],
  [0.2025782419255613,0.19843148532711158,0.19843148532711158,0.1861610000155622,0.1861610000155622,0.16626920581699392,0.16626920581699392,0.13957067792615432,0.13957067792615432,0.10715922046717194,0.10715922046717194,0.07036604748810812,0.07036604748810812,0.03075324199611727,0.03075324199611727],
  [0.1894506104550685,0.1894506104550685,0.18260341504492358,0.18260341504492358,0.16915651939500254,0.16915651939500254,0.14959598881657674,0.14959598881657674,0.12462897125553388,0.12462897125553388,0.09515851168249279,0.09515851168249279,0.062253523938647894,0.062253523938647894,0.027152459411754096,0.027152459411754096],
  [0.17944647035620653,0.17656270536699264,0.17656270536699264,0.16800410215645004,0.16800410215645004,0.15404576107681028,0.15404576107681028,0.13513636846852548,0.13513636846852548,0.11188384719340397,0.11188384719340397,0.08503614831717918,0.08503614831717918,0.0554595293739872,0.0554595293739872,0.02414830286854793,0.02414830286854793],
  [0.1691423829631436,0.1691423829631436,0.16427648374583273,0.16427648374583273,0.15468467512626524,0.15468467512626524,0.14064291467065065,0.14064291467065065,0.12255520671147846,0.12255520671147846,0.10094204410628717,0.10094204410628717,0.07642573025488905,0.07642573025488905,0.0497145488949698,0.0497145488949698,0.02161601352648331,0.02161601352648331],
  [0.1610544498487837,0.15896884339395434,0.15896884339395434,0.15276604206585967,0.15276604206585967,0.1426067021736066,0.1426067021736066,0.12875396253933621,0.12875396253933621,0.11156664554733399,0.11156664554733399,0.09149002162245,0.09149002162245,0.06904454273764123,0.06904454273764123,0.0448142267656996,0.0448142267656996,0.019461788229726478,0.019461788229726478],
  [0.15275338713072584,0.15275338713072584,0.14917298647260374,0.14917298647260374,0.14209610931838204,0.14209610931838204,0.13168863844917664,0.13168863844917664,0.11819453196151841,0.11819453196151841,0.10193011981724044,0.10193011981724044,0.08327674157670475,0.08327674157670475,0.06267204833410907,0.06267204833410907,0.04060142980038694,0.04060142980038694,0.017614007139152118,0.017614007139152118],
  [0.14608113364969041,0.14452440398997005,0.14452440398997005,0.13988739479107315,0.13988739479107315,0.13226893863333747,0.13226893863333747,0.12183141605372853,0.12183141605372853,0.10879729916714838,0.10879729916714838,0.09344442345603386,0.09344442345603386,0.0761001136283793,0.0761001136283793,0.057134425426857205,0.057134425426857205,0.036953789770852494,0.036953789770852494,0.016017228257774335,0.016017228257774335],
  [0.13925187285563198,0.13925187285563198,0.13654149834601517,0.13654149834601517,0.13117350478706238,0.13117350478706238,0.12325237681051242,0.12325237681051242,0.11293229608053922,0.11293229608053922,0.10041414444288096,0.10041414444288096,0.08594160621706773,0.08594160621706773,0.06979646842452049,0.06979646842452049,0.052293335152683286,0.052293335152683286,0.03377490158481415,0.03377490158481415,0.0146279952982722,0.0146279952982722],
  [0.13365457218610619,0.1324620394046966,0.1324620394046966,0.12890572218808216,0.12890572218808216,0.12304908430672953,0.12304908430672953,0.11499664022241136,0.11499664022241136,0.10489209146454141,0.10489209146454141,0.09291576606003515,0.09291576606003515,0.07928141177671895,0.07928141177671895,0.06423242140852585,0.06423242140852585,0.04803767173108467,0.04803767173108467,0.030988005856979445,0.030988005856979445,0.013411859487141771,0.013411859487141771],
  [0.12793819534675216,0.12793819534675216,0.1258374563468283,0.1258374563468283,0.12167047292780339,0.12167047292780339,0.1155056680537256,0.1155056680537256,0.10744427011596563,0.10744427011596563,0.09761865210411388,0.09761865210411388,0.08619016153195327,0.08619016153195327,0.0733464814110803,0.0733464814110803,0.05929858491543678,0.05929858491543678,0.04427743881741981,0.04427743881741981,0.028531388628933663,0.028531388628933663,0.0123412297999872,0.0123412297999872]
];
var binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
function binomials(n, k) {
  return binomialCoefficients[n][k];
}
function getDerivative(derivative, t, vs) {
  var n = vs.length - 1,
      _vs,
      value,
      k;
  if (n === 0) {
    return 0;
  }
  if (derivative === 0) {
    value = 0;
    for (k = 0; k <= n; k++) {
      value += binomials(n, k) * Math.pow(1 - t, n - k) * Math.pow(t, k) * vs[k];
    }
    return value;
  } else {
    _vs = new Array(n);
    for (k = 0; k < n; k++) {
      _vs[k] = n * (vs[k + 1] - vs[k]);
    }
    return getDerivative(derivative - 1, t, _vs);
  }
}
function B(xs, ys, t) {
  var xbase = getDerivative(1, t, xs);
  var ybase = getDerivative(1, t, ys);
  var combined = xbase * xbase + ybase * ybase;
  return Math.sqrt(combined);
}
function getCubicArcLength(xs, ys, t) {
  var z, sum, i, correctedT;
  if (t === undefined) {
    t = 1;
  }
  var n = 20;
  z = t / 2;
  sum = 0;
  for (i = 0; i < n; i++) {
    correctedT = z * tValues[n][i] + z;
    sum += cValues[n][i] * B(xs, ys, correctedT);
  }
  return z * sum;
}
function Arc(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y) {
  return new Arc$1(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y);
}
function Arc$1(x0, y0,rx,ry, xAxisRotate, LargeArcFlag, SweepFlag,x1,y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.rx = rx;
  this.ry = ry;
  this.xAxisRotate = xAxisRotate;
  this.LargeArcFlag = LargeArcFlag;
  this.SweepFlag = SweepFlag;
  this.x1 = x1;
  this.y1 = y1;
  var lengthProperties = approximateArcLengthOfCurve(300, function(t) {
    return pointOnEllipticalArc({x: x0, y:y0}, rx, ry, xAxisRotate,
                                 LargeArcFlag, SweepFlag, {x: x1, y:y1}, t);
  });
  this.length = lengthProperties.arcLength;
}
Arc$1.prototype = {
  constructor: Arc$1,
  init: function() {
  },
  getTotalLength: function() {
    return this.length;
  },
  getPointAtLength: function(fractionLength) {
    if(fractionLength < 0){
      fractionLength = 0;
    } else if(fractionLength > this.length){
      fractionLength = this.length;
    }
    var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
      this.rx, this.ry, this.xAxisRotate,
      this.LargeArcFlag, this.SweepFlag,
      {x: this.x1, y: this.y1},
      fractionLength/this.length);
    return {x: position.x, y: position.y};
  },
  getTangentAtLength: function(fractionLength) {
    if(fractionLength < 0){
        fractionLength = 0;
        } else if(fractionLength > this.length){
        fractionLength = this.length;
        }
        var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
          this.rx, this.ry, this.xAxisRotate,
          this.LargeArcFlag, this.SweepFlag,
          {x: this.x1, y: this.y1},
          fractionLength/this.length);
        return {x: position.x, y: position.y};
  },
  getPropertiesAtLength: function(fractionLength){
    var tangent = this.getTangentAtLength(fractionLength);
    var point = this.getPointAtLength(fractionLength);
    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
  }
};
function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  xAxisRotation = mod(xAxisRotation, 360);
  var xAxisRotationRadians = toRadians(xAxisRotation);
  if(p0.x === p1.x && p0.y === p1.y) {
    return p0;
  }
  if(rx === 0 || ry === 0) {
    return this.pointOnLine(p0, p1, t);
  }
  var dx = (p0.x-p1.x)/2;
  var dy = (p0.y-p1.y)/2;
  var transformedPoint = {
    x: Math.cos(xAxisRotationRadians)*dx + Math.sin(xAxisRotationRadians)*dy,
    y: -Math.sin(xAxisRotationRadians)*dx + Math.cos(xAxisRotationRadians)*dy
  };
  var radiiCheck = Math.pow(transformedPoint.x, 2)/Math.pow(rx, 2) + Math.pow(transformedPoint.y, 2)/Math.pow(ry, 2);
  if(radiiCheck > 1) {
    rx = Math.sqrt(radiiCheck)*rx;
    ry = Math.sqrt(radiiCheck)*ry;
  }
  var cSquareNumerator = Math.pow(rx, 2)*Math.pow(ry, 2) - Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) - Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
  var cSquareRootDenom = Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) + Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
  var cRadicand = cSquareNumerator/cSquareRootDenom;
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
  var transformedCenter = {
    x: cCoef*((rx*transformedPoint.y)/ry),
    y: cCoef*(-(ry*transformedPoint.x)/rx)
  };
  var center = {
    x: Math.cos(xAxisRotationRadians)*transformedCenter.x - Math.sin(xAxisRotationRadians)*transformedCenter.y + ((p0.x+p1.x)/2),
    y: Math.sin(xAxisRotationRadians)*transformedCenter.x + Math.cos(xAxisRotationRadians)*transformedCenter.y + ((p0.y+p1.y)/2)
  };
  var startVector = {
    x: (transformedPoint.x-transformedCenter.x)/rx,
    y: (transformedPoint.y-transformedCenter.y)/ry
  };
  var startAngle = angleBetween({
    x: 1,
    y: 0
  }, startVector);
  var endVector = {
    x: (-transformedPoint.x-transformedCenter.x)/rx,
    y: (-transformedPoint.y-transformedCenter.y)/ry
  };
  var sweepAngle = angleBetween(startVector, endVector);
  if(!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2*Math.PI;
  }
  else if(sweepFlag && sweepAngle < 0) {
    sweepAngle += 2*Math.PI;
  }
  sweepAngle %= 2*Math.PI;
  var angle = startAngle+(sweepAngle*t);
  var ellipseComponentX = rx*Math.cos(angle);
  var ellipseComponentY = ry*Math.sin(angle);
  var point = {
    x: Math.cos(xAxisRotationRadians)*ellipseComponentX - Math.sin(xAxisRotationRadians)*ellipseComponentY + center.x,
    y: Math.sin(xAxisRotationRadians)*ellipseComponentX + Math.cos(xAxisRotationRadians)*ellipseComponentY + center.y
  };
  point.ellipticalArcStartAngle = startAngle;
  point.ellipticalArcEndAngle = startAngle+sweepAngle;
  point.ellipticalArcAngle = angle;
  point.ellipticalArcCenter = center;
  point.resultantRx = rx;
  point.resultantRy = ry;
  return point;
}
function approximateArcLengthOfCurve(resolution, pointOnCurveFunc) {
  resolution = resolution ? resolution : 500;
  var resultantArcLength = 0;
  var arcLengthMap = [];
  var approximationLines = [];
  var prevPoint = pointOnCurveFunc(0);
  var nextPoint;
  for(var i = 0; i < resolution; i++) {
    var t = clamp(i*(1/resolution), 0, 1);
    nextPoint = pointOnCurveFunc(t);
    resultantArcLength += distance(prevPoint, nextPoint);
    approximationLines.push([prevPoint, nextPoint]);
    arcLengthMap.push({
      t: t,
      arcLength: resultantArcLength
    });
    prevPoint = nextPoint;
  }
  nextPoint = pointOnCurveFunc(1);
  approximationLines.push([prevPoint, nextPoint]);
  resultantArcLength += distance(prevPoint, nextPoint);
  arcLengthMap.push({
    t: 1,
    arcLength: resultantArcLength
  });
  return {
    arcLength: resultantArcLength,
    arcLengthMap: arcLengthMap,
    approximationLines: approximationLines
  };
}
function mod(x, m) {
  return (x%m + m)%m;
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
function distance(p0, p1) {
  return Math.sqrt(Math.pow(p1.x-p0.x, 2) + Math.pow(p1.y-p0.y, 2));
}
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
function angleBetween(v0, v1) {
  var p = v0.x*v1.x + v0.y*v1.y;
  var n = Math.sqrt((Math.pow(v0.x, 2)+Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2)+Math.pow(v1.y, 2)));
  var sign = v0.x*v1.y - v0.y*v1.x < 0 ? -1 : 1;
  var angle = sign*Math.acos(p/n);
  return angle;
}
function LinearPosition(x0, x1, y0, y1) {
  return new LinearPosition$1(x0, x1, y0, y1);
}
function LinearPosition$1(x0, x1, y0, y1){
  this.x0 = x0;
  this.x1 = x1;
  this.y0 = y0;
  this.y1 = y1;
}
LinearPosition$1.prototype.getTotalLength = function(){
  return Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
         Math.pow(this.y0 - this.y1, 2));
};
LinearPosition$1.prototype.getPointAtLength = function(pos){
  var fraction = pos/ (Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
         Math.pow(this.y0 - this.y1, 2)));
  var newDeltaX = (this.x1 - this.x0)*fraction;
  var newDeltaY = (this.y1 - this.y0)*fraction;
  return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
};
LinearPosition$1.prototype.getTangentAtLength = function(){
  var module = Math.sqrt((this.x1 - this.x0) * (this.x1 - this.x0) +
              (this.y1 - this.y0) * (this.y1 - this.y0));
  return { x: (this.x1 - this.x0)/module, y: (this.y1 - this.y0)/module };
};
LinearPosition$1.prototype.getPropertiesAtLength = function(pos){
  var point = this.getPointAtLength(pos);
  var tangent = this.getTangentAtLength();
  return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
};
function PathProperties(svgString) {
  var length = 0;
  var partial_lengths = [];
  var functions = [];
  function svgProperties(string){
    if(!string){return null;}
    var parsed = parse(string);
    var cur = [0, 0];
    var prev_point = [0, 0];
    var curve;
    var ringStart;
    for (var i = 0; i < parsed.length; i++){
      if(parsed[i][0] === "M"){
        cur = [parsed[i][1], parsed[i][2]];
        ringStart = [cur[0], cur[1]];
        functions.push(null);
      } else if(parsed[i][0] === "m"){
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        ringStart = [cur[0], cur[1]];
        functions.push(null);
      }
      else if(parsed[i][0] === "L"){
        length = length + Math.sqrt(Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2));
        functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]));
        cur = [parsed[i][1], parsed[i][2]];
      } else if(parsed[i][0] === "l"){
        length = length + Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
        functions.push(new LinearPosition(cur[0], parsed[i][1] + cur[0], cur[1], parsed[i][2] + cur[1]));
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
      } else if(parsed[i][0] === "H"){
        length = length + Math.abs(cur[0] - parsed[i][1]);
        functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1]));
        cur[0] = parsed[i][1];
      } else if(parsed[i][0] === "h"){
        length = length + Math.abs(parsed[i][1]);
        functions.push(new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1]));
        cur[0] = parsed[i][1] + cur[0];
      } else if(parsed[i][0] === "V"){
        length = length + Math.abs(cur[1] - parsed[i][1]);
        functions.push(new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1]));
        cur[1] = parsed[i][1];
      } else if(parsed[i][0] === "v"){
        length = length + Math.abs(parsed[i][1]);
        functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1]));
        cur[1] = parsed[i][1] + cur[1];
      }  else if(parsed[i][0] === "z" || parsed[i][0] === "Z"){
        length = length + Math.sqrt(Math.pow(ringStart[0] - cur[0], 2) + Math.pow(ringStart[1] - cur[1], 2));
        functions.push(new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1]));
        cur = [ringStart[0], ringStart[1]];
      }
      else if(parsed[i][0] === "C"){
        curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4] , parsed[i][5], parsed[i][6]);
        length = length + curve.getTotalLength();
        cur = [parsed[i][5], parsed[i][6]];
        functions.push(curve);
      } else if(parsed[i][0] === "c"){
        curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4] , cur[0] + parsed[i][5], cur[1] + parsed[i][6]);
        if(curve.getTotalLength() > 0){
          length = length + curve.getTotalLength();
          functions.push(curve);
          cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
        } else {
          functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1]));
        }
      } else if(parsed[i][0] === "S"){
        if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
          curve = new Bezier(cur[0], cur[1] , 2*cur[0] - parsed[i-1][parsed[i-1].length - 4], 2*cur[1] - parsed[i-1][parsed[i-1].length - 3], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
        } else {
          curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
        }
        length = length + curve.getTotalLength();
        cur = [parsed[i][3], parsed[i][4]];
        functions.push(curve);
      }  else if(parsed[i][0] === "s"){
        if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
          curve = new Bezier(cur[0], cur[1] , cur[0] + curve.d.x - curve.c.x, cur[1] + curve.d.y - curve.c.y, cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
        } else {
          curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
        }
        length = length + curve.getTotalLength();
        cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
        functions.push(curve);
      }
      else if(parsed[i][0] === "Q"){
        if(cur[0] == parsed[i][1] && cur[1] == parsed[i][2]){
          curve = new LinearPosition(parsed[i][1], parsed[i][3], parsed[i][2], parsed[i][4]);
        } else {
          curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
        }
        length = length + curve.getTotalLength();
        functions.push(curve);
        cur = [parsed[i][3], parsed[i][4]];
        prev_point = [parsed[i][1], parsed[i][2]];
      }  else if(parsed[i][0] === "q"){
        if(!(parsed[i][1] == 0 && parsed[i][2] == 0)){
          curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
        } else {
          curve = new LinearPosition(cur[0] + parsed[i][1], cur[0] + parsed[i][3], cur[1] + parsed[i][2], cur[1] + parsed[i][4]);
        }
        length = length + curve.getTotalLength();
        prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
        cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
        functions.push(curve);
      } else if(parsed[i][0] === "T"){
        if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
          curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , parsed[i][1], parsed[i][2]);
        } else {
          curve = new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]);
        }
        functions.push(curve);
        length = length + curve.getTotalLength();
        prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
        cur = [parsed[i][1], parsed[i][2]];
      } else if(parsed[i][0] === "t"){
        if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
          curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
        } else {
          curve = new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1] + parsed[i][2]);
        }
        length = length + curve.getTotalLength();
        prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
        cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
        functions.push(curve);
      } else if(parsed[i][0] === "A"){
        curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], parsed[i][6], parsed[i][7]);
        length = length + curve.getTotalLength();
        cur = [parsed[i][6], parsed[i][7]];
        functions.push(curve);
      } else if(parsed[i][0] === "a"){
        curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], cur[0] + parsed[i][6], cur[1] + parsed[i][7]);
        length = length + curve.getTotalLength();
        cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
        functions.push(curve);
      }
      partial_lengths.push(length);
    }
    return svgProperties;
  }
 svgProperties.getTotalLength = function(){
    return length;
  };
  svgProperties.getPointAtLength = function(fractionLength){
    var fractionPart = getPartAtLength(fractionLength);
    return functions[fractionPart.i].getPointAtLength(fractionPart.fraction);
  };
  svgProperties.getTangentAtLength = function(fractionLength){
    var fractionPart = getPartAtLength(fractionLength);
    return functions[fractionPart.i].getTangentAtLength(fractionPart.fraction);
  };
  svgProperties.getPropertiesAtLength = function(fractionLength){
    var fractionPart = getPartAtLength(fractionLength);
    return functions[fractionPart.i].getPropertiesAtLength(fractionPart.fraction);
  };
  svgProperties.getParts = function(){
    var parts = [];
    for(var i = 0; i< functions.length; i++){
      if(functions[i] != null){
        var properties = {};
        properties['start'] = functions[i].getPointAtLength(0);
        properties['end'] = functions[i].getPointAtLength(partial_lengths[i] - partial_lengths[i-1]);
        properties['length'] = partial_lengths[i] - partial_lengths[i-1];
        (function(func){
          properties['getPointAtLength'] = function(d){return func.getPointAtLength(d);};
          properties['getTangentAtLength'] = function(d){return func.getTangentAtLength(d);};
          properties['getPropertiesAtLength'] = function(d){return func.getPropertiesAtLength(d);};
        })(functions[i]);
        parts.push(properties);
      }
    }
    return parts;
  };
  var getPartAtLength = function(fractionLength){
    if(fractionLength < 0){
      fractionLength = 0;
    } else if(fractionLength > length){
      fractionLength = length;
    }
    var i = partial_lengths.length - 1;
    while(partial_lengths[i] >= fractionLength && partial_lengths[i] > 0){
      i--;
    }
    i++;
    return {fraction: fractionLength-partial_lengths[i-1], i: i};
  };
  return svgProperties(svgString);
}
const emptyValue = { value: 0 };
const pointStringToArray = function (str) {
  return str.split(" ")
    .filter(s => s !== "")
    .map(p => p.split(",")
      .map(n => parseFloat(n)));
};
const getAttributes = function (element, attributeList) {
  const indices = attributeList.map((attr) => {
    for (let i = 0; i < element.attributes.length; i += 1) {
      if (element.attributes[i].nodeName === attr) {
        return i;
      }
    }
    return undefined;
  });
  return indices
    .map(i => (i === undefined ? emptyValue : element.attributes[i]))
    .map(attr => (attr.value !== undefined ? attr.value : attr.baseVal.value));
};
const svg_line_to_segments = function (line) {
  return [getAttributes(line, ["x1", "y1", "x2", "y2"])];
};
const svg_rect_to_segments = function (rect) {
  const attrs = getAttributes(rect, ["x", "y", "width", "height"]);
  const x = parseFloat(attrs[0]);
  const y = parseFloat(attrs[1]);
  const width = parseFloat(attrs[2]);
  const height = parseFloat(attrs[3]);
  return [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y],
  ];
};
const svg_circle_to_segments = function (circle, RESOLUTION = 64) {
  const attrs = getAttributes(circle, ["cx", "cy", "r"]);
  const cx = parseFloat(attrs[0]);
  const cy = parseFloat(attrs[1]);
  const r = parseFloat(attrs[2]);
  return Array.from(Array(RESOLUTION))
    .map((_, i) => [
      cx + r * Math.cos(i / RESOLUTION * Math.PI * 2),
      cy + r * Math.sin(i / RESOLUTION * Math.PI * 2),
    ]).map((_, i, arr) => [
      arr[i][0],
      arr[i][1],
      arr[(i + 1) % arr.length][0],
      arr[(i + 1) % arr.length][1],
    ]);
};
const svg_ellipse_to_segments = function (ellipse, RESOLUTION = 64) {
  const attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
  const cx = parseFloat(attrs[0]);
  const cy = parseFloat(attrs[1]);
  const rx = parseFloat(attrs[2]);
  const ry = parseFloat(attrs[3]);
  return Array.from(Array(RESOLUTION))
    .map((_, i) => [
      cx + rx * Math.cos(i / RESOLUTION * Math.PI * 2),
      cy + ry * Math.sin(i / RESOLUTION * Math.PI * 2),
    ]).map((_, i, arr) => [
      arr[i][0],
      arr[i][1],
      arr[(i + 1) % arr.length][0],
      arr[(i + 1) % arr.length][1],
    ]);
};
const svg_polygon_to_segments = function (polygon) {
  let points = "";
  for (let i = 0; i < polygon.attributes.length; i += 1) {
    if (polygon.attributes[i].nodeName === "points") {
      points = polygon.attributes[i].value;
      break;
    }
  }
  return pointStringToArray(points)
    .map((_, i, a) => [
      a[i][0],
      a[i][1],
      a[(i + 1) % a.length][0],
      a[(i + 1) % a.length][1],
    ]);
};
const svg_polyline_to_segments = function (polyline) {
  const circularPath = svg_polygon_to_segments(polyline);
  circularPath.pop();
  return circularPath;
};
const svg_path_to_segments = function (path, RESOLUTION = 128) {
  const d = path.getAttribute("d");
  const prop = PathProperties(d);
  const length = prop.getTotalLength();
  const isClosed = (d[d.length - 1] === "Z" || d[d.length - 1] === "z");
  const segmentLength = (isClosed
    ? length / RESOLUTION
    : length / (RESOLUTION - 1));
  const pathsPoints = Array.from(Array(RESOLUTION))
    .map((_, i) => prop.getPointAtLength(i * segmentLength))
    .map(p => [p.x, p.y]);
  const segments = pathsPoints.map((_, i, a) => [
    a[i][0],
    a[i][1],
    a[(i + 1) % a.length][0],
    a[(i + 1) % a.length][1],
  ]);
  if (!isClosed) { segments.pop(); }
  return segments;
};
const parsers = {
  line: svg_line_to_segments,
  rect: svg_rect_to_segments,
  circle: svg_circle_to_segments,
  ellipse: svg_ellipse_to_segments,
  polygon: svg_polygon_to_segments,
  polyline: svg_polyline_to_segments,
  path: svg_path_to_segments,
};
var attributes = {
  line: ["x1", "y1", "x2", "y2"],
  rect: ["x", "y", "width", "height"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  path: ["d"],
};
const flattenTree = function (element) {
  if (element.tagName === "g" || element.tagName === "svg") {
    if (element.childNodes == null) { return []; }
    return Array.from(element.childNodes)
      .map(child => flattenTree(child))
      .reduce((a, b) => a.concat(b), []);
  }
  return [element];
};
const multiply_line_matrix2 = function (line, matrix) {
  return [
    line[0] * matrix[0] + line[1] * matrix[2] + matrix[4],
    line[0] * matrix[1] + line[1] * matrix[3] + matrix[5],
    line[2] * matrix[0] + line[3] * matrix[2] + matrix[4],
    line[2] * matrix[1] + line[3] * matrix[3] + matrix[5],
  ];
};
const multiply_matrices2 = function (m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
};
const parseTransform = function (transform) {
  const parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
  const listForm = parsed.map(a => a.match(/[\w\.\-]+/g));
  return listForm.map(a => ({
    transform: a.shift(),
    parameters: a.map(p => parseFloat(p)),
  }));
};
const matrixFormTranslate = function (params) {
  switch (params.length) {
    case 1: return [1, 0, 0, 1, params[0], 0];
    case 2: return [1, 0, 0, 1, params[0], params[1]];
    default: console.warn(`improper translate, ${params}`);
  }
  return undefined;
};
const matrixFormRotate = function (params) {
  const cos_p = Math.cos(params[0] / 180 * Math.PI);
  const sin_p = Math.sin(params[0] / 180 * Math.PI);
  switch (params.length) {
    case 1: return [cos_p, sin_p, -sin_p, cos_p, 0, 0];
    case 3: return [cos_p, sin_p, -sin_p, cos_p,
      -params[1] * cos_p + params[2] * sin_p + params[1],
      -params[1] * sin_p - params[2] * cos_p + params[2]];
    default: console.warn(`improper rotate, ${params}`);
  }
  return undefined;
};
const matrixFormScale = function (params) {
  switch (params.length) {
    case 1: return [params[0], 0, 0, params[0], 0, 0];
    case 2: return [params[0], 0, 0, params[1], 0, 0];
    default: console.warn(`improper scale, ${params}`);
  }
  return undefined;
};
const matrixFormSkewX = function (params) {
  return [1, 0, Math.tan(params[0] / 180 * Math.PI), 1, 0, 0];
};
const matrixFormSkewY = function (params) {
  return [1, Math.tan(params[0] / 180 * Math.PI), 0, 1, 0, 0];
};
const matrixForm = function (transformType, params) {
  switch (transformType) {
    case "translate": return matrixFormTranslate(params);
    case "rotate": return matrixFormRotate(params);
    case "scale": return matrixFormScale(params);
    case "skewX": return matrixFormSkewX(params);
    case "skewY": return matrixFormSkewY(params);
    case "matrix": return params;
    default: console.warn(`unknown transform type ${transformType}`);
  }
  return undefined;
};
const transformStringToMatrix = function (string) {
  return parseTransform(string)
    .map(el => matrixForm(el.transform, el.parameters))
    .filter(a => a !== undefined)
    .reduce((a, b) => multiply_matrices2(a, b), [1, 0, 0, 1, 0, 0]);
};
const get_transform_as_matrix = function (element) {
  if (typeof element.getAttribute !== "function") {
    return [1, 0, 0, 1, 0, 0];
  }
  const transformAttr = element.getAttribute("transform");
  if (transformAttr != null && transformAttr !== "") {
    return transformStringToMatrix(transformAttr);
  }
  return [1, 0, 0, 1, 0, 0];
};
const apply_nested_transforms = function (element, stack = [1, 0, 0, 1, 0, 0]) {
  const local = multiply_matrices2(stack, get_transform_as_matrix(element));
  element.matrix = local;
  if (element.tagName === "g" || element.tagName === "svg") {
    if (element.childNodes == null) { return; }
    Array.from(element.childNodes)
      .forEach(child => apply_nested_transforms(child, local));
  }
};
const parseable = Object.keys(parsers);
const attribute_list = function (element) {
  return Array.from(element.attributes)
    .filter(a => attributes[element.tagName].indexOf(a.name) === -1);
};
const objectifyAttributeList = function (list) {
  const obj = {};
  list.forEach((a) => { obj[a.nodeName] = a.value; });
  return obj;
};
const segmentize = function (input, options = {}) {
  const RESOLUTION = typeof options.resolution === "object"
    ? options.resolution
    : {};
  if (typeof options.resolution === "number") {
    ["circle", "ellipse", "path"].forEach((k) => {
      RESOLUTION[k] = options.resolution;
    });
  }
  apply_nested_transforms(input);
  const elements = flattenTree(input);
  const lineSegments = elements
    .filter(el => parseable.indexOf(el.tagName) !== -1)
    .map(el => parsers[el.tagName](el, RESOLUTION[el.tagName])
      .map(unit => multiply_line_matrix2(unit, el.matrix))
      .map(unit => [...unit, attribute_list(el)]))
    .reduce((a, b) => a.concat(b), []);
  lineSegments
    .filter(a => a[4] !== undefined)
    .forEach((seg) => {
      const noTransforms = seg[4].filter(a => a.nodeName !== "transform");
      seg[4] = objectifyAttributeList(noTransforms);
    });
  return lineSegments;
};
var svgNS = "http://www.w3.org/2000/svg";
const svgAttributes = [
  "version",
  "xmlns",
  "contentScriptType",
  "contentStyleType",
  "baseProfile",
  "class",
  "externalResourcesRequired",
  "x",
  "y",
  "width",
  "height",
  "viewBox",
  "preserveAspectRatio",
  "zoomAndPan",
  "style",
];
const headerTagNames = {
  "defs": true,
  "metadata": true,
  "title": true,
  "desc": true,
  "style": true,
};
const segmentsToSVG = function (lineSegments, inputSVG) {
  const newSVG = win.document.createElementNS(svgNS, "svg");
  if (inputSVG !== undefined) {
    svgAttributes.map(a => ({ attribute: a, value: inputSVG.getAttribute(a) }))
      .filter(obj => obj.value != null && obj.value !== "")
      .forEach(obj => newSVG.setAttribute(obj.attribute, obj.value));
  }
  if (newSVG.getAttribute("xmlns") === null) {
    newSVG.setAttribute("xmlns", svgNS);
  }
  Array.from(inputSVG.childNodes)
    .filter(el => headerTagNames[el.tagName])
    .map(el => el.cloneNode(true))
    .forEach(el => newSVG.appendChild(el));
  lineSegments.forEach((s) => {
    const line = win.document.createElementNS(svgNS, "line");
    attributes.line.forEach((attr, i) => line.setAttributeNS(null, attr, s[i]));
    if (s[4] != null) {
      Object.keys(s[4]).forEach(key => line.setAttribute(key, s[4][key]));
    }
    newSVG.appendChild(line);
  });
  return newSVG;
};
const defaults = Object.freeze({
  input: "string",
  output: "string",
  resolution: Object.freeze({
    circle: 64,
    ellipse: 64,
    path: 128
  })
});
const xmlStringToDOM = function (input) {
  return (typeof input === "string" || input instanceof String
    ? (new win.DOMParser()).parseFromString(input, "text/xml").documentElement
    : input);
};
const Segmentize = function (input, options = defaults) {
  const inputSVG = options.input === "svg"
    ? input
    : xmlStringToDOM(input);
  const lineSegments = segmentize(inputSVG, options);
  if (options.output === "data") {
    return lineSegments;
  }
  const newSVG = segmentsToSVG(lineSegments, inputSVG);
  if (options.output === "svg") {
    return newSVG;
  }
  const stringified = new win.XMLSerializer().serializeToString(newSVG);
  return vkXML(stringified);
};
export default Segmentize;
