import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

// Example FAQ data
const FAQ_DATA: FAQItem[] = [
  { id: 1, question: "What is SmartISP?", answer: "SmartISP is a comprehensive solution for managing your internet service provider business, offering tools for customer management, billing, and support.", category: "General" },
  { id: 2, question: "How do I contact support?", answer: "You can contact support via the Help & Support page or by emailing support@smartisp.com.", category: "General" },
  { id: 3, question: "What are the system requirements?", answer: "SmartISP works on any modern web browser and does not require installation.", category: "General" },
  { id: 4, question: "How do I view my invoices?", answer: "You can view your invoices in the 'Billing' section of the admin panel. Invoices are listed with details such as date, amount, and status.", category: "Billing" },
  { id: 5, question: "What payment methods are accepted?", answer: "We accept credit cards, bank transfers, and selected e-wallets.", category: "Billing" },
  { id: 6, question: "How do I submit a support ticket?", answer: "To submit a support ticket, navigate to the 'Support' section and click on 'New Ticket'. Fill out the required information and submit your request.", category: "Support" },
  { id: 7, question: "What is the average response time?", answer: "Our average response time is within 24 hours on business days.", category: "Support" },
];

const FAQPage: React.FC = () => {
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
      <div className="mb-3">
        <button
          onClick={() => setOpenId(isOpen ? null : faq.id)}
          className={`flex justify-between items-center w-full text-left px-6 py-4 rounded-lg transition-colors font-medium text-base ${
            isOpen
              ? "bg-sky-50 text-sky-700"
              : "bg-sky-50 text-gray-800 hover:bg-sky-100"
          }`}
          aria-expanded={isOpen}
        >
          <span className="font-medium text-base">{faq.question}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180 text-sky-600" : "text-gray-400"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-sky-50 rounded-b-lg ${
            isOpen ? "max-h-[500px] opacity-100 px-6 pb-4" : "max-h-0 opacity-0 px-6"
          }`}
        >
          <p className="text-gray-700 text-sm">{faq.answer}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>

      {/* Search Input */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-sky-50 border-0 rounded-lg focus:ring-2 focus:ring-sky-400 focus:bg-white transition-colors text-base"
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-10">
        {Object.keys(groupedFaqs).map((category) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
            <div>
              {groupedFaqs[category].map((faq) => (
                <AccordionItem key={faq.id} faq={faq} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <p className="text-left text-gray-500 mt-6 text-base">No FAQs match your search term.</p>
      )}
    </div>
  );
};

export default FAQPage;
