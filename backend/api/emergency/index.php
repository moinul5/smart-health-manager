<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$emergency_model_file = '../../models/EmergencyContact.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($emergency_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "EmergencyContact model file not found: " . $emergency_model_file));
    exit();
}

require_once $database_file;
require_once $emergency_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$contact = new EmergencyContact($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if($user_id) {
        $contact->user_id = $user_id;
        $stmt = $contact->readByUser();
        
        $contacts = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $contact_item = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "name" => $row['name'],
                "relation" => $row['relation'],
                "phone" => $row['phone'],
                "location" => $row['location']
            );
            array_push($contacts, $contact_item);
        }
        
        http_response_code(200);
        echo json_encode($contacts);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data for emergency contacts: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data for emergency contacts: " . print_r($data, true));
    
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
    
    if(empty($data['name'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Contact name is required."));
        exit();
    }
    
    $contact->user_id = $user_id;
    $contact->name = $data['name'];
    $contact->relation = $data['relation'] ?? '';
    $contact->phone = $data['phone'] ?? '';
    $contact->location = $data['location'] ?? '';

    if($contact->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Emergency contact added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add emergency contact."));
    }
}

if($method == 'DELETE') {
    $id = $_GET['id'] ?? null;
    
    if($id) {
        $contact->id = $id;
        
        if($contact->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Emergency contact deleted successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete emergency contact."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Contact ID is required."));
    }
}
?>