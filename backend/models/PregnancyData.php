<?php
class PregnancyData {
    private $conn;
    private $table_name = "pregnancy_data";

    public $id;
    public $user_id;
    public $current_week;
    public $due_date;
    public $last_checkup;
    public $next_checkup;
    public $notes;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, current_week=:current_week, 
                    due_date=:due_date, last_checkup=:last_checkup,
                    next_checkup=:next_checkup, notes=:notes";

        $stmt = $this->conn->prepare($query);

        $this->notes = htmlspecialchars(strip_tags($this->notes));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":current_week", $this->current_week);
        $stmt->bindParam(":due_date", $this->due_date);
        $stmt->bindParam(":last_checkup", $this->last_checkup);
        $stmt->bindParam(":next_checkup", $this->next_checkup);
        $stmt->bindParam(":notes", $this->notes);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByUser() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY id DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET current_week=:current_week, due_date=:due_date,
                    last_checkup=:last_checkup, next_checkup=:next_checkup,
                    notes=:notes
                WHERE user_id=:user_id";

        $stmt = $this->conn->prepare($query);

        $this->notes = htmlspecialchars(strip_tags($this->notes));

        $stmt->bindParam(":current_week", $this->current_week);
        $stmt->bindParam(":due_date", $this->due_date);
        $stmt->bindParam(":last_checkup", $this->last_checkup);
        $stmt->bindParam(":next_checkup", $this->next_checkup);
        $stmt->bindParam(":notes", $this->notes);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>