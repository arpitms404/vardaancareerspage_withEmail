import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Apply() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/apply", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("Your application has been submitted successfully!");
      setIsSuccess(true);
      setOpen(true);
      e.currentTarget.reset();
    } else {
      setMessage(result.message || "Something went wrong. Please try again.");
      setIsSuccess(false);
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Apply for Staff Nurse</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" required className="border p-2 w-full" />
          <input type="email" name="email" placeholder="Email Address" required className="border p-2 w-full" />
          <input type="text" name="phone" placeholder="Phone Number" required className="border p-2 w-full" />
          <input type="text" name="experience" placeholder="Years of Experience" required className="border p-2 w-full" />
          <input type="text" name="qualifications" placeholder="Qualifications" required className="border p-2 w-full" />
          <textarea name="coverLetter" placeholder="Tell us why you're interested" className="border p-2 w-full" />
          <input type="file" name="resume" required className="border p-2 w-full" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Application
          </button>
        </form>
      </div>

      {/* ✅ Success/Error Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSuccess ? "✅ Success" : "❌ Error"}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
