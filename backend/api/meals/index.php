<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$meal_model_file = '../../models/Meal.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($meal_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Meal model file not found: " . $meal_model_file));
    exit();
}

require_once $database_file;
require_once $meal_model_file;

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$meal = new Meal($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $today_only = $_GET['today'] ?? false;
    
    if($user_id) {
        $meal->user_id = $user_id;
        
        if($today_only) {
            $stmt = $meal->readTodayByUser();
        } else {
            $stmt = $meal->readByUser();
        }
        
        $meals = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $meal_item = array(
                "id" => $row['id'],
                "userId" => $row['user_id'],
                "foodItem" => $row['food_item'],
                "calories" => (int)$row['calories'],
                "protein" => (float)$row['protein'],
                "carbs" => (float)$row['carbs'],
                "fats" => (float)$row['fats'],
                "mealType" => $row['meal_type'],
                "date" => $row['date']
            );
            array_push($meals, $meal_item);
        }
        
        http_response_code(200);
        echo json_encode($meals);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}

if($method == 'POST') {
    // Get raw POST data and log it for debugging
    $raw_input = file_get_contents("php://input");
    error_log("Raw POST data: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    error_log("Decoded POST data: " . print_r($data, true));
    
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
    
    if(empty($data['foodItem'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Food item is required."));
        exit();
    }
    
    $meal->user_id = $data['user_id'];
    $meal->food_item = $data['foodItem'];
    $meal->calories = $data['calories'] ?? 0;
    $meal->protein = $data['protein'] ?? 0;
    $meal->carbs = $data['carbs'] ?? 0;
    $meal->fats = $data['fats'] ?? 0;
    $meal->meal_type = $data['mealType'] ?? 'snack';
    $meal->date = $data['date'] ?? date('Y-m-d H:i:s');

    if($meal->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Meal added successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add meal."));
    }
}
?>