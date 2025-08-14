import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import ReelSkeleton from "./ReelSkeleton"; // adjust path if needed

const baseQueries = ["funny hindi", "comedy hindi", "hindi song", "dance hindi"];
const MAX_RESULTS = 10;

function Reels() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const videoRefs = useRef([]);
  const playerRefs = useRef([]);
  const observers = useRef([]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  const fetchVideos = async () => {
    if (loading) return;
    setLoading(true);

    const emojis = ["🔥", "😂", "🎶", "💃", "🤣", "😍"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const uniqueSeed = Math.random().toString(36).substring(7);
    const query = `${baseQueries[queryIndex]} ${randomEmoji} ${uniqueSeed}`;

    try {
      const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
          part: "snippet",
          q: query,
          type: "video",
          maxResults: MAX_RESULTS,
          videoDuration: "short",
          pageToken,
        },
      });

      const newVideos = res.data.items
        .map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
        }))
        .filter((v) => !videos.find((prev) => prev.id === v.id));

      setVideos((prev) => [...prev, ...newVideos]);
      setPageToken(res.data.nextPageToken || "");
      setQueryIndex((i) => (i + 1) % baseQueries.length);
    } catch (err) {
      console.error("YouTube API Error:", err);
      alert("Failed to load reels. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/reels") {
      setVideos([]);
      setPageToken("");
      setQueryIndex(0);
      setLoading(false);
      setTimeout(fetchVideos, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const trigger = document.getElementById("load-more-trigger");
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) fetchVideos();
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      videos.forEach((video, idx) => {
        const iframe = videoRefs.current[idx];
        if (!iframe) return;

        const player = new window.YT.Player(iframe, {
          events: {
            onReady: () => {
              playerRefs.current[idx] = player;
              setupIntersectionObserver(idx, player);
            },
          },
        });
      });
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      observers.current.forEach((observer) => observer.disconnect());
    };
  }, [videos]);

  const setupIntersectionObserver = (idx, player) => {
    const el = videoRefs.current[idx];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
          player.playVideo();
          pauseOthers(idx);
        } else {
          player.pauseVideo();
        }
      },
      { threshold: 0.7 }
    );
    observer.observe(el);
    observers.current.push(observer);
  };

  const pauseOthers = (currentIndex) => {
    playerRefs.current.forEach((player, idx) => {
      if (player && idx !== currentIndex) player.pauseVideo();
    });
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-white text-black">
      {videos.map((video, idx) => (
        <div
          key={video.id}
          className="h-screen w-full snap-start relative flex justify-center items-center"
        >
          <div className="absolute inset-0 w-full h-full flex justify-center items-center">
            <div
              className="relative w-full h-full max-w-[500px] bg-black"
              style={{ aspectRatio: "9/16" }}
            >
              <iframe
                ref={(el) => (videoRefs.current[idx] = el)}
                className="absolute inset-0 w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=0&playsinline=1&loop=1&playlist=${video.id}&rel=0`}
                title={video.title}
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Bottom Info (Black BG, White Text) */}
              <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white">
                <h3 className="font-semibold">@{video.channel}</h3>
                <p className="text-sm">{video.title}</p>
              </div>

              {/* Buttons */}
              <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center text-white">
                <button className="hover:scale-110 transition">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm">120</span>
                </button>
                <button className="hover:scale-110 transition">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm">34</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Skeleton loaders */}
      {loading && [...Array(2)].map((_, i) => <ReelSkeleton key={i} />)}

      <div id="load-more-trigger" className="w-full h-20" />
    </div>
  );
}

export default Reels;
