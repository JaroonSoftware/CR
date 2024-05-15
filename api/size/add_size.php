<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT size_name FROM size WHERE size_name = '".$_POST["Addsizename"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        //http_response_code(400);
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
       
    }else{
    $strSQL = "INSERT INTO size (`size_name`, `status`,`c_by`) ";
    $strSQL .= " VALUES ('".$_POST["Addsizename"]."','Y','".$action_by."' ";
    $strSQL .= ")";	
    //echo $strSQL;
	$stmt = $conn->prepare($strSQL); 
    
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array('status' => '1','message'=> $_POST["Addsizename"]));
        }
        else
        {
            echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
        }
    }
?>