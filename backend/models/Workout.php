<?php
class Workout {
    private $conn;
    private $table_name = "workouts";

    public $id;
    public $user_id;
    public $exercise_type;
    public $duration;
    public $calories_burned;
    public $goal;
    public $date;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, exercise_type=:exercise_type, 
                    duration=:duration, calories_burned=:calories_burned,
                    goal=:goal, date=:date";

        $stmt = $this->conn->prepare($query);

        $this->exercise_type = htmlspecialchars(strip_tags($this->exercise_type));
        $this->goal = htmlspecialchars(strip_tags($this->goal));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":exercise_type", $this->exercise_type);
        $stmt->bindParam(":duration", $this->duration);
        $stmt->bindParam(":calories_burned", $this->calories_burned);
        $stmt->bindParam(":goal", $this->goal);
        $stmt->bindParam(":date", $this->date);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByUser() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt;
    }
}
?>