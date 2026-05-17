import { Doc } from './all-docs';

export const extendedDocs: Doc[] = [
  {
    id: 'store-setup',
    title: 'Store Setup',
    description: 'Configure your e-commerce store settings',
    category: 'Store Configuration',
    slug: 'store-setup',
    content: `# Store Setup

This guide covers configuring your e-commerce store settings for optimal performance and user experience.

## Basic Configuration

### Store Information

Navigate to **Settings > Store** to configure your basic store information:

- **Store Name**: Your business name as it appears to customers
- **Store Domain**: Your custom domain (e.g., store.yourbrand.com)
- **Contact Email**: Customer support email
- **Phone Number**: Customer service phone
- **Business Address**: Legal business address

### Regional Settings

Configure regional preferences:

\`\`\`javascript
const regionalSettings = {
  currency: "USD",
  timezone: "America/New_York",
  defaultLanguage: "en",
  dateFormat: "MM/DD/YYYY",
  weightUnit: "lbs",
  dimensionUnit: "inches"
};
\`\`\`

## Theme Customization

### Store Branding

Customize your store's appearance:

1. **Logo**: Upload your store logo (recommended 200x60px)
2. **Favicon**: Upload favicon (32x32px)
3. **Brand Colors**: Primary, secondary, and accent colors
4. **Typography**: Choose fonts for headings and body text

### Layout Options

Configure your store layout:

- **Homepage Layout**: Featured products, banners, categories
- **Product Grid**: Number of products per row
- **Navigation**: Menu structure and organization
- **Footer**: Links, social media, newsletter signup

## Payment Configuration

### Payment Gateways

Enable payment methods:

\`\`\`javascript
const paymentConfig = {
  stripe: {
    enabled: true,
    publishableKey: "pk_test_...",
    secretKey: "sk_test_...",
    applePay: true,
    googlePay: true
  },
  paypal: {
    enabled: true,
    clientId: "your-paypal-client-id",
    sandbox: true
  },
  shopPay: {
    enabled: false
  }
};
\`\`\`

### Payment Settings

Configure payment behavior:

- **Currency**: Supported currencies and exchange rates
- **Payment Methods**: Which payment options to offer
- **Fraud Detection**: Enable fraud screening
- **Payment Capture**: Automatic vs manual capture

## Shipping Configuration

### Shipping Zones

Define where you ship to:

1. **Domestic Shipping**: Your home country
2. **International Shipping**: Other countries/regions
3. **Restricted Areas**: Locations you don't ship to

### Shipping Rates

Set up shipping pricing:

\`\`\`javascript
const shippingRates = {
  domestic: {
    flatRate: 5.99,
    freeShippingThreshold: 50,
    expressShipping: 12.99
  },
  international: {
    flatRate: 15.99,
    freeShippingThreshold: 100,
    expressShipping: 29.99
  }
};
\`\`\`

## Tax Configuration

### Tax Settings

Configure tax collection:

- **Tax Nexus**: States/countries where you have tax obligations
- **Tax Rates**: Automatic tax calculation vs manual rates
- **Tax Inclusive**: Show prices including tax
- **Tax Exemptions**: Handle tax-exempt customers

### Sales Tax Setup

\`\`\`javascript
const taxConfig = {
  nexus: ["CA", "NY", "TX"],
  taxIncluded: false,
  taxExempt: true,
  digitalGoods: true,
  shippingTaxable: true
};
\`\`\`

## Email Configuration

### Transactional Emails

Set up automated emails:

- **Order Confirmation**: Sent after successful purchase
- **Shipping Notification**: Sent when order ships
- **Password Reset**: For customer account recovery
- **Marketing Emails**: Newsletters and promotions

### Email Templates

Customize email content:

1. **Brand Your Emails**: Add logo and colors
2. **Personalization**: Use customer names and order details
3. **Mobile Optimization**: Ensure emails look good on mobile
4. **Spam Compliance**: Include unsubscribe links

## Security Settings

### SSL Certificate

Ensure your store is secure:

- **Auto SSL**: Free SSL certificate provided
- **Custom SSL**: Upload your own certificate
- **HTTPS Redirect**: Force all traffic to HTTPS

### Security Features

Enable additional security:

- **Two-Factor Authentication**: For admin accounts
- **IP Whitelisting**: Restrict admin access by IP
- **Activity Logs**: Track admin actions
- **Data Backup**: Automated daily backups

## Analytics Integration

### Google Analytics

Connect Google Analytics:

\`\`\`javascript
const analyticsConfig = {
  googleAnalytics: {
    trackingId: "GA-XXXXXXXXX",
    ecommerceTracking: true,
    enhancedEcommerce: true
  },
  facebookPixel: {
    pixelId: "1234567890123456"
  }
};
\`\`\`

### Conversion Tracking

Set up conversion tracking:

- **Purchase Events**: Track completed orders
- **Add to Cart**: Monitor product additions
- **Checkout Steps**: Track funnel progression
- **Revenue Tracking**: Monitor sales performance

## Mobile Optimization

### Responsive Design

Ensure mobile-friendly experience:

- **Mobile Theme**: Optimized layout for mobile devices
- **Touch Gestures**: Swipe, pinch, and tap interactions
- **Mobile Checkout**: Streamlined mobile payment flow
- **App Integration**: Progressive Web App support

### Performance Optimization

Improve mobile performance:

- **Image Optimization**: Automatic image resizing
- **Lazy Loading**: Load images as needed
- **CDN Integration**: Fast content delivery
- **Caching**: Browser and server caching

## Next Steps

After completing store setup:

- [Add Products](./product-management)
- [Configure Shipping](./shipping-tax)
- [Set Up Analytics](../api-reference/analytics)
- [Test Your Store](../testing/checkout-testing)`,
    keywords: ['store setup', 'configuration', 'settings', 'branding'],
    order: 1
  },
  {
    id: 'product-management',
    title: 'Product Management',
    description: 'Manage products, variants, and inventory',
    category: 'Store Configuration',
    slug: 'product-management',
    content: `# Product Management

Learn how to effectively manage your product catalog, variants, and inventory.

## Product Types

### Simple Products

Single products with no variations:

\`\`\`javascript
const simpleProduct = {
  name: "Classic T-Shirt",
  description: "Comfortable cotton t-shirt",
  price: 29.99,
  sku: "TSHIRT-001",
  inventory: 100,
  images: ["tshirt-front.jpg", "tshirt-back.jpg"]
};
\`\`\`

### Variable Products

Products with multiple options (size, color, etc.):

\`\`\`javascript
const variableProduct = {
  name: "Premium Hoodie",
  description: "Warm and stylish hoodie",
  basePrice: 59.99,
  sku: "HOODIE-001",
  variants: [
    {
      id: "HOODIE-001-S-BLACK",
      size: "S",
      color: "Black",
      price: 59.99,
      inventory: 25
    },
    {
      id: "HOODIE-001-M-BLACK", 
      size: "M",
      color: "Black",
      price: 59.99,
      inventory: 30
    }
  ]
};
\`\`\`

### Digital Products

Downloadable or digital goods:

\`\`\`javascript
const digitalProduct = {
  name: "E-book: Marketing Guide",
  description: "Complete marketing strategy guide",
  price: 19.99,
  type: "digital",
  files: [
    {
      name: "marketing-guide.pdf",
      url: "/downloads/marketing-guide.pdf",
      downloads: 0
    }
  ]
};
\`\`\`

## Product Organization

### Categories

Organize products into categories:

\`\`\`javascript
const categories = [
  {
    id: "clothing",
    name: "Clothing",
    description: "Apparel and accessories",
    products: 150,
    subcategories: ["mens", "womens", "kids"]
  },
  {
    id: "electronics",
    name: "Electronics", 
    description: "Gadgets and devices",
    products: 75,
    subcategories: ["phones", "laptops", "accessories"]
  }
];
\`\`\`

### Tags and Attributes

Add product metadata:

- **Tags**: Keywords for search and filtering
- **Attributes**: Product specifications (material, dimensions)
- **Custom Fields**: Additional product information

## Inventory Management

### Stock Tracking

Monitor inventory levels:

\`\`\`javascript
const inventorySettings = {
  trackInventory: true,
  lowStockThreshold: 10,
  outOfStockAction: "hide", // hide, show, backorder
  reserveStock: 5, // Reserve for safety
  autoRestock: false
};
\`\`\`

### Bulk Operations

Manage inventory at scale:

- **Bulk Import**: Upload products via CSV
- **Bulk Update**: Update prices, inventory, descriptions
- **Bulk Delete**: Remove multiple products
- **Bulk Export**: Download product data

### Inventory Alerts

Set up notifications:

- **Low Stock Alerts**: Notify when inventory is low
- **Out of Stock**: Alert when products sell out
- **Restock Reminders**: Remind to reorder products

## Product Pricing

### Pricing Strategies

Set competitive prices:

- **Cost Plus**: Base price + markup
- **Competitive**: Match or beat competitors
- **Value Based**: Price based on perceived value
- **Dynamic**: Adjust prices based on demand

### Discounts and Sales

Create promotional pricing:

\`\`\`javascript
const discountRules = [
  {
    type: "percentage",
    value: 20,
    conditions: ["category:clothing"],
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  },
  {
    type: "fixed",
    value: 10,
    conditions: ["quantity:greater_than(5)"],
    autoApply: true
  }
];
\`\`\`

## Product Media

### Product Images

Optimize product photography:

- **High Resolution**: Minimum 1000x1000px
- **Multiple Angles**: Front, back, side, detail shots
- **Lifestyle Images**: Products in use
- **Image Alt Text**: SEO-friendly descriptions

### Product Videos

Add video content:

- **Product Demos**: Show products in action
- **How-to Videos**: Usage instructions
- **360° Views**: Interactive product viewing
- **Video Thumbnails**: Custom preview images

## SEO Optimization

### Product SEO

Improve search visibility:

\`\`\`javascript
const productSEO = {
  title: "Premium Quality Leather Wallet - Handcrafted",
  description: "Genuine leather wallet with RFID protection",
  keywords: ["wallet", "leather", "rfid", "accessories"],
  url: "/products/premium-leather-wallet",
  schema: "Product"
};
\`\`\`

### Rich Snippets

Add structured data:

- **Product Schema**: Product information for search engines
- **Review Schema**: Customer ratings and reviews
- **Price Schema**: Current pricing and availability
- **Breadcrumb Schema**: Navigation path

## Product Reviews

### Customer Reviews

Enable product reviews:

\`\`\`javascript
const reviewSettings = {
  enabled: true,
  requirePurchase: true,
  autoApprove: false,
  allowPhotos: true,
  ratingScale: 5,
  helpfulVotes: true
};
\`\`\`

### Review Management

Moderate customer feedback:

- **Review Approval**: Manual or automatic approval
- **Review Responses**: Reply to customer reviews
- **Review Analytics**: Track review trends
- **Review Incentives**: Encourage customer reviews

## Product Variations

### Variant Options

Configure product variations:

- **Size**: S, M, L, XL, XXL
- **Color**: Red, Blue, Green, Black, White
- **Material**: Cotton, Polyester, Wool, Silk
- **Style**: Regular, Slim, Loose, Athletic

### Variant Pricing

Set variant-specific pricing:

\`\`\`javascript
const variantPricing = {
  basePrice: 29.99,
  priceAdjustments: [
    { condition: "size:XL", adjustment: 5 },
    { condition: "color:premium", adjustment: 10 },
    { condition: "material:organic", adjustment: 8 }
  ]
};
\`\`\`

## Advanced Features

### Product Bundles

Create product packages:

\`\`\`javascript
const productBundle = {
  name: "Complete Skincare Set",
  products: [
    { id: "cleanser", quantity: 1 },
    { id: "toner", quantity: 1 },
    { id: "moisturizer", quantity: 1 }
  ],
  bundlePrice: 49.99, // 20% discount
  savings: 12.50
};
\`\`\`

### Product Recommendations

AI-powered suggestions:

- **Frequently Bought Together**: Related products
- **Customers Also Bought**: Similar products
- **Trending Products**: Popular items
- **Personalized**: Based on browsing history

## API Integration

### Product API

Access product data programmatically:

\`\`\`javascript
// Fetch all products
const products = await sdk.products.list({
  category: "clothing",
  limit: 50,
  sort: "created_desc"
});

// Update product
await sdk.products.update(productId, {
  price: 39.99,
  inventory: 75
});

// Create product
const newProduct = await sdk.products.create({
  name: "New Product",
  price: 29.99,
  description: "Product description"
});
\`\`\`

## Best Practices

### Product Management Tips

1. **Consistent Naming**: Use clear, descriptive product names
2. **Quality Images**: Invest in professional product photography
3. **Detailed Descriptions**: Provide comprehensive product information
4. **Regular Updates**: Keep product information current
5. **Customer Feedback**: Use reviews to improve products

### Inventory Optimization

1. **Safety Stock**: Maintain buffer inventory
2. **Seasonal Planning**: Prepare for demand fluctuations
3. **Supplier Relationships**: Build reliable supplier networks
4. **Demand Forecasting**: Use data to predict inventory needs
5. **Automated Reordering**: Set up automatic stock replenishment

## Next Steps

- [Order & Payment Flow](./order-payment)
- [Shipping & Tax](./shipping-tax)
- [API Reference](../api-reference/products)`,
    keywords: ['products', 'inventory', 'variants', 'catalog'],
    order: 2
  }
];
