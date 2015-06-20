var m=0;
var am=0;
var bm=0;
var prec=0.0002;
console.log("Шаг: "+prec)
for(var a=prec; a<1; a+=prec){
	var c2=a*a-2*a+2;
	for(var b=a; b<1; b+=prec){
		var c1=a*a+b*b;
		var c3=b*b-2*b+2;
		var t=Math.sqrt( Math.min(c1*c2,c1*c3,c2*c3) );
		if(t>m){
			m=t;
			am=a;
			bm=b;
		}
		if(Math.abs(c1-c2)<prec && Math.abs(c1-c3)<prec){
			console.log(a,b,c1);		
		}
	}
}
console.log(m);
console.log(m*m);
console.log(am+" "+bm);

