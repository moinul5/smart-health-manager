<?php
class Medication {
    private $conn;
    private $table_name = "medications";

    public $id;
    public $user_id;
    public $medicine_name;
    public $dosage;
    public $frequency;
    public $start_date;
    public $end_date;
    public $reminder_times;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, medicine_name=:medicine_name, 
                    dosage=:dosage, frequency=:frequency, start_date=:start_date,
                    end_date=:end_date, reminder_times=:reminder_times";

        $stmt = $this->conn->prepare($query);

        $this->medicine_name = htmlspecialchars(strip_tags($this->medicine_name));
        $this->dosage = htmlspecialchars(strip_tags($this->dosage));
        $this->frequency = htmlspecialchars(strip_tags($this->frequency));
        $this->reminder_times = json_encode($this->reminder_times);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":medicine_name", $this->medicine_name);
        $stmt->bindParam(":dosage", $this->dosage);
        $stmt->bindParam(":frequency", $this->frequency);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":reminder_times", $this->reminder_times);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByUser() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY start_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>