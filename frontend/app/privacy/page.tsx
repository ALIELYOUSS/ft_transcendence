import { LegalPage } from "@/components/legal/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what WeMeet collects, why we use it, and the choices you have when using our service."
      sections={[
        {
          title: "Information we collect",
          paragraphs: [
            "We collect the information you provide when you create an account, such as your name, email address, and password. We also collect profile details, invitations, availability, and messages you choose to add to the service.",
            "We receive basic technical information, such as device and browser details, log data, and approximate usage activity, to keep WeMeet secure and reliable.",
          ],
        },
        {
          title: "How we use information",
          paragraphs: [
            "We use your information to provide and personalize WeMeet, coordinate plans with the people you invite, respond to support requests, and detect abuse or security issues.",
            "We do not sell your personal information. We share it only with service providers that help us operate WeMeet, when required by law, or when you direct us to share it.",
          ],
        },
        {
          title: "Your choices and retention",
          paragraphs: [
            "You can review or update account information through the service. You may ask us to delete your account and personal information by contacting support, subject to information we must retain for legal or security reasons.",
            "We keep information only for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our agreements.",
          ],
        },
      ]}
    />
  );
}
