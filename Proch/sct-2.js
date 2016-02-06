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

//Невозбранно скопипащено с  www.litunovskiy.com/gamedev/intersection_of_two_circles


function getCandidatePoints(base,maxD){
	var candidatePoints=[];
	for(var a=1; a<=maxD; a++){
		for(var b=base-a+1; b<=maxD; b++){
			var intersects=Circle.moGetCrossPoints2(new Circle(0,0,a),new Circle(0,base,b),1/1024/1024);
			candidatePoints.push(intersects.pos1);
			candidatePoints.push(intersects.pos2);
		}
	}
	for(var i=1; i<base; i++){
		candidatePoints.push({x:0,y:i});
	}
	return candidatePoints;
}

function reduceCandidatePoints(arr,minLinks){
	var lengthBefore=arr.length;
	var timeBefore=Date.now();

	var m=minLinks-1;//Две неучтённых на основание, одна лишняя на себя

	for(var i=0; i<arr.length; i++){
		var links=0;

		if(arr[i].x==0){
			continue;
		}
		for(var j=0; j<arr.length; j++){
			if(isZ(Vector2.dist(arr[i],arr[j]))){
				links++;
				if(links>=m){
					break;
				}
			}
		}
		if(links<m){
			arr[i]=arr[arr.length-1];
			arr.length--;
			i--;
		}
	}

	if(lengthBefore>arr.length){
		console.log("Граф урезан ("+(Date.now() - timeBefore)+" мс): было "+lengthBefore+", стало "+arr.length);
		reduceCandidatePoints(arr,minLinks);
	}else{
		console.log("Холостой проход по графу ("+(Date.now() - timeBefore)+" мс)");
	}
}

function mapFriends(cand,maxD){
	for(var i=0; i<cand.length; i++){
		cand[i].friends=new Int8Array(cand.length);
		cand[i].friendsNums=[];
		for(var j=cand.length-1; j>i; j--){
			var d=Vector2.dist(cand[i],cand[j]);
			if( (d<=maxD+1/1000000) && isZ(d) ){
				cand[i].friends[j] = 1;
				cand[i].friendsNums.unshift(j);
			}
		}
	}
}

function workWithSCT2(arr,cand,candNums,targetPow,maxD,current,firstX){
	if(arr.length==targetPow){
		if(isNotTrivial(arr)){
			logSCT(arr);
		}
		return 1;
	}

	var last=arr[arr.length-1].friendsNums;
	var minFriends=targetPow-arr.length-1;
	for(var j=0; j<last.length; j++){
		var i=last[j];
		if(candNums[i] && cand[i].friends.length>=minFriends){
			var newarr=arr.slice();
			newarr.push(cand[i]);
			var candNumsNew=multArr(candNums,cand[i].friends);
			workWithSCT2(newarr,cand,candNumsNew,targetPow,maxD,i,firstX);
		}
	}
}


function isZ(d){
	return (d-Math.floor(d)<=1/1024/1024);
}

function generateArrayOfOnes(len){
	var arr=new Int8Array(len);
	for(var i=0; i<len; i++){
		arr[i]=1;
	}
	return arr;
}

function generateZeroNaturalSequence(len){
	var arr=[];
	for(var i=0; i<len; i++){
		arr[i]=i;
	}
	return arr;
}

function multArr(arr1,arr2){
	var len=Math.min(arr1.length,arr2.length);
	var rez=new Int8Array(len);
	for(var i=len-1; i>=0; i--){
		if(arr1[i] && arr2[i]){
			rez[i]=true;
		}
	}
	return rez;
}

function separateX(cand){
	var left=0;
	var right=cand.length-1;
	while(left<right){
		while(cand[left] && cand[left].x){
			left++;
		}
		while(cand[right] && !cand[right].x){
			right--;
		}
		if(left<right){
			var buf=cand[left];
			cand[left]=cand[right];
			cand[right]=buf;
		}
	}
	var firstX;
	for(firstX=0;firstX<cand.length && cand[firstX].x;firstX++){
	}
	return firstX;
}

function findSCTs(targetPow,maxD){
	console.log('Ищем СЦТ мощности '+targetPow+' с основанием '+maxD);
	var t=new Date().getTime();
	var cand=getCandidatePoints(maxD,maxD);
	reduceCandidatePoints(cand,targetPow-1);
	if(isNotTrivial(cand)){
		var firstX=separateX(cand);
		mapFriends(cand,maxD);
		var candNums=generateArrayOfOnes(cand.length);
		var arr=[{x:0,y:0},{x:0,y:maxD}];
		arr[1].friendsNums=generateZeroNaturalSequence(firstX);
		workWithSCT2(arr,cand,candNums,targetPow,maxD,0,firstX,1);
	}
	console.log('Времени затрачено, мс: '+(new Date().getTime()-t))
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
	var rez = '\n';
	for(var i = 0; i < arr.length; i++){
		rez += '( '+arr[i].x+' ; '+arr[i].y+' );  \t  ';
	}
	console.log(rez);
	try{
		found=1;
	}catch(e){}
}

/*
3 1
4 4
5 7
6 8
7 17
8 24
9 26..35

*/
/*
findSCTs(4,5);
*/

var found=0;
var p=30;
var d=430;
while(p<100){
	found=0;
	findSCTs(p,d);
	if(found){
		p++;
	} else {
		d++;
	}
}

