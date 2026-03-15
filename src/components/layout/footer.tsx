import { Logo, LogoImage, LogoText } from "@/components/shadcnblocks/logo";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url?: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "/assets/logoImage.svg",
    alt: "logo",
    title: "Niramoy",
    url: "/",
  },
  className,
  tagline = "Trusted online pharmacy providing quality medicines and healthcare services at your doorstep. We care for your well-being.",
  menuItems = [
    {
      title: "Quick links",
      links: [
        { text: "Home", url: "/" },
        { text: "Medicines", url: "/medicines" },
        { text: "Pharmacies", url: "/shop" }
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Shipping Info" },
        { text: "Cash On Delivery(COD)" },
        { text: "Track Order" },
        { text: "Fast Delivery" }
      ],
    },
    {
      title: "Seller",
      links: [
        { text: "Become a Seller", url: "#" },
        { text: "Add Medicine on Niramoy", url: "#" }
      ],
    },
  ],
  copyright = "© 2026 Niramoy.com. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: FooterProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo url="/">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 dark:invert"
                  />
                  <LogoText className="text-xl">{logo.title}</LogoText>
                </Logo>
              </div>
              <p className="mt-4 text-muted-foreground">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-center gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
