<?php 
include_once(dirname(__FILE__, 2)."/onload.php");

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    try { 
        if($_GET["Option"] == "Type"){
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
        if($_GET["Option"] == "Unit"){
                $data = null;
                $sql = "
                select  u.unitcode value, u.unit label 
                from unit u
                where u.status = 'Y'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();
            
        }
        if($_GET["Option"] == "Product"){
                $data = null;
                $sql = "
                select  p.prod_id value, p.prod_name label 
                from product p
                where p.status = 'Y'"; 

                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();
        }
        if($_GET["Option"] == "Category"){
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