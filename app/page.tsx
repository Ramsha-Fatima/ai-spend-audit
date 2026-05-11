import SpendForm from "./components/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12 mt-10">
          <h1 className="text-5xl font-bold mb-4">
            AI Spend Auditor
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover how much your startup is
            overspending on AI tools and get
            instant savings recommendations.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white text-black rounded-2xl shadow-2xl p-8">
          <SpendForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-400 text-sm">
          Built for smarter AI infrastructure
          spending.
        </div>
      </div>
    </main>
  );
}
