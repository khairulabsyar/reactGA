import Extra from "../components/Extra";
import ReactMediaRecord from "../components/ReactMediaRecord";
import RecordRTC from "../components/RecordRTC";
import VideoRecorder from "../components/VideoRecorder";

export default function Index() {
  return (
    <>
      {/* <VideoRecorder />
      <ReactMediaRecord />
      <Extra /> */}
      <RecordRTC />
      <p id='zero-state'>This is the homepage to test Google Analytics</p>
    </>
  );
}
