<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include '../conn.php';
        if($_POST["Option"] == "Type"){
                //$where = !empty($_GET["w"]) ? "and pt.typecode = '$type'" : "";
                $data = null;
            
                $sql = "
                select  pt.prodty_id  value, pt.prodty_name label 
                from product_type pt
                where pt.status = 'Y'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();
        }
        if($_POST["Option"] == "Category"){
                $data = null;
                $sql = "
                select  c.ctgy_id value, c.ctgy_name label 
                from category c
                where c.status = 'Y'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();
        }
    

        http_response_code(200);
        echo json_encode(array("data"=>$data));  
exit;
?>