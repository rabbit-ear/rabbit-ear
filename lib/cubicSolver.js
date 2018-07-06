/* This script and many more are available free online at
The JavaScript Source!! http://www.javascriptsource.com
Original:	Duy Vuong	(dd_vuong@yahoo.com )
Web Site:	http://www.scienceit.freeurl.com/sitepage.htm

Modified by Martin Hunt for programmatic use*/

 function complexADT(){
	/* interface
		-constructor:
			complexADT()
			complexADT(number,number)
	 */
	 //member declaration
	//private
	var myTolFor0 = 1.E-10;
	var myX = 0;
	var myY = 0;
	var myR = 0;
	var myPhi = 0;
	var myXYtoRPhi = null;
	var myRPhitoXY = null;
	//protekted
	this.protekted = new Object();
	this.protekted.ourGetX = null;
	this.protekted.ourGetY = null;
	this.protekted.ourGetR = null;
	this.protekted.ourGetPhi = null;
	this.protekted.ourSetXY = null;
	this.protekted.ourSetRPhi = null;
	//public
	this.IsNull = null;
	this.GetX = null;
	this.GetY = null;
	this.Add = null;
	this.Subtract = null;
	this.Multiply = null;
	this.Divide = null; 
	this.Sqrt = null;
	this.Cubrt = null;
	this.Square = null;
	this.Cube = null;
	this.Print = null;
	 //end member declaration
	 //member definition
	//private
	myRPhitoXY = function(){
		var X = myR * Math.cos(myPhi); 
		var Y = myR * Math.sin(myPhi); 
		if(Math.abs(X) < myTolFor0)
				myX = 0;
			else
				myX = X;
			if(Math.abs(Y) < myTolFor0)
				myY =0;
			else
				myY = Y;
	}//end myRPhitoXY()
	myXYtoRPhi = function(){
		myR = Math.sqrt(myX*myX+myY*myY);
		if(myR == 0){
			myPhi = 0;
			return;
		} 
		if(myY >= 0)
			myPhi = Math.acos(myX/myR);
		else if(myY < 0){
			myX = -myX;
			myPhi = Math.acos(myX/myR);
			myPhi += Math.PI;
			myX = -myX;
		}
	}//end myXYtoRPhi()
	//protekted
	with(this.protekted){
		ourGetX = function(){
			return myX;	
		}//end ourGetX()
		ourGetY = function(){
			return myY;	
		}//end ourGetY()
		ourGetR = function(){
			return myR;	
		}//end ourGetR()
		ourGetPhi = function(){
			return myPhi;	
		}//end ourGetPhi()
		ourSetXY = function(inX,inY){
			if(Math.abs(inX) < myTolFor0)
				myX = 0;
			else
				myX = inX;
			if(Math.abs(inY) < myTolFor0)
				myY =0;
			else
				myY = inY;
		
			myXYtoRPhi();
		}//end ourSetXY()
		ourSetRPhi = function(inR,inPhi){
			myR = inR;
			myPhi = inPhi;
			myRPhitoXY();
		}//end ourSetRPhi()
	}

	//public
	with(this){
		with(this.protekted){
			IsNull = function(){
				if(myX == 0 && myY == 0)
					return true;
				else
					return false;
			}//end IsNull()
			GetX = function(){
				return ourGetX();
			}//end GetX() 
			GetY = function(){
				return ourGetY();
			}//end GetY()
			Add = function(){
				var numX = null;
				var numY = null;
				if(arguments.length == 1){
					numX = arguments[0].GetX();
					numY = arguments[0].GetY();
				}
				else if(arguments.length == 2){
					numX = arguments[0];
					numY = arguments[1];
				} 
				numX += myX;
				numY += myY;
				ourSetXY(numX,numY);
			}//end Add()
			Subtract = function(){
				var numX = null;
				var numY = null;
				if(arguments.length == 1){
					numX = arguments[0].GetX();
					numY = arguments[0].GetY();
				}
				else if(arguments.length == 2){
					numX = arguments[0];
					numY = arguments[1];
				} 
				numX = myX - numX;
				numY = myY - numY;
				ourSetXY(numX,numY);
			}//end Subtract()
			Multiply = function(){
				var numX = null;
				var numY = null;
				if(arguments.length == 1){
					numX = arguments[0].GetX();
					numY = arguments[0].GetY();
				}
				else if(arguments.length == 2){
					numX = arguments[0];
					numY = arguments[1];
				} 
				var newX = myX*numX - myY*numY;
				var newY = myY*numX + myX*numY;
				ourSetXY(newX,newY);
			}//end Multiply()			
			Divide = function(){
				var numX = null;
				var numY = null;
				if(arguments.length == 1){
					numX = arguments[0].GetX();
					numY = arguments[0].GetY();
				}
				else if(arguments.length == 2){
					numX = arguments[0];
					numY = arguments[1];
				} 
				var newR = numX*numX + numY*numY;
				var newX = myX*numX + myY*numY;
				newX /= newR;
				var newY = myY*numX - myX*numY;
				newY /= newR;
				ourSetXY(newX,newY);
			}//end Divide()
			Sqrt = function(){
				var numRank = null;
				if(arguments.length == 0)
					numRank = 0;
				else
					numRank = arguments[0];
				var numR = ourGetR();
				if(numR == 0)
					return;	

				numR = Math.sqrt(numR);
				var numPhi = ourGetPhi();
				numPhi = (numPhi + 2*Math.PI*numRank)/2 ;
				ourSetRPhi(numR,numPhi);
			}//end Sqrt()	
			Cubrt = function(){
				var numRank = null;
				if(arguments.length == 0)
					numRank = 0;
				else
					numRank = arguments[0];
				var numR = ourGetR();
				if(numR == 0)
					return;

				numR = Math.pow(numR,(1/3));
				var numPhi = ourGetPhi();
				numPhi = (numPhi + 2*Math.PI*numRank)/3 ;
				ourSetRPhi(numR,numPhi);
			}//end Cubrt()	
			Square = function(){
				Multiply(this);
			}//end Square()	
			Cube = function(){
				var aComplex = new complexADT(this);
				Square(); 
				Multiply(aComplex);
			}//end Cube()
			Print = function(){
				alert("X= " + myX + "; Y= " + myY);
			}//end Print()
		}//with(this.protekted)
	}//with(this)
	//end member definition
	//constructor analysis
	if(arguments.length == 1)
		this.protekted.ourSetXY(arguments[0].GetX(),arguments[0].GetY());		
	else if(arguments.length == 2)
		this.protekted.ourSetXY(arguments[0],arguments[1]);									
	//end constructor analysis
 }//end complexADT()

function Cube2Solution(inM,inN,inB){
	var roots = [];
	var numX = 0;
	var numY = 0;
	var compN = new complexADT(inN);
	compN.Divide(2,0);
	compN.Square();
	var compM = new complexADT(inM);
	compM.Divide(3,0);
	compM.Cube();
	compN.Add(compM); 
	var compTerm1 = new complexADT(inN);
	compTerm1.Divide(-2,0);
	var compRHS = new complexADT(compN); 
	compRHS.Sqrt();			
	compRHS.Add(compTerm1);
	if(compRHS.IsNull() == true){
		compRHS = new complexADT(compN); 
		compRHS.Sqrt(1);			
		compRHS.Add(compTerm1);
	}
	var compA = new complexADT(compRHS);
	compA.Cubrt();
	var compB = new complexADT(inM);
	compB.Divide(3,0);
	compB.Divide(compA);
	compA.Subtract(compB); // X = a - b
	compA.Subtract(inB); 
	roots.push(compA);
	compA = new complexADT(compRHS);
	compA.Cubrt(1);
	compB = new complexADT(inM);
	compB.Divide(3,0);
	compB.Divide(compA);
	compA.Subtract(compB); // X = a - b
	compA.Subtract(inB); 
	roots.push(compA);
	compA = new complexADT(compRHS);
	compA.Cubrt(2);
	compB = new complexADT(inM);
	compB.Divide(3,0);
	compB.Divide(compA);
	compA.Subtract(compB); // X = a - b
	compA.Subtract(inB); 
	roots.push(compA);
	return roots;
}//end Cube2Solution()

function Quad2Solution(inA,inB,inC){
	var roots = [];
	var numX = 0;
	var numY = 0;
	var complexRat =new complexADT();
	complexRat.Add(inB);
	complexRat.Divide(inA);
	complexRat.Divide(2,0);
	complexRatCA = new complexADT();
	complexRatCA.Add(inC);
	complexRatCA.Divide(inA);	
	complexRHS = new complexADT();
	complexRHS.Add(complexRat);
	complexRHS.Multiply(complexRat);
	complexRHS.Subtract(complexRatCA); //RHS
	aComplex = new complexADT();
	aComplex.Add(complexRHS);
	aComplex.Sqrt(0);
	aComplex.Subtract(complexRat);
	roots.push(aComplex);
	var aComplex = new complexADT();
	aComplex.Add(complexRHS);
	aComplex.Sqrt(1);
	aComplex.Subtract(complexRat);
	roots.push(aComplex);
	return roots;
}//end Quad2Solution()	

function getCubicSolution(compA,compB,compC,compD){
	if (!(compA instanceof complexADT))
		compA = new complexADT(compA, 0);
	if (!(compB instanceof complexADT))
		compB = new complexADT(compB, 0);
	if (!(compC instanceof complexADT))
		compC = new complexADT(compC, 0);
	if (!(compD instanceof complexADT))
		compD = new complexADT(compD, 0);
	
	var roots = [];
	
	if(compA.IsNull() == false){
		compB.Divide(compA);
		compC.Divide(compA);
		compD.Divide(compA);
		var compM = new complexADT(compC);
		var compValue = new complexADT(compB);
		compValue.Square();
		compValue.Divide(3,0);
		compM.Subtract(compValue);
		var compN = new complexADT(compD);
		compValue = new complexADT(compB);
		compValue.Multiply(compC);
		compValue.Divide(3,0);
		compN.Subtract(compValue);
		compValue = new complexADT(compB);
		compValue.Cube();
		compValue.Multiply(2/27,0);
		compN.Add(compValue);
		compB.Divide(3,0);
		roots = Cube2Solution(compM,compN,compB);
	}
	else if(compB.IsNull() == false){
		roots = Quad2Solution(compB,compC,compD);
	}
	else if(compC.IsNull() == false){
		var compRHS = new complexADT(compD);
		compRHS.Multiply(-1,0);
		compRHS.Divide(compC);
		roots = [compC]
	} 
 
	return roots;
}//end getCubicSolution()

function getSolution(){
	var numAX = parseFloat(document.mainForm.AX.value);
	var numBX = parseFloat(document.mainForm.BX.value);
	var numCX = parseFloat(document.mainForm.CX.value);
	var numDX = parseFloat(document.mainForm.DX.value);
	var numAY = parseFloat(document.mainForm.AY.value);
	var numBY = parseFloat(document.mainForm.BY.value);
	var numCY = parseFloat(document.mainForm.CY.value);
	var numDY = parseFloat(document.mainForm.DY.value);
	var compA = new complexADT(numAX,numAY);
	var compB = new complexADT(numBX,numBY);
	var compC = new complexADT(numCX,numCY);
	var compD = new complexADT(numDX,numDY);
	
	var roots = getCubicSolution(compA,compB,CompC);
	if (roots.length >= 1){
		var numX = roots[0].GetX();
		//numX = intFloat(numX,roots[0].Precision);
		var numY = roots[0].GetY();
		//numY = intFloat(numY,roots[0].Precision);
		document.mainForm.ShowX1.value = numFormat(numX);
		document.mainForm.ShowY1.value = numFormat(numY);
	}
	if (roots.length >= 2){
		numX = roots[1].GetX();
		//numX = intFloat(numX,roots[0].Precision);
		numY = roots[1].GetY();
		//numY = intFloat(numY,roots[0].Precision);
		document.mainForm.ShowX2.value = numFormat(numX);
		document.mainForm.ShowY2.value = numFormat(numY);
	}
	if (root.length >= 3){
		numX = roots[2].GetX();
		//numX = intFloat(numX,roots[0].Precision);
		numY = roots[2].GetY();
		//numY = intFloat(numY,roots[0].Precision);
		document.mainForm.ShowX3.value = numFormat(numX);
		document.mainForm.ShowY3.value = numFormat(numY);
	}				
}//end getSolution()

function numFormat(){
	var numMain = arguments[0];
	var numCount = 1;
	var numFactor = 10;
	var strText = null;
	var strSign = "";
	if(numMain < 0){
		strSign = "- ";
		numMain = - numMain;
	}		
	if(numMain == 0)
		strText = "0";
	else if(numMain == 1)
		strText = "1";
	else if(numMain > 1.0){
		while(numMain > 1){
			numMain /= numFactor;
			++numCount;
		}	
		-numCount;
		strText = numMain.toString();
		strText = strText.substr(0,8);
		strText += " E ";
		strText += numCount;
	}
	else if(numMain <1.0){
		while(numMain < 1.0){
			numMain *= numFactor;
			++numCount;
		}
		numCount -= 2;
		numMain /= numFactor;
		strText = numMain.toString();
		strText = strText.substr(0,8);
		if(numCount > 0){
			strText += " E -";
			strText += numCount;
		}
	}
	strText = strSign + strText;
	return strText;
}//end numFormat()

function clearInput(){
	document.mainForm.AX.value=0;
	document.mainForm.AY.value=0;
	document.mainForm.BX.value=0;
	document.mainForm.BY.value=0;
	document.mainForm.CX.value=0;
	document.mainForm.CY.value=0;
	document.mainForm.DX.value=0;
	document.mainForm.DY.value=0;
	document.mainForm.ShowX1.value = 0;
	document.mainForm.ShowY1.value = 0;
	document.mainForm.ShowX2.value = 0;
	document.mainForm.ShowY2.value = 0;
	document.mainForm.ShowX3.value = 0;
	document.mainForm.ShowY3.value = 0;

}//end clearInput()
