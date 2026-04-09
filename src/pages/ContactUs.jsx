import React from "react";
import { Button, Input, TopBar } from "../components/UI";
import NavBar from "../components/NavBar";
import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Mail } from 'lucide-react';
import Footer from "../components/Footer";

export default function ContactPage({ navigate }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-24">

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-surface-900 mb-2">
            Get in touch
          </h2>
          <p className="text-surface-500 text-sm">
            Have a question or need help? We’re here for you.
          </p>
        </div>

        {/* Quick Contact */}
        <div className="bg-surface-800/50 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <Phone size={15} className="w-5 h-5 text-surface-500" />
            </div>
            <div>
              <div className="text-sm text-surface-900 font-medium">Phone</div>
              <div className="text-xs text-surface-400">+250 7XX XXX XXX</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <Mail size={15} className="w-5 h-5 text-surface-500"/>
            </div>
            <div>
              <div className="text-sm text-surface-900 font-medium">Email</div>
              <div className="text-xs text-surface-400">
                support@ikinamba.com
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <MapPin size={15} className="w-5 h-5 text-surface-500"/>
            </div>
            <div>
              <div className="text-sm text-surface-900 font-medium">Location</div>
              <div className="text-xs text-surface-400">
                Kigali, Rwanda
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-surface-400 mb-3">
            Send us a message
          </h3>

          <div className="space-y-4">
            <Input placeholder="Your name" />
            <Input placeholder="Your email" />

            <textarea
              rows={4}
              placeholder="Type your message..."
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-3 text-surface-900 placeholder:text-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
            Send Message →
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}