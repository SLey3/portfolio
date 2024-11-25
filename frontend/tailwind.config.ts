import type { Config } from 'tailwindcss';
import flowbite from 'flowbite-react/tailwind';
import animatePlugin from 'tailwindcss-animate';


export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  prefix: '',
  theme: {
  	extend: {
  		backgroundImage: {
  			newspaper: "url('/src/assets/newspaper.jpg')"
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			cyanglow: 'cyanglow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		content: {
  			link: ' →"'
  		},
  		fontFamily: {
  			barlow: 'Barlow, sans-serif',
  			poppins: 'Poppins, sans-serif',
  			'ibm-plex-serif': 'IBM Plex Serif", serif',
  			'cormorant-garamond': 'Cormorant Garamond", serif'
  		},
  		keyframes: {
  			cyanglow: {
  				'0%': {
  					opacity: '0.9',
  					color: '#164e63',
  					boxShadow: '0 0 10px #164e63'
  				},
  				'50%': {
  					opacity: '1',
  					color: '#0891b2',
  					boxShadow: '0 0 10px #0891b2'
  				},
  				'100%': {
  					opacity: '0.9',
  					color: '#164e63',
  					boxShadow: '0 0 10px #164e63'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		textDecorationThickness: {
  			'3': '3px'
  		}
  	}
  },
  plugins: [
    flowbite.plugin(),
    animatePlugin,
	],
} satisfies Config;
