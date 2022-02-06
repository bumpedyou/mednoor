<template>
  <div ref="videoArea" class="video-call">
    <div class="peers-container">
      <!--Video container #1-->
      <div class="peer-container">
        <peer-view
          v-if="localMedia"
          :name="localMedia.userId"
          :audio="localMedia.audio"
          :video="localMedia.video"
        />
      </div>
      <div
        v-for="remoteMedia in remoteMedias"
        :key="remoteMedia.userId"
        class="peer-container"
      >
        <peer-view
          :name="remoteMedia.userId"
          :audio="remoteMedia.audio"
          :video="remoteMedia.video"
        />
      </div>
    </div>

    <div class='video-controls'>
      <!--
      <div class="clickable" @click="saveVideo">
        <v-icon >mdi-content-save</v-icon>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import * as mediasoupClient from 'mediasoup-client';
import MediaClient from '~/utils/MediaClient.js';
import PeerView from '~/components/peer/PeerView';
import { removeTracksFromStream } from '~/utils/media.js';

export default {
  name: "VideoCall",
  components: {
    PeerView
  },
  props: {
    close: {
      type: Function,
      default: null,
    }
  },
  data () {
    return {
      loading: true,
      socket: null,
      mediaClient: null,
      isEnumerateDevices: false,
      videoDevices: [],
      audioDevices: [],
      videoVal: '',
      audioVal: '',
      userId: '',
      remoteVideos: [],
      localMedia: null,
      remoteMedias: [],
      isLoadingVideo: null,
      isLoadingAudio: null,
    }
  },
  methods: {
    async init (roomId) {
      if (this.mediaClient) this.mediaClient.exit()
      this.socket = this.$nuxtSocket({
        name: 'media',
        persist: 'mediaSocket'
      });

      await this.initEnumerateDevices();
      const localEl = this.$refs.localVideo;
      const remoteEl = this.$refs.remoteVideos;
      const remoteAudioEl = this.$refs.remoteAudios;
      const roomOpen = async () => {
        this.loading = false;
        this.addListeners();
        await this.startAudio()
        await this.startVideo()
      }
      this.userId = this.$auth.user.uuid;
      this.mediaClient = new MediaClient(localEl, remoteEl, remoteAudioEl, mediasoupClient, this.socket, this.$auth.user.uuid, roomId, roomOpen);
    },
    start (roomId) {
      this.init(roomId)
    },
    join (roomId) {
      this.init(roomId)
    },
    stop() {
      if (this.mediaClient && this.mediaClient._isOpen) {
        this.mediaClient.exit()
        this.mediaClient = null
      }
      this.removeAllPeers()
    },
    async startVideo () {
      if (this.mediaClient) {
        this.isLoadingVideo = true
        await this.mediaClient.produce(MediaClient.mediaType.video, this.videoVal, this.userId)
      }
    },
    stopVideo () {
      if (this.mediaClient) {
        this.mediaClient.closeProducer(MediaClient.mediaType.video)
      }
    },
    async startAudio () {
      if (this.mediaClient) {
        this.isLoadingAudio= true
        await this.mediaClient.produce(MediaClient.mediaType.audio, this.audioVal, this.userId)
      }
    },
    stopAudio () {
      if (this.mediaClient) {
        this.mediaClient.closeProducer(MediaClient.mediaType.audio)
      }
    },
    addListeners() {
      this.mediaClient.on(MediaClient.EVENTS.stopAudio, () => {
        this.removeLocalPeer('audio')
      })
      this.mediaClient.on(MediaClient.EVENTS.startAudio, (stream) => {
        this.addLocalPeer({
          kind: 'audio',
          stream
        });
        this.isLoadingAudio= false
      })

      this.mediaClient.on(MediaClient.EVENTS.startRemoteMedia, (data) => {
        this.addNewPeer(data);
      })

      this.mediaClient.on(MediaClient.EVENTS.stopRemoteMedia, (data) => {
        this.removePeer(data)
      })

      this.mediaClient.on(MediaClient.EVENTS.startVideo, (stream) => {
        this.addLocalPeer({
          kind: 'video',
          stream
        });
        this.isLoadingVideo = false
      })

      this.mediaClient.on(MediaClient.EVENTS.stopVideo, () => {
        this.removeLocalPeer('video')
      })
      this.mediaClient.on(MediaClient.EVENTS.exitRoom, () => {
        this.removeAllPeers();
        this.mediaClient = null
        this.close()
      })
    },
    async initEnumerateDevices() {
  // Many browsers, without the consent of getUserMedia, cannot enumerate the devices.
      if (this.isEnumerateDevices) return

      const constraints = {
        audio: true,
        video: true
      }
      await navigator.mediaDevices
        .getUserMedia(constraints)
        .then(async (stream) => {
          await this.enumerateDevices()
          stream.getTracks().forEach(function (track) {
            track.stop()
          })
        })
        .catch((err) => {
          console.error('Access denied for audio/video: ', err)
        })
    },
    async enumerateDevices() {
      // Load mediaDevice options
      await navigator.mediaDevices.enumerateDevices().then((devices) => {
        const audioDevices = [];
        const videoDevices = [];
        devices.forEach((device) => {
          if (device.kind === 'audioinput') {
            audioDevices.push({value: device.deviceId, text: device.label});
          } else if (device.kind === 'videoinput') {
            videoDevices.push({value: device.deviceId, text: device.label});
          }
        })
        this.audioDevices = audioDevices
        this.videoDevices = videoDevices
      });
    },
    addLocalPeer (data) {
      const { kind, stream } = data;
      if ((kind === 'video' || kind === 'audio') && stream) {
        if (this.localMedia) {
          const { audio, video } = this.localMedia;
          if (kind === 'video' && video) {
            video.getTracks().forEach(function (track) {
              track.stop();
            });
          } else if (kind === 'audio' && audio) {
            audio.getTracks().forEach(function (track) {
              track.stop();
            });
          }
          this.localMedia = {
            ...this.localMedia,
            [kind]: stream
          };
        } else {
          this.localMedia = {
            userId: this.userId,
            [kind]: stream
          }
        }
      }
    },
    removeLocalPeer (kind) {
      if (this.localMedia && this.localMedia[kind]) {
        let newMedia = {...this.localMedia};
        const stream = newMedia[kind];
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        delete newMedia[kind];
        if (!newMedia.video && !newMedia.audio)
          newMedia = null
        this.localMedia = newMedia
      }
    },
    /*
      add a new local media
      @params: stream
      @return: null
    */
    addNewPeer (data) {
      if (data && data.kind && data.stream && data.producerUserId && (data.kind === 'video' || data.kind === 'audio')) {
        const newMedias = [...this.remoteMedias];
        const oldMedia = newMedias.find(({ userId, audio, video }) => userId === data.producerUserId);
        if (oldMedia) {
          const { video, audio } = oldMedia;
          if (data.kind === 'video') {
            if (video) {
              video.getTracks().forEach(function (track) {
                track.stop();
              });
            }
            oldMedia.video = data.stream;
          } else {
            if (audio) {
              audio.getTracks().forEach(function (track) {
                track.stop();
              });
            }
            oldMedia.audio = data.stream;
          }
        } else {
          newMedias.push({
            userId: data.producerUserId,
            [data.kind]: data.stream
          })
        }
        this.remoteMedias = newMedias;
      }
    },
    /// ////////////////////
    /*
      remote a remote media
      @params: userId
      @return: void
    */
    removePeer ({userId, kind}) {
      const media = this.remoteMedias.find(({ userId: id }) => id === userId );
      let removeMedia = false
      if (media) {
        const { audio, video } = media;
        if (kind === 'video' && video) {
          removeTracksFromStream(video);
          if (!audio) removeMedia = true
        }
        if (kind === 'audio' && audio) {
          removeTracksFromStream(audio);
          if (!video) removeMedia = true
        }
      }
      if (removeMedia) {
        this.remoteMedias = this.remoteMedias.filter(({ userId: id}) => (id !== userId))
      } else {
        this.remoteMedias = this.remoteMedias.map(({ video, audio, userId: id}) => {
            if (id === userId) {
              if (kind === 'video') {
                return {
                  audio,
                  userId: id
                }
              } else {
                return {
                  video,
                  userId: id
                }
              }
            } else {
              return {
                video,
                audio,
                userId: id
              }
            }
        })
      }
    },
    /// ////////////////////
    /*
      remvoe all medias
      @params: null
      @return: null
    */
    removeAllPeers() {
      if (this.localMedia) {
        const { audio, video } = this.localMedia;
        if (audio) removeTracksFromStream(audio);
        if (video) removeTracksFromStream(video);
        this.localMedia = null
      }
      this.remoteMedias.forEach(({ audio, video }) => {
        if (audio) removeTracksFromStream(audio);
        if (video) removeTracksFromStream(video);
      });
      this.remoteMedias = [];
    },
    saveVideo() {
      /** WITH CSS */
      const canvas = document.createElement('canvas'); // declare a canvas element in your html
      const ctx = canvas.getContext('2d');
      const videos = document.querySelectorAll('video')
      for (let i = 0, len = videos.length; i < len; i++) {
          const v = videos[i]
          // if (!v.src) continue // no video here
          try {
              const w = v.videoWidth
              const h = v.videoHeight
              canvas.width = w
              canvas.height = h
              ctx.fillRect(0, 0, w, h)
              ctx.drawImage(v, 0, 0, w, h)
              v.style.backgroundImage = `url(${canvas.toDataURL()})` // here is the magic
              v.style.backgroundSize = '100% 100%'
              ctx.clearRect(0, 0, w, h); // clean the canvas
          } catch (e) {
              continue
          }
      }
      const body = document.querySelector('html')
      const width = body.clientWidth
      const height = body.clientHeight
      html2canvas(document.querySelector('html'))
      .then(bodyCanvas => {
        const canvas = document.createElement('canvas');
        const croppedCanvasContext = canvas.getContext('2d');

        canvas.width = width
        canvas.height = height

        croppedCanvasContext.drawImage(bodyCanvas, 0, 0, width, height);

        const image = canvas.toDataURL('image/jpg');
        const a = document.createElement("a"); // Create <a>
        a.href = image
        a.download = "image.png"; // File name Here
        a.click();
        const videos = document.querySelectorAll('video')
        for (let i = 0, len = videos.length; i < len; i++) {
            const v = videos[i]
            // if (!v.src) continue // no video here
            try {
                v.style.backgroundImage = null // here is the magic
                v.style.backgroundSize = null
            } catch (e) {
                continue
            }
        }
      })
    },
  }
}
</script>

<style scoped lang="sass">
.video-call
  display: flex !important
  flex-direction: column !important
  flex-grow: 1
  width: 100%

  > div
    display: flex
    flex: 1
  .video-controls
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    background: #fff
    border-top: 1px solid $mdn-super-light-grey
    box-shadow: inset 0 1px 3px $mdn-super-light-grey
    padding: 0.5rem
    height: 60px
    display: flex
    align-items: center
    justify-content: center

  .peers-container
    position: fixed
    width: 100%
    bottom: 60px
    top: 100px
    overflow-y: auto
    overflow-x: hidden
    display: flex
    flex-wrap: wrap

    .peer-container
      width: 50%
      min-width: 300px
      height: fit-content
@media screen and (min-width: $md)
  .video-call
    flex-direction: row
    .peers-container
      width: 50%
    .video-controls
      width: 50%
      right: 50%

.peer-container.zoom
  position: fixed
  top: 50px
  bottom: 60px
  padding: 1px
  align-content: center
  height: calc(100% - 110px)
  display: flex
  right: 0
  width: 100% !important
  line-height: 0
  z-index: 1000
  background: white

</style>
