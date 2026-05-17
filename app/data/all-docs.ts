export interface Doc {
  id: string
  title: string
  description: string
  category: string
  slug: string
  content: string
  keywords: string[]
  order?: number
}

export const allDocs: Doc[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Welcome to the OmniChannel WhatsApp API documentation.',
    category: 'GETTING STARTED',
    slug: 'introduction',
    content: `# Introduction

Welcome to the **OmniChannel WhatsApp API** documentation. Our developer-first SaaS platform connects your e-commerce backend to the WhatsApp Business Platform, enabling powerful customer engagement, transactional alerts, and automated chat interactions.

Traditional e-commerce communication via email often suffers from low open rates. By integrating our WhatsApp Business API, you can send rich, high-engagement messages for order notifications, shipping updates, cart reminders, and active two-way customer support.

### Platform Architecture

Our API abstractifies the complex Meta Cloud API and provides a simplified RESTful interface with advanced queueing, automatic retries, template management, and detailed webhook dispatching.

\`\`\`mermaid
graph TD
    A[Your E-commerce App] -->|HTTPS REST API| B[OmniChannel Gateway]
    B -->|Queue & Rate Limit| C[Meta Cloud API]
    C -->|Deliver Message| D[Customer WhatsApp App]
    D -->|Interaction Event| C
    C -->|Webhook Event| B
    B -->|Validated Signature Webhook| A
\`\`\`

### Key Capabilities

* **High-Deliverability Notifications**: Instantly notify customers of actions (orders, payments, shipping) with WhatsApp-approved templates.
* **Interactive Media**: Go beyond simple text. Send rich media including PDFs, product images, dynamic buttons, and interactive lists.
* **Two-Way Conversations**: Build active customer care support channels or interactive automated shopping assistance bots using our real-time Webhook engine.
* **High-Volume Broadcasting**: Safely broadcast transactional messages to thousands of customers simultaneously without violating Meta's strict spam limits.
* **Granular Analytics**: Track message states (sent, delivered, read, clicked) in real-time.

---

### Core Integration Path

To get your production integration up and running, follow our structured onboarding path:

:::step-card
#### 1. Setup Sandbox
Start testing message delivery within 3 minutes using our pre-configured sandbox.
[Go to Quick Start](./quick-start)
:::

:::step-card
#### 2. Get API Keys
Authenticate all HTTPS requests securely using our platform API bearer tokens.
[View Authentication Guide](./authentication)
:::

:::step-card
#### 3. Connect Meta Account
Complete your Meta Business Manager verification and register your WhatsApp Business Account (WABA).
[View Meta Setup](./meta-setup)
:::

:::step-card
#### 4. Configure Webhooks
Listen to real-time events like delivery receipts, read statuses, and incoming customer text messages.
[View Webhook Setup](./webhooks)
:::

### Developer Support

If you run into any issues or need architectural advice, our engineering support is always available:

* **Developer Portal Support**: [support@omnichannel-api.com](mailto:support@omnichannel-api.com)
* **Status Page**: [status.omnichannel-api.com](https://status.omnichannel-api.com)
* **GitHub Issues**: [github.com/omnichannel-api/sdk](https://github.com/omnichannel-api/sdk)`,
    keywords: ['introduction', 'overview', 'whatsapp', 'waba', 'saas', 'api'],
    order: 1
  },
  {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Send your first WhatsApp message in under 3 minutes.',
    category: 'GETTING STARTED',
    slug: 'quick-start',
    content: `# Quick Start

This guide will walk you through sending your very first WhatsApp notification message using our sandbox environment in under 3 minutes. No Meta setup or verification is required to start testing.

### Prerequisites

Before starting, make sure you have:
1. An **OmniChannel Portal** developer account.
2. Your personal **WhatsApp-enabled phone** nearby to receive the test message.
3. A terminal command utility like \`curl\` installed.

---

### Step-by-Step Onboarding

:::step-card
#### 1. Obtain Your Sandbox Credentials
Log in to the [OmniChannel Portal](https://dashboard.omnichannel-api.com) and navigate to **Developer Settings**. Copy your temporary **Sandbox Secret Token** and the sandbox **Sender Phone Number** (\`+1 555 019 2831\`).
:::

:::step-card
#### 2. Register Your Test Device
Before sending sandbox messages, Meta requires you to authorize your personal phone number.
1. Open WhatsApp on your phone.
2. Send the message \`JOIN sandbox-alpha\` to our sandbox number \`+1 555 019 2831\`.
3. You will receive an automated confirmation message back. Your number is now whitelisted for sandbox testing!
:::

:::step-card
#### 3. Fire the API Request
Send an HTTP POST request to our Sandbox gateway endpoint using your API key. Replace \`YOUR_SANDBOX_TOKEN\` and \`YOUR_PHONE_NUMBER\` (in international E.164 format, e.g., \`+14155552671\`) with your details:

\`\`\`bash
curl -X POST https://sandbox.omnichannel-api.com/v1/messages \\
  -H "Authorization: Bearer YOUR_SANDBOX_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "YOUR_PHONE_NUMBER",
    "type": "template",
    "template": {
      "name": "sandbox_welcome",
      "language": "en",
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Developer" }
          ]
        }
      ]
    }
  }'
\`\`\`
:::

---

### API Response

If your request is successful, the gateway will return a \`202 Accepted\` status code, indicating the message has been queued and sent to Meta's servers.

:::api-response-card
#### Response Payload (202 Accepted)
\`\`\`json
{
  "message_id": "omni_msg_8f1d392a9e3d489b",
  "status": "queued",
  "to": "+14155552671",
  "created_at": "2026-05-17T14:35:00Z",
  "channel": "whatsapp",
  "cost_estimate": {
    "amount": "0.00",
    "currency": "USD"
  }
}
\`\`\`
:::

### What Next?

Now that you have successfully sent a sandbox message:
* Learn how [Authentication](./authentication) works in production.
* Perform [Meta Setup](./meta-setup) to configure your own business phone numbers.
* Hook up [Webhooks](./webhooks) to receive real-time delivery confirmations on your server.`,
    keywords: ['quick start', 'sandbox', 'test message', 'curl', 'first api request'],
    order: 2
  },
  {
    id: 'authentication',
    title: 'Authentication',
    description: 'Learn how to authenticate requests with your API Keys.',
    category: 'GETTING STARTED',
    slug: 'authentication',
    content: `# Authentication

The OmniChannel API uses high-security bearer tokens to authorize all API requests. Your secret keys are highly sensitive and should never be hardcoded into client-side code, committed to public repositories, or stored in unprotected local files.

---

### API Key Types

We support two environments, each with its own isolated set of keys:

| Environment | Key Prefix | Gateway Base URL | Description |
| :--- | :--- | :--- | :--- |
| **Sandbox** | \`omni_sbx_\` | \`https://sandbox.omnichannel-api.com/v1\` | Used for local development and mock testing. No charge. |
| **Production** | \`omni_live_\` | \`https://api.omnichannel-api.com/v1\` | Connected to the live Meta WhatsApp networks. Billing applies. |

---

### Passing Your Token

To authenticate your API requests, pass your API key in the HTTP \`Authorization\` header as a \`Bearer\` token. All requests must be sent over HTTPS; plain HTTP requests will be automatically rejected.

\`\`\`http
GET /v1/messages/omni_msg_8f1d392a9e3d489b HTTP/1.1
Host: api.omnichannel-api.com
Authorization: Bearer omni_live_abc123xyz456...
Content-Type: application/json
\`\`\`

Here is how you would configure it in common programming environments:

:::code-block filename="javascript"
const apiKey = process.env.OMNICHANNEL_API_KEY;

fetch('https://api.omnichannel-api.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: "+14155552671",
    type: "text",
    text: { "body": "Thank you for shopping with us!" }
  })
});
:::

:::code-block filename="python"
import os
import requests

api_key = os.getenv("OMNICHANNEL_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "to": "+14155552671",
    "type": "text",
    "text": { "body": "Thank you for shopping with us!" }
}

response = requests.post(
    "https://api.omnichannel-api.com/v1/messages", 
    json=payload, 
    headers=headers
)
:::

---

### Error Handling

If a request fails authentication, the server returns an \`RFC-7807\` compliant JSON error object.

:::callout type="error"
**Unauthorized Request**
If your API token is invalid, expired, or has been revoked, you will receive a \`401 Unauthorized\` response. Check that your token is correctly configured in your environment variables.
:::

:::api-response-card
#### Authentication Failure (401 Unauthorized)
\`\`\`json
{
  "type": "https://errors.omnichannel-api.com/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "The provided API bearer token is invalid or has been revoked.",
  "code": "AUTH_INVALID_TOKEN",
  "timestamp": "2026-05-17T14:35:12Z"
}
\`\`\`
:::

### Rate Limiting

API keys are restricted to rate limit tiers based on your account level:
* **Developer Starter Plan**: 60 requests/minute.
* **Growth Plan**: 600 requests/minute.
* **Enterprise Plan**: Custom limits with dedicated endpoints.

When you exceed the rate limits, you will receive a \`429 Too Many Requests\` response. High-priority transaction notifications (like OTPs) bypass general rate limit queues using our priority scheduling.`,
    keywords: ['authentication', 'api keys', 'headers', 'rate limit', 'errors', '401'],
    order: 3
  },
  {
    id: 'meta-setup',
    title: 'Meta Setup',
    description: 'Connect your own WhatsApp Business Accounts and verify your brand.',
    category: 'PLATFORM CONFIGURATION',
    slug: 'meta-setup',
    content: `# Meta Setup

To move beyond the testing sandbox and broadcast live messages to your e-commerce customers using your own branded phone numbers, you must integrate your system with the **Meta Business Platform**.

This guide covers Meta Business verification, WhatsApp Business Account (WABA) setup, phone number verification, and generating system user access tokens.

---

### Onboarding Workflow

The Meta onboarding process has 4 key phases:

\`\`\`mermaid
graph LR
    A[Business Manager] -->|Verify| B[Create WABA]
    B -->|Claim Number| C[Verify Phone]
    C -->|Generate Token| D[Production Keys]
\`\`\`

---

### Phase 1: Meta Business Verification

Meta requires business verification to verify your brand's legal entity. Unverified businesses have strict communication limits (sending messages to a maximum of 250 unique customers in a rolling 24-hour window).

1. Log in to the [Meta Business Suite](https://business.facebook.com).
2. Go to **Settings > Business Settings > Security Center**.
3. Under **Business Verification**, click **Start Verification**.
4. Upload official documents proving your company's registration name, address, and phone number (e.g., Articles of Incorporation, Utility Bill, Tax Certificate).
5. Meta typically reviews business applications within 24 to 72 hours. Once verified, your status will change to **Verified** in your Security Center.

---

### Phase 2: Create a WhatsApp Business Account (WABA)

A WhatsApp Business Account (WABA) represents your company's presence on WhatsApp.

1. In Meta Business Settings, go to **Accounts > WhatsApp Accounts**.
2. Click **Add > Create a New WhatsApp Account**.
3. Fill in your WABA Details:
   * **Account Name**: Choose a recognizable name (e.g., *Cartesia E-commerce Operations*).
   * **Timezone**: Set to your core business timezone (critical for scheduling).
   * **Currency**: Used for direct Meta billing conversation fees.
4. Add your business profile details, including logo, website, and support contact details.

---

### Phase 3: Phone Number Verification

To register a phone number for your WABA, the number must be capable of receiving a verification SMS or Voice call.

:::callout type="warning"
**Active Phone Number Requirements**
The phone number must NOT be currently associated with an active personal or business WhatsApp mobile app. If it is, you must completely delete the account in the WhatsApp mobile application first before registering it via the API.
:::

1. Under your WABA settings in Meta Business Suite, navigate to **WhatsApp Manager > Phone Numbers**.
2. Click **Add Phone Number**.
3. Enter your phone number in international format and select your desired **Display Name**.
4. Choose a verification method: **SMS** or **Voice Call**.
5. Input the 6-digit verification code sent to the device.
6. **Display Name Review**: Meta automatically reviews display names to ensure compliance with branding policies. This takes about 1–2 hours.

---

### Phase 4: Permanent Access Token Generation

To authenticate our gateway's calls to the Meta Cloud APIs, you need to generate a **Permanent System User Access Token** in your Meta developer dashboard.

:::step-card
#### Step 1: Create a System User
Go to **Business Settings > Users > System Users**. Click **Add**. Create a new system user called \`omnichannel-sync\` and assign the role of **Admin**.
:::

:::step-card
#### Step 2: Assign WABA Assets
Select the newly created system user. Click **Assigned Assets**. Choose **WhatsApp Accounts**, select your newly created WABA, and toggle on all administrative permissions.
:::

:::step-card
#### Step 3: Generate Token & Assign Scopes
Click **Generate New Token**. Select your Meta App from the dropdown and check the following required permission scopes:
* \`whatsapp_business_messaging\` (Allows sending messages)
* \`whatsapp_business_management\` (Allows managing templates and assets)
* \`business_management\` (Allows syncing accounts)

Click **Generate**. Copy the generated token immediately and store it securely. Paste it into your **OmniChannel Dashboard under Production Integrations** to complete your connection!
:::`,
    keywords: ['meta setup', 'waba', 'verification', 'access token', 'system user', 'phone number'],
    order: 1
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Listen to real-time events like delivery receipts and user messages.',
    category: 'PLATFORM CONFIGURATION',
    slug: 'webhooks',
    content: `# Webhooks

Webhooks are crucial for building a responsive, real-time developer docs communication system. Instead of constantly polling the API for delivery statuses or checking if customers have sent you messages, our webhook engine pushes real-time event notifications straight to your server.

---

### Core Events Schema

When an event occurs on the WhatsApp network, our system registers it and posts a standardized JSON signature to your registered webhook URL.

| Event Type | Description | Trigger Moment |
| :--- | :--- | :--- |
| \`message.sent\` | Message received by OmniChannel | The system has verified authorization and queued the message. |
| \`message.delivered\` | Message delivered to phone | The user's device has received the packet from WhatsApp. |
| \`message.read\` | Message opened by customer | The user has opened the chat window (if read receipts are enabled). |
| \`message.failed\` | Delivery failed | Message blocked, invalid number, or system account suspension. |
| \`message.received\` | Incoming user message | A customer sends a text, image, or button click back to your business. |

---

### Webhook Signature Validation

To ensure that incoming HTTP requests originate from our secure platform and have not been intercepted or forged, we sign every webhook body using your secret **Webhook Verification Token** via an **HMAC-SHA256** hex digest. The signature is passed in the \`X-Omni-Signature\` header.

:::callout type="info"
**Security Best Practice**
Always calculate and compare this signature on your server before processing any webhook payloads!
:::

Here is how you validate the signature in Node.js:

:::code-block filename="server.js"
const crypto = require('crypto');
const express = require('express');
const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

const WEBHOOK_SECRET = process.env.OMNICHANNEL_WEBHOOK_SECRET;

app.post('/webhooks/whatsapp', (req, res) => {
  const signature = req.headers['x-omni-signature'];
  
  // Calculate signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const calculatedSignature = hmac.update(req.rawBody).digest('hex');
  
  if (signature !== calculatedSignature) {
    console.error('Webhook signature mismatch! Aborting request.');
    return res.status(401).send('Invalid signature');
  }
  
  // Signature is valid, process event payload
  const event = req.body;
  console.log(\`Received event: \${event.type} for id \${event.id}\`);
  
  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Listening on port 3000'));
:::

---

### Handshake Challenge

When you add or update your webhook URL in our dashboard, we will send an initial HTTP \`GET\` request to your server to verify ownership. We will append three query parameters:

* \`hub.mode\` (set to \`subscribe\`)
* \`hub.challenge\` (a random alphanumeric string)
* \`hub.verify_token\` (your configured verification secret)

Your server **MUST** verify the token and return the exact \`hub.challenge\` string as plain text with a \`200 OK\` status.

:::code-block filename="get-handshake.js"
app.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WEBHOOK_SECRET) {
    console.log('Webhook validated successfully.');
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
});
:::

---

### Example Event Payload

Here is the JSON structure received when a customer reads a previously sent shipping update notification:

:::api-response-card
#### Webhook Payload (message.read event)
\`\`\`json
{
  "id": "evt_7x8f9a2d3e4b5c",
  "type": "message.read",
  "timestamp": "2026-05-17T14:35:45Z",
  "data": {
    "message_id": "omni_msg_8f1d392a9e3d489b",
    "recipient": "+14155552671",
    "waba_id": "waba_1029384756",
    "updated_at": "2026-05-17T14:35:44Z"
  }
}
\`\`\`
:::`,
    keywords: ['webhooks', 'handshake', 'signature', 'security', 'events', 'hmac'],
    order: 2
  },
  {
    id: 'whatsapp-api',
    title: 'WhatsApp API',
    description: 'Detailed specifications for sending messages, media, and interactive controls.',
    category: 'CORE APIS',
    slug: 'whatsapp-api',
    content: `# WhatsApp API

The core **Messages API** endpoint handles sending outgoing text, high-resolution media, interactive templates, and complex button structures. All parameters are defined in standard JSON payloads.

* **Base URL**: \`https://api.omnichannel-api.com/v1\`
* **HTTP Method**: \`POST\`
* **Endpoint**: \`/messages\`

---

### Sending Branded Text Messages

Simple text communications allow sending plain text up to 4096 characters, complete with emoji support and automated link preview generation (requires configuring your domain origins).

\`\`\`json
{
  "to": "+14155552671",
  "type": "text",
  "text": {
    "body": "Hi there! Your Cartesia package has been picked up. Tracking ID: CRT-9082. Follow progress: https://tracking.cartesia.com/CRT-9082",
    "preview_url": true
  }
}
\`\`\`

---

### Dynamic Media Messages

You can enrich customer communication by sending images, documents, invoices, or audio files. Pass either a hosted URL or a secure media ID (obtained by uploading files to our CDN via \`/media\` endpoint).

Supported formats:
* **Images**: JPEG, PNG (max 5MB)
* **Documents**: PDF, DOCX, XLSX (max 100MB)
* **Audio/Video**: MP3, MP4, AAC (max 16MB)

:::code-block filename="post-media.js"
// Example: Sending a PDF invoice attachment
const payload = {
  to: "+14155552671",
  type: "document",
  document: {
    link: "https://invoices.cartesia.com/inv-9082.pdf",
    filename: "Cartesia_Invoice_9082.pdf",
    caption: "Thank you for your purchase! Here is your PDF receipt."
  }
};

const response = await fetch('https://api.omnichannel-api.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.OMNICHANNEL_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
:::

---

### Interactive Options & Buttons

Increase customer response rates by sending actionable list select sheets or quick-response buttons. Customers can simply tap an option instead of typing out long answers.

:::step-card
#### List Messages
Useful for presenting menus, appointment options, or catalog selections (up to 10 distinct sections).
\`\`\`json
{
  "to": "+14155552671",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": { "type": "text", "text": "Cartesia Customer Support" },
    "body": { "text": "How can we help you today? Select a department:" },
    "footer": { "text": "Response time is typically under 5 minutes" },
    "action": {
      "button": "Select Department",
      "sections": [
        {
          "title": "Order Operations",
          "rows": [
            { "id": "dept_returns", "title": "Returns & Refunds", "description": "Initiate a product return" },
            { "id": "dept_tracking", "title": "Track Order", "description": "Check shipment status" }
          ]
        },
        {
          "title": "Account & Tech",
          "rows": [
            { "id": "dept_billing", "title": "Billing Queries", "description": "Payment issues or invoices" }
          ]
        }
      ]
    }
  }
}
\`\`\`
:::

:::step-card
#### Quick Reply Buttons
Presents up to 3 highly visible, single-tap buttons aligned under a text body or image card.
\`\`\`json
{
  "to": "+14155552671",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "Are you satisfied with your delivery service today?" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "btn_yes", "title": "Yes, highly satisfied" } },
        { "type": "reply", "reply": { "id": "btn_no", "title": "No, had issues" } }
      ]
    }
  }
}
\`\`\`
:::`,
    keywords: ['whatsapp api', 'messages', 'media', 'interactive', 'buttons', 'lists', 'json'],
    order: 3
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Create and broadcast highly-optimized transactional templates.',
    category: 'CORE FEATURES',
    slug: 'templates',
    content: `# Message Templates

To protect users from spam, Meta requires all business-initiated messages sent outside the **24-hour conversation window** to use pre-approved **Message Templates**. If your business initiates contact with a customer, you *must* use a registered template.

Templates undergo automatic AI checks by Meta and are typically approved within 5 minutes.

---

### Template Categories

Meta divides templates into three categories:

1. **Utility (Transactional)**: Crucial updates like order confirmation, shipping tracking, account notices, or security alerts. Low conversation cost.
2. **Authentication**: One-Time Passwords (OTPs) containing secure numerical tokens with secure copy-button actions.
3. **Marketing**: Promotional offers, discount codes, product announcements, or cart reminders.

---

### Dynamic Variables & Placeholders

Templates consist of static text and dynamic placeholders called parameters (represented by double curly braces e.g., \`{{1}}\`, \`{{2}}\`). When sending the message, you pass the actual values in the API payload.

:::code-block filename="template-design.txt"
Hi {{1}}, your order {{2}} has been confirmed! Total: {{3}}. 
We will notify you as soon as your items ship.
:::

---

### Sending a Template Message

To trigger a template message, define the template name, target language, and pass the parameter array in sequence under components:

:::code-block filename="send-template.js"
const response = await fetch('https://api.omnichannel-api.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.OMNICHANNEL_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: "+14155552671",
    type: "template",
    template: {
      name: "order_confirmation_v2",
      language: "en_US",
      components: [
        {
          type: "body",
          parameters: [
            { "type": "text", "text": "Sarah Chen" },      // Matches {{1}}
            { "type": "text", "text": "#CRT-901824" },    // Matches {{2}}
            { "type": "text", "text": "$149.50" }        // Matches {{3}}
          ]
        }
      ]
    }
  })
});
:::

---

### Managing Templates via API

You can programmatically create, query, and delete templates using our asset management endpoints.

#### Endpoint Listing
* \`GET /v1/templates\` - Retrieve all active, pending, and rejected templates.
* \`POST /v1/templates\` - Create and submit a new template design to Meta.
* \`DELETE /v1/templates/{name}\` - Remove a template.

:::api-response-card
#### Response Payload (Listing Templates)
\`\`\`json
[
  {
    "name": "order_confirmation_v2",
    "category": "UTILITY",
    "status": "APPROVED",
    "language": "en_US",
    "components": [
      {
        "type": "HEADER",
        "format": "TEXT",
        "text": "Order Confirmed"
      },
      {
        "type": "BODY",
        "text": "Hi {{1}}, your order {{2}} has been confirmed! Total: {{3}}."
      }
    ],
    "quality_rating": "HIGH"
  }
]
\`\`\`
:::

### Template Quality Ratings

Meta tracks how users interact with your templates. If users frequently block your messages or report a template for spam, the template's **Quality Rating** will drop:
* **High (Green)**: Optimal delivery.
* **Medium (Yellow)**: Under review.
* **Low (Red)**: Paused. If rating doesn't improve, Meta will permanently suspend the template.`,
    keywords: ['templates', 'message templates', 'placeholders', 'utility', 'marketing', 'approvals'],
    order: 2
  },
  {
    id: 'broadcast',
    title: 'Broadcast',
    description: 'Safely send campaign notifications to large lists without spam penalties.',
    category: 'CORE FEATURES',
    slug: 'broadcast',
    content: `# Broadcast

A **Broadcast** allows you to schedule or instantly send a template campaign to thousands of customer phone numbers simultaneously. This is ideal for e-commerce store owners running weekend flash sales, sending holiday greetings, or notifying custom customer segments of operational changes.

---

### Meta Spam Limits & Rate Safeguards

To prevent accounts from being blocked for spam, Meta enforces a daily **Messaging Limit** tier system based on WABA health and verification status:

* **Tier 1**: Send messages to 1,000 unique customers in a rolling 24-hour window.
* **Tier 2**: Send to 10,000 unique customers.
* **Tier 3**: Send to 100,000 unique customers.
* **Tier 4**: Unlimited unique customers.

:::callout type="info"
**Automatic Tier Upgrades**
Meta automatically upgrades your messaging limit tier when you send at least half your daily limit within a 7-day period and maintain a high phone number quality rating.
:::

Our platform acts as a safeguard. When you upload a massive list of numbers, we automatically spread out the dispatch rate to match your current Meta tier constraints, queueing overflow transactions safely.

---

### Executing a Broadcast Campaign

To fire a broadcast campaign, send a payload containing an array of recipients, each with their own isolated parameter variables. This keeps each message deeply personal:

:::code-block filename="post-broadcast.js"
const payload = {
  campaign_name: "cartesia_holiday_special",
  template: {
    name: "holiday_promo_v1",
    language: "en_US"
  },
  recipients: [
    {
      to: "+14155552671",
      variables: [
        { "type": "text", "text": "Sarah" },
        { "type": "text", "text": "20% OFF" },
        { "type": "text", "text": "HOLIDAY20" }
      ]
    },
    {
      to: "+12125559812",
      variables: [
        { "type": "text", "text": "Michael" },
        { "type": "text", "text": "20% OFF" },
        { "type": "text", "text": "HOLIDAY20" }
      ]
    }
  ]
};

const response = await fetch('https://api.omnichannel-api.com/v1/broadcasts', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.OMNICHANNEL_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
:::

---

### Tracking Broadcast Progress

Once a campaign is triggered, it runs in the background. You can query its progress, track delivery analytics, and monitor real-time read-rates:

:::api-response-card
#### Response Payload (Broadcast Status)
\`\`\`json
{
  "broadcast_id": "brd_9f2d3e4b5c6a7d",
  "campaign_name": "cartesia_holiday_special",
  "status": "processing",
  "total_recipients": 1250,
  "metrics": {
    "queued": 250,
    "sent": 1000,
    "delivered": 980,
    "read": 642,
    "failed": 20
  },
  "created_at": "2026-05-17T14:00:00Z"
}
\`\`\`
:::`,
    keywords: ['broadcast', 'campaigns', 'spam filters', 'tiers', 'recipients', 'scheduler'],
    order: 3
  },
  {
    id: 'conversations',
    title: 'Conversations',
    description: 'Understand the WhatsApp 24-hour conversational model and interactive session rules.',
    category: 'CORE FEATURES',
    slug: 'conversations',
    content: `# Conversations

WhatsApp's pricing and messaging mechanics revolve around a **Conversational Model**. Understanding this model is key to designing high-conversion, cost-effective customer support agents and interactive automations.

---

### The 24-Hour Session Window

A WhatsApp session officially starts the millisecond a message is delivered to a customer. This session lasts exactly **24 hours**.

\`\`\`mermaid
sequenceDiagram
    actor Customer
    participant API as OmniChannel API
    Customer->>API: Sends: "Hi, I have a question about returns"
    Note over API: Session Window Opens (24 Hours)
    API->>Customer: Sends text: "Sure! Let me look up your account..." (Free format, no template needed)
    Note over API: Session can extend with any customer reply
    Note over API: 24 Hours pass with no reply
    Note over API: Session Window Closes
    API->>Customer: ERROR: Free-format message rejected (Requires template message to reopen window)
\`\`\`

Within this 24-hour window, you are free to send **free-format session messages**. You do not need to use approved templates. This allows you to deploy custom LLMs, support agents, or automated chat flows.

---

### Conversation Types

Meta classifies and bills conversation sessions into four categories based on how they are initiated:

1. **Service Conversations**: Business responds to user-initiated incoming text messages. Ideal for support ticket resolution.
2. **Utility Conversations**: Business triggers a template notification informing the customer about a transaction.
3. **Authentication Conversations**: Business triggers a template sending safe OTP codes.
4. **Marketing Conversations**: Business initiates a campaign promoting services or products.

---

### Building Automated Interactive Bots

When building automated flows, you listen to incoming webhook messages (\`message.received\`), determine the customer's intent, and immediately post response payloads to the messages endpoint.

Here is a simplified webhook handler routing interactions to a mock customer care responder:

:::code-block filename="bot.js"
app.post('/webhooks/whatsapp', async (req, res) => {
  const event = req.body;

  if (event.type === 'message.received') {
    const customerNumber = event.data.from;
    const messageText = event.data.text?.body.toLowerCase();

    let replyBody = "I'm sorry, I didn't quite catch that. Type 'support' to talk to a human agent.";

    if (messageText.includes('hello') || messageText.includes('hi')) {
      replyBody = "Hello from Cartesia E-commerce! How can we assist you today?";
    } else if (messageText.includes('status') || messageText.includes('order')) {
      replyBody = "You can track your order status live at https://cartesia.com/orders";
    }

    // Send the reply message (free format since we are in the active session window!)
    await fetch('https://api.omnichannel-api.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OMNICHANNEL_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: customerNumber,
        type: "text",
        text: { "body": replyBody }
      })
    });
  }

  res.sendStatus(200);
});
:::`,
    keywords: ['conversations', 'session window', '24-hour rule', 'pricing model', 'bot routing'],
    order: 4
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track delivery statistics, conversion rates, and ROI metrics.',
    category: 'RESOURCES',
    slug: 'analytics',
    content: `# Analytics

Our analytics dashboard and specialized reporting endpoints gather real-time data from incoming webhook delivery statuses, allowing you to gauge customer interaction health, monitor campaign costs, and optimize messaging layouts.

---

### Key Performance Indicators (KPIs)

* **Sent Rate**: Percentage of messages successfully pushed to the Meta gateways.
* **Delivery Rate**: Percentage of sent packets received by active customer hardware. If this drops below 90%, check if your client lists contain inactive numbers.
* **Read Rate (Open Rate)**: Percentage of delivered messages opened by users. WhatsApp open rates typically hover around 95%, making it 4x more effective than traditional email channels.
* **Click-Through Rate (CTR)**: Percentage of users tapping CTA link buttons inside templates.

---

### Fetching Analytical Reports via API

You can programmatically query campaign performance and metrics in structured time series.

* **Endpoint**: \`GET /v1/analytics/overview\`
* **Query Parameters**:
  * \`start_date\`: \`2026-05-10T00:00:00Z\`
  * \`end_date\`: \`2026-05-17T00:00:00Z\`
  * \`granularity\`: \`daily\`

:::api-response-card
#### Response Payload (Analytics Time Series)
\`\`\`json
{
  "total_sent": 45000,
  "total_delivered": 44850,
  "total_read": 42600,
  "average_open_rate": "95.0%",
  "time_series": [
    {
      "date": "2026-05-15",
      "sent": 15000,
      "delivered": 14950,
      "read": 14200,
      "cost": 124.50
    },
    {
      "date": "2026-05-16",
      "sent": 15000,
      "delivered": 14950,
      "read": 14180,
      "cost": 124.50
    },
    {
      "date": "2026-05-17",
      "sent": 15000,
      "delivered": 14950,
      "read": 14220,
      "cost": 124.50
    }
  ]
}
\`\`\`
:::`,
    keywords: ['analytics', 'metrics', 'delivery rate', 'read rate', 'cost analytics', 'json reports'],
    order: 1
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Transitioning from sandbox testing to enterprise production networks.',
    category: 'RESOURCES',
    slug: 'deployment',
    content: `# Deployment

Once you have completed sandbox integration checks and whitelisted your webhook endpoints, you are ready to deploy your e-commerce integration to live production environments.

Follow these best practices to ensure a highly scalable, robust deployment.

---

### Production Deployment Checklist

:::step-card
#### 1. Replace API Secret Keys
Ensure your server configuration completely swaps out development sandbox keys (\`omni_sbx_\`) for production keys (\`omni_live_\`). Configure secret keys inside protected environment storage (like Vercel Secrets, AWS Secrets Manager, or HashiCorp Vault).
:::

:::step-card
#### 2. Verify Domain Origins
Configure allowed CORS origins in the developer console to whitelist your live e-commerce dashboard domains, protecting your account from unauthorized browser queries.
:::

:::step-card
#### 3. Establish Webhook Redundancy
Production webhooks must be resilient. Our gateway expects a \`200 OK\` reply from your webhook route within **5 seconds**. If your endpoint fails or times out, we queue the event payload and retry on an exponential backoff schedule (retrying up to 10 times over 24 hours).

* **Use a Queue**: For high-traffic applications, parse the webhook headers, immediately return a \`202 Accepted\` to our server, and push the payload into a message broker (like Redis BullMQ, RabbitMQ, or Amazon SQS) to process it asynchronously.
:::

---

### Handling Live Webhook Spikes (BullMQ Example)

Processing complex actions (database lookups, triggering third-party APIs) directly inside the express route block can easily exhaust server CPU loops and lead to gateway timeouts during broadcast campaigns.

:::code-block filename="resilient-server.js"
const Queue = require('bull');
const express = require('express');
const app = express();

const webhookQueue = new Queue('webhook-processing', process.env.REDIS_URL);

app.post('/webhooks/whatsapp', (req, res) => {
  const event = req.body;
  
  // 1. Instantly push event to background queue
  webhookQueue.add({ event });
  
  // 2. Reply 202 instantly, freeing the gateway connection in < 50ms!
  res.status(202).send({ status: "accepted" });
});

// Background worker processes items safely without blocking traffic
webhookQueue.process(async (job) => {
  const { event } = job.data;
  console.log(\`Processing event \${event.id} in background...\`);
  // Perform long-running DB transactions or third-party logic here...
});

app.listen(3000);
:::`,
    keywords: ['deployment', 'production check', 'resilience', 'queue', 'bullmq', 'secrets'],
    order: 2
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common errors, system status codes, and recovery procedures.',
    category: 'RESOURCES',
    slug: 'troubleshooting',
    content: `# Troubleshooting

This guide gathers common error codes, system warnings, and architectural issues developers encounter when integrating our WhatsApp SaaS platform, along with recommended recovery steps.

---

### Common Meta/WhatsApp Error Codes

When a message dispatch fails, our API returns the underlying Meta error payload mapped to a predictable developer-friendly error block.

| Error Code | Error Title | Primary Root Cause | Recommended Recovery Action |
| :--- | :--- | :--- | :--- |
| **100** | \`INVALID_PARAMETER\` | Recipient phone number isn't in proper international E.164 format. | Strip spaces, punctuation, leading zeros, and append country code (e.g. \`+1415...\`). |
| **190** | \`EXPIRED_ACCESS_TOKEN\` | Your permanent Meta system user access token has been revoked or expired. | Regenerate your access token inside Meta Business Manager and re-upload it. |
| **131026** | \`MESSAGE_SPAM_BLOCKED\` | Message blocked by Meta's AI algorithms or the user had blocked your sender number. | Avoid sending marketing campaigns to un-opted customers. Maintain high WABA quality. |
| **131051** | \`OUT_OF_SESSION_WINDOW\` | Trying to send a free-format text/media message outside the 24-hour window. | Initiate the conversation using an approved Message Template instead. |

---

### Diagnosing Webhook Failures

If you are not receiving delivery notifications:

1. **Verify Sandbox JOIN Handshake**: Make sure you have whitelisted your test device in sandbox mode by sending \`JOIN sandbox-alpha\` to the sandbox sender.
2. **Review Dashboard Webhook Status**: Check the **Webhooks Settings** tab. We display delivery logs, showing server response codes and elapsed times.
3. **Firewall Blocks**: Ensure your network endpoints allow incoming connections from our public CIDR range: \`44.200.12.0/24\` and \`54.210.82.0/24\`.
4. **Invalid Handshake Challenge**: Ensure your webhook route handles the Initial ownership handshake Challenge correctly, responding with raw text matches.

:::callout type="warning"
**Avoid Processing Blocking Tasks**
If your server holds connection transactions open for more than 5 seconds, our gateway will trigger a timeout failure and schedule retry loops, resulting in duplicated events. Always delegate heavy processing tasks to background queues!
:::`,
    keywords: ['troubleshooting', 'errors', 'codes', '131026', 'out of session', 'webhooks missing'],
    order: 3
  }
];
