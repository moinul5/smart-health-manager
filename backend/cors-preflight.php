<?php
// Dedicated preflight handler - MUST be simple and fast
// NO duplicate headers - this is the ONLY place for CORS headers during OPTIONS

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Allow specific origins
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

// Set CORS headers only once
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Cache-Control, Pragma");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

// Log the preflight request for debugging
error_log("CORS Preflight handled: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// Always return 200 for OPTIONS and exit immediately
http_response_code(200);
exit();
?>