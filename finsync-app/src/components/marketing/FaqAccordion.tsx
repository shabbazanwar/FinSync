"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineChevronDown } from "react-icons/hi";

const FAQS = [
  {
    question: "Is FinSync free to use?",
    answer: "Yes. Creating an account is free and no card is required.",
  },
  {
    question: "Do you connect to my bank account?",
    answer:
      "No. FinSync doesn't link to your bank — you log transactions yourself, so your banking credentials never touch this app.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Passwords are hashed with bcrypt and never stored in plain text, and every request is scoped to your account only.",
  },
  {
    question: "What currency does FinSync use?",
    answer: "FinSync currently tracks everything in Nigerian Naira (₦).",
  },
  {
    question: "What can I actually track?",
    answer:
      "Income and expenses, monthly budgets by category, savings goals, recurring subscriptions, investments and net worth, plus a 12-month balance forecast.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-medium text-gray-900">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 shrink-0 text-gray-400"
              >
                <HiOutlineChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-gray-500">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
