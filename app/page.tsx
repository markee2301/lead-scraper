"use client";

import { FormEvent, useState } from "react";

type Lead = {
  title: string;
  emails: string;
  phones: string;
  website: string;
  address: string;
  totalScore: number;
};

export default function Home() {
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleDownloadCsv = () => {
    if (!leads.length) return;

    const headers = [
      "Title",
      "Email",
      "Phone",
      "Website",
      "Address",
      "Total Score",
    ];
    const rows = leads.map((lead) => [
      lead.title,
      lead.emails,
      lead.phones,
      lead.website,
      lead.address,
      String(lead.totalScore),
    ]);

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!niche.trim() || !location.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Lead API error:", data);
        setStatus("error");
        return;
      }

      const payload = (data?.leads ?? data) as Lead[] | undefined;
      setLeads(Array.isArray(payload) ? payload : []);

      setStatus("success");
      setNiche("");
      setLocation("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0c1a12] via-[#08130c] to-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <section className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-[#98D8C8]">
            LeadScraper
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-white sm:text-4xl">
            Pinpoint the right prospects in minutes.
          </h1>
          <p className="text-base text-white/70">
            Enter a niche and a location to generate leads.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-6 sm:grid-cols-2"
          aria-label="Lead search form"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="niche"
              className="text-sm font-medium uppercase tracking-wide text-[#98D8C8]"
            >
              Niche
            </label>
            <input
              id="niche"
              type="text"
              placeholder="e.g., Boutique fitness studios"
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#0B6623] focus:outline-none focus:ring-2 focus:ring-[#0B6623]/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="location"
              className="text-sm font-medium uppercase tracking-wide text-[#98D8C8]"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Austin, TX"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#0B6623] focus:outline-none focus:ring-2 focus:ring-[#0B6623]/30"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#0B6623] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#0c4f1b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Generating..." : "Generate Leads"}
            </button>
          </div>
        </form>

        {isSubmitting && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#98D8C8]/10 bg-black/30 px-6 py-4 text-center text-xs text-white/70">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#98D8C8]/40 border-t-[#98D8C8]" />
            </div>
            <p className="font-medium uppercase tracking-wide text-[#98D8C8]">
              Generating leads
            </p>
            <p className="max-w-sm text-[0.7rem] text-white/60">
              This can take up to a few minutes depending on the amount of
              leads. Feel free to keep this tab open while we collect and score
              prospects.
            </p>
          </div>
        )}

        {status && (
          <p
            className={`text-sm ${
              status === "success" ? "text-[#98D8C8]" : "text-red-300"
            }`}
          >
            {status === "success"
              ? "Leads generated successfully."
              : "Server error. Try again."}
          </p>
        )}

        {leads.length > 0 && (
          <section className="mt-4 space-y-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="text-lg font-semibold text-white">
                Leads ({leads.length})
              </h2>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center rounded-full border border-[#98D8C8]/60 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#98D8C8] transition hover:border-[#98D8C8] hover:bg-black/40"
              >
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Website</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={`${lead.title}-${index}`}
                      className={index % 2 === 0 ? "bg-white/0" : "bg-white/5"}
                    >
                      <td className="px-4 py-3 text-white">{lead.title}</td>
                      <td className="px-4 py-3">{lead.emails}</td>
                      <td className="px-4 py-3">{lead.phones}</td>
                      <td className="px-4 py-3">
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#98D8C8] underline underline-offset-4"
                        >
                          {lead.website}
                        </a>
                      </td>
                      <td className="px-4 py-3">{lead.address}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#98D8C8]">
                        {lead.totalScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
