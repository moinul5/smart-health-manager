<?php
// Include CORS configuration first
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$user = new User($db);

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input);

if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    $user->name = $data->name;
    $user->email = $data->email;
    $user->password = $data->password;
    $user->age = isset($data->age) ? $data->age : 0;
    $user->gender = isset($data->gender) ? $data->gender : 'other';
    $user->height = isset($data->height) ? $data->height : 0;
    $user->weight = isset($data->weight) ? $data->weight : 0;
    $user->medical_history = isset($data->medicalHistory) ? $data->medicalHistory : [];
    $user->fitness_goals = isset($data->fitnessGoals) ? $data->fitnessGoals : [];
    $user->pregnancy_status = isset($data->pregnancyStatus) ? $data->pregnancyStatus : false;
    $user->phone = isset($data->contactInfo) && isset($data->contactInfo->phone) ? $data->contactInfo->phone : '';
    $user->address = isset($data->contactInfo) && isset($data->contactInfo->address) ? $data->contactInfo->address : '';
    $user->emergency_contact = isset($data->contactInfo) && isset($data->contactInfo->emergencyContact) ? $data->contactInfo->emergencyContact : '';

    if($user->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "User registered successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to register user. Please check if email already exists."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Name, email and password are required."));
}
?>