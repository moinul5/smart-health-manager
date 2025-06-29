<?php
class Meal {
    private $conn;
    private $table_name = "meals";

    public $id;
    public $user_id;
    public $food_item;
    public $calories;
    public $protein;
    public $carbs;
    public $fats;
    public $meal_type;
    public $date;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, food_item=:food_item, calories=:calories,
                    protein=:protein, carbs=:carbs, fats=:fats, 
                    meal_type=:meal_type, date=:date";

        $stmt = $this->conn->prepare($query);

        $this->food_item = htmlspecialchars(strip_tags($this->food_item));
        $this->meal_type = htmlspecialchars(strip_tags($this->meal_type));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":food_item", $this->food_item);
        $stmt->bindParam(":calories", $this->calories);
        $stmt->bindParam(":protein", $this->protein);
        $stmt->bindParam(":carbs", $this->carbs);
        $stmt->bindParam(":fats", $this->fats);
        $stmt->bindParam(":meal_type", $this->meal_type);
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

    public function readTodayByUser() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND DATE(date) = CURDATE()
                  ORDER BY date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt;
    }
}
?>