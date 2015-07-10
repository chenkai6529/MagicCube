function magicCube(){

	this.itemList = [];
	this.renderer;
	this.scene;
	this.camera;
	this.isAnimate = false;
	this.rotateSpeed = 5;
	this.init = function(renderer,scene,camera){
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		for(var i=0;i<27;i++){
			var item = new tile();
            item.geo = new THREE.Mesh( new THREE.BoxGeometry( 50,50,50),
            	new THREE.MeshLambertMaterial( { color:0xFFFFFF,vertexColors: THREE.FaceColors} ));
            item.geo.position.set(i%3*50,parseInt(i/9)*50,-1*parseInt(i/3)%3*50);
            item.setPosition(i%3-1,parseInt(i/9)-1,parseInt(i/3)%3-1);
            item.initColor();
            item.cube = this;
            this.itemList.push(item);
            scene.add(item.geo);
        }
        for(i in this.itemList){
        	var op = this.itemList[i].geo.position;
        	this.itemList[i].geo.position.set(op.x-50,op.y-50,op.z+50);
        }
	};

	this.getItemList = function(){
		return this.itemList;
	};
	this.addToScene = function(scene){
		for(i in this.itemList){
			scene.add(this.itemList[i]);
		}
	};
	this.y1right=function(){
		var toplist = this.getYList(1);
		rotateY(this,toplist,true,1);
	}
	this.y1left=function(){
		var toplist = this.getYList(1);
		rotateY(this,toplist,false,1);
	}
	this.y2right=function(){
		var toplist = this.getYList(0);
		rotateY(this,toplist,true,0);
	}
	this.y2left=function(){
		var toplist = this.getYList(0);
		rotateY(this,toplist,false,0);
	}
	this.y3right=function(){
		var toplist = this.getYList(-1);
		rotateY(this,toplist,true,-1);
	}
	this.y3left=function(){
		var toplist = this.getYList(-1);
		rotateY(this,toplist,false,-1);
	}
	this.x1right=function(){
		var xlist = this.getXList(1);
		rotateX(this,xlist,true,1);
	}
	this.x1left=function(){
		var xlist = this.getXList(1);
		rotateX(this,xlist,false,1);
	}
	this.z1right=function(){
		var zlist = this.getZList(-1);
		rotateZ(this,zlist,true,-1);
	}
	this.z1left=function(){
		var zlist = this.getZList(-1);
		rotateZ(this,zlist,false,-1);
	}
	this.getYList = function(y){
		var list = [];
		for(var i in this.itemList){
			if(this.itemList[i].position.y==y)
				list.push(this.itemList[i]);
		}
		list.sort(function(a,b){
			if(a.position.x == b.position.x){
				return a.position.y - b.position.y;
			}
			else
				return a.position.x - b.position.x;
		});
		return list;
	}
	this.getXList = function(x){
		var list = [];
		for(var i in this.itemList){
			if(this.itemList[i].position.x==x)
				list.push(this.itemList[i]);
		}
		return list;
	}
	this.getZList = function(z){
		var list = [];
		for(var i in this.itemList){
			if(this.itemList[i].position.z==z)
				list.push(this.itemList[i]);
		}
		return list;
	}

	function getAngle(x,y){
		var ta = Math.atan(y/x);
        if(x<0)
        	ta+=Math.PI;
		return ta;
	}

	function rotateY(obj,list,clockwise,h){
		var a=0;
		var d = 1;
		if(!clockwise)
			d=-1;
		function animation()
        {
        	obj.isAnimate=true;
        	var step = obj.rotateSpeed * Math.PI / 180;
            a += step;
            if(a<=Math.PI/2){
            	for(var i = 0;i<list.length;i++)
            	{
            		list[i].geo.rotation.order="YXZ";
            		list[i].geo.rotation.y -= d*step;
            		//list[i].tileGeoRotateY(d,step);
            		if(list[i].position.x!=0||list[i].position.z!=0){
            			var p = {x:list[i].position.x,y:list[i].position.z};
        				var ta = getAngle(p.x,p.y);
            			if((Math.abs(p.x)+Math.abs(p.y))==1){
		            		list[i].geo.position.x = 1*Math.cos(-1*ta+a*d)*50;
		            		list[i].geo.position.z = 1*Math.sin(-1*ta+a*d)*50;
            			}
            			else{
		            		list[i].geo.position.x = 1*Math.cos(-1*ta+a*d)*50*Math.sqrt(2);
		            		list[i].geo.position.z = 1*Math.sin(-1*ta+a*d)*50*Math.sqrt(2);
            			}
            		}
            	}
            	obj.renderer.render(obj.scene, obj.camera);
            	requestAnimationFrame(animation);
            }
            else{
            	for(var i = 0;i<list.length;i++){
            		//list[i].geo.rotation.order="YZX";
            		if(list[i].position.x!=0||list[i].position.z!=0){
            			var ta = getAngle(list[i].position.x,list[i].position.z);
            			if(list[i].tileType==1){
		            		list[i].setPosition(Math.cos(ta-d*Math.PI/2),h,Math.sin(ta-d*Math.PI/2));
            			}
            			else{
		            		list[i].setPosition(Math.cos(ta-d*Math.PI/2)*Math.sqrt(2),h,Math.sin(ta-d*Math.PI/2)*Math.sqrt(2));
            			}
            		}
            		//list[i].tileAxisRotateY(d);
            	}
            	obj.isAnimate=false;
            }
        }
        animation();
	}
	function rotateX(obj,list,clockwise,h){
		var a=0;
		var d = 1;
		if(!clockwise)
			d=-1;
		function animation()
        {
        	obj.isAnimate=true;
           	var step = obj.rotateSpeed * Math.PI / 180;
            a += step;
            if(a<=Math.PI/2){
            	for(var i = 0;i<list.length;i++)
            	{
            		list[i].geo.rotation.order="XYZ";
            		list[i].geo.rotation.x -= d*step;
            		if(list[i].position.z!=0||list[i].position.y!=0){
            			var p = {x:list[i].position.z,y:list[i].position.y};
        				var ta = getAngle(p.x,p.y)+2*Math.PI/2;
            			if((Math.abs(p.x)+Math.abs(p.y))==1){
		            		list[i].geo.position.z = 1*Math.cos(-1*ta+a*d)*50;
		            		list[i].geo.position.y = 1*Math.sin(-1*ta+a*d)*50;
            			}
            			else{
		            		list[i].geo.position.z = 1*Math.cos(-1*ta+a*d)*50*Math.sqrt(2);
		            		list[i].geo.position.y = 1*Math.sin(-1*ta+a*d)*50*Math.sqrt(2);
            			}
            		}
            	}
            	obj.renderer.render(obj.scene, obj.camera);
            	requestAnimationFrame(animation);
            }
            else{
            	for(var i = 0;i<list.length;i++){
            		if(list[i].position.z!=0||list[i].position.y!=0){
            			var ta = getAngle(list[i].position.z,list[i].position.y);
            			if((Math.abs(list[i].position.z)+Math.abs(list[i].position.y))==1){
		            		list[i].setPosition(h,Math.sin(ta-d*Math.PI/2),Math.cos(ta-d*Math.PI/2));
            			}
            			else{
		            		list[i].setPosition(h,Math.sin(ta-d*Math.PI/2)*Math.sqrt(2),Math.cos(ta-d*Math.PI/2)*Math.sqrt(2));
            			}
            		}
            	}
            	obj.isAnimate=false;
            }
        }
        animation();
	}
	function rotateZ(obj,list,clockwise,h){
		var a=0;
		var d = 1;
		if(!clockwise)
			d=-1;
		function animation()
        {
        	obj.isAnimate=true;
            var step = obj.rotateSpeed * Math.PI / 180;
            a += step;
            if(a<=Math.PI/2){
            	for(var i = 0;i<list.length;i++)
            	{
            		list[i].geo.rotation.order="ZXY";
            		list[i].geo.rotation.z -= d*step;
            		if(list[i].position.x!=0||list[i].position.y!=0){
            			var p = {x:list[i].position.x,y:list[i].position.y};
        				var ta = getAngle(p.x,p.y);
            			if((Math.abs(p.x)+Math.abs(p.y))==1){
		            		list[i].geo.position.x = 1*Math.cos(1*ta-a*d)*50;
		            		list[i].geo.position.y = 1*Math.sin(1*ta-a*d)*50;
            			}
            			else{
		            		list[i].geo.position.x = 1*Math.cos(1*ta-a*d)*50*Math.sqrt(2);
		            		list[i].geo.position.y = 1*Math.sin(1*ta-a*d)*50*Math.sqrt(2);
            			}
            		}
            	}
            	obj.renderer.render(obj.scene, obj.camera);
            	requestAnimationFrame(animation);
            }
            else{
            	for(var i = 0;i<list.length;i++){
            		if(list[i].position.x!=0||list[i].position.y!=0){
            			var ta = getAngle(list[i].position.x,list[i].position.y);
            			if((Math.abs(list[i].position.x)+Math.abs(list[i].position.y))==1){
		            		list[i].setPosition(Math.cos(ta-d*Math.PI/2),Math.sin(ta-d*Math.PI/2),h);
            			}
            			else{
		            		list[i].setPosition(Math.cos(ta-d*Math.PI/2)*Math.sqrt(2),Math.sin(ta-d*Math.PI/2)*Math.sqrt(2),h);
            			}
            		}
            	}
            	obj.isAnimate=false;
            }
        }
        animation();
	}
	return this;
}

function tile(){
	this.geo;
	this.cube;
	this.position={
		x:0,
		y:0,
		z:0
	};
	this.tileType = 0;//0魔方中心 1面中心 2楞中心 3角
	this.xColor=[0xFFFFFF,0x000000,0xFFFF00];
	this.yColor=[0x00FF00,0x000000,0x0000FF];
	this.zColor=[0xFF7700,0x000000,0xFF0000];
	//记录轴的变换后的指向，值同materialIndex
	this.axisRotation={
		x:0,
		y:2,
		z:4
	};
	this.axisArray=[
		[2,5,3,4],
		[2,5,3,4],
		[0,4,1,5],
		[0,4,1,5],
		[2,0,3,1],
		[2,0,3,1]
	];
	this.tileAxisRotateY = function(d){
		//d=1顺时针，-1逆时针
		var aro = this.axisRotation;
		var tarray = this.axisArray[2];
		if(aro.x==2||aro.x==3){
			//tile的X轴指向世界的Y轴,变换tile的y,z轴指向
			this.axisRotation.y = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.y)+d)];
			this.axisRotation.z = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.z)+d)];
		}
		else if(aro.y==2||aro.y==3){
			//y轴指向Y轴 变换xz
			this.axisRotation.x = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.x)+d)];
			this.axisRotation.z = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.z)+d)];
		}
		else if(aro.z==2||aro.z==3){
			//z轴指向Y轴 变换zy
			this.axisRotation.x = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.x)+d)];
			this.axisRotation.y = tarray[getAxisIndex(tarray.indexOf(this.axisRotation.y)+d)];
		}
	};
	function getAxisIndex(index){
		if(index==-1)
			return 3;
		else if(index==4)
			return 0;
		return index;
	}
	this.tileGeoRotateY = function(d,step){
		var aro = this.axisRotation;
		if(aro.x==2||aro.x==3){
			if(aro.x==2){
				this.geo.rotation.x -= d*step;
			}
			else{
				this.geo.rotation.x += d*step;
			}
		}
		else if(aro.y==2||aro.y==3){
			if(aro.y==2){
				this.geo.rotation.y -= d*step;
			}
			else{
				this.geo.rotation.y += d*step;
			}
		}
		else if(aro.z==2||aro.z==3){
			if(aro.z==2){
				this.geo.rotation.z -= d*step;
			}
			else{
				this.geo.rotation.z += d*step;
			}
		}
	};
	this.tileGeoRotateZ = function(d,step){
		var aro = this.axisRotation;
		if(aro.x==4||aro.x==5){
			if(aro.x==4){
				this.geo.rotation.x -= d*step;
			}
			else{
				this.geo.rotation.x += d*step;
			}
		}
		else if(aro.y==4||aro.y==5){
			if(aro.y==4){
				this.geo.rotation.y -= d*step;
			}
			else{
				this.geo.rotation.y += d*step;
			}
		}
		else if(aro.z==4||aro.z==5){
			if(aro.z==4){
				this.geo.rotation.z -= d*step;
			}
			else{
				this.geo.rotation.z += d*step;
			}
		}
	};
	this.setPosition=function(x,y,z){
		if(x>-0.00005&&x<0)
			x=0;
		if(y>-0.00005&&y<0)
			y=0;
		if(z>-0.00005&&z<0)
			z=0;
		this.position.x=Math.round(x);
		this.position.y = Math.round(y) ;
		this.position.z = Math.round(z);
	}
	this.initColor=function(){
		//materialIndex=0: x+ 黄 x=1 
		//materialIndex=1: x- 白 x=-1 
		//materialIndex=2: y+ 蓝 y=1 
		//materialIndex=3: y- 绿 y=-1 
		//materialIndex=4: z+ 红 z=1
		//materialIndex=5: z- 橙 z=-1
		var p = this.position;
		this.tileType = Math.abs(p.x)+Math.abs(p.y)+Math.abs(p.z);
		var xface = -1 , yface=-1 , zface = -1;
		if(p.x!=0)
			xface = p.x<0?1:0;
		if(p.y!=0)
			yface = p.y<0?3:2;
		if(p.z!=0)
			zface = p.z<0?4:5;
		var cx = this.xColor[p.x+1];
        var cy = this.yColor[p.y+1];
        var cz = this.zColor[p.z+1];
        for ( var i = 0; i < this.geo.geometry.faces.length; i++ ) 
        {
        	face = this.geo.geometry.faces[i];
        	if(face.materialIndex==xface)
        	{
        		face.color.setHex(cx);
        	}
        	else if(face.materialIndex==yface){
				face.color.setHex(cy);
        	}
        	else if(face.materialIndex==zface){
				face.color.setHex(cz);
        	}
        	else
        		face.color.setHex(0x0000);
        }

	}
	this.getPosition = function(){
		return this.position;
	}
	return this;
}