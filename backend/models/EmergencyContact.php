<?php
class EmergencyContact {
    private $conn;
    private $table_name = "emergency_contacts";

    public $id;
    public $user_id;
    public $name;
    public $relation;
    public $phone;
    public $location;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET user_id=:user_id, name=:name, relation=:relation,
                    phone=:phone, location=:location";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->relation = htmlspecialchars(strip_tags($this->relation));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->location = htmlspecialchars(strip_tags($this->location));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":relation", $this->relation);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":location", $this->location);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByUser() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY name ASC";

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