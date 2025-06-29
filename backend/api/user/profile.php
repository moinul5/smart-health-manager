<?php
// Include CORS configuration FIRST
require_once '../../config/cors.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database and model files with proper error checking
$database_file = '../../config/database.php';
$user_model_file = '../../models/User.php';

if (!file_exists($database_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "Database config file not found: " . $database_file));
    exit();
}

if (!file_exists($user_model_file)) {
    http_response_code(500);
    echo json_encode(array("message" => "User model file not found: " . $user_model_file));
    exit();
}

require_once $database_file;
require_once $user_model_file;

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->id)) {
        $user->id = $data->id;
        $user->name = $data->name;
        $user->age = $data->age;
        $user->gender = $data->gender;
        $user->height = $data->height;
        $user->weight = $data->weight;
        $user->medical_history = $data->medicalHistory ?? [];
        $user->fitness_goals = $data->fitnessGoals ?? [];
        $user->pregnancy_status = $data->pregnancyStatus ?? false;
        $user->phone = $data->contactInfo->phone ?? '';
        $user->address = $data->contactInfo->address ?? '';
        $user->emergency_contact = $data->contactInfo->emergencyContact ?? '';

        if($user->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Profile updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update profile."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
}
?>