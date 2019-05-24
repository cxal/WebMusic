$(document).ready(function () {
  var audio = $('audio');
  var songListArr = [];
  var randomPlayArr = [];
  var n = 0;
  var op = $('.order-play');
  var st = $('.single-turn');
  var rp = $('.random-play');

  //获取用户ID
  var locaUrl = location.search;
  var user_Id = locaUrl.split('=')[1];
  $('.user-id').text(user_Id);

  //user具体信息及退出
  $('.user-icon').on('click',function () {
    $('.user').toggle();
  });
  $("#exit").on("click",function(){
    sessionStorage.clear();   //清除所有session值
    window.location.href = './Login.html';
  });

  //新建歌单
  $('.yes-btn').on('click',function () {
    var listName = $('#addPlayList').val();
    if (listName != '') {
      $.ajax({
        type: "POST",
        cache: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        traditional: true,
        url: "PHP/newPlayList.php",
        data: {userId: user_Id, playlistName: listName, songID: 0},
        dataType: "json",
        success: function (data) {
          $("#newPlayListModal").modal('hide');
          myPlayList();
        },
        error: function(){
          alert('歌单已存在');
        }
      });
    }
  });

  //获取歌单信息函数
  myPlayList();
  function myPlayList() {
    $.ajax({
      type: "GET",
      cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      traditional: true,
      url: "PHP/myPlayList.php",
      data: {userId: user_Id},
      dataType: "json",
      success: function (data) {
        console.log(data);
        var myPlayList = $('#myPlayList');
        var col = $('#collectionModal').find('.modal-body');
        var res = [];
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].playListName);
          console.log(res.length);
          if (res.length == 0) {
            res.push(data[i].playListName);
          } else {
            if ($.inArray(data[i].playListName,res) == -1) {
              res.push(data[i].playListName);
            }
          }
        }
        myPlayList.empty();
        col.empty();
        for (var j = 0; j < res.length; j++) {
          var html = '<div class="clearfloat playlist-ho" style="padding: 6px 0 6px 30px;">' +
            '<img class="pull-left" src="https://p1.music.126.net/tGHU62DTszbFQ37W9qPHcg==/2002210674180197.jpg?param=30y30" alt="">' +
            '<div class="playlist-name">' + res[j] + '</div></div>';
          myPlayList.append(html);
          col.append(html);
        }
      },
      error: function(){
        alert('获取歌单失败');
      }
    });
  }

  //歌单具体信息
  $('#myPlayList').on('click','.playlist-ho',function () {
    var pName = $(this).find('.playlist-name').text();
    $('.list-name').text(pName);
    $.ajax({               //获取歌单内歌曲id
      type: "POST",
      async: false,
      cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      traditional: true,
      url: "PHP/playListSong.php",
      data: {userId: user_Id, playlist: pName},
      dataType: "json",
      success: function (data) {
        console.log(data[0][0]);
        var idArr = [];
        for (var i = 0; i < data.length; i++) {
          idArr.push(data[i][0]);
        }
        console.log(idArr);
        $.ajax({               //获取歌单内歌曲的具体信息
          type: "POST",
          async: false,
          cache: false,
          contentType: "application/x-www-form-urlencoded; charset=utf-8",
          traditional: true,
          url: "PHP/playListSongDetail.php",
          data: {'songId[]': idArr},
          dataType: "json",
          success: function (data) {
            console.log(data);
            var num = data.length + '首';
            $('.left-content').addClass('display-none');
            $('.song-list').removeClass('display-none');
            $('.song-list').find('.detail-p').text(num);
            var Tbody = $('#playListSongs').find('tbody');
            Tbody.empty();
            for (var i = 0; i < data.length; i++) {
              var songID = data[i][0][0];
              var songName = data[i][0][1];
              var singer = data[i][0][2];
              var album = data[i][0][3];
              var songTime = data[i][0][4];
              var tableContent = addTr(songID,songName,songTime,singer,album);
              Tbody.append(tableContent);
            }
          },
          error: function(){
            alert('获取歌单歌曲失败');
          }
        });
      },
      error: function(){
        alert('获取歌单失败');
      }
    });
  });

  //n+1的换算
  function nAddOne(n) {
    if (songListArr.length == 1) {
      n = 0;
    } else {
      if (n == songListArr.length - 1) {
        n = 0;
      } else {
        n++;
      }
    }
    return n;
  }
  
  //n-1的换算
  function nReduceOne(n) {
    if (songListArr.length == 1) {
      n = 0;
    } else {
      if (n == 0) {
        n = songListArr.length - 1;
      } else {
        n--;
      }
    }
    return n;
  }

  //content高度
  var windowH = $(window).height();
  $(".content").css('min-height',windowH);
  $(".left-content").css('min-height',windowH - 71);
  $(".right-content").css('min-height',windowH - 71);

  //回到首页
  $('.title').on('click',function () {
    $('.left-content').addClass('display-none');
    $('.homepage').removeClass('display-none');
  });

  //播放列表收放
  $('#list-img').on('click',function () {
    console.log(132);
    $('.list').toggle();
  });

  //首页推荐
  $.ajax({
    type: "GET",
    cache: false,
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    traditional: true,
    url: "PHP/recommend.php",
    dataType: "json",
    success: function (data) {
      for (var i = 0; i < data.length; i++){
        var id = '<div><span class="homepage-id display-none">' + data[i].id + '</span>';
        var album = '<span class="homepage-album display-none">' + data[i].album + '</span>';
        var time = '<span class="homepage-time display-none">' + data[i].songTime + '</span>';
        var img = '<img class="detailsBtn" src="' + data[i].imageUrl + '">';
        var songInfo = '<div class="text-center homepage-song-name">' + data[i].songName + '</div><div class="text-center homepage-singer">' + data[i].singer + '</div></div>';
        var con = id + album + time + img + songInfo;
        if (i <= 3) {
          $('.list-one').append(con);
        } else if (i > 3 && i <= 7) {
          $('.list-two').append(con);
        } else {
          $('.list-three').append(con);
        }
      }
    },
    error: function(){
      alert('请求超时');
    }
  });

  //回车搜索
  $(".search-input").focus(function(){
    $(document).keydown(function(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if(e.keyCode==13) {
        $('.search-button').click();
        $(".search-input").blur();
      }
    })
  });

  //调用网易云音乐接口,搜索按钮事件
  $('.search-button').on('click',function () {
    $('.left-content').addClass('display-none');
    $('.search-result').removeClass('display-none');
    var Tbody = $('#search-result').children('tbody');
    Tbody.empty();
    var searchName = $('.search-input').val();
    var mName = $.trim(searchName);

    //解决搜索字符串中首字母大写和空格问题
    if((searchName.charCodeAt(0)>=97)&&(searchName.charCodeAt(0)<=122)){
      mName = searchName.replace(searchName[0],searchName[0].toUpperCase());
    }
    if(searchName.indexOf(' ') >= 0) {
      mName = searchName.replace(/\s/g,'%20');
    }

    //得到网易云音乐接口数据;
    $.ajax({
      type: "POST",
      cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      traditional: true,
      url: "kuayu.php",
      dataType: "json",
      data:{musicName: mName},
      success: function (data) {
        //搜索结果表格
        var song = data.result.songs;
        for (var i = 0; i < song.length; i++) {
          var songID = song[i].id;               //歌曲id
          var songName = song[i].name;           //歌名
          var singerList = song[i].artists;      //歌手
          var singer = singerList[0].name;
          if (singerList.length > 1) {
            for (var j = 1; j < singerList.length; j++) {
              singer += "/" + singerList[j].name;
            }
          }
          var album = song[i].album.name;        //专辑
          var songDuration = String(song[i].duration);
          var songSecond = songDuration.substring(0,songDuration.length - 3);
          var songTime = timeToMinute(songSecond);                               //时间
          var tableContent = addTr(songID,songName,songTime,singer,album);
          Tbody.append(tableContent);
        }
      },
      error: function(){       //出错处理，一般加上，但其实传参没什么出错。
        alert('请求超时');
      }
    });
  });

  //
  function addTr(id,name,time,singer,album) {
    var columnOne = "<tr><td><span class='playBtn'></span></td>";
    var columnSongID = "<td class='display-none'>" + id + "</td>";
    var columnSongName = "<td class='search-song-name'>" + name + "";
    var columnSongTime = "<td class='search-song-time'>" + time + "</td>";
    var columnSinger = "<td class='search-singer'>" + singer + "</td>";
    var columnAlbum = "<td class='search-album'>" + album + "</td></tr>";
    var tableContent = columnOne + columnSongID + columnSongName + columnSongTime + columnSinger + columnAlbum;
    return tableContent;
  }

  //  播放/暂停切换
  audio.on('play',function () {
    $('.broadcast').on('click',function () {
      if ($(this).attr('id') == 'playAudio') {
        $(this).attr('id','stop');
        audio[0].play();
      } else {
        $(this).attr('id','playAudio');
        audio[0].pause();
      }
    });
  });

  //收藏
  $('#collectionModal').on('click','.playlist-ho',function () {
    var listName = $(this).find('.playlist-name').text();
    var id = $('.song-details').find('.detail-id').text();
    var name = $('.song-details').find('.info-song-name').text();
    var singer = $('.song-details').find('.detail-singer').text();
    var album = $('.song-details').find('.detail-album').text();
    var time = $('.song-details').find('.detail-time').text();
    $.ajax({
      type: "POST",
      cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      traditional: true,
      url: "PHP/collect.php",
      data: {userId: user_Id, playListName: listName, songId: id, songName: name, singer: singer, songAlbum: album, songTime: time},
      dataType: "json",
      success: function (data) {
        console.log(data);
        if (data == '歌单中已有此歌') {
          $('.tips').text(data);
        } else {
          $("#collectionModal").modal('hide');
        }
      },
      error: function(){
        alert('加入歌单失败');
      }
    });
    console.log(id,name,singer,album,time);
  });

  // 秒转换分钟00:00:00格式
  function timeToMinute(times){
    var hours,minute,seconds;
    if(times >= 3600) {
      hours = (times - times % 3600) / 3600;
      minute = ((times % 3600) - (times % 3600)%60) / 60;
      seconds = (times % 3600) % 60;
      if (seconds == 0) {
        seconds = '0'
      }
    } else if(times < 3600 && times >= 60){
      hours = '';
      minute = (times - times % 60) / 60;
      seconds = times % 60;
      if (seconds == 0) {
        seconds = '0'
      }
    } else if(times > 0) {
      hours = '';
      minute = '0';
      seconds = times;
    } else {
      hours = '';
      minute = '0';
      seconds = '0';
    }
    if(Number(hours) < 10 && hours != ''){
        hours = "0" + hours;
    }
    if(Number(minute) < 10 && minute != ''){
      minute = "0" + minute;
    }
    if(Number(seconds) < 10 && seconds != ''){
      seconds = "0" + seconds;
    }
    var arr = [hours,minute,seconds];
    if (hours == '') {
      arr = [minute,seconds];
    }
    var result = arr.join(':');
    return result;
  }

  //搜索列表,歌单列表点击播放
  $('#search-result').on('click','.playBtn',tablePlay);
  $('#playListSongs').on('click','.playBtn',tablePlay);

  //搜索列表,歌单列表点击播放函数
  function tablePlay() {
    var parent = $(this).parent().parent();
    var id = parent.children('.display-none').text();
    var name = parent.children('.search-song-name').text();
    var singer = parent.children('.search-singer').text();
    var time = parent.children('.search-song-time').text();
    addToList(id,name,singer,time);
    songListArr.unshift(id);
    playMusic(0,name,singer,time);
  }

  //详情页点击播放
  $('#detail-play').on('click',function () {
    var parent = $(this).parent().parent();
    var id = parent.find('.detail-id').text();
    var name = parent.find('.info-song-name').text();
    var singer = parent.find('.detail-singer').text();
    var time = parent.find('.detail-time').text();
    addToList(id,name,singer,time);
    songListArr.unshift(id);
    playMusic(0,name,singer,time);
    console.log(songListArr);
    console.log(randomPlayArr);
  });

  //播放歌单
  $('#playList-play').on('click',function () {
    $('.footer-list').empty();
    var newArr = [];
    songListArr.splice(0,songListArr.length);
    var tbody = $('#playListSongs').find('tbody');
    var tr = tbody.children('tr');
    var tdId = tr.find('.display-none');
    var tdName = tr.find('.search-song-name');
    var tdSinger = tr.find('.search-singer');
    var tdTime = tr.find('.search-song-time');
    var song,name,singer,songTime;
    for (var i = tr.length - 1; i >= 0; i--) {
      song = tdId[i].innerHTML;
      name = tdName[i].innerHTML;
      singer = tdSinger[i].innerHTML;
      songTime = tdTime[i].innerHTML;
      newArr.unshift(song);
      addToList(song,name,singer,songTime);
    }
    songListArr = newArr;
    playMusic(0,tdName[0].innerHTML,tdSinger[0].innerHTML,tdTime[0].innerHTML);
  });

  //加入列表函数
  function addToList(id,songName,singer,time) {
    var name = '<div class="list-info"><span class="list-info-span list-info-name">' + songName;
    var Lsinger = '</span><span class="list-info-span list-info-singer">' + singer;
    var songTime = '</span><span class="list-info-span list-info-time">' + time + '</span></div>';
    var ht = name + Lsinger + songTime;
    if ($.inArray(id,songListArr) == -1) {
      $('.footer-list').prepend(ht);
    } else {
      var num = $.inArray(id,songListArr);
      var html = '<div class="list-info">' + $('.list-info').eq(num).html() + '</div>';
      songListArr.splice(num,1);
      $('.list-info').eq(num).remove();
      $('.footer-list').prepend(html);
    }
  }

  //播放函数
  function playMusic(songNum,songName,singer,time){
    var songId = songListArr[songNum];
    var songUrl = 'http://music.163.com/song/media/outer/url?id=' + songId + '.mp3';
    audio.attr('src', songUrl);
    $('.footer-name').text(songName);
    $('.footer-singer').text(singer);
    $('.all-time').text(time);
    randomPlayArr.unshift(songId);
    audio[0].play();
    $('.broadcast').attr('id','stop');
  }

  //循环播放，单曲循环，随机播放控制
  orderPlay();
  $('.play-control-img').on('click',function () {
    if (! op.hasClass('display-none')) {
      op.addClass('display-none');
      st.removeClass('display-none');
      audio.attr('loop','loop');
    } else if (! st.hasClass('display-none')) {
      st.addClass('display-none');
      rp.removeClass('display-none');
      audio.removeAttr('loop');
      randomPlay();
    } else {
      rp.addClass('display-none');
      op.removeClass('display-none');
      orderPlay();
    }
  });

  //顺序播放函数
  function orderPlay() {
    if (! rp.hasClass('display-none')) {
      return;
    }
    audio[0].addEventListener('ended',function () {
      n = nAddOne(n);
      footerText(n);
    });
    //顺序播放下一曲
    $('#next-one').on('click',function () {
      var url = audio.attr('src');
      var Id = url.substr(45,url.length - 49);
      var number = $.inArray(Id,songListArr);
      var num = nAddOne(number);
      footerText(num);
    });
    //顺序播放上一曲
    $('#last-one').on('click',function () {
      var url = audio.attr('src');
      var Id = url.substr(45,url.length - 49);
      var number = $.inArray(Id,songListArr);
      var num = nReduceOne(number);
      footerText(num);
    });
  }


  //随机播放函数
  function randomPlay() {
    if (! op.hasClass('display-none')) {
      return;
    }
    audio[0].addEventListener('ended',function () {
      n = Math.floor(Math.random() * songListArr.length);
      footerText(n);
    });
    //随机播放下一曲
    $('#next-one').on('click',function () {
      n = Math.floor(Math.random() * songListArr.length);
      footerText(n);
    });
    //随机播放上一曲
    $('#last-one').on('click',function () {
      var lastId = randomPlayArr[2];
      var m = $.inArray(lastId,songListArr);
      console.log(m);
      footerText(m);
      randomPlayArr.splice(0,3);
    });
  }

  //随机、顺序播放共用函数
  function footerText(num){
    var parent = $('.list-info').eq(num);
    var name = parent.find('.list-info-name').text();
    var singer = parent.find('.list-info-singer').text();
    var time = parent.find('.list-info-time').text();
    playMusic(num, name, singer, time);
  }

  //首页跳转歌曲详情页
  $('.recommend-song').on('click','.detailsBtn', function () {
    var parent = $(this).parent();
    var id = parent.find('.homepage-id').text();
    var songTime = parent.find('.homepage-time').text();
    var album = parent.find('.homepage-album').text();
    var img = $(this).attr('src');
    var url = img.substring(0,img.length - 7);
    var imgUrl = url + '135y135';
    var songName = parent.find('.homepage-song-name').text();
    var singer = parent.find('.homepage-singer').text();
    musicDetail(id,songName,singer,album,imgUrl,songTime);
  });

  //搜索页,歌单详情页跳转详情页
  $('#search-result').on('click','.search-song-name',detail);
  $('#playListSongs').on('click','.search-song-name',detail);

  //搜索页,歌单详情页跳转详情页函数
  function detail() {
    var parent = $(this).parent();
    var id = parent.find('.display-none').text();
    var album = parent.find('.search-album').text();
    var imgUrl = 'http://p1.music.126.net/TAPMPHiK6TOl6myWB2H33A==/109951162904167763.jpg?param=135y135';
    var songName = parent.find('.search-song-name').text();
    var singer = parent.find('.search-singer').text();
    var songTime = parent.find('.search-song-time').text();
    musicDetail(id,songName,singer,album,imgUrl,songTime);
  }

  //跳转详情页函数
  function musicDetail(id,name,singer,album,imgUrl,Time) {
    $('.left-content').addClass('display-none');
    $('.song-details').removeClass('display-none');
    $('.detail-id').text(id);
    $('.detail-time').text(Time);
    $('.info-song-name').text(name);
    $('.detail-singer').text(singer);
    $('.detail-album').text(album);
    $('.img-1').attr('src',imgUrl);
    Lyric (id);
  }
  
  //获取歌词
  function Lyric (key) {
    $.ajax({
      type: "POST",
      cache: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      traditional: true,
      url: "PHP/lyric.php",
      dataType: "json",
      data:{songLyric: key},
      success: function (data) {
        var Lrc = data.lrc.lyric;
        var res = Lrc.replace(/\n/g,'<br>');
        var ly = res.replace(/\[.*?\]/g,'');
        var result = ly.replace(/^(<br[^>]*>)+|(<br[^>]*>)+$/g,'');
        $('#lyric').html(result);
      },
      error: function(){
        alert('歌词获取失败，请重试');
      }
    });
  }

  //歌词展开
  $('.lyric-open').on('click',function () {
    var lrc = $('#lyric');
    if (lrc.hasClass('lyric-auto')) {
      lrc.removeClass('lyric-auto');
      $('.lyric-open').text('收起');
    } else {
      lrc.addClass('lyric-auto');
      $('.lyric-open').text('展开');
    }
  });
  
  //进度条
  $('#audio').on("loadedmetadata",function (){
    audio[0].addEventListener('timeupdate',updateProgress,false);
  });

  function updateProgress() {
    var value = (audio[0].currentTime / audio[0].duration) * 100;//当前时间/总长 再乘以一个100变成百分数
    $('.cur').css('width', value + '%');
    var curTime = Math.floor(audio[0].currentTime);
    $('.now-time').text(timeToMinute(curTime));
    if(!audio[0].paused) {
      //进度条点击
      $('.click-div ').on('mousedown',function (event) {
        var location = event.offsetX;                  //获取鼠标相对于进度条的X坐标
        var curW = (location / 493) * 100;
        $('.cur').css('width', curW + '%');
        audio[0].currentTime = (location / 493) * audio[0].duration;
      });
    }
  }
});