const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playList');

const volumeBtn = $('.volume-btn');
const volumeChange =$('#controls_lever_range');



const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs:[
        {
           name: 'Nevada',
           singer: 'Vicetone',
           path: './assets/music/Nevada.mp3',
           image: './assets/img/nevada.jpg'
    },
        {
           name: 'Fade',
           singer: 'Alan Walker',
           path: './assets/music/Fade.mp3',
           image: './assets/img/fade.jpg'
    },
        {
           name: 'All Falls Down',
           singer: 'Alan Walker',
           path: './assets/music/AllFallsDown.mp3',
           image: './assets/img/allfallsdown.jpg'
    },
        {
           name: 'Là Anh',
           singer: 'Phạm Lịch (cover)',
           path: './assets/music/LàAnh.mp3',
           image: './assets/img/laanh.jpg'
    },
        {
           name: 'Nổi gió rồi',
           singer: 'Châu Thâm',
           path: './assets/music/NổiGióRồi.mp3',
           image: './assets/img/noigioroi.jpg'
    },
        {
           name: 'Spectre',
           singer: 'Alan Walker',
           path: './assets/music/Spectre.mp3',
           image: './assets/img/spectre.jpg'
    },
        {
           name: 'Thiếu Niên',
           singer: 'Mộng Nhiên',
           path: './assets/music/ThiếuNiên.mp3',
           image: './assets/img/thieunien.jpg'
    },
        {
           name: 'Thời không sai lệch',
           singer: 'Ngải Thần',
           path: './assets/music/ThờiKhôngSaiLệch.mp3',
           image: './assets/img/thoikhongsailech.jpg'
    },
        {
           name: 'Titanium',
           singer: 'David Guetta',
           path: './assets/music/Titanium.mp3',
           image: './assets/img/titannium.jpg'
    },
        {
           name: 'Wake me up ',
           singer: 'Avicii',
           path: './assets/music/WakeMeUp.mp3',
           image: './assets/img/wakemeup.jpg'
    },
    ],

        setConfig:function (key, value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        defineProperties: function(){
            Object.defineProperty(this, 'currentSong',{
                get: function(){
                    return this.songs[this.currentIndex];
                }
            });
        },
        render: function(){
            const htmls = this.songs.map((song, index) => {
              return `
                <div class="song ${index === this.currentIndex ?'active' : ''}" data-index = ${index}>
                    <div class="thumb" 
                        style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
              `
            });
            playlist.innerHTML = htmls.join('');
            
        },
        handleEvents: function(){
            const _this = this;
            const cdWidth = cd.offsetWidth;

            // Xu li cd quay/ dung
            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)'}
            ], {
                duration: 10000,
                iterations: Infinity
            })
             cdThumbAnimate.pause()

            // Xử lí phóng to, thu nhỏ
            document.onscroll = function(){
               const scrollTop = 
                        window.scrollY || document.documentElement.scrollTop;
               const newCdWidth = cdWidth - scrollTop;

               cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0 ;
               cd.style.opacity = newCdWidth / cdWidth;
            }

            // Xử lí khi click play 
            playBtn.onclick = function () {
                if(_this.isPlaying){
                    audio.pause();
                }else{
                    audio.play();
                }
            }

            //  Khi bai hat duoc play
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            //  Khi bai hat duoc pause
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            // khi tien do bai hat thay doi
            audio.ontimeupdate = function(){
                if(audio.duration){
                   const progressPercent = Math.floor(audio.currentTime/audio.duration*100);
                    progress.value = progressPercent;
                }
            //   console.log((audio.currentTime/audio.duration)*100);

            }

            //  Xu li khi tua song (thay oninput bang onchange)
            progress.oninput = function (e){
                const seekTime = audio.duration*e.target.value/100;
                audio.currentTime = seekTime;
            }

            // Khi next bai hat
            nextBtn.onclick = function (){
                if(_this.isRandom){
                    _this.playRandomSong;
                }else{
                    _this.nextSong()
                }
                _this.nextSong()
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            prevBtn.onclick = function (){
                if(_this.isRandom){
                    _this.playRandomSong;
                }else{
                    _this.prevSong()
                }
                _this.prevSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            // Bai hat duoc random, Xu li random
            randomBtn.onclick = function (e) {
                _this.isRandom = !_this.isRandom;
                _this.setConfig('isRandom', _this.isRandom);
                randomBtn.classList.toggle('active', _this.isRandom);
            }

            // Xu li lap lai 1 bai hat
            repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat); 
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }

            // Xu li next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play()
                }else{
                    nextBtn.click();
                }
            }

            // lang nghe hanh vi click vao playlist
            playlist.onclick = function (e) {
                const songNode = e.target.closest('.song:not(.active)');
                if(songNode || !e.target.closest('.option')){
                    
                    // Xu li khi click vao song
                    if(songNode){
                       _this.currentIndex = Number(songNode.dataset.index);
                       _this.loadCurrentSong();
                       _this.render();
                       audio.play();
                    }
                    // Xu li khi click vao song option
                    if(!e.target.closest('.option')){

                    }

                }
            };

              // Xử lý tiến độ bài hát thay đổi 
            audio.ontimeupdate = function() {
                
                const sogCurrenTime = $('.current-time');
                const sogDuration = $('.max-duration');
    
            if (audio.duration) {
              const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
              progress.value = progressPercent
  
              // Xử lý tính thời gian của bài hát
                // Time Start
              var e = Math.floor(audio.currentTime) ; // thời gian hiện tại bài hát đang chạy
                      var d = e%60; // số giây
                      var b =  Math.floor(e/60); // số phút
                      if(d < 10){
                         var c = 0; // số chục giây
                      }else{
                          c = "";
                      }
                      sogCurrenTime.textContent = '0' + b +  ":" + c + d;
                // Time Count
                      var ee = Math.floor( audio.duration) ; // Tổng số thời gian bài hát
                      var dd = ee%60; //số giây
                      var bb =  Math.floor(ee/60); //số phút
                      if(dd < 10){
                         var cc = 0; // số chục giây
                      }else{
                          cc = "";
                      }
  
                      sogDuration.textContent =  '0' + bb +  ":" + cc + dd;
            }
          };

           // xử lý âm thanh bài hát 
            volumeChange.oninput = function(e){
            audio.volume = e.target.value/100;
          }
          // Mute & UnMute
            volumeBtn.addEventListener("click", function(){
                if(audio.muted) {
                    audio.muted = false;
                    volumeBtn.classList.remove('active', audio.muted);
                    volumeChange.classList.remove('active', audio.muted);
                } else {
                    audio.muted = true;
                    volumeBtn.classList.add('active', !audio.muted)
                    volumeChange.classList.add('active', audio.muted)
                }
            }, false);

            
        },
        scrollToActiveSong: function(){
            setTimeout(() => {
                // scrollIntoView
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }, 300);
        },
        loadConfig: function (){
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat

            // Object.assign(this, this.config)
        },
        loadCurrentSong: function () {
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
            // console.log(heading, cdThumb, audio)
        },
        nextSong: function(){
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        prevSong: function(){
            this.currentIndex--;
            if(this.currentIndex <= 0){
                this.currentIndex = this.songs.length-1 ;
            }
            this.loadCurrentSong();
        },
        playRandomSong: function(){
            let newIndex = this.currentIndex;
            do{
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while(newIndex === this.currentIndex)

            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },
     

        start: function (){
            // Gan cau hinh tu config vao object app
            this.loadConfig();
            //  Dinh nghia cac thuoc tinh cho object
            this.defineProperties();
            // Lang nghe va xu li cac su kien(dom event)
            this.handleEvents()

            // Tai thong tin bai hat dau tien vao ui khi chay ung dung
            this.loadCurrentSong();

            // render playlist
            this.render();

            // Hien thi trang thai ban dau cua button repeat & random
            repeatBtn.classList.toggle('active', this.isRepeat);
            randomBtn.classList.toggle('active', this.isRandom);
        }

}

app.start()

