/**
 * creative coding toolkit
 */

(function () {
  // simplex noise, Jonas Wagner, https://github.com/jwagner/simplex-noise.js
  /*
   * A fast javascript implementation of simplex noise by Jonas Wagner
  Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
  Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
  With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
  Better rank ordering method by Stefan Gustavson in 2012.
   Copyright (c) 2018 Jonas Wagner
  */
  var F2=.5*(Math.sqrt(3)-1),G2=(3-Math.sqrt(3))/6,F3=1/3,G3=1/6,F4=(Math.sqrt(5)-1)/4,G4=(5-Math.sqrt(5))/20;
  function SimplexNoise(a){var b;b="function"==typeof a?a:a?alea(a):Math.random,this.p=buildPermutationTable(b),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var c=0;512>c;c++)this.perm[c]=this.p[255&c],this.permMod12[c]=this.perm[c]%12}
  SimplexNoise.prototype={
    grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),
    grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),
    noise2D:function(a,b){var d,e,c=Math.floor,f=this.permMod12,g=this.perm,h=this.grad3,k=0,l=0,m=0,n=(a+b)*F2,o=c(a+n),i=c(b+n),j=(o+i)*G2,p=a-(o-j),q=b-(i-j);p>q?(d=1,e=0):(d=0,e=1);var r=p-d+G2,s=q-e+G2,t=p-1+2*G2,u=q-1+2*G2,v=255&o,w=255&i,x=.5-p*p-q*q;if(0<=x){var y=3*f[v+g[w]];x*=x,k=x*x*(h[y]*p+h[y+1]*q)}var z=.5-r*r-s*s;if(0<=z){var A=3*f[v+d+g[w+e]];z*=z,l=z*z*(h[A]*r+h[A+1]*s)}var B=.5-t*t-u*u;if(0<=B){var C=3*f[v+1+g[w+1]];B*=B,m=B*B*(h[C]*t+h[C+1]*u)}return 70*(k+l+m)},
    noise3D:function(a,b,c){var e,f,g,h,l,m,n,o,p,q,d=Math.floor,r=this.permMod12,u=this.perm,v=this.grad3,w=(a+b+c)*F3,s=d(a+w),i=d(b+w),j=d(c+w),k=(s+i+j)*G3,t=a-(s-k),x=b-(i-k),y=c-(j-k);t>=x?x>=y?(l=1,m=0,n=0,o=1,p=1,q=0):t>=y?(l=1,m=0,n=0,o=1,p=0,q=1):(l=0,m=0,n=1,o=1,p=0,q=1):x<y?(l=0,m=0,n=1,o=0,p=1,q=1):t<y?(l=0,m=1,n=0,o=0,p=1,q=1):(l=0,m=1,n=0,o=1,p=1,q=0);var z=t-l+G3,A=x-m+G3,B=y-n+G3,C=t-o+2*G3,D=x-p+2*G3,E=y-q+2*G3,F=t-1+3*G3,G=x-1+3*G3,H=y-1+3*G3,I=255&s,J=255&i,K=255&j,L=.6-t*t-x*x-y*y;if(0>L)e=0;else{var M=3*r[I+u[J+u[K]]];L*=L,e=L*L*(v[M]*t+v[M+1]*x+v[M+2]*y)}var N=.6-z*z-A*A-B*B;if(0>N)f=0;else{var O=3*r[I+l+u[J+m+u[K+n]]];N*=N,f=N*N*(v[O]*z+v[O+1]*A+v[O+2]*B)}var P=.6-C*C-D*D-E*E;if(0>P)g=0;else{var Q=3*r[I+o+u[J+p+u[K+q]]];P*=P,g=P*P*(v[Q]*C+v[Q+1]*D+v[Q+2]*E)}var R=.6-F*F-G*G-H*H;if(0>R)h=0;else{var S=3*r[I+1+u[J+1+u[K+1]]];R*=R,h=R*R*(v[S]*F+v[S+1]*G+v[S+2]*H)}return 32*(e+f+g+h)},
    noise4D:function(a,b,c,d){var f,g,h,m,n,e=Math.floor,o=this.perm,p=this.grad4,q=(a+b+c+d)*F4,r=e(a+q),i=e(b+q),j=e(c+q),k=e(d+q),l=(r+i+j+k)*G4,s=a-(r-l),t=b-(i-l),u=c-(j-l),v=d-(k-l),w=0,x=0,y=0,z=0;s>t?w++:x++,s>u?w++:y++,s>v?w++:z++,t>u?x++:y++,t>v?x++:z++,u>v?y++:z++;var A,B,C,D,E,F,G,H,I,J,K,L;A=3<=w?1:0,B=3<=x?1:0,C=3<=y?1:0,D=3<=z?1:0,E=2<=w?1:0,F=2<=x?1:0,G=2<=y?1:0,H=2<=z?1:0,I=1<=w?1:0,J=1<=x?1:0,K=1<=y?1:0,L=1<=z?1:0;var M=s-A+G4,N=t-B+G4,O=u-C+G4,P=v-D+G4,Q=s-E+2*G4,R=t-F+2*G4,S=u-G+2*G4,T=v-H+2*G4,U=s-I+3*G4,V=t-J+3*G4,W=u-K+3*G4,X=v-L+3*G4,Y=s-1+4*G4,Z=t-1+4*G4,$=u-1+4*G4,_=v-1+4*G4,aa=255&r,ba=255&i,ca=255&j,da=255&k,ea=.6-s*s-t*t-u*u-v*v;if(0>ea)f=0;else{var fa=4*(o[aa+o[ba+o[ca+o[da]]]]%32);ea*=ea,f=ea*ea*(p[fa]*s+p[fa+1]*t+p[fa+2]*u+p[fa+3]*v)}var ga=.6-M*M-N*N-O*O-P*P;if(0>ga)g=0;else{var ha=4*(o[aa+A+o[ba+B+o[ca+C+o[da+D]]]]%32);ga*=ga,g=ga*ga*(p[ha]*M+p[ha+1]*N+p[ha+2]*O+p[ha+3]*P)}var ia=.6-Q*Q-R*R-S*S-T*T;if(0>ia)h=0;else{var ja=4*(o[aa+E+o[ba+F+o[ca+G+o[da+H]]]]%32);ia*=ia,h=ia*ia*(p[ja]*Q+p[ja+1]*R+p[ja+2]*S+p[ja+3]*T)}var ka=.6-U*U-V*V-W*W-X*X;if(0>ka)m=0;else{var la=4*(o[aa+I+o[ba+J+o[ca+K+o[da+L]]]]%32);ka*=ka,m=ka*ka*(p[la]*U+p[la+1]*V+p[la+2]*W+p[la+3]*X)}var ma=.6-Y*Y-Z*Z-$*$-_*_;if(0>ma)n=0;else{var na=4*(o[aa+1+o[ba+1+o[ca+1+o[da+1]]]]%32);ma*=ma,n=ma*ma*(p[na]*Y+p[na+1]*Z+p[na+2]*$+p[na+3]*_)}return 27*(f+g+h+m+n)}};
  function buildPermutationTable(a){var b,c=new Uint8Array(256);for(b=0;256>b;b++)c[b]=b;for(b=0;255>b;b++){var d=b+~~(a()*(256-b)),e=c[b];c[b]=c[d],c[d]=e}return c}SimplexNoise._buildPermutationTable=buildPermutationTable;function alea(){var a=0,b=0,d=0,e=1,f=masher();a=f(" "),b=f(" "),d=f(" ");for(var g=0;g<arguments.length;g++)a-=f(arguments[g]),0>a&&(a+=1),b-=f(arguments[g]),0>b&&(b+=1),d-=f(arguments[g]),0>d&&(d+=1);return f=null,function(){var c=2091639*a+23283064365386963e-26*e;return a=b,b=d,d=c-(e=0|c)}}
  function masher(){var a=4022871197;return function(b){b=b.toString();for(var c=0;c<b.length;c++){a+=b.charCodeAt(c);var d=.02519603282416938*a;a=d>>>0,d-=a,d*=a,a=d>>>0,d-=a,a+=4294967296*d}return 23283064365386963e-26*(a>>>0)}}

  var Noise = new SimplexNoise();

  var noise = function () {
    switch (arguments.length) {
      case 1: return Noise.noise2D(arguments[0], 0);
      case 2: return Noise.noise2D(arguments[0], arguments[1]);
      case 3: return Noise.noise3D(arguments[0], arguments[1], arguments[2]);
      case 4: return Noise.noise4D(arguments[0], arguments[1], arguments[2], arguments[3]);
      default: return 0;
    }
  };

  var random = function (a, b) {
    if (typeof a === "object" && a.length != null) {
      return a.length > 0
        ? a[Math.floor(Math.random() * a.length)]
        : null;
    }
    if (b != null) { return Math.random() * (b - a) + a; }
    if (a != null) { return Math.random() * a; }
    return Math.random();
  };

  var randomInt = function (a, b) {
    return Math.floor(random(a, b));
  };

  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  var randomString = function (count, chars) {
    if (chars == null) { chars = abc; }
    if (count == null) { count = 0; }
    return Array.from(Array(count))
      .map(function () { return Math.floor(Math.random() * chars.length); })
      .map(function (i) { return chars[i]; })
      .reduce(function (a, b) { return a + b; }, "");
  };

  window.noise = noise;
  window.random = random;
  window.randomInt = randomInt;
  window.randomString = randomString;
  window.PI = Math.PI;
}());
