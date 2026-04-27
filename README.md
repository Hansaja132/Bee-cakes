# Bee Cakes

Bee Cakes is a multi-page bakery website for custom cakes, cupcakes, and celebration desserts. The design follows the pastel palette in the Bee Cakes logo, with lavender, butter yellow, sky blue, mint, coral, and warm cocoa accents used throughout the UI.

## What’s Inside

- `index.html` for the homepage
- `pages/about.html` for the brand story
- `pages/menu.html` for cake and dessert offerings
- `pages/gallery.html` for visual previews
- `pages/services.html` for service details
- `pages/testimonials.html` for customer feedback
- `pages/contact.html` for inquiries and orders

## Features

- Responsive navigation with a mobile menu
- Shared visual theme across all pages
- Cake gallery with lightbox previews
- Testimonials slider
- Contact form validation and submission hook
- Back-to-top button for longer pages

## Project Structure

- `css/style.css` contains the full site design system and layout styles
- `js/script.js` handles navigation, animations, gallery lightbox, slider behavior, and form validation
- `js/config.js` can be used to set the Formspree endpoint for the contact form
- `assets/Bee.png` is the brand logo and favicon

## Local Preview

Open `index.html` in a browser, or serve the folder with any simple static server if you want relative links to work exactly as expected.

## Notes

- The contact form expects a valid `window.FORMSPREE_ENDPOINT` value in `js/config.js`.
- Replace the sample content, links, and contact details with your real bakery information if needed.