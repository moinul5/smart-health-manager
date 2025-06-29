<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$workout_model_file = '../../models/Workout.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($workout_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Workout model file not found: " . $workout_model_file));
    exit();
}

require_once $database_file;
require_once $workout_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$workout = new Workout($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if($user_id) {
        $workout->user_id = $user_id;
        $stmt = $workout->readByUser();
        
        $workouts = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $workout_item = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "exerciseType" => $row['exercise_type'],
                "duration" => (int)$row['duration'],
                "caloriesBurned" => (int)$row['calories_burned'],
                "goal" => $row['goal'],
                "date" => $row['date']
            );
            array_push($workouts, $workout_item);
        }
        
        http_response_code(200);
        echo json_encode($workouts);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data for workouts: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data for workouts: " . print_r($data, true));
    
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
    
    if(empty($data['exerciseType'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Exercise type is required."));
        exit();
    }
    
    $workout->user_id = $data['user_id'];
    $workout->exercise_type = $data['exerciseType'];
    $workout->duration = $data['duration'] ?? 0;
    $workout->calories_burned = $data['caloriesBurned'] ?? 0;
    $workout->goal = $data['goal'] ?? '';
    $workout->date = $data['date'] ?? date('Y-m-d H:i:s');

    if($workout->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Workout added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add workout."));
    }
}
?>