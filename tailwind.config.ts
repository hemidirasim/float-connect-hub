
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
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
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'none',
						color: '#374151',
						h1: {
							color: '#111827',
							fontWeight: '700',
							fontSize: '2.25rem',
							marginTop: '2rem',
							marginBottom: '1rem',
						},
						h2: {
							color: '#111827',
							fontWeight: '600',
							fontSize: '1.875rem',
							marginTop: '2rem',
							marginBottom: '1rem',
						},
						h3: {
							color: '#111827',
							fontWeight: '600',
							fontSize: '1.5rem',
							marginTop: '1.5rem',
							marginBottom: '0.75rem',
						},
						p: {
							marginTop: '1.25rem',
							marginBottom: '1.25rem',
							lineHeight: '1.75',
							textAlign: 'justify',
						},
						a: {
							color: '#2563eb',
							textDecoration: 'none',
							'&:hover': {
								color: '#1d4ed8',
								textDecoration: 'underline',
							},
						},
						strong: {
							color: '#111827',
							fontWeight: '600',
						},
						ul: {
							marginTop: '1.25rem',
							marginBottom: '1.25rem',
						},
						ol: {
							marginTop: '1.25rem',
							marginBottom: '1.25rem',
						},
						li: {
							marginTop: '0.5rem',
							marginBottom: '0.5rem',
						},
						blockquote: {
							borderLeftWidth: '4px',
							borderLeftColor: '#3b82f6',
							paddingLeft: '1.5rem',
							paddingTop: '0.5rem',
							paddingBottom: '0.5rem',
							backgroundColor: '#eff6ff',
							fontStyle: 'italic',
							marginTop: '1.5rem',
							marginBottom: '1.5rem',
						},
						code: {
							backgroundColor: '#f3f4f6',
							paddingLeft: '0.5rem',
							paddingRight: '0.5rem',
							paddingTop: '0.25rem',
							paddingBottom: '0.25rem',
							borderRadius: '0.25rem',
							fontSize: '0.875rem',
						},
						pre: {
							backgroundColor: '#111827',
							color: '#f9fafb',
							padding: '1.5rem',
							borderRadius: '0.5rem',
							overflowX: 'auto',
							marginTop: '1.5rem',
							marginBottom: '1.5rem',
						},
						img: {
							borderRadius: '0.5rem',
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							marginTop: '1.5rem',
							marginBottom: '1.5rem',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
