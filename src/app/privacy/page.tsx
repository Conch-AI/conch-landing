"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-[13px] md:text-[14px] text-muted-foreground">
            Last Updated: April 8, 2025
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-8 md:mb-12 p-6 md:p-8 bg-gradient-to-br from-[#8b5cf6]/5 to-[#6366f1]/5 border border-[#6366f1]/20 rounded-2xl">
          <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
            Summary Of Key Points
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-6">
            This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                What personal information do we process?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Yofi Tech LLC, and the Services, the choices you make, and the products and features you use.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                Do we process any sensitive personal information?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                We do not process sensitive personal information.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                Do we receive any information from third parties?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                We do not receive any information from third parties.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                How do we process your information?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                In what situations and with which parties do we share personal information?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                We may share information in specific situations and with specific third parties.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                How do we keep your information safe?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be secure.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                What are your rights?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
              </p>
            </div>

            <div>
              <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                How do you exercise your rights?
              </p>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                The easiest way to exercise your rights is by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 md:space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              WHAT INFORMATION DO WE COLLECT?
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] md:text-[16px] font-medium text-foreground mb-3">
                  Personal information you disclose to us
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-3">
                  <span className="font-medium text-foreground">In Short:</span> We collect personal information that you provide to us.
                </p>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-3">
                  We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                </p>

                <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                  Personal Information Provided by You:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4">
                  <li>Names</li>
                  <li>Phone numbers</li>
                  <li>Email addresses</li>
                  <li>Job titles</li>
                  <li>Passwords and usernames</li>
                  <li>Contact preferences and authentication data</li>
                  <li>Billing addresses</li>
                  <li>Debit/credit card numbers</li>
                  <li>Mailing addresses</li>
                </ul>

                <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                  Sensitive Information:
                </p>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4">
                  We do not process sensitive information.
                </p>

                <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                  Payment Data:
                </p>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4">
                  We may collect data necessary to process your payment if you make purchases. All payment data is stored by our payment processors, PayPal and Stripe.
                </p>

                <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                  Social Media Login Data:
                </p>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                  We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account.
                </p>
              </div>

              <div>
                <h3 className="text-[15px] md:text-[16px] font-medium text-foreground mb-3">
                  Information automatically collected
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-3">
                  <span className="font-medium text-foreground">In Short:</span> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.
                </p>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed mb-4">
                  We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information.
                </p>

                <p className="text-[13px] md:text-[14px] font-medium text-foreground mb-2">
                  The information we collect includes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                  <li><span className="font-medium text-foreground">Log and Usage Data:</span> Service-related, diagnostic, usage, and performance information including IP address, device information, browser type, and activity in the Services</li>
                  <li><span className="font-medium text-foreground">Device Data:</span> Information about your computer, phone, tablet, or other device including IP address, device identification numbers, browser type, and hardware model</li>
                  <li><span className="font-medium text-foreground">Location Data:</span> Information about your device&apos;s location, which can be either precise or imprecise based on GPS and other technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW DO WE PROCESS YOUR INFORMATION?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
              </p>
              <p className="font-medium text-foreground">We process your personal information for a variety of reasons:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To facilitate account creation and authentication and otherwise manage user accounts</li>
                <li>To request feedback and contact you about your use of our Services</li>
                <li>To send you marketing and promotional communications (you can opt out at any time)</li>
                <li>To protect our Services through fraud monitoring and prevention</li>
                <li>To identify usage trends and improve our Services</li>
                <li>To determine the effectiveness of our marketing campaigns</li>
                <li>To save or protect an individual&apos;s vital interest</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law.
              </p>

              <div className="mt-4">
                <p className="font-medium text-foreground mb-2">If you are located in the EU or UK:</p>
                <p className="mb-3">The GDPR and UK GDPR require us to explain the valid legal bases we rely on. We may rely on the following legal bases:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium text-foreground">Consent:</span> We may process your information if you have given us permission for a specific purpose. You can withdraw consent at any time.</li>
                  <li><span className="font-medium text-foreground">Legitimate Interests:</span> We may process your information when reasonably necessary to achieve our legitimate business interests, such as:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Sending users information about special offers</li>
                      <li>Analyzing how our Services are used to improve them</li>
                      <li>Supporting marketing activities</li>
                      <li>Diagnosing problems and preventing fraud</li>
                    </ul>
                  </li>
                  <li><span className="font-medium text-foreground">Legal Obligations:</span> We may process your information where necessary for compliance with legal obligations</li>
                  <li><span className="font-medium text-foreground">Vital Interests:</span> We may process your information to protect vital interests or safety</li>
                </ul>
              </div>

              <div className="mt-4">
                <p className="font-medium text-foreground mb-2">If you are located in Canada:</p>
                <p>We may process your information if you have given us specific permission (express consent) or in situations where your permission can be inferred (implied consent). You can withdraw consent at any time.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We may share information in specific situations described in this section and/or with the following third parties.
              </p>
              <p className="font-medium text-foreground">We may need to share your personal information in the following situations:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium text-foreground">Business Transfers:</span> We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We may use cookies and other tracking technologies to collect and store your information.
              </p>
              <p>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.
              </p>
              <p>
                Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). The profile information we receive may vary depending on the social media provider but will often include your name, email address, friends list, and profile picture.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW LONG DO WE KEEP YOUR INFORMATION?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
              </p>
              <p>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. No purpose in this notice will require us keeping your personal information for longer than three (3) months past the termination of the user&apos;s account.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW DO WE KEEP YOUR INFORMATION SAFE?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> We aim to protect your personal information through a system of organizational and technical security measures.
              </p>
              <p>
                We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be secure.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              WHAT ARE YOUR PRIVACY RIGHTS?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information.
              </p>
              <p>
                You may review, change, or terminate your account at any time. In some regions, you have certain rights under applicable data protection laws. These may include the right:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To request access and obtain a copy of your personal information</li>
                <li>To request rectification or erasure</li>
                <li>To restrict the processing of your personal information</li>
                <li>To data portability (if applicable)</li>
                <li>To object to the processing of your personal information (in certain circumstances)</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              CONTROLS FOR DO-NOT-TRACK FEATURES
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.
              </p>
              <p>
                California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information we disclosed to third parties for direct marketing purposes.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              DO WE MAKE UPDATES TO THIS NOTICE?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">In Short:</span> Yes, we will update this notice as necessary to stay compliant with relevant laws.
              </p>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) at:</p>
              <div className="mt-4 space-y-1">
                <p className="font-medium text-foreground">Conch AI Inc.</p>
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

          {/* Review/Update Section */}
          <section>
            <h2 className="text-[18px] md:text-[20px] font-medium text-foreground mb-4">
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </h2>
            <div className="space-y-3 text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
              <p>
                Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please submit a request to{" "}
                <a href="mailto:help@getconch.ai" className="text-[#6366f1] hover:underline">
                  help@getconch.ai
                </a>
                .
              </p>
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
                className="text-[12px] md:text-[13px] text-[#6366f1] font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[12px] md:text-[13px] text-muted-foreground hover:text-foreground transition-colors"
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
