<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/../data/posts.json';
if (!file_exists($dataFile)) {
    echo json_encode(["error" => "posts data not found"]);
    http_response_code(500);
    exit;
}


$json = file_get_contents($dataFile);
if ($json === false) {
    echo json_encode(["error" => "Erreur de lecture du fichier posts.json"]);
    http_response_code(500);
    exit;
}

$data = json_decode($json);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "JSON mal formé dans posts.json"]);
    http_response_code(500);
    exit;
}
echo json_encode($data);
exit;

?>
