<?php
// Direct test without .htaccess rewriting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include CORS configuration to avoid duplicates
require_once 'config/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_input = file_get_contents("php://input");
    $data = json_decode($raw_input, true);
    
    echo json_encode([
        "message" => "✅ Direct POST test successful!",
        "method" => $_SERVER['REQUEST_METHOD'],
        "received_data" => $data,
        "user_id_check" => isset($data['user_id']) ? "✅ Found" : "❌ Missing",
        "timestamp" => date('Y-m-d H:i:s')
    ]);
} else {
    echo json_encode([
        "message" => "✅ Direct GET test successful!",
        "method" => $_SERVER['REQUEST_METHOD'],
        "timestamp" => date('Y-m-d H:i:s')
    ]);
}
?>