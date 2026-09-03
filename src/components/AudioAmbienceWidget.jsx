import { useState } from 'react';
import {
  MEDITATION_TRACKS,
  playMeditationTrack,
  pauseMeditation,
  playTempleBell,
  setAudioVolume,
  getCurrentTrackId,
} from '../services/heritageAudioService.js';

export default function AudioAmbienceWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(getCurrentTrackId());
  const [bellRinging, setBellRinging] = useState(false);
  const [volume, setVolume] = useState(50);
  const [expanded, setExpanded] = useState(false);

  const activeTrackObj = MEDITATION_TRACKS.find((t) => t.id === selectedTrack) || MEDITATION_TRACKS[0];

  const toggleMusic = async () => {
    if (isPlaying) {
      pauseMeditation();
      setIsPlaying(false);
    } else {
      const ok = await playMeditationTrack(selectedTrack);
      if (ok) setIsPlaying(true);
    }
  };

  const handleSelectTrack = async (trackId) => {
    setSelectedTrack(trackId);
    if (isPlaying) {
      await playMeditationTrack(trackId);
    }
  };

  const handleRingBell = () => {
    playTempleBell();
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 2000);
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    setAudioVolume(val);
  };

  return (
    <div className="audioWidgetContainer" aria-label="Không gian âm nhạc di sản">
      {expanded && (
        <div className="audioControlPopup">
          <div className="audioPopupHead">
            <span>🎵 Nhạc Thiền Chữa Lành (Peaceful Healing)</span>
            <button type="button" className="closeAudioBtn" onClick={() => setExpanded(false)}>✕</button>
          </div>
          <p className="audioPopupSub">
            Âm nhạc thiền định không bản quyền (Creative Commons CC-BY 4.0) giúp tâm hồn an yên, thanh tịnh.
          </p>

          {/* Chọn bản nhạc */}
          <div className="trackSelectGroup">
            <span className="trackGroupLabel">Chọn giai điệu:</span>
            {MEDITATION_TRACKS.map((track) => (
              <button
                key={track.id}
                type="button"
                className={`trackOptionBtn ${selectedTrack === track.id ? 'activeTrack' : ''}`}
                onClick={() => handleSelectTrack(track.id)}
              >
                <strong>{track.title}</strong>
                <span>{track.desc}</span>
              </button>
            ))}
          </div>

          <div className="audioPopupActions">
            <button
              type="button"
              className={`btn primary smallBtn audioPlayBtn ${isPlaying ? 'playing' : ''}`}
              onClick={toggleMusic}
            >
              {isPlaying ? '⏸ Tạm dừng Nhạc Thiền' : '▶️ Bật Nhạc Thiền Chữa Lành'}
            </button>
            <button
              type="button"
              className={`btn smallBtn bellRingBtn ${bellRinging ? 'ringing' : ''}`}
              onClick={handleRingBell}
              title="Gõ một tiếng chuông tĩnh tâm"
            >
              🔔 {bellRinging ? 'Đang ngân...' : 'Thỉnh Chuông Khánh 432Hz'}
            </button>
          </div>

          <div className="volumeRow">
            <span>Âm lượng:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volumeSlider"
            />
            <span>{volume}%</span>
          </div>

          <div className="audioCreditText">
            Nguồn: {activeTrackObj.artist}
          </div>
        </div>
      )}

      {/* Button kích hoạt trên thanh công cụ / góc màn hình */}
      <div className="audioTriggerRow">
        <button
          type="button"
          className={`audioPillBtn ${isPlaying ? 'activePlaying' : ''}`}
          onClick={toggleMusic}
          title={isPlaying ? `Đang phát: ${activeTrackObj.title} (Bấm để tạm dừng)` : 'Bật nhạc thiền Peaceful Healing'}
        >
          {isPlaying ? (
            <>
              <span className="equalizerBars">
                <span className="eqBar" />
                <span className="eqBar" />
                <span className="eqBar" />
              </span>
              <span>🌿 Đang phát Nhạc Thiền</span>
            </>
          ) : (
            <>
              <span>🎵 Nhạc Thiền</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={`bellQuickBtn ${bellRinging ? 'ringing' : ''}`}
          onClick={handleRingBell}
          title="Thỉnh một tiếng chuông khánh thiền"
        >
          🔔
        </button>

        <button
          type="button"
          className="audioExpandBtn"
          onClick={() => setExpanded(!expanded)}
          title="Tùy chỉnh bản nhạc & âm lượng"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
