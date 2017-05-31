# Reference Finder Source Code

This is an overview of the source code for Reference Finder, written by Robert Lang between 1999-2006. The primary objective is to comprehend the implementation of the 7 Huzita–Hatori-Justin Axioms and the data structures it depends upon.

[Reference Finder and the source code at langorigami.com](http://www.langorigami.com/article/referencefinder)

This article contains source code from Reference Finder, released under the GNU GPL

## Overview

### Simple Geometry

* point
* line
* rect
* paper (special rect)

### Reference Finder

* **RefBase**(: none) base class for everything
* **RefMark**(: RefBase) base class for mark on paper, *RefMark\_Original*, *RefMark\_Intersection*
* **RefLine**(: RefBase), *RefLine\_Original*
* **ReferenceFinder** (calculates folding sequence)
* **RefContainer** class - container for marks and lines

### Huzita-Hatori Axiom 1-7

each are classes on their own, children of **RefLine**

1. RefLine\_C2P\_C2P
2. RefLine\_P2P
3. RefLine\_L2L
4. RefLine\_L2L\_C2P
5. RefLine\_P2L\_C2P
6. RefLine\_P2L\_P2L
7. RefLine\_L2L\_P2L

### Other

* rank and error (how near to solution)
* epsilon value for floating point precision: **1.0e-8**

---

# Classes

## class `XYPt`

simple x,y point

### class properties

* double x, y

### class functions

* operator overloading, basic arithmetic
* rotate point (appears to rotate around the origin)
* Dot product, Magnitude, Normalize, get the midpoint
* chop(): zeros if float is near zero

## class `XYLine`

line by scalar and the unit normal vector

### class properties

* double d
* XYPt u 

u is a unit normal vector to the line

d*u is the point on the line closest to the origin

### class functions

* constructor to convert 2 points into scalar and unit normal vector
`u = (p2 - p1).Normalize().Rotate90();`
`d = p1.Dot(u);`
* `Fold()` *folds* a point across this line (create point by reflection)
`p1 + 2 * (d - (p1.Dot(u))) * u;`
* `IsParallelTo` if dot product of 90deg rotation is near zero
* Intersection for point and line
* Intersection for 2 lines

## class `XYRect`

represent a rectangle using 2 points

### class properties

* top left point
* bottom right point

### class functions

* simple constructors
* width, height, aspect ratio
* (T/F) encloses a point (or 2 points)
* `include` stretch the rect to include a point

## class `Paper`

special XYRect to represent the paper

### class properties

* width, height
* XYPt for all 4 corners
* XYLine for all 4 edges
* XYLine for 2 major diagonal lines

### class functions

* simple constructor
* drawing function
* ? ClipLine
* ? InteriorOverlaps
* ? MakesSkinnyFlap

## class `RefBase`

base class for all the following classes

### class properties

* 1 Paper object
* array of RefBase: sequence of refs to defile a ref
* rank
* array of diagrams: describe a single ref

### class functions

* output the sequence into text and drawing

## class `RefMark`

### class Properties

* XYPoint
* helper things for mKey

### class Functions

* constructors
* distance (point to point)
* (T/F) is on Edge, is an Action Line
* calculate rank


## class `RefLine`

### class Properties

* XYLine
* helper things for mKey

### class Functions

* constructors
* distance (to another line?)
* (T/F) is on Edge, is an Action Line
* calculate rank

## Special-Case Classes
### class `RefMark_Original`
### class `RefLine_Original`

both are special cases of marks or lines that are automatically included, like the edge of the paper

---

# Origami Calculation

## Axiom 1

### Make a crease through two points p1 and p2

#### input

* 2 XY Points `p1` `p2`

#### output

* 1 XY Line

#### calculation summary

```
l.u = (p2 - p1).Rotate90().Normalize();
l.d = .5 * (p1 + p2).Dot(l.u);
```

## Axiom 2

### Make a crease by bringing p1 to p2

#### input 

* 2 XY Points `p1` `p2`

#### output

* 1 XY Line

#### calculation summary

```
l.u = (p2 - p1).Normalize();
l.d = .5 * (p1 + p2).Dot(l.u);
```

## Axiom 3

### Make a crease by bringing line l1 to line l2

#### input

* 2 XY Lines `(u1,d1)` `(u2,d2)`

#### output

* 1 XY Line

#### calculation summary

* `iroot = 0 or 1` ?

if lines are parallel

```
l.u = u1;
l.d = .5 * (d1 + d2 * u2.Dot(u1));
```

else

```
if (iroot == 0) l.u = (u1 + u2).Normalize();
else l.u = (u1 - u2).Normalize();
l.d = Intersection(l1, l2).Dot(l.u);
```

## Axiom 4

### Make a crease by bringing line l1 to itself so that the crease goes through point p1

#### input

* 1 XY Line `(u1,d1)`
* 1 XY Point `p1`

#### output

* 1 XY Line

#### calculation summary

```
l.u = u1.Rotate90();
l.d = p1.Dot(l.u);
```

then check that the intersection is inside of the paper using `paper.Encloses` on p1p

```
XYPt p1p = p1 + (d1 - (p1.Dot(u1))) * u1;
```

## Axiom 5

### Make a crease by bringing point p1 to line l1 so that the crease passes through point p2

#### input

* 2 XY Points `p1` `p2`
* 1 XY Line `(u1,d1)`

#### output

#### calculation summary

after checking trivial case, construct the line

```
double a = d1 - p2.Dot(u1);
double b2 = (p2 - p1).Mag2() - a * a;
	
if (b2 < 0) return;		// no solution for negative b2 (implies imaginary b)
	
double b = sqrt(b2);
if ((b < EPS) && (iroot == 1)) return;	// degenerate case, there's only one solution
```

second, need to calculate p1p:

```
XYPt u1p = u1.Rotate90();
XYPt p1p = p2 + a * u1;
if (iroot == 0) p1p += b * u1p;
else p1p -= b * u1p;
```

answer:

```
l.u = (p1p - p1).Normalize();
l.d = p2.Dot(l.u);
```

## Axiom 6

### Make a crease by bringing point p1 to line l1 and point p2 to line l2

#### input

* 2 XY Points `p1` `p2`
* 2 XY Lines `(u1,d1)` `(u2,d2)`

#### output

* 1 XY Line

#### code summary

lines `2516` to `2737` in ReferenceFinder.cpp, too long to summarize at the moment

## Axiom 7

### Make a crease by bringing line l1 onto itself so that point p1 falls on line l2

#### input

* 1 XY Points `p1`
* 2 XY Lines `(u1,d1)` `(u2,d2)`

#### output

* 1 XY Line

#### code summary

direction vector is easy:

```	
l.u = u2.Rotate90();
```

the rest:

```
double uf1 = l.u.Dot(u1);	
```

if `uf1` is near 0, lines are parallel and there is no solution

```
l.d = (d1 + 2 * p1.Dot(l.u) * uf1 - p1.Dot(u1)) / (2 * uf1);
```

then make sure these 2 points are inside of the paper using `paper.Encloses` on each point

```
XYPt pt = Intersection(l, l2);
XYPt p1p = l.Fold(p1);
```