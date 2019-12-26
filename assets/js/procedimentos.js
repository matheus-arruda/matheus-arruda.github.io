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

    //Chamo a função de reconhecimento de voz
    //reconhecimento()

    });

    function reconhecimento() {

        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        let finalTranscript = '';
        let recognition = new window.SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
        recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          //document.querySelector('body').innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</>';
          console.log(interimTranscript)
          if(interimTranscript.indexOf("forno")) {
            window.location.href="forno.html"; 
          } else if(interimTranscript.indexOf("voltar")) {
            window.location.href="index.html"; 
          }
        }
        recognition.start();
        falar("Ok, vou acessar o forno")
    }

    function falar(texto) {

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.voiceURI = "Google português do Brasil";
        utterance.lang = "pt-BR";
        utterance.rate = 1.3;

        utterance.text = texto;
        synth.speak(utterance);

        console.log("Boo");

    }



    function equipamentos(filename) {
        console.log(filename)
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
    if(filename.toUpperCase().indexOf("/") > 0) {
        filename = filename.toUpperCase()
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
