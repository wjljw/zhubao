
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:700//自动轮播周期，若为0则不自动播放，默认为0；
});

 (function() {
function log(info) {
            console.log(info);
            // alert(info);
        }
        function forceSafariPlayAudio() {
            audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
            audioEl.play(); // iOS 7/8 仅需要 play 一下
        }


        var audioEl = document.getElementById('bgmusic');
   
        window.addEventListener('ready', forceSafariPlayAudio, false);
)};
