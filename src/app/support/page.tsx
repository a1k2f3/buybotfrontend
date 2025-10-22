"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRobot, FaEnvelopeOpenText, FaCommentDots, FaQuestionCircle } from "react-icons/fa";

interface SupportOption {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

const supportOptions: SupportOption[] = [
  {
    title: "Chatbot Support",
    description: "Instantly get help from our smart AI assistant 24/7.",
    icon: FaRobot,
    color: "text-blue-600",
    link: "/support/aichatbot",
  },
  {
    title: "Contact Us",
    description: "Have a question or issue? Reach our support team directly.",
    icon: FaEnvelopeOpenText,
    color: "text-green-600",
    link: "/support/contact",
  },
  {
    title: "Feedback",
    description: "Share your thoughts and help us improve your experience.",
    icon: FaCommentDots,
    color: "text-pink-600",
    link: "/support/feedback",
  },
  {
    title: "FAQs",
    description: "Find quick answers to the most common questions.",
    icon: FaQuestionCircle,
    color: "text-yellow-600",
    link: "/support/faq",
  },
];

export default function SupportPage() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-16 px-6 md:px-20 min-h-[90vh] flex flex-col items-center">
      {/* ✅ Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Welcome to Support</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        {/* <p>It&apos;s time to get help.</p> */}
  We're&apos; here to help! Choose a support option below to get assistance, leave feedback, or find answers.
        </p>
      </motion.div>

      {/* ✅ Support Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {supportOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 flex flex-col items-center text-center border border-transparent hover:border-blue-200"
            >
              <Link href={option.link} className="flex flex-col items-center w-full">
                <Icon className={`text-5xl mb-4 ${option.color}`} />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
