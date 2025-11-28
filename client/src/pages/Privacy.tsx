import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors cursor-pointer">
              <Music className="h-6 w-6" />
              <span className="text-xl font-bold">Music Discovery</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                <p className="text-white/70 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Your Privacy is Protected
              </h3>
              <p className="text-white/90 leading-relaxed">
                <strong>We never share or sell your personal identifying information (PII) to any companies.</strong> The only exception is compliance with government warrants signed by a federal judge, as required by law.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-white/80 leading-relaxed mb-3">
                We collect information to provide and improve our service:
              </p>
              
              <h3 className="text-xl font-medium mb-2 text-purple-300">Account Information</h3>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4 mb-3">
                <li>Name and email address (from OAuth providers)</li>
                <li>Login method (Manus OAuth)</li>
                <li>Account creation and last sign-in timestamps</li>
              </ul>

              <h3 className="text-xl font-medium mb-2 text-purple-300">Usage Data</h3>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4 mb-3">
                <li>Playlists you create and songs you search for</li>
                <li>Music service preferences (Spotify or iTunes)</li>
                <li>Playlist visibility settings (public or private)</li>
                <li>Export history and timestamps</li>
              </ul>

              <h3 className="text-xl font-medium mb-2 text-purple-300">Third-Party Integration Data</h3>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Spotify OAuth tokens (encrypted and stored securely)</li>
                <li>Spotify user profile information</li>
                <li>Song metadata from Spotify and iTunes APIs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-white/80 leading-relaxed mb-2">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Provide and maintain the Music Discovery service</li>
                <li>Generate personalized playlist recommendations</li>
                <li>Connect to your Spotify account for playlist export</li>
                <li>Display your public playlists in the community discovery section</li>
                <li>Improve our recommendation algorithms</li>
                <li>Communicate with you about service updates</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
              <p className="text-white/80 leading-relaxed mb-3">
                <strong className="text-green-300">We do not sell or share your personal identifying information with third parties for marketing purposes.</strong>
              </p>
              
              <p className="text-white/80 leading-relaxed mb-2">
                We may share information only in the following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li><strong>With Your Consent:</strong> When you choose to make playlists public or export to Spotify</li>
                <li><strong>Service Providers:</strong> With third-party APIs (Spotify, iTunes) necessary to provide our service</li>
                <li><strong>Legal Requirements:</strong> When required by law or in response to valid government warrants signed by a federal judge</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-white/80 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption of sensitive data like OAuth tokens, secure database storage, HTTPS connections, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Your Privacy Rights</h2>
              <p className="text-white/80 leading-relaxed mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Control:</strong> Change playlist visibility settings (public/private)</li>
                <li><strong>Disconnect:</strong> Revoke Spotify OAuth access at any time</li>
                <li><strong>Export:</strong> Download your playlists and data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Cookies and Tracking</h2>
              <p className="text-white/80 leading-relaxed">
                We use essential cookies to maintain your login session and remember your preferences. We do not use third-party advertising cookies or tracking pixels. You can disable cookies in your browser settings, but this may affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Third-Party Services</h2>
              <p className="text-white/80 leading-relaxed">
                Music Discovery integrates with Spotify and iTunes APIs. When you use these integrations, you are also subject to their privacy policies. We recommend reviewing Spotify's Privacy Policy and Apple's Privacy Policy to understand how they handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed">
                Music Discovery is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Data Retention</h2>
              <p className="text-white/80 leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account at any time, after which we will delete your personal data within 30 days, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. International Data Transfers</h2>
              <p className="text-white/80 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Changes to This Policy</h2>
              <p className="text-white/80 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on the platform or sending an email. Your continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-white/80 leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us through the platform. We will respond to your request within 30 days.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
