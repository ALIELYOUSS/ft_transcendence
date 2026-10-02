import { LegalPage } from "@/components/legal/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="By using WeMeet, you agree to these short, plain-language rules for using the service responsibly."
      sections={[
        {
          title: "Using WeMeet",
          paragraphs: [
            "You must provide accurate account information, keep your login details secure, and be old enough to use WeMeet under the laws that apply to you.",
            "You are responsible for activity under your account and for making sure invitations, plans, and messages you send are appropriate for their recipients.",
          ],
        },
        {
          title: "Respectful behavior",
          paragraphs: [
            "Do not use WeMeet to harass, threaten, impersonate, defraud, or harm another person. Do not upload unlawful, harmful, or infringing content, attempt to access another account, or interfere with the service.",
            "We may remove content or suspend accounts that violate these terms, create risk for other users, or misuse the service. We will act in accordance with applicable law.",
          ],
        },
        {
          title: "The service",
          paragraphs: [
            "WeMeet is provided as available. We may improve, change, pause, or discontinue features, and we will take reasonable steps to communicate significant changes when appropriate.",
            "To the extent permitted by law, WeMeet is not responsible for losses caused by events outside our reasonable control or by interactions between users. These terms are governed by the laws applicable where WeMeet operates.",
          ],
        },
      ]}
    />
  );
}
