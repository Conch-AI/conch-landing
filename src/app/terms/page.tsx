"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                width={28}
                height={28}
                alt="Conch AI"
                className="md:w-8 md:h-8"
              />
              <span className="text-lg md:text-xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent font-semibold">
                Conch
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-[13px] md:text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-[36px] font-medium text-foreground mb-3 md:mb-4">
            Terms of Use
          </h1>
          <p className="text-[13px] md:text-[14px] text-muted-foreground">
            Last Updated: April 8, 2025
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 md:space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              1. AGREEMENT TO TERMS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Yofi tech LLC ., (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of the https://getconch.ai website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
              </p>
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We have our registered office at 23 Westbury Avenue Plainview, NY 11803</li>
                <li>You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use</li>
                <li>We reserve the right to make changes or modifications to these Terms of Use from time to time</li>
                <li>The Site is intended for users who are at least 18 years old</li>
                <li>Persons under the age of 18 are not permitted to use or register for the Site</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              2. INTELLECTUAL PROPERTY RIGHTS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us.
              </p>
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The Content and the Marks are protected by copyright and trademark laws</li>
                <li>No part of the Site may be copied, reproduced, or exploited for any commercial purpose without our express prior written permission</li>
                <li>You are granted a limited license to access and use the Site for your personal, non-commercial use only</li>
                <li>We reserve all rights not expressly granted to you</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              3. USER REPRESENTATIONS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>By using the Site, you represent and warrant that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete</li>
                <li>You will maintain the accuracy of such information and promptly update it as necessary</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Use</li>
                <li>You are not a minor in the jurisdiction in which you reside</li>
                <li>You will not access the Site through automated or non-human means</li>
                <li>You will not use the Site for any illegal or unauthorized purpose</li>
                <li>Your use of the Site will not violate any applicable law or regulation</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              4. USER REGISTRATION
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>You may be required to register with the Site.</p>
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You agree to keep your password confidential</li>
                <li>You will be responsible for all use of your account and password</li>
                <li>We reserve the right to remove, reclaim, or change a username you select if we determine it is inappropriate, obscene, or otherwise objectionable</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              5. FEES AND PAYMENT
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>We accept the following forms of payment:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Visa</li>
                <li>Mastercard</li>
                <li>American Express</li>
                <li>Discover</li>
              </ul>
              <p className="font-medium text-foreground mt-4">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You agree to provide current, complete, and accurate purchase and account information</li>
                <li>You must promptly update account and payment information</li>
                <li>All payments shall be in U.S. dollars</li>
                <li>Sales tax will be added to purchases as required</li>
                <li>We may change prices at any time</li>
                <li>For recurring charges, you consent to our charging your payment method without requiring prior approval for each charge</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              6. UNLIMITED USE
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The term &quot;unlimited&quot; is limited to a maximum of tokens per user, per month</li>
                <li>The maximum limit for all accounts is 1 million tokens</li>
                <li>Beyond this limit, we reserve the right to refuse service</li>
                <li>This limitation ensures all users have access and prevents misuse</li>
                <li>This limit is subject to change at any time</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              7. FREE TRIAL
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We offer a free trial to users who visit the Site</li>
                <li>The amount of usage a user receives is subject to change</li>
                <li>The account will be charged according to the user&apos;s chosen subscription at the end of the free trial</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              8. CANCELLATION
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All purchases are non-refundable</li>
                <li>You can cancel your subscription at any time by logging into your account</li>
                <li>Your cancellation will take effect at the end of the current paid term</li>
                <li>If you are unsatisfied with our services, please email us at help@getconch.ai</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              9. PROHIBITED ACTIVITIES
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Systematically retrieve data or other content from the Site to create or compile a collection, database, or directory without written permission</li>
                <li>Trick, defraud, or mislead us and other users, especially to learn sensitive account information</li>
                <li>Circumvent, disable, or interfere with security-related features of the Site</li>
                <li>Disparage, tarnish, or otherwise harm us and/or the Site</li>
                <li>Use any information obtained from the Site to harass, abuse, or harm another person</li>
                <li>Make improper use of our support services or submit false reports</li>
                <li>Use the Site in a manner inconsistent with any applicable laws or regulations</li>
                <li>Engage in unauthorized framing of or linking to the Site</li>
                <li>Upload or transmit viruses, Trojan horses, or other harmful material</li>
                <li>Engage in any automated use of the system</li>
                <li>Delete the copyright or other proprietary rights notice from any Content</li>
                <li>Attempt to impersonate another user or person</li>
                <li>Interfere with, disrupt, or create an undue burden on the Site</li>
                <li>Harass, annoy, intimidate, or threaten any of our employees or agents</li>
                <li>Copy or adapt the Site&apos;s software</li>
                <li>Use the Site as part of any effort to compete with us</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              10. USAGE POLICY
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                Our platform is committed to promoting academic integrity and prohibits any form of academic dishonesty, including plagiarism, cheating, collusion, fabrication, and facilitating dishonest acts.
              </p>
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users are expected to use our services and resources ethically and responsibly</li>
                <li>Violations may result in warnings, temporary suspensions, permanent bans, or account termination</li>
                <li>We utilize third-party software and services with their own terms of service</li>
                <li>By using our platform, you agree to comply with third-party provider terms</li>
                <li>We reserve the right to terminate services for violations of third-party provider terms</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              11. API POLICY
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>By accessing our API, you agree to be bound by our Terms of Service and usage policies</li>
                <li>Users must adhere to policies including academic integrity, data protection, and privacy</li>
                <li>All API transactions are non-refundable and non-transferable</li>
                <li>No refunds regardless of actual usage, service interruptions, or account termination</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              12. USER GENERATED CONTRIBUTIONS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                The Site does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site.
              </p>
              <p className="font-medium text-foreground">When you create or make available any Contributions, you represent and warrant that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The creation, distribution, transmission, public display, or performance will not infringe the proprietary rights of any third party</li>
                <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions</li>
                <li>You have the written consent of each identifiable individual person in your Contributions</li>
                <li>Your Contributions are not false, inaccurate, or misleading</li>
                <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, or spam</li>
                <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, or otherwise objectionable</li>
                <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone</li>
                <li>Your Contributions are not used to harass or threaten any other person</li>
                <li>Your Contributions do not violate any applicable law, regulation, or rule</li>
                <li>Your Contributions do not violate the privacy or publicity rights of any third party</li>
              </ul>
            </div>
          </section>

          {/* Section 13-18 - Shortened for brevity, following same pattern */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              13. CONTRIBUTION LICENSE
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We may access, store, process, and use any information you provide</li>
                <li>By submitting feedback, you agree we can use it without compensation</li>
                <li>We do not assert ownership over your Contributions</li>
                <li>You retain full ownership of all your Contributions</li>
                <li>You are solely responsible for your Contributions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              14. SOCIAL MEDIA
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You may link your account with third-party service providers (Third-Party Accounts)</li>
                <li>We may access and store content from your Third-Party Account</li>
                <li>You can disable the connection at any time</li>
                <li>Your relationship with third-party providers is governed by your agreement with them</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              15. SITE MANAGEMENT
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>We reserve the right, but not the obligation, to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Monitor the Site for violations of these Terms of Use</li>
                <li>Take appropriate legal action against violators</li>
                <li>Refuse, restrict access to, limit availability of, or disable any of your Contributions</li>
                <li>Remove or disable files that are excessive in size or burdensome to our systems</li>
                <li>Manage the Site to protect our rights and property</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              16. PRIVACY POLICY
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We care about data privacy and security</li>
                <li>By using the Site, you agree to be bound by our Privacy Policy</li>
                <li>The Site is hosted in the United States</li>
                <li>By using the Site, you agree to have your data transferred to and processed in the United States</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              17. TERM AND TERMINATION
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>These Terms remain in full force while you use the Site</li>
                <li>We reserve the right to deny access to the Site for any reason</li>
                <li>We may terminate your account at any time without warning</li>
                <li>If terminated, you are prohibited from creating a new account</li>
                <li>We reserve the right to take appropriate legal action</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              18. MODIFICATIONS AND INTERRUPTIONS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We reserve the right to change, modify, or remove Site contents at any time</li>
                <li>We have no obligation to update information on the Site</li>
                <li>We may modify or discontinue the Site without notice</li>
                <li>We cannot guarantee the Site will be available at all times</li>
                <li>We have no liability for any downtime or discontinuance</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              19. GOVERNING LAW
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                These Terms of Use and your use of the Site are governed by and construed in accordance with the laws of the State of Delaware.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              20. DISPUTE RESOLUTION
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Informal Negotiations:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Parties agree to first attempt to negotiate any Dispute informally for at least 30 days</li>
              </ul>
              <p className="font-medium text-foreground">Binding Arbitration:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>If informal negotiations fail, the Dispute will be resolved by binding arbitration</li>
                <li>Arbitration conducted under AAA Commercial Arbitration Rules</li>
                <li>Arbitration fees may be limited based on AAA Consumer Rules</li>
                <li>Arbitration will take place in Delaware</li>
              </ul>
              <p className="font-medium text-foreground">Restrictions:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>No arbitration shall be joined with any other proceeding</li>
                <li>No class-action arbitration or procedures</li>
                <li>Disputes must be commenced within one (1) year after the cause of action arose</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              21. DISCLAIMER
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground uppercase">
                The Site is provided on an as-is and as-available basis. We disclaim all warranties, express or implied, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties about accuracy or completeness of content</li>
                <li>We assume no liability for errors, personal injury, property damage, unauthorized access, interruptions, bugs, viruses, or errors</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              22. LIMITATIONS OF LIABILITY
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We will not be liable for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages</li>
                <li>Our liability is limited to the amount paid by you during the six (6) month period prior to any cause of action</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              23. INDEMNIFICATION
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>You agree to defend, indemnify, and hold us harmless from any loss, damage, liability, claim, or demand arising out of:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your use of the Site</li>
                <li>Breach of these Terms of Use</li>
                <li>Any breach of your representations and warranties</li>
                <li>Your violation of the rights of a third party</li>
                <li>Any harmful act toward any other user of the Site</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              24. ELECTRONIC COMMUNICATIONS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Visiting the Site and sending emails constitute electronic communications</li>
                <li>You consent to receive electronic communications</li>
                <li>You agree to the use of electronic signatures, contracts, orders, and records</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              25. MISCELLANEOUS
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Key points:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>These Terms constitute the entire agreement between you and us</li>
                <li>Our failure to exercise any right shall not operate as a waiver</li>
                <li>We may assign our rights and obligations to others at any time</li>
                <li>No joint venture, partnership, or agency relationship is created</li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              26. CONTACT US
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
              <div className="mt-4 space-y-1">
                <p className="font-medium text-foreground">Yofi tech LLC</p>
                <p>23 Westbury Avenue</p>
                <p>Plainview, NY 11803</p>
                <p>
                  <a href="mailto:help@getconch.ai" className="text-[#6366f1] hover:underline">
                    help@getconch.ai
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 md:mt-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] md:text-[13px] text-muted-foreground">
              © 2026 Yofi Tech, LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-[12px] md:text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[12px] md:text-[13px] text-[#6366f1] font-medium"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
