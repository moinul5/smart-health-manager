<?php
// Debug file to test POST data reception
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include CORS configuration FIRST
require_once 'config/cors.php';

// Get raw POST data
$raw_input = file_get_contents("php://input");
$decoded_data = json_decode($raw_input, true);

// Debug information
$debug_info = [
    "message" => "Debug POST data reception",
    "method" => $_SERVER['REQUEST_METHOD'],
    "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'not set',
    "raw_input" => $raw_input,
    "decoded_data" => $decoded_data,
    "json_last_error" => json_last_error_msg(),
    "post_data" => $_POST,
    "get_data" => $_GET,
    "timestamp" => date('Y-m-d H:i:s'),
    "request_uri" => $_SERVER['REQUEST_URI']
];

echo json_encode($debug_info, JSON_PRETTY_PRINT);
?>