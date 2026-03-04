import { Github, Instagram, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Divisória */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Conteúdo Principal */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Texto de Divulgação */}
          <div>
            <h3 className="text-2xl font-bold text-wedding-400 mb-3">
              Gostou do site?
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Este site foi desenvolvido por <span className="font-semibold text-white">Nathan Araújo</span>.
              Se você está planejando seu casamento e quer um site personalizado como este,
              entre em contato comigo!
            </p>
          </div>

          {/* Links de Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-wedding-300">Entre em contato:</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/5537998562612"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <MessageCircle size={20} />
                <span className="font-medium text-sm">WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/nathan_araujos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Instagram size={20} />
                <span className="font-medium text-sm">Instagram</span>
              </a>

              {/* Email */}
              <a
                href="mailto:nathansaraujo191@gmail.com"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Mail size={20} />
                <span className="font-medium text-sm">Email</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/natharaujos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Github size={20} />
                <span className="font-medium text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Desenvolvido por{' '}
            <a 
              href="https://github.com/natharaujos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wedding-400 hover:text-wedding-300 font-semibold transition-colors"
            >
              Nathan Araújo
            </a>
            {' '}• Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
