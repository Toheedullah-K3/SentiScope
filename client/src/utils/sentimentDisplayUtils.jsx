import { CheckCircle, AlertCircle, XCircle, Brain, BarChart3, Sparkles, Settings, Globe } from 'lucide-react';

export const getSentimentColor = (score) => {
    if (score >= 0.6) return "text-green-400";
    if (score >= 0.33 && score < 0.66) return "text-yellow-400";
    if (score > 0 && score < 0.33) return "text-red-400";
    return "text-red-400";
};

export const getSentimentBg = (score) => {
    if (score >= 0.6) return "from-green-600/20 to-emerald-600/20";
    if (score >= 0.33 && score < 0.66) return "from-yellow-600/20 to-amber-600/20";
    if (score > 0 && score < 0.33) return "from-orange-600/20 to-red-600/20";
    return "from-red-600/20 to-pink-600/20";
};


export const getDataStatusIcon = (item) => {
    // Check if we have sentiment data
    if (typeof item.averageSentimentScore === "number" && item.totalPosts > 0) {
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    // Check if we have partial data
    if (item.totalPosts > 0 || typeof item.averageSentimentScore === "number") {
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
    // No data available
    return <XCircle className="w-5 h-5 text-red-400" />;
};

export const getDataStatusText = (item) => {
    if (typeof item.averageSentimentScore === "number" && item.totalPosts > 0) {
        return "Complete";
    }
    if (item.totalPosts > 0 || typeof item.averageSentimentScore === "number") {
        return "Partial";
    }
    return "No Data";
};

export const getModelIcon = (model) => {
    switch (model) {
        case "VADER": return <Brain className="w-5 h-5 text-purple-400" />;
        case "TextBlob": return <BarChart3 className="w-5 h-5 text-cyan-400" />;
        case "GenAI": return <Sparkles className="w-5 h-5 text-pink-400" />;
        default: return <Settings className="w-5 h-5 text-gray-400" />;
    }
};

export const getPlatformIcon = (platform) => {
    switch (platform) {
        case "reddit": return <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>;
        case "twitter": return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>;
        case "gnews": return <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>;
        default: return <Globe className="w-5 h-5 text-gray-400" />;
    }
};