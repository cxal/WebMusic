<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/2
 * Time: 23:27
 */
header('Content-type:text/json;charset=UTF-8');
$userName = $_POST['userName'];
$password = $_POST['password'];
// 创建连接
$conn = new mysqli('localhost', 'root', '', 'cxal');
mysqli_set_charset( $conn , "utf8" );
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = "INSERT INTO users (userId,password) VALUES ('{$userName}','{$password}')";
$result = $conn->query($sql);
if(! $result) {
  die('无法读取数据: ' . mysqli_error($conn));
}
echo json_encode('注册成功！请返回登陆',320);
$conn->close();