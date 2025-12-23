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
echo $json;
exit;

?>
