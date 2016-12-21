var y = 10; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;  // velocidad inicial
var g = 1.622; // valor de gravedad
var a = -g; //Iniciamos a -g porque si no la nave empezaba subiendo.
var dt = 0; //Valor inicial de dt, para calcular la velocidad
var timer=null;
var timerFuel=null;
var fuel=0; // valor inicial de fuel, no se muestra por pantalla hasta que se elige un nivel de dificultad.
var src1="img/nave.png"; // nave con motor apagado.
var src2="img/nave2.png"; // nave con moto encendido.
var src3="img/nave3.png"; // nave en llamas, para partidas fallidas.
var i=1; //variable auxiliar para saber que imagen se pone.
var imgelem=null; // variable auxiliar que trata la imagen de la nave en la función cambiar.
var vd=5;// velocidad dificultad, por defecto 5 ( fácil ).
var aux=0; // Esta variable se encarga de indicar al jugador que se dirija a 'How to play' en caso de empezar una partida y no tocar ninguna tecla.
var aux2=1; // Esta variable se encarga de que el fuel no adquiera valores negativos y de controlar que si el fuel llega a 0 la misión falla.

//al cargar por completo la página...
window.onload = function(){
	 
	//definición de eventos
	//mostrar menú móvil
    	document.getElementById("showm").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "block";
		pause();
	}
	//ocultar menú móvil
	document.getElementById("hidem").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "none";
		start();
	}
	//encender/apagar el motor al hacer click en la pantalla. 
	document.onclick = function () {
      dt=0.016683;
     imgelem=document.getElementById('imgnav');
   
 	  if (a==g){	
  		motorOn();

 	  } else {
  		motorOff();
 	  }
	}
	alert("Para empezar a jugar, cierra esta ventana y elige una dificultad.");
	//encender/apagar al apretar/soltar una tecla. 
	
	
	document.onkeydown=motorOn;
	document.onkeyup = motorOff;
	
	
	//Empezar a mover nave

	start();
  
//Definición de funciones
}

function mifuncion1(){/* nivel fácil*/
	fuel=100;
	vd=5;
	document.getElementById("fuel").innerHTML=fuel;	
}
function mifuncion2(){/*nivel normal*/
	fuel=80;
	vd=3;
	document.getElementById("fuel").innerHTML=fuel;
}
function mifuncion3(){/*nivel dificil*/
	fuel=60;
	vd=1;
	document.getElementById("fuel").innerHTML=fuel;
}
function cambiar(){ /* función para cambiar imgen de motor on a motor off */
  if (i==1){
    imgelem.src=src2;
     i=2;
  }else{
    imgelem.src=src1;
     i=1;}
}

function start(){

		timer=setInterval(function(){ moverNave(); }, dt*1000);	
}

function pause(){ /* hice esta función para diferenciarla de la función stop*/
	clearInterval(timer);
}

function stop(){
	clearInterval(timer);
	if(v<vd){
     imgelem.src=src1;
     alert("Hola Luna!! Objetivo Cumplido. Pulsa Reiniciar y prueba con una dificultad mayor ");
     document.getElementById("altura").innerHTML=0;/* Añado esta linea porque al aterizar la nave
      la altura es -0,13m y queda poco estético una altura negativa*/
     aux2=0;
	}else{

	 imgelem.src=src3;
     alert("¡ Howston, tenemos un problema. Alunizaje a demasiada velocidad!. Reinicia la misión ");
     document.getElementById("altura").innerHTML=0;/* Añado esta linea porque al aterizar la nave
      la altura es -0,13m y queda poco estético una altura negativa*/
     a=0;g=0;dt=0;aux2=0;
	}

	
}

function moverNave(){

	v +=a*dt;
	document.getElementById("velocidad").innerHTML=v;
	y +=v*dt;
	document.getElementById("altura").innerHTML=70-y; // así la altura mostrada en pantalla va desde 60 hasta 0.
	
	//mover hasta que top sea un 70% de la pantalla
	if (y<70){ 
		document.getElementById("nave").style.top = y+"%"; 
	} else { 
		if ( aux==0){ /* Este mensaje aparece si la nave cae sin que se toque ninguna tecla */
        alert("Howston: Para mas información sobre como manejar la nave, entra en 'How to Play'");
    	}
		stop();
	}
 }

function motorOn(){
	aux=1;
	imgelem=document.getElementById('imgnav');
	a=-g;
	i=1;
	cambiar();
	if (timerFuel==null)	
	timerFuel=setInterval(function(){ actualizarAltura(); }, 100); 
}

function motorOff(){
	imgelem=document.getElementById('imgnav');
	a=g;
	i=2;
	clearInterval(timerFuel);
	timerFuel=null;
	cambiar();
}

function actualizarAltura(){
	//Aquí hay que cambiar el valor del marcador de Fuel...
	if(aux2==1){	
	fuel-=1;}
	if (fuel>0 && aux2==1){
	document.getElementById("fuel").innerHTML=fuel;	}
	else if(fuel==0){ 
	/* Si nos quedamos sin fuel la nave deja de moverse y el contador de fuel no se
    pone en valores negativos. */
	document.getElementById("fuel").innerHTML=0;
	if (aux2==1){
		// Se muestra la alerta 1 vez y después hay que darle a 'Reiniciar'
	alert("Oh no! Te has quedado sin fuel!! Reinicia la misión");
    }
	a=0;g=0;dt=0;
	aux2=0;
	}
}
