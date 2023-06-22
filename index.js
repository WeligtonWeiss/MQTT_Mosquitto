import { connect } from "mqtt" // antes de executar o código, rodar o comando "npm install" no cmd, com diretório da pasta desse código. É necessário ter os 3 arquivos para funcionar o npm install sendo eles: index.js, package.json e .babelrc
let client = connect('mqtt://test.mosquitto.org')
let dados

client.on("connect", function() {
    client.subscribe('Liberato/iotTro/44xx/data')
    console.log("Conexão estabelecida")
})

client.on("message", function(topic, message) {
    dados = JSON.parse(message.toString())
    console.log(dados)
    if(topic == "Liberato/iotTro/44xx/data"){
        alterarJson()
        console.log(dados)
        client.publish('Liberato/iotTro/44xx/rply/18000345', JSON.stringify(dados))
    }
})

function alterarJson(){
    dados.seq += 900000
    dados.id = 'Stephanie Staub'
    dados.matricula = "18000345"
    dados.turma = "4411"
    dados.difTemp = Math.abs(Number((dados.tempExt - dados.tempInt).toPrecision(3)))
    let medTemp = (dados.tempExt + dados.tempInt)/2
    defineAlarme(medTemp)
    delete dados.tempExt
    delete dados.tempInt
    delete dados.umidade
}

function defineAlarme(temperatura){
    if (temperatura < 7){
        dados.alarme = 'Cuidado! Frio intenso'
    }
    else if  (7 <= temperatura && temperatura < 18){
        dados.alarme = 'Ta começando a esfriar, melhor levar um casaquinho.'
    }
    else if  (18 <= temperatura && temperatura < 30){
        dados.alarme = 'A temperatura esta amena por enquanto'
    }
    else if (temperatura > 30){
        dados.alarme = 'Calor intenso te espera na rua.'
    }
}