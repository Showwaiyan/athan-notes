import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#37352f]">
            Athan Notes
          </h1>
          <LogoutButton />
        </div>
        
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
          <h2 className="text-xl font-medium text-[#37352f] mb-4">
            Welcome to Athan Notes
          </h2>
          <p className="text-[#787774] mb-6">
            You are successfully authenticated. This is the home page where you will be able to record Burmese voice notes, 
            transcribe them with Gemini AI, and save them to Notion.
          </p>
          <div className="bg-[#f7f6f3] rounded-lg p-4 border border-[#e0e0e0]">
            <p className="text-sm text-[#787774]">
              <strong className="text-[#37352f]">Next Steps:</strong> Voice recording and AI transcription features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
