<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$pregnancy_model_file = '../../models/PregnancyData.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($pregnancy_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "PregnancyData model file not found: " . $pregnancy_model_file));
    exit();
}

require_once $database_file;
require_once $pregnancy_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$pregnancy = new PregnancyData($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if($user_id) {
        $pregnancy->user_id = $user_id;
        $stmt = $pregnancy->readByUser();
        
        if($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $pregnancy_data = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "currentWeek" => (int)$row['current_week'],
                "dueDate" => $row['due_date'],
                "lastCheckup" => $row['last_checkup'],
                "nextCheckup" => $row['next_checkup'],
                "notes" => $row['notes']
            );
            
            http_response_code(200);
            echo json_encode($pregnancy_data);
        } else {
            // Return empty object instead of 404 for no pregnancy data
            http_response_code(200);
            echo json_encode(null);
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data for pregnancy: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data for pregnancy: " . print_r($data, true));
    
    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
        exit();
    }
    
    // Check for user_id in the data (handle both userId and user_id)
    $user_id = $data['userId'] ?? $data['user_id'] ?? null;
    if(empty($user_id)) {
        http_response_code(400);
        echo json_encode(array(
            "message" => "User ID is required.",
            "received_data" => $data,
            "debug_info" => array(
                "userId_exists" => isset($data['userId']),
                "user_id_exists" => isset($data['user_id']),
                "userId_value" => $data['userId'] ?? 'not set',
                "user_id_value" => $data['user_id'] ?? 'not set',
                "all_keys" => array_keys($data ?? [])
            )
        ));
        exit();
    }
    
    // Handle both camelCase and snake_case field names
    $current_week = $data['currentWeek'] ?? $data['current_week'] ?? null;
    if(empty($current_week)) {
        http_response_code(400);
        echo json_encode(array("message" => "Current week is required."));
        exit();
    }
    
    $pregnancy->user_id = $user_id;
    $pregnancy->current_week = $current_week;
    $pregnancy->due_date = $data['dueDate'] ?? $data['due_date'] ?? null;
    $pregnancy->last_checkup = $data['lastCheckup'] ?? $data['last_checkup'] ?? null;
    $pregnancy->next_checkup = $data['nextCheckup'] ?? $data['next_checkup'] ?? null;
    $pregnancy->notes = $data['notes'] ?? '';

    if($pregnancy->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Pregnancy data added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add pregnancy data."));
    }
}

if($method == 'PUT') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw PUT data for pregnancy: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded PUT data for pregnancy: " . print_r($data, true));
    
    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
        exit();
    }
    
    // Check for user_id in the data (handle both userId and user_id)
    $user_id = $data['userId'] ?? $data['user_id'] ?? null;
    if(empty($user_id)) {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
        exit();
    }
    
    // Handle both camelCase and snake_case field names
    $current_week = $data['currentWeek'] ?? $data['current_week'] ?? null;
    if(empty($current_week)) {
        http_response_code(400);
        echo json_encode(array("message" => "Current week is required."));
        exit();
    }
    
    $pregnancy->user_id = $user_id;
    $pregnancy->current_week = $current_week;
    $pregnancy->due_date = $data['dueDate'] ?? $data['due_date'] ?? null;
    $pregnancy->last_checkup = $data['lastCheckup'] ?? $data['last_checkup'] ?? null;
    $pregnancy->next_checkup = $data['nextCheckup'] ?? $data['next_checkup'] ?? null;
    $pregnancy->notes = $data['notes'] ?? '';

    if($pregnancy->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Pregnancy data updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update pregnancy data."));
    }
}
?>