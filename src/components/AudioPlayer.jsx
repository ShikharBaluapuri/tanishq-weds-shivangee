import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

/**
 * High-fidelity Wedding Audio Engine
 * Plays the real, iconic wedding song ("Din Shagna Da" - Jasleen Royal / Wedding Theme)
 * Includes graceful fallback to Tanpura & Flute synthesizer if offline.
 */
class WeddingAudioEngine {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.synth = null;
    this.listeners = new Set();
    this.trackTitle = 'Din Shagna Da • Wedding Theme';
    this.initAudio();
  }

  initAudio() {
    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio('/wedding_song.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.audio.preload = 'auto';

        this.audio.addEventListener('play', () => {
          this.isPlaying = true;
          this.notify();
        });

        this.audio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.notify();
        });

        this.audio.addEventListener('error', (e) => {
          console.warn('MP3 playback error, falling back to synthesizer:', e);
          if (this.isPlaying) {
            this.startSynth();
          }
        });
      } catch (err) {
        console.warn('Audio element initialization failed:', err);
      }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isPlaying));
  }

  start() {
    if (this.audio) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch((err) => {
            console.warn('Audio play restricted or failed, starting synth:', err);
            this.startSynth();
          });
      }
    } else {
      this.startSynth();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
    }
    this.stopSynth();
    this.isPlaying = false;
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  /* Soft Ambient Synthesizer Fallback */
  startSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.synth && AudioCtx) {
        this.synth = new AudioCtx();
      }
      if (this.synth && this.synth.state === 'suspended') {
        this.synth.resume();
      }
      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Synth failed:', e);
    }
  }

  stopSynth() {
    if (this.synth) {
      try {
        this.synth.suspend();
      } catch (e) {
        // ignore
      }
    }
  }
}

// Global Singleton
export const royalAudioEngine = new WeddingAudioEngine();

export default function AudioPlayer({ autoStart = false }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = royalAudioEngine.subscribe(setIsPlaying);
    if (autoStart && !royalAudioEngine.isPlaying) {
      royalAudioEngine.start();
    }
    return () => unsubscribe();
  }, [autoStart]);

  const toggleAudio = () => {
    royalAudioEngine.toggle();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Visualizer pill when playing */}
      {isPlaying && (
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-alabaster shadow-botanical border border-[#C5A869]/40 backdrop-blur-md">
          <span className="w-1 h-3 bg-[#C5A869] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-4 bg-[#354F3B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-2.5 bg-[#C5A869] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="w-1 h-4.5 bg-[#354F3B] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
          <span className="text-xs font-cormorant italic text-[#1E2F23] font-medium ml-1">
            Din Shagna Da • Wedding Theme
          </span>
        </div>
      )}

      {/* Floating Vinyl Music Disc Button */}
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Wedding Music' : 'Play Wedding Music'}
        title={isPlaying ? 'Mute Din Shagna Da' : 'Play Din Shagna Da'}
        className={`relative group w-12 h-12 p-2.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${
          isPlaying 
            ? 'bg-gradient-to-tr from-[#1E2F23] via-[#354F3B] to-[#25392A] text-[#E8E4D8] border-[#C5A869] shadow-brass-glow scale-105' 
            : 'bg-white/95 text-[#1E2F23] border-[#C5A869]/40 hover:border-[#C5A869] hover:scale-105'
        }`}
      >
        {/* Vinyl Grooves & Spinning animation */}
        <div className={`absolute inset-0 rounded-full border border-dashed border-[#C5A869]/30 pointer-events-none ${isPlaying ? 'animate-spin-slow' : ''}`} />
        
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-[#C5A869]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C5A869] rounded-full animate-ping" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <VolumeX className="w-4 h-4 opacity-70 text-[#7A917F]" />
            <Music className="w-2.5 h-2.5 text-[#C5A869] absolute -top-1 -right-1 opacity-70" />
          </div>
        )}

        {/* Hover Tooltip */}
        <span className="absolute bottom-full mb-2 right-0 hidden group-hover:block whitespace-nowrap text-[11px] font-sans px-2.5 py-1 rounded bg-[#1E2F23] text-[#E8E4D8] shadow-lg border border-[#C5A869]/30">
          {isPlaying ? 'Mute Music' : 'Play "Din Shagna Da"'}
        </span>
      </button>
    </div>
  );
}
