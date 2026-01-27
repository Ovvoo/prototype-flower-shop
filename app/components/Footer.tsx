/**
 * Footer Component
 * Футер с ссылками на контентные страницы и информацией о компании
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Информация',
      links: [
        { href: '/about', label: 'О компании', external: false },
        { href: '/delivery', label: 'Доставка и оплата', external: false },
        { href: '/care', label: 'Уход за цветами', external: false },
        { href: '/contacts', label: 'Контакты', external: false },
      ],
    },
    {
      title: 'Каталог',
      links: [
        { href: '/catalog', label: 'Все товары', external: false },
        { href: '/catalog?category=bukety', label: 'Букеты', external: false },
        { href: '/catalog?category=komnatnye-rasteniya', label: 'Растения', external: false },
        { href: '/catalog?category=podarki', label: 'Подарки', external: false },
      ],
    },
    {
      title: 'Контакты',
      links: [
        { href: 'tel:+74951234567', label: '+7 (495) 123-45-67', external: true },
        { href: 'mailto:info@flowershop.ru', label: 'info@flowershop.ru', external: true },
      ],
      text: [
        'г. Москва, ул. Тверская, 12',
        'Ежедневно с 9:00 до 21:00',
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="hover:text-pink-400 transition"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-pink-400 transition">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {section.text && (
                <div className="mt-4 space-y-1 text-sm">
                  {section.text.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Цветочный магазин. Все права защищены.
            </p>
            <div className="flex gap-4">
              <a
                href="https://vk.com/flowershop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
                aria-label="ВКонтакте"
              >
                ВК
              </a>
              <a
                href="https://instagram.com/flowershop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://t.me/flowershop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
                aria-label="Telegram"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
