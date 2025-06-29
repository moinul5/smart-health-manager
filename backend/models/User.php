<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $password;
    public $age;
    public $gender;
    public $height;
    public $weight;
    public $medical_history;
    public $fitness_goals;
    public $pregnancy_status;
    public $phone;
    public $address;
    public $emergency_contact;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET name=:name, email=:email, password=:password, age=:age, 
                    gender=:gender, height=:height, weight=:weight, 
                    medical_history=:medical_history, fitness_goals=:fitness_goals,
                    pregnancy_status=:pregnancy_status, phone=:phone, 
                    address=:address, emergency_contact=:emergency_contact";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        
        // Handle JSON fields
        $this->medical_history = is_array($this->medical_history) ? json_encode($this->medical_history) : json_encode([]);
        $this->fitness_goals = is_array($this->fitness_goals) ? json_encode($this->fitness_goals) : json_encode([]);
        
        // Handle boolean
        $this->pregnancy_status = $this->pregnancy_status ? 1 : 0;

        // Bind parameters
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":age", $this->age);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":height", $this->height);
        $stmt->bindParam(":weight", $this->weight);
        $stmt->bindParam(":medical_history", $this->medical_history);
        $stmt->bindParam(":fitness_goals", $this->fitness_goals);
        $stmt->bindParam(":pregnancy_status", $this->pregnancy_status);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":emergency_contact", $this->emergency_contact);

        try {
            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $exception) {
            error_log("Database Error: " . $exception->getMessage());
            return false;
        }
    }

    public function login() {
        $query = "SELECT id, name, email, password, age, gender, height, weight, 
                         medical_history, fitness_goals, pregnancy_status, phone, 
                         address, emergency_contact, created_at 
                  FROM " . $this->table_name . " 
                  WHERE email = :email LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        $num = $stmt->rowCount();

        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                $this->age = $row['age'];
                $this->gender = $row['gender'];
                $this->height = $row['height'];
                $this->weight = $row['weight'];
                $this->medical_history = json_decode($row['medical_history'], true);
                $this->fitness_goals = json_decode($row['fitness_goals'], true);
                $this->pregnancy_status = $row['pregnancy_status'];
                $this->phone = $row['phone'];
                $this->address = $row['address'];
                $this->emergency_contact = $row['emergency_contact'];
                $this->created_at = $row['created_at'];
                return true;
            }
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET name=:name, age=:age, gender=:gender, height=:height, 
                    weight=:weight, medical_history=:medical_history, 
                    fitness_goals=:fitness_goals, pregnancy_status=:pregnancy_status,
                    phone=:phone, address=:address, emergency_contact=:emergency_contact
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->medical_history = json_encode($this->medical_history);
        $this->fitness_goals = json_encode($this->fitness_goals);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":age", $this->age);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":height", $this->height);
        $stmt->bindParam(":weight", $this->weight);
        $stmt->bindParam(":medical_history", $this->medical_history);
        $stmt->bindParam(":fitness_goals", $this->fitness_goals);
        $stmt->bindParam(":pregnancy_status", $this->pregnancy_status);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":emergency_contact", $this->emergency_contact);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>