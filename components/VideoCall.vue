<template>
  <div id="mainFrame">
    <video id="localVideo" ref="localVideo" autoplay muted>LocalVideo</video>
    <video id="remoteVideo" ref="remoteVideo" autoplay>RemoteVideo</video>
    <div class="bottom-bar d-flex justify-center">
      <v-btn class="mx-2" fab @click="offCamera()">
        <v-icon dark>
          mdi-camera
        </v-icon>
      </v-btn>
      <v-btn class="mx-2" fab>
        <v-icon dark>
          mdi-microphone
        </v-icon>
      </v-btn>
    </div>
    <div class="control-bar">
      <div class="left-bar">
        <div class="text-center participant" data-toggle="modal" data-target="#participant-modal">
          <v-icon>mdi-account-plus</v-icon>
          <p>Add Parti..</p>
        </div>
        <div class="text-center zoomin" @click="zoomIn()">
          <v-icon>mdi-magnify-plus</v-icon>
          <p>Zoom In</p>
        </div>
        <div class="text-center zoomout" @click="zoomOut()">
          <v-icon>mdi-magnify-minus</v-icon>
          <p>Zoom Out</p>
        </div>
      </div>
      <div class="center-bar">
        <div class="center-icons">
          <v-icon v-if="isShowAudio" class="audio" @click="enableAudio()">mdi-microphone</v-icon>
          <v-icon v-if="!isShowAudio" class="audio" @click="disableAudio()">mdi-microphone-off</v-icon>
          <v-icon v-if="isShowVideo" class="video" @click="enableVideo()">mdi-video</v-icon>
          <v-icon v-if="!isShowVideo" class="video" @click="disableVideo()">mdi-video-off</v-icon>
          <v-icon class="phone">mdi-phone</v-icon>
        </div>
      </div>
      <div class="right-bar">
        <div id="start_record" class="text-center record" @click="record()">
          <v-icon>mdi-album</v-icon>
          <p>Record</p>
        </div>
        <div class="text-center share_screen">
          <v-icon>mdi-share</v-icon>
          <p>Screen Share</p>
        </div>
        <div class="text-center">
          <v-icon>mdi-dots-horizontal</v-icon>
          <p>More</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
const servers = {
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  },
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

export default {
  data () {
    return {
      room: this.$route.params.id,
      transform: 1,
      isShowAudio: true,
      isShowVideo: true,
    }
  },
  async beforeMount () {
    const lastId = localStorage.getItem('lastId')
    if (lastId) {
      await this.$socket.emit('leave', this.room)
    }
    await this.$socket.emit('join', lastId)
    localStorage.setItem('lastId', this.room)
  },
  async mounted () {
    const localPC = new RTCPeerConnection(servers)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

    this.$refs.localVideo.srcObject = stream
    this.$store.commit('setting/setCamera', {
      camera: stream
    })

    stream.getTracks().forEach((track) => {
      localPC.addTrack(track, stream)
    })

    const offer = await localPC.createOffer()
    await localPC.setLocalDescription(offer)
    await this.$socket.emit('message', JSON.stringify({
      room: this.room,
      data: localPC.localDescription
    }))

    localPC.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.$socket.emit('message', JSON.stringify({
          room: this.room,
          data: event.candidate
        }))
      } else {
        // eslint-disable-next-line
        console.log('allhasbeensent')
      }
    }

    localPC.ontrack = (event) => {
      if (event.streams[0]) {
        this.$refs.remoteVideo.srcObject = event.streams[0]
      }
    }

    this.$socket.on('message', async (data) => {
      if (data.type === 'offer') {
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
        const answer = await localPC.createAnswer()
        await localPC.setLocalDescription(answer)
        await this.$socket.emit('message', JSON.stringify({
          room: this.room,
          data: localPC.localDescription
        }))
      } else if (data.type === 'answer') {
        await localPC.setRemoteDescription(new RTCSessionDescription(data))
      } else {
        await localPC.addIceCandidate(new RTCIceCandidate(data))
      }
    })
  },
  async beforeDestroy () {
    await this.$socket.emit('leave', this.room)
  },
  methods: {
    zoomIn(){
      this.transform += 0.1;
      const scale = "scale(" + this.transform + ")";
      $("#remoteVideo").css("transform", scale);
    },
    zoomOut(){
      if(this.transform > 1){
        this.transform -= 0.1;
        const scale = "scale(" + this.transform + ")";
        $("#remoteVideo").css("transform", scale);
      }
    },
    record(){
      
    },
    enableAudio(){

    },
    disableAudio(){

    },
    enableVideo(){
      this.$store.state.setting.camera.getVideoTracks().forEach((track) => {
        track.enabled = false
      })
      this.isShowVideo = false;
    },
    disableVideo(){
      this.$store.state.setting.camera.getVideoTracks().forEach((track) => {
        track.enabled = true
      })
      this.isShowVideo = true;
    }
  }
}
</script>

<style lang="scss">
  #mainFrame {
    position: relative;
    min-height: calc(100vh - 100px);
    overflow: hidden;
    #localVideo {
      z-index: 100;
      position: absolute;
      right: 25px;
      bottom: 100px;
      background-color: #47494e;
      height: 150px;
      width: 200px;
    }

    #remoteVideo {
      z-index: 50;
      min-height: calc(100vh - 100px);
      width: 100%;
      object-fit: cover;
      background-color: #7f828b;
    }

    .bottom-bar {
      position: absolute;
      bottom: 25px;
      width: 100vw;
      text-align: center;
    }

    .control-bar{
      width: 100%;
      height: 80px;
      background: #221f1f;
      position: absolute;
      bottom: 0;
      z-index: 99999;
      text-align: center;
      padding: 20px;
      i, button{
        color: #fff;
        font-size: 20px;
        margin: 0 20px;
        cursor: pointer;
      }
      div{
        display: inline-block;
      }
      p{
        margin: 0;
        color: #fff;
        font-size: 12px;
      }
      .left-bar{
        float: left;
      }
      .right-bar{
        float: right;
      }
    }

    .center-bar{
      .center-icons{
        display: flex;
        justify-content: center;
        i, button{
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: none;
          color: #fff;
          &.audio{
            background-color: dodgerblue;
          }
          &.video{
            background-color: #9100ff;
            font-size: 18px;
          }
          &.phone{
            background-color: red;
            transform: rotate(135deg);
          }
        }
      }
    }
  }
</style>