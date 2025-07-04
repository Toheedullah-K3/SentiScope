import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye, Repeat, Edit2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const HistoryAnalysis = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserSearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequestByUser`, {
        withCredentials: true,
      });
      setSearches(response.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${apiUrl}/api/v1/search/deleteSearchById`, {
        params: { id },
        withCredentials: true,
      });
      setSearches(searches.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const rerunSearch = (item) => {
    navigate(`/dashboard/sentiment-analysis?id=${item._id}`);
  };

  const viewSearch = (item) => {
    navigate(`/dashboard/sentiment-analysis?id=${item._id}`);
  };

  const editSearch = (item) => {
    // Optional: open modal or redirect to editable form with pre-filled values
    alert("Edit not implemented yet.");
  };

  useEffect(() => {
    fetchUserSearches();
  }, []);

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">🕘 History & Saved Analysis</h1>
      {loading ? (
        <p className="text-gray-400">Loading search history...</p>
      ) : searches.length === 0 ? (
        <p className="text-gray-400 italic">No previous analysis found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-400 border border-gray-700">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2">Query</th>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searches.map((item) => (
                <tr key={item._id} className="border-t border-gray-700">
                  <td className="px-4 py-2 font-bold">{item.searchQuery}</td>
                  <td className="px-4 py-2">{item.platform}</td>
                  <td className="px-4 py-2">{item.model}</td>
                  <td className="px-4 py-2">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <Button onClick={() => viewSearch(item)} size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => rerunSearch(item)} size="sm">
                      <Repeat className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => editSearch(item)} size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => deleteSearch(item._id)} size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryAnalysis;
