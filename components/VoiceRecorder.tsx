'use client'

import { useState, useRef, useEffect } from 'react'

type RecordingState = 'idle' | 'recording' | 'paused' | 'processing' | 'completed' | 'error'

interface ProcessedNote {
  title: string
  content: string
  category: string
  categoryIcon?: string
  tags: string[]
  notionUrl?: string
}

const MAX_DURATION = 15 * 60 // 15 minutes in seconds

export default function VoiceRecorder() {
  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  // Processing state
  const [processedNote, setProcessedNote] = useState<ProcessedNote | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup function
  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  // Start recording
  const startRecording = async () => {
    try {
      setError(null)
      setProcessedNote(null)
      setDuration(0)
      audioChunksRef.current = []

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        cleanup()
      }

      // Start recording
      mediaRecorder.start()
      setRecordingState('recording')

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1
          
          // Auto-stop at max duration
          if (newDuration >= MAX_DURATION) {
            stopRecording()
            return MAX_DURATION
          }
          
          return newDuration
        })
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone. Please check your permissions.')
      setRecordingState('error')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setRecordingState('idle')
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState('paused')
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState('recording')
      
      // Restart timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1
          
          if (newDuration >= MAX_DURATION) {
            stopRecording()
            return MAX_DURATION
          }
          
          return newDuration
        })
      }, 1000)
    }
  }

  // Process audio
  const processAudio = async () => {
    if (!audioBlob) return

    setRecordingState('processing')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audio')
      }

      setProcessedNote(data)
      setRecordingState('completed')

    } catch (err) {
      console.error('Error processing audio:', err)
      setError(err instanceof Error ? err.message : 'Failed to process audio')
      setRecordingState('error')
    }
  }

  // Reset to start new recording
  const reset = () => {
    setRecordingState('idle')
    setDuration(0)
    setAudioBlob(null)
    setProcessedNote(null)
    setError(null)
    audioChunksRef.current = []
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Recording Section */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
        <h2 className="text-xl font-medium text-[#37352f] mb-6">
          🎙️ Record Voice Note
        </h2>

        {/* Duration Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-mono text-[#37352f] mb-2">
            {formatDuration(duration)}
          </div>
          <div className="text-sm text-[#787774]">
            Max: {formatDuration(MAX_DURATION)}
          </div>
        </div>

        {/* Recording Indicator */}
        {recordingState === 'recording' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#37352f]">Recording...</span>
          </div>
        )}

        {recordingState === 'paused' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium text-[#37352f]">Paused</span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          {recordingState === 'idle' && !audioBlob && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-[#37352f] text-white rounded-lg font-medium hover:bg-[#2e2c28] transition-colors"
            >
              Start Recording
            </button>
          )}

          {recordingState === 'recording' && (
            <>
              <button
                onClick={pauseRecording}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Pause
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            </>
          )}

          {recordingState === 'paused' && (
            <>
              <button
                onClick={resumeRecording}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Resume
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            </>
          )}

          {recordingState === 'idle' && audioBlob && (
            <>
              <button
                onClick={processAudio}
                className="px-6 py-3 bg-[#37352f] text-white rounded-lg font-medium hover:bg-[#2e2c28] transition-colors"
              >
                Process & Save to Notion
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-[#37352f] border border-[#e0e0e0] rounded-lg font-medium hover:bg-[#f7f6f3] transition-colors"
              >
                Discard
              </button>
            </>
          )}

          {recordingState === 'processing' && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#37352f] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#37352f] font-medium">Processing with Gemini AI...</span>
            </div>
          )}

          {recordingState === 'completed' && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#37352f] text-white rounded-lg font-medium hover:bg-[#2e2c28] transition-colors"
            >
              Record New Note
            </button>
          )}

          {recordingState === 'error' && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#37352f] text-white rounded-lg font-medium hover:bg-[#2e2c28] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      {/* Result Display */}
      {processedNote && (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-[#37352f]">
              ✅ Note Saved to Notion
            </h2>
            {processedNote.notionUrl && (
              <a
                href={processedNote.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#37352f] text-white text-sm rounded-lg hover:bg-[#2e2c28] transition-colors"
              >
                Open in Notion
              </a>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <div className="text-sm font-medium text-[#787774] mb-1">Title</div>
            <div className="text-2xl font-semibold text-[#37352f]">
              {processedNote.title}
            </div>
          </div>

          {/* Category & Tags */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#787774]">Category:</span>
              <span className="px-3 py-1 bg-[#f7f6f3] border border-[#e0e0e0] rounded-full text-sm font-medium text-[#37352f]">
                {processedNote.categoryIcon && `${processedNote.categoryIcon} `}{processedNote.category}
              </span>
            </div>
            
            {processedNote.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#787774]">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {processedNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#f7f6f3] border border-[#e0e0e0] rounded text-xs text-[#37352f]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="text-sm font-medium text-[#787774] mb-2">Content</div>
            <div className="p-4 bg-[#f7f6f3] border border-[#e0e0e0] rounded-lg">
              <p className="text-[#37352f] whitespace-pre-wrap leading-relaxed">
                {processedNote.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
