import "./VideoSection.css";

export default function VideoSection() {
  return (
    <div className="video-section-container">
      <video
        className="video-section-video"
        controls
        poster="https://via.placeholder.com/800x450"
      >
        <source src="your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className="video-section-button">Try it now</button>
    </div>
  );
}
