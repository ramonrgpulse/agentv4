import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { BrutalButton } from './ui/BrutalButton';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Produtos',
      links: [
        { name: 'Agente de Criação de Avatar', href: '/produtos/agente-criacao-avatar' },
        { name: 'Método RG Pulse', href: '/produtos/metodo-rg-pulse' },
        { name: 'Consultoria', href: '/servicos/consultoria' },
        { name: 'Cursos', href: '/cursos' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Carreiras', href: '/carreiras' },
        { name: 'Blog', href: 'https://blog.rgpulse.com', target: '_blank', rel: 'noopener noreferrer' },
        { name: 'Contato', href: '/contato' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { name: 'Central de Ajuda', href: '/ajuda' },
        { name: 'Termos de Uso', href: '/termos-de-uso' },
        { name: 'Política de Privacidade', href: '/politica-de-privacidade' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/rgpulse', target: '_blank', rel: 'noopener noreferrer' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/rgpulse', target: '_blank', rel: 'noopener noreferrer' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/rgpulse', target: '_blank', rel: 'noopener noreferrer' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/rgpulse', target: '_blank', rel: 'noopener noreferrer' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/rgpulse', target: '_blank', rel: 'noopener noreferrer' },
  ];

  return (
    <footer className="bg-brutal-darker text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-brutal-red to-brutal-orange bg-clip-text text-transparent">
                RG PULSE
              </span>
            </div>
            <p className="text-brutal-gray-300 mb-6">
              Transformando a forma como você entende e se conecta com seu público-alvo através de inteligência artificial avançada.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brutal-gray-300 hover:text-white transition-colors duration-200"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links do rodapé */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-lg mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-brutal-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-brutal-red/10 to-brutal-orange/10 rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Assine nossa newsletter</h3>
            <p className="text-brutal-gray-300 mb-6 max-w-2xl mx-auto">
              Receba atualizações, ofertas exclusivas e dicas valiosas diretamente na sua caixa de entrada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-6 py-3 rounded-lg border border-brutal-dark/20 bg-brutal-dark/30 text-white placeholder-brutal-gray-400 focus:outline-none focus:ring-2 focus:ring-brutal-red/50"
              />
              <BrutalButton variant="primary" className="whitespace-nowrap">
                Assinar
              </BrutalButton>
            </div>
          </div>
        </div>

        {/* Direitos autorais */}
        <div className="border-t border-brutal-dark pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-brutal-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} RG Pulse. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-brutal-gray-400 hover:text-white text-sm">
              Termos de Uso
            </a>
            <a href="#" className="text-brutal-gray-400 hover:text-white text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-brutal-gray-400 hover:text-white text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
