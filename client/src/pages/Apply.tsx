import React, { useState } from "react";

export default function Apply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      // ⚠️ Agar response JSON nahi hua to safely parse karo
      let result: any = {};
      try {
        result = await response.json();
      } catch (e) {
        console.warn("⚠️ Response was not JSON:", e);
      }

      if (response.ok) {
        setMessage("✅ Your application has been submitted successfully!");
        e.currentTarget.reset();
      } else {
        setMessage("❌ " + (result.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("❌ Frontend error:", error);
      setMessage("❌ Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Apply for Staff Nurse</h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            className="border p-2 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="experience"
            placeholder="Years of Experience"
            required
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="qualifications"
            placeholder="Qualifications"
            required
            className="border p-2 w-full"
          />
          <textarea
            name="coverLetter"
            placeholder="Tell us why you're interested"
            className="border p-2 w-full"
          />
          <input
            type="file"
            name="resume"
            required
            className="border p-2 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
