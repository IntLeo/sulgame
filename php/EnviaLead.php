<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $entradaDados = $_POST['entradaDados'] ?? '';
    $telefone = $_POST['telefone'] ?? '';

    $token1 = '9c75d9b096576f0e197d00205f3658d3';
    $password = '3430afeedb1313';
    $cd_servico = '9999';
    $sys = 'MK0';


    $urlApi1 = "http://187.109.17.11:8080/mk/WSAutenticacao.rule?token=$token1&password=$password&cd_servico=$cd_servico&sys=$sys";

  
    $respostaApi1 = file_get_contents($urlApi1);

    if ($respostaApi1 === FALSE) {
        echo "Erro ao fazer a requisição para a API 1.";
    } else {
        echo "Resposta da API 1: " . $respostaApi1; 
    }
    
    $dadosApi1 = json_decode($respostaApi1, true);
    
    if ($dadosApi1 === null) {
        echo "Erro ao decodificar o JSON. Resposta: " . $respostaApi1; 
    }
    $dadosApi1 = json_decode($respostaApi1, true);

    if (isset($dadosApi1['Token'])) {
        $token = $dadosApi1['Token'];

        
        $urlApi2 = "http://187.109.17.11:8080/mk/WSMKInserirLead.rule?sys=MK0&token=$token&nome=" . urlencode($entradaDados) . "&fone01=" . urlencode($telefone) . "&endereco_lead=RS%7CSanta%20Rosa%7CGLORIA%7CAV%20TUPARENDI%7C1741%7C98785-109";

        $respostaApi2 = file_get_contents($urlApi2);

    } else {
        echo "Erro ao obter o token da API 1.";
    }

} else {
    echo "Método não permitido.";
}
