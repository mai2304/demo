//1.render songs
//2.scroll top
//3.play/pause/seek/play
//4.CD rotate lam cho dia quay
//5.next / prev 
//6.random
//7.next/ repeat when ended
//8.active song
//9.scroll active song into view
//10.play song when click
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const pauseBtn = $('.btn-toggle-pause')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isSeekTime: true,
  songs: [
      {
        name: "On The Ground",
        singer: "Rose",
        path: "./mp3/song1.mp3",
        image: "./img/img1.jpg"
      },
      {
        name: "Lạnh Lẽo",
        singer: "Fortnite",
        path: "./mp3/song2.mp3",
        image: "./img/img2.jpg"
      },
      {
        name: "Trốn Tìm",
        singer: "Đen Vâu",
        path: "./mp3/song3.mp3",
        image: "./img/img3.jpg"
      },
      {
        name: "Hơn Cả Yêu",
        singer: "Đức Phúc",
        path: "./mp3/song4.mp3",
        image: "./img/img4.jpg"
      },
      {
        name: "Hết Thương Cạn Nhớ",
        singer: "Đức Phúc",
        path: "./mp3/song5.mp3",
        image:"./img/img5.jpg"
      },
      {
        name: "Gương Mặt Lạ Lẫm",
        singer: "Mr Siro",
        path:"./mp3/song6.mp3",
        image: "./img/img6.jpg"
      },
      {
        name: "Tình Yêu Chắp Vá",
        singer: "Mr Siro",
        path: "./mp3/song7.mp3",
        image:"./img/img7.jpg"
      },
      {
        name: "Koisuru Shippo A Tail In Love",
        singer: "Aoi Tes",
        path: "./mp3/song8.mp3",
        image:"./img/img8.jpg"
      },
      {
        name: "Dưới Cơn Mưa",
        singer: "Mr Siro",
        path:"./mp3/song9.mp3",
        image:"./img/img9.jpg"
      }
    ],
    render: function(){
      const htmls = this.songs.map((song,index)=> {
        return `
          <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}" >
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
      })
      playlist.innerHTML = htmls.join('')

    },
    defineProperties: function(){
      Object.defineProperty(this, 'currentSong',{
        get: function(){
          return this.songs[this.currentIndex]
        }
      })
    },
    handleElement: function(){
      // xu ly phong to thu nho cd
      const cdWidth = cd.offsetWidth
      document.onscroll = function(){
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop
        cd.style.width = newCdWidth > 0? newCdWidth + 'px':0
        cd.style.opacity = newCdWidth / cdWidth
      },

      // xu ly khi kick play va pause
      
      playBtn.onclick = function(){
        if(app.isPlaying){
          audio.pause()
        }else{
          audio.play()
        }
      },
      //xu ly khi song dc play
      audio.onplay = function(){
        app.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      },

      //xu ly khi song bi pause
      audio.onpause = function(){
        app.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      },
      //khi tien do bai hat thay doi
      audio.ontimeupdate = function(){
        if(app.isSeekTime){
        if(audio.duration){
          const progressPercents = Math.floor(audio.currentTime/audio.duration * 100)
          progress.value = progressPercents
        }
      }
      }
      audio.onmousedown = function(){
        app.isSeekTime = false
      }
      audio.onmouseup = function(){
        app.isSeekTime = true
      }
      //xu ly khi tua song
      progress.onchange = function(e){
          setTimeout(function(){
              const seekTime = audio.duration / 100 * e.target.value
              audio.currentTime = seekTime
          },3000)
      }

      //xu ly cd quay va dung
      const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ],{
        duration:10000,
        iterations: Infinity
      })
      cdThumbAnimate.pause()

      // xu ly khi next bai
      nextBtn.onclick=function(){
        if(app.isRandom){
          app.playRandomSong()
        }else{
          app.nextSong()
        }
        audio.play()
        app.render()
        app.scrollToActivesong()
      }

      // xu ly khi next prev
      prevBtn.onclick=function(){
        if(app.isRandom){
          app.playRandomSong()
        }
        else{
          app.prevSong()
        }
        audio.play()
        app.render()
        app.scrollToActivesong()
      }

      // xu ly khi random xong
      randomBtn.onclick = function(){
        app.isRandom = !app.isRandom
        randomBtn.classList.toggle('active',app.isRandom)
      }

      //xu ly khi kick vao nut repeat 
      repeatBtn.onclick = function(){
        app.isRepeat = !app.isRepeat
        repeatBtn.classList.toggle('active',app.isRepeat)
      }

      // xu ly next bai hay khi end
      audio.onended = function(){
        if(app.isRepeat){
          audio.play()
        } else{
        nextBtn.click()
        }
      }

      //click vao playlist thi active
      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)') 
        if(songNode || e.target.closest('.option')){
          //xu ly khi click vao song
          if(songNode) {
            app.currentIndex = Number(songNode.dataset.index)
            app.loadCurrentSong()
            app.render()
            audio.play()
          }
          //xu ly khi cick vao song option
          if(e.target.closest('.option')){

          }
        }
      }
      
    },
    scrollToActivesong: function(){
      // document.documentElement.scrollTop = 20 + 'px';

      // {setTimeout(() => {
      //   $('.song.active').scrollIntoView({
      //     behavior:'smooth',
      //     block:'nearest'
      //   })
      // },300)}
     
        setTimeout(() => {
          if (this.currentIndex <= 3) {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          } else {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 300);
      
    
      
    },

    loadCurrentSong: function(){
       heading.textContent = this.currentSong.name
       cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
       audio.src = this.currentSong.path
    },
    
    nextSong: function(){
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
  
    prevSong: function(){
      this.currentIndex--
      if(this.currentIndex <0 ){
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },
    playRandomSong: function(){
      let newIndex
      do{
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while (newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    
    start: function(){
      //dinh nghia cac thuoc tinh cho object
      this.defineProperties()

      //lang nghi va su ly cac su kien
      this.handleElement()

      //tai thong tin bai hat dau tien vao ui khi chay ung dung
      this.loadCurrentSong()
      
      //render playlist
      this.render()

      //add item dang active vao scroll
      this.scrollToActivesong()
    }
  }
app.start()
    