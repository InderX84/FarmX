import { useState } from 'react';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const faqs = [
    {
      question: "How do I download mods?",
      answer: "Browse our mod collection, click on any mod you like, and hit the download button. Free mods download instantly!"
    },
    {
      question: "How do I upload my own mods?",
      answer: "Create an account, go to your dashboard, and click 'Create Mod'. Fill in the details and upload your files."
    },
    {
      question: "Are all mods free?",
      answer: "Most mods are free, but some creators offer premium mods. You can contact the admin for paid mods."
    },
    {
      question: "How do I install mods in Farming Simulator?",
      answer: "Download the mod file and place it in your Farming Simulator mods folder. The game will automatically detect it."
    }
  ];

  const guides = {
    'getting-started': {
      title: 'Getting Started',
      content: [
        { step: 1, title: 'Create Account', desc: 'Sign up for a free FarmX account' },
        { step: 2, title: 'Browse Mods', desc: 'Explore our collection of farming mods' },
        { step: 3, title: 'Download', desc: 'Click download on any free mod' },
        { step: 4, title: 'Install', desc: 'Place files in your FS mods folder' }
      ]
    },
    'uploading': {
      title: 'Uploading Mods',
      content: [
        { step: 1, title: 'Dashboard', desc: 'Go to your user dashboard' },
        { step: 2, title: 'Create Mod', desc: 'Click the "Create Mod" button' },
        { step: 3, title: 'Fill Details', desc: 'Add title, description, and images' },
        { step: 4, title: 'Upload File', desc: 'Upload your mod file or add download link' }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      content: [
        { step: 1, title: 'Mod Not Working', desc: 'Check if mod is compatible with your FS version' },
        { step: 2, title: 'Download Issues', desc: 'Try refreshing the page or clearing browser cache' },
        { step: 3, title: 'Upload Problems', desc: 'Ensure file size is under 100MB and correct format' },
        { step: 4, title: 'Account Issues', desc: 'Contact support if you can\'t access your account' }
      ]
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about FarmX
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 rounded-2xl">
            {Object.entries(guides).map(([key, guide]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === key
                    ? 'bg-green-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {guide.title}
              </button>
            ))}
          </div>
        </div>

        {/* Guide Content */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {guides[activeTab].title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides[activeTab].content.map((item) => (
              <div key={item.step} className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;