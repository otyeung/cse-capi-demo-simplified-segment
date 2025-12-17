# [CAPI] LinkedIn CAPI Onboarding Guide with Segment for Website Events

**Date:** December 16, 2025

Server-side event tracking decouples data collection from browsers and applications, providing enhanced control, resiliency, and governance. Segment is purpose-built for this architecture: it ingests events from any source (JavaScript, CRM), enriches them, and routes them to destinations (LinkedIn CAPI) with low latency.

## Objective

This guide provides step-by-step instructions for configuring both client-side (JavaScript source) and server-side (LinkedIn CAPI) components to track and forward two key events:

- **Page View** (page method)
- **Form Submission** (track method)

By completing this guide, you will establish a fully functional setup where qualified identity signals and event data are collected from the webpage, processed within Segment, and successfully transmitted to LinkedIn for conversion reporting.

## Implementation Steps

### 1. Install LinkedIn Insight Tag

Install the LinkedIn Insight Tag on your website to enable first-party cookie tracking.

**Verify li_fat_id cookie functionality:**

- Visit your website with `?li_fat_id=123456` appended to the URL
- Open the browser console and verify the `li_fat_id` cookie is set
  ![Verify li_fat_id cookie is present](./screenshot/li_fat_id.png 'Verify li_fat_id cookie is present')

### 2. Install Segment Snippet

**Installation:**

1. Navigate to **Sources → JavaScript** in your Segment workspace
2. Copy the Segment snippet
3. Paste it high in the `<head>` section of your website

![Copy Segment snippet](./screenshot/segment.png 'Copy Segment snippet')

**Verification:**

Confirm that `analytics.js` has loaded successfully in the browser.

![Verify analytics.js is loaded](./screenshot/segment_verify.png 'Verify analytics.js is loaded')

### 3. Configure Website Data Collection

Website data collection is implemented using Segment's JavaScript source.

**Supported Methods:**

The LinkedIn Conversions API destination supports the following Segment methods: Page, Alias, Group, Identify, and Track.

| Method       | Use Case                                                       | Documentation                                                                     |
| ------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Page**     | Capture page views and page-level context                      | [Segment Page](https://www.twilio.com/docs/segment/connections/spec/page)         |
| **Track**    | Capture explicit user actions or events (e.g. Form Submission) | [Segment Track](https://www.twilio.com/docs/segment/connections/spec/track)       |
| **Alias**    | Merge two user identities (e.g., anonymous → logged-in)        | [Segment Alias](https://www.twilio.com/docs/segment/connections/spec/alias)       |
| **Group**    | Associate a user with an account / organization                | [Segment Group](https://www.twilio.com/docs/segment/connections/spec/group)       |
| **Identify** | Identify a user and set user traits                            | [Segment Identify](https://www.twilio.com/docs/segment/connections/spec/identify) |

**Implementation Examples:**

Below are code examples for each supported method:

```javascript
// Page method - to be included on every page to capture page view events
analytics.page('Page View', 'Home Page', {
  path: '/',
  referrer: '',
  search: '?li_fat_id=123456',
  title: 'LinkedIn Online CAPI Demo for Segment',
  url: 'https://cse-capi-demo-simplified-segment.vercel.app/?li_fat_id=123456',
  category: 'Page View',
  name: 'Home Page',
  li_fat_id: '123456',
  timestamp: 1765892233549,
  debug: true,
})

// Track method - to be included on form submission pages to capture form submission events
analytics.track('Sign Up', {
  hashedEmail:
    '55e79200c1635b37ad31a378c39feb12f120f116625093a19bc32fff15041149',
  lastName: 'Doe',
  firstName: 'John',
  title: 'Engineer',
  company: 'Acme Inc',
  countryCode: 'US',
  li_fat_id: '123456',
  timestamp: 1765892391748,
  debug: true,
})

// Alias method
// Use case: Merge two user identities (e.g., anonymous → logged-in)
analytics.alias('user_12345', {
  previousId: 'anonymous_abcde',
  reason: 'User logged in after signup',
  li_fat_id: '123456',
  timestamp: 1765892391748,
  debug: true,
})

// Group method
// Use case: Associate a user with an account or organization
analytics.group('org_98765', {
  name: 'Acme Corporation',
  industry: 'Technology',
  plan: 'Enterprise',
  employees: 500,
  country: 'US',
  isCustomer: true,
  customField1: 'Priority Account',
  customField2: 2025,
  li_fat_id: '123456',
  timestamp: 1765892391748,
  debug: true,
})

// Identify method
// Use case: Identify a user and set user traits
analytics.identify('user_12345', {
  hashedEmail: '123456abcdef7890',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  title: 'Engineer',
  company: 'Acme Inc',
  countryCode: 'US',
  plan: 'Pro',
  createdAt: '2024-01-15T10:30:00Z',
  customField1: 'beta_user',
  customField2: true,
  li_fat_id: '123456',
  timestamp: 1765892391748,
  debug: true,
})
```

**Implementation Requirements:**

Implement the `page` and `track` methods in your website code to track Page View and Form Submission events.

> **Note:** You must include `li_fat_id` and `timestamp` (epoch timestamp in milliseconds) in the context of every event. This is required by LinkedIn CAPI.

### 4. Configure LinkedIn CAPI Conversions

**Setup:**

1. Navigate to **Measurement → Conversions → Create → Conversions API** in your LinkedIn Ads account
2. Create CAPI conversions for "Page View" and "Form Submission" events
3. Select "Segment" as the data source

![Create CAPI conversion in LinkedIn Ads account](./screenshot/segment_capi.png 'Create CAPI conversion in LinkedIn Ads account')

### 5. Test Event Collection

**Verification:**

1. Trigger test events from your website
2. Open the Segment Debugger to verify events are being received
3. Confirm that events include `li_fat_id` and `timestamp` in the context

![Segment Debugger Page View Event](./screenshot/segment_debugger_pageview.png 'Segment Debugger Page View Event')
![Segment Debugger Form Submission Event](./screenshot/segment_debugger_formsubmission.png 'Segment Debugger Form Submission Event')

### 6. Create LinkedIn Conversions API Destination

**Configuration:**

1. Create a "LinkedIn Conversions API" destination in Segment
2. Configure it with your LinkedIn Ads account credentials

![Create LinkedIn Conversions API destination in Segment](./screenshot/segment_destination.png 'Create LinkedIn Conversions API destination in Segment')

> **Note:** You can create multiple "LinkedIn Conversions API" destinations, each configured with different LinkedIn Ads account credentials.

### 7. Create Event Mappings

**Setup:**

1. Create mappings in Segment to route website events to LinkedIn CAPI conversion events
2. Each destination can include multiple mappings (one per conversion event type)

![Create Mappings in Segment](./screenshot/segment_mapping.png 'Create Mappings in Segment')

### 8. Configure Mapping Details

**Event Trigger Configuration:**

1. Select "Edit Mapping" to configure the mapping details
2. Define event triggers that match specific event types (e.g., Page View, Form Submission)

![Configure Mapping details in Segment](./screenshot/segment_mapping_details.png 'Configure Mapping details in Segment')

![Define Event Trigger for Page View event](./screenshot/segment_mapping_details_pageview.png 'Define Event Trigger for Page View event')

![Define Event Trigger for Form Submission event](./screenshot/segment_mapping_details_formsubmission.png 'Define Event Trigger for Form Submission event')

**Field Mapping:**

Map fields from website events to LinkedIn CAPI conversion events.

![Map fields for Page View event](./screenshot/segment_mapping_details_pageview_fields.png 'Map fields for Page View event')

![Map fields for Form Submission event](./screenshot/segment_mapping_details_formsubmission_fields-1.png 'Map fields for Form Submission event')
![Map fields for Form Submission event](./screenshot/segment_mapping_details_formsubmission_fields-2.png 'Map fields for Form Submission event')

**Required Fields:**

- **Currency code** and **conversion value**: Required for all events (use "USD 0" if no actual value)
- **Timestamp**: Epoch timestamp in milliseconds
- **Match field**: At least one identifier is required:
  - **Page View**: `li_fat_id`
  - **Form Submission**: `hashedEmail` and/or `lastName` + `firstName` and/or `li_fat_id`

> **Note:** Segment automatically hashes email addresses (if not already hashed) before sending to LinkedIn.

### 9. Test and Verify Integration

**Send Test Event:**

1. Scroll to the bottom of the mapping configuration page
2. Click "Send test event" to trigger a test event

![Send test event from Segment Mapping](./screenshot/segment_mapping_details_sendtestevent.png 'Send test event from Segment Mapping')

**Verification in Segment:**

Confirm the message "Test event successfully received by destination" appears.

![Verify test event in Segment](./screenshot/segment_mapping_details_testeventreceived.png 'Verify test event in Segment')

**Verification in LinkedIn:**

1. Navigate to **Measurement → Conversion Tracking** in LinkedIn Ads Account
2. Verify the conversion status shows as "Active"

![Verify test event in LinkedIn Ads account](./screenshot/linkedin_testevent.png 'Verify test event in LinkedIn Ads account')

**Finalize:**

Save the mapping to complete the setup.

## Appendix

### Additional Resources

**LinkedIn Conversions API Destination Documentation:**

- [Segment LinkedIn Conversions API Destination](https://www.twilio.com/docs/segment/connections/destinations/catalog/actions-linkedin-conversions)

**Example Implementation:**

- [GitHub Repository](https://github.com/otyeung/cse-capi-demo-simplified-segment) - Source code with Segment integration
- [Live Demo](https://cse-capi-demo-simplified-segment.vercel.app/?li_fat_id=123456) - Working example
