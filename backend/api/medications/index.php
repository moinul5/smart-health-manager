<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$medication_model_file = '../../models/Medication.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($medication_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Medication model file not found: " . $medication_model_file));
    exit();
}

require_once $database_file;
require_once $medication_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$medication = new Medication($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if($user_id) {
        $medication->user_id = $user_id;
        $stmt = $medication->readByUser();
        
        $medications = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $medication_item = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "medicineName" => $row['medicine_name'],
                "dosage" => $row['dosage'],
                "frequency" => $row['frequency'],
                "startDate" => $row['start_date'],
                "endDate" => $row['end_date'],
                "reminderTimes" => json_decode($row['reminder_times'], true) ?: []
            );
            array_push($medications, $medication_item);
        }
        
        http_response_code(200);
        echo json_encode($medications);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data for medications: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data for medications: " . print_r($data, true));
    
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
    
    // Check for required fields (handle both camelCase and snake_case)
    $medicine_name = $data['medicineName'] ?? $data['medicine_name'] ?? null;
    if(empty($medicine_name)) {
        http_response_code(400);
        echo json_encode(array("message" => "Medicine name is required."));
        exit();
    }
    
    $medication->user_id = $user_id;
    $medication->medicine_name = $medicine_name;
    $medication->dosage = $data['dosage'] ?? '';
    $medication->frequency = $data['frequency'] ?? '';
    $medication->start_date = $data['startDate'] ?? $data['start_date'] ?? date('Y-m-d');
    $medication->end_date = $data['endDate'] ?? $data['end_date'] ?? date('Y-m-d');
    
    // Handle reminder times (ensure it's an array)
    $reminder_times = $data['reminderTimes'] ?? $data['reminder_times'] ?? [];
    if (is_string($reminder_times)) {
        $reminder_times = json_decode($reminder_times, true) ?: [];
    }
    if (!is_array($reminder_times)) {
        $reminder_times = [];
    }
    $medication->reminder_times = $reminder_times;

    if($medication->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Medication added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add medication."));
    }
}

if($method == 'DELETE') {
    $id = $_GET['id'] ?? null;
    
    if($id) {
        $medication->id = $id;
        
        if($medication->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Medication deleted successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete medication."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Medication ID is required."));
    }
}
?>