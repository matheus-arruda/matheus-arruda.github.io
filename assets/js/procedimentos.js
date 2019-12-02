$(document).ready(function() {
    $body = $("body");
    $body.addClass("loading");
    var url = $(location).attr('href')
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; // <-- added this line    
    filename = filename.charAt(0).toUpperCase() + filename.slice(1)

    //Pesquisa
    $("#pesq-btn").click(function(){      
        var condicao = $("#inpt-pesq").val()         
        window.location.href = "pesquisa.html?condicao="+condicao
    });

    //Pesquisa Enter
    $('#inpt-pesq').keydown(function (e){
        if(e.keyCode == 13){
            var condicao = $("#inpt-pesq").val()         
            window.location.href = "pesquisa.html?condicao="+condicao
        }
    })


    if(filename == "Pesquisa") {
        let searchParams = new URLSearchParams(window.location.search)
        var condicao = searchParams.get('condicao') // true
        console.log(condicao)
        pesquisa(condicao)
    }
    else if (filename != "Index" && filename != "Pesquisa"){
        equipamentos(filename)
    }

    });

    function equipamentos(filename) {
            //Tratar casos em que a página possui underline
    if(filename.indexOf("_")) {
        filename = filename.replace("_"," ")
        var words = filename.toLowerCase().split(" ");
        for (var a = 0; a < words.length; a++) {
            var w = words[a];
            words[a] = w[0].toUpperCase() + w.slice(1);
        }
        filename = words.join(" ")        
    }

    //Tratar casos em que a página possui traço
    if(filename.indexOf("-")) {
        filename = filename.replace("-","/")
    }
    if(filename == "Gro") {
        filename = "GRO"
    }
    if(filename == "Preparacao De_linha") {
        filename = "Preparação de Linha"
    }
    if(filename == "Recuperacao De_placas") {
        filename = "Recuperação de Placas"
    }
    if(filename == "Programacao") {
        filename = "Programação"
    }

    console.log(filename)

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbyHxEhNQG42A4bpGWFrQroQg-tFITeZRvuCY-Y8B3PcKzArLlg/exec?action=ItensEqpmt&equipamento="+filename,
        success: function(result) {
            $body.removeClass("loading");
            console.log("aqui")
        }
    }).then(function(data) {
      var i = 0
    
       for(var key in data.items) {      
          $("#ppas").prepend('<div id="proced" class="row"><div class="col-md-12"><div class="card text-center"><div class="card-body"><p id="textproce" class="card-text text-dark"><b>'+data.items[key].Codigo+'</b> - '+data.items[key].Nome+'</p><a href="'+data.items[key].Link+'" target="_Blanck"class="btn btn-primary">Acessar Procedimento<br></a></div> </div></div> </div>'); 
          i++
       }
      
       if($('#textproce').text() == "#N/A - undefined") {
        $("#proced").hide()
        $("#ppas").prepend('<div id="proced" class="row"><div class="col-md-12"><div class="card text-center"><div class="card-body"><p id="textproce" class="card-text text-dark"><b>Nenhum procedimento encontrado</p></div> </div></div> </div>'); 
        }
       
       console.log($('#textproce').text())
    
       
    });

    }

    function pesquisa(condicao) {        
        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbyHxEhNQG42A4bpGWFrQroQg-tFITeZRvuCY-Y8B3PcKzArLlg/exec?action=Pesquisa&condicao="+condicao,
            success: function(result) {
                $body.removeClass("loading");
                console.log("aqui")
            }
        }).then(function(data) {
          var i = 0
        
           for(var key in data.items) {      
              $("#ppas").prepend('<div id="proced" class="row"><div class="col-md-12"><div class="card text-center"><div class="card-body"><p id="textproce" class="card-text text-dark"><b>'+data.items[key].Codigo+'</b> - '+data.items[key].Nome+'</p><a href="'+data.items[key].Link+'" target="_Blanck"class="btn btn-primary">Acessar Procedimento<br></a></div> </div></div> </div>'); 
              i++
           }
          
           if($('#textproce').text() == "#N/A - undefined") {
            $("#proced").hide()
            $("#ppas").prepend('<div id="proced" class="row"><div class="col-md-12"><div class="card text-center"><div class="card-body"><p id="textproce" class="card-text text-dark"><b>Nenhum procedimento encontrado</p></div> </div></div> </div>'); 
            }
           
           console.log($('#textproce').text())
        });

}
