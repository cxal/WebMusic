<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/5/3
 * Time: 23:52
 */
header('Content-type:text/json;charset=UTF-8');
$userId = $_POST['userId'];
$name = $_POST['playlistName'];
$songId = $_POST['songID'];
// 创建连接
$conn = new mysqli('localhost', 'root', '89259583cx', 'cxal');
// Check connection
if ($conn->connect_error) {
  die("连接失败: " . $conn->connect_error);
}
$sql = "INSERT INTO userplaylist (userId,playListName,songId) VALUES ('{$userId}','{$name}','{$songId}')";
$result = $conn->query($sql);
if(! $result) {
  die('无法读取数据: ' . mysqli_error($conn));
}
echo json_encode('新建成功',320);
$conn->close();