<?php
class MoodEntry {
    private $conn;
    private $table_name = "mood_entries";

    public $id;
    public $user_id;
    public $mood;
    public $stress_level;
    public $journal_text;
    public $date;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, mood=:mood, stress_level=:stress_level,
                    journal_text=:journal_text, date=:date";

        $stmt = $this->conn->prepare($query);

        $this->mood = htmlspecialchars(strip_tags($this->mood));
        $this->journal_text = htmlspecialchars(strip_tags($this->journal_text));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":mood", $this->mood);
        $stmt->bindParam(":stress_level", $this->stress_level);
        $stmt->bindParam(":journal_text", $this->journal_text);
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
                  ORDER BY date DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->execute();

        return $stmt;
    }
}
?>