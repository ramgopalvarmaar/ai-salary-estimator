"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import ParticlesBackground from "./ParticlesBackground";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

export default function Home() {
  const [file, setFile] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    if (!city.trim()) {
      alert("Please enter a city.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("city", city);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>AI Salary Estimator | Discover Your Worth in the Job Market</title>
        <meta
          name="description"
          content="Upload your resume, specify your city, and let our AI calculate your estimated salary. Perfect for professionals and job seekers worldwide."
        />
        <meta
          name="keywords"
          content="AI salary estimator, job market worth, resume salary calculator, salary prediction tool, AI resume analysis, salary estimation tool"
        />
        <meta name="author" content="AI Innovations" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AI Salary Estimator" />
        <meta
          property="og:description"
          content="Upload your resume, specify your city, and let our AI calculate your estimated salary."
        />
        <meta property="og:image" content="/social-image.jpg" />
        <meta property="og:url" content="https://your-website-url.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Salary Estimator" />
        <meta
          name="twitter:description"
          content="Discover your worth in the job market with our AI-driven salary estimator."
        />
        <meta name="twitter:image" content="/social-image.jpg" />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 text-white">
        {/* Add TSParticles Background */}
        {/*<ParticlesBackground />*/}
        <Analytics />

        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-lg p-8">
            <motion.h1
              className="text-4xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              AI-Powered Salary Estimator
            </motion.h1>
            <motion.p
              className="text-gray-400 mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              Upload your resume, enter your city, and let AI calculate your
              worth in the job market.
            </motion.p>
            <div className="flex flex-col gap-4">
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-purple-600 py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <CloudArrowUpIcon className="h-6 w-6" />
                  {file ? file.name : "Upload Resume"}
                </label>
              </motion.div>
              <input
                type="text"
                placeholder="Enter your city"
                className="py-3 px-6 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <motion.button
                className={`${
                  loading
                    ? "bg-gray-600"
                    : "bg-purple-600 hover:bg-purple-700"
                } py-3 px-6 rounded-lg font-bold transition duration-300`}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Processing..." : "Estimate Salary"}
              </motion.button>
            </div>
            {response && (
              <motion.div
                className="mt-8 bg-gray-700 p-6 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold">
                  Estimated Salary Range:
                </h2>
                <p className="mt-2">{response}</p>
              </motion.div>
            )}

            {/* FAQ Section */}
            <div className="mt-8 bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="text-gray-400">
                <h4 className="text-lg font-semibold mb-2">
                  1. How does the AI salary estimator work?
                </h4>
                <p className="mb-4">
                  Our tool analyzes your resume using advanced AI algorithms and
                  compares it against job market data to provide salary
                  estimates tailored to your skills and location.
                </p>
                <h4 className="text-lg font-semibold mb-2">
                  2. Is my data secure?
                </h4>
                <p className="mb-4">
                  Yes, your data is processed securely and never shared with
                  third parties.
                </p>
                <h4 className="text-lg font-semibold mb-2">
                  3. Can I use this tool for free?
                </h4>
                <p>
                  Absolutely! Our AI salary estimator is completely free to use
                  for all users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
