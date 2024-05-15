<?php 
include_once(dirname(__FILE__, 2)."/onload.php");

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    try { 
        if($_GET["Option"] == "PO"){
                $data = null;
                $sql = "SELECT p.po_code as value, p.po_code as label FROM `po` p 
                LEFT JOIN supplier s on p.supcode = s.supcode where p.status != 'CP' and p.status != 'Cancel'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();
        }
        
        http_response_code(200);
        echo json_encode(array("data"=>$data));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        echo "";
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}

exit;
?>