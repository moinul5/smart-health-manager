<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$mood_model_file = '../../models/MoodEntry.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($mood_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "MoodEntry model file not found: " . $mood_model_file));
    exit();
}

require_once $database_file;
require_once $mood_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$mood = new MoodEntry($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $today_only = $_GET['today'] ?? false;
    
    if($user_id) {
        $mood->user_id = $user_id;
        
        if($today_only) {
            $stmt = $mood->readTodayByUser();
        } else {
            $stmt = $mood->readByUser();
        }
        
        $moods = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $mood_item = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "mood" => $row['mood'],
                "stressLevel" => (int)$row['stress_level'],
                "journalText" => $row['journal_text'],
                "date" => $row['date']
            );
            array_push($moods, $mood_item);
        }
        
        http_response_code(200);
        echo json_encode($moods);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data for moods: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data for moods: " . print_r($data, true));
    
    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
        exit();
    }
    
    // Check for user_id in the data
    if(empty($data['user_id'])) {
        http_response_code(400);
        echo json_encode(array(
            "message" => "User ID is required.",
            "received_data" => $data,
            "debug_info" => array(
                "user_id_exists" => isset($data['user_id']),
                "user_id_value" => $data['user_id'] ?? 'not set',
                "all_keys" => array_keys($data ?? [])
            )
        ));
        exit();
    }
    
    if(empty($data['mood'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Mood is required."));
        exit();
    }
    
    $mood->user_id = $data['user_id'];
    $mood->mood = $data['mood'];
    $mood->stress_level = $data['stressLevel'] ?? 5;
    $mood->journal_text = $data['journalText'] ?? '';
    $mood->date = $data['date'] ?? date('Y-m-d H:i:s');

    if($mood->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Mood entry added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add mood entry."));
    }
}
?>