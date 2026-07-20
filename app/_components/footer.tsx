import { Film, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#4338CA] text-white px-6 py-10 md:px-16 mt-[51px]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            <span className="font-bold italic text-lg">Movie Z</span>
          </div>
          <p className="text-sm text-white/80">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/90">Contact Information</p>

          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 mt-1 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Email:</p>
              <p className="text-white/80">support@movieZ.com</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 mt-1 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Phone:</p>
              <p className="text-white/80">+976 (11) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/90">Follow us</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white/70 transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Youtube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
