<?php
/**
 * Created by IntelliJ IDEA.
 * User: 14724
 * Date: 2019/4/29
 * Time: 19:09
 */
header('Content-type:text/json;charset=UTF-8');
$songId = $_POST['songLyric'];
$Url = 'http://music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&callback=lycjson&id=';
$songL = $Url.$songId;
$information = file_get_contents($songL);
echo $information;