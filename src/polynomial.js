/* Adapted from script available free online at
The JavaScript Source!! http://www.javascriptsource.com
Original:	Duy Vuong	(dd_vuong@yahoo.com )
Web Site:	http://www.scienceit.freeurl.com/sitepage.htm

Converted to typescript by Martin Hunt (@Starwarigami)*/

function isValidNumber(n){return(n!==undefined&&!isNaN(n)&&!isNaN(n));}

class ComplexNumber
{
	// x;
	// y;
	// r;
	// phi;


	constructor(a, b)
	{
		this.TOLERANCE = 1.E-10;
		if (a instanceof ComplexNumber)
		{
			this.x = a.x;
			this.y = a.y;
			this.r = a.r;
			this.phi = a.phi;
		}
		else
		{
			this.x = isValidNumber(a) && Math.abs(a) > this.TOLERANCE ? a : 0;
			this.y = isValidNumber(b) && Math.abs(b) > this.TOLERANCE ? b : 0;
			this.r = Math.sqrt(this.x*this.x + this.y*this.y);
			if (this.r == 0) this.phi = 0;
			else if (this.y >= 0) this.phi = Math.acos(this.x/this.r);
			else if (this.y < 0) this.phi = Math.acos(-1*this.x/this.r) + Math.PI;
		}
	}

	fromRandPhi(r, phi)
	{
		var c = new ComplexNumber();
		c.r = r;
		c.phi = phi;
		c.x = r * Math.cos(phi);
		c.y = r * Math.sin(phi);
		if (Math.abs(c.x) < this.TOLERANCE) c.x = 0;
		if (Math.abs(c.y) < this.TOLERANCE) c.y = 0;
		return c;
	}

	add(a, b)
	{
		var that = new ComplexNumber(a,b);
		return new ComplexNumber(this.x + that.x, this.y + that.y);
	}
	subtract(a, b)
	{
		var that = new ComplexNumber(a,b);
		return new ComplexNumber(this.x - that.x, this.y - that.y);
	}
	multiply(a, b)
	{
		var that = new ComplexNumber(a,b);
		return new ComplexNumber(this.x*that.x - this.y*that.y, this.y*that.x + this.x*that.y);
	}
	divide(a, b)
	{
		var that = new ComplexNumber(a,b);
		var r = that.x*that.x + that.y*that.y;
		return new ComplexNumber((this.x*that.x + this.y*that.y)/r, (this.y*that.x - this.x*that.y)/r);
	}
	sqrt(rank)
	{
		if (!isValidNumber(rank)) rank = 0;
		if (this.r == 0) return new ComplexNumber();
		return new ComplexNumber().fromRandPhi(Math.sqrt(this.r), (this.phi + 2*Math.PI*rank)/2);
	}
	cubrt(rank)
	{
		if (!isValidNumber(rank)) rank = 0;
		if (this.r == 0) return new ComplexNumber();
		return new ComplexNumber().fromRandPhi(Math.pow(this.r,1/3), (this.phi + 2*Math.PI*rank)/3);
	}
	square() { return this.multiply(this); }
	cube() { return this.square().multiply(this); }
	equals(a, b)
	{
		var that = new ComplexNumber(a,b);
		return this.x == that.x && this.y == that.y;
	}
	isZero() { return this.x == 0 && this.y == 0; }
	isReal() { return this.y == 0; }
	isImaginary() { return this.x == 0 && this.y != 0; }
}

class Polynomial
{
	order(){}
	parameters(){}
	roots(){}
	realRoots()
	{
		return this.roots()
			.filter(function(root) { return root.y == 0; } )
			.map(function(root) { return root.x; } );
	}
}

class LinearEquation extends Polynomial
{
	// a;
	// b;

	constructor(a, b)
	{
		super();
		this.a = a instanceof ComplexNumber ? a : new ComplexNumber(a);
		this.b = b instanceof ComplexNumber ? b : new ComplexNumber(b);
	}

	order() { return 1; }
	parameters() { return [this.a, this.b]; }

	roots()
	{
		if (!this.a.isZero()) { return[this.b.multiply(-1).divide(this.a)]; }
		return [];
	}
}

class QuadraticEquation extends Polynomial
{
	// a;
	// b;
	// c;

	constructor(a, b, c)
	{
		super();
		this.a = a instanceof ComplexNumber ? a : new ComplexNumber(a);
		this.b = b instanceof ComplexNumber ? b : new ComplexNumber(b);
		this.c = c instanceof ComplexNumber ? c : new ComplexNumber(c);
	}

	order() { return 2; }
	parameters() { return [this.a, this.b, this.c]; }

	roots()
	{
		if (!this.a.isZero())
		{
			var bOver2A = this.b.divide(this.a.multiply(2));
			var cOverA = this.c.divide(this.a);
			var delta = bOver2A.square().subtract(cOverA);
			var root1 = delta.sqrt().subtract(bOver2A);
			var root2 = delta.sqrt(1).subtract(bOver2A);
			var roots = [root1];
			if (!root1.equals(root2)) roots.push(root2);
			return roots;
		}
		else return new LinearEquation(this.b, this.c).roots();
	}
}

class DepressedCubicEquation extends Polynomial
{
	// m;
	// n;
	// b;

	constructor(m, n)
	{
		super();
		this.m = m instanceof ComplexNumber ? m : new ComplexNumber(m);
		this.n = n instanceof ComplexNumber ? n : new ComplexNumber(n);
	}

	order() { return 3; }
	parameters() { return [new ComplexNumber(1), new ComplexNumber(), this.m, this.n]; }

	roots()
	{
			var t1 = this.m.divide(3).cube();
			var t2 = this.n.divide(2).square().add(t1);
			var delta = t2.sqrt().subtract(this.n.divide(2));
			if(delta.isZero()) delta = t2.sqrt(1).subtract(this.n.divide(2));

			var delta0 = delta.cubrt();
			var root1 = delta0.subtract(this.m.divide(delta0.multiply(3)));

			var delta1 = delta.cubrt(1);
			var root2 = delta1.subtract(this.m.divide(delta1.multiply(3)));

			var delta2 = delta.cubrt(2);
			var root3 = delta2.subtract(this.m.divide(delta2.multiply(3)));

			var roots = [root1];
			if (!root1.equals(root2)) roots.push(root2);
			if (!root1.equals(root3) && !root2.equals(root3)) roots.push(root3);
			return roots;
	}
}

export default class CubicEquation extends Polynomial
{
	// a;
	// b;
	// c;
	// d;

	constructor(a, b, c, d)
	{
		super();
		this.a = a instanceof ComplexNumber ? a : new ComplexNumber(a);
		this.b = b instanceof ComplexNumber ? b : new ComplexNumber(b);
		this.c = c instanceof ComplexNumber ? c : new ComplexNumber(c);
		this.d = d instanceof ComplexNumber ? d : new ComplexNumber(d);
	}

	order() { return 3; }
	parameters() { return [this.a, this.b, this.c, this.d]; }

	roots()
	{
		if (!this.a.isZero())
		{
			var b1 = this.b.divide(this.a);
			var c1 = this.c.divide(this.a);
			var d1 = this.d.divide(this.a);
			var m = c1.subtract(b1.square().divide(3));
			var n = d1.subtract(b1.multiply(c1).divide(3)).add(b1.cube().multiply(2/27));
			return new DepressedCubicEquation(m,n).roots()
				.map(function(root){ return root.subtract(b1.divide(3)); });
		}
		else return new QuadraticEquation(this.b, this.c, this.d).roots();
	}
}
