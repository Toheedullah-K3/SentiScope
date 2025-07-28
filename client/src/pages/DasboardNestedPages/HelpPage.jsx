import { useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Mail, 
  MessageSquare,
  BookOpen,
  Sparkles,
  Rocket,
  Settings,
} from "lucide-react";

import { FeatureCard, Accordion } from "@/components";
import { faqs, features } from "@/components/data";


const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faqs");


  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "faqs", label: "FAQs", icon: MessageSquare },
    { id: "features", label: "Features", icon: Sparkles },
    { id: "guides", label: "Guides", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
              <LifeBuoy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-xl text-gray-300 mt-2">Your gateway to mastering sentiment analysis</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-purple-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm text-lg shadow-xl"
                placeholder="Search help topics, features, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-purple-400/30 shadow-2xl">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === "faqs" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-300 text-lg">
                Everything you need to know about our sentiment analysis platform
              </p>
            </div>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => (
                  <Accordion key={idx} title={faq.question} icon={faq.icon}>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </Accordion>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No help topics matched your search.</p>
                <p className="text-gray-500">Try different keywords or browse our features.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "features" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Platform Features
              </h2>
              <p className="text-gray-300 text-lg">
                Discover the powerful capabilities of our sentiment analysis platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "guides" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Quick Start Guides
              </h2>
              <p className="text-gray-300 text-lg">
                Step-by-step tutorials to get you started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Getting Started</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Create your first sentiment analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Understanding sentiment scores
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Interpreting results and insights
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Advanced Features</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Custom model configuration
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Multi-platform comparisons
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Data export and reporting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Need More Help?</h3>
              </div>
              <p className="text-gray-300 text-lg">
                Can't find what you're looking for? Our support team is here to help!
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <a
                href="mailto:support@sentiscope.app"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;