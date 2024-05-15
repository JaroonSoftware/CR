<?php 
include_once(dirname(__FILE__, 2)."/onload.php");

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    try { 
        if($_GET["Option"] == "Product"){
                $data = null;
                $sql = "
                select  p.prod_id value,CONCAT(p.prod_code, ' : ', p.prod_name)as label 
                from product p Inner Join stock s on p.prod_code = s.prod_code
                where p.status = 'Y'"; 

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