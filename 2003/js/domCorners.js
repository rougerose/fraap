//domCorners by Alessandro Fulciniti on http://web-graphics.com/mtarchive/001660.php

function DomCheck(){
return(document.createElement && document.getElementById)
}

function DomCorners(id,bk,h,tries){
var el=document.getElementById(id);
if(el==null){
    if(tries==null) tries=200;
    if(tries>0)
        setTimeout("DomCorners('"+id+"','"+bk+"',"+h+","+(--tries)+")",50);
    return;
    }
var c=new Array(4);
for(var i=0;i<4;i++){
    c[i]=document.createElement("b");
    c[i].style.display="block";
    c[i].style.height=h+"px";
    c[i].style.fontSize="1px";
    if(i%2==0)
        c[i].style.background="url("+bk+") no-repeat 0 -"+ i*h + "px";
    else
        c[i].style.background="url("+bk+") no-repeat 100% -"+ i*h + "px";
    }
c[0].appendChild(c[1]);
c[2].appendChild(c[3]);
el.style.padding="0";
el.insertBefore(c[0],el.firstChild);
el.appendChild(c[2]);
}

if(DomCheck()){
DomCorners("rub11","/IMG/b/transparent.png",5);
DomCorners("rub12","/IMG/b/transparent.png",5);
DomCorners("rub13","/IMG/b/transparent.png",5);
DomCorners("rub14","/IMG/b/transparent.png",5);
DomCorners("rub15","/IMG/b/transparent.png",5);
DomCorners("rub16","/IMG/b/transparent.png",5);
DomCorners("rub17","/IMG/b/transparent.png",5);
DomCorners("rub19","/IMG/b/transparent.png",5);

DomCorners("localisationRub11","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub12","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub13","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub14","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub15","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub16","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub17","/IMG/b/transparent-col.png",5);
DomCorners("localisationRub19","/IMG/b/transparent-col.png",5);

DomCorners("accueil","/IMG/b/transparent-col.png",5);
DomCorners("article11","/IMG/b/transparent-col.png",5);
DomCorners("article12","/IMG/b/transparent-col.png",5);
DomCorners("article13","/IMG/b/transparent-col.png",5);
DomCorners("newsletter","IMG/b/transparent-col.png",5);
DomCorners("interne","/IMG/b/transparent-col.png",5);

DomCorners("TCategories","/IMG/b/transparent2sur4.png",5);
DomCorners("Tbreves","/IMG/b/transparent2sur4.png",5);
DomCorners("TInfos","/IMG/b/transparent2sur4.png",5);
DomCorners("titreFP","/IMG/b/transparent2sur4.png",5);
DomCorners("titreDocuments","/IMG/b/transparent2sur4.png",5);
DomCorners("titreMotCles","/IMG/b/transparent2sur4.png",5);
DomCorners("titrePortfolio","/IMG/b/transparent2sur4.png",5);
DomCorners("pf","/IMG/b/transparentHaut.png",5);
DomCorners("contenuPortfolio","/IMG/b/transparent2sur4.png",5);
DomCorners("ar_geographique","/IMG/b/transparent2sur4.png",5);
DomCorners("ar_activites","/IMG/b/transparent2sur4.png",5);
}