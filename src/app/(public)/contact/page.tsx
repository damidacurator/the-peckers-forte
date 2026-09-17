"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, CheckCircle2, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    "https://formspree.io/f/moeqgrqd";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to: "admin@thepeckerfortelp.com",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
          type: "success",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        const errorData = await response.json().catch(() => null);
        toast({
          title: "Submission Error",
          description:
            errorData?.errors?.[0]?.message ||
            "Unable to send message right now. Please reach out to admin@thepeckerfortelp.com or WhatsApp +2348037221344.",
          type: "error",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Failed to connect to form service. Please check your internet connection.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-brand-bg">
      <div className="bg-brand-darkBlue py-20 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-brand-gold">We'd love to hear from you</p>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Our Office</h3>
                  <p className="text-gray-600 text-sm">
                    123 Cooperative Way,
                    <br />
                    Victoria Island,
                    <br />
                    Lagos, Nigeria
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-600">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">WhatsApp & Phone</h3>
                  <p className="text-gray-600 text-sm">
                    <a
                      href="https://wa.me/2348037221344"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                    >
                      +234 803 722 1344
                    </a>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/2348037221344"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                    >
                      WhatsApp Chat
                    </a>
                    <a
                      href="tel:+2348037221344"
                      className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
                    >
                      Call Us
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">
                    <a
                      href="mailto:admin@thepeckerfortelp.com"
                      className="hover:text-brand-blue font-medium break-all"
                    >
                      admin@thepeckerfortelp.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Direct message delivered securely to our executive inbox at admin@thepeckerfortelp.com.
                </p>

                {submitted && (
                  <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Thank you for your message!</p>
                      <p className="text-xs text-green-700 mt-1">
                        We have received your email via Formspree and will review it promptly.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="subject"
                    label="Subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="message"
                    label="Message"
                    placeholder="Type your message here..."
                    className="min-h-[150px]"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending Message...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
