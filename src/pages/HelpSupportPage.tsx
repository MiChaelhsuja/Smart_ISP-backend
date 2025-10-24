import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-bold text-sky-700 mb-4">{children}</h2>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-10 shadow-md w-full ${className}`}>
    {children}
  </div>
);

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

// Sample FAQ data
const FAQ_DATA: FAQItem[] = [
  { id: 1, question: "How do I reset my password?", answer: "Go to settings and click 'Reset Password'.", category: "Account" },
  { id: 2, question: "How to contact support?", answer: "Email support@example.com or call 123-456-7890.", category: "Support" },
  { id: 3, question: "How do I update my profile?", answer: "Navigate to your profile settings and edit details.", category: "Account" },
];

const HelpSupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = useMemo(
    () =>
      FAQ_DATA.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const groupedFaqs = useMemo(() => {
    return filteredFaqs.reduce((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQItem[]>);
  }, [filteredFaqs]);

  const AccordionItem: React.FC<{ faq: FAQItem }> = ({ faq }) => {
    const isOpen = openId === faq.id;
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => setOpenId(isOpen ? null : faq.id)}
          className="flex justify-between items-center w-full text-left py-4 px-4 bg-white hover:bg-sky-50 transition-colors rounded-lg shadow-sm"
          aria-expanded={isOpen}
        >
          <span className={`font-medium ${isOpen ? "text-sky-600" : "text-gray-800"}`}>
            {faq.question}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180 text-sky-600" : "text-gray-400"}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100 pt-2 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-gray-600 px-4 text-sm">{faq.answer}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen space-y-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4 text-left">Help & Support</h1>

      {/* Fullscreen Contact Form (Left Aligned) */}
      <Card className="h-[90vh] flex flex-col justify-start items-start">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-left">Contact Us</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Enter the subject"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Enter your message"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={6}
              />
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Card>

      {/* FAQ Section */}
      <SectionTitle>Frequently Asked Questions</SectionTitle>

      <div className="relative w-full max-w-3xl mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {Object.keys(groupedFaqs).map((category) => (
        <Card key={category} className="w-full max-w-5xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left">{category}</h3>
          <div className="divide-y divide-gray-100">
            {groupedFaqs[category].map((faq) => (
              <AccordionItem key={faq.id} faq={faq} />
            ))}
          </div>
        </Card>
      ))}

      {filteredFaqs.length === 0 && (
        <p className="text-left text-gray-500 mt-6">No FAQs match your search term.</p>
      )}
    </div>
  );
};

export default HelpSupportPage;
