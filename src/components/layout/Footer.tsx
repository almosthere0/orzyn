import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Communities", "Challenges", "Schools"],
    Company: ["About", "Careers", "Blog", "Press"],
    Resources: ["Help Center", "Guidelines", "Safety", "Privacy"],
    Legal: ["Terms", "Privacy Policy", "Cookie Policy"],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-card-foreground">
                CampusConnect
              </span>
            </a>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The ultimate student community platform. Connect, compete, and conquer campus life.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-card-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 mt-12 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2026 CampusConnect. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💚 for students worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
