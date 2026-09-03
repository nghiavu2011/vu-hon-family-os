/**
 * Dịch vụ Âm Thanh Di Sản & Nhạc Thiền Chữa Lành (Peaceful Healing & Meditation Audio)
 * - Tích hợp các bản nhạc thiền bản quyền miễn phí (Creative Commons CC-BY): Peaceful Healing & Zen Calmant.
 * - Bộ gõ Chuông Khánh Thiền 432Hz tự sinh bằng Web Audio API khi dâng hương hoặc tĩnh tâm.
 */

export const MEDITATION_TRACKS = [
  {
    id: 'peaceful-healing',
    title: '🌿 Peaceful Healing (Thiền Chữa Lành & Tĩnh Tâm)',
    artist: 'Kevin MacLeod (Creative Commons CC-BY 4.0)',
    src: '/assets/audio/peaceful-healing.mp3',
    desc: 'Giai điệu piano và ambient êm dịu, sâu lắng, thư giãn tuyệt đối cho tâm trí.',
  },
  {
    id: 'zen-calmant',
    title: '🪷 Zen Calmant (Thanh Tịnh Chốn Từ Đường)',
    artist: 'Kevin MacLeod (Creative Commons CC-BY 4.0)',
    src: '/assets/audio/zen-calmant.mp3',
    desc: 'Âm hưởng nhẹ nhàng, thoát tục như mây trôi nước chảy, an định gia phong.',
  },
];

let audioElement = null;
let currentTrackId = 'peaceful-healing';
let currentVolume = 0.4;
let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Tiếng Chuông Khánh Thiền 432Hz ngân vang
 */
export function playTempleBell() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreq = 432;

  const harmonics = [
    { mult: 1.0, gain: 0.6, decay: 4.5 },
    { mult: 2.01, gain: 0.35, decay: 3.8 },
    { mult: 3.02, gain: 0.2, decay: 2.8 },
    { mult: 4.24, gain: 0.12, decay: 1.9 },
    { mult: 0.5, gain: 0.25, decay: 5.0 },
  ];

  harmonics.forEach(({ mult, gain, decay }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * mult, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain * 0.45, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay);
  });
}

/**
 * Lấy hoặc khởi tạo đối tượng HTML5 Audio cho nhạc thiền
 */
function getAudioElement() {
  if (!audioElement && typeof window !== 'undefined') {
    audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = currentVolume;
  }
  return audioElement;
}

/**
 * Bắt đầu phát bản nhạc thiền
 */
export async function playMeditationTrack(trackId = currentTrackId) {
  const audio = getAudioElement();
  if (!audio) return;

  const track = MEDITATION_TRACKS.find((t) => t.id === trackId) || MEDITATION_TRACKS[0];
  currentTrackId = track.id;

  // Nếu chuyển bài hoặc chưa có src
  if (audio.src !== window.location.origin + track.src && !audio.src.endsWith(track.src)) {
    audio.src = track.src;
  }

  audio.volume = currentVolume;

  try {
    await audio.play();
    return true;
  } catch (err) {
    console.warn('Yêu cầu người dùng chạm màn hình để phát âm thanh:', err);
    return false;
  }
}

/**
 * Tạm dừng phát nhạc
 */
export function pauseMeditation() {
  if (audioElement) {
    audioElement.pause();
  }
}

/**
 * Kiểm tra trạng thái đang phát
 */
export function isAudioPlaying() {
  return audioElement ? !audioElement.paused : false;
}

/**
 * Đổi âm lượng (0 đến 100%)
 */
export function setAudioVolume(volumePercent) {
  currentVolume = Math.max(0, Math.min(1, volumePercent / 100));
  if (audioElement) {
    audioElement.volume = currentVolume;
  }
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(currentVolume * 0.5, audioCtx.currentTime);
  }
}

export function getCurrentTrackId() {
  return currentTrackId;
}

// Giữ tương thích ngược với các lệnh gọi cũ
export function startPentatonicAmbience() {
  return playMeditationTrack('peaceful-healing');
}

export function stopPentatonicAmbience() {
  pauseMeditation();
}
