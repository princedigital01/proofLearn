
import { platformLinks, connectLinks,resourceLinks } from "@/constants"
import { BookOpen} from "lucide-react"
import Link from "next/link"




const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info (Static) */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <BookOpen className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-xl font-bold">Learn on Cardano</span>
            </Link>
            <p className="text-sm text-gray-400">
              Decentralized education for a better future, secured by the Cardano blockchain.
            </p>
          </div>

          {/* Column 2: Platform Links (Data-driven) */}
          <div>
            <h3 className="font-semibold mb-4 tracking-wider uppercase text-sm text-gray-300">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resource Links (Data-driven) */}
          <div>
            <h3 className="font-semibold mb-4 tracking-wider uppercase text-sm text-gray-300">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect Links (Data-driven with Icons) */}
          <div>
            <h3 className="font-semibold mb-4 tracking-wider uppercase text-sm text-gray-300">Connect</h3>
            <ul className="space-y-3">
              {connectLinks.map(({ id, title, href, Icon }) => (
                <li key={id}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Learn on Cardano. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer