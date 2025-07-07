import { useEffect, useState } from "react";
import axios from "axios";
import {
    Trash2, Eye, Repeat, RefreshCw, AlertCircle,
    CheckCircle, XCircle, Archive, Brain, Sparkles,
    BarChart3, Globe, Filter, Search, TrendingUp,
    Settings, Clock, RotateCcw, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components";


const apiUrl = import.meta.env.VITE_API_URL;

const HistoryAnalysis = () => {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rerunLoadingId, setRerunLoadingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("all");
    const [selectedModel, setSelectedModel] = useState("all");
    const [sortBy, setSortBy] = useState("date"); // Default sort by date
    const [viewMode, setViewMode] = useState("cards");
    const [showFilters, setShowFilters] = useState(false);
    const [flippedCards, setFlippedCards] = useState(new Set());

    const navigate = useNavigate();

    const fetchUserSearches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequestByUser`, {
                withCredentials: true,
            });
            console.log("✅ Loaded search history:", response.data);
            setSearches(response.data || []);
        } catch (err) {
            console.error("❌ Failed to load search history:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteSearch = async (id) => {
        if (!confirm("Are you sure you want to delete this analysis? This action cannot be undone.")) return;
        try {
            await axios.delete(`${apiUrl}/api/v1/search/deleteSearchById`, {
                params: { id },
                withCredentials: true
            });
            setSearches(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error("❌ Failed to delete search:", err);
        }
    };

    const rerunSearch = async (item) => {
        setRerunLoadingId(item._id);
        try {
            const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequest`, {
                params: {
                    search: item.searchQuery,
                    model: item.model,
                    platform: item.platform
                },
                withCredentials: true
            });
            const newId = response.data.searchRequestId;
            navigate(`/dashboard/sentiment-analysis?id=${newId}`);
        } catch (err) {
            console.error("❌ Failed to rerun analysis:", err);
            alert("Error rerunning analysis.");
        } finally {
            setRerunLoadingId(null);
        }
    };

    const viewSearch = (item) => {
        navigate(`/dashboard/sentiment-analysis?id=${item._id}`);
    };

    const platforms = ["all", "reddit", "twitter", "gnews"];
    const models = ["all", "VADER", "TextBlob", "GenAI"];

    // Apply filters first
    const filteredSearches = searches.filter(search => {
        const matchesQuery = search.searchQuery.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlatform = selectedPlatform === "all" || search.platform === selectedPlatform;
        const matchesModel = selectedModel === "all" || search.model === selectedModel;
        return matchesQuery && matchesPlatform && matchesModel;
    }).sort((a, b) => { // Then apply sorting
        if (sortBy === "date") {
            return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        }
        if (sortBy === "sentiment") {
            return b.averageSentimentScore - a.averageSentimentScore; // Highest sentiment first
        }
        if (sortBy === "posts") {
            return (b.totalPosts || 0) - (a.totalPosts || 0); // Most posts first
        }
        if (sortBy === "query") {
            return a.searchQuery.localeCompare(b.searchQuery); // Alphabetical by query
        }
        return 0; // No sorting
    });

    const getSentimentColor = (score) => {
        if (score >= 0.6) return "text-green-400";
        if (score >= 0.33 && score < 0.66) return "text-yellow-400";
        if (score > 0 && score < 0.33) return "text-red-400";
        return "text-red-400";
    };

    const getSentimentBg = (score) => {
        if (score >= 0.6) return "from-green-600/20 to-emerald-600/20";
        if (score >= 0.33 && score < 0.66) return "from-yellow-600/20 to-amber-600/20";
        if (score > 0 && score < 0.33) return "from-orange-600/20 to-red-600/20";
        return "from-red-600/20 to-pink-600/20";
    };

    const toggleCardFlip = (cardId) => {
        setFlippedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardId)) {
                newSet.delete(cardId);
            } else {
                newSet.add(cardId);
            }
            return newSet;
        });
    };

    const getDataStatusIcon = (item) => {
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

    const getDataStatusText = (item) => {
        if (typeof item.averageSentimentScore === "number" && item.totalPosts > 0) {
            return "Complete";
        }
        if (item.totalPosts > 0 || typeof item.averageSentimentScore === "number") {
            return "Partial";
        }
        return "No Data";
    };

    const getModelIcon = (model) => {
        switch (model) {
            case "VADER": return <Brain className="w-5 h-5 text-purple-400" />;
            case "TextBlob": return <BarChart3 className="w-5 h-5 text-cyan-400" />;
            case "GenAI": return <Sparkles className="w-5 h-5 text-pink-400" />;
            default: return <Settings className="w-5 h-5 text-gray-400" />;
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case "reddit": return <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>;
            case "twitter": return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>;
            case "gnews": return <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>;
            default: return <Globe className="w-5 h-5 text-gray-400" />;
        }
    };

    useEffect(() => {
        fetchUserSearches();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
                            <Archive className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Analysis History
                            </h1>
                            <p className="text-xl text-gray-300 mt-2">Manage and review your sentiment analysis results</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                                <input
                                    type="text"
                                    placeholder="Search your analyses..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${showFilters
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                                    }`}
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>

                            {/* View Mode Toggle */}
                            <div className="flex bg-slate-700/50 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("cards")}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === "cards"
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === "table"
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    Table
                                </button>
                            </div>
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-purple-400/20">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Platform</label>
                                        <select
                                            value={selectedPlatform}
                                            onChange={(e) => setSelectedPlatform(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            {platforms.map(platform => (
                                                <option key={platform} value={platform}>
                                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Model</label>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            {models.map(model => (
                                                <option key={model} value={model}>
                                                    {model.charAt(0).toUpperCase() + model.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            <option value="date">Date</option>
                                            <option value="sentiment">Sentiment Score</option>
                                            <option value="posts">Total Posts</option>
                                            <option value="query">Query</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-lg">Loading your analysis history...</p>
                    </div>
                ) : filteredSearches.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Archive className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Analysis Found</h3>
                        <p className="text-gray-400 text-lg mb-6">
                            {searchQuery || selectedPlatform !== "all" || selectedModel !== "all"
                                ? "No results match your current filters."
                                : "You haven't performed any sentiment analysis yet."}
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                            Start New Analysis
                        </button>
                    </div>
                ) : viewMode === "cards" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSearches.map((item) => (
                            <div
                                key={item._id}
                                className="relative h-[340px] w-full perspective-1000"
                            >
                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${flippedCards.has(item._id) ? 'rotate-y-180' : ''}`}>
                                    {/* Front Side */}
                                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {getPlatformIcon(item.platform)}
                                                <div>
                                                    <h3 className="text-lg font-bold text-white truncate">{item.searchQuery}</h3>
                                                    <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleCardFlip(item._id)}
                                                className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-all duration-300 group"
                                                title="View Details"
                                            >
                                                <Info className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                                            </button>
                                        </div>

                                        {/* Sentiment Score */}
                                        <div className={`bg-gradient-to-r ${getSentimentBg(item.averageSentimentScore)} rounded-xl p-4 mb-4`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-300">Sentiment Score</p>
                                                    <p className={`text-2xl font-bold ${getSentimentColor(item.averageSentimentScore)}`}>
                                                        {typeof item.averageSentimentScore === "number"
                                                            ? `${item.averageSentimentScore > 0 ? '+' : ''}${item.averageSentimentScore.toFixed(2)}`
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <TrendingUp className={`w-8 h-8 ${getSentimentColor(item.averageSentimentScore)}`} />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <p className="text-sm text-gray-400">Posts</p>
                                                <p className="text-lg font-bold text-white">{item.totalPosts?.toLocaleString() || 'N/A'}</p>
                                            </div>
                                            <div className="bg-slate-700/30 rounded-lg p-3 flex items-center gap-2">
                                                {getModelIcon(item.model)}
                                                <div>
                                                    <p className="text-sm text-gray-400">Model</p>
                                                    <p className="text-sm font-bold text-white">{item.model}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewSearch(item)}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => rerunSearch(item)}
                                                disabled={rerunLoadingId === item._id}
                                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {rerunLoadingId === item._id ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Repeat className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteSearch(item._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Back Side */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
                                        {/* Back Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-600/30 rounded-lg">
                                                    <BarChart3 className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">Analysis Details</h3>
                                                    <p className="text-sm text-gray-400">Extended Information</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleCardFlip(item._id)}
                                                className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-all duration-300 group"
                                                title="Back to Overview"
                                            >
                                                <RotateCcw className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                                            </button>
                                        </div>

                                        {/* Detailed Stats */}
                                        <div className="space-y-3 mb-4">
                                            
                                            
                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Platform</span>
                                                    <div className="flex items-center gap-2">
                                                        {getPlatformIcon(item.platform)}
                                                        <span className="text-sm font-semibold text-white capitalize">{item.platform}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Analysis Model</span>
                                                    <div className="flex items-center gap-2">
                                                        {getModelIcon(item.model)}
                                                        <span className="text-sm font-semibold text-white">{item.model}</span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Created</span>
                                                    <span className="text-sm font-semibold text-white">
                                                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Back Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewSearch(item)}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Full Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-400/30 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Query</th>
                                        <th className="px-6 py-4 text-left font-semibold">Platform</th>
                                        <th className="px-6 py-4 text-left font-semibold">Model</th>
                                        <th className="px-6 py-4 text-left font-semibold">Sentiment</th>
                                        <th className="px-6 py-4 text-left font-semibold">Posts</th>
                                        <th className="px-6 py-4 text-left font-semibold">Date</th>
                                        <th className="px-6 py-4 text-left font-semibold">Data Status</th>
                                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-400/20">
                                    {filteredSearches.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{item.searchQuery}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getPlatformIcon(item.platform)}
                                                    <span className="text-gray-300 capitalize">{item.platform}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getModelIcon(item.model)}
                                                    <span className="text-gray-300">{item.model}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${getSentimentColor(item.averageSentimentScore)}`}>
                                                    {typeof item.averageSentimentScore === "number"
                                                        ? `${item.averageSentimentScore > 0 ? '+' : ''}${item.averageSentimentScore.toFixed(2)}`
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{item.totalPosts?.toLocaleString() || 'N/A'}</td>
                                            <td className="px-6 py-4 text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getDataStatusIcon(item)}
                                                    <span className="text-gray-300">{getDataStatusText(item)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewSearch(item)}
                                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                                        title="View Analysis"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => rerunSearch(item)}
                                                        disabled={rerunLoadingId === item._id}
                                                        className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                                        title="Rerun Analysis"
                                                    >
                                                        {rerunLoadingId === item._id ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Repeat className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSearch(item._id)}
                                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                        title="Delete Analysis"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryAnalysis;