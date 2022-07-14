<template>
  <div id="mainFrame" :class="start ? '' : 'startFrame'">
    <div v-for="p in peers" :key="p.peerId">
      <video
        :id="p.peerId"
        ref="remoteVideo"
        class="remoteVideo"
        :peerId="p.peerId"
        :srcObject.prop="p.stream"
        autoplay
        playsinline
      ></video>
    </div>
    <video
      ref="localVideo"
      class="localVideo"      
      :srcObject.prop="localStream"
      autoplay
      muted
    ></video>

    <div class="control-bar" :class="start ? '' : 'startFrame'">
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
          <v-icon v-if="role == 'professional'" class="phone" @click="endVideo()">mdi-phone</v-icon>
        </div>
      </div>
      <div class="right-bar">
        <!-- <div id="start_record" class="text-center record" @click="record()">
          <v-icon>mdi-album</v-icon>
          <p>Record</p>
        </div> -->
        <div class="text-center share_screen" @click="share()">
          <v-icon>mdi-share</v-icon>
          <p>Screen Share</p>
        </div>
        <div class="text-center">
          <v-icon>mdi-dots-horizontal</v-icon>
          <p>More</p>
        </div>
      </div>
    </div>
    <!-- Participants modal -->
    <v-dialog persistent max-width="320px">
      <v-card>
        <v-card-title> Add to Call </v-card-title>
        <v-card-text>
          <input type="text" class="userid form-control" placeholder="User ID">
          <ul class="participants"></ul>
        </v-card-text>
        <v-card-actions>
          <button id="add-participant" class="btn btn-info" type="button">Add</button>
          <button id="close-participant" class="btn btn-danger" type="button" data-dismiss="modal">Close</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import $ from 'jquery';
import Peer from "skyway-js";

export default {
  props: {
    role: {
      type: String,
      default: 'professional'
    },
    start: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      transform: 1,
      isShowAudio: true,
      isShowVideo: true,
      localStream: null,
      peerId: "",
      inputId: "",
      peer: null,
      room: null,
      peers: [],
      videoStream: null
    }
  },
  mounted () {
    this.peer = new Peer({
      key: "744f5ca5-2168-4721-ac0d-9155af0ce003",
      debug: 3,
    });
    this.videoStream = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    this.peer.on("open", (peerId) => {
      this.peerId = peerId;
      this.videoStream.then((stream) => {
        this.localStream = stream;
        this.$store.commit('setting/setCamera', {
          camera: stream
        })
        this.$store.commit('setting/setAudio', {
          audio: stream
        })
      })
      .then(this.joinRoom)
      .catch((err) => {
        console.log(err)
      });
    });
  },
  methods: {
    join(joinroom){
      this.videoStream.then((stream) => {
        this.localStream = stream;
      })
      .then(this.joinRoom(joinroom))
      .catch((err) => {
        console.log(err)
      });
    },
    joinRoom(id) {
      const peer = this.peer;
      if (this.room) {
        this.room.on("stream", async (stream) => {
        this.peers = this.peers.filter((p) => p.peerId !== stream.peerId);
          await this.peers.push({ peerId: stream.peerId, stream });
        });
        this.peers.forEach((peer) => {
          peer.stream.getTracks().forEach((track) => {
            console.log(track)
            track.enabled = true
          })
        })
        return;
      }
      this.room = peer.joinRoom(id, {
        mode: "mesh",
        stream: this.localStream,
      });
      this.room.once("open", () => {
      });
      this.room.on("peerJoin", () => {
      });
      this.room.on("peerLeave", (peerId) => {
        this.peers = this.peers.filter((p) => p.peerId !== peerId);
      });
      this.room.on("stream", async (stream) => {
        console.log("stream: " + this.peers)
        this.peers = this.peers.filter((p) => p.peerId !== stream.peerId);
        await this.peers.push({ peerId: stream.peerId, stream });
      });
    },
    zoomIn(){
      this.transform += 0.1;
      const scale = "scale(" + this.transform + ")";
      $(".remoteVideo").css("transform", scale);
    },
    zoomOut(){
      if(this.transform > 1){
        this.transform -= 0.1;
        const scale = "scale(" + this.transform + ")";
        $(".remoteVideo").css("transform", scale);
      }
    },
    record(){
      
    },
    share(){
      if (!navigator.mediaDevices.getDisplayMedia) {
        alert(`Error: Your device cannot use this type of stream.`);
        return;
      }
      navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        this.localStream = stream;
      })
      .then(this.joinRoom)
      .catch((err) => {
        console.log(err)
        alert(`Error: Your device cannot use this type of stream.`);
      });
    },
    enableAudio(){
      this.$store.state.setting.audio.getAudioTracks().forEach((track) => {
        track.enabled = false
      })
      this.isShowAudio = false;
    },
    disableAudio(){
      this.$store.state.setting.audio.getAudioTracks().forEach((track) => {
        track.enabled = true
      })
      this.isShowAudio = true;
    },
    enableVideo(){
      this.$store.state.setting.camera.getVideoTracks().forEach((track) => {
        console.log(track)
        track.enabled = false
      })
      this.isShowVideo = false;
    },
    disableVideo(){
      this.$store.state.setting.camera.getVideoTracks().forEach((track) => {
        track.enabled = true
      })
      this.isShowVideo = true;
    },
    endVideo(){
      if(confirm("Do you want to close video call?")){
        this.peers.forEach((peer) => {
          peer.stream.getTracks().forEach((track) => {
            track.enabled = false
          })
        })
        this.$refs.localVideo.srcObject.getTracks().forEach((track) => {
          track.enabled = false
        })
        this.$emit("close")
      }
    }
  }
}
</script>

<style lang="scss">
  #mainFrame {
    position: relative;
    min-height: calc(100vh - 50px);
    overflow: hidden;
    &.startFrame{
      opacity: 0;
    }
    .localVideo {
      z-index: 100;
      position: absolute;
      right: 25px;
      bottom: 100px;
      background-color: #47494e;
      height: 150px;
      width: 200px;
    }
    .remoteVideo {
      z-index: 50;
      min-height: calc(100vh - 130px);
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
      padding: 20px 20px 30px 20px;
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
  @media screen and (max-width: 500px) {
    #mainFrame {
      .control-bar {
        height: auto;
        .left-bar, .right-bar{
          padding-bottom: 40px;
        }
        .center-bar{
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 20px;
        }
        p{
          display: none;
        }
        i{
          margin: 0 10px;
        }
      }
      #localVideo{
        bottom: 140px;
      }
    }
  }
</style>