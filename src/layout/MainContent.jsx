// MainContent.jsx

import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "../components/StartingFeatures/ProgressBar";

import { useSelector } from "react-redux";
// import LiveTranscription from "../components/LiveTranscription";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { CiCalendar } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdOndemandVideo } from "react-icons/md";
import { IoVideocamOffSharp } from "react-icons/io5";
import { useLiveTranscript } from "../GlobalState/customHooks/useLiveTranscript"
import {
  setInPersonMeetingTranscript,
  setIsMeetingEnd
} from "../GlobalState/features/liveTranscriptUISlice"
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function MainContent() {

  const [pdfContent, setPdfContent] = useState("");
  const [isDownloading, setIsDownloading] = useState(false); // New state variable
  const [isDownloadingtr, setIsDownloadingtr] = useState(false); // New state variable
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [transcript, setTranscript] = useState("")
  const [isInPersonMeetingStop, setIsInPersonMeetingStop] = useState(false)



  const myAudioFiles = useSelector((state) => state.audio.audioFiles);
  const transcriptionFiles = useSelector((state) => state.audio.typesTranscriptionFiles);

  const {
    smallFontSettings,
    handleSmallFontSizeChange,
    inPersonMeetingStates

  } = useLiveTranscript();

  let bgColor2 = smallFontSettings.bgColor
  let textColor2 = smallFontSettings.textColor


  const { liveTranscript, finalTranscript, transcriptType, meetingStatus, meetingError } = useSelector((state) => state.liveTranscript.virtualTranscript)



  const pdfContainer = useRef(null);


  const downloadPdf = async () => {
    setIsDownloadingtr(true);

    const pdfOptions = {
      margin: 10,

      filename: "combined_transcription.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },

    };

    try {
      const pdfContent = generatePdfContent(); // Call a function to generate the PDF content
      await html2pdf(pdfContent, pdfOptions);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloadingtr(false);
    }
  };
  const generatePdfContent = () => {
    return `
      <div class="py-20">
        ${transcriptionFiles.map((files, i) => `
          <div class="py-10" key=${i}>
            <div class="py-2">
              <p>Speaker A: ${files.speakerAUtterances.map((utterance) => utterance.text).join(" ")}</p>
              <p>Speaker B: ${files.speakerBUtterances.map((utterance) => utterance.text).join(" ")}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };



  const downloadAudio = async (url, filename) => {
    setIsDownloading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.target = "_blank"; // Add this line to open in a new tab or window

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading audio:", error);
    } finally {
      setIsDownloading(false);
    }
  };



  useEffect(() => {
    // Update the current date and time every second (1000 milliseconds)
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on mount

  // Function to generate the PDF content dynamically


  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleString('en-US', options);
  };




  // Downloading Summary PDF
  const downloadLiveTranscript = () => {
    const doc = new jsPDF();
    const fontSize = 12;
    doc.setFontSize(fontSize);
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 20;
    const textLines = doc.splitTextToSize(transcript, maxWidth);
    doc.text(textLines, 10, 10);
    doc.save(`liveTranscript.pdf`);
  };






  useEffect(() => {




    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        // Ignore messages from unknown origins for security
        return;
      }

      console.log("event data", event.data);



      if (event.data.type === 'STOP') {

        toast.success("Live Transcriptions End");
        setIsInPersonMeetingStop(true)
        const transcript = event.data.transcript
        console.log("transcript in postMessage:", transcript)
        setTranscript(transcript)
      }

    };

    window.addEventListener('message', handleMessage);

    // Cleanup function to clear the timer if the component unmounts or the effect runs again
    return () => {

      window.removeEventListener('message', handleMessage);
    };

  }, []);
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-scroll bg-bg-color-light min-h-screen " style={{
      scrollbarWidth: "thin",
      scrollbarColor: "transparent transparent",
    }}>
      <div className="flex flex-col gap-3 mx-4 my-6 p-10 text-white bg-blackGray   rounded-md">
        <p className="text-2xl pb-1 text-white font-semibold">Welcome back!</p>
        {/* <p>Captify is readying for take-off! </p> */}
        <div className="my-4">
          <ProgressBar />
        </div>
      </div>



      <div className="flex px-7 py-4  gap-4 t   max-[500px]:gap-1 max-[500px]:flex-col max-[500px]:items-start">
        <span className="flex gap-2 items-center text-2xl font-semibold ">

          <p>{formatDate(currentDateTime)}</p>
        </span>

      </div>
      {transcriptionFiles.length > 0 ? (
        transcriptionFiles.map((files, i) => (

          <div key={i} className="flex items-center justify-between bg-bg-navy-blue  my-2 px-7 p-5  rounded-md mx-4 gap-3">


            <div className="flex items-center  flex-col gap-2">

              <div className="  flex items-center gap-3">

                <p className="text-2xl"> Notes</p>

              </div>



            </div>



            <button disabled={isDownloadingtr} className="  bg-white hover:bg-slate-50 p-4 text-text-color-blue rounded-md w-fit" onClick={downloadPdf}>

              <span className="flex items-center gap-1 text-black font-semibold  "> <FaRegFilePdf /> {isDownloadingtr ? "Downloading..." : "Download File"}</span>
            </button>



          </div>
        ))
      ) : (
        <p></p>
      )}


      {/* live transcription */}
      {
        !transcriptType === null &&

        <div className="p-5">
          <p className="my-4 font-poppins text-xl font-semibold">Live Transcriptions</p>
          <div
            id="container-id"
            className="border-t  shadow-sm h-[300px] w-full flex font-sans px-2 my-2 relative"

          >
            <div className="w-full overflow-y-auto">
              {transcriptType === "final-transcript" ? (
                finalTranscript.map((data, i) => (
                  <div className="p-5 w-full gap-5" key={i}>
                    <p>{data.speaker}</p>
                    <div className="flex flex-wrap">
                      {data.words.map((word, j) => (
                        <p key={j} className="mr-2">
                          {word.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                transcriptType === "realtime" &&
                <div className="flex flex-wrap">
                  {liveTranscript.words.map((word, i) => (
                    <p key={i} className="mr-2">
                      {word.text}
                    </p>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      }
      <div className="  flex   flex-col gap-7 mx-4 my-4 p-5 px-7   bg-bg-navy-blue  rounded-md">
        <div className="flex flex-col gap-2">
          {myAudioFiles.length > 0 ? (
            myAudioFiles.map((audio, i) => (
              <div key={i} className="flex   flex-row justify-between gap-5">
                <div className="text-xl  flex items-center gap-5">
                  <p className="text-2xl"> Notes</p>
                </div>


                <button disabled={isDownloading} className="  bg-white  p-4 text-black rounded-md w-fit" onClick={() => downloadAudio(audio.text.cloudinaryFileUrl, `video_${i}.mp4`)}>

                  <span className="flex items-center gap-1"> <p className="font-semibold font-poppins text-black"> {isDownloading ? "Downloading..." : "Download Video"}</p>  <p><IoVideocamOffSharp /></p> </span>
                </button>

              </div>
            ))
          ) : (
            <p>No Audio & Video Files Yet</p>
          )}
        </div>

        {/* list of audio files */}
        {
          isInPersonMeetingStop &&    <Button className="w-52"  onClick={downloadLiveTranscript} variant = {"customPurple"}>Download Transcript</Button>
        }

     


        {/* <RecordingAudio /> */}
        {/* <LiveTranscription /> */}

      </div>
    </main>
  );
}

export default MainContent;
