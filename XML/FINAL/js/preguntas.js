////////////////////////////// VARIABLES GLOBALES /////////////////////////////////////////////
var formElement=null;///////// variable para guardar "myform" ( del archivo index.html )
var nota = 0; /////////////// variable para la nota final
var tiempoExamen=180;//////// duración máxima del examen en segundos
var stopTiempo=false;//////// variable para detener la cuenta atrás del tiempo al pulsar para corregir 
////////////////////////////// variables globales para almacenar las respuestas de cada tipo de pregunta
var respuestaNum=[];////////// tipo num      
var respuestaTexto=[];//////// tipo texto
var respuestaSelect=[];/////// tipo select
var respuestasCheckbox = [];// tipo checkbox
var respuestasRadio= [];////// tipo radio
////////////////////////////// variables globales para almacenar la cantidad de preguntas de cada tipo
var radioNum=0////////// tipo radio
var checkNum=0;////////// tipo checkbox  
var textNum=0;////////// tipo texto   
var numNum=0;////////// tipo num
var selNum=0;////////// tipo select  

/////////Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.

window.onload = function(){ 

 /////////CORREGIR al apretar el botón
 
 formElement=document.getElementById("myform");
 formElement.onsubmit=function(){
   inicializar();
   corregirTodo();  
   return false;
}
 

 /////////////////LEER XML de xml/preguntas.xml

 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   gestionarXml(this);
  }
 };
 xhttp.open("GET", "xml/preguntas.xml", true);
 xhttp.send();
}


////////////////////////////// Funciones para gestion del cuestionario. Cargamos nuestro archivo .xml en xmlDOC y rellenamos el array "answers" con la información
////////////////////////////// de cada tipo de pregunta (Type, Title,...) mediante un for. Luego llamamos a "creadorHtml", se pone en marcha el contador
//////////////////////////////  de tiempo.
function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
 xmlAnswers=xmlDoc.getElementsByTagName("title").length;
 answers=[];
 for(i=0;i<xmlAnswers;i++){
  answers[i]={};
  answers[i].type=xmlDoc.getElementsByTagName("type")[i].innerHTML;
  answers[i].title=xmlDoc.getElementsByTagName("title")[i].innerHTML;
  answers[i].text=xmlDoc.getElementsByTagName("text")[i].innerHTML;
  optionsLength=xmlDoc.getElementById("preg"+(i+1)).getElementsByTagName("option").length;
  answersLength=xmlDoc.getElementById("preg"+(i+1)).getElementsByTagName("answer").length;
  if(optionsLength>0){
    answers[i].options=[];
    for(j=0;j<optionsLength;j++){
      answers[i].options[j]=xmlDoc.getElementById("preg"+(i+1)).getElementsByTagName("option")[j].innerHTML;
    }
  }else{
    answers[i].options=null;
  }
    answers[i].answers=[];
  for(k=0;k<answersLength;k++){
    answers[i].answers[k]=xmlDoc.getElementById("preg"+(i+1)).getElementsByTagName("answer")[k].innerHTML;
  }

 }
 ////FINFOR
 ////////////////////////// Crear el html y el contador para el tiempo de examen 
 var now = new Date();
 var countDownDate=now.setSeconds(now.getSeconds() + tiempoExamen);
 creadorCountDown();
 creadorHtml(answers);
 

 ////////////////////////////// Funcion para la cuenta atras del tiempo de examen
 ////////////////////////////// Al acabar el tiempo el examen se autocorrige

function creadorCountDown(){
var x = setInterval(function() {
  var aux = new Date().getTime();
  var distance = countDownDate - aux;
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

if(stopTiempo==false){

  document.getElementById("relojerino").innerHTML = "Tiempo restante: "+ minutes + "m " + seconds + "s ";
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("relojerino").innerHTML = "ENTREGADO";
    corregirTodo();
    window.scrollTo(0,document.body.scrollHeight);
  }
}
}, 1000);
}

////////////////////////////// Funcion creadorHtml. Nos crea la estructura para direccionar cada pregunta a las correspondientes funciones
////////////////////////////// según el tipo.

function creadorHtml(obj){

  for(i=0;i<obj.length;i++){

    switch(obj[i].type) {
    case "select":
        createSelect(obj[i]);
        rellenarSelect(obj[i]);
        break;
    case "texto":
        createText(obj[i]);
        rellenarTexto(obj[i]);
        break;
    case "checkbox":
        createCheck(obj[i]);
        rellenarCheck(obj[i]);
        break;
    case "radio":
        createRadio(obj[i]);
        rellenarRadio(obj[i]);
        break;
    case "number":
        createNumber(obj[i]);
        rellenarNum(obj[i]);
        break;
    default:
        console.log("nope");
}
  }
}

}


////////////////////////////// Funciones de creación. Aqui Creamos los distintos tipos de pregunta y sus campos.

function createSelect(dat){
  selNum++;
  container=document.getElementById("myform");
 var select= document.createElement("h3");
 select.setAttribute("id","tituloSelect"+selNum);
 var select2=document.createElement("h4");
 select2.setAttribute("id","textSelect"+selNum)
 var select3=document.createElement("select");
 select3.setAttribute("id","sel"+selNum);
 select3.setAttribute("class","select");
 var select4=document.createElement("br");
 var corregir=document.getElementById("corregir");
 container.insertBefore(select,corregir);
 container.insertBefore(select2,corregir);
 container.insertBefore(select3,corregir);
 container.insertBefore(select4,corregir);
}

function createCheck(obj){
  checkNum++;
   container=document.getElementById("myform");
 var check= document.createElement("h3");
 check.setAttribute("id","tituloCheckbox"+checkNum);
 var check2=document.createElement("h4");
 check2.setAttribute("id","textCheckbox"+checkNum)
 var check3=document.createElement("div");
 check3.setAttribute("id","checkboxDiv"+checkNum);
 check3.setAttribute("class","checkBox");
 var check4=document.createElement("br");
 var corregir=document.getElementById("corregir");
 container.insertBefore(check,corregir);
 container.insertBefore(check2,corregir);
 container.insertBefore(check3,corregir);
 container.insertBefore(check4,corregir);

}

function createText(obj){
  textNum++;
   container=document.getElementById("myform");
 var text= document.createElement("h3");
 text.setAttribute("id","tituloTexto"+textNum);
 var text2=document.createElement("h4");
 text2.setAttribute("id","textInput"+textNum)
 var text3=document.createElement("input");
 text3.setAttribute("type","text");
 text3.setAttribute("id","respuesta"+textNum);
 text3.setAttribute("class","respuesta");
 var text4=document.createElement("br"); 
 var corregir=document.getElementById("corregir");
 container.insertBefore(text,corregir);
 container.insertBefore(text2,corregir);
 container.insertBefore(text3,corregir);
 container.insertBefore(text4,corregir);
 

}

function createRadio(obj){
  radioNum++;
   container=document.getElementById("myform");
 var radio= document.createElement("h3");
 radio.setAttribute("id","tituloRadio"+radioNum);
 var radio2=document.createElement("h4");
 radio2.setAttribute("id","textRadio"+radioNum)
var radio3=document.createElement("div");
 radio3.setAttribute("id","radioDiv"+radioNum);
 radio3.setAttribute("class","radio");
 var radio4=document.createElement("br");
 corregir=document.getElementById("corregir");
 container.insertBefore(radio,corregir);
 container.insertBefore(radio2,corregir);
 container.insertBefore(radio3,corregir);
 container.insertBefore(radio4,corregir);
}

function createNumber(obj){
numNum++;
   container=document.getElementById("myform");
 var number= document.createElement("h3");
 number.setAttribute("id","tituloNum"+numNum);
 var number2=document.createElement("h4");
 number2.setAttribute("id","textNum"+numNum)
 var number3=document.createElement("input");
 number3.setAttribute("id","numeroIntroducido"+numNum);
  number3.setAttribute("type","number");
  number3.setAttribute("class","numeroIntroducido");
 var number4=document.createElement("br");
 var corregir=document.getElementById("corregir");
 container.insertBefore(number,corregir);
 container.insertBefore(number2,corregir);
 container.insertBefore(number3,corregir);
 container.insertBefore(number4,corregir);
}


////////////////////////////// Funciones de rellenar el examen. Aqui sacamos por pantalla el titulo, texto y opciones ( si hay ) para la realización
//////////////////////////////  del examen y almacenamos las respuestas en las variables corresponiendentes para la posterior corrección.

function rellenarSelect(dat){
  respuestaSelect[selNum]=[];
  document.getElementById("tituloSelect"+selNum).innerHTML=dat.title;
  document.getElementById("textSelect"+selNum).innerHTML=dat.text;
  var select = document.getElementById("sel"+selNum);
  for (v = 0; v < dat.options.length; v++) {  
    var option = document.createElement("option");
    option.text = dat.options[v];
    option.value=v+1;
    select.options.add(option);
 } 
 for(w=0;w<dat.answers.length;w++){
  respuestaSelect[selNum]=dat.answers[w];
 } 
 var sele=document.getElementById("sel"+selNum);
 sele.value="-";
}

function rellenarTexto(dat){
 respuestaTexto[textNum]=dat.answers[0];
 document.getElementById("tituloTexto"+textNum).innerHTML = dat.title;
 document.getElementById("textInput"+textNum).innerHTML = dat.text;
}

function rellenarCheck(dat){

respuestasCheckbox[checkNum]=[];
   var checkboxContainer=document.getElementById("checkboxDiv"+checkNum);
 document.getElementById("tituloCheckbox"+checkNum).innerHTML = dat.title;
  document.getElementById("textCheckbox"+checkNum).innerHTML = dat.text;
 for (v = 0; v < dat.options.length; v++) { 
    var input = document.createElement("input");
    var labelC = document.createElement("label");
    labelC.innerHTML=dat.options[v];
    labelC.setAttribute("for", "color_"+v);
    input.setAttribute("class","check"+checkNum);
    input.type="checkbox";
    input.name="color";
    input.id="color_"+v;    
    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(labelC);
 }  
 for(w=0;w<dat.answers.length;w++){
  respuestasCheckbox[checkNum][w]=dat.answers[w];
 }

}

function rellenarRadio(dat){
 document.getElementById("tituloRadio"+radioNum).innerHTML = dat.title;
  document.getElementById("textRadio"+radioNum).innerHTML = dat.text;
  var radioDiv=document.getElementById("radioDiv"+radioNum);
 for (v = 0; v < dat.options.length; v++) { 
    var input = document.createElement("input");
    var labelR = document.createElement("label");
    input.setAttribute("class","radioB"+radioNum);
    labelR.innerHTML=dat.options[v];
    labelR.setAttribute("for", "color_"+v);
    input.type="radio";
    input.name="color"+radioNum;
    input.id="color_"+v;    
    radioDiv.appendChild(input);
    radioDiv.appendChild(labelR);
 }  
  respuestasRadio[radioNum]=parseInt(dat.answers);

}

function rellenarNum(dat){
  respuestaNum[numNum]=dat.answers[0];
document.getElementById("tituloNum"+numNum).innerHTML = dat.title;
document.getElementById("textNum"+numNum).innerHTML = dat.text;
}


///////////////////////////// Función para corregir el cuestionario. Se bloquea el botón de corregir y se da el desglose de la nota
///////////////////////////// indicando las acertadas y las falladas.

function corregirTodo(){
  corregirSelect();
  corregirTexto();
  corregirCheckbox();
  corregirRadio();
  corregirNumber();
 presentarNota();
 document.getElementById("corregir").disabled=true; 
}

////////////////////////////// Funciones de corrección. Aqui comparamos los valores introducidos por el usuario con los valores de las respuestas.
////////////////////////////// Actualizamos la Nota y indicamos los outputs que el usuario verá como corrección ( función darRespuestaHtml ).



function corregirTexto(){
  var t=document.getElementsByClassName("respuesta");
  for(i=0;i<t.length;i++){
  	var s=document.getElementById("respuesta"+(i+1)).value;
    if(s!=""){
  	 if (s==respuestaTexto[i+1]) {
        document.getElementById("respuesta"+(i+1)).style.backgroundColor = "lightgreen";
        nota +=1;
      }
     else{ darRespuestaHtml("Pregunta Texto"+(i+1)+" incorrecta. La respuesta era: "+respuestaTexto[i+1]);
     document.getElementById("respuesta"+(i+1)).style.backgroundColor = "red";
     nota -=0.5;
      }
    }else{
      darRespuestaHtml("Pregunta Texto"+(i+1)+" sin contestar");
    }
  }
}

function corregirNumber(){ /// revisar
  

  var t=document.getElementsByClassName("numeroIntroducido");
  for(i=0;i<t.length;i++){
    var s=parseInt(document.getElementById("numeroIntroducido"+(i+1)).value); 
    if(isNaN(s)!=true){
     
    if (s==parseInt(respuestaNum[i+1])) {
      document.getElementById("numeroIntroducido"+(i+1)).style.backgroundColor = "lightgreen";
      nota +=1;
    }else{
      document.getElementById("numeroIntroducido"+(i+1)).style.backgroundColor = "red";
      darRespuestaHtml("Pregunta Number"+(i+1)+" incorrecta. La respuesta era: "+parseInt(respuestaNum[i+1]));
      nota-=0.5;
    }
    }else{
      darRespuestaHtml("Pregunta Number"+(i+1)+" sin contestar");
    }
  }
  }

function corregirSelect(){
var cantSel=document.getElementsByClassName("select").length;
 for(i=0;i<cantSel;i++){
 var e=document.getElementById("sel"+(i+1));
 if(e.options[e.selectedIndex]==undefined){
 darRespuestaHtml("Pregunta Select"+(i+1)+" sin contestar");
 }else{
 if(e.options[e.selectedIndex].index==parseInt(respuestaSelect[i+1])){  
    document.getElementById("sel"+(i+1)).style.backgroundColor = "lightgreen";  
  
    nota +=1;
  }else{
    document.getElementById("sel"+(i+1)).style.backgroundColor = "red"; 
   darRespuestaHtml("Pregunta Select"+(i+1)+" incorrecta. La opción correcta era la opción número "+(parseInt(respuestaSelect[i+1])+1));
   nota -=0.5;
  } 
 }
 }
}

function corregirCheckbox(){ 
  var cl=document.getElementsByClassName("checkBox").length;
  for(i=0;i<cl;i++){
    var aciertosCheck=0;
    var erroresCheck=0;
    var acertado=false;
    var checkerino=false;
    var chL=document.getElementsByClassName("check"+(i+1)).length;
     for(j=0;j<chL;j++){
      acertado=false;
      checkerino=document.getElementsByClassName("check"+(i+1))[j].checked;
      if(checkerino==true){
        for(k=0;k<respuestasCheckbox[i+1].length;k++){
          if(parseInt(respuestasCheckbox[i+1][k])==j){
            aciertosCheck++;
            acertado=true;
          }
          if(k==(respuestasCheckbox[i+1].length-1)&&acertado==false){
            erroresCheck++;
          }
        }
      }
     }
   
var notaTotal=1;
var posiblesAcierto=respuestasCheckbox[i+1].length;
var cantidadCasillas=chL;
var sumaAciertos=notaTotal/posiblesAcierto;
var restaFallos=(notaTotal/(cantidadCasillas/2));
var notaObtenida=(sumaAciertos*aciertosCheck)-(restaFallos*erroresCheck);

nota+=notaObtenida;

if(notaObtenida>0){
 if(notaObtenida==1){
  document.getElementById("checkboxDiv"+(i+1)).style.backgroundColor = "lightgreen"; 

}
else{
  darRespuestaHtml("Pregunta Checkbox"+(i+1)+" parcialmente correcta. Te suma: "+notaObtenida.toFixed(2));
    document.getElementById("checkboxDiv"+(i+1)).style.backgroundColor = "lightblue";

}
  }else{
    if(notaObtenida<0){
    document.getElementById("checkboxDiv"+(i+1)).style.backgroundColor = "red"; 
   // darRespuestaHtml("Pregunta Checkbox"+(i+1)+" incorrecta. Te resta: "+notaObtenida.toFixed(2));
  } if(notaObtenida==0){
     if(aciertosCheck>=1){
     darRespuestaHtml("Pregunta Checkbox"+(i+1)+" parcialmente correcta. Te suma: "+notaObtenida.toFixed(2));
      document.getElementById("checkboxDiv"+(i+1)).style.backgroundColor = "lightblue"; 

  }else{
     darRespuestaHtml("Pregunta Checkbox"+(i+1)+" sin contestar.");}
  } 
  }
} 
}

function corregirRadio(){
  var noSel=true;
  var aux=false;
  var cr=document.getElementsByClassName("radio").length;
   for(i=0;i<cr;i++){
    var chr=document.getElementsByClassName("radioB"+(i+1)).length;
    for(j=0;j<chr;j++){
        aux=document.getElementsByClassName("radioB"+(i+1))[j].checked;
        if(aux==true){
          noSel=false;
          if(j==respuestasRadio[i+1]){
            document.getElementById("radioDiv"+(i+1)).style.backgroundColor = "lightgreen"; 
            nota+=1;
          }else{
              var aux2=1/chr;
              document.getElementById("radioDiv"+(i+1)).style.backgroundColor = "red";
             darRespuestaHtml("Pregunta Radio"+(i+1)+" incorrecta. Tu nota baja "+aux2.toFixed(2));
             nota=nota-aux2;
          }
        }
      }
      if(noSel==true){
    darRespuestaHtml("Pregunta Radio"+(i+1)+" sin contestar.");
     } 
   }
  
}


////////////////////////////////Gestionar la presentación de las respuestas
////////////////////////////// darrespuestaHtml nos muestra por pantalla lo que recibe por parámetro
////////////////////////////// presentarNota nos muestra el valor de la nota que hemos obtenido. Nunca menor a 0.
////////////////////////////// inicializar nos deja el valor nota a 0 y nos "borra" los outputs que pudiese haber de una ejecución previa.

function darRespuestaHtml(r){
 var p = document.createElement("p");
 var node = document.createTextNode(r);
 p.appendChild(node);
 document.getElementById("resultadosDiv").appendChild(p);
}

function presentarNota(){
  stopTiempo=true;
  if(nota>0){
    if(nota<5){
      document.getElementById("resultadosDiv").style.backgroundColor = "red"; 
    }
      darRespuestaHtml("Nota: "+nota.toFixed(2)+" puntos sobre 10");
  }else{
    document.getElementById("resultadosDiv").style.backgroundColor = "red"; 
    darRespuestaHtml("Nota: 0 puntos sobre 10");
  }
}

function inicializar(){
   stopTiempo=false;
   document.getElementById("resultadosDiv").innerHTML = "";
   nota=0.0;
}
