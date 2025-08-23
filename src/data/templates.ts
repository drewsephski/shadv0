export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  htmlCode: string;
  previewImage?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export const templates: Template[] = [
  {
    id: "hero-section-1",
    name: "Modern Hero Section",
    description: "A sleek hero section with a call to action and a background image.",
    prompt: "Create a stunning modern hero section featuring a full-screen gradient background with animated elements, a compelling headline using modern typography, a clear value proposition paragraph, and multiple call-to-action buttons with smooth hover animations. Include glassmorphism effects, subtle animations, and responsive design that works perfectly on all devices. Use modern CSS techniques like CSS Grid, Flexbox, and CSS animations to create an engaging, professional landing page hero section.",
    htmlCode: `
<section class="relative bg-gray-900 text-white min-h-screen flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 z-0">
    <img src="https://via.placeholder.com/1920x1080" alt="Background" class="w-full h-full object-cover opacity-30">
  </div>
  <div class="relative z-10 text-center p-8 max-w-4xl mx-auto">
    <h1 class="text-5xl md:text-7xl font-bold leading-tight mb-6">
      Your Vision, Our <span class="text-blue-400">Code</span>.
    </h1>
    <p class="text-lg md:text-xl mb-8 opacity-90">
      Transforming complex ideas into elegant, high-performance web solutions.
    </p>
    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      Get Started
    </button>
  </div>
</section>
`,
    category: "hero",
    tags: ["hero", "call-to-action", "background-image", "modern"],
  },
  {
    id: "navbar-1",
    name: "Responsive Navbar",
    description: "A clean, responsive navigation bar with a logo and navigation links.",
    prompt: "Create a sophisticated responsive navigation bar with glassmorphism effects, smooth scroll animations, active state indicators, and a mobile hamburger menu that transforms into an elegant slide-out panel. Include dropdown menus for services, proper accessibility features with ARIA labels, keyboard navigation support, and modern styling with subtle shadows and backdrop blur effects. The navbar should have a sticky behavior with scroll-based styling changes and include proper semantic HTML structure.",
    htmlCode: `
<nav class="bg-white shadow-md p-4 flex justify-between items-center">
  <div class="text-2xl font-bold text-gray-800">Logo</div>
  <div class="hidden md:flex space-x-6">
    <a href="#" class="text-gray-600 hover:text-blue-500 transition duration-300">Home</a>
    <a href="#" class="text-gray-600 hover:text-blue-500 transition duration-300">Services</a>
    <a href="#" class="text-gray-600 hover:text-blue-500 transition duration-300">About</a>
    <a href="#" class="text-gray-600 hover:text-blue-500 transition duration-300">Contact</a>
  </div>
  <button class="md:hidden text-gray-600 focus:outline-none">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
  </button>
</nav>
`,
    category: "navigation",
    tags: ["navbar", "responsive", "navigation", "header"],
  },
  {
    id: "form-1",
    name: "Contact Form",
    description: "A simple and elegant contact form with input fields and a submit button.",
    prompt: "Design a sophisticated contact form with modern styling, real-time validation, smooth animations, and enhanced user experience. Include floating labels that transform on focus, progress indicators, success/error states with animations, form field icons, character counters for text areas, email validation with visual feedback, and a loading state for form submission. Use CSS Grid for layout, implement proper accessibility with ARIA labels, and add subtle micro-interactions like button hover effects and field focus animations.",
    htmlCode: `
<div class="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
  <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
  <form>
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
      <input type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Name">
    </div>
    <div class="mb-4">
      <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
      <input type="email" id="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Email">
    </div>
    <div class="mb-6">
      <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message</label>
      <textarea id="message" rows="5" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Message"></textarea>
    </div>
    <div class="flex items-center justify-center">
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Send Message
      </button>
    </div>
  </form>
</div>
`,
  },
  {
    id: "card-1",
    name: "Product Card",
    description: "A responsive product card with image, title, description, and price.",
    prompt: "Create an elegant product card with modern e-commerce styling, featuring smooth hover animations, add-to-cart functionality, wishlist integration, product image gallery, pricing with discounts, rating stars, and quick view modal. Include glassmorphism effects, proper image lazy loading, accessibility features, and responsive design that adapts beautifully to all screen sizes. Add micro-interactions like button ripple effects, image zoom on hover, and smooth transitions between states.",
    htmlCode: `
<div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4">
  <img class="w-full h-48 object-cover" src="https://via.placeholder.com/300x200" alt="Product Image">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Awesome Product</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2 flex justify-between items-center">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">$29.99</span>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm">
      Add to Cart
    </button>
  </div>
</div>
`,
    category: "cards",
    tags: ["product-card", "ecommerce", "image", "pricing"],
  },
  {
    id: "ecommerce-1",
    name: "Shopping Cart Item",
    description: "A single item representation for a shopping cart.",
    prompt: "Design an interactive shopping cart item component with quantity controls, price calculations, remove functionality, product variant selection, and smooth animations. Include image thumbnails, product details with variants (size, color), pricing with discounts, quantity stepper with validation, remove confirmation modal, and real-time total updates. Implement proper accessibility with keyboard navigation, ARIA labels, and focus management for an inclusive shopping experience.",
    htmlCode: `
<div class="flex items-center justify-between p-4 border-b border-gray-200">
  <div class="flex items-center">
    <img class="h-16 w-16 object-cover rounded-md mr-4" src="https://via.placeholder.com/100x100" alt="Product Image">
    <div>
      <h3 class="font-semibold text-gray-800">Product Name</h3>
      <p class="text-gray-600 text-sm">Size: M, Color: Blue</p>
    </div>
  </div>
  <div class="flex items-center space-x-4">
    <span class="text-gray-800 font-semibold">$49.99</span>
    <input type="number" value="1" min="1" class="w-16 text-center border rounded-md py-1">
    <button class="text-red-500 hover:text-red-700">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
    </button>
  </div>
</div>
`,
    category: "ecommerce",
    tags: ["cart-item", "ecommerce", "shopping", "product"],
  },
  {
    id: "dashboard-1",
    name: "Dashboard Statistic Card",
    description: "A card displaying a key statistic for a dashboard.",
    prompt: "Build a comprehensive dashboard statistic card with animated counters, trend indicators, progress bars, and interactive elements. Include hover effects that reveal additional metrics, clickable areas for drilling down into data, animated icons or charts, and support for different data types (currency, percentages, counts). Implement smooth transitions, loading states, and responsive design with proper data formatting and accessibility features.",
    htmlCode: `
<div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center">
  <div class="text-4xl font-bold text-blue-600 mb-2">1,234</div>
  <p class="text-gray-600 text-lg">Total Sales</p>
  <div class="text-sm text-green-500 mt-2">+12% from last month</div>
</div>
`,
    category: "dashboard",
    tags: ["dashboard-card", "statistics", "sales", "dashboard"],
  },
  {
    id: "feature-grid-1",
    name: "Feature Grid with Icons",
    description: "A grid layout to showcase product features with icons and descriptions.",
    prompt: "Design an engaging feature grid with custom SVG icons, staggered animations, and interactive hover effects. Include proper icon accessibility with screen reader support, animated counters or progress indicators, expandable feature details, and smooth scroll-triggered animations. Use CSS Grid with fallback support, implement proper spacing and typography hierarchy, and ensure the grid adapts beautifully across all device sizes with optimal content distribution.",
    htmlCode: `
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
  <div class="bg-white rounded-lg shadow-md p-6 text-center">
    <div class="text-blue-500 text-5xl mb-4">&#9733;</div>
    <h3 class="font-bold text-xl mb-2">Feature One</h3>
    <p class="text-gray-600">Brief description of the first amazing feature.</p>
  </div>
  <div class="bg-white rounded-lg shadow-md p-6 text-center">
    <div class="text-blue-500 text-5xl mb-4">&#9733;</div>
    <h3 class="font-bold text-xl mb-2">Feature Two</h3>
    <p class="text-gray-600">Brief description of the second amazing feature.</p>
  </div>
  <div class="bg-white rounded-lg shadow-md p-6 text-center">
    <div class="text-blue-500 text-5xl mb-4">&#9733;</div>
    <h3 class="font-bold text-xl mb-2">Feature Three</h3>
    <p class="text-gray-600">Brief description of the third amazing feature.</p>
  </div>
</div>
`,
    category: "features",
    tags: ["feature-grid", "features", "product", "grid"],
  },
  {
    id: "landing-page-1",
    name: "Simple Landing Page",
    description: "A basic landing page structure with a hero, features, and a call to action.",
    prompt: "Build a complete landing page with a compelling hero section, feature showcase, social proof elements, and strong call-to-action sections. Include smooth scrolling navigation, animated elements that trigger on scroll, conversion-optimized forms, trust indicators, and mobile-first responsive design. Implement proper SEO structure with semantic HTML, structured data, and performance optimizations like lazy loading images and minified assets.",
    htmlCode: `
<div class="min-h-screen bg-gray-100 font-sans">
  <!-- Hero Section -->
  <header class="bg-blue-600 text-white py-20 text-center">
    <h1 class="text-5xl font-bold mb-4">Welcome to Our Service</h1>
    <p class="text-xl mb-8">Your solution for everything awesome.</p>
    <button class="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100">Learn More</button>
  </header>

  <!-- Features Section -->
  <section class="py-16 px-4">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="font-bold text-xl mb-2 text-gray-700">Feature A</h3>
        <p class="text-gray-600">Benefit of feature A explained here.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="font-bold text-xl mb-2 text-gray-700">Feature B</h3>
        <p class="text-gray-600">Benefit of feature B explained here.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 class="font-bold text-xl mb-2 text-gray-700">Feature C</h3>
        <p class="text-gray-600">Benefit of feature C explained here.</p>
      </div>
    </div>
  </section>

  <!-- Call to Action Section -->
  <section class="bg-blue-500 text-white py-16 text-center">
    <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
    <button class="bg-white text-blue-500 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100">Sign Up Now</button>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-8 text-center">
    <p>&copy; 2024 Your Company. All rights reserved.</p>
  </footer>
</div>
`,
    category: "landing-page",
    tags: ["landing-page", "hero", "features", "cta", "footer"],
  },
  {
    id: "section-1",
    name: "Content Section with Image",
    description: "A content section with text on one side and an image on the other.",
    prompt: "Design a versatile content section with alternating layouts, parallax image effects, and engaging visual hierarchy. Include proper image optimization with lazy loading, responsive image sources, hover effects on images, animated text reveals, and flexible content positioning. Implement CSS Grid for complex layouts, add subtle background patterns or gradients, and ensure proper content flow with optimal reading experience across all devices.",
    htmlCode: `
<section class="flex flex-col md:flex-row items-center bg-white p-8 shadow-lg rounded-lg max-w-6xl mx-auto my-8">
  <div class="md:w-1/2 p-4">
    <h2 class="text-4xl font-bold text-gray-800 mb-4">Engaging Title Here</h2>
    <p class="text-gray-700 text-lg leading-relaxed">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p class="text-gray-700 text-lg leading-relaxed mt-4">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>
  <div class="md:w-1/2 p-4">
    <img src="https://via.placeholder.com/600x400" alt="Descriptive Image" class="rounded-lg shadow-md w-full h-auto">
  </div>
</section>
`,
    category: "content-section",
    tags: ["content-section", "image", "text", "layout"],
  },
  {
    id: "dashboard-2",
    name: "Dashboard Table",
    description: "A responsive table for displaying tabular data in a dashboard.",
    prompt: "Create an advanced data table with sorting, filtering, pagination, and real-time updates. Include column resizing, row selection, bulk actions, search functionality, and export options. Implement proper data formatting for different types (currency, dates, percentages), add loading states and empty states, and ensure keyboard navigation and screen reader accessibility. Include expandable rows for detailed information and status indicators with color coding.",
    htmlCode: `
<div class="overflow-x-auto bg-white shadow-md rounded-lg p-4">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Doe</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Software Engineer</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane.doe@example.com</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Smith</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">UX Designer</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john.smith@example.com</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Member</td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</div>
`,
  },
  {
    id: "cta-1",
    name: "Simple Call to Action",
    description: "A straightforward call to action section with a clear message and button.",
    prompt: "Design a compelling call-to-action section with urgency indicators, social proof elements, and conversion optimization. Include animated counters, limited-time offers, trust badges, risk reversal statements, and multiple conversion paths. Implement A/B testing hooks, conversion tracking, and personalized messaging. Use psychological triggers like scarcity, social proof, and clear value propositions with compelling copy that drives immediate action.",
    htmlCode: `
<div class="bg-blue-600 text-white text-center p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8">
  <h2 class="text-3xl md:text-4xl font-bold mb-4">Don't Miss Out!</h2>
  <p class="text-lg md:text-xl mb-6">Join our community and get exclusive updates.</p>
  <button class="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
    Sign Up Today
  </button>
</div>
`,
    category: "cta",
    tags: ["call-to-action", "button", "conversion"],
  },
  // Modern Glassmorphism Hero
  {
    id: "glassmorphism-hero",
    name: "Glassmorphism Hero",
    description: "A stunning glassmorphism hero section with frosted glass effects and modern gradients.",
    prompt: "Create a glassmorphism hero section with modern design elements.",
    htmlCode: `
<div class="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 overflow-hidden">
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
  </div>

  <!-- Glass Container -->
  <div class="relative z-10 flex items-center justify-center min-h-screen p-8">
    <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto text-center shadow-2xl">
      <div class="mb-8">
        <h1 class="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
          Beyond
        </h1>
        <div class="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-6 rounded-full"></div>
        <p class="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
          Experience the future of digital design with cutting-edge glassmorphism aesthetics
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="backdrop-blur-sm bg-white/20 border border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl">
          Explore Features
        </button>
        <button class="backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300">
          Learn More
        </button>
      </div>
    </div>
  </div>
</div>
`,
    previewImage: "https://via.placeholder.com/400x300?text=Glassmorphism+Hero",
    category: "hero",
    tags: ["glassmorphism", "modern", "gradient", "featured"],
    featured: true,
  },
  // Dark Mode Card Grid
  {
    id: "dark-card-grid",
    name: "Dark Mode Card Grid",
    description: "A beautiful grid of cards with dark theme and subtle animations.",
    prompt: "Create a responsive grid of dark-themed cards with hover animations.",
    htmlCode: `
<div class="min-h-screen bg-gray-900 p-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        Discover More
      </h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">
        Explore our curated collection of premium content and experiences
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card 1 -->
      <div class="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/80 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
            <span class="text-white text-2xl">🚀</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Lightning Fast</h3>
          <p class="text-gray-400 leading-relaxed">Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology stack.</p>
          <div class="mt-6">
            <button class="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">Learn More →</button>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/80 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
        <div class="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-6 flex items-center justify-center">
            <span class="text-white text-2xl">🔒</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Secure & Reliable</h3>
          <p class="text-gray-400 leading-relaxed">Your data is protected with enterprise-grade security and 99.9% uptime guarantee.</p>
          <div class="mt-6">
            <button class="text-green-400 hover:text-green-300 font-medium transition-colors duration-200">Learn More →</button>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/80 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10">
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl mb-6 flex items-center justify-center">
            <span class="text-white text-2xl">✨</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Beautiful Design</h3>
          <p class="text-gray-400 leading-relaxed">Crafted with attention to detail and modern design principles for an exceptional user experience.</p>
          <div class="mt-6">
            <button class="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200">Learn More →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
    previewImage: "https://via.placeholder.com/400x300?text=Dark+Card+Grid",
    category: "cards",
    tags: ["dark-mode", "cards", "grid", "modern", "featured"],
    featured: true,
  },
  // Modern Pricing Cards
  {
    id: "pricing-cards",
    name: "Modern Pricing Cards",
    description: "Elegant pricing cards with modern design and smooth hover effects.",
    prompt: "Create a set of modern pricing cards with tiered features and call-to-action buttons.",
    htmlCode: `
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Choose Your Plan
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        Select the perfect plan for your needs with our flexible pricing options
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Basic Plan -->
      <div class="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:scale-105">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
          <div class="text-4xl font-bold text-blue-600 mb-2">$9<span class="text-lg text-gray-500">/month</span></div>
          <p class="text-gray-600">Perfect for getting started</p>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            Up to 5 projects
          </li>
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            Basic analytics
          </li>
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            Email support
          </li>
        </ul>

        <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
          Get Started
        </button>
      </div>

      <!-- Pro Plan (Featured) -->
      <div class="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 shadow-2xl text-white transform scale-105">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            Most Popular
          </div>
        </div>

        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold mb-2">Pro</h3>
          <div class="text-4xl font-bold mb-2">$29<span class="text-lg opacity-75">/month</span></div>
          <p class="opacity-90">Best for growing businesses</p>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-center">
            <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Unlimited projects
          </li>
          <li class="flex items-center">
            <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Advanced analytics
          </li>
          <li class="flex items-center">
            <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Priority support
          </li>
          <li class="flex items-center">
            <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Custom integrations
          </li>
        </ul>

        <button class="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg">
          Start Pro Trial
        </button>
      </div>

      <!-- Enterprise Plan -->
      <div class="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:scale-105">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
          <div class="text-4xl font-bold text-purple-600 mb-2">$99<span class="text-lg text-gray-500">/month</span></div>
          <p class="text-gray-600">For large-scale operations</p>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            Everything in Pro
          </li>
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            Dedicated support
          </li>
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            Custom solutions
          </li>
          <li class="flex items-center text-gray-700">
            <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            SLA guarantee
          </li>
        </ul>

        <button class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg">
          Contact Sales
        </button>
      </div>
    </div>
  </div>
</div>
`,
    previewImage: "https://via.placeholder.com/400x300?text=Modern+Pricing+Cards",
    category: "ecommerce",
    tags: ["pricing", "cards", "business", "modern", "featured"],
    featured: true,
  },
  // Animated Testimonial Cards
  {
    id: "testimonial-cards",
    name: "Animated Testimonial Cards",
    description: "Beautiful testimonial cards with smooth animations and modern design.",
    prompt: "Create animated testimonial cards with user reviews and ratings.",
    htmlCode: `
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
        What Our Customers Say
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        Don't just take our word for it - hear from our satisfied customers
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Testimonial 1 -->
      <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-indigo-200">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-2xl text-white font-bold">S</span>
          </div>
        </div>

        <div class="mt-6">
          <div class="flex mb-4">
            <span class="text-yellow-400 text-lg">★★★★★</span>
          </div>

          <blockquote class="text-gray-700 mb-6 leading-relaxed">
            "This platform has completely transformed how we work. The interface is intuitive and the features are exactly what we needed."
          </blockquote>

          <div>
            <div class="font-bold text-gray-900">Sarah Johnson</div>
            <div class="text-gray-600 text-sm">CEO, TechCorp</div>
          </div>
        </div>

        <div class="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div class="text-6xl text-indigo-500">"</div>
        </div>
      </div>

      <!-- Testimonial 2 -->
      <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-purple-200">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-2xl text-white font-bold">M</span>
          </div>
        </div>

        <div class="mt-6">
          <div class="flex mb-4">
            <span class="text-yellow-400 text-lg">★★★★★</span>
          </div>

          <blockquote class="text-gray-700 mb-6 leading-relaxed">
            "Outstanding customer support and incredibly powerful features. It's been a game-changer for our team productivity."
          </blockquote>

          <div>
            <div class="font-bold text-gray-900">Michael Chen</div>
            <div class="text-gray-600 text-sm">Product Manager, InnovateLab</div>
          </div>
        </div>

        <div class="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div class="text-6xl text-purple-500">"</div>
        </div>
      </div>

      <!-- Testimonial 3 -->
      <div class="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-pink-200">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-2xl text-white font-bold">E</span>
          </div>
        </div>

        <div class="mt-6">
          <div class="flex mb-4">
            <span class="text-yellow-400 text-lg">★★★★★</span>
          </div>

          <blockquote class="text-gray-700 mb-6 leading-relaxed">
            "The best investment we've made this year. User-friendly, reliable, and constantly improving. Highly recommended!"
          </blockquote>

          <div>
            <div class="font-bold text-gray-900">Emily Rodriguez</div>
            <div class="text-gray-600 text-sm">Founder, StartupHub</div>
          </div>
        </div>

        <div class="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div class="text-6xl text-pink-500">"</div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center mt-16">
      <button class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        Join Thousands of Happy Customers
      </button>
    </div>
  </div>
</div>
`,
    previewImage: "https://via.placeholder.com/400x300?text=Animated+Testimonials",
    category: "cards",
    tags: ["testimonials", "reviews", "social-proof", "modern", "featured"],
    featured: true,
  },
  // Modern Footer
  {
    id: "modern-footer",
    name: "Modern Footer",
    description: "A comprehensive, modern footer with links, newsletter signup, and social media.",
    prompt: "Create a modern, comprehensive footer with multiple sections and newsletter signup.",
    htmlCode: `
<footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  <div class="max-w-7xl mx-auto px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <!-- Company Info -->
      <div class="lg:col-span-2">
        <div class="mb-6">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            YourCompany
          </h3>
          <p class="text-gray-400 leading-relaxed mb-6 max-w-md">
            Building the future of digital experiences with cutting-edge technology and innovative solutions.
          </p>
        </div>

        <!-- Newsletter Signup -->
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h4 class="font-bold text-lg mb-3">Stay Updated</h4>
          <p class="text-gray-400 text-sm mb-4">Get the latest updates and insights delivered to your inbox.</p>
          <div class="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            >
            <button class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-bold text-lg mb-6">Product</h4>
        <ul class="space-y-3">
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Integrations</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">API Docs</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Changelog</a></li>
        </ul>
      </div>

      <!-- Company Links -->
      <div>
        <h4 class="font-bold text-lg mb-6">Company</h4>
        <ul class="space-y-3">
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Support</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="border-t border-gray-700/50 pt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-gray-400 text-sm">
          © 2024 YourCompany. All rights reserved.
        </div>

        <!-- Social Media -->
        <div class="flex items-center gap-4">
          <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors duration-200 group">
            <span class="text-gray-400 group-hover:text-blue-400">📘</span>
          </a>
          <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors duration-200 group">
            <span class="text-gray-400 group-hover:text-blue-400">🐦</span>
          </a>
          <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors duration-200 group">
            <span class="text-gray-400 group-hover:text-pink-400">📷</span>
          </a>
          <a href="#" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors duration-200 group">
            <span class="text-gray-400 group-hover:text-blue-500">💼</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
`,
    previewImage: "https://via.placeholder.com/400x300?text=Modern+Footer",
    category: "navigation",
    tags: ["footer", "newsletter", "social-media", "modern", "comprehensive"],
    featured: true,
  },
  // Modern Contact Form
  {
    id: "modern-contact-form",
    name: "Modern Contact Form",
    description: "A sleek, modern contact form with floating labels and smooth animations.",
    prompt: "Create a modern contact form with floating labels, validation states, and smooth animations. Include proper accessibility features, form validation, success/error states, and a clean, professional design that works on all devices.",
    htmlCode: `
<div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
    <p class="text-gray-600">We'd love to hear from you</p>
  </div>

  <form class="space-y-6">
    <div class="relative">
      <input
        type="text"
        id="name"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 peer"
        placeholder=" "
      >
      <label
        for="name"
        class="absolute left-4 top-3 text-gray-500 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-blue-600 bg-white px-1"
      >
        Full Name
      </label>
    </div>

    <div class="relative">
      <input
        type="email"
        id="email"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 peer"
        placeholder=" "
      >
      <label
        for="email"
        class="absolute left-4 top-3 text-gray-500 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-blue-600 bg-white px-1"
      >
        Email Address
      </label>
    </div>

    <div class="relative">
      <textarea
        id="message"
        rows="4"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none peer"
        placeholder=" "
      ></textarea>
      <label
        for="message"
        class="absolute left-4 top-3 text-gray-500 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-blue-600 bg-white px-1"
      >
        Message
      </label>
    </div>

    <button
      type="submit"
      class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
    >
      Send Message
    </button>
  </form>
</div>
`,
    category: "forms",
    tags: ["contact-form", "floating-labels", "modern", "validation"],
  },
  // Newsletter Signup
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    description: "An elegant newsletter signup form with compelling copy and benefits list.",
    prompt: "Design a compelling newsletter signup section with benefits list, social proof, and a clean form. Include trust indicators, privacy assurance, and a modern design that converts visitors into subscribers.",
    htmlCode: `
<div class="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 class="text-4xl font-bold mb-6">Stay in the Loop</h2>
      <p class="text-xl mb-8 opacity-90">
        Get exclusive insights, tips, and updates delivered straight to your inbox.
      </p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center">
          <div class="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          Weekly design tips & tutorials
        </li>
        <li class="flex items-center">
          <div class="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          Early access to new templates
        </li>
        <li class="flex items-center">
          <div class="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          Exclusive discounts & offers
        </li>
      </ul>
      <div class="flex items-center text-sm opacity-75">
        <span>🔒 Your privacy is protected</span>
        <span class="mx-2">•</span>
        <span>1,234+ happy subscribers</span>
      </div>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
      <h3 class="text-2xl font-bold mb-6">Join the Community</h3>
      <form class="space-y-4">
        <input
          type="text"
          placeholder="Your full name"
          class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
        >
        <input
          type="email"
          placeholder="your@email.com"
          class="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50"
        >
        <button
          type="submit"
          class="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          Subscribe Now
        </button>
      </form>
      <p class="text-xs text-white/70 mt-4 text-center">
        No spam, unsubscribe at any time
      </p>
    </div>
  </div>
</div>
`,
    category: "forms",
    tags: ["newsletter", "signup", "benefits", "social-proof"],
  },
  // Team Section
  {
    id: "team-section",
    name: "Team Section",
    description: "A professional team showcase with member profiles and social links.",
    prompt: "Create a professional team section with member cards, social media links, and hover effects. Include team member photos, roles, descriptions, and social media integration for a complete team showcase.",
    htmlCode: `
<div class="py-16 bg-gray-50">
  <div class="max-w-6xl mx-auto px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        The talented people behind our success
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Team Member 1 -->
      <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div class="relative">
          <img
            src="https://via.placeholder.com/300x300"
            alt="Sarah Johnson"
            class="w-full h-64 object-cover rounded-t-2xl"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="flex space-x-3">
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">🐦</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">💼</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">📧</span>
              </a>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
          <p class="text-blue-600 font-medium mb-3">Chief Executive Officer</p>
          <p class="text-gray-600 text-sm leading-relaxed">
            Visionary leader with 15+ years in tech innovation and business development.
          </p>
        </div>
      </div>

      <!-- Team Member 2 -->
      <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div class="relative">
          <img
            src="https://via.placeholder.com/300x301"
            alt="Michael Chen"
            class="w-full h-64 object-cover rounded-t-2xl"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="flex space-x-3">
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">🐙</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">💼</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">📧</span>
              </a>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Michael Chen</h3>
          <p class="text-green-600 font-medium mb-3">Head of Engineering</p>
          <p class="text-gray-600 text-sm leading-relaxed">
            Full-stack architect specializing in scalable systems and modern web technologies.
          </p>
        </div>
      </div>

      <!-- Team Member 3 -->
      <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div class="relative">
          <img
            src="https://via.placeholder.com/300x302"
            alt="Emily Rodriguez"
            class="w-full h-64 object-cover rounded-t-2xl"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="flex space-x-3">
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">📸</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">🎨</span>
              </a>
              <a href="#" class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <span class="text-sm">📧</span>
              </a>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Emily Rodriguez</h3>
          <p class="text-purple-600 font-medium mb-3">Creative Director</p>
          <p class="text-gray-600 text-sm leading-relaxed">
            Award-winning designer crafting beautiful digital experiences and brand identities.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
`,
    category: "content-section",
    tags: ["team", "about", "profiles", "social-media"],
  },
  // Stats Counter Section
  {
    id: "stats-counter",
    name: "Stats Counter Section",
    description: "Animated statistics counters with icons and descriptions.",
    prompt: "Create an animated statistics section with counters that animate on scroll, icons, and compelling descriptions. Include proper number formatting, smooth animations, and responsive design for all devices.",
    htmlCode: `
<div class="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
  <div class="max-w-6xl mx-auto px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
      <p class="text-xl text-blue-100 max-w-2xl mx-auto">
        Real results that speak for themselves
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Stat 1 -->
      <div class="text-center group">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl">👥</span>
          </div>
          <div class="text-4xl font-bold text-white mb-2" data-counter="10000" data-suffix="+">
            0+
          </div>
          <p class="text-blue-100 font-medium">Happy Customers</p>
          <p class="text-blue-200 text-sm mt-2">Across 50+ countries</p>
        </div>
      </div>

      <!-- Stat 2 -->
      <div class="text-center group">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl">📊</span>
          </div>
          <div class="text-4xl font-bold text-white mb-2" data-counter="99.9" data-suffix="%">
            0%
          </div>
          <p class="text-blue-100 font-medium">Uptime</p>
          <p class="text-blue-200 text-sm mt-2">Enterprise reliability</p>
        </div>
      </div>

      <!-- Stat 3 -->
      <div class="text-center group">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl">⚡</span>
          </div>
          <div class="text-4xl font-bold text-white mb-2" data-counter="500" data-suffix="ms">
            0ms
          </div>
          <p class="text-blue-100 font-medium">Response Time</p>
          <p class="text-blue-200 text-sm mt-2">Lightning fast</p>
        </div>
      </div>

      <!-- Stat 4 -->
      <div class="text-center group">
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl">🏆</span>
          </div>
          <div class="text-4xl font-bold text-white mb-2" data-counter="25" data-suffix="+">
            0+
          </div>
          <p class="text-blue-100 font-medium">Awards Won</p>
          <p class="text-blue-200 text-sm mt-2">Industry recognition</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.counter-animate {
  animation: countUp 2s ease-out forwards;
}
</style>

<script>
// Simple counter animation
document.addEventListener('DOMContentLoaded', function() {
  const counters = document.querySelectorAll('[data-counter]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseFloat(element.dataset.counter);
        const suffix = element.dataset.suffix || '';
        const duration = 2000; // 2 seconds
        const start = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);

          let current;
          if (target % 1 === 0) {
            // Integer
            current = Math.floor(target * progress);
          } else {
            // Float
            current = (target * progress).toFixed(1);
          }

          element.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        element.classList.add('counter-animate');
        requestAnimationFrame(update);
        observer.unobserve(element);
      }
    });
  });

  counters.forEach(counter => observer.observe(counter));
});
</script>
`,
    category: "content-section",
    tags: ["stats", "counters", "animation", "metrics"],
  },
  // FAQ Section
  {
    id: "faq-section",
    name: "FAQ Section",
    description: "An interactive FAQ section with expandable questions and answers.",
    prompt: "Create an interactive FAQ section with smooth expand/collapse animations, search functionality, and categorized questions. Include proper accessibility features, smooth transitions, and a clean, modern design.",
    htmlCode: `
<div class="py-16 bg-gray-50">
  <div class="max-w-4xl mx-auto px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Everything you need to know about our service
      </p>
    </div>

    <div class="space-y-4">
      <!-- FAQ Item 1 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button class="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
          <h3 class="text-lg font-semibold text-gray-900 pr-4">
            How do I get started with your service?
          </h3>
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="px-8 pb-6 hidden">
          <p class="text-gray-600 leading-relaxed">
            Getting started is easy! Simply sign up for an account, choose your plan, and you'll have access to our platform within minutes. Our onboarding process will guide you through the setup with step-by-step instructions.
          </p>
        </div>
      </div>

      <!-- FAQ Item 2 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button class="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
          <h3 class="text-lg font-semibold text-gray-900 pr-4">
            What payment methods do you accept?
          </h3>
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="px-8 pb-6 hidden">
          <p class="text-gray-600 leading-relaxed">
            We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our certified payment processors.
          </p>
        </div>
      </div>

      <!-- FAQ Item 3 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button class="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
          <h3 class="text-lg font-semibold text-gray-900 pr-4">
            Can I cancel my subscription anytime?
          </h3>
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="px-8 pb-6 hidden">
          <p class="text-gray-600 leading-relaxed">
            Yes, you can cancel your subscription at any time from your account dashboard. You'll continue to have access to your account until the end of your current billing period, and you won't be charged for the next cycle.
          </p>
        </div>
      </div>

      <!-- FAQ Item 4 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button class="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
          <h3 class="text-lg font-semibold text-gray-900 pr-4">
            Do you offer customer support?
          </h3>
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="px-8 pb-6 hidden">
          <p class="text-gray-600 leading-relaxed">
            Absolutely! We provide 24/7 customer support through multiple channels including live chat, email, and phone. Premium and Enterprise customers also get access to dedicated account managers and priority support.
          </p>
        </div>
      </div>

      <!-- FAQ Item 5 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button class="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
          <h3 class="text-lg font-semibold text-gray-900 pr-4">
            Is my data secure with you?
          </h3>
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="px-8 pb-6 hidden">
          <p class="text-gray-600 leading-relaxed">
            Security is our top priority. We use enterprise-grade encryption, regular security audits, and comply with GDPR, HIPAA, and SOC 2 standards. Your data is encrypted both in transit and at rest, and we never share your information with third parties.
          </p>
        </div>
      </div>
    </div>

    <!-- Contact CTA -->
    <div class="mt-16 text-center">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">Still have questions?</h3>
        <p class="text-blue-100 mb-6 max-w-md mx-auto">
          Our support team is here to help you with anything you need
        </p>
        <button class="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          Contact Support
        </button>
      </div>
    </div>
  </div>
</div>

<style>
.faq-item.active .faq-content {
  display: block;
}

.faq-item.active button svg {
  transform: rotate(180deg);
}

.faq-content {
  display: none;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const faqButtons = document.querySelectorAll('.bg-white button');

  faqButtons.forEach(button => {
    button.addEventListener('click', function() {
      const faqItem = this.closest('.bg-white');
      const content = faqItem.querySelector('.hidden');
      const icon = this.querySelector('svg');

      // Toggle content visibility
      content.classList.toggle('hidden');
      content.classList.toggle('block');

      // Toggle icon rotation
      icon.classList.toggle('rotate-180');

      // Close other open FAQs
      faqButtons.forEach(otherButton => {
        if (otherButton !== this) {
          const otherItem = otherButton.closest('.bg-white');
          const otherContent = otherItem.querySelector('.hidden, .block');
          const otherIcon = otherButton.querySelector('svg');

          if (otherContent && !otherContent.classList.contains('hidden')) {
            otherContent.classList.add('hidden');
            otherContent.classList.remove('block');
            otherIcon.classList.remove('rotate-180');
          }
        }
      });
    });
  });
});
</script>
`,
    category: "content-section",
    tags: ["faq", "accordion", "interactive", "support"],
  },
];