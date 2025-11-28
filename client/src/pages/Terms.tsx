import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-white/70 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using Music Discovery, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-white/80 leading-relaxed">
                Music Discovery provides a platform for users to discover new music by inputting their favorite songs and receiving AI-powered playlist recommendations. The service integrates with Spotify and iTunes APIs to search for songs and generate personalized playlists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-white/80 leading-relaxed mb-2">
                To use certain features of the service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
              <p className="text-white/80 leading-relaxed">
                Music Discovery integrates with third-party services including Spotify and iTunes. Your use of these services through our platform is subject to their respective terms of service and privacy policies. We are not responsible for the content, accuracy, or availability of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. User Content and Playlists</h2>
              <p className="text-white/80 leading-relaxed mb-2">
                When you create and share playlists on Music Discovery:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>You retain ownership of your playlists and content</li>
                <li>You grant us a license to display and share your public playlists</li>
                <li>You are responsible for the content you share</li>
                <li>You must not share content that violates copyright or other rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Prohibited Conduct</h2>
              <p className="text-white/80 leading-relaxed mb-2">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Abuse, harass, or harm other users</li>
                <li>Use automated systems to access the service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-white/80 leading-relaxed">
                The Music Discovery platform, including its design, code, and features, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our platform without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
              <p className="text-white/80 leading-relaxed">
                Music Discovery is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for the accuracy of music recommendations or third-party data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed">
                To the maximum extent permitted by law, Music Discovery shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes by posting a notice on the platform. Your continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Termination</h2>
              <p className="text-white/80 leading-relaxed">
                We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users or the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                If you have questions about these Terms of Service, please contact us through the platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
