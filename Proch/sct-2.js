       function sgn(x)
        {
            return (x > 0) - (x < 0);
        }

        function Vector2(x, y)
        {
            this.x = x;
            this.y = y;

        }
        Vector2.prototype.length = function ()
        {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        Vector2.dist = function (oV1, oV2)
        {
            return Math.sqrt((oV2.x - oV1.x) * (oV2.x - oV1.x) + (oV2.y - oV1.y) * (oV2.y - oV1.y));
        }

        function Circle(x, y, radius)
        {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        // oCircle1 - coords and radius first circle
        // oCircle2 - coords and radius second circle
        // nMargin - tolerance of distance, i.e. if distance between border of circles between -nMargin/2 .. +nMargin/2
        //            it counts as one point
        Circle.moGetCrossPoints = function (oCircle1, oCircle2, nMargin)
        {
            var obj = new Object();
            obj.count = 0;
            obj.pos1 = null;
            obj.pos2 = null;
            var d = Vector2.dist(oCircle1, oCircle2);
            if (Math.abs(d - Math.abs(oCircle1.radius - oCircle2.radius)) < nMargin / 2)
            {
                var nSign = sgn(oCircle1.radius - oCircle2.radius);
                var nDelta = (d - Math.abs(oCircle1.radius - oCircle2.radius)) / 2;
                obj.count = 1;
                obj.pos1 = new Vector2(oCircle1.x + (oCircle1.radius - nDelta) * (oCircle2.x - oCircle1.x) / d * nSign,
                                        oCircle1.y + (oCircle1.radius - nDelta) * (oCircle2.y - oCircle1.y) / d * nSign);
            }
            else if (Math.abs(d - (oCircle1.radius + oCircle2.radius)) < nMargin / 2)
            {
                obj.count = 1;
                var nDelta = (d - Math.abs(oCircle1.radius + oCircle2.radius)) / 2;
                obj.pos1 = new Vector2(oCircle1.x + (oCircle1.radius + nDelta) * (oCircle2.x - oCircle1.x) / d,
                                        oCircle1.y + (oCircle1.radius + nDelta) * (oCircle2.y - oCircle1.y) / d);
            }
            else if (d < oCircle1.radius + oCircle2.radius && d > Math.abs(oCircle1.radius - oCircle2.radius))
            {
                obj.count = 2;
                var b = (oCircle2.radius * oCircle2.radius - oCircle1.radius * oCircle1.radius + d * d) / (2 * d);
                var a = d - b;
                var h = Math.sqrt(oCircle1.radius * oCircle1.radius - a * a);
                var oPos0 = new Vector2(oCircle1.x + a / d * (oCircle2.x - oCircle1.x),
                                        oCircle1.y + a / d * (oCircle2.y - oCircle1.y));
                obj.pos1 = new Vector2(oPos0.x + h / d * (oCircle2.y - oCircle1.y),
                                        oPos0.y - h / d * (oCircle2.x - oCircle1.x));
                obj.pos2 = new Vector2(oPos0.x - h / d * (oCircle2.y - oCircle1.y),
                                        oPos0.y + h / d * (oCircle2.x - oCircle1.x));
            }
            return obj;
        }

        Circle.moGetCrossPoints2 = function (oCircle1, oCircle2)
        {
            var obj = new Object();
            obj.pos1 = null;
            obj.pos2 = null;

            obj.count = 2;
            var oPos1 = new Vector2(0, 0);
            var oPos2 = new Vector2(oCircle2.x - oCircle1.x, oCircle2.y - oCircle1.y);
            var c = (oCircle2.radius * oCircle2.radius - oPos2.x * oPos2.x - oPos2.y * oPos2.y - oCircle1.radius * oCircle1.radius) / -2;
            var a = oPos2.x * oPos2.x + oPos2.y * oPos2.y;
            if (oPos2.x != 0)
            {
                var b = -2 * oPos2.y * c;
                var e = c * c - oCircle1.radius * oCircle1.radius * oPos2.x * oPos2.x;
                var D = b * b - 4 * a * e;
                if (D > 0)
                {
                    obj.pos1 = new Vector2(0, 0);
                    obj.pos2 = new Vector2(0, 0);
                    obj.pos1.y = (-b + Math.sqrt(D)) / (2 * a);
                    obj.pos2.y = (-b - Math.sqrt(D)) / (2 * a);
                    obj.pos1.x = (c - obj.pos1.y * oPos2.y) / oPos2.x;
                    obj.pos2.x = (c - obj.pos2.y * oPos2.y) / oPos2.x;
                }
                else if (D == 0)
                {
                    obj.count = 1;
                    obj.pos1 = new Vector2(0, 0);
                    obj.pos1.y = (-b + Math.sqrt(D)) / (2 * a);
                    obj.pos1.x = (c - obj.pos1.y * oPos2.y) / oPos2.x;
                }
                else
                {
                    obj.count = 0;
                }
            }
            else
            {
                //var b = -2 * oPos2.x * c;
                //var e = c * c - oCircle1.radius * oCircle1.radius * oPos2.y * oPos2.y;
                //var D = b * b - 4 * a * e;
                //if (D > 0)
                //{
                //    obj.pos1 = new Vector2(0, 0);
                //    obj.pos2 = new Vector2(0, 0);
                //    obj.pos1.x = (-b + Math.sqrt(D)) / (2 * a);
                //    obj.pos2.x = (-b - Math.sqrt(D)) / (2 * a);
                //    obj.pos1.y = (c - obj.pos1.x * oPos2.x) / oPos2.y;
                //    obj.pos2.y = (c - obj.pos2.x * oPos2.x) / oPos2.y;
                //}
                //else if (D == 0)
                //{
                //    obj.count = 1;
                //    obj.pos1 = new Vector2(0, 0);
                //    obj.pos1.x = (-b + Math.sqrt(D)) / (2 * a);
                //    obj.pos1.y = (c - obj.pos1.x * oPos2.x) / oPos2.y;
                //}
                //else
                //{
                //    obj.count = 0;
                //}
                var D = oCircle1.radius * oCircle1.radius - (c * c) / (oPos2.y * oPos2.y);
                if (D > 0)
                {
                    obj.pos1 = new Vector2(0, 0);
                    obj.pos2 = new Vector2(0, 0);
                    obj.pos1.x = +Math.sqrt(D);
                    obj.pos2.x = -Math.sqrt(D);
                    obj.pos1.y = c / oPos2.y;
                    obj.pos2.y = c / oPos2.y;
                }
                else if (D == 0)
                {
                    obj.count = 1;
                    obj.pos1 = new Vector2(0, 0);
                    obj.pos1.x = 0;
                    obj.pos1.y = c / oPos2.y;
                }
                else
                {
                    obj.count = 0;
                }
            }
            if (obj.pos1 != null)
            {
                obj.pos1.x += oCircle1.x;
                obj.pos1.y += oCircle1.y;
            }
            if (obj.pos2 != null)
            {
                obj.pos2.x += oCircle1.x;
                obj.pos2.y += oCircle1.y;
            }
            return obj;
        }

        function Main()
        {
            var moCanvas = document.getElementById("Canvas1");
            var moCtx = moCanvas.getContext("2d");
            // coords system center, uses to ModelToView and ViewToModel conversions
            var moPos00 = new Vector2(moCanvas.width / 2, moCanvas.height / 2);
            var moCircle1 = new Circle(-50, -30, 80);
            var moCircle2 = new Circle(70, 30, 100);
            var moMain1 = new Main1();

            var ctr = function ()
            {
                moCanvas.onclick = mvOnClick; //addEventListener();
                moCanvas.onmousemove = mvOnMouseMove;
                mvDraw();
            }

            var mvConvertModelToView = function (oPos)
            {
                oPos.x = oPos.x + moPos00.x;
                oPos.y = moPos00.y - oPos.y;
            }

            var mvConvertViewToModel = function (oPos)
            {
                oPos.x = oPos.x - moPos00.x;
                oPos.y = moPos00.y - oPos.y;
            }

            var mvOnMouseMove = function (e)
            {
                // e.offsetX, e.offsetY
                // e.offsetX, e.offsetY
                //moPosCurr.x = e.pageX - e.target.offsetLeft;
                //moPosCurr.y = e.pageY - e.target.offsetTop;
                //mvDraw();
            }

            var mvOnClick = function (e)
            {
                // e.offsetX, e.offsetY
                var x = e.pageX - e.target.offsetLeft;
                var y = e.pageY - e.target.offsetTop;

                var oPos = new Vector2(x, y);
                mvConvertViewToModel(oPos);
                moCircle1.x = oPos.x;
                moCircle1.y = oPos.y;
                mvDraw();
            }

            var mvDrawPoint = function (ctx, x, y, oText)
            {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillText(oText, x - 2, y - 2);
            }

            var mvDravAxis = function (ctx)
            {
                var style = ctx.strokeStyle;
                ctx.strokeStyle = "#1111DD";
                var oPos1 = new Vector2(0, 0);
                var oPos2 = new Vector2(100, 0);
                mvConvertModelToView(oPos1);
                mvConvertModelToView(oPos2);
                ctx.beginPath();
                ctx.moveTo(oPos1.x, oPos1.y);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(oPos2.x - 5, oPos2.y + 5);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.lineTo(oPos2.x - 5, oPos2.y - 5);
                ctx.stroke();

                oPos2.x = -100; oPos2.y = 0;
                mvConvertModelToView(oPos2);
                ctx.beginPath();
                ctx.moveTo(oPos1.x, oPos1.y);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.stroke();

                oPos2.x = 0; oPos2.y = 100;
                mvConvertModelToView(oPos2);
                ctx.beginPath();
                ctx.moveTo(oPos1.x, oPos1.y);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(oPos2.x - 5, oPos2.y + 5);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.lineTo(oPos2.x + 5, oPos2.y + 5);
                ctx.stroke();

                oPos2.x = 0; oPos2.y = -100;
                mvConvertModelToView(oPos2);
                ctx.beginPath();
                ctx.moveTo(oPos1.x, oPos1.y);
                ctx.lineTo(oPos2.x, oPos2.y);
                ctx.stroke();

                ctx.strokeStyle = style;
            }

            var mvDraw = function ()
            {
                moCtx.clearRect(0, 0, moCanvas.width, moCanvas.height);
                moCtx.strokeRect(0, 0, moCanvas.width, moCanvas.height);

                mvDravAxis(moCtx);
                moCtx.font = "14px Verdana";
                var oPos = new Vector2(0, 0);

                if (moCircle1 != null)
                {
                    oPos.x = moCircle1.x; oPos.y = moCircle1.y;
                    mvConvertModelToView(oPos);
                    mvDrawPoint(moCtx, oPos.x, oPos.y, "P1");

                    moCtx.beginPath();
                    moCtx.arc(oPos.x, oPos.y, moCircle1.radius, 0, Math.PI * 2);
                    moCtx.stroke();
                }

                if (moCircle2 != null)
                {
                    oPos.x = moCircle2.x; oPos.y = moCircle2.y;
                    mvConvertModelToView(oPos);
                    mvDrawPoint(moCtx, oPos.x, oPos.y, "P2");

                    moCtx.beginPath();
                    moCtx.arc(oPos.x, oPos.y, moCircle2.radius, 0, Math.PI * 2);
                    moCtx.stroke();
                }

                if (moCircle1 != null && moCircle2 != null)
                {
                    oPos.x = moCircle1.x; oPos.y = moCircle1.y;
                    moCtx.beginPath();
                    mvConvertModelToView(oPos);
                    moCtx.moveTo(oPos.x, oPos.y);
                    oPos.x = moCircle2.x; oPos.y = moCircle2.y;
                    mvConvertModelToView(oPos);
                    moCtx.lineTo(oPos.x, oPos.y);
                    moCtx.stroke();

                    var oCross = Circle.moGetCrossPoints2(moCircle1, moCircle2, 10);
                    if (oCross.count == 1)
                    {
                        oPos.x = oCross.pos1.x; oPos.y = oCross.pos1.y;
                        mvConvertModelToView(oPos);
                        mvDrawPoint(moCtx, oPos.x, oPos.y, "P3");
                    }
                    else if (oCross.count == 2)
                    {
                        oPos.x = oCross.pos1.x; oPos.y = oCross.pos1.y;
                        mvConvertModelToView(oPos);
                        mvDrawPoint(moCtx, oPos.x, oPos.y, "P3");

                        oPos.x = oCross.pos2.x; oPos.y = oCross.pos2.y;
                        mvConvertModelToView(oPos);
                        mvDrawPoint(moCtx, oPos.x, oPos.y, "P4");
                    }
                    moMain1.mvDraw(moCircle1, moCircle2, oCross);
                }
            }

            var mvUpdateInfo = function ()
            {
                var moGetText = function (oPt, oPos)
                {
                    if (oPos != null)
                        return oPt + "(" + oPos.x + ", " + oPos.y + ")";
                    else
                        return oPt + "( ,  )";
                }

                document.getElementById("idA").textContent = moGetText("A", moPos1);
                document.getElementById("idB").textContent = moGetText("B", moPos2);
                document.getElementById("idC").textContent = moGetText("C", moPos3);

                if (moPos1 == null)
                    document.getElementById("idA").textContent = moGetText("A", moPosCurr);
                else if (moPos2 == null)
                    document.getElementById("idB").textContent = moGetText("B", moPosCurr);
                else if (moPos3 == null)
                    document.getElementById("idC").textContent = moGetText("C", moPosCurr);
                else
                {
                    // we have all 3 points
                    document.getElementById("idAB").textContent = "" + (moPos1.y - moPos2.y) + "⋅x + " + (moPos2.x - moPos1.x) + "⋅y + " +
                     (moPos1.x * moPos2.y - moPos2.x * moPos1.y) + " = 0";

                    document.getElementById("idBC").textContent = "" + (moPos2.y - moPos3.y) + "⋅x + " + (moPos3.x - moPos2.x) + "⋅y + " +
                     (moPos2.x * moPos3.y - moPos3.x * moPos2.y) + " = 0";
                }
            }

            ctr();

        }

//Невозбранно скопипащено с  www.litunovskiy.com/gamedev/intersection_of_two_circles
/*
var c1=new Circle(0,0,3);
var c2=new Circle(0,5,3);


console.log(Circle.moGetCrossPoints2(c1,c2));
*/

function checkSCTcompatWithArray(arr,point){
	for(var i=2; i<arr.length; i++){
		var d=Vector2.dist(arr[i],point);
		if(d-Math.floor(d)>=1/1024/1024){
			return 0;
		}
	}
	return 1;
}

var targetPow=4;
var maxD=4;

for(var a=1; a<=maxD; a++){
	var arr=[{x:0,y:0},{x:0,y:a}];
	workWithSCT(arr,1,1,a);
}

function workWithSCT(arr,r1,r2,base){
	if(arr.length==targetPow){
		if(isNotTrivial(arr)){
			logSCT(arr);
		}
		return;
	}
	for(var a=r1; a<=maxD; a++){
		for(var b=r2; b<=maxD; b++){
//			if(a==r1 && b==r2 /*|| a+b<base*/){
//				continue;//знаю, костыль!
//			}
			var intersects=Circle.moGetCrossPoints2(new Circle(0,0,a),new Circle(0,base,b),1/1024/1024);
//			console.log(base,a,b,intersects.count);
			var newarr1=arr.slice();
			var newarr2=arr.slice();
			if(addIfGood(newarr1,intersects.pos1)){
				workWithSCT(newarr1,a,b+1,base);
			}
			if(addIfGood(newarr2,intersects.pos2)){
				workWithSCT(newarr2,a,b+1,base);
			}
		}
	}
}

function addIfGood(arr,point){
	if(!point){
		return 0;
	}
	if(checkSCTcompatWithArray(arr,point)){
		arr.push(point);
		return 1;
	}
	return 0;
}

function isNotTrivial(arr){
	for(var i=0; i<arr.length; i++){
		if(arr[i].x){
			return 1;
		}
	}
	return 0;
}

function logSCT(arr){
	var rez = '';
	for(var i = 0; i < arr.length; i++){
		rez += '( '+arr[i].x+' ; '+arr[i].y+' );  \t  ';
	}
	console.log(rez);
}

