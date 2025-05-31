import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getProposals, deleteProposal, downloadProposalPDF, downloadProposalDOCX } from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError("");
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await getProposals(token);
        setProposals(res.data);
      } catch (err: any) {
        setError("Failed to load proposals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this proposal?")) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await deleteProposal(id, token);
      setProposals(proposals.filter(p => p.id !== id));
    } catch {
      setError("Failed to delete proposal.");
    }
  };

  const handleDownload = async (id: string, type: "pdf" | "docx") => {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    const res = type === "pdf"
      ? await downloadProposalPDF(id, token)
      : await downloadProposalDOCX(id, token);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `proposal.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Proposals</h2>
        <button
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <button
        className="mb-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => navigate("/proposal/new")}
      >
        + New Proposal
      </button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <ul>
          {proposals.length === 0 && (
            <li className="text-gray-500">No proposals found.</li>
          )}
          {proposals.map(p => (
            <li
              key={p.id}
              className="bg-white rounded shadow p-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-bold text-lg">{p.projectTitle}</div>
                <div className="text-gray-600">{p.clientName} &mdash; {p.industry}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => handleDownload(p.id, "pdf")}
                >
                  PDF
                </button>
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  onClick={() => handleDownload(p.id, "docx")}
                >
                  DOCX
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}