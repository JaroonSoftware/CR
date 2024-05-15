<?php
    include_once(dirname(__FILE__, 2)."/onload.php");
    $action_by = $token->userid;

    $StrSql_CheckDup = "SELECT ctgy_name FROM category WHERE ctgy_name = '".$_POST["Addcategoryname"]."'";
    $check = $conn->prepare($StrSql_CheckDup);
    $check->execute();
    $existing = $check->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        echo json_encode(array('status' => '0','message'=> 'Data duplicate!'));
    }else{
        //pic logo
        $uid= "";
        $name= "";
        $Filename= "";
        foreach ($_POST['ctgy_img'] as $index => $object) {
            if ($object['status'] == 'done') {
                $uid = $object['uid'];
                $name = $object['name'];
                $Filename = $object['uid'] . '_' . basename($object['name']);
            }
        }
        //
        $strSQL = "INSERT INTO category (`ctgy_name`,`status`,`c_by`,`img_uid`,`img_name`,`img_filename`) ";
        //  ,`s_date`,`s_time`, s_user) ";
        $strSQL .= " VALUES ('".$_POST["Addcategoryname"]."','Y','".$action_by."','".$uid."','".$name."','".$Filename."' ";
        $strSQL .= ")";	
        //echo $strSQL;
        $stmt = $conn->prepare($strSQL);  
        
            if ($stmt->execute()) {
                http_response_code(200);
                //echo json_encode(array("data"=> array("name" => $_POST["Addcategoryname"])));
                echo json_encode(array('status' => '1','message'=> $_POST["Addcategoryname"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error insert data!'));
            }
    }
?>