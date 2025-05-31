import React, { useState } from "react";
import { auth } from "../firebase";
import { createProposal } from "../api";
import { useNavigate } from "react-router-dom";

export default function ProposalForm() {
  const [fields, setFields] = useState({
    clientName: "",
    industry: "",
    projectTitle: "",
    timeline: "",
    techStack: "",
    modules: "",
    goals: "",
    tone: "",
    budget: "",
    stakeholders: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (Object.values(fields).some(v => !v)) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      await createProposal(fields, token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">New Project Proposal</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="clientName"
            placeholder="Client Name"
            value={fields.clientName}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="industry"
            placeholder="Industry"
            value={fields.industry}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="projectTitle"
            placeholder="Project Title"
            value={fields.projectTitle}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="timeline"
            placeholder="Timeline"
            value={fields.timeline}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="techStack"
            placeholder="Technology Stack"
            value={fields.techStack}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="modules"
            placeholder="Modules"
            value={fields.modules}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="goals"
            placeholder="Goals"
            value={fields.goals}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="tone"
            placeholder="Tone (e.g., Formal, Friendly)"
            value={fields.tone}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="budget"
            placeholder="Budget"
            value={fields.budget}
            onChange={handleChange}
            required
          />
          <input
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="stakeholders"
            placeholder="Stakeholders"
            value={fields.stakeholders}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Proposal"}
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}