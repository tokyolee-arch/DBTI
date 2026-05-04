import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EE",
        coral: "#FF7A45",
        "coral-dark": "#E5663B",
        brand: "#4F6BED",
        "brand-dark": "#3950C9",
        slate: {
          DEFAULT: "#2D3142",
          ink: "#2D3142",
          soft: "#5C6076",
          mute: "#9094A8",
        },
        line: "#EAE3D2",
      },
      fontFamily: {
        sans: ["var(--font-gowun-dodum)", "system-ui", "sans-serif"],
        display: ["var(--font-black-han-sans)", "system-ui", "sans-serif"],
        accent: ["var(--font-do-hyeon)", "system-ui", "sans-serif"],
        serif: ["var(--font-gowun-batang)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 16px rgba(45,49,66,0.08)",
        coral: "0 8px 24px rgba(255,122,69,0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.45s ease-out both",
        "slide-up": "slideUp 0.4s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
