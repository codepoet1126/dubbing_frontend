import React, { useState, useCallback, useRef, useEffect } from "react";
import Dropzone from "react-dropzone";
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import pizzip from "pizzip";
import axios from "axios";
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { styled } from '@mui/system';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';
import { Link } from "react-router-dom";
import docxtemplate from "docxtemplater"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Header } from "../layouts/Header";
import Studio from "./Studio";
import { SettingsContext } from "../context/settingsContext";

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  z-index: 1;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
    );
  }

  const verticalPlacement = popupContext.placement.split('-')[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

AnimatedListbox.propTypes = {
  ownerState: PropTypes.object.isRequired,
};

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items:center;
  justify-content: space-between;
  line-height: 1.5;
  width: 100%;
  border: 2px solid #4E3F3A
  padding: 8px 16px;
  border-radius: 8px;
  color: white !important;
  transition: all 150ms ease;
  cursor: pointer;
  background: transparent;
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  `,
);


export function Test() {

  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [url, setUrl] = useState("");

  const [processType, setProcessType] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [v_width, setVWidth] = useState(0);
  const [v_height, setVHeight] = useState(0);
  const [videoFile, setVideoFile] = useState(null)
  const [dubbingVideo, setDubbingVideo] = useState("");
  const [dubbingAudio, setDubbingAudio] = useState("")
  const [transcribeAudio, setTranscribeAudio] = useState("")
  const audioRef = useRef(null)
  const originalAudioRef = useRef(null)
  const originVideoRef = useRef(null)
  const panelRef = useRef(null)
  const [panelH, setPanelH] = useState(0)
  const [transcribeText, setTranscribeText] = useState("")
  const [loading, setLoading] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subArray, setSubArray] = useState([]);
  const [totalTimeStr, setTotalTimeStr] = useState("00:00:00")
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00:00")
  const [transcribeFile, setTranscribeFile] = useState(null)
  const [dubbingFile, setDubbingFile] = useState(null)
  const [voices, setVoices] = useState([])
  const [speakers, setSpeakers] = useState([])

  const handleVideoFile = (e) => {
    URL.revokeObjectURL(url);
    // const file = e.currentTarget.files[0];
    const videoUrl = URL.createObjectURL(videoFile);
    setUrl(videoUrl);
    const videoRegx = /^video\/(mp4|x-(flv))+$/;
    const found = videoFile.type.match(videoRegx);
    const videoType =
      found && found[2] ? found[2] + "Custom" : found ? found[1] : "";
    player.switchVideo({
      url: videoUrl,
      type: videoType,
    });
  }
  const formatSeconds = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Pad the values with leading zeros if necessary
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    // Return the formatted string
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  const contextmenu = useCallback(
    (time, event) => {
      if (audioRef) {
        audioRef.current.play()
        originalAudioRef.current.play()
        originVideoRef.current.play()
        audioRef.current.currentTime = time
        originalAudioRef.current.currentTime = time
        originVideoRef.current.currentTime = time
      }
    },
    [audioRef.current]
  );

  const click = useCallback(
    (time, event) => {
      if (audioRef) {
        audioRef.current.pause();
        originalAudioRef.current.pause()
        originVideoRef.current.pause()
        audioRef.current.currentTime = time
        originalAudioRef.current.currentTime = time
        originVideoRef.current.currentTime = time
      }
    },
    [audioRef.current]
  );

  const handleSubClick = useCallback((sub) => {
    console.log(sub);
  });

  const handleSubMove = useCallback((originSub, translateSecond) => {
    const subs = [...subArray];
    const index = subs.indexOf(originSub);
    const sub = { ...subs[index] };
    sub.start += translateSecond;
    sub.end += translateSecond;
    subs[index] = sub;
    console.log("update subArray");
    setSubArray(subs);
  });

  const handleSubMoveError = useCallback(() => {
    console.log("警告");
  });

  const handleSubResize = useCallback((originSub, translateSecond, type) => {
    const subs = [...subArray];
    const index = subs.indexOf(originSub);
    const sub = { ...subs[index] };
    if (type === "start") {
      sub.start += translateSecond;
    } else {
      sub.end += translateSecond;
    }
    sub.length = sub.end - sub.start;
    subs[index] = sub;
    console.log("update subArray");
    setSubArray(subs);
  });

  const handleDurationChange = useCallback((duration) => {
    setDuration(duration);
    //pause the video
  });
  const resizeVideoPlayer = () => {
    if (isProcessing) {
      var { width, height } = document.getElementById("video_panel").getBoundingClientRect();

      if (width / 2 > height) {
        setVHeight(height - 50)
        setVWidth(2 * height)
      } else {
        setVWidth(width - 100)
        setVHeight(width / 2)
      }
    }
  }
  useEffect(() => {
    if (currentTime === totalTime) {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    console.log(currentTime)
  }, [currentTime])
  useEffect(() => {
    resizeVideoPlayer()
  }, [isProcessing]);
  useEffect(() => {
    const handleResize = () => {
      console.log("asdfsdf")
      resizeVideoPlayer()
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  useEffect(() => {
    if (player && videoFile) {
      handleVideoFile()
    }
  }, [player, videoFile])

  useEffect(() => {
    setCurrentTimeStr(formatSeconds(currentTime))
    setTotalTimeStr(formatSeconds(totalTime))
  }, [currentTime, totalTime])

  useEffect(() => {
    if (panelRef.current) {
      setPanelH(panelRef.current.getBoundingClientRect().height)
    }
  }, [panelRef.current])

  useEffect(() => {
    if (transcribeAudio !== "") {
      fetch(`http://localhost:4000/static/target_audios/${transcribeAudio}`).then(response => {
        response.blob().then(blob => {
          const transcribeFile = new File([blob], transcribeAudio, { type: 'audio/wav' });
          setTranscribeFile(transcribeFile)
        })
      })
    }
    if (dubbingAudio !== "") {
      fetch(`http://localhost:4000/static/source_audios/${dubbingAudio}`).then(response => {
        response.blob().then(blob => {
          const dubbingFile = new File([blob], dubbingAudio, { type: 'audio/wav' });
          console.log(dubbingFile)
          setDubbingFile(dubbingFile)
        })
      })
    }

  }, [transcribeAudio, dubbingAudio])


  const uploadFile = async () => {
    if (!videoFile) return;
    if (transcribeText === "") return;
    const formData = new FormData()
    formData.append("file", videoFile)
    formData.append("text", transcribeText)
    try {
      const response = await axios.post("http://localhost:4000/voice-clone", formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
      setDubbingVideo(response.data.video_file)
      setDubbingAudio(response.data.audio_file)
      setLoading(true)
      axios.post("http://localhost:4000/generate_audio", {
        transcribeText: transcribeText,
        source: response.data.audio_file
      }).then(result => {
        setTranscribeAudio(result.data.output)
        setSubArray(result.data.subtitles)
        setSpeakers(result.data.speakers)
        setLoading(false)
      })

      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownload = async () => {
    if (transcribeAudio === "") {
      return
    }
    try {
      const response = await axios.post('http://localhost:4000/download', {
        filename: transcribeAudio
      }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', transcribeAudio);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const moveBackward = () => {
    if (currentTime < 1) {
      setCurrentTime(0)
      audioRef.current.currentTime = 0
      originalAudioRef.current.currentTime = 0
      originVideoRef.current.currentTime = 0
    } else {
      setCurrentTime(currentTime - 1)
      audioRef.current.currentTime = currentTime - 1
      originalAudioRef.current.currentTime = currentTime - 1
      originVideoRef.current.currentTime = currentTime - 1
    }
  }
  const moveForward = () => {
    if (currentTime > totalTime - 1) {
      setCurrentTime(totalTime)
      audioRef.current.currentTime = totalTime
      originalAudioRef.current.currentTime = totalTime
      originVideoRef.current.currentTime = totalTime
    } else {
      setCurrentTime(currentTime + 1)
      audioRef.current.currentTime = currentTime + 1
      originalAudioRef.current.currentTime = currentTime + 1
      originVideoRef.current.currentTime = currentTime + 1
    }
  }
  const playAudio = () => {
    if (isPlaying) {
      if (audioRef) {
        audioRef.current.pause()
        originVideoRef.current.pause()
        originalAudioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      if (audioRef) {
        audioRef.current.play()
        originalAudioRef.current.play()
        originVideoRef.current.play()
        audioRef.current.currentTime = currentTime
        originalAudioRef.current.currentTime = currentTime
        originVideoRef.current.currentTime = currentTime
        // originalAudioRef.current.play()
      }
      setIsPlaying(true)
    }
  }
  const fetchVoices = async () => {
    const response = await axios.get("http://localhost:4000/voice/list")
    setVoices(response.data.voices)
  }

  return (

    <div className="h-[100vh] flex flex-col">
      <Header />
      <div className="flex justify-center p-5" style={{ display: isProcessing ? "none" : "flex" }}>
        <div className="w-[40%] h-full bg-[#262732] rounded-2xl p-10">
          <div>
            <select className="border-none bg-transparent text-white text-2xl" onChange={(e) => {
              setProcessType(parseInt(e.target.value))
            }}>
              <option value="0">Upload Video (for lip-sync only)</option>
              <option value="1">Upload Original Video</option>
            </select>
            {
              processType === 0 ? (
                <div className="lip-sync p-3">
                  <div className="flex flex-col mt-5">
                    <label className="text-white pb-2 text-lg">Title</label>
                    <input type="text" className="text-lg bg-transparent outline-none border border-[#4E3F3A] border-3 border-dashed p-3 text-white rounded-xl"></input>
                  </div>
                  <div className="flex flex-col mt-10">
                    <label className="text-white pb-2 text-lg">Upload File(Video File)</label>
                    <Dropzone
                      accept={{ 'video/mp4': ['.mp4'] }}
                      onDrop={(acceptFiles) => {
                        if (acceptFiles.length > 0) {
                          setVideoFile(acceptFiles[0])
                        }
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className="rounded-xl cursor-pointer h-[280px] flex flex-col items-center justify-center border border-[#4E3F3A] border-3 border-dashed">
                          <input {...getInputProps()} multiple={false} accept=".mp4,.avi" onChange={(e) => {
                            setVideoFile(e.target.files[0])
                          }} />
                          {
                            videoFile === null ? (
                              <>
                                <p><span className="text-[#EB8D38]">Click to upload</span><span className="text-white"> or drop file here</span></p>
                                <p className="text-white">Supported .mp4 .mkv</p>
                              </>
                            ) : <>
                              <img className="w-20" src={`/img/icons/${videoFile.name.includes(".mp4") ? "mp4.png" : "avi.png"}`} />
                              <p className="text-white">{videoFile.name}</p>
                            </>
                          }
                        </div>
                      )}
                    </Dropzone>
                  </div>
                  <div className="upload flex-grow flex flex-col justify-between mt-5">
                    <div className={`rounded-xl cursor-pointer flex-grow flex flex-col items-center justify-center border border-[#4E3F3A] border-3 border-dashed cursor-pointer mb-5 ${transcribeText !== "" ? "hidden" : ""}`} onClick={() => {
                      document.getElementById("transcribe_text").click()
                    }}>

                      <input type='file' id="transcribe_text" style={{ display: 'none' }} accept=".txt,.doc,.docx" multiple={false} onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file.type === 'text/plain') {
                          const reader = new FileReader()
                          reader.onload = () => {
                            console.log(reader.result)
                            setTranscribeText(reader.result)
                          }
                          reader.readAsText(file)
                        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                          const reader = new FileReader()
                          reader.readAsBinaryString(file)
                          await new Promise((resolve) => {
                            reader.onload = resolve;
                          });
                          const content = reader.result;
                          const doc = new docxtemplate().loadZip(new pizzip(content));
                          const textContent = doc.getFullText();
                          console.log(textContent)
                          setTranscribeText(textContent)
                        }
                      }} />

                      <p><span className="text-[#EB8D38]">Click to import</span><span className="text-white"> or drop file here</span></p>
                      <p className="text-white">Supported .txt .docx .doc</p>
                    </div>
                    <textarea type="text" className={`rounded-xl cursor-pointer flex-grow flex flex-col items-center justify-center border border-[#4E3F3A] border-3 border-dashed cursor-pointer bg-transparent p-5 mb-5 text-[#D5D5D8] ${transcribeText === "" ? "hidden" : ""}`} placeholder="Please input a text. Then click 'Generate Audio' button." value={transcribeText} onChange={(e) => {
                      if (e.target.value === "") {
                        document.getElementById("transcribe_text").value = ''
                      }
                      setTranscribeText(e.target.value)
                    }}>

                    </textarea>
                  </div>
                  <div className="flex flex-col mt-5">
                    <label className="text-white pb-2 text-lg text-center">Or</label>
                    <div className="text-2xl bg-transparent outline-none border border-[#4E3F3A] border-3 border-dashed p-3 text-white rounded-xl flex items-center">
                      <img src="/img/icons/imdb icon.png" />
                    </div>
                  </div>
                </div>
              ) : <></>
            }
            {
              processType === 1 ? (
                <div className="original-video p-3" >
                  <div className="flex flex-col mt-5">
                    <label className="text-white pb-2 text-lg">Total Voices</label>
                    <select className="text-lg bg-transparent outline-none border border-[#4E3F3A] border-3 border-dashed p-3 text-white rounded-xl">
                      <option>Auto detect</option>
                    </select>
                    <div className="flex flex-col mt-5">
                      <label className="text-white pb-2 text-lg">Language Selector</label>
                      <select className="text-lg bg-transparent outline-none border border-[#4E3F3A] border-3 border-dashed p-3 text-white rounded-xl">
                        <option>English (US)</option>
                      </select>
                    </div>
                    <div className="mt-5">
                      <FormControlLabel control={<Checkbox
                        sx={{
                          color: "#fff",
                          '&.Mui-checked': {
                            color: "#EB8D38",
                          },
                        }}
                      />} label="Lip-Sync" className="text-white" />

                    </div>
                  </div>
                </div>
              ) : <></>
            }


            <button className="w-full flex items-center justify-center bg-[#EB8D38] p-5 rounded-xl text-xl mt-5 text-white" disabled={loading}
              onClick={async () => {
                if (!videoFile) {
                  return;
                }
                setLoading(true)
                await uploadFile()
                setIsProcessing(true)
              }}
            >{loading ? <img className="w-10 mr-3" src="/img/icons/loading.gif" /> : <></>}<span>Start Processing</span></button>
          </div>
        </div>
      </div>
      {
        isProcessing ? (
          <div className="flex-grow flex">
            <div className="w-[108px] h-full flex flex-col">
              <div className="flex-grow">
                <ul className="flex flex-col items-center">
                  <li className="p-5">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_284_2218)">
                          <path d="M24.969 3.73121V2.57552C24.969 1.83914 24.3719 1.24219 23.6357 1.24219H2.65756C1.92117 1.24219 1.32422 1.83914 1.32422 2.57552V23.5535C1.32422 24.2899 1.92117 24.8868 2.65756 24.8868H3.81324" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M30.6774 29.4242C30.6774 30.1605 30.0805 30.7575 29.3441 30.7575H9.70345C8.96708 30.7575 8.37012 30.1605 8.37012 29.4242V9.78353C8.37012 9.04716 8.96708 8.4502 9.70345 8.4502H29.3441C30.0805 8.4502 30.6774 9.04716 30.6774 9.78353V29.4242Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M19.5234 25.1654V14.043" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M13.9639 19.6045H25.0861" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip0_284_2218">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Link>
                  </li>
                  <li className="p-5">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_284_2224)">
                          <path d="M11 25H3.2627" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M27 11V7C27 6.46957 26.7893 5.96086 26.4142 5.58579C26.0391 5.21071 25.5304 5 25 5H11V3C11 2.46957 10.7893 1.96086 10.4142 1.58579C10.0391 1.21071 9.53043 1 9 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V22.7333C1.00753 23.2779 1.2109 23.8016 1.57291 24.2086C1.93492 24.6155 2.43136 24.8785 2.97138 24.9494C3.5114 25.0203 4.0589 24.8944 4.51369 24.5947C4.96848 24.295 5.30014 23.8415 5.448 23.3173L8.58267 12.4453C8.703 12.0285 8.95562 11.662 9.30244 11.4013C9.64926 11.1406 10.0715 10.9998 10.5053 11H29C29.3066 10.9999 29.6091 11.0703 29.8841 11.2057C30.1592 11.3411 30.3994 11.5379 30.5862 11.781C30.7731 12.024 30.9016 12.3068 30.9618 12.6074C31.022 12.908 31.0122 13.2184 30.9333 13.5147" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15 23C15 25.1217 15.8429 27.1566 17.3431 28.6569C18.8434 30.1571 20.8783 31 23 31C25.1217 31 27.1566 30.1571 28.6569 28.6569C30.1571 27.1566 31 25.1217 31 23C31 20.8783 30.1571 18.8434 28.6569 17.3431C27.1566 15.8429 25.1217 15 23 15C20.8783 15 18.8434 15.8429 17.3431 17.3431C15.8429 18.8434 15 20.8783 15 23Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M26.536 22.9999H23V19.4639" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip0_284_2224">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </Link>
                  </li>
                  <li className="p-3">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 26V31" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15.3333 1H16.6667C16.6667 1 22 1 22 6.33333V16C22 16 22 21.3333 16.6667 21.3333H15.3333C15.3333 21.3333 10 21.3333 10 16V6.33333C10 6.33333 10 1 15.3333 1Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M5.33301 13V16C5.33301 18.6522 6.38658 21.1957 8.26194 23.0711C10.1373 24.9464 12.6808 26 15.333 26H16.6663C19.3185 26 21.862 24.9464 23.7374 23.0711C25.6128 21.1957 26.6663 18.6522 26.6663 16V13" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </Link>
                  </li>
                  <li className="p-3">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.6667 26C22.6667 23.7909 19.6819 22 16 22C12.3181 22 9.33333 23.7909 9.33333 26M28 22.0005C28 20.3602 26.3545 18.9506 24 18.3333M4 22.0005C4 20.3602 5.64546 18.9506 8 18.3333M24 12.9815C24.8183 12.249 25.3333 11.1847 25.3333 10C25.3333 7.79086 23.5425 6 21.3333 6C20.3089 6 19.3743 6.38514 18.6667 7.01852M8 12.9815C7.18167 12.249 6.66667 11.1847 6.66667 10C6.66667 7.79086 8.45753 6 10.6667 6C11.6911 6 12.6257 6.38514 13.3333 7.01852M16 18C13.7909 18 12 16.2091 12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14C20 16.2091 18.2091 18 16 18Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </Link>
                  </li>
                  <li className="p-3">
                    <Link to="/dubbing">
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 28.5C26.5913 28.5 28.1174 27.8679 29.2426 26.7426C30.3679 25.6174 31 24.0913 31 22.5C31 20.9087 30.3679 19.3826 29.2426 18.2574C28.1174 17.1321 26.5913 16.5 25 16.5C24.4696 16.5 23.9609 16.7107 23.5858 17.0858C23.2107 17.4609 23 17.9696 23 18.5V26.5C23 27.0304 23.2107 27.5391 23.5858 27.9142C23.9609 28.2893 24.4696 28.5 25 28.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7 28.5C5.4087 28.5 3.88258 27.8679 2.75736 26.7426C1.63214 25.6174 1 24.0913 1 22.5C1 20.9087 1.63214 19.3826 2.75736 18.2574C3.88258 17.1321 5.4087 16.5 7 16.5C7.53043 16.5 8.03914 16.7107 8.41421 17.0858C8.78929 17.4609 9 17.9696 9 18.5V26.5C9 27.0304 8.78929 27.5391 8.41421 27.9142C8.03914 28.2893 7.53043 28.5 7 28.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M5 16.8413V14.5C5.00844 11.5852 6.17008 8.79222 8.23115 6.73115C10.2922 4.67008 13.0852 3.50844 16 3.5C18.9148 3.50844 21.7078 4.67008 23.7688 6.73115C25.8299 8.79222 26.9916 11.5852 27 14.5V16.8413" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 28.166V30.2493" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15.7222 17.75H16.2778C16.2778 17.75 18.5 17.75 18.5 19.9722V24C18.5 24 18.5 26.2222 16.2778 26.2222H15.7222C15.7222 26.2222 13.5 26.2222 13.5 24V19.9722C13.5 19.9722 13.5 17.75 15.7222 17.75Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.5557 22.75V24C11.5557 25.1051 11.9947 26.1649 12.7761 26.9463C13.5575 27.7277 14.6173 28.1667 15.7223 28.1667H16.2779C17.383 28.1667 18.4428 27.7277 19.2242 26.9463C20.0056 26.1649 20.4446 25.1051 20.4446 24V22.75" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </Link>
                  </li>
                  <li className="p-3">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 28.5C26.5913 28.5 28.1174 27.8679 29.2426 26.7426C30.3679 25.6174 31 24.0913 31 22.5C31 20.9087 30.3679 19.3826 29.2426 18.2574C28.1174 17.1321 26.5913 16.5 25 16.5C24.4696 16.5 23.9609 16.7107 23.5858 17.0858C23.2107 17.4609 23 17.9696 23 18.5V26.5C23 27.0304 23.2107 27.5391 23.5858 27.9142C23.9609 28.2893 24.4696 28.5 25 28.5Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7 28.5C5.4087 28.5 3.88258 27.8679 2.75736 26.7426C1.63214 25.6174 1 24.0913 1 22.5C1 20.9087 1.63214 19.3826 2.75736 18.2574C3.88258 17.1321 5.4087 16.5 7 16.5C7.53043 16.5 8.03914 16.7107 8.41421 17.0858C8.78929 17.4609 9 17.9696 9 18.5V26.5C9 27.0304 8.78929 27.5391 8.41421 27.9142C8.03914 28.2893 7.53043 28.5 7 28.5Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M5 16.8413V14.5C5.00844 11.5852 6.17008 8.79222 8.23115 6.73115C10.2922 4.67008 13.0852 3.50844 16 3.5C18.9148 3.50844 21.7078 4.67008 23.7688 6.73115C25.8299 8.79222 26.9916 11.5852 27 14.5V16.8413" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <g clip-path="url(#clip0_284_2244)">
                          <path d="M21 30.25H12.25C11.9185 30.25 11.6005 30.1183 11.3661 29.8839C11.1317 29.6495 11 29.3315 11 29" stroke="#666666" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M12.6667 17.75C12.2246 17.75 11.8007 17.9256 11.4882 18.2382C11.1756 18.5507 11 18.9746 11 19.4167V29C11 28.6685 11.1317 28.3505 11.3661 28.1161C11.6005 27.8817 11.9185 27.75 12.25 27.75H20.5833C20.6938 27.75 20.7998 27.7061 20.878 27.628C20.9561 27.5498 21 27.4438 21 27.3333V18.1667C21 18.0562 20.9561 17.9502 20.878 17.872C20.7998 17.7939 20.6938 17.75 20.5833 17.75H12.6667Z" stroke="#666666" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M20.166 30.25V27.75" stroke="#666666" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip0_284_2244">
                            <rect width="13.3333" height="13.3333" fill="white" transform="translate(9.33301 17.333)" />
                          </clipPath>
                        </defs>
                      </svg>

                    </Link>
                  </li>
                  <li className="p-3">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_284_2252)">
                          <path d="M8 9C8 11.1217 8.84286 13.1566 10.3431 14.6569C11.8434 16.1571 13.8783 17 16 17C18.1217 17 20.1566 16.1571 21.6569 14.6569C23.1571 13.1566 24 11.1217 24 9C24 6.87827 23.1571 4.84344 21.6569 3.34315C20.1566 1.84285 18.1217 1 16 1C13.8783 1 11.8434 1.84285 10.3431 3.34315C8.84286 4.84344 8 6.87827 8 9Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M8 9H24" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M13 9C13 11.1217 13.3161 13.1566 13.8787 14.6569C14.4413 16.1571 15.2044 17 16 17C16.7956 17 17.5587 16.1571 18.1213 14.6569C18.6839 13.1566 19 11.1217 19 9C19 6.87827 18.6839 4.84344 18.1213 3.34315C17.5587 1.84285 16.7956 1 16 1C15.2044 1 14.4413 1.84285 13.8787 3.34315C13.3161 4.84344 13 6.87827 13 9Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M3.13184 22.5C3.13184 22.9596 3.22237 23.4148 3.39826 23.8394C3.57415 24.264 3.83196 24.6499 4.15696 24.9749C4.48197 25.2999 4.8678 25.5577 5.29244 25.7336C5.71708 25.9095 6.17221 26 6.63184 26C7.09146 26 7.54659 25.9095 7.97123 25.7336C8.39587 25.5577 8.7817 25.2999 9.10671 24.9749C9.43172 24.6499 9.68952 24.264 9.86541 23.8394C10.0413 23.4148 10.1318 22.9596 10.1318 22.5C10.1318 22.0404 10.0413 21.5852 9.86541 21.1606C9.68952 20.736 9.43172 20.3501 9.10671 20.0251C8.7817 19.7001 8.39587 19.4423 7.97123 19.2664C7.54659 19.0905 7.09146 19 6.63184 19C6.17221 19 5.71708 19.0905 5.29244 19.2664C4.8678 19.4423 4.48197 19.7001 4.15696 20.0251C3.83196 20.3501 3.57415 20.736 3.39826 21.1606C3.22237 21.5852 3.13184 22.0404 3.13184 22.5Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M12.2663 31.0001C11.8587 29.8312 11.0975 28.818 10.0882 28.1011C9.07893 27.3842 7.87162 26.999 6.63364 26.999C5.39567 26.999 4.18836 27.3842 3.17909 28.1011C2.16983 28.818 1.40861 29.8312 1.00098 31.0001" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M21.8682 22.5C21.8682 23.4283 22.2369 24.3185 22.8933 24.9749C23.5497 25.6313 24.4399 26 25.3682 26C26.2964 26 27.1867 25.6313 27.843 24.9749C28.4994 24.3185 28.8682 23.4283 28.8682 22.5C28.8682 21.5717 28.4994 20.6815 27.843 20.0251C27.1867 19.3687 26.2964 19 25.3682 19C24.4399 19 23.5497 19.3687 22.8933 20.0251C22.2369 20.6815 21.8682 21.5717 21.8682 22.5Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M30.9997 31.0001C30.5921 29.8312 29.8309 28.818 28.8216 28.1011C27.8123 27.3842 26.605 26.999 25.367 26.999C24.1291 26.999 22.9218 27.3842 21.9125 28.1011C20.9032 28.818 20.142 29.8312 19.7344 31.0001" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip0_284_2252">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                    </Link>
                  </li>

                  <li className="p-3">
                    <Link>
                      <svg className="w-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.5222 6.6667C27.8799 9.0717 29.3337 12.3661 29.3337 16C29.3337 19.6771 27.8451 23.0065 25.4379 25.4187M6.66699 25.522C4.19851 23.102 2.66699 19.7299 2.66699 16C2.66699 12.3133 4.16329 8.9761 6.5817 6.5625" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M21.7132 10.7256C23.1277 12.0787 24 13.9321 24 15.9766C24 18.0454 23.1069 19.9185 21.6625 21.2755M10.4 21.3337C8.91891 19.9722 8 18.075 8 15.9766C8 13.9025 8.89777 12.0249 10.3488 10.667" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18.2081 13.9348C19.4025 14.8117 19.9997 15.2501 19.9997 16C19.9997 16.7499 19.4025 17.1883 18.2081 18.0652C17.8785 18.3072 17.5514 18.5352 17.2509 18.7251C16.9873 18.8917 16.6887 19.064 16.3795 19.2332C15.1881 19.8853 14.5922 20.2115 14.0579 19.8504C13.5235 19.4893 13.475 18.7336 13.3779 17.2221C13.3505 16.7947 13.333 16.3756 13.333 16C13.333 15.6244 13.3505 15.2053 13.3779 14.7779C13.475 13.2664 13.5235 12.5106 14.0579 12.1496C14.5922 11.7886 15.1881 12.1147 16.3795 12.7668C16.6887 12.936 16.9873 13.1083 17.2509 13.2749C17.5514 13.4648 17.8785 13.6928 18.2081 13.9348Z" stroke="#666666" stroke-width="2" />
                      </svg>

                    </Link>
                  </li>
                </ul>
              </div>
              <div className="h-[300px] border-t-2 flex flex-col justify-center items-center">
                <a href="#">
                  <img src="/img/icons/user.png" className="w-5" />
                </a>
                <a href="#" className="mt-10">
                  <img src="/img/icons/settings.png" className="w-5" />
                </a>
              </div>
            </div>
            <div className="flex-grow h-full flex flex-col">
              <div className="flex flex-grow" ref={panelRef}>
                <div className={`w-[25%] h-full bg-[#2E2F3A] p-5 flex flex-col h-[${panelH}px]`}>
                  <div className="border-b-2 border-[#21222D] pb-3">
                    <div className="">
                      <p className="text-[#D5D5D8] pb-1">Translate From</p>
                      <select className="bg-transparent w-full p-2 rounded-lg border-2 border-[#D5D5D8] text-[#D5D5D8] forcus:border-[#4E3F3A]">
                        <option>English</option>
                      </select>
                    </div>
                    <div className="pt-2">
                      <p className="text-[#D5D5D8] pb-1">Translate To</p>
                      <select className="bg-transparent w-full p-2 rounded-lg border-2 border-[#D5D5D8] text-[#D5D5D8] forcus:border-[#4E3F3A]">
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2 flex-grow">
                    <p className="text-white pb-1 text-xl">Choose Voices For Dubbing</p>
                    <p className="text-[#D5D5D8]">{speakers.length} Detected</p>
                    {
                      speakers.map((speaker, index) => {
                        return (
                          <div className="">
                            <p className="text-[#D5D5D8]">{index + 1}</p>
                            <div className="flex rounded-xl p-2 border-[#EB8D38] items-center justify-between pl-2 pr-2 w-full border border-2 border-[#4E3F3A]">
                              <Dropdown>
                                <MenuButton>
                                  <span className="flex items-center">
                                    <img src="/img/icons/user.png" />
                                    <span className="ml-4">Speaker {speaker}</span></span>
                                  <img src='/img/icons/chevron-down.png' />
                                </MenuButton>
                                <Menu slots={{ listbox: AnimatedListbox }}>
                                  <MenuItem>Profile</MenuItem>
                                  <MenuItem>
                                    Language settings
                                  </MenuItem>
                                  <MenuItem>Log out</MenuItem>
                                </Menu>
                              </Dropdown>
                            </div>
                          </div>
                        )
                      })
                    }

                  </div>
                  <div>
                    <button className="bg-[#EB8D38] w-full text-xl rounded-lg pt-3 pb-3 text-white">Apply Voices</button>
                  </div>
                </div>
                <div className={`w-[50%] pl-10 pr-10 flex flex-col border-r-2 border-[#2E2F3A] overflow-y-scroll h-[${panelH}px]`}>
                  <h3 className="text-3xl">Neon Gaming File</h3>
                  <div className="transcribe-text mt-5">
                    {
                      subArray.map((title, index) => {
                        return (
                          <div className={`bg-[#2E2F3A] p-3 mb-3 ${(title.start >= currentTime && title.end <= title.end) ? "border border-2 border-[#EB8D38]" : ""} rounded-xl flex items-center justify-between`} key={`subtitle${index}`}>
                            <div className="flex items-center">
                              <img src="/img/icons/user.png" />
                              <p className="text-white pl-4">{title.lines.join(".")}</p>
                            </div>
                            <div className="flex items center">
                              <span className="text-[#D5D5D8]">Duration: {title.length} sec</span>
                              <PlayArrowIcon className="text-white cursor-pointer ml-3" />
                              <MoreVertIcon className="text-white cursor-pointer ml-3" />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="w-[25%] m-10 mt-0 flex justify-center items-center" id="video_panel">

                  <video width="100%" muted src={`http://localhost:4000/static/source_audios/${dubbingVideo}`} ref={originVideoRef}

                  />
                </div>

              </div>
              <div className="flex">
                <div className="h-[300px] w-full flex flex-col">
                  <div className="flex-grow relative">
                    <SettingsContext><Studio transcribeFile={transcribeFile} dubbingFile={dubbingFile} subTitle={subArray} setCurrentTime={setCurrentTime} /></SettingsContext>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : <></>
      }
      {
        loading ? (
          <>
            <div className="fixed w-[100vw] h-[100vh] left-0 top-0 bg-black opacity-50 flex items-center justify-center">

            </div>
            <div className="fixed left-[50%] top-[50%] bg-white rounded-xl p-4 translate-x-[-50%] translate-y-[-50%] flex items-center">
              <img className="w-10 mr-3" src="/img/icons/loading.gif" /><p className="z-1000 text-lg mr-3 text-black">Processing...</p>
            </div>
          </>
        ) : <></>
      }

    </div>
  )

}