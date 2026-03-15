'use client'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'


const TABS = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'shipping', label: 'Shipping Policy' },
  { id: 'returns', label: 'Returns & Exchanges' },
  { id: 'cookies', label: 'Cookie Policy' },
  { id: 'care', label: 'Care Guide' },
]

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: `When you use Ghar Sajaoo, we collect: (a) Account information — your name, email address, and profile photo from Google when you sign in via Google OAuth. (b) Order information — shipping address, phone number, and payment confirmation details. (c) Usage data — pages visited, products viewed, and cart activity to improve your shopping experience. We do not store credit card numbers or banking credentials; payments are processed entirely by Razorpay.`,
      },
      {
        heading: '2. How We Use Your Information',
        body: `We use your information to: process and fulfil your orders; communicate order status and shipping updates; provide customer support; send occasional newsletters (only if you opt in); improve our website and personalise your experience; comply with legal obligations. We never sell your personal information to third parties.`,
      },
      {
        heading: '3. Data Sharing',
        body: `We share your data only with: Razorpay (for payment processing); shipping partners (name, address, phone for delivery); Supabase (our secure database provider). All third-party partners are bound by strict data protection agreements.`,
      },
      {
        heading: '4. Data Retention',
        body: `We retain your personal data for as long as your account is active. Order data is retained for 7 years as required by Indian financial regulations. Session and cart data older than 10 days is automatically deleted. You may request deletion of your account and data at gharsajaoo@gmail.com.`,
      },
      {
        heading: '5. Your Rights',
        body: `Under the Digital Personal Data Protection Act, 2023 (India), you have the right to: access your personal data; correct inaccurate data; delete your data (with certain exceptions); withdraw consent; nominate a person to exercise rights on your behalf. To exercise any of these rights, contact us at gharsajaoo@gmail.com.`,
      },
      {
        heading: '6. Security',
        body: `We implement industry-standard security measures including SSL/TLS encryption, secure authentication via Google OAuth, and regular security audits. However, no method of internet transmission is 100% secure and we cannot guarantee absolute security.`,
      },
      {
        heading: '7. Contact',
        body: `For privacy concerns: gharsajaoo@gmail.com | Ghar Sajaoo Prints Limited, New Delhi – 110001, India.`,
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: `By accessing or using the Ghar Sajaoo website (gharsajaoo.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.`,
      },
      {
        heading: '2. Products and Pricing',
        body: `All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice. Product images are for illustrative purposes; slight variations in colour may occur due to photography and screen settings. Handcrafted items may have natural variations — these are features, not defects.`,
      },
      {
        heading: '3. Order Acceptance',
        body: `Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including orders suspected of fraud or orders we are unable to fulfil due to stock unavailability. You will be notified and fully refunded if your order is cancelled by us.`,
      },
      {
        heading: '4. Payments',
        body: `Payments are processed by Razorpay. By completing a purchase you also agree to Razorpay's terms of service. We accept UPI, credit/debit cards, net banking, and wallets. All transactions are in INR.`,
      },
      {
        heading: '5. Intellectual Property',
        body: `All content on this site — including text, images, logos, product designs, and artwork — is the property of Ghar Sajaoo Prints Limited or our content suppliers and is protected by Indian copyright law. You may not reproduce, distribute, or create derivative works without explicit written consent.`,
      },
      {
        heading: '6. Limitation of Liability',
        body: `Ghar Sajaoo shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our maximum liability shall not exceed the amount paid for the specific product in question.`,
      },
      {
        heading: '7. Governing Law',
        body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`,
      },
    ],
  },

  shipping: {
    title: 'Shipping Policy',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Shipping Timelines',
        body: `Orders are processed within 1–2 business days. Standard delivery takes 5–7 business days across India. Express delivery (2–3 days) is available for select pin codes at an additional charge. Orders placed on Sundays or public holidays are processed the next business day.`,
      },
      {
        heading: 'Shipping Charges',
        body: `Free shipping on all orders above ₹999. Orders below ₹999 attract a flat shipping fee of ₹99. Remote area surcharges may apply for North-Eastern states, J&K, Ladakh, and island territories. Express delivery charges are displayed at checkout.`,
      },
      {
        heading: 'Packaging',
        body: `We take immense care in packaging every item. Fragile products (vases, frames) are wrapped in bubble wrap and cushioned. All packaging is made from recycled and recyclable materials. Gift packaging is available for ₹49 per order.`,
      },
      {
        heading: 'Order Tracking',
        body: `A tracking number will be sent to your registered email once your order is dispatched. You can track your order in the "My Orders" section of your profile. For issues with tracking, contact our support team.`,
      },
      {
        heading: 'Delivery Attempts',
        body: `Our courier partner will attempt delivery up to 3 times. If delivery is unsuccessful, the order will be returned to our warehouse. Re-delivery is possible upon request — an additional shipping charge applies.`,
      },
      {
        heading: 'Damaged in Transit',
        body: `If your product arrives damaged, please photograph the damage within 24 hours of delivery and email gharsajaoo@gmail.com. We will arrange a replacement or full refund within 3–5 business days.`,
      },
    ],
  },

  returns: {
    title: 'Returns & Exchanges',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Return Window',
        body: `We offer a 7-day return window from the date of delivery. Products must be unused, in original condition, and in original packaging. Custom or personalised orders are non-returnable unless damaged.`,
      },
      {
        heading: 'Eligible Returns',
        body: `We accept returns for: items received in damaged condition; items significantly different from their description; wrong items delivered. We do not accept returns for: items with natural variations (handcrafted products); change of mind after delivery; items without original packaging.`,
      },
      {
        heading: 'How to Initiate a Return',
        body: `Email gharsajaoo@gmail.com with your order number, photo of the item, and reason for return. Our team will respond within 24 hours. Approved returns will be picked up by our courier partner at no charge to you.`,
      },
      {
        heading: 'Refund Process',
        body: `Once your return is received and inspected, a refund will be processed within 3–5 business days. Refunds are credited to your original payment method. For UPI and net banking, refunds may take up to 7 business days depending on your bank.`,
      },
      {
        heading: 'Exchanges',
        body: `We currently do not offer direct exchanges. To get a different product, please return the original item and place a new order. Return shipping is free for approved returns.`,
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'What Are Cookies',
        body: `Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep you signed in, and understand how you use our site.`,
      },
      {
        heading: 'Cookies We Use',
        body: `Essential cookies (required for the site to function — cart, authentication), Analytics cookies (help us understand site traffic and usage patterns — anonymised), Preference cookies (remember your language and display preferences). We do not use third-party advertising cookies.`,
      },
      {
        heading: 'Managing Cookies',
        body: `You can control cookies through your browser settings. Disabling essential cookies may affect site functionality, including the ability to add items to cart or maintain your login session.`,
      },
    ],
  },

  care: {
    title: 'Care Instructions',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Wall Art & Frames',
        body: `Dust with a soft, dry microfibre cloth. Avoid direct sunlight for prolonged periods as it may fade colours. Do not use water or chemical cleaners on wooden frames. LED frames — use only the provided adapter; do not leave plugged in unattended overnight.`,
      },
      {
        heading: 'Vases & Ceramics',
        body: `Marble and stone vases: wipe with a damp cloth; avoid acidic cleaners. Glass vases: top-rack dishwasher safe unless stated otherwise; rinse thoroughly after fresh flowers. Terracotta planters: soak in water for 30 minutes before first use; the natural porosity is a feature that benefits plant roots.`,
      },
      {
        heading: 'Textiles & Cushions',
        body: `Block-print cushion covers: hand wash or gentle machine wash in cold water; do not bleach; air dry in shade to preserve colours. Jute runners: spot clean with a damp cloth; do not machine wash; store in a dry place.`,
      },
      {
        heading: 'Brass & Metal',
        body: `Brass diyas: polish occasionally with a soft cloth and brass cleaner to maintain shine; avoid prolonged contact with water. Natural tarnishing of brass is normal and considered a mark of authenticity.`,
      },
      {
        heading: 'Bamboo Products',
        body: `Wipe clean with a slightly damp cloth. Avoid submerging in water. Keep away from excessive heat. Occasional application of linseed oil maintains the natural sheen of bamboo.`,
      },
    ],
  },
}

const LegalInner = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'privacy'
  const content = CONTENT[activeTab] || CONTENT.privacy

  useEffect(() => {
    document.title = `${content.title} — Ghar Sajaoo`
    window.scrollTo(0, 0)
  }, [activeTab, content.title])

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page header */}
      <div className="bg-softgray border-b border-gold/20 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="section-subtitle">Legal & Support</p>
          <h1 className="section-title mt-2">{content.title}</h1>
          <p className="font-body text-xs text-textbrown/40 mt-2">Last updated: {content.updated}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">

        {/* Tab navigation */}
        <aside className="lg:w-52 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => router.push(`?tab=${tab.id}`)}
                className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brown text-white'
                    : 'text-textbrown hover:text-brown hover:bg-cream-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 min-w-0">
          <div className="bg-white shadow-card p-8 lg:p-12">
            <h2 className="font-heading text-2xl text-dark font-semibold mb-8 pb-4 border-b border-gold/20">
              {content.title}
            </h2>

            <div className="space-y-8">
              {content.sections.map(section => (
                <section key={section.heading}>
                  <h3 className="font-heading text-base font-semibold text-dark mb-3">
                    {section.heading}
                  </h3>
                  <p className="font-body text-sm text-textbrown/80 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-gold/20">
              <p className="font-body text-xs text-textbrown/40">
                If you have questions about this {content.title.toLowerCase()}, please contact us at{' '}
                <a href="mailto:gharsajaoo@gmail.com" className="text-brown hover:text-amber transition-colors">
                  gharsajaoo@gmail.com
                </a>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

const Legal = (props) => (
  <React.Suspense fallback={<div className="min-h-screen bg-cream pt-20" />}>
    <LegalInner {...props} />
  </React.Suspense>
)

export default Legal
