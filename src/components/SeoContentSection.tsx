import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  BarChart3,
  Share2,
  ChevronDown,
  Lock,
  CheckCircle2,
  Globe2,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'এই ইউআরএল শর্টনার কি সম্পূর্ণ ফ্রি? (Is it 100% Free?)',
    answer:
      'হ্যাঁ, এটি সম্পূর্ণ বিনামূল্যে ব্যবহার করা যায়। কোনো ক্রেডিট কার্ড বা পেমেন্ট ছাড়াই আপনি আনলিমিটেড দীর্ঘ লিঙ্ক শর্ট করতে পারবেন এবং রিয়েল-টাইম ভিজিটর ট্র্যাকিং দেখতে পারবেন।',
  },
  {
    question: 'ফেসবুক বা সোশ্যাল মিডিয়ায় লিঙ্ক ব্যান হওয়া থেকে কীভাবে বাঁচায়?',
    answer:
      'সোশ্যাল মিডিয়া সাধারণত সরাসরি স্প্যামি বা বারবার পোস্ট করা রিডাইরেক্ট লিঙ্ক ব্লক করে। আমাদের প্ল্যাটফর্ম মধ্যবর্তী ৫ সেকেন্ডের একটি সুরক্ষিত ভেরিফিকেশন পেজ ব্যবহার করে যা স্বয়ংক্রিয় বট স্ক্র্যাপার ফিল্টার করে এবং আসল লিঙ্কের রেপুটেশন বজায় রাখতে সাহায্য করে।',
  },
  {
    question: '৫ সেকেন্ডের কাউন্টডাউন পেজের সুবিধা কী?',
    answer:
      'কাউন্টডাউন পেজ ভিজিটরদের একটি নিরাপদ প্রিভিউ দেয়, ফিশিং বা ম্যালওয়্যার থেকে রক্ষা করে এবং কনটেন্ট ক্রিয়েটর ও মার্কেটারদের বিজ্ঞাপনী স্পেস বা ব্র্যন্ডিং প্রদর্শনের সুযোগ তৈরি করে দেয়।',
  },
  {
    question: 'আমি কি আমার শর্ট লিঙ্কের ক্লিক অ্যানালিটিক্স দেখতে পারব?',
    answer:
      'অবশ্যই! প্রতিটি শর্ট লিঙ্কের সাথেই একটি ডেডিকেটেড অ্যানালিটিক্স পেজ তৈরি হয় (/stats/shortCode), যেখানে মোট ক্লিক, দৈনিক ট্রাফিক এবং রেফারার বিস্তারিত দেখতে পারবেন।',
  },
  {
    question: 'শর্ট করা লিঙ্কের কি কোনো মেয়াদ (Expiration) থাকে?',
    answer:
      'না, লিঙ্কগুলোর কোনো মেয়াদ শেষ হয় না। এগুলো স্থায়ীভাবে সংরক্ষিত থাকে যাতে আপনি দীর্ঘমেয়াদে যেকোনো প্ল্যাটফর্মে নিশ্চিন্তে ব্যবহার করতে পারেন।',
  },
];

export const SeoContentSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="mt-14 space-y-12 border-t border-zinc-800/80 pt-12">
      {/* 1. How It Works Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সহজ ও কার্যকর পদ্ধতি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            কীভাবে ব্যবহার করবেন (How It Works)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            মাত্র ৩টি সাধারণ ধাপে যেকোনো দীর্ঘ লিঙ্ককে সুরক্ষিত ও সংক্ষিপ্ত করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3 border border-emerald-800/30">
              ১
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              ইউআরএল পেস্ট করুন
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              আপনার ইউটিউব ভিডিও, ফেসবুক পোস্ট, অ্যাফিলিয়েট বা ব্লগের বড় লিঙ্কটি ইনপুট বক্সে পেস্ট করুন।
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3 border border-emerald-800/30">
              ২
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              সুরক্ষিত শর্ট লিঙ্ক তৈরি
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              এক ক্লিকে তৈরি হবে নিরাপদ ছোট লিঙ্ক, যাতে স্বয়ংক্রিয় ৫ সেকেন্ড কাউন্টডাউন রিডাইরেকশন যুক্ত থাকে।
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3 border border-emerald-800/30">
              ৩
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              শেয়ার ও অ্যানালিটিক্স ট্র্যাক
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ফেসবুক, টুইটার, টেলিগ্রামসহ সব সোশ্যাল মিডিয়ায় শেয়ার করুন এবং কতজন ক্লিক করছে তা লাইভ দেখুন।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Features & SEO Value */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800 p-6 sm:p-8">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
            কেন আমাদের সুরক্ষিত ইউআরএল শর্টনার বেছে নেবেন?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            সাধারণ শর্টনারের চেয়ে আরও বেশি নিরাপদ, দীর্ঘস্থায়ী এবং সোশ্যাল মিডিয়া-বান্ধব
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                অ্যান্টি-ব্যান প্রটেকশন (Anti-Ban Ready)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                সোশ্যাল মিডিয়ায় সরাসরি ডোমেইন ফ্ল্যাগ হওয়া থেকে রক্ষা করতে প্রটেক্টেড ট্রানজিশন পেজ কাজ করে।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="p-2.5 rounded-lg bg-teal-950/60 border border-teal-800/50 text-teal-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                লাইভ ট্রাফিক অ্যানালিটিক্স
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ভিজিটররা কতবার ক্লিক করেছে, কোন সময় ক্লিক হয়েছে তা স্পষ্ট চার্ট ও সংখ্যায় দেখতে পাবেন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                দ্রুত ও বিজ্ঞাপন-বান্ধব রিডাইরেকশন
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                কাউন্টডাউনের সাথে সাথে যেকোনো অ্যাড স্পেস প্রদর্শনের পারফেক্ট সুযোগ তৈরি হয়।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                সব প্ল্যাটফর্মে সহজে শেয়ারযোগ্য
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Facebook, WhatsApp, YouTube Description, Instagram Bio এবং Twitter/X-এ ব্যবহারের জন্য অপটিমাইজড।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Frequently Asked Questions (FAQ) Section - Google FAQ Rich Snippets */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            লিঙ্ক শর্টনার ও এর ব্যবহার নিয়ে সাধারণ কিছু প্রশ্নের উত্তর
          </p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 text-sm font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
