<?php 
include_once(dirname(__FILE__, 2)."/onload.php");

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    try { 
        if($_GET["Option"] == "Type"){
                //$where = !empty($_GET["w"]) ? "and pt.typecode = '$type'" : "";
                $res = null;
            
                $sql = "
                select  pt.prodty_id  value, pt.prodty_name label 
                from product_type pt
                where pt.status = 'Y'"; 

                $query = mysqli_query($conn,$sql); 
                $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
                $query->free_result();
        }
        if($_GET["Option"] == "Unit"){
                $res = null;
                $sql = "
                select  u.unitcode value, u.unit label 
                from unit u
                where u.status = 'Y'"; 

                $query = mysqli_query($conn,$sql); 
                $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
                $query->free_result();
            
        }
        if($_GET["Option"] == "Product"){
                $res = null;
                $sql = "
                select  p.prod_id value, p.prod_name label 
                from product p
                where p.status = 'Y'"; 

                $query = mysqli_query($conn,$sql); 
                $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
                $query->free_result();
        }
        if($_GET["Option"] == "Category"){
                $res = null;
                $sql = "
                select  c.ctgy_id value, c.ctgy_name label 
                from category c
                where c.status = 'Y'"; 

                $query = mysqli_query($conn,$sql); 
                $res = $query->fetch_all(MYSQLI_ASSOC); //MYSQLI_ASSOC 
                $query->free_result();
        }
    

        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        mysqli_close($conn);
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}

exit;
?>