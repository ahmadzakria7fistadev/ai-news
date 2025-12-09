import { Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-[#030014] pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] text-white mb-4">
              AI News Desk
            </h2>
            <p className="text-gray-400 max-w-sm">
              Empowering the next generation of information consumption with autonomous AI agents. The future is automated.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4 text-gray-400">
              {['Features', 'Integrations', 'Pricing', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4 text-gray-400">
              {['About', 'Careers', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 AI News Desk. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-500 hover:text-cyan-400 hover:scale-110 transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
